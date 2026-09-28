const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', optionalAuth, getOrderById);
router.put('/:id/status', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), updateOrderStatus);

module.exports = router;
