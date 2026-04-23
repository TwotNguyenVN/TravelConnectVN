import api from './api';

export interface GuideProfile {
  id: string;
  userId: string;
  bio: string;
  yearsOfExperience: number;
  workingArea: string;
  verificationStatus: string;
  guideLanguages: { language: { id: number; name: string } }[];
  guideSkills: { skill: { id: number; name: string } }[];
  otherLanguages?: string;
  otherSkills?: string;
  homeProvinceId?: number;
  homeProvince?: { id: number; name: string; region: string };
  familiarProvinces?: string;
  region?: string;
}

export interface MasterData {
  id: number;
  name: string;
}

export const guideService = {
  getLanguages: async () => {
    return api.get('/guides/languages');
  },

  getSkills: async () => {
    return api.get('/guides/skills');
  },

  getMyProfile: async () => {
    return api.get('/guides/me/profile');
  },

  getProvinces: async () => {
    return api.get('/guides/provinces');
  },

  createProfile: async (data: any) => {
    return api.post('/guides/me/profile', data);
  },

  updateProfile: async (data: Partial<GuideProfile>) => {
    return api.patch('/guides/me/profile', data);
  },

  updateLanguages: async (languageIds: number[]) => {
    return api.put('/guides/me/languages', { languageIds });
  },

  updateSkills: async (skillIds: number[]) => {
    return api.put('/guides/me/skills', { skillIds });
  },

  getPublicGuides: async (params: any) => {
    return api.get('/guides', { params });
  },

  getPublicGuideDetail: async (id: string) => {
    return api.get(`/guides/${id}`);
  },
};
