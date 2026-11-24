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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LocalIndustriesLogo, NoTechWordmarkEst2022 } from '../../assets/logos';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, currentUser, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const location = useLocation();

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
        className={`fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out flex flex-col justify-between glass-panel-dark text-slate-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[268px]'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Top: Logo & Console Tag */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent flex-shrink-0 relative">
          {!sidebarCollapsed ? (
            <>
              {/* Collapse button on top right */}
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden lg:flex absolute right-3 top-3.5 p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Centered Logo in Middle */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center p-1 rounded-xl bg-white/10 border border-white/10 shadow-inner">
                  <LocalIndustriesLogo className="h-9" />
                </div>

                {/* Console Sub-Pill Centered Under Logo */}
                <div className="mt-2.5 flex items-center justify-center w-full">
                  <span className="font-mono text-[9.5px] font-bold tracking-widest text-emerald-100 uppercase px-2.5 py-1 rounded-md bg-black/25 border border-white/15 shadow-xs text-center">
                    ADMIN CONSOLE · NO-TECH HVAC
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              <LocalIndustriesLogo className="h-8" />
            </div>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, secIdx) => (
            <div key={sec.group || secIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-200/60 uppercase">
                    {sec.group}
                  </span>
                  {sec.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-emerald-200 border border-white/20 uppercase font-bold">
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
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-emerald-200/70 group-hover:text-white'
                        }`}
                    />

                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 font-sans">
                        {item.label}
                      </span>
                    )}

                    {/* Active item dot */}
                    {isActive && !sidebarCollapsed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 shadow-glow-tan flex-shrink-0" />
                    )}

                    {/* Numeric badges */}
                    {!sidebarCollapsed && item.countBadge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${item.alertBadge
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
        <div className="p-3 border-t border-white/10 flex-shrink-0 bg-black/25">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full border border-white/30 object-cover"
              />
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1 rounded-md text-emerald-200/70 hover:text-white hover:bg-white/10"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full border border-white/30 object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-200/70 truncate">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
              </div>

              <NavLink
                to="/users-roles"
                className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                title="Switch User Role"
              >
                <Settings className="w-4 h-4" />
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
