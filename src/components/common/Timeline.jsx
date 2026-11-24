import React from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';

/**
 * Timeline
 * Visual order fulfillment & installation progress tracker
 */
export const Timeline = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#383E47]">
      {steps.map((step, idx) => {
        const isDone = step.completed;
        const isCurrent = step.current;

        return (
          <div key={idx} className="relative group">
            {/* Step Icon Node */}
            <div
              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                isDone
                  ? 'bg-[#73784F] text-white shadow-glow-green'
                  : isCurrent
                  ? 'bg-[#C2B59B] text-[#121417] ring-4 ring-[#C2B59B]/20 animate-pulse'
                  : 'bg-slate-200 dark:bg-[#2B3037] text-slate-400'
              }`}
            >
              {isDone ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : isCurrent ? (
                <Clock className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4
                  className={`text-xs font-bold ${
                    isDone || isCurrent
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.step}
                </h4>
                {step.date && (
                  <span className="font-mono text-[10px] text-[#6D6E71] dark:text-[#8D8E92]">
                    {step.date}
                  </span>
                )}
              </div>

              {step.note && (
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
