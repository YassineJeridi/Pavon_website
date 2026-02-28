// frontend/src/services/contactService.js

import api from './api';

const contactService = {
  // Submit contact form
  submit: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Get all contacts (Admin)
  getAll: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Alias for getAll (used in components)
  getAllContacts: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Get single contact (Admin)
  getById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Mark as read (Admin)
  markAsRead: async (id) => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  // Reply to contact (Admin)
  reply: async (id, replyMessage) => {
    const response = await api.post(`/contact/${id}/reply`, { replyMessage });
    return response.data;
  },

  // Update contact (Admin)
  update: async (id, data) => {
    const response = await api.put(`/contact/${id}`, data);
    return response.data;
  },

  // Delete contact (Admin)
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  // Alias for delete
  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default contactService;
