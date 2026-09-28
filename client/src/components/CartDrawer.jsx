import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponApi } from '../api/couponApi';
import { getAssetUrl } from '../assets/assets';
import { useToast } from './Toast';

export default function CartDrawer() {
  const {
    cartItems,
    restaurantName,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getItemTotal,
    deliveryFee,
    tax,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const res = await couponApi.validate(couponCode, getItemTotal());
      if (res.success) {
        applyCoupon(res.coupon, res.discount);
        showSuccess(`Coupon '${res.coupon.code}' applied successfully! Saved ₹${res.discount}`);
        setCouponCode('');
      }
    } catch (err) {
      showError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">Your Cart</h3>
              </div>
              {restaurantName && (
                <p className="text-xs font-semibold text-rose-600 mt-0.5">
                  Ordering from: {restaurantName}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Your cart is empty</h4>
              <p className="text-sm text-slate-500 max-w-xs">
                Good food is always waiting! Explore top restaurants and add your favorite dishes.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-600/20"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAssetUrl(item.image)}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100 bg-slate-50"
                      />
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{item.name}</h5>
                        <p className="text-xs font-extrabold text-slate-800">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="hover:text-rose-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="hover:text-rose-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="p-6 bg-slate-50 border-t border-b border-slate-100 space-y-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>{appliedCoupon.code} applied (-₹{discountAmount})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-rose-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 uppercase tracking-wider focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-slate-900">₹{getItemTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Restaurant Charges</span>
                    <span className="font-semibold text-slate-900">₹{tax}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-rose-600 text-base">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="p-6 bg-white">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
