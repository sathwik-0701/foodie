import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantApi } from '../api/restaurantApi';
import { categoryApi } from '../api/categoryApi';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';
import FilterPanel from '../components/FilterPanel';
import EmptyState from '../components/EmptyState';
import { RestaurantCardSkeleton, CategorySkeleton } from '../components/LoadingSkeleton';
import { Search, SlidersHorizontal, X, Utensils } from 'lucide-react';

export default function RestaurantListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    cuisine: '',
    isVegOnly: false,
    sort: 'popularity'
  });

  useEffect(() => {
    categoryApi.getAll().then(res => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.getAll({
        search: searchQuery,
        cuisine: filters.cuisine,
        isVegOnly: filters.isVegOnly,
        sort: filters.sort
      });
      if (res.success) setRestaurants(res.data || []);
    } catch (err) {
      console.error('Fetch restaurants error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ cuisine: '', isVegOnly: false, sort: 'popularity' });
    setSearchParams({});
  };

  const cuisinesList = categories.map(c => c.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Categories Discovery Carousel */}
      <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Food Categories</h2>
          </div>
          {filters.cuisine && (
            <button
              onClick={() => setFilters({ ...filters, cuisine: '' })}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Show All ({categories.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              isSelected={filters.cuisine === cat.name}
              onClick={() => setFilters({ ...filters, cuisine: filters.cuisine === cat.name ? '' : cat.name })}
            />
          ))}
        </div>
      </div>

      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {filters.cuisine ? `${filters.cuisine} Outlets` : 'Explore Restaurants'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Discover top dining spots near your area</p>
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 font-bold text-sm text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-600" />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by restaurant name, dish, or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 text-sm font-semibold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500 shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            cuisines={cuisinesList}
            onClear={handleClearFilters}
          />
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 relative">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="absolute top-4 right-4 p-2 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                cuisines={cuisinesList}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        )}

        {/* Restaurant List Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => <RestaurantCardSkeleton key={n} />)}
            </div>
          ) : restaurants.length === 0 ? (
            <EmptyState
              title="No restaurants found"
              message="We couldn't find any restaurants matching your search criteria. Try clearing your filters."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(r => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
