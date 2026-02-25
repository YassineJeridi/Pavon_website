// frontend/src/services/topBannerService.js
import api from './api';

const topBannerService = {
  // Get all active top banners (Public)
  getActive: async () => {
    const response = await api.get('/top-banner/active');
    return response.data;
  },

  // Get all top banners (Admin)
  getAll: async () => {
    const response = await api.get('/top-banner');
    return response.data;
  },

  // Create top banner (Admin)
  create: async (data) => {
    const response = await api.post('/top-banner', data);
    return response.data;
  },

  // Update top banner (Admin)
  update: async (id, data) => {
    const response = await api.put(`/top-banner/${id}`, data);
    return response.data;
  },

  // Delete top banner (Admin)
  delete: async (id) => {
    const response = await api.delete(`/top-banner/${id}`);
    return response.data;
  },

  // Toggle active status (Admin)
  toggleActive: async (id) => {
    const response = await api.patch(`/top-banner/${id}/toggle`);
    return response.data;
  },
};

export default topBannerService;
