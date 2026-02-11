// frontend/src/services/externalOrderService.js

import api from './api';

const externalOrderService = {
  // ── External Orders CRUD ──────────────────────

  // Create a new external order
  createOrder: async (orderData) => {
    const response = await api.post('/external-orders', orderData);
    return response.data;
  },

  // Get all external orders (with filters & pagination)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/external-orders', { params });
    return response.data;
  },

  // Get a single external order
  getOrderById: async (id) => {
    const response = await api.get(`/external-orders/${id}`);
    return response.data;
  },

  // Update an external order
  updateOrder: async (id, orderData) => {
    const response = await api.put(`/external-orders/${id}`, orderData);
    return response.data;
  },

  // Delete an external order
  deleteOrder: async (id) => {
    const response = await api.delete(`/external-orders/${id}`);
    return response.data;
  },

  // ── Customer Name Suggestions ──────────────────

  getCustomerSuggestions: async (query = '') => {
    try {
      const response = await api.get('/external-orders/customers/suggest', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer suggestions:', error);
      return { success: false, data: [] };
    }
  },

  // ── Financial Metrics ─────────────────────────

  getFinancialMetrics: async (params = {}) => {
    try {
      const response = await api.get('/external-orders/metrics/financial', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return { success: false, data: null };
    }
  },

  // ── Recurring Clients ─────────────────────────

  getRecurringClients: async () => {
    const response = await api.get('/external-orders/clients/recurring');
    return response.data;
  },

  getClientOrders: async (name) => {
    const response = await api.get(`/external-orders/clients/${encodeURIComponent(name)}/orders`);
    return response.data;
  },

  // ── Expenses CRUD ─────────────────────────────

  createExpense: async (expenseData) => {
    const response = await api.post('/external-orders/expenses', expenseData);
    return response.data;
  },

  getAllExpenses: async (params = {}) => {
    const response = await api.get('/external-orders/expenses', { params });
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/external-orders/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/external-orders/expenses/${id}`);
    return response.data;
  },
};

export default externalOrderService;
