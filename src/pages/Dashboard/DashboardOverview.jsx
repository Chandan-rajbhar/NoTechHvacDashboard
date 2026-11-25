import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Box,
  Wrench,
  UserCheck,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { Timeline } from '../../components/common/Timeline';
import { LocalMechanicalBadge } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [reservations, setReservations] = useState(() => MockService.getReservations());
  const [approvals] = useState(() => MockService.getApprovals());
  const [inquiries] = useState(() => MockService.getInquiries());
  const [flags] = useState(() => MockService.getFlags());
  const [selectedRes, setSelectedRes] = useState(null);

  // Quick Action Modal states
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [newBatchCustomer, setNewBatchCustomer] = useState('');
  const [newBatchTonnage, setNewBatchTonnage] = useState('3.0');

  // KPI Calculations
  const totalReservations = 142; // Batch total
  const unitsInProduction = 38;
  const activeInstallations = 19;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'In Review' || a.status === 'Submitted').length;
  const reservationRevenue = totalReservations * 200; // $200 deposit per unit
  const openFlagsCount = flags.filter(f => f.status !== 'Resolved').length;

  // Chart 1: Reservations by Region
  const regionChartData = [
    { region: 'NorCal Hub', count: 48, fill: '#A4A77E' },
    { region: 'Bay Area', count: 36, fill: '#73784F' },
    { region: 'Central Valley', count: 24, fill: '#C2B59B' },
    { region: 'North Coast', count: 18, fill: '#5D6D7E' },
    { region: 'Sierra Foothills', count: 16, fill: '#465B43' },
  ];

  // Chart 2: Production Stage Funnel
  const funnelChartData = [
    { stage: 'Reservation (20%)', count: 28, fill: '#6D6E71' },
    { stage: 'Assembly & Pre-Cal (65%)', count: 44, fill: '#C2B59B' },
    { stage: 'Quality Check (85%)', count: 31, fill: '#A4A77E' },
    { stage: 'Ready for Dispatch (95%)', count: 22, fill: '#868962' },
    { stage: 'Installed & Verified (100%)', count: 17, fill: '#465B43' },
  ];

  // Chart 3: Installations by Time Slot (8 slots)
  const slotChartData = [
    { slot: '7-10 AM', count: 14 },
    { slot: '10-1 PM', count: 22 },
    { slot: '1-4 PM', count: 19 },
    { slot: '4-7 PM', count: 12 },
    { slot: '7-10 PM', count: 8 },
    { slot: '10-1 AM', count: 3 },
    { slot: '1-4 AM', count: 1 },
    { slot: '4-7 AM', count: 2 },
  ];

  const handleCreateBatch = (e) => {
    e.preventDefault();
    if (!newBatchCustomer.trim()) return;

    const created = MockService.createReservation({
      customerName: newBatchCustomer,
      customerEmail: `${newBatchCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      customerPhone: '(555) 492-0199',
      address: '220 Innovation Way, Sacramento, CA 95814',
      region: 'Northern California Regional Hub',
      tonnage: `${newBatchTonnage} Ton`,
      configuration: 'Upflow Configuration',
      frontPanelColor: '#373A3C',
      frontPanelColorName: 'Dark Gray (Default)',
      installationDate: '2026-11-20',
      installationTimeSlot: '10 AM – 1 PM',
    });

    setReservations(MockService.getReservations());
    setIsCreateBatchModalOpen(false);
    setNewBatchCustomer('');
    addToast(`Batch ${created.batchNumber} created and $200 deposit logged!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Page Header */}
      <PageHeader
        title="Operations & Production Overview"
        subtitle="Real-time assembly telemetry, contractor network dispatch, and Local Mechanical compliance oversight."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateBatchModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all"
            >
              <span>Create Production Batch</span>
            </button>
            <button
              onClick={() => {
                setReservations(MockService.getReservations());
                addToast('Telemetry refreshed from Northern California Hub', 'info');
              }}
              className="p-2.5 rounded-xl water-pill text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* 6 Key Performance Indicator Cards (Fluid width spanning all screens cleanly) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
        <KpiCard
          title="Reservations Total"
          value={totalReservations}
          subtext="Batch systems total"
          trend="+12% mo."
          trendType="positive"
          icon={Layers}
          onClick={() => navigate('/reservations')}
        />
        <KpiCard
          title="In Production"
          value={unitsInProduction}
          subtext="NorCal line: 38/50"
          progress={76}
          icon={Box}
          onClick={() => navigate('/reservations')}
        />
        <KpiCard
          title="Active Installs"
          value={activeInstallations}
          subtext="8 time slots"
          trend="92% on-time"
          trendType="positive"
          icon={Wrench}
          onClick={() => navigate('/installations-qc')}
        />
        <KpiCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtext="Local Mech queue"
          trend="4 require review"
          trendType="alert"
          icon={UserCheck}
          onClick={() => navigate('/contractor-approvals')}
        />
        <KpiCard
          title="Deposit Revenue"
          value={`$${reservationRevenue.toLocaleString()}`}
          subtext="$200 fees locked"
          trend="100% collected"
          trendType="positive"
          icon={DollarSign}
          onClick={() => navigate('/payments')}
        />
        <KpiCard
          title="Open QC Flags"
          value={openFlagsCount}
          subtext="Repeat fails: 2"
          trend={openFlagsCount > 0 ? 'Action required' : 'All clear'}
          trendType={openFlagsCount > 0 ? 'alert' : 'positive'}
          icon={AlertTriangle}
          onClick={() => navigate('/installations-qc')}
        />
      </div>

      {/* Regional Hub Quota Banner with water sheen */}
      <div className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl water-pill flex items-center justify-center text-[#465B43] dark:text-[#BFC399] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Northern California Regional Hub Allocation
              </h3>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5E9E0] text-[#3F4F3B] dark:bg-[#252E23] dark:text-[#BFC399] border border-[#CCD4BE]/60">
                88% ALLOCATED
              </span>
            </div>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
              352 of 400 monthly chassis quota assigned. Automated lead-time adjustment active for Sacramento Depot.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-56 hidden sm:block">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6D6E71] dark:text-[#8D8E92] mb-1">
              <span>Quota Used</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">352 / 400</span>
            </div>
            <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#868962] to-[#A4A77E] h-2 rounded-full shadow-glow-green" style={{ width: '88%' }} />
            </div>
          </div>
          <button
            onClick={() => navigate('/scheduling')}
            className="text-xs font-semibold font-mono text-[#555D50] dark:text-[#BFC399] hover:underline flex items-center gap-1 water-pill px-3 py-1.5 rounded-xl"
          >
            <span>View Capacity</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Charts Row (Fluid Full Width) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        {/* Chart 1: Reservations by Region (7 cols) */}
        <div className="xl:col-span-7 min-w-0 water-card rounded-2xl p-4 sm:p-6 border border-white/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Reservations by Geographic Region
              </h3>
              <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                Active modular system reservations across regional hub service territories
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#A4A77E] font-bold">
              142 Total
            </span>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11, fill: '#6D6E71', fontFamily: 'JetBrains Mono' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#6D6E71', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(164, 167, 126, 0.1)' }}
                  contentStyle={{
                    backgroundColor: '#1E2227',
                    border: '1px solid #383E47',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  formatter={(val) => [`${val} Systems`, 'Reservations']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {regionChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Production Stage Funnel (5 cols) */}
        <div className="xl:col-span-5 min-w-0 water-card rounded-2xl p-4 sm:p-6 border border-white/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Production Stage Funnel
              </h3>
              <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                WIP distribution by productionProgressPercent
              </p>
            </div>
            <span className="text-[10.5px] font-mono px-2 py-0.5 rounded water-pill text-slate-600 dark:text-slate-300">
              Funnel
            </span>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnelChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6D6E71' }} />
                <YAxis
                  dataKey="stage"
                  type="category"
                  tick={{ fontSize: 10, fill: '#6D6E71', fontFamily: 'Plus Jakarta Sans' }}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(164, 167, 126, 0.1)' }}
                  contentStyle={{
                    backgroundColor: '#1E2227',
                    border: '1px solid #383E47',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelChartData.map((entry, idx) => (
                    <Cell key={`funnel-cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Installations by Time Slot & Side Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        {/* Chart 3: Installations by Time Slot (7 cols) */}
        <div className="xl:col-span-7 min-w-0 water-card rounded-2xl p-4 sm:p-6 border border-white/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Installations by Time Slot (8 Designated Windows)
              </h3>
              <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                Active 3-hour installation service windows
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#73784F] dark:text-[#BFC399] font-bold">
              8 Slots
            </span>
          </div>

          <div className="h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slotChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="slotGradientWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A4A77E" stopOpacity={0.65}/>
                    <stop offset="95%" stopColor="#A4A77E" stopOpacity={0.03}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="slot"
                  tick={{ fontSize: 10, fill: '#6D6E71', fontFamily: 'JetBrains Mono' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#6D6E71', fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E2227',
                    border: '1px solid #383E47',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  formatter={(val) => [`${val} Jobs Assigned`, 'Dispatch Load']}
                />
                <Area type="monotone" dataKey="count" stroke="#73784F" strokeWidth={2.5} fillOpacity={1} fill="url(#slotGradientWater)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Cards: Contractor Approvals Waiting & Latest Inquiries (5 cols) */}
        <div className="xl:col-span-5 min-w-0 space-y-4">
          {/* Side Card 1: Contractor Approvals Waiting */}
          <div className="water-card rounded-2xl p-5 border border-white/80 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Approvals Waiting
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-[#A4A77E]">
                {approvals.filter(a => a.status !== 'Approved').length} in Queue
              </span>
            </div>

            <div className="space-y-2.5">
              {approvals.slice(0, 2).map((app) => (
                <div
                  key={app.id}
                  onClick={() => navigate('/contractor-approvals')}
                  className="p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-white/70 dark:bg-[#22262C] hover:border-[#CCD4BE] dark:hover:border-[#4B5640] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {app.contractorName}
                    </p>
                    <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
                      {app.company} • {app.region.split(' ')[0]}
                    </p>
                  </div>
                  <StatusPill status={app.status} size="xs" />
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/contractor-approvals')}
              className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-center text-[#555D50] dark:text-[#BFC399] bg-[#EBF1E8] dark:bg-[#1E251E] hover:opacity-90 transition-opacity"
            >
              Open Local Mechanical Queue →
            </button>
          </div>

          {/* Side Card 2: Latest Customer & Contractor Inquiries */}
          <div className="water-card rounded-2xl p-5 border border-white/80 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <span>Recent Inquiries</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full water-pill text-slate-600 dark:text-slate-300 font-mono">
                  Inbox
                </span>
              </h4>
              <button
                onClick={() => navigate('/inquiries-chatbot')}
                className="text-xs text-[#73784F] dark:text-[#A4A77E] hover:underline font-mono"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {inquiries.slice(0, 2).map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => navigate('/inquiries-chatbot')}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-white/90 dark:hover:bg-[#2B3037] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                    <span className="text-slate-900 dark:text-white truncate">{inq.fromName}</span>
                    <span className="font-mono text-[10px] text-[#6D6E71]">{inq.role}</span>
                  </div>
                  <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reservations Table (Full Width with whitespace-nowrap) */}
      <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Recent Production Reservations
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
              Click any row to open the full unit specifications and 4-compartment RFID slide-over panel
            </p>
          </div>

          <button
            onClick={() => navigate('/reservations')}
            className="text-xs font-semibold font-mono text-[#555D50] dark:text-[#BFC399] hover:underline flex items-center gap-1 water-pill px-3 py-1.5 rounded-xl"
          >
            <span>View All Reservations (142)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 bg-[#F4F6F2] dark:bg-[#1E2227]/80 text-[#6D6E71] dark:text-[#8D8E92] font-mono text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 font-bold whitespace-nowrap">Reservation ID</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Customer</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Batch #</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Tonnage & Config</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Panel Swatch</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Deposit Fee</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Stage & Progress</th>
                <th className="px-4 py-3 font-bold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 dark:divide-white/5">
              {reservations.slice(0, 5).map((res) => (
                <tr
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className="hover:bg-[#A4A77E]/8 dark:hover:bg-[#A4A77E]/10 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {res.id}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <div className="font-bold">{res.customerName}</div>
                    <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                      {res.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {res.batchNumber}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    <span className="font-bold">{res.tonnage}</span> • {res.configuration.split(' ')[0]}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-md border border-black/10 dark:border-white/20 flex-shrink-0"
                        style={{ backgroundColor: res.frontPanelColor }}
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {res.frontPanelColorName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white">${res.reservationFee}</span>
                    <span className="ml-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {res.feeStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="w-36">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6D6E71] mb-1">
                        <span className="truncate">{res.productionStage}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {res.productionProgressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#868962] to-[#A4A77E] h-1.5 rounded-full"
                          style={{ width: `${res.productionProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusPill status={res.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-In Panel for Reservation Details */}
      <SlideOverPanel
        isOpen={!!selectedRes}
        onClose={() => setSelectedRes(null)}
        title={selectedRes ? `Batch: ${selectedRes.batchNumber}` : ''}
        subtitle={selectedRes ? `${selectedRes.tonnage} System · ${selectedRes.customerName}` : ''}
        idChip={selectedRes?.id}
        icon={Layers}
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">
              Fulfillment: {selectedRes?.estimatedFulfillment}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  addToast(`Re-sent batch production update email to ${selectedRes?.customerEmail}`, 'success');
                }}
                className="px-3.5 py-2 rounded-xl water-pill text-xs font-semibold transition-colors"
              >
                Resend Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRes(null);
                  navigate('/reservations');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active transition-colors"
              >
                Open Full Batch View
              </button>
            </div>
          </div>
        }
      >
        {selectedRes && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71] font-bold">
                  Customer & Jobsite
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {selectedRes.customerName}
                </p>
                <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
                  {selectedRes.address}
                </p>
                <p className="text-[11px] font-mono text-[#73784F] dark:text-[#A4A77E] mt-1">
                  {selectedRes.customerPhone}
                </p>
              </div>

              <div className="p-3.5 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71] font-bold">
                  System Specifications
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {selectedRes.tonnage} • {selectedRes.configuration}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: selectedRes.frontPanelColor }}
                  />
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {selectedRes.frontPanelColorName}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Deposit: ${selectedRes.reservationFee} Paid
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl water-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#555D50] dark:text-[#BFC399] font-bold">
                  Assigned Certified Contractor
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRes.assignedContractorName || 'Pending Assignment'}
                </p>
                <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                  {selectedRes.assignedContractorCompany || 'Northern California Regional Network'}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  4 Modular Compartments Telemetry
                </h4>
                <span className="text-[10.5px] font-mono text-[#A4A77E] font-semibold">
                  Zero-Refrigerant-Loss
                </span>
              </div>

              <div className="space-y-2">
                {(selectedRes.compartments || []).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl water-card flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {comp.name}
                      </span>
                      <div className="font-mono text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
                        Tag: <span className="text-slate-800 dark:text-slate-200">{comp.rfidTag}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {comp.health}% Health
                        </span>
                        <div className="text-[10px] text-[#6D6E71]">{comp.status}</div>
                      </div>
                      <StatusPill status={comp.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-3">
                Production & Dispatch Timeline
              </h4>
              <Timeline steps={selectedRes.timeline} />
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* Slide-In Quick Action: Create Production Batch */}
      <SlideOverPanel
        isOpen={isCreateBatchModalOpen}
        onClose={() => setIsCreateBatchModalOpen(false)}
        title="Create Production Batch"
        subtitle="Initialize chassis allocation, set tonnage, and log $200 deposit."
        idChip="$200 DEPOSIT"
        icon={Box}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsCreateBatchModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-batch-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Generate Batch
            </button>
          </div>
        }
      >
        <form id="create-batch-form" onSubmit={handleCreateBatch} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={newBatchCustomer}
              onChange={(e) => setNewBatchCustomer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tonnage Rating *
            </label>
            <select
              value={newBatchTonnage}
              onChange={(e) => setNewBatchTonnage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            >
              <option value="2.0">2.0 Ton (900 – 1,200 sq ft)</option>
              <option value="2.5">2.5 Ton (1,200 – 1,500 sq ft)</option>
              <option value="3.0">3.0 Ton (Standard 3-Bedroom Home)</option>
              <option value="4.0">4.0 Ton (1,900 – 2,500 sq ft)</option>
              <option value="5.0">5.0 Ton (2,500 – 3,200 sq ft)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl water-pill text-[11px] text-[#465B43] dark:text-[#BFC399]">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Automatic Allocation Rules</span>
            </div>
            <p className="mt-0.5">
              System will assign a unique NT-BATCH ID, calculate estimated fulfillment date, lock in the $200 deposit, and queue chassis framing at the NorCal Hub.
            </p>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
