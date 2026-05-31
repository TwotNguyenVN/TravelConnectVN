import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import aiChatService, { type AiMessage, type AiSession } from '../../services/aiChatService';
import tourRequestService from '../../services/tourRequestService';
import { Button, LoadingBlock } from '../../components/common';
import { DEFAULT_AVATAR } from '../../constants/images';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import './AiChatPage.css';

// Helper to replace <br> tags with actual JSX <br /> elements in rendered Markdown nodes
const replaceBr = (node: any): any => {
  if (typeof node === 'string') {
    if (/<br\s*\/?>/gi.test(node)) {
      const parts = node.split(/<br\s*\/?>/gi);
      return parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {part}
        </React.Fragment>
      ));
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((child, index) => <React.Fragment key={index}>{replaceBr(child)}</React.Fragment>);
  }
  if (node && node.props && node.props.children) {
    return React.cloneElement(node, {
      ...node.props,
      children: replaceBr(node.props.children)
    });
  }
  return node;
};

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
  
  // Custom states for interactive features
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [upcomingTour, setUpcomingTour] = useState<any>(null);
  
  // States and refs for message editing and aborting
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingIntervalRef = useRef<any>(null);
  const isCreatingSessionRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSessions();
    
    const fetchUpcomingTour = async () => {
      try {
        const res = await tourRequestService.getMyRequests({ limit: 20 });
        if (res.success && res.data?.data) {
          const tours = res.data.data;
          const upcoming = tours.find((t: any) => 
            ['paid', 'approved'].includes(t.status) && 
            new Date(t.startDate).getTime() > Date.now() - 24 * 60 * 60 * 1000
          );
          
          if (upcoming) {
            setUpcomingTour(upcoming);
          } else {
            setUpcomingTour(null);
          }
        }
      } catch (error) {
        console.error('Error fetching upcoming tour for AI assistant:', error);
      }
    };

    if (user) {
      fetchUpcomingTour();
    }

    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);
    };
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        setSending(false);
      }
      if (isCreatingSessionRef.current) {
        isCreatingSessionRef.current = false;
      } else {
        fetchMessages(currentSessionId);
      }
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Auto-resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const isNewChat = currentSessionId === null || (messages.length === 0 && !loadingMessages);

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



  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa hội thoại này không?')) return;
    
    try {
      const res = await aiChatService.deleteSession(sessionId);
      if (res.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        toast.success('Đã xóa hội thoại');
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
        }
      }
    } catch (error) {
      toast.error('Không thể xóa hội thoại');
    }
  };

  const handleStartEditSession = (e: React.MouseEvent, session: AiSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.context?.title || `Hội thoại ${session.id.substring(0, 4)}`);
  };

  const handleSaveSessionTitle = async (sessionId: string) => {
    if (!editTitleText.trim()) {
      setEditingSessionId(null);
      return;
    }

    try {
      const session = sessions.find(s => s.id === sessionId);
      const updatedContext = { ...(session?.context || {}), title: editTitleText.trim() };
      
      const res = await aiChatService.updateSessionContext(sessionId, updatedContext);
      if (res.success) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, context: updatedContext } : s));
        setEditingSessionId(null);
        toast.success('Đã cập nhật tiêu đề hội thoại');
      }
    } catch (error) {
      toast.error('Không thể cập nhật tiêu đề');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, directText?: string, isRegenerate = false) => {
    if (e) e.preventDefault();
    const textToSend = directText || inputText;
    if (!textToSend.trim() || (sending && !isRegenerate)) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      isCreatingSessionRef.current = true;
      const res = await aiChatService.createSession();
      if (res.success && res.data) {
        sessionId = res.data.id;
        setSessions([res.data, ...sessions]);
        setCurrentSessionId(sessionId);
      } else {
        isCreatingSessionRef.current = false;
        toast.error('Không thể khởi tạo phiên chat');
        return;
      }
    }

    const userMessage = textToSend.trim();
    if (!directText) setInputText('');
    setSending(true);

    if (!isRegenerate) {
      // Optimistic update of User Message
      const tempUserMessage: AiMessage = {
        id: `user-${Date.now()}`,
        session_id: sessionId!,
        sender_type: 'user',
        content: userMessage,
        model_name: null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempUserMessage]);
    }

    // Cancel any ongoing request before sending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const res = await aiChatService.sendMessage(sessionId!, userMessage, abortControllerRef.current.signal);
      if (res.success && res.data) {
        const aiMsg = res.data;
        
        // Setup typing-effect simulated stream
        const streamingMsg: AiMessage = {
          ...aiMsg,
          content: '', // Start empty
        };
        setMessages(prev => [...prev, streamingMsg]);

        let currentText = '';
        const fullText = aiMsg.content;
        let index = 0;
        const charPerTick = 3; // Type 3 chars at a time for speed/smoothness

        streamingIntervalRef.current = setInterval(() => {
          if (index < fullText.length) {
            currentText += fullText.substring(index, index + charPerTick);
            setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: currentText } : m));
            index += charPerTick;
          } else {
            if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);
            setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: fullText } : m));
            setSending(false);
            fetchSessions(); // Refresh sidebar to show latest preview
          }
        }, 15);
      }
    } catch (error: any) {
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.message === 'canceled') {
        console.log('Gemini request canceled by user');
      } else {
        toast.error('Lỗi khi gửi tin nhắn');
        setSending(false);
      }
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setSending(false);
    toast.info('Đã dừng phản hồi từ AI');
  };

  const handleStartEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingText(content);
  };

  const handleSaveAndResendMessage = async (messageId: string) => {
    if (!editingText.trim() || sending) return;
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    // Discard all messages in state after this user message
    const updatedMessages = messages.slice(0, msgIndex);
    setMessages(updatedMessages);
    setEditingMessageId(null);

    // Send the edited content as a new query
    handleSendMessage(undefined, editingText);
  };

  const handleCopyToClipboard = (e: React.MouseEvent, messageId: string, content: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      toast.success('Đã sao chép tin nhắn vào bộ nhớ tạm');
      setTimeout(() => setCopiedMessageId(null), 2000);
    }).catch(() => {
      toast.error('Không thể sao chép');
    });
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sending || messages.length < 2) return;
    
    // Find the last user message
    const userMsgs = messages.filter(m => m.sender_type === 'user');
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1];

    // Remove the last AI message from UI before sending
    setMessages(prev => {
      const copy = [...prev];
      if (copy[copy.length - 1].sender_type === 'assistant') {
        copy.pop();
      }
      return copy;
    });

    handleSendMessage(undefined, lastUserMsg.content, true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Gần đây';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Gần đây';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getSessionDisplayTitle = (s: AiSession) => {
    if (s.context?.title) return s.context.title;
    
    if (s.ai_chat_messages && s.ai_chat_messages.length > 0) {
      const content = s.ai_chat_messages[0].content;
      return content.length > 25 ? content.substring(0, 25) + '...' : content;
    }
    
    return `Hội thoại ${s.id.substring(0, 4)}`;
  };

  return (
    <div className="ai-chat-page-wrapper">
      <div className={`ai-chat-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* Sidebar */}
        <aside className="ai-chat-sidebar">
          <div className="sidebar-header">
            <div className="brand">
              <div className="brand-icon">
                <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/Avt_VinaGuide_AI.png" alt="VinaGuide" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
              <span>VinaGuide AI</span>
            </div>
            <button 
              className="new-chat-btn" 
              onClick={() => {
                if (!isNewChat) setCurrentSessionId(null);
              }} 
              title="Cuộc trò chuyện mới"
              disabled={isNewChat}
              style={{ opacity: isNewChat ? 0.5 : 1, cursor: isNewChat ? 'not-allowed' : 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
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
                      {editingSessionId === s.id ? (
                        <input
                          type="text"
                          className="session-title-input"
                          value={editTitleText}
                          onChange={(e) => setEditTitleText(e.target.value)}
                          onBlur={() => handleSaveSessionTitle(s.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveSessionTitle(s.id);
                            if (e.key === 'Escape') setEditingSessionId(null);
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="session-title" onDoubleClick={(e) => handleStartEditSession(e, s)}>
                          {getSessionDisplayTitle(s)}
                        </span>
                      )}
                      <span className="session-meta">{formatDate(s.created_at || s.started_at)}</span>
                    </div>
                    
                    <div className="session-actions">
                      <button 
                        className="session-action-btn edit-btn"
                        onClick={(e) => handleStartEditSession(e, s)}
                        title="Đổi tên"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button 
                        className="session-action-btn delete-btn"
                        onClick={(e) => handleDeleteSession(e, s.id)}
                        title="Xóa cuộc trò chuyện"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
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
            <div className="header-left">
              <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
              </button>
              <div className="header-title">
                <h4>VinaGuide AI</h4>
                <span className="model-badge">Trợ lý Du lịch thông minh</span>
              </div>
            </div>
            <div className="header-actions">
              {messages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleRegenerate} 
                  disabled={sending || messages.length < 2}
                  className="regenerate-btn-header"
                >
                  <i className="fa-solid fa-rotate-right me-1"></i> Làm lại câu cuối
                </Button>
              )}
              <Button 
                variant="outline" 
                size="small" 
                onClick={() => setCurrentSessionId(null)}
                disabled={isNewChat}
              >
                Hội thoại mới
              </Button>
            </div>
          </header>

          <div className="chat-content">
            {messages.length === 0 && !loadingMessages ? (
              <div className="welcome-hero">
                <div className="hero-visual">
                  <div className="gemini-logo-wrapper">
                    <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/Avt_VinaGuide_AI.png" alt="VinaGuide AI" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    <div className="pulse-ring"></div>
                  </div>
                </div>
                <h2>Xin chào, {profile?.full_name || 'bạn'}! 👋</h2>
                <p>Tôi là <strong>VinaGuide AI</strong> - trợ lý du lịch thông minh của TravelConnectVN. Hãy cho tôi biết nhu cầu của bạn, tôi sẽ lên lịch trình, đề xuất các tour tuyệt vời hoặc tìm kiếm bạn đồng hành hoàn hảo cho bạn!</p>
                
                {upcomingTour && (
                  <div className="tc-ai-context-card">
                    <div className="tc-context-badge">✈️ CHUYẾN ĐI CỦA BẠN</div>
                    <h3>{upcomingTour.tourTitle}</h3>
                    <p>Khởi hành: <strong>{new Date(upcomingTour.startDate).toLocaleDateString('vi-VN')}</strong> | Hướng dẫn viên: <strong>{upcomingTour.guideName || 'Đối tác'}</strong></p>
                    <div className="tc-context-actions">
                      <button 
                        type="button"
                        className="tc-context-btn"
                        onClick={() => handleSendMessage(undefined, `Tôi có chuyến đi sắp tới '${upcomingTour.tourTitle}' khởi hành vào ngày ${new Date(upcomingTour.startDate).toLocaleDateString('vi-VN')}. Hãy gợi ý chi tiết danh sách hành lý cần chuẩn bị và thời tiết tại điểm đến.`)}
                        disabled={sending}
                      >
                        🎒 Chuẩn bị hành lý & Thời tiết
                      </button>
                      <button 
                        type="button"
                        className="tc-context-btn"
                        onClick={() => handleSendMessage(undefined, `Tôi tham gia tour '${upcomingTour.tourTitle}'. Hãy đề xuất các địa điểm ăn uống, quán ngon nổi tiếng xung quanh hành trình tour này.`)}
                        disabled={sending}
                      >
                        🍲 Địa điểm ăn uống quanh đây
                      </button>
                      <button 
                        type="button"
                        className="tc-context-btn"
                        onClick={() => handleSendMessage(undefined, `Tôi sẽ đi tour '${upcomingTour.tourTitle}'. Hãy gợi ý các hoạt động vui chơi giải trí, trải nghiệm thú vị ngoài giờ hoặc địa điểm check-in độc đáo.`)}
                        disabled={sending}
                      >
                        📸 Hoạt động tự do & Check-in
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="suggestion-grid">
                  {[
                    { label: '🏖️ Khám phá Tour biển', text: 'Gợi ý cho tôi một số tour du lịch biển đảo nổi bật tại miền Trung và miền Nam.' },
                    { label: '⛰️ Lịch trình Đà Lạt 3N2Đ', text: 'Thiết kế lịch trình du lịch Đà Lạt tự túc 3 ngày 2 đêm khởi hành từ TP.HCM chi tiết.' },
                    { label: '🏮 Cẩm nang Hội An', text: 'Tóm tắt các điểm check-in hấp dẫn, món ăn ngon và hoạt động về đêm tại phố cổ Hội An.' },
                    { label: '🍲 Bản đồ ăn uống Hà Nội', text: 'Liệt kê danh sách các món ăn đặc sản không thể bỏ lỡ tại Hà Nội kèm địa chỉ nổi tiếng.' }
                  ].map((item, idx) => (
                    <button key={idx} className="suggestion-pill" onClick={() => {
                      setInputText(item.text);
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                      }
                    }}>
                      <div className="suggestion-pill-content">
                        <strong>{item.label}</strong>
                        <span>{item.text.substring(0, 50)}...</span>
                      </div>
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
                    {messages.map((m, idx) => (
                      <div key={m.id} className={`chat-message ${m.sender_type}`}>
                        <div className="message-container">
                          <div className="avatar-circle">
                            {m.sender_type === 'user' ? (
                              <img src={profile?.avatar_url || DEFAULT_AVATAR} alt="U" />
                            ) : (
                              <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/Avt_VinaGuide_AI.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                          </div>
                          <div className="message-content-wrapper">
                            <div className={`message-bubble ${editingMessageId === m.id ? 'editing' : ''}`}>
                              {editingMessageId === m.id ? (
                                <div className="message-edit-container">
                                  <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="message-edit-textarea"
                                    rows={Math.max(2, editingText.split('\n').length)}
                                    autoFocus
                                  />
                                  <div className="message-edit-actions">
                                    <button 
                                      type="button" 
                                      className="message-edit-btn cancel" 
                                      onClick={() => setEditingMessageId(null)}
                                    >
                                      Hủy bỏ
                                    </button>
                                    <button 
                                      type="button" 
                                      className="message-edit-btn submit" 
                                      onClick={() => handleSaveAndResendMessage(m.id)}
                                      disabled={!editingText.trim()}
                                    >
                                      Gửi
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="markdown-body">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      td: ({ children }) => <td>{replaceBr(children)}</td>,
                                      th: ({ children }) => <th>{replaceBr(children)}</th>,
                                      p: ({ children }) => <p>{replaceBr(children)}</p>,
                                      li: ({ children }) => <li>{replaceBr(children)}</li>,
                                      span: ({ children }) => <span>{replaceBr(children)}</span>,
                                    }}
                                  >
                                    {m.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                              
                              <div className="message-bubble-actions">
                                <button 
                                  className="bubble-action-btn"
                                  onClick={(e) => handleCopyToClipboard(e, m.id, m.content)}
                                  title="Sao chép"
                                >
                                  <i className={`fa-solid ${copiedMessageId === m.id ? 'fa-check text-success' : 'fa-copy'}`}></i>
                                </button>
                                {m.sender_type === 'user' && !sending && editingMessageId !== m.id && (
                                  <button 
                                    className="bubble-action-btn"
                                    onClick={() => handleStartEditMessage(m.id, m.content)}
                                    title="Chỉnh sửa tin nhắn"
                                  >
                                    <i className="fa-solid fa-pen"></i>
                                  </button>
                                )}
                                {m.sender_type === 'assistant' && idx === messages.length - 1 && (
                                  <button 
                                    className="bubble-action-btn"
                                    onClick={handleRegenerate}
                                    disabled={sending}
                                    title="Thử lại câu hỏi này"
                                  >
                                    <i className="fa-solid fa-rotate-right"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                            <span className="message-time">
                              {new Date(m.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {sending && messages.length > 0 && messages[messages.length - 1].sender_type === 'user' && (
                      <div className="chat-message assistant typing">
                        <div className="message-container">
                          <div className="avatar-circle">
                            <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/Avt_VinaGuide_AI.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                ref={textareaRef}
                rows={1}
                placeholder="Nhập câu hỏi của bạn tại đây... (Nhấn Enter để gửi, Shift + Enter để xuống dòng)" 
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
              <button 
                type={sending ? "button" : "submit"} 
                className={`send-circle-btn ${sending ? 'stop-btn' : ''}`}
                onClick={sending ? handleStopGeneration : undefined}
                disabled={!sending && !inputText.trim()}
              >
                {sending ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="stop-icon">
                    <rect width="12" height="12" x="2" y="2" rx="1" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                  </svg>
                )}
              </button>
            </form>
            <p className="disclaimer">AI có thể đưa ra thông tin không chính xác về địa điểm hoặc giá tour. Hãy đối chiếu các dữ liệu quan trọng.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AiChatPage;
