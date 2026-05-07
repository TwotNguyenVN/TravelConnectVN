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
        position: 'absolute',
        top: '100%',
        right: '-10px',
        marginTop: '12px',
        width: '360px',
        backgroundColor: 'var(--tc-bg-default)',
        borderRadius: '8px',
        boxShadow: 'var(--tc-shadow-lg)',
        border: '1px solid var(--tc-border)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '480px',
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--tc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Đoạn chat</h3>
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
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  gap: '12px',
                  backgroundColor: conv.hasUnread ? 'var(--tc-bg-muted)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--tc-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = conv.hasUnread ? 'var(--tc-bg-muted)' : 'transparent')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={avatar} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: conv.hasUnread ? 600 : 500, color: 'var(--tc-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: conv.hasUnread ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', gap: '4px' }}>
                    {conv.lastMessage ? (
                      <>
                        <span>{conv.lastMessage.senderUserId === otherParticipant?.userId ? '' : 'Bạn: '}{conv.lastMessage.content}</span>
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
        <a href="/user/messages" style={{ color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
          Xem tất cả trong Messenger
        </a>
      </div>
    </div>
  );
};
