import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, GraduationCap, CreditCard, Printer, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import IDCard from '../../components/common/IDCard';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [showIDCard, setShowIDCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/profile');
      if (res.data.success) {
        setStudent(res.data.student);
        setRegisteredCourses(res.data.registeredCourses || []);
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.warn('Error loading student profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading student profile...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-medical-900 via-medical-800 to-acohst-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest block mb-1">
            Enrolled College Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {student?.first_name} {student?.last_name}
          </h1>
          <p className="text-xs text-cyan-100 mt-1 font-mono">
            MATRIC NO: <strong className="text-amber-300 font-bold">{student?.matric_number || 'ACOHST/2026/CHEW/014'}</strong>
          </p>
        </div>

        <button 
          onClick={() => setShowIDCard(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>View Student Digital ID</span>
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Programme & Level</span>
          <h4 className="font-extrabold text-slate-900 text-base">{student?.programme_name || 'CHEW Diploma'}</h4>
          <p className="text-xs text-slate-500">{student?.school_name} ({student?.level || 100} Level)</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Registered Semester Courses</span>
          <h4 className="font-extrabold text-slate-900 text-base">{registeredCourses.length} Courses Enrolled</h4>
          <p className="text-xs text-slate-500">First Semester 2026/2027</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Academic Performance</span>
          <h4 className="font-extrabold text-emerald-700 text-base">Cumulative GPA: 3.67</h4>
          <p className="text-xs text-slate-500">Upper Credit Standing</p>
        </div>

      </div>

      {/* ID Card Modal */}
      {showIDCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full relative space-y-4">
            <button 
              onClick={() => setShowIDCard(false)}
              className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              ✕ Close
            </button>
            <IDCard student={student} />
          </div>
        </div>
      )}

    </div>
  );
}
