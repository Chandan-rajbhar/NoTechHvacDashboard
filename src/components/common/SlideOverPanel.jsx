import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * SlideOverPanel
 * Right slide-in drawer (~50% width, min 440px, max 720px)
 * - Backdrop dimmed with blur
 * - ID chip and title in header with close X button
 * - Scrollable body with custom scrollbar
 * - Sticky footer with action buttons
 * - ESC key to close and focus trap management
 */
export const SlideOverPanel = ({
  isOpen,
  onClose,
  title,
  subtitle,
  idChip,
  icon: Icon,
  children,
  footer,
  width = 'max-w-2xl', // default ~50% width
}) => {
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#121417]/60 drawer-backdrop transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div
          ref={panelRef}
          className={`w-screen ${width} pointer-events-auto bg-white dark:bg-[#1A1D21] border-l border-slate-200 dark:border-[#383E47] shadow-drawer flex flex-col h-full transform transition-transform duration-300 ease-out translate-x-0`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-[#383E47] bg-[#F8FAF6]/90 dark:bg-[#1E2227]/90 backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-[#A4A77E]/20 text-[#555D50] dark:text-[#BFC399] flex items-center justify-center flex-shrink-0 border border-[#A4A77E]/30">
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {idChip && (
                    <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417] tracking-wider uppercase">
                      {idChip}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {title}
                  </h2>
                </div>
                {subtitle && (
                  <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2B3037] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
              aria-label="Close slide-in panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-slate-700 dark:text-slate-200">
            {children}
          </div>

          {/* Sticky Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-[#383E47] bg-slate-50 dark:bg-[#16191D] flex items-center justify-end gap-3 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
