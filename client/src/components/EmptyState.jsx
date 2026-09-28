import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your search query or filters to find what you are looking for.', actionLabel, onAction }) {
  return (
    <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
        <SearchX className="w-8 h-8" />
      </div>
      <h4 className="font-extrabold text-slate-900 text-xl">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
