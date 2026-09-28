const Coupon = require('../models/Coupon');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

const getCoupons = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const coupons = await Coupon.find({ isActive: true });
      return res.json({ success: true, count: coupons.length, data: coupons });
    } else {
      const coupons = mockStore.getCoupons();
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
  } catch (error) { next(error); }
};

const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || !orderTotal) return res.status(400).json({ success: false, message: 'Code and orderTotal required' });

    if (getIsConnected()) {
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
      if (orderTotal < coupon.minOrder) return res.status(400).json({ success: false, message: `Minimum order total of ₹${coupon.minOrder} required` });

      let discount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discount = Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscount);
      } else {
        discount = Math.min(coupon.discountValue, coupon.maxDiscount);
      }
      return res.json({ success: true, coupon, discount });
    } else {
      const result = mockStore.validateCoupon(code, orderTotal);
      if (!result.valid) return res.status(400).json({ success: false, message: result.message });
      return res.json({ success: true, coupon: result.coupon, discount: result.discount });
    }
  } catch (error) { next(error); }
};

const createCoupon = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const coupon = await Coupon.create(req.body);
      return res.status(201).json({ success: true, data: coupon });
    } else {
      const coupon = { _id: 'coup_' + Date.now(), ...req.body };
      mockStore.coupons.push(coupon);
      return res.status(201).json({ success: true, data: coupon });
    }
  } catch (error) { next(error); }
};

module.exports = { getCoupons, validateCoupon, createCoupon };
