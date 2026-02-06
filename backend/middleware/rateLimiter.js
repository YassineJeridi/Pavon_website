// backend/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard',
    });
  },
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
    });
  },
});

// Rate limiter for order creation
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 orders per hour
  message: {
    success: false,
    message: 'Trop de commandes, veuillez réessayer plus tard',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de commandes depuis cette IP, veuillez réessayer plus tard',
    });
  },
});

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 contact submissions per hour
  message: {
    success: false,
    message: 'Trop de messages envoyés, veuillez réessayer plus tard',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de messages depuis cette IP, veuillez réessayer dans 1 heure',
    });
  },
});

// Rate limiter for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Trop de demandes de réinitialisation, veuillez réessayer plus tard',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de demandes de réinitialisation depuis cette IP',
    });
  },
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per 15 minutes
  message: {
    success: false,
    message: 'Trop de téléchargements, veuillez réessayer plus tard',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de téléchargements depuis cette IP',
    });
  },
});

// Rate limiter for search
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    success: false,
    message: 'Trop de recherches, veuillez ralentir',
  },
  skipFailedRequests: true, // Don't count failed requests
});

// Create custom rate limiter
const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  orderLimiter,
  contactLimiter,
  passwordResetLimiter,
  uploadLimiter,
  searchLimiter,
  createLimiter,
};
