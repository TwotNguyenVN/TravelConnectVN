import React, { useEffect, useState, useRef } from 'react';
import chatService from '../../../services/chatService';
import type { Conversation } from '../../../services/chatService';
import { useMiniChat } from '../../../contexts/MiniChatContext';
import { DEFAULT_AVATAR } from '../../../constants/images';

interface ChatPopoverProps {
  onClose: () => void;
}

export const ChatPopover: React.FC<ChatPopoverProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { openChat } = useMiniChat();
  const popoverRef = useRef<HTMLDivElement>(null);

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
        zIndex: 100,
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
          <button style={{ border: 'none', background: 'var(--tc-bg-muted)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>...</button>
          <button style={{ border: 'none', background: 'var(--tc-bg-muted)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>🗖</button>
          <button style={{ border: 'none', background: 'var(--tc-bg-muted)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✎</button>
        </div>
      </div>
      
      <div style={{ padding: '8px 16px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm trên Messenger" 
            style={{ 
              width: '100%', 
              padding: '8px 12px 8px 36px', 
              borderRadius: '20px', 
              border: 'none', 
              backgroundColor: 'var(--tc-bg-muted)',
              fontSize: '0.9rem'
            }} 
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--tc-text-secondary)' }}>🔍</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600 }}>
        <span style={{ color: 'var(--tc-primary)', backgroundColor: 'var(--tc-primary-light)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>Tất cả</span>
        <span style={{ cursor: 'pointer', padding: '6px 12px' }}>Chưa đọc</span>
        <span style={{ cursor: 'pointer', padding: '6px 12px' }}>Nhóm</span>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Đang tải...</div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Chưa có tin nhắn nào</div>
        ) : (
          conversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => !p.isOwner) || conv.participants[0];
            const title = conv.title || otherParticipant?.fullName || 'Cuộc trò chuyện';
            const avatar = conv.conversationType === 'group_companion' 
              ? conv.companionPost?.coverUrl || DEFAULT_AVATAR 
              : otherParticipant?.avatarUrl || DEFAULT_AVATAR;
            
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
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={avatar} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', backgroundColor: '#31a24c', borderRadius: '50%', border: '2px solid var(--tc-bg-default)' }}></div>
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
