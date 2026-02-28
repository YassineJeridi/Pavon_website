// frontend/src/pages/client/ProductsPage.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, SlidersHorizontal, Sparkles, Search } from 'lucide-react';
import ProductGrid from '../../components/client/products/ProductGrid';
import FilterSidebarNew from '../../components/client/products/FilterSidebarNew';
import productService from '../../services/productService';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    collections: searchParams.get('collection') ? [searchParams.get('collection')] : [],
    priceRange: { min: 0, max: 10000 },
    sizes: [],
    numericSizes: [],
    colors: [],
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const debounceTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const fetchIdRef = useRef(0);

  // Refs to hold latest state values for the fetch function (avoids stale closures)
  const filtersRef = useRef(filters);
  const searchQueryRef = useRef(searchQuery);
  const sortByRef = useRef(sortBy);
  const paginationRef = useRef(pagination);
  filtersRef.current = filters;
  searchQueryRef.current = searchQuery;
  sortByRef.current = sortBy;
  paginationRef.current = pagination;

  // Stable serialized key — avoids re-triggering effect when object reference changes but values are identical
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    document.title = 'Nos Produits - Pavone Collection';
  }, []);

  // Debounced fetch — uses filtersKey (string) instead of filters (object)
  // so it only re-triggers when filter values actually change, not on every new object ref
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const delay = isInitialLoadRef.current ? 0 : 350;
    debounceTimeoutRef.current = setTimeout(() => {
      fetchProducts();
    }, delay);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, filtersKey, sortBy, pagination.page]);

  const fetchProducts = useCallback(async () => {
    // Read latest values from refs (avoids stale closures & extra dependencies)
    const currentFilters = filtersRef.current;
    const currentSearch = searchQueryRef.current;
    const currentSort = sortByRef.current;
    const currentPagination = paginationRef.current;

    // Track request ID to ignore stale responses when a newer request is in-flight
    const requestId = ++fetchIdRef.current;
    const isInitial = isInitialLoadRef.current;

    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setIsFilterLoading(true);
      }

      const params = {
        sort: currentSort,
        minPrice: currentFilters.priceRange.min,
        maxPrice: currentFilters.priceRange.max,
        page: currentPagination.page,
        limit: currentPagination.limit,
      };

      if (currentSearch) params.search = currentSearch;
      if (currentFilters.categories.length > 0) params.category = currentFilters.categories.join(',');
      if (currentFilters.collections.length > 0) params.collection = currentFilters.collections.join(',');
      if (currentFilters.sizes.length > 0) params.sizes = currentFilters.sizes.join(',');
      if (currentFilters.numericSizes.length > 0) params.numericSizes = currentFilters.numericSizes.join(',');
      if (currentFilters.colors.length > 0) params.colors = currentFilters.colors.join(',');

      const response = await productService.getAll(params);

      // Ignore stale response if a newer request was fired
      if (requestId !== fetchIdRef.current) return;

      const productsData = response?.data || response || [];
      setProducts(Array.isArray(productsData) ? productsData : []);

      if (response.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: response.total,
          pages: response.pages || Math.ceil(response.total / prev.limit),
        }));
      }

      isInitialLoadRef.current = false;
    } catch (error) {
      if (requestId !== fetchIdRef.current) return;
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      if (requestId === fetchIdRef.current) {
        setLoading(false);
        setIsFilterLoading(false);
      }
    }
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf9ee]">
      {/* Premium Header with Glass Effect */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Title with Sparkle Icon */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <Sparkles className="w-7 h-7 text-[#5d1115]" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                  Nos Collections
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
                </p>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:border-[#5d1115] focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-5 py-2.5 bg-[#5d1115] text-white rounded-xl font-semibold shadow-lg hover:bg-[#111f35] transition-colors duration-200"
              >
                {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
                <span>{showFilters ? 'Fermer' : 'Filtres'}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Search Bar - Auto-refresh */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits, marques, couleurs..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#5d1115] focus:border-transparent transition-all duration-200 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block w-80 flex-shrink-0"
          >
            <div className="sticky top-32 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#5d1115] to-[#111f35] px-6 py-4">
                <div className="flex items-center space-x-2 text-white">
                  <Filter className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Filtres</h2>
                </div>
              </div>
              <div className="p-6">
                <FilterSidebarNew filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>
          </motion.div>

          {/* Mobile Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setShowFilters(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
                >
                  <div className="bg-[#5d1115] px-6 py-4 sticky top-0">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Filtres</h2>
                      </div>
                      <button onClick={() => setShowFilters(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <FilterSidebarNew filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
            {(loading || isFilterLoading) && products.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-[#5d1115] border-t-transparent rounded-full"
                />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="relative">
                  {/* Smooth loading overlay for filter/sort changes */}
                  <AnimatePresence>
                    {isFilterLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl pointer-events-none"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-10 h-10 border-[3px] border-[#5d1115] border-t-transparent rounded-full"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className="transition-opacity duration-300 ease-in-out"
                    style={{ opacity: isFilterLoading ? 0.6 : 1 }}
                  >
                    <ProductGrid products={products} />
                  </div>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Affichage de{' '}
                        <span className="font-semibold text-[#5d1115]">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>
                        {' à '}
                        <span className="font-semibold text-[#5d1115]">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>
                        {' sur '}
                        <span className="font-semibold text-[#5d1115]">{pagination.total}</span>
                        {' produits'}
                      </p>
                      
                      <nav className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-[#fdf9ee] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Précédent
                        </motion.button>
                        
                        <div className="hidden sm:flex items-center space-x-1">
                          {[...Array(pagination.pages)].map((_, index) => {
                            const pageNum = index + 1;
                            const showPage = pageNum === 1 || 
                                            pageNum === pagination.pages || 
                                            Math.abs(pageNum - pagination.page) <= 1;
                            
                            if (!showPage && pageNum === 2) {
                              return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                            }
                            if (!showPage && pageNum === pagination.pages - 1) {
                              return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                            }
                            if (!showPage) return null;
                            
                            return (
                              <motion.button
                                key={pageNum}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                  pagination.page === pageNum
                                    ? 'bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-[#fdf9ee] border border-gray-300'
                                }`}
                              >
                                {pageNum}
                              </motion.button>
                            );
                          })}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-[#fdf9ee] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Suivant
                        </motion.button>
                      </nav>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="max-w-md mx-auto px-6">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun produit trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    Essayez d'ajuster vos filtres pour voir plus de résultats
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange({
                      categories: [],
                      collections: [],
                      priceRange: { min: 0, max: 10000 },
                      sizes: [],
                      numericSizes: [],
                      colors: [],
                    })}
                    className="px-6 py-3 bg-[#5d1115] text-white rounded-xl font-semibold shadow-lg hover:bg-[#111f35] transition-colors"
                  >
                    Réinitialiser les filtres
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
