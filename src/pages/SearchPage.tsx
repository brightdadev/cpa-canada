import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, User } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { profile } = useAuth();
  
  const [results, setResults] = useState<{orders: any[], users: any[]}>({ orders: [], users: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length > 2) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    // 1. Search Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .ilike('package_name', `%${query}%`)
      .eq(profile?.role === 'smb' ? 'smb_id' : 'cpa_id', profile?.id);

    // 2. Search Profiles (Mock logic: searching generic profiles for demo)
    // In production, this would search CPAs or connected clients
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${query}%`)
      .limit(5);

    setResults({ orders: orders || [], users: users || [] });
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="text-gray-400" /> Search Results
        </h1>
        <p className="text-gray-500">Showing results for <span className="font-bold text-gray-900">"{query}"</span></p>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Searching database...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Orders Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Orders & Services</h3>
            {results.orders.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No orders found matching this query.</p>
            ) : (
                <div className="grid gap-3">
                    {results.orders.map(order => (
                        <Link key={order.id} to={`/chat/${order.id}`} className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-brand-500 transition">
                            <div className="flex items-center gap-3">
                                <div className="bg-brand-50 p-2 rounded text-brand-600"><FileText size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{order.package_name}</h4>
                                    <p className="text-xs text-gray-500">ID: {order.id.slice(0,8)} • ${order.amount}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
          </section>

          {/* Users Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">People</h3>
            {results.users.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No users found.</p>
            ) : (
                <div className="grid gap-3">
                    {results.users.map(u => (
                        <div key={u.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-full text-gray-500"><User size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">{u.full_name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}
