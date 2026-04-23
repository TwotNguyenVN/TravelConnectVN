import api from '../services/api';

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getStatisticsUsers: () => api.get('/admin/statistics/users'),
  getStatisticsTours: () => api.get('/admin/statistics/tours'),
  getStatisticsReports: () => api.get('/admin/statistics/reports'),
  getStatisticsRevenue: () => api.get('/admin/statistics/revenue'),

  
  // Users
  getUsers: (params: any) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, data: any) => api.patch(`/admin/users/${id}/status`, data),
  assignRole: (id: string, data: any) => api.post(`/admin/users/${id}/roles`, data),
  revokeRole: (userId: string, role: string) => api.delete(`/admin/users/${userId}/roles/${role}`),

  // Reports
  getReports: (params: any) => api.get('/admin/reports', { params }),
  processReport: (id: string, data: any) => api.patch(`/admin/reports/${id}`, data),

  // Moderation
  moderateTour: (id: string, data: any) => api.patch(`/admin/tours/${id}/moderation`, data),
  getTours: (params: any) => api.get('/admin/tours', { params }),
  moderateCompanionPost: (id: string, data: any) => api.patch(`/admin/companion-posts/${id}/moderation`, data),
  getCompanionPosts: (params: any) => api.get('/admin/companion-posts', { params }),

  // Verification
  getVerificationRequests: () => api.get('/admin/guides/verification'),
  processVerification: (id: string, data: any) => api.patch(`/admin/guides/verification/${id}`, data),

  // Activity Logs
  getActivityLogs: (params: any) => api.get('/admin/activity-logs', { params }),
};
