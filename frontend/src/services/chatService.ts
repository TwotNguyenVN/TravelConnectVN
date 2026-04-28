import api from './api';
import type { ApiResponse } from '../types/api.types';

export interface Participant {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  lastSeenAt?: string | null;
  guideProfileId?: string | null;
  joinedAt?: string;
  lastReadAt?: string | null;
  isMuted?: boolean;
  isOwner?: boolean;
}

export interface CompanionPostCompact {
  id: string;
  title: string;
  destination: string;
  coverUrl: string | null;
}

export interface LastMessage {
  content: string;
  messageType: string;
  sentAt: string;
  senderUserId: string;
}

export interface Conversation {
  id: string;
  conversationType: 'direct' | 'group_companion';
  title: string | null;
  relatedCompanionPostId: string | null;
  relatedTourId: string | null;
  companionPost: CompanionPostCompact | null;
  participants: Participant[];
  lastMessage: LastMessage | null;
  lastMessageAt: string;
  hasUnread: boolean;
  lastReadAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  messageType: string;
  attachmentUrl: string | null;
  sentAt: string;
  editedAt: string | null;
  isOwn: boolean;
  sender: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface PaginatedMessages {
  items: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const chatService = {
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return await api.get('/conversations');
  },

  createDirect: async (guideUserId: string, relatedTourId?: string, initialMessage?: string): Promise<ApiResponse<Conversation>> => {
    return await api.post('/conversations/direct', { guideUserId, relatedTourId, initialMessage });
  },

  createGroupCompanion: async (companionPostId: string): Promise<ApiResponse<Conversation>> => {
    return await api.post('/conversations/group-companion', { companionPostId });
  },

  getMessages: async (conversationId: string, page = 1, limit = 30): Promise<ApiResponse<PaginatedMessages>> => {
    return await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
  },

  sendMessage: async (conversationId: string, content: string, messageType = 'text'): Promise<ApiResponse<Message>> => {
    return await api.post(`/conversations/${conversationId}/messages`, { content, messageType });
  },

  getParticipants: async (conversationId: string): Promise<ApiResponse<Participant[]>> => {
    return await api.get(`/conversations/${conversationId}/participants`);
  },

  markAsRead: async (conversationId: string): Promise<ApiResponse<any>> => {
    return await api.patch(`/conversations/${conversationId}/read`);
  },
};

export default chatService;
