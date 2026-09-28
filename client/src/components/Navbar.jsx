import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { ShoppingBag, Search, MapPin, Heart, User, LogOut, ShieldCheck, Menu, X, Tag, Headset, Utensils } from 'lucide-react';
import { assets } from '../assets/assets';

export default function Navbar() {
  const { user, openLoginModal, openRegisterModal, logout, favorites } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const { selectedLocation, setLocationModalOpen } = useLocation();
  const navigate = useNavigate();
  const location = useRouteLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30 group-hover:scale-105 transition">
                <span className="font-extrabold text-xl tracking-wider">F</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition">
                Foodie<span className="text-rose-600">.</span>
              </span>
            </Link>

            {/* Location Selector */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100/80 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-sm font-medium transition border border-transparent hover:border-rose-200"
            >
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="max-w-[150px] truncate">{selectedLocation}</span>
              <img src={assets.selector_icon} alt="select" className="w-3 h-3 opacity-60 ml-1" />
            </button>
          </div>

          {/* Middle: Quick Links / Search */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link
              to="/restaurants"
              className={`hover:text-rose-600 transition flex items-center gap-1.5 ${location.pathname === '/restaurants' ? 'text-rose-600 font-bold' : ''}`}
            >
              <Utensils className="w-4 h-4 text-rose-500" />
              Food Menu
            </Link>
            <Link
              to="/restaurants"
              className={`hover:text-rose-600 transition flex items-center gap-1.5 ${location.pathname === '/restaurants' ? 'text-rose-600 font-bold' : ''}`}
            >
              <Search className="w-4 h-4" />
              Explore Restaurants
            </Link>
            <Link
              to="/offers"
              className={`hover:text-rose-600 transition flex items-center gap-1.5 ${location.pathname === '/offers' ? 'text-rose-600 font-bold' : ''}`}
            >
              <Tag className="w-4 h-4 text-amber-500" />
              Deals & Offers
            </Link>
            <Link
              to="/help"
              className={`hover:text-rose-600 transition flex items-center gap-1.5 ${location.pathname === '/help' ? 'text-rose-600 font-bold' : ''}`}
            >
              <Headset className="w-4 h-4 text-rose-500" />
              Help & Support
            </Link>
          </nav>

          {/* Right: Actions (Cart, Favorites, Profile) */}
          <div className="flex items-center gap-3">
            {/* Favorites Icon */}
            <Link
              to="/profile?tab=favorites"
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-rose-600 transition"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-500/20 active:scale-95 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-rose-600 text-xs font-bold">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile & Orders
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegisterModal}
                  className="px-4 py-2 rounded-full font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => { setLocationModalOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-sm font-medium text-slate-800"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{selectedLocation}</span>
          </button>

          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
          >
            <Utensils className="w-5 h-5 text-rose-500" />
            Food Menu
          </Link>

          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
          >
            <Search className="w-5 h-5 text-slate-500" />
            Explore Restaurants
          </Link>

          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
          >
            <Tag className="w-5 h-5 text-amber-500" />
            Deals & Offers
          </Link>

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl font-bold bg-rose-600 text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => { openRegisterModal(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl font-bold bg-slate-100 text-slate-800"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
