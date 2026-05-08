import React, { useEffect, useState, useRef } from 'react';
import notificationService from '../../../services/notificationService';
import type { Notification } from '../../../services/notificationService';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../../../constants/images';

interface NotificationPopoverProps {
  onClose: () => void;
  onNotificationRead: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getMyNotifications(1, 10); // Fetch top 10
        if (res.success && res.data) {
          setNotifications(res.data.data); // data is PaginatedNotifications
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        onNotificationRead();
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    }

    // Basic routing logic based on entity type (can be expanded based on app routes)
    if (notification.entity_type === 'tour_request' || notification.entity_type === 'booking') {
      navigate('/user/bookings');
    } else if (notification.entity_type === 'companion_request') {
      navigate('/user/companion-requests');
    } else {
      // Default action, maybe just close
    }
    onClose();
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      // Inform parent to clear the unread badge
      onNotificationRead(); 
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: '64px', // Below header
        right: 0,
        bottom: 0,
        width: '360px',
        backgroundColor: 'var(--tc-bg-default)',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        borderLeft: '1px solid var(--tc-border)',
        zIndex: 10001,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--tc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Thông báo</h3>
        <button 
          onClick={markAllAsRead}
          style={{ background: 'none', border: 'none', color: 'var(--tc-primary)', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, padding: 0 }}
        >
          Đánh dấu đã đọc
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600 }}>
        <span style={{ color: 'var(--tc-primary)', backgroundColor: 'var(--tc-primary-light)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>Tất cả</span>
        <span style={{ cursor: 'pointer', padding: '6px 12px' }}>Chưa đọc</span>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Chưa có thông báo nào</div>
        ) : (
          notifications.map((notif) => {
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  gap: '12px',
                  backgroundColor: !notif.is_read ? 'var(--tc-bg-muted)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--tc-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !notif.is_read ? 'var(--tc-bg-muted)' : 'transparent')}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--tc-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)', fontSize: '1.5rem' }}>
                  {/* Basic icon logic based on type */}
                  {notif.notification_type === 'request' ? '📝' : notif.notification_type === 'system' ? '⚙️' : '🔔'}
                  {!notif.is_read && (
                    <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', backgroundColor: 'var(--tc-primary)', borderRadius: '50%', border: '2px solid var(--tc-bg-default)' }}></div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.95rem', color: 'var(--tc-text-primary)' }}>
                    <div style={{ fontWeight: !notif.is_read ? 700 : 500 }}>{notif.title}</div>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', color: 'var(--tc-text-secondary)', marginTop: '2px' }}>
                      {notif.content}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: !notif.is_read ? 'var(--tc-primary)' : 'var(--tc-text-muted)', marginTop: '4px', fontWeight: !notif.is_read ? 600 : 400 }}>
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>
                {!notif.is_read && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--tc-primary)' }} />
                )}
              </div>
            );
          })
        )}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid var(--tc-border)', textAlign: 'center' }}>
        <a href="/user/notifications" style={{ color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
          Xem tất cả thông báo
        </a>
      </div>
    </div>
  );
};
