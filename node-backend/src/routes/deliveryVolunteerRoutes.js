// src/routes/deliveryVolunteerRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { DeliveryVolunteer, sequelize } = require('../models');

const router = express.Router();

const validateDeliveryVolunteer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required')
];

router.post('/delivery-volunteers', validateDeliveryVolunteer, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({ success: false, message: `Validation failed: ${errorString}` });
  }

  try {
    // Demo Fallback: If Volunteer didn't capture exact GPS, map to the District center to avoid Haversine radius NULL rejections
    if (!req.body.lat || !req.body.lng) {
      const districtCoords = {
        'Chennai': { lat: 13.0827, lng: 80.2707 },
        'Coimbatore': { lat: 11.0168, lng: 76.9558 },
        'Madurai': { lat: 9.9252, lng: 78.1198 },
        'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
      };
      if (districtCoords[req.body.district]) {
        req.body.lat = districtCoords[req.body.district].lat;
        req.body.lng = districtCoords[req.body.district].lng;
      }
    }

    const volunteer = await DeliveryVolunteer.create(req.body);
    return res.status(201).json({ success: true, volunteerId: volunteer.id, message: 'Delivery volunteer registered successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to register delivery volunteer', error: error.message });
  }
});

router.get('/delivery-volunteers', async (req, res) => {
  try {
    const where = {};
    if (req.query.district) where.district = req.query.district;
    if (req.query.isApproved !== undefined) where.isApproved = req.query.isApproved === 'true';
    const volunteers = await DeliveryVolunteer.findAll({ where });
    return res.status(200).json({ success: true, count: volunteers.length, volunteers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/delivery-volunteers/:id/approve', async (req, res) => {
  try {
    const volunteer = await DeliveryVolunteer.findByPk(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Not found' });
    volunteer.isApproved = true;
    volunteer.isActive = true;
    await volunteer.save();
    return res.status(200).json({ success: true, message: 'Delivery volunteer approved' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/delivery-volunteers/nearest', async (req, res) => {
  const { lat, lng, radius } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
  }

  const searchLat = parseFloat(lat);
  const searchLng = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 10; // default 10 km

  const { sequelize } = require('../models');

  try {
    const volunteers = await DeliveryVolunteer.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              6371 * acos(
                cos(radians(${searchLat})) *
                cos(radians(lat)) *
                cos(radians(lng) - radians(${searchLng})) +
                sin(radians(${searchLat})) *
                sin(radians(lat))
              )
            )`),
            'distance'
          ]
        ]
      },
      where: sequelize.literal(`(
        6371 * acos(
          cos(radians(${searchLat})) *
          cos(radians(lat)) *
          cos(radians(lng) - radians(${searchLng})) +
          sin(radians(${searchLat})) *
          sin(radians(lat))
        )
      ) <= ${searchRadius}`),
      order: sequelize.literal('distance ASC'),
      limit: 20
    });

    return res.status(200).json({ success: true, count: volunteers.length, volunteers });
  } catch (error) {
    console.error('Error fetching nearest volunteers:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
