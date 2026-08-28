import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, GraduationCap, CheckCircle2, ArrowRight, Shield, Filter } from 'lucide-react';
import api from '../../services/api';

export default function Academics() {
  const [schools, setSchools] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSchoolCode = searchParams.get('school') || 'ALL';

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [schoolsRes, progsRes] = await Promise.all([
        api.get('/academics/schools'),
        api.get('/academics/programmes')
      ]);
      if (schoolsRes.data.success) setSchools(schoolsRes.data.schools);
      if (progsRes.data.success) setProgrammes(progsRes.data.programmes);
    } catch (err) {
      console.warn('Error loading academic data:', err.message);
    }
  };

  const filteredProgrammes = selectedSchoolCode === 'ALL' 
    ? programmes 
    : programmes.filter(p => p.school_code === selectedSchoolCode);

  return (
    <div className="space-y-12 py-12">
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            ACOHST Academic Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Schools, Departments & Programmes
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Discover accredited Diploma and Certificate health science programmes engineered for real-world healthcare impact.
          </p>
        </div>
      </section>

      {/* School Filter Chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedSchoolCode === 'ALL' 
                ? 'bg-acohst-700 text-white shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Schools ({programmes.length})
          </button>
          {schools.map(sch => (
            <button
              key={sch.id}
              onClick={() => setSearchParams({ school: sch.code })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedSchoolCode === sch.code 
                  ? 'bg-acohst-700 text-white shadow-md' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sch.name} ({sch.code})
            </button>
          ))}
        </div>
      </section>

      {/* Programme Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProgrammes.map((prog) => (
            <div key={prog.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-emerald-50 text-acohst-800 font-extrabold px-3 py-1 rounded-lg border border-emerald-200">
                    {prog.degree_type} • {prog.duration_years} Years
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{prog.code}</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block mb-1">
                    {prog.school_name}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {prog.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prog.description}
                </p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Admission Requirements:</span>
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                    {prog.requirement_summary}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Tuition</span>
                  <span className="font-black text-acohst-800 text-base">₦{prog.fee_amount.toLocaleString()}</span>
                </div>

                <Link
                  to="/register"
                  className="bg-acohst-700 hover:bg-acohst-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
