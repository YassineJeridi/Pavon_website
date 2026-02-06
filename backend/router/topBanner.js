// backend/router/topBanner.js
const express = require('express');
const router = express.Router();
const {
  getActiveBanner,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleActive,
} = require('../controllers/topBannerController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/active', getActiveBanner);

// Protected routes (Admin only)
router.get('/', protect, getAllBanners);
router.post('/', protect, createBanner);
router.put('/:id', protect, updateBanner);
router.delete('/:id', protect, deleteBanner);
router.patch('/:id/toggle', protect, toggleActive);

module.exports = router;
