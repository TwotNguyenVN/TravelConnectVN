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
  getReports: (params: Record<string, unknown>) => api.get('/reports', { params }),
  processReport: (id: string, data: { action: 'dismiss' | 'hide' | 'warn'; resolutionNote: string }) => api.post(`/reports/${id}/resolve`, data),

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
  getSosAlerts: () => api.get('/support/sos'),
  resolveSosAlert: (id: string, note: string) => api.patch(`/support/sos/${id}/resolve`, { note }),

  // Support Tickets
  getTickets: (params?: Record<string, unknown>) => api.get('/support/tickets', { params }),
  updateTicket: (id: string, data: Record<string, unknown>) => api.patch(`/support/tickets/${id}`, data),

  // Tour Disputes
  getDisputes: () => api.get('/support/disputes'),
  getDisputeChatHistory: (disputeId: string) => api.get(`/support/disputes/${disputeId}/chat-history`),
  resolveDispute: (id: string, data: Record<string, unknown>) => api.post(`/support/disputes/${id}/resolve`, data),

  // Guide Settlements
  getGuideSettlements: () => api.get('/admin/guides/settlements'),
  settleGuideTransactions: (id: string) => api.post(`/admin/guides/${id}/settle`),

  // Support Staff — Tour Requests (Disputes)
  getTourRequests: (params?: Record<string, unknown>) => api.get('/admin/tour-requests', { params }),
  getTourRequestDetail: (id: string) => api.get(`/admin/tour-requests/${id}`),

  // Support Staff — Notifications Broadcast
  sendBroadcastNotification: (data: { title: string; content: string; targetGroup?: string }) =>
    api.post('/support/notifications/broadcast', data),

  // Content Moderation AI Scanner
  analyzeContent: (text: string) => api.post('/admin/moderation/analyze', { text }),

  // Agent Co-Pilot (Support)
  getCopilotSuggestion: (text: string) => api.post('/support/copilot/suggest', { text }),

  // Soft Delete Recovery Console
  getDeletedItems: () => api.get('/admin/recovery/deleted'),
  restoreDeletedItem: (type: string, id: string) => api.post(`/admin/recovery/${type}/${id}/restore`),

  // Phase 5: Maintenance Mode
  getMaintenanceStatus: () => api.get('/admin/maintenance/status'),
  toggleMaintenance: (enabled: boolean, bypassIps?: string[]) => api.post('/admin/maintenance/toggle', { enabled, bypassIps }),

  // Phase 6: Anomaly Detection
  getAnomalyAlerts: () => api.get('/admin/anomaly/alerts'),

  // Phase 7: Report Heatmap
  getReportHeatmapData: () => api.get('/reports/heatmap'),

  // Phase 8: FAQ & Quick Responses
  getFaqItems: () => api.get('/support/faq'),
  createFaqItem: (data: { question: string; answer: string; category?: string }) => api.post('/support/faq', data),
  updateFaqItem: (id: string, data: { question?: string; answer?: string; category?: string }) => api.patch(`/support/faq/${id}`, data),
  deleteFaqItem: (id: string) => api.delete(`/support/faq/${id}`),

  // Phase 9: CSAT & SLA Analytics
  getCsatAnalytics: () => api.get('/support/analytics/csat'),

  // Phase 10: Smart Reconciliation
  reconcileTransactions: (formData: FormData) => api.post('/admin/finance/reconcile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Phase 11: Financial Export
  exportFinancialReport: (params?: { startDate?: string; endDate?: string }) => api.get('/admin/finance/export', { params }),

  // Phase 1.1 Core: Global Settings & System Health
  getSystemHealth: () => api.get('/admin/system/health'),
  getSetting: (key: string) => api.get(`/admin/settings/${key}`),
  updateSetting: (key: string, value: string) => api.patch(`/admin/settings/${key}`, { value }),
  
  getCategories: (type: string) => api.get(`/admin/categories/${type}`),
  createCategory: (type: string, data: { name: string; description?: string }) => api.post(`/admin/categories/${type}`, data),
  updateCategory: (type: string, id: string, data: { name: string; description?: string }) => api.patch(`/admin/categories/${type}/${id}`, data),
  deleteCategory: (type: string, id: string) => api.delete(`/admin/categories/${type}/${id}`),
};

