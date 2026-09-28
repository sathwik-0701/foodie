import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import OrderTimeline from '../components/OrderTimeline';
import { Bike, PhoneCall, MapPin, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    // Auto polling every 10 seconds for live order tracking status
    const interval = setInterval(() => {
      fetchOrderDetails(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetails = async (isPoll = false) => {
    try {
      if (!isPoll) setLoading(true);
      const res = await orderApi.getById(id);
      if (res.success) setOrder(res.data);
    } catch (err) {
      console.error('Fetch order detail error:', err);
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500 mt-4">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 bg-rose-600 text-white font-bold rounded-full text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/profile" className="inline-flex items-center gap-2 font-bold text-sm text-slate-600 hover:text-rose-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/help?orderId=${order.orderId || order._id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 border border-rose-200 transition"
          >
            <span>Food Issue / Need Help?</span>
          </Link>

          <button
            onClick={() => fetchOrderDetails()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            Order #{order.orderId || order._id}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Status: <span className="text-amber-400">{order.orderStatus}</span>
          </h2>
          <p className="text-xs text-slate-300">
            Estimated Delivery Time: <span className="font-bold text-white">{order.estimatedDeliveryTime || '30 min'}</span>
          </p>
        </div>

        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400 shrink-0">
          <Bike className="w-8 h-8" />
        </div>
      </div>

      {/* Animated Order Tracking Progress */}
      <OrderTimeline currentStatus={order.orderStatus} timeline={order.timeline} />

      {/* Delivery Partner Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-lg">
            R
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Rahul Verma</h4>
            <p className="text-xs text-slate-500">Your assigned delivery executive</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 hover:bg-emerald-100 transition">
          <PhoneCall className="w-4 h-4" />
          Call Delivery Partner
        </button>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ordered Items */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            Order Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-rose-600 font-bold">{item.quantity}x</span>
                  <span className="text-slate-800">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between font-extrabold text-sm text-slate-900">
            <span>Total Paid</span>
            <span className="text-rose-600">₹{order.grandTotal}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            Delivery Address
          </h4>
          {order.deliveryAddress && (
            <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
              <p className="font-bold text-slate-900">{order.deliveryAddress.name}</p>
              <p>{order.deliveryAddress.flat}, {order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
              <p className="font-semibold text-slate-800 pt-1">Phone: {order.deliveryAddress.phone}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
