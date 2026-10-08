import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileEdit, FileCheck, Award, CreditCard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ApplicantLayout() {
  const { user, applicant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Applicant Dashboard', path: '/applicant', icon: LayoutDashboard },
    { label: 'Application Form', path: '/applicant/apply', icon: FileEdit },
    { label: 'Admission Status', path: '/applicant/status', icon: FileCheck },
    { label: 'Admission Letter', path: '/applicant/admission-letter', icon: Award, disabled: applicant?.status !== 'Admitted' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-acohst-950 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
              <Shield className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="block font-black text-base md:text-lg tracking-tight">ACOHST ADMISSIONS PORTAL</span>
              <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Al-Madinatu College of Health Science & Tech</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right text-xs">
              <span className="block font-bold text-white">{user?.first_name} {user?.last_name}</span>
              <span className="text-emerald-400 font-mono">{applicant?.application_number || 'Applicant'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-rose-700/50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2 sticky top-24">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Application Navigation
            </div>

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              if (item.disabled) return null;

              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-acohst-700 text-white font-semibold shadow-md' 
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-acohst-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-100">
              <Link 
                to="/" 
                className="block text-center text-xs font-semibold text-slate-500 hover:text-acohst-700 py-2"
              >
                ← Back to Main Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow min-w-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
