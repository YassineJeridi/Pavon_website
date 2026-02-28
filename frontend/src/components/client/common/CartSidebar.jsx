// frontend/src/components/client/common/CartSidebar.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../../../utils/imageUtils';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, cartItemsCount, cartSubtotal, updateCartItem, removeFromCart } = useCart();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              <h2 className="text-2xl font-bold text-gray-900">
                Panier ({cartItemsCount})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart?.items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Votre panier est vide</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 bg-[#5d1115] text-white rounded-xl font-semibold hover:bg-[#111f35] transition-colors"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                cart?.items?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={getProductImageUrl(item.product)}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product?.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <span>Taille: {item.size}</span> • <span>Couleur: {item.color}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="font-bold text-[#5d1115]">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors h-fit"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart?.items?.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-900">Sous-total:</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                    {cartSubtotal.toFixed(2)} TND
                  </span>
                </div>

                <Link to="/checkout" onClick={onClose}>
                  <button className="w-full py-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
                    Commander
                  </button>
                </Link>

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

export default CartSidebar;
