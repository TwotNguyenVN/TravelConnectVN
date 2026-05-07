import React, { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';
import type { Conversation, Message } from '../../services/chatService';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMiniChat } from '../../contexts/MiniChatContext';
import { DEFAULT_AVATAR } from '../../constants/images';

interface MiniChatWindowProps {
  conversation: Conversation;
}

export const MiniChatWindow: React.FC<MiniChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { closeChat, toggleMinimize, minimizedChats } = useMiniChat();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isMinimized = minimizedChats[conversation.id];
  
  const otherParticipant = conversation.participants.find(p => !p.isOwner) || conversation.participants[0];
  const title = conversation.title || otherParticipant?.fullName || 'Cuộc trò chuyện';
  const avatar = conversation.conversationType === 'group_companion' 
    ? conversation.companionPost?.coverUrl || DEFAULT_AVATAR 
    : otherParticipant?.avatarUrl || DEFAULT_AVATAR;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(conversation.id, 1, 50);
        if (res.success && res.data) {
          setMessages(res.data.items.reverse()); // Reverse to get oldest first for chat view
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isMinimized) {
      fetchMessages();
      // Mark as read when opened
      if (conversation.hasUnread) {
        chatService.markAsRead(conversation.id).catch(console.error);
      }
    }
  }, [conversation.id, isMinimized, conversation.hasUnread]);

  // Socket listener
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (data: { conversationId: string, message: Message }) => {
      if (data.conversationId === conversation.id) {
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        
        // Mark as read if not minimized
        if (!isMinimized) {
          chatService.markAsRead(conversation.id).catch(console.error);
        }
      }
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversation.id, user, isMinimized]);

  // Scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const text = inputValue;
    setInputValue('');

    // Optimistic UI
    const optimisticMsg: Message = {
      id: tempId,
      conversationId: conversation.id,
      content: text,
      messageType: 'text',
      attachmentUrl: null,
      sentAt: new Date().toISOString(),
      editedAt: null,
      isOwn: true,
      sender: {
        id: user?.id || '',
        fullName: 'Bạn',
        avatarUrl: null
      }
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await chatService.sendMessage(conversation.id, text);
      if (res.success && res.data) {
        // Replace optimistic msg with real one
        setMessages(prev => prev.map(m => m.id === tempId ? res.data! : m));
      }
    } catch (error) {
      console.error('Failed to send message', error);
      // Remove optimistic message on fail
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`mini-chat-window ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div 
        className="mini-chat-header"
        onClick={() => toggleMinimize(conversation.id)}
      >
        <div className="mini-chat-header-info">
          <div className="mini-chat-avatar">
            <img src={avatar} alt={title} />
            <div className="status-dot"></div>
          </div>
          <div className="mini-chat-title">{title}</div>
        </div>
        <div className="mini-chat-actions">
          <button 
            className="mini-chat-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize(conversation.id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMinimized ? <polyline points="18 15 12 9 6 15"></polyline> : <line x1="5" y1="12" x2="19" y2="12"></line>}
            </svg>
          </button>
          <button 
            className="mini-chat-btn"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(conversation.id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Body & Input (hidden when minimized) */}
      {!isMinimized && (
        <>
          <div className="mini-chat-body">
            {loading ? (
              <div className="mini-chat-loading">Đang tải...</div>
            ) : messages.length === 0 ? (
              <div className="mini-chat-empty">Bắt đầu cuộc trò chuyện!</div>
            ) : (
              <div className="mini-chat-messages">
                {messages.map((msg, index) => {
                  const isLastOwn = msg.isOwn && (index === messages.length - 1 || !messages[index + 1].isOwn);
                  return (
                    <div key={msg.id} className={`message-row ${msg.isOwn ? 'own' : 'other'}`}>
                      {!msg.isOwn && (
                        <div className="message-avatar">
                          <img src={msg.sender?.avatarUrl || DEFAULT_AVATAR} alt="avatar" />
                        </div>
                      )}
                      <div className="message-bubble-wrapper">
                        {!msg.isOwn && <div className="message-sender">{msg.sender?.fullName}</div>}
                        <div className={`message-bubble ${msg.isOwn ? 'own' : 'other'} ${isLastOwn ? 'last-own' : ''}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="mini-chat-footer">
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <div className="input-wrapper">
              <textarea 
                placeholder="Aa"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
            <button 
              className={`icon-btn send-btn ${inputValue.trim() ? 'active' : ''}`}
              onClick={handleSend}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
