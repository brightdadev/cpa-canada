import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { signInAnonymously } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
        syncFirebase(); // <--- Trigger Handshake
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
        syncFirebase(); // <--- Trigger Handshake
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // The Secure Handshake
  const syncFirebase = async () => {
    try {
      if (!firebaseAuth.currentUser) {
        await signInAnonymously(firebaseAuth);
        console.log("🔐 Connected to Secure Chat");
      }
    } catch (error) {
      console.error("Firebase Sync Failed:", error);
    }
  };

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle(); 
      
      if (data) {
        setProfile(data);
      } else {
        // Self-Healing Logic
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || 'New User',
            role: currentUser.user_metadata?.role?.toLowerCase() || 'smb'
          })
          .select()
          .single();
          
        if (newProfile) setProfile(newProfile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await firebaseAuth.signOut(); // Sign out of both
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
