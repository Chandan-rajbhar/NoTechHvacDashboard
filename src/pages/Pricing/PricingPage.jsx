import React, { useState } from 'react';
import {
  Tags,
  Check,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Maximize2,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sun,
  Eye,
  RefreshCw,
  Box,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { StatusPill } from '../../components/common/StatusPill';
import { SwatchPicker } from '../../components/common/SwatchPicker';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const PricingPage = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('tonnage');

  const [tonnageList, setTonnageList] = useState(() => MockService.getTonnageOptions());
  const configOptions = MockService.getConfigOptions();
  const [colors, setColors] = useState(() => MockService.getColors());

  // Slide-In Panel & Edit State for Pricing Tiers
  const [selectedTier, setSelectedTier] = useState(null);
  const [isEditingTier, setIsEditingTier] = useState(false);
  const [tierEditForm, setTierEditForm] = useState(null);

  // Add New Pricing Tier Modal
  const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false);
  const [newTierForm, setNewTierForm] = useState({
    tonnage: '3.5',
    basePrice: '6750',
    monthlyPrice: '281',
    coverage: '1,600 – 2,100 sq ft',
    idealFor: 'Custom Multi-Story Residence',
    isPopular: false,
    status: 'Active',
  });

  // Color Spectrum State
  const [previewColor, setPreviewColor] = useState(colors[0]);
  const [isLightModeSimulation, setIsLightModeSimulation] = useState(false);
  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4D5656');

  // Compartment Pricing State
  const [compartments, setCompartments] = useState(() => MockService.getCompartments());
  const [editingComp, setEditingComp] = useState(null);
  const [compEditPrice, setCompEditPrice] = useState('');

  // Table Columns for Tonnage Pricing
  const tonnageColumns = [
    {
      key: 'label',
      label: 'Tonnage Model',
      sortable: true,
      width: '18%',
      render: (val, row) => (
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
            {val}
          </span>
          {row.isPopular && (
            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#A4A77E] text-[#121417] font-bold">
              POPULAR
            </span>
          )}
        </div>
      )
    },
    {
      key: 'basePrice',
      label: 'Base System Price',
      sortable: true,
      width: '18%',
      render: (val) => (
        <span className="font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-white">
          ${Number(val).toLocaleString()}.00
        </span>
      )
    },
    {
      key: 'monthlyPrice',
      label: '0% APR Financing',
      sortable: true,
      width: '18%',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-[#555D50] dark:text-[#A4A77E] tabular-nums">
          ${val} / mo <span className="text-[10px] text-slate-500 font-normal">(24 Mo)</span>
        </span>
      )
    },
    {
      key: 'coverage',
      label: 'Home Coverage',
      sortable: true,
      width: '16%',
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate block">
          {val}
        </span>
      )
    },
    {
      key: 'idealFor',
      label: 'Application',
      width: '20%',
      hideBelowXl: true,
      render: (val) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate block">
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (val, row) => (
        <StatusPill status={row.status || 'Active'} size="xs" />
      )
    }
  ];

  const handleOpenTierEdit = (tier) => {
    setSelectedTier(tier);
    setTierEditForm({
      label: tier.label,
      basePrice: tier.basePrice,
      monthlyPrice: tier.monthlyPrice,
      coverage: tier.coverage,
      idealFor: tier.idealFor,
      isPopular: !!tier.isPopular,
      status: tier.status || 'Active',
    });
    setIsEditingTier(true);
  };

  const handleSaveTierEdit = (e) => {
    e.preventDefault();
    if (!selectedTier || !tierEditForm) return;

    MockService.updateTonnageOption(selectedTier.id, tierEditForm);
    const updated = MockService.getTonnageOptions();
    setTonnageList(updated);
    setSelectedTier(prev => ({ ...prev, ...tierEditForm }));
    setIsEditingTier(false);
    addToast(`Pricing for ${selectedTier.label} updated to $${Number(tierEditForm.basePrice).toLocaleString()}!`, 'success');
  };

  const handleDeleteTier = (id) => {
    if (!window.confirm(`Are you sure you want to remove pricing tier ${id}?`)) return;

    MockService.deleteTonnageOption(id);
    const updated = MockService.getTonnageOptions();
    setTonnageList(updated);
    if (selectedTier?.id === id) {
      setSelectedTier(null);
      setIsEditingTier(false);
    }
    addToast(`Pricing tier removed from catalog`, 'info');
  };

  const handleAddTierSubmit = (e) => {
    e.preventDefault();
    const created = MockService.createTonnageOption({
      tonnage: newTierForm.tonnage,
      label: `${newTierForm.tonnage} Ton`,
      basePrice: Number(newTierForm.basePrice),
      monthlyPrice: Number(newTierForm.monthlyPrice),
      coverage: newTierForm.coverage,
      idealFor: newTierForm.idealFor,
      isPopular: newTierForm.isPopular,
      status: newTierForm.status,
    });

    setTonnageList(MockService.getTonnageOptions());
    setIsAddTierModalOpen(false);
    setNewTierForm({
      tonnage: '3.5',
      basePrice: '6750',
      monthlyPrice: '281',
      coverage: '1,600 – 2,100 sq ft',
      idealFor: 'Custom Multi-Story Residence',
      isPopular: false,
      status: 'Active',
    });
    addToast(`New pricing tier ${created.label} added to matrix!`, 'success');
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    const newEntry = {
      id: newColorName.toLowerCase().replace(/\s+/g, '-'),
      name: newColorName.trim(),
      hex: newColorHex,
      text: '#FFFFFF',
      code: `RAL-${Math.floor(1000 + Math.random() * 8000)}`,
    };

    const updated = [...colors, newEntry];
    setColors(updated);
    MockService.saveColors(updated);
    setIsAddColorModalOpen(false);
    setNewColorName('');
    addToast(`Added ${newEntry.name} (${newEntry.hex}) to COLOR_SPECTRUM!`, 'success');
  };

  const handleDeleteColor = (id) => {
    const updated = colors.filter(c => c.id !== id);
    setColors(updated);
    MockService.saveColors(updated);
    if (previewColor.id === id && updated.length > 0) {
      setPreviewColor(updated[0]);
    }
    addToast(`Color preset removed from spectrum`, 'info');
  };

  const handleSaveCompPrice = (id) => {
    const newPrice = Number(compEditPrice);
    if (!newPrice) return;

    MockService.updateCompartment(id, { price: newPrice });
    setCompartments(MockService.getCompartments());
    setEditingComp(null);
    addToast(`Compartment price updated to $${newPrice}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Pricing & Options"
        subtitle="Manage system pricing matrices, financing terms, and airflow configurations."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddTierModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Add Pricing Tier</span>
            </button>
            <button
              onClick={() => {
                setTonnageList(MockService.getTonnageOptions());
                addToast('Pricing matrices refreshed', 'info');
              }}
              className="p-2.5 rounded-xl water-pill text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/5 pb-2 overflow-x-auto">
        {[
          { id: 'tonnage', label: `Tonnage & Base Pricing (${tonnageList.length} Tiers)` },
          { id: 'config', label: 'Airflow Configurations' },
          { id: 'colors', label: `Color Spectrum (${colors.length} Colors)` },
          { id: 'financing', label: 'Compartment Pricing & Financing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'clean-pill-active'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2B3037]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Tonnage & Pricing Data Table Form */}
      {activeTab === 'tonnage' && (
        <div className="space-y-4 w-full">
          <DataTable
            columns={tonnageColumns}
            data={tonnageList}
            onRowClick={(row) => {
              setSelectedTier(row);
              setIsEditingTier(false);
            }}
            searchPlaceholder="Search tonnage model, coverage, ideal building type..."
            pageSize={10}
            rowActions={(row) => [
              {
                label: 'View Details',
                icon: Eye,
                onClick: () => {
                  setSelectedTier(row);
                  setIsEditingTier(false);
                },
              },
              {
                label: 'Edit Pricing',
                icon: Edit2,
                onClick: () => handleOpenTierEdit(row),
              },
              { divider: true },
              {
                label: 'Delete Tier',
                icon: Trash2,
                variant: 'danger',
                onClick: () => handleDeleteTier(row.id),
                confirmMessage: `Are you sure you want to delete ${row.label}?`,
              },
            ]}
          />
        </div>
      )}

      {/* Slide-In Details & Edit Drawer for Tonnage Pricing */}
      <SlideOverPanel
        isOpen={!!selectedTier}
        onClose={() => {
          setSelectedTier(null);
          setIsEditingTier(false);
        }}
        title={selectedTier ? `${selectedTier.label} HVAC System` : ''}
        subtitle={selectedTier ? `Catalog Tier · Base Price: $${Number(selectedTier.basePrice).toLocaleString()}` : ''}
        idChip={selectedTier ? `TON-${selectedTier.id}` : ''}
        icon={Tags}
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            {!isEditingTier ? (
              <>
                <button
                  type="button"
                  onClick={() => handleDeleteTier(selectedTier.id)}
                  className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  Delete Tier
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTierEdit(selectedTier)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Pricing & Terms</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-mono text-amber-600 font-semibold">Editing Pricing Tier</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTier(false)}
                    className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTierEdit}
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
        {selectedTier && !isEditingTier && (
          <div className="space-y-6">
            {/* Key Pricing Figures */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71]">Base System Price</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
                  ${Number(selectedTier.basePrice).toLocaleString()}.00
                </div>
                <span className="text-[10.5px] text-emerald-600 font-semibold block mt-0.5">Includes full chassis assembly</span>
              </div>
              <div className="p-4 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71]">0% APR Financing</span>
                <div className="text-2xl font-extrabold text-[#555D50] dark:text-[#A4A77E] mt-1 tabular-nums font-mono">
                  ${selectedTier.monthlyPrice} / mo
                </div>
                <span className="text-[10.5px] text-slate-500 block mt-0.5">24 monthly installments</span>
              </div>
            </div>

            {/* Coverage & Architectural Spec */}
            <div className="p-4.5 rounded-2xl water-card space-y-3">
              <span className="text-xs font-mono uppercase text-[#6D6E71] font-bold block">
                Engineering Sizing & Application
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10.5px] font-mono text-[#6D6E71]">Floor Coverage</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedTier.coverage}</div>
                </div>
                <div>
                  <span className="text-[10.5px] font-mono text-[#6D6E71]">Recommended Building</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedTier.idealFor}</div>
                </div>
              </div>
            </div>

            {/* Compartment Cost Breakdown */}
            <div className="p-4.5 rounded-2xl water-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#6D6E71] font-bold">
                  Modular Component Share (4 Modules)
                </span>
                <span className="text-[10.5px] font-mono text-[#A4A77E] font-bold">Factory Calibrated</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">1. Blower & Impeller</span>
                  <span className="font-mono font-bold">$1,250</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">2. Evaporator / Core Coil</span>
                  <span className="font-mono font-bold">$1,650</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">3. Heating & Valving</span>
                  <span className="font-mono font-bold">$1,400</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">4. Inverter & Smart Logic</span>
                  <span className="font-mono font-bold">$2,200</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Tier Form Mode */}
        {selectedTier && isEditingTier && tierEditForm && (
          <form onSubmit={handleSaveTierEdit} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Pricing Figures</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Base System Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={tierEditForm.basePrice}
                    onChange={(e) => {
                      const base = Number(e.target.value);
                      setTierEditForm(prev => ({
                        ...prev,
                        basePrice: e.target.value,
                        monthlyPrice: Math.round(base / 24)
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    0% APR Monthly ($/mo)
                  </label>
                  <input
                    type="number"
                    required
                    value={tierEditForm.monthlyPrice}
                    onChange={(e) => setTierEditForm(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-3">
              <h4 className="font-mono font-bold uppercase text-[#6D6E71] text-[11px]">Specifications</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Model Label
                </label>
                <input
                  type="text"
                  required
                  value={tierEditForm.label}
                  onChange={(e) => setTierEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Floor Coverage Range (sq ft)
                </label>
                <input
                  type="text"
                  required
                  value={tierEditForm.coverage}
                  onChange={(e) => setTierEditForm(prev => ({ ...prev, coverage: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recommended Application / Ideal For
                </label>
                <input
                  type="text"
                  required
                  value={tierEditForm.idealFor}
                  onChange={(e) => setTierEditForm(prev => ({ ...prev, idealFor: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopularCheck"
                  checked={tierEditForm.isPopular}
                  onChange={(e) => setTierEditForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#A4A77E] focus:ring-[#A4A77E]"
                />
                <label htmlFor="isPopularCheck" className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Highlight as Popular Tier (Badge)
                </label>
              </div>
            </div>
          </form>
        )}
      </SlideOverPanel>

      {/* Add New Pricing Tier SlideOverPanel */}
      <SlideOverPanel
        isOpen={isAddTierModalOpen}
        onClose={() => setIsAddTierModalOpen(false)}
        title="Add New Pricing Tier"
        subtitle="Expand the No-Tech HVAC catalog with a new residential tonnage capacity."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddTierModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-tier-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
            >
              Create Pricing Tier
            </button>
          </>
        }
      >
        <form id="add-tier-form" onSubmit={handleAddTierSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tonnage (e.g. 3.5)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={newTierForm.tonnage}
                onChange={(e) => setNewTierForm(prev => ({ ...prev, tonnage: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Base Price ($)
              </label>
              <input
                type="number"
                required
                value={newTierForm.basePrice}
                onChange={(e) => {
                  const base = Number(e.target.value);
                  setNewTierForm(prev => ({
                    ...prev,
                    basePrice: e.target.value,
                    monthlyPrice: Math.round(base / 24)
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Coverage Range (sq ft)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1,600 – 2,100 sq ft"
              value={newTierForm.coverage}
              onChange={(e) => setNewTierForm(prev => ({ ...prev, coverage: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Recommended For
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Multi-level Townhomes, Open Floorplans"
              value={newTierForm.idealFor}
              onChange={(e) => setNewTierForm(prev => ({ ...prev, idealFor: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* TAB 2: Airflow Configurations */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {configOptions.map((cfg) => (
            <div
              key={cfg.id}
              className="water-card water-shine rounded-2xl p-6 border border-white/80 dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl water-pill flex items-center justify-center text-[#555D50] dark:text-[#A4A77E] mb-4">
                  <Layers className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {cfg.label}
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mt-1.5 leading-relaxed">
                  {cfg.desc}
                </p>

                <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100/90 dark:border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#6D6E71] uppercase block">Clearance Requirement</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{cfg.clearance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6D6E71] uppercase block">Line Sizing Standard</span>
                    <span className="text-[#73784F] dark:text-[#A4A77E] font-bold">{cfg.refrigerantSpec}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6D6E71] uppercase block">Assembly Lead-Time</span>
                    <span className="text-slate-700 dark:text-slate-300">{cfg.leadTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100/90 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 font-bold">Standard Offering</span>
                <span className="text-[#6D6E71]">0% Surcharge</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Color Spectrum */}
      {activeTab === 'colors' && (
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
            {/* Left: Interactive Visualizer (7 cols) */}
            <div className="xl:col-span-7 water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                      Exterior Architectural Color Simulation
                    </h3>
                    <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                      Real-time interactive preview of chassis finish
                    </p>
                  </div>

                  <button
                    onClick={() => setIsLightModeSimulation(!isLightModeSimulation)}
                    className="p-2 rounded-xl water-pill text-xs font-mono flex items-center gap-1.5"
                    title="Toggle daylight/ambient lighting"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>{isLightModeSimulation ? 'Daylight 5000K' : 'Warm Ambient'}</span>
                  </button>
                </div>

                {/* Simulated HVAC Unit Chassis */}
                <div
                  className={`w-full h-72 rounded-2xl p-6 flex flex-col justify-between border shadow-inner transition-all duration-300 ${isLightModeSimulation ? 'bg-[#EAEFF4]' : 'bg-[#1A1E24]'
                    }`}
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">
                      NO-TECH MODULAR CHASSIS 2.0-5.0 TON
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 text-white font-bold">
                      {previewColor.code || 'RAL-7021'}
                    </span>
                  </div>

                  {/* Modular Cabinet Face with selected panel color */}
                  <div className="my-auto mx-auto w-full max-w-sm rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-2xl">
                    <div
                      className="h-36 rounded-lg p-4 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden"
                      style={{ backgroundColor: previewColor.hex }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/15 pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <span
                          className="font-mono text-[11px] font-extrabold tracking-wider"
                          style={{ color: previewColor.text || '#FFFFFF' }}
                        >
                          LOCAL INDUSTRIES
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-white">
                          {previewColor.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 relative z-10">
                        {[1, 2, 3, 4].map((num) => (
                          <div
                            key={num}
                            className="bg-black/35 backdrop-blur-xs rounded p-1.5 text-center border border-white/10"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto mb-1 animate-pulse" />
                            <span className="font-mono text-[8px] text-white/90 block">M{num}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Active Selected Color: <strong className="text-white">{previewColor.name}</strong></span>
                    <span>Hex: {previewColor.hex}</span>
                  </div>
                </div>
              </div>

              {/* Swatch Selector Row */}
              <div className="mt-5 pt-4 border-t border-slate-100/90 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#6D6E71]">
                    Hover or Click to Test Palette:
                  </span>
                  <span className="text-xs font-mono text-[#A4A77E]">{colors.length} Color Presets</span>
                </div>
                <SwatchPicker
                  colors={colors}
                  selectedColor={previewColor.hex}
                  onSelectColor={(c) => setPreviewColor(c)}
                  size="lg"
                />
              </div>
            </div>

            {/* Right: Color Table & Controls (5 cols) */}
            <div className="xl:col-span-5 water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Prescribed Color Spectrum
                  </h3>
                  <button
                    onClick={() => setIsAddColorModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#73784F] dark:text-[#A4A77E] hover:underline"
                  >
                    <span>Add Custom Color</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {colors.map((c) => (
                    <div
                      key={c.id}
                      onMouseEnter={() => setPreviewColor(c)}
                      onClick={() => setPreviewColor(c)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${previewColor.hex === c.hex
                        ? 'border-[#A4A77E] bg-[#F8FAF6] dark:bg-[#1E251E]'
                        : 'border-slate-100 dark:border-white/5 hover:bg-white/80 dark:hover:bg-[#22262C]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-lg border border-black/15 dark:border-white/20 flex-shrink-0 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#6D6E71] dark:text-[#8D8E92]">
                            {c.hex} • {c.code || 'Standard'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.isDefault ? (
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full water-pill text-slate-800 dark:text-slate-200 font-bold uppercase">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteColor(c.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                            title="Remove Color"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/90 dark:border-white/5 text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                Dark Gray (#373A3C) is the factory default front panel color for No-Tech HVAC chassis.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Compartment Pricing & Financing */}
      {activeTab === 'financing' && (
        <div className="space-y-6 w-full">
          <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 w-full shadow-water">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Modular Compartment Replacement Pricing Table
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Individual modular replacement costs with hot-swap zero refrigerant loss guarantee.
                </p>
              </div>
              <span className="font-mono text-xs text-[#A4A77E] font-bold">4 Replaceable Modules</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#383E47] bg-[#F4F6F2]/80 dark:bg-[#1E2227]/80 text-[#6D6E71] dark:text-[#8D8E92] font-mono text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3.5 font-bold whitespace-nowrap">Compartment Module</th>
                    <th className="px-5 py-3.5 font-bold whitespace-nowrap">Category</th>
                    <th className="px-5 py-3.5 font-bold whitespace-nowrap">Replacement Cycle</th>
                    <th className="px-5 py-3.5 font-bold whitespace-nowrap">List Price</th>
                    <th className="px-5 py-3.5 font-bold whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-[#2B3037]">
                  {compartments.map((comp) => {
                    const isEditing = editingComp === comp.id;

                    return (
                      <tr key={comp.id} className="hover:bg-[#A4A77E]/8 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {comp.name}
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {comp.category}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {comp.replacementCycle}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {!isEditing ? (
                            <span className="text-sm font-extrabold">${comp.price}.00</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <input
                                type="number"
                                value={compEditPrice}
                                onChange={(e) => setCompEditPrice(e.target.value)}
                                className="w-24 px-2 py-1 rounded-lg border border-[#A4A77E] bg-white dark:bg-[#22262C] text-xs font-mono"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          {!isEditing ? (
                            <button
                              onClick={() => {
                                setEditingComp(comp.id);
                                setCompEditPrice(comp.price);
                              }}
                              className="px-3 py-1 rounded-lg water-pill text-xs font-semibold text-[#555D50] dark:text-[#BFC399] hover:bg-[#A4A77E]/10"
                            >
                              Update Price
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingComp(null)}
                                className="px-2.5 py-1 rounded-lg water-pill text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveCompPrice(comp.id)}
                                className="px-3 py-1 rounded-lg bg-[#A4A77E] text-[#121417] text-xs font-bold font-mono"
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 bg-[#F8FAF6] dark:bg-[#1E241E] w-full">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-2">
              0% APR Structured Financing Options
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mb-4">
              Transparent financing plans for complete modular HVAC systems with no early payoff penalties.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl water-card">
                <div className="font-bold text-slate-900 dark:text-white text-sm">24-Month Plan</div>
                <div className="text-lg font-extrabold text-[#73784F] dark:text-[#A4A77E] mt-1 tabular-nums">$270 / mo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">0.00% APR ($6,500 total)</div>
              </div>
              <div className="p-4 rounded-xl water-card">
                <div className="font-bold text-slate-900 dark:text-white text-sm">48-Month Plan</div>
                <div className="text-lg font-extrabold text-[#73784F] dark:text-[#A4A77E] mt-1 tabular-nums">$149 / mo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">4.99% APR ($7,152 total)</div>
              </div>
              <div className="p-4 rounded-xl water-card">
                <div className="font-bold text-slate-900 dark:text-white text-sm">Modular Swap Plan</div>
                <div className="text-lg font-extrabold text-[#73784F] dark:text-[#A4A77E] mt-1 tabular-nums">$45 / mo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Subscription compartment refresh</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Color Modal */}
      {isAddColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-sm p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono mb-2">
              Add Spectrum Color
            </h3>
            <form onSubmit={handleAddColor} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Color Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tactical Bronze"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hex Color Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    required
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddColorModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Save to Spectrum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
