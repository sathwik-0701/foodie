import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { orderApi } from '../api/orderApi';
import { useToast } from '../components/Toast';
import { MapPin, Plus, CheckCircle2, CreditCard, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    restaurantId,
    restaurantName,
    getItemTotal,
    deliveryFee,
    tax,
    discountAmount,
    grandTotal,
    clearCart
  } = useCart();
  const { showSuccess, showError } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [newAddressForm, setNewAddressForm] = useState({
    name: user ? user.name : '',
    flat: '',
    street: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    phone: user ? user.phone || '9876543210' : '9876543210',
    type: 'Home'
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MOCK_PAYMENT');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user) {
      userApi.getAddresses().then(res => {
        if (res.success && res.data.length > 0) {
          setAddresses(res.data);
          const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowAddAddress(true);
        }
      });
    } else {
      setShowAddAddress(true);
    }
  }, [user]);

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const res = await userApi.addAddress(newAddressForm);
        if (res.success) {
          setAddresses([...addresses, res.data]);
          setSelectedAddressId(res.data._id);
          setShowAddAddress(false);
          showSuccess('Delivery address saved!');
        }
      } catch (err) {
        showError(err.message || 'Failed to add address');
      }
    } else {
      // Guest mode temporary address
      const tempId = 'addr_temp_' + Date.now();
      const addrObj = { _id: tempId, ...newAddressForm };
      setAddresses([addrObj]);
      setSelectedAddressId(tempId);
      setShowAddAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    const selectedAddr = addresses.find(a => a._id === selectedAddressId) || newAddressForm;
    if (!selectedAddr || (!selectedAddr.flat && !newAddressForm.flat)) {
      return showError('Please select or add a delivery address');
    }

    if (cartItems.length === 0) {
      return showError('Your cart is empty');
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        restaurantId: restaurantId || 'rest_1',
        items: cartItems.map(i => ({
          menuItemId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        deliveryAddress: selectedAddr,
        itemTotal: getItemTotal(),
        deliveryFee,
        tax,
        discount: discountAmount,
        grandTotal,
        paymentMethod
      };

      const res = await orderApi.create(orderPayload);
      if (res.success) {
        showSuccess('Order placed successfully!');
        clearCart();
        navigate(`/order-tracking/${res.data.orderId || res.data._id}`);
      }
    } catch (err) {
      showError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-sm shadow-md"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Delivery Address & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl">Select Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {/* Existing Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;
                return (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white uppercase">
                          {addr.type}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-rose-600" />}
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{addr.name}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {addr.flat}, {addr.street}, {addr.landmark ? addr.landmark + ', ' : ''}{addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-2">Ph: {addr.phone}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Address Form Drawer */}
            {showAddAddress && (
              <form onSubmit={handleAddAddressSubmit} className="pt-4 border-t border-slate-100 space-y-4 max-w-lg">
                <h4 className="font-bold text-slate-900 text-sm">New Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Flat / House No. / Building"
                    value={newAddressForm.flat}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, flat: e.target.value })}
                    className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street / Area / Colony"
                    value={newAddressForm.street}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                    className="p-2.5 text-xs font-semibold rounded-xl border border-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Step 2: Payment Gateway Placeholder */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl">Select Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'MOCK_PAYMENT', title: 'Instant Online Payment (Mock)', desc: 'Test Gateway Provider Placeholder', icon: CreditCard },
                { id: 'UPI', title: 'UPI / GPay / PhonePe', desc: 'Scan & Pay via UPI ID', icon: ShieldCheck },
                { id: 'CARD', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay', icon: CreditCard },
                { id: 'COD', title: 'Cash on Delivery', desc: 'Pay cash to delivery agent', icon: ShieldCheck }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{pm.title}</p>
                      <p className="text-xs text-slate-500">{pm.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4">
              Order Summary
            </h3>

            {restaurantName && (
              <p className="text-xs font-bold text-rose-600">From: {restaurantName}</p>
            )}

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.quantity}x</span>
                    <span className="text-slate-700 font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-slate-900">₹{getItemTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span className="font-bold text-slate-900">₹{tax}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-rose-600">₹{grandTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              {placingOrder ? 'Placing Order...' : 'Pay & Place Order'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
