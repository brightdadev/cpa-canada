import React, { useState } from 'react';
import { Check, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    desc: "For freelancers & sole proprietors",
    features: ['Annual Tax Return (T2)', 'Financial Statement Prep', 'Email Support', '15-min Consultation']
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 999,
    popular: true,
    desc: "For small businesses & startups",
    features: ['T2 + GST/HST Filing', 'Quarterly Bookkeeping', 'Financial Statements', 'Priority Support']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 1999,
    desc: "For growing teams & corps",
    features: ['Monthly Bookkeeping', 'Payroll (up to 5)', 'Tax Planning', 'Monthly Strategy Call']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    desc: "Full outsourcing solution",
    features: ['CFO Services', 'Audit Support', 'Unlimited Payroll', 'Weekly Strategy']
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = (pkg: any) => {
    if (!user) {
      toast('Please log in to purchase', { icon: '🔐' });
      navigate('/signup/smb');
      return;
    }
    setLoading(pkg.id);
    toast.success("Order simulated (Stripe skipped). Redirecting...");
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 1500);
  };

  const handleExit = () => {
    if (user) {
        navigate('/dashboard');
    } else {
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      
      {/* EXIT BUTTON */}
      <div className="max-w-7xl mx-auto mb-8">
        <button 
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100 w-fit"
        >
            <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-600 font-bold text-sm tracking-widest uppercase mb-3">Simple Pricing</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Transparent packages for <br /> every stage of business.
          </h1>
          <p className="text-xl text-gray-500">
            Choose the package that fits your needs. No hidden fees. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-2xl shadow-lg border flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                pkg.popular ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-100'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">{pkg.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">${pkg.price}</span>
                  <span className="text-gray-500 font-medium">/year</span>
                </div>
                
                <button 
                  onClick={() => handleSelect(pkg)}
                  disabled={!!loading}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition flex justify-center items-center gap-2 ${
                    pkg.popular 
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' 
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  {loading === pkg.id ? 'Processing...' : 'Choose Plan'} <ArrowRight size={18} />
                </button>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <hr className="border-gray-100 mb-6" />
                <ul className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                      <div className="mt-0.5 p-0.5 bg-green-100 rounded-full text-green-600">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 pb-12">
          <p className="text-gray-500">
            Need a custom enterprise solution? <span className="font-bold text-brand-600 cursor-pointer hover:underline">Contact Sales</span>
          </p>
        </div>

      </div>
    </div>
  );
}
