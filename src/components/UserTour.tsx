import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function UserTour() {
  const { user, profile } = useAuth();
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && profile && !profile.has_seen_tour) {
      setTimeout(() => setRun(true), 1000);
    }
  }, [profile, mounted]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      if (user) {
        await supabase
          .from('profiles')
          .update({ has_seen_tour: true })
          .eq('id', user.id);
      }
    }
  };

  // --- SMB STEPS ---
  const smbSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#006FBA'}}>Welcome to CPA Canada!</h3>
          <p>We have matched you with the best CPA for your industry. Let us show you how to manage your business.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '[href="/dashboard/orders"]',
      content: 'Track the status of your tax filings and service packages here.',
    },
    {
      target: '[href="/dashboard/documents"]',
      content: 'Securely upload receipts and T2 forms here. Your CPA gets access instantly.',
    },
    {
      target: '[href="/dashboard/messages"]',
      content: 'Chat directly with your assigned accountant here.',
    },
  ];

  // --- CPA STEPS ---
  const cpaSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#006FBA'}}>Welcome, Partner!</h3>
          <p>This is your Command Center. Here is how you manage your practice and clients.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '[href="/dashboard/orders"]',
      content: (
        <div>
            <strong style={{display:'block', marginBottom:'4px'}}>Client Roster</strong>
            View assigned clients, manage revenue, and track engagement status.
        </div>
      ),
    },
    {
      target: '[href="/dashboard/documents"]',
      content: (
        <div>
            <strong style={{display:'block', marginBottom:'4px'}}>Client Files</strong>
            Access tax forms and documents uploaded by your clients securely.
        </div>
      ),
    },
    {
      target: '[href="/dashboard/messages"]',
      content: 'Communicate directly with your clients. Keep all correspondence in one place.',
    },
  ];

  if (!mounted || !profile) return null;

  return (
    <Joyride
      steps={profile.role === 'cpa' ? cpaSteps : smbSteps} // <--- DYNAMIC SWITCH
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#006FBA',
          zIndex: 9999,
          textColor: '#333',
          backgroundColor: '#fff',
        },
        buttonNext: {
            fontWeight: 'bold',
            borderRadius: '4px',
        }
      }}
    />
  );
}
