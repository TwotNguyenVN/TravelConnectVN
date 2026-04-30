import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Badge } from '../../components/common/Badge/Badge';
import { LoadingBlock, EmptyState } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

import './NotificationsPage.css';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();
  const { roles } = useAuth();
  const navigate = useNavigate();
  
  const isGuide = roles.includes('GUIDE');

  const fetchNotifications = async (pageNum: number, append = false) => {
    try {
      if (!append) setLoading(true);
      const res = await notificationService.getMyNotifications(pageNum, 10);
      if (res.success && res.data) {
        if (append) {
          setNotifications(prev => [...prev, ...res.data!.data]);
        } else {
          setNotifications(res.data.data);
        }
        setTotal(res.data.total);
        setHasMore(pageNum < res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await notificationService.deleteNotification(id);
      if (res.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setTotal(prev => prev - 1);
        toast.success('Đã xóa thông báo');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id, notification.is_read);
    
    // Navigate based on notification type
    switch (notification.entity_type) {
      case 'TOUR_REQUEST':
        // Logic to distinguish guide-side vs user-side
        const titleLower = notification.title.toLowerCase();
        const contentLower = notification.content.toLowerCase();
        const isGuideNotification = 
          titleLower.includes('mới') || 
          titleLower.includes('hủy') ||
          titleLower.includes('thanh toán') ||
          titleLower.includes('đăng ký') ||
          contentLower.includes('khách hàng') ||
          contentLower.includes('đặt tour');
          
        if (isGuide && isGuideNotification) {
          navigate('/guide/tour-requests');
        } else {
          navigate('/user/requests');
        }
        break;
      case 'COMPANION_REQUEST':
        navigate('/user/companion-requests');
        break;
      case 'GUIDE_VERIFICATION':
        navigate('/guide/verification');
        break;
      default:
        // Generic or system notification
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tour_request': return '🎫';
      case 'companion_request': return '🤝';
      case 'system': return '⚙️';
      case 'promotion': return '🎁';
      case 'verification': return '✅';
      default: return '🔔';
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case 'tour_request': return 'primary';
      case 'companion_request': return 'secondary';
      case 'verification': return 'success';
      case 'system': return 'neutral';
      default: return 'neutral';
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1 style={{ fontSize: 'var(--tc-font-size-xl)', margin: 0 }}>Trung tâm thông báo</h1>
          {notifications.length > 0 && (
            <Button variant="outline" size="small" onClick={handleMarkAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {loading && page === 1 ? (
          <div className="notifications-list">
            <LoadingBlock height={100} />
            <LoadingBlock height={100} />
            <LoadingBlock height={100} />
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="notifications-list">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`notification-item ${!n.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <button 
                    className="notification-delete-btn"
                    onClick={(e) => handleDelete(e, n.id)}
                    title="Xóa thông báo"
                  >
                    ✕
                  </button>
                  <div className="notification-icon" style={{ backgroundColor: `var(--tc-${getVariant(n.notification_type)}-light)` }}>
                    {getIcon(n.notification_type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      <span>{n.title}</span>
                      {!n.is_read && <Badge variant="primary" size="small">Mới</Badge>}
                    </div>
                    <div className="notification-body">
                      {n.content}
                    </div>
                    <div className="notification-time">
                      {new Date(n.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="load-more-container">
                <Button variant="outline" onClick={loadMore} isLoading={loading}>
                  Xem thêm thông báo
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            title="Không có thông báo nào" 
            description="Bạn hiện không có thông báo nào từ hệ thống."
            icon="🔔"
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
