import api from './api';
import type { ApiResponse } from '../types/api.types';

export interface AiSession {
  id: string;
  userId: string;
  status: string;
  startedAt: string;
  lastInteractionAt: string;
}

export interface AiMessage {
  id: string;
  sessionId: string;
  senderType: 'user' | 'bot';
  content: string;
  modelName: string | null;
  createdAt: string;
}

const aiChatService = {
  getSessions: async (): Promise<ApiResponse<AiSession[]>> => {
    return await api.get('/ai-chat/sessions');
  },

  createSession: async (): Promise<ApiResponse<AiSession>> => {
    return await api.post('/ai-chat/sessions');
  },

  getMessages: async (sessionId: string): Promise<ApiResponse<AiMessage[]>> => {
    return await api.get(`/ai-chat/sessions/${sessionId}/messages`);
  },

  sendMessage: async (sessionId: string, content: string): Promise<ApiResponse<AiMessage>> => {
    return await api.post(`/ai-chat/sessions/${sessionId}/messages`, { content });
  },
};

export default aiChatService;
