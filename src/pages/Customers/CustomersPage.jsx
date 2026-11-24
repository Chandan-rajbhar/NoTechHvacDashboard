import React, { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const CustomersPage = () => {
  const { addToast } = useApp();
  const [customers, setCustomers] = useState(() => MockService.getCustomers());
  const [selectedCust, setSelectedCust] = useState(null);
  const [newNote, setNewNote] = useState('');

  // Add Customer Modal
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

  // Edit Customer Mode in SlideOverPanel
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
    }
    addToast(`Customer record removed`, 'error');
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

    const updated = MockService.addCustomerNote(selectedCust.id, newNote.trim(), 'Operations Support');
    setCustomers(MockService.getCustomers());
    setSelectedCust(prev => ({
      ...prev,
      notes: [{ date: new Date().toISOString().split('T')[0], author: 'Operations Support', text: newNote.trim() }, ...(prev.notes || [])]
    }));
    setNewNote('');
    addToast('Note appended to customer activity log', 'success');
  };

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
              <Plus className="w-4 h-4" />
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
          setIsEditingCust(false);
        }}
        searchPlaceholder="Search customer name, email, city, batch #..."
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => {
              setSelectedCust(row);
              setIsEditingCust(false);
            },
          },
          {
            label: 'Edit Profile',
            icon: Edit,
            onClick: () => handleOpenCustEdit(row),
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

      {/* Slide-In Customer Profile Panel */}
      <SlideOverPanel
        isOpen={!!selectedCust}
        onClose={() => {
          setSelectedCust(null);
          setIsEditingCust(false);
        }}
        title={selectedCust ? selectedCust.name : ''}
        subtitle={selectedCust ? `${selectedCust.city}, ${selectedCust.state} · Customer since ${selectedCust.joinedDate}` : ''}
        idChip={selectedCust?.id}
        icon={Users}
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            {!isEditingCust ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">
                    Batch: {selectedCust?.batchNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomer(selectedCust.id)}
                    className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline font-semibold"
                  >
                    Remove Customer
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCustEdit(selectedCust)}
                    className="px-3.5 py-2 rounded-xl water-pill text-xs font-semibold text-[#555D50] dark:text-[#BFC399] hover:bg-[#A4A77E]/10"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCust(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E2227] text-white hover:bg-[#A4A77E] hover:text-[#121417] dark:bg-[#A4A77E] dark:text-[#121417]"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-mono text-amber-600 font-semibold">Editing Customer Profile</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCust(false)}
                    className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustEdit}
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
        {selectedCust && !isEditingCust && (
          <div className="space-y-6">
            {/* Contact & Address */}
            <div className="water-card p-4.5 rounded-2xl border border-white/80 dark:border-white/10 space-y-2 text-xs shadow-water">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                Customer Address & Contacts
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedCust.address}, {selectedCust.city}, {selectedCust.state} {selectedCust.zip}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-700 dark:text-slate-300 pt-1">
                <span>Phone: {selectedCust.phone}</span>
                <span>•</span>
                <span>Email: {selectedCust.email}</span>
              </div>
            </div>

            {/* System Specs & Reservation */}
            <div className="water-card p-4.5 rounded-2xl border border-white/80 dark:border-white/10 space-y-2 text-xs shadow-water">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                  System Spec & Panel Choice
                </span>
                <StatusPill status={selectedCust.installStatus} size="xs" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedCust.tonnage} • {selectedCust.configuration}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className="w-4 h-4 rounded-md border border-black/10 shadow-sm"
                  style={{ backgroundColor: selectedCust.panelColor }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {selectedCust.panelColorName}
                </span>
                <span className="font-mono text-[10.5px] text-[#6D6E71] ml-auto">
                  Reservation: {selectedCust.reservationId}
                </span>
              </div>
            </div>

            {/* Assigned Contractor */}
            <div className="water-card p-4 rounded-2xl bg-gradient-to-r from-[#F8FAF6] to-[#EFF4EB] dark:from-[#1E251E] dark:to-[#171D17] border border-[#CCD4BE]/80 dark:border-[#384435] flex items-center justify-between shadow-water">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  Assigned Contractor
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedCust.assignedContractor}
                </p>
              </div>
            </div>

            {/* Manage My Contractor Unselect History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5 text-amber-600" />
                  <span>"Manage My Contractor" Unselect History</span>
                </h4>
                <span className="text-[10px] font-mono text-[#6D6E71]">In-App Preference</span>
              </div>

              {(selectedCust.unselectHistory || []).length === 0 ? (
                <div className="water-card p-4 rounded-2xl border border-slate-100 dark:border-[#2B3037] text-xs text-slate-500 text-center">
                  Customer has kept their originally assigned contractor.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCust.unselectHistory.map((uh, i) => (
                    <div
                      key={i}
                      className="water-card p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/70 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200/80 text-xs space-y-0.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between font-mono text-[10.5px]">
                        <span className="font-bold text-amber-900 dark:text-amber-300">
                          Removed: {uh.previousContractor}
                        </span>
                        <span className="text-slate-500">{uh.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                        Reason: {uh.reason}
                      </p>
                      <div className="text-[10.5px] font-mono text-[#73784F] dark:text-[#A4A77E] pt-0.5">
                        Reassigned to: {uh.reassignedTo}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Communications & Activity Log */}
            <div>
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-2.5">
                Communications & Activity Notes
              </h4>

              <div className="space-y-2 mb-3">
                {(selectedCust.notes || []).map((n, i) => (
                  <div
                    key={i}
                    className="water-card p-3.5 rounded-2xl border border-white/80 dark:border-[#383E47] text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between font-mono text-[10.5px] text-[#6D6E71] mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Append internal operator note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1E2227] text-white hover:bg-[#A4A77E] hover:text-[#121417] dark:bg-[#A4A77E] dark:text-[#121417] text-xs font-semibold shadow-sm transition-all"
                >
                  Post Note
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Customer Form Mode */}
        {selectedCust && isEditingCust && custEditForm && (
          <form onSubmit={handleSaveCustEdit} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Personal & Contacts</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={custEditForm.name}
                  onChange={(e) => setCustEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={custEditForm.email}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={custEditForm.phone}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Jobsite Location</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={custEditForm.address}
                  onChange={(e) => setCustEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={custEditForm.city}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={custEditForm.state}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Zip</label>
                  <input
                    type="text"
                    value={custEditForm.zip}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Order & Contractor Assignment</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tonnage</label>
                  <select
                    value={custEditForm.tonnage}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, tonnage: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="2.0 Ton">2.0 Ton</option>
                    <option value="2.5 Ton">2.5 Ton</option>
                    <option value="3.0 Ton">3.0 Ton</option>
                    <option value="4.0 Ton">4.0 Ton</option>
                    <option value="5.0 Ton">5.0 Ton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={custEditForm.installStatus}
                    onChange={(e) => setCustEditForm(prev => ({ ...prev, installStatus: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="In Production">In Production</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Deposit">Pending Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Certified Contractor</label>
                <input
                  type="text"
                  value={custEditForm.assignedContractor}
                  onChange={(e) => setCustEditForm(prev => ({ ...prev, assignedContractor: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </form>
        )}
      </SlideOverPanel>

      {/* Add New Customer Modal */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-lg p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#383E47] mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Create Customer Jobsite Profile
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Registers new customer, system preferences, and initiates batch reservation.
                </p>
              </div>
              <Users className="w-5 h-5 text-[#A4A77E]" />
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stephanie Miller"
                    value={newCustForm.name}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="s.miller@example.com"
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, email: e.target.value }))}
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
                    placeholder="(555) 321-7654"
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="840 Meadow Lane"
                    value={newCustForm.address}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCustForm.city}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newCustForm.state}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={newCustForm.zip}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    System Sizing
                  </label>
                  <select
                    value={newCustForm.tonnage}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, tonnage: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="2.0 Ton">2.0 Ton</option>
                    <option value="2.5 Ton">2.5 Ton</option>
                    <option value="3.0 Ton">3.0 Ton</option>
                    <option value="4.0 Ton">4.0 Ton</option>
                    <option value="5.0 Ton">5.0 Ton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Airflow Configuration
                  </label>
                  <select
                    value={newCustForm.configuration}
                    onChange={(e) => setNewCustForm(prev => ({ ...prev, configuration: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="Upflow Configuration">Upflow Configuration</option>
                    <option value="Downflow Configuration">Downflow Configuration</option>
                    <option value="Horizontal Configuration">Horizontal Configuration</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-[#383E47]">
                <button
                  type="button"
                  onClick={() => setIsAddCustModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Create Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
