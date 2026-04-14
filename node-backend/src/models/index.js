// src/models/index.js
const sequelize = require('../config/database');
const Donation = require('./Donation');
const Beneficiary = require('./Beneficiary');
const RecurringSchedule = require('./RecurringSchedule');
const SocialWorker = require('./SocialWorker');
const DeliveryVolunteer = require('./DeliveryVolunteer');
const DonationStatusLog = require('./DonationStatusLog');

// Set up associations
Beneficiary.hasMany(Donation, { foreignKey: 'beneficiary_id', as: 'donations' });
Donation.belongsTo(Beneficiary, { foreignKey: 'beneficiary_id', as: 'beneficiary' });

SocialWorker.hasMany(Donation, { foreignKey: 'verifiedBy', as: 'verifiedDonations' });
Donation.belongsTo(SocialWorker, { foreignKey: 'verifiedBy', as: 'verifier' });

DeliveryVolunteer.hasMany(Donation, { foreignKey: 'deliveredBy', as: 'deliveries' });
Donation.belongsTo(DeliveryVolunteer, { foreignKey: 'deliveredBy', as: 'deliverer' });

Donation.hasMany(DonationStatusLog, { foreignKey: 'donation_id', as: 'statusLogs' });
DonationStatusLog.belongsTo(Donation, { foreignKey: 'donation_id', as: 'donation' });

module.exports = {
  sequelize,
  Donation,
  Beneficiary,
  RecurringSchedule,
  SocialWorker,
  DeliveryVolunteer,
  DonationStatusLog
};
