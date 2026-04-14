// src/services/fileStorageService.js
// Equivalent to FileStorageService.java using multer

const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique name: timestamp + extension
    const originalFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const extension = path.extname(originalFileName);
    const fileName = Date.now() + extension;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Validate Image Type (Mimetype check)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // Default 10MB
  }
});

module.exports = upload;
