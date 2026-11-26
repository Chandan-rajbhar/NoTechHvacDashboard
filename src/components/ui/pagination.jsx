import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }) {
  return <li data-slot="pagination-item" className={cn('', className)} {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        isActive && 'border-slate-200/90 dark:border-white/15 bg-white dark:bg-[#22262C] font-semibold text-slate-900 dark:text-white shadow-2xs',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 pl-2.5 pr-3 text-xs sm:text-sm font-medium', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 pl-3 pr-2.5 text-xs sm:text-sm font-medium', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn('flex h-9 w-9 items-center justify-center text-slate-400 dark:text-slate-500', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
