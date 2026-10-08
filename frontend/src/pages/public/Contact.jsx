import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/contact/send', formData);
      if (res.data.success) {
        setSubmitted(true);
        showSuccess(res.data.message);
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-12">
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Contact Us & Campus Desk</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Have questions regarding 2026/2027 admissions, school fees, or campus visits? Reach out to our team.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Details Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Campus Contact Information</h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-acohst-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Campus Location:</strong>
                    <span>Kore Town Campus, Along Babura Road Expressway, Dambatta LGA, Kano State, Nigeria</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-5 h-5 text-acohst-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Admission Hotline:</strong>
                    <span>+234 706 238 7370, +234 912 474 1827</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-acohst-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Email Address:</strong>
                    <span>almadinatucollege@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <strong>Office Hours:</strong> Monday – Friday: 8:00 AM – 4:00 PM
              </div>
            </div>

            {/* Google Map Mock Box */}
            <div className="bg-slate-800 text-slate-300 p-8 rounded-3xl border border-slate-700 flex flex-col items-center justify-center text-center h-52">
              <MapPin className="w-10 h-10 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white text-sm">ACOHST Kore Main Campus Map</h4>
              <p className="text-xs text-slate-400 mt-1">Kano-Babura Expressway, Kano State</p>
            </div>
          </div>

          {/* Inquiry Form Right */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-500">Fill out this form and our admission desk will reply promptly.</p>
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Thank you! Your message has been dispatched to ACOHST Admission Desk.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Fatima Muhammad"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. fatima@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admission Requirements">Admission Requirements</option>
                      <option value="School Fees & Payment">School Fees & Payment</option>
                      <option value="Hostel Accommodation">Hostel Accommodation</option>
                      <option value="Transcript & Verification">Transcript & Verification</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message Body *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-acohst-700 hover:bg-acohst-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
