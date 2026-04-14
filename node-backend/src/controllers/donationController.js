// src/controllers/donationController.js
const { Op } = require('sequelize');
const { Donation, SocialWorker, DonationStatusLog, Beneficiary, sequelize } = require('../models');
const donationService = require('../services/donationService');
const { serializeDonation } = require('../utils/serializers');
const { emitDonationUpdate } = require('../utils/socketEmit');

const VALID_STATUSES = [
  'pending', 'verified', 'assigned', 'picked_up', 'delivered', 'closed', 'rejected', 'expired',
];

function donationDistanceKmLiteral(searchLat, searchLng) {
  const t = '`donations1`';
  return sequelize.literal(`(
    6371 * acos(
      least(1, greatest(-1,
        cos(radians(${searchLat})) * cos(radians(${t}.\`lat\`)) *
        cos(radians(${t}.\`lng\`) - radians(${searchLng})) +
        sin(radians(${searchLat})) * sin(radians(${t}.\`lat\`))
      ))
    )
  )`);
}

exports.createDonation = async (req, res) => {
  try {
    const file = req.file;
    const donationId = await donationService.createDonation(req.body, file);
    const donation = await Donation.findByPk(donationId, {
      include: [{ model: Beneficiary, as: 'beneficiary', required: false }],
    });
    const district = donation.district || donation.city;
    emitDonationUpdate(req.app.get('io'), {
      donationId,
      oldStatus: null,
      newStatus: 'pending',
      changedBy: donation.donorRef || 'Donor',
      timestamp: new Date(),
      district,
      donorRef: donation.donorRef,
    });
    return res.status(201).json({
      success: true,
      donationId,
      donation: serializeDonation(donation),
      message: 'Donation created successfully!',
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return res.status(500).json({ success: false, message: 'Failed to create donation', error: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const {
      status,
      city,
      district,
      donorRef,
      deliveredBy,
      verifiedBy,
      unassigned,
      myVolunteerId,
    } = req.query;
    const where = {};

    if (status) where.status = status;
    if (city) where.city = city;
    if (donorRef) where.donorRef = donorRef;
    if (deliveredBy) where.deliveredBy = deliveredBy;
    if (verifiedBy) where.verifiedBy = verifiedBy;

    if (district) {
      where[Op.or] = [{ district }, { city: district }];
    }

    if (unassigned === 'true' || unassigned === '1') {
      where.deliveredBy = null;
    }

    if (myVolunteerId) {
      where.deliveredBy = myVolunteerId;
      where.status = { [Op.in]: ['assigned', 'picked_up'] };
    }

    const donations = await Donation.findAll({
      where,
      include: [{
        model: Beneficiary,
        as: 'beneficiary',
        required: false,
      }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      success: true,
      donations: donations.map(serializeDonation),
    });
  } catch (error) {
    console.error('Error getting donations:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDonationLogs = async (req, res) => {
  try {
    const logs = await DonationStatusLog.findAll({
      where: { donation_id: req.params.donationId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDonorsByDistrict = async (req, res) => {
  const district = req.query.district;
  if (!district) {
    return res.status(400).json({ success: false, message: 'District is required' });
  }

  try {
    const where = {
      [Op.or]: [{ district }, { city: district }],
    };
    if (req.query.status) where.status = req.query.status;

    const donors = await Donation.findAll({
      where,
      include: [{ model: Beneficiary, as: 'beneficiary', required: false }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      success: true,
      donors: donors.map(serializeDonation),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDonationsNearby = async (req, res) => {
  const lat = parseFloat(req.query.lat, 10);
  const lng = parseFloat(req.query.lng, 10);
  const radiusKm = parseFloat(req.query.radiusKm || req.query.radius || '15', 10);
  const status = req.query.status || 'pending';

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ success: false, message: 'Valid lat and lng are required' });
  }

  try {
    const dist = donationDistanceKmLiteral(lat, lng);
    const donations = await Donation.findAll({
      attributes: {
        include: [[dist, 'distance_km']],
      },
      where: {
        status,
        lat: { [Op.ne]: null },
        lng: { [Op.ne]: null },
        [Op.and]: sequelize.literal(`(
          6371 * acos(
            least(1, greatest(-1,
              cos(radians(${lat})) * cos(radians(\`donations1\`.\`lat\`)) *
              cos(radians(\`donations1\`.\`lng\`) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(\`donations1\`.\`lat\`))
            ))
          )
        ) <= ${radiusKm}`),
      },
      include: [{ model: Beneficiary, as: 'beneficiary', required: false }],
      order: sequelize.literal('distance_km ASC'),
      limit: Math.min(parseInt(req.query.limit, 10) || 30, 100),
    });

    return res.status(200).json({
      success: true,
      donations: donations.map((d) => {
        const row = serializeDonation(d);
        const plain = d.get({ plain: true });
        row.distance_km = plain.distance_km != null ? Number(plain.distance_km.toFixed(2)) : null;
        return row;
      }),
    });
  } catch (error) {
    console.error('getDonationsNearby:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.notifySocialWorker = async (req, res) => {
  const { district, donationId } = req.body;
  if (!district) {
    return res.status(400).json({ success: false, message: 'District is required' });
  }

  try {
    let workers = await SocialWorker.findAll({
      where: { district, isApproved: true, isActive: true },
    });

    if (workers.length === 0) {
      workers = await SocialWorker.findAll({ where: { district } });
    }

    if (workers.length === 0) {
      return res.status(404).json({ success: false, message: 'No registered social worker found in this district' });
    }

    let worker = workers[0];
    if (donationId && workers.length > 1) {
      const donation = await Donation.findByPk(donationId);
      if (donation?.lat != null && donation?.lng != null) {
        let best = null;
        let bestD = Infinity;
        for (const w of workers) {
          if (w.lat == null || w.lng == null) continue;
          const R = 6371;
          const dLat = ((w.lat - donation.lat) * Math.PI) / 180;
          const dLng = ((w.lng - donation.lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((donation.lat * Math.PI) / 180) *
              Math.cos((w.lat * Math.PI) / 180) *
              Math.sin(dLng / 2) ** 2;
          const d = 2 * R * Math.asin(Math.sqrt(Math.min(1, a)));
          if (d < bestD) {
            bestD = d;
            best = w;
          }
        }
        if (best) worker = best;
      }
    }

    const wJson = worker.get({ plain: true });
    delete wJson.password;

    return res.status(200).json({
      success: true,
      socialWorker: wJson,
      message: 'Notification sent and accepted',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.claimDonation = async (req, res) => {
  const donationId = parseInt(req.params.donationId, 10);
  const { volunteerId } = req.body;
  if (!volunteerId) {
    return res.status(400).json({ success: false, error: 'volunteerId is required' });
  }

  try {
    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    if (donation.status !== 'verified') {
      return res.status(400).json({ success: false, error: 'Only verified donations can be claimed' });
    }
    if (donation.deliveredBy) {
      return res.status(400).json({ success: false, error: 'Already assigned to another volunteer' });
    }

    const prev = donation.status;
    donation.status = 'assigned';
    donation.deliveredBy = volunteerId;
    await donation.save();

    await DonationStatusLog.create({
      donation_id: donationId,
      previous_status: prev,
      new_status: 'assigned',
      changedBy: `Volunteer ${volunteerId}`,
      remarks: 'Volunteer claimed delivery',
    });

    const district = donation.district || donation.city;
    emitDonationUpdate(req.app.get('io'), {
      donationId,
      oldStatus: prev,
      newStatus: 'assigned',
      changedBy: `Volunteer ${volunteerId}`,
      volunteerId,
      timestamp: new Date(),
      district,
      donorRef: donation.donorRef,
    });

    const full = await Donation.findByPk(donationId, {
      include: [{ model: Beneficiary, as: 'beneficiary', required: false }],
    });
    return res.status(200).json({
      success: true,
      message: 'Donation claimed',
      donation: serializeDonation(full),
    });
  } catch (error) {
    console.error('claimDonation:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDonationStatus = async (req, res) => {
  const donationId = parseInt(req.params.donationId, 10);
  const { status, socialWorkerId, volunteerId, beneficiaryId, remarks } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  try {
    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const currentStatus = donation.status;
    const changedBy =
      socialWorkerId != null
        ? `SocialWorker ${socialWorkerId}`
        : volunteerId != null
          ? `Volunteer ${volunteerId}`
          : 'System';

    if (currentStatus === 'closed' || currentStatus === 'rejected' || currentStatus === 'expired') {
      return res.status(400).json({ error: 'Donation is in a terminal state.' });
    }

    if (status === 'verified') {
      if (currentStatus !== 'pending') {
        return res.status(400).json({ error: "Only 'pending' donations can be 'verified'." });
      }
      if (socialWorkerId == null) {
        return res.status(400).json({ error: 'socialWorkerId is required to verify food.' });
      }
      if (beneficiaryId == null) {
        return res.status(400).json({ error: 'beneficiaryId is required to route food.' });
      }
      donation.verifiedBy = socialWorkerId;
      donation.beneficiary_id = beneficiaryId;
    } else if (status === 'assigned') {
      if (currentStatus !== 'verified') {
        return res.status(400).json({ error: "Only 'verified' donations can be 'assigned'." });
      }
      if (volunteerId == null) {
        return res.status(400).json({ error: 'volunteerId is required to assign to volunteer.' });
      }
      donation.deliveredBy = volunteerId;
    } else if (status === 'picked_up') {
      if (currentStatus !== 'assigned') {
        return res.status(400).json({ error: "Only 'assigned' donations can be 'picked_up'." });
      }
    } else if (status === 'delivered') {
      if (currentStatus !== 'picked_up' && currentStatus !== 'assigned') {
        return res.status(400).json({ error: "Donation must be 'assigned' or 'picked_up' to be marked as 'delivered'." });
      }
    } else if (status === 'closed') {
      if (currentStatus !== 'delivered') {
        return res.status(400).json({ error: "Donation must be 'delivered' to be 'closed'." });
      }
    } else if (status === 'rejected') {
      if (currentStatus !== 'pending') {
        return res.status(400).json({ error: "Only 'pending' donations can be 'rejected'." });
      }
    } else if (status === 'expired') {
      return res.status(400).json({ error: 'Expired status is set by the system only.' });
    }

    donation.status = status;
    await donation.save();

    await DonationStatusLog.create({
      donation_id: donationId,
      previous_status: currentStatus,
      new_status: status,
      changedBy,
      remarks: remarks || null,
    });

    const district = donation.district || donation.city;
    emitDonationUpdate(req.app.get('io'), {
      donationId,
      oldStatus: currentStatus,
      newStatus: status,
      changedBy,
      volunteerId: donation.deliveredBy,
      timestamp: new Date(),
      district,
      donorRef: donation.donorRef,
    });

    const full = await Donation.findByPk(donationId, {
      include: [{ model: Beneficiary, as: 'beneficiary', required: false }],
    });
    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      donation: serializeDonation(full),
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
};
