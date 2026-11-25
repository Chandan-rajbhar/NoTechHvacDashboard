import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Video,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Copy,
  Edit,
  Trash2,
  X,
  Check,
  CheckCircle2,
  RefreshCw,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { RowActionsMenu } from '../../components/common/RowActionsMenu';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const TrainingQuestionnairePage = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'results'

  // Questions State
  const [questions, setQuestions] = useState(() => MockService.getQuestionnaire());
  const [expandedQId, setExpandedQId] = useState(null);

  // Stats State
  const [passMark, setPassMark] = useState(8);
  const [isEditingPassMark, setIsEditingPassMark] = useState(false);
  const [tempPassMark, setTempPassMark] = useState(8);

  const [videoTitle, setVideoTitle] = useState('Standard 28-min Technical Onboarding');
  const [videoStatus, setVideoStatus] = useState('Active');
  const [isReplaceVideoOpen, setIsReplaceVideoOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Contractor Assessment Results State
  const [contractorResults, setContractorResults] = useState(() => MockService.getAssessments());
  const [selectedResult, setSelectedResult] = useState(null);

  // Add / Edit Question Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    title: '',
    question: '',
    type: 'Single Choice',
    options: [
      { id: 'opt-1', text: '', isCorrect: true },
      { id: 'opt-2', text: '', isCorrect: false },
      { id: 'opt-3', text: '', isCorrect: false },
      { id: 'opt-4', text: '', isCorrect: false },
    ],
    explanation: '',
  });

  const toggleAccordion = (qId) => {
    setExpandedQId((prev) => (prev === qId ? null : qId));
  };

  // Reorder Question up/down
  const moveQuestion = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const copy = [...questions];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setQuestions(copy);
    addToast('Question order updated', 'info');
  };

  // Open modal for Add
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      title: '',
      question: '',
      type: 'Single Choice',
      options: [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-4`, text: '', isCorrect: false },
      ],
      explanation: '',
    });
    setIsQuestionModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setQuestionFormData({
      title: q.title || '',
      question: q.question || '',
      type: q.type || 'Single Choice',
      options: (q.options || []).map((o, idx) => ({
        id: o.id || `opt-${idx}`,
        text: o.text || '',
        isCorrect: !!o.isCorrect,
      })),
      explanation: q.explanation || '',
    });
    setIsQuestionModalOpen(true);
  };

  // Duplicate Question
  const handleDuplicateQuestion = (q) => {
    const duplicated = {
      ...q,
      id: questions.length + 1,
      title: `${q.title} (Copy)`,
      options: (q.options || []).map((o, idx) => ({ ...o, id: `opt-${Date.now()}-${idx}` })),
    };
    setQuestions((prev) => [...prev, duplicated]);
    addToast(`Duplicated question as #${duplicated.id}`, 'success');
  };

  // Delete Question
  const handleDeleteQuestion = (qId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
      if (expandedQId === qId) setExpandedQId(null);
      addToast('Question removed from question bank', 'info');
    }
  };

  // Save Add/Edit Question
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!questionFormData.title.trim() || !questionFormData.question.trim()) {
      addToast('Please enter both title and question text', 'error');
      return;
    }

    const hasCorrect = questionFormData.options.some((opt) => opt.isCorrect && opt.text.trim());
    if (!hasCorrect) {
      addToast('At least one option must have text and be marked as the correct answer', 'error');
      return;
    }

    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
              ...q,
              ...questionFormData,
              options: questionFormData.options.filter((o) => o.text.trim()),
            }
            : q
        )
      );
      addToast('Question updated successfully', 'success');
    } else {
      const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      const created = {
        id: newId,
        ...questionFormData,
        options: questionFormData.options.filter((o) => o.text.trim()),
      };
      setQuestions((prev) => [...prev, created]);
      addToast(`New question #${newId} added to question bank`, 'success');
    }

    setIsQuestionModalOpen(false);
  };

  // Option management inside modal
  const handleOptionTextChange = (idx, text) => {
    const updated = [...questionFormData.options];
    updated[idx].text = text;
    setQuestionFormData({ ...questionFormData, options: updated });
  };

  const handleOptionToggleCorrect = (idx) => {
    const isSingle = questionFormData.type === 'Single Choice';
    const updated = questionFormData.options.map((opt, i) => {
      if (i === idx) {
        return { ...opt, isCorrect: isSingle ? true : !opt.isCorrect };
      }
      return isSingle ? { ...opt, isCorrect: false } : opt;
    });
    setQuestionFormData({ ...questionFormData, options: updated });
  };

  const handleAddOption = () => {
    setQuestionFormData({
      ...questionFormData,
      options: [
        ...questionFormData.options,
        { id: `opt-${Date.now()}`, text: '', isCorrect: false },
      ],
    });
  };

  const handleRemoveOption = (idx) => {
    if (questionFormData.options.length <= 2) {
      addToast('Questions must have at least 2 options', 'warning');
      return;
    }
    const updated = questionFormData.options.filter((_, i) => i !== idx);
    setQuestionFormData({ ...questionFormData, options: updated });
  };

  // Reset Contractor Result
  const handleResetAttempt = (contractorId, contractorName) => {
    if (window.confirm(`Reset assessment attempt for ${contractorName}?`)) {
      setContractorResults((prev) =>
        prev.map((c) =>
          c.contractorId === contractorId
            ? {
              ...c,
              score: 0,
              passed: false,
              status: 'In Progress',
              completedAt: 'In Progress',
              videoProgress: 0,
              videoCompleted: false,
            }
            : c
        )
      );
      addToast(`Attempt reset for ${contractorName}`, 'info');
    }
  };

  // Contractor Results Table Columns
  const contractorColumns = [
    {
      key: 'contractorName',
      label: 'Contractor',
      sortable: true,
      width: '30%',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.avatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
            }
            alt={val}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate text-xs">
              {val}
            </div>
            <div className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
              {row.company || 'Certified HVAC Technician'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'videoProgress',
      label: 'Video Progress',
      sortable: true,
      width: '20%',
      render: (val, row) => {
        const pct = row.videoCompleted ? 100 : val || 75;
        return (
          <div className="space-y-1.5 max-w-[160px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-700 dark:text-slate-300">{pct}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${pct === 100 ? 'bg-[#A4A77E]' : 'bg-[#C2B59B]'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      width: '15%',
      render: (val, row) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {val} / {row.maxScore || 10}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Result',
      sortable: true,
      width: '15%',
      render: (_, row) => {
        const result = row.passed ? 'Passed' : row.score === 0 ? 'In Progress' : 'Failed';
        return <StatusPill status={result} size="xs" />;
      },
    },
    {
      key: 'completedAt',
      label: 'Last Attempt',
      sortable: true,
      width: '20%',
      render: (val) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 font-sans">
          {val || 'Not attempted'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Training & Questionnaire"
        subtitle="Manage certified question bank, passing mark criteria, and contractor test results."
        actions={
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
          >
            <span>Add Question</span>
          </button>
        }
      />

      {/* Stats Strip: 3 Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {/* Stat 1: Total Questions */}
        <div className="water-card water-shine rounded-[20px] p-5 border border-white/80 dark:border-white/10 shadow-water flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
              Total Questions
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {questions.length}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#A4A77E]/15 text-[#555D50] dark:text-[#A4A77E] flex items-center justify-center border border-[#A4A77E]/30">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Pass Mark (Editable Inline) */}
        <div className="water-card water-shine rounded-[20px] p-5 border border-white/80 dark:border-white/10 shadow-water flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
              Passing Mark Threshold
            </span>
            {isEditingPassMark ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="1"
                  max={questions.length || 10}
                  value={tempPassMark}
                  onChange={(e) => setTempPassMark(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-sm font-mono font-bold rounded-lg border border-[#A4A77E] bg-white dark:bg-[#1A1D21] text-slate-900 dark:text-white text-center"
                />
                <button
                  onClick={() => {
                    setPassMark(tempPassMark);
                    setIsEditingPassMark(false);
                    addToast(`Passing threshold updated to ${tempPassMark} / ${questions.length}`, 'success');
                  }}
                  className="p-1 rounded-lg bg-[#A4A77E] text-[#121417] hover:bg-[#868962]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditingPassMark(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {passMark} / {questions.length || 10}
                </span>
                <button
                  onClick={() => {
                    setTempPassMark(passMark);
                    setIsEditingPassMark(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Edit passing mark"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#C2B59B]/20 text-[#695D44] dark:text-[#C2B59B] flex items-center justify-center border border-[#C2B59B]/40">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Training Video */}
        <div className="water-card water-shine rounded-[20px] p-5 border border-white/80 dark:border-white/10 shadow-water flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
                Training Video
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium">
                {videoStatus}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
              {videoTitle}
            </div>
          </div>
          <button
            onClick={() => setIsReplaceVideoOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold water-pill text-slate-700 dark:text-slate-200 hover:text-slate-900 transition-colors flex-shrink-0"
          >
            Replace
          </button>
        </div>
      </div>

      {/* Premium Segmented Tabs */}
      <div className="p-1.5 bg-slate-200/70 dark:bg-[#181B1F] border border-slate-300/60 dark:border-white/10 rounded-2xl inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full shadow-inner backdrop-blur-md">
        <button
          onClick={() => setActiveTab('questions')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <HelpCircle
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'questions'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Questions & Standards</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'questions'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {questions.length} Items
          </span>
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
            activeTab === 'results'
              ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
          }`}
        >
          <CheckCircle
            className={`w-3.5 h-3.5 transition-colors ${
              activeTab === 'results'
                ? 'text-slate-900 dark:text-[#A4A77E]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            }`}
          />
          <span className="font-sans">Contractor Results</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeTab === 'results'
                ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
            }`}
          >
            {contractorResults.length} Submissions
          </span>
        </button>
      </div>

      {/* TAB 1: Questions (Accordion Cards List) */}
      {activeTab === 'questions' && (
        <div className="space-y-3 w-full">
          {questions.map((q, index) => {
            const isExpanded = expandedQId === q.id;
            const options = q.options || [];
            const correctCount = options.filter((o) => o.isCorrect).length;
            const qTitle = q.title.includes(': ') ? q.title.split(': ')[1] : q.title;

            return (
              <div
                key={q.id}
                className="water-card rounded-[20px] border border-white/80 dark:border-white/10 shadow-water overflow-hidden transition-all bg-white dark:bg-[#1A1D21]"
              >
                {/* Collapsed Header Bar */}
                <div
                  onClick={() => toggleAccordion(q.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3.5 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Numbered circle */}
                    <div className="w-8 h-8 rounded-full bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 shadow-sm">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {qTitle}
                        </h3>
                        <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {q.type || 'Single Choice'}
                        </span>
                        <span className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] font-sans">
                          {options.length} options · {correctCount} correct
                        </span>
                      </div>
                      <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] truncate mt-0.5">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div
                    className="flex items-center gap-1.5 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Up / Down Reorder */}
                    <div className="flex items-center border border-slate-200 dark:border-[#383E47] rounded-lg overflow-hidden mr-1">
                      <button
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                        aria-label="Move question up"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B3037] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === questions.length - 1}
                        aria-label="Move question down"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B3037] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-slate-200 dark:border-[#383E47]"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Three-dot row actions menu */}
                    <RowActionsMenu
                      items={[
                        {
                          label: 'Edit Question',
                          icon: Edit,
                          onClick: () => handleOpenEditModal(q),
                        },
                        {
                          label: 'Duplicate',
                          icon: Copy,
                          onClick: () => handleDuplicateQuestion(q),
                        },
                        { divider: true },
                        {
                          label: 'Delete',
                          icon: Trash2,
                          variant: 'danger',
                          onClick: () => handleDeleteQuestion(q.id),
                          confirmMessage: 'Are you sure you want to delete this question?',
                        },
                      ]}
                    />

                    <button
                      onClick={() => toggleAccordion(q.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-[#2B3037] space-y-3.5 bg-slate-50/40 dark:bg-black/10">
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {q.question}
                    </div>

                    {/* Options list */}
                    <div className="space-y-2">
                      {options.map((opt, optIdx) => (
                        <div
                          key={opt.id || optIdx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${opt.isCorrect
                            ? 'bg-[#EBF1E8] border-[#CAD5C2] text-[#3F4F3B] font-semibold dark:bg-[#1E271E] dark:text-[#BFC399] dark:border-[#3E4F3B]'
                            : 'bg-white dark:bg-[#1E2227] border-slate-200 dark:border-[#383E47] text-slate-700 dark:text-slate-300'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {opt.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-[#73784F] dark:text-[#A4A77E] flex-shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex-shrink-0" />
                            )}
                            <span>{opt.text}</span>
                          </div>

                          {opt.isCorrect && (
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#A4A77E]/20 text-[#3F4F3B] dark:text-[#BFC399]">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Sub-Questions if any */}
                    {q.subQuestions && (
                      <div className="space-y-2 pt-1">
                        {q.subQuestions.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-white dark:bg-[#22262C] border border-slate-200 dark:border-[#383E47] text-xs flex items-center justify-between"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {sub.label}
                            </span>
                            <span className="font-mono font-bold text-[#73784F] dark:text-[#A4A77E]">
                              {sub.answer}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Optional Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E2227] border border-slate-200 dark:border-[#383E47] text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Explanation:
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Contractor Results (DataTable) */}
      {activeTab === 'results' && (
        <DataTable
          columns={contractorColumns}
          data={contractorResults}
          searchPlaceholder="Search contractor or company..."
          rowActions={(row) => [
            {
              label: 'View Details',
              icon: Eye,
              onClick: () => setSelectedResult(row),
            },
            { divider: true },
            {
              label: 'Reset Attempt',
              icon: RotateCcw,
              variant: 'danger',
              onClick: () => handleResetAttempt(row.contractorId, row.contractorName),
            },
          ]}
        />
      )}

      {/* Modal 1: Add / Edit Question SlideOverPanel */}
      <SlideOverPanel
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        subtitle="Configure question text, multiple choice options, and correct answers."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="question-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
            >
              Save Question
            </button>
          </>
        }
      >
        <form id="question-form" onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Title / Topic *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Refrigerant Line Sizing Standards"
              value={questionFormData.title}
              onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Question Text *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Enter the complete question prompt shown to technicians..."
              value={questionFormData.question}
              onChange={(e) => setQuestionFormData({ ...questionFormData, question: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A4A77E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Type
            </label>
            <select
              value={questionFormData.type}
              onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white"
            >
              <option value="Single Choice">Single Choice (1 Correct Answer)</option>
              <option value="Multiple Choice">Multiple Choice (Multiple Correct)</option>
              <option value="Matching">Matching / Technical Spec</option>
            </select>
          </div>

          {/* Dynamic Options List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Answer Options (toggle checkbox to mark correct) *
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-[#555D50] dark:text-[#A4A77E] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-2">
              {questionFormData.options.map((opt, idx) => (
                <div
                  key={opt.id || idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${opt.isCorrect
                    ? 'border-[#A4A77E] bg-[#A4A77E]/10'
                    : 'border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C]'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => handleOptionToggleCorrect(idx)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${opt.isCorrect
                      ? 'bg-[#A4A77E] border-[#A4A77E] text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A1D21]'
                      }`}
                    title={opt.isCorrect ? 'Marked as correct' : 'Click to mark as correct'}
                  >
                    {opt.isCorrect && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <input
                    type="text"
                    required
                    placeholder={`Option ${idx + 1}`}
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs bg-transparent border-0 text-slate-900 dark:text-white focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove option"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Explanation
            </label>
            <textarea
              rows={2}
              placeholder="Provide technical reference or why this answer is correct..."
              value={questionFormData.explanation}
              onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* Modal 2: Replace Video Dialog */}
      {isReplaceVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="bg-white dark:bg-[#1A1D21] border border-white/20 dark:border-[#383E47] rounded-[20px] w-full max-w-md p-6 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2B3037]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Replace Training Video Asset
              </h3>
              <button
                onClick={() => setIsReplaceVideoOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Asset Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asset Stream URL
                </label>
                <input
                  type="url"
                  placeholder="https://cdn.notech-hvac.com/training/v2-2026.mp4"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#2B3037]">
                <button
                  type="button"
                  onClick={() => setIsReplaceVideoOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#383E47]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoStatus('Updated');
                    setIsReplaceVideoOpen(false);
                    addToast('Training video link updated successfully', 'success');
                  }}
                  className="px-4 py-2 rounded-xl clean-pill-active"
                >
                  Save Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: View Details for Contractor Breakdown */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="bg-white dark:bg-[#1A1D21] border border-white/20 dark:border-[#383E47] rounded-[20px] w-full max-w-[560px] p-6 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedResult.contractorName} — Scorecard Details
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  {selectedResult.company} · Completed: {selectedResult.completedAt}
                </p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#22262C]">
                <div>
                  <span className="text-slate-500 block text-[11px]">Final Assessment Result</span>
                  <span className={`text-base font-bold font-mono ${selectedResult.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedResult.score} / {selectedResult.maxScore || 10}
                  </span>
                </div>
                <StatusPill status={selectedResult.passed ? 'Passed' : 'Failed'} size="md" />
              </div>

              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">
                  Question Responses (10 Items):
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {(selectedResult.breakdown || []).map((b) => (
                    <div
                      key={b.qId}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${b.correct
                        ? 'bg-[#EBF1E8] border-[#CAD5C2] text-[#3F4F3B] dark:bg-[#1E271E] dark:text-[#BFC399]'
                        : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                        }`}
                    >
                      <span className="font-mono font-bold">Q{b.qId}</span>
                      <span>{b.correct ? '✓ Correct' : '✗ Incorrect'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#2B3037]">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-4 py-2 rounded-xl clean-pill-active text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
