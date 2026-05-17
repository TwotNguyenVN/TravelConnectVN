import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button/Button';
import notificationService from '../../services/notificationService';
import chatService from '../../services/chatService';
import { ChatPopover } from './popovers/ChatPopover';
import { NotificationPopover } from './popovers/NotificationPopover';
import { useToast } from '../../contexts/ToastContext';


import { useSocket } from '../../contexts/SocketContext';
import { DEFAULT_AVATAR } from '../../constants/images';


export const PublicHeader: React.FC = () => {
  const { user, profile, roles, signOut } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [showChatPopover, setShowChatPopover] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

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
      const fetchUnreadChatCount = async () => {
        try {
          const res = await chatService.getUnreadMessageCount();
          if (res.success) {
            setUnreadChatCount(res.data?.count || 0);
          }
        } catch (err) {
          console.error('Error fetching unread chat count:', err);
        }
      };
      fetchUnreadCount();
      fetchUnreadChatCount();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (data: any) => {
        setUnreadCount(prev => prev + 1);
        toast.info(`🔔 ${data.title || 'Thông báo mới'}`);
      };

      const handleUnreadChatCountUpdate = (data: { count: number }) => {
        setUnreadChatCount(data.count);
      };

      const handleNewMessage = () => {
        // Increment immediately when a new message arrives for real-time fallback
        setUnreadChatCount(prev => prev + 1);
      };

      socket.on('new_notification', handleNewNotification);
      socket.on('unread_message_count_updated', handleUnreadChatCountUpdate);
      socket.on('new_message', handleNewMessage);

      return () => {
        socket.off('new_notification', handleNewNotification);
        socket.off('unread_message_count_updated', handleUnreadChatCountUpdate);
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, toast]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Người dùng';
  const displayAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || DEFAULT_AVATAR;
  const initial = displayName[0]?.toUpperCase() || 'N';

  const isAdmin = roles.includes('ADMIN');
  const isGuide = roles.includes('GUIDE');
  const profileLink = isAdmin ? '/admin' : (isGuide ? '/guide' : '/user');

  return (
    <header style={{
      backgroundColor: 'var(--tc-bg-default)',
      borderBottom: '1px solid var(--tc-border)',
      position: 'sticky',
      top: 0,
      zIndex: (showChatPopover || showNotifPopover) ? 10002 : 50,
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
              <Link to={profileLink} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-2)', color: 'inherit' }}>
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
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                    />
                  ) : initial}
                </div>
                <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }} title={displayName}>
                  {displayName.length > 30 ? `${displayName.slice(0, 30)}...` : displayName}
                </span>
              </Link>

              {/* Chat Popover Toggle */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowChatPopover(!showChatPopover);
                    setShowNotifPopover(false);
                  }}
                  style={{ 
                    position: 'relative', 
                    color: 'var(--tc-text-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '8px', 
                    borderRadius: '50%',
                    backgroundColor: showChatPopover ? 'var(--tc-bg-muted)' : 'var(--tc-bg-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {unreadChatCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: 'var(--tc-danger)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 5px',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center',
                      border: '2px solid var(--tc-bg-default)'
                    }}>
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                </button>
                {showChatPopover && <ChatPopover onClose={() => setShowChatPopover(false)} />}
              </div>

              {/* Notification Popover Toggle */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowNotifPopover(!showNotifPopover);
                    setShowChatPopover(false);
                  }}
                  style={{ 
                    position: 'relative', 
                    color: 'var(--tc-text-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '8px', 
                    borderRadius: '50%',
                    backgroundColor: showNotifPopover ? 'var(--tc-bg-muted)' : 'var(--tc-bg-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: 'var(--tc-danger)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 5px',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center',
                      border: '2px solid var(--tc-bg-default)'
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifPopover && (
                  <NotificationPopover 
                    onClose={() => setShowNotifPopover(false)} 
                    onNotificationRead={() => setUnreadCount(prev => Math.max(0, prev - 1))}
                  />
                )}
              </div>

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
