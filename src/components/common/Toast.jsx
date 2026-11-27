import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TOAST_VARIANTS = {
  success: {
    label: 'Success',
    icon: CheckCircle2,
    iconWrap: 'bg-[#A4A77E]/15 text-[#5E633C] dark:text-[#C5CAB0]',
    accent: 'border-l-[#A4A77E]',
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    iconWrap: 'bg-red-500/12 text-red-600 dark:text-red-400',
    accent: 'border-l-red-500',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    iconWrap: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
    accent: 'border-l-amber-500',
  },
  info: {
    label: 'Notice',
    icon: Info,
    iconWrap: 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
    accent: 'border-l-blue-500',
  },
};

/**
 * Global Toast Container and Alert Notification Item (Top-Right)
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const variant = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.success;
        const Icon = variant.icon;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#1E2228]/95 backdrop-blur-md border border-slate-200/90 dark:border-[#383E47] border-l-4 ${variant.accent} shadow-2xl text-slate-800 dark:text-slate-100 transition-all animate-fade-in`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${variant.iconWrap}`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {variant.label}
              </p>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-100 mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2A2F37] transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
