// frontend/src/pages/client/ProductDetailsPage.jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, PackageCheck, TruckIcon } from 'lucide-react';
import { useProduct, useRecommendations } from '../../hooks/useProducts';
import ProductDetails from '../../components/client/products/ProductDetails';
import ProductCard from '../../components/client/products/ProductCard';
import Loader from '../../components/client/ui/Loader';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { products: recommendations, loading: loadingRecs } = useRecommendations(product?._id);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Pavone Collection`;
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9ee]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-4 border-4 border-[#5d1115] border-t-transparent rounded-full"
          />
          <p className="text-gray-600 font-medium">Chargement du produit...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-red-100"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PackageCheck className="w-20 h-20 mx-auto text-red-400 mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <p className="text-gray-600 mb-8">
            Désolé, ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Link to="/produits">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voir tous les produits</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9ee]">
      {/* Premium Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-30 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#5d1115] transition-colors font-medium">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/produits" className="text-gray-500 hover:text-[#5d1115] transition-colors font-medium">
              Produits
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Product Details with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <ProductDetails product={product} />
        </div>

        {/* Premium Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: TruckIcon, title: 'Livraison Gratuite', desc: 'À partir de 200 TND' },
            { icon: PackageCheck, title: 'Retours Gratuits', desc: 'Sous 30 jours' },
            { icon: Sparkles, title: 'Qualité Premium', desc: '100% Authentique' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -5 }}
              className="flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-lg border border-[#e8ddca]"
            >
              <div className="p-3 bg-[#5d1115] rounded-xl">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-b from-transparent to-purple-50/50 py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Vous Aimerez Aussi
                </h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez notre sélection de produits similaires choisis spécialement pour vous
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
