// frontend/src/services/productService.js
import api from './api';

const productService = {
  // Get all products
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Alias for getAll
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    const response = await api.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get bestsellers
  getBestsellers: async (limit = 8) => {
    const response = await api.get('/products/bestsellers', {
      params: { limit },
    });
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    const response = await api.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get single product by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Alias for getBySlug (THIS WAS MISSING)
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Search products
  search: async (query, limit = 10) => {
    const response = await api.get('/products/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Get recommendations
  getRecommendations: async (productId) => {
    const response = await api.get(`/products/${productId}/recommendations`);
    return response.data;
  },

  // Create product (Admin)
  createProduct: async (data) => {
    const config = {};
    // If data is FormData, set appropriate headers
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
      config.timeout = 180000; // 3 minutes for upload
    }
    const response = await api.post('/products', data, config);
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id, data) => {
    const config = {};
    // If data is FormData, set appropriate headers
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
      config.timeout = 180000; // 3 minutes for upload
    }
    const response = await api.put(`/products/${id}`, data, config);
    return response.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Toggle bestseller status
  toggleBestseller: async (id) => {
    const response = await api.patch(`/products/${id}/bestseller`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await api.patch(`/products/${id}/featured`);
    return response.data;
  },

  // Toggle active status (visibility on public site)
  toggleActive: async (id) => {
    const response = await api.patch(`/products/${id}/active`);
    return response.data;
  },

  // Upload images
  uploadImages: async (formDataOrFiles) => {
    let formData;

    // Check if it's already FormData or an array of files
    if (formDataOrFiles instanceof FormData) {
      formData = formDataOrFiles;
    } else {
      formData = new FormData();
      const files = Array.isArray(formDataOrFiles) ? formDataOrFiles : [formDataOrFiles];
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await api.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for large images
    });
    return response.data;
  },
};

export default productService;
