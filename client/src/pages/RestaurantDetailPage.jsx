import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import { menuApi } from '../api/menuApi';
import { reviewApi } from '../api/reviewApi';
import FoodCard from '../components/FoodCard';
import { Star, Clock, MapPin, Tag, Heart, Share2, MessageSquare } from 'lucide-react';
import { getAssetUrl } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { favorites, toggleFavoriteRestaurant } = useAuth();
  const { showSuccess } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'reviews'
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRestaurantDetail();
  }, [id]);

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      const restRes = await restaurantApi.getById(id);
      if (restRes.success) {
        setRestaurant(restRes.data);
        const rId = restRes.data._id;
        
        const [menuRes, reviewRes] = await Promise.all([
          menuApi.getMenuItems({ restaurantId: rId }),
          reviewApi.getByRestaurant(rId)
        ]);

        if (menuRes.success) setMenuItems(menuRes.data || []);
        if (reviewRes.success) setReviews(reviewRes.data || []);
      }
    } catch (err) {
      console.error('Fetch restaurant details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewApi.addReview({
        restaurantId: restaurant._id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      if (res.success) {
        showSuccess('Thank you for sharing your review!');
        setReviews([res.data, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500 mt-4">Loading restaurant menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Restaurant Not Found</h2>
      </div>
    );
  }

  const isFav = favorites.some(r => r._id === restaurant._id);
  const categoriesList = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredMenuItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pb-20 space-y-8">
      
      {/* Cover Image & Header Banner */}
      <section className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={getAssetUrl(restaurant.coverImage || restaurant.image)}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider">
                {restaurant.isVegOnly ? 'Pure Veg' : 'Multi-cuisine'}
              </span>
              {restaurant.offerText && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  {restaurant.offerText}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{restaurant.name}</h1>
            <p className="text-sm text-slate-300 font-medium">
              {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant._id)}
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showSuccess('Link copied to clipboard!');
              }}
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Info Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
              <Star className="w-6 h-6 fill-emerald-600" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">{restaurant.rating} / 5</p>
              <p className="text-xs font-semibold text-slate-400">{restaurant.ratingCount}+ verified ratings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">{restaurant.deliveryTime}</p>
              <p className="text-xs font-semibold text-slate-400">Estimated delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">₹{restaurant.costForTwo}</p>
              <p className="text-xs font-semibold text-slate-400">Cost for two people</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Location</p>
              <p className="text-xs font-semibold text-slate-400 max-w-[160px] truncate">
                {restaurant.address?.street || 'Marine Drive, Mumbai'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs (Menu vs Reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-4 px-6 font-extrabold text-base border-b-2 transition ${
              activeTab === 'menu'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Full Menu ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-6 font-extrabold text-base border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews & Ratings ({reviews.length})
          </button>
        </div>
      </section>

      {/* Main Content View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'menu' ? (
          <div className="space-y-6">
            
            {/* Menu Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenuItems.map(item => (
                <FoodCard
                  key={item._id}
                  food={item}
                  restaurantId={restaurant._id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Reviews Section */
          <div className="space-y-8">
            
            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 max-w-xl">
              <h4 className="font-extrabold text-slate-900 text-base">Write a Customer Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Your Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1"
                  >
                    <Star className={`w-5 h-5 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                required
                placeholder="Share your dining experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-3 text-sm font-semibold rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-sm">{rev.userName}</h5>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 font-bold text-xs border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
