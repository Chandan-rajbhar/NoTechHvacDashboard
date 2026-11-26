import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockService } from '../data/mockService';
import { USERS_AND_ROLES } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('notech_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('notech_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('notech_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Active user (Harrison Gray default, or switchable to Claire Beauchamp LM Reviewer)
  const [currentUser, setCurrentUser] = useState(() => {
    return USERS_AND_ROLES[0];
  });

  // Authentication State (Super Admin)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem('notech_auth');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  const login = (credentials = {}) => {
    setIsAuthenticated(true);
    localStorage.setItem('notech_auth', 'true');
    setCurrentUser(USERS_AND_ROLES[0]);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('notech_auth', 'false');
  };

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');

  // Sidebar collapsed state (desktop / tablet)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notifications Queue / Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notification center items
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'New Contractor Submission', desc: 'Rachel Wu (Bayview Thermal) submitted EPA & COI documents.', time: '10m ago', unread: true, link: '/contractor-approvals' },
    { id: 'notif-2', title: 'Quality Control Flag', desc: 'Job #job-104 Delta T out of range (12.5°F). Requires contractor correction.', time: '35m ago', unread: true, link: '/installations-qc' },
    { id: 'notif-3', title: 'Batch Fulfillment Ready', desc: 'NT-BATCH-2026-089 has completed pre-calibration and is ready for dispatch.', time: '2h ago', unread: true, link: '/reservations' },
    { id: 'notif-4', title: 'Customer Reschedule Request', desc: 'Claire Bennett confirmed slot adjustment for Chico, CA.', time: '4h ago', unread: false, link: '/scheduling' },
  ]);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast,
        notifications,
        unreadCount,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
