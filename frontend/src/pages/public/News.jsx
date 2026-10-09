import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

import Image1 from '../../../image/image 1.jpg';
import Image4 from '../../../image/image 4.jpg';
import Image10 from '../../../image/image 10.jpg';
import Image8 from '../../../image/image 8.jpg';
import Image11 from '../../../image/image 11.jpg';
import Image2 from '../../../image/image 2.png';

export const STATIC_NEWS = [
  {
    id: 1,
    title: 'ACOHST Announces 2026/2027 Admission for Accredited Health Programmes',
    slug: 'acohst-announces-2026-2027-admission-accredited-health-programmes',
    summary: 'Admission Form sales for the 2026/2027 Academic Session commence 11th August 2026 for CHEW, Pharmacy Technician, Medical Laboratory Technician, and Public Health Technician.',
    content: `Al-Madinatu College of Health Science and Technology Kore (ACOHST) announces that Admission Forms for the 2026/2027 Academic Session are officially available.

Approved & Accredited Courses Offered:
1. Community Health Extension Workers (CHEW) - Diploma (Session Fee: ₦120,000 + Dept. fee ₦10,000 = Total: ₦130,000)
2. Pharmacy Technician (PT) - Diploma (Session Fee: ₦140,000 + Dept. fee ₦10,000 = Total: ₦150,000)
3. Medical Laboratory Technician (MLT) - Diploma (Session Fee: ₦120,000 + Dept. fee ₦10,000 = Total: ₦130,000)
4. Public Health Technician (PHT) - Diploma (Session Fee: ₦110,000 + Dept. fee ₦10,000 = Total: ₦120,000)

General Entry Requirements:
5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.

HOW TO APPLY:
Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit:
Al-Madinatu College of Health Science and Technology Kore Campus, Kore Town, Along Babura Road Expressway, Dambatta LGA, Kano State.

Admission Helplines:
+234 706 238 7370 | +234 912 474 1827 | +234 706 432 0805 | +234 803 603 0370
WhatsApp: 09124741827, 07062387370, 07064320805
Email: almadinatucollege@gmail.com`,
    category: 'Admissions',
    featured_image: Image1,
    author_name: 'ACOHST Admission Bureau',
    published_at: '2026-08-11'
  },
  {
    id: 2,
    title: 'ACOHST Matriculation and Oath-Taking Ceremony for Newly Admitted Students',
    slug: 'acohst-matriculation-and-oath-taking-ceremony',
    summary: 'Health science students officially inducted during the colourful Matriculation Ceremony held at Kore Campus in academic gowns.',
    content: `The Management and Academic Board of Al-Madinatu College of Health Science and Technology (ACOHST) Kore celebrated the Matriculation and Oath-Taking Ceremony for new intakes.

Students admitted into Community Health Extension Workers (CHEW), Pharmacy Technician (PT), Medical Laboratory Technician (MLT), and Public Health Technician (PHT) took their solemn professional pledges to uphold healthcare ethics, academic excellence, and discipline.

The Provost and Chief Executive Officer, Umar Sunusi Haruna, congratulated the matriculating students and their families, urging them to utilize the college's modern diagnostic laboratories and practical training facilities to become world-class healthcare professionals.`,
    category: 'Campus Events',
    featured_image: Image4,
    author_name: 'College Registrar',
    published_at: '2026-09-20'
  },
  {
    id: 3,
    title: 'Commissioning of Ultra-Modern Anatomy & Physiology Laboratory at Kore Campus',
    slug: 'commissioning-of-ultra-modern-anatomy-physiology-laboratory',
    summary: 'ACOHST commissions a state-of-the-art anatomy and physiology laboratory outfitted with full skeletal models and medical workstations.',
    content: `In continuous pursuit of academic distinction and hands-on clinical competence, Al-Madinatu College of Health Science and Technology Kore has commissioned its new Anatomy & Physiology Laboratory suite.

The facility is equipped with full-scale human anatomical skeletal models, organ systems, cardiovascular demonstration models, digital display screens, and clinical workstations.

Provost Umar Sunusi Haruna reiterated that the college is committed to practical-first training so that every graduate is competent, confident, and industry-ready from day one.`,
    category: 'Academic Facilities',
    featured_image: Image10,
    author_name: 'ACOHST Media Unit',
    published_at: '2026-08-25'
  },
  {
    id: 4,
    title: 'Medical Laboratory & Pharmacy Practical Training Sessions Underway',
    slug: 'medical-laboratory-pharmacy-practical-training-sessions',
    summary: 'Students engage in intensive practical sessions covering clinical microbiology, chemical assays, and pharmaceutical compounding.',
    content: `Practical laboratory sessions have commenced in full swing at Al-Madinatu College of Health Science and Technology Kore.

Students of Medical Laboratory Technician (MLT) and Pharmacy Technician (PT) are actively engaged in hands-on clinical experiments, urine analysis, chemical reactions, and drug formulation protocols under the supervision of qualified instructors and lab scientists.`,
    category: 'Clinical Training',
    featured_image: Image8,
    author_name: 'School of Medical Laboratory Science',
    published_at: '2026-09-05'
  },
  {
    id: 5,
    title: 'Comprehensive 2026/2027 Academic Prospectus & Programme Guide Released',
    slug: 'comprehensive-2026-2027-academic-prospectus-released',
    summary: 'The college releases the updated admission and academic guidelines outlining the institution\'s vision, mission, motto, and curriculum.',
    content: `The Academic Planning and Registry of ACOHST Kore has officially released the 2026/2027 Academic Session Prospectus and Admission Guide.

The document highlights the College's Motto: 'Knowledge and Innovation for Global Health', Vision, Mission, and accreditation approvals by relevant regulatory bodies. Prospective candidates and guardians are welcome to visit Kore Campus along Babura Road Expressway, Dambatta LGA, Kano State.`,
    category: 'Announcements',
    featured_image: Image11,
    author_name: 'Academic Affairs Division',
    published_at: '2026-08-15'
  },
  {
    id: 6,
    title: 'Message from the Provost: Building Future Healthcare Leaders at ACOHST',
    slug: 'message-from-the-provost-building-future-healthcare-leaders',
    summary: 'Director & Provost Umar Sunusi Haruna addresses prospective and continuing students on quality health education, discipline, and practical competence.',
    content: `Al-Madinatu College of Health Science and Technology Kore (ACOHST) is established to bridge the healthcare human resource gap in our communities and nation.

Through disciplined academic training, experienced lecturers, modern laboratory infrastructure, and clinical field postings, we prepare our students to make meaningful contributions to public healthcare.

We welcome all aspiring healthcare professionals to join us at Kore Campus for the 2026/2027 academic session.`,
    category: 'Leadership',
    featured_image: Image2,
    author_name: 'Provost Umar Sunusi Haruna',
    published_at: '2026-08-01'
  }
];

export default function News() {
  const [news] = useState(STATIC_NEWS);

  return (
    <div className="space-y-12 py-12">
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">College News & Announcements</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Stay informed with the latest academic news, admissions updates, and institutional press releases from ACOHST Kore.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <div key={article.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-52 bg-slate-100 overflow-hidden relative">
                  <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-acohst-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                    {article.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5" /><span>{new Date(article.published_at).toLocaleDateString()}</span></span>
                    <span>•</span>
                    <span className="flex items-center space-x-1"><User className="w-3.5 h-3.5" /><span>{article.author_name}</span></span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg hover:text-acohst-700 leading-snug">
                    <Link to={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{article.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link to={`/news/${article.slug}`} className="text-xs font-bold text-acohst-700 hover:underline flex items-center space-x-1">
                  <span>Read Full Article</span>
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
