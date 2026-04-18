import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button/Button';

export const PublicHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--tc-bg-default)',
      borderBottom: '1px solid var(--tc-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--tc-shadow-sm)'
    }}>
      {/* Utility Bar */}
      <div style={{
        backgroundColor: 'var(--tc-bg-subtle)',
        padding: 'var(--tc-spacing-1) var(--tc-spacing-5)',
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 'var(--tc-font-size-xs)',
        color: 'var(--tc-text-secondary)',
        borderBottom: '1px solid var(--tc-border)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)' }}>
          <span>📞 Hotline: 1900 1234</span>
          <span>Hỗ trợ khách hàng</span>
        </div>
      </div>

      {/* Main Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--tc-spacing-3) var(--tc-spacing-5)',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-xl)', fontWeight: 700 }}>
          TravelConnect
        </Link>

        <nav style={{ display: 'flex', gap: 'var(--tc-spacing-5)', fontWeight: 500 }}>
          <Link to="/tours" style={{ color: 'var(--tc-text-primary)' }}>Khám phá Tour</Link>
          <Link to="/guides" style={{ color: 'var(--tc-text-primary)' }}>Hướng dẫn viên</Link>
          <Link to="/companions" style={{ color: 'var(--tc-text-primary)' }}>Bạn đồng hành</Link>
        </nav>

        <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }}>
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button variant="outline" size="small" onClick={handleLogout}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="small">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
