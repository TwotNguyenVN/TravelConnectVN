import api from './api';

export interface FavoriteTour {
  id: string;
  title: string;
  cover: string;
  price: number;
  location: string;
  category: string;
  favoritedAt: string;
}

export interface FavoriteGuide {
  id: string;
  name: string;
  avatar: string;
  location: string;
  verificationStatus: string;
  favoritedAt: string;
}

const favoriteService = {
  // Tour Favorites
  addTourFavorite: (tourId: string) => 
    api.post(`/favorites/tours/${tourId}`),
  
  removeTourFavorite: (tourId: string) => 
    api.delete(`/favorites/tours/${tourId}`),
  
  getMyFavoriteTours: () => 
    api.get<FavoriteTour[]>('/favorites/me/tours'),

  // Guide Favorites
  addGuideFavorite: (guideId: string) => 
    api.post(`/favorites/guides/${guideId}`),
  
  removeGuideFavorite: (guideId: string) => 
    api.delete(`/favorites/guides/${guideId}`),
  
  getMyFavoriteGuides: () => 
    api.get<FavoriteGuide[]>('/favorites/me/guides'),

  checkIsFavorite: (tourId: string) =>
    api.get<{ success: boolean; data: boolean }>(`/favorites/check/tour/${tourId}`),

  checkGuideIsFavorite: (guideId: string) =>
    api.get<{ success: boolean; data: boolean }>(`/favorites/check/guide/${guideId}`),
};

export default favoriteService;
