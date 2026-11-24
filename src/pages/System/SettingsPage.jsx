import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  ShieldCheck,
  Bell,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { NoTechWordmarkEst2022, LocalMechanicalBadge } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const SettingsPage = () => {
  const { addToast } = useApp();
  const [settings, setSettings] = useState(() => MockService.getSettings());

  const handleSave = (e) => {
    e.preventDefault();
    MockService.updateSettings(settings);
    addToast('Console configuration and brand settings saved!', 'success');
  };

  const handleResetFactory = () => {
    if (window.confirm('Reset all mock data, batches, and approvals to initial demo defaults?')) {
      MockService.resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Settings"
        subtitle="Console configuration, brand tokens, and regional quota limits."
      />

      <form onSubmit={handleSave} className="space-y-6 text-xs w-full">
        {/* Brand & Wordmark Identity */}
        <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100/90 dark:border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                Brand & Regulatory Entity Identity
              </h3>
              <p className="text-[#6D6E71] dark:text-[#8D8E92] mt-0.5">
                Prescribed logos and brand identity assets
              </p>
            </div>
            <NoTechWordmarkEst2022 />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                System Brand Name
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Parent Company
              </label>
              <input
                type="text"
                value={settings.parentCompany}
                onChange={(e) => setSettings({ ...settings, parentCompany: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Reservation Fee & Quotas */}
        <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
            Reservation Fees & Regional Quotas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reservation Fee Amount ($)
              </label>
              <input
                type="number"
                value={settings.reservationFeeAmount}
                onChange={(e) => setSettings({ ...settings, reservationFeeAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                NorCal Hub Monthly Quota
              </label>
              <input
                type="number"
                value={settings.regionalHubQuota}
                onChange={(e) => setSettings({ ...settings, regionalHubQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Pass Threshold
              </label>
              <input
                type="number"
                value={settings.minPassScoreQuestionnaire}
                onChange={(e) => setSettings({ ...settings, minPassScoreQuestionnaire: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] font-mono text-slate-900 dark:text-white tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Local Mechanical Compliance Toggles */}
        <div className="water-card rounded-2xl p-6 border border-white/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
              Local Mechanical Compliance Rules
            </h3>
            <LocalMechanicalBadge />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireCoILocalMechanicalListed}
                onChange={(e) => setSettings({ ...settings, requireCoILocalMechanicalListed: e.target.checked })}
                className="rounded text-[#A4A77E] focus:ring-[#A4A77E] w-4 h-4"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Require Certificate of Insurance to list Local Mechanical before approval
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDisallowUnregisteredRFID}
                onChange={(e) => setSettings({ ...settings, autoDisallowUnregisteredRFID: e.target.checked })}
                className="rounded text-[#A4A77E] focus:ring-[#A4A77E] w-4 h-4"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Enforce RFID dual-scan completion before job certificate sign-off
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetFactory}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl clean-pill-active font-semibold shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
