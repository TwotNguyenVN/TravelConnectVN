import api from './api';
import type { ApiResponse, PaginatedData } from '../types/api.types';


export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const userActivityLogsService = {
  getMyLogs: async (page = 1, limit = 20, activityType?: string): Promise<ApiResponse<PaginatedData<ActivityLog>>> => {
    const params: any = { page, limit };
    if (activityType && activityType !== 'all') params.activityType = activityType;
    return api.get('/me/activity-logs', { params });
  },
};

export default userActivityLogsService;
