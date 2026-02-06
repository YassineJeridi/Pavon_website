// frontend/src/layout/ClientLayout.jsx

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/client/common/Navbar';
import Footer from '../components/client/common/Footer';
import CartSidebar from '../components/client/common/CartSidebar';
import WishlistSidebar from '../components/client/common/WishlistSidebar';
import TopBanner from '../components/client/home/TopBanner';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ClientLayout = () => {
  const { isCartOpen, closeCart } = useCart();
  const { isWishlistOpen, closeWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBanner />
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={closeWishlist} />
    </div>
  );
};

export default ClientLayout;
