import api from './api';

export const userService = {
  getProfile: async () => {
    return api.get('/me');
  },

  updateProfile: async (data: any) => {
    return api.patch('/me', data);
  },

  getPublicProfile: async (id: string) => {
    return api.get(`/users/${id}/public`);
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getRoles: async () => {
    return api.get('/me/roles');
  }
};
