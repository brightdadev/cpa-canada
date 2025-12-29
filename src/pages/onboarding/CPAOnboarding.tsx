import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, CheckCircle, ArrowRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CPAOnboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cpa_id: '',
    provincial_body: 'CPA Ontario',
    years_experience: 5,
    specialty: 'General Accounting',
    full_name: '', // Confirming name
    bio: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        ...formData,
        onboarding_completed: true,
        verified: false // Admin must verify manually, but we let them in
      }).eq('id', user?.id);

      if (error) throw error;
      toast.success("Verification Submitted!");
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-brand-900">
          CPA Verification
        </h2>
        <div className="mt-4 flex justify-center gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-brand-600' : 'bg-gray-200'}`} />
           ))}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border-t-4 border-brand-600 sm:rounded-lg sm:px-10">
          
          {/* STEP 1: LICENSE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <ShieldCheck className="text-brand-600" size={20} /> License Details
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                Your License ID will be verified against the provincial registry.
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">CPA Member ID</label>
                <input name="cpa_id" value={formData.cpa_id} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-brand-500" placeholder="e.g. 1234567" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Provincial Body</label>
                <select name="provincial_body" value={formData.provincial_body} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white">
                  <option>CPA Ontario</option>
                  <option>CPA British Columbia</option>
                  <option>CPA Alberta</option>
                  <option>CPA Quebec</option>
                  <option>Other</option>
                </select>
              </div>

              <button onClick={() => setStep(2)} disabled={!formData.cpa_id} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL PROFILE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <User className="text-brand-600" size={20} /> Professional Profile
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700">Display Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="e.g. Jane Doe, CPA" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="mt-1 block w-full p-3 border border-gray-300 rounded-md resize-none" placeholder="Briefly describe your experience..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-md font-bold text-gray-700">Back</button>
                <button onClick={() => setStep(3)} disabled={!formData.full_name} className="flex-1 py-3 bg-brand-600 text-white rounded-md font-bold hover:bg-brand-700 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: EXPERTISE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Briefcase className="text-brand-600" size={20} /> Expertise
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700">Primary Specialty</label>
                <select name="specialty" value={formData.specialty} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-white">
                   <option>General Accounting</option>
                   <option>Corporate Tax (T2)</option>
                   <option>Audit & Assurance</option>
                   <option>CFO Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Years of Experience</label>
                <input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" />
              </div>

              <button onClick={handleSubmit} disabled={loading} className="w-full py-3 px-4 bg-brand-600 text-white rounded-md font-bold hover:bg-brand-700 mt-4 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Complete Verification'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
