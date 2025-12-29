import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Download, File, CheckCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const { user, profile } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchActiveOrder();
      fetchDocs();
    }
  }, [user]);

  // 1. Check for Active Order (To enable sharing)
  const fetchActiveOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id')
      .or(`smb_id.eq.${user?.id},cpa_id.eq.${user?.id}`)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    
    if (data) setActiveOrderId(data.id);
  };

  // 2. Fetch Files (Own + Shared via Order)
  const fetchDocs = async () => {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    // If SMB: My files OR files in my order
    // If CPA: Files in orders assigned to me
    // Simplified: Get files where user_id = me OR order_id is in my orders list
    // Ideally use RLS, but here we filter for UI
    
    const { data } = await query;
    // Client-side filter to be safe until RLS is perfect
    const myDocs = data?.filter(d => d.user_id === user?.id || d.order_id === activeOrderId);
    
    setDocs(myDocs || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    try {
      // Upload
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save Metadata (Link to Order if active!)
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user?.id,
        name: file.name,
        size: file.size,
        url: filePath,
        order_id: activeOrderId // <--- THIS SHARES IT WITH CPA
      });

      if (dbError) throw dbError;

      toast.success(activeOrderId ? 'Uploaded & Shared with CPA!' : 'Uploaded to Vault');
      fetchDocs();
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase.storage.from('documents').download(path);
      if (error) throw error;
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
    } catch (error: any) {
      toast.error('Download failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-brand-600" /> Document Vault
          </h1>
          <p className="text-gray-500 mt-1">
            {activeOrderId 
              ? "Files uploaded here are automatically shared with your CPA." 
              : "Private secure storage for your financial documents."}
          </p>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            onChange={handleUpload} 
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          <button className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-brand-700 transition flex items-center gap-2 w-full md:w-auto">
            {uploading ? 'Uploading...' : <><Upload size={20} /> Upload & Share</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-10 text-center text-gray-400">Loading vault...</div>
        ) : docs.length === 0 ? (
            <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Upload size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Vault is Empty</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">Upload your first document.</p>
            </div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th className="px-6 py-4">File Name</th>
                        <th className="px-6 py-4">Sharing</th>
                        <th className="px-6 py-4">Size</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {docs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded text-gray-500"><FileText size={18} /></div>
                                    <span className="font-bold text-gray-900">{doc.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {doc.order_id ? (
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                        <Users size={12} /> Shared
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold">
                                        Private
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{(doc.size / 1024).toFixed(1)} KB</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(doc.created_at), 'MMM d')}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDownload(doc.url, doc.name)} className="p-2 text-gray-400 hover:text-brand-600 rounded-full">
                                    <Download size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
