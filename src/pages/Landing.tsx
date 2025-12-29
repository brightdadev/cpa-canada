import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Menu, X } from 'lucide-react';
import Footer from '../components/Footer';
import Logo from '../assets/cpacanada.svg';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* NAVBAR INCREASED HEIGHT */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28"> 
            
            {/* LOGO SUPERSIZED (h-28) */}
            <div className="flex-shrink-0 flex items-center">
              <img src={Logo} alt="CPA Canada" className="h-28 w-auto object-contain" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/pricing" className="text-gray-600 hover:text-brand-700 font-medium transition">Pricing</Link>
              <Link to="/login" className="text-gray-900 font-bold hover:text-brand-700 transition">Log In</Link>
              <Link to="/signup/smb" className="bg-brand-600 text-white px-6 py-2.5 rounded-md font-bold shadow-sm hover:bg-brand-700 transition">Get Started</Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-gray-900 p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full animate-in slide-in-from-top-5">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link to="/pricing" className="block text-lg font-medium text-gray-700">Pricing</Link>
              <Link to="/login" className="block text-lg font-medium text-gray-700">Log In</Link>
              <Link to="/signup/smb" className="block w-full text-center bg-brand-600 text-white px-6 py-3 rounded-lg font-bold">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
               <span className="w-2 h-2 rounded-full bg-brand-600"></span> Official Platform
            </div>
            <h1 className="text-5xl font-extrabold text-brand-900 leading-[1.15] mb-6">
              Expert Accounting for <span className="text-brand-600">Canadian Business</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Connect with verified CPAs for fixed-price accounting services. No hourly billing surprises. Just professional financial peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup/smb" className="px-8 py-4 bg-brand-600 text-white rounded-lg font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
                Order Service <ArrowRight size={20} />
              </Link>
              <Link to="/signup/cpa" className="px-8 py-4 bg-white border-2 border-brand-200 text-brand-600 rounded-lg font-bold text-lg hover:border-brand-600 hover:bg-brand-50 transition flex items-center justify-center">
                Join as a CPA
              </Link>
            </div>
          </div>
          <div className="bg-brand-50/50 p-8 rounded-2xl grid grid-cols-1 gap-6 border border-brand-100 animate-in slide-in-from-right duration-700 delay-100">
            <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-brand-200 transition">
              <div className="bg-brand-50 p-3 rounded-lg"><ShieldCheck className="text-brand-600 w-8 h-8" /></div>
              <div><h3 className="font-bold text-brand-900 text-lg">Verified CPAs</h3><p className="text-gray-600 mt-1 text-sm">Every accountant is strictly vetted and certified in Canada.</p></div>
            </div>
            <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-brand-200 transition">
               <div className="bg-brand-50 p-3 rounded-lg"><TrendingUp className="text-brand-600 w-8 h-8" /></div>
               <div><h3 className="font-bold text-brand-900 text-lg">Fixed Pricing</h3><p className="text-gray-600 mt-1 text-sm">Transparent packages. Know exactly what you pay upfront.</p></div>
            </div>
            <div className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-brand-200 transition">
               <div className="bg-brand-50 p-3 rounded-lg"><Users className="text-brand-600 w-8 h-8" /></div>
               <div><h3 className="font-bold text-brand-900 text-lg">Direct Communication</h3><p className="text-gray-600 mt-1 text-sm">Chat directly with your assigned CPA anytime.</p></div>
            </div>
          </div>
        </section>
        <section className="bg-brand-900 py-16 text-white">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-4xl font-bold mb-2">500+</div><div className="text-brand-200">Verified CPAs</div></div>
              <div><div className="text-4xl font-bold mb-2">$20M</div><div className="text-brand-200">Tax Saved</div></div>
              <div><div className="text-4xl font-bold mb-2">24h</div><div className="text-brand-200">Avg. Match Time</div></div>
              <div><div className="text-4xl font-bold mb-2">100%</div><div className="text-brand-200">Satisfaction</div></div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
