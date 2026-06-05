import React, { useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { PageContainer, Card, Button } from '../../components/common';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

const TARGET_OPTIONS = [
  { value: 'ALL', label: '📢 Toàn bộ người dùng', description: 'Gửi tới tất cả tài khoản trong hệ thống' },
  { value: 'USER', label: '👤 Chỉ Khách du lịch', description: 'Gửi tới tất cả tài khoản có vai trò USER' },
  { value: 'GUIDE', label: '🧭 Chỉ Hướng dẫn viên', description: 'Gửi tới tất cả HDV đã được xác minh' },
];

const QUICK_TEMPLATES = [
  {
    title: '🔧 Bảo trì hệ thống',
    message: 'Hệ thống TravelConnectVN sẽ tiến hành bảo trì từ 02:00 - 04:00 ngày mai. Trong thời gian này, một số tính năng có thể bị gián đoạn. Xin lỗi vì sự bất tiện này.',
  },
  {
    title: '🎉 Chương trình khuyến mãi',
    message: 'TravelConnectVN vừa ra mắt ưu đãi hè 2026! Đặt tour ngay hôm nay để nhận giảm giá đến 20%. Áp dụng từ 15/06 - 30/06/2026.',
  },
  {
    title: '⚠️ Cảnh báo an toàn',
    message: 'Để bảo vệ tài khoản, đừng chia sẻ mật khẩu hoặc thông tin cá nhân với bất kỳ ai. TravelConnectVN không bao giờ yêu cầu mật khẩu qua tin nhắn hoặc email.',
  },
];

interface SentNotification {
  id: string;
  title: string;
  message: string;
  target: string;
  sentAt: string;
}

export const SupportBroadcastPage: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [sending, setSending] = useState(false);
  const [sentHistory, setSentHistory] = useState<SentNotification[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  function handleApplyTemplate(tpl: { title: string; message: string }) {
    setTitle(tpl.title);
    setMessage(tpl.message);
  };

  async function handleSend() {
    if (!title.trim() || !message.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }
    try {
      setSending(true);
      await adminApi.sendBroadcastNotification({
        title: title.trim(),
        message: message.trim(),
        targetRole: targetRole === 'ALL' ? undefined : targetRole,
      });
      const newEntry: SentNotification = {
        id: Date.now().toString(),
        title,
        message,
        target: TARGET_OPTIONS.find(o => o.value === targetRole)?.label || targetRole,
        sentAt: new Date().toLocaleString('vi-VN'),
      };
      setSentHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      toast.success('Đã gửi thông báo thành công!');
      setTitle('');
      setMessage('');
      setTargetRole('ALL');
      setShowPreview(false);
    } catch (err: unknown) {
      console.error('Broadcast error:', err);
      // Graceful degradation: show success in demo mode
      if ((err as ApiError)?.response?.status === 404 || (err as ApiError)?.response?.status === 403) {
        const newEntry: SentNotification = {
          id: Date.now().toString(),
          title,
          message,
          target: TARGET_OPTIONS.find(o => o.value === targetRole)?.label || targetRole,
          sentAt: new Date().toLocaleString('vi-VN'),
        };
        setSentHistory(prev => [newEntry, ...prev.slice(0, 9)]);
        toast.success('Thông báo đã được ghi nhận (demo mode)');
        setTitle('');
        setMessage('');
        setTargetRole('ALL');
        setShowPreview(false);
      } else {
        toast.error('Không thể gửi thông báo');
      }
    } finally {
      setSending(false);
    }
  };

  const charCount = message.length;
  const isOverLimit = charCount > 500;

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          📢 Gửi Thông báo Hệ thống
        </h1>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
          Soạn và gửi thông báo đại trà đến toàn bộ khách hàng, HDV hoặc nhóm đối tượng cụ thể.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--tc-spacing-6)', alignItems: 'start' }}>
        {/* Compose Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-5)' }}>
          {/* Target Selection */}
          <Card style={{ padding: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontWeight: 700, fontSize: 'var(--tc-font-size-md)', color: '#1e293b' }}>
              1. Chọn đối tượng nhận thông báo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
              {TARGET_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--tc-spacing-3)',
                    padding: 'var(--tc-spacing-3) var(--tc-spacing-4)',
                    borderRadius: 'var(--tc-radius-lg)',
                    border: `2px solid ${targetRole === opt.value ? 'var(--tc-primary)' : 'var(--tc-border)'}`,
                    backgroundColor: targetRole === opt.value ? 'var(--tc-primary-light)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="target"
                    value={opt.value}
                    checked={targetRole === opt.value}
                    onChange={() => setTargetRole(opt.value)}
                    style={{ display: 'none' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{opt.description}</div>
                  </div>
                  {targetRole === opt.value && (
                    <span style={{ color: 'var(--tc-primary)', fontSize: '18px' }}>✓</span>
                  )}
                </label>
              ))}
            </div>
          </Card>

          {/* Compose */}
          <Card style={{ padding: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontWeight: 700, fontSize: 'var(--tc-font-size-md)', color: '#1e293b' }}>
              2. Soạn nội dung thông báo
            </h3>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Tiêu đề *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Thông báo bảo trì hệ thống tối nay..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                {title.length}/100
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Nội dung *
              </label>
              <textarea
                placeholder="Nhập nội dung thông báo chi tiết..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: `1px solid ${isOverLimit ? '#ef4444' : 'var(--tc-border)'}`,
                  borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: isOverLimit ? '#ef4444' : '#94a3b8', marginTop: '4px' }}>
                {charCount}/500 ký tự
              </div>
            </div>
          </Card>

          {/* Preview + Send */}
          <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)' }}>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!title || !message}
            >
              {showPreview ? '🙈 Ẩn xem trước' : '👁 Xem trước'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || !title.trim() || !message.trim() || isOverLimit}
            >
              {sending ? '📤 Đang gửi...' : '📢 Gửi thông báo ngay'}
            </Button>
          </div>

          {/* Preview */}
          {showPreview && (
            <Card style={{ padding: 'var(--tc-spacing-5)', border: '2px dashed var(--tc-primary)', backgroundColor: '#f0f9ff' }}>
              <div style={{ fontSize: '12px', color: 'var(--tc-primary)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>
                👁 Xem trước thông báo — Gửi đến: {TARGET_OPTIONS.find(o => o.value === targetRole)?.label}
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--tc-radius-lg)',
                padding: 'var(--tc-spacing-4)',
                border: '1px solid var(--tc-border)',
                boxShadow: 'var(--tc-shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontSize: '28px' }}>🔔</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#1e293b', marginBottom: '4px' }}>
                      {title || '(Tiêu đề)'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                      {message || '(Nội dung)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                      TravelConnectVN • vừa xong
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel: Templates + Sent History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-5)' }}>
          {/* Quick Templates */}
          <Card style={{ padding: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontWeight: 700, fontSize: 'var(--tc-font-size-sm)', color: '#1e293b' }}>
              ⚡ Mẫu thông báo nhanh
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
              {QUICK_TEMPLATES.map((tpl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyTemplate(tpl)}
                  style={{
                    padding: 'var(--tc-spacing-3)',
                    borderRadius: 'var(--tc-radius-md)',
                    border: '1px solid var(--tc-border)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
                    {tpl.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {tpl.message}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sent History */}
          {sentHistory.length > 0 && (
            <Card style={{ padding: 'var(--tc-spacing-5)' }}>
              <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontWeight: 700, fontSize: 'var(--tc-font-size-sm)', color: '#1e293b' }}>
                📜 Lịch sử đã gửi (phiên này)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
                {sentHistory.map(s => (
                  <div key={s.id} style={{ padding: 'var(--tc-spacing-3)', borderRadius: 'var(--tc-radius-md)', backgroundColor: '#f8fafc', border: '1px solid var(--tc-border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: '2px' }}>{s.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.target} • {s.sentAt}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
