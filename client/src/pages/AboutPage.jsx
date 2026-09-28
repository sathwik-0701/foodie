import React from 'react';
import { Award, Users, Utensils, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';
import { assets } from '../assets/assets';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Revolutionizing food delivery for culinary lovers.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Foodie was founded with a singular vision: to connect food enthusiasts with top-rated local kitchens, ensuring gourmet quality, hygienic standards, and lightning-fast delivery.
          </p>
        </div>

        <div className="shrink-0 w-48 sm:w-64">
          <img src={assets.header_img} alt="About Foodie" className="w-full h-auto rounded-2xl shadow-2xl object-cover border-2 border-white/20" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Outlets', val: '500+' },
          { label: 'Happy Customers', val: '100,000+' },
          { label: 'Cities Covered', val: '12+' },
          { label: 'On-Time Delivery', val: '99.4%' }
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
            <p className="text-3xl font-black text-rose-600">{s.val}</p>
            <p className="text-xs font-bold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Core Values</h2>
          <p className="text-sm text-slate-500">The principles guiding everything we build</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Utensils, title: 'Uncompromising Quality', desc: 'We strictly audit partner kitchens for safety, freshness, and culinary excellence.' },
            { icon: ShieldCheck, title: 'Hygiene First', desc: '100% tamper-proof packaging and temperature-controlled express delivery.' },
            { icon: Heart, title: 'Customer Delight', desc: '24/7 AI-assisted priority resolution and zero-friction instant refunds.' }
          ].map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
