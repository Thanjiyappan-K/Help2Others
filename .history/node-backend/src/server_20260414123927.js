// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { sequelize } = require('./models');
const socketHub = require('./utils/socketHub');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const socialWorkerRoutes = require('./routes/socialWorkerRoutes');
const deliveryVolunteerRoutes = require('./routes/deliveryVolunteerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://help2others.onrender.com',
  'https://help2-others.vercel.app',
  // 'http://localhost:8080', // local development only
];

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
});
app.set('io', io);
socketHub.setIo(io);

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socket.on('subscribe', (payload = {}) => {
    const { district, donationIds, volunteerId } = payload;
    if (district) socket.join(`district:${district}`);
    if (Array.isArray(donationIds)) {
      donationIds.filter(Boolean).forEach((id) => socket.join(`donation:${id}`));
    }
    if (volunteerId != null && volunteerId !== '') socket.join(`volunteer:${volunteerId}`);
  });
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Middleware (Replaces @CrossOrigin)
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (Replaces WebConfig ResourceHandlerRegistry)
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Register API Routes
app.use('/api', beneficiaryRoutes);
app.use('/api', donationRoutes);
app.use('/api', socialWorkerRoutes);
app.use('/api', deliveryVolunteerRoutes);
app.use('/api', analyticsRoutes);

const PORT = process.env.PORT || 8080;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models with database (Equivalent to spring.jpa.hibernate.ddl-auto=update)
    // Note: alter: true updates table definitions if they've changed, safely.
    await sequelize.sync({ alter: true });
    console.log('Database schemas synchronized.');
    
    // Initialize required cron jobs after DB connection
    const expiryJob = require('./jobs/expiryJob');
    expiryJob.start();
    console.log('⏱️ Background expiry job scheduled.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
