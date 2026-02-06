// backend/router/banners.js

const express = require('express');
const router = express.Router();
const {
  getAllBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadImage,
  reorderBanners,
  incrementClicks,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');
const { uploadBannerImage } = require('../config/multer');

// Public routes
router.get('/active', getActiveBanners);
router.post('/:id/click', validateMongoId, incrementClicks);

// Protected routes (Admin only)
router.get('/', protect, getAllBanners);
router.get('/:id', protect, validateMongoId, getBannerById);
router.post('/', protect, uploadBannerImage, createBanner);
router.put('/:id', protect, validateMongoId, uploadBannerImage, updateBanner);
router.delete('/:id', protect, validateMongoId, deleteBanner);
router.post('/upload', protect, uploadBannerImage, uploadImage);
router.put('/reorder', protect, reorderBanners);

module.exports = router;
