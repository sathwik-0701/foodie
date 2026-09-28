import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { restaurantApi } from '../api/restaurantApi';
import { menuApi } from '../api/menuApi';
import { orderApi } from '../api/orderApi';
import { categoryApi } from '../api/categoryApi';
import { Users, Store, ShoppingBag, DollarSign, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminDashboard() {
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  // Forms
  const [newRestaurant, setNewRestaurant] = useState({ name: '', cuisine: 'Salad', costForTwo: 300, image: '/assets/food_1.png', offerText: '' });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', restaurantId: '', category: 'Salad', price: 150, image: '/assets/food_1.png', isVeg: true });

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, restRes, menuRes, ordersRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        restaurantApi.getAll(),
        menuApi.getMenuItems(),
        orderApi.getOrders(),
        adminApi.getUsers()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (restRes.success) setRestaurants(restRes.data || []);
      if (menuRes.success) setMenuItems(menuRes.data || []);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await restaurantApi.create(newRestaurant);
      if (res.success) {
        showSuccess(`Restaurant '${res.data.name}' added successfully!`);
        setRestaurants([...restaurants, res.data]);
        setNewRestaurant({ name: '', cuisine: 'Salad', costForTwo: 300, image: '/assets/food_1.png', offerText: '' });
      }
    } catch (err) {
      showError(err.message || 'Failed to add restaurant');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const res = await restaurantApi.delete(id);
      if (res.success) {
        setRestaurants(restaurants.filter(r => r._id !== id));
        showSuccess('Restaurant deleted!');
      }
    } catch (err) {
      showError(err.message || 'Failed to delete restaurant');
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    if (!newMenuItem.restaurantId) {
      return showError('Please select a target restaurant');
    }
    try {
      const res = await menuApi.create(newMenuItem);
      if (res.success) {
        showSuccess(`Menu Item '${res.data.name}' added successfully!`);
        setMenuItems([...menuItems, res.data]);
        setNewMenuItem({ name: '', restaurantId: '', category: 'Salad', price: 150, image: '/assets/food_1.png', isVeg: true });
      }
    } catch (err) {
      showError(err.message || 'Failed to add menu item');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await orderApi.updateStatus(orderId, newStatus);
      if (res.success) {
        showSuccess(`Order status updated to ${newStatus}`);
        setOrders(orders.map(o => o._id === orderId || o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      showError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage restaurants, menu items, orders & users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {[
          { id: 'stats', label: 'Overview & Stats' },
          { id: 'restaurants', label: `Restaurants (${restaurants.length})` },
          { id: 'menu', label: `Menu Items (${menuItems.length})` },
          { id: 'orders', label: `Order Manager (${orders.length})` },
          { id: 'users', label: `Users (${users.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-5 font-bold text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Stats Cards */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Registered Users</p>
              <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Active Outlets</p>
              <p className="text-2xl font-black text-slate-900">{stats.totalRestaurants}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Platform Orders</p>
              <p className="text-2xl font-black text-slate-900">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
              <p className="text-2xl font-black text-slate-900">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          {/* Add Restaurant Form */}
          <form onSubmit={handleCreateRestaurant} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 max-w-2xl">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600" />
              Add New Restaurant
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
              <input
                type="text"
                required
                placeholder="Cuisine (e.g. Salad, Pure Veg)"
                value={newRestaurant.cuisine}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
              <input
                type="number"
                required
                placeholder="Cost for two (₹)"
                value={newRestaurant.costForTwo}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, costForTwo: Number(e.target.value) })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Offer Text (e.g. 20% OFF)"
                value={newRestaurant.offerText}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, offerText: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Add Restaurant
            </button>
          </form>

          {/* Restaurant Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Cuisine</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Cost for Two</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {restaurants.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{r.name}</td>
                    <td className="p-4">{Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine}</td>
                    <td className="p-4 font-bold text-emerald-600">{r.rating}</td>
                    <td className="p-4">₹{r.costForTwo}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteRestaurant(r._id)}
                        className="text-rose-600 hover:underline font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateMenuItem} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 max-w-2xl">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600" />
              Add Menu Item
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={newMenuItem.restaurantId}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, restaurantId: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
              >
                <option value="">Select Target Restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Item Name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
              <input
                type="number"
                required
                placeholder="Price (₹)"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Category (e.g. Salad, Rolls, Desserts)"
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Add Dish
            </button>
          </form>

          {/* Menu Items Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {menuItems.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{m.name}</td>
                    <td className="p-4">{m.category}</td>
                    <td className="p-4 font-bold text-slate-900">₹{m.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.isVeg ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {m.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Manager Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">#{o.orderId || o._id}</td>
                  <td className="p-4 font-bold text-rose-600">₹{o.grandTotal}</td>
                  <td className="p-4 font-bold">{o.orderStatus}</td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(o.orderId || o._id, e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs"
                    >
                      {['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white uppercase">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
