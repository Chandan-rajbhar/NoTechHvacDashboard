import React, { useState } from 'react';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  FileCode,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Upload,
  Calendar,
  Lock,
  Download,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const DataRoomPage = () => {
  const { addToast } = useApp();
  const [documents, setDocuments] = useState(() => MockService.getDataRoomDocuments());

  // SlideOver drawer states
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [replacingDoc, setReplacingDoc] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
  });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    size: '2.4 MB',
    visibility: 'All Investors',
    fileName: '',
    updatedOn: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  });

  const [replaceFileName, setReplaceFileName] = useState('');
  const [replaceFileSize, setReplaceFileSize] = useState('3.2 MB');

  const getFileIcon = (type) => {
    switch (type) {
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'DOCX':
        return <FileCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'PDF':
      default:
        return <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
  };

  const handleOpenUpload = () => {
    setFormData({
      title: '',
      description: '',
      type: 'PDF',
      size: '2.4 MB',
      visibility: 'All Investors',
      fileName: 'document_file.pdf',
      updatedOn: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    setIsUploadDrawerOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      size: doc.size,
      visibility: doc.visibility,
      fileName: doc.fileName,
      updatedOn: doc.updatedOn,
    });
    setViewingDoc(null);
  };

  const handleOpenReplace = (doc) => {
    setReplacingDoc(doc);
    setReplaceFileName(`updated_${doc.fileName}`);
    setReplaceFileSize('2.8 MB');
    setViewingDoc(null);
  };

  const handleSaveUpload = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const created = MockService.createDocument({
      ...formData,
      fileName: formData.fileName || `${formData.title.toLowerCase().replace(/\s+/g, '_')}.${formData.type.toLowerCase()}`,
    });
    setDocuments(MockService.getDataRoomDocuments());
    setIsUploadDrawerOpen(false);
    addToast(`Document "${created.title}" uploaded to data room`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    MockService.updateDocument(editingDoc.id, {
      ...formData,
    });
    setDocuments(MockService.getDataRoomDocuments());
    setEditingDoc(null);
    addToast(`Document "${formData.title}" updated`, 'success');
  };

  const handleSaveReplace = (e) => {
    e.preventDefault();
    if (!replacingDoc) return;

    const today = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    MockService.updateDocument(replacingDoc.id, {
      fileName: replaceFileName,
      size: replaceFileSize,
      updatedOn: today,
    });

    setDocuments(MockService.getDataRoomDocuments());
    setReplacingDoc(null);
    addToast(`File asset for "${replacingDoc.title}" replaced successfully`, 'success');
  };

  const handleDelete = (doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.title}" from the data room?`)) return;

    MockService.deleteDocument(doc.id);
    setDocuments(MockService.getDataRoomDocuments());
    if (viewingDoc?.id === doc.id) setViewingDoc(null);
    if (editingDoc?.id === doc.id) setEditingDoc(null);
    if (replacingDoc?.id === doc.id) setReplacingDoc(null);
    addToast(`Document "${doc.title}" removed`, 'info');
  };

  // Columns definition
  const columns = [
    {
      key: 'title',
      label: 'Document',
      sortable: true,
      width: '36%',
      render: (val, row) => (
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            {getFileIcon(row.type)}
          </div>
          <div className="min-w-0 truncate">
            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {val}
            </div>
            <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate mt-0.5">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      width: '12%',
      render: (val) => (
        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      sortable: true,
      width: '14%',
      hideOnMobile: true,
      render: (val) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'updatedOn',
      label: 'Last Updated',
      sortable: true,
      width: '18%',
      hideBelowXl: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'visibility',
      label: 'Visibility',
      sortable: true,
      width: '20%',
      isStatus: true,
    },
  ];

  const filterOptions = [
    {
      key: 'type',
      label: 'All Document Types',
      options: [
        { label: 'All Document Types', value: 'all' },
        { label: 'PDF Documents', value: 'PDF' },
        { label: 'XLSX Models', value: 'XLSX' },
        { label: 'DOCX Briefs', value: 'DOCX' },
      ],
    },
  ];

  const getRowActions = (row) => [
    {
      label: 'View Details',
      icon: Eye,
      onClick: () => setViewingDoc(row),
    },
    {
      label: 'Edit Details',
      icon: Edit2,
      onClick: () => handleOpenEdit(row),
    },
    {
      label: 'Replace File',
      icon: Upload,
      onClick: () => handleOpenReplace(row),
    },
    { divider: true },
    {
      label: 'Delete Document',
      icon: Trash2,
      variant: 'danger',
      onClick: () => handleDelete(row),
      confirmMessage: `Are you sure you want to delete "${row.title}"?`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Data Room"
        subtitle="Documents available to investors."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => {
                setDocuments(MockService.getDataRoomDocuments());
                addToast('Data room documents refreshed', 'info');
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
        data={documents}
        onRowClick={(row) => setViewingDoc(row)}
        searchPlaceholder="Search document title, description, file..."
        filters={filterOptions}
        activeFilters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        pageSize={8}
        rowActions={getRowActions}
      />

      {/* SlideOver Panel: View Details */}
      <SlideOverPanel
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        title={viewingDoc ? viewingDoc.title : ''}
        subtitle={viewingDoc ? viewingDoc.description : ''}
        idChip={viewingDoc?.id}
        icon={Folder}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => {
                if (viewingDoc) handleDelete(viewingDoc);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenReplace(viewingDoc)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#383E47] text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(viewingDoc)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        }
      >
        {viewingDoc && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  {getFileIcon(viewingDoc.type)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {viewingDoc.title}
                  </h4>
                  <p className="font-mono text-slate-500 text-[11px]">{viewingDoc.fileName}</p>
                </div>
              </div>
              <StatusPill status={viewingDoc.visibility} size="sm" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-3">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Document Metadata
              </span>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{viewingDoc.type}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">File Size:</span>
                <span className="font-mono text-slate-900 dark:text-white">{viewingDoc.size}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#2B3037]">
                <span className="text-slate-500">Last Updated:</span>
                <span className="font-mono text-slate-900 dark:text-white">{viewingDoc.updatedOn}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Investor App Visibility:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {viewingDoc.visibility}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-1.5">
              <span className="font-mono uppercase text-[10.5px] font-bold text-slate-500 block">
                Description
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1E2227]/50 p-2.5 rounded-lg border border-slate-100 dark:border-[#2B3037]">
                {viewingDoc.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Download Simulated Asset</span>
                <span className="text-[11px] text-slate-500">Available to {viewingDoc.visibility.toLowerCase()}</span>
              </div>
              <button
                type="button"
                onClick={() => addToast(`Downloaded ${viewingDoc.fileName}`, 'info')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* SlideOver Panel: Upload Document */}
      <SlideOverPanel
        isOpen={isUploadDrawerOpen}
        onClose={() => setIsUploadDrawerOpen(false)}
        title="Upload Document"
        subtitle="Add a financial model, presentation, or regulatory filing to the data room."
        icon={Upload}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsUploadDrawerOpen(false)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="upload-doc-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Upload Document
            </button>
          </div>
        }
      >
        <form id="upload-doc-form" onSubmit={handleSaveUpload} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Series A Pitch Deck (2026)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of document content, slides, or model horizons..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Type
              </label>
              <CustomSelect
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full font-mono"
                size="lg"
              >
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
                <option value="DOCX">DOCX</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Investor Visibility
              </label>
              <CustomSelect
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="All Investors">All Investors</option>
                <option value="Verified Only">Verified Only</option>
                <option value="Hidden">Hidden</option>
              </CustomSelect>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Simulated File Name
              </label>
              <input
                type="text"
                placeholder="pitch_deck_v2.pdf"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                File Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Updated On Date
            </label>
            <input
              type="text"
              value={formData.updatedOn}
              onChange={(e) => setFormData({ ...formData, updatedOn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* SlideOver Panel: Edit Document */}
      <SlideOverPanel
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        title={editingDoc ? `Edit: ${editingDoc.title}` : ''}
        subtitle="Update document title, description, and visibility parameters."
        idChip={editingDoc?.id}
        icon={Edit2}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setEditingDoc(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-doc-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Changes
            </button>
          </div>
        }
      >
        <form id="edit-doc-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Type
              </label>
              <CustomSelect
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full font-mono"
                size="lg"
              >
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
                <option value="DOCX">DOCX</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Investor Visibility
              </label>
              <CustomSelect
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full"
                size="lg"
              >
                <option value="All Investors">All Investors</option>
                <option value="Verified Only">Verified Only</option>
                <option value="Hidden">Hidden</option>
              </CustomSelect>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                File Name
              </label>
              <input
                type="text"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                File Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </form>
      </SlideOverPanel>

      {/* SlideOver Panel: Replace File */}
      <SlideOverPanel
        isOpen={!!replacingDoc}
        onClose={() => setReplacingDoc(null)}
        title={replacingDoc ? `Replace File: ${replacingDoc.title}` : ''}
        subtitle="Upload a revised file version to replace the existing asset."
        idChip={replacingDoc?.id}
        icon={Upload}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setReplacingDoc(null)}
              className="px-4 py-2 rounded-xl water-pill text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="replace-doc-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Confirm Replacement
            </button>
          </div>
        }
      >
        <form id="replace-doc-form" onSubmit={handleSaveReplace} className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#383E47] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current Asset:</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold">{replacingDoc?.fileName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current Size:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{replacingDoc?.size}</span>
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              New File Name *
            </label>
            <input
              type="text"
              required
              value={replaceFileName}
              onChange={(e) => setReplaceFileName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              New File Size
            </label>
            <input
              type="text"
              required
              value={replaceFileSize}
              onChange={(e) => setReplaceFileSize(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
