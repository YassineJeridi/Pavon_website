// frontend/src/components/dashboard/products/ProductList.jsx

import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import ProductTable from './ProductTable';
import ProductFormNew from './ProductFormNew';
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
            {filteredProducts.length} produit(s) • {products.length} total
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
      {!loading && pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                {' à '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>
                {' sur '}
                <span className="font-medium">{pagination.total}</span>
                {' produits'}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(pagination.pages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first page, last page, current page, and pages around current
                  const showPage = pageNum === 1 || 
                                  pageNum === pagination.pages || 
                                  Math.abs(pageNum - pagination.page) <= 1;
                  
                  if (!showPage && pageNum === 2) {
                    return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                  }
                  if (!showPage && pageNum === pagination.pages - 1) {
                    return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                  }
                  if (!showPage) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === pageNum
                          ? 'z-10 bg-gray-900 border-gray-900 text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
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
