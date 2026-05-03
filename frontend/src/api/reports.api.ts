import api from '../services/api';

export interface CreateReportDto {
  target_type: 'tour' | 'companion_post' | 'user' | 'guide_profile' | 'tour_review' | 'guide_review';
  tour_id?: string;
  companion_post_id?: string;
  reported_user_id?: string;
  guide_profile_id?: string;
  reason: string;
  description?: string;
}

export const reportsApi = {
  create: async (dto: CreateReportDto) => {
    return api.post('/reports', dto);
  },

  getMyReports: async () => {
    return api.get('/reports/me');
  }
};
