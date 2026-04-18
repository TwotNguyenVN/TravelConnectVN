import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[]; // e.g. ['ADMIN'], ['GUIDE']
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, roles, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="tc-spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--tc-gray-200)', borderTop: '4px solid var(--tc-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--tc-text-secondary)' }}>Đang kiểm tra phân quyền...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Nếu chưa đăng nhập thì đẩy về Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra xem user có ít nhất 1 role khớp với allowedRoles không
  const hasPermission = roles.some(role => allowedRoles.includes(role));

  if (!hasPermission) {
    // Nếu không có quyền, hiện trang 403
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--tc-danger, #d4111e)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
        <h2 style={{ marginBottom: '1rem', color: 'var(--tc-text-primary)' }}>Truy cập bị từ chối</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--tc-text-secondary)' }}>
          Bạn không có quyền truy cập vào khu vực này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là một sự nhầm lẫn.
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="tc-btn tc-btn--primary tc-btn--medium"
          style={{ cursor: 'pointer' }}
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
