import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, CheckCircle2, XCircle, Award, 
  FileText, Download, X, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

export default function ApplicantsList() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppDossier, setSelectedAppDossier] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, search]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admission/applications?status=${statusFilter}&search=${search}`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.warn('Error loading applications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDossier = async (id) => {
    try {
      const res = await api.get(`/admission/applications/${id}`);
      if (res.data.success) {
        setSelectedAppDossier(res.data);
        setSelectedApp(res.data.applicant);
        setNewStatus(res.data.applicant.status);
        setAdminRemarks(res.data.applicant.admin_remarks || '');
      }
    } catch (err) {
      showError('Error loading dossier.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    try {
      setLoading(true);
      const res = await api.put(`/admission/applications/${selectedApp.id}/status`, {
        status: newStatus,
        admin_remarks: adminRemarks
      });
      if (res.data.success) {
        showSuccess(`Application #${selectedApp.application_number} updated to ${newStatus}!`);
        setSelectedApp(null);
        setSelectedAppDossier(null);
        fetchApplications();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Status update failed.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ['Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Approved', 'Admitted', 'Rejected'];

  return (
    <div className="space-y-6">
      
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Admission Desk Applications Manager</h1>
          <p className="text-xs text-slate-400">Review candidate dossiers, inspect uploaded credentials, and issue admission decisions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ref, name, email..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Application Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Ref No</th>
                <th className="p-3.5">Candidate Name</th>
                <th className="p-3.5">Phone & Email</th>
                <th className="p-3.5">First Choice Programme</th>
                <th className="p-3.5">Fee Status</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{app.application_number}</td>
                  <td className="p-3.5 font-medium text-white">{app.first_name} {app.last_name}</td>
                  <td className="p-3.5 text-slate-400">{app.phone} <br/><span className="text-[11px]">{app.email}</span></td>
                  <td className="p-3.5 font-medium text-slate-200">{app.first_choice_name || 'CHEW Diploma'}</td>
                  <td className="p-3.5"><Badge status={app.payment_status || 'Pending'} /></td>
                  <td className="p-3.5"><Badge status={app.status} /></td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleOpenDossier(app.id)}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1 shadow transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Dossier Review Modal */}
      {selectedAppDossier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setSelectedAppDossier(null)}
              className="absolute top-4 right-4 bg-slate-800 text-slate-400 hover:text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">{selectedApp.application_number}</span>
                <h2 className="text-2xl font-black text-white">{selectedApp.first_name} {selectedApp.middle_name} {selectedApp.last_name}</h2>
                <p className="text-xs text-slate-400">{selectedApp.email} | {selectedApp.phone} | {selectedApp.gender}</p>
              </div>
              <Badge status={selectedApp.status} />
            </div>

            {/* Dossier Tabs: Bio, SSCE, Documents */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">Programmes Choice & State</h4>
                <p>1st Choice: <strong className="text-white">{selectedApp.first_choice_name}</strong></p>
                <p>State / LGA: <strong className="text-white">{selectedApp.state_of_origin} / {selectedApp.lga}</strong></p>
                <p>Address: <strong className="text-white">{selectedApp.address}</strong></p>
              </div>

              {/* Uploaded Documents List */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">Uploaded Credentials ({selectedAppDossier.documents.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAppDossier.documents.map(doc => (
                    <a 
                      key={doc.id}
                      href={doc.file_path}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500 flex items-center justify-between"
                    >
                      <span className="font-bold">{doc.document_type}</span>
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Status Update Action Box */}
              <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-800/80 space-y-4">
                <h4 className="font-bold text-emerald-300 text-sm">Admission Board Status Action</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Change Status To:</label>
                    <select 
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Admin Notes / Remarks:</label>
                    <input 
                      type="text"
                      value={adminRemarks}
                      onChange={e => setAdminRemarks(e.target.value)}
                      placeholder="e.g. Credentials verified, recommended for admission."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-xs"
                  >
                    {loading ? 'Updating Status...' : 'Apply Status Change & Send Notice'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
