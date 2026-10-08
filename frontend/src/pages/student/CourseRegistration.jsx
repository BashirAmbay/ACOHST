import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Printer, Plus } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function CourseRegistration() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [availRes, profileRes] = await Promise.all([
        api.get('/student/available-courses'),
        api.get('/student/profile')
      ]);

      if (availRes.data.success) setAvailableCourses(availRes.data.courses);
      if (profileRes.data.success) setRegisteredCourses(profileRes.data.registeredCourses || []);
    } catch (err) {
      console.warn('Error loading course data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRegister = async () => {
    if (selectedIds.length === 0) {
      showError('Please select at least one course.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/student/register-courses', {
        course_ids: selectedIds,
        semester: 1
      });
      if (res.data.success) {
        showSuccess('Courses registered successfully!');
        setRegisteredCourses(res.data.registeredCourses);
        setSelectedIds([]);
      }
    } catch (err) {
      showError('Course registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const totalCreditUnits = registeredCourses.reduce((sum, c) => sum + c.credit_units, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">First Semester Course Registration</h2>
            <p className="text-xs text-slate-500">Select and register your academic courses for the 2026/2027 Session</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="no-print bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Course Slip</span>
          </button>
        </div>

        {/* Registered Courses Table */}
        {registeredCourses.length > 0 && (
          <div className="printable-area border rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-3 font-bold flex justify-between">
              <span>REGISTERED COURSES</span>
              <span>Total Units: {totalCreditUnits}</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Units</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registeredCourses.map(c => (
                  <tr key={c.id}>
                    <td className="p-3 font-mono font-bold text-acohst-800">{c.code}</td>
                    <td className="p-3 font-medium">{c.title}</td>
                    <td className="p-3">{c.credit_units}</td>
                    <td className="p-3 text-emerald-700 font-bold">Approved</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Available Selection Form */}
        <div className="pt-6 space-y-4 no-print border-t">
          <h3 className="font-bold text-sm text-slate-900">Available Semester Courses</h3>
          
          <div className="space-y-2">
            {availableCourses.map(c => {
              const isAlreadyReg = registeredCourses.some(rc => rc.course_id === c.id || rc.id === c.id);
              const isSelected = selectedIds.includes(c.id);

              return (
                <div 
                  key={c.id} 
                  onClick={() => !isAlreadyReg && handleToggleSelect(c.id)}
                  className={`p-4 rounded-2xl border flex justify-between items-center cursor-pointer transition ${
                    isAlreadyReg ? 'bg-emerald-50 border-emerald-200 cursor-default' :
                    isSelected ? 'bg-sky-50 border-sky-400' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold text-acohst-800 text-xs mr-2">{c.code}</span>
                    <span className="font-bold text-slate-900 text-xs">{c.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{c.credit_units} Credit Units • Semester {c.semester}</span>
                  </div>

                  {isAlreadyReg ? (
                    <span className="text-xs font-bold text-emerald-700">Enrolled</span>
                  ) : (
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 text-acohst-600 rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleRegister}
              disabled={loading || selectedIds.length === 0}
              className="bg-acohst-700 hover:bg-acohst-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow transition"
            >
              {loading ? 'Submitting Registration...' : `Register Selected (${selectedIds.length}) Courses`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
