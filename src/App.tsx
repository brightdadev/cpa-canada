import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Pricing from './pages/Pricing';
import SMBDashboard from './pages/dashboards/SMBDashboard';
import CPADashboard from './pages/dashboards/CPADashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import SMBOnboarding from './pages/onboarding/SMBOnboarding';
import CPAOnboarding from './pages/onboarding/CPAOnboarding';
import OrdersPage from './pages/OrdersPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import DocumentsPage from './pages/DocumentsPage';

// Components
import OnboardingGuard from './components/OnboardingGuard';
import DashboardLayout from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-600 font-bold">Loading Platform...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const RoleRouter = () => {
  const { profile, loading } = useAuth();
  
  // FIX: If loading, just wait. Don't redirect.
  if (loading) return <div className="p-10 text-gray-400">Loading Profile Data...</div>;
  
  // FIX: If profile is missing but user exists, don't kick to login (loops). 
  // Show a "Creating Profile" state or fallback.
  if (!profile) return <div className="p-10 text-gray-400">Setting up your account...</div>;

  if (profile.role === 'admin') return <AdminDashboard />;
  if (profile.role === 'cpa') return <CPADashboard />;
  return <SMBDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup/:role" element={<AuthPage type="signup" />} />
        
        <Route path="/onboarding/smb" element={<ProtectedRoute><SMBOnboarding /></ProtectedRoute>} />
        <Route path="/onboarding/cpa" element={<ProtectedRoute><CPAOnboarding /></ProtectedRoute>} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><RoleRouter /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/orders" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><OrdersPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/documents" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><DocumentsPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/messages" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><MessagesPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/notifications" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><NotificationsPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/search" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><SearchPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/chat/:orderId" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><ChatPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <OnboardingGuard>
              <DashboardLayout><SettingsPage /></DashboardLayout>
            </OnboardingGuard>
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={<Navigate to="/pricing" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
