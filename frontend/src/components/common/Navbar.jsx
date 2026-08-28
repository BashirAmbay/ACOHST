import React, { useState } from 'react';
import logoImg from '../../../image/Logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone, Mail, MapPin, ChevronDown, User, LogOut, LayoutDashboard,
  FileText, Menu, X, Shield, BookOpen, GraduationCap, Award, Calendar,
  Image as GalleryIcon, Building2, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager'].includes(user.role)) {
      return '/admin';
    }
    if (user.role === 'Student') return '/student';
    return '/applicant';
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Bar - Contact & Portals */}
      <div className="bg-acohst-950 text-emerald-100 text-xs py-2 px-4 border-b border-acohst-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-acohst-400" />
              <span>+234 706 238 7370</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-white transition">
              <Mail className="w-3.5 h-3.5 text-acohst-400" />
              <span>info@acohst.edu.ng</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-white transition">
              <MapPin className="w-3.5 h-3.5 text-acohst-400" />
              <span>Kore Campus, Kano-Babura Expressway</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/admissions" className="hover:text-white font-medium">2026/2027 Admissions Open</Link>
            <span className="text-acohst-700">|</span>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="bg-acohst-700 hover:bg-acohst-600 text-white px-2.5 py-1 rounded font-medium flex items-center space-x-1 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard ({user.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-emerald-300 hover:text-white transition flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="hover:text-white flex items-center space-x-1 font-medium">
                  <User className="w-3.5 h-3.5" />
                  <span>Portal Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded font-medium transition"
                >
                  Apply Online
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo & College Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logoImg}
                alt="ACOHST Logo"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="block font-black text-lg md:text-xl text-slate-900 leading-tight tracking-tight">
                  ACOHST <span className="text-acohst-700">KORE</span>
                </span>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">

                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7 font-medium text-slate-700 text-sm">
              <Link
                to="/"
                className={`hover:text-acohst-700 transition ${location.pathname === '/' ? 'text-acohst-700 font-bold' : ''}`}
              >
                Home
              </Link>

              {/* About Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 hover:text-acohst-700 py-2 focus:outline-none"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <span>About ACOHST</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div
                  className="absolute left-0 top-full w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition-all z-50 animate-fadeIn"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link to="/about" className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-acohst-700">About College</Link>
                  <Link to="/about#vision" className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-acohst-700">Vision & Mission</Link>
                  <Link to="/about#values" className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-acohst-700">Core Values</Link>
                  <Link to="/management" className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-acohst-700">Principal Officers</Link>
                </div>
              </div>

              {/* Academics Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 hover:text-acohst-700 py-2 focus:outline-none"
                  onMouseEnter={() => setAcademicsOpen(true)}
                  onMouseLeave={() => setAcademicsOpen(false)}
                >
                  <span>Academics</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div
                  className="absolute left-0 top-full w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition-all z-50 animate-fadeIn"
                  onMouseEnter={() => setAcademicsOpen(true)}
                  onMouseLeave={() => setAcademicsOpen(false)}
                >
                  <Link to="/academics" className="block px-4 py-2.5 hover:bg-emerald-50 hover:text-acohst-700 font-semibold text-acohst-800">All Schools & Programmes</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/academics?school=SCHS" className="block px-4 py-2 hover:bg-emerald-50 text-xs text-slate-600">School of Community Health</Link>
                  <Link to="/academics?school=SMLS" className="block px-4 py-2 hover:bg-emerald-50 text-xs text-slate-600">School of Medical Lab Science</Link>
                  <Link to="/academics?school=SPHS" className="block px-4 py-2 hover:bg-emerald-50 text-xs text-slate-600">School of Pharmacy Technician</Link>
                  <Link to="/academics?school=SPEH" className="block px-4 py-2 hover:bg-emerald-50 text-xs text-slate-600">School of Environmental Health</Link>
                  <Link to="/academics?school=SHIM" className="block px-4 py-2 hover:bg-emerald-50 text-xs text-slate-600">School of Health Information Mgmt</Link>
                </div>
              </div>

              <Link to="/admissions" className={`hover:text-acohst-700 transition ${location.pathname === '/admissions' ? 'text-acohst-700 font-bold' : ''}`}>
                Admissions
              </Link>

              <Link to="/news" className={`hover:text-acohst-700 transition ${location.pathname.startsWith('/news') ? 'text-acohst-700 font-bold' : ''}`}>
                News & Events
              </Link>

              <Link to="/facilities" className={`hover:text-acohst-700 transition ${location.pathname === '/facilities' ? 'text-acohst-700 font-bold' : ''}`}>
                Facilities
              </Link>

              <Link to="/gallery" className={`hover:text-acohst-700 transition ${location.pathname === '/gallery' ? 'text-acohst-700 font-bold' : ''}`}>
                Gallery
              </Link>

              <Link to="/contact" className={`hover:text-acohst-700 transition ${location.pathname === '/contact' ? 'text-acohst-700 font-bold' : ''}`}>
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/register"
                className="bg-gradient-to-r from-acohst-700 to-acohst-600 hover:from-acohst-800 hover:to-acohst-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-200" />
                <span>Apply Now</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-2xl animate-slideDown">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              About ACOHST
            </Link>
            <Link
              to="/management"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Principal Officers
            </Link>
            <Link
              to="/academics"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Schools & Programmes
            </Link>
            <Link
              to="/admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Admissions
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              News & Events
            </Link>
            <Link
              to="/facilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Facilities
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-medium text-slate-800 hover:bg-emerald-50 hover:text-acohst-700"
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              {user ? (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-acohst-700 text-white text-center py-3 rounded-xl font-semibold"
                >
                  My Dashboard ({user.role})
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-slate-100 text-slate-800 text-center py-2.5 rounded-xl font-semibold"
                  >
                    Portal Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-emerald-600 text-white text-center py-2.5 rounded-xl font-semibold shadow"
                  >
                    Apply Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
