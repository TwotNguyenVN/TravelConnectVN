import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender_user_id: string;
  content: string;
  message_type: string;
  attachment_url?: string;
  sent_at: string;
  users?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

interface ChatState {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  conversations: any[];
  activeConversationId: string | null;
  typingUsers: { [conversationId: string]: string[] }; // userIds typing
  
  connect: (token: string) => void;
  disconnect: () => void;
  joinConversation: (conversationId: string) => void;
  setActiveConversation: (conversationId: string) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  sendMessage: (conversationId: string, content: string, type?: string, attachmentUrl?: string) => void;
  sendTyping: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  conversations: [],
  activeConversationId: null,
  typingUsers: {},

  connect: (token: string) => {
    if (get().socket) return;
    
    const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const socket = io(socketURL, {
      auth: { token: `Bearer ${token}` }
    });

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));
    
    socket.on('new_message', (message: Message) => {
      const state = get();
      if (state.activeConversationId === message.id || message.conversation_id === state.activeConversationId) {
        set({ messages: [...state.messages, message] });
      }
    });

    socket.on('user_typing', (data: { userId: string, conversationId: string }) => {
      set((state) => {
        const currentTyping = state.typingUsers[data.conversationId] || [];
        if (!currentTyping.includes(data.userId)) {
          return { typingUsers: { ...state.typingUsers, [data.conversationId]: [...currentTyping, data.userId] } };
        }
        return state;
      });
      // Clear typing after 3 seconds
      setTimeout(() => {
        set((state) => {
          const updatedTyping = (state.typingUsers[data.conversationId] || []).filter(id => id !== data.userId);
          return { typingUsers: { ...state.typingUsers, [data.conversationId]: updatedTyping } };
        });
      }, 3000);
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinConversation: (conversationId: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('join_conversation', { conversationId });
    }
  },

  setActiveConversation: (conversationId: string) => {
    set({ activeConversationId: conversationId });
    get().joinConversation(conversationId);
  },

  setMessages: (messages: Message[]) => set({ messages }),

  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),

  sendMessage: (conversationId: string, content: string, type = 'text', attachmentUrl?: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('send_message', { conversationId, content, messageType: type, attachmentUrl });
    }
  },

  sendTyping: (conversationId: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('typing', { conversationId });
    }
  }
}));
