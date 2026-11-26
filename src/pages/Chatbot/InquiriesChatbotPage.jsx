import React, { useState } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  Edit2,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  User,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Eye,
  RotateCcw,
  ChevronDown,
  Clock,
  PlayCircle,
  Filter,
  UserCheck,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const InquiriesChatbotPage = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'faq-editor' | 'test-sim'

  // Inquiries State
  const [inquiries, setInquiries] = useState(() => MockService.getInquiries());
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [inquiryFilters, setInquiryFilters] = useState({});

  // Edit Inquiry Modal State
  const [isEditingInquiry, setIsEditingInquiry] = useState(false);
  const [editInquiryForm, setEditInquiryForm] = useState({
    topic: '',
    fromName: '',
    fromEmail: '',
    role: 'Customer',
    priority: 'Medium',
    status: 'Open',
    message: '',
  });

  // Add New Inquiry Ticket State
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);
  const [newInquiryData, setNewInquiryData] = useState({
    topic: '',
    fromName: '',
    fromEmail: '',
    role: 'Customer',
    priority: 'Medium',
    message: '',
  });

  // Chatbot Suggestions & FAQ Editor State
  const [suggestions, setSuggestions] = useState(() => MockService.getChatbotSuggestions());
  const [responses, setResponses] = useState(() => MockService.getChatbotResponses());
  const [faqFilters, setFaqFilters] = useState({});

  // Add FAQ Modal State
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [newFaqData, setNewFaqData] = useState({
    label: '',
    role: 'Customer',
    query: '',
    reply: '',
    navPath: '',
  });

  // Edit FAQ Modal State
  const [editingFaq, setEditingFaq] = useState(null);
  const [editFaqData, setEditFaqData] = useState({
    label: '',
    role: 'Customer',
    query: '',
    reply: '',
    navPath: '',
  });

  // Live Simulator State
  const [simMessages, setSimMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am the No-Tech HVAC & Local Mechanical Virtual Assistant. How can I assist you with reservations, modular compartment swaps, or contractor onboarding today?"
    }
  ]);
  const [simInput, setSimInput] = useState('');

  // ---------------- Handlers for Inquiries ----------------

  const handleStatusChange = (inquiryId, newStatus) => {
    MockService.updateInquiryStatus(inquiryId, newStatus);
    const updated = MockService.getInquiries();
    setInquiries(updated);
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
    }
    addToast(`Ticket ${inquiryId} marked as ${newStatus}`, 'success');
  };

  const handleInquiryReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    MockService.addInquiryReply(selectedInquiry.id, replyText.trim());
    setInquiries(MockService.getInquiries());
    setSelectedInquiry(prev => ({
      ...prev,
      status: 'In Progress',
      replies: [
        ...(prev.replies || []),
        { author: 'Admin Operations', text: replyText.trim(), date: new Date().toLocaleString() }
      ]
    }));
    setReplyText('');
    addToast('Reply dispatched to customer ticket', 'success');
  };

  const handleOpenEditInquiry = (inq) => {
    setSelectedInquiry(inq);
    setEditInquiryForm({
      topic: inq.topic || '',
      fromName: inq.fromName || '',
      fromEmail: inq.fromEmail || '',
      role: inq.role || 'Customer',
      priority: inq.priority || 'Medium',
      status: inq.status || 'Open',
      message: inq.message || '',
    });
    setIsEditingInquiry(true);
  };

  const handleSaveInquiryEdit = (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    MockService.updateInquiry(selectedInquiry.id, editInquiryForm);
    const updated = MockService.getInquiries();
    setInquiries(updated);
    setSelectedInquiry(prev => ({ ...prev, ...editInquiryForm }));
    setIsEditingInquiry(false);
    addToast(`Inquiry ${selectedInquiry.id} updated successfully`, 'success');
  };

  const handleCreateInquirySubmit = (e) => {
    e.preventDefault();
    if (!newInquiryData.topic.trim() || !newInquiryData.fromName.trim()) return;

    const created = MockService.createInquiry(newInquiryData);
    setInquiries(MockService.getInquiries());
    setIsAddInquiryOpen(false);
    setNewInquiryData({
      topic: '',
      fromName: '',
      fromEmail: '',
      role: 'Customer',
      priority: 'Medium',
      message: '',
    });
    addToast(`New inquiry ticket ${created.id} registered`, 'success');
  };

  const handleDeleteInquiry = (inquiryId) => {
    MockService.deleteInquiry(inquiryId);
    setInquiries(MockService.getInquiries());
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(null);
      setIsEditingInquiry(false);
    }
    addToast(`Inquiry ticket ${inquiryId} deleted`, 'info');
  };

  // ---------------- Handlers for FAQ & Chatbot ----------------

  const handleCreateFaqIntent = (e) => {
    e.preventDefault();
    if (!newFaqData.label.trim() || !newFaqData.reply.trim()) return;

    const res = MockService.createFaqIntent(newFaqData);
    setSuggestions(res.suggestions);
    setResponses(res.responses);
    setIsAddFaqOpen(false);
    setNewFaqData({
      label: '',
      role: 'Customer',
      query: '',
      reply: '',
      navPath: '',
    });
    addToast(`New guidance intent "${newFaqData.label}" registered`, 'success');
  };

  const handleSaveFaqEdit = (e) => {
    e.preventDefault();
    if (!editingFaq) return;

    const updatedSuggestions = suggestions.map(s =>
      s.id === editingFaq.id
        ? { ...s, label: editFaqData.label, role: editFaqData.role, query: editFaqData.query }
        : s
    );
    const updatedResponses = {
      ...responses,
      [editingFaq.id]: {
        ...responses[editingFaq.id],
        reply: editFaqData.reply,
        navAction: editFaqData.navPath
          ? { path: editFaqData.navPath, label: 'View Section' }
          : responses[editingFaq.id]?.navAction,
      }
    };

    setSuggestions(updatedSuggestions);
    setResponses(updatedResponses);
    MockService.saveChatbotResponses(updatedResponses);
    setEditingFaq(null);
    addToast(`Guidance intent "${editFaqData.label}" updated`, 'success');
  };

  const handleDeleteFaqIntent = (id, label) => {
    const res = MockService.deleteFaqIntent(id);
    setSuggestions(res.suggestions);
    setResponses(res.responses);
    addToast(`Guidance intent "${label}" removed`, 'info');
  };

  const handleSendSim = (customText = null) => {
    const textToSend = customText || simInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...simMessages, { sender: 'user', text: textToSend }];
    setSimMessages(newMsgs);
    if (!customText) setSimInput('');

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let matchedReply = "Thank you for reaching out. A certified representative from Local Mechanical or No-Tech Support has been notified and will assist you shortly.";

      if (lower.includes('reserve') || lower.includes('fee') || lower.includes('200')) {
        matchedReply = responses['reserve-system']?.reply || matchedReply;
      } else if (lower.includes('compartment') || lower.includes('swap') || lower.includes('modular')) {
        matchedReply = responses['modular-swap']?.reply || matchedReply;
      } else if (lower.includes('local mechanical') || lower.includes('authority') || lower.includes('role')) {
        matchedReply = responses['local-mech']?.reply || matchedReply;
      } else if (lower.includes('unselect') || lower.includes('change contractor')) {
        matchedReply = responses['manage-contractor']?.reply || matchedReply;
      } else if (lower.includes('onboard') || lower.includes('documents')) {
        matchedReply = responses['contractor-onboarding']?.reply || matchedReply;
      } else if (lower.includes('rfid')) {
        matchedReply = responses['rfid-scanning']?.reply || matchedReply;
      } else if (lower.includes('reschedule')) {
        matchedReply = responses['contractor-reschedule']?.reply || matchedReply;
      } else {
        for (const sug of suggestions) {
          if (lower.includes(sug.label.toLowerCase()) || (sug.query && lower.includes(sug.query.toLowerCase()))) {
            if (responses[sug.id]?.reply) {
              matchedReply = responses[sug.id].reply;
              break;
            }
          }
        }
      }

      setSimMessages(prev => [...prev, { sender: 'bot', text: matchedReply }]);
    }, 400);
  };

  // ---------------- Table Columns for Inquiries ----------------

  const inquiryColumns = [
    {
      key: 'id',
      label: 'Ticket ID',
      sortable: true,
      width: '10%',
      render: (val) => (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
          {val}
        </span>
      ),
    },
    {
      key: 'fromName',
      label: 'Sender / Contact',
      sortable: true,
      width: '20%',
      render: (val, row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {val}
          </span>
          <span className="font-mono text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
            {row.fromEmail || 'no-email@provided.com'}
          </span>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Category',
      sortable: true,
      width: '12%',
      render: (val) => {
        const isContractor = val === 'Contractor';
        const isMech = val === 'Local Mechanical';
        return (
          <span
            className={`inline-flex items-center font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
              isContractor
                ? 'bg-[#1E2227] text-white dark:bg-[#A4A77E] dark:text-[#121417]'
                : isMech
                ? 'bg-[#73784F]/15 text-[#73784F] dark:text-[#A4A77E] border border-[#73784F]/30'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {val}
          </span>
        );
      },
    },
    {
      key: 'topic',
      label: 'Inquiry / Topic',
      sortable: true,
      width: '30%',
      render: (val, row) => (
        <div className="max-w-md">
          <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
            {val}
          </span>
          <span className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] line-clamp-1 truncate mt-0.5">
            "{row.message}"
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      width: '10%',
      hideBelowXl: true,
      render: (val) => {
        const colorMap = {
          High: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
          Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
          Low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
              colorMap[val] || colorMap.Medium
            }`}
          >
            {val || 'Medium'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '12%',
      render: (val) => <StatusPill status={val} size="sm" />,
    },
  ];

  const inquiryFilterOptions = [
    {
      key: 'status',
      label: 'All Statuses',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Resolved', value: 'Resolved' },
        { label: 'Closed', value: 'Closed' },
      ],
    },
    {
      key: 'role',
      label: 'All Categories',
      options: [
        { label: 'Customer', value: 'Customer' },
        { label: 'Contractor', value: 'Contractor' },
        { label: 'Local Mechanical', value: 'Local Mechanical' },
      ],
    },
    {
      key: 'priority',
      label: 'All Priorities',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
    },
  ];

  // ---------------- Row Actions matching exact Mockup in Image 2 ----------------

  const getInquiryRowActions = (row) => [
    {
      label: 'View Details',
      icon: Eye,
      onClick: () => {
        setSelectedInquiry(row);
        setIsEditingInquiry(false);
      },
    },
    {
      label: 'Edit Inquiry',
      icon: Edit2,
      onClick: () => {
        handleOpenEditInquiry(row);
      },
    },
    {
      label: 'Reply / Chat',
      icon: MessageSquare,
      onClick: () => {
        setSelectedInquiry(row);
        setIsEditingInquiry(false);
      },
    },
    { divider: true },
    {
      header: 'CHANGE STATUS',
      icon: RotateCcw,
    },
    {
      custom: (closeMenu) => {
        const isProgress = row.status === 'In Progress';
        const isResolved = row.status === 'Resolved';
        const isOpen = row.status === 'Open';

        let boxBg = 'bg-[#FFF9EA] dark:bg-[#2A2312] border-[#FDE68A] dark:border-[#854D0E]/60 text-[#92400E] dark:text-[#FBBF24]';
        let dotColor = 'bg-[#D97706]';

        if (isResolved) {
          boxBg = 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#A7F3D0] dark:border-[#059669]/50 text-[#065F46] dark:text-[#34D399]';
          dotColor = 'bg-[#059669]';
        } else if (isOpen) {
          boxBg = 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border-[#BFDBFE] dark:border-[#2563EB]/50 text-[#1E40AF] dark:text-[#60A5FA]';
          dotColor = 'bg-[#2563EB]';
        }

        return (
          <div className="relative min-w-[125px]" onClick={(e) => e.stopPropagation()}>
            <CustomSelect
              value={row.status}
              onChange={(e) => {
                handleStatusChange(row.id, e.target.value);
                closeMenu();
              }}
              size="sm"
              className={`w-full ${boxBg} font-semibold`}
              minWidth={130}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </CustomSelect>
          </div>
        );
      },
    },
    { divider: true },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: () => handleDeleteInquiry(row.id),
      confirmMessage: `Are you sure you want to delete inquiry ticket ${row.id}?`,
    },
  ];

  // ---------------- Table Columns for FAQ Flows ----------------

  const faqColumns = [
    {
      key: 'label',
      label: 'Flow Intent / Topic',
      sortable: true,
      width: '28%',
      render: (val, row) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white block">
            {val}
          </span>
          <span className="font-mono text-[10.5px] text-[#6D6E71] dark:text-[#8D8E92]">
            ID: {row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Target Category',
      sortable: true,
      width: '14%',
      render: (val) => (
        <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]">
          {val}
        </span>
      ),
    },
    {
      key: 'query',
      label: 'Trigger Pattern / Query',
      sortable: true,
      width: '26%',
      render: (val) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 italic truncate block">
          "{val || '—'}"
        </span>
      ),
    },
    {
      key: 'reply',
      label: 'Pre-Calibrated Response',
      width: '26%',
      render: (_, row) => {
        const resp = responses[row.id];
        return (
          <span className="text-xs text-[#6D6E71] dark:text-[#8D8E92] line-clamp-1 truncate block">
            {resp?.reply || 'No response configured'}
          </span>
        );
      },
    },
  ];

  const faqFilterOptions = [
    {
      key: 'role',
      label: 'All Categories',
      options: [
        { label: 'Customer', value: 'Customer' },
        { label: 'Contractor', value: 'Contractor' },
        { label: 'Local Mechanical', value: 'Local Mechanical' },
        { label: 'All Roles', value: 'all' },
      ],
    },
  ];

  const getFaqRowActions = (row) => [
    {
      label: 'Edit Response',
      icon: Edit2,
      onClick: () => {
        setEditingFaq(row);
        const resp = responses[row.id];
        setEditFaqData({
          label: row.label,
          role: row.role || 'Customer',
          query: row.query || '',
          reply: resp?.reply || '',
          navPath: resp?.navAction?.path || '',
        });
      },
    },
    {
      label: 'Test in Simulator',
      icon: PlayCircle,
      onClick: () => {
        setActiveTab('test-sim');
        handleSendSim(row.query || row.label);
      },
    },
    { divider: true },
    {
      label: 'Delete Flow',
      icon: Trash2,
      variant: 'danger',
      onClick: () => handleDeleteFaqIntent(row.id, row.label),
      confirmMessage: `Are you sure you want to delete guidance intent "${row.label}"?`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Customer Inquiries & Chatbot"
        subtitle="Customer inquiries, automated FAQ flows, and assistant simulator."
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'inbox' && (
              <button
                onClick={() => setIsAddInquiryOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
              >
                <span>Log Customer Inquiry</span>
              </button>
            )}
            {activeTab === 'faq-editor' && (
              <button
                onClick={() => setIsAddFaqOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
              >
                <span>Add FAQ Intent / Flow</span>
              </button>
            )}
            <button
              onClick={() => {
                setInquiries(MockService.getInquiries());
                setSuggestions(MockService.getChatbotSuggestions());
                setResponses(MockService.getChatbotResponses());
                addToast('Data reloaded from Northern California Hub memory', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Premium Segmented Tab Switcher */}
      <div className="p-1.5 bg-slate-200/70 dark:bg-[#181B1F] border border-slate-300/60 dark:border-white/10 rounded-2xl inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full shadow-inner backdrop-blur-md">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'inbox'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <MessageSquare
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'inbox'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Inquiries Inbox</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'inbox'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {inquiries.filter((i) => i.status === 'Open').length} Open
          </span>
        </button>
        <button
          onClick={() => setActiveTab('faq-editor')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'faq-editor'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <HelpCircle
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'faq-editor'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Chatbot FAQ & Guidance Editor</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'faq-editor'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {suggestions.length} Flows
          </span>
        </button>
        <button
          onClick={() => setActiveTab('test-sim')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'test-sim'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <Bot
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'test-sim'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Interactive Chatbot Simulator</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'test-sim'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            Live Test
          </span>
        </button>
      </div>

      {/* TAB 1: Inquiries Inbox in Tabular DataTable format */}
      {activeTab === 'inbox' && (
        <DataTable
          columns={inquiryColumns}
          data={inquiries}
          onRowClick={(row) => {
            setSelectedInquiry(row);
            setIsEditingInquiry(false);
          }}
          searchPlaceholder="Search ticket ID, sender, topic, message..."
          filters={inquiryFilterOptions}
          activeFilters={inquiryFilters}
          onFilterChange={(k, v) => setInquiryFilters(prev => ({ ...prev, [k]: v }))}
          pageSize={8}
          rowActions={getInquiryRowActions}
        />
      )}

      {/* TAB 2: Chatbot FAQ & Quick-Guidance Editor in Tabular DataTable format */}
      {activeTab === 'faq-editor' && (
        <DataTable
          columns={faqColumns}
          data={suggestions}
          onRowClick={(row) => {
            setEditingFaq(row);
            const resp = responses[row.id];
            setEditFaqData({
              label: row.label,
              role: row.role || 'Customer',
              query: row.query || '',
              reply: resp?.reply || '',
              navPath: resp?.navAction?.path || '',
            });
          }}
          searchPlaceholder="Search guidance flows, trigger queries, intents..."
          filters={faqFilterOptions}
          activeFilters={faqFilters}
          onFilterChange={(k, v) => setFaqFilters(prev => ({ ...prev, [k]: v }))}
          pageSize={8}
          rowActions={getFaqRowActions}
        />
      )}

      {/* TAB 3: Interactive Live Chatbot Simulator Preview */}
      {activeTab === 'test-sim' && (
        <div className="water-card rounded-2xl p-6 sm:p-7 border border-white/80 dark:border-white/10 w-full shadow-water space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl clean-pill-active flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Local Mechanical & No-Tech Virtual Simulator
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Simulate live customer queries and verify NLP automated fallback routing.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSimMessages([
                  {
                    sender: 'bot',
                    text: "Conversation reset. Hello! I am the No-Tech HVAC & Local Mechanical Virtual Assistant. How can I assist you today?"
                  }
                ]);
                addToast('Simulator session reset', 'info');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] text-xs font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reset Session
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 min-h-[300px] max-h-[460px] overflow-y-auto p-4 rounded-xl bg-slate-50/70 dark:bg-[#15181C]/70 border border-slate-100 dark:border-[#2B3037]">
            {simMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#1E2227] text-white dark:bg-[#A4A77E] dark:text-[#121417] rounded-br-xs'
                      : 'bg-white dark:bg-[#22262C] text-slate-800 dark:text-white border border-slate-200 dark:border-[#383E47] rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="space-y-1.5">
            <span className="text-[10.5px] font-mono text-[#6D6E71] block">Quick Test Queries:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {suggestions.slice(0, 6).map((sug) => (
                <button
                  key={sug.id}
                  onClick={() => handleSendSim(sug.query || sug.label)}
                  className="water-pill text-[11px] font-mono px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 font-medium"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendSim();
            }}
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              placeholder="Ask about 2x6 frame, RFID swap, deposit fee, Local Mechanical..."
              value={simInput}
              onChange={(e) => setSimInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1E2227] text-white hover:bg-[#A4A77E] hover:text-[#121417] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Slide-In Inquiry Drawer (Details, Replies & Edit Form) */}
      <SlideOverPanel
        isOpen={!!selectedInquiry}
        onClose={() => {
          setSelectedInquiry(null);
          setIsEditingInquiry(false);
        }}
        title={
          selectedInquiry
            ? isEditingInquiry
              ? `Edit Ticket: ${selectedInquiry.id}`
              : selectedInquiry.topic
            : ''
        }
        subtitle={
          selectedInquiry
            ? isEditingInquiry
              ? 'Update ticket information, category, priority, and message.'
              : `${selectedInquiry.fromName} (${selectedInquiry.role})`
            : ''
        }
        idChip={selectedInquiry?.id}
        icon={MessageSquare}
        footer={
          isEditingInquiry ? (
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsEditingInquiry(false)}
                className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-inquiry-form"
                className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(selectedInquiry?.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditInquiry(selectedInquiry)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#383E47] text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {selectedInquiry?.status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedInquiry?.id, 'Resolved')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold water-pill text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active"
                >
                  Close
                </button>
              </div>
            </div>
          )
        }
      >
        {selectedInquiry && (
          isEditingInquiry ? (
            <form id="edit-inquiry-form" onSubmit={handleSaveInquiryEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Topic / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={editInquiryForm.topic}
                  onChange={(e) => setEditInquiryForm({ ...editInquiryForm, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sender Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editInquiryForm.fromName}
                    onChange={(e) => setEditInquiryForm({ ...editInquiryForm, fromName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={editInquiryForm.fromEmail}
                    onChange={(e) => setEditInquiryForm({ ...editInquiryForm, fromEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <CustomSelect
                    value={editInquiryForm.role}
                    onChange={(e) => setEditInquiryForm({ ...editInquiryForm, role: e.target.value })}
                    className="w-full"
                    size="md"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Local Mechanical">Local Mechanical</option>
                  </CustomSelect>
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority *
                  </label>
                  <CustomSelect
                    value={editInquiryForm.priority}
                    onChange={(e) => setEditInquiryForm({ ...editInquiryForm, priority: e.target.value })}
                    className="w-full"
                    size="md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </CustomSelect>
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status *
                  </label>
                  <CustomSelect
                    value={editInquiryForm.status}
                    onChange={(e) => setEditInquiryForm({ ...editInquiryForm, status: e.target.value })}
                    className="w-full"
                    size="md"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </CustomSelect>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editInquiryForm.message}
                  onChange={(e) => setEditInquiryForm({ ...editInquiryForm, message: e.target.value })}
                  className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl water-card space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] uppercase font-bold text-[#6D6E71]">
                    Original Inquiry Message
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusPill status={selectedInquiry.status} size="xs" />
                    <span className="font-mono text-[10.5px] text-[#6D6E71]">
                      {selectedInquiry.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{selectedInquiry.message}"
                </p>
                <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 font-mono text-[10.5px] text-[#6D6E71] flex items-center justify-between">
                  <span>Sender Email: {selectedInquiry.fromEmail || 'no-email@provided.com'}</span>
                  <span>Priority: <strong>{selectedInquiry.priority || 'Medium'}</strong></span>
                </div>
              </div>

              {/* Staff Replies Thread */}
              <div>
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-2.5">
                  Staff Communication Thread
                </h4>
                <div className="space-y-2 mb-4">
                  {(selectedInquiry.replies || []).length === 0 ? (
                    <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-[#383E47] text-slate-400 text-xs text-center">
                      No staff replies logged yet. Use the form below to respond.
                    </div>
                  ) : (
                    (selectedInquiry.replies || []).map((rep, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl water-card text-xs"
                      >
                        <div className="flex items-center justify-between font-mono text-[10.5px] text-[#6D6E71] mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{rep.author}</span>
                          <span>{rep.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          {rep.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleInquiryReply} className="space-y-2">
                  <textarea
                    rows={3}
                    required
                    placeholder="Draft administrative reply to customer/contractor..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#A4A77E] outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Submitting marks status as "In Progress".
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl clean-pill-active text-xs font-semibold"
                    >
                      Send Resolution Email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        )}
      </SlideOverPanel>

      {/* Slide-In Log New Customer Inquiry Panel */}
      <SlideOverPanel
        isOpen={isAddInquiryOpen}
        onClose={() => setIsAddInquiryOpen(false)}
        title="Log Customer / Contractor Inquiry"
        subtitle="Record an inbound support inquiry or contractor compliance request."
        icon={Plus}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddInquiryOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-inquiry-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Create Ticket
            </button>
          </div>
        }
      >
        <form id="add-inquiry-form" onSubmit={handleCreateInquirySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject / Topic *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inverter Pin Testing Protocol"
              value={newInquiryData.topic}
              onChange={(e) => setNewInquiryData({ ...newInquiryData, topic: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sender Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. David Sterling"
                value={newInquiryData.fromName}
                onChange={(e) => setNewInquiryData({ ...newInquiryData, fromName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                placeholder="e.g. d.sterling@example.com"
                value={newInquiryData.fromEmail}
                onChange={(e) => setNewInquiryData({ ...newInquiryData, fromEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <CustomSelect
                value={newInquiryData.role}
                onChange={(e) => setNewInquiryData({ ...newInquiryData, role: e.target.value })}
                className="w-full"
                size="md"
              >
                <option value="Customer">Customer</option>
                <option value="Contractor">Contractor</option>
                <option value="Local Mechanical">Local Mechanical</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority *
              </label>
              <CustomSelect
                value={newInquiryData.priority}
                onChange={(e) => setNewInquiryData({ ...newInquiryData, priority: e.target.value })}
                className="w-full"
                size="md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </CustomSelect>
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Message / Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter full inquiry message or customer phone notes..."
              value={newInquiryData.message}
              onChange={(e) => setNewInquiryData({ ...newInquiryData, message: e.target.value })}
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* Slide-In Add FAQ Intent Flow */}
      <SlideOverPanel
        isOpen={isAddFaqOpen}
        onClose={() => setIsAddFaqOpen(false)}
        title="Register Chatbot FAQ / Flow"
        subtitle="Add a guidance prompt and pre-calibrated response flow."
        icon={Plus}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddFaqOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-faq-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Flow
            </button>
          </div>
        }
      >
        <form id="add-faq-form" onSubmit={handleCreateFaqIntent} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Topic Title / Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inverter Pin Testing Protocol"
              value={newFaqData.label}
              onChange={(e) => setNewFaqData({ ...newFaqData, label: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <CustomSelect
                value={newFaqData.role}
                onChange={(e) => setNewFaqData({ ...newFaqData, role: e.target.value })}
                className="w-full"
                size="md"
              >
                <option value="Customer">Customer</option>
                <option value="Contractor">Contractor</option>
                <option value="Local Mechanical">Local Mechanical</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Suggested Query
              </label>
              <input
                type="text"
                placeholder="e.g. How to test pin resistance?"
                value={newFaqData.query}
                onChange={(e) => setNewFaqData({ ...newFaqData, query: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Automated Response Text *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Official guidance according to Local Mechanical specifications..."
              value={newFaqData.reply}
              onChange={(e) => setNewFaqData({ ...newFaqData, reply: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Optional Navigation Route
            </label>
            <input
              type="text"
              placeholder="e.g. /installations or /training"
              value={newFaqData.navPath}
              onChange={(e) => setNewFaqData({ ...newFaqData, navPath: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* Slide-In Edit FAQ Intent Flow */}
      <SlideOverPanel
        isOpen={!!editingFaq}
        onClose={() => setEditingFaq(null)}
        title={editingFaq ? `Edit Flow: ${editingFaq.label}` : ''}
        subtitle="Update prompt pattern, category target, and automated reply text."
        idChip={editingFaq?.id}
        icon={Edit2}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-faq-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Changes
            </button>
          </div>
        }
      >
        {editingFaq && (
          <form id="edit-faq-form" onSubmit={handleSaveFaqEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic Title / Label *
              </label>
              <input
                type="text"
                required
                value={editFaqData.label}
                onChange={(e) => setEditFaqData({ ...editFaqData, label: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role
                </label>
                <CustomSelect
                  value={editFaqData.role}
                  onChange={(e) => setEditFaqData({ ...editFaqData, role: e.target.value })}
                  className="w-full"
                  size="md"
                >
                  <option value="Customer">Customer</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Local Mechanical">Local Mechanical</option>
                  <option value="all">All Roles</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Suggested Query
                </label>
                <input
                  type="text"
                  value={editFaqData.query}
                  onChange={(e) => setEditFaqData({ ...editFaqData, query: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Automated Response Text *
              </label>
              <textarea
                rows={4}
                required
                value={editFaqData.reply}
                onChange={(e) => setEditFaqData({ ...editFaqData, reply: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Optional Navigation Route
              </label>
              <input
                type="text"
                placeholder="e.g. /reservations or /training"
                value={editFaqData.navPath}
                onChange={(e) => setEditFaqData({ ...editFaqData, navPath: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </form>
        )}
      </SlideOverPanel>
    </div>
  );
};
