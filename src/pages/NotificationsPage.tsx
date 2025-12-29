import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAndRead();
    }
  }, [user]);

  const loadAndRead = async () => {
    // 1. Fetch
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    setNotifications(data || []);
    setLoading(false);

    // 2. Mark Read (Execute immediately if any are unread)
    const unreadIds = data?.filter((n: any) => !n.is_read).map((n: any) => n.id) || [];
    
    if (unreadIds.length > 0) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-brand-600" /> Notifications
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-gray-900">All caught up</h3>
            <p className="text-gray-500">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((note) => (
              <div 
                key={note.id} 
                className="p-4 flex gap-4 hover:bg-gray-50 transition"
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${note.is_read ? 'bg-gray-300' : 'bg-brand-600'}`} />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{note.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {formatDistanceToNow(new Date(note.created_at))} ago
                  </span>
                </div>
                {note.link && (
                  <Link to={note.link} className="p-2 text-gray-400 hover:text-brand-600 bg-gray-50 rounded-full h-fit">
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
