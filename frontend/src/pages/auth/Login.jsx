import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../../image/Logo.png';
import bgImage from '../../../image/image 3.jpeg';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div
      className="min-h-screen relative flex flex-col justify-center items-center p-4 py-12 bg-contain bg-center bg-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for contrast and legibility */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-md w-full space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link to="/" className="inline-flex flex-col items-center space-y-3 group">
            <img
              src={logoImg}
              alt="ACOHST Logo"
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
            <span className="font-black text-2xl text-white tracking-tight">ACOHST <span className="text-emerald-400">PORTAL</span></span>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-200">Sign in to your Institutional Account</h2>
            <p className="text-xs text-slate-400">Access your applicant dashboard, student records, or staff desk</p>
          </div>
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-emerald-400 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
