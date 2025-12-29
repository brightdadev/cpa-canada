import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, FileText, Settings, Users, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CPADashboard() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) fetchPracticeData();
  }, [profile]);

  const fetchPracticeData = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`*, profiles:smb_id ( full_name, business_name, email )`)
      .eq('cpa_id', profile?.id)
      .order('created_at', { ascending: false });
    
    const clientList = data || [];
    setClients(clientList);
    
    // Calculate Stats
    const revenue = clientList.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const active = clientList.filter(o => o.status === 'active').length;
    const pending = clientList.filter(o => o.status === 'pending_match').length;

    setStats({ revenue, active, pending });
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {profile?.full_name}
          </h1>
          <p className="text-gray-500 mt-1">Here is an overview of your practice.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Verified CPA</span>
        </div>
      </div>

      {/* 2. Practice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-brand-50 rounded-lg text-brand-600"><Users size={24} /></div>
             <div>
               <p className="text-sm font-medium text-gray-500">Total Clients</p>
               <h3 className="text-2xl font-bold text-gray-900">{clients.length}</h3>
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-green-50 rounded-lg text-green-600"><DollarSign size={24} /></div>
             <div>
               <p className="text-sm font-medium text-gray-500">Est. Revenue</p>
               <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</h3>
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><TrendingUp size={24} /></div>
             <div>
               <p className="text-sm font-medium text-gray-500">Active Jobs</p>
               <h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Client Roster */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Clients</h2>
            <Link to="/dashboard/orders" className="text-sm text-brand-600 font-bold hover:underline">View All</Link>
        </div>

        {loading ? (
            <div className="p-8 text-center text-gray-400">Loading roster...</div>
        ) : clients.length === 0 ? (
            <div className="p-12 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Users size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Clients Yet</h3>
                <p className="text-gray-500 mb-6">Waiting for Admin to assign new businesses to you.</p>
                <Link to="/settings" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700">
                    Update Profile
                </Link>
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {clients.map(client => (
                    <div key={client.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-lg">
                                {client.profiles?.business_name?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{client.profiles?.business_name || 'New Business'}</h4>
                                <p className="text-sm text-gray-500">{client.package_name} Package • {client.profiles?.full_name}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
                                client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {client.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {client.status}
                            </span>
                            <div className="flex gap-2">
                                <Link to={`/chat/${client.id}`} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition" title="Message">
                                    <MessageSquare size={18} />
                                </Link>
                                <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition" title="View Files">
                                    <FileText size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
