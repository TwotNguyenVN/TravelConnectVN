import api from './api';

export interface CreateReviewDto {
  tourRequestId: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

const reviewService = {
  // Tour Reviews
  createTourReview: (data: CreateReviewDto) => 
    api.post('/reviews/tours', data),
  
  getTourReviews: (tourId: string, page: number = 1, limit: number = 10) => 
    api.get(`/reviews/tours/${tourId}?page=${page}&limit=${limit}`),

  // Guide Reviews
  createGuideReview: (data: CreateReviewDto) => 
    api.post('/reviews/guides', data),
  
  getGuideReviews: (guideId: string, page: number = 1, limit: number = 10) => 
    api.get(`/reviews/guides/${guideId}?page=${page}&limit=${limit}`),

  // User Reviews
  getMyReviews: () => 
    api.get('/reviews/me'),

  // Admin Management
  getAllReviewsAdmin: (page: number = 1, limit: number = 50) => 
    api.get(`/reviews/admin/all?page=${page}&limit=${limit}`),

  updateReviewVisibility: (type: 'TOUR' | 'GUIDE', id: string, status: string) => 
    api.post('/reviews/admin/visibility', { type, id, status }),
};

export default reviewService;
