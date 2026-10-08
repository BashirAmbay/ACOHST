import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Shield, GraduationCap } from 'lucide-react';
import api from '../../services/api';

export default function StudentsList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/users?role=Student');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.warn('Error fetching student registry:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Student Registry & Enrolment Manager</h1>
          <p className="text-xs text-slate-400">View enrolled college students, assign matric numbers, and monitor status</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-3.5 font-mono text-slate-500">{u.id}</td>
                  <td className="p-3.5 font-bold text-white">{u.first_name} {u.last_name}</td>
                  <td className="p-3.5">{u.email}</td>
                  <td className="p-3.5">{u.phone || 'N/A'}</td>
                  <td className="p-3.5 font-bold text-cyan-400">{u.role}</td>
                  <td className="p-3.5 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
