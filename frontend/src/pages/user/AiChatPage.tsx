import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import aiChatService, { type AiMessage, type AiSession } from '../../services/aiChatService';
import { Button, LoadingBlock } from '../../components/common';
import './AiChatPage.css';

const AiChatPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [_loadingMessages, setLoadingMessages] = useState(false);
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
  }, [messages]);

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
      sessionId: sessionId!,
      senderType: 'user',
      content: userMessage,
      modelName: null,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await aiChatService.sendMessage(sessionId!, userMessage);
      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data!]);
      }
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-sidebar">
        <div className="ai-sidebar-header">
          <h3>Trợ lý Gemini AI</h3>
          <Button variant="outline" size="small" onClick={handleCreateSession}>
            <i className="bi bi-plus-lg"></i> Mới
          </Button>
        </div>
        <div className="ai-sessions-list">
          {loadingSessions ? (
            <div style={{ padding: '20px', textAlign: 'center' }}><LoadingBlock /></div>
          ) : sessions.length === 0 ? (
            <div className="no-sessions">Chưa có phiên chat nào</div>
          ) : (
            sessions.map(s => (
              <div 
                key={s.id} 
                className={`ai-session-item ${currentSessionId === s.id ? 'active' : ''}`}
                onClick={() => setCurrentSessionId(s.id)}
              >
                <i className="bi bi-chat-left-text"></i>
                <div className="session-info">
                  <span className="session-date">{new Date(s.startedAt).toLocaleDateString('vi-VN')}</span>
                  <span className="session-preview">Phiên hội thoại {s.id.substring(0, 4)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="ai-main-chat">
        <div className="ai-messages-area">
          {messages.length === 0 ? (
            <div className="ai-welcome">
              <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" alt="Welcome" className="welcome-img" />
              <h3>Chào {profile?.full_name || 'bạn'}!</h3>
              <p>Tôi là trợ lý AI được tích hợp Gemini 1.5. Tôi có thể giúp bạn tìm tour, gợi ý điểm đến hoặc trả lời các thắc mắc về du lịch. Bạn muốn đi đâu hôm nay?</p>
              <div className="quick-suggestions">
                <button onClick={() => { setInputText('Gợi ý cho tôi một số tour biển nổi bật'); }}>Tour biển nổi bật</button>
                <button onClick={() => { setInputText('Tư vấn cho tôi tour đi Đà Lạt 3 ngày 2 đêm'); }}>Tư vấn đi Đà Lạt</button>
                <button onClick={() => { setInputText('Lịch trình đi Hà Nội tự túc cho người mới'); }}>Hành trình Hà Nội</button>
              </div>
            </div>
          ) : (
            messages.map(m => (
              <div key={m.id} className={`message-wrapper ${m.senderType}`}>
                <div className="message-avatar">
                  {m.senderType === 'user' ? (profile?.full_name?.charAt(0) || 'U') : 'AI'}
                </div>
                <div className="message-bubble">
                  {m.content}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="message-wrapper bot">
              <div className="message-avatar">AI</div>
              <div className="message-bubble loading">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Nhập câu hỏi của bạn..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || sending}>
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatPage;
