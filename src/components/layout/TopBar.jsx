import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Shield,
  User,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USERS_AND_ROLES } from '../../data/mockData';

export const TopBar = () => {
  const {
    isDark,
    toggleDarkMode,
    currentUser,
    setCurrentUser,
    sidebarCollapsed,
    setMobileMenuOpen,
    globalSearch,
    setGlobalSearch,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    addToast,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#1A1D21]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-[#383E47] px-4 lg:px-8 transition-colors">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Actions: Theme Toggle, Bell, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2B3037] transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#A4A77E]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2B3037] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B4443C] ring-2 ring-white dark:ring-[#1A1D21]" />
              )}
            </button>

            {/* Notification Menu */}
            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#22262C] border border-slate-200 dark:border-[#383E47] shadow-xl py-2 z-50 animate-slide-up text-left">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2B3037] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#A4A77E]/20 text-[#555D50] dark:text-[#BFC399] font-bold">
                      {unreadCount} New
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#73784F] dark:text-[#A4A77E] hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2B3037]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifMenuOpen(false);
                        navigate(n.link);
                      }}
                      className={`p-3.5 hover:bg-[#F8FAF6] dark:hover:bg-[#2B3037] cursor-pointer transition-colors ${n.unread ? 'bg-[#F0F3EC]/40 dark:bg-[#1E251E]/40' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {n.title}
                        </h4>
                        <span className="text-[10px] font-mono text-[#6D6E71] dark:text-[#8D8E92] flex-shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 dark:border-[#2B3037] text-center">
                  <Link
                    to="/inquiries-chatbot"
                    onClick={() => setNotifMenuOpen(false)}
                    className="text-xs font-medium text-[#73784F] dark:text-[#A4A77E] hover:underline"
                  >
                    View All Inquiries & Escalations →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2B3037] transition-colors"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full border border-[#CCD4BE] dark:border-[#4B5640] object-cover"
              />
              <span className="hidden xl:inline text-xs font-bold text-slate-800 dark:text-slate-100">
                {currentUser?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#22262C] border border-slate-200 dark:border-[#383E47] shadow-xl py-2 z-50 animate-slide-up text-left">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#2B3037]">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentUser?.name}
                  </p>
                  <p className="text-[11px] text-[#6D6E71] dark:text-[#8D8E92] truncate">
                    {currentUser?.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E]" />
                    <span className="text-[10px] font-mono uppercase font-bold text-[#555D50] dark:text-[#BFC399]">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>

                {/* Quick Role Switcher */}
                <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2B3037]">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Quick Role Switch
                  </p>
                  <div className="space-y-1">
                    {USERS_AND_ROLES.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          addToast(`Switched active console role to: ${u.role}`, 'info');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${currentUser?.id === u.id
                          ? 'bg-[#EBF1E8] text-[#3F4F3B] font-bold dark:bg-[#1E251E] dark:text-[#BFC399]'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2B3037]'
                          }`}
                      >
                        <span className="truncate">{u.role}</span>
                        {currentUser?.id === u.id && <CheckCircle className="w-3 h-3 text-[#73784F]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2B3037] flex items-center gap-2.5"
                  >
                    Console Settings
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      addToast('Logged out of admin session (Simulation)', 'info');
                    }}
                    className="w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
