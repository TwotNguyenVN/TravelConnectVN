import api from './api';

export interface Tour {
  id: string;
  title: string;
  cover: string;
  price: number;
  rating: number;
  location: string;
  duration?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  businessStatus?: string;
  visibilityStatus?: string;
  province?: string;
  maxParticipants?: number;
  numDays?: number;
  numNights?: number;
}

export interface TourFilters {
  keyword?: string;
  province?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const tourService = {
  getTours: async (filters: TourFilters) => {
    return api.get('/tours', { params: filters });
  },

  getTourReviews: async (id: string, page: number = 1, limit: number = 10) => {
    return api.get(`/tours/${id}/reviews`, { params: { page, limit } });
  },

  getTourDetail: async (id: string) => {
    return api.get(`/tours/${id}`);
  },

  getTourDetailForGuide: async (id: string) => {
    return api.get(`/tours/guide/${id}`);
  },

  getFeaturedTours: async () => {
    return api.get('/tours/home/featured-tours');
  },

  getFeaturedGuides: async () => {
    return api.get('/tours/home/featured-guides');
  },

  getLatestCompanions: async () => {
    return api.get('/tours/home/latest-companions');
  },

  getCategories: async () => {
    return api.get('/tours/categories');
  },
  
  getMyGuidedTours: async (params: { status?: string; keyword?: string; page?: number; limit?: number }) => {
    return api.get('/tours/guide/me', { params });
  },

  createTour: async (data: any) => {
    return api.post('/tours/guide/create', data);
  },

  updateTour: async (id: string, data: any) => {
    return api.patch(`/tours/guide/${id}`, data);
  },

  getTourItinerary: async (id: string) => {
    return api.get(`/tours/${id}/itinerary`);
  },

  updateTourItinerary: async (id: string, locations: any[]) => {
    return api.post(`/tours/${id}/itinerary`, locations);
  },

  getTourImages: async (id: string) => {
    return api.get(`/tours/${id}/images`);
  },

  updateTourImages: async (id: string, images: any[]) => {
    return api.post(`/tours/${id}/images`, images);
  },

  deleteTour: async (id: string) => {
    return api.patch(`/tours/guide/${id}/delete`);
  },

  createTourSchedule: async (tourId: string, data: { startDate: string; price: number; maxParticipants: number }) => {
    return api.post(`/tours/${tourId}/schedules`, data);
  },

  updateTourSchedule: async (tourId: string, scheduleId: string, data: { price?: number; maxParticipants?: number; status?: string }) => {
    return api.patch(`/tours/${tourId}/schedules/${scheduleId}`, data);
  },

  deleteTourSchedule: async (tourId: string, scheduleId: string) => {
    return api.delete(`/tours/${tourId}/schedules/${scheduleId}`);
  },
};
