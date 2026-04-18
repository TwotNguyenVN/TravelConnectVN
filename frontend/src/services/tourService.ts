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
}

export interface TourFilters {
  keyword?: string;
  province?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const tourService = {
  getTours: async (filters: TourFilters) => {
    const response = await api.get('/tours', { params: filters });
    return response.data;
  },

  getTourReviews: async (id: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(`/tours/${id}/reviews`, { params: { page, limit } });
    return response.data;
  },

  getTourDetail: async (id: string) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  getFeaturedTours: async () => {
    const response = await api.get('/tours/home/featured-tours');
    return response.data;
  },

  getFeaturedGuides: async () => {
    const response = await api.get('/tours/home/featured-guides');
    return response.data;
  },

  getLatestCompanions: async () => {
    const response = await api.get('/tours/home/latest-companions');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/tours/categories');
    return response.data;
  },
};
