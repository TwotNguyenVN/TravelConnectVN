import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

export const SupportSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: 'var(--tc-spacing-3) var(--tc-spacing-4)',
    color: isActive ? 'var(--tc-primary)' : 'var(--tc-text-secondary)',
    backgroundColor: isActive ? 'var(--tc-primary-light)' : 'transparent',
    borderRadius: 'var(--tc-radius-md)',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '14px',
    marginBottom: 'var(--tc-spacing-1)',
    transition: 'all 0.2s ease',
  });

  const navItems = [
    { to: '/support', end: true, icon: '🏠', label: 'Dashboard' },
    { to: '/support/tickets', end: false, icon: '🛟', label: 'Yêu cầu Hỗ trợ' },
    { to: '/support/reports', end: false, icon: '🚩', label: 'Báo cáo Vi phạm' },
    { to: '/support/disputes', end: false, icon: '⚖️', label: 'Tranh chấp Đặt Tour' },
    { to: '/support/broadcast', end: false, icon: '📢', label: 'Gửi Thông báo' },
  ];

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
      {/* Logo */}
      <div style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ margin: 0, color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-xl)', cursor: 'pointer' }}>
            TravelConnect
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '14px' }}>🛟</span>
          <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', fontWeight: 600 }}>
            Support Staff Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--tc-spacing-4)', overflowY: 'auto' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--tc-spacing-2)', paddingLeft: 'var(--tc-spacing-2)' }}>
          Hỗ trợ & Xử lý
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={navLinkStyle}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: 'var(--tc-spacing-4)', borderTop: '1px solid var(--tc-border)' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
            color: 'var(--tc-text-secondary)',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: 'var(--tc-spacing-2)',
            borderRadius: 'var(--tc-radius-md)',
          }}
        >
          🏡 Trở về trang chủ
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
            fontSize: '14px',
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
};
