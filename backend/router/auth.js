// backend/router/auth.js

const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  forgotPassword,
  resetPassword,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  toggleAdminStatus,
  resetAdminPassword,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateLogin,
  validateRegister,
  validatePasswordChange,
} = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/login', authLimiter, validateLogin, login);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/verify', protect, verifyToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);

// Super Admin only routes
router.post('/create-admin', protect, authorize('super_admin'), validateRegister, createAdmin);
router.get('/admins', protect, authorize('super_admin'), getAllAdmins);
router.delete('/admins/:id', protect, authorize('super_admin'), deleteAdmin);
router.patch('/admins/:id/toggle', protect, authorize('super_admin'), toggleAdminStatus);
router.put('/admins/:id/password', protect, authorize('super_admin'), resetAdminPassword);

module.exports = router;
