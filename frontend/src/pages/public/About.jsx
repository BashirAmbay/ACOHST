import React from 'react';
import { Shield, Target, Eye, Award, CheckCircle2, Heart, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="space-y-16 py-12">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-acohst-900 via-acohst-800 to-medical-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            About ACOHST Kore
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Al-Madinatu College of Health Science & Tech.
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Establishing excellence in primary healthcare education, diagnostic lab training, and health information management.
          </p>
        </div>
      </section>

      {/* History & Foundation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our Institutional History & Kore Campus
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Al-Madinatu College of Health Science and Technology (ACOHST), Kore, was established to address the critical manpower shortage in Nigeria's primary healthcare sector. Located along the strategic Kano-Hadejia commercial corridor, the college provides accessible, high-standard health training.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Over the years, ACOHST has grown into a multi-disciplinary health educational complex housing modern clinical demonstration suites, diagnostic medical laboratories, pharmaceutical compounding labs, and digital health analytics suites.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600" 
                alt="ACOHST Kore Campus"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-acohst-700 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To become a world-class health science institution recognized globally for producing innovative, skilled, and ethically grounded healthcare practitioners who transform community health outcomes across Africa.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="w-12 h-12 bg-sky-100 text-medical-700 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To deliver practical, student-centered healthcare education utilizing modern diagnostic technology, rigorous clinical exposure, and continuous community health research.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Core Values</h2>
          <p className="text-sm text-slate-600">The foundational pillars guiding education and conduct at ACOHST Kore</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-slate-900 text-base">Academic Excellence</h4>
            <p className="text-xs text-slate-500">Uncompromising quality in theoretical instruction and practical laboratory assessments.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-slate-900 text-base">Clinical Integrity</h4>
            <p className="text-xs text-slate-500">Upholding strict medical ethics, patient dignity, and confidentiality in health practice.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-slate-900 text-base">Community Service</h4>
            <p className="text-xs text-slate-500">Dedication to preventive healthcare mobilization and rural medical outreach.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">4</div>
            <h4 className="font-bold text-slate-900 text-base">Innovation & Tech</h4>
            <p className="text-xs text-slate-500">Embracing digital health tools, computer-based diagnostics, and modern medical software.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
