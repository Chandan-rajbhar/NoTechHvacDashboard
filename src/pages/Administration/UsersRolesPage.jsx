import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomSelect } from '../../components/common/CustomSelect';
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
  EyeOff,
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
  Upload,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusPill } from '../../components/common/StatusPill';
import { SlideOverPanel } from '../../components/common/SlideOverPanel';
import { InputField } from '../../components/common/InputField';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ApprovedByLocalMechanicalSeal } from '../../assets/logos';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

const resizeImageToDataUrl = (file, maxSize = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const AvatarUploadField = ({ value, name, onChange, onError }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError?.('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Image must be smaller than 5 MB');
      return;
    }

    setUploading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          if (data?.publicUrl) {
            onChange(data.publicUrl);
            return;
          }
        }
      }

      const dataUrl = await resizeImageToDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      onError?.(err?.message || 'Failed to process avatar image');
    } finally {
      setUploading(false);
    }
  };

  const initials = (name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-200 dark:border-[#383E47] bg-slate-50/70 dark:bg-[#1E2228]">
      {value ? (
        <img
          src={value}
          alt={name || 'Avatar'}
          className="w-24 h-24 rounded-full object-cover border-2 border-[#A4A77E]/60 shadow-sm flex-shrink-0"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-[#A4A77E]/20 border-2 border-dashed border-[#A4A77E]/60 flex items-center justify-center font-mono font-bold text-lg text-[#4E5637] dark:text-[#C5CAB0] flex-shrink-0">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
          Avatar Photo
        </p>
        <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92] mt-1 mb-3">
          PNG, JPG or WebP (max 5 MB)
        </p>
        <div className="flex items-center gap-2.5">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#252A30] border border-slate-200 dark:border-[#383E47] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2D333B] cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : value ? 'Change Photo' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDbUserToUi = (row, getPermissionsForRole) => {
  const created = row.created_at ? new Date(row.created_at) : null;
  const updated = row.updated_at ? new Date(row.updated_at) : null;
  const lastLoginDate = row.last_login ? new Date(row.last_login) : null;
  return {
    id: row.id,
    name: row.full_name || row.email?.split('@')[0] || 'Unnamed User',
    email: row.email || '',
    phone: row.phone || '',
    role: row.role || 'Operator',
    status: row.status === 'Inactive' ? 'Inactive' : 'Active',
    hub: row.hub || 'NorCal Assembly Hub',
    avatar: row.avatar_url || '',
    securityTier: row.security_tier || 'Tier 4 (Verified User)',
    authorityStatus: row.authority_status || 'Active',
    permissions:
      Array.isArray(row.permissions) && row.permissions.length > 0
        ? row.permissions
        : getPermissionsForRole(row.role),
    joinedDate: created
      ? created.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
      : '—',
    updatedAt: updated
      ? updated.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—',
    lastActive: updated
      ? updated.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      : '—',
    lastLogin: lastLoginDate
      ? lastLoginDate.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Never',
    recentActivity: [],
  };
};

export const UsersRolesPage = () => {
  const { currentUser, setCurrentUser, addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userFilters, setUserFilters] = useState({});

  // View Mode: 'list' (tabular registry) | 'profile' (BeautyOasisRx style profile view)
  const [viewMode, setViewMode] = useState('list');
  const [profileTab, setProfileTab] = useState('overview'); // 'overview' | 'scopes' | 'qc' | 'audit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Slide-over states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Form states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    avatar: '',
    password: '',
    confirmPassword: '',
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    status: 'Active',
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
      case 'Contractor':
        return [
          'Installation QC Submissions',
          'Jobsite Telemetry Sync',
          'Schedule Booking Access',
          'EPA Compliance Attestation',
        ];
      case 'Customer':
        return [
          'View Reservation & Batch Tracking',
          'Manage Delivery Windows',
          'Unit Configuration & Options',
          'Support Inquiries & Chatbot',
        ];
      case 'Investor':
        return [
          'Access Data Room & Financials',
          'Submit Capital Allocation Requests',
          'View Unit Economics & Traction',
          'Investor Hub Overview',
        ];
      default:
        return [
          'View Reservation & Batch Tracking',
          'Support Inquiries & Chatbot',
        ];
    }
  };

  const fetchUsers = async ({ showToast = false } = {}) => {
    if (!isSupabaseConfigured || !supabase) {
      setUsers([]);
      setLoadingUsers(false);
      return;
    }

    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row) => mapDbUserToUi(row, getPermissionsForRole));
      setUsers(mapped);

      if (selectedUser) {
        const refreshed = mapped.find((u) => u.id === selectedUser.id);
        if (refreshed) setSelectedUser(refreshed);
      }

      if (showToast) {
        addToast('Users directory refreshed', 'info');
      }
    } catch (err) {
      addToast(err?.message || 'Failed to load users from Supabase', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    addToast(`Copied Credential ID: ${text}`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const validateAddUser = () => {
    const errors = {};
    if (!newUserData.name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!newUserData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (newUserData.phone.trim() && !/^[+\d\s().-]{7,20}$/.test(newUserData.phone.trim())) {
      errors.phone = 'Enter a valid phone number.';
    }
    if (!newUserData.role) {
      errors.role = 'Please select a role.';
    }
    if (!newUserData.password) {
      errors.password = 'Password is required.';
    } else if (newUserData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (!newUserData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (newUserData.password !== newUserData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateAddUser()) return;
    if (!isSupabaseConfigured || !supabase) {
      addToast('Supabase is not configured', 'error');
      return;
    }

    const permissions = getPermissionsForRole(newUserData.role);
    const hub =
      newUserData.role === 'Super Admin'
        ? 'NorCal Regional Assembly Hub (Sacramento, CA)'
        : newUserData.role === 'Contractor'
        ? 'Northern California Service Territory'
        : newUserData.role === 'Investor'
        ? 'California Climate Fund Syndicate'
        : 'Northern California';
    const securityTier =
      newUserData.role === 'Super Admin'
        ? 'Tier 1 (Master Authority)'
        : newUserData.role === 'Contractor'
        ? 'Tier 2 (Certified Partner)'
        : newUserData.role === 'Investor'
        ? 'Tier 3 (Accredited Partner)'
        : 'Tier 4 (Verified Customer)';

    try {
      // Use a temporary non-persisting client so signing up a new user doesn't replace the active admin session
      const { createClient } = await import('@supabase/supabase-js');
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
        email: newUserData.email.trim(),
        password: newUserData.password,
        options: {
          data: {
            full_name: newUserData.name.trim(),
            avatar_url: newUserData.avatar || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      const newUserId = signUpData?.user?.id;
      if (!newUserId) {
        throw new Error('User could not be created. Check Supabase Auth settings.');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: newUserData.name.trim(),
          phone: newUserData.phone || null,
          role: newUserData.role,
          status: 'Active',
          avatar_url: newUserData.avatar || null,
        })
        .eq('id', newUserId);

      if (updateError) throw updateError;

      await fetchUsers();
      setIsAddUserModalOpen(false);
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        role: 'Customer',
        avatar: '',
        password: '',
        confirmPassword: '',
      });
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      addToast(`User "${newUserData.name.trim()}" (${newUserData.role}) added successfully`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to create user', 'error');
    }
  };

  const handleOpenViewProfile = async (row) => {
    setSelectedUser(row);
    setIsViewingProfile(true);
    if (!isSupabaseConfigured || !supabase || !row?.id) return;

    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, status, phone, avatar_url, last_login, created_at, updated_at')
      .eq('id', row.id)
      .maybeSingle();

    if (!error && data) {
      setSelectedUser(mapDbUserToUi(data, getPermissionsForRole));
    }
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      phone: user.phone || '(555) 019-4821',
      role: user.role,
      status: user.status === 'Inactive' ? 'Inactive' : 'Active',
      avatar: user.avatar || '',
      hub: user.hub || 'Northern California',
    });
    setIsEditingUser(true);
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !supabase) return;

    const permissions = getPermissionsForRole(editUserData.role);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editUserData.name.trim(),
          email: editUserData.email.trim(),
          phone: editUserData.phone || null,
          role: editUserData.role,
          status: editUserData.status === 'Inactive' ? 'Inactive' : 'Active',
          avatar_url: editUserData.avatar || null,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      await fetchUsers();

      if (currentUser?.id === selectedUser.id) {
        setCurrentUser((prev) => ({ ...prev, ...editUserData, permissions }));
      }

      setSelectedUser((prev) => ({ ...prev, ...editUserData, permissions }));
      setIsEditingUser(false);
      addToast(`User "${editUserData.name.trim()}" updated successfully`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (id === currentUser?.id) {
      addToast('Cannot delete the currently active operator profile', 'warning');
      return;
    }
    if (!supabase) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
        setIsEditingUser(false);
        setViewMode('list');
        setSearchParams({});
      }
      addToast(`User "${name}" deleted successfully`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to delete user', 'error');
    }
  };

  // ---------------- Table Columns for Operators ----------------

  const operatorColumns = [
    {
      key: 'avatar',
      label: 'Avatar',
      width: '7%',
      render: (val, row) => {
        const initials = (row.name || 'U')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join('');
        return val ? (
          <img
            src={val}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#A4A77E]/50 shadow-xs flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#A4A77E]/20 border border-[#A4A77E]/50 flex items-center justify-center font-mono font-bold text-xs text-[#4E5637] dark:text-[#C5CAB0] flex-shrink-0">
            {initials}
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Full Name',
      sortable: true,
      width: '19%',
      render: (val) => (
        <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
          {val}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '26%',
      render: (val) => (
        <span className="font-mono text-xs text-[#6D6E71] dark:text-[#8D8E92] truncate block">
          {val}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      width: '15%',
      render: (val) => {
        const isSuper = val === 'Super Admin';
        const isCustomer = val === 'Customer';
        const isContractor = val === 'Contractor';
        const isInvestor = val === 'Investor';

        const pillStyle = isSuper
          ? 'bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]'
          : isCustomer
          ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50'
          : isContractor
          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50'
          : isInvestor
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
          : 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50';

        return (
          <div className="flex items-center">
            <span
              className={`font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${pillStyle}`}
            >
              {val}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '12%',
      render: (val) => {
        const isActive = (val || 'Active') === 'Active';
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
                isActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'Active' : 'Inactive'}</span>
          </span>
        );
      },
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      width: '15%',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{val || 'Never'}</span>
        </div>
      ),
    },
  ];

  const operatorFilterOptions = [
    {
      key: 'role',
      label: 'All Roles',
      options: [
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Contractor', value: 'Contractor' },
        { label: 'Investor', value: 'Investor' },
      ],
    },
  ];

  const getOperatorRowActions = (row) => {
    const isActive = currentUser?.id === row.id;
    return [
      {
        label: 'View Profile',
        icon: Eye,
        onClick: () => handleOpenViewProfile(row),
      },
      {
        label: 'Edit',
        icon: Edit2,
        onClick: () => {
          handleOpenEditUser(row);
        },
      },
      { divider: true },
      {
        label: 'Delete',
        icon: Trash2,
        variant: 'danger',
        disabled: isActive,
        onClick: () => setDeleteTarget({ id: row.id, name: row.name }),
      },
    ];
  };

  // Unified Add / Edit User Slide-Over Sheet
  const isEditMode = isEditingUser;
  const isUserSheetOpen = isAddUserModalOpen || isEditingUser;
  const activeFormData = isEditMode ? editUserData : newUserData;
  const updateFormData = (patch) => {
    if (isEditMode) {
      setEditUserData((prev) => ({ ...prev, ...patch }));
    } else {
      setNewUserData((prev) => ({ ...prev, ...patch }));
      const keys = Object.keys(patch);
      setFormErrors((prev) => {
        if (!keys.some((k) => prev[k])) return prev;
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };
  const closeUserSheet = () => {
    setIsAddUserModalOpen(false);
    setIsEditingUser(false);
    setFormErrors({});
  };

  const userFormSheet = (
    <SlideOverPanel
      isOpen={isUserSheetOpen}
      onClose={closeUserSheet}
      title={isEditMode ? 'Edit User' : 'Add User'}
      subtitle={
        isEditMode
          ? 'Update user role, access scopes, and contact details.'
          : 'Create a platform user account with specific role scopes.'
      }
      icon={isEditMode ? Edit2 : UserPlus}
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <button
            type="button"
            onClick={closeUserSheet}
            className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="unified-user-form"
            className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
          >
            {isEditMode ? 'Save Details' : 'Create User'}
          </button>
        </div>
      }
    >
      <form
        id="unified-user-form"
        noValidate
        onSubmit={isEditMode ? handleSaveUserEdit : handleCreateUser}
        className="space-y-4 text-xs"
      >
        <AvatarUploadField
          value={activeFormData.avatar}
          name={activeFormData.name}
          onChange={(avatar) => updateFormData({ avatar })}
          onError={(msg) => addToast(msg, 'error')}
        />

        <InputField
          label="Full Name"
          type="text"
          required
          placeholder="e.g. Jessica Miller"
          value={activeFormData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          error={!isEditMode ? formErrors.name : undefined}
        />

        <InputField
          label="Email"
          type="email"
          required
          placeholder="e.g. j.miller@calclimate.org"
          value={activeFormData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          error={!isEditMode ? formErrors.email : undefined}
        />

        <InputField
          label={isEditMode ? 'Phone Number / Extension' : 'Phone Number'}
          type="text"
          placeholder="(555) 019-4821"
          value={activeFormData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          className="font-mono"
          error={!isEditMode ? formErrors.phone : undefined}
        />

        <div>
          <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
            Role *
          </label>
          <CustomSelect
            value={activeFormData.role}
            onChange={(e) => updateFormData({ role: e.target.value })}
            className="w-full font-mono"
            size="lg"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Customer">Customer</option>
            <option value="Contractor">Contractor</option>
            <option value="Investor">Investor</option>
          </CustomSelect>
          {!isEditMode && formErrors.role && (
            <p className="mt-1 text-[11px] font-medium text-red-600 dark:text-red-400">
              {formErrors.role}
            </p>
          )}
        </div>

        {isEditMode && (
          <div>
            <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <CustomSelect
              value={editUserData.status}
              onChange={(e) => setEditUserData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full font-mono"
              size="lg"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CustomSelect>
          </div>
        )}

        {!isEditMode && (
          <>
            <InputField
              label="Password"
              type={showNewPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={newUserData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              error={formErrors.password}
              className="font-mono"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Re-enter password"
              value={newUserData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              error={formErrors.confirmPassword}
              className="font-mono"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </>
        )}
      </form>
    </SlideOverPanel>
  );

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
              <span>Back to User Management</span>
            </button>
            <div className="text-xs font-mono text-[#6D6E71] dark:text-[#8D8E92] hidden md:flex items-center gap-1.5">
              <span>Dashboard</span>
              <span>/</span>
              <span>User Management</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold">{selectedUser.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await fetchUsers();
                addToast('User details synchronized', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1A1D21] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252A30] transition-colors"
              title="Sync User Credentials"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>

            {!isCurrent ? (
              <button
                onClick={() => {
                  setCurrentUser(selectedUser);
                  addToast(`Switched active context to ${selectedUser.name} (${selectedUser.role})`, 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#A4A77E]/50 bg-[#A4A77E]/15 text-xs font-semibold text-[#4E5637] dark:text-[#C5CAB0] hover:bg-[#A4A77E]/25 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch to this Role</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Console Context</span>
              </span>
            )}

            <button
              onClick={() => handleOpenEditUser(selectedUser)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold clean-pill-active shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit User</span>
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
                    title="Active Context"
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
                        : selectedUser.role === 'Customer'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50'
                        : selectedUser.role === 'Contractor'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
                    }`}
                  >
                    Role: {selectedUser.role}
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
        <div className="p-1.5 bg-slate-200/70 dark:bg-[#181B1F] border border-slate-300/60 dark:border-white/10 rounded-2xl inline-flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full shadow-inner backdrop-blur-md">
          {[
            { id: 'overview', title: 'Overview', icon: UserCheck },
            { id: 'scopes', title: 'Granted Scopes & Permissions', badge: `${selectedUser.permissions?.length || 0}`, icon: Key },
            { id: 'qc', title: 'Local Mechanical QC & Enforcement', badge: 'Verified', icon: Award },
            { id: 'audit', title: 'Audit Trail & Session Activity', badge: `${selectedUser.recentActivity?.length || 4}`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = profileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs tracking-tight whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-[#252A30] text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive
                      ? 'text-slate-900 dark:text-[#A4A77E]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="font-sans">{tab.title}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-800 dark:bg-white/15 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
                        : 'bg-slate-300/50 text-slate-600 dark:bg-white/5 dark:text-slate-400 group-hover:bg-slate-300/70 dark:group-hover:bg-white/10'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
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
                  {selectedUser.role}
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
                    <span className="text-slate-500 dark:text-slate-400">Security Tier:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedUser.securityTier || 'Tier 1'}
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

        {/* Unified Add / Edit User Sheet */}
        {userFormSheet}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: TABULAR REGISTRY & PERMISSION MATRIX (DEFAULT VIEW)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="User Management"
        subtitle="User directory across platform roles, access scopes, and system permissions."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
            >
              <span>Add User</span>
            </button>
          </div>
        }
      />

      {/* 4 Standard KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <KpiCard
          title="Total Users"
          value={users.length}
          icon={Users}
          subtext="Registered platform accounts"
        />
        <KpiCard
          title="Contractors"
          value={users.filter((u) => u.role === 'Contractor').length}
          icon={UserCheck}
          subtext="Certified contractor accounts"
        />
        <KpiCard
          title="Customers"
          value={users.filter((u) => u.role === 'Customer').length}
          icon={ShieldCheck}
          subtext="Registered customer accounts"
        />
        <KpiCard
          title="Investors"
          value={users.filter((u) => u.role === 'Investor').length}
          icon={Key}
          subtext="Accredited capital partners"
        />
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={operatorColumns}
        data={users}
        onRowClick={(row) => handleOpenViewProfile(row)}
        searchPlaceholder="Search by name, email, or role..."
        filters={operatorFilterOptions}
        activeFilters={userFilters}
        onFilterChange={(k, v) => setUserFilters((prev) => ({ ...prev, [k]: v }))}
        pageSize={8}
        rowActions={getOperatorRowActions}
      />

      {/* Unified Add / Edit User Sheet */}
      {userFormSheet}

      {/* Right-Side View Profile Sheet */}
      <SlideOverPanel
        isOpen={isViewingProfile && !!selectedUser}
        onClose={() => setIsViewingProfile(false)}
        title="User Profile"
        subtitle="Account details, role, status, and login activity."
        icon={Eye}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsViewingProfile(false)}
              className="px-4 py-2 rounded-xl water-pill font-semibold text-xs text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
            {selectedUser && (
              <button
                type="button"
                onClick={() => {
                  setIsViewingProfile(false);
                  handleOpenEditUser(selectedUser);
                }}
                className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm text-xs"
              >
                Edit User
              </button>
            )}
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-5 text-xs">
            {/* Hero Profile Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#383E47] bg-white dark:bg-[#1E2228] overflow-hidden shadow-sm">
              <div className="h-16 bg-gradient-to-r from-[#121417] via-[#262B25] to-[#73784F]/80 dark:from-[#16191D] dark:to-[#4E5637]/60 relative" />
              <div className="px-5 pb-5 -mt-10">
                <div className="flex items-end justify-between gap-4">
                  <div className="relative flex-shrink-0">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-[#1E2228] shadow-md bg-white dark:bg-[#22262C]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-[#EAECE0] dark:bg-[#2A2E25] border-4 border-white dark:border-[#1E2228] shadow-md flex items-center justify-center font-mono font-bold text-xl text-[#4E5637] dark:text-[#C5CAB0]">
                        {(selectedUser.name || 'U')
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((p) => p[0].toUpperCase())
                          .join('')}
                      </div>
                    )}
                    <span
                      title={(selectedUser.status || 'Active') === 'Active' ? 'Active' : 'Inactive'}
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#1E2228] ${
                        (selectedUser.status || 'Active') === 'Active'
                          ? 'bg-emerald-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 pb-1">
                    <span className="font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417]">
                      {selectedUser.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono ${
                        (selectedUser.status || 'Active') === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          (selectedUser.status || 'Active') === 'Active'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      {(selectedUser.status || 'Active') === 'Active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">
                    {selectedUser.name}
                  </h3>
                  <p className="font-mono text-xs text-[#6D6E71] dark:text-[#8D8E92] truncate mt-0.5">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Account Details */}
            <div>
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
                Account Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#A4A77E]/15 text-[#5E633C] dark:text-[#C5CAB0] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Email Address
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate block mt-0.5">
                      {selectedUser.email || '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#2B3037] text-slate-500 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Phone
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate block mt-0.5">
                      {selectedUser.phone || '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#2B3037] text-slate-500 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Role
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate block mt-0.5">
                      {selectedUser.role || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timestamps */}
            <div>
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
                Activity & Timestamps
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Last Login
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white block mt-0.5">
                      {selectedUser.lastLogin || 'Never'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#2B3037] text-slate-500 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Created At
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white block mt-0.5">
                      {selectedUser.joinedDate || '—'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/80 dark:bg-[#22262C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#2B3037] text-slate-500 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Updated At
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white block mt-0.5">
                      {selectedUser.updatedAt || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlideOverPanel>

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        isLoading={isDeletingUser}
        icon={Trash2}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setIsDeletingUser(true);
          try {
            await handleDeleteUser(deleteTarget.id, deleteTarget.name);
            setDeleteTarget(null);
          } finally {
            setIsDeletingUser(false);
          }
        }}
      />
    </div>
  );
};
