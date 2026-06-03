import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

export const FinanceSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ margin: 0, color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-xl)', cursor: 'pointer' }}>
            TravelConnect
          </h2>
        </Link>
        <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>Finance & Accounting</span>
      </div>

      <nav style={{ flex: 1, padding: 'var(--tc-spacing-4)', overflowY: 'auto' }}>
        <NavLink to="/accountant" end style={navLinkStyle}>Tổng quan</NavLink>
        <NavLink to="/accountant/refunds" style={navLinkStyle}>Yêu cầu hoàn tiền</NavLink>
        <NavLink to="/accountant/transactions" style={navLinkStyle}>Lịch sử giao dịch</NavLink>
        <NavLink to="/accountant/settlements" style={navLinkStyle}>Quyết toán HDV</NavLink>
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
