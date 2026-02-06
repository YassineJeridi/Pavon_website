// backend/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️  Warning: Missing Cloudinary configuration: ${missingVars.join(', ')}`
    );
    console.warn('⚠️  Image upload will not work properly');
    return false;
  }

  console.log('✅ Cloudinary configuration loaded');
  return true;
};

// Storage configuration for different upload types
const createStorage = (folder, allowedFormats = ['jpg', 'jpeg', 'png', 'webp']) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `elegance/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    },
  });
};

// Create storage for different upload types
const productStorage = createStorage('products');
const bannerStorage = createStorage('banners');
const categoryStorage = createStorage('categories');
const collectionStorage = createStorage('collections');

// File filter for image uploads
const imageFileFilter = (req, file, cb) => {
  // Allowed mime types
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
        'Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed.'
      ),
      false
    );
  }
};

// Multer upload configurations
const productUpload = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const bannerUpload = multer({
  storage: bannerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for banners
  },
});

const categoryUpload = multer({
  storage: categoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const collectionUpload = multer({
  storage: collectionStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Delete multiple images from Cloudinary
const deleteImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
};

// Get image public ID from URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    
    // Find the folder path (elegance/products, elegance/banners, etc.)
    const folderIndex = parts.indexOf('elegance');
    if (folderIndex !== -1) {
      const folder = parts.slice(folderIndex, -1).join('/');
      return `${folder}/${publicId}`;
    }
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

// Upload image from buffer (for advanced use cases)
const uploadFromBuffer = async (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `elegance/${folder}`,
          public_id: filename,
          transformation: [
            { width: 1920, height: 1920, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

module.exports = {
  cloudinary,
  validateCloudinaryConfig,
  productUpload,
  bannerUpload,
  categoryUpload,
  collectionUpload,
  deleteImage,
  deleteImages,
  getPublicIdFromUrl,
  uploadFromBuffer,
};
