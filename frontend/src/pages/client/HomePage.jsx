// frontend/src/pages/client/HomePage.jsx

import { useEffect } from 'react';
import HeroSection from '../../components/client/home/HeroSection';
import NouvelleCollection from '../../components/client/home/NouvelleCollection';
import FeaturedProducts from '../../components/client/home/FeaturedProducts';
import MeilleursVentes from '../../components/client/home/MeilleursVentes';
import NosCategories from '../../components/client/home/NosCategories';
import CustomerFeedback from '../../components/client/home/CustomerFeedback';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Élégance - Vêtements de Luxe Français';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Has its own animations */}
      <HeroSection />

      {/* Content Sections - Simple, no conflicting animations */}
      <div className="space-y-16 md:space-y-24 py-16">
        <NouvelleCollection />
        <FeaturedProducts />
        <MeilleursVentes />
        <NosCategories />
        <CustomerFeedback />
      </div>
    </div>
  );
};

export default HomePage;
