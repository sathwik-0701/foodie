import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function FoodCard({ food, restaurantId, restaurantName }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { showSuccess } = useToast();

  const cartItem = cartItems.find(i => i._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    const success = addToCart(food, restaurantId, restaurantName);
    if (success) {
      showSuccess(`Added ${food.name} to cart`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded border flex items-center justify-center p-0.5 ${
            food.isVeg ? 'border-emerald-600' : 'border-rose-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
            }`} />
          </span>
          {food.isBestseller && (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              Bestseller
            </span>
          )}
        </div>

        <h4 className="font-bold text-slate-900 text-base">{food.name}</h4>
        <p className="text-sm font-extrabold text-slate-900">₹{food.price}</p>
        
        {food.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-md">
            {food.description}
          </p>
        )}
      </div>

      {/* Image & Action */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
          <img
            src={getAssetUrl(food.image)}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add / Quantity Control Button */}
        <div className="-mt-5 z-10">
          {quantity > 0 ? (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-600/30 text-sm font-bold">
              <button
                onClick={() => updateQuantity(food._id, -1)}
                className="hover:opacity-80 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => updateQuantity(food._id, 1)}
                className="hover:opacity-80 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-5 py-2 bg-white text-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl shadow-md font-bold text-xs uppercase tracking-wider hover:bg-rose-50 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
