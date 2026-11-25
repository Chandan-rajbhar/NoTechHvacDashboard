import React, { useState } from 'react';
import {
  Box,
  Wind,
  Snowflake,
  Flame,
  Cpu,
  RefreshCw,
  Edit,
  CheckCircle,
  Tag,
  AlertCircle,
  History,
  ShieldCheck,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  X,
  Layers,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const UnitsPage = () => {
  const { addToast } = useApp();
  const [compartments, setCompartments] = useState(() => MockService.getCompartments());
  const [selectedComp, setSelectedComp] = useState(null);

  // Edit State
  const [isEditingComp, setIsEditingComp] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Add Module Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompData, setNewCompData] = useState({
    name: '',
    shortName: '',
    category: 'Mechanical Subsystem',
    rfidTag: '',
    replacementCycle: '5-7 Years',
    health: 100,
    stockCount: 20,
    price: 850,
    description: '',
    specs: '',
    iconName: 'Box',
  });

  // Edit RFID Modal State
  const [editRfidModalOpen, setEditRfidModalOpen] = useState(false);
  const [newRfidTag, setNewRfidTag] = useState('');

  // Icon mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Wind': return Wind;
      case 'Snowflake': return Snowflake;
      case 'Flame': return Flame;
      case 'Cpu': return Cpu;
      default: return Box;
    }
  };

  const columns = [
    {
      key: 'shortName',
      label: 'Compartment Module',
      sortable: true,
      width: '22%',
      render: (val, row) => {
        const Icon = getIcon(row.iconName);
        return (
          <div className="flex items-center gap-3 truncate">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border water-pill"
              style={{
                color: row.colorAccent || '#A4A77E'
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                {val}
              </div>
              <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
                Compartment {row.id}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: '16%',
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate block font-medium">
          {val}
        </span>
      )
    },
    {
      key: 'rfidTag',
      label: 'RFID Tag Registry',
      sortable: true,
      isMono: true,
      width: '18%',
      render: (val) => (
        <div className="flex items-center gap-1.5 truncate">
          <Tag className="w-3.5 h-3.5 text-[#73784F] dark:text-[#A4A77E] flex-shrink-0" />
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
            {val}
          </span>
        </div>
      )
    },
    {
      key: 'replacementCycle',
      label: 'Replacement Cycle',
      sortable: true,
      width: '14%',
      hideBelowXl: true,
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate block">
          {val}
        </span>
      )
    },
    {
      key: 'health',
      label: 'Health %',
      sortable: true,
      width: '12%',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${val > 90 ? 'bg-[#A4A77E]' : 'bg-[#C2B59B]'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {val}%
          </span>
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

  const handleUpdateRfidSubmit = (e) => {
    e.preventDefault();
    if (!newRfidTag.trim() || !selectedComp) return;

    MockService.updateCompartment(selectedComp.id, {
      rfidTag: newRfidTag.trim(),
    });

    const updated = MockService.getCompartments();
    setCompartments(updated);
    setSelectedComp(prev => ({ ...prev, rfidTag: newRfidTag.trim() }));
    setEditRfidModalOpen(false);
    setNewRfidTag('');
    addToast(`RFID tag for Compartment ${selectedComp.id} updated to ${newRfidTag.trim()}`, 'success');
  };

  const handleSaveCompEdit = (e) => {
    e.preventDefault();
    if (!editFormData || !selectedComp) return;

    MockService.updateCompartment(selectedComp.id, editFormData);
    const updated = MockService.getCompartments();
    setCompartments(updated);
    setSelectedComp(editFormData);
    setIsEditingComp(false);
    addToast(`Specifications for ${editFormData.shortName} updated successfully`, 'success');
  };

  const handleDeleteCompartment = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the hardware registry?`)) {
      const updated = MockService.deleteCompartment(id);
      setCompartments(updated);
      if (selectedComp?.id === id) {
        setSelectedComp(null);
        setIsEditingComp(false);
      }
      addToast(`${name} removed from hardware registry`, 'info');
    }
  };

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!newCompData.name.trim()) return;

    const rfidFinal = newCompData.rfidTag.trim() || `RFID-NT-${Math.floor(1000 + Math.random() * 9000)}-MOD`;
    const created = MockService.createCompartment({
      ...newCompData,
      rfidTag: rfidFinal,
      shortName: newCompData.shortName.trim() || newCompData.name.trim()
    });

    setCompartments(MockService.getCompartments());
    setIsAddModalOpen(false);
    setNewCompData({
      name: '',
      shortName: '',
      category: 'Mechanical Subsystem',
      rfidTag: '',
      replacementCycle: '5-7 Years',
      health: 100,
      stockCount: 20,
      price: 850,
      description: '',
      specs: '',
      iconName: 'Box',
    });
    addToast(`New module "${created.shortName}" registered with RFID ${rfidFinal}`, 'success');
  };

  const IconComp = selectedComp ? getIcon(selectedComp.iconName) : Box;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Units & Compartments"
        subtitle="Modular slide-out hardware registries, RFID tracking, and component replacement cycles."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCompartments(MockService.getCompartments());
                addToast('Hardware registry synchronized', 'info');
              }}
              className="p-2.5 rounded-xl water-pill text-slate-600 dark:text-slate-300"
              title="Refresh Registry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Register Module</span>
            </button>
          </div>
        }
      />

      {/* Summary Cards with Water Shine & Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {compartments.map((comp) => {
          const Icon = getIcon(comp.iconName);
          return (
            <div
              key={comp.id}
              onClick={() => {
                setSelectedComp(comp);
                setIsEditingComp(false);
              }}
              className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 hover:shadow-water-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border water-pill group-hover:scale-105 transition-transform"
                  style={{
                    color: comp.colorAccent || '#A4A77E',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <StatusPill status={comp.status} size="xs" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {comp.shortName}
              </h4>
              <div className="font-mono text-[10.5px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5 truncate">
                {comp.rfidTag}
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-100/90 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-[#6D6E71]">Stock: {comp.stockCount}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{comp.health}% Health</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compartments Data Table (Fluid full width) */}
      <DataTable
        columns={columns}
        data={compartments}
        onRowClick={(row) => {
          setSelectedComp(row);
          setIsEditingComp(false);
        }}
        searchPlaceholder="Search compartment name, RFID tag, specs..."
        pageSize={10}
        rowActions={(row) => [
          {
            label: 'View Specs',
            icon: Eye,
            onClick: () => {
              setSelectedComp(row);
              setIsEditingComp(false);
            },
          },
          {
            label: 'Edit Specs',
            icon: Edit,
            onClick: () => {
              setSelectedComp(row);
              setEditFormData({ ...row });
              setIsEditingComp(true);
            },
          },
          { divider: true },
          {
            label: 'Delete Module',
            icon: Trash2,
            variant: 'danger',
            onClick: () => handleDeleteCompartment(row.id, row.shortName),
            confirmMessage: `Are you sure you want to remove ${row.shortName} from the hardware registry?`,
          },
        ]}
      />

      {/* Slide-In Details Panel */}
      <SlideOverPanel
        isOpen={!!selectedComp}
        onClose={() => {
          setSelectedComp(null);
          setIsEditingComp(false);
        }}
        title={selectedComp ? selectedComp.shortName : ''}
        subtitle={selectedComp ? `Compartment #${selectedComp.id} · ${selectedComp.category}` : ''}
        idChip={selectedComp?.rfidTag}
        icon={IconComp}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => handleDeleteCompartment(selectedComp.id, selectedComp.shortName)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Module</span>
            </button>
            <div className="flex items-center gap-2">
              {!isEditingComp ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setNewRfidTag(selectedComp?.rfidTag || '');
                      setEditRfidModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold water-pill transition-colors shadow-sm"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Quick RFID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingComp(true);
                      setEditFormData({ ...selectedComp });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active transition-colors shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Specs</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingComp(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold water-pill transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCompEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#A4A77E] text-[#121417] hover:bg-[#868962] transition-colors shadow-sm font-mono font-bold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </div>
        }
      >
        {selectedComp && (
          <div className="space-y-6">
            {isEditingComp && editFormData ? (
              <form onSubmit={handleSaveCompEdit} className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-[#A4A77E]/40 bg-[#A4A77E]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-slate-900 dark:text-white">
                      Edit Module Specifications
                    </span>
                    <span className="font-mono text-[10px] text-[#6D6E71]">Local Mech QA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Module Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.shortName}
                        onChange={(e) => setEditFormData({ ...editFormData, shortName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        RFID Tag
                      </label>
                      <input
                        type="text"
                        value={editFormData.rfidTag}
                        onChange={(e) => setEditFormData({ ...editFormData, rfidTag: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Replacement Cycle
                      </label>
                      <input
                        type="text"
                        value={editFormData.replacementCycle}
                        onChange={(e) => setEditFormData({ ...editFormData, replacementCycle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Warehouse Stock Units
                      </label>
                      <input
                        type="number"
                        value={editFormData.stockCount}
                        onChange={(e) => setEditFormData({ ...editFormData, stockCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Component Health %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.health}
                        onChange={(e) => setEditFormData({ ...editFormData, health: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        List Price ($)
                      </label>
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Engineering Description
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hardware Specifications
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.specs}
                      onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl water-card">
                    <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Health Rating</div>
                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                      {selectedComp.health}%
                    </div>
                    <span className="text-[10.5px] text-[#6D6E71]">Zero Defect</span>
                  </div>
                  <div className="p-3.5 rounded-xl water-card">
                    <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Warehouse Stock</div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {selectedComp.stockCount}
                    </div>
                    <span className="text-[10.5px] text-slate-500 font-mono">Sacramento Hub</span>
                  </div>
                  <div className="p-3.5 rounded-xl water-card">
                    <div className="text-[10px] font-mono uppercase text-[#6D6E71]">Module Cost</div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      ${selectedComp.price}
                    </div>
                    <span className="text-[10.5px] text-[#6D6E71]">Modular Unit</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl water-card space-y-2">
                  <span className="text-xs font-mono uppercase text-[#6D6E71] font-bold">
                    Engineering Description
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedComp.description}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white block mb-0.5">
                      Hardware Specifications:
                    </span>
                    <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                      {selectedComp.specs}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl water-card flex flex-col justify-between space-y-2">
                  <span className="text-xs font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                    Maintenance Cycle & Conductor Protocol
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Cycle:</span> {selectedComp.replacementCycle}
                  </p>
                  <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] leading-relaxed">
                    Requires visual and resistance check of male and female conductor terminal blocks on both module and chassis before reactivation.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      <span>Module Swap & Diagnostic Log</span>
                    </h4>
                    <span className="text-[10px] font-mono text-[#6D6E71]">Local Mech Audited</span>
                  </div>

                  <div className="space-y-2">
                    {(selectedComp.swapHistory || []).map((hist, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl water-card text-xs"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{hist.batch}</span>
                          <span className="text-[#6D6E71]">{hist.date}</span>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">
                          {hist.note}
                        </div>
                        <div className="text-[10px] text-[#73784F] dark:text-[#A4A77E] font-mono mt-1">
                          Technician: {hist.tech}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </SlideOverPanel>

      {/* Register New Module / RFID SlideOverPanel */}
      <SlideOverPanel
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Modular Subsystem / RFID Tag"
        subtitle="Add a new modular component into the No-Tech zero-refrigerant-loss hardware catalog."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="register-module-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
            >
              Register Component
            </button>
          </>
        }
      >
        <form id="register-module-form" onSubmit={handleCreateModule} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Module Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dual-Stage Inverter Logic"
                value={newCompData.name}
                onChange={(e) => setNewCompData({ ...newCompData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Tag / Code
              </label>
              <input
                type="text"
                placeholder="e.g. Smart Inverter"
                value={newCompData.shortName}
                onChange={(e) => setNewCompData({ ...newCompData, shortName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category Subsystem
              </label>
              <select
                value={newCompData.category}
                onChange={(e) => setNewCompData({ ...newCompData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              >
                <option value="Mechanical Subsystem">Mechanical Subsystem</option>
                <option value="Thermal & Refrigerant">Thermal & Refrigerant</option>
                <option value="Combustion & Thermal">Combustion & Thermal</option>
                <option value="Electrical & Smart Control">Electrical & Smart Control</option>
                <option value="Filtration & Airflow">Filtration & Airflow</option>
              </select>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                RFID Tracking Identifier
              </label>
              <input
                type="text"
                placeholder="Auto-generated if blank (RFID-NT-...)"
                value={newCompData.rfidTag}
                onChange={(e) => setNewCompData({ ...newCompData, rfidTag: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cycle (Years)
              </label>
              <input
                type="text"
                value={newCompData.replacementCycle}
                onChange={(e) => setNewCompData({ ...newCompData, replacementCycle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Stock Units
              </label>
              <input
                type="number"
                value={newCompData.stockCount}
                onChange={(e) => setNewCompData({ ...newCompData, stockCount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={newCompData.price}
                onChange={(e) => setNewCompData({ ...newCompData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Engineering Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe module role, quick-disconnect valves, and chassis interface..."
              value={newCompData.description}
              onChange={(e) => setNewCompData({ ...newCompData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hardware Specifications
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Conductor terminal bus interface; auto-isolation sealing."
              value={newCompData.specs}
              onChange={(e) => setNewCompData({ ...newCompData, specs: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* Edit RFID Modal */}
      {editRfidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-sm p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono mb-2">
              Update Compartment RFID
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mb-4">
              Assign or update the unique RFID tracking chip for Compartment {selectedComp?.id}.
            </p>

            <form onSubmit={handleUpdateRfidSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  RFID Tag Identifier
                </label>
                <input
                  type="text"
                  required
                  value={newRfidTag}
                  onChange={(e) => setNewRfidTag(e.target.value)}
                  placeholder="RFID-NT-XXXX-XXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditRfidModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Save Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
