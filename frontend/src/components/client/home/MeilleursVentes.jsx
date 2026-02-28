// frontend/src/components/client/home/MeilleursVentes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Flame, Star } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import productService from '../../../services/productService';

const MeilleursVentes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestsellers();
  }, []);

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const response = await productService.getBestsellers(8);
      const productsData = response?.data || response || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8ddca_1px,transparent_1px),linear-gradient(to_bottom,#e8ddca_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center space-x-3 bg-white border border-[#e8ddca] px-6 py-3 rounded-full mb-6 shadow-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-6 h-6 text-[#5d1115]" />
            </motion.div>
            <span className="text-[#111f35] font-semibold uppercase text-sm tracking-wider">
              Best Sellers
            </span>
            <Flame className="w-5 h-5 text-[#5d1115]" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-[#5d1115]">
              Meilleures Ventes
            </span>
          </h2>
          <p className="text-[#111f35]/70 text-lg max-w-2xl mx-auto">
            Les produits préférés de nos clients, plébiscités pour leur qualité exceptionnelle
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-200 rounded-3xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="relative"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-16"
            >
              <Link to="/produits?sort=bestseller">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-[#5d1115]/50 transition-all duration-300 group"
                >
                  <span>Voir tous les best-sellers</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MeilleursVentes;
