import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

/**
 * DocumentVerifyRow
 * Used in Contractor Approvals queue slide-in panel:
 * Checks EPA, State Lic, Business Address, Depot Shipping Address, and Certificate of Insurance (listing Local Mechanical)
 */
export const DocumentVerifyRow = ({
  doc,
  onToggleVerify,
  onViewDoc,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white dark:bg-[#22262C] hover:border-[#CCD4BE] dark:hover:border-[#4B5640] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          doc.verified 
            ? 'bg-[#EBF1E8] text-[#465B43] dark:bg-[#1E271E] dark:text-[#BFC399]' 
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          <FileText className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {doc.name}
            </span>
            {doc.verified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                <AlertCircle className="w-3 h-3" />
                Pending Review
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate flex items-center gap-2 mt-0.5">
            <span>{doc.type}</span>
            <span>•</span>
            <span className="font-mono text-[10px]">{doc.file}</span>
          </div>
          {doc.notes && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200/50">
              {doc.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {onViewDoc && (
          <button
            type="button"
            onClick={() => onViewDoc(doc)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#383E47] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2B3037] transition-colors"
            title="Preview Document"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleVerify && onToggleVerify(doc.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
            doc.verified
              ? 'bg-[#EBF1E8] text-[#3F4F3B] hover:bg-red-50 hover:text-red-700 dark:bg-[#1E271E] dark:text-[#BFC399]'
              : 'bg-[#1E2227] text-white hover:bg-[#A4A77E] hover:text-[#121417] dark:bg-[#A4A77E] dark:text-[#121417]'
          }`}
        >
          {doc.verified ? 'Verified ✓' : 'Verify'}
        </button>
      </div>
    </div>
  );
};
