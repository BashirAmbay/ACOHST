import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdmissionLetter from '../../components/common/AdmissionLetter';

export default function AdmissionLetterView() {
  const [letterData, setLetterData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLetter();
  }, []);

  const fetchLetter = async () => {
    try {
      const res = await api.get('/applicant/admission-letter');
      if (res.data.success) {
        setLetterData(res.data.letterData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admission letter is unavailable until your application is approved.');
    }
  };

  if (error) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-rose-700">Notice</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
      </div>
    );
  }

  return <AdmissionLetter letterData={letterData} />;
}
