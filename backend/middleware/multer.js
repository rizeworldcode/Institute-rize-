const multer = require('multer');
const AppError = require('../src/utils/AppError');
const path = require('path');
const fs = require('fs');

// First check if Cloudinary is configured
const cloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME.trim() !== '' && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY.trim() !== '' && 
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET.trim() !== '';

let storage;

if (cloudinaryConfigured) {
  // Use Cloudinary storage if configured
  console.log("✅ Using Cloudinary storage for file uploads");
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'rizeworld',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Limit size
    },
  });
} else {
  // Use local disk storage if Cloudinary isn't configured
  console.log("⚠️ Cloudinary not configured! Using local disk storage for file uploads");
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📁 Created uploads directory at:", uploadsDir);
  }
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename to avoid collisions
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type! Please upload only images or PDFs.', 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
