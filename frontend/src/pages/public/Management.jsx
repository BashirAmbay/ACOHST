import React, { useState } from 'react';
import { Mail, Phone, X, Award, Shield } from 'lucide-react';
import Image2 from '../../../image/image 2.png';

export default function Management() {
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const officers = [
    {
      id: 1,
      title: 'Director (ACOHST)',
      name: 'Umar Sunusi Haruna',
      role: 'Provost & Chief Executive Officer, ACOHST Kore',
      bio: 'Umar Sunusi Haruna serves as the Director and Provost & Chief Executive Officer of Al-Madinatu College of Health Science and Technology Kore (ACOHST). Under his leadership, ACOHST has grown into a recognized institution committed to providing quality health education, professional training, and producing competent healthcare professionals for community, national, and global service.\n\nHis vision for ACOHST is rooted in excellence, innovation, discipline, and compassionate service — values that guide the institution in training skilled health professionals who positively impact society.',
      image_url: Image2,
      email: '',
      phone: '+234 706 238 7370',
    },
  ];

  return (
    <div className="space-y-12 py-12">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-acohst-900 to-medical-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black">Principal Officers & College Management</h1>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            Meet the experienced leaders guiding academic excellence, governance, and institutional growth at ACOHST Kore.
          </p>
        </div>
      </section>

      {/* Officers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {officers.map((officer) => (
            <div key={officer.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm card-hover-effect flex flex-col justify-between">
              <div>
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={officer.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'} 
                    alt={officer.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-acohst-900/90 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur">
                    {officer.title}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{officer.name}</h3>
                  <p className="text-xs text-acohst-700 font-semibold">{officer.role}</p>
                  <p className="text-xs text-slate-500 line-clamp-3">{officer.bio}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedOfficer(officer)}
                  className="w-full bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-acohst-700 py-2 rounded-xl text-xs font-bold transition border border-slate-200"
                >
                  Read Full Bio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bio Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setSelectedOfficer(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center sm:items-start">
              <div className="w-28 h-32 rounded-2xl overflow-hidden shadow flex-shrink-0 border-2 border-acohst-700">
                <img src={selectedOfficer.image_url} alt={selectedOfficer.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-acohst-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {selectedOfficer.title}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedOfficer.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedOfficer.role}</p>
                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  {selectedOfficer.email && <div className="flex items-center space-x-1.5"><Mail className="w-3.5 h-3.5 text-acohst-700" /><span>{selectedOfficer.email}</span></div>}
                  {selectedOfficer.phone && <div className="flex items-center space-x-1.5"><Phone className="w-3.5 h-3.5 text-acohst-700" /><span>{selectedOfficer.phone}</span></div>}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Profile & Background</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedOfficer.bio}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button 
                onClick={() => setSelectedOfficer(null)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
