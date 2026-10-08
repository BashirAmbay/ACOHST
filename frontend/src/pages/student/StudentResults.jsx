import React, { useState, useEffect } from 'react';
import { GraduationCap, Printer, Award } from 'lucide-react';
import api from '../../services/api';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ totalCourses: 0, totalUnits: 0, cgpa: '0.00' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/results');
      if (res.data.success) {
        setResults(res.data.results);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.warn('Error fetching results:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Official Statement of Academic Results</h2>
            <p className="text-xs text-slate-500">Semester performance grades and Cumulative Grade Point Average (CGPA)</p>
          </div>
          <button onClick={() => window.print()} className="no-print bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
            <Printer className="w-4 h-4" />
            <span>Print Result Statement</span>
          </button>
        </div>

        {/* GPA Summary Card */}
        <div className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white p-6 rounded-2xl flex justify-between items-center">
          <div>
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">Cumulative GPA</span>
            <span className="text-3xl font-black text-amber-300">{summary.cgpa} / 4.00</span>
          </div>
          <div className="text-right text-xs space-y-1">
            <span className="block text-slate-300">Total Courses: <strong>{summary.totalCourses}</strong></span>
            <span className="block text-slate-300">Total Units Passed: <strong>{summary.totalUnits}</strong></span>
          </div>
        </div>

        {/* Results Table */}
        <div className="printable-area border rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b font-bold text-slate-700">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Units</th>
                <th className="p-3">CA (30)</th>
                <th className="p-3">Exam (70)</th>
                <th className="p-3">Total (100)</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-800">
              {results.map(r => (
                <tr key={r.id}>
                  <td className="p-3 font-mono font-bold text-acohst-800">{r.course_code}</td>
                  <td className="p-3 font-medium">{r.course_title}</td>
                  <td className="p-3">{r.credit_units}</td>
                  <td className="p-3">{r.ca_score}</td>
                  <td className="p-3">{r.exam_score}</td>
                  <td className="p-3 font-bold">{r.total_score}</td>
                  <td className="p-3 font-bold text-emerald-700">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
