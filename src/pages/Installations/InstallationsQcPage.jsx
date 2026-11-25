import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Camera,
  Thermometer,
  Wind,
  ShieldCheck,
  Flag,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const InstallationsQcPage = () => {
  const { addToast } = useApp();
  const [jobs, setJobs] = useState(() => MockService.getJobs());
  const [flags, setFlags] = useState(() => MockService.getFlags());
  const [selectedJob, setSelectedJob] = useState(null);

  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const columns = [
    {
      key: 'id',
      label: 'Job ID',
      sortable: true,
      isMono: true,
      width: '11%',
    },
    {
      key: 'customerName',
      label: 'Customer & Address',
      sortable: true,
      width: '22%',
      render: (val, row) => (
        <div className="truncate">
          <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
            {row.address}
          </div>
        </div>
      )
    },
    {
      key: 'contractorName',
      label: 'Technician',
      sortable: true,
      width: '17%',
      render: (val) => (
        <span className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate block">
          {val}
        </span>
      )
    },
    {
      key: 'scheduledDate',
      label: 'Date & Slot',
      sortable: true,
      width: '15%',
      render: (val, row) => (
        <div className="text-xs truncate">
          <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{val}</div>
          <div className="text-[10px] text-[#6D6E71] truncate">{row.timeSlot}</div>
        </div>
      )
    },
    {
      key: 'completionData',
      label: 'Delta T & Airflow',
      width: '15%',
      hideBelowXl: true,
      render: (val) => {
        if (!val) return <span className="text-xs text-slate-400 font-mono">Pending Completion</span>;
        return (
          <div className="font-mono text-xs truncate">
            <span className="font-bold text-slate-900 dark:text-white">ΔT: {val.tempDelta || (val.returnTemp - val.supplyTemp).toFixed(1)}°F</span>
            <span className="text-[10px] text-[#6D6E71] ml-1.5">• {val.airflowCfm} CFM</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Job Status',
      sortable: true,
      width: '10%',
      isStatus: true,
    }
  ];

  const handleMarkReviewed = () => {
    if (!selectedJob) return;

    const certId = `LM-QC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    MockService.updateJob(selectedJob.id, {
      submittedToLocalMechanical: true,
      localMechanicalCertId: certId,
      status: 'Completed',
      qcReviewStatus: 'Approved by Local Mechanical'
    });

    setJobs(MockService.getJobs());
    setSelectedJob(prev => ({
      ...prev,
      submittedToLocalMechanical: true,
      localMechanicalCertId: certId,
      status: 'Completed',
      qcReviewStatus: 'Approved by Local Mechanical'
    }));
    addToast(`Installation certified under Local Mechanical QC #${certId}!`, 'success');
  };

  const handleFlagIssueSubmit = (e) => {
    e.preventDefault();
    if (!flagReason.trim() || !selectedJob) return;

    MockService.updateJob(selectedJob.id, {
      status: 'Flagged Issue',
      flagged: true,
      flagReason: flagReason.trim(),
      qcReviewStatus: 'Correction Required'
    });

    setJobs(MockService.getJobs());
    setSelectedJob(prev => ({
      ...prev,
      status: 'Flagged Issue',
      flagged: true,
      flagReason: flagReason.trim(),
      qcReviewStatus: 'Correction Required'
    }));
    setFlagModalOpen(false);
    setFlagReason('');
    addToast('Installation flagged. Notice dispatched to contractor for correction.', 'error');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Installations & Quality Control"
        subtitle="RFID validation logs, temperature differentials, and quality inspection sign-offs."
      />

      {/* Installations Table (Fluid full width) */}
      <DataTable
        columns={columns}
        data={jobs}
        onRowClick={(row) => setSelectedJob(row)}
        searchPlaceholder="Search Job ID, customer, contractor, address..."
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'View Validation Log',
            icon: Eye,
            onClick: () => setSelectedJob(row),
          },
          {
            label: 'Mark QC Approved',
            icon: CheckCircle,
            onClick: () => {
              const certId = `LM-QC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
              MockService.updateJob(row.id, {
                submittedToLocalMechanical: true,
                localMechanicalCertId: certId,
                status: 'Completed',
                qcReviewStatus: 'Approved by Local Mechanical'
              });
              setJobs(MockService.getJobs());
              addToast(`Installation ${row.id} approved under QC #${certId}`, 'success');
            },
          },
          { divider: true },
          {
            label: 'Flag Deficiency',
            icon: Flag,
            variant: 'danger',
            onClick: () => {
              setSelectedJob(row);
              setFlagModalOpen(true);
            },
          },
        ]}
      />

      {/* Slide-In QC Review Panel */}
      <SlideOverPanel
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `QC Job: ${selectedJob.id}` : ''}
        subtitle={selectedJob ? `${selectedJob.customerName} · ${selectedJob.jobType}` : ''}
        idChip={selectedJob?.localMechanicalCertId || selectedJob?.batchNumber}
        icon={ClipboardCheck}
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2.5">
            <span className="text-xs font-mono text-[#6D6E71]">
              Status: {selectedJob?.qcReviewStatus || 'Pending'}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setFlagModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Flag Deficiency</span>
              </button>
              <button
                type="button"
                onClick={handleMarkReviewed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark QC Approved</span>
              </button>
            </div>
          </div>
        }
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl water-card space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  Quality Control Status
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                "Installation validated and submitted to Local Mechanical for quality control review."
              </p>
              {selectedJob.localMechanicalCertId && (
                <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  Official Quality Certificate Issued: {selectedJob.localMechanicalCertId}
                </div>
              )}
            </div>

            {selectedJob.completionData && (
              <div>
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-2.5">
                  Handover Temperature & Airflow Telemetry
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3.5 rounded-xl water-card">
                    <span className="text-[10px] font-mono text-[#6D6E71] block">Return Temp</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {selectedJob.completionData.returnTemp}°F
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl water-card">
                    <span className="text-[10px] font-mono text-[#6D6E71] block">Supply Temp</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {selectedJob.completionData.supplyTemp}°F
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl water-card">
                    <span className="text-[10px] font-mono text-[#6D6E71] block">Delta ΔT</span>
                    <span className={`text-base font-extrabold tabular-nums ${selectedJob.completionData.tempDelta >= 15 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedJob.completionData.tempDelta}°F
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl water-card">
                    <span className="text-[10px] font-mono text-[#6D6E71] block">Airflow CFM</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {selectedJob.completionData.airflowCfm}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedJob.completionData && (
              <div className="p-4 rounded-xl water-card space-y-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                  Safety Inspection & Conductor Checks
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedJob.completionData.conductorCheck}
                </p>
                <div className="flex items-center gap-4 font-mono text-[11px] text-[#6D6E71]">
                  <span>Gas Leak PPM: <strong>{selectedJob.completionData.gasPpmLeak} ppm (Zero PPM standard)</strong></span>
                  <span>•</span>
                  <span>Photos: <strong>{selectedJob.completionData.photosUploaded} uploaded</strong></span>
                </div>
              </div>
            )}

            {selectedJob.completionData?.rfidLog && (
              <div className="p-4 rounded-xl water-card space-y-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71]">
                  RFID Dual Scan Log
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-500 block">Removed Tag:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedJob.completionData.rfidLog.oldTag}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#EBF1E8] dark:bg-[#1E271E]">
                    <span className="text-[10px] text-[#465B43] dark:text-[#BFC399] block">Inserted Tag:</span>
                    <span className="font-bold text-[#3F4F3B] dark:text-[#BFC399]">
                      {selectedJob.completionData.rfidLog.newTag}
                    </span>
                  </div>
                </div>
                <div className="text-[10.5px] text-[#6D6E71] font-mono pt-1">
                  Timestamp: {selectedJob.completionData.rfidLog.timestamp} by {selectedJob.completionData.rfidLog.scannedBy}
                </div>
              </div>
            )}

            {selectedJob.completionData?.photos && (
              <div>
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-2">
                  Installation Proof Photos ({selectedJob.completionData.photos.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedJob.completionData.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Jobsite validation photo"
                      className="w-full h-32 rounded-xl object-cover border border-slate-200 dark:border-[#383E47]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SlideOverPanel>

      {/* Flag Issue Reason Modal */}
      {flagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-sm p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-red-600 uppercase font-mono mb-2">
              Flag Installation Issue
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mb-3">
              Describe the deficiency (e.g. low temperature delta, unverified line sizing, missing photos).
            </p>

            <form onSubmit={handleFlagIssueSubmit} className="space-y-3 text-xs">
              <textarea
                required
                rows={3}
                placeholder="Enter QC violation details..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFlagModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
