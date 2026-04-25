import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout logic for now
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'block',
    padding: 'var(--tc-spacing-3) var(--tc-spacing-4)',
    color: isActive ? 'var(--tc-primary)' : 'var(--tc-text-secondary)',
    backgroundColor: isActive ? 'var(--tc-primary-light)' : 'transparent',
    borderRadius: 'var(--tc-radius-md)',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    marginBottom: 'var(--tc-spacing-1)',
    transition: 'all 0.2s ease',
  });

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--tc-bg-default)',
      borderRight: '1px solid var(--tc-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      <div style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)' }}>
        <h2 style={{ margin: 0, color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-xl)' }}>
          TravelConnect
        </h2>
        <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>Admin Control Panel</span>
      </div>

      <nav style={{ flex: 1, padding: 'var(--tc-spacing-4)', overflowY: 'auto' }}>
        <NavLink to="/admin" end style={navLinkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/users" style={navLinkStyle}>Quản lý người dùng</NavLink>
        <NavLink to="/admin/tours" style={navLinkStyle}>Quản trị Tour</NavLink>
        <NavLink to="/admin/guides" style={navLinkStyle}>Xác minh HDV</NavLink>
        <NavLink to="/admin/companion-posts" style={navLinkStyle}>Bài đồng hành</NavLink>
        <NavLink to="/admin/reviews" style={navLinkStyle}>Đánh giá & Bình luận</NavLink>
        <NavLink to="/admin/reports" style={navLinkStyle}>Xử lý báo cáo</NavLink>
        <NavLink to="/admin/activity-logs" style={navLinkStyle}>Nhật ký hoạt động</NavLink>
        <NavLink to="/admin/statistics" style={navLinkStyle}>Thống kê</NavLink>
      </nav>

      <div style={{ padding: 'var(--tc-spacing-4)', borderTop: '1px solid var(--tc-border)' }}>
        <NavLink to="/" style={{
          display: 'block',
          padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
          color: 'var(--tc-text-secondary)',
          textDecoration: 'none',
          marginBottom: 'var(--tc-spacing-2)',
          borderRadius: 'var(--tc-radius-md)',
        }}>
          Trở về trang chủ
        </NavLink>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
            backgroundColor: 'transparent',
            color: 'var(--tc-danger)',
            border: '1px solid var(--tc-danger-bg)',
            borderRadius: 'var(--tc-radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: 500,
          }}>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
