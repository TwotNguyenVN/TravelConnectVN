import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button/Button';
import notificationService from '../../services/notificationService';


import { useSocket } from '../../contexts/SocketContext';


export const PublicHeader: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);


  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const res = await notificationService.getUnreadCount();
          if (res.success) {
            setUnreadCount(res.data?.count || 0);
          }
        } catch (err) {
          console.error('Error fetching unread count:', err);
        }
      };
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = () => {
        setUnreadCount(prev => prev + 1);
      };

      socket.on('new_notification', handleNewNotification);

      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [socket]);


  const handleLogout = async () => {

    await signOut();
    navigate('/login');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Người dùng';
  const displayAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initial = displayName[0]?.toUpperCase() || 'N';

  return (
    <header style={{
      backgroundColor: 'var(--tc-bg-default)',
      borderBottom: '1px solid var(--tc-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--tc-shadow-sm)'
    }}>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-3)' }}>
              <Link to="/user" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-2)', color: 'inherit' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--tc-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--tc-primary)',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  border: '1px solid var(--tc-border)'
                }}>
                  {displayAvatar ? (
                    <img 
                      src={displayAvatar} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : initial}
                </div>
                <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }}>
                  {displayName}
                </span>
              </Link>

              {/* Chat Icon */}
              <Link to="/user/messages" style={{ position: 'relative', color: 'var(--tc-text-secondary)', display: 'flex', alignItems: 'center', padding: 'var(--tc-spacing-2)' }}>
                <span style={{ fontSize: '20px' }}>💬</span>
              </Link>

              {/* Notification Bell */}
              <Link to="/user/notifications" style={{ position: 'relative', color: 'var(--tc-text-secondary)', display: 'flex', alignItems: 'center', padding: 'var(--tc-spacing-2)' }}>
                <span style={{ fontSize: '20px' }}>🔔</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--tc-danger)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                    border: '2px solid white'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <Button variant="outline" size="small" onClick={handleLogout}>Đăng xuất</Button>
            </div>

          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="small">Đăng nhập</Button>
              </Link>
              <Link to="/select-role">
                <Button variant="primary" size="small">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
