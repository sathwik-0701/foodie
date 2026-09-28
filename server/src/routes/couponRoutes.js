const express = require('express');
const { getCoupons, validateCoupon, createCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', protect, authorize('ADMIN'), createCoupon);

module.exports = router;
