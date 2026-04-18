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
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { VerifyOtpPage } from '../pages/public/VerifyOtpPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { AuthGuard } from './AuthGuard';
import { RoleGuard } from './RoleGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'verify-otp', element: <VerifyOtpPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'tours', element: <TourListPage /> },
      { path: 'tours/:id', element: <TourDetailPage /> },
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
      { path: 'requests', element: <div><h2>My Tour Requests</h2></div> },
    ],
  },
  {
    path: '/guide',
    element: (
      <RoleGuard allowedRoles={['GUIDE', 'ADMIN']}>
        <GuideLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <div><h2>Guide Dashboard</h2></div> },
      { path: 'tours', element: <div><h2>My Guided Tours</h2></div> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['ADMIN']}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <div><h2>Admin Dashboard Overview</h2></div> },
      { path: 'users', element: <div><h2>User Management</h2></div> },
      { path: 'reports', element: <div><h2>Report Processing</h2></div> },
    ],
  },
]);
