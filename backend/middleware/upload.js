// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File filter for images only
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Type de fichier invalide. Seuls JPEG, JPG, PNG et WEBP sont autorisés.'
      ),
      false
    );
  }
};

// Local disk storage for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const productDir = path.join(uploadsDir, 'products');
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    cb(null, productDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Local disk storage for banners
const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const bannerDir = path.join(uploadsDir, 'banners');
    if (!fs.existsSync(bannerDir)) {
      fs.mkdirSync(bannerDir, { recursive: true });
    }
    cb(null, bannerDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Local disk storage for categories
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const categoryDir = path.join(uploadsDir, 'categories');
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    cb(null, categoryDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Local disk storage for collections
const collectionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const collectionDir = path.join(uploadsDir, 'collections');
    if (!fs.existsSync(collectionDir)) {
      fs.mkdirSync(collectionDir, { recursive: true });
    }
    cb(null, collectionDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Local disk storage for testimonials
const testimonialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const testimonialDir = path.join(uploadsDir, 'testimonials');
    if (!fs.existsSync(testimonialDir)) {
      fs.mkdirSync(testimonialDir, { recursive: true });
    }
    cb(null, testimonialDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer configuration for products (multiple images)
const uploadProductImages = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Max 10 images
  },
}).array('images', 10);

// Multer configuration for single product image
const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

// Multer configuration for banners
const uploadBannerImage = multer({
  storage: bannerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for banners
  },
}).single('image');

// Multer configuration for categories
const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

// Multer configuration for collections
const uploadCollectionImage = multer({
  storage: collectionStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

// Multer configuration for testimonials
const uploadTestimonialImage = multer({
  storage: testimonialStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('avatar');

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'Erreur lors du téléchargement';

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'Fichier trop volumineux. Taille maximale: 10MB';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Trop de fichiers. Maximum 10 images';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Champ de fichier inattendu';
        break;
      default:
        message = err.message;
    }

    console.error('❌ Multer error:', err.code, err.message);
    return res.status(400).json({
      success: false,
      message,
      error: err.code,
    });
  } else if (err) {
    console.error('❌ Upload error:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors du téléchargement',
      error: err.message,
    });
  }

  next();
};

// Wrapper to handle multer errors
const wrapMulter = (multerMiddleware) => {
  return (req, res, next) => {
    console.log('📤 Upload middleware started');
    multerMiddleware(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      console.log('✅ Upload successful:', req.files ? req.files.length : (req.file ? 1 : 0), 'files');
      next();
    });
  };
};

module.exports = {
  uploadProductImages: wrapMulter(uploadProductImages),
  uploadProductImage: wrapMulter(uploadProductImage),
  uploadBannerImage: wrapMulter(uploadBannerImage),
  uploadCategoryImage: wrapMulter(uploadCategoryImage),
  uploadCollectionImage: wrapMulter(uploadCollectionImage),
  uploadTestimonialImage: wrapMulter(uploadTestimonialImage),
  handleMulterError,
};
