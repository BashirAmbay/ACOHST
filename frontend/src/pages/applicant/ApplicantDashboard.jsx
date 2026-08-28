import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle2, Clock, Award, CreditCard, Upload, 
  ArrowRight, Shield, AlertCircle, FileCheck
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applicant/profile');
      if (res.data.success) {
        setProfile(res.data.applicant);
        setDocuments(res.data.documents || []);
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.warn('Error fetching applicant profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading applicant dashboard...</div>;
  }

  const statusSteps = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Admitted'];
  const currentStepIdx = statusSteps.indexOf(profile?.status || 'Draft');

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-acohst-900 via-acohst-800 to-medical-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mb-1">
            2026/2027 Admission Session
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {profile?.first_name} {profile?.last_name}!
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Application Number: <strong className="font-mono text-amber-300">{profile?.application_number}</strong>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/20 text-xs space-y-1">
          <span className="text-slate-300 block">Current Status:</span>
          <Badge status={profile?.status || 'Draft'} />
        </div>
      </div>

      {/* Admitted Special Celebration Alert */}
      {profile?.status === 'Admitted' && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg border border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">🎉 CONGRATULATIONS!</span>
            <h3 className="text-xl font-black">Provisional Admission Offered</h3>
            <p className="text-xs text-emerald-100">Your admission letter is now generated and ready for print.</p>
          </div>
          <Link
            to="/applicant/admission-letter"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs shadow transition flex-shrink-0"
          >
            Download Admission Letter
          </Link>
        </div>
      )}

      {/* Status Progress Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Application Status Progress</h3>
        
        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
          {statusSteps.map((s, idx) => (
            <div key={s} className="space-y-2">
              <div className={`h-2 rounded-full transition-all ${
                idx <= currentStepIdx ? 'bg-acohst-600' : 'bg-slate-200'
              }`}></div>
              <span className={idx <= currentStepIdx ? 'text-acohst-800' : 'text-slate-400'}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Form Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Application Form</span>
            <FileText className="w-5 h-5 text-acohst-700" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">
            {profile?.status === 'Draft' ? 'Form Incomplete' : 'Form Submitted'}
          </h4>
          <p className="text-xs text-slate-500">
            Programme: <strong>{profile?.first_choice_name || 'Not Selected'}</strong>
          </p>
          <div className="pt-2">
            <Link
              to="/applicant/apply"
              className="bg-acohst-700 hover:bg-acohst-800 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1 shadow"
            >
              <span>{profile?.status === 'Draft' ? 'Complete Form' : 'View Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Documents */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Uploaded Documents</span>
            <Upload className="w-5 h-5 text-acohst-700" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">
            {documents.length} Document(s) Uploaded
          </h4>
          <p className="text-xs text-slate-500">
            SSCE, Birth Certificate, Passport Photo
          </p>
          <div className="pt-2">
            <Link
              to="/applicant/apply?step=4"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1 border border-slate-300"
            >
              <span>Manage Documents</span>
            </Link>
          </div>
        </div>

        {/* Card 3: Application Fee */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Application Fee</span>
            <CreditCard className="w-5 h-5 text-acohst-700" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">
            {profile?.payment_status === 'Paid' ? 'Fee Paid (₦10,000)' : 'Fee Pending'}
          </h4>
          <p className="text-xs text-slate-500">
            Ref: <span className="font-mono text-[10px]">{profile?.payment_reference || 'None'}</span>
          </p>
          <div className="pt-2">
            <Badge status={profile?.payment_status || 'Pending'} />
          </div>
        </div>

      </div>

    </div>
  );
}
