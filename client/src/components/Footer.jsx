import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
                <span className="font-extrabold text-lg">F</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Foodie<span className="text-rose-500">.</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Discover top rated restaurants, order gourmet dishes, and enjoy lightning fast delivery straight to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img src={assets.facebook_icon} alt="FB" className="w-8 h-8 opacity-80 hover:opacity-100 transition cursor-pointer" />
              <img src={assets.twitter_icon} alt="Twitter" className="w-8 h-8 opacity-80 hover:opacity-100 transition cursor-pointer" />
              <img src={assets.linkedin_icon} alt="LinkedIn" className="w-8 h-8 opacity-80 hover:opacity-100 transition cursor-pointer" />
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/team" className="hover:text-white transition">Team</Link></li>
              <li><Link to="/partner" className="hover:text-white transition">Partner with us</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide">Contact & Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-white transition">Help & Support</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/offers" className="hover:text-white transition">Offers & Coupons</Link></li>
            </ul>
          </div>

          {/* Col 4: App Download */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide">Get the App</h4>
            <p className="text-xs text-slate-400">Order faster with the Foodie mobile application.</p>
            <div className="flex flex-col gap-2 pt-1">
              <img src={assets.play_store} alt="Play Store" className="h-10 object-contain self-start cursor-pointer hover:scale-105 transition" />
              <img src={assets.app_store} alt="App Store" className="h-10 object-contain self-start cursor-pointer hover:scale-105 transition" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Foodie Technologies Pvt Ltd. All rights reserved.</p>
          <p>Designed for premium modern food tech experience.</p>
        </div>
      </div>
    </footer>
  );
}
