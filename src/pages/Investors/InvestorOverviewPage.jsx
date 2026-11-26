import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Inbox,
  Folder,
  DollarSign,
  ArrowRight,
  Target,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusPill } from '../../components/common/StatusPill';
import { MockService } from '../../data/mockService';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Sample data pending client confirmation: margin 42.0%, $680 swap revenue/unit/year, $4.2M committed, $6.0M target.
export const InvestorOverviewPage = () => {
  const fundingRound = MockService.getFundingRound();
  const investors = MockService.getInvestors();
  const allAllocationRequests = MockService.getAllocationRequests();
  // Overview and active views show only the active round's allocation requests
  const allocationRequests = allAllocationRequests.filter(
    (r) => !fundingRound?.name || r.round === fundingRound.name
  );
  const documents = MockService.getDataRoomDocuments();
  const regions = MockService.getRegions();
  const reservations = MockService.getReservations();

  // Dynamic committed calculations for active round
  const totalCommitted = MockService.getCommittedCapital(fundingRound?.name);
  const targetRaise = Number(fundingRound.targetRaise) || 6000000;
  const subscribedPercent = targetRaise > 0 ? Math.min(Math.round((totalCommitted / targetRaise) * 1000) / 10, 100) : 0;

  const pendingRequests = allocationRequests.filter((r) => r.status === 'Pending');

  // Pagination for Recent Allocation Requests
  const [reqPage, setReqPage] = useState(1);
  const reqPageSize = 4;
  const totalReqPages = Math.ceil(allocationRequests.length / reqPageSize) || 1;
  const pagedRequests = useMemo(
    () => allocationRequests.slice((reqPage - 1) * reqPageSize, reqPage * reqPageSize),
    [allocationRequests, reqPage]
  );
  const reqPageNumbers = useMemo(() => {
    if (totalReqPages <= 5) {
      return Array.from({ length: totalReqPages }, (_, i) => i + 1);
    }
    if (reqPage <= 3) {
      return [1, 2, 3, '...', totalReqPages];
    }
    if (reqPage >= totalReqPages - 2) {
      return [1, '...', totalReqPages - 2, totalReqPages - 1, totalReqPages];
    }
    return [1, '...', reqPage, '...', totalReqPages];
  }, [totalReqPages, reqPage]);

  // Derived Quarterly Reservations data summing to the exact total pre-orders (e.g. 142)
  const totalReservations = reservations.length || 142;
  const q1 = Math.round(totalReservations * 0.18); // ~26
  const q2 = Math.round(totalReservations * 0.25); // ~36
  const q3 = Math.round(totalReservations * 0.31); // ~44
  const q4 = totalReservations - (q1 + q2 + q3);   // ~36

  const quarterlyData = [
    { quarter: 'Q1', reservations: q1 },
    { quarter: 'Q2', reservations: q2 },
    { quarter: 'Q3', reservations: q3 },
    { quarter: 'Q4', reservations: q4 },
  ];

  // Top 3 Regional Hubs from Scheduling page
  const topThreeRegions = regions.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Investor Overview"
        subtitle="Funding progress and investor activity."
      />

      {/* Top Card: Dark Funding Card */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#121417] text-white border border-white/10 shadow-water relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#A4A77E] font-bold">
                Active Capital Round
              </span>
              <StatusPill status={fundingRound.status} size="xs" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {fundingRound.name}
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Capital Committed ${(totalCommitted / 1000000).toFixed(1)}M / ${(targetRaise / 1000000).toFixed(1)}M target
            </p>
          </div>

          <div className="lg:w-72 w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Round Progress</span>
              <span className="font-bold text-[#A4A77E]">{subscribedPercent}% subscribed</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#73784F] to-[#A4A77E] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(subscribedPercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>${totalCommitted.toLocaleString()}</span>
              <span>${targetRaise.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards: Label, Big Number, and ONE Small Chip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <KpiCard
          title="Total Investors"
          value={investors.length}
          icon={Users}
          tag="Active Pool"
        />
        <KpiCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={Inbox}
          tag="Review Queue"
        />
        <KpiCard
          title="Committed Capital"
          value={`$${(totalCommitted / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          tag={`${subscribedPercent}% Target`}
        />
        <KpiCard
          title="Data Room Documents"
          value={documents.length}
          icon={Folder}
          tag="Verified Access"
        />
      </div>

      {/* Traction Preview Card */}
      <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
          <div>
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
              Traction Preview
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
              Quarterly reservations and regional hub rollout progress.
            </p>
          </div>
          <span className="text-xs font-mono text-[#4E5637] dark:text-[#C5CAB0] font-bold">
            {totalReservations} Pre-Orders
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
          {/* Quarterly Reservations Bar Chart */}
          <div className="space-y-3 min-w-0">
            <span className="text-[11px] font-mono uppercase text-[#6D6E71] dark:text-[#8D8E92] font-bold block">
              Quarterly Reservations ({totalReservations} Total)
            </span>
            <div className="h-44 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterlyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="quarter"
                    stroke="#8D8E92"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#8D8E92"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E2227',
                      borderColor: '#383E47',
                      borderRadius: 12,
                      fontSize: 12,
                      color: '#FFFFFF',
                    }}
                    formatter={(val) => [`${val} Pre-Orders`, 'Reservations']}
                  />
                  <Bar
                    dataKey="reservations"
                    fill="#A4A77E"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Hub Rollout Progress Bars */}
          <div className="space-y-3.5 min-w-0">
            <span className="text-[11px] font-mono uppercase text-[#6D6E71] dark:text-[#8D8E92] font-bold block">
              Regional Hub Rollout
            </span>
            <div className="space-y-4 pt-1">
              {topThreeRegions.map((region) => (
                <div key={region.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {region.name}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {region.percent}% Allocated
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#73784F] dark:bg-[#A4A77E] rounded-full transition-all duration-300"
                      style={{ width: `${region.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400">
                    <span>{region.hubCity}</span>
                    <span>{region.allocated} / {region.capacity} units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Allocation Requests Card */}
      <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
          <div>
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
              Recent Allocation Requests
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
              Latest investor allocation submissions.
            </p>
          </div>
          <Link
            to="/allocation-requests"
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#4E5637] dark:text-[#C5CAB0] hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {pagedRequests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-[#2B3037] flex items-center justify-between text-xs hover:bg-slate-50/60 dark:hover:bg-[#1E2227]/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-semibold text-slate-500 w-20 flex-shrink-0">
                  {req.id}
                </span>
                <div className="min-w-0 truncate">
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {req.investorName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {req.firm}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${(Number(req.amount) || 0).toLocaleString()}
                </span>
                <div className="hidden sm:block">
                  <span className="font-mono text-[11px] text-slate-400">
                    {req.requestedOn}
                  </span>
                </div>
                <StatusPill status={req.status} size="xs" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#2B3037] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6D6E71] dark:text-[#8D8E92]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 shadow-2xs font-sans backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E] flex-shrink-0 animate-pulse-subtle" />
            <span className="text-slate-400 dark:text-slate-400 font-normal">Showing</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {(reqPage - 1) * reqPageSize + 1}
            </span>
            <span className="text-slate-400 dark:text-slate-400 font-normal">to</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {Math.min(reqPage * reqPageSize, allocationRequests.length)}
            </span>
            <span className="text-slate-400 dark:text-slate-400 font-normal">of</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {allocationRequests.length}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">requests</span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end overflow-x-auto py-0.5">
            <Pagination className="mx-0 w-auto justify-center sm:justify-end">
              <PaginationContent className="gap-1 flex-nowrap items-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setReqPage((p) => Math.max(p - 1, 1))}
                    disabled={reqPage <= 1}
                  />
                </PaginationItem>

                {reqPageNumbers.map((pg, idx) => (
                  <PaginationItem key={pg === '...' ? `req-ellipsis-${idx}` : pg}>
                    {pg === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={reqPage === pg}
                        onClick={() => setReqPage(pg)}
                      >
                        {pg}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setReqPage((p) => Math.min(p + 1, totalReqPages))}
                    disabled={reqPage >= totalReqPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};
