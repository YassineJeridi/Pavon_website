// backend/router/dashboard.js

const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  getRevenueAnalytics,
  getSalesByCategory,
  getTopProducts,
  getRecentOrders,
  getLowStockProducts,
  getCustomerAnalytics,
  getOrderStatusDistribution,
  exportData,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All dashboard routes are protected (Admin only)
router.use(protect);

router.get('/stats', getOverviewStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/sales-by-category', getSalesByCategory);
router.get('/top-products', getTopProducts);
router.get('/recent-orders', getRecentOrders);
router.get('/low-stock', getLowStockProducts);
router.get('/customers', getCustomerAnalytics);
router.get('/order-status', getOrderStatusDistribution);
router.get('/export/:type', exportData);

module.exports = router;
