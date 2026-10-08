import React from 'react';
import { Shield, Printer, CheckCircle2 } from 'lucide-react';

export default function AdmissionLetter({ letterData }) {
  if (!letterData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="bg-acohst-700 hover:bg-acohst-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Admission Letter (PDF)</span>
        </button>
      </div>

      {/* Official Admission Letter Document */}
      <div className="printable-area bg-white text-slate-900 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200 max-w-3xl mx-auto relative overflow-hidden font-serif">

        {/* Header Branding */}
        <div className="text-center border-b-2 border-acohst-800 pb-6 mb-8">
          <div className="w-16 h-16 bg-acohst-800 text-white rounded-2xl mx-auto flex items-center justify-center mb-3 shadow">
            <Shield className="w-10 h-10 text-emerald-300" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-acohst-900 tracking-tight font-sans">
            AL-MADINATU COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY
          </h1>
          <p className="text-xs font-semibold text-sky-800 tracking-widest uppercase font-sans mt-1">
            Kore Campus, Kano-Babura Expressway, Kano State, Nigeria
          </p>
          <p className="text-xs text-slate-500 font-sans italic mt-0.5">
            Motto: Health, Knowledge, Integrity & Service to Humanity
          </p>
        </div>

        {/* Date & Ref No Header */}
        <div className="flex justify-between text-xs font-sans font-semibold mb-6 border-b border-slate-100 pb-3">
          <div>
            <span className="text-slate-500">REF NO:</span> <span className="text-acohst-900">{letterData.refNumber}</span>
          </div>
          <div>
            <span className="text-slate-500">DATE OF ISSUE:</span> <span className="text-slate-800">{letterData.issueDate}</span>
          </div>
        </div>

        {/* Candidate Salutation */}
        <div className="mb-6 font-sans text-sm">
          <p className="font-bold text-slate-900 text-base">{letterData.candidateName}</p>
          <p className="text-slate-600">{letterData.email} | {letterData.phone}</p>
        </div>

        <div className="text-center bg-emerald-50 border border-emerald-200 py-2.5 px-4 rounded-xl mb-8">
          <h2 className="text-base md:text-lg font-bold text-acohst-900 font-sans tracking-wide">
            OFFER OF PROVISIONAL ADMISSION FOR THE {letterData.session} ACADEMIC SESSION
          </h2>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4 text-sm leading-relaxed text-slate-800 mb-8">
          <p>
            I am pleased to inform you that the Academic Board of <strong>Al-Madinatu College of Health Science and Technology (ACOHST), Kore</strong>, has offered you provisional admission to pursue a course of study leading to the award of <strong>{letterData.degreeType} in {letterData.programme}</strong> in the <strong>{letterData.department}</strong>, {letterData.school}.
          </p>

          <p>
            The duration of this programme is <strong>{letterData.duration}</strong> commencing in the <strong>{letterData.session}</strong> Academic Session.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Conditions of Admission:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>This offer is provisional subject to the verification of your original O-Level credentials and certificates during physical clearance.</li>
              <li>You are required to pay your non-refundable Acceptance Fee within two (2) weeks of receiving this notification to secure your place.</li>
              <li>Strict adherence to the rules and regulations governing health science students of ACOHST Kore is mandatory throughout your study.</li>
            </ul>
          </div>

          <p>
            Accept our congratulations on your well-deserved admission into Al-Madinatu College of Health Science and Technology, Kore. We look forward to guiding you towards a rewarding career in health sciences.
          </p>
        </div>

        {/* Signatures Footer */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end font-sans text-xs">
          <div>
            <div className="font-serif italic font-bold text-slate-800 mb-1 text-sm">Garba M. Kore</div>
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p className="font-bold text-slate-900">Alh. Garba Muhammad Kore</p>
            <p className="text-slate-500">Registrar & Secretary to Council</p>
          </div>

          <div className="text-right">
            <div className="w-16 h-16 border-2 border-dashed border-emerald-600 rounded-full flex items-center justify-center text-[10px] text-emerald-800 font-bold uppercase p-1 text-center mx-auto mb-1">
              ACOHST OFFICIAL SEAL
            </div>
            <p className="text-slate-500">Academic Board Approval</p>
          </div>
        </div>

      </div>
    </div>
  );
}
