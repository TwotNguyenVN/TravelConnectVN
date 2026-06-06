import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { toast as sonnerToast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Kết nối đến Backend (mặc định là localhost:3000 hoặc process.env.VITE_API_URL)
    let socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      socketUrl = 'http://localhost:3000';
    }

    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      // Đăng ký userId với server
      socketInstance.emit('register', { userId: user.id });
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Lắng nghe các sự kiện nghiệp vụ
    socketInstance.on('new_tour_request', (data) => {
      toast.info(`🔔 ${data.message}`);
    });


    socketInstance.on('tour_request_processed', (data) => {
      const statusText = data.status === 'approved' ? 'được chấp nhận' : 'bị từ chối';
      toast.success(`📅 Yêu cầu Tour của bạn ${statusText}!`);
    });


    socketInstance.on('new_companion_request', (data) => {
      toast.info(`🤝 ${data.message}`);
    });

    // Lắng nghe tiến trình công việc chạy ngầm (BullMQ)
    socketInstance.on('job_progress', (data: { jobId: string; progress: number; message: string }) => {
      sonnerToast.loading(`${data.message} (${data.progress}%)`, {
        id: data.jobId,
        duration: Infinity,
      });
    });

    socketInstance.on('job_completed', (data: { jobId: string; message: string; downloadUrl?: string }) => {
      sonnerToast.success(data.message, {
        id: data.jobId,
        duration: 5000,
        action: data.downloadUrl ? {
          label: 'Tải xuống',
          onClick: () => window.open(data.downloadUrl, '_blank')
        } : undefined
      });
    });

    socketInstance.on('job_failed', (data: { jobId: string; message: string }) => {
      sonnerToast.error(`Tác vụ thất bại: ${data.message}`, {
        id: data.jobId,
        duration: 5000,
      });
    });

    socketInstance.on('user_status_change', (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (data.status === 'online') {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
