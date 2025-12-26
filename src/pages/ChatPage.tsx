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

  // 1. Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            smb:smb_id ( full_name, business_name ),
            cpa:cpa_id ( full_name, specialty )
        `)
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

  // 2. Real-time Firestore Listener
  useEffect(() => {
    if (!orderId) return;

    // Collection: chats -> {orderId} -> messages
    const q = query(
      collection(db, 'chats', orderId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
      console.error(err);
      toast.error('Failed to send');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Chat...</div>;

  const isSMB = profile?.role === 'smb';
  const otherName = isSMB ? orderDetails?.cpa?.full_name : orderDetails?.smb?.business_name;
  const otherRole = isSMB ? 'CPA' : 'Client';

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-brand-900 text-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="hover:bg-brand-800 p-2 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center font-bold border border-brand-500">
                {otherName?.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 className="font-bold text-sm md:text-base flex items-center gap-2">
                 {otherName || 'Unknown User'}
                 {otherRole === 'CPA' && <ShieldCheck size={14} className="text-accent-green" />}
               </h2>
               <p className="text-xs text-brand-200">{orderDetails?.package_name} Package • Active</p>
             </div>
          </div>
        </div>
        <button className="text-brand-200 hover:text-white"><MoreVertical size={20} /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-50/30">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] md:max-w-[60%] p-3 rounded-2xl shadow-sm text-sm ${
                  isMe 
                    ? 'bg-brand-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
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

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-brand-500 focus:bg-white transition outline-none"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
