import React from 'react';
import { FileText, ShieldCheck, Scale, Clock, RefreshCw, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Legal Agreement & Rules
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Terms & Conditions</h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Please read these Terms & Conditions carefully before using the Foodie platform, ordering food, or accessing any services provided by Foodie Technologies Pvt Ltd.
        </p>
        <p className="text-xs text-slate-400">Last updated: September 28, 2026</p>
      </div>

      {/* Terms Sections Grid */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <Scale className="w-5 h-5 text-rose-600" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Foodie web application, mobile apps, or associated REST API services, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, you may not access or use the platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            2. User Account Security
          </h2>
          <p>
            To place food orders and manage delivery addresses, users may register an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account. Foodie reserves the right to suspend accounts attempting fraudulent activities.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-rose-600" />
            3. Pricing, Taxes & Discounts
          </h2>
          <p>
            All dish prices displayed on the menu are specified by partner restaurants. Applicable taxes (5% GST) and delivery charges are calculated transparently at checkout. Promotional coupons (such as WELCOME50) are subject to minimum order thresholds and validity conditions.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            4. Order Cancellation & Refund Policy
          </h2>
          <p>
            Customers may cancel an order before the restaurant starts food preparation. In case of food quality issues, damaged packaging, or missing items, customers can report concerns via our 24/7 Support Assistant (`/help`) for instant refund evaluation. Approved refunds are credited back to the original payment source within 5 minutes.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            5. Partner Restaurants & Food Quality
          </h2>
          <p>
            Foodie acts as a technology discovery and delivery platform connecting customers with partner kitchens. Partner restaurants are solely responsible for compliance with food safety regulations, hygiene practices, and order preparation.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="font-extrabold text-slate-900 text-xl">6. Contact Information</h2>
          <p>
            For any legal inquiries or support requests regarding these Terms, please contact our Legal Team at:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-xs space-y-1 text-slate-800">
            <p>Foodie Technologies Pvt Ltd</p>
            <p>Email: legal@foodie.com | Support Phone: +1-800-FOODIE-HELP</p>
            <p>Marine Drive, Bandra West, Mumbai, Maharashtra 400050</p>
          </div>
        </section>

      </div>

    </div>
  );
}
