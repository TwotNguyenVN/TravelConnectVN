import api from './api';
import type { ApiResponse } from '../types/api.types';

export interface AiMessage {
  id: string;
  session_id: string;
  sender_type: 'user' | 'assistant';
  content: string;
  model_name: string | null;
  created_at: string;
}

export interface AiSession {
  id: string;
  user_id: string;
  status: string;
  context?: any;
  started_at: string;
  last_interaction_at: string;
  created_at?: string;
  ai_chat_messages?: AiMessage[];
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

  deleteSession: async (sessionId: string): Promise<ApiResponse<any>> => {
    return await api.delete(`/ai-chat/sessions/${sessionId}`);
  },

  updateSessionContext: async (sessionId: string, context: any): Promise<ApiResponse<AiSession>> => {
    return await api.patch(`/ai-chat/sessions/${sessionId}/context`, { context });
  },
};

export default aiChatService;
