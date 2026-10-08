import React, { useState } from 'react';
import { Building2, Microscope, Stethoscope, BookOpen, Monitor, CheckCircle2 } from 'lucide-react';

import Image10 from '../../../image/image 10.jpg';
import Image8 from '../../../image/image 8.jpg';
import Image9 from '../../../image/image 9.jpg';
import Image7 from '../../../image/image 7.jpg';
import Image5 from '../../../image/image 5.jpg';
import Image3 from '../../../image/image 3.jpeg';

export const STATIC_FACILITIES = [
  {
    id: 1,
    name: 'State-of-the-Art Anatomy & Physiology Laboratory',
    category: 'Diagnostic Lab',
    description: 'Fully equipped medical laboratory outfitted with comprehensive human anatomical skeleton models, organ torso specimens, cardiovascular simulators, and microscopic diagnostic workstations for clinical health training.',
    image_url: Image10,
    features: 'Human Skeleton Models, Organ Simulators, Microscopic Workstations, Digital Anatomy Display, Biosafety Standards'
  },
  {
    id: 2,
    name: 'Clinical & Chemical Diagnostics Practical Laboratory',
    category: 'Diagnostic Lab',
    description: 'Hands-on clinical practical training facility where Medical Laboratory Technician and Community Health students conduct hematology, biochemistry, urinalysis, reagents testing, and diagnostic investigations.',
    image_url: Image8,
    features: 'Chemical Reagent Stations, Centrifuges, Glassware & Beakers, Hematology Racks, Biosafety PPE'
  },
  {
    id: 3,
    name: 'ACOHST Main Academic & Administrative Complex',
    category: 'Academic Complex',
    description: 'The central administrative block housing the Provost & CEO office, Governing Council chamber, admissions helpdesk, examination division, and faculty staff offices at Kore campus.',
    image_url: Image9,
    features: 'Provost Executive Suite, Admissions Registry, Council Chambers, Staff Offices, Student Enquiries Desk'
  },
  {
    id: 4,
    name: 'Auditorium & Medical Lecture Hall Suite',
    category: 'Lecture Theatre',
    description: 'Spacious, well-ventilated academic lecture theatre with stepped tiered seating designed for health science theory lectures, medical symposia, and clinical orientation sessions.',
    image_url: Image7,
    features: 'Tiered Stepped Seating, Smart Audio-Visual Projectors, Public Address System, Air Conditioning, Acoustic Design'
  },
  {
    id: 5,
    name: 'Community Health & Clinical Training Center',
    category: 'Clinical Training',
    description: 'Dedicated practical demonstration suite for CHEW, Pharmacy, and Public Health trainees to practice clinical consultations, patient vitals monitoring, first aid, and community healthcare protocols.',
    image_url: Image5,
    features: 'Clinical Simulation Beds, Diagnostic Sphygmomanometers, First Aid Stations, Patient Triage Benches'
  },
  {
    id: 6,
    name: 'Kore Campus Executive Complex & Reception',
    category: 'Campus Facilities',
    description: 'Modern architectural facility providing a supportive learning environment, administrative coordination, and student services along Babura Road Expressway.',
    image_url: Image3,
    features: 'Administrative Block, Security Control, Landscaped Grounds, Dedicated Parking, Uninterrupted Power Supply'
  }
];

export default function Facilities() {
  const [facilities] = useState(STATIC_FACILITIES);

  return (
    <div className="space-y-12 py-12">
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Campus Facilities & Clinical Suites</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Providing state-of-the-art diagnostic laboratories, demonstration clinics, and e-learning resources for health students.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac) => (
            <div key={fac.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col sm:flex-row">
              <div className="w-full sm:w-56 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                <img src={fac.image_url} alt={fac.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1">
                <span className="bg-emerald-50 text-acohst-700 text-[10px] font-bold px-2.5 py-0.5 rounded border border-emerald-200">
                  {fac.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{fac.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                {fac.features && (
                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                    <strong className="text-slate-700">Key Features:</strong> {fac.features}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
