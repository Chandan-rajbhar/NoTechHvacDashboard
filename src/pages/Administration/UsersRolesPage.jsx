import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  Check,
  X,
  Plus,
  Key,
  Users,
  Trash2,
  Mail,
  UserPlus,
  Edit2,
  Eye,
  Clock,
  RefreshCw,
  Lock,
  Shield,
  CheckCircle,
  ArrowLeft,
  Copy,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Layers,
  Award,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const UsersRolesPage = () => {
  const { currentUser, setCurrentUser, addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState(() => MockService.getUsersAndRoles());
  const [activeTab, setActiveTab] = useState('operators'); // 'operators' | 'matrix'
  const [userFilters, setUserFilters] = useState({});

  // View Mode: 'list' (tabular registry) | 'profile' (BeautyOasisRx style profile view)
  const [viewMode, setViewMode] = useState('list');
  const [profileTab, setProfileTab] = useState('overview'); // 'overview' | 'scopes' | 'qc' | 'audit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Slide-over states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Form states
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '(555) 019-4821',
    role: 'Operations Staff',
    avatar: '',
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Operations Staff',
    badge: '',
    avatar: '',
    hub: '',
  });

  // URL search params sync for deep-linking
  useEffect(() => {
    const profileId = searchParams.get('profile') || searchParams.get('id');
    if (profileId) {
      const match = users.find((u) => u.id === profileId);
      if (match) {
        setSelectedUser(match);
        setViewMode('profile');
        setProfileTab('overview');
      }
    }
  }, [searchParams, users]);

  // Comprehensive 7-domain permission matrix with descriptions
  const permissionMatrix = [
    {
      id: 'p1',
      name: 'Audit Local Mechanical QC Submissions',
      description: 'Review RFID validation logs, delta-T telemetry, and contractor completion submissions.',
      superAdmin: true,
      lmReviewer: true,
      ops: false,
      support: false,
    },
    {
      id: 'p2',
      name: 'Approve & Issue LM Contractor Certificates',
      description: 'Authorize HVAC contractor credentials, issue certification IDs, and approve EPA compliance.',
      superAdmin: true,
      lmReviewer: true,
      ops: false,
      support: false,
    },
    {
      id: 'p3',
      name: 'Flag Repeat Installation Deficiencies',
      description: 'Audit failure logs, mandate contractor retraining, and place unverified technicians on hold.',
      superAdmin: true,
      lmReviewer: true,
      ops: true,
      support: false,
    },
    {
      id: 'p4',
      name: 'Manage Production Batches & Quotas',
      description: 'Initialize chassis allocation, adjust regional hub capacities, and queue manufacturing.',
      superAdmin: true,
      lmReviewer: false,
      ops: true,
      support: false,
    },
    {
      id: 'p5',
      name: 'Process $200 Deposit Fee Refunds',
      description: 'Handle customer cancellation fee reversals and Stripe batch deposit adjustments.',
      superAdmin: true,
      lmReviewer: false,
      ops: false,
      support: false,
    },
    {
      id: 'p6',
      name: 'Customer Communication & Support Notes',
      description: 'Respond to inquiries, update chatbot FAQs, and manage ticket reply threads.',
      superAdmin: true,
      lmReviewer: false,
      ops: true,
      support: true,
    },
    {
      id: 'p7',
      name: 'System Settings & Brand Tokens',
      description: 'Configure corporate metadata, API endpoints, powder-coat colors, and pricing tiers.',
      superAdmin: true,
      lmReviewer: false,
      ops: false,
      support: false,
    },
  ];

  // Scope metadata dictionary for detailed scopes display
  const SCOPE_METADATA = {
    'Full Console Access': {
      domain: 'Console Administration',
      risk: 'Critical',
      description: 'Master administrative bypass across all system modules, credentials, and settings.',
    },
    'Contractor Revocation': {
      domain: 'Contractor Oversight',
      risk: 'Critical',
      description: 'Immediate revocation of contractor license authorization and jobsite access.',
    },
    'Payment Refunds': {
      domain: 'Financial Operations',
      risk: 'High',
      description: 'Processing reversals of $200 batch reservation deposits via Stripe integration.',
    },
    'Batch Overrides': {
      domain: 'Manufacturing Batches',
      risk: 'High',
      description: 'Direct manual overrides for chassis line quotas and delivery priority queues.',
    },
    'System Config': {
      domain: 'System Architecture',
      risk: 'Critical',
      description: 'Modification of corporate metadata, token palettes, and hub regional boundaries.',
    },
    'Audit Local Mechanical QC Submissions': {
      domain: 'Quality Control',
      risk: 'High',
      description: 'Statutory verification of zero refrigerant loss, Delta-T benchmarks, and RFID coupling.',
    },
    'Approve & Issue LM Contractor Certificates': {
      domain: 'Regulatory Authority',
      risk: 'Critical',
      description: 'Issuance of official Local Mechanical certification seals and license credentials.',
    },
    'Flag Repeat Installation Deficiencies': {
      domain: 'Quality Enforcement',
      risk: 'High',
      description: 'Mandatory suspension or retraining enforcement for contractors failing QC standards.',
    },
    'Issue Official Quality Certificates': {
      domain: 'Statutory Certification',
      risk: 'High',
      description: 'Generation of certified quality seals for compliant HVAC residential jobsites.',
    },
    'Manage Production Batches & Quotas': {
      domain: 'Manufacturing Batches',
      risk: 'Operational',
      description: 'Production line slotting, chassis scheduling, and regional assembly tracking.',
    },
    'Assign Contractors': {
      domain: 'Dispatch Logistics',
      risk: 'Operational',
      description: 'Assignment of certified technicians to booked customer installation windows.',
    },
    'Update Compartment Stock': {
      domain: 'Inventory Logistics',
      risk: 'Operational',
      description: 'Stock management for Blower, Evaporator, Gas/Heat, and Inverter modules.',
    },
    'Customer Communication & Support Notes': {
      domain: 'Customer Operations',
      risk: 'Standard',
      description: 'Logging internal jobsite staff notes and replying to ticket discussions.',
    },
    'View Customer Data': {
      domain: 'Customer Operations',
      risk: 'Standard',
      description: 'Read-only access to customer jobsites, batch statuses, and contact details.',
    },
    'Respond to Inquiries': {
      domain: 'Support & Chatbot',
      risk: 'Standard',
      description: 'Direct response handling for customer inquiries and contractor technical requests.',
    },
    'Update Chatbot FAQs': {
      domain: 'Support & Chatbot',
      risk: 'Standard',
      description: 'Editing automated knowledge base questions, flows, and recommended actions.',
    },
  };

  // Helper to calculate permissions based on role
  const getPermissionsForRole = (role) => {
    switch (role) {
      case 'Super Admin':
        return [
          'Full Console Access',
          'Contractor Revocation',
          'Payment Refunds',
          'Batch Overrides',
          'System Config',
          'Audit Local Mechanical QC Submissions',
        ];
      case 'Local Mechanical Reviewer':
        return [
          'Audit Local Mechanical QC Submissions',
          'Approve & Issue LM Contractor Certificates',
          'Flag Repeat Installation Deficiencies',
          'Issue Official Quality Certificates',
        ];
      case 'Operations Staff':
      case 'Operations':
        return [
          'Manage Production Batches & Quotas',
          'Flag Repeat Installation Deficiencies',
          'Customer Communication & Support Notes',
          'Assign Contractors',
          'Update Compartment Stock',
        ];
      case 'Support Lead':
      case 'Support':
      default:
        return [
          'Customer Communication & Support Notes',
          'View Customer Data',
          'Respond to Inquiries',
          'Update Chatbot FAQs',
        ];
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    addToast(`Copied Credential ID: ${text}`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;

    const permissions = getPermissionsForRole(newUserData.role);
    const created = MockService.createUser({
      ...newUserData,
      permissions,
      hub: 'NorCal Regional Assembly Hub (Sacramento, CA)',
      securityTier:
        newUserData.role === 'Super Admin'
          ? 'Tier 1 (Master Authority)'
          : newUserData.role === 'Local Mechanical Reviewer'
          ? 'Tier 2 (QC Reviewer)'
          : 'Tier 3 (Operational Lead)',
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: 'Authorized console operator account established',
          timestamp: 'Just now',
          type: 'security',
          status: 'Active',
        },
      ],
    });

    const updatedUsers = MockService.getUsersAndRoles();
    setUsers(updatedUsers);
    setIsAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      phone: '(555) 019-4821',
      role: 'Operations Staff',
      avatar: '',
    });
    addToast(`Admin operator ${created.name} (${created.role}) authorized successfully`, 'success');
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      phone: user.phone || '(555) 019-4821',
      role: user.role,
      badge: user.badge || '',
      avatar: user.avatar || '',
      hub: user.hub || 'NorCal Regional Assembly Hub (Sacramento, CA)',
    });
    setIsEditingUser(true);
  };

  const handleSaveUserEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const permissions = getPermissionsForRole(editUserData.role);
    const badge =
      editUserData.badge ||
      (editUserData.role === 'Super Admin'
        ? 'Executive Master Authority'
        : editUserData.role === 'Local Mechanical Reviewer'
        ? 'Certified Authority'
        : editUserData.role.includes('Operations')
        ? 'Assembly Lead'
        : 'Customer Care');

    MockService.updateUser(selectedUser.id, {
      ...editUserData,
      badge,
      permissions,
    });

    const updated = MockService.getUsersAndRoles();
    setUsers(updated);

    if (currentUser?.id === selectedUser.id) {
      setCurrentUser((prev) => ({ ...prev, ...editUserData, badge, permissions }));
    }

    setSelectedUser((prev) => ({ ...prev, ...editUserData, badge, permissions }));
    setIsEditingUser(false);
    addToast(`Operator credentials for ${editUserData.name} updated successfully`, 'success');
  };

  const handleDeleteUser = (id, name) => {
    if (id === currentUser?.id) {
      addToast('Cannot delete the currently active operator profile', 'warning');
      return;
    }
    const updated = MockService.deleteUser(id);
    setUsers(updated);
    if (selectedUser?.id === id) {
      setSelectedUser(null);
      setIsEditingUser(false);
      setViewMode('list');
      setSearchParams({});
    }
    addToast(`Revoked console credentials for ${name}`, 'info');
  };

  // ---------------- Table Columns for Operators ----------------

  const operatorColumns = [
    {
      key: 'name',
      label: 'Operator Profile',
      sortable: true,
      width: '26%',
      render: (val, row) => {
        const isCurrent = currentUser?.id === row.id;
        return (
          <div className="flex items-center gap-3">
            <img
              src={
                row.avatar ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80'
              }
              alt={val}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#A4A77E]/50 shadow-xs flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {val}
                </span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-[#A4A77E]/20 text-[#4E5637] dark:text-[#C5CAB0] border border-[#A4A77E]/40">
                    ACTIVE
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
                {row.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      label: 'Authority Role',
      sortable: true,
      width: '20%',
      render: (val, row) => {
        const isSuper = val === 'Super Admin';
        const isLM = val.includes('Mechanical');
        return (
          <div className="flex flex-col items-start gap-1">
            <span
              className={`font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isSuper
                  ? 'bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]'
                  : isLM
                  ? 'bg-[#73784F]/15 text-[#73784F] dark:text-[#A4A77E] border border-[#73784F]/30'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {val}
            </span>
            {row.badge && (
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {row.badge}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'permissions',
      label: 'Access Scopes',
      width: '24%',
      hideBelowXl: true,
      render: (val) => {
        const perms = val || [];
        return (
          <div className="max-w-xs">
            <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
              {perms.length} Access Scopes
            </span>
            <span className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate block">
              {perms.slice(0, 2).join(', ')}
              {perms.length > 2 ? ` +${perms.length - 2} more` : ''}
            </span>
          </div>
        );
      },
    },
    {
      key: 'lastActive',
      label: 'Session / Activity',
      sortable: true,
      width: '15%',
      hideBelowXl: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{val || 'Active session'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Operator Context',
      width: '15%',
      render: (_, row) => {
        const isActive = currentUser?.id === row.id;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'Active Operator' : 'Standby'}</span>
          </span>
        );
      },
    },
  ];

  const operatorFilterOptions = [
    {
      key: 'role',
      label: 'All Authority Roles',
      options: [
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'Local Mechanical Reviewer', value: 'Local Mechanical Reviewer' },
        { label: 'Operations Staff', value: 'Operations' },
        { label: 'Support Lead', value: 'Support' },
      ],
    },
  ];

  const getOperatorRowActions = (row) => {
    const isActive = currentUser?.id === row.id;
    return [
      {
        label: 'View Operator Profile',
        icon: Eye,
        onClick: () => {
          setSelectedUser(row);
          setViewMode('profile');
          setProfileTab('overview');
          setSearchParams({ profile: row.id });
        },
      },
      {
        label: isActive ? 'Active Context (Selected)' : 'Switch to this Role',
        icon: UserCheck,
        disabled: isActive,
        onClick: () => {
          setCurrentUser(row);
          addToast(`Switched active operator context to ${row.name} (${row.role})`, 'info');
        },
      },
      {
        label: 'Edit Role & Scopes',
        icon: Edit2,
        onClick: () => {
          handleOpenEditUser(row);
        },
      },
      { divider: true },
      {
        label: 'Revoke Credentials',
        icon: Trash2,
        variant: 'danger',
        disabled: isActive,
        onClick: () => handleDeleteUser(row.id, row.name),
        confirmMessage: `Are you sure you want to revoke administrative access for ${row.name}?`,
      },
    ];
  };

  // ---------------- Table Columns for Permission Matrix ----------------

  const matrixColumns = [
    {
      key: 'name',
      label: 'Action / Authority Domain',
      sortable: true,
      width: '40%',
      render: (val, row) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white block">
            {val}
          </span>
          <span className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] block mt-0.5">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      key: 'superAdmin',
      label: 'Super Admin',
      width: '15%',
      render: (val) => (
        <div className="flex items-center justify-center">
          {val ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'lmReviewer',
      label: 'LM Reviewer',
      width: '15%',
      render: (val) => (
        <div className="flex items-center justify-center">
          {val ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#A4A77E]/20 text-[#4E5637] dark:text-[#BFC399]">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'ops',
      label: 'Operations',
      width: '15%',
      render: (val) => (
        <div className="flex items-center justify-center">
          {val ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'support',
      label: 'Support',
      width: '15%',
      render: (val) => (
        <div className="flex items-center justify-center">
          {val ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
  ];

  // =========================================================================
  // VIEW MODE: BEAUTY OASIS RX STYLE ADMIN OPERATOR PROFILE VIEW
  // =========================================================================
  if (viewMode === 'profile' && selectedUser) {
    const isCurrent = currentUser?.id === selectedUser.id;
    const isSuper = selectedUser.role === 'Super Admin';
    const isLM = selectedUser.role.includes('Mechanical');

    return (
      <div className="space-y-6 animate-fade-in w-full">
        {/* Top Navigation & Breadcrumbs Bar (Matching BeautyOasisRx Layout) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewMode('list');
                setSearchParams({});
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#252A30] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Administrative Operators</span>
            </button>
            <div className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92] hidden md:flex items-center gap-1.5">
              <span>Dashboard</span>
              <span>/</span>
              <span>Administrative Users & Roles</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold">{selectedUser.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const refreshed = MockService.getUsersAndRoles().find((u) => u.id === selectedUser.id);
                if (refreshed) setSelectedUser(refreshed);
                addToast('Operator credentials synchronized', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252A30] transition-colors"
              title="Sync Operator Credentials"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>

            {!isCurrent ? (
              <button
                onClick={() => {
                  setCurrentUser(selectedUser);
                  addToast(`Switched active operator context to ${selectedUser.name} (${selectedUser.role})`, 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#A4A77E]/50 bg-[#A4A77E]/15 text-xs font-semibold text-[#4E5637] dark:text-[#C5CAB0] hover:bg-[#A4A77E]/25 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch to this Role</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Console Operator</span>
              </span>
            )}

            <button
              onClick={() => handleOpenEditUser(selectedUser)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Operator</span>
            </button>
          </div>
        </div>

        {/* Hero Header Card (Matching BeautyOasisRx Layout) */}
        <div className="water-card rounded-2xl p-6 sm:p-7 border border-white/80 dark:border-white/10 shadow-water relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative flex-shrink-0">
                <img
                  src={
                    selectedUser.avatar ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80'
                  }
                  alt={selectedUser.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-[#A4A77E] shadow-md"
                />
                {isCurrent && (
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E2227] flex items-center justify-center text-white"
                    title="Active Operator Context"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedUser.name}
                  </h2>
                  <span
                    className={`font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isSuper
                        ? 'bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]'
                        : isLM
                        ? 'bg-[#73784F]/15 text-[#73784F] dark:text-[#A4A77E] border border-[#73784F]/30'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Role: {selectedUser.role}
                  </span>
                  <span className="font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                    {selectedUser.badge || 'Console Operator'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92] flex-wrap">
                  <span>ID: {selectedUser.id}</span>
                  <button
                    onClick={() => copyToClipboard(selectedUser.id)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Copy Operator Credential ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span>•</span>
                  <span>Hub: <strong className="text-slate-800 dark:text-slate-200">{selectedUser.hub || 'NorCal Assembly Hub'}</strong></span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#A4A77E]" />
                    <span>{selectedUser.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#A4A77E]" />
                    <span>{selectedUser.phone || '(555) 019-4821 • Ext 104'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 3 Metric Counters (Matching BeautyOasisRx layout) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-auto w-full pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#2B3037]">
              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[105px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  GRANTED SCOPES
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  {selectedUser.permissions?.length || 5} Scopes
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[105px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  SECURITY LEVEL
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block truncate">
                  {selectedUser.securityTier ? selectedUser.securityTier.split(' ')[0] : 'Tier 1'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#383E47] bg-white/60 dark:bg-[#1E2227]/60 text-center min-w-[105px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  AUTHORITY STATUS
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#4E5637] dark:text-[#C5CAB0] font-mono mt-1 block truncate">
                  {isCurrent ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation Bar (Matching BeautyOasisRx) */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-[#383E47] overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'scopes', label: `Granted Scopes & Permissions (${selectedUser.permissions?.length || 0})` },
            { id: 'qc', label: 'Local Mechanical QC & Enforcement' },
            { id: 'audit', label: `Audit Trail & Session Activity (${selectedUser.recentActivity?.length || 4})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                profileTab === tab.id
                  ? 'clean-pill-active shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252A30]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {profileTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 3 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">Enforced Authority Scopes</span>
                  <div className="w-8 h-8 rounded-xl bg-[#A4A77E]/15 text-[#4E5637] dark:text-[#C5CAB0] flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {selectedUser.permissions?.length || 5} Scopes
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Segregation of duties verified · Zero policy conflicts
                </p>
              </div>

              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">Security Authority Rank</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedUser.badge || 'Executive'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedUser.securityTier || 'Tier 1 (Master Authority)'} · Hardware MFA Enforced
                </p>
              </div>

              <div className="water-card p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92]">Console Session Status</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {selectedUser.lastActive || 'Active now'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sacramento Hub Secure Gateway · 256-bit Session Key
                </p>
              </div>
            </div>

            {/* 2 Large Side-by-Side Cards (Matching BeautyOasisRx layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Operator Profile & System Access Credentials */}
              <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
                  <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#A4A77E]" />
                    <span>Operator Profile & Access Credentials</span>
                  </h3>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {selectedUser.id}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Full Legal Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedUser.name}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Corporate Email:</span>
                    <span className="font-mono text-slate-900 dark:text-white">{selectedUser.email}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Authority Role:</span>
                    <span className="font-mono font-bold text-[#4E5637] dark:text-[#C5CAB0]">
                      {selectedUser.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Statutory Badge:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedUser.badge || 'Executive'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Authorized Regional Hub:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {selectedUser.hub || 'NorCal Regional Assembly Hub (Sacramento, CA)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Quality Oversight Affiliation:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Local Mechanical Regulatory Authority
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-[#262A30]">
                    <span className="text-slate-500 dark:text-slate-400">Account Authorized Since:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedUser.joinedDate || 'January 14, 2024'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400">Active Console Session:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isCurrent ? 'Current Active Operator' : 'Standby Operator Context'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Statutory Mandates & QC Enforcement Scope */}
              <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
                  <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Mandates & QC Enforcement</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                    Segregation Enforced
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-[#A4A77E] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {isLM
                          ? 'Local Mechanical Quality Review Authority'
                          : isSuper
                          ? 'Full Executive Console & Override Authority'
                          : 'Operational Quota & Dispatch Oversight'}
                      </span>
                      <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5 leading-relaxed">
                        {isLM
                          ? 'Holds statutory jurisdiction under the Local Mechanical Quality & Regulatory Office. Authorized to approve or reject installer credentials and inspect zero refrigerant loss telemetry.'
                          : isSuper
                          ? 'Unrestricted console authority over chassis quotas, $200 reservation fees, batch overrides, and contractor revocation policies.'
                          : 'Manages chassis fulfillment queues, warehouse compartment stock, and technician appointment windows.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#2B3037]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Local Mechanical QC Audits
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] font-bold text-emerald-600 uppercase">
                      {isLM || isSuper ? 'Authorized' : 'Restricted'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#2B3037]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Contractor EPA 608 Certifications
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] font-bold text-emerald-600 uppercase">
                      {isLM || isSuper ? 'Statutory Delegate' : 'View Only'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#2B3037]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Repeat Deficiency Mandates
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] font-bold text-emerald-600 uppercase">
                      Enforced
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#2B3037]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Chassis Batch Quotas & Scheduling
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                      {isSuper || selectedUser.role.includes('Operations') ? 'Unrestricted' : 'Audited'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditUser(selectedUser)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#383E47] text-xs font-semibold hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Scopes</span>
                  </button>

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        setCurrentUser(selectedUser);
                        addToast(`Switched active operator context to ${selectedUser.name}`, 'info');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Switch to this Role</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: GRANTED SCOPES & PERMISSIONS ==================== */}
        {profileTab === 'scopes' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Granted Authority Scopes & Access Policies
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Enforced security policy permissions authorized for {selectedUser.name} ({selectedUser.role}).
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#4E5637] dark:text-[#C5CAB0]">
                {selectedUser.permissions?.length || 0} Total Scopes Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedUser.permissions || []).map((permName, idx) => {
                const meta = SCOPE_METADATA[permName] || {
                  domain: 'Administrative Scope',
                  risk: 'Operational',
                  description: 'Active access scope authorized under this console role profile.',
                };
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {permName}
                        </span>
                      </div>
                      <span
                        className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          meta.risk === 'Critical'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40'
                            : meta.risk === 'High'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40'
                        }`}
                      >
                        {meta.risk}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {meta.description}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#2B3037] text-[10.5px] font-mono">
                      <span className="text-slate-400">Domain: {meta.domain}</span>
                      <span className="text-emerald-600 font-bold">Enforced ✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: LOCAL MECHANICAL QC & ENFORCEMENT ==================== */}
        {profileTab === 'qc' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Local Mechanical Quality & Regulatory Jurisdiction
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Zero-refrigerant-loss compliance, RFID telemetry audits, and certified contractor credentials.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A4A77E]/15 border border-[#A4A77E]/30 text-xs font-mono font-bold text-[#4E5637] dark:text-[#C5CAB0]">
                <ShieldCheck className="w-4 h-4 text-[#A4A77E]" />
                <span>Statutory Authority</span>
              </div>
            </div>

            {/* Regulatory Protocol Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E2227]/70 border border-slate-100 dark:border-[#2B3037] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Zero Refrigerant Loss Mandate (EPA Clean Air Act Section 608)
                </span>
                <span className="font-mono text-emerald-600 font-bold">100% Compliant</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                All modular chassis disconnections and replacements must utilize factory pre-charged hermetic quick-connect dry couplings. Installation technicians without active Local Mechanical certifications are restricted from commissioning units.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#252A30] border border-slate-200/80 dark:border-[#383E47]">
                  <span className="text-[10.5px] font-mono text-slate-500 uppercase block">RFID Tag Verification</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">Automated Coupling Bus</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Enforced ✓</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#252A30] border border-slate-200/80 dark:border-[#383E47]">
                  <span className="text-[10.5px] font-mono text-slate-500 uppercase block">Delta-T Benchmark</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">18.0°F – 22.0°F Range</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Signed Off ✓</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#252A30] border border-slate-200/80 dark:border-[#383E47]">
                  <span className="text-[10.5px] font-mono text-slate-500 uppercase block">Contractor Retraining</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">Zero Tolerance Policy</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Active Mandate</span>
                </div>
              </div>
            </div>

            {/* Recent QC Sign-Offs Table */}
            <div className="space-y-3">
              <span className="font-mono uppercase font-bold text-xs text-slate-800 dark:text-slate-200 block">
                Recent Quality Audits & Certifications Approved
              </span>
              <div className="space-y-2 text-xs">
                {[
                  {
                    target: 'Marcus Vance (Vance Mechanical Services)',
                    type: 'EPA 608 Contractor Certificate',
                    date: 'Yesterday at 3:15 PM',
                    status: 'Approved & Signed',
                  },
                  {
                    target: 'Jobsite David Sterling (Batch NT-BATCH-2026-084)',
                    type: 'Delta-T Telemetry Benchmark (19.8°F)',
                    date: 'Oct 24, 2026',
                    status: 'Passed QC Review',
                  },
                  {
                    target: 'Robert Vance Jr. (Lic #CA-94812)',
                    type: 'Local Mechanical Official Seal Issuance',
                    date: 'Oct 23, 2026',
                    status: 'Certificate Issued',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl water-card border border-slate-100 dark:border-[#2B3037] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.target}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-600 font-bold block">{item.status}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: AUDIT TRAIL & SESSION ACTIVITY ==================== */}
        {profileTab === 'audit' && (
          <div className="water-card p-6 rounded-2xl border border-white/80 dark:border-white/10 shadow-water space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                  Console Audit Trail & Security Event Log
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Cryptographic log of actions executed under credential identifier {selectedUser.id}.
                </p>
              </div>
              <span className="font-mono text-emerald-600 font-bold text-xs">
                Audit Verified ✓
              </span>
            </div>

            <div className="space-y-3">
              {(selectedUser.recentActivity || [
                {
                  id: 'act-def-1',
                  action: 'Authorized Batch NT-BATCH-2026-084 quota allocation',
                  timestamp: 'Today at 10:24 AM',
                  type: 'batch',
                  status: 'Completed',
                },
                {
                  id: 'act-def-2',
                  action: 'Validated EPA 608 Certification renewal for Marcus Vance',
                  timestamp: 'Yesterday at 3:15 PM',
                  type: 'contractor',
                  status: 'Approved',
                },
                {
                  id: 'act-def-3',
                  action: 'Reviewed RFID zero-refrigerant-loss telemetry for Jobsite CUST-8024',
                  timestamp: 'Oct 24, 2026',
                  type: 'qc',
                  status: 'Signed Off',
                },
                {
                  id: 'act-def-4',
                  action: 'Synchronized assembly line compartment stock quotas',
                  timestamp: 'Oct 21, 2026',
                  type: 'system',
                  status: 'Synchronized',
                },
              ]).map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-4 rounded-xl border border-slate-100 dark:border-[#2B3037] flex items-center justify-between text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {log.action}
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-500">
                        Session IP: 192.168.1.42 · NorCal Assembly Hub Gateway
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 block">
                      {log.status || 'Verified'}
                    </span>
                    <span className="font-mono text-[10.5px] text-slate-400 block">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Embedded Slide-Over Panel for Edit Operator */}
        <SlideOverPanel
          isOpen={isEditingUser}
          onClose={() => setIsEditingUser(false)}
          title={`Edit Operator: ${selectedUser.name}`}
          subtitle="Update administrative role scopes and Local Mechanical oversight credentials."
          idChip={selectedUser.id}
          icon={Edit2}
          footer={
            <div className="flex items-center justify-end gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setIsEditingUser(false)}
                className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-edit-user-form"
                className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
              >
                Save Credentials
              </button>
            </div>
          }
        >
          <form id="profile-edit-user-form" onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={editUserData.name}
                onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Phone / Extension
              </label>
              <input
                type="text"
                value={editUserData.phone}
                onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Authority Role *
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                >
                  <option value="Super Admin">Super Admin (Master Authority)</option>
                  <option value="Local Mechanical Reviewer">Local Mechanical Reviewer</option>
                  <option value="Operations Staff">Operations Staff</option>
                  <option value="Support Lead">Support Lead</option>
                </select>
              </div>
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Statutory Title / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Executive"
                  value={editUserData.badge}
                  onChange={(e) => setEditUserData({ ...editUserData, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Assembly Hub
              </label>
              <input
                type="text"
                value={editUserData.hub}
                onChange={(e) => setEditUserData({ ...editUserData, hub: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editUserData.avatar}
                onChange={(e) => setEditUserData({ ...editUserData, avatar: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </form>
        </SlideOverPanel>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: TABULAR REGISTRY & PERMISSION MATRIX (DEFAULT VIEW)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Administrative Users & Roles"
        subtitle="Console operators, role scopes, and system access permissions."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Invite / Add Admin User</span>
            </button>
            <button
              onClick={() => {
                setUsers(MockService.getUsersAndRoles());
                addToast('Administrative operators refreshed', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-slate-600 dark:text-slate-300"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* 4 Standard KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <KpiCard
          title="Console Operators"
          value={users.length}
          icon={Users}
          subtext="Configured administrative accounts"
        />
        <KpiCard
          title="Active Context"
          value={currentUser?.name || 'Super Admin'}
          icon={UserCheck}
          subtext={currentUser?.role || 'Executive Authority'}
        />
        <KpiCard
          title="LM Authorities"
          value={users.filter((u) => u.role.includes('Mechanical') || u.badge?.includes('Authority')).length}
          icon={ShieldCheck}
          subtext="Certified enforcement delegates"
        />
        <KpiCard
          title="Policy Domains"
          value="7 Scopes"
          icon={Key}
          subtext="Segregation of duties matrix"
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#383E47] pb-2">
        <button
          onClick={() => setActiveTab('operators')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === 'operators'
              ? 'clean-pill-active'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Administrative Operators ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'clean-pill-active'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Role Permission Access Matrix (7 Domains)</span>
        </button>
      </div>

      {/* TAB 1: Administrative Operators DataTable */}
      {activeTab === 'operators' && (
        <DataTable
          columns={operatorColumns}
          data={users}
          onRowClick={(row) => {
            setSelectedUser(row);
            setViewMode('profile');
            setProfileTab('overview');
            setSearchParams({ profile: row.id });
          }}
          searchPlaceholder="Search operator name, corporate email, role..."
          filters={operatorFilterOptions}
          activeFilters={userFilters}
          onFilterChange={(k, v) => setUserFilters((prev) => ({ ...prev, [k]: v }))}
          pageSize={8}
          rowActions={getOperatorRowActions}
        />
      )}

      {/* TAB 2: Role Permission Access Matrix DataTable */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Segregation of Duties Enforcement</span>
              <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
                Local Mechanical Reviewers hold exclusive statutory authority over installation approvals and installer certification certificates. No-Tech HVAC operations personnel are restricted from modifying quality control determinations.
              </p>
            </div>
          </div>

          <DataTable
            columns={matrixColumns}
            data={permissionMatrix}
            searchPlaceholder="Search authority domain, action name, description..."
            pageSize={8}
          />
        </div>
      )}

      {/* Slide-In Edit Operator Panel (from table row actions) */}
      <SlideOverPanel
        isOpen={isEditingUser}
        onClose={() => setIsEditingUser(false)}
        title={selectedUser ? `Edit Operator: ${selectedUser.name}` : ''}
        subtitle="Update administrative role scopes and Local Mechanical credentials."
        idChip={selectedUser?.id}
        icon={Edit2}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsEditingUser(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="list-edit-user-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Save Credentials
            </button>
          </div>
        }
      >
        <form id="list-edit-user-form" onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={editUserData.name}
              onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Corporate Email Address *
            </label>
            <input
              type="email"
              required
              value={editUserData.email}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Corporate Phone / Extension
            </label>
            <input
              type="text"
              value={editUserData.phone}
              onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Authority Role *
              </label>
              <select
                value={editUserData.role}
                onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
              >
                <option value="Super Admin">Super Admin (Master Authority)</option>
                <option value="Local Mechanical Reviewer">Local Mechanical Reviewer</option>
                <option value="Operations Staff">Operations Staff</option>
                <option value="Support Lead">Support Lead</option>
              </select>
            </div>
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Badge / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Executive"
                value={editUserData.badge}
                onChange={(e) => setEditUserData({ ...editUserData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Authorized Assembly Hub
            </label>
            <input
              type="text"
              value={editUserData.hub}
              onChange={(e) => setEditUserData({ ...editUserData, hub: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={editUserData.avatar}
              onChange={(e) => setEditUserData({ ...editUserData, avatar: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>
        </form>
      </SlideOverPanel>

      {/* Slide-In Add User Panel */}
      <SlideOverPanel
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Invite Administrative Operator"
        subtitle="Assign role scopes and Local Mechanical oversight credentials."
        icon={UserPlus}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-user-form"
              className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
            >
              Authorize User
            </button>
          </div>
        }
      >
        <form id="add-user-form" onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica Miller"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Corporate Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. j.miller@localindustries.org"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Corporate Phone Number
            </label>
            <input
              type="text"
              placeholder="(555) 019-4821"
              value={newUserData.phone}
              onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Authority Role *
            </label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
            >
              <option value="Super Admin">Super Admin (Full Master Authority)</option>
              <option value="Local Mechanical Reviewer">Local Mechanical Reviewer (QC & Regulatory)</option>
              <option value="Operations Staff">Operations Staff (Batches & Dispatch)</option>
              <option value="Support Lead">Support Lead (Customer Inquiries)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Avatar Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={newUserData.avatar}
              onChange={(e) => setNewUserData({ ...newUserData, avatar: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white font-mono"
            />
          </div>
        </form>
      </SlideOverPanel>
    </div>
  );
};
