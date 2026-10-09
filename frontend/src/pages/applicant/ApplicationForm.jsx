import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, BookOpen, GraduationCap, Upload, FileCheck, CreditCard, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Shield 
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1');
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [programmes, setProgrammes] = useState([]);
  const [schools, setSchools] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    gender: 'Female',
    date_of_birth: '2004-05-14',
    marital_status: 'Single',
    nationality: 'Nigerian',
    state_of_origin: 'Kano',
    lga: 'Kore',
    address: 'No 14 Hospital Road, Kore',
    first_choice_programme_id: 1,
    second_choice_programme_id: 3,
    ssce_data: {
      examType: 'WAEC',
      examYear: '2025',
      indexNumber: '4250918234',
      subjects: [
        { subject: 'English Language', grade: 'B3' },
        { subject: 'Mathematics', grade: 'A1' },
        { subject: 'Biology', grade: 'B2' },
        { subject: 'Chemistry', grade: 'B3' },
        { subject: 'Physics', grade: 'C4' }
      ]
    }
  });

  const [documents, setDocuments] = useState([]);
  const [applicantStatus, setApplicantStatus] = useState('Draft');
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [profileRes, progsRes, schoolsRes] = await Promise.all([
        api.get('/applicant/profile'),
        api.get('/academics/programmes'),
        api.get('/academics/schools')
      ]);

      if (progsRes.data.success) setProgrammes(progsRes.data.programmes);
      if (schoolsRes.data.success) setSchools(schoolsRes.data.schools);

      if (profileRes.data.success) {
        const app = profileRes.data.applicant;
        setApplicantStatus(app.status);
        setPaymentStatus(app.payment_status);
        setDocuments(profileRes.data.documents || []);

        setFormData(prev => ({
          ...prev,
          first_name: app.first_name || prev.first_name,
          middle_name: app.middle_name || prev.middle_name,
          last_name: app.last_name || prev.last_name,
          phone: app.phone || prev.phone,
          gender: app.gender || prev.gender,
          date_of_birth: app.date_of_birth || prev.date_of_birth,
          marital_status: app.marital_status || prev.marital_status,
          state_of_origin: app.state_of_origin || prev.state_of_origin,
          lga: app.lga || prev.lga,
          address: app.address || prev.address,
          first_choice_programme_id: app.first_choice_programme_id || 1,
          second_choice_programme_id: app.second_choice_programme_id || 3,
          ssce_data: app.ssce_data || prev.ssce_data
        }));
      }
    } catch (err) {
      console.warn('Error loading form data:', err.message);
    }
  };

  const handleSaveProgress = async (nextStep) => {
    try {
      setLoading(true);
      const res = await api.put('/applicant/save', formData);
      if (res.data.success) {
        showSuccess('Progress saved successfully.');
        if (nextStep) setStep(nextStep);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save progress.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('document_type', docType);

    try {
      setLoading(true);
      const res = await api.post('/applicant/upload-doc', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showSuccess(`${docType} uploaded successfully!`);
        setDocuments(res.data.documents);
      }
    } catch (err) {
      showError('File upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async () => {
    try {
      setLoading(true);
      const initRes = await api.post('/finance/initialize', {
        payment_type: 'Application Fee',
        amount: 10000
      });
      
      if (initRes.data.success) {
        // Auto-verify mock reference for smooth flow
        const verifyRes = await api.get(`/finance/verify/${initRes.data.reference}`);
        if (verifyRes.data.success) {
          showSuccess('₦10,000 Application Fee Paid Successfully (Paystack Mock)!');
          setPaymentStatus('Paid');
        }
      }
    } catch (err) {
      showError('Payment process failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async () => {
    try {
      setLoading(true);
      const res = await api.post('/applicant/submit');
      if (res.data.success) {
        showSuccess('Application submitted successfully!');
        navigate('/applicant');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectGradeChange = (index, field, value) => {
    const updatedSubjects = [...formData.ssce_data.subjects];
    updatedSubjects[index][field] = value;
    setFormData({
      ...formData,
      ssce_data: { ...formData.ssce_data, subjects: updatedSubjects }
    });
  };

  const stepTitles = [
    'Personal Bio-Data',
    'SSCE O-Level Qualifications',
    'Programme Selection',
    'Upload Documents',
    'Review Dossier',
    'Payment & Final Submission'
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      
      {/* Header & Step Wizard Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">
            Admission Application Form
          </h2>
          <span className="text-xs font-bold bg-emerald-100 text-acohst-800 px-3 py-1 rounded-full">
            Step {step} of 6: {stepTitles[step - 1]}
          </span>
        </div>

        {/* Wizard step pills */}
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition ${
                i <= step ? 'bg-acohst-700' : 'bg-slate-200'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal Bio Data */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">1. Personal & Contact Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input 
                type="text"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Middle Name</label>
              <input 
                type="text"
                value={formData.middle_name}
                onChange={e => setFormData({...formData, middle_name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <input 
                type="text"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input 
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marital Status</label>
              <select 
                value={formData.marital_status}
                onChange={e => setFormData({...formData, marital_status: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State of Origin *</label>
              <input 
                type="text"
                value={formData.state_of_origin}
                onChange={e => setFormData({...formData, state_of_origin: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LGA *</label>
              <input 
                type="text"
                value={formData.lga}
                onChange={e => setFormData({...formData, lga: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone *</label>
              <input 
                type="text"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Home Address *</label>
            <input 
              type="text"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-acohst-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleSaveProgress(2)}
              className="bg-acohst-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow"
            >
              Save & Continue to Qualifications →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SSCE Qualifications */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">2. SSCE O-Level Academic Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Body</label>
              <select 
                value={formData.ssce_data.examType}
                onChange={e => setFormData({
                  ...formData,
                  ssce_data: { ...formData.ssce_data, examType: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="WAEC">WAEC</option>
                <option value="NECO">NECO</option>
                <option value="NABTEB">NABTEB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Year</label>
              <input 
                type="text"
                value={formData.ssce_data.examYear}
                onChange={e => setFormData({
                  ...formData,
                  ssce_data: { ...formData.ssce_data, examYear: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Index / Exam Number</label>
              <input 
                type="text"
                value={formData.ssce_data.indexNumber}
                onChange={e => setFormData({
                  ...formData,
                  ssce_data: { ...formData.ssce_data, indexNumber: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-800">5 Required O-Level Subjects & Grades</h4>
            {formData.ssce_data.subjects.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input 
                  type="text"
                  value={item.subject}
                  onChange={e => handleSubjectGradeChange(idx, 'subject', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <select
                  value={item.grade}
                  onChange={e => handleSubjectGradeChange(idx, 'grade', e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold text-acohst-800"
                >
                  <option value="A1">A1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="C4">C4</option>
                  <option value="C5">C5</option>
                  <option value="C6">C6</option>
                  <option value="D7">D7</option>
                  <option value="E8">E8</option>
                  <option value="F9">F9</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 font-semibold">← Back</button>
            <button onClick={() => handleSaveProgress(3)} className="bg-acohst-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow">
              Save & Choice of Programme →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Programme Selection */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">3. Choice of Academic Programme</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Choice Programme *</label>
              <select 
                value={formData.first_choice_programme_id}
                onChange={e => setFormData({...formData, first_choice_programme_id: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs bg-white font-bold text-acohst-900"
              >
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.degree_type} - Session Fee: ₦{p.fee_amount.toLocaleString()} + Dept. fee ₦10,000 = Total: ₦{(p.fee_amount + 10000).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Second Choice Programme</label>
              <select 
                value={formData.second_choice_programme_id}
                onChange={e => setFormData({...formData, second_choice_programme_id: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
              >
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.degree_type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="text-xs text-slate-500 font-semibold">← Back</button>
            <button onClick={() => handleSaveProgress(4)} className="bg-acohst-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow">
              Save & Upload Credentials →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Document Uploads */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">4. Upload Credentials & Documents</h3>
          
          <div className="space-y-4">
            
            {/* Upload Passport */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Passport Photograph (JPEG/PNG)</h4>
                <p className="text-[11px] text-slate-500">Recent white background passport image</p>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleFileUpload(e, 'Passport')}
                className="text-xs text-slate-500"
              />
            </div>

            {/* Upload SSCE */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">O-Level Result / Certificate (PDF/Image)</h4>
                <p className="text-[11px] text-slate-500">WAEC / NECO statement of result</p>
              </div>
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={e => handleFileUpload(e, 'SSCE')}
                className="text-xs text-slate-500"
              />
            </div>

            {/* Upload Birth Cert */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Birth Certificate / Indigene Certificate</h4>
                <p className="text-[11px] text-slate-500">Official local government identification</p>
              </div>
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={e => handleFileUpload(e, 'Birth Certificate')}
                className="text-xs text-slate-500"
              />
            </div>

          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="text-xs text-slate-500 font-semibold">← Back</button>
            <button onClick={() => setStep(5)} className="bg-acohst-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow">
              Proceed to Review Dossier →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Dossier Review */}
      {step === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">5. Review Application Summary</h3>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-400 block">Candidate Name:</span><strong className="text-slate-900 text-sm">{formData.first_name} {formData.middle_name} {formData.last_name}</strong></div>
              <div><span className="text-slate-400 block">Telephone & Email:</span><strong className="text-slate-900">{formData.phone} | {formData.gender}</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-400 block">State / LGA:</span><strong className="text-slate-900">{formData.state_of_origin} / {formData.lga}</strong></div>
              <div><span className="text-slate-400 block">SSCE Exam:</span><strong className="text-slate-900">{formData.ssce_data.examType} ({formData.ssce_data.examYear})</strong></div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-slate-400 block mb-1">1st Choice Programme:</span>
              <strong className="text-acohst-800 text-sm block">
                {programmes.find(p => p.id === formData.first_choice_programme_id)?.name || 'CHEW Diploma'}
              </strong>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(4)} className="text-xs text-slate-500 font-semibold">← Back</button>
            <button onClick={() => setStep(6)} className="bg-acohst-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow">
              Proceed to Payment & Submit →
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Payment & Final Submit */}
      {step === 6 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-2">6. Payment & Final Submission</h3>
          
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Application Processing Fee</h4>
                <p className="text-xs text-slate-600">Official non-refundable processing fee for 2026/2027</p>
              </div>
              <span className="font-black text-xl text-acohst-900">₦10,000</span>
            </div>

            {paymentStatus === 'Paid' ? (
              <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Application Fee Paid & Verified (Paystack Mock)!</span>
              </div>
            ) : (
              <button
                onClick={handleMockPayment}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing Payment...' : 'Pay ₦10,000 Now via Paystack (Mock Mode)'}</span>
              </button>
            )}
          </div>

          {applicantStatus !== 'Submitted' && (
            <button
              onClick={handleSubmitFinal}
              disabled={loading}
              className="w-full bg-acohst-700 hover:bg-acohst-800 text-white font-extrabold py-4 rounded-2xl text-sm shadow-xl transition"
            >
              {loading ? 'Submitting Application...' : 'FINAL SUBMIT ADMISSION APPLICATION'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
