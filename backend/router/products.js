// backend/router/products.js

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getRecommendations,
  toggleBestseller,
  toggleFeatured,
  toggleActive,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { validateProduct, validateMongoId, validatePagination } = require('../middleware/validation');
const { uploadProductImages } = require('../middleware/upload');
const { searchLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', validatePagination, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/search', searchLimiter, searchProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', validateMongoId, getProductById);
router.get('/:id/recommendations', validateMongoId, getRecommendations);

// Protected routes (Admin only)
router.post('/', protect, uploadProductImages, createProduct);
router.put('/:id', protect, validateMongoId, uploadProductImages, updateProduct);
router.delete('/:id', protect, validateMongoId, deleteProduct);
router.patch('/:id/bestseller', protect, validateMongoId, toggleBestseller);
router.patch('/:id/featured', protect, validateMongoId, toggleFeatured);
router.patch('/:id/active', protect, validateMongoId, toggleActive);
router.post('/upload', protect, uploadProductImages, uploadImages);

module.exports = router;
