import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, Image as GalleryIcon, Plus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function CMSManager() {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAddNews, setShowAddNews] = useState(false);
  const { showSuccess, showError } = useToast();

  const [newNews, setNewNews] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Admissions',
    featured_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    author_name: 'ACOHST Press'
  });

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      const [nRes, eRes] = await Promise.all([
        api.get('/cms/news'),
        api.get('/cms/events')
      ]);
      if (nRes.data.success) setNews(nRes.data.news);
      if (eRes.data.success) setEvents(eRes.data.events);
    } catch (err) {
      console.warn('Error loading CMS:', err.message);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cms/news', newNews);
      if (res.data.success) {
        showSuccess('News article published to website!');
        setShowAddNews(false);
        fetchCMS();
      }
    } catch (err) {
      showError('Failed to publish article.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Website Content Management System (CMS)</h1>
          <p className="text-xs text-slate-400">Publish news articles, schedule events, and update website gallery & facilities</p>
        </div>
        <button 
          onClick={() => setShowAddNews(!showAddNews)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Article</span>
        </button>
      </div>

      {showAddNews && (
        <form onSubmit={handleCreateNews} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs text-slate-200">
          <h3 className="font-bold text-emerald-400 text-sm">Publish Website News Article</h3>
          <div>
            <label className="block mb-1">Article Title *</label>
            <input 
              type="text" required value={newNews.title} 
              onChange={e => setNewNews({...newNews, title: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
            />
          </div>
          <div>
            <label className="block mb-1">Short Summary *</label>
            <input 
              type="text" required value={newNews.summary} 
              onChange={e => setNewNews({...newNews, summary: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
            />
          </div>
          <div>
            <label className="block mb-1">Full Article Content *</label>
            <textarea 
              rows={4} required value={newNews.content} 
              onChange={e => setNewNews({...newNews, content: e.target.value})} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowAddNews(false)} className="px-4 py-2 text-slate-400">Cancel</button>
            <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl">Publish News</button>
          </div>
        </form>
      )}

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Published News Articles ({news.length})</h3>
        <div className="space-y-3">
          {news.map(item => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-emerald-400 font-bold text-[10px] uppercase block">{item.category}</span>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-slate-400 line-clamp-1">{item.summary}</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">{new Date(item.published_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
