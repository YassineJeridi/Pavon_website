// frontend/src/components/client/home/TopBanner.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import topBannerService from '../../../services/topBannerService';

const TopBanner = () => {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if banner was closed in this session
    const bannerClosed = sessionStorage.getItem('topBannerClosed');
    if (bannerClosed) {
      setIsVisible(false);
      setIsClosed(true);
      return;
    }

    fetchBanner();

    // Handle scroll to hide banner
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await topBannerService.getActive();
      if (response && response.isActive) {
        setBanner(response);
        setIsVisible(true);
      } else {
        setIsClosed(true);
      }
    } catch (error) {
      console.error('Error fetching top banner:', error);
      // Don't show banner if there's an error
      setIsClosed(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('topBannerClosed', 'true');
    setTimeout(() => setIsClosed(true), 300);
  };

  if (isClosed || !banner || isScrolled) return null;

  return (
    <AnimatePresence>
      {isVisible && !isScrolled && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-[#5d1115] to-[#111f35] text-white py-2.5 relative overflow-hidden fixed top-0 left-0 right-0 z-50 shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center justify-center">
                {banner.link ? (
                  <a
                    href={banner.link}
                    className="text-sm md:text-base font-medium text-center hover:underline cursor-pointer"
                  >
                    {banner.text}
                  </a>
                ) : (
                  <p className="text-sm md:text-base font-medium text-center">
                    {banner.text}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="ml-4 p-1.5 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Fermer la bannière"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopBanner;
