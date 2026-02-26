// frontend/src/services/testimonialService.js
import api from './api';

const testimonialService = {
  // Get all testimonials
  getAll: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Alias for compatibility with DashboardTestimonials.jsx
  getAllTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Get featured testimonials
  getFeatured: async (limit = 10) => {
    const response = await api.get('/testimonials/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get active testimonials (for client-facing pages)
  getActiveTestimonials: async (limit = 10) => {
    const response = await api.get('/testimonials/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get single testimonial by ID
  getById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Get testimonial by ID (alias)
  getTestimonialById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial (Admin)
  create: async (data) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  // Create testimonial (alias)
  createTestimonial: async (data) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  // Update testimonial (Admin)
  update: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },

  // Update testimonial (alias)
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial (Admin)
  delete: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },

  // Delete testimonial (alias)
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },

  // Toggle featured status (Admin)
  toggleFeatured: async (id) => {
    const response = await api.patch(`/testimonials/${id}/featured`);
    return response.data;
  },
};

export default testimonialService;
