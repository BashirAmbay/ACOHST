import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Users, FileCheck, BookOpen, CreditCard, 
  Newspaper, Calendar, Image as GalleryIcon, Building2, Settings, 
  ShieldAlert, LogOut, Menu, X, Bell, UserCheck, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Executive Overview', path: '/admin', icon: LayoutDashboard, roles: ['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager'] },
    { label: 'Admission Desk', path: '/admin/applicants', icon: FileCheck, roles: ['Super Admin', 'Administrator', 'Admission Officer'] },
    { label: 'Student Registry', path: '/admin/students', icon: UserCheck, roles: ['Super Admin', 'Administrator', 'Academic Officer'] },
    { label: 'Academic Setup', path: '/admin/academics', icon: BookOpen, roles: ['Super Admin', 'Administrator', 'Academic Officer'] },
    { label: 'Finance & Payments', path: '/admin/finance', icon: CreditCard, roles: ['Super Admin', 'Administrator', 'Finance Officer'] },
    { label: 'Website CMS Manager', path: '/admin/cms', icon: Newspaper, roles: ['Super Admin', 'Administrator', 'Content Manager'] },
    { label: 'Users & RBAC Roles', path: '/admin/users', icon: Users, roles: ['Super Admin', 'Administrator'] },
    { label: 'System Settings', path: '/admin/settings', icon: Settings, roles: ['Super Admin'] },
    { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert, roles: ['Super Admin'] },
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
      
      {/* Admin Header Topbar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/admin" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-acohst-600 to-medical-600 text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-black text-lg text-white tracking-tight hidden sm:inline-block">
                ACOHST <span className="text-emerald-400">MANAGEMENT PORTAL</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-xs hidden sm:block">
              <span className="block font-bold text-white">{user?.first_name} {user?.last_name}</span>
              <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded-md inline-block mt-0.5">
                {user?.role}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-rose-800/80 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        
        {/* Admin Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 space-y-1.5 overflow-y-auto h-full pt-16 lg:pt-4">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Administrative Control Panel
            </div>

            {allowedNav.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-semibold shadow-md' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-6 border-t border-slate-800 mt-6">
              <Link 
                to="/" 
                className="block text-center text-xs font-semibold text-slate-400 hover:text-emerald-400 py-2 bg-slate-900 rounded-lg"
              >
                🌐 Visit Public Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 bg-slate-900 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
