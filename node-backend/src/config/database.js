// src/config/database.js
// Equivalent to Spring Boot's DataSource + JPA configuration
// Replaces: application.properties datasource settings

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'food_donation_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'thanji830',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      // Equivalent to spring.jpa.hibernate.ddl-auto=update
      // (we'll call sync({ alter: true }) in server.js)
      underscored: false,
      timestamps: false
    }
  }
);

module.exports = sequelize;
