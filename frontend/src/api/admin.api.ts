import api from '../services/api';

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getStatisticsUsers: () => api.get('/admin/statistics/users'),
  getStatisticsTours: () => api.get('/admin/statistics/tours'),
  getStatisticsReports: () => api.get('/admin/statistics/reports'),
  getStatisticsRevenue: () => api.get('/admin/statistics/revenue'),

  
  // Users
  getUsers: (params: Record<string, unknown>) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, data: Record<string, unknown>) => api.patch(`/admin/users/${id}/status`, data),
  assignRole: (id: string, data: Record<string, unknown>) => api.post(`/admin/users/${id}/roles`, data),
  revokeRole: (userId: string, role: string) => api.delete(`/admin/users/${userId}/roles/${role}`),
  createStaff: (data: Record<string, unknown>) => api.post('/admin/staff', data),

  // Reports
  getReports: (params: Record<string, unknown>) => api.get('/admin/reports', { params }),
  processReport: (id: string, data: Record<string, unknown>) => api.patch(`/admin/reports/${id}`, data),

  // Moderation
  moderateTour: (id: string, data: Record<string, unknown>) => api.patch(`/admin/tours/${id}/moderation`, data),
  getTours: (params: Record<string, unknown>) => api.get('/admin/tours', { params }),
  moderateCompanionPost: (id: string, data: Record<string, unknown>) => api.patch(`/admin/companion-posts/${id}/moderation`, data),
  getCompanionPosts: (params: Record<string, unknown>) => api.get('/admin/companion-posts', { params }),

  // Verification
  getVerificationRequests: () => api.get('/admin/guides/verification'),
  processVerification: (id: string, data: Record<string, unknown>) => api.patch(`/admin/guides/verification/${id}`, data),

  // Activity Logs
  getActivityLogs: (params: Record<string, unknown>) => api.get('/admin/activity-logs', { params }),

  // Refund Management
  getPendingRefunds: () => api.get('/admin/refunds/pending'),
  processRefund: (id: string, data: Record<string, unknown>) => api.post(`/admin/refunds/${id}/process`, data),
  getTransactions: (params?: Record<string, unknown>) => api.get('/admin/transactions', { params }),
  updateTransactionStatus: (id: string, status: string) => api.patch(`/admin/transactions/${id}/status`, { status }),


  // SOS Alerts
  getSosAlerts: () => api.get('/admin/sos'),
  resolveSosAlert: (id: string, note: string) => api.patch(`/admin/sos/${id}/resolve`, { note }),

  // Support Tickets
  getTickets: (params?: Record<string, unknown>) => api.get('/admin/tickets', { params }),
  updateTicket: (id: string, data: Record<string, unknown>) => api.patch(`/admin/tickets/${id}`, data),

  // Tour Disputes
  getDisputes: () => api.get('/admin/disputes'),
  getDisputeChatHistory: (disputeId: string) => api.get(`/admin/disputes/${disputeId}/chat-history`),
  resolveDispute: (id: string, data: Record<string, unknown>) => api.patch(`/admin/disputes/${id}/resolve`, data),

  // Guide Settlements
  getGuideSettlements: () => api.get('/admin/guides/settlements'),
  settleGuideTransactions: (id: string) => api.post(`/admin/guides/${id}/settle`),

  // Support Staff — Tour Requests (Disputes)
  getTourRequests: (params?: Record<string, unknown>) => api.get('/admin/tour-requests', { params }),
  getTourRequestDetail: (id: string) => api.get(`/admin/tour-requests/${id}`),

  // Support Staff — Notifications Broadcast
  sendBroadcastNotification: (data: { title: string; message: string; targetRole?: string; targetUserId?: string }) =>
    api.post('/admin/notifications/broadcast', data),

  // Content Moderation AI Scanner
  analyzeContent: (text: string) => api.post('/admin/moderation/analyze', { text }),

  // Soft Delete Recovery Console
  getDeletedItems: () => api.get('/admin/recovery/deleted'),
  restoreDeletedItem: (type: string, id: string) => api.post(`/admin/recovery/${type}/${id}/restore`),

  // Phase 5: Maintenance Mode
  getMaintenanceStatus: () => api.get('/admin/maintenance/status'),
  toggleMaintenance: (enabled: boolean, bypassIps?: string[]) => api.post('/admin/maintenance/toggle', { enabled, bypassIps }),

  // Phase 6: Anomaly Detection
  getAnomalyAlerts: () => api.get('/admin/anomaly/alerts'),

  // Phase 7: Report Heatmap
  getReportHeatmapData: () => api.get('/admin/reports/heatmap'),

  // Phase 8: FAQ & Quick Responses
  getFaqItems: () => api.get('/admin/faq'),
  createFaqItem: (data: { question: string; answer: string; category?: string }) => api.post('/admin/faq', data),
  updateFaqItem: (id: string, data: { question?: string; answer?: string; category?: string }) => api.patch(`/admin/faq/${id}`, data),
  deleteFaqItem: (id: string) => api.delete(`/admin/faq/${id}`),

  // Phase 9: CSAT & SLA Analytics
  getCsatAnalytics: () => api.get('/admin/analytics/csat'),

  // Phase 10: Smart Reconciliation
  reconcileTransactions: (formData: FormData) => api.post('/admin/finance/reconcile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Phase 11: Financial Export
  exportFinancialReport: (params?: { startDate?: string; endDate?: string }) => api.get('/admin/finance/export', { params }),
};
