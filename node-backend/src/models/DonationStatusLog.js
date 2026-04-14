const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonationStatusLog = sequelize.define('DonationStatusLog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'log_id'
  },
  // the field is technically donation_id to match FK later
  donation_id: { type: DataTypes.BIGINT, allowNull: false },
  previous_status: { type: DataTypes.STRING },
  new_status: { type: DataTypes.STRING, allowNull: false },
  changedBy: { type: DataTypes.STRING }, // holds "System", "SocialWorker 123", "Volunteer 456"
  remarks: { type: DataTypes.TEXT }
}, {
  tableName: 'donation_status_logs',
  timestamps: true,
  updatedAt: false // Only createdAt is needed for a log
});

module.exports = DonationStatusLog;
