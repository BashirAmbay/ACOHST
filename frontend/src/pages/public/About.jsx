import React from 'react';
import { Shield, Target, Eye, Award, BookOpen, Globe, Lightbulb, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Image3 from '../../../image/image 3.jpeg';

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
            Al-Madinatu College of Health Science &amp; Technology Kore
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Accredited and approved by relevant regulatory bodies — a government private institution committed to quality health education.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest mt-2">
            <Shield className="w-3.5 h-3.5 text-emerald-300" />
            Reg. No: 9579835
          </div>
        </div>
      </section>

      {/* Accreditation Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-emerald-900 uppercase tracking-wide">
              Approval and Accreditation — Government Private Institution
            </h2>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Al-Madinatu College of Health Science and Technology Kore (ACOHST) is fully approved and accredited by relevant regulatory bodies as a government-licensed private health institution dedicated to quality assurance and commitment to excellence in health education.
            </p>
          </div>
        </div>
      </section>

      {/* Quality Assurance and Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Quality Assurance &amp; Commitment
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Al-Madinatu College of Health Science and Technology Kore (ACOHST) is committed to providing quality health education through professional training, qualified instructors, practical learning, and a supportive academic environment.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our mission is to produce competent and skilled health professionals who can contribute positively to improving healthcare services in communities. We focus on excellence, discipline, innovation, and practical skills development to prepare students for successful careers in the health sector.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={Image3}
                alt="ACOHST Kore Campus"
                className="w-full h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
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
                To become a leading institution of health science and technology, recognized for excellence in education, innovation, research, and the training of competent healthcare professionals who positively impact communities locally, nationally, and globally.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="w-12 h-12 bg-sky-100 text-medical-700 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To provide high-quality, accessible, and practical health science education through effective teaching, modern training facilities, research, and innovation.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The College is committed to developing skilled, ethical, and compassionate healthcare professionals equipped with the knowledge and practical abilities needed to improve healthcare delivery and promote the health and well-being of society.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-acohst-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Our Motto
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Knowledge &amp; Innovation for Global Health
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This motto represents the vision and commitment of ACOHST towards developing competent, skilled, and responsible health professionals who can contribute to improving healthcare services locally and globally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Knowledge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Knowledge</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              ACOHST is committed to providing quality health education, practical training, and professional skills that empower students with the knowledge required to deliver effective healthcare services.
            </p>
          </div>

          {/* Innovation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl mx-auto flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Innovation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              The institution encourages creativity, research, modern healthcare practices, and the use of new ideas and technologies to address health challenges in our communities.
            </p>
          </div>

          {/* Global Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl mx-auto flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Global Health</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              ACOHST prepares students to serve communities with professionalism, compassion, and dedication while contributing to better health outcomes around the world.
            </p>
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
            <h4 className="font-bold text-slate-900 text-base">Quality Education</h4>
            <p className="text-xs text-slate-500">Provide quality health education and professional training to every student.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-slate-900 text-base">Innovation &amp; Research</h4>
            <p className="text-xs text-slate-500">Promote innovation, research, and lifelong learning across all programmes.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-slate-900 text-base">Integrity &amp; Excellence</h4>
            <p className="text-xs text-slate-500">Develop healthcare professionals with integrity, discipline, and excellence.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-acohst-700 rounded-xl mx-auto flex items-center justify-center font-bold">4</div>
            <h4 className="font-bold text-slate-900 text-base">Community Impact</h4>
            <p className="text-xs text-slate-500">Contribute to improved healthcare services at community, national, and global levels.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-acohst-900 via-acohst-800 to-medical-900 text-white rounded-3xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl mx-auto flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-emerald-300" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Building Competent Healthcare Professionals
          </h3>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
            AL-MADINATU COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY KORE (ACOHST) — Building competent healthcare professionals through knowledge, innovation, and service.
          </p>
          <p className="text-white font-bold text-base uppercase tracking-wide">
            Join ACOHST and Begin Your Journey Towards Becoming a Qualified Health Professional
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/admissions"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-md"
            >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-3 rounded-xl text-sm transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
