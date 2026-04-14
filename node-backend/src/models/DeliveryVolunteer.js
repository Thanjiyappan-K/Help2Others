const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryVolunteer = sequelize.define('DeliveryVolunteer', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'volunteer_id'
  },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  lat: { type: DataTypes.DOUBLE },
  lng: { type: DataTypes.DOUBLE },
  vehicleType: { type: DataTypes.STRING },
  vehicleNumber: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'delivery_volunteers',
  timestamps: true,
  updatedAt: false
});

module.exports = DeliveryVolunteer;
