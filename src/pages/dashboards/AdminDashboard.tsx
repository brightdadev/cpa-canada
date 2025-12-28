import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [cpas, setCpas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedCPA, setSelectedCPA] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`*, profiles:smb_id ( full_name, business_name, email )`)
        .order('created_at', { ascending: false });

      const { data: cpasData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cpa');

      setOrders(ordersData || []);
      setCpas(cpasData || []);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchConfirm = async () => {
    if (!selectedOrder || !selectedCPA) return;

    // 1. Find Data for Email
    const order = orders.find(o => o.id === selectedOrder);
    const cpa = cpas.find(c => c.id === selectedCPA);

    if (!order || !cpa) return;

    const toastId = toast.loading('Assigning & Notifying CPA...');

    try {
      // 2. Database Update
      const { error } = await supabase
        .from('orders')
        .update({ cpa_id: selectedCPA, status: 'active' })
        .eq('id', selectedOrder);

      if (error) throw error;

      // 3. Send Email Notification (Via Vercel API)
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: cpa.email, // In Prod, this must be YOUR verified email (Resend Sandbox)
          toName: cpa.full_name,
          clientName: order.profiles?.business_name,
          packageName: order.package_name
        })
      });
      
      // 4. Success UI
      toast.success('Assigned & Email Sent!', { id: toastId });
      
      setSelectedOrder(null);
      setSelectedCPA("");
      fetchData(); 
    } catch (err: any) {
      toast.error('Assignment worked, but email failed.', { id: toastId });
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-600 font-medium animate-pulse">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-brand-900 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold flex items-center gap-2 tracking-wide">
            <Briefcase size={20} className="text-accent-lightGreen" /> ADMIN COMMAND
          </h1>
          <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">SUPER ADMIN</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
        
        {/* Orders Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <AlertCircle className="text-brand-600" /> Incoming Orders
            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full ml-auto">
              {orders.length} Total
            </span>
          </h2>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200 group">
                <div className="p-5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-brand-900 text-lg group-hover:text-brand-600 transition">{order.package_name}</h3>
                    <div className="flex flex-col gap-0.5 mt-1">
                       <span className="font-semibold text-gray-700">{order.profiles?.business_name || "Unknown Business"}</span>
                       <span className="text-sm text-gray-500">{order.profiles?.full_name}</span>
                       <span className="text-xs text-gray-400">{order.profiles?.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-brand-600 tracking-tight">${order.amount}</div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mt-2 uppercase tracking-wide ${
                      order.status === 'pending_match' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.status === 'active' && <CheckCircle size={12} />}
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {order.status === 'pending_match' ? (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Action Required</span>
                    <button 
                      onClick={() => { setSelectedOrder(order.id); setSelectedCPA(""); }}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Assign CPA
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-3 bg-green-50/50 border-t border-green-100 flex items-center gap-2 text-xs font-medium text-green-800">
                    <CheckCircle size={14} /> 
                    Matched to CPA ID: <span className="font-mono bg-white px-1 rounded border border-green-200">{order.cpa_id?.slice(0,8)}...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CPA List Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <User className="text-brand-600" /> CPA Roster
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            {cpas.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-gray-500 font-medium">No CPAs Found</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-50">
                {cpas.map(cpa => (
                    <li key={cpa.id} className="p-3 hover:bg-gray-50 transition rounded-lg flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                        {cpa.full_name?.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-sm text-gray-900">{cpa.full_name}</div>
                        <div className="text-xs text-brand-600 font-medium">{cpa.specialty || 'General Practice'}</div>
                    </div>
                    </li>
                ))}
                </ul>
            )}
          </div>
        </div>

      </main>

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title="Assign Order to CPA"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-bold">Instructions:</p>
            <p>Select a qualified CPA. They will receive an email notification instantly.</p>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Select CPA</label>
             <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 outline-none bg-white"
                value={selectedCPA}
                onChange={(e) => setSelectedCPA(e.target.value)}
             >
                <option value="">-- Choose a Professional --</option>
                {cpas.map(cpa => (
                  <option key={cpa.id} value={cpa.id}>
                    {cpa.full_name} • {cpa.specialty || 'General'}
                  </option>
                ))}
             </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">
              Cancel
            </button>
            <button onClick={handleMatchConfirm} disabled={!selectedCPA} className="flex-1 py-3 bg-brand-600 disabled:bg-gray-300 text-white font-bold rounded-lg shadow-md hover:bg-brand-700 transition">
              Assign & Notify
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
