import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image2 from '../../../image/image 2.png';
import Image1 from '../../../image/image 1.jpg';
import Image3 from '../../../image/image 3.jpeg';
import Image4 from '../../../image/image 4.jpg';
import Image8 from '../../../image/image 8.jpg';
import Image10 from '../../../image/image 10.jpg';
import Image11 from '../../../image/image 11.jpg';
import {
  Shield, GraduationCap, Users, Award, BookOpen, ChevronRight,
  ArrowRight, CheckCircle2, Stethoscope, Microscope, Pill, FileText,
  Sparkles, Calendar, Newspaper, Image as GalleryIcon, Building2, HelpCircle, PhoneCall
} from 'lucide-react';
import api from '../../services/api';
import { STATIC_FACILITIES } from './Facilities';
import { STATIC_NEWS } from './News';

export const STATIC_PROGRAMMES = [
  {
    id: 1,
    name: 'Community Health Extension Workers (CHEW)',
    code: 'CHEW',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 120000,
    requirement_summary: '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    description: 'Comprehensive 3-year professional diploma training students for clinical primary health care delivery, preventive medicine, maternal-child healthcare, and emergency first aid.'
  },
  {
    id: 2,
    name: 'Pharmacy Technician (PT)',
    code: 'PT',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 140000,
    requirement_summary: '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    description: '3-year professional diploma programme focusing on drug formulation, pharmacology basics, inventory management, dispensing ethics, and prescription dispensing in hospitals and pharmacies.'
  },
  {
    id: 3,
    name: 'Medical Laboratory Technician (MLT)',
    code: 'MLT',
    degree_type: 'Diploma',
    duration_years: 3,
    fee_amount: 120000,
    requirement_summary: '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Chemistry, Biology, and Physics.',
    description: '3-year professional diploma training medical laboratory technicians in diagnostic testing, blood transfusion services, clinical biochemistry, and microscopy.'
  },
  {
    id: 4,
    name: 'Public Health Technician (PHT)',
    code: 'PHT',
    degree_type: 'Diploma',
    duration_years: 2,
    fee_amount: 110000,
    requirement_summary: '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.',
    description: '2-year professional diploma equipping students with essential skills in epidemiology, disease surveillance, community sanitation, environmental hygiene, and public health education.'
  }
];

export const STATIC_EVENTS = [
  {
    id: 1,
    title: '2026/2027 Matriculation & Oath-Taking Ceremony',
    slug: '2026-2027-matriculation-ceremony',
    location: 'ACOHST Main Auditorium, Kore',
    event_date: '2026-10-15',
    event_time: '10:00 AM',
    description: 'Official matriculation ceremony and professional oath-taking for newly admitted students across all health science schools.',
    category: 'Ceremony'
  },
  {
    id: 2,
    title: 'Annual Community Health Outreach & Free Medical Screening',
    slug: 'annual-community-health-outreach-2026',
    location: 'Kore Primary Healthcare Center & Surrounding Villages',
    event_date: '2026-11-20',
    event_time: '08:30 AM',
    description: 'A joint community health drive organized by the School of Community Health Sciences offering free blood pressure checks, diabetes screening, health education, and maternal care advice.',
    category: 'Community Outreach'
  }
];

export const STATIC_FAQS = [
  {
    id: 1,
    question: 'What courses are offered at ACOHST?',
    answer: 'ACOHST offers 4 accredited programmes: 1) Community Health Extension Workers (CHEW), 2) Pharmacy Technician (PT), 3) Medical Laboratory Technician (MLT), and 4) Public Health Technician (PHT).'
  },
  {
    id: 2,
    question: 'How do I apply for the 2026/2027 Admission?',
    answer: 'Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit Al-Madinatu College of Health Science and Technology Kore Campus. Admission forms are obtained directly from the Admissions Office on campus.'
  },
  {
    id: 3,
    question: 'What are the general admission entry requirements?',
    answer: 'General Entry Requirements: 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.'
  },
  {
    id: 4,
    question: 'Are ACOHST health programmes fully accredited?',
    answer: 'Yes, all programmes offered at Al-Madinatu College of Health Science and Technology, Kore, are recognized and regulated by respective national professional boards and councils.'
  },
  {
    id: 5,
    question: 'Is hostel accommodation available on campus?',
    answer: 'Yes, ACOHST provides comfortable, secure, and well-equipped male and female student hostels with 24/7 security and electricity within the college premises.'
  }
];

