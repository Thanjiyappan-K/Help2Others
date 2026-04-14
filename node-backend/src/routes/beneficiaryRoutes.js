// src/routes/beneficiaryRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const beneficiaryService = require('../services/beneficiaryService');
const geoController = require('../controllers/geoController');

const router = express.Router();

// Validation mimicking BeneficiaryRequestDTO annotations
const validateBeneficiary = [
  body('organizationName').notEmpty().withMessage('Organization name is required'),
  body('organizationType').notEmpty().withMessage('Organization type is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format'),
  body('totalCapacity').notEmpty().withMessage('Total capacity is required').isInt({ min: 1 }).withMessage('Total capacity must be at least 1'),
  body('currentOccupancy').notEmpty().withMessage('Current occupancy is required').isInt({ min: 0 }).withMessage('Occupancy cannot be negative')
];

router.post('/beneficiaries', validateBeneficiary, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({ success: false, message: `Validation failed: ${errorString}` });
  }

  try {
    const savedBeneficiary = await beneficiaryService.createBeneficiary(req.body);
    return res.status(201).json({
      success: true,
      beneficiaryId: savedBeneficiary.id,
      message: 'Beneficiary registered successfully!'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to register beneficiary', error: error.message });
  }
});

router.get('/beneficiaries/nearby', geoController.getBeneficiariesNearby);

router.get('/beneficiaries', async (req, res) => {
  try {
    const { Beneficiary } = require('../models');
    const where = {};
    if (req.query.district) where.district = req.query.district;
    if (req.query.isApproved !== undefined) where.isApproved = req.query.isApproved === 'true';
    const beneficiaries = await Beneficiary.findAll({ where });
    return res.status(200).json({ success: true, count: beneficiaries.length, beneficiaries });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/beneficiaries/:id/approve', async (req, res) => {
  try {
    const { Beneficiary } = require('../models');
    const beneficiary = await Beneficiary.findByPk(req.params.id);
    if (!beneficiary) return res.status(404).json({ success: false, message: 'Not found' });
    beneficiary.isApproved = true;
    beneficiary.isActive = true;
    await beneficiary.save();
    return res.status(200).json({ success: true, message: 'Beneficiary approved' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
