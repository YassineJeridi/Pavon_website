// frontend/src/services/categoryService.js

import api from './api';

const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Alias for getAll (used in components)
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category by ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create category (Admin)
  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Alias for create
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Update category (Admin)
  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Alias for update
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (Admin)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Alias for delete
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/categories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default categoryService;
