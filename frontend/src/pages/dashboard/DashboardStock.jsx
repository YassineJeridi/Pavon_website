// frontend/src/pages/dashboard/DashboardStock.jsx

import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import Pagination from '../../components/dashboard/common/Pagination';
import { getProductImageUrl } from '../../utils/imageUtils';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const DashboardStock = () => {
  const [allProducts, setAllProducts] = useState([]); // All products for stats
  const [products, setProducts] = useState([]); // Paginated products for display
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'
  const [updatingStock, setUpdatingStock] = useState({});
  const [stockUpdates, setStockUpdates] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    document.title = 'Gestion du Stock - Pavone Collection Admin';
    fetchAllProducts(); // Fetch all for stats
    fetchProducts(); // Fetch paginated for display
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    applyFilter();
  }, [products, filter]);

  const fetchAllProducts = async () => {
    try {
      const data = await productService.getAllProducts({
        all: 'true',
      });

      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      }

      setAllProducts(productsArray);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        all: 'true',
      });

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

  const applyFilter = () => {
    let filtered = [...products];

    if (filter === 'low') {
      filtered = products.filter(p => p.stock > 0 && p.stock < 10);
    } else if (filter === 'out') {
      filtered = products.filter(p => p.stock === 0);
    }

    // Sort by stock level (lowest first)
    filtered.sort((a, b) => a.stock - b.stock);
    setFilteredProducts(filtered);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: 'Rupture de stock',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircleIcon,
      };
    } else if (stock < 10) {
      return {
        label: 'Stock faible',
        color: 'bg-[#e8ddca] text-[#111f35] border-[#d4c5a3]',
        icon: ExclamationTriangleIcon,
      };
    } else {
      return {
        label: 'En stock',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircleIcon,
      };
    }
  };

  const handleStockChange = (productId, value) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleQuickRestock = async (productId, amount) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const newStock = Math.max(0, product.stock + amount);
    await updateStock(productId, newStock);
  };

  const handleUpdateStock = async (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined || newStock === '') return;

    await updateStock(productId, parseInt(newStock));
  };

  const updateStock = async (productId, newStock) => {
    try {
      setUpdatingStock(prev => ({ ...prev, [productId]: true }));

      await productService.updateProduct(productId, {
        stock: newStock,
      });

      // Update local state for both allProducts and paginated products
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === productId ? { ...p, stock: newStock } : p
        )
      );
      setAllProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === productId ? { ...p, stock: newStock } : p
        )
      );

      // Clear the input
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      alert('Stock mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    } finally {
      setUpdatingStock(prev => ({ ...prev, [productId]: false }));
    }
  };

  const stockStats = {
    total: allProducts.length || pagination.total, // Use all products for accurate count
    inStock: allProducts.filter(p => p.stock > 10).length,
    lowStock: allProducts.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: allProducts.filter(p => p.stock === 0).length,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
        <p className="mt-1 text-sm text-gray-600">
          Suivez et gérez l'inventaire de vos produits
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Produits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stockStats.total}</p>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">En Stock</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stockStats.inStock}</p>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#d4c5a3]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#111f35]">Stock Faible</p>
              <p className="text-2xl font-bold text-[#5d1115] mt-1">{stockStats.lowStock}</p>
            </div>
            <ExclamationTriangleIcon className="w-10 h-10 text-[#5d1115]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rupture</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{stockStats.outOfStock}</p>
            </div>
            <XCircleIcon className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({stockStats.total})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'low'
                ? 'bg-[#5d1115] text-white'
                : 'bg-[#e8ddca] text-[#111f35] hover:bg-[#d4c5a3]'
            }`}
          >
            Stock Faible ({stockStats.lowStock})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'out'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Rupture de Stock ({stockStats.outOfStock})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions Rapides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nouveau Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const StatusIcon = stockStatus.icon;
                  const isUpdating = updatingStock[product._id];

                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      {/* Product Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={getProductImageUrl(product)}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.price} TND
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Stock */}
                      <td className="px-6 py-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {product.stock}
                        </div>
                        <div className="text-xs text-gray-500">unité(s)</div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${stockStatus.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {stockStatus.label}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuickRestock(product._id, -1)}
                            disabled={isUpdating || product.stock === 0}
                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Réduire de 1"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickRestock(product._id, 1)}
                            disabled={isUpdating}
                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Augmenter de 1"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickRestock(product._id, 10)}
                            disabled={isUpdating}
                            className="px-3 py-2 bg-[#5d1115] text-white rounded hover:bg-[#111f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                            title="Ajouter 10 unités"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Manual Stock Update */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={stockUpdates[product._id] ?? ''}
                            onChange={(e) => handleStockChange(product._id, e.target.value)}
                            placeholder={product.stock}
                            disabled={isUpdating}
                            className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5d1115] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <button
                            onClick={() => handleUpdateStock(product._id)}
                            disabled={isUpdating || !stockUpdates[product._id]}
                            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
};

export default DashboardStock;