export default function Home() {
  const [news, setNews] = useState(STATIC_NEWS.slice(0, 3));
  const [events, setEvents] = useState(STATIC_EVENTS);
  const [facilities, setFacilities] = useState(STATIC_FACILITIES.slice(0, 3));
  const [programmes, setProgrammes] = useState(STATIC_PROGRAMMES);
  const [faqs, setFaqs] = useState(STATIC_FAQS);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      const [newsRes, eventsRes, facRes, progRes, faqRes] = await Promise.allSettled([
        api.get('/cms/news?limit=3'),
        api.get('/cms/events?limit=2'),
        api.get('/cms/facilities'),
        api.get('/academics/programmes'),
        api.get('/cms/faqs')
      ]);

      if (newsRes.status === 'fulfilled' && newsRes.value?.data?.success && Array.isArray(newsRes.value.data.news) && newsRes.value.data.news.length > 0) {
        // Replace any external image URLs (e.g. Unsplash) with proper local ACOHST images
        const LOCAL_NEWS_IMAGES = [Image1, Image4, Image10, Image8];
        const sanitizedNews = newsRes.value.data.news.map((item, idx) => {
          if (
            item.title?.toLowerCase().includes('diagnostic equipment') ||
            item.slug?.includes('diagnostic-equipment')
          ) {
            return { ...item, featured_image: Image11 };
          }
          const isExternal = item.featured_image && (item.featured_image.startsWith('http://') || item.featured_image.startsWith('https://'));
          return isExternal
            ? { ...item, featured_image: LOCAL_NEWS_IMAGES[idx % LOCAL_NEWS_IMAGES.length] }
            : item;
        });
        setNews(sanitizedNews);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data?.success && Array.isArray(eventsRes.value.data.events) && eventsRes.value.data.events.length > 0) {
        setEvents(eventsRes.value.data.events);
      }
      if (facRes.status === 'fulfilled' && facRes.value?.data?.success && Array.isArray(facRes.value.data.facilities) && facRes.value.data.facilities.length > 0) {
        // Replace any external image URLs with proper local ACOHST facility images
        const LOCAL_FAC_IMAGES = [Image10, Image8, Image9];
        const sanitizedFacilities = facRes.value.data.facilities.map((fac, idx) => {
          const isExternal = fac.image_url && (fac.image_url.startsWith('http://') || fac.image_url.startsWith('https://'));
          return isExternal
            ? { ...fac, image_url: LOCAL_FAC_IMAGES[idx % LOCAL_FAC_IMAGES.length] }
            : fac;
        });
        setFacilities(sanitizedFacilities);
      }
      if (progRes.status === 'fulfilled' && progRes.value?.data?.success && Array.isArray(progRes.value.data.programmes) && progRes.value.data.programmes.length > 0) {
        setProgrammes(progRes.value.data.programmes);
      }
      if (faqRes.status === 'fulfilled' && faqRes.value?.data?.success && Array.isArray(faqRes.value.data.faqs) && faqRes.value.data.faqs.length > 0) {
        setFaqs(faqRes.value.data.faqs);
      }
    } catch (err) {
      console.warn('Note: displaying pre-configured homepage content:', err.message);
    }
  };

  return (
    <div className="space-y-20 pb-16">

      {/* 1. Hero Section */}
      <section
        className="relative text-white overflow-hidden py-20 lg:py-28"
        style={{
          backgroundImage: `url(${Image3})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/65"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-900/60 backdrop-blur border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Admissions Open for 2026/2027 Academic Session</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Al-Madinatu College of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300">
                  Health Science & Tech.
                </span>
                <span className="text-xl sm:text-2xl font-normal block mt-2 text-emerald-200">Kore Campus, Kano State</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed font-normal">
                Raising highly skilled, practical, and ethical health professionals. Accredited institution for Community Health Extension Workers (CHEW), Pharmacy Technician (PT), Medical Laboratory Technician (MLT), and Public Health Technician (PHT) studies.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Start Online Application</span>
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-2xl border border-white/20 backdrop-blur transition flex items-center justify-center space-x-2 text-base"
                >
                  <Shield className="w-5 h-5 text-emerald-300" />
                  <span>Student & Staff Portal</span>
                </Link>
              </div>

              {/* Accreditations Trust Badges */}
              <div className="pt-6 border-t border-emerald-600/40 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Professional Board Recognition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Modern Diagnostic Clinical Labs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Serene Campus & Hostels</span>
                </div>
              </div>

            </div>

            {/* Right Hero Card Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="glass-dark p-6 rounded-3xl border border-emerald-500/30 shadow-2xl max-w-md w-full relative">

                <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-inner">
                  <img
                    src={Image1}
                    alt="ACOHST Practical Training"
                    className="w-full h-full object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="bg-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white inline-block mb-1">
                      Clinical Excellence
                    </span>
                    <h3 className="font-bold text-sm">Hands-on Hospital & Practical Training</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                    <span>2026/2027 Session Status:</span>
                    <span className="font-bold text-emerald-400">ACTIVELY RECEIVING APPLICATIONS</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                    <span>Application Fee:</span>
                    <span className="font-bold text-amber-300">₦10,000</span>
                  </div>
                  <div className="pt-2 text-center">
                    <Link to="/admissions" className="text-xs text-emerald-300 hover:text-white font-semibold flex items-center justify-center space-x-1">
                      <span>View Requirements & Programme Fees</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Statistics Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100">
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-acohst-700 block">4</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Courses Offered</span>
          </div>
          <div className="text-center space-y-1 md:pl-4">
            <span className="text-3xl sm:text-4xl font-black text-medical-700 block">3 Yrs</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Diploma Duration</span>
          </div>
          <div className="text-center space-y-1 md:pl-4">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 block">100%</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Practical Competency</span>
          </div>
          <div className="text-center space-y-1 md:pl-4">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 block">1,500+</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Graduated Practitioners</span>
          </div>
        </div>
      </section>

      {/* 3. Provost Welcome Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-acohst-950 text-white rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-xl">
                <img
                  src={Image2}
                  alt="Director (ACOHST) Umar Sunusi Haruna"
                  className="w-full h-full object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800 inline-block">
                Welcome Address from the Provost
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome to Al-Madinatu College of Health Science and Technology, Kore
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic">
                Healthcare delivery requires not only theoretical mastery but hands-on clinical discipline, empathy, and professional integrity. Here at ACOHST Kore, our modern laboratories, dedicated faculty, and clinical training partners ensure every student emerges as a world-class health professional.
              </p>
              <div className="pt-2">
                <h4 className="font-bold text-base text-white">Director (ACOHST) Umar Sunusi Haruna</h4>
                <p className="text-xs text-emerald-400">Provost & Chief Executive Officer, ACOHST Kore</p>
              </div>
              <div>
                <Link to="/management" className="text-xs font-semibold text-emerald-300 hover:text-white underline inline-flex items-center space-x-1">
                  <span>Read Full Management Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Featured Academic Programmes & How To Apply */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-acohst-700 bg-emerald-100 px-3 py-1 rounded-full">
            2026/2027 Admission
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            COURSES OFFERED
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Al-Madinatu College of Health Science and Technology (ACOHST), Kore offers 4 accredited 3-year professional Diploma programmes.
          </p>
        </div>

        {/* HOW TO APPLY Highlight Notice on Home */}
        <div className="mb-10 bg-gradient-to-r from-emerald-900 via-acohst-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600/50 inline-block">
                HOW TO APPLY:
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-100">
                Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit:
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-amber-300">
                Al-Madinatu College of Health Science and Technology Kore Campus
              </h3>
            </div>
            <Link
              to="/admissions"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow transition text-xs flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Admission Guidelines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programmes.slice(0, 4).map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-effect flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-50 text-acohst-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {prog.degree_type} • {prog.duration_years} Yrs
                  </span>
                  <span className="text-slate-400 font-mono text-xs font-bold">{prog.code}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prog.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block text-[11px]">Entry Requirement:</span>
                  <p className="text-slate-500 text-[10px] leading-normal">{prog.requirement_summary}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-end justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Fee</span>
                  <div className="text-xs text-slate-700 font-semibold leading-tight">
                    <span>₦{Number(prog.fee_amount || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-normal"> + Dept. fee ₦10,000</span>
                  </div>
                  <div className="text-xs font-black text-acohst-800">
                    Total: ₦{(Number(prog.fee_amount || 0) + 10000).toLocaleString()}
                  </div>
                </div>

                <Link
                  to={`/academics?course=${prog.code}`}
                  className="bg-acohst-700 hover:bg-acohst-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow transition flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/academics" className="inline-flex items-center space-x-2 text-acohst-700 font-bold text-sm hover:underline">
            <span>View All Course Curriculums & Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Modern Facilities Showcase */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-acohst-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              World-Class Infrastructure
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Campus Facilities & Diagnostic Laboratories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.slice(0, 3).map((fac) => (
              <div key={fac.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={fac.image_url}
                    alt={fac.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Image1;
                    }}
                  />
                  <span className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur">
                    {fac.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">{fac.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/facilities" className="bg-white border border-slate-300 text-slate-800 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-sm inline-block">
              Explore All Campus Facilities
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Latest News & Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* News Left Col */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">College Bulletin & News</h3>
                <p className="text-xs text-slate-500">Official updates from the ACOHST Media Unit</p>
              </div>
              <Link to="/news" className="text-xs text-acohst-700 font-bold hover:underline">View All News</Link>
            </div>

            <div className="space-y-6">
              {news.map((item) => {
                const isDiagnosticEquip =
                  item.title?.toLowerCase().includes('diagnostic equipment') ||
                  item.slug?.includes('diagnostic-equipment');
                const displayImage = isDiagnosticEquip ? Image11 : (item.featured_image || Image1);

                return (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                    <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = isDiagnosticEquip ? Image11 : Image1;
                        }}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span className="bg-emerald-50 text-acohst-700 font-bold px-2 py-0.5 rounded">{item.category}</span>
                        <span>•</span>
                        <span>{item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recent'}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug hover:text-acohst-700">
                        <Link to={`/news/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events Right Col */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Upcoming Events</h3>
                <p className="text-xs text-slate-500">Academic & Community Outreach Calendar</p>
              </div>
            </div>

            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex space-x-4 items-start">
                  <div className="w-14 h-16 bg-acohst-700 text-white rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0 shadow">
                    <span className="text-xs uppercase font-bold opacity-80">{ev.event_date ? new Date(ev.event_date).toLocaleString('default', { month: 'short' }) : 'OCT'}</span>
                    <span className="text-xl font-black">{ev.event_date ? new Date(ev.event_date).getDate() : '15'}</span>
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-medical-700">{ev.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{ev.title}</h4>
                    <p className="text-xs text-slate-500">{ev.location} | {ev.event_time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-600">Quick answers about online admissions, entry requirements, and campus life</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 font-bold text-slate-900 text-sm flex justify-between items-center hover:bg-slate-50"
              >
                <span>{faq.question}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transform transition-transform ${activeFaq === idx ? 'rotate-90 text-acohst-700' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Admission CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-acohst-800 to-medical-900 text-white rounded-3xl p-10 lg:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Begin Your Healthcare Career?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto">
            Take the first step towards acquiring professional health qualifications at Al-Madinatu College of Health Science and Technology, Kore.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg transition">
              Apply For Admission Now
            </Link>
            <Link to="/contact" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition">
              Speak With Admission Counselor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
