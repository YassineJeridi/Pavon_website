// backend/routes/collections.js
const express = require('express');
const router = express.Router();
const { uploadCollectionImage } = require('../config/multer');
const {
  getAllCollections,
  getAdminCollections,
  getCollectionProducts,
  createCollection,
  updateCollection,
  deleteCollection,
  toggleFeatured,
  toggleActive,
  dissociateProduct
} = require('../controllers/collectionController');

// Public routes
router.get('/', getAllCollections);

// Admin routes
router.get('/admin/all', getAdminCollections);
router.get('/:id/products', getCollectionProducts);
router.post('/', uploadCollectionImage, createCollection);
router.put('/:id', uploadCollectionImage, updateCollection);
router.delete('/:id', deleteCollection);
router.patch('/:id/featured', toggleFeatured);
router.patch('/:id/active', toggleActive);
router.delete('/:id/products/:productId', dissociateProduct);

module.exports = router;
