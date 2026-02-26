// frontend/src/hooks/useProducts.js

import { useState, useEffect } from 'react';
import  productService  from '../services/productService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productService.getAllProducts(filters);
      
      if (data.products) {
        setProducts(data.products);
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          total: data.total || data.products.length,
        });
      } else {
        setProducts(data);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: data.length,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
};

// Hook for single product
export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data?.message || 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return {
    product,
    loading,
    error,
  };
};

// Hook for featured products
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getFeaturedProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError(error.response?.data?.message || 'Failed to fetch featured products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
  };
};

// Hook for bestseller products
export const useBestsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getBestsellers();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        setError(error.response?.data?.message || 'Failed to fetch bestsellers');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return {
    products,
    loading,
    error,
  };
};

// Hook for product recommendations
export const useRecommendations = (productId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getRecommendations(productId);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError(error.response?.data?.message || 'Failed to fetch recommendations');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  return {
    products,
    loading,
    error,
  };
};
