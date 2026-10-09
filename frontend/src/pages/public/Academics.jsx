import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Stethoscope,
  Pill,
  Microscope,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  GraduationCap,
  FileText,
  Calendar,
  Sparkles,
  Info,
  Award
} from 'lucide-react';
import api from '../../services/api';

// Curated data for the 4 approved COURSES OFFERED
const STATIC_COURSES = [
  {
    id: 1,
    name: 'Community Health Extension Workers (CHEW)',
    code: 'CHEW',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 120000,
    regulatory_board: 'Community Health Practitioners Registration Board of Nigeria (CHPRBN)',
    school_name: 'School of Community Health Sciences',
    icon: Stethoscope,
    badgeColor: 'from-emerald-600 to-teal-700',
    description:
      'Comprehensive 3-year professional diploma training students for clinical primary healthcare delivery, maternal-child healthcare, disease immunization, and frontline emergency medical care in communities and hospital settings.',
    requirements:
      '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    specific_requirement:
      'CHEW (Diploma): 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    key_areas: [
      'Primary Health Care Clinical Practice',
      'Maternal & Child Health Care (MCH)',
      'Community Health Diagnosis & Survey',
      'Immunization & Cold Chain Logistics',
      'First Aid & Emergency Case Management'
    ],
    career_paths: 'Community Health Officer, PHC Coordinator, Clinic Practitioner, NGO Health Specialist'
  },
  {
    id: 2,
    name: 'Pharmacy Technician (PT)',
    code: 'PT',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 140000,
    regulatory_board: 'Pharmacy Council of Nigeria (PCN)',
    school_name: 'School of Pharmacy Health Sciences',
    icon: Pill,
    badgeColor: 'from-teal-600 to-cyan-700',
    description:
      'Professional 3-year diploma programme focusing on pharmaceutical chemistry, pharmacology, prescription dispensing, drug compounding, inventory storage, and ethical pharmaceutical patient counseling.',
    requirements:
      '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    specific_requirement:
      'PT (Diploma): 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    key_areas: [
      'Pharmacology & Therapeutics',
      'Drug Compounding & Formulation',
      'Hospital & Clinical Pharmacy Practice',
      'Pharmaceutical Calculations',
      'Drug Inventory & Supply Chain Management'
    ],
    career_paths: 'Hospital Pharmacy Technician, Community Pharmacy Supervisor, Medical Sales Representative, Pharmaceutical Inventory Officer'
  },
  {
    id: 3,
    name: 'Medical Laboratory Technician (MLT)',
    code: 'MLT',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 120000,
    regulatory_board: 'Medical Laboratory Science Council of Nigeria (MLSCN)',
    school_name: 'School of Medical Laboratory Science',
    icon: Microscope,
    badgeColor: 'from-blue-600 to-indigo-700',
    description:
      'Rigorous 3-year professional diploma training medical laboratory technicians in clinical diagnostic investigations, pathological microscopy, blood transfusion science, and chemical analysis.',
    requirements:
      '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Chemistry, Biology, and Physics.',
    specific_requirement:
      'MLT (Diploma): 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    key_areas: [
      'Clinical Chemistry & Urinalysis',
      'Medical Microbiology & Parasitology',
      'Hematology & Blood Transfusion Science',
      'Histopathology Basics & Specimen Handling',
      'Laboratory Quality Control & Biosafety'
    ],
    career_paths: 'Clinical Laboratory Technician, Blood Bank Analyst, Diagnostic Center Specialist, Research Laboratory Assistant'
  },
  {
    id: 4,
    name: 'Public Health Technician (PHT)',
    code: 'PHT',
    degree_type: 'Diploma',
    duration_years: 2,
    fee_amount: 110000,
    regulatory_board: 'Recognized National & West African Health Examination Boards (WAHEB)',
    school_name: 'School of Public Health Sciences',
    icon: ShieldCheck,
    badgeColor: 'from-emerald-700 to-green-800',
    description:
      'Essential 2-year professional diploma equipping students with modern competencies in public epidemiology, infectious disease surveillance, environmental sanitation, hygiene promotion, and health policy management.',
    requirements:
      '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    specific_requirement:
      'PHT (Diploma): 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    key_areas: [
      'Epidemiology & Infectious Disease Surveillance',
      'Environmental Sanitation & Hygiene Inspections',
      'Community Health Education & Mobilization',
      'Water Quality, Food Safety & Waste Management',
      'Public Health Emergency & Outbreak Response'
    ],
    career_paths: 'Public Health Officer, Disease Surveillance Officer, Environmental Health Inspector, Health Education Coordinator'
  }
];

