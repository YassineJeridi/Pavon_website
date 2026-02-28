// frontend/src/components/client/products/ProductCard.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Plus,
  Star,
  Zap,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import QuickOrderModal from './QuickOrderModal';
import { getImageUrl } from '../../../utils/imageUtils';

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [notification, setNotification] = useState(null);

  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Parse stored color string "Label|#hex" or legacy French name
  const frenchColorMap = {
    'Noir': '#000000', 'Blanc': '#FFFFFF', 'Rouge': '#E53E3E', 'Bleu': '#3B82F6',
    'Vert': '#22C55E', 'Jaune': '#EAB308', 'Rose': '#EC4899', 'Gris': '#6B7280',
    'Marron': '#92400E', 'Orange': '#F97316', 'Beige': '#D2B48C', 'Crème': '#FFFDD0',
    'Marine': '#1E3A5F', 'Bordeaux': '#800020', 'Camel': '#C19A6B',
  };
  const parseColor = (colorStr) => {
    if (!colorStr) return { label: colorStr, hex: '#cccccc' };
    if (colorStr.includes('|')) {
      const [label, hex] = colorStr.split('|');
      return { label, hex };
    }
    return { label: colorStr, hex: frenchColorMap[colorStr] || colorStr };
  };
  const [selectedColor] = useState(hasColors ? product.colors[0] : 'default');
  const [selectedSize] = useState(hasSizes ? product.sizes[0] : 'default');

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product._id);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImage(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(0);
  };

  const handleQuickOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickOrder(true);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has colors or sizes, open modal
    if (hasColors || hasSizes) {
      setShowQuickOrder(true);
      return;
    }

    // Otherwise add directly
    const result = await addToCart(product, 1, selectedColor, selectedSize);
    if (result.success) {
      showNotif('Produit ajouté au panier avec succès! 🎉', 'success');
    } else {
      showNotif(result.error || 'Erreur lors de l\'ajout au panier', 'error');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id);
      showNotif('Retiré des favoris', 'info');
    } else {
      addToWishlist(product);
      showNotif('Ajouté aux favoris ❤️', 'success');
    }
  };

  const finalPrice = product.comparePrice && product.comparePrice > product.price
    ? product.price
    : product.price;

  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const isNew = product.createdAt &&
    (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) < 30;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl ${notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#111f35] text-white'
              }`}>
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Card */}
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleQuickOrder}
      >
        {/* Image Container - FIXED ASPECT RATIO */}
        <div
          className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={getImageUrl(product.images?.[currentImage]) || '/assets/products/default.jpg'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isNew && (
              <span className="bg-[#5d1115] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3" />
                Nouveau
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-[#5d1115] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {product.featured && !isNew && !discountPercentage && (
              <span className="bg-[#e8ddca] text-[#111f35] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <TrendingUp className="w-3 h-3" />
                Populaire
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-2.5 rounded-full shadow-lg transition-all backdrop-blur-sm ${isWishlisted
                ? 'bg-[#5d1115] text-white'
                : 'bg-white/90 text-gray-700 hover:bg-[#fdf9ee]'
                }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Quick Add Button - Bottom Right */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2 ${isOutOfStock
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white hover:shadow-xl'
              }`}
          >
            {isOutOfStock ? (
              'Rupture de stock'
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Ajouter
              </>
            )}
          </motion.button>

          {/* Low Stock Warning */}
          {isLowStock && (
            <div className="absolute bottom-4 left-4 bg-[#e8ddca] text-[#111f35] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Plus que {product.stock} en stock!
            </div>
          )}
        </div>

        {/* Product Info - FIXED HEIGHT */}
        <div className="p-4 space-y-2">
          {/* Category */}
          {product.category?.name && (
            <p className="text-xs text-[#5d1115] uppercase tracking-wider font-semibold">
              {product.category.name}
            </p>
          )}

          {/* Product Name - FIXED HEIGHT */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-[#5d1115] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating?.average > 0 && product.rating?.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3.5 h-3.5 ${index < Math.floor(product.rating.average)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xl font-bold text-gray-900">
              {finalPrice} TND
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {product.comparePrice} TND
              </span>
            )}
          </div>

          {/* Colors */}
          {hasColors && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-600 font-medium">Couleurs:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((color, index) => {
                  const { label, hex } = parseColor(color);
                  return (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: hex }}
                      title={label}
                    />
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500 ml-1 font-medium">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Order Modal */}
      < QuickOrderModal
        product={product}
        isOpen={showQuickOrder}
        onClose={() => setShowQuickOrder(false)}
      />
    </>
  );
};

export default ProductCard;
