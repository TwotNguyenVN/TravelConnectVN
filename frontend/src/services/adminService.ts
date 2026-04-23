import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return api.get('/admin/dashboard');
  },

  getStatisticsUsers: async () => {
    return api.get('/admin/statistics/users');
  },

  getStatisticsTours: async () => {
    return api.get('/admin/statistics/tours');
  },

  getStatisticsReports: async () => {
    return api.get('/admin/statistics/reports');
  },

  getStatisticsRevenue: async () => {
    return api.get('/admin/statistics/revenue');
  },

  getUsers: async (params: any) => {
    return api.get('/admin/users', { params });
  },

  updateUserStatus: async (id: string, data: { status: string; reason?: string }) => {
    return api.patch(`/admin/users/${id}/status`, data);
  },

  getVerificationRequests: async () => {
    return api.get('/admin/guides/verification');
  },

  processVerification: async (id: string, data: { status: string; result_note?: string }) => {
    return api.patch(`/admin/guides/verification/${id}`, data);
  },

  getReports: async (params: any) => {
    return api.get('/admin/reports', { params });
  },

  processReport: async (id: string, data: { status: string; resolution_note?: string }) => {
    return api.patch(`/admin/reports/${id}`, data);
  },

  getTours: async (params: any) => {
    return api.get('/admin/tours', { params });
  },

  moderateTour: async (id: string, data: { visibility_status: string; reason?: string }) => {
    return api.patch(`/admin/tours/${id}/moderation`, data);
  },

  getCompanionPosts: async (params: any) => {
    return api.get('/admin/companion-posts', { params });
  },

  moderateCompanionPost: async (id: string, data: { visibility_status: string; reason?: string }) => {
    return api.patch(`/admin/companion-posts/${id}/moderation`, data);
  },

  getActivityLogs: async (params: any) => {
    return api.get('/admin/activity-logs', { params });
  },
};
