import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { StatusPill } from './StatusPill';
import { RowActionsMenu } from './RowActionsMenu';

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
      <div className="p-4 sm:p-5 border-b border-slate-200/70 dark:border-white/5 bg-white/70 dark:bg-[#1A1D21]/70 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
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
        <div className="flex items-center gap-2.5 flex-wrap">
          {filters.map((f) => (
            <div key={f.key} className="relative">
              <select
                value={activeFilters[f.key] || 'all'}
                onChange={(e) => {
                  if (onFilterChange) {
                    onFilterChange(f.key, e.target.value);
                    setCurrentPage(1);
                  }
                }}
                className="text-xs bg-white dark:bg-[#22262C] border border-[#CCD4BE]/80 dark:border-[#424A3B] rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#A4A77E] cursor-pointer appearance-none pr-8 font-medium shadow-2xs"
              >
                <option value="all">{f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}

          {actions && <div>{actions}</div>}
        </div>
      </div>

      {/* Table Element - Fixed width, no horizontal scrollbar */}
      <div className="w-full overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-white/5 bg-[#F3F5F0] dark:bg-[#1E2227] text-slate-600 dark:text-slate-300 font-sans text-[11px] font-bold uppercase tracking-wider">
              {tableColumns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 lg:px-5 py-3.5 select-none font-bold ${
                    col.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${col.hideBelowXl ? 'hidden xl:table-cell' : ''} ${
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
                        } ${col.hideBelowXl ? 'hidden xl:table-cell' : ''} ${
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
      <div className="p-4 border-t border-slate-200/70 dark:border-white/5 bg-white/50 dark:bg-[#1A1D21]/50 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6D6E71] dark:text-[#8D8E92]">
        <div className="flex items-center gap-3">
          <div className="font-sans">
            Showing{' '}
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {sortedData.length}
            </span>{' '}
            entries
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-white/10 pl-3">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent border border-slate-200 dark:border-[#383E47] rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#A4A77E]"
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#383E47] hover:bg-slate-50 dark:hover:bg-[#2B3037] disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg font-mono font-semibold text-xs flex items-center justify-center transition-colors ${
                  currentPage === pg
                    ? 'clean-pill-active'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2B3037]'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#383E47] hover:bg-slate-50 dark:hover:bg-[#2B3037] disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
