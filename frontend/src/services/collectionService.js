import api from './api';

export const collectionService = {
  // Public routes
  getAllCollections: () => api.get('/collections'),
  getFeatured: (limit = 6) => api.get(`/collections?limit=${limit}`),
  
  // Admin routes
  getAdminCollections: () => api.get('/collections/admin/all'),
  getCollectionProducts: (id) => api.get(`/collections/${id}/products`),
  createCollection: (formData) => api.post('/collections', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCollection: (id, formData) => api.put(`/collections/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCollection: (id) => api.delete(`/collections/${id}`),
  toggleFeatured: (id) => api.patch(`/collections/${id}/featured`),
  toggleActive: (id) => api.patch(`/collections/${id}/active`),
  dissociateProduct: (collectionId, productId) => 
    api.delete(`/collections/${collectionId}/products/${productId}`)
};
