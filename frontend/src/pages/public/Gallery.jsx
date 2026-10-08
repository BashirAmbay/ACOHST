import React, { useState } from 'react';
import { Image as GalleryIcon, X } from 'lucide-react';

import Image1 from '../../../image/image 1.jpg';
import Image2 from '../../../image/image 2.png';
import Image3 from '../../../image/image 3.jpeg';
import Image4 from '../../../image/image 4.jpg';
import Image5 from '../../../image/image 5.jpg';
import Image6 from '../../../image/image 6.jpg';
import Image7 from '../../../image/image 7.jpg';
import Image8 from '../../../image/image 8.jpg';
import Image9 from '../../../image/image 9.jpg';
import Image10 from '../../../image/image 10.jpg';
import Image11 from '../../../image/image 11.jpg';
import Image12 from '../../../image/image 12.jpg';

const GALLERY_PHOTOS = [
  {
    id: 1,
    title: 'Admission Form 2026/2027 Available Now',
    category: 'Admissions & Admin',
    image_url: Image1,
    caption: 'Official Admission Notice for CHEW, MLT, PT, and PHT programmes at Kore Campus'
  },
  {
    id: 2,
    title: 'Director / Provost & CEO Umar Sunusi Haruna',
    category: 'Admissions & Admin',
    image_url: Image2,
    caption: 'College Leadership and Institutional Administration of ACOHST Kore'
  },
  {
    id: 3,
    title: 'ACOHST Kore Main Academic & Admin Complex',
    category: 'Campus',
    image_url: Image3,
    caption: 'Administrative and Academic Complex at Kore Town along Babura Road Expressway'
  },
  {
    id: 4,
    title: 'Matriculation & Academic Procession Ceremony',
    category: 'Campus',
    image_url: Image4,
    caption: 'Health science matriculating students celebrating academic milestone at Kore campus'
  },
  {
    id: 5,
    title: 'Students in Clinical Scrub Uniforms',
    category: 'Clinical & Field Work',
    image_url: Image5,
    caption: 'Health science students prepared for clinical rotations and healthcare practice'
  },
  {
    id: 6,
    title: 'Healthcare Students & Clinical Trainees Cohort',
    category: 'Clinical & Field Work',
    image_url: Image6,
    caption: 'Competent healthcare students and clinical trainees in official laboratory coats'
  },
  {
    id: 7,
    title: 'Health Science Lecture Hall & Theory Session',
    category: 'Campus',
    image_url: Image7,
    caption: 'Students attending interactive healthcare lectures in the modern lecture hall'
  },
  {
    id: 8,
    title: 'Clinical Laboratory Science Practicals',
    category: 'Laboratory',
    image_url: Image8,
    caption: 'Students conducting clinical laboratory tests, chemical assays, and experiments'
  },
  {
    id: 9,
    title: 'ACOHST Kore Campus Front Facade & Entrance',
    category: 'Campus',
    image_url: Image9,
    caption: 'Front facade and administrative block of Al-Madinatu College at Kore'
  },
  {
    id: 10,
    title: 'State-of-the-Art Anatomy & Physiology Laboratory',
    category: 'Laboratory',
    image_url: Image10,
    caption: 'Modern anatomy and physiology laboratory with comprehensive anatomical models'
  },
  {
    id: 11,
    title: 'College Admission & Programmes Overview',
    category: 'Admissions & Admin',
    image_url: Image11,
    caption: 'Overview of accredited programmes, entry requirements, vision, and application details'
  },
  {
    id: 12,
    title: 'Official College Organogram & Governance Structure',
    category: 'Admissions & Admin',
    image_url: Image12,
    caption: 'Governing Council, Director/CEO, Academic Board, and Academic Departments'
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = ['All', 'Campus', 'Laboratory', 'Clinical & Field Work', 'Admissions & Admin'];

  const filteredGallery = activeCategory === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(photo => photo.category === activeCategory);

  return (
    <div className="space-y-12 py-12">
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Campus Life Photo Gallery</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Visual moments of student practicals, clinical outreach, matriculation ceremonies, and campus life at Kore.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat ? 'bg-acohst-700 text-white shadow' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map(photo => (
            <div 
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer card-hover-effect group"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">{photo.category}</span>
                  <h4 className="font-bold text-xs">{photo.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-white bg-slate-800 p-2 rounded-full z-10 hover:bg-slate-700 transition">
              <X className="w-5 h-5" />
            </button>
            <img src={selectedPhoto.image_url} alt={selectedPhoto.title} className="w-full max-h-[70vh] object-contain bg-black" />
            <div className="p-6 text-white space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{selectedPhoto.category}</span>
              <h3 className="text-lg font-bold">{selectedPhoto.title}</h3>
              {selectedPhoto.caption && <p className="text-xs text-slate-400">{selectedPhoto.caption}</p>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
