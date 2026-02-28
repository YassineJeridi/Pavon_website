// frontend/src/components/client/common/WishlistSidebar.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Heart, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../../../hooks/useWishlist';
import { useCart } from '../../../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getProductImageUrl } from '../../../utils/imageUtils';

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    showNotif('Retiré des favoris');
  };

  const handleAddToCart = async (product) => {
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;

    const color = hasColors ? product.colors[0] : 'default';
    const size = hasSizes ? product.sizes[0] : 'default';

    const result = await addToCart(product, 1, color, size);
    if (result.success) {
      showNotif('Ajouté au panier! 🎉', 'success');
    } else {
      showNotif(result.error || 'Erreur', 'error');
    }
  };

  const handleShopClick = () => {
    onClose();
    navigate('/produits');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 z-[60]"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-[#5d1115] fill-[#5d1115]" />
                Mes Favoris ({wishlistCount})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Votre liste est vide</p>
                  <p className="text-gray-400 text-sm mb-6">
                    Ajoutez vos produits préférés ici
                  </p>
                  <button
                    onClick={handleShopClick}
                    className="px-6 py-3 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Link
                      to={`/produits/${item.slug}`}
                      onClick={onClose}
                      className="flex-shrink-0"
                    >
                      <img
                        src={getProductImageUrl(item)}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/produits/${item.slug}`}
                        onClick={onClose}
                      >
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-[#5d1115] transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {item.rating?.average > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {item.rating.average} ({item.rating.count})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-[#5d1115]">
                          {item.price}TND
                        </span>
                        {item.comparePrice && item.comparePrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {item.comparePrice}TND
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Ajouter
                        </button>

                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-3">
                <div className="text-center text-sm text-gray-600 mb-2">
                  {wishlistCount} {wishlistCount === 1 ? 'produit' : 'produits'} dans vos favoris
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continuer vos achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;
