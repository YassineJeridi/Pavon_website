// backend/controllers/cartController.js

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart by session ID
// @route   GET /api/cart/:sessionId
// @access  Public
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product', 'name slug price images stock isActive');

    if (!cart) {
      cart = await Cart.create({ sessionId: req.params.sessionId, items: [] });
    }

    // Filter out inactive or deleted products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du panier',
      error: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/:sessionId/items
// @access  Public
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    // Validate product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
    }

    if (!product.isAvailable(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant',
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      cart = await Cart.create({ sessionId: req.params.sessionId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check max quantity
      if (cart.items[existingItemIndex].quantity > 10) {
        return res.status(400).json({
          success: false,
          message: 'Quantité maximale atteinte (10)',
        });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name slug price images stock isActive');

    res.status(200).json({
      success: true,
      message: 'Produit ajouté au panier',
      data: cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'ajout au panier',
      error: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:sessionId/items/:itemId
// @access  Public
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être entre 1 et 10',
      });
    }

    const cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier',
      });
    }

    // Check stock availability
    const product = await Product.findById(item.product);
    
    if (!product || !product.isAvailable(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuffisant',
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name slug price images stock isActive');

    res.status(200).json({
      success: true,
      message: 'Quantité mise à jour',
      data: cart,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:sessionId/items/:itemId
// @access  Public
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate('items.product', 'name slug price images stock isActive');

    res.status(200).json({
      success: true,
      message: 'Article retiré du panier',
      data: cart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/:sessionId
// @access  Public
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
    }

    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Panier vidé',
      data: cart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du vidage du panier',
      error: error.message,
    });
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/:sessionId/coupon
// @access  Public
exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // This is a placeholder - implement your own coupon validation logic
    const validCoupons = {
      'WELCOME10': 10, // 10% discount
      'SUMMER20': 20,  // 20% discount
    };

    if (!validCoupons[code]) {
      return res.status(400).json({
        success: false,
        message: 'Code promo invalide',
      });
    }

    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product', 'name slug price images stock isActive');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
    }

    const discountPercent = validCoupons[code];
    const subtotal = cart.subtotal;
    const discount = (subtotal * discountPercent) / 100;

    cart.couponCode = code;
    cart.discount = discount;
    await cart.save();

    res.status(200).json({
      success: true,
      message: `Code promo appliqué (${discountPercent}% de réduction)`,
      data: cart,
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'application du code promo',
      error: error.message,
    });
  }
};

// @desc    Remove coupon
// @route   DELETE /api/cart/:sessionId/coupon
// @access  Public
exports.removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product', 'name slug price images stock isActive');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
    }

    cart.couponCode = null;
    cart.discount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Code promo retiré',
      data: cart,
    });
  } catch (error) {
    console.error('Error removing coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du code promo',
      error: error.message,
    });
  }
};
