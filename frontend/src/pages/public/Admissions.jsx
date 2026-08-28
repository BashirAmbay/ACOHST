import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle2, FileText, Upload, CreditCard, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Admissions() {
  return (
    <div className="space-y-16 py-12">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            2026/2027 Academic Session
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Admission Guidelines & How To Apply</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Complete step-by-step guide to applying online for Diploma and Certificate health science courses at ACOHST Kore.
          </p>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Application Steps</h2>
          <p className="text-sm text-slate-600">Follow these 5 simple steps to complete your online application form</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 relative">
            <div className="w-12 h-12 bg-emerald-700 text-white font-black text-lg rounded-2xl mx-auto flex items-center justify-center shadow">1</div>
            <h4 className="font-bold text-slate-900 text-sm">Create Account</h4>
            <p className="text-xs text-slate-500">Register on the ACOHST portal with a valid email and phone number.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 relative">
            <div className="w-12 h-12 bg-emerald-700 text-white font-black text-lg rounded-2xl mx-auto flex items-center justify-center shadow">2</div>
            <h4 className="font-bold text-slate-900 text-sm">Fill Bio-Data</h4>
            <p className="text-xs text-slate-500">Enter personal details, state of origin, address, and O-Level grades.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 relative">
            <div className="w-12 h-12 bg-emerald-700 text-white font-black text-lg rounded-2xl mx-auto flex items-center justify-center shadow">3</div>
            <h4 className="font-bold text-slate-900 text-sm">Select Course</h4>
            <p className="text-xs text-slate-500">Choose your 1st and 2nd choice programmes from accredited schools.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 relative">
            <div className="w-12 h-12 bg-emerald-700 text-white font-black text-lg rounded-2xl mx-auto flex items-center justify-center shadow">4</div>
            <h4 className="font-bold text-slate-900 text-sm">Upload Credentials</h4>
            <p className="text-xs text-slate-500">Upload clear scanned copies of SSCE, birth cert, and passport photograph.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 relative">
            <div className="w-12 h-12 bg-emerald-700 text-white font-black text-lg rounded-2xl mx-auto flex items-center justify-center shadow">5</div>
            <h4 className="font-bold text-slate-900 text-sm">Pay Fee & Submit</h4>
            <p className="text-xs text-slate-500">Pay ₦10,000 application fee online and submit for review.</p>
          </div>

        </div>

        <div className="text-center mt-10">
          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition inline-flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Click Here To Begin Online Application</span>
          </Link>
        </div>
      </section>

      {/* Entry Requirements Summary */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Diploma Programmes Entry Requirements</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies to CHEW, MLT, PT, HIM, and EVT Diploma courses:
              </p>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                <li>Minimum of 5 O-Level credit passes in WAEC, NECO, or NABTEB.</li>
                <li>Compulsory Subjects: English Language, Mathematics, Biology, Chemistry, and Physics.</li>
                <li>Results must be obtained in not more than two (2) sittings.</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-sky-600" />
                <span>Certificate Programmes Entry Requirements</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies to Junior CHEW (JCHEW) and foundational health certificates:
              </p>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                <li>Minimum of 3 O-Level credit passes in WAEC, NECO, or NABTEB.</li>
                <li>Must include Biology / Health Science and English Language.</li>
                <li>Passes in Chemistry or Mathematics will be an added advantage.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
