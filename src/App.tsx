import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Pricing from './pages/Pricing';
import SMBDashboard from './pages/dashboards/SMBDashboard';
import CPADashboard from './pages/dashboards/CPADashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-600 font-medium">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const RoleRouter = () => {
  const { profile, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!profile) return <Navigate to="/login" />;

  if (profile.role === 'admin') return <AdminDashboard />;
  if (profile.role === 'cpa') return <CPADashboard />;
  return <SMBDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '0.5rem',
              padding: '16px',
            },
            success: { iconTheme: { primary: '#009A49', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }} 
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Restored Auth Routing */}
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup/:role" element={<AuthPage type="signup" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleRouter />
            </ProtectedRoute>
          } />

          <Route path="/chat/:orderId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={<Navigate to="/pricing" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
