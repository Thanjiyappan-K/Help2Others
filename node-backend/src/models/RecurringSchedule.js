// src/models/RecurringSchedule.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecurringSchedule = sequelize.define('RecurringSchedule', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  donationId: { type: DataTypes.BIGINT },
  nextOccurrenceDate: { type: DataTypes.DATEONLY }
}, {
  tableName: 'recurring_schedules',
  timestamps: false
});

module.exports = RecurringSchedule;
