import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  DollarSign,
  Download,
  RefreshCw,
  RotateCcw,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  User,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  Hash,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { KpiCard } from '../../components/common/KpiCard';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const PaymentsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [payments, setPayments] = useState(() => MockService.getPayments());
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
  });

  // SlideOver panels state
  const [viewingPayment, setViewingPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: 200,
    status: 'Paid',
    method: '',
    batch: '',
    stripeRef: '',
  });

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      sortable: true,
      width: '16%',
      isMono: true,
    },
    {
      key: 'date',
      label: 'Timestamp',
      sortable: true,
      width: '16%',
      isMono: true,
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      width: '20%',
      render: (val) => (
        <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
          {val}
        </span>
      )
    },
    {
      key: 'batch',
      label: 'Batch #',
      sortable: true,
      width: '14%',
      isMono: true,
    },
    {
      key: 'amount',
      label: 'Deposit ($200)',
      sortable: true,
      width: '10%',
      render: (val) => (
        <span className="font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-white">
          ${val}.00
        </span>
      )
    },
    {
      key: 'method',
      label: 'Payment Method',
      width: '14%',
      hideBelowXl: true,
      render: (val, row) => (
        <div className="text-xs truncate">
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate block">{val}</span>
          <div className="font-mono text-[10px] text-[#6D6E71] truncate">{row.stripeRef}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '10%',
      isStatus: true,
    }
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'All Payment Statuses',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Refunded', value: 'Refunded' },
      ]
    }
  ];

  const handleViewCustomerProfile = (row) => {
    const customers = MockService.getCustomers();
    const matched = customers.find(
      (c) => c.name.toLowerCase().trim() === row.customer.toLowerCase().trim()
    );
    if (matched) {
      navigate(`/customers?profile=${matched.id}`);
    } else {
      navigate('/customers');
      addToast(`Navigating to customer records for ${row.customer}`, 'info');
    }
  };

  const handleOpenEdit = (row) => {
    setEditForm({
      amount: row.amount,
      status: row.status,
      method: row.method,
      batch: row.batch,
      stripeRef: row.stripeRef || '',
    });
    setEditingPayment(row);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingPayment) return;
    MockService.updatePayment(editingPayment.id, {
      amount: Number(editForm.amount) || editingPayment.amount,
      status: editForm.status,
      method: editForm.method,
      batch: editForm.batch,
      stripeRef: editForm.stripeRef,
    });
    setPayments(MockService.getPayments());
    setEditingPayment(null);
    addToast(`Payment ${editingPayment.id} updated successfully`, 'success');
  };

  const handleDeletePayment = (txId) => {
    MockService.deletePayment(txId);
    setPayments(MockService.getPayments());
    addToast(`Payment transaction ${txId} deleted`, 'info');
  };

  const handleRefund = (txId) => {
    MockService.refundPayment(txId);
    setPayments(MockService.getPayments());
    if (viewingPayment?.id === txId) {
      setViewingPayment({ ...viewingPayment, status: 'Refunded' });
    }
    addToast(`Transaction ${txId} refunded ($200.00)`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Payments & Deposits"
        subtitle="Deposit reconciliation, batch allocations, and refund processing."
        actions={
          <button
            onClick={() => {
              addToast('Downloaded reservation fees ledger CSV', 'success');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KpiCard
          title="Collected Deposit Fees"
          value={`$${payments.filter(p => p.status === 'Paid').length * 200}.00`}
          subtext="100% locked to production batches"
          icon={DollarSign}
          trend="100% Locked"
          trendType="positive"
        />

        <KpiCard
          title="Pending ACH / Clearing"
          value={`$${payments.filter(p => p.status === 'Pending').length * 200}.00`}
          subtext="Awaiting bank settlement reconciliation"
          icon={Clock}
          trend="Processing"
          trendType="neutral"
        />

        <KpiCard
          title="Processed Refunds"
          value={`$${payments.filter(p => p.status === 'Refunded').length * 200}.00`}
          subtext="Territory boundary adjustments"
          icon={RotateCcw}
          trend="Settled"
          trendType="neutral"
        />
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchPlaceholder="Search transaction ID, customer, batch #..."
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={(k, v) => setActiveFilters(prev => ({ ...prev, [k]: v }))}
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Payment Details',
            icon: Eye,
            onClick: () => setViewingPayment(row),
          },
          {
            label: 'View Customer Profile',
            icon: User,
            onClick: () => handleViewCustomerProfile(row),
          },
          {
            label: 'Edit Payment',
            icon: Edit2,
            onClick: () => handleOpenEdit(row),
          },
          {
            label: 'Delete Payment',
            icon: Trash2,
            variant: 'danger',
            confirmMessage: `Are you sure you want to delete payment record ${row.id}?`,
            onClick: () => handleDeletePayment(row.id),
          },
        ]}
      />

      {/* SlideOver Panel: View Payment Details */}
      <SlideOverPanel
        isOpen={!!viewingPayment}
        onClose={() => setViewingPayment(null)}
        title={viewingPayment ? `Payment Details: ${viewingPayment.id}` : ''}
        subtitle="Deposit reconciliation, batch association, and settlement details."
        icon={CreditCard}
        footer={
          <div className="flex items-center justify-between w-full">
            {viewingPayment?.status === 'Paid' ? (
              <button
                type="button"
                onClick={() => handleRefund(viewingPayment.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Refund Deposit
              </button>
            ) : <div />}
            <button
              type="button"
              onClick={() => setViewingPayment(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingPayment && (
          <div className="space-y-5 text-xs">
            {/* Header summary */}
            <div className="p-4 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Transaction Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                    {viewingPayment.id}
                  </span>
                  <StatusPill status={viewingPayment.status} size="xs" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Recorded Date</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {viewingPayment.date}
                </span>
              </div>
            </div>

            {/* Financial summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] bg-slate-50/60 dark:bg-[#1E2227]/40 space-y-1">
                <span className="font-mono uppercase text-[10.5px] text-slate-500 block">Deposit Amount</span>
                <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white block">
                  ${viewingPayment.amount}.00
                </span>
                <span className="font-mono text-[10.5px] text-slate-400">
                  Fixed reservation quota fee
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] bg-slate-50/60 dark:bg-[#1E2227]/40 space-y-1">
                <span className="font-mono uppercase text-[10.5px] text-slate-500 block">Settlement Method</span>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {viewingPayment.method}
                </span>
                <span className="font-mono text-[10.5px] text-slate-400 truncate block">
                  {viewingPayment.stripeRef}
                </span>
              </div>
            </div>

            {/* Customer & Batch linkage */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Associated Customer & Allocation
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2B3037]">
                  <span className="text-slate-500">Customer Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {viewingPayment.customer}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setViewingPayment(null);
                        handleViewCustomerProfile(viewingPayment);
                      }}
                      className="text-[#73784F] dark:text-[#A4A77E] hover:underline flex items-center gap-0.5 text-[11px] font-bold"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2B3037]">
                  <span className="text-slate-500">Production Batch:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {viewingPayment.batch}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reservation Reference:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {viewingPayment.reservationId || 'NT-RES-2026-084'}
                  </span>
                </div>
              </div>
            </div>

            {viewingPayment.note && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-slate-50/50 dark:bg-[#1E2227]/30 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Payment Note:</span>
                {viewingPayment.note}
              </div>
            )}
          </div>
        )}
      </SlideOverPanel>

      {/* SlideOver Panel: Edit Payment */}
      <SlideOverPanel
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        title={editingPayment ? `Edit Payment: ${editingPayment.id}` : ''}
        subtitle="Update payment method, deposit status, or settlement reference."
        icon={Edit2}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setEditingPayment(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-payment-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Changes
            </button>
          </div>
        }
      >
        {editingPayment && (
          <form id="edit-payment-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                disabled
                value={editingPayment.customer}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-slate-100 dark:bg-[#1E2227] text-slate-600 dark:text-slate-400 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deposit Amount ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="10"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Status *
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <input
                type="text"
                value={editForm.method}
                onChange={(e) => setEditForm({ ...editForm, method: e.target.value })}
                placeholder="e.g. Visa ending 4291"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Production Batch #
                </label>
                <input
                  type="text"
                  value={editForm.batch}
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stripe Reference
                </label>
                <input
                  type="text"
                  value={editForm.stripeRef}
                  onChange={(e) => setEditForm({ ...editForm, stripeRef: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </form>
        )}
      </SlideOverPanel>
    </div>
  );
};
