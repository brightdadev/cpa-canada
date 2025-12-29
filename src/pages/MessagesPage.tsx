import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, User, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { profile } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      // Find orders where status is active (meaning a chat exists)
      let query = supabase.from('orders').select(`
        id, 
        package_name, 
        created_at,
        smb:smb_id(full_name, business_name), 
        cpa:cpa_id(full_name)
      `).eq('status', 'active');

      if (profile?.role === 'smb') query = query.eq('smb_id', profile.id);
      if (profile?.role === 'cpa') query = query.eq('cpa_id', profile.id);

      const { data } = await query;
      setChats(data || []);
      setLoading(false);
    };
    if (profile) fetchChats();
  }, [profile]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500">Your active conversations with your financial team.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
            <div className="text-center py-10 text-gray-400">Loading inbox...</div>
        ) : chats.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Messages Yet</h3>
                <p className="text-gray-500">Chats will appear here once you are matched with a CPA.</p>
            </div>
        ) : (
            chats.map(chat => {
                const otherName = profile?.role === 'smb' ? chat.cpa?.full_name : chat.smb?.business_name;
                
                return (
                    <Link key={chat.id} to={`/chat/${chat.id}`} className="block bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-brand-300 hover:shadow-md transition group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg shrink-0">
                                {otherName?.charAt(0) || <User size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900 truncate">{otherName}</h3>
                                    <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(chat.created_at))} ago</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate group-hover:text-brand-600 transition">
                                    Re: {chat.package_name} Package - Click to view conversation
                                </p>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-brand-600" />
                        </div>
                    </Link>
                )
            })
        )}
      </div>
    </div>
  );
}
