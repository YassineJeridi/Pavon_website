// frontend/src/components/client/home/HeroSection.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bannerService from '../../../services/bannerService';
import { getBannerImageUrl } from '../../../utils/imageUtils';

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getActive('hero');
      const bannersData = response?.data || [];
      setBanners(Array.isArray(bannersData) ? bannersData : []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="relative h-[70vh] bg-[#fdf9ee] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#5d1115] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#111f35] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[70vh] bg-gradient-to-br from-[#111f35] to-[#5d1115] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
   
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              La Mode Qui Vous Inspire
            </p>
            <button
              onClick={() => navigate('/produits')}
              className="inline-flex items-center gap-2 bg-white text-[#5d1115] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#fdf9ee] transition-all transform hover:scale-105 shadow-xl"
            >
              Découvrir
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  // Generate image URL
  const bannerImageUrl = getBannerImageUrl(currentBanner);

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gray-900">
            <img
              src={bannerImageUrl || '/assets/banners/default.jpg'}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Prevent infinite error loop
                if (e.target.src !== '/assets/banners/default.jpg') {
                  e.target.src = '/assets/banners/default.jpg';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl text-white"
              >
                {currentBanner.badge && (
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">{currentBanner.badge}</span>
                  </div>
                )}

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {currentBanner.title}
                </h1>

                {currentBanner.description && (
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    {currentBanner.description}
                  </p>
                )}

                {currentBanner.buttonText && (
                  <button
                    onClick={() => navigate(currentBanner.buttonLink || '/produits')}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                  >
                    {currentBanner.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all transform hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all transform hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${index === currentSlide
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:flex"
      >
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-sm font-medium">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
