// src/routes/socialWorkerRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { SocialWorker } = require('../models');

const router = express.Router();

const validateSocialWorker = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('district').notEmpty().withMessage('District is required')
];

router.post('/social-workers', validateSocialWorker, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({ success: false, message: `Validation failed: ${errorString}` });
  }

  try {
    const worker = await SocialWorker.create(req.body);
    return res.status(201).json({ success: true, socialWorkerId: worker.id, message: 'Social worker registered successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to register social worker', error: error.message });
  }
});

router.get('/social-workers', async (req, res) => {
  try {
    const where = {};
    if (req.query.district) where.district = req.query.district;
    if (req.query.isApproved !== undefined) where.isApproved = req.query.isApproved === 'true';
    const workers = await SocialWorker.findAll({ where });
    return res.status(200).json({ success: true, count: workers.length, socialWorkers: workers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/social-workers/:id/approve', async (req, res) => {
  try {
    const worker = await SocialWorker.findByPk(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Not found' });
    worker.isApproved = true;
    worker.isActive = true;
    await worker.save();
    return res.status(200).json({ success: true, message: 'Social worker approved' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
