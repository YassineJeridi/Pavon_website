// frontend/src/components/client/home/NosCategories.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3x3, ArrowRight, Sparkles } from 'lucide-react';
import categoryService from '../../../services/categoryService';

const NosCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      const categoriesData = response?.data || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get proper image URL
  const getCategoryImageUrl = (category) => {
    if (!category?.image) return null;
    
    // If already a full URL
    if (category.image.startsWith('http://') || category.image.startsWith('https://')) {
      return category.image;
    }
    
    // If starts with /, prepend API base URL
    if (category.image.startsWith('/')) {
      return `${API_URL}${category.image}`;
    }
    
    // Otherwise assume it needs /uploads/ prefix
    return `${API_URL}/uploads/${category.image}`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-[#e8ddca] text-[#5d1115] px-4 py-2 rounded-full mb-4">
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm font-medium">Nos Catégories</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-[#111f35]">Explorez Par Catégorie</h2>
          <p className="text-[#111f35]/70 max-w-2xl mx-auto">
            Découvrez notre sélection organisée par style et occasion
          </p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl h-[500px] animate-pulse"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={category._id} to={`/produits?category=${category._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    {category.image ? (
                      <motion.img
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.8 }}
                        src={getCategoryImageUrl(category)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Category image failed to load:', category.image);
                          e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-purple-300" />
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-[#e8ddca] transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/90 mb-6 text-lg leading-relaxed group-hover:text-white transition-colors line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="inline-flex items-center space-x-2 text-white font-semibold text-lg"
                      >
                        <span>Découvrir</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300" />
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune catégorie disponible</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NosCategories;
