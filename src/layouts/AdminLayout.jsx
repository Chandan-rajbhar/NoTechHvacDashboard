import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { ToastContainer } from '../components/common/Toast';
import { NoTechWordmarkEst2022 } from '../assets/logos';
import { useApp } from '../context/AppContext';

export const AdminLayout = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#ECEEF2] dark:bg-[#0E1013] text-[#121417] dark:text-[#E4E7EB] flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area: FLUID FULL WIDTH with balanced edge padding (No huge dead margins!) */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[268px]'
        }`}
      >
        {/* Sticky TopBar */}
        <TopBar />

        {/* Page Content: Fluid full width, generous balanced padding */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200/80 dark:border-[#2B3037] bg-white/60 dark:bg-[#16191D]/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5 transition-colors">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6D6E71] dark:text-[#8D8E92]">
            <div className="flex items-center gap-3">
              <NoTechWordmarkEst2022 />
              <div className="text-[11px] leading-tight">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Local Industries Modular HVAC Division
                </p>
                <p className="text-[10px] text-slate-500">
                  Certified Quality & Enforcement Authority by Local Mechanical
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>ADMIN CONSOLE v1.4</span>
              <span>•</span>
              <span>ZERO-REFRIGERANT-LOSS ARCHITECTURE</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
