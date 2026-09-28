import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, Check, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export default function LocationModal() {
  const { locationModalOpen, setLocationModalOpen, selectedLocation, updateLocation, availableLocations } = useLocation();
  const [customInput, setCustomInput] = useState('');

  if (!locationModalOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      updateLocation(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setLocationModalOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 overflow-hidden z-10 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Select Delivery Location</h3>
          </div>
          <button onClick={() => setLocationModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Type city or area (e.g. Bandra, Mumbai)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
          >
            Save
          </button>
        </form>

        {/* Popular Locations */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Popular Cities</h4>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {availableLocations.map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => updateLocation(loc)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>{loc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
