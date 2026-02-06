// frontend/src/components/client/products/QuickOrderModal.jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { getProductImageUrl } from '../../../utils/imageUtils';

const QuickOrderModal = ({ product, isOpen, onClose }) => {
  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const [selectedColor, setSelectedColor] = useState(hasColors ? product.colors[0] : 'default');
  const [selectedSize, setSelectedSize] = useState(hasSizes ? product.sizes[0] : 'default');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock && quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (hasColors && !selectedColor) {
      showNotif('Veuillez sélectionner une couleur', 'error');
      return;
    }

    if (hasSizes && !selectedSize) {
      showNotif('Veuillez sélectionner une taille', 'error');
      return;
    }

    const result = await addToCart(product, quantity, selectedColor, selectedSize);
    if (result.success) {
      showNotif('Produit ajouté au panier avec succès! 🎉', 'success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      showNotif(result.error || 'Erreur lors de l\'ajout au panier', 'error');
    }
  };

  const finalPrice = product.comparePrice && product.comparePrice > product.price
    ? product.price
    : product.price;

  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Notification - Higher z-index */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 z-[99999]"
              >
                <div className={`px-6 py-4 rounded-xl shadow-2xl ${notification.type === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                  }`}>
                  {notification.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99997]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md hover:bg-gray-100 rounded-full transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={getProductImageUrl(product, currentImage)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                      <div className="grid grid-cols-5 gap-2">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImage === index
                              ? 'border-[#5d1115] ring-2 ring-[#e8ddca]'
                              : 'border-gray-200 hover:border-gray-400'
                              }`}
                          >
                            <img
                              src={getProductImageUrl(product, index)}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Product Info */}
                  <div className="space-y-6">
                    {/* Category */}
                    {product.category?.name && (
                      <span className="inline-block text-sm text-[#5d1115] font-semibold uppercase tracking-wider">
                        {product.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {product.name}
                    </h2>

                    {/* Rating */}
                    {product.rating?.average > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-5 h-5 ${index < Math.floor(product.rating.average)
                                ? 'text-[#e8ddca] fill-[#e8ddca]'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">
                          ({product.rating.count} avis)
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3 pb-6 border-b border-gray-200">
                      <span className="text-4xl font-bold bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                        {finalPrice} TND
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-2xl text-gray-400 line-through">
                          {product.comparePrice} TND
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 text-sm">
                      {product.stock > 0 ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-semibold">
                            En stock ({product.stock} disponibles)
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-red-500" />
                          <span className="text-red-700 font-semibold">Rupture de stock</span>
                        </>
                      )}
                    </div>

                    {/* Color Selection */}
                    {hasColors && (
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          Couleur: <span className="text-[#5d1115]">{selectedColor}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {product.colors.map((color, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedColor(color)}
                              className={`relative w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color
                                ? 'border-[#5d1115] ring-2 ring-[#e8ddca]'
                                : 'border-gray-200 hover:border-gray-400'
                                }`}
                              style={{ backgroundColor: color }}
                            >
                              {selectedColor === color && (
                                <Check className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {hasSizes && (
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          Taille: {selectedSize && <span className="text-[#5d1115]">{selectedSize}</span>}
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {product.sizes.map((size) => (
                            <motion.button
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-3 rounded-xl font-bold transition-all ${selectedSize === size
                                ? 'bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-[#fdf9ee] border border-gray-200'
                                }`}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Quantité
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="p-3 text-gray-700 hover:text-[#5d1115] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-5 h-5" />
                          </motion.button>
                          <span className="px-6 text-lg font-bold text-gray-900">{quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={incrementQuantity}
                            disabled={quantity >= product.stock || quantity >= 10}
                            className="p-3 text-gray-700 hover:text-[#5d1115] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <span className="text-sm text-gray-600">
                          Max: {Math.min(product.stock, 10)}
                        </span>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="p-4 bg-gradient-to-r from-[#fdf9ee] to-[#e8ddca] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                          {(finalPrice * quantity).toFixed(2)} TND
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="w-full py-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="w-6 h-6" />
                      {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default QuickOrderModal;
