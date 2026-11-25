import React from 'react';

/**
 * PageHeader
 * - Title + ONE short subtitle (12 words or fewer)
 * - Primary action button on the right
 * - Clean, non-distracting design without decorative chips
 */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 min-w-0">
      <div className="space-y-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#6D6E71] dark:text-[#8D8E92] font-normal max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 sm:flex-shrink-0">
          {actions}
        </div>
      )}

      {children}
    </div>
  );
};
