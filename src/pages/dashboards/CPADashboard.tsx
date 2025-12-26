import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CPADashboard() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) fetchAssignments();
  }, [profile]);

  const fetchAssignments = async () => {
    // Fetch orders assigned to this CPA
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:smb_id ( full_name, business_name, email )
      `)
      .eq('cpa_id', profile?.id)
      .eq('status', 'active');
    
    setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 border-b border-brand-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="font-bold text-xl text-brand-800">CPA Portal</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Dr. {profile?.full_name}</span>
            <div className="w-8 h-8 bg-brand-600 rounded-full"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Clients</h1>
        
        {loading ? (
            <p>Loading clients...</p>
        ) : orders.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                <Settings className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">No Active Clients</h3>
                <p className="text-gray-500">Once an Admin assigns you a client, they will appear here.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-brand-900">{order.profiles?.business_name || "New Business"}</h3>
                                <p className="text-sm text-gray-500">{order.profiles?.full_name}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-600"><span className="font-semibold">Package:</span> {order.package_name}</p>
                            <p className="text-sm text-gray-600"><span className="font-semibold">Value:</span> ${order.amount}/yr</p>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/chat/${order.id}`} className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-brand-700 transition flex items-center justify-center gap-2">
                                <MessageSquare size={16} /> Open Chat
                            </Link>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <FileText size={16} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}
