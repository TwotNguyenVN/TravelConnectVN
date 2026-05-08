import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import chatService from '../../../services/chatService';
import type { Conversation } from '../../../services/chatService';
import { useMiniChat } from '../../../contexts/MiniChatContext';
import { DEFAULT_AVATAR } from '../../../constants/images';

interface ChatPopoverProps {
  onClose: () => void;
}

const isUserOnline = (lastSeenAt?: string | null) => {
  if (!lastSeenAt) return false;
  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
  return diffInMinutes < 5; // Online if active in last 5 minutes
};

export const ChatPopover: React.FC<ChatPopoverProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'group'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { openChat } = useMiniChat();
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await chatService.getConversations();
        if (res.success && res.data) {
          setConversations(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleOpenChat = (conv: Conversation) => {
    openChat(conv);
    onClose();
  };

  const filteredConversations = conversations.filter(conv => {
    // Tab filter
    if (activeTab === 'unread' && !conv.hasUnread) return false;
    if (activeTab === 'group' && conv.conversationType !== 'group_companion') return false;
    
    // Search filter
    if (searchTerm) {
      const otherParticipant = conv.participants.find(p => !p.isOwner) || conv.participants[0];
      const title = (conv.title || otherParticipant?.fullName || '').toLowerCase();
      return title.includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: '64px', // Below header
        right: 0,
        bottom: 0,
        width: '360px',
        backgroundColor: 'var(--tc-bg-default)',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        borderLeft: '1px solid var(--tc-border)',
        zIndex: 10002, // Ensure it's above everything including mini-chats
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--tc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Đoạn chat</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              navigate('/user/messages');
              onClose();
            }}
            style={{ 
              border: 'none', 
              background: 'var(--tc-bg-muted)', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tc-text-primary)'
            }}
            title="Xem toàn bộ tin nhắn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div style={{ padding: '8px 16px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm trên TravelConnectVN" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px 8px 36px', 
              borderRadius: '20px', 
              border: '1px solid var(--tc-border)', 
              backgroundColor: 'var(--tc-bg-muted)',
              fontSize: '0.9rem',
              outline: 'none'
            }} 
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--tc-text-secondary)' }}>🔍</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600 }}>
        <span 
          onClick={() => setActiveTab('all')}
          style={{ 
            color: activeTab === 'all' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', 
            backgroundColor: activeTab === 'all' ? 'var(--tc-primary-light)' : 'transparent', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Tất cả
        </span>
        <span 
          onClick={() => setActiveTab('unread')}
          style={{ 
            color: activeTab === 'unread' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', 
            backgroundColor: activeTab === 'unread' ? 'var(--tc-primary-light)' : 'transparent', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Chưa đọc
        </span>
        <span 
          onClick={() => setActiveTab('group')}
          style={{ 
            color: activeTab === 'group' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', 
            backgroundColor: activeTab === 'group' ? 'var(--tc-primary-light)' : 'transparent', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Nhóm
        </span>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Đang tải...</div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
            {searchTerm ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có tin nhắn nào'}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => !p.isOwner) || conv.participants[0];
            const title = conv.title || otherParticipant?.fullName || 'Cuộc trò chuyện';
            const avatar = conv.conversationType === 'group_companion' 
              ? conv.companionPost?.coverUrl || DEFAULT_AVATAR 
              : otherParticipant?.avatarUrl || DEFAULT_AVATAR;
            
            const isOnline = conv.conversationType === 'direct' && isUserOnline(otherParticipant?.lastSeenAt);
            
            return (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  gap: '12px',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--tc-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={avatar} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {conv.conversationType === 'direct' && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '1px', 
                      right: '1px', 
                      width: '14px', 
                      height: '14px', 
                      backgroundColor: isOnline ? '#31a24c' : '#9ca3af', 
                      borderRadius: '50%', 
                      border: '2px solid var(--tc-bg-default)',
                      zIndex: 2
                    }}></div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: conv.hasUnread ? 700 : 500, color: 'var(--tc-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: conv.hasUnread ? 'var(--tc-text-primary)' : 'var(--tc-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', gap: '4px', fontWeight: conv.hasUnread ? 600 : 400 }}>
                    {conv.lastMessage ? (
                      <>
                        <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.lastMessage.senderUserId === otherParticipant?.userId ? '' : 'Bạn: '}{conv.lastMessage.content}
                        </span>
                        <span>·</span>
                        <span>{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
                      </>
                    ) : 'Chưa có tin nhắn'}
                  </div>
                </div>
                {conv.hasUnread && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--tc-primary)' }} />
                )}
              </div>
            );
          })
        )}
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid var(--tc-border)', textAlign: 'center' }}>
        <a href="/user/messages" style={{ color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
          Xem tất cả trong Messenger
        </a>
      </div>
    </div>
  );
};
