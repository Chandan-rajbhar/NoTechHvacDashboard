import React from 'react';

/**
 * KpiCard
 * Executive summary card for top dashboard stats
 * - Liquid water shine effect (sheen sweeps across on hover)
 * - Subtle gradient and translucent glass border
 * - Tabular numbers with clear hierarchy
 * - Flexible responsive subtext and trend badge
 */
export const KpiCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral' | 'alert'
  progress,
  tag,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`water-card water-shine rounded-2xl p-5 transition-all duration-300 hover:shadow-water-lg hover:-translate-y-0.5 group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top row: Label, tag & Icon with water pill */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-[#6D6E71] dark:text-[#8D8E92] truncate">
              {title}
            </span>
            {tag && (
              <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold flex-shrink-0">
                {tag}
              </span>
            )}
          </div>
          <div className="text-2xl xl:text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight mt-1 tabular-nums">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl water-pill flex items-center justify-center text-[#555D50] dark:text-[#BFC399] flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Bottom row: Subtext or Trend */}
      {(subtext || trend || progress !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-100/90 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
          {subtext && (
            <span className="text-[#6D6E71] dark:text-[#8D8E92] text-[11px] truncate flex-1 font-medium">
              {subtext}
            </span>
          )}

          {trend && (
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap flex-shrink-0 shadow-2xs ${
                trendType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50'
                  : trendType === 'alert'
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#868962] to-[#A4A77E] h-1.5 rounded-full transition-all duration-500 shadow-glow-green"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
