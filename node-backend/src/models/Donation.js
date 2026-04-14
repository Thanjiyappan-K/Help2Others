// src/models/Donation.js
// Equivalent to: entity/Donation.java
// Table: donations1  |  @ManyToOne -> Beneficiary

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'donation_id'
  },
  foodType: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.INTEGER },
  unit: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },

  // LocalDateTime fields mapped as DATE
  expiryDatetime: { type: DataTypes.DATE },
  pickupStartDatetime: { type: DataTypes.DATE },
  pickupEndDatetime: { type: DataTypes.DATE },

  isRecurring: { type: DataTypes.BOOLEAN, defaultValue: false },
  recurringFrequency: { type: DataTypes.STRING },

  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  zipCode: { type: DataTypes.STRING },
  lat: { type: DataTypes.DOUBLE },
  lng: { type: DataTypes.DOUBLE },
  donorRef: { type: DataTypes.STRING(64), field: 'donor_ref' },
  specialInstructions: { type: DataTypes.TEXT },

  status: { type: DataTypes.STRING, defaultValue: 'pending' },

  // FK: beneficiary_id (set up in associations below)
  beneficiary_id: { type: DataTypes.BIGINT },

  verifiedBy: { type: DataTypes.BIGINT },
  deliveredBy: { type: DataTypes.BIGINT }

}, {
  tableName: 'donations1',
  timestamps: true,    // Sequelize manages createdAt & updatedAt
  updatedAt: false     // only track createdAt, not updatedAt
});

module.exports = Donation;
