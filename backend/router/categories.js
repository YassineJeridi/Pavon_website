// backend/router/categories.js

const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');
const { uploadCategoryImage } = require('../config/multer');

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', validateMongoId, getCategoryById);

// Protected routes (Admin only)
router.post('/', protect, uploadCategoryImage, createCategory);
router.put('/:id', protect, uploadCategoryImage, updateCategory);
router.delete('/:id', protect, validateMongoId, deleteCategory);
router.post('/upload', protect, uploadCategoryImage, uploadImage);

module.exports = router;
