import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
const UserLayout = lazy(() => import('../layouts/UserLayout').then(m => ({ default: m.UserLayout })));
const GuideLayout = lazy(() => import('../layouts/GuideLayout').then(m => ({ default: m.GuideLayout })));
const AdminLayout = lazy(() => import('../layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const ContentLayout = lazy(() => import('../layouts/ContentLayout').then(m => ({ default: m.ContentLayout })));
const SupportLayout = lazy(() => import('../layouts/SupportLayout').then(m => ({ default: m.SupportLayout })));
const FinanceLayout = lazy(() => import('../layouts/FinanceLayout').then(m => ({ default: m.FinanceLayout })));
const FinanceDashboardPage = lazy(() => import('../pages/finance/FinanceDashboardPage').then(m => ({ default: m.FinanceDashboardPage })));
const FinanceRefundsPage = lazy(() => import('../pages/finance/FinanceRefundsPage').then(m => ({ default: m.FinanceRefundsPage })));
const FinanceTransactionsPage = lazy(() => import('../pages/finance/FinanceTransactionsPage').then(m => ({ default: m.FinanceTransactionsPage })));
const FinanceSettlementsPage = lazy(() => import('../pages/finance/FinanceSettlementsPage').then(m => ({ default: m.FinanceSettlementsPage })));
const FinanceForecastingPage = lazy(() => import('../pages/finance/FinanceForecastingPage').then(m => ({ default: m.FinanceForecastingPage })));
const FinanceReconciliationPage = lazy(() => import('../pages/finance/FinanceReconciliationPage').then(m => ({ default: m.FinanceReconciliationPage })));

import { HomePage } from '../pages/public/HomePage';
import { TourListPage } from '../pages/public/TourListPage';
import { TourDetailPage } from '../pages/public/TourDetailPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
const OnboardingPage = lazy(() => import('../pages/public/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
import { RoleSelectionPage } from '../pages/public/RoleSelectionPage';
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const VerifyOtpPage = lazy(() => import('../pages/public/VerifyOtpPage').then(m => ({ default: m.VerifyOtpPage })));
const ResetPasswordPage = lazy(() => import('../pages/public/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const ProfilePage = lazy(() => import('../pages/user/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotificationsPage = lazy(() => import('../pages/user/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ActivityLogsPage = lazy(() => import('../pages/user/ActivityLogsPage').then(m => ({ default: m.ActivityLogsPage })));
const TourMapPage = lazy(() => import('../pages/public/TourMapPage').then(m => ({ default: m.TourMapPage })));
const CalendarDemoPage = lazy(() => import('../pages/public/CalendarDemoPage').then(m => ({ default: m.CalendarDemoPage })));
const PublicProfilePage = lazy(() => import('../pages/public/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })));

const FavoritesPage = lazy(() => import('../pages/user/FavoritesPage'));


const GuideDashboardPage = lazy(() => import('../pages/guide/GuideDashboardPage'));
const GuideSchedulesPage = lazy(() => import('../pages/guide/GuideSchedulesPage'));
const GuideProfilePage = lazy(() => import('../pages/guide/GuideProfilePage'));
const GuideListPage = lazy(() => import('../pages/public/GuideListPage'));
const GuideDetailPage = lazy(() => import('../pages/public/GuideDetailPage'));
const MyToursPage = lazy(() => import('../pages/guide/MyToursPage'));
const TourFormPage = lazy(() => import('../pages/guide/TourFormPage'));
const TourManagementPage = lazy(() => import('../pages/guide/TourManagementPage'));
const TourItineraryPage = lazy(() => import('../pages/guide/TourItineraryPage'));
const TourImagesPage = lazy(() => import('../pages/guide/TourImagesPage'));
const TourScheduleDetailPage = lazy(() => import('../pages/guide/TourScheduleDetailPage'));
const GuideRequestsPage = lazy(() => import('../pages/guide/GuideRequestsPage').then(m => ({ default: m.GuideRequestsPage })));
const ActiveTourPage = lazy(() => import('../pages/guide/ActiveTourPage').then(m => ({ default: m.ActiveTourPage })));
const GuideIncomePage = lazy(() => import('../pages/guide/GuideIncomePage'));
const CompanionListPage = lazy(() => import('../pages/public/CompanionListPage'));
const CompanionDetailPage = lazy(() => import('../pages/public/CompanionDetailPage'));
const MyCompanionPostsPage = lazy(() => import('../pages/user/MyCompanionPostsPage'));
const CompanionFormPage = lazy(() => import('../pages/user/CompanionFormPage'));
const CompanionManagementPage = lazy(() => import('../pages/user/CompanionManagementPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminStatisticsPage = lazy(() => import('../pages/admin/AdminStatisticsPage').then(m => ({ default: m.AdminStatisticsPage })));
const AdminUserManagementPage = lazy(() => import('../pages/admin/AdminUserManagementPage').then(m => ({ default: m.AdminUserManagementPage })));
const AdminReportManagementPage = lazy(() => import('../pages/admin/AdminReportManagementPage').then(m => ({ default: m.AdminReportManagementPage })));
const AdminVerificationPage = lazy(() => import('../pages/admin/AdminVerificationPage').then(m => ({ default: m.AdminVerificationPage })));
const AdminTourManagementPage = lazy(() => import('../pages/admin/AdminTourManagementPage').then(m => ({ default: m.AdminTourManagementPage })));
const AdminCompanionManagementPage = lazy(() => import('../pages/admin/AdminCompanionManagementPage').then(m => ({ default: m.AdminCompanionManagementPage })));
const AdminActivityLogPage = lazy(() => import('../pages/admin/AdminActivityLogPage').then(m => ({ default: m.AdminActivityLogPage })));
const AdminReviewManagementPage = lazy(() => import('../pages/admin/AdminReviewManagementPage').then(m => ({ default: m.AdminReviewManagementPage })));
const AdminRecoveryConsolePage = lazy(() => import('../pages/admin/AdminRecoveryConsolePage').then(m => ({ default: m.AdminRecoveryConsolePage })));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));
const GuideVerificationPage = lazy(() => import('../pages/guide/GuideVerificationPage').then(m => ({ default: m.GuideVerificationPage })));
const ContentDashboardPage = lazy(() => import('../pages/content/ContentDashboardPage').then(m => ({ default: m.ContentDashboardPage })));
const SupportDashboardPage = lazy(() => import('../pages/support/SupportDashboardPage').then(m => ({ default: m.SupportDashboardPage })));
const SupportDisputePage = lazy(() => import('../pages/support/SupportDisputePage').then(m => ({ default: m.SupportDisputePage })));
const SupportBroadcastPage = lazy(() => import('../pages/support/SupportBroadcastPage').then(m => ({ default: m.SupportBroadcastPage })));
const SupportTicketsPage = lazy(() => import('../pages/support/SupportTicketsPage').then(m => ({ default: m.SupportTicketsPage })));

// Phase 5-9 new imports
const AdminMaintenancePage = lazy(() => import('../pages/admin/AdminMaintenancePage').then(m => ({ default: m.AdminMaintenancePage })));
const AdminAnomalyPage = lazy(() => import('../pages/admin/AdminAnomalyPage').then(m => ({ default: m.AdminAnomalyPage })));
const ContentReportHeatmapPage = lazy(() => import('../pages/admin/ContentReportHeatmapPage').then(m => ({ default: m.ContentReportHeatmapPage })));
const SupportFaqPage = lazy(() => import('../pages/admin/SupportFaqPage').then(m => ({ default: m.SupportFaqPage })));
const SupportAnalyticsPage = lazy(() => import('../pages/admin/SupportAnalyticsPage').then(m => ({ default: m.SupportAnalyticsPage })));

const ChatPage = lazy(() => import('../pages/chat/ChatPage'));
const AiChatPage = lazy(() => import('../pages/user/AiChatPage'));
const VnpayReturnPage = lazy(() => import('../pages/user/VnpayReturnPage').then(m => ({ default: m.VnpayReturnPage })));
const WalletVnpayReturnPage = lazy(() => import('../pages/user/WalletVnpayReturnPage').then(m => ({ default: m.WalletVnpayReturnPage })));
const TourBookingPage = lazy(() => import('../pages/public/TourBookingPage'));
const BookingManagementPage = lazy(() => import('../pages/user/BookingManagementPage').then(m => ({ default: m.BookingManagementPage })));
const WalletPage = lazy(() => import('../pages/user/WalletPage'));
import { AuthGuard } from './AuthGuard';
import { RoleGuard } from './RoleGuard';
import { MaintenancePage } from '../pages/public/MaintenancePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: 'profile/:id', element: <PublicProfilePage /> },
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'onboarding', element: <AuthGuard><OnboardingPage /></AuthGuard> },
      { path: 'select-role', element: <RoleSelectionPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'verify-otp', element: <VerifyOtpPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'tours', element: <TourListPage /> },
      { path: 'tours/:id', element: <TourDetailPage /> },
      { path: 'tours/:id/booking', element: <AuthGuard><TourBookingPage /></AuthGuard> },
      { path: 'tours/:id/map', element: <TourMapPage /> },
      { path: 'guides', element: <GuideListPage /> },

      { path: 'guides/:id', element: <GuideDetailPage /> },
      { path: 'companions', element: <CompanionListPage /> },
      { path: 'companions/:id', element: <CompanionDetailPage /> },
      { path: 'demo/calendar', element: <CalendarDemoPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
    ],
  },
  {
    path: '/user',
    element: (
      <AuthGuard>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><UserLayout /></Suspense>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'requests', element: <BookingManagementPage /> },
      { path: 'companion-posts', element: <MyCompanionPostsPage /> },
      { path: 'companion-posts/create', element: <CompanionFormPage /> },
      { path: 'companion-posts/:id/edit', element: <CompanionManagementPage /> },
      { path: 'companion-posts/:id/requests', element: <CompanionManagementPage /> },
      { path: 'companion-requests', element: <BookingManagementPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'activity-logs', element: <ActivityLogsPage /> },
      { path: 'messages', element: <ChatPage /> },
      { path: 'ai-assistant', element: <AiChatPage /> },
      { path: 'payments', element: <BookingManagementPage /> },
      {path: 'bookings', element: <BookingManagementPage /> },
      { path: 'payments/vnpay-return', element: <VnpayReturnPage /> },
      { path: 'guide-verification', element: <GuideVerificationPage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'wallet/vnpay-return', element: <WalletVnpayReturnPage /> },
    ],


  },
  {
    path: '/guide',
    element: (
      <RoleGuard allowedRoles={['GUIDE', 'SYSTEM_ADMIN']}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><GuideLayout /></Suspense>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <GuideDashboardPage /> },
      { path: 'dashboard', element: <GuideDashboardPage /> },
      { path: 'schedules', element: <GuideSchedulesPage /> },
      { path: 'active-tour', element: <ActiveTourPage /> },
      { path: 'income', element: <GuideIncomePage /> },
      { path: 'profile', element: <GuideProfilePage /> },
      { path: 'tours', element: <MyToursPage /> },
      { path: 'tours/create', element: <TourFormPage /> },
      { path: 'tours/edit/:id', element: <TourManagementPage /> },
      { path: 'tours/:id/schedules/:scheduleId', element: <TourScheduleDetailPage /> },
      { path: 'tours/:id/itinerary', element: <TourItineraryPage /> },
      { path: 'tours/:id/images', element: <TourImagesPage /> },
      { path: 'tour-requests', element: <GuideRequestsPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['SYSTEM_ADMIN']}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><AdminLayout /></Suspense>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUserManagementPage /> },
      { path: 'activity-logs', element: <AdminActivityLogPage /> },
      { path: 'statistics', element: <AdminStatisticsPage /> },
      { path: 'recovery', element: <AdminRecoveryConsolePage /> },
      { path: 'maintenance', element: <AdminMaintenancePage /> },
      { path: 'anomaly', element: <AdminAnomalyPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
  {
    path: '/content',
    element: (
      <RoleGuard allowedRoles={['CONTENT_MODERATOR', 'SYSTEM_ADMIN']}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><ContentLayout /></Suspense>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <ContentDashboardPage /> },
      { path: 'dashboard', element: <ContentDashboardPage /> },
      { path: 'tours', element: <AdminTourManagementPage /> },
      { path: 'guides', element: <AdminVerificationPage /> },
      { path: 'companion-posts', element: <AdminCompanionManagementPage /> },
      { path: 'reviews', element: <AdminReviewManagementPage /> },
      { path: 'heatmap', element: <ContentReportHeatmapPage /> },
    ],
  },
  {
    path: '/support',
    element: (
      <RoleGuard allowedRoles={['SUPPORT_STAFF', 'SYSTEM_ADMIN']}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><SupportLayout /></Suspense>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <SupportDashboardPage /> },
      { path: 'reports', element: <AdminReportManagementPage /> },
      { path: 'tickets', element: <SupportTicketsPage /> },
      { path: 'disputes', element: <SupportDisputePage /> },
      { path: 'broadcast', element: <SupportBroadcastPage /> },
      { path: 'faq', element: <SupportFaqPage /> },
      { path: 'analytics', element: <SupportAnalyticsPage /> },
    ],
  },
  {
    path: '/accountant',
    element: (
      <RoleGuard allowedRoles={['ACCOUNTANT', 'SYSTEM_ADMIN']}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}><FinanceLayout /></Suspense>
      </RoleGuard>
    ),
    children: [
      { index: true, element: <FinanceDashboardPage /> },
      { path: 'refunds', element: <FinanceRefundsPage /> },
      { path: 'transactions', element: <FinanceTransactionsPage /> },
      { path: 'settlements', element: <FinanceSettlementsPage /> },
      { path: 'forecast', element: <FinanceForecastingPage /> },
      { path: 'reconciliation', element: <FinanceReconciliationPage /> },
    ],
  },
]);
