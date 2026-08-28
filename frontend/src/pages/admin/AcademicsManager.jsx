import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Building2, GraduationCap, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function AcademicsManager() {
  const [schools, setSchools] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [showAddProg, setShowAddProg] = useState(false);
  const { showSuccess, showError } = useToast();

  const [newProg, setNewProg] = useState({
    department_id: 1,
    name: '',
    code: '',
    degree_type: 'Diploma',
    duration_years: 3,
    requirement_summary: '',
    fee_amount: 75000,
    description: ''
  });

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [schRes, progRes] = await Promise.all([
        api.get('/academics/schools'),
        api.get('/academics/programmes')
      ]);
      if (schRes.data.success) setSchools(schRes.data.schools);
      if (progRes.data.success) setProgrammes(progRes.data.programmes);
    } catch (err) {
      console.warn('Error loading academic manager:', err.message);
    }
  };

  const handleCreateProgramme = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/academics/programmes', newProg);
      if (res.data.success) {
        showSuccess('New academic programme created successfully!');
        setShowAddProg(false);
        fetchAcademicData();
      }
    } catch (err) {
      showError('Failed to create programme.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Academic Setup & Programme Management</h1>
          <p className="text-xs text-slate-400">Configure Schools, Departments, Programmes, and Fee Structures</p>
        </div>
        <button 
          onClick={() => setShowAddProg(!showAddProg)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Programme</span>
        </button>
      </div>

      {/* Add Form Drawer */}
      {showAddProg && (
        <form onSubmit={handleCreateProgramme} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs text-slate-200">
          <h3 className="font-bold text-emerald-400 text-sm">Create New Health Science Programme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Programme Name *</label>
              <input 
                type="text" required value={newProg.name} 
                onChange={e => setNewProg({...newProg, name: e.target.value})} 
                placeholder="e.g. Diploma in Dental Health"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label className="block mb-1">Programme Code *</label>
              <input 
                type="text" required value={newProg.code} 
                onChange={e => setNewProg({...newProg, code: e.target.value})} 
                placeholder="e.g. DDH"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label className="block mb-1">Degree / Award Type *</label>
              <select 
                value={newProg.degree_type} 
                onChange={e => setNewProg({...newProg, degree_type: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="ND">ND</option>
                <option value="HND">HND</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Session Tuition Fee (₦) *</label>
              <input 
                type="number" required value={newProg.fee_amount} 
                onChange={e => setNewProg({...newProg, fee_amount: parseFloat(e.target.value)})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label className="block mb-1">Requirements Summary</label>
              <input 
                type="text" value={newProg.requirement_summary} 
                onChange={e => setNewProg({...newProg, requirement_summary: e.target.value})} 
                placeholder="5 O-Level credits in English, Math, Biology..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowAddProg(false)} className="px-4 py-2 text-slate-400">Cancel</button>
            <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl">Save Programme</button>
          </div>
        </form>
      )}

      {/* Active Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map(prog => (
          <div key={prog.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded border border-emerald-800">
                {prog.degree_type} ({prog.duration_years} Yrs)
              </span>
              <span className="font-mono text-slate-500 font-bold">{prog.code}</span>
            </div>
            <h3 className="font-bold text-white text-base">{prog.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{prog.description}</p>
            <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-500">Session Fee:</span>
              <span className="font-bold text-amber-300">₦{prog.fee_amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
