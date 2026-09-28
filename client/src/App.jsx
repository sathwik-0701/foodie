import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { ToastProvider } from './components/Toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import LocationModal from './components/LocationModal';
import MobileBottomNav from './components/MobileBottomNav';

import HomePage from './pages/HomePage';
import RestaurantListingPage from './pages/RestaurantListingPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import OffersPage from './pages/OffersPage';
import HelpSupportPage from './pages/HelpSupportPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LocationProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
                <div>
                  <Navbar />
                  <CartDrawer />
                  <AuthModal />
                  <LocationModal />
                  <MobileBottomNav />

                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/restaurants" element={<RestaurantListingPage />} />
                      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/help" element={<HelpSupportPage />} />
                      <Route path="/support" element={<HelpSupportPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                    </Routes>
                  </main>
                </div>

                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </LocationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
