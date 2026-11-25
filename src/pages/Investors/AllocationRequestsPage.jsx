import React, { useState } from 'react';
import {
  Inbox,
  Eye,
  CheckCircle,
  XCircle,
  PhoneCall,
  Clock,
  RefreshCw,
  DollarSign,
  User,
  Briefcase,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const AllocationRequestsPage = () => {
  const { addToast } = useApp();
  const [requests, setRequests] = useState(() => MockService.getAllocationRequests());

  // SlideOver panels
  const [viewingRequest, setViewingRequest] = useState(null);
  const [actionRequest, setActionRequest] = useState(null); // { request, action: 'Approve' | 'Decline' }
  const [actionNote, setActionNote] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
  });

  const handleOpenAction = (req, action) => {
    setActionRequest({ request: req, action });
    setActionNote('');
  };

  const handleConfirmAction = (e) => {
    e.preventDefault();
    if (!actionRequest) return;

    const { request, action } = actionRequest;
    const newStatus = action === 'Approve' ? 'Approved' : 'Declined';

    MockService.updateAllocationRequestStatus(request.id, newStatus, actionNote.trim() || undefined);
    setRequests(MockService.getAllocationRequests());

    if (action === 'Approve') {
      const totalCommitted = MockService.getCommittedCapital(request.round);
      addToast(
        `Allocation ${request.id} for $${request.amount.toLocaleString()} approved. Round committed capital updated to $${(totalCommitted / 1000000).toFixed(2)}M.`,
        'success'
      );
    } else {
      addToast(`Allocation request ${request.id} declined. Reason recorded.`, 'info');
    }

    if (viewingRequest?.id === request.id) {
      const refreshed = MockService.getAllocationRequests().find((r) => r.id === request.id);
      setViewingRequest(refreshed);
    }

    setActionRequest(null);
    setActionNote('');
  };

  const handleMarkContacted = (req) => {
    MockService.updateAllocationRequestStatus(req.id, 'Contacted', 'Investor contacted for review.');
    setRequests(MockService.getAllocationRequests());
    if (viewingRequest?.id === req.id) {
      const refreshed = MockService.getAllocationRequests().find((r) => r.id === req.id);
      setViewingRequest(refreshed);
    }
    addToast(`Allocation ${req.id} marked as Contacted`, 'info');
  };

  // Table Columns
  const columns = [
    {
      key: 'id',
      label: 'Request ID',
      sortable: true,
      width: '14%',
      isMono: true,
    },
    {
      key: 'investorName',
      label: 'Investor',
      sortable: true,
      width: '26%',
      render: (val, row) => (
        <div className="truncate">
          <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-[#A4A77E]" />
            <span>{row.firm}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'round',
      label: 'Round',
      sortable: true,
      width: '16%',
      hideBelowXl: true,
      render: (val) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      width: '14%',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
          ${(Number(val) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'requestedOn',
      label: 'Requested On',
      sortable: true,
      width: '15%',
      hideOnMobile: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '15%',
      isStatus: true,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'All Statuses',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Contacted', value: 'Contacted' },
        { label: 'Declined', value: 'Declined' },
      ],
    },
  ];

  const getRowActions = (row) => [
    {
      label: 'View Details',
      icon: Eye,
      onClick: () => setViewingRequest(row),
    },
    {
      label: 'Approve Allocation',
      icon: CheckCircle,
      disabled: row.status === 'Approved',
      onClick: () => handleOpenAction(row, 'Approve'),
    },
    {
      label: 'Mark as Contacted',
      icon: PhoneCall,
      disabled: row.status === 'Contacted' || row.status === 'Approved',
      onClick: () => handleMarkContacted(row),
    },
    { divider: true },
    {
      label: 'Decline Allocation',
      icon: XCircle,
      variant: 'danger',
      disabled: row.status === 'Declined',
      onClick: () => handleOpenAction(row, 'Decline'),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Allocation Requests"
        subtitle="Review investment requests from the Investor Hub."
        actions={
          <button
            onClick={() => {
              setRequests(MockService.getAllocationRequests());
              addToast('Allocation requests refreshed', 'info');
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={requests}
        onRowClick={(row) => setViewingRequest(row)}
        searchPlaceholder="Search request ID, investor, firm..."
        filters={filterOptions}
        activeFilters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        pageSize={8}
        rowActions={getRowActions}
      />

      {/* SlideOver Panel: View Details */}
      <SlideOverPanel
        isOpen={!!viewingRequest}
        onClose={() => setViewingRequest(null)}
        title={viewingRequest ? `Allocation ${viewingRequest.id}` : ''}
        subtitle={viewingRequest ? `${viewingRequest.investorName} · ${viewingRequest.firm}` : ''}
        idChip={viewingRequest?.id}
        icon={Inbox}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {viewingRequest?.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => handleOpenAction(viewingRequest, 'Approve')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold clean-pill-active"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              )}
              {viewingRequest?.status !== 'Declined' && (
                <button
                  type="button"
                  onClick={() => handleOpenAction(viewingRequest, 'Decline')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setViewingRequest(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingRequest && (
          <div className="space-y-6 text-xs">
            {/* Header summary */}
            <div className="p-4 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Requested Allocation</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  ${(Number(viewingRequest.amount) || 0).toLocaleString()}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">{viewingRequest.round}</p>
              </div>
              <StatusPill status={viewingRequest.status} size="md" />
            </div>

            {/* Investor Summary Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Investor Profile Summary
              </span>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">Investor:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingRequest.investorName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">Firm / Entity:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{viewingRequest.firm}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">Date Submitted:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{viewingRequest.requestedOn}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Investor Record ID:</span>
                <span className="font-mono text-slate-500">{viewingRequest.investorId}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Allocation Review Timeline
              </span>
              <div className="space-y-3 pt-1">
                {(viewingRequest.timeline || []).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#A4A77E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{step.status}</span>
                        <span className="font-mono text-[10.5px] text-slate-400">{step.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {step.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {viewingRequest.note && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-1.5">
                <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                  Reviewer Notes
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1E2227]/50 p-2.5 rounded-lg border border-slate-100 dark:border-[#2B3037]">
                  {viewingRequest.note}
                </p>
              </div>
            )}
          </div>
        )}
      </SlideOverPanel>

      {/* SlideOver Panel: Approve / Decline Action */}
      <SlideOverPanel
        isOpen={!!actionRequest}
        onClose={() => setActionRequest(null)}
        title={
          actionRequest
            ? `${actionRequest.action} Allocation: ${actionRequest.request.id}`
            : ''
        }
        subtitle={
          actionRequest
            ? `${actionRequest.request.investorName} (${actionRequest.request.firm}) · $${actionRequest.request.amount.toLocaleString()}`
            : ''
        }
        idChip={actionRequest?.request?.id}
        icon={actionRequest?.action === 'Approve' ? CheckCircle : XCircle}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setActionRequest(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="action-allocation-form"
              className={`px-5 py-2 rounded-xl font-semibold shadow-sm text-xs ${
                actionRequest?.action === 'Approve'
                  ? 'clean-pill-active'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Confirm {actionRequest?.action}
            </button>
          </div>
        }
      >
        {actionRequest && (
          <form id="action-allocation-form" onSubmit={handleConfirmAction} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Allocation Amount:</span>
                <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                  ${(Number(actionRequest.request.amount) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Round:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {actionRequest.request.round}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Action:</span>
                <span
                  className={`font-mono font-bold uppercase ${
                    actionRequest.action === 'Approve'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {actionRequest.action} Request
                </span>
              </div>
            </div>

            {actionRequest.action === 'Approve' ? (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Approving this allocation will add <strong>${actionRequest.request.amount.toLocaleString()}</strong> to the round committed capital figure and update the progress bar across all investor views.
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Please specify the reason for declining this allocation. The reason will be recorded in the audit timeline and visible to operators.
              </p>
            )}

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                {actionRequest.action === 'Approve' ? 'Approval Note (Optional)' : 'Decline Reason *'}
              </label>
              <textarea
                rows={3}
                required={actionRequest.action === 'Decline'}
                placeholder={
                  actionRequest.action === 'Approve'
                    ? 'e.g. Legal subscription agreement signed. Allocation locked.'
                    : 'e.g. Outside accredited investor jurisdiction criteria.'
                }
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </form>
        )}
      </SlideOverPanel>
    </div>
  );
};
