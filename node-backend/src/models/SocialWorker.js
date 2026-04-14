const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialWorker = sequelize.define('SocialWorker', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'social_worker_id'
  },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  lat: { type: DataTypes.DOUBLE },
  lng: { type: DataTypes.DOUBLE },
  password: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'social_workers',
  timestamps: true,
  updatedAt: false
});

module.exports = SocialWorker;
