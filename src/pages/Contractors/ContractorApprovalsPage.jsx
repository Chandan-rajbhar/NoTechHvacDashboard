import React, { useState } from 'react';
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Eye,
  Check,
  X,
  Send,
  Building,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { DocumentVerifyRow } from '../../components/common/DocumentVerifyRow';
import { LocalMechanicalBadge, ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const ContractorApprovalsPage = () => {
  const { addToast } = useApp();
  const [approvals, setApprovals] = useState(() => MockService.getApprovals());
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
  });

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const columns = [
    {
      key: 'id',
      label: 'App ID',
      sortable: true,
      isMono: true,
      width: '11%',
    },
    {
      key: 'contractorName',
      label: 'Applicant & Company',
      sortable: true,
      width: '25%',
      render: (val, row) => (
        <div className="truncate">
          <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
            {val}
          </div>
          <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
            {row.company}
          </div>
        </div>
      )
    },
    {
      key: 'region',
      label: 'Territory',
      sortable: true,
      width: '18%',
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 truncate block font-medium">
          {val}
        </span>
      )
    },
    {
      key: 'submittedDate',
      label: 'Submitted',
      sortable: true,
      isMono: true,
      width: '12%',
      hideBelowXl: true,
    },
    {
      key: 'questionnaireScore',
      label: 'Assessment',
      sortable: true,
      width: '14%',
      render: (val) => (
        <span className={`font-mono text-xs font-bold ${
          val >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
        }`}>
          {val}/10 {val >= 8 ? '(Passed)' : '(Failed)'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '11%',
      isStatus: true,
    }
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'All Queue Statuses',
      options: [
        { label: 'Submitted', value: 'Submitted' },
        { label: 'In Review', value: 'In Review' },
        { label: 'Needs Info', value: 'Needs Info' },
        { label: 'Approved', value: 'Approved' },
      ]
    }
  ];

  const handleToggleDocVerify = (docId) => {
    if (!selectedApp) return;

    const updatedDocs = selectedApp.documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          verified: !d.verified,
          verifiedAt: !d.verified ? new Date().toISOString().split('T')[0] : null
        };
      }
      return d;
    });

    const allDone = updatedDocs.every(d => d.verified);
    const updatedApp = {
      ...selectedApp,
      documents: updatedDocs,
      allVerified: allDone
    };

    MockService.updateApproval(selectedApp.id, {
      documents: updatedDocs,
      allVerified: allDone,
    });

    setSelectedApp(updatedApp);
    setApprovals(MockService.getApprovals());
    addToast('Document verification status updated', 'info');
  };

  const handleApprove = () => {
    if (!selectedApp) return;

    const updatedList = MockService.approveContractor(selectedApp.id);
    setApprovals(updatedList);
    const approved = updatedList.find(a => a.id === selectedApp.id);
    setSelectedApp(approved);
    addToast(`Contractor approved! Issued certificate ${approved.certificateId}`, 'success');
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim() || !selectedApp) return;

    MockService.updateApproval(selectedApp.id, {
      status: 'Rejected',
      statusNotes: `Application rejected by Local Mechanical: ${rejectReason.trim()}`,
    });

    setApprovals(MockService.getApprovals());
    setSelectedApp(prev => ({
      ...prev,
      status: 'Rejected',
      statusNotes: `Application rejected by Local Mechanical: ${rejectReason.trim()}`,
    }));
    setRejectModalOpen(false);
    setRejectReason('');
    addToast('Application rejected with audit trail feedback', 'error');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Contractor Approvals"
        subtitle="Review licensing credentials and verify installer compliance documentation."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setApprovals(MockService.getApprovals());
                addToast('Approvals queue refreshed', 'info');
              }}
              className="p-2.5 rounded-xl water-pill text-slate-600 dark:text-slate-300"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Approvals Data Table (Full Width) */}
      <DataTable
        columns={columns}
        data={approvals}
        onRowClick={(row) => setSelectedApp(row)}
        searchPlaceholder="Search contractor name, company, license #..."
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={(k, v) => setActiveFilters(prev => ({ ...prev, [k]: v }))}
        pageSize={8}
        rowActions={(row) => [
          {
            label: 'Review Documents',
            icon: Eye,
            onClick: () => setSelectedApp(row),
          },
          {
            label: 'Approve Contractor',
            icon: Check,
            onClick: () => {
              MockService.approveContractor(row.id);
              setApprovals(MockService.getApprovals());
              addToast(`Contractor ${row.contractorName} approved by Local Mechanical`, 'success');
            },
          },
          { divider: true },
          {
            label: 'Reject Application',
            icon: X,
            variant: 'danger',
            onClick: () => {
              setSelectedApp(row);
              setRejectModalOpen(true);
            },
          },
        ]}
      />

      {/* Slide-In Verification Panel */}
      <SlideOverPanel
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp ? selectedApp.contractorName : ''}
        subtitle={selectedApp ? `${selectedApp.company} · ${selectedApp.region}` : ''}
        idChip={selectedApp?.id}
        icon={UserCheck}
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">
              Submitted: {selectedApp?.submittedDate}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Reject with Reason
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active shadow-sm transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve by Local Mechanical</span>
              </button>
            </div>
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl water-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#465B43] dark:text-[#BFC399] font-bold">
                  Local Mechanical Review State
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <StatusPill status={selectedApp.status} size="md" />
                  {selectedApp.certificateId && (
                    <span className="font-mono text-xs font-extrabold text-[#555D50] dark:text-[#BFC399]">
                      Cert #{selectedApp.certificateId}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-1">
                  {selectedApp.statusNotes}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71] font-bold">
                  Training Video Status
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% Completed</span>
                </div>
                <p className="text-[10.5px] text-[#6D6E71] mt-0.5">Modular installation & servicing</p>
              </div>

              <div className="p-3.5 rounded-xl water-card">
                <span className="text-[10px] font-mono uppercase text-[#6D6E71] font-bold">
                  Installation Assessment
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                  <span>Score: {selectedApp.questionnaireScore} / 10</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-sans">
                    (Passed &gt;= 80%)
                  </span>
                </div>
                <p className="text-[10.5px] text-[#6D6E71] mt-0.5">10 questions covering 2'x6', RFID, CFM</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  5 Mandatory Regulatory Documents
                </h4>
                <span className="text-[10.5px] font-mono text-[#A4A77E]">Local Mech Endorsement Required</span>
              </div>

              <div className="space-y-2.5">
                {(selectedApp.documents || []).map((doc) => (
                  <DocumentVerifyRow
                    key={doc.id}
                    doc={doc}
                    onToggleVerify={handleToggleDocVerify}
                    onViewDoc={(d) => setPreviewDoc(d)}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl water-card space-y-1.5 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6D6E71] block">
                Applicant Contact & Depot
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Phone: {selectedApp.phone} • Email: {selectedApp.email}
              </p>
              <p className="text-[#6D6E71] dark:text-[#8D8E92]">
                Regional Hub: {selectedApp.region}
              </p>
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* Document Preview Lightbox Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-lg p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#73784F] dark:text-[#A4A77E]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {previewDoc.name}
                </h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-[#22262C] text-xs font-mono space-y-2 mb-4 border">
              <div><strong>File Name:</strong> {previewDoc.file}</div>
              <div><strong>Specification Type:</strong> {previewDoc.type}</div>
              <div><strong>Verification Status:</strong> {previewDoc.verified ? 'Verified ✓' : 'Pending'}</div>
              {previewDoc.notes && (
                <div className="text-amber-600 dark:text-amber-400">
                  <strong>Auditor Note:</strong> {previewDoc.notes}
                </div>
              )}
            </div>

            <div className="h-40 rounded-xl water-card flex flex-col items-center justify-center text-center p-4">
              <ShieldCheck className="w-8 h-8 text-[#A4A77E] mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Official Document Preview Verified
              </p>
              <p className="text-[11px] text-slate-500">
                Local Mechanical listed on certificate & aggregate coverage checked.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 rounded-xl clean-pill-active text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject with Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-sm p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase font-mono mb-2">
              Reject Contractor Application
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mb-3">
              State the specific compliance deficiency per Local Mechanical rules (e.g. missing COI endorsement or incorrect line sizing score).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <textarea
                required
                rows={3}
                placeholder="Enter formal rejection rationale..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
