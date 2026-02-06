// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:sessionId', cartController.getCart);
router.post('/:sessionId/items', cartController.addToCart);
router.put('/:sessionId/items/:itemId', cartController.updateCartItem);
router.delete('/:sessionId/items/:itemId', cartController.removeFromCart);
router.delete('/:sessionId', cartController.clearCart);
router.post('/:sessionId/coupon', cartController.applyCoupon);
router.delete('/:sessionId/coupon', cartController.removeCoupon);

module.exports = router;
