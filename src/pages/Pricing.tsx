import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    features: ['Annual Tax Return (T2)', 'Financial Statement Prep', 'Email Support', '15-min Consultation']
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 999,
    features: ['T2 + GST/HST Filing', 'Quarterly Bookkeeping', 'Financial Statements', 'Priority Support']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 1999,
    features: ['Monthly Bookkeeping', 'Payroll (up to 5)', 'Tax Planning', 'Monthly Call']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    features: ['CFO Services', 'Audit Support', 'Unlimited Payroll', 'Weekly Strategy']
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSelect = async (pkg: any) => {
    if (!user) {
      toast('Please log in to purchase', { icon: '🔐' });
      navigate('/signup/smb');
      return;
    }

    // UX: Show processing state
    setProcessing(pkg.id);
    
    // Simulating API latency for better UX
    await new Promise(r => setTimeout(r, 800));

    try {
      const { error } = await supabase.from('orders').insert({
        smb_id: user.id,
        package_name: pkg.name,
        amount: pkg.price,
        status: 'pending_match'
      });
      
      if (error) throw error;
      
      toast.success(`Successfully purchased ${pkg.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Purchase failed: ' + err.message);
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-brand-900 mb-4">Transparent, Fixed Pricing</h1>
        <p className="text-xl text-gray-600">Choose the package that fits your business stage.</p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:border-brand-500 transition-colors">
            <div className="p-8">
              <h3 className="text-xl font-bold text-brand-900 mb-2">{pkg.name}</h3>
              <div className="text-4xl font-extrabold text-brand-600 mb-6">${pkg.price}<span className="text-base font-medium text-gray-500">/yr</span></div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                    <Check className="text-accent-green shrink-0" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto p-8 bg-brand-50 border-t border-brand-100">
              <button 
                onClick={() => handleSelect(pkg)}
                disabled={processing === pkg.id}
                className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold rounded-lg transition shadow-sm flex justify-center items-center gap-2"
              >
                {processing === pkg.id ? (
                    <>Processing...</>
                ) : (
                    <>Choose {pkg.name}</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
