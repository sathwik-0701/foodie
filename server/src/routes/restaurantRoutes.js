const express = require('express');
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), createRestaurant);
router.put('/:id', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), updateRestaurant);
router.delete('/:id', protect, authorize('ADMIN'), deleteRestaurant);

module.exports = router;
