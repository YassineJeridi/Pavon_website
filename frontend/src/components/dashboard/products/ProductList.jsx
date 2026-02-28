// frontend/src/components/dashboard/products/ProductList.jsx

import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import ProductTable from './ProductTable';
import ProductFormNew from './ProductFormNew';
import Pagination from '../common/Pagination';
import { PlusIcon } from '@heroicons/react/24/outline';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    collection: '',
    featured: '',
    bestSeller: '',
  });
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
  }, [pagination.page, pagination.limit]);

  const fetchFilterOptions = async () => {
    try {
      const categoryService = await import('../../../services/categoryService');
      const collectionServiceImport = await import('../../../services/collectionService');
      
      const [categoriesRes, collectionsRes] = await Promise.all([
        categoryService.default.getAll(),
        collectionServiceImport.collectionService.getAllCollections()
      ]);

      const categoriesData = categoriesRes?.data || categoriesRes || [];
      const collectionsData = collectionsRes?.data?.data || collectionsRes?.data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setCollections(Array.isArray(collectionsData) ? collectionsData : []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        all: 'true', // Show all products in dashboard (both active and inactive)
      });
      console.log('📦 Products API response:', data);
      
      // ✅ Handle multiple response formats
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      }
      
      setProducts(productsArray);
      
      // Update pagination info
      if (data.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: data.total,
          pages: data.pages || Math.ceil(data.total / prev.limit),
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when changing items per page
    }));
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleToggleBestseller = async (productId, currentStatus) => {
    try {
      await productService.toggleBestseller(productId);
      // Update local state
      setProducts(products.map(p => 
        p._id === productId ? { ...p, bestseller: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling bestseller:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await productService.toggleActive(productId);
      // Update local state
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling active:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // ✅ FIXED: Apply filters with safety checks
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = !filters.search || 
      product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || 
      product.categories?.some(cat => cat._id === filters.category);

    const matchesCollection = !filters.collection || 
      product.productCollection?._id === filters.collection;

    const matchesFeatured = filters.featured === '' || 
      product.featured === (filters.featured === 'true');

    const matchesBestSeller = filters.bestSeller === '' || 
      product.bestseller === (filters.bestSeller === 'true');

    return matchesSearch && matchesCategory && matchesCollection && 
           matchesFeatured && matchesBestSeller;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredProducts.length} résultat(s) affiché(s) • {pagination.total} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nouveau produit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filters.collection}
            onChange={(e) => handleFilterChange('collection', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Toutes collections</option>
            {collections.map(col => (
              <option key={col._id} value={col._id}>{col.name}</option>
            ))}
          </select>

          <select
            value={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Tous (En vedette)</option>
            <option value="true">En vedette</option>
            <option value="false">Pas en vedette</option>
          </select>

          <select
            value={filters.bestSeller}
            onChange={(e) => handleFilterChange('bestSeller', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Tous (Bestseller)</option>
            <option value="true">Bestseller</option>
            <option value="false">Pas bestseller</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleBestseller={handleToggleBestseller}
        onToggleActive={handleToggleActive}
      />

      {/* Pagination */}
      {!loading && pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormNew
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProductList;
