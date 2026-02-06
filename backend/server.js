// backend/server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ====== ENV VARS ======
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ====== CORS - ALLOW MULTIPLE ORIGINS ======
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://pavon-website.vercel.app',
  FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Allow Vercel preview deployments (all *.vercel.app domains)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== MONGODB ======
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

// ====== ROUTES - USING YOUR EXACT FILES ======
app.use('/api/auth', require('./router/auth')); // ✅ Your auth.js
app.use('/api/products', require('./router/products')); // ✅ Your products.js
app.use('/api/categories', require('./router/categories')); // ✅ Your categories.js
app.use('/api/collections', require('./router/collections')); // ✅ Your collections.js
app.use('/api/banners', require('./router/banners')); // ✅ Your banners.js
app.use('/api/top-banner', require('./router/topBanner')); // ✅ Your topBanner.js
app.use('/api/testimonials', require('./router/testimonials')); // ✅ Your testimonials.js
app.use('/api/orders', require('./router/orders')); // ✅ Your orders.js
app.use('/api/cart', require('./router/cart')); // ✅ Your cart.js
app.use('/api/contact', require('./router/contact')); // ✅ Your contact.js
app.use('/api/dashboard', require('./router/dashboard')); // ✅ Your dashboard.js

// ====== STATIC FILES (uploads) ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== HEALTH CHECK ======
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ====== 404 Handler ======
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ====== START SERVER ======
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for multiple origins including Vercel`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.connection.close();
    console.log('🛑 Server stopped');
    process.exit(0);
  });
});
