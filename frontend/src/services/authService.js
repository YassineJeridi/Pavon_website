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
};

export default authService;
