import React from 'react';
import { Shield, QrCode, Printer } from 'lucide-react';

export default function IDCard({ student }) {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center no-print">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-acohst-700" />
          <span>Digital Student Identity Card</span>
        </h3>
        <button 
          onClick={handlePrint}
          className="bg-acohst-700 hover:bg-acohst-800 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print ID Card</span>
        </button>
      </div>

      {/* ID Card Front Container */}
      <div className="printable-area max-w-sm mx-auto bg-gradient-to-br from-acohst-900 via-acohst-800 to-medical-900 text-white rounded-2xl p-6 shadow-2xl border border-acohst-600 relative overflow-hidden">
        
        {/* Decorative Badge Background Elements */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-medical-500/10 rounded-full blur-xl"></div>

        {/* Card Header */}
        <div className="flex items-center space-x-3 border-b border-acohst-700/80 pb-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight leading-none text-white">
              AL-MADINATU COLLEGE
            </h4>
            <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase mt-0.5">
              OF HEALTH SCIENCE & TECH., KORE
            </p>
          </div>
        </div>

        {/* Student Photo & Details */}
        <div className="flex space-x-4 items-start mb-4">
          <div className="w-24 h-28 rounded-xl bg-slate-800 border-2 border-emerald-400 overflow-hidden flex-shrink-0 shadow-lg">
            {student.passport_photo ? (
              <img src={student.passport_photo} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900 text-[10px] p-2 text-center">
                <span>PASSPORT PHOTO</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1.5 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block">FULL NAME</span>
              <span className="font-bold text-white text-sm leading-tight block">
                {student.first_name} {student.last_name}
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block">MATRIC NUMBER</span>
              <span className="font-mono font-bold text-amber-300 text-xs tracking-wider bg-acohst-950/80 px-2 py-0.5 rounded border border-acohst-700 inline-block">
                {student.matric_number || 'ACOHST/2026/CHEW/014'}
              </span>
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block">PROGRAMME</span>
              <span className="text-slate-200 text-xs truncate block font-medium">
                {student.programme_name || 'Diploma in CHEW'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info & QR Code */}
        <div className="pt-3 border-t border-acohst-700/80 flex justify-between items-center text-[10px]">
          <div>
            <span className="text-slate-400 block">LEVEL: <strong className="text-white">{student.level || 100} L</strong></span>
            <span className="text-slate-400 block">STATUS: <strong className="text-emerald-400 uppercase">OFFICIAL STUDENT</strong></span>
          </div>

          <div className="bg-white p-1 rounded-md">
            <QrCode className="w-8 h-8 text-slate-900" />
          </div>
        </div>

        {/* Institutional Stamp Note */}
        <div className="mt-3 text-[9px] text-center text-emerald-200/70 border-t border-emerald-800/40 pt-1.5">
          PROPERTY OF ACOHST KORE | IF FOUND RETURN TO REGISTRAR OFFICE
        </div>

      </div>
    </div>
  );
}
