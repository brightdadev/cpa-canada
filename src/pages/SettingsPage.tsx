import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  User, Save, Building, MapPin, Globe, Phone, 
  Briefcase, Camera, ShieldCheck, Mail, FileText 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    specialty: '',
    bio: '',
    phone: '',
    website: '',
    location: ''
  });

  // Load Data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        business_name: profile.business_name || '',
        specialty: profile.specialty || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        website: profile.website || '',
        location: profile.location || ''
      });
      setInitialLoading(false);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Save failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="min-h-screen flex items-center justify-center text-brand-600">Loading Profile...</div>;

  const isCPA = profile?.role === 'cpa';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Header / Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-brand-900 to-brand-700 relative">
        <div className="absolute bottom-4 right-6 text-white/50 text-xs font-mono">
            ID: {user?.id}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        
        {/* 2. Identity Section */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-brand-700 overflow-hidden">
                    {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <User size={40} />}
                </div>
                <button className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-black transition shadow-sm border border-white">
                    <Camera size={14} />
                </button>
            </div>
            <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-gray-900">{formData.full_name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${isCPA ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        {profile?.role}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail size={12} /> {user?.email}
                    </span>
                </div>
            </div>
            <div className="pb-2">
                 <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-brand-700 transition disabled:opacity-50"
                 >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                 </button>
            </div>
        </div>

        {/* 3. Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Sidebar Info */}
            <div className="space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">Location</label>
                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 ring-brand-100 transition">
                                <MapPin size={16} className="text-gray-400" />
                                <input 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    placeholder="City, Province" 
                                    className="bg-transparent w-full text-sm outline-none text-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">Website</label>
                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 ring-brand-100 transition">
                                <Globe size={16} className="text-gray-400" />
                                <input 
                                    name="website" 
                                    value={formData.website} 
                                    onChange={handleChange} 
                                    placeholder="https://..." 
                                    className="bg-transparent w-full text-sm outline-none text-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">Phone</label>
                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 ring-brand-100 transition">
                                <Phone size={16} className="text-gray-400" />
                                <input 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder="+1 (555)..." 
                                    className="bg-transparent w-full text-sm outline-none text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="text-brand-600 mt-1" />
                        <div>
                            <h4 className="font-bold text-brand-900">Account Status</h4>
                            <p className="text-sm text-brand-700/80 mt-1">
                                Your account is active and verified. You can access all platform features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Main Editor */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* General Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" /> General Information
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input 
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Locked)</label>
                            <input 
                                value={user?.email}
                                disabled
                                className="w-full p-3 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about your experience..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none transition resize-none"
                        ></textarea>
                        <p className="text-xs text-gray-400 text-right mt-1">Max 500 characters</p>
                    </div>
                </div>

                {/* Role Specific Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {isCPA ? <Briefcase size={20} className="text-gray-400" /> : <Building size={20} className="text-gray-400" />}
                        {isCPA ? 'Professional Qualifications' : 'Business Details'}
                    </h2>

                    {isCPA ? (
                         <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Primary Specialty</label>
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none bg-white"
                            >
                                <option value="">-- Select Specialty --</option>
                                <option value="General Accounting">General Accounting</option>
                                <option value="Corporate Tax (T2)">Corporate Tax (T2)</option>
                                <option value="Audit & Assurance">Audit & Assurance</option>
                                <option value="Bookkeeping & Payroll">Bookkeeping & Payroll</option>
                                <option value="CFO Services">Fractional CFO</option>
                            </select>
                            
                            <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg mt-4 border border-blue-100">
                                <strong>Tip:</strong> Admins use this field to match you with clients. Ensure it is accurate.
                            </div>
                         </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Business Name</label>
                            <input 
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleChange}
                                placeholder="Legal Business Name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none"
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}
