import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Reusable global input field component with optional label and trailing action slot.
 */
export const InputField = React.forwardRef(
  ({ label, required, rightElement, containerClassName, className, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
            {label}
            {required ? ' *' : ''}
          </label>
        )}
        <div className={rightElement ? 'relative' : undefined}>
          <input
            ref={ref}
            required={required}
            className={cn(
              'w-full h-11 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white transition-colors hover:border-[#A4A77E] dark:hover:border-[#A4A77E] focus:outline-none focus:border-[#A4A77E] dark:focus:border-[#A4A77E] focus:ring-2 focus:ring-[#A4A77E]/25',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />
          {rightElement}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
