import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Mail,
  RefreshCw,
  Edit,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  User,
  CheckCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { Timeline } from '../../components/common/Timeline';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const ReservationsPage = () => {
  const { addToast } = useApp();
  const [reservations, setReservations] = useState(() => MockService.getReservations());
  const [selectedRes, setSelectedRes] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    productionStage: 'all',
    tonnage: 'all',
    feeStatus: 'all',
  });

  // Reassign Batch Modal
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [newBatchNumber, setNewBatchNumber] = useState('');

  // Create Batch Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    region: 'Northern California Regional Hub',
    tonnage: '3.0 Ton',
    configuration: 'Upflow Configuration',
    frontPanelColor: '#373A3C',
    frontPanelColorName: 'Dark Gray (Default)',
    installationDate: '2026-11-20',
    installationTimeSlot: '10 AM – 1 PM',
  });

  // Edit Reservation Mode in SlideOverPanel
  const [isEditingRes, setIsEditingRes] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Table Columns with clean non-wrapping formatting (Configuration & Panel Color in Slide-Over Panel)
  const columns = [
    {
      key: 'batchNumber',
      label: 'Batch #',
      sortable: true,
      width: '14%',
      isMono: true,
      render: (val, row) => (
        <div className="truncate">
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block truncate">
            {val}
          </span>
          <span className="font-mono text-[10px] text-[#6D6E71] dark:text-[#8D8E92] block mt-0.5 truncate">
            {row.id}
          </span>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      width: '20%',
      render: (val, row) => (
        <div className="truncate">
          <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5 truncate">
            {row.customerEmail}
          </div>
        </div>
      )
    },
    {
      key: 'tonnage',
      label: 'Tonnage',
      sortable: true,
      width: '9%',
      render: (val) => (
        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          {val}
        </span>
      )
    },
    {
      key: 'reservationFee',
      label: 'Deposit ($200)',
      sortable: true,
      width: '13%',
      render: (val, row) => (
        <div className="font-mono text-xs truncate">
          <span className="font-bold text-slate-900 dark:text-white">${val}</span>
          <span className={`ml-1.5 text-[10px] font-bold ${row.feeStatus === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
            {row.feeStatus}
          </span>
        </div>
      )
    },
    {
      key: 'productionProgressPercent',
      label: 'Production Stage',
      sortable: true,
      width: '16%',
      render: (val, row) => (
        <div className="w-full max-w-[160px]">
          <div className="flex items-center justify-between text-[10.5px] font-sans text-[#6D6E71] mb-1">
            <span className="truncate">{row.productionStage}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{val}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#868962] to-[#A4A77E] h-1.5 rounded-full"
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'estimatedFulfillment',
      label: 'Est. Fulfillment',
      sortable: true,
      width: '12%',
      hideBelowXl: true,
      render: (val) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate block">
          {val}
        </span>
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
      key: 'productionStage',
      label: 'All Production Stages',
      options: [
        { label: 'Reservation', value: 'Reservation' },
        { label: 'Assembly & Pre-Calibration', value: 'Assembly' },
        { label: 'Quality Check', value: 'Quality' },
        { label: 'Ready', value: 'Ready' },
        { label: 'Installed', value: 'Installed' },
      ]
    },
    {
      key: 'tonnage',
      label: 'All Tonnages',
      options: [
        { label: '2.0 Ton', value: '2.0' },
        { label: '2.5 Ton', value: '2.5' },
        { label: '3.0 Ton', value: '3.0' },
        { label: '4.0 Ton', value: '4.0' },
        { label: '5.0 Ton', value: '5.0' },
      ]
    },
    {
      key: 'feeStatus',
      label: 'All Fee Statuses',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Refunded', value: 'Refunded' },
      ]
    }
  ];

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResendEmail = () => {
    if (!selectedRes) return;
    addToast(`Confirmation and fulfillment timeline email dispatched to ${selectedRes.customerEmail}`, 'success');
  };

  const handleOpenEdit = () => {
    setEditForm({
      customerName: selectedRes.customerName,
      customerEmail: selectedRes.customerEmail,
      customerPhone: selectedRes.customerPhone,
      address: selectedRes.address,
      tonnage: selectedRes.tonnage,
      configuration: selectedRes.configuration,
      frontPanelColor: selectedRes.frontPanelColor,
      frontPanelColorName: selectedRes.frontPanelColorName,
      productionStage: selectedRes.productionStage,
      productionProgressPercent: selectedRes.productionProgressPercent,
      status: selectedRes.status,
      estimatedFulfillment: selectedRes.estimatedFulfillment,
      installationDate: selectedRes.installationDate,
      installationTimeSlot: selectedRes.installationTimeSlot,
    });
    setIsEditingRes(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRes || !editForm) return;

    MockService.updateReservation(selectedRes.id, editForm);
    const updatedList = MockService.getReservations();
    setReservations(updatedList);
    setSelectedRes(prev => ({ ...prev, ...editForm }));
    setIsEditingRes(false);
    addToast(`Reservation ${selectedRes.id} successfully updated!`, 'success');
  };

  const handleDeleteReservation = (id) => {
    if (!window.confirm(`Are you sure you want to cancel and remove reservation ${id}?`)) return;

    MockService.deleteReservation(id);
    setReservations(MockService.getReservations());
    setSelectedRes(null);
    setIsEditingRes(false);
    addToast(`Reservation ${id} removed from production ledger.`, 'error');
  };

  const handleCreateBatchSubmit = (e) => {
    e.preventDefault();
    if (!newBatchForm.customerName.trim()) return;

    const created = MockService.createReservation(newBatchForm);
    setReservations(MockService.getReservations());
    setCreateModalOpen(false);
    setNewBatchForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      region: 'Northern California Regional Hub',
      tonnage: '3.0 Ton',
      configuration: 'Upflow Configuration',
      frontPanelColor: '#373A3C',
      frontPanelColorName: 'Dark Gray (Default)',
      installationDate: '2026-11-20',
      installationTimeSlot: '10 AM – 1 PM',
    });
    addToast(`Production Batch ${created.batchNumber} created successfully!`, 'success');
  };

  const handleReassignBatchSubmit = (e) => {
    e.preventDefault();
    if (!newBatchNumber.trim() || !selectedRes) return;

    MockService.updateReservation(selectedRes.id, {
      batchNumber: newBatchNumber.trim(),
    });

    const updated = MockService.getReservations();
    setReservations(updated);
    setSelectedRes(prev => ({ ...prev, batchNumber: newBatchNumber.trim() }));
    setReassignModalOpen(false);
    setNewBatchNumber('');
    addToast(`Successfully reassigned reservation to ${newBatchNumber.trim()}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Reservations"
        subtitle="Manage customer system configurations, batch allocations, and deposit fulfillment timelines."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Create Production Batch</span>
            </button>
            <button
              onClick={() => {
                setReservations(MockService.getReservations());
                addToast('Reservations synchronized with manufacturing queue', 'info');
              }}
              className="p-2.5 rounded-xl water-pill text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Main Table with Filters & Search (Spans Full Width Fluidly) */}
      <DataTable
        columns={columns}
        data={reservations}
        onRowClick={(row) => {
          setSelectedRes(row);
          setIsEditingRes(false);
        }}
        searchPlaceholder="Search by Batch #, customer, email, address..."
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => {
              setSelectedRes(row);
              setIsEditingRes(false);
            },
          },
          {
            label: 'Edit Details',
            icon: Edit,
            onClick: () => {
              setSelectedRes(row);
              setEditForm({ ...row });
              setIsEditingRes(true);
            },
          },
          { divider: true },
          {
            label: 'Delete',
            icon: Trash2,
            variant: 'danger',
            onClick: () => handleDeleteReservation(row.id),
            confirmMessage: `Are you sure you want to delete reservation ${row.batchNumber || row.id}?`,
          },
        ]}
      />

      {/* Slide-In Details Panel */}
      <SlideOverPanel
        isOpen={!!selectedRes}
        onClose={() => {
          setSelectedRes(null);
          setIsEditingRes(false);
        }}
        title={selectedRes ? `Batch: ${selectedRes.batchNumber}` : ''}
        subtitle={selectedRes ? `System Reservation · ${selectedRes.customerName}` : ''}
        idChip={selectedRes?.id}
        icon={Layers}
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            {!isEditingRes ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">
                    Fulfillment: {selectedRes?.estimatedFulfillment}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteReservation(selectedRes.id)}
                    className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline font-semibold"
                  >
                    Delete Reservation
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    className="px-3.5 py-2 rounded-xl water-pill text-xs font-semibold text-[#555D50] dark:text-[#BFC399] hover:bg-[#A4A77E]/10"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewBatchNumber(`NT-BATCH-2026-${Math.floor(100 + Math.random() * 900)}`);
                      setReassignModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Reassign Batch
                  </button>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Resend Email</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-mono text-amber-600 font-semibold">Editing Reservation Mode</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingRes(false)}
                    className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-5 py-2 rounded-xl bg-[#A4A77E] text-[#121417] text-xs font-bold font-mono shadow-sm hover:brightness-105"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        }
      >
        {selectedRes && !isEditingRes && (
          <div className="space-y-6">
            {/* Key Figures Banner */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl water-card">
                <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Deposit Fee</div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  ${selectedRes.reservationFee}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">{selectedRes.feeStatus}</span>
              </div>
              <div className="p-3.5 rounded-xl water-card">
                <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Est. Fulfillment</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {selectedRes.estimatedFulfillment}
                </div>
                <span className="text-[10px] text-[#6D6E71]">Pre-Cal Target</span>
              </div>
              <div className="p-3.5 rounded-xl water-card">
                <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Installation</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {selectedRes.installationDate}
                </div>
                <span className="text-[10px] text-[#73784F] dark:text-[#A4A77E] font-mono">{selectedRes.installationTimeSlot}</span>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="p-4 rounded-xl water-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#6D6E71] font-bold">
                  Customer Profile
                </span>
                <span className="font-mono text-[10px] text-[#A4A77E] font-bold">{selectedRes.region}</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedRes.customerName}
              </div>
              <div className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                {selectedRes.address}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-700 dark:text-slate-300">
                <span>Phone: {selectedRes.customerPhone}</span>
                <span>•</span>
                <span>Email: {selectedRes.customerEmail}</span>
              </div>
            </div>

            {/* System Specs Card (Orientation & Panel Color) */}
            <div className="p-4.5 rounded-2xl water-card border border-[#CCD4BE]/70 dark:border-[#384435] bg-gradient-to-br from-[#F8FAF6] to-[#EFF4EB] dark:from-[#1E251E] dark:to-[#171D17] space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  System Configuration & Panel Spectrum
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417] font-bold">
                  {selectedRes.tonnage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-[#22262C] border border-white/80 dark:border-[#383E47] shadow-sm">
                  <span className="text-[10.5px] font-mono uppercase text-[#6D6E71] block mb-0.5">Airflow Orientation</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedRes.configuration}</div>
                  <span className="text-[10px] text-slate-500 block mt-1">24" clearance • 2'x6' framing</span>
                </div>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-[#22262C] border border-white/80 dark:border-[#383E47] shadow-sm">
                  <span className="text-[10.5px] font-mono uppercase text-[#6D6E71] block mb-0.5">Architectural Panel Color</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-5 h-5 rounded-md border border-black/15 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: selectedRes.frontPanelColor }}
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white leading-tight">{selectedRes.frontPanelColorName}</div>
                      <span className="font-mono text-[9.5px] text-[#6D6E71]">{selectedRes.frontPanelColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Contractor */}
            <div className="p-3.5 rounded-xl water-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  Assigned Certified Technician
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRes.assignedContractorName || 'Pending Contractor Assignment'}
                </p>
                <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                  {selectedRes.assignedContractorCompany}
                </p>
              </div>
            </div>

            {/* 4 Compartments & RFID Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  4 Modular Compartments
                </h4>
                <span className="text-[10.5px] font-mono text-[#A4A77E]">RFID Validated</span>
              </div>

              <div className="space-y-2">
                {(selectedRes.compartments || []).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl water-card flex items-center justify-between text-xs shadow-sm"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {comp.name}
                      </div>
                      <div className="font-mono text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
                        Tag: {comp.rfidTag}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                        {comp.health}%
                      </span>
                      <StatusPill status={comp.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-3">
                Order & Assembly Lifecycle
              </h4>
              <Timeline steps={selectedRes.timeline} />
            </div>
          </div>
        )}

        {/* Edit Form Mode */}
        {selectedRes && isEditingRes && editForm && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Customer Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.customerName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.customerEmail}
                    onChange={(e) => setEditForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={editForm.customerPhone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Jobsite Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">System Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tonnage Tier</label>
                  <CustomSelect
                    value={editForm.tonnage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tonnage: e.target.value }))}
                    className="w-full"
                    size="md"
                  >
                    <option value="2.0 Ton">2.0 Ton (900 – 1,200 sq ft)</option>
                    <option value="2.5 Ton">2.5 Ton (1,200 – 1,500 sq ft)</option>
                    <option value="3.0 Ton">3.0 Ton (1,500 – 1,900 sq ft)</option>
                    <option value="4.0 Ton">4.0 Ton (1,900 – 2,500 sq ft)</option>
                    <option value="5.0 Ton">5.0 Ton (2,500 – 3,200 sq ft)</option>
                  </CustomSelect>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Airflow Orientation</label>
                  <CustomSelect
                    value={editForm.configuration}
                    onChange={(e) => setEditForm(prev => ({ ...prev, configuration: e.target.value }))}
                    className="w-full"
                    size="md"
                  >
                    <option value="Upflow Configuration">Upflow Configuration</option>
                    <option value="Downflow Configuration">Downflow Configuration</option>
                    <option value="Horizontal Configuration">Horizontal Configuration</option>
                  </CustomSelect>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Front Panel Color</label>
                <CustomSelect
                  value={editForm.frontPanelColorName}
                  onChange={(e) => {
                    const colorMap = {
                      'Dark Gray (Default)': '#373A3C',
                      'Light Military Green': '#B0B49B',
                      'Army Tan': '#C2B59B',
                      'NATO Green': '#465B43',
                      'RAF Blue/Grey': '#5D6D7E',
                      'Desert Sand': '#C8B89A',
                    };
                    setEditForm(prev => ({
                      ...prev,
                      frontPanelColorName: e.target.value,
                      frontPanelColor: colorMap[e.target.value] || '#373A3C'
                    }));
                  }}
                  className="w-full"
                  size="md"
                >
                  <option value="Dark Gray (Default)">Dark Gray (Default) #373A3C</option>
                  <option value="Light Military Green">Light Military Green #B0B49B</option>
                  <option value="Army Tan">Army Tan #C2B59B</option>
                  <option value="NATO Green">NATO Green #465B43</option>
                  <option value="RAF Blue/Grey">RAF Blue/Grey #5D6D7E</option>
                  <option value="Desert Sand">Desert Sand #C8B89A</option>
                </CustomSelect>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Production & Dispatch</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Production Stage</label>
                  <CustomSelect
                    value={editForm.productionStage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, productionStage: e.target.value }))}
                    className="w-full"
                    size="md"
                  >
                    <option value="Reservation">Reservation</option>
                    <option value="Assembly & Pre-Calibration">Assembly & Pre-Calibration</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Ready">Ready</option>
                    <option value="Installed">Installed</option>
                  </CustomSelect>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Status Pill</label>
                  <CustomSelect
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full"
                    size="md"
                  >
                    <option value="In Production">In Production</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Deposit">Pending Deposit</option>
                    <option value="On Hold">On Hold</option>
                  </CustomSelect>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Installation Date</label>
                  <input
                    type="date"
                    value={editForm.installationDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, installationDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot Window</label>
                  <CustomSelect
                    value={editForm.installationTimeSlot}
                    onChange={(e) => setEditForm(prev => ({ ...prev, installationTimeSlot: e.target.value }))}
                    className="w-full font-mono"
                    size="md"
                  >
                    <option value="7 AM – 10 AM">7 AM – 10 AM</option>
                    <option value="10 AM – 1 PM">10 AM – 1 PM</option>
                    <option value="1 PM – 4 PM">1 PM – 4 PM</option>
                    <option value="4 PM – 7 PM">4 PM – 7 PM</option>
                    <option value="7 PM – 10 PM">7 PM – 10 PM</option>
                  </CustomSelect>
                </div>
              </div>
            </div>
          </form>
        )}
      </SlideOverPanel>

      {/* Reassign Batch Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-sm p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono mb-2">
              Reassign Production Batch
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mb-4">
              Enter the new production batch number for reservation <span className="font-mono font-bold">{selectedRes?.id}</span>.
            </p>

            <form onSubmit={handleReassignBatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Batch Number
                </label>
                <input
                  type="text"
                  required
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Production Batch SlideOverPanel */}
      <SlideOverPanel
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Production Batch & Reservation"
        subtitle="Locks chassis assembly line quota and logs $200 deposit fee."
        idChip="$200 DEPOSIT"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-batch-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
            >
              Create Batch & Lock Deposit
            </button>
          </>
        }
      >
        <form id="create-batch-form" onSubmit={handleCreateBatchSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jessica Palmer"
                value={newBatchForm.customerName}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="j.palmer@example.com"
                value={newBatchForm.customerEmail}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="(555) 789-0123"
                value={newBatchForm.customerPhone}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jobsite Street Address
              </label>
              <input
                type="text"
                placeholder="1204 Oak Ridge Dr, Roseville CA"
                value={newBatchForm.address}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tonnage Capacity
              </label>
              <CustomSelect
                value={newBatchForm.tonnage}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, tonnage: e.target.value }))}
                className="w-full"
                size="md"
              >
                <option value="2.0 Ton">2.0 Ton (900 – 1,200 sq ft)</option>
                <option value="2.5 Ton">2.5 Ton (1,200 – 1,500 sq ft)</option>
                <option value="3.0 Ton">3.0 Ton (1,500 – 1,900 sq ft - Popular)</option>
                <option value="4.0 Ton">4.0 Ton (1,900 – 2,500 sq ft)</option>
                <option value="5.0 Ton">5.0 Ton (2,500 – 3,200 sq ft)</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Airflow Configuration
              </label>
              <CustomSelect
                value={newBatchForm.configuration}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, configuration: e.target.value }))}
                className="w-full"
                size="md"
              >
                <option value="Upflow Configuration">Upflow Configuration</option>
                <option value="Downflow Configuration">Downflow Configuration</option>
                <option value="Horizontal Configuration">Horizontal Configuration</option>
              </CustomSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Front Panel Architectural Color
              </label>
              <CustomSelect
                value={newBatchForm.frontPanelColorName}
                onChange={(e) => {
                  const colorMap = {
                    'Dark Gray (Default)': '#373A3C',
                    'Light Military Green': '#B0B49B',
                    'Army Tan': '#C2B59B',
                    'NATO Green': '#465B43',
                    'RAF Blue/Grey': '#5D6D7E',
                    'Desert Sand': '#C8B89A',
                  };
                  setNewBatchForm(prev => ({
                    ...prev,
                    frontPanelColorName: e.target.value,
                    frontPanelColor: colorMap[e.target.value] || '#373A3C'
                  }));
                }}
                className="w-full"
                size="md"
              >
                <option value="Dark Gray (Default)">Dark Gray (Default)</option>
                <option value="Light Military Green">Light Military Green</option>
                <option value="Army Tan">Army Tan</option>
                <option value="NATO Green">NATO Green</option>
                <option value="RAF Blue/Grey">RAF Blue/Grey</option>
                <option value="Desert Sand">Desert Sand</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Installation Window
              </label>
              <CustomSelect
                value={newBatchForm.installationTimeSlot}
                onChange={(e) => setNewBatchForm(prev => ({ ...prev, installationTimeSlot: e.target.value }))}
                className="w-full font-mono"
                size="md"
              >
                <option value="7 AM – 10 AM">7 AM – 10 AM</option>
                <option value="10 AM – 1 PM">10 AM – 1 PM</option>
                <option value="1 PM – 4 PM">1 PM – 4 PM</option>
                <option value="4 PM – 7 PM">4 PM – 7 PM</option>
                <option value="7 PM – 10 PM">7 PM – 10 PM</option>
              </CustomSelect>
            </div>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
