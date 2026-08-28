import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search } from 'lucide-react';
import api from '../../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      if (res.data.success) setLogs(res.data.logs);
    } catch (err) {
      console.warn('Error loading audit logs:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">System Security & Operation Audit Logs</h1>
          <p className="text-xs text-slate-400">Timestamped record of administrative status changes, role updates, and system operations</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Actor Email</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Operation Details</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="p-3.5 font-mono text-slate-500">{log.id}</td>
                  <td className="p-3.5 font-bold text-white">{log.user_email || 'System'}</td>
                  <td className="p-3.5"><span className="bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded border border-slate-800">{log.action}</span></td>
                  <td className="p-3.5 font-medium">{log.resource}</td>
                  <td className="p-3.5 text-slate-400">{log.details}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
