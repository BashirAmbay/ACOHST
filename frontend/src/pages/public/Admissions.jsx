import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Building,
  Sparkles
} from 'lucide-react';

export default function Admissions() {
  const coursesOffered = [
    {
      name: 'Community Health Extension Workers (CHEW)',
      code: 'CHEW',
      award: 'Professional Diploma',
      duration: '3 Years',
      board: 'Community Health Practitioners Registration Board of Nigeria (CHPRBN)'
    },
    {
      name: 'Pharmacy Technician (PT)',
      code: 'PT',
      award: 'Professional Diploma',
      duration: '3 Years',
      board: 'Pharmacy Council of Nigeria (PCN)'
    },
    {
      name: 'Medical Laboratory Technician (MLT)',
      code: 'MLT',
      award: 'Professional Diploma',
      duration: '3 Years',
      board: 'Medical Laboratory Science Council of Nigeria (MLSCN)'
    },
    {
      name: 'Public Health Technician (PHT)',
      code: 'PHT',
      award: 'Professional Diploma',
      duration: '3 Years',
      board: 'National & West African Health Examination Boards (WAHEB)'
    }
  ];

  return (
    <div className="space-y-16 py-10 bg-slate-50/50 min-h-screen">
      
      {/* 1. Header Section */}
      <section className="bg-gradient-to-r from-acohst-950 via-slate-900 to-acohst-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-700/60 shadow-sm inline-block">
            2026/2027 Academic Session Admission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Admission Guidelines & How To Apply
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Official instructions for obtaining Admission Forms for accredited Diploma health science courses at Al-Madinatu College of Health Science and Technology (ACOHST), Kore Campus.
          </p>
        </div>
      </section>

      {/* 2. Official Notice: HOW TO APPLY (Prominent Box) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-acohst-950 to-slate-950 text-white p-8 sm:p-12 shadow-2xl border-2 border-emerald-500/50">
          
          <div className="relative z-10 space-y-7">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-600/50 inline-block mb-2">
                  Official Admission Notice
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  HOW TO APPLY:
                </h2>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-200 bg-emerald-950/70 border border-emerald-600/50 px-4 py-2 rounded-2xl w-fit">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">2026/2027 Academic Session</span>
              </div>
            </div>

            {/* Direct Official Instruction Quote */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 space-y-3">
              <p className="text-lg sm:text-2xl font-bold text-amber-300 leading-snug">
                Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit:
              </p>
              <div className="flex items-center space-x-3 text-white text-xl sm:text-3xl font-black tracking-tight pt-1">
                <MapPin className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-400 flex-shrink-0 animate-bounce" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-amber-200">
                  Al-Madinatu College of Health Science and Technology Kore Campus
                </span>
              </div>
            </div>

            {/* Practical Campus Visit Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Address</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kore Campus, Located along Kano-Babura Expressway, Dambatta/Makoda LGA Axis, Kano State, Nigeria.
                </p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Working Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monday to Saturday: <strong className="text-white">8:00 AM – 4:00 PM</strong> daily. The Admissions Office is open to all applicants.
                </p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Admission Enquiry Helplines</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calls & Enquiries: <strong className="text-white">+234 706 238 7370</strong>, <strong className="text-white">+234 912 474 1827</strong>
                </p>
              </div>
            </div>

            {/* Checklist of documents */}
            <div className="bg-emerald-950/70 p-6 rounded-2xl border border-emerald-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Documents Required for On-Campus Form Collection & Submission:</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Original and photocopies of SSCE statement of result / certificate (WAEC, NECO, or NABTEB).</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Four (4) recent colored passport-sized photographs.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Certificate of State / Local Government Area of Origin.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Birth Certificate or Statutory Declaration of Age.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COURSES OFFERED Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-acohst-700 bg-emerald-100 px-3.5 py-1 rounded-full">
            Available Health Programmes
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            COURSES OFFERED FOR 2026/2027
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Admission forms are currently available for the following accredited courses:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesOffered.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                    {c.award}
                  </span>
                  <span className="font-mono text-slate-400 font-black">{c.code}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {c.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  <strong>Duration:</strong> {c.duration} (Full-Time)
                </p>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-800 block mb-0.5">Regulated By:</strong>
                  {c.board}
                </div>
              </div>

              <Link
                to={`/academics?course=${c.code}`}
                className="text-xs font-bold text-acohst-700 hover:text-acohst-900 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Course Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Entry Requirements Summary */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              General Admission Entry Requirements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Candidates applying for any of the 4 courses must satisfy the standard regulatory board criteria:
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">
                  O-Level Academic Qualifications
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A minimum of <strong>five (5) O-Level credit passes</strong> in WAEC, NECO, or NABTEB obtained in not more than <strong>two (2) sittings</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center border border-emerald-200">
                <span className="block text-xs font-black">English Language</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Credit</span>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center border border-emerald-200">
                <span className="block text-xs font-black">Mathematics</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Credit</span>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center border border-emerald-200">
                <span className="block text-xs font-black">Biology</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Credit (or Health Sci)</span>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center border border-emerald-200">
                <span className="block text-xs font-black">Chemistry</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Credit</span>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center border border-emerald-200">
                <span className="block text-xs font-black">Physics</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Credit</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>* Combination of WAEC & NECO results or WAEC & NABTEB is acceptable within 2 sittings.</span>
              <Link to="/contact" className="text-acohst-700 font-bold hover:underline">
                Questions? Inquire with our Admissions Bureau →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
