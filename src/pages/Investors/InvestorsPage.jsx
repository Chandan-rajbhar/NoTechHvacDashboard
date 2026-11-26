import React, { useState } from 'react';
import {
  Users,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Calendar,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const InvestorsPage = () => {
  const { addToast } = useApp();
  const [investors, setInvestors] = useState(() => MockService.getInvestors());
  const [allocationRequests, setAllocationRequests] = useState(() => MockService.getAllocationRequests());

  // SlideOver drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [viewingInvestor, setViewingInvestor] = useState(null);
  const [editingInvestor, setEditingInvestor] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    accreditation: 'all',
    round: 'all',
  });

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    location: '',
    phone: '',
    email: '',
    round: 'Series A Preferred',
    targetTranche: '',
    accreditation: 'Pending',
    status: 'Prospect',
    notes: '',
  });

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name.slice(0, 2) || 'IN').toUpperCase();
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      firm: '',
      location: '',
      phone: '',
      email: '',
      round: 'Series A Preferred',
      targetTranche: '',
      accreditation: 'Pending',
      status: 'Prospect',
      notes: '',
    });
    setIsAddDrawerOpen(true);
  };

  const handleOpenEdit = (inv) => {
    setEditingInvestor(inv);
    setFormData({
      name: inv.name,
      firm: inv.firm,
      location: inv.location,
      phone: inv.phone,
      email: inv.email,
      round: inv.round,
      targetTranche: inv.targetTranche,
      accreditation: inv.accreditation,
      status: inv.status,
      notes: inv.notes || '',
    });
    setViewingInvestor(null);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.firm.trim()) return;

    const created = MockService.createInvestor({
      ...formData,
      targetTranche: Number(formData.targetTranche) || 0,
    });
    setInvestors(MockService.getInvestors());
    setIsAddDrawerOpen(false);
    addToast(`Investor profile for ${created.name} (${created.firm}) created`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingInvestor) return;

    MockService.updateInvestor(editingInvestor.id, {
      ...formData,
      targetTranche: Number(formData.targetTranche) || 0,
    });
    setInvestors(MockService.getInvestors());
    setEditingInvestor(null);
    addToast(`Investor profile for ${formData.name} updated`, 'success');
  };

  const handleDelete = (inv) => {
    if (!window.confirm(`Are you sure you want to delete investor ${inv.name} (${inv.firm})?`)) return;

    MockService.deleteInvestor(inv.id);
    setInvestors(MockService.getInvestors());
    if (viewingInvestor?.id === inv.id) setViewingInvestor(null);
    if (editingInvestor?.id === inv.id) setEditingInvestor(null);
    addToast(`Investor record for ${inv.name} removed`, 'info');
  };

  // Table Columns
  const columns = [
    {
      key: 'name',
      label: 'Investor',
      sortable: true,
      width: '26%',
      render: (val, row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#73784F] to-[#2E3528] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 border border-white/20">
            {getInitials(val)}
          </div>
          <div className="min-w-0 truncate">
            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {val}
            </div>
            <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#A4A77E]" />
              <span>{row.firm}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      width: '18%',
      hideOnMobile: true,
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate block">
          {val}
        </span>
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
      key: 'targetTranche',
      label: 'Target Tranche',
      sortable: true,
      width: '14%',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
          ${(Number(val) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'accreditation',
      label: 'Accreditation',
      sortable: true,
      width: '13%',
      isStatus: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '13%',
      isStatus: true,
    },
  ];

  // Dynamic known funding rounds
  const allKnownRounds = React.useMemo(() => {
    const active = MockService.getFundingRound();
    const past = MockService.getPastFundingRounds();
    const names = [active?.name, ...past.map((p) => p.name)].filter(Boolean);
    return Array.from(new Set(names));
  }, []);

  // Filters configuration
  const filterOptions = [
    {
      key: 'accreditation',
      label: 'All Accreditation',
      options: [
        { label: 'All Accreditation', value: 'all' },
        { label: 'Verified', value: 'Verified' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' },
      ],
    },
    {
      key: 'round',
      label: 'All Rounds',
      options: [
        { label: 'All Rounds', value: 'all' },
        ...allKnownRounds.map((r) => ({ label: r, value: r })),
      ],
    },
  ];

  const getRowActions = (row) => [
    {
      label: 'View Details',
      icon: Eye,
      onClick: () => setViewingInvestor(row),
    },
    {
      label: 'Edit',
      icon: Edit2,
      onClick: () => handleOpenEdit(row),
    },
    { divider: true },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: () => handleDelete(row),
      confirmMessage: `Are you sure you want to delete ${row.name} (${row.firm})?`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Investors"
        subtitle="Manage investor profiles and accreditation."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Add Investor</span>
            </button>
            <button
              onClick={() => {
                setInvestors(MockService.getInvestors());
                setAllocationRequests(MockService.getAllocationRequests());
                addToast('Investors data refreshed', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={investors}
        onRowClick={(row) => setViewingInvestor(row)}
        searchPlaceholder="Search investor name, firm, email..."
        filters={filterOptions}
        activeFilters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        pageSize={8}
        rowActions={getRowActions}
      />

      {/* SlideOver Panel: View Details */}
      <SlideOverPanel
        isOpen={!!viewingInvestor}
        onClose={() => setViewingInvestor(null)}
        title={viewingInvestor ? viewingInvestor.name : ''}
        subtitle={viewingInvestor ? viewingInvestor.firm : ''}
        idChip={viewingInvestor?.id}
        icon={Users}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => {
                if (viewingInvestor) handleDelete(viewingInvestor);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(viewingInvestor)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingInvestor(null)}
                className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {viewingInvestor && (
          <div className="space-y-6 text-xs">
            {/* Header summary block */}
            <div className="p-4 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#73784F] to-[#2E3528] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {getInitials(viewingInvestor.name)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {viewingInvestor.name}
                  </h4>
                  <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                    {viewingInvestor.firm}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusPill status={viewingInvestor.accreditation} size="xs" />
                <StatusPill status={viewingInvestor.status} size="xs" />
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Contact Information
              </span>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#A4A77E]" />
                  <span>Email</span>
                </span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  {viewingInvestor.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#A4A77E]" />
                  <span>Phone</span>
                </span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  {viewingInvestor.phone}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A4A77E]" />
                  <span>Location</span>
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {viewingInvestor.location}
                </span>
              </div>
            </div>

            {/* Allocation & Accreditation Block */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Allocation & Accreditation
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E2227]/70">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Target Tranche</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                    ${(Number(viewingInvestor.targetTranche) || 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E2227]/70">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Funding Round</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-1 block truncate">
                    {viewingInvestor.round}
                  </span>
                </div>
              </div>
              {viewingInvestor.notes && (
                <div className="pt-2">
                  <span className="text-[10.5px] font-mono text-slate-400 block mb-1">Notes:</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1E2227]/50 p-2.5 rounded-lg border border-slate-100 dark:border-[#2B3037]">
                    {viewingInvestor.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Linked Allocation Requests */}
            <div className="space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Allocation Requests History
              </span>
              {allocationRequests.filter((r) => r.investorId === viewingInvestor.id).length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E2227]/50 text-slate-400 text-center">
                  No allocation requests recorded for this investor yet.
                </div>
              ) : (
                allocationRequests
                  .filter((r) => r.investorId === viewingInvestor.id)
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                          {req.id} · ${(Number(req.amount) || 0).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Requested on {req.requestedOn}
                        </span>
                      </div>
                      <StatusPill status={req.status} size="xs" />
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* SlideOver Panel: Add Investor */}
      <SlideOverPanel
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add Investor"
        subtitle="Establish an investor record and accreditation profile."
        icon={Users}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(false)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-investor-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Investor
            </button>
          </div>
        }
      >
        <form id="add-investor-form" onSubmit={handleSaveAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Firm / Syndicate *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Horizon Climate Ventures"
              value={formData.firm}
              onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. (415) 790-2210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. e.rostova@horizonventures.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Funding Round
              </label>
              <CustomSelect
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                className="w-full font-mono"
                size="lg"
              >
                {allKnownRounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Tranche ($) *
              </label>
              <input
                type="number"
                required
                min="10000"
                step="5000"
                placeholder="250000"
                value={formData.targetTranche}
                onChange={(e) => setFormData({ ...formData, targetTranche: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Accreditation Status
              </label>
              <CustomSelect
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Investor Status
              </label>
              <CustomSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </CustomSelect>
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Investment thesis, LP background, check size parameters..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* SlideOver Panel: Edit Investor */}
      <SlideOverPanel
        isOpen={!!editingInvestor}
        onClose={() => setEditingInvestor(null)}
        title={editingInvestor ? `Edit: ${editingInvestor.name}` : ''}
        subtitle="Update investor accreditation and target tranche allocation."
        idChip={editingInvestor?.id}
        icon={Edit2}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setEditingInvestor(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-investor-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Changes
            </button>
          </div>
        }
      >
        <form id="edit-investor-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Firm / Syndicate *
            </label>
            <input
              type="text"
              required
              value={formData.firm}
              onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Funding Round
              </label>
              <CustomSelect
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                className="w-full font-mono"
                size="lg"
              >
                {allKnownRounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Tranche ($) *
              </label>
              <input
                type="number"
                required
                min="10000"
                step="5000"
                value={formData.targetTranche}
                onChange={(e) => setFormData({ ...formData, targetTranche: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Accreditation Status
              </label>
              <CustomSelect
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Investor Status
              </label>
              <CustomSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </CustomSelect>
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
