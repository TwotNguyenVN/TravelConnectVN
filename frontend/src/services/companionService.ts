import api from './api';

export interface CompanionPost {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  estimated_cost: number;
  currency_code: string;
  expected_members: number;
  description: string;
  requirements?: string;
  business_status: 'open' | 'closed' | 'cancelled';
  visibility_status: 'visible' | 'hidden';
  created_at: string;
  users?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  _count?: {
    companion_requests: number;
  };
}

export interface CompanionRequest {
  id: string;
  post_id: string;
  user_id: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requested_at: string;
  response_note?: string;
  processed_at?: string;
}

export interface CompanionFilters {
  destination?: string;
  startDateFrom?: string;
  startDateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export const companionService = {
  getPublicPosts: async (filters: CompanionFilters) => {
    return api.get('/companion-posts', { params: filters });
  },

  getPostDetail: async (id: string) => {
    return api.get(`/companion-posts/${id}`);
  },

  getMyPosts: async (params: any) => {
    return api.get('/companion-posts/my-posts', { params });
  },

  createPost: async (data: any) => {
    return api.post('/companion-posts', data);
  },

  updatePost: async (id: string, data: any) => {
    return api.patch(`/companion-posts/${id}`, data);
  },

  deletePost: async (id: string) => {
    return api.delete(`/companion-posts/${id}`);
  },

  // Requests
  sendRequest: async (data: { postId: string; message?: string }) => {
    return api.post('/companion-posts/requests', data);
  },

  getMySentRequests: async (params: any) => {
    return api.get('/companion-posts/requests/me', { params });
  },

  getPostRequests: async (postId: string, params: any) => {
    return api.get(`/companion-posts/${postId}/requests`, { params });
  },

  cancelRequest: async (requestId: string) => {
    return api.patch(`/companion-posts/requests/${requestId}/cancel`);
  },

  approveRequest: async (requestId: string, data: { responseNote?: string }) => {
    return api.patch(`/companion-posts/requests/${requestId}/approve`, data);
  },

  rejectRequest: async (requestId: string, data: { responseNote?: string }) => {
    return api.patch(`/companion-posts/requests/${requestId}/reject`, data);
  },

  getMyRequestForPost: async (postId: string) => {
    return api.get(`/companion-posts/${postId}/my-request`);
  },
};
