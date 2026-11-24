import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Toast Container and Alert Notification Item
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#22262C] border border-slate-200 dark:border-[#383E47] shadow-xl text-slate-800 dark:text-slate-100 text-xs animate-slide-up transition-all"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#73784F] dark:text-[#A4A77E] flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 font-medium">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
