// src/models/Beneficiary.js
// Equivalent to: entity/Beneficiary.java
// Embedded objects (Coordinates, MealTypes, DietaryRestrictions) are
// stored as flat columns — same as JPA @Embedded behaviour.
// Table: beneficiaries

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Beneficiary = sequelize.define('Beneficiary', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'beneficiary_id'
  },

  // ------ Organization info ------
  organizationName:   { type: DataTypes.STRING },
  organizationType:   { type: DataTypes.STRING },
  registrationNumber: { type: DataTypes.STRING },
  establishedYear:    { type: DataTypes.INTEGER },

  // ------ Location ------
  state:    { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  address:  { type: DataTypes.STRING },
  pincode:  { type: DataTypes.STRING },

  // ------ @Embedded Coordinates (two flat columns) ------
  lat: { type: DataTypes.DOUBLE },
  lng: { type: DataTypes.DOUBLE },

  // ------ Contact ------
  contactPerson: { type: DataTypes.STRING },
  phoneNumber:   { type: DataTypes.STRING },
  email:         { type: DataTypes.STRING },

  // ------ Capacity counts ------
  totalCapacity:    { type: DataTypes.INTEGER },
  currentOccupancy: { type: DataTypes.INTEGER },
  maleCount:        { type: DataTypes.INTEGER },
  femaleCount:      { type: DataTypes.INTEGER },
  childrenCount:    { type: DataTypes.INTEGER },
  elderlyCount:     { type: DataTypes.INTEGER },
  specialNeedsCount:{ type: DataTypes.INTEGER },

  // ------ @Embedded MealTypes ------
  breakfast: { type: DataTypes.BOOLEAN, defaultValue: false },
  lunch:     { type: DataTypes.BOOLEAN, defaultValue: false },
  dinner:    { type: DataTypes.BOOLEAN, defaultValue: false },
  snacks:    { type: DataTypes.BOOLEAN, defaultValue: false },

  // ------ @Embedded DietaryRestrictions ------
  vegetarian:        { type: DataTypes.BOOLEAN, defaultValue: false },
  vegan:             { type: DataTypes.BOOLEAN, defaultValue: false },
  glutenFree:        { type: DataTypes.BOOLEAN, defaultValue: false },
  nutFree:           { type: DataTypes.BOOLEAN, defaultValue: false },
  diabetic:          { type: DataTypes.BOOLEAN, defaultValue: false },
  otherRestrictions: { type: DataTypes.STRING },

  // ------ Summary fields ------
  frequencyOfSupply: { type: DataTypes.STRING },
  priorityLevel:     { type: DataTypes.STRING },
  additionalNotes:   { type: DataTypes.TEXT },
  isActive:          { type: DataTypes.BOOLEAN, defaultValue: true },
  isApproved:        { type: DataTypes.BOOLEAN, defaultValue: false },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'beneficiaries',
  timestamps: false
});

module.exports = Beneficiary;
