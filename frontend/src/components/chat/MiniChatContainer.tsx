import React from 'react';
import { useMiniChat } from '../../contexts/MiniChatContext';
import { MiniChatWindow } from './MiniChatWindow';
import './MiniChat.css';

export const MiniChatContainer: React.FC = () => {
  const { activeChats } = useMiniChat();

  if (activeChats.length === 0) return null;

  return (
    <div className="mini-chat-container">
      {activeChats.map((chat) => (
        <MiniChatWindow key={chat.id} conversation={chat} />
      ))}
    </div>
  );
};
