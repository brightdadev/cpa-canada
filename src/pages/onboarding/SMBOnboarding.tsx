import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Building, DollarSign, CheckCircle, ArrowRight, MapPin, Globe, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SMBOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State initialization
  const [formData, setFormData] = useState({
    business_name: '',
    industry: 'tech',
    phone: '',
    website: '',
    location: '',
    revenue_range: '',
    accounting_software: 'qbo'
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // Explicitly construct the update object to ensure fields aren't missed
      const updates = {
        business_name: formData.business_name,
        industry: formData.industry,
        phone: formData.phone,
        website: formData.website,
        location: formData.location,
        revenue_range: formData.revenue_range,
        accounting_software: formData.accounting_software,
        onboarding_completed: true,
        role: 'smb' // reinforce role
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Profile saved successfully!");
      // Hard redirect to ensure context refreshes
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("Onboarding Error:", error);
      toast.error("Save failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          Complete Your Profile
        </h2>
        <div className="mt-4 flex justify-center gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-brand-600' : 'bg-gray-200'}`} />
           ))}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* STEP 1: CONTACT INFO */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Building className="text-brand-600" size={20} /> Business Details
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700">Business Name *</label>
                <input name="business_name" value={formData.business_name} onChange={handleChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600" placeholder="Legal Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Location</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><MapPin size={16} /></div>
                        <input name="location" value={formData.location} onChange={handleChange} className="block w-full pl-9 p-2.5 border border-gray-300 rounded-md" placeholder="City" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Phone</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone size={16} /></div>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="block w-full pl-9 p-2.5 border border-gray-300 rounded-md" placeholder="Number" />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Website</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Globe size={16} /></div>
                    <input name="website" value={formData.website} onChange={handleChange} className="block w-full pl-9 p-2.5 border border-gray-300 rounded-md" placeholder="example.com" />
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!formData.business_name} className="w-full py-3 bg-brand-600 text-white rounded-md font-bold hover:bg-brand-700 disabled:opacity-50 mt-4">
                Next Step
              </button>
            </div>
          )}

          {/* STEP 2: FINANCIALS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <DollarSign className="text-brand-600" size={20} /> Financial Context
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Annual Revenue</label>
                <div className="grid grid-cols-1 gap-2">
                  {['< $50k', '$50k - $250k', '$250k - $1M', '$1M+'].map(opt => (
                    <button key={opt} onClick={() => setFormData({...formData, revenue_range: opt})}
                      className={`p-3 border rounded-md text-sm text-left ${formData.revenue_range === opt ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Accounting Software</label>
                <select name="accounting_software" value={formData.accounting_software} onChange={handleChange} className="block w-full p-2.5 border border-gray-300 rounded-md bg-white">
                  <option value="none">None / Excel</option>
                  <option value="qbo">QuickBooks Online</option>
                  <option value="xero">Xero</option>
                  <option value="freshbooks">FreshBooks</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-md font-bold text-gray-700">Back</button>
                <button onClick={() => setStep(3)} disabled={!formData.revenue_range} className="flex-1 py-3 bg-brand-600 text-white rounded-md font-bold disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SAVE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Ready to Launch?</h3>
              <p className="text-gray-500 text-sm">We will set up your dashboard using the details provided.</p>

              <div className="bg-gray-50 p-4 rounded text-left text-sm space-y-1">
                 <p><strong>Business:</strong> {formData.business_name}</p>
                 <p><strong>Location:</strong> {formData.location || 'N/A'}</p>
                 <p><strong>Revenue:</strong> {formData.revenue_range}</p>
              </div>

              <button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-brand-600 text-white rounded-md font-bold hover:bg-brand-700 disabled:opacity-50">
                {loading ? 'Saving Profile...' : 'Enter Dashboard'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
