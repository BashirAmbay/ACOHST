import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import logoImg from '../../../image/Logo.png';
import bgImage from '../../../image/image 3.jpeg';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      showError('Invalid or missing password reset token.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        token,
        password
      });

      if (res.data.success) {
        setSuccess(true);
        showSuccess(res.data.message || 'Password reset successfully!');
      } else {
        showError(res.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to reset password.');
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
            <h2 className="text-xl font-bold text-slate-200">Reset Your Password</h2>
            <p className="text-xs text-slate-400">Create a secure new password for your institutional account</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {!token || !email ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Invalid Reset Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This password reset link is invalid or incomplete. Please request a new password reset link from the sign-in page.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs border border-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Password Reset Complete!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your password has been securely updated. You can now log in to the portal using your new password.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-3">
                Resetting password for: <span className="font-semibold text-emerald-400">{email}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-emerald-400 transition"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs text-slate-400 hover:text-emerald-400 transition space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>Need assistance? Contact</span>
          <a href="mailto:almadinatucollege@gmail.com" className="text-emerald-400 font-bold hover:underline">
            Support Desk
          </a>
        </div>

      </div>

    </div>
  );
}
