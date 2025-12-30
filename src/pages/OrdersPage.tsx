import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      let query = supabase.from('orders').select('*, profiles:smb_id(business_name), cpa:cpa_id(full_name)');
      if (profile?.role === 'smb') query = query.eq('smb_id', profile.id);
      if (profile?.role === 'cpa') query = query.eq('cpa_id', profile.id);
      const { data } = await query.order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    if (profile) fetchOrders();
  }, [profile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-500">Manage your active services and invoices.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading records...</div>
        ) : orders.length === 0 ? (
            <div className="p-12 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><FileText size={32} /></div>
                <h3 className="font-bold text-gray-900">No Orders Found</h3>
                {profile?.role === 'smb' && <Link to="/pricing" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-lg font-bold">Browse Packages</Link>}
            </div>
        ) : (
            // FIX: Add overflow-x-auto for mobile table scrolling
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Package</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-mono text-gray-500">#{order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{order.package_name}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                        order.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {order.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">${order.amount}</td>
                                <td className="px-6 py-4 text-gray-500">{format(new Date(order.created_at), 'MMM d')}</td>
                                <td className="px-6 py-4 text-right">
                                    {order.status !== 'pending_match' && (
                                        <Link to={`/chat/${order.id}`} className="text-brand-600 hover:text-brand-800 font-bold flex items-center justify-end gap-1">
                                            Open <ArrowUpRight size={16} />
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
