// src/routes/donationRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const upload = require('../services/fileStorageService');
const donationController = require('../controllers/donationController');

const router = express.Router();

// Validation mimicking DonationRequestDTO annotations
const validateDonation = [
  body('foodType').notEmpty().withMessage('Food type is required'),
  body('quantity').notEmpty().withMessage('Quantity is required').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required')
];

// Validation middleware wrapper
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({ success: false, message: `Validation failed: ${errorString}` });
  }
  next();
};

router.post('/donations', upload.single('image'), validateDonation, checkValidation, donationController.createDonation);
router.get('/donations', donationController.getDonations);
router.get('/donations/nearby', donationController.getDonationsNearby);
router.get('/donors', donationController.getDonorsByDistrict);
router.post('/notify-social-worker', donationController.notifySocialWorker);
router.post('/donations/:donationId/claim', donationController.claimDonation);
router.patch('/donations/:donationId/status', donationController.updateDonationStatus);
router.get('/donations/:donationId/logs', donationController.getDonationLogs);

module.exports = router;
