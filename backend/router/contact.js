// backend/router/contact.js

const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  markAsRead,
  replyToContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { validateContact, validateMongoId, validatePagination } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/', contactLimiter, validateContact, submitContact);

// Protected routes (Admin only)
router.get('/', protect, validatePagination, getAllContacts);
router.get('/:id', protect, validateMongoId, getContactById);
router.patch('/:id/read', protect, validateMongoId, markAsRead);
router.post('/:id/reply', protect, validateMongoId, replyToContact);
router.put('/:id', protect, validateMongoId, updateContact);
router.delete('/:id', protect, validateMongoId, deleteContact);

module.exports = router;
