// frontend/src/components/client/common/Navbar.jsx

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemsCount, toggleCart } = useCart();
  const { wishlistCount, toggleWishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleCartClick = (e) => {
    e.preventDefault();
    toggleCart();
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist();
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/produits' },
    { name: 'Collections', path: '/collections' },
    { name: 'À Propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src="/src/assets/Pavon_logo.png"
                    alt="Pavon Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-[#111f35] hover:text-[#5d1115] font-medium transition-colors group"
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5d1115]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistClick}
                className="relative p-2.5 text-gray-700 hover:text-[#5d1115] hover:bg-[#fdf9ee] rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="relative p-2.5 text-gray-700 hover:text-[#5d1115] hover:bg-[#fdf9ee] rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#5d1115]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === link.path
                          ? 'bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {/* Wishlist */}
                  <button
                    onClick={handleWishlistClick}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Favoris</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={handleCartClick}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-medium">Panier</span>
                    </div>
                    {cartItemsCount > 0 && (
                      <span className="bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
