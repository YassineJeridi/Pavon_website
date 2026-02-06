// backend/router/testimonials.js

const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleFeatured,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { validateTestimonial, validateMongoId, validatePagination } = require('../middleware/validation');
const { uploadTestimonialAvatar } = require('../config/multer');

// Public routes
router.get('/', validatePagination, getAllTestimonials);
router.get('/featured', getFeaturedTestimonials);

// Protected routes (Admin only)
router.get('/:id', protect, validateMongoId, getTestimonialById);
router.post('/', protect, uploadTestimonialAvatar, createTestimonial);
router.put('/:id', protect, validateMongoId, uploadTestimonialAvatar, updateTestimonial);
router.delete('/:id', protect, validateMongoId, deleteTestimonial);
router.patch('/:id/featured', protect, validateMongoId, toggleFeatured);

module.exports = router;
