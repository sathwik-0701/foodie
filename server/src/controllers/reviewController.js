const Review = require('../models/Review');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

const getReviewsByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    if (getIsConnected()) {
      const reviews = await Review.find({ restaurantId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: reviews.length, data: reviews });
    } else {
      const reviews = mockStore.getReviews(restaurantId);
      return res.json({ success: true, count: reviews.length, data: reviews });
    }
  } catch (error) { next(error); }
};

const addReview = async (req, res, next) => {
  try {
    const { restaurantId, rating, comment, orderId } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    if (getIsConnected()) {
      const review = await Review.create({
        userId,
        userName,
        restaurantId,
        rating,
        comment,
        orderId
      });
      return res.status(201).json({ success: true, data: review });
    } else {
      const review = mockStore.addReview({ userId, userName, restaurantId, rating, comment, orderId });
      return res.status(201).json({ success: true, data: review });
    }
  } catch (error) { next(error); }
};

module.exports = { getReviewsByRestaurant, addReview };
