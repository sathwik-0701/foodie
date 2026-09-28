import React, { useState } from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Sparkles, MapPin, Search } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function CareersPage() {
  const { showSuccess } = useToast();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(false);

  const jobs = [
    { id: 1, title: 'Senior Full Stack Engineer (MERN)', dept: 'Engineering', loc: 'Mumbai / Remote', type: 'Full-time' },
    { id: 2, title: 'Product Manager — Logistics & Delivery', dept: 'Product', loc: 'Bengaluru', type: 'Full-time' },
    { id: 3, title: 'Lead UI/UX Product Designer', dept: 'Design', loc: 'Mumbai / Remote', type: 'Full-time' },
    { id: 4, title: 'Growth & Performance Marketing Lead', dept: 'Marketing', loc: 'Delhi NCR', type: 'Full-time' }
  ];

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
    showSuccess('Application submitted! Our HR talent team will contact you.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          Join Our Team
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Build the Future of Food-Tech</h1>
        <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
          We are looking for passionate engineers, designers, and innovators to transform how millions of people discover and order food.
        </p>
      </div>

      {/* Open Positions List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Open Opportunities ({jobs.length})</h2>

        <div className="space-y-4">
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 uppercase border border-rose-200">
                  {j.dept}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg">{j.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{j.loc} • {j.type}</p>
              </div>

              <button
                onClick={() => setSelectedJob(j)}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition shrink-0"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-4 relative">
            <h3 className="font-black text-slate-900 text-xl">Apply for {selectedJob.title}</h3>
            {applied ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-lg">Application Received!</h4>
                <button onClick={() => { setSelectedJob(null); setApplied(false); }} className="px-6 py-2 rounded-full bg-slate-900 text-white font-bold text-xs">Close</button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3 text-xs font-semibold">
                <input type="text" required placeholder="Full Name" className="w-full p-3 rounded-xl border border-slate-200" />
                <input type="email" required placeholder="Email Address" className="w-full p-3 rounded-xl border border-slate-200" />
                <input type="url" placeholder="LinkedIn Profile / Portfolio Link" className="w-full p-3 rounded-xl border border-slate-200" />
                <textarea rows={3} placeholder="Why are you a great fit for Foodie?" className="w-full p-3 rounded-xl border border-slate-200" />
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm">Submit Application</button>
                  <button type="button" onClick={() => setSelectedJob(null)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
