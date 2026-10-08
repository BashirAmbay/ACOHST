import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showSuccess = (msg) => addToast(msg, 'success');
  const showError = (msg) => addToast(msg, 'error');
  const showInfo = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`flex items-start p-4 rounded-xl shadow-xl border text-sm font-medium transition-all transform translate-y-0 animate-slideUp ${
              toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' :
              toast.type === 'error' ? 'bg-rose-900 text-white border-rose-700' :
              'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 mr-3 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0 mt-0.5" />}
            
            <div className="flex-1 pr-2">{toast.message}</div>
            
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
