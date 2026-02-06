// frontend/src/hooks/useFilters.js

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useFilters = (initialFilters = {}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize filters from URL params
  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    const filters = { ...initialFilters };

    params.forEach((value, key) => {
      if (key === 'minPrice' || key === 'maxPrice') {
        filters[key] = value ? Number(value) : '';
      } else {
        filters[key] = value;
      }
    });

    return filters;
  };

  const [filters, setFilters] = useState(getInitialFilters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    const search = params.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;

    if (newUrl !== `${location.pathname}${location.search}`) {
      navigate(newUrl, { replace: true });
    }
  }, [filters, location.pathname, navigate]);

  // Update a single filter
  const updateFilter = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset a single filter
  const resetFilter = useCallback((name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: initialFilters[name] || '',
    }));
  }, [initialFilters]);

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return Object.entries(filters).some(
      ([key, value]) => value !== '' && value !== initialFilters[key]
    );
  }, [filters, initialFilters]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.entries(filters).filter(
      ([key, value]) => value !== '' && value !== initialFilters[key]
    ).length;
  }, [filters, initialFilters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    resetFilter,
    hasActiveFilters,
    getActiveFilterCount,
  };
};

// Hook for sorting
export const useSort = (initialSort = '-createdAt') => {
  const [sort, setSort] = useState(initialSort);

  const sortOptions = [
    { value: '-createdAt', label: 'Plus récent' },
    { value: 'createdAt', label: 'Plus ancien' },
    { value: 'price', label: 'Prix croissant' },
    { value: '-price', label: 'Prix décroissant' },
    { value: 'name', label: 'Nom (A-Z)' },
    { value: '-name', label: 'Nom (Z-A)' },
  ];

  const updateSort = useCallback((value) => {
    setSort(value);
  }, []);

  const getSortLabel = useCallback(() => {
    const option = sortOptions.find((opt) => opt.value === sort);
    return option?.label || 'Trier par';
  }, [sort, sortOptions]);

  return {
    sort,
    sortOptions,
    updateSort,
    getSortLabel,
  };
};

// Hook for pagination
export const usePagination = (initialPage = 1, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const updatePagination = useCallback((total) => {
    setTotalItems(total);
    setTotalPages(Math.ceil(total / itemsPerPage));
  }, [itemsPerPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    updatePagination,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
