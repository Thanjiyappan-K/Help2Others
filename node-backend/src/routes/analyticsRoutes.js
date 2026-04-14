const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/analytics/donations-by-status', analyticsController.getDonationsByStatus);
router.get('/analytics/donations-by-district', analyticsController.getDonationsByDistrict);
router.get('/analytics/volunteers-by-district', analyticsController.getVolunteersByDistrict);

module.exports = router;
