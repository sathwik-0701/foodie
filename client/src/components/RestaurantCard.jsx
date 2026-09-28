import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, Tag } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';
import { useAuth } from '../context/AuthContext';

export default function RestaurantCard({ restaurant }) {
  const { favorites, toggleFavoriteRestaurant } = useAuth();
  const isFav = favorites.some(r => r._id === restaurant._id);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavoriteRestaurant(restaurant._id);
        }}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md text-slate-600 hover:text-rose-600 transition"
      >
        <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Offer Tag */}
      {restaurant.offerText && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {restaurant.offerText}
        </div>
      )}

      {/* Image Link */}
      <Link to={`/restaurant/${restaurant.slug || restaurant._id}`} className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={getAssetUrl(restaurant.image)}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition" />
        
        {/* Rating & Delivery Floating Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
          <div className="flex items-center gap-1 bg-emerald-600 px-2.5 py-1 rounded-lg shadow-sm">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>{restaurant.rating}</span>
            <span className="opacity-80">({restaurant.ratingCount})</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={`/restaurant/${restaurant.slug || restaurant._id}`}>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-rose-600 transition line-clamp-1">
                {restaurant.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs font-medium text-slate-500 mb-3 truncate">
            {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>₹{restaurant.costForTwo} for two</span>
          {restaurant.isVegOnly ? (
            <span className="text-emerald-600 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              Pure Veg
            </span>
          ) : (
            <span className="text-slate-400">Multi-cuisine</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
