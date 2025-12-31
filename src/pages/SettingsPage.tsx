import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  User, Save, MapPin, Globe, Phone, 
  Briefcase, Camera, ShieldCheck, Mail, FileText 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    specialty: '',
    bio: '',
    phone: '',
    website: '',
    location: ''
  });

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
    }
  }, [profile]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update(formData).eq('id', user?.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Save failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isCPA = profile?.role === 'cpa';

  return (
    <div className="pb-24 md:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Responsive Cover Photo */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-brand-900 to-brand-700 rounded-b-xl md:rounded-xl relative mb-16 shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-4 sm:px-6 -mt-24 relative z-10">
        
        {/* 2. Identity Header (Centered on Mobile, Row on Desktop) */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mb-8 text-center md:text-left">
            <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-3xl md:text-4xl font-bold text-brand-700 overflow-hidden">
                    {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <User size={40} />}
                </div>
                <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-black transition shadow-sm border border-white">
                    <Camera size={14} />
                </button>
            </div>
            
            <div className="flex-1 pb-0 md:pb-2 w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                    {formData.full_name || 'Your Name'}
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-2 mt-1 justify-center md:justify-start">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-brand-50 text-brand-700 border-brand-200">
                        {profile?.role}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail size={12} /> <span className="truncate max-w-[200px]">{user?.email}</span>
                    </span>
                </div>
            </div>

            <div className="pb-0 md:pb-2 w-full md:w-auto">
                 <button 
                    onClick={handleSave} 
                    disabled={loading} 
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-brand-700 transition disabled:opacity-50"
                 >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                 </button>
            </div>
        </div>

        {/* 3. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Sidebar Info */}
            <div className="space-y-6 order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 focus-within:ring-2 ring-brand-100 transition">
                            <MapPin size={18} className="text-gray-400 shrink-0" />
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="bg-transparent w-full text-base outline-none text-gray-700" />
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 focus-within:ring-2 ring-brand-100 transition">
                            <Globe size={18} className="text-gray-400 shrink-0" />
                            <input name="website" value={formData.website} onChange={handleChange} placeholder="Website" className="bg-transparent w-full text-base outline-none text-gray-700" />
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 focus-within:ring-2 ring-brand-100 transition">
                            <Phone size={18} className="text-gray-400 shrink-0" />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-transparent w-full text-base outline-none text-gray-700" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-brand-50 rounded-xl border border-brand-100 p-6 flex items-start gap-3">
                    <ShieldCheck className="text-brand-600 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-brand-900 text-sm">Verified Account</h4>
                        <p className="text-xs text-brand-700/80 mt-1">Your data is secure and encrypted.</p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" /> General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none transition text-base" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{isCPA ? "Specialty" : "Business Name"}</label>
                            {isCPA ? (
                                <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-base">
                                    <option value="">Select Specialty</option>
                                    <option>Corporate Tax</option>
                                    <option>Audit</option>
                                    <option>Bookkeeping</option>
                                    <option>CFO Services</option>
                                </select>
                            ) : (
                                <input name="business_name" value={formData.business_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                            )}
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / Description</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none transition resize-none text-base"></textarea>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
