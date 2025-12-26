import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-gray-100">
        <div className="flex items-center gap-2">
            {/* CSS Logo Representation */}
            <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-full bg-accent-lightGreen"></div>
                <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                <div className="w-2 h-2 rounded-full bg-brand-600"></div>
            </div>
            <span className="text-2xl font-bold text-brand-900 tracking-tight">CPA <span className="text-brand-600">CANADA</span></span>
        </div>
        <div className="space-x-6">
          <Link to="/login" className="text-brand-900 hover:text-brand-600 font-medium transition">Log In</Link>
          <Link to="/signup/smb" className="px-5 py-2.5 bg-brand-600 text-white rounded-md font-semibold hover:bg-brand-700 transition shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-brand-900 leading-[1.15] mb-6">
            Expert Accounting for <span className="text-brand-600">Canadian Business</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Connect with verified CPAs for fixed-price accounting services. No hourly billing surprises. Just professional financial peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/signup/smb" 
              className="px-8 py-4 bg-brand-600 text-white rounded-lg font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20"
            >
              Order Service <ArrowRight size={20} />
            </Link>
            <Link 
              to="/signup/cpa" 
              className="px-8 py-4 bg-white border-2 border-brand-200 text-brand-600 rounded-lg font-bold text-lg hover:border-brand-600 hover:bg-brand-50 transition flex items-center justify-center"
            >
              Join as a CPA
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="bg-brand-50/50 p-8 rounded-2xl grid grid-cols-1 gap-6 border border-brand-100">
          <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-brand-50 p-3 rounded-lg">
                <ShieldCheck className="text-brand-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-brand-900 text-lg">Verified CPAs</h3>
              <p className="text-gray-600 mt-1">Every accountant is strictly vetted and certified in Canada.</p>
            </div>
          </div>
          <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="bg-brand-50 p-3 rounded-lg">
                <TrendingUp className="text-brand-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-brand-900 text-lg">Fixed Pricing</h3>
              <p className="text-gray-600 mt-1">Transparent packages. Know exactly what you pay upfront.</p>
            </div>
          </div>
          <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="bg-brand-50 p-3 rounded-lg">
                <Users className="text-brand-600 w-8 h-8" />
             </div>
            <div>
              <h3 className="font-bold text-brand-900 text-lg">Direct Communication</h3>
              <p className="text-gray-600 mt-1">Chat directly with your assigned CPA anytime.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
