import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
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

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
