// frontend/src/context/CartContext.jsx

import { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ ADD THIS

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity, color, size) => {
    try {
      const response = await cartService.addToCart(
        product._id,
        quantity,
        size,
        color
      );
      setCart(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error updating cart:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error removing from cart:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await cartService.applyCoupon(code);
      setCart(response.data);
      return { success: true, message: response.message };
    } catch (err) {
      console.error('Error applying coupon:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await cartService.removeCoupon();
      setCart(response.data);
      return { success: true };
    } catch (err) {
      console.error('Error removing coupon:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  // ✅ ADD THESE TOGGLE FUNCTIONS
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartSubtotal = cart?.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  const value = {
    cart,
    loading,
    error,
    cartItemsCount,
    cartSubtotal,
    isCartOpen,        // ✅ ADD THIS
    openCart,          // ✅ ADD THIS
    closeCart,         // ✅ ADD THIS
    toggleCart,        // ✅ ADD THIS
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
