import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Download } from 'lucide-react';
import api from '../../services/api';

export default function FinanceManager() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/finance/transactions');
      if (res.data.success) setTransactions(res.data.transactions);
    } catch (err) {
      console.warn('Error fetching transactions:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Finance & Revenue Transactions</h1>
          <p className="text-xs text-slate-400">Monitor Paystack application fees, tuition payments, and receipts</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Reference</th>
                <th className="p-3.5">Payer Name</th>
                <th className="p-3.5">Payer Email</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Amount (₦)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{t.reference}</td>
                  <td className="p-3.5 font-medium text-white">{t.first_name} {t.last_name}</td>
                  <td className="p-3.5">{t.email}</td>
                  <td className="p-3.5 font-medium text-slate-300">{t.payment_type}</td>
                  <td className="p-3.5 font-bold text-amber-300">₦{t.amount.toLocaleString()}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{t.status}</td>
                  <td className="p-3.5 text-slate-400">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
