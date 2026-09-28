import React, { useState, useEffect } from 'react';
import { couponApi } from '../api/couponApi';
import { Tag, Copy, Check } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function OffersPage() {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const { showSuccess } = useToast();

  useEffect(() => {
    couponApi.getCoupons().then(res => {
      if (res.success) setCoupons(res.data || []);
    });
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showSuccess(`Coupon code '${code}' copied to clipboard!`);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Deals & Offers</h1>
        <p className="text-sm text-slate-500 mt-1">Claim active promo codes & enjoy big savings on food orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-600" />
                <span className="font-black text-slate-900 text-lg">{c.code}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              <p className="text-[11px] font-semibold text-slate-400">
                Min Order: ₹{c.minOrder} • Max Discount: ₹{c.maxDiscount}
              </p>
            </div>

            <button
              onClick={() => handleCopy(c.code)}
              className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              {copiedCode === c.code ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Coupon Code</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
