import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ChatPage() {
  const { orderId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, smb:smb_id ( full_name, business_name ), cpa:cpa_id ( full_name, specialty )`)
        .eq('id', orderId)
        .single();

      if (error) {
        toast.error('Chat not found');
        navigate('/dashboard');
      } else {
        setOrderDetails(data);
      }
      setLoading(false);
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const q = query(collection(db, 'chats', orderId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [orderId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, 'chats', orderId!, 'messages'), {
        text: message,
        senderId: user?.id,
        senderName: profile?.full_name,
        createdAt: serverTimestamp(),
      });
      setMessage('');
    } catch (err) {
      toast.error('Failed to send');
    }
  };

  if (loading) return <div className="h-[100dvh] flex items-center justify-center">Loading Chat...</div>;

  const isSMB = profile?.role === 'smb';
  const otherName = isSMB ? orderDetails?.cpa?.full_name : orderDetails?.smb?.business_name;
  const otherRole = isSMB ? 'CPA' : 'Client';

  return (
    // FIX: Use 100dvh for mobile browsers
    <div className="flex flex-col h-[calc(100dvh-64px)] lg:h-[calc(100vh-64px)] bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/messages')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 lg:hidden text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold border border-brand-200">
                {otherName?.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                 {otherName || 'Unknown User'}
                 {otherRole === 'CPA' && <ShieldCheck size={14} className="text-green-600" />}
               </h2>
               <p className="text-xs text-gray-500">{orderDetails?.package_name} Package</p>
             </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[60%] p-3 rounded-2xl text-sm shadow-sm ${
                  isMe ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                <p>{msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-200' : 'text-gray-400'}`}>
                   {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm') : '...'}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input - Sticky Bottom */}
      <div className="bg-white p-3 border-t border-gray-200 sticky bottom-0 z-20 pb-safe">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-brand-500 focus:bg-white transition outline-none text-base" // text-base prevents iOS zoom
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 transition shadow-sm flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
