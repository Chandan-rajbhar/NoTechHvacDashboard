import React, { useState } from 'react';
import {
  Target,
  Edit2,
  TrendingUp,
  Percent,
  Layers,
  Wrench,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Box,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

// Sample data pending client confirmation: margin 42.0%, $680 swap revenue/unit/year, $4.2M committed, $6.0M target.
export const FundingRoundPage = () => {
  const { addToast } = useApp();
  const [fundingRound, setFundingRound] = useState(() => MockService.getFundingRound());
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Derived headline numbers from existing dashboard data
  const reservations = MockService.getReservations();
  const preOrdersCount = reservations.length; // e.g. 142 total pre-orders

  const contractors = MockService.getContractors();
  const certifiedContractorsCount = contractors.filter(
    (c) => c.status === 'Active' || c.status === 'Approved' || c.certified
  ).length;

  // Dynamic committed calculation from approved allocation requests + base
  const totalCommitted = MockService.getCommittedCapital();
  const targetRaise = Number(fundingRound.targetRaise) || 6000000;
  const subscribedPercent = Math.min(Math.round((totalCommitted / targetRaise) * 1000) / 10, 100);

  // Edit form state
  const [formData, setFormData] = useState({
    name: fundingRound.name,
    status: fundingRound.status,
    targetRaise: fundingRound.targetRaise,
    baseCommitted: fundingRound.baseCommitted,
    margin: fundingRound.margin,
    swapRevenuePerUnit: fundingRound.swapRevenuePerUnit,
    activeBatch: fundingRound.activeBatch || '#NT-BATCH-2026-084',
    loggedSwaps: fundingRound.loggedSwaps || '0 Verified',
  });

  const [formError, setFormError] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      name: fundingRound.name,
      status: fundingRound.status,
      targetRaise: fundingRound.targetRaise,
      baseCommitted: fundingRound.baseCommitted,
      margin: fundingRound.margin,
      swapRevenuePerUnit: fundingRound.swapRevenuePerUnit,
      activeBatch: fundingRound.activeBatch || '#NT-BATCH-2026-084',
      loggedSwaps: fundingRound.loggedSwaps || '0 Verified',
    });
    setFormError('');
    setIsEditDrawerOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setFormError('');

    const target = Number(formData.targetRaise);
    const margin = Number(formData.margin);

    if (isNaN(target) || target <= 0) {
      setFormError('Target raise must be a positive number greater than 0.');
      return;
    }

    if (isNaN(margin) || margin < 0 || margin > 100) {
      setFormError('Hardware gross margin must be between 0% and 100%.');
      return;
    }

    const updated = MockService.updateFundingRound({
      ...formData,
      targetRaise: target,
      baseCommitted: Number(formData.baseCommitted) || 0,
      margin,
      swapRevenuePerUnit: Number(formData.swapRevenuePerUnit) || 0,
    });

    setFundingRound(updated);
    setIsEditDrawerOpen(false);
    addToast('Funding round details and unit economics updated', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Funding Round"
        subtitle="Round details and unit economics shown in the investor app."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Round</span>
            </button>
            <button
              onClick={() => {
                setFundingRound(MockService.getFundingRound());
                addToast('Funding round parameters refreshed', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Round Details */}
        <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#A4A77E]/15 text-[#4E5637] dark:text-[#C5CAB0] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                Round Details
              </h3>
            </div>
            <StatusPill status={fundingRound.status} size="sm" />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#6D6E71] dark:text-[#8D8E92] font-bold">
                Round Name
              </span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {fundingRound.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037]">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Target Raise</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  ${(targetRaise / 1000000).toFixed(1)}M
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  ${targetRaise.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037]">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Committed Capital</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  ${(totalCommitted / 1000000).toFixed(2)}M
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Computed from approved allocations
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-mono">Subscription Status</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {subscribedPercent}% Subscribed
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#73784F] to-[#A4A77E] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(subscribedPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Unit Economics (FY 2026) */}
        <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                Unit Economics (FY 2026)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Baseline Target</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Hardware Gross Margin</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {fundingRound.margin.toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-500">Chassis assembly COGS</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Recurring Swap Revenue</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ${fundingRound.swapRevenuePerUnit}
              </div>
              <p className="text-[11px] text-slate-500">Per unit per year</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Active Production Batch</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono truncate">
                {fundingRound.activeBatch}
              </div>
              <p className="text-[11px] text-slate-500">NorCal Assembly Hub</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Logged Module Swaps</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                {fundingRound.loggedSwaps}
              </div>
              <p className="text-[11px] text-slate-500">Local Mechanical oversight</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Headline Numbers in the App */}
      <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
          <div>
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
              Headline Numbers in the App
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
              Live metric counters synchronized with customer reservations and network directories.
            </p>
          </div>
          <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Updates automatically
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-mono uppercase text-slate-500 block">Pre-Orders</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                {preOrdersCount} Units
              </div>
              <span className="text-[11px] text-slate-500">Linked to Reservations registry</span>
            </div>
            <div className="w-10 h-10 rounded-xl water-pill flex items-center justify-center text-[#555D50] dark:text-[#BFC399]">
              <Box className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-mono uppercase text-slate-500 block">Certified Contractors</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                {certifiedContractorsCount} Certified
              </div>
              <span className="text-[11px] text-slate-500">Linked to Contractors Directory</span>
            </div>
            <div className="w-10 h-10 rounded-xl water-pill flex items-center justify-center text-[#555D50] dark:text-[#BFC399]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* SlideOver Panel: Edit Round */}
      <SlideOverPanel
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Funding Round"
        subtitle="Update target raise, base commitment, and unit economics parameters."
        icon={Target}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsEditDrawerOpen(false)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-funding-round-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Round Details
            </button>
          </div>
        }
      >
        <form id="edit-funding-round-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Round Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Round Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Raise ($) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="50000"
                value={formData.targetRaise}
                onChange={(e) => setFormData({ ...formData, targetRaise: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Base Committed Capital ($)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={formData.baseCommitted}
              onChange={(e) => setFormData({ ...formData, baseCommitted: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Individual approved allocation requests will add directly to this base figure.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hardware Gross Margin (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                value={formData.margin}
                onChange={(e) => setFormData({ ...formData, margin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recurring Swap Revenue ($/yr) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="10"
                value={formData.swapRevenuePerUnit}
                onChange={(e) => setFormData({ ...formData, swapRevenuePerUnit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Production Batch
              </label>
              <input
                type="text"
                value={formData.activeBatch}
                onChange={(e) => setFormData({ ...formData, activeBatch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Logged Module Swaps
              </label>
              <input
                type="text"
                value={formData.loggedSwaps}
                onChange={(e) => setFormData({ ...formData, loggedSwaps: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
