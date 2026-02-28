// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import ClientLayout from './layout/ClientLayout';
import DashboardLayout from './layout/DashboardLayout';

// Client Pages
import HomePage from './pages/client/HomePage';
import CollectionsPage from './pages/client/CollectionsPage';
import ProductsPage from './pages/client/ProductsPage';
import ProductDetailsPage from './pages/client/ProductDetailsPage';
import ContactPage from './pages/client/ContactPage';
import AboutPage from './pages/client/AboutPage';
import CheckoutPage from './pages/client/CheckoutPage';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardProducts from './pages/dashboard/DashboardProducts';
import DashboardStock from './pages/dashboard/DashboardStock';
import DashboardOrders from './pages/dashboard/DashboardOrders';
import DashboardBanners from './pages/dashboard/DashboardBanners';
import DashboardCollections from './pages/dashboard/DashboardCollections';
import DashboardCategories from './pages/dashboard/DashboardCategories';
import DashboardContacts from './pages/dashboard/DashboardContacts';
import DashboardTestimonials from './pages/dashboard/DashboardTestimonials';
import DashboardTopBanner from './pages/dashboard/DashboardTopBanner';
import DashboardExternalOrders from './pages/dashboard/DashboardExternalOrders';
import DashboardFinancials from './pages/dashboard/DashboardFinancials';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardLogin from './pages/dashboard/DashboardLogin';

// Protected Route Component
import ProtectedRoute from './components/dashboard/common/ProtectedRoute';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Client Routes */}
                <Route path="/" element={<ClientLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="collections" element={<CollectionsPage />} />
                  <Route path="produits" element={<ProductsPage />} />
                  <Route path="produits/:slug" element={<ProductDetailsPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                </Route>

                {/* Dashboard Login (No Layout) */}
                <Route path="/dashboard/login" element={<DashboardLogin />} />

                {/* Dashboard Routes (Protected) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="products" element={<DashboardProducts />} />
                  <Route path="stock" element={<DashboardStock />} />
                  <Route path="orders" element={<DashboardOrders />} />
                  <Route path="banners" element={<DashboardBanners />} />
                  <Route path="top-banner" element={<DashboardTopBanner />} />
                  <Route path="collections" element={<DashboardCollections />} />
                  <Route path="categories" element={<DashboardCategories />} />
                  <Route path="contacts" element={<DashboardContacts />} />
                  <Route path="testimonials" element={<DashboardTestimonials />} />
                  <Route path="external-orders" element={<DashboardExternalOrders />} />
                  <Route path="financials" element={<DashboardFinancials />} />
                  <Route path="settings" element={<DashboardSettings />} />
                  <Route path="settings/create" element={<DashboardSettings />} />
                  <Route path="settings/manage" element={<DashboardSettings />} />
                </Route>

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
