const { Op } = require('sequelize');
const { Beneficiary, sequelize } = require('../models');
const { serializeBeneficiary } = require('../utils/serializers');

exports.getBeneficiariesNearby = async (req, res) => {
  const lat = parseFloat(req.query.lat, 10);
  const lng = parseFloat(req.query.lng, 10);
  const radiusKm = parseFloat(req.query.radiusKm || req.query.radius || '25', 10);
  const approvedOnly = req.query.approvedOnly !== 'false' && req.query.approvedOnly !== '0';

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ success: false, message: 'Valid lat and lng are required' });
  }

  try {
    const dist = sequelize.literal(`(
      6371 * acos(
        least(1, greatest(-1,
          cos(radians(${lat})) * cos(radians(\`beneficiaries\`.\`lat\`)) *
          cos(radians(\`beneficiaries\`.\`lng\`) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(\`beneficiaries\`.\`lat\`))
        ))
      )
    )`);

    const where = {
      lat: { [Op.ne]: null },
      lng: { [Op.ne]: null },
      isActive: true,
      [Op.and]: sequelize.literal(`(
        6371 * acos(
          least(1, greatest(-1,
            cos(radians(${lat})) * cos(radians(\`beneficiaries\`.\`lat\`)) *
            cos(radians(\`beneficiaries\`.\`lng\`) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(\`beneficiaries\`.\`lat\`))
          ))
        )
      ) <= ${radiusKm}`),
    };
    if (approvedOnly) where.isApproved = true;

    const rows = await Beneficiary.findAll({
      attributes: { include: [[dist, 'distance_km']] },
      where,
      order: sequelize.literal('distance_km ASC'),
      limit: Math.min(parseInt(req.query.limit, 10) || 40, 100),
    });

    return res.status(200).json({
      success: true,
      beneficiaries: rows.map((b) => {
        const row = serializeBeneficiary(b);
        const plain = b.get({ plain: true });
        row.distance_km = plain.distance_km != null ? Number(Number(plain.distance_km).toFixed(2)) : null;
        return row;
      }),
    });
  } catch (error) {
    console.error('getBeneficiariesNearby:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
