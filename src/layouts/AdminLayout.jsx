import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { ToastContainer } from '../components/common/Toast';
import { useApp } from '../context/AppContext';

export const AdminLayout = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#ECEEF2] dark:bg-[#0E1013] text-[#121417] dark:text-[#E4E7EB] flex w-full max-w-full overflow-x-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area: FLUID FULL WIDTH with balanced edge padding (No huge dead margins!) */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full min-w-0 max-w-full transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[268px]'
        }`}
      >
        {/* Sticky TopBar */}
        <TopBar />

        {/* Page Content: Fluid full width, generous balanced padding */}
        <main className="flex-1 w-full min-w-0 max-w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
