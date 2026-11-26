import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
} from 'lucide-react';
import { StatusPill } from './StatusPill';
import { RowActionsMenu } from './RowActionsMenu';
import { CustomSelect } from './CustomSelect';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * DataTable
 * Standardized table component matching exact design specifications:
 * - Rounded white card (20px radius)
 * - Toolbar: Search with magnifier + rounded filter dropdowns
 * - Header: Light grey-olive tint background, small bold uppercase labels in normal font
 * - Rows: 64px to 76px tall, 1px hairline dividers, soft green-tinted hover
 * - Status pills with colored dot
 * - Guaranteed single right-aligned Actions column with RowActionsMenu (no horizontal scrollbar)
 * - Pagination footer with rows-per-page selector & prev/next buttons
 */
export const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  rowActions,
  searchPlaceholder = 'Search records...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  actions,
  pageSize: initialPageSize = 8,
  emptyTitle = 'No records found',
  emptyMessage = 'No matching data found for the current search and filter criteria.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and search
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSearch = Object.values(row).some((val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') {
            return Object.values(val).some((nested) =>
              String(nested).toLowerCase().includes(query)
            );
          }
          return String(val).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
        if (!filterValue || filterValue === 'all') continue;
        const rowVal = String(row[filterKey] || '').toLowerCase();
        if (!rowVal.includes(String(filterValue).toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, activeFilters]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Smart windowed page numbers so we never render a long string of numbers (e.g. 10 pages)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  }, [totalPages, currentPage]);

  // Filter out any manual 'actions' columns if rowActions prop is passed to avoid duplication
  const tableColumns = useMemo(() => {
    if (rowActions) {
      return columns.filter((c) => c.key !== 'actions');
    }
    return columns;
  }, [columns, rowActions]);

  const hasRowActions = typeof rowActions === 'function';

  return (
    <div className="water-card rounded-[20px] overflow-hidden shadow-water border border-white/80 dark:border-white/10 w-full bg-white dark:bg-[#1A1D21]">
      {/* Toolbar */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200/70 dark:border-white/5 bg-white/70 dark:bg-[#1A1D21]/70 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-3.5">
        {/* Search */}
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-white dark:bg-[#22262C] border border-[#CCD4BE]/80 dark:border-[#424A3B] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A4A77E] focus:border-transparent transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-mono font-bold"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {filters.map((f) => {
            const filterOptions = [
              { value: 'all', label: f.label },
              ...(f.options || []).map((opt) => ({
                value: opt.value,
                label: opt.label,
              })),
            ];
            return (
              <div key={f.key} className="relative flex-1 sm:flex-initial min-w-[130px]">
                <CustomSelect
                  value={activeFilters[f.key] || 'all'}
                  onChange={(e) => {
                    if (onFilterChange) {
                      onFilterChange(f.key, e.target.value);
                      setCurrentPage(1);
                    }
                  }}
                  options={filterOptions}
                  size="md"
                  className="w-full text-xs font-medium border-[#CCD4BE]/80 dark:border-[#424A3B] shadow-2xs"
                  minWidth={150}
                />
              </div>
            );
          })}

          {actions && <div className="w-full sm:w-auto flex-shrink-0">{actions}</div>}
        </div>
      </div>

      {/* Table Element - Responsive scroll container, no layout breaks */}
      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse table-fixed min-w-[620px] md:min-w-0">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-white/5 bg-[#F3F5F0] dark:bg-[#1E2227] text-slate-600 dark:text-slate-300 font-sans text-[11px] font-bold uppercase tracking-wider">
              {tableColumns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 lg:px-5 py-3.5 select-none font-bold ${
                    col.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${col.hideBelowLg ? 'hidden lg:table-cell' : ''} ${
                    col.hideBelowXl ? 'hidden xl:table-cell' : ''
                  } ${
                    col.sortable
                      ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors'
                      : ''
                  } ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span className="truncate">{col.label}</span>
                    {col.sortable && (
                      <span className="text-slate-400 flex-shrink-0">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#555D50] dark:text-[#A4A77E]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#555D50] dark:text-[#A4A77E]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {hasRowActions && (
                <th
                  style={{ width: '92px', minWidth: '92px' }}
                  className="px-4 py-3.5 text-right font-bold tracking-wider select-none"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#2E353F] text-xs sm:text-sm">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length + (hasRowActions ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                      {emptyTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group h-[68px] transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer hover:bg-[#A4A77E]/8 dark:hover:bg-[#A4A77E]/10' : ''
                  }`}
                >
                  {tableColumns.map((col) => {
                    const value = row[col.key];

                    return (
                      <td
                        key={col.key}
                        className={`px-4 lg:px-5 py-3 ${
                          col.hideOnMobile ? 'hidden md:table-cell' : ''
                        } ${col.hideBelowLg ? 'hidden lg:table-cell' : ''} ${
                          col.hideBelowXl ? 'hidden xl:table-cell' : ''
                        } ${
                          col.tdClassName || ''
                        }`}
                      >
                        {col.render ? (
                          col.render(value, row)
                        ) : col.isStatus ? (
                          <StatusPill status={value} />
                        ) : col.isMono ? (
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                            {value}
                          </span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-200 truncate block">
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {hasRowActions && (
                    <td
                      style={{ width: '92px', minWidth: '92px' }}
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end">
                        <RowActionsMenu items={rowActions(row)} />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200/70 dark:border-white/5 bg-white/50 dark:bg-[#1A1D21]/50 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6D6E71] dark:text-[#8D8E92]">
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Entries Counter Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 shadow-2xs font-sans backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E] flex-shrink-0 animate-pulse-subtle" />
            <span className="text-slate-400 dark:text-slate-400 font-normal">Showing</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>
            <span className="text-slate-400 dark:text-slate-400 font-normal">to</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>
            <span className="text-slate-400 dark:text-slate-400 font-normal">of</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {sortedData.length}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">entries</span>
          </div>

          {/* Elegant Divider */}
          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

          {/* Premium Rows per page selector */}
          <div className="inline-flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
              Rows:
            </span>
            <CustomSelect
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              options={[
                { value: 6, label: '6' },
                { value: 8, label: '8' },
                { value: 15, label: '15' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              size="sm"
              fontMono
              placement="top"
              className="w-[72px] font-bold shadow-2xs"
              minWidth={72}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end overflow-x-auto py-0.5">
          <Pagination className="mx-0 w-auto justify-center sm:justify-end">
            <PaginationContent className="gap-1 flex-nowrap items-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage <= 1}
                />
              </PaginationItem>

              {pageNumbers.map((pg, idx) => (
                <PaginationItem key={pg === '...' ? `ellipsis-${idx}` : pg}>
                  {pg === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === pg}
                      onClick={() => setCurrentPage(pg)}
                    >
                      {pg}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
