import React, { useState, useEffect } from 'react';
import { Image as GalleryIcon, X } from 'lucide-react';
import api from '../../services/api';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, [activeCategory]);

  const fetchGallery = async () => {
    try {
      const res = await api.get(`/cms/gallery?category=${activeCategory}`);
      if (res.data.success) setGallery(res.data.gallery);
    } catch (err) {
      console.warn('Error fetching gallery:', err.message);
    }
  };

  const categories = ['All', 'Laboratory', 'Campus', 'Field Work', 'Library'];

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
      <section className="max-w-7xl mx-auto px-4 flex justify-center space-x-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat ? 'bg-acohst-700 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map(photo => (
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
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 text-white bg-slate-800 p-2 rounded-full z-10">
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
