import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  Clock, MessageSquare, FileText, CheckCircle, 
  TrendingUp, Calendar, AlertCircle, ArrowRight, Upload, Users 
} from 'lucide-react';

export default function SMBDashboard() {
  const { profile, user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [docCount, setDocCount] = useState(0); // <--- New State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
        fetchActiveOrder();
        fetchDocCount(); // <--- Fetch Count
    }
  }, [profile]);

  const fetchActiveOrder = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`*, cpa:cpa_id ( full_name, email, specialty )`)
        .eq('smb_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) setActiveOrder(data);
    } catch (e) {
      console.log('No active orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocCount = async () => {
    const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
    
    setDocCount(count || 0);
  };

  const getProgress = (status: string) => {
    if (status === 'pending_match') return 1;
    if (status === 'active') return 2;
    if (status === 'review') return 3;
    if (status === 'completed') return 4;
    return 1;
  };

  const steps = ['Matched', 'Onboarding', 'In Progress', 'Filed'];
  const currentStep = activeOrder ? getProgress(activeOrder.status) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, {profile?.business_name || profile?.full_name}
          </h1>
          <p className="text-gray-500 mt-1">Here is what is happening with your finances today.</p>
        </div>
        <Link to="/pricing" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition shadow-sm flex items-center gap-2">
           <TrendingUp size={16} /> New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
           <div className="p-3 bg-blue-50 rounded-lg text-brand-600"><Calendar size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Next Deadline</p>
             <h3 className="text-xl font-bold text-gray-900">April 30, 2026</h3>
             <p className="text-xs text-orange-600 font-medium mt-1">T2 Corporate Return</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
           <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Compliance Status</p>
             <h3 className="text-xl font-bold text-gray-900">Good Standing</h3>
             <p className="text-xs text-gray-400 mt-1">Last filing: Never</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
           <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><FileText size={24} /></div>
           <div>
             <p className="text-sm font-medium text-gray-500">Documents</p>
             {/* REAL COUNT HERE */}
             <h3 className="text-xl font-bold text-gray-900">{docCount} Uploaded</h3>
             <Link to="/dashboard/documents" className="text-xs text-brand-600 font-bold mt-1 hover:underline block">
               View Vault
             </Link>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-800">Active Engagement</h2>
          {loading ? (
            <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ) : activeOrder ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-brand-100 text-brand-700 text-xs font-bold uppercase rounded">{activeOrder.package_name}</span>
                    <span className="text-xs text-gray-400">#{activeOrder.id.slice(0,8)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">2025 Year-End Filing</h3>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-bold text-gray-900">${activeOrder.amount}</p>
                   <p className="text-xs text-gray-500">Fixed Price</p>
                </div>
              </div>
              <div className="p-8">
                <div className="relative flex justify-between">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                  <div className="absolute top-1/2 left-0 h-1 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}></div>
                  {steps.map((stepName, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${isCompleted || isCurrent ? 'border-brand-600 text-brand-600' : 'border-gray-300 text-gray-300'}`}>
                          {isCompleted ? <CheckCircle size={16} fill="currentColor" className="text-white bg-brand-600 rounded-full" /> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-brand-600' : 'bg-gray-300'}`} />}
                        </div>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-brand-700' : 'text-gray-400'}`}>{stepName}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-gray-50 p-6 flex gap-4">
                 {activeOrder.status === 'pending_match' ? (
                    <div className="flex items-center gap-3 text-orange-600 bg-orange-50 px-4 py-3 rounded-lg w-full">
                       <Clock size={20} />
                       <span className="font-medium text-sm">We are currently matching you with the perfect CPA. Check back in 24 hours.</span>
                    </div>
                 ) : (
                    <>
                      <Link to={`/chat/${activeOrder.id}`} className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold text-center hover:bg-brand-700 transition shadow-md flex items-center justify-center gap-2">
                        <MessageSquare size={18} /> Chat with CPA
                      </Link>
                      <Link to="/dashboard/documents" className="px-6 py-3 border border-gray-300 bg-white rounded-lg font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Upload size={18} /> Docs
                      </Link>
                    </>
                 )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 <FileText size={32} />
               </div>
               <h3 className="text-lg font-bold text-gray-900">No Active Services</h3>
               <Link to="/pricing" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 mt-4 inline-block">View Packages</Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800">Your Financial Team</h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden text-center">
             {activeOrder?.cpa ? (
               <>
                 <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-xl font-bold text-brand-700 mx-auto mb-3">
                   {activeOrder.cpa.full_name.charAt(0)}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">{activeOrder.cpa.full_name}</h3>
                 <p className="text-sm text-gray-500 mb-4">{activeOrder.cpa.specialty || 'CPA'}</p>
                 <Link to={`/chat/${activeOrder.id}`} className="w-full py-2 bg-brand-50 text-brand-700 font-bold rounded-lg text-sm hover:bg-brand-100 transition block">
                   Send Message
                 </Link>
               </>
             ) : (
               <>
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3 border-4 border-white shadow-sm mx-auto">
                    <Users size={32} />
                 </div>
                 <h3 className="text-gray-900 font-bold">Pending Match</h3>
                 <p className="text-sm text-gray-500 mb-4">Selecting the best CPA...</p>
                 <p className="text-xs text-orange-500 font-bold">Matching in progress...</p>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
