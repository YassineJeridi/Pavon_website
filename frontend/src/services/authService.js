// frontend/src/services/authService.js

import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { success, token, user }
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data; // { success, user }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.put('/auth/password', passwords);
    return response.data;
  },

  // ── Admin management (super_admin only) ───────────────────
  getAllAdmins: async () => {
    const response = await api.get('/auth/admins');
    return response.data;
  },

  createAdmin: async (data) => {
    const response = await api.post('/auth/create-admin', data);
    return response.data;
  },

  deleteAdmin: async (id) => {
    const response = await api.delete(`/auth/admins/${id}`);
    return response.data;
  },

  toggleAdminStatus: async (id) => {
    const response = await api.patch(`/auth/admins/${id}/toggle`);
    return response.data;
  },

  resetAdminPassword: async (id, newPassword) => {
    const response = await api.put(`/auth/admins/${id}/password`, { newPassword });
    return response.data;
  },
};

export default authService;
