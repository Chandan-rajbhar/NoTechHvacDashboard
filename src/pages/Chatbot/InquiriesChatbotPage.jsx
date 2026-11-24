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
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
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

  // Chatbot Suggestions & FAQ Editor State
  const [suggestions, setSuggestions] = useState(() => MockService.getChatbotSuggestions());
  const [responses, setResponses] = useState(() => MockService.getChatbotResponses());
  const [editingKey, setEditingKey] = useState(null);
  const [editedReply, setEditedReply] = useState('');

  // Add FAQ Modal State
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [newFaqData, setNewFaqData] = useState({
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

  const handleSendSim = (customText = null) => {
    const textToSend = customText || simInput;
    if (!textToSend.trim()) return;

    // Add user message
    const newMsgs = [...simMessages, { sender: 'user', text: textToSend }];
    setSimMessages(newMsgs);
    if (!customText) setSimInput('');

    // Match bot response
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
        // Search through dynamic custom intents
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

  const handleInquiryReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    MockService.addInquiryReply(selectedInquiry.id, replyText.trim());
    setInquiries(MockService.getInquiries());
    setSelectedInquiry(prev => ({
      ...prev,
      status: 'In Progress',
      replies: [...(prev.replies || []), { author: 'Admin Operations', text: replyText.trim(), date: new Date().toLocaleString() }]
    }));
    setReplyText('');
    addToast('Reply dispatched to customer ticket', 'success');
  };

  const handleMarkResolved = (inquiryId) => {
    const updated = inquiries.map(inq => inq.id === inquiryId ? { ...inq, status: 'Resolved' } : inq);
    setInquiries(updated);
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => ({ ...prev, status: 'Resolved' }));
    }
    addToast(`Ticket ${inquiryId} marked as Resolved`, 'success');
  };

  const handleDeleteInquiry = (inquiryId) => {
    if (window.confirm(`Are you sure you want to delete inquiry ticket ${inquiryId}?`)) {
      const updated = inquiries.filter(i => i.id !== inquiryId);
      setInquiries(updated);
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry(null);
      }
      addToast(`Inquiry ticket ${inquiryId} deleted`, 'info');
    }
  };

  const handleSaveFaqReply = (key) => {
    const updatedResponses = {
      ...responses,
      [key]: { ...responses[key], reply: editedReply }
    };
    setResponses(updatedResponses);
    MockService.saveChatbotResponses(updatedResponses);
    setEditingKey(null);
    addToast('Chatbot automated response updated in live memory', 'success');
  };

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

  const handleDeleteFaqIntent = (id, label) => {
    if (window.confirm(`Are you sure you want to delete guidance intent "${label}"?`)) {
      const res = MockService.deleteFaqIntent(id);
      setSuggestions(res.suggestions);
      setResponses(res.responses);
      addToast(`Guidance intent "${label}" removed`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Customer Inquiries & Chatbot"
        subtitle="Customer inquiries, automated FAQ flows, and assistant simulator."
        actions={
          activeTab === 'faq-editor' && (
            <button
              onClick={() => setIsAddFaqOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add FAQ Intent / Flow</span>
            </button>
          )
        }
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#383E47] pb-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'inbox' ? 'clean-pill-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inquiries Inbox ({inquiries.filter(i => i.status === 'Open').length} Open)
        </button>
        <button
          onClick={() => setActiveTab('faq-editor')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'faq-editor' ? 'clean-pill-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Chatbot FAQ & Guidance Editor ({suggestions.length} Flows)
        </button>
        <button
          onClick={() => setActiveTab('test-sim')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'test-sim' ? 'clean-pill-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Interactive Chatbot Simulator</span>
        </button>
      </div>

      {/* TAB 1: Inquiries Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className="water-card water-shine rounded-2xl p-5 border border-white/80 dark:border-white/10 shadow-water hover:border-[#CCD4BE] dark:hover:border-[#4B5640] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10.5px] font-bold text-slate-500">
                      {inq.id}
                    </span>
                    <StatusPill status={inq.status} size="xs" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {inq.topic}
                  </h4>
                  <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-1 line-clamp-2">
                    "{inq.message}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2B3037] flex items-center justify-between text-[10.5px] font-mono">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{inq.fromName}</span>
                  <span className="text-[#6D6E71]">{inq.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Chatbot FAQ & Quick-Guidance Editor */}
      {activeTab === 'faq-editor' && (
        <div className="space-y-4">
          <div className="water-card rounded-2xl p-5 sm:p-6 border border-white/80 dark:border-white/10 shadow-water">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Automated Quick-Guidance Suggestions & Response Mapping
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Pre-scripted conversation flows for common customer and contractor inquiries.
                </p>
              </div>
              <button
                onClick={() => setIsAddFaqOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Flow</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {suggestions.map((sug) => {
                const resp = responses[sug.id];
                const isEditing = editingKey === sug.id;

                return (
                  <div
                    key={sug.id}
                    className="water-card p-4.5 rounded-2xl border border-white/80 dark:border-[#383E47] space-y-2 text-xs shadow-sm hover:border-[#CCD4BE] dark:hover:border-[#4B5640] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]">
                          {sug.role}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                          {sug.label}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingKey(sug.id);
                                setEditedReply(resp?.reply || '');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                              title="Edit Response"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaqIntent(sug.id, sug.label)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Delete Flow"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingKey(null)}
                              className="px-2.5 py-1 rounded-xl text-[10px] font-mono water-pill"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveFaqReply(sug.id)}
                              className="px-3 py-1 rounded-xl bg-[#A4A77E] text-[#121417] font-bold text-[10px] font-mono shadow-sm"
                            >
                              Save ✓
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isEditing ? (
                      <p className="text-[#6D6E71] dark:text-[#8D8E92] leading-relaxed">
                        {resp?.reply || 'No response configured yet.'}
                      </p>
                    ) : (
                      <textarea
                        rows={3}
                        value={editedReply}
                        onChange={(e) => setEditedReply(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#1A1D21] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#A4A77E] outline-none"
                      />
                    )}

                    {resp?.navAction && (
                      <div className="font-mono text-[10.5px] text-[#73784F] dark:text-[#A4A77E] pt-1 font-semibold">
                        Navigation Target: <strong>{resp.navAction.path || resp.navAction.tab}</strong> ({resp.navAction.label})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Live Chatbot Simulator Preview */}
      {activeTab === 'test-sim' && (
        <div className="water-card rounded-2xl p-6 sm:p-7 border border-white/80 dark:border-white/10 w-full shadow-water space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#A4A77E]/20 text-[#555D50] dark:text-[#BFC399] flex items-center justify-center border border-[#A4A77E]/30">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                  No-Tech Assistant Simulator
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Online • Live AI Dialog Engine</span>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#16191D] border border-slate-200/80 dark:border-[#383E47]">
            {simMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#A4A77E] text-[#121417] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 shadow-sm">
                    NT
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-lg shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1E2227] text-white dark:bg-[#A4A77E] dark:text-[#121417] rounded-tr-none'
                      : 'water-card border border-white/80 dark:border-[#383E47] text-slate-800 dark:text-slate-100 rounded-tl-none'
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

      {/* Slide-In Inquiry Reply Drawer */}
      <SlideOverPanel
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title={selectedInquiry ? selectedInquiry.topic : ''}
        subtitle={selectedInquiry ? `${selectedInquiry.fromName} (${selectedInquiry.role})` : ''}
        idChip={selectedInquiry?.id}
        icon={MessageSquare}
        footer={
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
              {selectedInquiry?.status !== 'Resolved' && (
                <button
                  type="button"
                  onClick={() => handleMarkResolved(selectedInquiry?.id)}
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
                Close Drawer
              </button>
            </div>
          </div>
        }
      >
        {selectedInquiry && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl water-card space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase font-bold text-[#6D6E71]">
                  Original Inquiry Message
                </span>
                <span className="font-mono text-[10.5px] text-[#6D6E71]">
                  {selectedInquiry.timestamp}
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                "{selectedInquiry.message}"
              </p>
              <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 font-mono text-[10.5px] text-[#6D6E71]">
                Sender Email: {selectedInquiry.fromEmail}
              </div>
            </div>

            {/* Replies Thread */}
            <div>
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white mb-2.5">
                Staff Communication Thread
              </h4>
              <div className="space-y-2 mb-4">
                {(selectedInquiry.replies || []).map((rep, idx) => (
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
                ))}
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
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl clean-pill-active text-xs font-semibold"
                >
                  Send Resolution Email
                </button>
              </form>
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* Add FAQ Flow Modal */}
      {isAddFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-md p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Register Chatbot FAQ / Flow
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Add a guidance prompt and pre-calibrated response flow.
                </p>
              </div>
              <button
                onClick={() => setIsAddFaqOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFaqIntent} className="space-y-3.5 text-xs">
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
                  <select
                    value={newFaqData.role}
                    onChange={(e) => setNewFaqData({ ...newFaqData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Local Mechanical">Local Mechanical</option>
                  </select>
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
                  rows={3}
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#2B3037]">
                <button
                  type="button"
                  onClick={() => setIsAddFaqOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Save Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
