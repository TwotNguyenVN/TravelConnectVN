import api from './api';

export const getTourAccommodations = async (tourId: string) => {
  return api.get(`/accommodations/tour/${tourId}`);
};

export const getAllAccommodations = async () => {
  return api.get('/accommodations');
};
