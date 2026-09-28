const Order = require('../models/Order');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');
const emailService = require('../services/emailService');

// @desc Place new order
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, itemTotal, deliveryFee, tax, discount, grandTotal, paymentMethod, specialInstructions } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const orderPayload = {
      userId,
      restaurantId,
      items,
      deliveryAddress,
      itemTotal,
      deliveryFee: deliveryFee || 30,
      tax: tax || 0,
      discount: discount || 0,
      grandTotal,
      paymentMethod: paymentMethod || 'MOCK_PAYMENT',
      paymentStatus: 'PAID',
      specialInstructions: specialInstructions || ''
    };

    if (getIsConnected()) {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const timeline = [
        { status: 'PLACED', label: 'Order Placed', timestamp: new Date(), completed: true },
        { status: 'CONFIRMED', label: 'Restaurant Confirmed', completed: false },
        { status: 'PREPARING', label: 'Preparing Food', completed: false },
        { status: 'READY', label: 'Food Ready', completed: false },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', completed: false },
        { status: 'DELIVERED', label: 'Order Delivered', completed: false }
      ];

      const order = await Order.create({ ...orderPayload, orderId, timeline });
      
      // Dispatch order confirmation email
      emailService.sendOrderConfirmationEmail(req.user || { email: 'customer@foodie.com' }, order);

      return res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
    } else {
      const order = mockStore.createOrder(orderPayload);
      emailService.sendOrderConfirmationEmail(req.user || { email: 'customer@foodie.com' }, order);
      return res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get orders for logged in user or admin
// @route GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';
    const role = req.user ? req.user.role : 'USER';

    if (getIsConnected()) {
      let query = role === 'ADMIN' ? {} : { userId };
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      const orders = mockStore.getOrders(role === 'ADMIN' ? null : userId);
      return res.json({ success: true, count: orders.length, data: orders });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get order details by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const order = await Order.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderId: id }] });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    } else {
      const order = mockStore.getOrderById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update order status (Admin / Restaurant Owner)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (getIsConnected()) {
      const order = await Order.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderId: id }] });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.orderStatus = status;
      const statusList = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const targetIdx = statusList.indexOf(status);

      if (targetIdx !== -1) {
        order.timeline.forEach((step, idx) => {
          if (idx <= targetIdx) {
            step.completed = true;
          }
        });
      }
      await order.save();
      return res.json({ success: true, message: `Order status updated to ${status}`, data: order });
    } else {
      const order = mockStore.updateOrderStatus(id, status);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, message: `Order status updated to ${status}`, data: order });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
