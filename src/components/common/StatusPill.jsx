import React from 'react';

/**
 * StatusPill
 * Strict muted status tokens with colored dot:
 * - Green (#A4A77E / #465B43): Operational, Approved, Completed, Paid, Passed, Active
 * - Tan (#C2B59B): Pending, In Progress, Scheduled, In Review, Needs Info
 * - Steel (#6D6E71): Draft, Reservation, Queued, Idle, Inactive
 * - Restrained Red (#B4443C): Rejected, Flagged, Suspended, Correction Required, Failed, Cancelled
 */
export const StatusPill = ({ status, size = 'sm', className = '' }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let dotColor = 'bg-[#6D6E71]';

  // Green states
  if (
    normalized.includes('operational') ||
    normalized.includes('approved') ||
    normalized.includes('completed') ||
    normalized.includes('paid') ||
    normalized.includes('ready') ||
    normalized.includes('passed') ||
    normalized.includes('active') ||
    normalized.includes('open') ||
    normalized.includes('calibrated')
  ) {
    colorClasses = 'bg-[#EBF1E8] text-[#3F4F3B] border-[#CAD5C2] dark:bg-[#1E271E] dark:text-[#BFC399] dark:border-[#3E4F3B]';
    dotColor = 'bg-[#73784F] dark:bg-[#A4A77E]';
  }
  // Tan / Amber states
  else if (
    normalized.includes('pending') ||
    normalized.includes('review') ||
    normalized.includes('scheduled') ||
    normalized.includes('assembly') ||
    normalized.includes('progress') ||
    normalized.includes('almost full') ||
    normalized.includes('needs info') ||
    normalized.includes('submitted')
  ) {
    colorClasses = 'bg-[#F7F4EC] text-[#695D44] border-[#E0D7C5] dark:bg-[#25221B] dark:text-[#D6CCB5] dark:border-[#4B4434]';
    dotColor = 'bg-[#9F9277] dark:bg-[#C2B59B]';
  }
  // Red / Flagged states
  else if (
    normalized.includes('rejected') ||
    normalized.includes('flagged') ||
    normalized.includes('suspended') ||
    normalized.includes('correction') ||
    normalized.includes('deficiency') ||
    normalized.includes('fail') ||
    normalized.includes('cancelled') ||
    normalized.includes('disabled') ||
    normalized.includes('full')
  ) {
    colorClasses = 'bg-[#FDF2F1] text-[#932F28] border-[#F2C5C2] dark:bg-[#2D1A19] dark:text-[#E89994] dark:border-[#602B28]';
    dotColor = 'bg-[#B4443C]';
  }
  // Steel / Neutral states
  else if (
    normalized.includes('draft') ||
    normalized.includes('reservation') ||
    normalized.includes('upcoming') ||
    normalized.includes('en route')
  ) {
    colorClasses = 'bg-[#EEF0F2] text-[#4A4E53] border-[#D0D4D9] dark:bg-[#1F2328] dark:text-[#A0A5AC] dark:border-[#383E47]';
    dotColor = 'bg-[#6D6E71]';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5'
    : size === 'md'
    ? 'text-xs px-3 py-1 font-semibold'
    : 'text-[11px] px-2.5 py-0.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-sans font-medium whitespace-nowrap shadow-2xs ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
      <span className="truncate">{status}</span>
    </span>
  );
};
