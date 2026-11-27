import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockService } from '../data/mockService';
import { USERS_AND_ROLES } from '../data/mockData';
import {
  supabase,
  isSupabaseConfigured,
  signInWithEmail,
  signOutFromSupabase,
  fetchUserProfile,
} from '../lib/supabase';

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

  // Authentication State (Supabase when configured, local demo fallback otherwise)
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (isSupabaseConfigured) return false;
    try {
      const stored = localStorage.getItem('notech_auth');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  // Sync Supabase Auth session & profile when configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let mounted = true;

    const applySession = async (session) => {
      if (!mounted) return;
      if (!session?.user) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      const profile = await fetchUserProfile(session.user.id);
      if (!mounted) return;

      const fallback = USERS_AND_ROLES[0];
      setCurrentUser({
        ...fallback,
        id: session.user.id,
        email: session.user.email || fallback.email,
        name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email,
        role: profile?.role || fallback.role,
        hub: profile?.hub || fallback.hub,
        phone: profile?.phone || fallback.phone,
        avatar: profile?.avatar_url || fallback.avatar,
        securityTier: profile?.security_tier || fallback.securityTier,
        authorityStatus: profile?.authority_status || fallback.authorityStatus,
        permissions: profile?.permissions?.length ? profile.permissions : fallback.permissions,
      });
      setIsAuthenticated(true);
      setAuthLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials = {}) => {
    if (isSupabaseConfigured) {
      const data = await signInWithEmail(credentials.email, credentials.password);
      return data;
    }
    setIsAuthenticated(true);
    localStorage.setItem('notech_auth', 'true');
    setCurrentUser(USERS_AND_ROLES[0]);
    return { user: USERS_AND_ROLES[0] };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await signOutFromSupabase();
    }
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
        authLoading,
        supabaseConfigured: isSupabaseConfigured,
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
