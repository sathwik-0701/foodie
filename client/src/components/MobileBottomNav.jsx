import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Tag, Headset, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalCount, setIsCartOpen } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Menu', path: '/restaurants', icon: Utensils },
    { label: 'Deals', path: '/offers', icon: Tag },
    { label: 'Help', path: '/help', icon: Headset }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition ${
              isActive ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Cart Quick Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 text-slate-500 hover:text-rose-600 transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-rose-600" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </div>
        <span className="text-rose-600">Cart</span>
      </button>
    </div>
  );
}
