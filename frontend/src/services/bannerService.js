// frontend/src/services/bannerService.js

import api from './api';

const bannerService = {
  // Get all banners
  getAll: async (position = null) => {
    const params = position ? { position } : {};
    const response = await api.get('/banners', { params });
    return response.data;
  },

  // Alias for getAll (used in components)
  getAllBanners: async (position = null) => {
    const params = position ? { position } : {};
    const response = await api.get('/banners', { params });
    return response.data;
  },

  // Get active banners
  getActive: async (position = null) => {
    const params = position ? { position } : {};
    const response = await api.get('/banners/active', { params });
    return response.data;
  },

  // Get single banner
  getById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner (Admin)
  create: async (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.post('/banners', data, config);
    return response.data;
  },

  // Alias for create
  createBanner: async (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.post('/banners', data, config);
    return response.data;
  },

  // Update banner (Admin)
  update: async (id, data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.put(`/banners/${id}`, data, config);
    return response.data;
  },

  // Alias for update
  updateBanner: async (id, data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.put(`/banners/${id}`, data, config);
    return response.data;
  },

  // Delete banner (Admin)
  delete: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Alias for delete
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Reorder banners (Admin)
  reorder: async (bannerIds) => {
    const response = await api.put('/banners/reorder', { bannerIds });
    return response.data;
  },

  // Track click
  trackClick: async (id) => {
    const response = await api.post(`/banners/${id}/click`);
    return response.data;
  },
};

export default bannerService;
