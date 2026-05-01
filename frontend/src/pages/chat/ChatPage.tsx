import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useLocation, useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';
import type { Conversation, Message } from '../../services/chatService';
import './ChatPage.css';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } else if (days < 7) {
    return date.toLocaleDateString('vi-VN', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
};

const isUserOnline = (lastSeenAt?: string | null) => {
  if (!lastSeenAt) return false;
  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
  return diffInMinutes < 5; // Online if active in last 5 minutes
};

const getLastSeenText = (lastSeenAt?: string | null) => {
  if (!lastSeenAt) return 'Ngoại tuyến';
  if (isUserOnline(lastSeenAt)) return 'Đang hoạt động';
  
  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `Hoạt động ${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hoạt động ${diffInHours} giờ trước`;
  
  return `Hoạt động ${Math.floor(diffInHours / 24)} ngày trước`;
};

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(location.state?.conversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations().then((convs) => {
      if (location.state?.conversationId) {
        setSelectedConvId(location.state.conversationId);
        // Clean up state so refresh doesn't trigger it again
        navigate(location.pathname, { replace: true, state: {} });
      } else if (convs && convs.length > 0 && !selectedConvId) {
        // Optionally auto-select first conversation
        // setSelectedConvId(convs[0].id);
      }
    });

    // Setup basic polling for conversations
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      // Setup basic polling for messages
      const interval = setInterval(() => {
        fetchMessages(selectedConvId, false);
      }, 5000);
      return () => clearInterval(interval);
      setMessages([]);
    }
  }, [selectedConvId]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const commonEmojis = [
    '😊', '😂', '🥰', '😍', '😒', '😭', '😘', '😩', '😔', '🙏',
    '👍', '🙌', '👏', '🤝', '🔥', '✨', '❤️', '📍', '🚗', '✈️',
    '🌟', '🎉', '👋', '🤝', '💯', '🤔', '😎', '😅', '🙄', '😮'
  ];

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = conversations.filter(conv => {
        const isGroup = conv.conversationType === 'group_companion';
        const name = isGroup ? conv.title : conv.participants[0]?.fullName;
        return name?.toLowerCase().includes(lowerSearch);
      });
      setFilteredConversations(filtered);
    }
  }, [searchTerm, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setLoadingConv(true);
    try {
      const res = await chatService.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        return res.data;
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách trò chuyện:', error);
    } finally {
      if (showLoading) setLoadingConv(false);
    }
    return null;
  };

  const fetchMessages = async (convId: string, showLoading = true) => {
    if (showLoading) setLoadingMessages(true);
    try {
      const res = await chatService.getMessages(convId, 1, 50);
      if (res.success && res.data) {
        setMessages(res.data.items);
        
        // Cập nhật trạng thái đã đọc
        setConversations(prev => {
          const newConvs = [...prev];
          const idx = newConvs.findIndex(c => c.id === convId);
          if (idx !== -1 && newConvs[idx].hasUnread) {
            // Đánh dấu đã đọc trên server (fire and forget)
            chatService.markAsRead(convId).catch(console.error);
            // Cập nhật local state
            newConvs[idx] = { ...newConvs[idx], hasUnread: false };
          }
          return newConvs;
        });
      }
    } catch (error) {
      console.error('Lỗi lấy tin nhắn:', error);
    } finally {
      if (showLoading) setLoadingMessages(false);
    }
  };
  
  const fetchParticipants = async (convId: string) => {
    setLoadingParticipants(true);
    try {
      const res = await chatService.getParticipants(convId);
      if (res.success && res.data) {
        setParticipants(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách thành viên:', error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleToggleDetails = () => {
    if (!showDetails && selectedConvId) {
      fetchParticipants(selectedConvId);
    }
    setShowDetails(!showDetails);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;

    const currentText = inputText;
    setInputText('');

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConvId,
      content: currentText,
      messageType: 'text',
      attachmentUrl: null,
      sentAt: new Date().toISOString(),
      editedAt: null,
      isOwn: true,
      sender: {
        id: user?.id || '',
        fullName: user?.user_metadata?.full_name || 'Tôi',
        avatarUrl: user?.user_metadata?.avatar_url || null,
      }
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await chatService.sendMessage(selectedConvId, currentText);
      if (res.success && res.data) {
        // Có thể để polling hoặc replace temp bằng real message
        fetchMessages(selectedConvId, false);
        fetchConversations(false);
      }
    } catch (error) {
      toast.error('Gửi tin nhắn thất bại');
      // Xóa temp message nếu lỗi
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setInputText(currentText);
    }
  };

  const renderConversationItem = (conv: Conversation) => {
    const isGroup = conv.conversationType === 'group_companion';
    let displayName = conv.title;
    let avatar = '/images/default-group-avatar.png'; // Placeholder fallback
    
    if (!isGroup) {
      const otherUser = conv.participants[0];
      displayName = otherUser?.fullName || 'Người dùng';
      avatar = otherUser?.avatarUrl || '/images/default-avatar.png';
    } else {
      avatar = conv.companionPost?.coverUrl || 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/logo_gr.png';
    }

    return (
      <div 
        key={conv.id} 
        className={`conversation-item ${selectedConvId === conv.id ? 'active' : ''}`}
        onClick={() => setSelectedConvId(conv.id)}
      >
        <div className="conversation-avatar">
          <img src={avatar} alt={displayName || 'Avatar'} onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-avatar.png'; }} />
          {!isGroup && <span className={`status-indicator ${isUserOnline(conv.participants[0]?.lastSeenAt) ? 'status-online' : 'status-offline'}`}></span>}
          {isGroup && <span className="group-badge">Nhóm</span>}
        </div>
        <div className="conversation-info">
          <div className="conversation-header">
            <h4 className="conversation-name text-truncate">{displayName}</h4>
            {conv.lastMessage && (
              <span className="conversation-time">{formatTime(conv.lastMessage.sentAt)}</span>
            )}
          </div>
          <div className="conversation-preview">
            <p className="text-truncate">
              {conv.lastMessage ? (
                <>
                  {conv.lastMessage.senderUserId === user?.id ? 'Bạn: ' : ''}
                  {conv.lastMessage.content}
                </>
              ) : 'Bắt đầu trò chuyện'}
            </p>
            {conv.hasUnread && <div className="unread-count">1</div>}
          </div>
        </div>
      </div>
    );
  };

  const getSelectedConversation = () => {
    return conversations.find(c => c.id === selectedConvId);
  };

  const selectedConv = getSelectedConversation();

  return (
    <div className="chat-page-container">
      {/* Sidebar / List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Tin nhắn</h2>
          <div className="chat-search-wrapper">
            <i className="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm trò chuyện..." 
              className="chat-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="conversation-list">
          {loadingConv && conversations.length === 0 ? (
            <div className="chat-loading">Đang tải...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="chat-empty-state">
              <i className="bi bi-chat-dots empty-icon"></i>
              <p>{searchTerm ? 'Không tìm thấy kết quả' : 'Bạn chưa có cuộc trò chuyện nào.'}</p>
            </div>
          ) : (
            filteredConversations.map(renderConversationItem)
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {!selectedConvId || !selectedConv ? (
          <div className="chat-empty-main">
            <div className="empty-chat-icon-wrapper">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3>Chọn một cuộc trò chuyện</h3>
            <p>Kết nối với hướng dẫn viên hoặc bạn đồng hành của bạn để bắt đầu hành trình!</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-header-left">
                <img 
                  src={selectedConv.conversationType === 'group_companion' 
                    ? selectedConv.companionPost?.coverUrl || 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/logo_gr.png'
                    : selectedConv.participants[0]?.avatarUrl || '/images/default-avatar.png'} 
                  alt="Avatar" 
                  className="chat-header-avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = selectedConv.conversationType === 'group_companion' ? 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/logo_gr.png' : '/images/default-avatar.png'; }}
                />
                <div className="chat-header-info">
                  <h3 
                    className={`chat-header-title ${selectedConv.conversationType !== 'group_companion' && selectedConv.participants[0]?.guideProfileId ? 'clickable' : ''}`}
                    onClick={() => {
                      const guideId = selectedConv.participants[0]?.guideProfileId;
                      if (selectedConv.conversationType !== 'group_companion' && guideId) {
                        navigate(`/guides/${guideId}`);
                      }
                    }}
                  >
                    {selectedConv.conversationType === 'group_companion' ? selectedConv.title : selectedConv.participants[0]?.fullName}
                  </h3>
                  <div className={`chat-header-status ${selectedConv.conversationType !== 'group_companion' && !isUserOnline(selectedConv.participants[0]?.lastSeenAt) ? 'offline' : ''}`}>
                    <span className={selectedConv.conversationType === 'group_companion' || isUserOnline(selectedConv.participants[0]?.lastSeenAt) ? 'status-online' : 'status-offline'} style={{ width: '8px', height: '8px', borderRadius: '50%' }}></span>
                    <span>{selectedConv.conversationType === 'group_companion' ? `${selectedConv.participants.length + 1} thành viên` : getLastSeenText(selectedConv.participants[0]?.lastSeenAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="chat-header-actions">
                <button className="chat-action-btn" title="Cuộc gọi"><i className="fa-solid fa-phone"></i></button>
                <button className="chat-action-btn" title="Video call"><i className="fa-solid fa-video"></i></button>
                <button 
                  className={`chat-action-btn ${showDetails ? 'active' : ''}`} 
                  title="Thông tin"
                  onClick={handleToggleDetails}
                >
                  <i className="fa-solid fa-circle-info"></i>
                </button>
              </div>
            </div>

            <div className="chat-messages-area">
              {loadingMessages && messages.length === 0 ? (
                <div className="chat-loading">Đang tải tin nhắn...</div>
              ) : (
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="chat-empty-state">
                      <p>Chưa có tin nhắn nào. Hãy gửi lời chào!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const showAvatar = !msg.isOwn && (index === 0 || messages[index - 1].sender.id !== msg.sender.id);
                      return (
                        <div key={msg.id} className={`message-wrapper ${msg.isOwn ? 'message-own' : 'message-other'}`}>
                          {!msg.isOwn && (
                            <div className="message-avatar">
                              {showAvatar ? (
                                <img src={msg.sender.avatarUrl || '/images/default-avatar.png'} alt="Avatar" onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-avatar.png'; }} />
                              ) : <div className="avatar-placeholder"></div>}
                            </div>
                          )}
                          <div className="message-content-wrapper">
                            {!msg.isOwn && showAvatar && selectedConv.conversationType === 'group_companion' && (
                              <span className="message-sender-name">{msg.sender.fullName}</span>
                            )}
                            <div className="message-bubble">
                              <p>{msg.content}</p>
                              <span className="message-time">
                                {new Date(msg.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <div className="chat-input-container">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn của bạn..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="chat-input-field"
                  />
                  <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
                    <button 
                      className="chat-action-btn" 
                      style={{ background: 'none', border: 'none' }} 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <i className="fa-regular fa-face-smile"></i>
                    </button>
                    {showEmojiPicker && (
                      <div className="emoji-picker-popover">
                        <div className="emoji-grid">
                          {commonEmojis.map(emoji => (
                            <span 
                              key={emoji} 
                              className="emoji-item"
                              onClick={() => handleEmojiClick(emoji)}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="chat-action-btn" style={{ background: 'none', border: 'none' }} type="button">
                    <i className="fa-solid fa-paperclip"></i>
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="chat-send-btn"
                  disabled={!inputText.trim()}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Details Panel */}
      {showDetails && selectedConv && (
        <div className="chat-details-panel">
          <div className="details-header">
            <h3>Thông tin nhóm</h3>
            <button className="close-details-btn" onClick={() => setShowDetails(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="details-content">
            <div className="details-section">
              <h4>Thành viên ({participants.length})</h4>
              <div className="participants-list">
                {loadingParticipants ? (
                  <div className="participants-loading">Đang tải...</div>
                ) : (
                  participants.map(p => (
                    <div key={p.userId} className="participant-item">
                      <img 
                        src={p.avatarUrl || '/images/default-avatar.png'} 
                        alt={p.fullName} 
                        className="participant-avatar"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-avatar.png'; }}
                      />
                      <div className="participant-info">
                        <div className="participant-name">{p.fullName}</div>
                        <div className="participant-role">
                          {p.isOwner ? 'Chủ nhóm' : 'Thành viên'}
                        </div>
                      </div>
                      {isUserOnline(p.lastSeenAt) && <div className="participant-online-dot"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedConv.companionPost && (
              <div className="details-section mt-4">
                <h4>Bài viết liên quan</h4>
                <div 
                  className="related-post-card"
                  onClick={() => navigate(`/companions/${selectedConv.relatedCompanionPostId}`)}
                >
                  <img src={selectedConv.companionPost.coverUrl || ''} alt="Cover" />
                  <div className="related-post-info">
                    <div className="related-post-title text-truncate">{selectedConv.companionPost.title}</div>
                    <div className="related-post-location"><i className="bi bi-geo-alt"></i> {selectedConv.companionPost.destination}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
