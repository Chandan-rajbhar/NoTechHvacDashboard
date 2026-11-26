import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  Eye,
  RotateCcw,
  Ban,
  Layers,
  Send,
  Truck,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { RowActionsMenu } from '../../components/common/RowActionsMenu';
import { KpiCard } from '../../components/common/KpiCard';
import { useApp } from '../../context/AppContext';

export const SchedulingPage = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('time-slots'); // 'time-slots' | 'dispatch'

  // Full 5 region names
  const REGION_NAMES = [
    'Northern California (Sacramento)',
    'Bay Area (San Jose)',
    'Central Valley (Fresno)',
    'North Bay (Santa Rosa)',
    'Sierra Foothills (Auburn)',
  ];

  // Seeded 8 default windows with full region names
  const [slotsData, setSlotsData] = useState([
    {
      id: 'slot-1',
      timeWindow: '7 AM – 10 AM',
      region: 'Northern California (Sacramento)',
      capacity: 400,
      bookedJobs: 352,
      status: 'Almost Full',
      startTime: '07:00',
      endTime: '10:00',
    },
    {
      id: 'slot-2',
      timeWindow: '10 AM – 1 PM',
      region: 'Bay Area (San Jose)',
      capacity: 250,
      bookedJobs: 230,
      status: 'Almost Full',
      startTime: '10:00',
      endTime: '13:00',
    },
    {
      id: 'slot-3',
      timeWindow: '1 PM – 4 PM',
      region: 'Central Valley (Fresno)',
      capacity: 180,
      bookedJobs: 140,
      status: 'Open',
      startTime: '13:00',
      endTime: '16:00',
    },
    {
      id: 'slot-4',
      timeWindow: '4 PM – 7 PM',
      region: 'North Bay (Santa Rosa)',
      capacity: 100,
      bookedJobs: 64,
      status: 'Open',
      startTime: '16:00',
      endTime: '19:00',
    },
    {
      id: 'slot-5',
      timeWindow: '7 PM – 10 PM',
      region: 'Sierra Foothills (Auburn)',
      capacity: 90,
      bookedJobs: 41,
      status: 'Open',
      startTime: '19:00',
      endTime: '22:00',
    },
    {
      id: 'slot-6',
      timeWindow: '10 PM – 1 AM',
      region: 'Northern California (Sacramento)',
      capacity: 120,
      bookedJobs: 120,
      status: 'Full',
      startTime: '22:00',
      endTime: '01:00',
    },
    {
      id: 'slot-7',
      timeWindow: '1 AM – 4 AM',
      region: 'Bay Area (San Jose)',
      capacity: 80,
      bookedJobs: 12,
      status: 'Open',
      startTime: '01:00',
      endTime: '04:00',
    },
    {
      id: 'slot-8',
      timeWindow: '4 AM – 7 AM',
      region: 'Central Valley (Fresno)',
      capacity: 80,
      bookedJobs: 0,
      status: 'Disabled',
      startTime: '04:00',
      endTime: '07:00',
    },
  ]);

  // Dispatched Jobs List
  const [dispatchJobs, setDispatchJobs] = useState([
    {
      id: 'JOB-101',
      customer: 'David Sterling',
      customerAddress: '482 Maple St, Springfield, CA',
      tech: 'Marcus Vance',
      date: '2026-10-24',
      timeWindow: '10 AM – 1 PM',
      region: 'Northern California (Sacramento)',
      tonnage: '3.0 Ton',
      status: 'Scheduled',
    },
    {
      id: 'JOB-102',
      customer: 'Sarah Jenkins',
      customerAddress: '104 Oak Dr, Sacramento, CA',
      tech: 'Elena Rostova',
      date: '2026-10-24',
      timeWindow: '1 PM – 4 PM',
      region: 'Northern California (Sacramento)',
      tonnage: '4.0 Ton',
      status: 'Upcoming',
    },
    {
      id: 'JOB-103',
      customer: 'Robert Vance Jr.',
      customerAddress: '728 Granite Rd, Roseville, CA',
      tech: 'Marcus Vance',
      date: '2026-10-24',
      timeWindow: '7 AM – 10 AM',
      region: 'Northern California (Sacramento)',
      tonnage: '2.5 Ton',
      status: 'Completed',
    },
    {
      id: 'JOB-104',
      customer: 'Linda Zhao',
      customerAddress: '310 Marina Blvd, San Leandro, CA',
      tech: 'Darnell Washington',
      date: '2026-10-24',
      timeWindow: '4 PM – 7 PM',
      region: 'Bay Area (San Jose)',
      tonnage: '5.0 Ton',
      status: 'In Progress',
    },
    {
      id: 'JOB-108',
      customer: 'Marcus Thorne',
      customerAddress: '55 Creek Way, Folsom, CA',
      tech: 'Javier Gomez',
      date: '2026-10-24',
      timeWindow: '10 AM – 1 PM',
      region: 'Northern California (Sacramento)',
      tonnage: '3.0 Ton',
      status: 'Scheduled',
    },
    {
      id: 'JOB-109',
      customer: 'Claire Bennett',
      customerAddress: '912 Valley Pines, Chico, CA',
      tech: 'Elena Rostova',
      date: '2026-10-24',
      timeWindow: '7 PM – 10 PM',
      region: 'Central Valley (Fresno)',
      tonnage: '2.0 Ton',
      status: 'Scheduled',
    },
    {
      id: 'JOB-110',
      customer: 'Anthony Reyes',
      customerAddress: '18 Vine Ave, Santa Rosa, CA',
      tech: 'Darnell Washington',
      date: '2026-10-25',
      timeWindow: '10 AM – 1 PM',
      region: 'North Bay (Santa Rosa)',
      tonnage: '3.5 Ton',
      status: 'Scheduled',
    },
    {
      id: 'JOB-111',
      customer: 'Emily Watson',
      customerAddress: '400 Ridge Rd, Auburn, CA',
      tech: 'Marcus Vance',
      date: '2026-10-25',
      timeWindow: '1 PM – 4 PM',
      region: 'Sierra Foothills (Auburn)',
      tonnage: '4.0 Ton',
      status: 'Scheduled',
    },
  ]);

  // Dispatch Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Add / Edit Slot Modal State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotFormData, setSlotFormData] = useState({
    timeWindow: '',
    startTime: '08:00',
    endTime: '11:00',
    region: 'Northern California (Sacramento)',
    capacity: 200,
    status: 'Open',
  });

  // Reschedule Modal State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleJob, setRescheduleJob] = useState(null);
  const [targetDate, setTargetDate] = useState('2026-10-25');
  const [targetTimeWindow, setTargetTimeWindow] = useState('10 AM – 1 PM');

  // Job Details Modal
  const [selectedJob, setSelectedJob] = useState(null);

  // 4 Compact Numbers
  const totalSlots = slotsData.length;
  const totalBooked = useMemo(() => slotsData.reduce((acc, s) => acc + (s.bookedJobs || 0), 0), [slotsData]);
  const totalCapacity = useMemo(() => slotsData.reduce((acc, s) => acc + (s.capacity || 0), 0), [slotsData]);
  const totalAvailable = Math.max(0, totalCapacity - totalBooked);
  const fullSlotsCount = useMemo(
    () => slotsData.filter((s) => s.status === 'Full' || s.status === 'Almost Full').length,
    [slotsData]
  );

  // Handle Add/Edit Slot
  const handleOpenAddSlot = () => {
    setEditingSlot(null);
    setSlotFormData({
      timeWindow: '8 AM – 11 AM',
      startTime: '08:00',
      endTime: '11:00',
      region: 'Northern California (Sacramento)',
      capacity: 200,
      status: 'Open',
    });
    setIsSlotModalOpen(true);
  };

  const handleOpenEditSlot = (slot) => {
    setEditingSlot(slot);
    setSlotFormData({
      timeWindow: slot.timeWindow,
      startTime: slot.startTime || '08:00',
      endTime: slot.endTime || '11:00',
      region: slot.region,
      capacity: slot.capacity,
      status: slot.status,
    });
    setIsSlotModalOpen(true);
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!slotFormData.timeWindow.trim()) {
      addToast('Please specify a time window name', 'error');
      return;
    }

    if (editingSlot) {
      setSlotsData((prev) =>
        prev.map((s) =>
          s.id === editingSlot.id
            ? {
                ...s,
                ...slotFormData,
                capacity: Number(slotFormData.capacity),
              }
            : s
        )
      );
      addToast(`Time window ${slotFormData.timeWindow} updated`, 'success');
    } else {
      const newSlot = {
        id: `slot-${Date.now()}`,
        ...slotFormData,
        capacity: Number(slotFormData.capacity),
        bookedJobs: 0,
      };
      setSlotsData((prev) => [...prev, newSlot]);
      addToast(`New time window ${slotFormData.timeWindow} added`, 'success');
    }

    setIsSlotModalOpen(false);
  };

  const handleToggleSlotStatus = (slot) => {
    const newStatus = slot.status === 'Disabled' ? 'Open' : 'Disabled';
    if (newStatus === 'Disabled' && slot.bookedJobs > 0) {
      const confirm = window.confirm(
        `This slot currently has ${slot.bookedJobs} booked jobs. Are you sure you want to disable it?`
      );
      if (!confirm) return;
    }

    setSlotsData((prev) =>
      prev.map((s) => (s.id === slot.id ? { ...s, status: newStatus } : s))
    );
    addToast(`Slot ${slot.timeWindow} marked as ${newStatus}`, 'info');
  };

  const handleDeleteSlot = (slot) => {
    if (slot.bookedJobs > 0) {
      const confirm = window.confirm(
        `Warning: This slot has ${slot.bookedJobs} active booked job(s). Are you sure you want to remove it?`
      );
      if (!confirm) return;
    } else {
      if (!window.confirm(`Delete time slot window ${slot.timeWindow}?`)) return;
    }

    setSlotsData((prev) => prev.filter((s) => s.id !== slot.id));
    addToast(`Time window ${slot.timeWindow} deleted`, 'info');
  };

  // Reschedule Action
  const handleOpenReschedule = (job) => {
    setRescheduleJob(job);
    setTargetDate(job.date || '2026-10-25');
    setTargetTimeWindow(job.timeWindow || slotsData[0]?.timeWindow || '10 AM – 1 PM');
    setIsRescheduleOpen(true);
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleJob) return;

    setDispatchJobs((prev) =>
      prev.map((j) =>
        j.id === rescheduleJob.id
          ? {
              ...j,
              date: targetDate,
              timeWindow: targetTimeWindow,
              status: 'Scheduled',
            }
          : j
      )
    );

    setIsRescheduleOpen(false);
    addToast(`Job ${rescheduleJob.id} rescheduled to ${targetDate} (${targetTimeWindow})`, 'success');
  };

  const handleCancelJob = (jobId) => {
    if (window.confirm(`Are you sure you want to cancel dispatch ${jobId}?`)) {
      setDispatchJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'Cancelled' } : j))
      );
      addToast(`Job ${jobId} has been cancelled`, 'info');
    }
  };

  // Table 1: Time Slots Columns
  const slotColumns = [
    {
      key: 'timeWindow',
      label: 'Time Window',
      sortable: true,
      width: '20%',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#73784F] dark:text-[#A4A77E] flex-shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
            {val}
          </span>
        </div>
      ),
    },
    {
      key: 'region',
      label: 'Region / Hub',
      sortable: true,
      width: '25%',
      render: (val) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-800 dark:text-slate-200 text-xs truncate font-medium">
            {val}
          </span>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      width: '22%',
      render: (val, row) => {
        const pct = row.capacity > 0 ? Math.round((row.bookedJobs / row.capacity) * 100) : 0;
        return (
          <div className="space-y-1.5 max-w-[170px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-bold tabular-nums">
                {row.bookedJobs} / {val}
              </span>
              <span className="text-slate-500 tabular-nums">{pct}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  pct >= 90 ? 'bg-[#B4443C]' : pct >= 70 ? 'bg-[#C2B59B]' : 'bg-[#A4A77E]'
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'bookedJobs',
      label: 'Booked Jobs',
      sortable: true,
      width: '13%',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
          {val} jobs
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '10%',
      isStatus: true,
    },
  ];

  // Table 2: Dispatch Filtered Data
  const filteredDispatch = useMemo(() => {
    return dispatchJobs.filter((job) => {
      if (filterDate && job.date !== filterDate) return false;
      if (filterRegion !== 'all' && job.region !== filterRegion) return false;
      if (filterStatus !== 'all' && job.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
      return true;
    });
  }, [dispatchJobs, filterDate, filterRegion, filterStatus]);

  // Table 2: Dispatch Schedule Columns
  const dispatchColumns = [
    {
      key: 'id',
      label: 'Job ID',
      sortable: true,
      isMono: true,
      width: '11%',
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      width: '19%',
      render: (val, row) => (
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 dark:text-white truncate text-xs">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
            {row.customerAddress}
          </div>
        </div>
      ),
    },
    {
      key: 'tech',
      label: 'Technician',
      sortable: true,
      width: '15%',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-800 dark:text-slate-200 text-xs truncate font-medium">
            {val}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      width: '11%',
      render: (val) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'timeWindow',
      label: 'Time Window',
      sortable: true,
      width: '14%',
      render: (val) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block">
          {val}
        </span>
      ),
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      width: '12%',
      render: (val) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate block">
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '10%',
      isStatus: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Scheduling & Time Slots"
        subtitle="Manage 8 designated service windows, regional hub capacity, and technician dispatches."
        actions={
          <button
            onClick={handleOpenAddSlot}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
          >
            <span>Add Time Slot</span>
          </button>
        }
      />

      {/* Summary Row of 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <KpiCard
          title="Total Time Slots"
          value={totalSlots}
          subtext="Designated 3-hr service windows"
          icon={Clock}
          trend="8 Windows"
          trendType="neutral"
        />

        <KpiCard
          title="Booked Jobs"
          value={totalBooked}
          subtext={`${totalCapacity} slots total capacity`}
          icon={CalendarIcon}
          trend={`${totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}% Booked`}
          trendType="positive"
          progress={totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}
        />

        <KpiCard
          title="Available Capacity"
          value={totalAvailable}
          subtext="Open booking capacity across hubs"
          icon={Layers}
          trend={`${totalAvailable} Open`}
          trendType="neutral"
        />

        <KpiCard
          title="Full Slots"
          value={fullSlotsCount}
          subtext={fullSlotsCount > 0 ? "Requires capacity rebalance" : "All windows within capacity"}
          icon={fullSlotsCount > 0 ? Ban : Check}
          trend={fullSlotsCount > 0 ? `${fullSlotsCount} Full` : "Optimal"}
          trendType={fullSlotsCount > 0 ? "alert" : "positive"}
        />
      </div>

      {/* Premium Segmented Tabs */}
      <div className="p-1.5 bg-slate-200/70 dark:bg-[#181B1F] border border-slate-300/60 dark:border-white/10 rounded-2xl inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full shadow-inner backdrop-blur-md">
        <button
          onClick={() => setActiveTab('time-slots')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'time-slots'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <Clock
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'time-slots'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Time Slots</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'time-slots'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {slotsData.length} Windows
          </span>
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'dispatch'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <Truck
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'dispatch'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Dispatch Schedule</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'dispatch'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {dispatchJobs.length} Jobs
          </span>
        </button>
      </div>

      {/* TAB 1: Time Slots Table */}
      {activeTab === 'time-slots' && (
        <DataTable
          columns={slotColumns}
          data={slotsData}
          searchPlaceholder="Search time window or regional hub..."
          rowActions={(row) => [
            {
              label: 'Edit Time Slot',
              icon: Edit,
              onClick: () => handleOpenEditSlot(row),
            },
            {
              label: row.status === 'Disabled' ? 'Enable Slot' : 'Disable Slot',
              icon: Ban,
              onClick: () => handleToggleSlotStatus(row),
            },
            { divider: true },
            {
              label: 'Delete Slot',
              icon: Trash2,
              variant: 'danger',
              onClick: () => handleDeleteSlot(row),
            },
          ]}
        />
      )}

      {/* TAB 2: Dispatch Schedule Table */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          {/* Dispatch Filters Toolbar */}
          <div className="flex items-center gap-3 flex-wrap p-4 rounded-[20px] bg-white dark:bg-[#1A1D21] border border-white/80 dark:border-white/10 shadow-water text-xs">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-800 dark:text-slate-200"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="text-[11px] text-slate-400 hover:text-slate-700 font-mono"
                >
                  Clear Date
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Region:</span>
              <CustomSelect
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                size="sm"
                minWidth={170}
              >
                <option value="all">All Regions</option>
                {REGION_NAMES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </CustomSelect>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Status:</span>
              <CustomSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="sm"
                minWidth={140}
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </CustomSelect>
            </div>
          </div>

          <DataTable
            columns={dispatchColumns}
            data={filteredDispatch}
            searchPlaceholder="Search customer, technician, address, or Job ID..."
            rowActions={(row) => [
              {
                label: 'View Details',
                icon: Eye,
                onClick: () => setSelectedJob(row),
              },
              {
                label: 'Reschedule',
                icon: CalendarIcon,
                onClick: () => handleOpenReschedule(row),
              },
              { divider: true },
              {
                label: 'Cancel Dispatch',
                icon: Trash2,
                variant: 'danger',
                onClick: () => handleCancelJob(row.id),
              },
            ]}
          />
        </div>
      )}

      {/* Slide-In Panel 1: Add / Edit Time Slot Window */}
      <SlideOverPanel
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title={editingSlot ? 'Edit Time Slot Window' : 'Add New Service Window'}
        subtitle="Set installation window hours, target regional hub, and technician quotas."
        icon={Clock}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsSlotModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="slot-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Slot
            </button>
          </div>
        }
      >
        <form id="slot-form" onSubmit={handleSaveSlot} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Time Window Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 7 AM – 10 AM"
              value={slotFormData.timeWindow}
              onChange={(e) => setSlotFormData({ ...slotFormData, timeWindow: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={slotFormData.startTime}
                onChange={(e) => setSlotFormData({ ...slotFormData, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={slotFormData.endTime}
                onChange={(e) => setSlotFormData({ ...slotFormData, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Geographic Region / Hub
            </label>
            <CustomSelect
              value={slotFormData.region}
              onChange={(e) => setSlotFormData({ ...slotFormData, region: e.target.value })}
              className="w-full"
              size="lg"
            >
              {REGION_NAMES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </CustomSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Job Capacity
              </label>
              <input
                type="number"
                min="1"
                value={slotFormData.capacity}
                onChange={(e) => setSlotFormData({ ...slotFormData, capacity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <CustomSelect
                value={slotFormData.status}
                onChange={(e) => setSlotFormData({ ...slotFormData, status: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Open">Open</option>
                <option value="Almost Full">Almost Full</option>
                <option value="Full">Full</option>
                <option value="Disabled">Disabled</option>
              </CustomSelect>
            </div>
          </div>
        </form>
      </SlideOverPanel>

      {/* Slide-In Panel 2: Reschedule Job Panel */}
      <SlideOverPanel
        isOpen={isRescheduleOpen && !!rescheduleJob}
        onClose={() => setIsRescheduleOpen(false)}
        title={rescheduleJob ? `Reschedule Job #${rescheduleJob.id}` : ''}
        subtitle={rescheduleJob ? `Customer: ${rescheduleJob.customer} · Technician: ${rescheduleJob.tech}` : ''}
        icon={RotateCcw}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsRescheduleOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="reschedule-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Confirm Reschedule
            </button>
          </div>
        }
      >
        {rescheduleJob && (
          <form id="reschedule-form" onSubmit={handleSaveReschedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Installation Date *
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New 3-Hour Service Window *
              </label>
              <CustomSelect
                value={targetTimeWindow}
                onChange={(e) => setTargetTimeWindow(e.target.value)}
                className="w-full font-semibold"
                size="lg"
              >
                {slotsData
                  .filter((s) => s.status !== 'Disabled')
                  .map((s) => (
                    <option key={s.id} value={s.timeWindow}>
                      {s.timeWindow} — {s.region} ({s.status})
                    </option>
                  ))}
              </CustomSelect>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#22262C] border border-slate-200 dark:border-[#383E47] space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">
                Installation Details:
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Address: {rescheduleJob.customerAddress}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                System: {rescheduleJob.tonnage} HVAC Unit
              </p>
            </div>
          </form>
        )}
      </SlideOverPanel>

      {/* Slide-In Panel 3: View Job Details Panel */}
      <SlideOverPanel
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Job Dispatch ${selectedJob.id}` : ''}
        subtitle={selectedJob ? `${selectedJob.customer} · ${selectedJob.tonnage}` : ''}
        idChip={selectedJob?.timeWindow}
        icon={CalendarIcon}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => {
                const job = selectedJob;
                setSelectedJob(null);
                handleOpenReschedule(job);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#2B3037] text-slate-700 dark:text-slate-200"
            >
              Reschedule Job
            </button>
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="px-4 py-2 rounded-xl clean-pill-active text-xs font-semibold"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedJob && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
              <div>
                <span className="text-slate-400 block text-[11px]">Date & Time</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedJob.date} · {selectedJob.timeWindow}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <StatusPill status={selectedJob.status} size="xs" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Technician</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedJob.tech}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Regional Hub</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedJob.region}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47]">
              <span className="text-slate-400 block text-[11px] mb-0.5">Service Address</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {selectedJob.customerAddress}
              </span>
            </div>
          </div>
        )}
      </SlideOverPanel>
    </div>
  );
};
