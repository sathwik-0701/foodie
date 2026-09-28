import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Package, Bike, Home, XCircle } from 'lucide-react';

const steps = [
  { status: 'PLACED', label: 'Order Placed', icon: Clock },
  { status: 'CONFIRMED', label: 'Restaurant Confirmed', icon: CheckCircle2 },
  { status: 'PREPARING', label: 'Preparing Food', icon: ChefHat },
  { status: 'READY', label: 'Food Ready', icon: Package },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
  { status: 'DELIVERED', label: 'Order Delivered', icon: Home }
];

export default function OrderTimeline({ currentStatus, timeline }) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
        <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-extrabold text-base">Order Cancelled</h4>
          <p className="text-xs text-rose-600">This order was cancelled. Please contact support if you need assistance.</p>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.status === currentStatus);
  const activeIndex = currentIdx !== -1 ? currentIdx : 0;

  return (
    <div className="py-6 px-4 sm:px-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <h4 className="font-extrabold text-slate-900 text-lg mb-8">Live Delivery Tracker</h4>
      
      {/* Desktop Step Flow */}
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-slate-100 z-0">
          <motion.div
            className="h-full bg-rose-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-rose-600 text-white shadow-rose-600/30'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`mt-3 text-[11px] sm:text-xs font-bold text-center max-w-[80px] sm:max-w-[100px] leading-tight ${
                isCompleted ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
