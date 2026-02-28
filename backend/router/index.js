// backend/router/index.js

const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./products');
const collectionRoutes = require('./collections');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const contactRoutes = require('./contact');
const bannerRoutes = require('./banners');
const testimonialRoutes = require('./testimonials');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const topBannerRoutes = require('./topBanner');
const externalOrderRoutes = require('./externalOrders');

// Mount routes
router.use('/products', productRoutes);
router.use('/collections', collectionRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/contact', contactRoutes);
router.use('/banners', bannerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/top-banner', topBannerRoutes);
router.use('/external-orders', externalOrderRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pavone Collection API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      collections: '/api/collections',
      categories: '/api/categories',
      orders: '/api/orders',
      cart: '/api/cart',
      contact: '/api/contact',
      banners: '/api/banners',
      testimonials: '/api/testimonials',
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      externalOrders: '/api/external-orders',
    },
  });
});

module.exports = router;
