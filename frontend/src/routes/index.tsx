import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { UserLayout } from '../layouts/UserLayout';
import { GuideLayout } from '../layouts/GuideLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { HomePage } from '../pages/public/HomePage';
import { TourListPage } from '../pages/public/TourListPage';
import { TourDetailPage } from '../pages/public/TourDetailPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { OnboardingPage } from '../pages/public/onboarding/OnboardingPage';
import { RoleSelectionPage } from '../pages/public/RoleSelectionPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { VerifyOtpPage } from '../pages/public/VerifyOtpPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { NotificationsPage } from '../pages/user/NotificationsPage';
import { ActivityLogsPage } from '../pages/user/ActivityLogsPage';
import { TourMapPage } from '../pages/public/TourMapPage';
import { CalendarDemoPage } from '../pages/public/CalendarDemoPage';
import { PublicProfilePage } from '../pages/public/PublicProfilePage';

import FavoritesPage from '../pages/user/FavoritesPage';


import GuideDashboardPage from '../pages/guide/GuideDashboardPage';
import GuideProfilePage from '../pages/guide/GuideProfilePage';
import GuideListPage from '../pages/public/GuideListPage';
import GuideDetailPage from '../pages/public/GuideDetailPage';
import MyToursPage from '../pages/guide/MyToursPage';
import TourFormPage from '../pages/guide/TourFormPage';
import TourManagementPage from '../pages/guide/TourManagementPage';
import TourItineraryPage from '../pages/guide/TourItineraryPage';
import TourImagesPage from '../pages/guide/TourImagesPage';
import TourScheduleDetailPage from '../pages/guide/TourScheduleDetailPage';
import { GuideRequestsPage } from '../pages/guide/GuideRequestsPage';
import CompanionListPage from '../pages/public/CompanionListPage';
import CompanionDetailPage from '../pages/public/CompanionDetailPage';
import MyCompanionPostsPage from '../pages/user/MyCompanionPostsPage';
import CompanionFormPage from '../pages/user/CompanionFormPage';
import CompanionRequestManagementPage from '../pages/user/CompanionRequestManagementPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { AdminReportManagementPage } from '../pages/admin/AdminReportManagementPage';
import { AdminVerificationPage } from '../pages/admin/AdminVerificationPage';
import { AdminTourManagementPage } from '../pages/admin/AdminTourManagementPage';
import { AdminCompanionManagementPage } from '../pages/admin/AdminCompanionManagementPage';
import { AdminActivityLogPage } from '../pages/admin/AdminActivityLogPage';
import { AdminReviewManagementPage } from '../pages/admin/AdminReviewManagementPage';
import { GuideVerificationPage } from '../pages/guide/GuideVerificationPage';
import ChatPage from '../pages/chat/ChatPage';
import AiChatPage from '../pages/user/AiChatPage';
import { VnpayReturnPage } from '../pages/user/VnpayReturnPage';
import TourBookingPage from '../pages/public/TourBookingPage';
import { BookingManagementPage } from '../pages/user/BookingManagementPage';
import { AuthGuard } from './AuthGuard';
import { RoleGuard } from './RoleGuard';

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
    ],
  },
  {
    path: '/user',
    element: (
      <AuthGuard>
        <UserLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'requests', element: <BookingManagementPage /> },
      { path: 'companion-posts', element: <MyCompanionPostsPage /> },
      { path: 'companion-posts/create', element: <CompanionFormPage /> },
      { path: 'companion-posts/:id/edit', element: <CompanionFormPage /> },
      { path: 'companion-posts/:id/requests', element: <CompanionRequestManagementPage /> },
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
    ],


  },
  {
    path: '/guide',
    element: (
      <RoleGuard allowedRoles={['GUIDE', 'SYSTEM_ADMIN']}>
        <GuideLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <GuideDashboardPage /> },
      { path: 'dashboard', element: <GuideDashboardPage /> },
      { path: 'profile', element: <GuideProfilePage /> },
      { path: 'verification', element: <GuideVerificationPage /> },
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
      <RoleGuard allowedRoles={['SYSTEM_ADMIN', 'CONTENT_MODERATOR', 'SUPPORT_STAFF']}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUserManagementPage /> },
      { path: 'reports', element: <AdminReportManagementPage /> },
      { path: 'guides', element: <AdminVerificationPage /> },
      { path: 'companion-posts', element: <AdminCompanionManagementPage /> },
      { path: 'reviews', element: <AdminReviewManagementPage /> },
      { path: 'tours', element: <AdminTourManagementPage /> },
      { path: 'activity-logs', element: <AdminActivityLogPage /> },
      { path: 'statistics', element: <AdminDashboardPage /> },

    ],
  },
]);
