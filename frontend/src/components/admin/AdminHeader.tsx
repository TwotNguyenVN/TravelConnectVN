import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import notificationService from '../../services/notificationService';



import { useSocket } from '../../contexts/SocketContext';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_AVATAR } from '../../constants/images';

export const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();
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
      const handleNewNotification = (data: any) => {
        setUnreadCount(prev => prev + 1);
        toast.info(`🔔 ${data.title || 'Thông báo mới'}`);
      };

      socket.on('new_notification', handleNewNotification);

      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [socket, toast]);



  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--tc-bg-default)',
      borderBottom: '1px solid var(--tc-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 var(--tc-spacing-5)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-5)' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-4)' }}>

        <div style={{ textAlign: 'right' }}>
          <div 
            style={{ fontWeight: 600, fontSize: 'var(--tc-font-size-sm)' }}
            title={user?.user_metadata?.full_name || 'System Admin'}
          >
            {(user?.user_metadata?.full_name || 'System Admin').length > 30 
              ? `${(user?.user_metadata?.full_name || 'System Admin').slice(0, 30)}...` 
              : (user?.user_metadata?.full_name || 'System Admin')}
          </div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
            {user?.email || 'admin@travelconnect.vn'}
          </div>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--tc-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--tc-primary)',
          fontWeight: 'bold',
          overflow: 'hidden',
          border: '2px solid var(--tc-border)'
        }}>
          <img 
            src={user?.user_metadata?.avatar_url || DEFAULT_AVATAR} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        </div>
      </div>
    </header>

  );
};
