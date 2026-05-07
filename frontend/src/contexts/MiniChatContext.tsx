import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Conversation } from '../services/chatService';

interface MiniChatContextType {
  activeChats: Conversation[];
  minimizedChats: Record<string, boolean>;
  openChat: (conversation: Conversation) => void;
  closeChat: (conversationId: string) => void;
  toggleMinimize: (conversationId: string) => void;
}

const MiniChatContext = createContext<MiniChatContextType | undefined>(undefined);

export const MiniChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeChats, setActiveChats] = useState<Conversation[]>([]);
  const [minimizedChats, setMinimizedChats] = useState<Record<string, boolean>>({});

  const openChat = (conversation: Conversation) => {
    setActiveChats((prev) => {
      const exists = prev.find((chat) => chat.id === conversation.id);
      if (exists) {
        // If exists and minimized, unminimize it
        if (minimizedChats[conversation.id]) {
          setMinimizedChats((prevMin) => ({ ...prevMin, [conversation.id]: false }));
        }
        return prev;
      }

      const newChats = [...prev, conversation];
      // Keep maximum 3 chats open
      if (newChats.length > 3) {
        // Remove the oldest chat (index 0)
        return newChats.slice(newChats.length - 3);
      }
      return newChats;
    });

    // Ensure it's not minimized when opening
    setMinimizedChats((prevMin) => ({ ...prevMin, [conversation.id]: false }));
  };

  const closeChat = (conversationId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat.id !== conversationId));
    setMinimizedChats((prevMin) => {
      const newMin = { ...prevMin };
      delete newMin[conversationId];
      return newMin;
    });
  };

  const toggleMinimize = (conversationId: string) => {
    setMinimizedChats((prev) => ({
      ...prev,
      [conversationId]: !prev[conversationId],
    }));
  };

  return (
    <MiniChatContext.Provider
      value={{
        activeChats,
        minimizedChats,
        openChat,
        closeChat,
        toggleMinimize,
      }}
    >
      {children}
    </MiniChatContext.Provider>
  );
};

export const useMiniChat = () => {
  const context = useContext(MiniChatContext);
  if (context === undefined) {
    throw new Error('useMiniChat must be used within a MiniChatProvider');
  }
  return context;
};
