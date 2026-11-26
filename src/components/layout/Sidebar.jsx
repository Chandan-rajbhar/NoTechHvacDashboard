import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Box,
  Tags,
  UserCheck,
  HardHat,
  GraduationCap,
  ClipboardCheck,
  Users,
  Calendar,
  MessageSquare,
  ShieldAlert,
  CreditCard,
  Settings,
  Sparkles,
  ExternalLink,
  TrendingUp,
  Inbox,
  Target,
  Folder,
  X,
} from 'lucide-react';
import {
  NoTechHvacLogo,
  NoTechHvacIcon,
  NoTechWordmarkEst2022,
} from '../../assets/logos';
import notechIcon from '../../assets/notech-icon.png';
import { useApp } from '../../context/AppContext';
import { MockService } from '../../data/mockService';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, currentUser, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const location = useLocation();

  // Dynamic count of pending allocation requests for active round
  const pendingAllocationsCount = React.useMemo(() => {
    try {
      const activeRound = MockService.getFundingRound();
      return MockService.getAllocationRequests().filter(
        r => r.status === 'Pending' && (!activeRound?.name || r.round === activeRound.name)
      ).length;
    } catch {
      return 1;
    }
  }, [location.pathname]);

  const navSections = [
    {
      group: 'STORE & PRODUCTION',
      items: [
        { path: '/', label: 'Dashboard Overview', icon: LayoutDashboard },
        { path: '/reservations', label: 'Reservations', icon: Layers, badge: '142' },
        { path: '/units', label: 'Units & Compartments', icon: Box },
        { path: '/pricing', label: 'Pricing & Options', icon: Tags },
      ],
    },
    {
      group: 'CONTRACTOR NETWORK',
      badge: 'Local Mech',
      items: [
        { path: '/contractor-approvals', label: 'Contractor Approvals', icon: UserCheck, countBadge: '4' },
        { path: '/contractors', label: 'Contractors Directory', icon: HardHat },
        { path: '/training-questionnaire', label: 'Training & Questionnaire', icon: GraduationCap },
        { path: '/installations-qc', label: 'Installations & QC', icon: ClipboardCheck, countBadge: '3', alertBadge: true },
      ],
    },
    {
      group: 'CUSTOMERS',
      items: [
        { path: '/customers', label: 'Customers', icon: Users },
        { path: '/scheduling', label: 'Scheduling & Time Slots', icon: Calendar },
        { path: '/inquiries-chatbot', label: 'Inquiries & Chatbot', icon: MessageSquare, countBadge: '2' },
      ],
    },
    {
      group: 'INVESTORS',
      items: [
        { path: '/investor-overview', label: 'Investor Overview', icon: TrendingUp },
        { path: '/investors', label: 'Investors', icon: Users },
        { path: '/allocation-requests', label: 'Allocation Requests', icon: Inbox, countBadge: pendingAllocationsCount > 0 ? String(pendingAllocationsCount) : undefined },
        { path: '/funding-round', label: 'Funding Round', icon: Target },
        { path: '/data-room', label: 'Data Room', icon: Folder },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { path: '/users-roles', label: 'Users & Roles', icon: ShieldAlert },
        { path: '/payments', label: 'Payments & Deposits', icon: CreditCard },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { path: '/settings', label: 'Console Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out flex flex-col justify-between glass-panel-dark text-slate-300 overflow-x-hidden ${
          sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[268px]'
        } w-[280px] max-w-[85vw] ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo Header */}
        <div
          className={`h-[76px] flex items-center border-b border-[#2C3036] bg-gradient-to-b from-[#1E2126] to-[#14161A] flex-shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? 'justify-center px-3' : 'px-4 sm:px-5'
          }`}
        >
          <NavLink
            to="/"
            onClick={() => {
              if (sidebarCollapsed) setSidebarCollapsed(false);
            }}
            className="flex items-center gap-3 min-w-0 group"
            title="No-Tech HVAC Admin Console"
          >
            {/* Rounded dark square badge without border - increased by 20% */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#262A31] to-[#181B1F] border-0 flex items-center justify-center p-1.5 shadow-md flex-shrink-0">
              <img
                src={notechIcon}
                alt="No-Tech HVAC"
                className="h-[29px] w-auto object-contain select-none"
              />
            </div>

            {/* Text Lockup: No-Tech HVAC - gracefully reveals after sidebar expands */}
            <div
              className={`flex flex-col min-w-0 transition-all duration-200 ${
                sidebarCollapsed
                  ? 'opacity-0 max-w-0 overflow-hidden pointer-events-none'
                  : 'opacity-100 max-w-[180px] overflow-hidden delay-150'
              }`}
            >
              <div className="font-display font-bold text-[16px] leading-tight tracking-tight flex items-center whitespace-nowrap">
                <span className="text-white">No-Tech</span>
                <span className="bg-gradient-to-r from-[#D8E6AF] via-[#9CB35F] to-[#788A4E] bg-clip-text text-transparent ml-1.5 font-bold">HVAC</span>
              </div>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden flex-shrink-0 ml-auto"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, secIdx) => (
            <div key={sec.group || secIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1.5 flex items-center justify-between transition-opacity duration-200 delay-100">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#9CB35F]/85 uppercase whitespace-nowrap">
                    {sec.group}
                  </span>
                  {sec.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#9CB35F]/15 text-[#D8E6AF] border border-[#9CB35F]/35 uppercase font-bold">
                      {sec.badge}
                    </span>
                  )}
                </div>
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${isActive
                      ? 'sidebar-active-item'
                      : 'sidebar-inactive-item'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-[#9CB35F]/75 group-hover:text-white'
                        }`}
                    />

                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 font-sans whitespace-nowrap transition-opacity duration-200 delay-100">
                        {item.label}
                      </span>
                    )}

                    {/* Active item dot */}
                    {isActive && !sidebarCollapsed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9CB35F] shadow-[0_0_10px_rgba(156,179,95,0.95)] flex-shrink-0 animate-pulse-subtle transition-opacity duration-200 delay-100" />
                    )}

                    {/* Numeric badges */}
                    {!sidebarCollapsed && item.countBadge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-opacity duration-200 delay-100 ${item.alertBadge
                          ? 'bg-[#B4443C] text-white'
                          : 'bg-white/15 text-white border border-white/25'
                          }`}
                      >
                        {item.countBadge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Pinned Bottom: Admin User Card */}
        <div className="p-3 border-t border-white/10 flex-shrink-0 bg-black/25 overflow-hidden">
          {sidebarCollapsed ? (
            <div className="flex items-center justify-center py-1">
              <NavLink to={`/users-roles?profile=${currentUser?.id || 'usr-1'}`} title={`${currentUser?.name} (${currentUser?.role}) - View Profile`}>
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full border border-white/30 object-cover hover:ring-2 hover:ring-[#A4A77E] transition-all"
                />
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2.5 transition-opacity duration-200 delay-100">
              <NavLink
                to={`/users-roles?profile=${currentUser?.id || 'usr-1'}`}
                className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition-opacity flex-1"
                title="View Admin Profile"
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full border border-white/30 object-cover flex-shrink-0 group-hover:border-[#A4A77E] transition-colors"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-[#CCD4BE] transition-colors whitespace-nowrap">
                    {currentUser?.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CB35F] shadow-[0_0_8px_rgba(156,179,95,0.7)]" />
                    <span className="text-[10px] font-mono text-[#D8E6AF]/80 truncate whitespace-nowrap">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
