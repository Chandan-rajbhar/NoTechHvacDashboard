import React, { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const PaymentsPage = () => {
  const { addToast } = useApp();
  const [payments, setPayments] = useState(() => MockService.getPayments());
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
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

  const handleRefund = (txId) => {
    MockService.refundPayment(txId);
    setPayments(MockService.getPayments());
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
        <div className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 shadow-water">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#6D6E71] font-bold">Collected Deposit Fees</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
            ${payments.filter(p => p.status === 'Paid').length * 200}.00
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">100% Locked to Production Batches</span>
        </div>

        <div className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 shadow-water">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#6D6E71] font-bold">Pending ACH / Clearing</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums font-mono">
            ${payments.filter(p => p.status === 'Pending').length * 200}.00
          </div>
          <span className="text-[11px] text-[#6D6E71] mt-1 block">Awaiting bank reconciliation</span>
        </div>

        <div className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 shadow-water">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#6D6E71] font-bold">Processed Refunds</span>
          <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1 tabular-nums font-mono">
            ${payments.filter(p => p.status === 'Refunded').length * 200}.00
          </div>
          <span className="text-[11px] text-[#6D6E71] mt-1 block">Territory boundary moves</span>
        </div>
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
            label: 'View Receipt',
            icon: Eye,
            onClick: () => addToast(`Opening transaction receipt for ${row.id}`, 'info'),
          },
          ...(row.status === 'Paid' ? [
            { divider: true },
            {
              label: 'Refund Deposit',
              icon: RotateCcw,
              variant: 'danger',
              confirmMessage: `Are you sure you want to refund the $200.00 deposit for transaction ${row.id}?`,
              onClick: () => handleRefund(row.id),
            }
          ] : []),
        ]}
      />
    </div>
  );
};
