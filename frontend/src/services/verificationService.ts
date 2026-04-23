import api from './api';
import { supabase } from '../utils/supabase';

export interface VerificationDocument {
  documentType: string;
  fileUrl: string;
}

export interface VerificationRequest {
  submissionNote?: string;
  documents: VerificationDocument[];
}

export const verificationService = {
  getStatus: async () => {
    return api.get('/guide-verification/status');
  },

  submitRequest: async (data: VerificationRequest) => {
    return api.post('/guide-verification/request', data);
  },

  getMyRequests: async () => {
    return api.get('/guide-verification/my-requests');
  },

  getRequestDetail: async (id: string) => {
    return api.get(`/guide-verification/${id}`);
  },

  uploadDocument: async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `verification/${fileName}`; // Subfolder within guide-docs

    const { error: uploadError } = await supabase.storage
      .from('guide-docs')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('guide-docs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
