const express = require('express');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), createMenuItem);
router.put('/:id', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), updateMenuItem);
router.delete('/:id', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), deleteMenuItem);

module.exports = router;
