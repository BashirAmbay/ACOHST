import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileCheck, CreditCard, BookOpen, TrendingUp, Award, 
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/metrics');
      if (res.data.success) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.warn('Error loading admin metrics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading executive management dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Executive Management Dashboard</h1>
          <p className="text-xs text-slate-400">Real-time admission metrics, enrolment statistics, and institutional revenue</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/applicants" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
            Review Applications ({metrics?.pendingReview})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applicants</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white block">{metrics?.totalApplicants}</span>
          <span className="text-[11px] text-emerald-400">2026/2027 Admission Cycle</span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Admitted Students</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-white block">{metrics?.totalAdmitted}</span>
          <span className="text-[11px] text-amber-400">Provisional Offer Approved</span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <FileCheck className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-3xl font-black text-white block">{metrics?.pendingReview}</span>
          <span className="text-[11px] text-sky-400">Awaiting Admission Board</span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 block">₦{metrics?.totalRevenue?.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">Paystack Verified Gateway</span>
        </div>

      </div>

      {/* Recent Applications Table */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Recent Application Submissions</h3>
          <Link to="/admin/applicants" className="text-xs text-emerald-400 hover:underline font-bold">
            View All Applications →
          </Link>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Ref No</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Programme Choice</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {metrics?.recentApplications?.map(app => (
                <tr key={app.id}>
                  <td className="p-3 font-mono font-bold text-emerald-400">{app.application_number}</td>
                  <td className="p-3 font-medium text-white">{app.first_name} {app.last_name}</td>
                  <td className="p-3">{app.programme_name || 'CHEW Diploma'}</td>
                  <td className="p-3"><Badge status={app.status} /></td>
                  <td className="p-3 text-slate-400">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link to={`/admin/applicants?id=${app.id}`} className="text-emerald-400 hover:underline font-bold">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
