import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from '../assets/assets';

export default function CategoryCard({ category, isSelected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center p-3 sm:p-4 rounded-3xl transition-all duration-300 min-w-[90px] sm:min-w-[110px] ${
        isSelected
          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-600'
          : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-100 shadow-sm'
      }`}
    >
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 p-1 border ${
        isSelected ? 'border-white/40 bg-white/20' : 'border-slate-100 bg-slate-50'
      }`}>
        <img
          src={getAssetUrl(category.image)}
          alt={category.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <span className="font-bold text-xs sm:text-sm text-center tracking-tight truncate w-full">
        {category.name}
      </span>
      {category.itemCount > 0 && (
        <span className={`text-[10px] font-medium opacity-80 mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
          {category.itemCount}+ items
        </span>
      )}
    </motion.button>
  );
}
