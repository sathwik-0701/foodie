const express = require('express');
const { getReviewsByRestaurant, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/restaurant/:restaurantId', getReviewsByRestaurant);
router.post('/', protect, addReview);

module.exports = router;
