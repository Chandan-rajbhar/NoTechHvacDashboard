import React, { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { MockService } from '../../data/mockService';
import { useApp } from '../../context/AppContext';

export const UsersRolesPage = () => {
  const { currentUser, setCurrentUser, addToast } = useApp();
  const [users, setUsers] = useState(() => MockService.getUsersAndRoles());
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'Operations Staff',
    avatar: '',
  });

  const permissionMatrix = [
    { name: 'Audit Local Mechanical QC Submissions', superAdmin: true, lmReviewer: true, ops: false, support: false },
    { name: 'Approve & Issue LM Contractor Certificates', superAdmin: true, lmReviewer: true, ops: false, support: false },
    { name: 'Flag Repeat Installation Deficiencies', superAdmin: true, lmReviewer: true, ops: true, support: false },
    { name: 'Manage Production Batches & Quotas', superAdmin: true, lmReviewer: false, ops: true, support: false },
    { name: 'Process $200 Deposit Fee Refunds', superAdmin: true, lmReviewer: false, ops: false, support: false },
    { name: 'Customer Communication & Support Notes', superAdmin: true, lmReviewer: false, ops: true, support: true },
    { name: 'System Settings & Brand Tokens', superAdmin: true, lmReviewer: false, ops: false, support: false },
  ];

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;

    let permissions = ['Customer Communication & Support Notes'];
    if (newUserData.role === 'Super Admin') {
      permissions = ['Audit Local Mechanical QC Submissions', 'Approve & Issue LM Contractor Certificates', 'Manage Production Batches & Quotas', 'Process $200 Deposit Fee Refunds'];
    } else if (newUserData.role === 'Local Mechanical Reviewer') {
      permissions = ['Audit Local Mechanical QC Submissions', 'Approve & Issue LM Contractor Certificates', 'Flag Repeat Installation Deficiencies'];
    } else if (newUserData.role === 'Operations Staff') {
      permissions = ['Manage Production Batches & Quotas', 'Flag Repeat Installation Deficiencies', 'Customer Communication'];
    }

    const created = MockService.createUser({
      ...newUserData,
      permissions
    });

    setUsers(MockService.getUsersAndRoles());
    setIsAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'Operations Staff',
      avatar: '',
    });
    addToast(`Admin operator ${created.name} (${created.role}) invited successfully`, 'success');
  };

  const handleDeleteUser = (id, name) => {
    if (id === currentUser?.id) {
      addToast('Cannot delete the currently active operator profile', 'warning');
      return;
    }
    if (window.confirm(`Are you sure you want to revoke access for ${name}?`)) {
      const updated = MockService.deleteUser(id);
      setUsers(updated);
      addToast(`Revoked console credentials for ${name}`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <PageHeader
        title="Administrative Users & Roles"
        subtitle="Console operators, role scopes, and system access permissions."
        actions={
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold clean-pill-active transition-all shadow-water"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Invite / Add Admin User</span>
          </button>
        }
      />

      {/* Active User Card & Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {users.map((u) => {
          const isActive = currentUser?.id === u.id;

          return (
            <div
              key={u.id}
              className={`water-card rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-water relative ${
                isActive
                  ? 'border-[#A4A77E] ring-2 ring-[#A4A77E]/30 bg-gradient-to-br from-[#F8FAF6] to-[#EFF4EB] dark:from-[#1E251E] dark:to-[#171D17]'
                  : 'border-white/80 dark:border-[#383E47]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#A4A77E]/60 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {u.name}
                      </h4>
                      <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate max-w-[130px]">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Revoke User Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#121417] text-white dark:bg-[#A4A77E] dark:text-[#121417] uppercase shadow-sm">
                    {u.role}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {u.badge}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-[#6D6E71] dark:text-[#8D8E92]">
                  {(u.permissions || []).slice(0, 3).map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E] flex-shrink-0" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2B3037]">
                <button
                  onClick={() => {
                    setCurrentUser(u);
                    addToast(`Switched active user context to ${u.name} (${u.role})`, 'info');
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
                    isActive
                      ? 'bg-[#A4A77E] text-[#121417] font-bold cursor-default shadow-sm'
                      : 'border border-slate-200 dark:border-[#383E47] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isActive ? 'Active Operator ✓' : 'Switch to this Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="water-card rounded-2xl p-5 sm:p-6 border border-white/80 dark:border-white/10 shadow-water">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
              Role Permission Access Matrix
            </h3>
            <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
              Segregation of duties between Local Mechanical reviewers and No-Tech operations.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#383E47] bg-[#F4F6F2]/80 dark:bg-[#1E2227]/80 text-[#6D6E71] dark:text-[#8D8E92] font-mono text-[11px] uppercase tracking-wider">
                <th className="px-5 py-3.5 font-bold whitespace-nowrap">Action / Authority Domain</th>
                <th className="px-5 py-3.5 font-bold text-center whitespace-nowrap">Super Admin</th>
                <th className="px-5 py-3.5 font-bold text-center whitespace-nowrap">LM Reviewer</th>
                <th className="px-5 py-3.5 font-bold text-center whitespace-nowrap">Operations</th>
                <th className="px-5 py-3.5 font-bold text-center whitespace-nowrap">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 dark:divide-[#2B3037]">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#A4A77E]/8 dark:hover:bg-[#20252B] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {row.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {row.lmReviewer ? <Check className="w-4 h-4 text-[#73784F] dark:text-[#A4A77E] mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {row.ops ? <Check className="w-4 h-4 text-slate-800 dark:text-slate-200 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {row.support ? <Check className="w-4 h-4 text-slate-800 dark:text-slate-200 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 drawer-backdrop">
          <div className="water-card rounded-2xl w-full max-w-md p-6 bg-white dark:bg-[#1A1D21] border border-white/20 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2B3037]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono">
                  Invite Administrative Operator
                </h3>
                <p className="text-xs text-[#6D6E71] dark:text-[#8D8E92]">
                  Assign role scopes and Local Mechanical oversight credentials.
                </p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
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
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.miller@notech-hvac.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
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
                  placeholder="https://..."
                  value={newUserData.avatar}
                  onChange={(e) => setNewUserData({ ...newUserData, avatar: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#383E47] bg-white/90 dark:bg-[#22262C] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#2B3037]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl water-pill font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl clean-pill-active font-semibold shadow-sm"
                >
                  Authorize User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
