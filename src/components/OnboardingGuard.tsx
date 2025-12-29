import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile) {
      // If onboarding NOT done, force redirect
      if (!profile.onboarding_completed) {
        if (profile.role === 'smb') navigate('/onboarding/smb');
        else if (profile.role === 'cpa') navigate('/onboarding/cpa');
        // Admins skip onboarding
      }
    }
  }, [profile, loading, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center text-brand-600">Loading...</div>;

  return <>{children}</>;
}
