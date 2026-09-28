import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

export default function FilterPanel({ filters, setFilters, cuisines, onClear }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-rose-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Filter Restaurants</h3>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Sort By</h4>
        <div className="flex flex-col gap-2 text-sm font-medium">
          {[
            { id: 'popularity', label: 'Popularity' },
            { id: 'rating', label: 'Highest Rating (4.5+)' },
            { id: 'delivery_time', label: 'Delivery Time' },
            { id: 'price_low', label: 'Price: Low to High' },
            { id: 'price_high', label: 'Price: High to Low' }
          ].map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="sort"
                checked={filters.sort === opt.id}
                onChange={() => setFilters({ ...filters, sort: opt.id })}
                className="accent-rose-600 w-4 h-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Veg Only Toggle */}
      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="space-y-0.5">
            <span className="font-bold text-sm text-slate-900">Pure Veg Only</span>
            <p className="text-xs text-slate-400">Show 100% vegetarian outlets</p>
          </div>
          <input
            type="checkbox"
            checked={filters.isVegOnly}
            onChange={(e) => setFilters({ ...filters, isVegOnly: e.target.checked })}
            className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Cuisines */}
      {cuisines && cuisines.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Cuisine</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, cuisine: '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                !filters.cuisine ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {cuisines.map(c => (
              <button
                key={c}
                onClick={() => setFilters({ ...filters, cuisine: c })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  filters.cuisine === c ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
