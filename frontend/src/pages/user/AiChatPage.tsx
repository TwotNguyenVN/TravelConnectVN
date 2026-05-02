import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import aiChatService, { type AiMessage, type AiSession } from '../../services/aiChatService';
import { Button, LoadingBlock } from '../../components/common';
import { DEFAULT_AVATAR } from '../../constants/images';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AiChatPage.css';

const AiChatPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      setLoadingSessions(true);
      const res = await aiChatService.getSessions();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      setLoadingMessages(true);
      const res = await aiChatService.getMessages(sessionId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await aiChatService.createSession();
      if (res.success && res.data) {
        setSessions([res.data, ...sessions]);
        setCurrentSessionId(res.data.id);
      }
    } catch (error) {
      toast.error('Không thể tạo phiên chat mới');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      const res = await aiChatService.createSession();
      if (res.success && res.data) {
        sessionId = res.data.id;
        setSessions([res.data, ...sessions]);
        setCurrentSessionId(sessionId);
      } else {
        toast.error('Không thể khởi tạo phiên chat');
        return;
      }
    }

    const userMessage = inputText.trim();
    setInputText('');
    setSending(true);

    // Optimistic update
    const tempMessage: AiMessage = {
      id: Date.now().toString(),
      session_id: sessionId!,
      sender_type: 'user',
      content: userMessage,
      model_name: null,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await aiChatService.sendMessage(sessionId!, userMessage);
      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data!]);
        // Cập nhật lại danh sách session để có preview mới nhất
        fetchSessions();
      }
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Gần đây';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Gần đây';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="ai-chat-page-wrapper">
      <div className="ai-chat-layout">
        {/* Sidebar */}
        <aside className="ai-chat-sidebar">
          <div className="sidebar-header">
            <div className="brand">
              <div className="brand-icon">✨</div>
              <span>Travel Assistant</span>
            </div>
            <button className="new-chat-btn" onClick={handleCreateSession}>
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>

          <div className="sidebar-content">
            <div className="session-group">
              <label>Lịch sử hội thoại</label>
              {loadingSessions ? (
                <div className="sidebar-loading"><div className="spinner-mini"></div></div>
              ) : sessions.length === 0 ? (
                <p className="empty-state">Chưa có hội thoại nào</p>
              ) : (
                sessions.map(s => (
                  <div 
                    key={s.id} 
                    className={`session-card ${currentSessionId === s.id ? 'active' : ''}`}
                    onClick={() => setCurrentSessionId(s.id)}
                  >
                    <div className="session-icon">💬</div>
                    <div className="session-details">
                      <span className="session-title">
                        {s.ai_chat_messages && s.ai_chat_messages.length > 0 
                          ? (s.ai_chat_messages[0].content.length > 35 
                              ? s.ai_chat_messages[0].content.substring(0, 35) + '...' 
                              : s.ai_chat_messages[0].content)
                          : `Hội thoại ${s.id.substring(0, 4)}`}
                      </span>
                      <span className="session-meta">{formatDate(s.created_at || s.started_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-mini-profile">
              <img src={profile?.avatar_url || DEFAULT_AVATAR} alt="Me" />
              <div className="mini-info">
                <span className="name">{profile?.full_name || 'Người dùng'}</span>
                <span className="status">Trực tuyến</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="ai-chat-main">
          <header className="chat-header">
            <div className="header-title">
              <h4>Gemini 1.5 Pro</h4>
              <span className="model-badge">AI Assistant</span>
            </div>
            <div className="header-actions">
              <Button variant="outline" size="small" onClick={() => setCurrentSessionId(null)}>
                Làm mới
              </Button>
            </div>
          </header>

          <div className="chat-content">
            {messages.length === 0 && !loadingMessages ? (
              <div className="welcome-hero">
                <div className="hero-visual">
                  <div className="gemini-logo-wrapper">
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" alt="Gemini" />
                    <div className="pulse-ring"></div>
                  </div>
                </div>
                <h2>Xin chào, {profile?.full_name || 'bạn'}! 👋</h2>
                <p>Tôi là trợ lý du lịch AI. Tôi có thể giúp bạn lên lịch trình, tìm điểm đến hoặc giải đáp bất kỳ thắc mắc nào về chuyến đi của bạn.</p>
                
                <div className="suggestion-grid">
                  {[
                    { label: '🏖️ Tour biển nổi bật', text: 'Gợi ý cho tôi một số tour biển nổi bật tại Việt Nam' },
                    { label: '⛰️ Tư vấn đi Đà Lạt', text: 'Lập cho tôi lịch trình đi Đà Lạt 3 ngày 2 đêm từ TP.HCM' },
                    { label: '🏮 Khám phá Hội An', text: 'Chơi gì ở Hội An buổi tối? Gợi ý các điểm check-in đẹp' },
                    { label: '🍲 Đặc sản Hà Nội', text: 'Danh sách các món ăn phải thử khi đến Hà Nội' }
                  ].map((item, idx) => (
                    <button key={idx} className="suggestion-pill" onClick={() => setInputText(item.text)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="messages-scroll">
                {loadingMessages ? (
                  <div className="chat-loading"><LoadingBlock /></div>
                ) : (
                  <>
                    {messages.map(m => (
                      <div key={m.id} className={`chat-message ${m.sender_type}`}>
                        <div className="message-container">
                          <div className="avatar-circle">
                            {m.sender_type === 'user' ? (
                              <img src={profile?.avatar_url || DEFAULT_AVATAR} alt="U" />
                            ) : (
                              <span className="ai-icon">✨</span>
                            )}
                          </div>
                          <div className="message-content-wrapper">
                            <div className="message-bubble">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {m.content}
                              </ReactMarkdown>
                            </div>
                            <span className="message-time">
                              {new Date(m.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {sending && (
                      <div className="chat-message assistant typing">
                        <div className="message-container">
                          <div className="avatar-circle">
                            <span className="ai-icon">✨</span>
                          </div>
                          <div className="message-content-wrapper">
                            <div className="message-bubble">
                              <div className="typing-indicator">
                                <span></span><span></span><span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <footer className="chat-footer">
            <form className="input-container" onSubmit={handleSendMessage}>
              <textarea 
                rows={1}
                placeholder="Nhập câu hỏi của bạn tại đây..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
              />
              <button type="submit" className="send-circle-btn" disabled={!inputText.trim() || sending}>
                <i className="bi bi-arrow-up-short"></i>
              </button>
            </form>
            <p className="disclaimer">AI có thể đưa ra thông tin không chính xác. Hãy kiểm tra lại các thông tin quan trọng.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AiChatPage;
