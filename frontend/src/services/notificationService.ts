import api from './api';
import type { ApiResponse } from '../types/api.types';


export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  content: string;
  entity_type: string | null;
  entity_id: string | null;
  payload: any;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface PaginatedNotifications {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const notificationService = {
  getMyNotifications: async (page = 1, limit = 20): Promise<ApiResponse<PaginatedNotifications>> => {
    const response = await api.get(`/notifications/me?page=${page}&limit=${limit}`);
    return response;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    // We can filter on frontend or add backend endpoint. 
    // For now, let's assume we might need a separate endpoint or just use the count from the paginated result if available.
    // Actually, let's just implement it as a GET request to a new endpoint I'll add to backend.
    const response = await api.get('/notifications/unread-count');
    return response;
  },

  markAsRead: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response;
  },

  markAllAsRead: async (): Promise<ApiResponse<any>> => {
    const response = await api.patch('/notifications/read-all');
    return response;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/notifications/${id}`);
    return response;
  },
};


export default notificationService;
