import api from './api';

export const getRecommendedTours = async () => {
  return api.get('/recommendations/tours');
};
