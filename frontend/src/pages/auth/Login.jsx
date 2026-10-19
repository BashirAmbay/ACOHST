import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, KeyRound, Eye, EyeOff, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import logoImg from '../../../image/Logo.png';
import bgImage from '../../../image/image 3.jpeg';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';

export default function Login({ defaultForgot = false }) {
  const [searchParams] = useSearchParams();
  const [isForgot, setIsForgot] = useState(defaultForgot || searchParams.get('action') === 'forgot');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (searchParams.get('action') === 'forgot') {
      setIsForgot(true);
    }
  }, [searchParams]);

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showError('Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
      showSuccess(res.data.message || 'Password reset link sent to your email!');
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
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
            <h2 className="text-xl font-bold text-slate-200">
              {isForgot ? 'Reset Account Password' : 'Sign in to your Institutional Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {isForgot
                ? 'Enter your registered email to receive a password reset link'
                : 'Access your applicant dashboard, student records, or staff desk'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {isForgot ? (
            /* Forgot Password Flow */
            forgotSent ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Reset Link Sent</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We have sent a secure password reset link to <span className="text-emerald-400 font-semibold">{forgotEmail}</span>. Please check your inbox (and spam folder) and follow the link to reset your password.
                </p>
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false);
                      setIsForgot(false);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(false)}
                    className="w-full text-xs text-slate-400 hover:text-white transition py-1"
                  >
                    Try another email address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="name@acohst.edu.ng"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{forgotLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgot(false)}
                    className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Regular Sign In Flow */
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgot(true);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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
          )}
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
