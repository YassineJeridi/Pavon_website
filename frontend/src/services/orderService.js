// frontend/src/services/orderService.js

import api from './api';

const orderService = {
  // Get all orders
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Alias for getAll (used in components)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Alias for create (used in checkout)
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Alias for updateStatus
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default orderService;
