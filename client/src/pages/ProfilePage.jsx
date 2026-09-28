import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { userApi } from '../api/userApi';
import RestaurantCard from '../components/RestaurantCard';
import { User, ShoppingBag, MapPin, Heart, Shield, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, logout, favorites, fetchFavorites } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const res = await orderApi.getOrders();
        if (res.success) setOrders(res.data || []);
      } else if (activeTab === 'addresses') {
        const res = await userApi.getAddresses();
        if (res.success) setAddresses(res.data || []);
      } else if (activeTab === 'favorites') {
        fetchFavorites();
      }
    } catch (err) {
      console.error('Fetch profile data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await userApi.deleteAddress(id);
      if (res.success) {
        setAddresses(addresses.filter(a => a._id !== id));
        showSuccess('Address deleted!');
      }
    } catch (err) {
      showError(err.message || 'Failed to delete address');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-sm text-slate-500">Sign in to view your profile, order history & saved addresses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 text-white font-black text-3xl flex items-center justify-center shadow-lg border-4 border-white/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user.email} • Ph: {user.phone || 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {[
          { id: 'orders', label: 'Order History', icon: ShoppingBag },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'favorites', label: 'Favorites Wishlist', icon: Heart }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 px-5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab View Content */}
      <div>
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">No orders placed yet</h4>
                <p className="text-xs text-slate-500">Order your favorite meal today!</p>
              </div>
            ) : (
              orders.map(o => (
                <div key={o._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">Order #{o.orderId || o._id}</span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {o.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {o.items?.length || 1} items • Total: <span className="font-extrabold text-slate-900">₹{o.grandTotal}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to={`/order-tracking/${o.orderId || o._id}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition"
                  >
                    <span>Track Live Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map(a => (
              <div key={a._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white uppercase">
                    {a.type}
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {a.flat}, {a.street}, {a.city}, {a.state} - {a.postalCode}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Phone: {a.phone}</p>
                </div>

                <button
                  onClick={() => handleDeleteAddress(a._id)}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-2 border-t border-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Address
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">No favorites added</h4>
                <p className="text-xs text-slate-500">Tap the heart icon on any restaurant to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(r => (
                  <RestaurantCard key={r._id} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
