import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import api from '../../services/api';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Col 1: Institutional Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                <Shield className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <span className="block font-black text-xl text-white tracking-tight">
                  ACOHST <span className="text-emerald-400">KORE</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                  Health Science & Tech College
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Al-Madinatu College of Health Science and Technology (ACOHST), Kore, is a premier health educational institution committed to raising competent, ethical, and practical healthcare specialists for nation building.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Recognized & Registered Health Institution</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
              Quick Portals & Pages
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>About ACOHST</span></Link></li>
              <li><Link to="/management" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>Principal Officers</span></Link></li>
              <li><Link to="/academics" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>Courses Offered</span></Link></li>
              <li><Link to="/admissions" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>How to Apply</span></Link></li>
              <li><Link to="/facilities" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>Clinical & Academic Labs</span></Link></li>
              <li><Link to="/news" className="hover:text-emerald-400 transition flex items-center space-x-1.5"><span>News & Announcements</span></Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition flex items-center space-x-1.5 font-medium text-emerald-400"><span>Applicant / Student Login</span></Link></li>
            </ul>
          </div>

          {/* Col 3: Courses Offered */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
              Courses Offered
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-white"><Link to="/academics?course=CHEW">• Community Health Extension Workers (CHEW)</Link></li>
              <li className="hover:text-white"><Link to="/academics?course=PT">• Pharmacy Technician (PT)</Link></li>
              <li className="hover:text-white"><Link to="/academics?course=MLT">• Medical Laboratory Technician (MLT)</Link></li>
              <li className="hover:text-white"><Link to="/academics?course=PHT">• Public Health Technician (PHT)</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
              Campus Contact & Helpdesk
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 mb-6">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Kore Town Campus, Along Babura Road Expressway, Dambatta LGA, Kano State, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+234 706 238 7073, +234 912 474 1827</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>almadinatucollege@gmail.com</span>
              </li>
            </ul>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Subscribe for Admission News</label>
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address..."
                  required
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-l-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-full"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-r-lg font-semibold flex items-center transition">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && <p className="text-xs text-emerald-400">Subscribed successfully!</p>}
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Al-Madinatu College of Health Science and Technology, Kore (ACOHST). All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/contact" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-400">Terms of Portal Use</Link>
            <Link to="/contact" className="hover:text-slate-400">ICT Helpdesk</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
