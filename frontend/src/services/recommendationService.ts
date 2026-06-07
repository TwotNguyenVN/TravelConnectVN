import api from './api';

export const getRecommendedTours = async () => {
  return api.get('/recommendations/tours');
};

export const trackActivity = async (tourId: string, activityType: 'VIEW' | 'BOOK' | 'FAVORITE' | 'SEARCH' = 'VIEW') => {
  return api.post('/recommendations/track', { tourId, activityType });
};
