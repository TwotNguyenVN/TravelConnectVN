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
};

export default aiChatService;
