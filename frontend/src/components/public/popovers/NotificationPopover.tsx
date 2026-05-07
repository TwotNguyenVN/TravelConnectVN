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
        position: 'absolute',
        top: '100%',
        right: '-10px',
        marginTop: '12px',
        width: '360px',
        backgroundColor: 'var(--tc-bg-default)',
        borderRadius: '8px',
        boxShadow: 'var(--tc-shadow-lg)',
        border: '1px solid var(--tc-border)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '480px',
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--tc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Thông báo</h3>
        <button 
          onClick={markAllAsRead}
          style={{ background: 'none', border: 'none', color: 'var(--tc-primary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
        >
          Đánh dấu đã đọc
        </button>
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
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  gap: '12px',
                  backgroundColor: !notif.is_read ? 'var(--tc-bg-muted)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--tc-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !notif.is_read ? 'var(--tc-bg-muted)' : 'transparent')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--tc-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)', fontSize: '1.2rem' }}>
                  {/* Basic icon logic based on type */}
                  {notif.notification_type === 'request' ? '📝' : notif.notification_type === 'system' ? '⚙️' : '🔔'}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.95rem', color: 'var(--tc-text-primary)' }}>
                    <strong>{notif.title}</strong>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', color: 'var(--tc-text-secondary)', marginTop: '2px' }}>
                      {notif.content}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: !notif.is_read ? 'var(--tc-primary)' : 'var(--tc-text-muted)', marginTop: '4px' }}>
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
      <div style={{ padding: '12px', borderTop: '1px solid var(--tc-border)', textAlign: 'center' }}>
        <a href="/user/notifications" style={{ color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
          Xem tất cả thông báo
        </a>
      </div>
    </div>
  );
};
