const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const totalUsers = await User.countDocuments();
      const totalRestaurants = await Restaurant.countDocuments();
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ orderStatus: { $ne: 'DELIVERED' } });
      const orders = await Order.find({ paymentStatus: 'PAID' });
      const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

      const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalRestaurants,
          totalOrders,
          pendingOrders,
          totalRevenue
        },
        recentOrders
      });
    } else {
      const orders = mockStore.orders;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      return res.json({
        success: true,
        stats: {
          totalUsers: mockStore.users.length,
          totalRestaurants: mockStore.restaurants.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.orderStatus !== 'DELIVERED').length,
          totalRevenue
        },
        recentOrders: orders.slice(0, 5)
      });
    }
  } catch (error) { next(error); }
};

const getUsers = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const users = await User.find().select('-password');
      return res.json({ success: true, count: users.length, data: users });
    } else {
      return res.json({ success: true, count: mockStore.users.length, data: mockStore.users });
    }
  } catch (error) { next(error); }
};

module.exports = { getDashboardStats, getUsers };
