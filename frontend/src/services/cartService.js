// frontend/src/services/cartService.js
import api from './api';

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const cartService = {
  // Get cart
  getCart: async () => {
    const sessionId = getSessionId();
    const response = await api.get(`/cart/${sessionId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity, size, color) => {
    const sessionId = getSessionId();
    const response = await api.post(`/cart/${sessionId}/items`, {
      productId,
      quantity,
      size,
      color,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const sessionId = getSessionId();
    const response = await api.put(`/cart/${sessionId}/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${sessionId}/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${sessionId}`);
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (code) => {
    const sessionId = getSessionId();
    const response = await api.post(`/cart/${sessionId}/coupon`, { code });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${sessionId}/coupon`);
    return response.data;
  },
};

export default cartService;
