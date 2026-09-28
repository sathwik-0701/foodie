import React from 'react';

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse space-y-4 p-4">
      <div className="w-full h-48 bg-slate-200 rounded-2xl" />
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-1/4 pt-2" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-3xl border border-slate-100 animate-pulse min-w-[100px] space-y-2">
      <div className="w-16 h-16 bg-slate-200 rounded-full" />
      <div className="h-3 bg-slate-200 rounded w-12" />
    </div>
  );
}
