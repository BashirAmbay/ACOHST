import React, { useState, useEffect } from 'react';
import { Building2, Microscope, Stethoscope, BookOpen, Monitor, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/cms/facilities');
      if (res.data.success) setFacilities(res.data.facilities);
    } catch (err) {
      console.warn('Error loading facilities:', err.message);
    }
  };

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
