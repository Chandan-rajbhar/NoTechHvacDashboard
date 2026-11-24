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
        { path: '/reservations', label: 'Reservations & Batches', icon: Layers, badge: '142' },
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
        className={`fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out flex flex-col justify-between glass-panel-dark text-slate-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[268px]'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Console Tag */}
        <div className="p-4 border-b border-[#2B3037] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2.5 overflow-hidden ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <LocalIndustriesLogo className="h-7" />
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Console Sub-Pill */}
          {!sidebarCollapsed && (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[9.5px] font-bold tracking-widest text-[#A4A77E] uppercase px-2 py-0.5 rounded-md bg-[#A4A77E]/10 border border-[#A4A77E]/25">
                ADMIN CONSOLE · NO-TECH HVAC
              </span>
            </div>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, secIdx) => (
            <div key={sec.group || secIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#6D6E71] uppercase">
                    {sec.group}
                  </span>
                  {sec.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#73784F]/20 text-[#BFC399] border border-[#73784F]/30 uppercase font-bold">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'sidebar-active-item'
                        : 'sidebar-inactive-item'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-[#BFC399]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 font-sans">
                        {item.label}
                      </span>
                    )}

                    {/* Active item army tan dot */}
                    {isActive && !sidebarCollapsed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2B59B] shadow-glow-tan flex-shrink-0" />
                    )}

                    {/* Numeric badges */}
                    {!sidebarCollapsed && item.countBadge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          item.alertBadge
                            ? 'bg-[#B4443C] text-white'
                            : 'bg-[#A4A77E]/20 text-[#BFC399] border border-[#A4A77E]/30'
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
        <div className="p-3 border-t border-[#2B3037] flex-shrink-0 bg-[#16191D]/80">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full border border-[#A4A77E]/40 object-cover"
              />
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
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
                  className="w-9 h-9 rounded-full border border-[#A4A77E]/40 object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E]" />
                    <span className="text-[10px] font-mono text-[#8D8E92] truncate">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
              </div>

              <NavLink
                to="/users-roles"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
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
