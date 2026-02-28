// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'https://backend.pavonecollection.com/api',

  timeout: 60000, // 60 seconds for image uploads
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Don't remove token here - let AuthContext handle it
    // Just log the error and reject
    
    return Promise.reject(error);
  }
);

export default api;
