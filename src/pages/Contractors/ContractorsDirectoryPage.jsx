import React, { useState } from 'react';
import {
  HardHat,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  AlertTriangle,
  UserX,
  FileCheck,
  Award,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const ContractorsDirectoryPage = () => {
  const { addToast } = useApp();
  const [contractors, setContractors] = useState(() => MockService.getContractors());
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
  });

  // Add Contractor Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContractorForm, setNewContractorForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    epaLicense: '',
    stateLicense: '',
    experienceYears: '8',
    distanceMiles: '6.5',
    status: 'Available',
    insuranceCarrier: 'Travelers Commercial (Local Mechanical Listed)',
    specialties: 'Modular Compartment Swaps, Airflow Diagnostics',
  });

  // Edit Contractor in Panel
  const [isEditingContractor, setIsEditingContractor] = useState(false);
  const [contractorEditForm, setContractorEditForm] = useState(null);

  const columns = [
    {
      key: 'name',
      label: 'Contractor & Company',
      sortable: true,
      width: '24%',
      render: (val, row) => (
        <div className="flex items-center gap-3 truncate">
          <img
            src={row.avatar}
            alt={val}
            className="w-9 h-9 rounded-full object-cover border border-[#CCD4BE] dark:border-[#383E47] flex-shrink-0 shadow-sm"
          />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
              {val}
            </div>
            <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
              {row.company}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      width: '11%',
      render: (val, row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white">{val}</span>
          <span className="text-[10px] text-[#6D6E71]">({row.reviewCount})</span>
        </div>
      )
    },
    {
      key: 'epaLicense',
      label: 'EPA & State Lic',
      width: '18%',
      render: (val, row) => (
        <div className="font-mono text-xs truncate">
          <div className="text-slate-800 dark:text-slate-200 font-semibold truncate">{val}</div>
          <div className="text-[10px] text-[#6D6E71] truncate">{row.stateLicense}</div>
        </div>
      )
    },
    {
      key: 'experienceYears',
      label: 'Experience',
      sortable: true,
      width: '11%',
      render: (val) => (
        <span className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300 font-medium">
          {val} yrs
        </span>
      )
    },
    {
      key: 'distanceMiles',
      label: 'Depot Radius',
      sortable: true,
      width: '10%',
      hideBelowXl: true,
      render: (val) => (
        <span className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300 font-medium">
          {val} mi
        </span>
      )
    },
    {
      key: 'unselectCount',
      label: 'Unselects',
      sortable: true,
      width: '8%',
      hideBelowXl: true,
      render: (val) => (
        <span className={`font-mono text-xs font-bold tabular-nums ${val > 2 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
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
      key: 'status',
      label: 'All Contractor Statuses',
      options: [
        { label: 'Assigned', value: 'Assigned' },
        { label: 'Available', value: 'Available' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Suspended', value: 'Suspended' },
      ]
    }
  ];

  const handleOpenContractorEdit = (c) => {
    setSelectedContractor(c);
    setContractorEditForm({
      name: c.name,
      company: c.company,
      phone: c.phone || '(555) 000-0000',
      email: c.email || 'contractor@example.com',
      experienceYears: c.experienceYears,
      distanceMiles: c.distanceMiles,
      status: c.status,
      insuranceCarrier: c.insuranceCarrier,
      specialties: (c.specialties || []).join(', '),
    });
    setIsEditingContractor(true);
  };

  const handleSaveContractorEdit = (e) => {
    e.preventDefault();
    if (!selectedContractor || !contractorEditForm) return;

    const updates = {
      ...contractorEditForm,
      specialties: contractorEditForm.specialties.split(',').map(s => s.trim()).filter(Boolean),
    };

    MockService.updateContractor(selectedContractor.id, updates);
    const updated = MockService.getContractors();
    setContractors(updated);
    setSelectedContractor(prev => ({ ...prev, ...updates }));
    setIsEditingContractor(false);
    addToast(`Contractor ${selectedContractor.name} profile updated!`, 'success');
  };

  const handleDeleteContractor = (id) => {
    if (!window.confirm(`Are you sure you want to remove contractor ${id} from the Local Mechanical roster?`)) return;

    MockService.deleteContractor(id);
    const updated = MockService.getContractors();
    setContractors(updated);
    if (selectedContractor?.id === id) {
      setSelectedContractor(null);
      setIsEditingContractor(false);
    }
    addToast(`Contractor removed from certified directory`, 'error');
  };

  const handleCreateContractorSubmit = (e) => {
    e.preventDefault();
    if (!newContractorForm.name.trim() || !newContractorForm.company.trim()) return;

    const created = MockService.createContractor({
      ...newContractorForm,
      specialties: newContractorForm.specialties.split(',').map(s => s.trim()).filter(Boolean),
    });

    setContractors(MockService.getContractors());
    setIsAddModalOpen(false);
    setNewContractorForm({
      name: '',
      company: '',
      phone: '',
      email: '',
      epaLicense: '',
      stateLicense: '',
      experienceYears: '8',
      distanceMiles: '6.5',
      status: 'Available',
      insuranceCarrier: 'Travelers Commercial (Local Mechanical Listed)',
      specialties: 'Modular Compartment Swaps, Airflow Diagnostics',
    });
    addToast(`Contractor ${created.name} certified and added to Local Mechanical network!`, 'success');
  };

  const handleSuspend = (id) => {
    MockService.updateContractor(id, { status: 'Suspended' });
    setContractors(MockService.getContractors());
    setSelectedContractor(prev => ({ ...prev, status: 'Suspended' }));
    addToast('Contractor suspended from network dispatch', 'error');
  };

  const handleRetrain = (id) => {
    MockService.updateContractor(id, { status: 'Under Review' });
    setContractors(MockService.getContractors());
    setSelectedContractor(prev => ({ ...prev, status: 'Under Review' }));
    addToast('Mandatory retraining scheduled with Local Mechanical', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Contractors Directory"
        subtitle="Vetted installer network, licensing credentials, and customer performance ratings."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Add New Contractor</span>
            </button>
            <button
              onClick={() => {
                setContractors(MockService.getContractors());
                addToast('Contractor directory refreshed', 'info');
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
        data={contractors}
        onRowClick={(row) => {
          setSelectedContractor(row);
          setIsEditingContractor(false);
        }}
        searchPlaceholder="Search contractor name, EPA license, company..."
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={(k, v) => setActiveFilters(prev => ({ ...prev, [k]: v }))}
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => {
              setSelectedContractor(row);
              setIsEditingContractor(false);
            },
          },
          {
            label: 'Edit Profile',
            icon: Edit2,
            onClick: () => handleOpenContractorEdit(row),
          },
          { divider: true },
          {
            label: row.status === 'Suspended' ? 'Reactivate' : 'Suspend',
            icon: AlertTriangle,
            variant: 'danger',
            onClick: () => handleSuspend(row.id),
            confirmMessage: `Are you sure you want to ${row.status === 'Suspended' ? 'reactivate' : 'suspend'} ${row.name}?`,
          },
        ]}
      />

      {/* Slide-In Profile & Unselect Reports Panel */}
      <SlideOverPanel
        isOpen={!!selectedContractor}
        onClose={() => {
          setSelectedContractor(null);
          setIsEditingContractor(false);
        }}
        title={selectedContractor ? selectedContractor.name : ''}
        subtitle={selectedContractor ? selectedContractor.company : ''}
        idChip={selectedContractor?.localMechanicalCertId || selectedContractor?.id}
        icon={HardHat}
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            {!isEditingContractor ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">
                    {selectedContractor?.totalJobsCompleted || 0} jobs completed
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteContractor(selectedContractor.id)}
                    className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline font-semibold"
                  >
                    Remove Contractor
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenContractorEdit(selectedContractor)}
                    className="px-3.5 py-2 rounded-xl water-pill text-xs font-semibold text-[#555D50] dark:text-[#BFC399] hover:bg-[#A4A77E]/10"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRetrain(selectedContractor.id)}
                    className="px-3.5 py-2 rounded-xl border border-amber-200 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50"
                  >
                    Require Retraining
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuspend(selectedContractor.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                  >
                    Suspend License
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-mono text-amber-600 font-semibold">Editing Contractor</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingContractor(false)}
                    className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveContractorEdit}
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
        {selectedContractor && !isEditingContractor && (
          <div className="space-y-6">
            {/* Top Profile Card */}
            <div className="water-card water-shine flex items-center gap-4 p-4 rounded-2xl border border-white/80 dark:border-white/10 shadow-water">
              <img
                src={selectedContractor.avatar}
                alt={selectedContractor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#A4A77E] shadow-sm flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedContractor.name}
                  </h3>
                  <StatusPill status={selectedContractor.status} size="xs" />
                </div>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  {selectedContractor.company}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono tabular-nums">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {selectedContractor.rating}
                  </span>
                  <span>•</span>
                  <span>{selectedContractor.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            {/* Insurance & Certifications */}
            <div className="water-card p-4 rounded-2xl border border-[#CCD4BE]/80 dark:border-[#384435] bg-gradient-to-br from-[#F8FAF6] to-[#EFF4EB] dark:from-[#1E251E] dark:to-[#171D17] space-y-2 shadow-water">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  Certification Authority
                </span>
                <ApprovedByLocalMechanicalSeal />
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                Certificate ID: {selectedContractor.localMechanicalCertId || 'Pending Certification'}
              </div>
              <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                Carrier: {selectedContractor.insuranceCarrier}
              </p>
            </div>

            {/* Contact Information */}
            <div className="water-card p-4 rounded-2xl border border-white/80 dark:border-[#383E47] space-y-2 text-xs shadow-water">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                Direct Dispatch Contacts
              </span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block">Phone</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedContractor.phone || '(555) 392-1920'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Email</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedContractor.email || 'contractor@localmech.org'}</span>
                </div>
              </div>
            </div>

            {/* Customer Unselect Feedback Reports (PDF Page 5 & 6 requirement) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5 text-red-500" />
                  <span>Customer Removal Reports ({selectedContractor.unselectCount})</span>
                </h4>
                <span className="text-[10px] font-mono text-[#6D6E71]">Manage My Contractor Log</span>
              </div>

              {(selectedContractor.unselectReports || []).length === 0 ? (
                <div className="water-card p-4 rounded-2xl border border-slate-100 dark:border-[#2B3037] text-xs text-slate-500 text-center">
                  Zero customer unselect reports recorded. Pristine retention record.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedContractor.unselectReports.map((rpt, idx) => (
                    <div
                      key={idx}
                      className="water-card p-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/70 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 text-xs space-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          {rpt.customerName}
                        </span>
                        <span className="text-slate-500">{rpt.date}</span>
                      </div>
                      <div className="font-semibold text-amber-800 dark:text-amber-300">
                        Reason: {rpt.reason}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        "{rpt.feedback}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specialties & Recent Feedback */}
            <div className="water-card p-4 rounded-2xl border border-white/80 dark:border-[#383E47] space-y-2 text-xs shadow-water">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                Technical Specialties
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(selectedContractor.specialties || []).map((sp, idx) => (
                  <span
                    key={idx}
                    className="water-pill font-mono text-[10px] px-2.5 py-0.5 rounded-full text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    {sp}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-[#383E47]">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71] block mb-0.5">
                  Most Recent Feedback
                </span>
                <p className="italic text-slate-700 dark:text-slate-300">
                  "{selectedContractor.recentFeedback}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Contractor Form */}
        {selectedContractor && isEditingContractor && contractorEditForm && (
          <form onSubmit={handleSaveContractorEdit} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Contractor Profile</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={contractorEditForm.name}
                  onChange={(e) => setContractorEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Entity</label>
                <input
                  type="text"
                  required
                  value={contractorEditForm.company}
                  onChange={(e) => setContractorEditForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={contractorEditForm.phone}
                    onChange={(e) => setContractorEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={contractorEditForm.email}
                    onChange={(e) => setContractorEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Operations & Authority</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={contractorEditForm.experienceYears}
                    onChange={(e) => setContractorEditForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Radius (Miles)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={contractorEditForm.distanceMiles}
                    onChange={(e) => setContractorEditForm(prev => ({ ...prev, distanceMiles: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={contractorEditForm.status}
                    onChange={(e) => setContractorEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Insurance Carrier</label>
                <input
                  type="text"
                  value={contractorEditForm.insuranceCarrier}
                  onChange={(e) => setContractorEditForm(prev => ({ ...prev, insuranceCarrier: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Technical Specialties (comma separated)</label>
                <input
                  type="text"
                  value={contractorEditForm.specialties}
                  onChange={(e) => setContractorEditForm(prev => ({ ...prev, specialties: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </form>
        )}
      </SlideOverPanel>

      {/* Add New Contractor SlideOverPanel */}
      <SlideOverPanel
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Certify & Onboard New Contractor"
        subtitle="Registers licensed technician under Local Mechanical certification authority."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-contractor-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
            >
              Certify & Issue LM-CERT
            </button>
          </>
        }
      >
        <form id="create-contractor-form" onSubmit={handleCreateContractorSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contractor Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alexander Cruz"
                value={newContractorForm.name}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company / DBA Entity *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cruz Mechanical & Air"
                value={newContractorForm.company}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
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
                placeholder="(555) 782-9901"
                value={newContractorForm.phone}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="a.cruz@cruzmechanical.com"
                value={newContractorForm.email}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                EPA License # (Section 608)
              </label>
              <input
                type="text"
                placeholder="EPA-Universal #8829101"
                value={newContractorForm.epaLicense}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, epaLicense: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                State Contractor License #
              </label>
              <input
                type="text"
                placeholder="HVAC-LIC #CA-891022"
                value={newContractorForm.stateLicense}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, stateLicense: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience (Yrs)
              </label>
              <input
                type="number"
                value={newContractorForm.experienceYears}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Depot Radius (Mi)
              </label>
              <input
                type="number"
                step="0.5"
                value={newContractorForm.distanceMiles}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, distanceMiles: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={newContractorForm.status}
                onChange={(e) => setNewContractorForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Insurance Carrier (Local Mechanical Listed as Additional Insured)
            </label>
            <input
              type="text"
              value={newContractorForm.insuranceCarrier}
              onChange={(e) => setNewContractorForm(prev => ({ ...prev, insuranceCarrier: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Technical Specialties (comma separated)
            </label>
            <input
              type="text"
              value={newContractorForm.specialties}
              onChange={(e) => setNewContractorForm(prev => ({ ...prev, specialties: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
