import React, { useState, useEffect } from 'react';
import { CreditCard, Printer, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function StudentFees() {
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await api.get('/student/profile');
      if (res.data.success) {
        setStudent(res.data.student);
        setPayments(res.data.payments || []);
      }
    } catch (err) {
      console.warn('Error loading fees:', err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Fees & Official Payment Receipts</h2>
            <p className="text-xs text-slate-500">Tuition fees, portal charges, and transaction records</p>
          </div>
          <button onClick={() => window.print()} className="no-print bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
        </div>

        {/* Current Fee Invoice Status */}
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex justify-between items-center text-xs">
          <div>
            <span className="text-emerald-800 font-bold uppercase block">Session Tuition Status (2026/2027)</span>
            <span className="text-slate-700">{student?.programme_name || 'CHEW Diploma'}</span>
          </div>
          <div className="text-right">
            <span className="font-black text-lg text-emerald-800 block">₦75,000</span>
            <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded text-[10px]">PAID & CLEARED</span>
          </div>
        </div>

        {/* Payment History */}
        <div className="printable-area border rounded-2xl overflow-hidden text-xs">
          <div className="bg-slate-900 text-white p-3 font-bold">OFFICIAL PAYMENT HISTORY</div>
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b font-bold text-slate-700">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Payment Description</th>
                <th className="p-3">Amount (₦)</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-800">
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="p-3 font-mono font-bold">{p.reference}</td>
                  <td className="p-3 font-medium">{p.payment_type}</td>
                  <td className="p-3 font-bold">₦{p.amount.toLocaleString()}</td>
                  <td className="p-3">{p.channel}</td>
                  <td className="p-3 text-emerald-700 font-bold">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
