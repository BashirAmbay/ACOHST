import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.warn('Error fetching users:', err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showSuccess(`User role updated to ${newRole}!`);
        fetchUsers();
      }
    } catch (err) {
      showError('Role update failed.');
    }
  };

  const roleOptions = ['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager', 'Student', 'Applicant'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Users & Role-Based Access Control (RBAC)</h1>
          <p className="text-xs text-slate-400">Manage administrative staff, assigned operational roles, and access permissions</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Current Role</th>
                <th className="p-3.5">Reassign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-3.5 font-mono text-slate-500">{u.id}</td>
                  <td className="p-3.5 font-bold text-white">{u.first_name} {u.last_name}</td>
                  <td className="p-3.5">{u.email}</td>
                  <td className="p-3.5">{u.phone || 'N/A'}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{u.role}</td>
                  <td className="p-3.5">
                    <select 
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                    >
                      {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
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
