import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    college_name: 'Al-Madinatu College of Health Science and Technology, Kore',
    college_email: 'info@acohst.edu.ng',
    college_phone: '+234 803 123 4567',
    college_address: 'Kore Campus, Kano-Hadejia Expressway, Kano State, Nigeria',
    admission_session: '2026/2027',
    application_fee: '10000',
    payment_gateway_mode: 'Test Mode'
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.success) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.warn('Error loading settings:', err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put('/admin/settings', settings);
      if (res.data.success) {
        showSuccess('System settings updated successfully!');
      }
    } catch (err) {
      showError('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">System Settings & Configurations</h1>
          <p className="text-xs text-slate-400">Institutional info, admission session details, application fees, and payment gateway mode</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-xs text-slate-200">
        
        <div className="space-y-4">
          <h3 className="font-bold text-emerald-400 text-sm border-b border-slate-900 pb-2">Institutional Identification</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Full College Name</label>
              <input 
                type="text" value={settings.college_name} 
                onChange={e => setSettings({...settings, college_name: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Primary Contact Email</label>
              <input 
                type="email" value={settings.college_email} 
                onChange={e => setSettings({...settings, college_email: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Contact Telephone</label>
              <input 
                type="text" value={settings.college_phone} 
                onChange={e => setSettings({...settings, college_phone: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Physical Campus Address</label>
              <input 
                type="text" value={settings.college_address} 
                onChange={e => setSettings({...settings, college_address: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-900">
          <h3 className="font-bold text-emerald-400 text-sm border-b border-slate-900 pb-2">Admission & Payment Gateway Configuration</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Active Admission Session</label>
              <input 
                type="text" value={settings.admission_session} 
                onChange={e => setSettings({...settings, admission_session: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold" 
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Application Fee (NGN ₦)</label>
              <input 
                type="number" value={settings.application_fee} 
                onChange={e => setSettings({...settings, application_fee: e.target.value})} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold" 
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Paystack Gateway Status</label>
              <select 
                value={settings.payment_gateway_mode}
                onChange={e => setSettings({...settings, payment_gateway_mode: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="Test Mode">Test Mode (Simulated Payments)</option>
                <option value="Live Mode">Live Mode (Production Paystack Keys)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow transition"
          >
            {loading ? 'Saving...' : 'Save Configuration Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
