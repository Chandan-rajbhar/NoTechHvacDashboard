import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AdminLayout } from './layouts/AdminLayout';

// Code-split Lazy Loaded Pages
const LoginPage = lazy(() =>
  import('./pages/Auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardOverview = lazy(() =>
  import('./pages/Dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview }))
);
const ReservationsPage = lazy(() =>
  import('./pages/Reservations/ReservationsPage').then((m) => ({ default: m.ReservationsPage }))
);
const UnitsPage = lazy(() =>
  import('./pages/Units/UnitsPage').then((m) => ({ default: m.UnitsPage }))
);
const PricingPage = lazy(() =>
  import('./pages/Pricing/PricingPage').then((m) => ({ default: m.PricingPage }))
);
const ContractorApprovalsPage = lazy(() =>
  import('./pages/Contractors/ContractorApprovalsPage').then((m) => ({ default: m.ContractorApprovalsPage }))
);
const ContractorsDirectoryPage = lazy(() =>
  import('./pages/Contractors/ContractorsDirectoryPage').then((m) => ({ default: m.ContractorsDirectoryPage }))
);
const TrainingQuestionnairePage = lazy(() =>
  import('./pages/Training/TrainingQuestionnairePage').then((m) => ({ default: m.TrainingQuestionnairePage }))
);
const InstallationsQcPage = lazy(() =>
  import('./pages/Installations/InstallationsQcPage').then((m) => ({ default: m.InstallationsQcPage }))
);
const CustomersPage = lazy(() =>
  import('./pages/Customers/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
const SchedulingPage = lazy(() =>
  import('./pages/Scheduling/SchedulingPage').then((m) => ({ default: m.SchedulingPage }))
);
const InquiriesChatbotPage = lazy(() =>
  import('./pages/Chatbot/InquiriesChatbotPage').then((m) => ({ default: m.InquiriesChatbotPage }))
);
const InvestorOverviewPage = lazy(() =>
  import('./pages/Investors/InvestorOverviewPage').then((m) => ({ default: m.InvestorOverviewPage }))
);
const InvestorsPage = lazy(() =>
  import('./pages/Investors/InvestorsPage').then((m) => ({ default: m.InvestorsPage }))
);
const AllocationRequestsPage = lazy(() =>
  import('./pages/Investors/AllocationRequestsPage').then((m) => ({ default: m.AllocationRequestsPage }))
);
const FundingRoundPage = lazy(() =>
  import('./pages/Investors/FundingRoundPage').then((m) => ({ default: m.FundingRoundPage }))
);
const DataRoomPage = lazy(() =>
  import('./pages/Investors/DataRoomPage').then((m) => ({ default: m.DataRoomPage }))
);
const UsersRolesPage = lazy(() =>
  import('./pages/Administration/UsersRolesPage').then((m) => ({ default: m.UsersRolesPage }))
);
const PaymentsPage = lazy(() =>
  import('./pages/Administration/PaymentsPage').then((m) => ({ default: m.PaymentsPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/System/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

// Loading Fallback with Skeleton Placeholder
const PageLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      ))}
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
  </div>
);

// Protected Route Layout: Redirects to /login if not authenticated
const ProtectedLayout = () => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout />;
};

// Public Login Route: Redirects to / if already authenticated
const PublicLoginRoute = () => {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<PublicLoginRoute />} />

          {/* Protected Console Routes */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardOverview />
                </Suspense>
              }
            />
            <Route
              path="reservations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ReservationsPage />
                </Suspense>
              }
            />
            <Route
              path="units"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UnitsPage />
                </Suspense>
              }
            />
            <Route
              path="pricing"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PricingPage />
                </Suspense>
              }
            />
            <Route
              path="contractor-approvals"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ContractorApprovalsPage />
                </Suspense>
              }
            />
            <Route
              path="contractors"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ContractorsDirectoryPage />
                </Suspense>
              }
            />
            <Route
              path="training-questionnaire"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TrainingQuestionnairePage />
                </Suspense>
              }
            />
            <Route
              path="installations-qc"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InstallationsQcPage />
                </Suspense>
              }
            />
            <Route
              path="customers"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CustomersPage />
                </Suspense>
              }
            />
            <Route
              path="scheduling"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SchedulingPage />
                </Suspense>
              }
            />
            <Route
              path="inquiries-chatbot"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InquiriesChatbotPage />
                </Suspense>
              }
            />
            {/* Investors Section Routes */}
            <Route
              path="investor-overview"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InvestorOverviewPage />
                </Suspense>
              }
            />
            <Route
              path="investors"
              element={
                <Suspense fallback={<PageLoader />}>
                  <InvestorsPage />
                </Suspense>
              }
            />
            <Route
              path="allocation-requests"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AllocationRequestsPage />
                </Suspense>
              }
            />
            <Route
              path="funding-round"
              element={
                <Suspense fallback={<PageLoader />}>
                  <FundingRoundPage />
                </Suspense>
              }
            />
            <Route
              path="data-room"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DataRoomPage />
                </Suspense>
              }
            />
            <Route
              path="users-roles"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UsersRolesPage />
                </Suspense>
              }
            />
            <Route
              path="payments"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PaymentsPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
