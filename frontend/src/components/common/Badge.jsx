import React from 'react';

export default function Badge({ status, text }) {
  const display = text || status;
  let style = 'bg-slate-100 text-slate-800 border-slate-200';

  switch (status) {
    case 'Draft':
      style = 'bg-slate-100 text-slate-700 border-slate-300';
      break;
    case 'Submitted':
      style = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'Under Review':
      style = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'Shortlisted':
      style = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Approved':
    case 'Admitted':
    case 'Active':
    case 'Paid':
    case 'Successful':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
      break;
    case 'Rejected':
    case 'Failed':
      style = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Pending':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    default:
      style = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
      {display}
    </span>
  );
}
