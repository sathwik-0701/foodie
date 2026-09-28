import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Utensils, ArrowRight, ShieldCheck, Clock, Award, Tag } from 'lucide-react';
import { categoryApi } from '../api/categoryApi';
import { restaurantApi } from '../api/restaurantApi';
import { menuApi } from '../api/menuApi';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { RestaurantCardSkeleton, CategorySkeleton } from '../components/LoadingSkeleton';
import { assets, getAssetUrl } from '../assets/assets';
import { useLocation } from '../context/LocationContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedLocation, setLocationModalOpen } = useLocation();

  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [catRes, restRes, menuRes] = await Promise.all([
        categoryApi.getAll(),
        restaurantApi.getAll(),
        menuApi.getMenuItems()
      ]);

      if (catRes.success) setCategories(catRes.data || []);
      if (restRes.success) setRestaurants(restRes.data || []);
      if (menuRes.success) setPopularDishes((menuRes.data || []).slice(0, 6));
    } catch (err) {
      console.error('Fetch homepage data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredRestaurants = selectedCategory
    ? restaurants.filter(r => r.cuisine.includes(selectedCategory))
    : restaurants;

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-rose-50/30 to-slate-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Premium Food Delivery & Discovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Order gourmet food from top restaurants near <span className="text-rose-600 underline decoration-rose-300 decoration-wavy decoration-2">you.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore authentic cuisines, enjoy lightning fast delivery, and claim exclusive discount codes every day.
            </p>

            {/* Search Bar Container */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto lg:mx-0"
            >
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 text-sm font-semibold border-b sm:border-b-0 sm:border-r border-slate-100 transition shrink-0"
              >
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="max-w-[130px] truncate">{selectedLocation}</span>
              </button>

              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search for restaurants, dishes or cuisines (e.g. Salad, Pizza)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm font-semibold rounded-2xl focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/30 transition active:scale-95 shrink-0"
              >
                Search
              </button>
            </form>

            {/* Features Stats Pill */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>30 Min Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Hygienic Food</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>500+ Top Rated Places</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Media Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 rounded-3xl blur-2xl z-0" />
              <img
                src={assets.header_img}
                alt="Delicious Gourmet Dish"
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Cuisines & Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">What are you craving today?</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5, 6].map(n => <CategorySkeleton key={n} />)}
          </div>
        ) : (
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                isSelected={selectedCategory === cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedCategory ? `${selectedCategory} Outlets` : 'Top Rated Restaurants'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked dining experiences delivered fast
            </p>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-rose-600 hover:text-rose-700 transition"
          >
            <span>See All Outlets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <RestaurantCardSkeleton key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map(r => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Special Promotion
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Get 50% OFF on your first food order!
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Use code <span className="font-bold text-amber-400">WELCOME50</span> at checkout to save up to ₹100 instantly.
            </p>
            <Link
              to="/restaurants"
              className="inline-block px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition"
            >
              Order Now
            </Link>
          </div>

          <div className="shrink-0 z-10">
            <img
              src={assets.food_9}
              alt="Promo Ice Cream"
              className="w-48 sm:w-64 h-auto rounded-2xl shadow-2xl object-cover border-2 border-white/20"
            />
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Popular Dishes Trending Now
          </h2>
          <p className="text-sm text-slate-500 mt-1">Most ordered food items near you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDishes.map(food => (
            <FoodCard
              key={food._id}
              food={food}
              restaurantId={food.restaurantId}
              restaurantName="Popular Kitchen"
            />
          ))}
        </div>
      </section>

      {/* App Download Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 rounded-3xl p-8 sm:p-12 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4 max-w-lg">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Download the Foodie App
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enjoy live order tracking, instant notifications, exclusive mobile coupons, and seamless payments.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <img src={assets.play_store} alt="Play Store" className="h-12 object-contain cursor-pointer hover:scale-105 transition" />
              <img src={assets.app_store} alt="App Store" className="h-12 object-contain cursor-pointer hover:scale-105 transition" />
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white px-6 py-5 rounded-3xl shadow-xl border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 font-black text-3xl">
              F
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block">
                Foodie<span className="text-rose-600">.</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mobile App
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
