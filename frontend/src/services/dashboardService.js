// frontend/src/services/dashboardService.js

import api from './api';

const dashboardService = {
  // Get overview stats
  getOverviewStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (range = '7days') => {
    const response = await api.get('/dashboard/revenue', {
      params: { range },
    });
    return response.data;
  },

  // Get sales by category
  getSalesByCategory: async (range = '30days') => {
    const response = await api.get('/dashboard/sales-by-category', {
      params: { range },
    });
    return response.data;
  },

  // Get top products
  getTopProducts: async (limit = 10) => {
    const response = await api.get('/dashboard/top-products', {
      params: { limit },
    });
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-orders', {
      params: { limit },
    });
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    const response = await api.get('/dashboard/low-stock', {
      params: { threshold },
    });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (range = '30days') => {
    const response = await api.get('/dashboard/customers', {
      params: { range },
    });
    return response.data;
  },

  // Get order status distribution
  getOrderStatusDistribution: async () => {
    const response = await api.get('/dashboard/order-status');
    return response.data;
  },

  // Export data
  exportData: async (type, range = '30days') => {
    const response = await api.get(`/dashboard/export/${type}`, {
      params: { range },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default dashboardService;
