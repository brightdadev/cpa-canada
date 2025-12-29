import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, FileText, MessageSquare, Settings, 
  LogOut, Menu, X, Bell, Search, UserCircle, ChevronLeft, ChevronRight, Folder, Users 
} from 'lucide-react';
import Logo from '../assets/cpacanada.svg';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(false);

  const checkNotifications = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setHasUnread(count !== null && count > 0);
  };

  useEffect(() => {
    if (!user) return;
    checkNotifications();
    const channel = supabase
      .channel('notif-listener')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
          if (location.pathname !== '/dashboard/notifications') checkNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (location.pathname === '/dashboard/notifications') setHasUnread(false);
    else checkNotifications();
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const isActive = (path: string) => location.pathname === path;
  
  const isCPA = profile?.role === 'cpa';
  const isAdmin = profile?.role === 'admin';

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <Link 
      to={to}
      onClick={() => setSidebarOpen(false)}
      title={collapsed ? label : ''}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
        isActive(to) ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon size={20} className={`shrink-0 ${isActive(to) ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        
        {/* LOGO AREA - INCREASED SIZE */}
        <div className={`h-24 flex items-center border-b border-gray-100 ${collapsed ? 'justify-center px-0' : 'px-6'}`}>
           {collapsed ? (
             <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
           ) : (
             <img src={Logo} alt="CPA Canada" className="h-16 w-auto object-contain" />
           )}
           <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} className="text-gray-500" /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {!collapsed && <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Menu</p>}
          
          {isAdmin ? (
             <>
               <NavItem to="/dashboard" icon={LayoutDashboard} label="Command Center" />
               {/* System Alerts Removed as requested */}
             </>
          ) : (
             <>
               <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
               {isCPA ? (
                  <>
                    <NavItem to="/dashboard/orders" icon={Users} label="Client Roster" />
                    <NavItem to="/dashboard/documents" icon={Folder} label="Client Files" />
                  </>
               ) : (
                  <>
                    <NavItem to="/dashboard/orders" icon={FileText} label="My Orders" />
                    <NavItem to="/dashboard/documents" icon={Folder} label="Documents" />
                  </>
               )}
               <NavItem to="/dashboard/messages" icon={MessageSquare} label="Messages" />
             </>
          )}
          
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-3 border-t border-gray-100">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold shrink-0">{profile?.full_name?.charAt(0).toUpperCase()}</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{profile?.role}</p>
              </div>
            </div>
          ) : (
             <div className="flex justify-center mb-4">
               <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold" title={profile?.full_name}>{profile?.full_name?.charAt(0).toUpperCase()}</div>
             </div>
          )}
          <button onClick={handleSignOut} className={`flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium px-2 transition-colors w-full ${collapsed ? 'justify-center' : ''}`} title="Sign Out">
            <LogOut size={18} /> {!collapsed && "Sign Out"}
          </button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-brand-600 shadow-sm z-50">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <form onSubmit={handleSearch} className="hidden md:flex items-center text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 w-64 focus-within:ring-2 ring-brand-100 focus-within:border-brand-300 transition-all">
            <Search size={16} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-gray-700 placeholder-gray-400" />
          </form>
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/notifications" 
              onClick={() => setHasUnread(false)} 
              className="relative p-2 text-gray-400 hover:text-brand-600 transition"
            >
              <Bell size={20} />
              {hasUnread && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>}
            </Link>
            <Link to="/settings" className="text-gray-400 hover:text-brand-600 hidden md:block"><UserCircle size={24} /></Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
