import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      showSuccess(`Welcome back, ${data.user.first_name}!`);
      
      const role = data.user.role;
      if (['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager'].includes(role)) {
        navigate('/admin');
      } else if (role === 'Student') {
        navigate('/student');
      } else {
        navigate('/applicant');
      }
    } catch (err) {
      showError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('ACOHSTPass2026!');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 py-12">
      
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-acohst-600 to-medical-600 flex items-center justify-center font-bold text-white shadow-lg">
              <Shield className="w-7 h-7 text-emerald-200" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight">ACOHST <span className="text-emerald-400">PORTAL</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-200">Sign in to your Institutional Account</h2>
          <p className="text-xs text-slate-400">Access your applicant dashboard, student records, or staff desk</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@acohst.edu.ng"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-900 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block text-center">
              ⚡ Quick Demo Login Switcher
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button 
                onClick={() => handleQuickDemo('admin@acohst.edu.ng')} 
                className="bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 p-2 rounded-lg border border-slate-800 text-left truncate"
              >
                👑 Super Admin
              </button>
              <button 
                onClick={() => handleQuickDemo('admissions@acohst.edu.ng')} 
                className="bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 p-2 rounded-lg border border-slate-800 text-left truncate"
              >
                📋 Admission Officer
              </button>
              <button 
                onClick={() => handleQuickDemo('student@acohst.edu.ng')} 
                className="bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 p-2 rounded-lg border border-slate-800 text-left truncate"
              >
                🎓 Enrolled Student
              </button>
              <button 
                onClick={() => handleQuickDemo('applicant@acohst.edu.ng')} 
                className="bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 p-2 rounded-lg border border-slate-800 text-left truncate"
              >
                📝 Prospective Applicant
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>New applicant?</span>
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Register Account & Apply Now
          </Link>
        </div>

      </div>

    </div>
  );
}
