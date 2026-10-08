import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../../image/Logo.png';
import bgImage from '../../../image/image 3.jpeg';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Applicant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      showSuccess('Account registered successfully! You are logged in.');
      navigate('/applicant');
    } catch (err) {
      showError(err.message || 'Registration failed.');
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

        <div className="text-center space-y-3 flex flex-col items-center">
          <Link to="/" className="inline-flex flex-col items-center space-y-3 group">
            <img
              src={logoImg}
              alt="ACOHST Logo"
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
            <span className="font-black text-2xl text-white tracking-tight">ACOHST <span className="text-emerald-400">ADMISSIONS</span></span>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-200">Create Applicant Portal Account</h2>
            <p className="text-xs text-slate-400">Start your online admission application for 2026/2027</p>
          </div>
        </div>

        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g. Fatima"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g. Muhammad"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. fatima@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 812 345 6789"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              <span>{loading ? 'Registering Account...' : 'Register & Proceed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>Already registered?</span>
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>

    </div>
  );
}
