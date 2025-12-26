import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Clock, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SMBDashboard() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!profile) return;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('smb_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data || []);
      setLoading(false);
    };
    
    fetchOrders();
  }, [profile]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 border-b border-brand-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Simple CSS Logo Match */}
            <div className="flex items-center gap-1">
               <div className="grid grid-cols-2 gap-0.5">
                 <div className="w-2 h-2 rounded-full bg-accent-lightGreen"></div>
                 <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                 <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                 <div className="w-2 h-2 rounded-full bg-brand-600"></div>
               </div>
               <span className="text-2xl font-bold text-brand-900 tracking-tight">CPA <span className="text-brand-600">CANADA</span></span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {profile?.business_name || profile?.full_name}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid gap-6">
        
        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-brand-900">Active Services</h2>
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active accounting services.</p>
              <Link to="/pricing" className="text-brand-600 font-bold hover:underline">Browse Packages</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-brand-50 rounded-lg border border-brand-100">
                  <div>
                    <h3 className="font-bold text-brand-900">{order.package_name}</h3>
                    <p className="text-sm text-gray-600">Status: <span className="uppercase font-semibold text-brand-600">{order.status}</span></p>
                  </div>
                  {order.status === 'pending_match' ? (
                    <div className="flex items-center text-orange-600 gap-2 text-sm bg-white px-3 py-1 rounded-full shadow-sm border border-orange-100">
                      <Clock size={16} /> Matching (~24h)
                    </div>
                  ) : (
                    <Link 
                      to={'/chat/' + order.id} 
                      className="flex items-center text-white gap-2 text-sm font-bold bg-brand-600 px-4 py-2 rounded-lg shadow-sm hover:bg-brand-700 transition"
                    >
                      <MessageSquare size={16} /> Chat with CPA
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-brand-200 transition">
            <div className="p-3 bg-brand-50 rounded-full mb-3">
              <FileText className="text-brand-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Documents</h3>
            <p className="text-sm text-gray-500 mt-2">Upload tax forms & receipts.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-brand-200 transition">
            <div className="p-3 bg-accent-lightGreen/10 rounded-full mb-3">
              <CheckCircle className="text-accent-green" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Compliance</h3>
            <p className="text-sm text-gray-500 mt-2">View filing status & deadlines.</p>
          </div>
          <Link to="/pricing" className="group bg-white p-6 rounded-xl shadow-sm border border-dashed border-brand-300 flex flex-col items-center text-center hover:border-brand-600 hover:bg-brand-50 transition cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition">
               +
             </div>
            <h3 className="font-semibold text-brand-700">New Order</h3>
            <p className="text-sm text-brand-600/70 mt-2">Purchase a new package.</p>
          </Link>
        </div>

      </main>
    </div>
  );
}
