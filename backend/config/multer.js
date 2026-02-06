// backend/config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = {
  collections: path.join(__dirname, '../uploads/collections'),
  products: path.join(__dirname, '../uploads/products'),
  testimonials: path.join(__dirname, '../uploads/testimonials'),
  banners: path.join(__dirname, '../uploads/banners'),
  categories: path.join(__dirname, '../uploads/categories'),
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadType = 'products';
    if (req.baseUrl.includes('collections')) uploadType = 'collections';
    if (req.baseUrl.includes('testimonials')) uploadType = 'testimonials';
    if (req.baseUrl.includes('banners')) uploadType = 'banners';
    if (req.baseUrl.includes('categories')) uploadType = 'categories';
    cb(null, uploadDirs[uploadType]);
  },
  filename: (req, file, cb) => {
    const name = req.body.name || 'item';
    const sanitizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${sanitizedName}_${timestamp}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, PNG, WebP) sont autorisées'));
  }
};

// Export multer instances
exports.uploadCollectionImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).single('image');

exports.uploadProductImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter
}).array('images', 10);

exports.uploadTestimonialAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
}).single('avatar');

// Export configured multer for banner images
exports.uploadBannerImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
}).single('image');

// Export configured multer for category images
exports.uploadCategoryImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).single('image');

// Helper to delete file
exports.deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return false;
};
