import api from './api';

export interface TourRequest {
  id: string;
  tourId: string;
  tourTitle?: string;
  guideName?: string;
  userName?: string;
  userAvatar?: string;
  participantCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled_by_user' | 'cancelled_by_guide' | 'payment_pending' | 'paid';
  note?: string;
  responseNote?: string;
  requestedAt: string;
  processedAt?: string;
  tourPrice?: number;
  hasTourReview?: boolean;
  hasGuideReview?: boolean;
}

export interface TourRequestQuery {
  tourId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const tourRequestService = {
  createRequest: async (data: { tourId: string; participantCount: number; note?: string }) => {
    return api.post('/tour-requests', data);
  },

  getMyRequests: async (query?: TourRequestQuery) => {
    return api.get('/tour-requests/me', { params: query });
  },

  getGuideRequests: async (query?: TourRequestQuery) => {
    return api.get('/tour-requests/guide', { params: query });
  },

  cancelRequest: async (id: string, reason?: string) => {
    return api.patch(`/tour-requests/${id}/cancel`, { reason });
  },

  approveRequest: async (id: string, responseNote?: string) => {
    return api.patch(`/tour-requests/${id}/approve`, { responseNote });
  },

  rejectRequest: async (id: string, responseNote?: string) => {
    return api.patch(`/tour-requests/${id}/reject`, { responseNote });
  },
};

export default tourRequestService;
