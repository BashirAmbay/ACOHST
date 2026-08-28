import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/cms/news');
      if (res.data.success) setNews(res.data.news);
    } catch (err) {
      console.warn('Error fetching news:', err.message);
    }
  };

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
