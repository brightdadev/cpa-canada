import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface AuthPageProps {
  type: 'login' | 'signup';
}

export default function AuthPage({ type }: AuthPageProps) {
  const { role } = useParams<{ role: string }>(); 
  const navigate = useNavigate();
  const { user } = useAuth(); // <--- Listen to Global User State
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. REACTIVE NAVIGATION: Move ONLY when user state is ready
  useEffect(() => {
    if (user) {
      // If we are already logged in (or just logged in), go to dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'signup') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (authError) throw authError;
        if (!authData.user) throw new Error("No user created");

        const userRole = role ? role.toLowerCase() : 'smb';
        
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: userRole
        });

        if (profileError) console.warn("Profile creation delayed:", profileError);

        toast.success('Account created! Welcome.');
        // Don't navigate here manually. The useEffect will handle it.
        
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Welcome back!');
        // Don't navigate here manually. The useEffect will handle it.
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
      setLoading(false); // Only stop loading if there was an error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-brand-100">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-lightGreen"></div>
                <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                <div className="w-2 h-2 rounded-full bg-brand-600"></div>
           </div>
           <h2 className="text-2xl font-bold text-brand-900">
             {type === 'login' ? 'Welcome Back' : `Join as ${role?.toUpperCase()}`}
           </h2>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                required 
                autoComplete="name"
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-brand-600 outline-none transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              autoComplete="username"
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-brand-600 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              autoComplete={type === 'signup' ? 'new-password' : 'current-password'}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-brand-600 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-50 shadow-sm mt-2 flex justify-center items-center"
          >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (type === 'login' ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {type === 'login' ? (
             <p>New here? <Link to="/signup/smb" className="text-brand-600 font-semibold hover:underline">Sign up as SMB</Link></p>
          ) : (
             <p>Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
