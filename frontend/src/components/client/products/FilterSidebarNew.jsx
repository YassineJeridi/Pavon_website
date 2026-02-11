// frontend/src/components/client/products/FilterSidebarNew.jsx

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Tag, Grid, Palette, Ruler, Package } from 'lucide-react';
import categoryService from '../../../services/categoryService';
import { collectionService } from '../../../services/collectionService';

// Extracted outside the component to maintain a stable component identity across renders.
// This prevents React from unmounting/remounting filter sections when the parent re-renders.
const FilterSection = ({ title, icon: Icon, section, children, expandedSections, onToggle }) => (
    <div className="border-b border-gray-200 last:border-0">
        <button
            onClick={() => onToggle(section)}
            className="w-full flex items-center justify-between py-4 hover:text-[#5d1115] transition-colors"
        >
            <div className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-[#5d1115]" />
                <span className="font-semibold text-gray-900">{title}</span>
            </div>
            {expandedSections[section] ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
        </button>

        <AnimatePresence>
            {expandedSections[section] && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="pb-4 space-y-3">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FilterSidebarNew = memo(({ filters, onFilterChange, onClose, isMobile = false }) => {
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        collections: true,
        price: true,
        sizes: true,
        numericSizes: true,
        colors: true
    });

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            setLoading(true);
            const [categoriesRes, collectionsRes] = await Promise.all([
                categoryService.getAll(),
                collectionService.getAllCollections()
            ]);

            const categoriesData = categoriesRes?.data || categoriesRes || [];
            // Backend returns {success: true, data: [...collections]}
            // Axios wraps it in response.data, so actual array is at response.data.data
            const collectionsData = collectionsRes?.data?.data || collectionsRes?.data || [];

            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setCollections(Array.isArray(collectionsData) ? collectionsData : []);
        } catch (error) {
            console.error('Error fetching filter options:', error);
            setCategories([]);
            setCollections([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = useCallback((section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    const handleCategoryChange = (categoryId) => {
        const currentCategories = filters.categories || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(id => id !== categoryId)
            : [...currentCategories, categoryId];

        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleCollectionChange = (collectionId) => {
        const currentCollections = filters.collections || [];
        const newCollections = currentCollections.includes(collectionId)
            ? currentCollections.filter(id => id !== collectionId)
            : [...currentCollections, collectionId];

        onFilterChange({ ...filters, collections: newCollections });
    };

    const handlePriceRangeChange = (min, max) => {
        onFilterChange({ 
            ...filters, 
            priceRange: { min, max } 
        });
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
            collections: [],
            priceRange: { min: 0, max: 10000 },
            sizes: [],
            numericSizes: [],
            colors: [],
        });
    };

    const priceRanges = [
        { label: 'Moins de 50 TND', min: 0, max: 50 },
        { label: '50 - 100 TND', min: 50, max: 100 },
        { label: '100 - 200 TND', min: 100, max: 200 },
        { label: '200 - 500 TND', min: 200, max: 500 },
        { label: '500 - 1000 TND', min: 500, max: 1000 },
        { label: 'Plus de 1000 TND', min: 1000, max: 10000 },
    ];

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const numericSizes = ['34', '36', '38', '40', '42', '44', '46', '48'];

    const handleNumericSizeChange = (size) => {
        const currentNumericSizes = filters.numericSizes || [];
        const newNumericSizes = currentNumericSizes.includes(size)
            ? currentNumericSizes.filter(s => s !== size)
            : [...currentNumericSizes, size];

        onFilterChange({ ...filters, numericSizes: newNumericSizes });
    };

    const colorOptions = [
        { name: 'Noir', hex: '#000000' },
        { name: 'Blanc', hex: '#FFFFFF' },
        { name: 'Rouge', hex: '#EF4444' },
        { name: 'Bleu', hex: '#3B82F6' },
        { name: 'Vert', hex: '#10B981' },
        { name: 'Jaune', hex: '#F59E0B' },
        { name: 'Rose', hex: '#EC4899' },
        { name: 'Gris', hex: '#6B7280' },
    ];

    const activeFiltersCount =
        (filters.categories?.length || 0) +
        (filters.collections?.length || 0) +
        (filters.sizes?.length || 0) +
        (filters.numericSizes?.length || 0) +
        (filters.colors?.length || 0) +
        (filters.priceRange?.min > 0 || filters.priceRange?.max < 10000 ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
                    {activeFiltersCount > 0 && (
                        <span className="bg-[#5d1115] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Collections Filter */}
            <FilterSection title="Collections" icon={Grid} section="collections" expandedSections={expandedSections} onToggle={toggleSection}>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {collections.map((collection) => (
                            <label
                                key={collection._id}
                                className="flex items-center cursor-pointer group py-1 hover:pl-1 transition-all"
                            >
                                <input
                                    type="checkbox"
                                    checked={(filters.collections || []).includes(collection._id)}
                                    onChange={() => handleCollectionChange(collection._id)}
                                    className="w-4 h-4 text-[#5d1115] border-gray-300 rounded focus:ring-2 focus:ring-[#5d1115]"
                                />
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-[#5d1115] transition-colors">
                                    {collection.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </FilterSection>

            {/* Categories Filter */}
            <FilterSection title="Catégories" icon={Tag} section="categories" expandedSections={expandedSections} onToggle={toggleSection}>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label
                                key={category._id}
                                className="flex items-center cursor-pointer group py-1 hover:pl-1 transition-all"
                            >
                                <input
                                    type="checkbox"
                                    checked={(filters.categories || []).includes(category._id)}
                                    onChange={() => handleCategoryChange(category._id)}
                                    className="w-4 h-4 text-[#5d1115] border-gray-300 rounded focus:ring-2 focus:ring-[#5d1115]"
                                />
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-[#5d1115] transition-colors">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Prix" icon={Tag} section="price" expandedSections={expandedSections} onToggle={toggleSection}>
                <div className="space-y-2">
                    {priceRanges.map((range, index) => {
                        const isSelected = filters.priceRange?.min === range.min && 
                                          filters.priceRange?.max === range.max;
                        return (
                            <label
                                key={index}
                                className="flex items-center cursor-pointer group py-1 hover:pl-1 transition-all"
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                                    className="w-4 h-4 text-[#5d1115] border-gray-300 rounded focus:ring-2 focus:ring-[#5d1115]"
                                />
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-[#5d1115] transition-colors">
                                    {range.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Sizes */}
            <FilterSection title="Tailles" icon={Ruler} section="sizes" expandedSections={expandedSections} onToggle={toggleSection}>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSizeChange(size)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${(filters.sizes || []).includes(size)
                                ? 'bg-[#5d1115] text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-[#fdf9ee] border border-gray-200'
                                }`}
                        >
                            {size}
                        </motion.button>
                    ))}
                </div>
            </FilterSection>

            {/* Colors */}
            <FilterSection title="Couleurs" icon={Palette} section="colors" expandedSections={expandedSections} onToggle={toggleSection}>
                <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                        <motion.button
                            key={color.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleColorChange(color.name)}
                            className={`relative w-10 h-10 rounded-full border-2 transition-all ${(filters.colors || []).includes(color.name)
                                ? 'border-[#5d1115] shadow-lg ring-4 ring-[#e8ddca]'
                                : 'border-gray-300 hover:border-[#5d1115]'
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {(filters.colors || []).includes(color.name) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#5d1115] rounded-full" />
                                    </div>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </FilterSection>

            {/* Numeric Sizes */}
            <FilterSection title="Tailles numériques" icon={Ruler} section="numericSizes" expandedSections={expandedSections} onToggle={toggleSection}>
                <div className="grid grid-cols-4 gap-2">
                    {numericSizes.map((size) => (
                        <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNumericSizeChange(size)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                (filters.numericSizes || []).includes(size)
                                    ? 'bg-[#5d1115] text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-[#fdf9ee] border border-gray-200'
                            }`}
                        >
                            {size}
                        </motion.button>
                    ))}
                </div>
            </FilterSection>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                    <X className="w-4 h-4" />
                    <span>Réinitialiser tous les filtres</span>
                </motion.button>
            )}
        </div>
    );
});

FilterSidebarNew.displayName = 'FilterSidebarNew';

export default FilterSidebarNew;