export default function Academics() {
  const [courses, setCourses] = useState(STATIC_COURSES);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCode = searchParams.get('course') || 'ALL';

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const res = await api.get('/academics/programmes');
      if (res.data.success && Array.isArray(res.data.programmes) && res.data.programmes.length > 0) {
        // Merge backend data with static rich details
        const merged = STATIC_COURSES.map((staticItem) => {
          const apiItem = res.data.programmes.find(
            (p) => p.code?.toUpperCase() === staticItem.code.toUpperCase()
          );
          if (apiItem) {
            return {
              ...staticItem,
              id: apiItem.id,
              name: apiItem.name || staticItem.name,
              fee_amount: apiItem.fee_amount || staticItem.fee_amount,
              description: apiItem.description || staticItem.description,
              requirements: apiItem.requirement_summary || staticItem.requirements
            };
          }
          return staticItem;
        });
        setCourses(merged);
      }
    } catch (err) {
      // Gracefully maintain static data
      console.warn('Note: using pre-configured course catalog:', err.message);
    }
  };

  const filteredCourses = selectedCode === 'ALL'
    ? courses
    : courses.filter((c) => c.code === selectedCode);

  return (
    <div className="space-y-14 py-10 bg-slate-50/60 min-h-screen">

      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-acohst-950 via-slate-900 to-acohst-900 text-white py-16 px-4 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/90 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-700/60 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Al-Madinatu College of Health Science & Technology, Kore</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            COURSES OFFERED
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-normal">
            Accredited 3-year professional Diploma programmes designed to produce certified, competent, and ethical healthcare practitioners equipped for immediate real-world clinical impact.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs text-emerald-200">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Professional Board Accredited
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Practical & Hospital Training
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2026/2027 Admissions Open
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW TO APPLY - Critical Notice Callout Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-acohst-950 to-slate-950 text-white p-8 sm:p-10 shadow-2xl border-2 border-emerald-500/50">

          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">

            {/* Header Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-600/50 inline-block mb-2">
                  Official Admission Notice • 2026/2027 Session
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  HOW TO APPLY:
                </h2>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-200 bg-emerald-950/70 border border-emerald-600/50 px-4 py-2.5 rounded-2xl w-fit">
                <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-semibold">Admission Session: 2026/2027</span>
              </div>
            </div>

            {/* Direct Official Instruction Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 space-y-3">
              <p className="text-lg sm:text-2xl font-bold text-amber-300 leading-snug">
                Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit:
              </p>
              <div className="flex items-center space-x-3 text-white text-xl sm:text-3xl font-black tracking-tight">
                <MapPin className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-400 flex-shrink-0 animate-bounce" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-amber-200">
                  Al-Madinatu College of Health Science and Technology Kore Campus
                </span>
              </div>
            </div>

            {/* Important Visit Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">

              <div className="bg-slate-900/70 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Location</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kore Town Campus, Along Babura Road Expressway, Dambatta LGA, Kano State, Nigeria.
                </p>
              </div>

              <div className="bg-slate-900/70 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Office Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monday to Saturday: <strong className="text-white">8:00 AM – 4:00 PM</strong>. Admissions desk is open throughout the week.
                </p>
              </div>

              <div className="bg-slate-900/70 p-5 rounded-2xl border border-emerald-600/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Admission Helplines</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calls & Enquiries: <strong className="text-white">+234 706 238 7370</strong>, <strong className="text-white">+234 912 474 1827</strong>
                </p>
              </div>

            </div>

            {/* Required Documents Checklist for Campus Visit */}
            <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2 mb-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>What to Bring When Visiting the Campus:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-200">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Original & photocopies of O-Level results (WAEC/NECO/NABTEB)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Four (4) recent passport-sized photographs</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Certificate of State / Local Government of Origin</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Birth Certificate or National Population Commission declaration</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Course Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-acohst-700 bg-emerald-100 px-3 py-1 rounded-full">
            Available Health Disciplines
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Browse All 4 Accredited Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a course below to view in-depth details, admission criteria, and career prospects.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setSearchParams({})}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${selectedCode === 'ALL'
              ? 'bg-acohst-800 text-white shadow-md ring-2 ring-emerald-500/50'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            All Courses ({courses.length})
          </button>
          {courses.map((c) => (
            <button
              key={c.code}
              onClick={() => setSearchParams({ course: c.code })}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${selectedCode === c.code
                ? 'bg-acohst-800 text-white shadow-md ring-2 ring-emerald-500/50'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <span>{c.code}</span>
              <span className="text-[10px] opacity-75 font-normal">({c.degree_type})</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. The 4 Detailed Course Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCourses.map((course) => {
            const IconComponent = course.icon || Stethoscope;
            return (
              <div
                key={course.id || course.code}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                {/* Top Subtle Color Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${course.badgeColor}`}></div>

                <div className="space-y-5">

                  {/* Card Header Top Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-acohst-800 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-7 h-7 text-acohst-700" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black tracking-wider uppercase text-emerald-700 block">
                          {course.school_name}
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-md">
                            {course.degree_type}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-600 font-bold text-xs">
                            {course.duration_years} Years Full-Time
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-sm font-black text-acohst-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {course.code}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                    {course.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Regulatory Body Badge */}
                  <div className="flex items-center space-x-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-slate-700">
                    <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-medium text-[11px]">
                      <strong>Regulatory Board:</strong> {course.regulatory_board}
                    </span>
                  </div>

                  {/* Core Practical Focus Areas */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Core Curriculum & Clinical Focus:</span>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                      {course.key_areas.map((area, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Admission Entry Requirement Box */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-bold text-acohst-900 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Admission Entry Requirements:</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed pl-5 font-medium">
                      {course.requirements}
                    </p>
                  </div>

                  {/* Career Pathways */}
                  <div className="text-xs text-slate-500 pt-1">
                    <strong className="text-slate-700">Career Outcomes:</strong> {course.career_paths}
                  </div>

                </div>

                {/* Card Bottom CTA & Fee */}
                <div className="pt-5 border-t border-slate-100 flex items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">
                      Session Fee
                    </span>
                    <div className="text-xs text-slate-700 font-semibold leading-tight">
                      <span>₦{Number(course.fee_amount || 120000).toLocaleString()}</span>
                      <span className="text-[11px] text-slate-500 font-normal"> + Dept. fee ₦10,000</span>
                    </div>
                    <div className="text-sm font-black text-acohst-900">
                      Total: ₦{(Number(course.fee_amount || 120000) + 10000).toLocaleString()}
                    </div>
                  </div>

                  <Link
                    to="/admissions"
                    className="bg-acohst-700 hover:bg-acohst-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>How to Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Admission Reminder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-acohst-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-6 h-6 text-acohst-700" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Have Questions About Course Requirements or Registration?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our Admissions Bureau at Kore Campus is ready to assist prospective students, parents, and guardians with direct consultation.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/admissions"
              className="bg-acohst-700 hover:bg-acohst-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow transition inline-flex items-center space-x-2"
            >
              <Info className="w-4 h-4" />
              <span>Full Admission Guidelines</span>
            </Link>
            <Link
              to="/contact"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-xs transition inline-flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Campus Desk</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
