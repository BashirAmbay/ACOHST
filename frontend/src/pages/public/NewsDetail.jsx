import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import api from '../../services/api';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/cms/news/${slug}`);
      if (res.data.success) setArticle(res.data.article);
    } catch (err) {
      console.warn('Error loading article:', err.message);
    }
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading article details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/news" className="inline-flex items-center space-x-1.5 text-xs font-bold text-acohst-700 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All News</span>
      </Link>

      <div className="space-y-4">
        <span className="bg-emerald-100 text-acohst-800 text-xs font-bold px-3 py-1 rounded-full inline-block">
          {article.category}
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center space-x-4 text-xs text-slate-500 border-y border-slate-100 py-3">
          <span className="flex items-center space-x-1"><Calendar className="w-4 h-4 text-acohst-700" /><span>{new Date(article.published_at).toLocaleDateString()}</span></span>
          <span>•</span>
          <span className="flex items-center space-x-1"><User className="w-4 h-4 text-acohst-700" /><span>{article.author_name}</span></span>
        </div>
      </div>

      <div className="h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4 font-sans">
        {article.content}
      </div>

      <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
        <span>Published by ACOHST Press & Media Unit</span>
        <button className="flex items-center space-x-1 text-acohst-700 font-bold hover:underline">
          <Share2 className="w-4 h-4" />
          <span>Share Article</span>
        </button>
      </div>
    </div>
  );
}
