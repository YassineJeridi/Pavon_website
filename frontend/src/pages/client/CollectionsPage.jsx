// frontend/src/pages/client/CollectionsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Grid3x3,
  Package,
  TrendingUp,
  Flame,
  Star
} from 'lucide-react';
import { collectionService } from '../../services/collectionService';
import { getCollectionImageUrl } from '../../utils/imageUtils';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    document.title = 'Nos Collections - Élégance';
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getAllCollections();

      // Backend returns {success: true, data: [...collections]}
      // Axios wraps it in response.data
      const collectionsData = response?.data?.data || response?.data || [];

      setCollections(Array.isArray(collectionsData) ? collectionsData : []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  // Featured badge icons
  const badges = [
    { icon: Flame, color: 'from-[#5d1115] to-[#5d1115]', label: 'Hot' },
    { icon: Star, color: 'from-[#e8ddca] to-[#e8ddca]', label: 'Popular' },
    { icon: TrendingUp, color: 'from-[#111f35] to-[#111f35]', label: 'Trending' },
    { icon: Sparkles, color: 'from-[#5d1115] to-[#111f35]', label: 'New' },
  ];

  return (
    <div className="min-h-screen bg-[#fdf9ee] overflow-hidden">
      {/* Animated Background with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf9ee] via-[#e8ddca]/20 to-[#fdf9ee]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-10 w-96 h-96 bg-[#5d1115]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-[#e8ddca]/30 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Hero Header */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm mb-8"
          >
            <Link to="/" className="text-gray-500 hover:text-[#5d1115] transition-colors font-medium">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">Collections</span>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-white border border-[#e8ddca] px-6 py-3 rounded-full mb-6"
            >
              <Grid3x3 className="w-5 h-5 text-[#5d1115]" />
              <span className="text-[#111f35] font-semibold uppercase text-sm tracking-wider">
                Découvrez nos univers
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="text-[#111f35]">
                Nos Collections
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Chaque collection raconte une histoire unique. Explorez nos univers soigneusement
              conçus pour révéler votre style et votre personnalité.
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-20 text-white"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,64 C240,90 480,110 720,100 C960,90 1200,70 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading State
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-200 rounded-3xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : collections.length > 0 ? (
            // Collections Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => {
                const randomBadge = badges[index % badges.length];
                const BadgeIcon = randomBadge.icon;

                return (
                  <Link key={collection._id} to={`/produits?collection=${collection._id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -15, scale: 1.02 }}
                      className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    >
                      {/* Image with Ken Burns Effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          src={getCollectionImageUrl(collection) || collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Collection image failed to load:', collection.image);
                            e.target.src = 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80';
                          }}
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Featured Badge */}
                      {index < 3 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.2 + 0.5, type: 'spring' }}
                          className={`absolute top-6 right-6 bg-gradient-to-br ${randomBadge.color} text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 font-bold text-sm z-10`}
                        >
                          <BadgeIcon className="w-4 h-4" />
                          <span>{randomBadge.label}</span>
                        </motion.div>
                      )}

                      {/* Content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          {/* Collection Name */}
                          <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                            {collection.name}
                          </h3>

                          {/* Description */}
                          {collection.description && (
                            <p className="text-white/90 mb-6 text-lg leading-relaxed group-hover:text-white transition-colors line-clamp-2">
                              {collection.description}
                            </p>
                          )}

                          {/* CTA Button */}
                          <motion.div
                            whileHover={{ x: 10 }}
                            className="inline-flex items-center space-x-3 text-white font-bold text-lg"
                          >
                            <span>Découvrir la collection</span>
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Hover Border Effect */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 border-4 border-white/40 rounded-3xl pointer-events-none"
                      />

                      {/* Shine Effect on Hover */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package className="w-24 h-24 text-purple-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Aucune collection disponible
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Nos créateurs travaillent sur de nouvelles collections passionnantes.
                Revenez bientôt !
              </p>
              <Link to="/produits">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <span>Voir tous les produits</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 bg-gradient-to-br from-[#5d1115] via-[#111f35] to-[#5d1115] overflow-hidden"
      >
        {/* Animated Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#5d1115] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#111f35] rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Créez Votre Style Unique
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 mb-10 leading-relaxed"
          >
            Mélangez et associez des pièces de différentes collections pour un look qui vous ressemble.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/produits">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-white text-[#5d1115] px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all"
              >
                <span>Explorer tous les produits</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default CollectionsPage;
