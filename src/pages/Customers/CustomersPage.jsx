import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Plus,
  Send,
  MessageSquare,
  History,
  ShieldCheck,
  UserX,
  Edit,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  Wrench,
  Layers,
  Box,
  ClipboardCheck,
  ExternalLink,
  ChevronRight,
  Shield,
  FileText,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const CustomersPage = () => {
  const { addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState(() => MockService.getCustomers());
  const [selectedCust, setSelectedCust] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'profile'
  const [profileTab, setProfileTab] = useState('overview'); // 'overview' | 'specs' | 'batch' | 'dispatch' | 'billing' | 'notes'
  const [copiedId, setCopiedId] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Deep linking to specific customer profile via query params
  useEffect(() => {
    const custId = searchParams.get('id') || searchParams.get('profile');
    if (custId) {
      const match = customers.find((c) => c.id === custId);
      if (match) {
        setSelectedCust(match);
        setViewMode('profile');
        setProfileTab('overview');
      }
    }
  }, [searchParams, customers]);

  // Add Customer Drawer State
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Sacramento',
    state: 'CA',
    zip: '95814',
    tonnage: '3.0 Ton',
    configuration: 'Upflow Configuration',
    panelColor: '#373A3C',
    panelColorName: 'Dark Gray (Default)',
    assignedContractor: 'Marcus Vance, Vance Mechanical Services',
  });

  // Edit Customer Drawer State
  const [isEditingCust, setIsEditingCust] = useState(false);
  const [custEditForm, setCustEditForm] = useState(null);

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      width: '24%',
      render: (val, row) => (
        <div className="truncate">
          <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      width: '13%',
      hideBelowXl: true,
      render: (val) => (
        <span className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
          {val}
        </span>
      )
    },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      width: '15%',
      render: (val, row) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate block">
          {val}, {row.state}
        </span>
      )
    },
    {
      key: 'batchNumber',
      label: 'Batch #',
      sortable: true,
      isMono: true,
      width: '13%',
    },
    {
      key: 'tonnage',
      label: 'System Spec',
      width: '14%',
      render: (val, row) => (
        <div className="text-xs truncate">
          <span className="font-semibold text-slate-900 dark:text-white">{val}</span> • {row.configuration.split(' ')[0]}
        </div>
      )
    },
    {
      key: 'installStatus',
      label: 'Status',
      sortable: true,
      width: '12%',
      isStatus: true,
    }
  ];

  const handleOpenCustEdit = (cust) => {
    setSelectedCust(cust);
    setCustEditForm({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      city: cust.city,
      state: cust.state,
      zip: cust.zip,
      tonnage: cust.tonnage,
      configuration: cust.configuration,
      assignedContractor: cust.assignedContractor,
      installStatus: cust.installStatus,
    });
    setIsEditingCust(true);
  };

  const handleSaveCustEdit = (e) => {
    e.preventDefault();
    if (!selectedCust || !custEditForm) return;

    MockService.updateCustomer(selectedCust.id, custEditForm);
    const updated = MockService.getCustomers();
    setCustomers(updated);
    setSelectedCust(prev => ({ ...prev, ...custEditForm }));
    setIsEditingCust(false);
    addToast(`Customer ${selectedCust.name} profile updated!`, 'success');
  };

  const handleDeleteCustomer = (id) => {
    if (!window.confirm(`Are you sure you want to remove customer ${id}?`)) return;

    MockService.deleteCustomer(id);
    const updated = MockService.getCustomers();
    setCustomers(updated);
    if (selectedCust?.id === id) {
      setSelectedCust(null);
      setIsEditingCust(false);
      setViewMode('list');
    }
    addToast(`Customer record removed`, 'error');
  };

  const handleToggleDeactivate = (cust) => {
    const newStatus = cust.installStatus === 'Deactivated' ? 'In Production' : 'Deactivated';
    MockService.updateCustomer(cust.id, { installStatus: newStatus });
    const updated = MockService.getCustomers();
    setCustomers(updated);
    if (selectedCust?.id === cust.id) {
      setSelectedCust(prev => ({ ...prev, installStatus: newStatus }));
    }
    addToast(`Jobsite profile marked as ${newStatus}`, 'info');
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustForm.name.trim() || !newCustForm.email.trim()) return;

    const created = MockService.createCustomer(newCustForm);
    setCustomers(MockService.getCustomers());
    setIsAddCustModalOpen(false);
    setNewCustForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: 'Sacramento',
      state: 'CA',
      zip: '95814',
      tonnage: '3.0 Ton',
      configuration: 'Upflow Configuration',
      panelColor: '#373A3C',
      panelColorName: 'Dark Gray (Default)',
      assignedContractor: 'Marcus Vance, Vance Mechanical Services',
    });
    addToast(`Customer account for ${created.name} created!`, 'success');
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedCust) return;

    MockService.addCustomerNote(selectedCust.id, newNote.trim(), 'Operations Support');
    setCustomers(MockService.getCustomers());
    setSelectedCust(prev => ({
      ...prev,
      notes: [{ date: new Date().toISOString().split('T')[0], author: 'Operations Support', text: newNote.trim() }, ...(prev.notes || [])]
    }));
    setNewNote('');
    addToast('Note appended to customer activity log', 'success');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    addToast(`Copied ID to clipboard: ${text}`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name.slice(0, 2) || 'CU').toUpperCase();
  };

  // ==========================================
  // VIEW MODE: BEAUTY OASIS STYLE PROFILE VIEW
  // ==========================================
  if (viewMode === 'profile' && selectedCust) {
    const initials = getInitials(selectedCust.name);

    return (
      <div className="space-y-6 animate-fade-in w-full">
        {/* Top Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewMode('list');
                setSelectedCust(null);
                setProfileTab('overview');
                setSearchParams({});
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#252A30] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Customers</span>
            </button>
            <div className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92] hidden md:flex items-center gap-1.5">
              <span>Dashboard</span>
              <span>/</span>
              <span>Customers</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold">{selectedCust.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const refreshed = MockService.getCustomers().find(c => c.id === selectedCust.id);
                if (refreshed) setSelectedCust(refreshed);
                addToast('Customer profile synchronized', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252A30] transition-colors"
              title="Sync Customer Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>

            <button
              onClick={() => handleToggleDeactivate(selectedCust)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
            >
              <UserX className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedCust.installStatus === 'Deactivated' ? 'Reactivate' : 'Deactivate Jobsite'}</span>
            </button>

            <button
              onClick={() => handleOpenCustEdit(selectedCust)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Hero Header Card (Matching BeautyOasisRx layout) */}
        <div className="water-card rounded-2xl p-6 sm:p-7 border border-white/80 dark:border-white/10 shadow-water relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#2E6B47] to-[#1E251E] text-white flex items-center justify-center font-bold text-2xl tracking-wider shadow-md flex-shrink-0 border-2 border-white/20">
                {initials}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedCust.name}
                  </h2>
                  <StatusPill status={selectedCust.installStatus} size="sm" />
                  <span className="font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                    Role: Residential Jobsite
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92] flex-wrap">
                  <span>ID: {selectedCust.id}</span>
                  <button
                    onClick={() => copyToClipboard(selectedCust.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Copy Customer ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span>•</span>
                  <span>Batch: <strong className="text-slate-800 dark:text-slate-200">{selectedCust.batchNumber}</strong></span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#A4A77E]" />
                    <span>{selectedCust.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#A4A77E]" />
                    <span>{selectedCust.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 3 Metric Counters (Matching BeautyOasisRx layout) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-auto w-full pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#2B3037]">
              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[100px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  TOTAL DEPOSIT
                </span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  $200.00
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[100px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  BATCH ID
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono mt-1 block truncate">
                  {selectedCust.batchNumber.split('-').pop()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[100px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  SYSTEM SPEC
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#4E5637] dark:text-[#C5CAB0] font-mono mt-1 block truncate">
                  {selectedCust.tonnage.split(' ')[0]} Ton
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation Bar (Matching BeautyOasisRx) */}
        {/* Premium Segmented Sub-Tabs Navigation Bar */}
        <div className="p-1.5 bg-slate-200/70 dark:bg-[#181B1F] border border-slate-300/60 dark:border-white/10 rounded-2xl inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full shadow-inner backdrop-blur-md">
          {[
            { id: 'overview', title: 'Overview', icon: Eye },
            { id: 'specs', title: 'HVAC System & Telemetry', icon: Layers },
            { id: 'batch', title: 'Production Batch Flow', badge: '1 Batch', icon: Box },
            { id: 'dispatch', title: 'Installation & Dispatch', badge: '1 Job', icon: Truck },
            { id: 'billing', title: 'Billing & Deposits', badge: '$200 Paid', icon: DollarSign },
            { id: 'notes', title: 'Staff Activity Log', badge: `${selectedCust.notes?.length || 0}`, icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = profileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive
                      ? 'text-slate-900 dark:text-[#A4A77E]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="font-sans">{tab.title}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                        : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW (Matching BeautyOasisRx layout) */}
        {profileTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 3 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">Lifetime Deposit Spend</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  $200.00
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Settled via Stripe · NorCal Assembly Line Quota
                </p>
              </div>

              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">HVAC System Spec</span>
                  <div className="w-8 h-8 rounded-xl bg-[#A4A77E]/15 text-[#4E5637] dark:text-[#C5CAB0] flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedCust.tonnage}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedCust.configuration} • {selectedCust.panelColorName}
                </p>
              </div>

              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">Production Batch</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Box className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono truncate">
                  {selectedCust.batchNumber}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Contractor: {selectedCust.assignedContractor?.split(',')[0]}
                </p>
              </div>
            </div>

            {/* 2 Large Side-by-Side Cards (Matching BeautyOasisRx layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card: Confidential Jobsite Details */}
              <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-[#2B3037]">
                  <ShieldCheck className="w-4 h-4 text-[#A4A77E]" />
                  <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                    Jobsite & Customer Profile Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Email Address</span>
                    <span className="font-semibold text-slate-900 dark:text-white break-all">
                      {selectedCust.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Phone Number</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      {selectedCust.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Client Since</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      {selectedCust.joinedDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Assigned Role</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Residential Jobsite Client
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#2B3037] text-xs">
                  <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Jobsite Street Address</span>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{selectedCust.address}, {selectedCust.city}, {selectedCust.state} {selectedCust.zip}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#2B3037] grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Architectural Color Choice</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="w-4 h-4 rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: selectedCust.panelColor }}
                      />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedCust.panelColorName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#6D6E71] dark:text-[#8D8E92] block text-[11px] mb-0.5">Assigned HVAC Contractor</span>
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">
                      {selectedCust.assignedContractor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Card: Next Scheduled Procedure */}
              <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                        Next Scheduled Installation Procedure
                      </h3>
                    </div>
                    <button
                      onClick={() => setProfileTab('dispatch')}
                      className="text-xs font-mono text-[#73784F] dark:text-[#A4A77E] hover:underline"
                    >
                      View all (1)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        On-Site Modular Installation & Telemetry Handover
                      </span>
                      <StatusPill status={selectedCust.installStatus} size="xs" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Target Window:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          October 16, 2026 (10 AM – 1 PM)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Assigned Tech:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {selectedCust.assignedContractor}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#383E47] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Chassis RFID Linkage:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        RFID-NT-8841-A2 (Locked)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71]">Local Mechanical Certified ✓</span>
                  <button
                    onClick={() => handleOpenCustEdit(selectedCust)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Adjust Window
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HVAC SYSTEM & TELEMETRY */}
        {profileTab === 'specs' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  HVAC Hardware Architecture & Telemetry Targets
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Standardized 2x6 framing specs, airflow orientation, and powder-coat exterior panels.
                </p>
              </div>
              <ApprovedByLocalMechanicalSeal size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl water-card space-y-1">
                <span className="font-mono text-slate-500 uppercase text-[10.5px]">Tonnage Rating</span>
                <div className="font-bold text-base text-slate-900 dark:text-white">{selectedCust.tonnage}</div>
                <p className="text-[11px] text-slate-500">Optimized for 1,500 – 1,900 sq ft residential footprints</p>
              </div>

              <div className="p-4 rounded-xl water-card space-y-1">
                <span className="font-mono text-slate-500 uppercase text-[10.5px]">Airflow Orientation</span>
                <div className="font-bold text-base text-slate-900 dark:text-white">{selectedCust.configuration}</div>
                <p className="text-[11px] text-slate-500">Standard vertical attic/closet plenum connection</p>
              </div>

              <div className="p-4 rounded-xl water-card space-y-1">
                <span className="font-mono text-slate-500 uppercase text-[10.5px]">Architectural Panel</span>
                <div className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-md border border-black/10 shadow-xs"
                    style={{ backgroundColor: selectedCust.panelColor }}
                  />
                  <span>{selectedCust.panelColorName}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">Hex: {selectedCust.panelColor}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-2 text-xs">
              <span className="font-mono uppercase font-bold text-slate-800 dark:text-slate-200 block">
                Quality Control Verification Benchmarks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Expected Delta-T:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">18.0°F – 22.0°F</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Airflow Static Pressure:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">0.50 in. w.g.</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Electrical Interface:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">208/230V 1-Phase 30A</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTION BATCH FLOW */}
        {profileTab === 'batch' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Manufacturing & Assembly Queue Status
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Chassis line telemetry linked to Batch #{selectedCust.batchNumber}.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#4E5637] dark:text-[#C5CAB0]">
                {selectedCust.batchNumber}
              </span>
            </div>

            {/* Funnel Progress Step */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Batch Funnel Stage: Assembly & Pre-Calibration (65%)</span>
                <span className="font-mono text-emerald-600 font-bold">On Schedule</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#A4A77E] rounded-full transition-all" style={{ width: '65%' }} />
              </div>
              <div className="grid grid-cols-4 text-[10px] font-mono text-slate-500 pt-1">
                <span>1. Deposit Locked (20%)</span>
                <span>2. Chassis Assembly (65%)</span>
                <span>3. Quality Pre-Check (85%)</span>
                <span>4. Verified Dispatch (100%)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INSTALLATION & DISPATCH */}
        {profileTab === 'dispatch' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Contractor Network Dispatch & Jobsite Logistics
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Assigned technician credentials, appointment windows, and customer unselect history.
                </p>
              </div>
              <StatusPill status={selectedCust.installStatus} size="sm" />
            </div>

            {/* Contractor Profile snippet */}
            <div className="p-4 rounded-xl water-card flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#6D6E71] font-bold">Assigned Certified Contractor</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {selectedCust.assignedContractor}
                </div>
                <p className="text-[11px] text-slate-500">Local Mechanical Quality & Oversight Verified</p>
              </div>
              <button
                onClick={() => addToast('Contractor reassignment requested', 'info')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] text-xs font-semibold hover:bg-slate-100"
              >
                Reassign Contractor
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: BILLING & DEPOSITS */}
        {profileTab === 'billing' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Payment Ledger & $200 Production Reservation Deposit
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Stripe automated escrow, fee lock confirmation, and invoice audit receipts.
                </p>
              </div>
              <span className="font-mono text-emerald-600 font-bold text-sm">$200.00 PAID</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    $200 Batch Reservation Deposit
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Transaction: tx_stripe_{selectedCust.id}_prod
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Settled ✓
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-[#2B3037] flex items-center justify-between text-[11px] text-slate-500">
                <span>Date: {selectedCust.joinedDate}</span>
                <span>Payment Method: Visa ending in 4242</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STAFF ACTIVITY LOG & NOTES */}
        {profileTab === 'notes' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Staff Activity Notes & Communications Audit
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Internal operator notes and customer service coordination records.
                </p>
              </div>
            </div>

            {/* Note composer */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Append internal operator note to this customer account..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1E2227] text-white hover:bg-[#A4A77E] hover:text-[#121417] dark:bg-[#A4A77E] dark:text-[#121417] text-xs font-semibold shadow-sm transition-all"
              >
                Post Note
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2.5">
              {(selectedCust.notes || []).map((n, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl water-card text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[10.5px] text-[#6D6E71]">
                    <span className="font-bold text-slate-900 dark:text-white">{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide-In Edit Drawer (When clicking Edit Profile from within Profile View) */}
        <SlideOverPanel
          isOpen={isEditingCust}
          onClose={() => setIsEditingCust(false)}
          title={`Edit Customer: ${selectedCust.name}`}
          subtitle="Update customer profile, address, and equipment specification."
          idChip={selectedCust.id}
          icon={Edit2}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsEditingCust(false)}
                className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-cust-form"
                className="px-5 py-2 rounded-xl clean-pill-active text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          }
        >
          {custEditForm && (
            <form id="edit-cust-form" onSubmit={handleSaveCustEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={custEditForm.name}
                  onChange={(e) => setCustEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={custEditForm.email}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={custEditForm.phone}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={custEditForm.address}
                  onChange={(e) => setCustEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={custEditForm.city}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={custEditForm.state}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Zip</label>
                  <input
                    type="text"
                    value={custEditForm.zip}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tonnage</label>
                  <CustomSelect
                    value={custEditForm.tonnage}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, tonnage: e.target.value }))}
                    className="w-full"
                    size="lg"
                  >
                    <option value="2.0 Ton">2.0 Ton</option>
                    <option value="2.5 Ton">2.5 Ton</option>
                    <option value="3.0 Ton">3.0 Ton</option>
                    <option value="4.0 Ton">4.0 Ton</option>
                    <option value="5.0 Ton">5.0 Ton</option>
                  </CustomSelect>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <CustomSelect
                    value={custEditForm.installStatus}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, installStatus: e.target.value }))}
                    className="w-full"
                    size="lg"
                  >
                    <option value="In Production">In Production</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Deposit">Pending Deposit</option>
                    <option value="Deactivated">Deactivated</option>
                  </CustomSelect>
                </div>
              </div>
            </form>
          )}
        </SlideOverPanel>
      </div>
    );
  }

  // ==========================================
  // VIEW MODE: TABLE REGISTRY (DEFAULT VIEW)
  // ==========================================
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers"
        subtitle="Customer accounts, batch associations, and delivery status."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddCustModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Add Customer</span>
            </button>
            <button
              onClick={() => {
                setCustomers(MockService.getCustomers());
                addToast('Customer list refreshed', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={customers}
        onRowClick={(row) => {
          setSelectedCust(row);
          setViewMode('profile');
          setProfileTab('overview');
          setSearchParams({ profile: row.id });
        }}
        searchPlaceholder="Search customer name, email, city, batch #..."
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Profile',
            icon: Eye,
            onClick: () => {
              setSelectedCust(row);
              setViewMode('profile');
              setProfileTab('overview');
              setSearchParams({ profile: row.id });
            },
          },
          {
            label: 'Edit Customer',
            icon: Edit,
            onClick: () => handleOpenCustEdit(row),
          },
          {
            label: row.installStatus === 'Deactivated' ? 'Reactivate' : 'Deactivate',
            icon: UserX,
            onClick: () => handleToggleDeactivate(row),
          },
          { divider: true },
          {
            label: 'Delete Customer',
            icon: Trash2,
            variant: 'danger',
            onClick: () => handleDeleteCustomer(row.id),
            confirmMessage: `Are you sure you want to remove customer ${row.name}?`,
          },
        ]}
      />

      {/* Slide-In Add Customer Panel */}
      <SlideOverPanel
        isOpen={isAddCustModalOpen}
        onClose={() => setIsAddCustModalOpen(false)}
        title="Create Customer Jobsite Profile"
        subtitle="Establish jobsite address, airflow configuration, and assign regional hub."
        idChip="NEW ACCOUNT"
        icon={Plus}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsAddCustModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-customer-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Create Customer
            </button>
          </div>
        }
      >
        <form id="add-customer-form" onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica Palmer"
              value={newCustForm.name}
              onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="j.palmer@example.com"
                value={newCustForm.email}
                onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="(555) 789-0123"
                value={newCustForm.phone}
                onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jobsite Street Address
            </label>
            <input
              type="text"
              placeholder="1204 Oak Ridge Dr, Roseville CA"
              value={newCustForm.address}
              onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tonnage Capacity
              </label>
              <CustomSelect
                value={newCustForm.tonnage}
                onChange={(e) => setNewCustForm({ ...newCustForm, tonnage: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="2.0 Ton">2.0 Ton (900 – 1,200 sq ft)</option>
                <option value="2.5 Ton">2.5 Ton (1,200 – 1,500 sq ft)</option>
                <option value="3.0 Ton">3.0 Ton (1,500 – 1,900 sq ft)</option>
                <option value="4.0 Ton">4.0 Ton (1,900 – 2,500 sq ft)</option>
                <option value="5.0 Ton">5.0 Ton (2,500 – 3,200 sq ft)</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Airflow Configuration
              </label>
              <CustomSelect
                value={newCustForm.configuration}
                onChange={(e) => setNewCustForm({ ...newCustForm, configuration: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Upflow Configuration">Upflow Configuration</option>
                <option value="Downflow Configuration">Downflow Configuration</option>
                <option value="Horizontal Configuration">Horizontal Configuration</option>
              </CustomSelect>
            </div>
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
