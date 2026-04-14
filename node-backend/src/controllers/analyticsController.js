const { Donation, DeliveryVolunteer, sequelize } = require('../models');

exports.getDonationsByStatus = async (req, res) => {
  try {
    const stats = await Donation.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('donation_id')), 'count'] // Note: primary key mapped as donation_id
      ],
      group: ['status']
    });
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDonationsByDistrict = async (req, res) => {
  try {
    const stats = await Donation.findAll({
      attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('donation_id')), 'count']
      ],
      group: ['city']
    });
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVolunteersByDistrict = async (req, res) => {
  try {
    const stats = await DeliveryVolunteer.findAll({
      attributes: [
        'district',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['district']
    });
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
