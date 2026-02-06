// backend/router/orders.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validateOrder, validateMongoId, validatePagination } = require('../middleware/validation');
const { orderLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/', orderLimiter, validateOrder, createOrder);
router.get('/number/:orderNumber', getOrderByNumber);

// Protected routes (Admin only)
router.get('/', protect, validatePagination, getAllOrders);
router.get('/stats', protect, getOrderStats);
router.get('/:id', protect, validateMongoId, getOrderById);
router.patch('/:id/status', protect, validateMongoId, updateOrderStatus);
router.put('/:id', protect, validateMongoId, updateOrder);
router.delete('/:id', protect, validateMongoId, deleteOrder);

module.exports = router;
