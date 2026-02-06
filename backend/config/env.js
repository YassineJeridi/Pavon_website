// backend/config/env.js

const validateEnv = () => {
  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'NODE_ENV',
  ];

  const optionalEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'CLIENT_URL',
  ];

  console.log('\n🔍 Validating environment variables...\n');

  // Check required variables
  const missingRequired = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingRequired.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingRequired.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error('\n⚠️  Please check your .env file\n');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');

  // Check optional variables
  const missingOptional = optionalEnvVars.filter((key) => !process.env[key]);

  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    missingOptional.forEach((key) => {
      console.warn(`   - ${key}`);
    });
    console.warn('   (Some features may not work)\n');
  }

  // Validate NODE_ENV
  const validEnvironments = ['development', 'production', 'test'];
  if (!validEnvironments.includes(process.env.NODE_ENV)) {
    console.warn(
      `⚠️  NODE_ENV is set to "${process.env.NODE_ENV}". Valid values are: ${validEnvironments.join(', ')}`
    );
  }

  // Display configuration summary
  console.log('📋 Environment Configuration:');
  console.log(`   - Environment: ${process.env.NODE_ENV}`);
  console.log(`   - Port: ${process.env.PORT}`);
  console.log(`   - MongoDB: ${process.env.MONGO_URI ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   - JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
  console.log(`   - Cloudinary: ${
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
      ? '✅ Configured'
      : '⚠️  Not fully configured'
  }`);
  console.log(`   - Email Service: ${
    process.env.EMAIL_HOST && process.env.EMAIL_USER
      ? '✅ Configured'
      : '⚠️  Not configured'
  }`);
  console.log(`   - Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);

  return true;
};

// Get configuration object
const getConfig = () => {
  return {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    // Database
    mongoUri: process.env.MONGO_URI,

    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',

    // Cloudinary
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    // Email
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: process.env.EMAIL_FROM || 'noreply@elegance.com',
    },

    // Security
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

    // Pagination
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 12,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,

    // File Upload
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    maxBannerFileSize: parseInt(process.env.MAX_BANNER_FILE_SIZE) || 10 * 1024 * 1024, // 10MB

    // CORS
    corsOrigin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'],
  };
};

// Check if running in production
const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Check if running in development
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Check if running in test mode
const isTest = () => {
  return process.env.NODE_ENV === 'test';
};

module.exports = {
  validateEnv,
  getConfig,
  isProduction,
  isDevelopment,
  isTest,
};
