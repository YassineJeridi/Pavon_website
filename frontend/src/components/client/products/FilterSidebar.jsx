// frontend/src/components/client/products/FilterSidebar.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import categoryService from '../../../services/categoryService';

const FilterSidebar = ({ filters, onFilterChange, onClose, isMobile = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      // Use getAll instead of getAllCategories
      const response = await categoryService.getAll();
      const categoriesData = response?.data || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (min, max) => {
    onFilterChange({ ...filters, priceRange: { min, max } });
  };

  const handleSizeChange = (size) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    onFilterChange({ ...filters, colors: newColors });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      sizes: [],
      colors: [],
      inStock: false,
    });
  };

  const priceRanges = [
    { label: 'Moins de 50 DT', min: 0, max: 50 },
    { label: '50 - 100 DT', min: 50, max: 100 },
    { label: '100 - 200 DT', min: 100, max: 200 },
    { label: '200 - 500 DT', min: 200, max: 500 },
    { label: 'Plus de 500 DT', min: 500, max: 10000 },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose'];

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres</h3>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Catégories</h4>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Prix</h4>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange?.min === range.min &&
                  filters.priceRange?.max === range.max
                }
                onChange={() => handlePriceChange(range.min, range.max)}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-medium mb-3">Tailles</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 border rounded ${
                (filters.sizes || []).includes(size)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-3">Couleurs</h4>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.colors || []).includes(color)}
                onChange={() => handleColorChange(color)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <span className="ml-2 text-sm text-gray-700">En stock uniquement</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
        <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;
