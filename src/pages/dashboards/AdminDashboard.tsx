import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, Briefcase, CheckCircle, AlertCircle, DollarSign, 
  Search, ShieldCheck, Clock, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [cpas, setCpas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'cpas'>('orders');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [stats, setStats] = useState({ revenue: 0, pending: 0, verified_cpas: 0 });
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
        .eq('role', 'cpa')
        .order('created_at', { ascending: false });

      const oList = ordersData || [];
      const cList = cpasData || [];

      setOrders(oList);
      setCpas(cList);

      const rev = oList.reduce((sum, ord) => sum + (Number(ord.amount) || 0), 0);
      const pen = oList.filter(o => o.status === 'pending_match').length;
      const ver = cList.filter(c => c.verified).length;

      setStats({ revenue: rev, pending: pen, verified_cpas: ver });

    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchConfirm = async () => {
    if (!selectedOrder || !selectedCPA) return;
    const order = orders.find(o => o.id === selectedOrder);
    const cpa = cpas.find(c => c.id === selectedCPA);
    if (!order || !cpa) return;

    const toastId = toast.loading('Processing...');

    try {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: cpa.email,
            toName: cpa.full_name,
            clientName: order.profiles?.business_name,
            packageName: order.package_name
          })
        });
      } catch (e) { console.warn("Email skipped"); }

      const { error } = await supabase
        .from('orders')
        .update({ cpa_id: selectedCPA, status: 'active' })
        .eq('id', selectedOrder);

      if (error) throw error;
      
      toast.success('Assignment Complete!', { id: toastId });
      setSelectedOrder(null);
      setSelectedCPA("");
      fetchData(); 
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const toggleVerification = async (cpaId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('profiles').update({ verified: !currentStatus }).eq('id', cpaId);
    if (!error) {
      toast.success(currentStatus ? 'CPA Unverified' : 'CPA Verified');
      fetchData();
    }
  };

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const currentCPAs = cpas.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil((activeTab === 'orders' ? orders.length : cpas.length) / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div className="h-96 flex items-center justify-center text-gray-400">Loading Command Center...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-900 text-white p-6 rounded-xl shadow-md relative overflow-hidden">
           <div className="relative z-10">
             <p className="text-brand-200 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
             <h3 className="text-3xl font-bold mt-1">${stats.revenue.toLocaleString()}</h3>
           </div>
           <DollarSign className="absolute right-4 bottom-4 text-brand-800 w-16 h-16 opacity-50" />
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Orders</p>
             <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
           </div>
           <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Clock size={24} /></div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Verified CPAs</p>
             <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.verified_cpas} <span className="text-sm text-gray-400 font-normal">/ {cpas.length}</span></h3>
           </div>
           <div className="bg-green-100 p-3 rounded-full text-green-600"><ShieldCheck size={24} /></div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Tab Header */}
        <div className="border-b border-gray-200 px-6 pt-4 flex gap-8">
          <button onClick={() => { setActiveTab('orders'); setCurrentPage(1); }} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Order Management</button>
          <button onClick={() => { setActiveTab('cpas'); setCurrentPage(1); }} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'cpas' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>CPA Roster</button>
        </div>

        {/* TAB CONTENT: ORDERS */}
        {activeTab === 'orders' && (
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
               <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Filter size={14} /> Incoming Orders</div>
               <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Page {currentPage} of {totalPages}</span>
            </div>

            <div className="divide-y divide-gray-100 flex-1">
              {currentOrders.map(order => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${order.status === 'pending_match' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {order.status === 'pending_match' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{order.package_name}</h4>
                        <div className="text-sm text-gray-500 mt-1">Client: <span className="font-medium text-gray-900">{order.profiles?.business_name || 'Unknown'}</span> <span className="mx-2">•</span> {order.profiles?.email}</div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">ID: {order.id.slice(0,8)}...</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                         <div className="font-bold text-xl text-brand-600">${order.amount}</div>
                         <div className="text-xs text-gray-400 capitalize">{order.status.replace('_', ' ')}</div>
                      </div>
                      {order.status === 'pending_match' ? (
                        <button onClick={() => { setSelectedOrder(order.id); setSelectedCPA(""); }} className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition">Assign CPA</button>
                      ) : (
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-bold text-gray-500">Assigned</div>
                      )}
                   </div>
                </div>
              ))}
              {currentOrders.length === 0 && <div className="p-8 text-center text-gray-500">No orders found.</div>}
            </div>
          </div>
        )}

        {/* TAB CONTENT: CPAS */}
        {activeTab === 'cpas' && (
          <div className="flex-1 flex flex-col">
             <table className="w-full text-left text-sm flex-1">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4 font-bold">Name / License</th>
                    <th className="px-6 py-4 font-bold">Specialty</th>
                    <th className="px-6 py-4 font-bold">Experience</th>
                    <th className="px-6 py-4 font-bold text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {currentCPAs.map(cpa => (
                    <tr key={cpa.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{cpa.full_name}</div>
                        <div className="text-xs text-gray-500">{cpa.email}</div>
                    </td>
                    <td className="px-6 py-4"><span className="bg-blue-50 text-brand-700 px-2 py-1 rounded text-xs font-bold">{cpa.specialty || 'General'}</span></td>
                    <td className="px-6 py-4 text-gray-600">{cpa.years_experience ? `${cpa.years_experience} Years` : '-'}</td>
                    <td className="px-6 py-4 text-center">
                        {cpa.verified ? <span className="inline-flex items-center gap-1 text-green-600 font-bold text-xs"><ShieldCheck size={14}/> Verified</span> : <span className="text-orange-500 font-bold text-xs">Pending</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => toggleVerification(cpa.id, cpa.verified)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition border ${cpa.verified ? 'border-gray-300 text-gray-600 hover:bg-gray-100' : 'bg-green-600 border-transparent text-white hover:bg-green-700'}`}>
                        {cpa.verified ? 'Revoke' : 'Verify'}
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
            <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">Page {currentPage} of {totalPages || 1}</span>
            <button 
                onClick={nextPage} 
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next <ChevronRight size={16} />
            </button>
        </div>

      </div>

      {/* Assignment Modal */}
      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title="Assign Order to CPA"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            Select a verified CPA to handle this client. They will receive an email notification.
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Select Professional</label>
             <select className="w-full p-3 border border-gray-300 rounded-lg bg-white" value={selectedCPA} onChange={(e) => setSelectedCPA(e.target.value)}>
                <option value="">-- Choose a CPA --</option>
                {cpas.filter(c => c.verified).map(cpa => (
                  <option key={cpa.id} value={cpa.id}>{cpa.full_name} • {cpa.specialty}</option>
                ))}
             </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleMatchConfirm} disabled={!selectedCPA} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50">Confirm</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
