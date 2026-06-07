/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { PageContainer, Card, Button, LoadingBlock } from '../../components/common';

interface TourDispute {
  id: string;
  status: 'open' | 'resolved';
  created_at: string;
  reason: string;
  refund_amount: number;
  resolution_note: string | null;
  resolved_at: string | null;
  tour_requests: {
    id: string;
    status: string;
    tours: {
      id: string;
      title: string;
      price: number;
      guide_profiles: {
        users: {
          id: string;
          full_name: string;
          email: string;
        };
      };
    };
    users_tour_requests_user_idTousers: {
      id: string;
      full_name: string;
      email: string;
    };
  };
  raised_by: {
    full_name: string;
    email: string;
  };
  resolved_by?: {
    full_name: string;
  } | null;
}

interface ChatMessage {
  id: string;
  content: string;
  sent_at: string;
  sender_id: string;
  users: {
    full_name: string;
    email: string;
  };
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Đang tranh chấp', color: '#f59e0b', bg: '#fffbeb' },
  resolved: { label: 'Đã giải quyết', color: '#10b981', bg: '#ecfdf5' },
};

export const SupportDisputePage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<TourDispute[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState<TourDispute | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);
  
  // Chat History state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchDisputes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDisputes();
      if (res?.success) {
        setDisputes(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching disputes:', err);
      toast.error('Không thể tải danh sách tranh chấp');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  async function handleOpenDispute(dispute: TourDispute) {
    setSelectedDispute(dispute);
    setResolution(dispute.resolution_note || '');
    setRefundAmount(dispute.refund_amount || 0);
    setShowModal(true);

    // Fetch chat history
    try {
      setChatLoading(true);
      setChatMessages([]);
      const res = await adminApi.getDisputeChatHistory(dispute.id);
      if (res?.success) {
        setChatMessages(res.data || []);
      }
    } catch (err) {
      console.error('Error loading chat transcript:', err);
      toast.error('Không thể tải lịch sử trò chuyện của tour');
    } finally {
      setChatLoading(false);
    }
  };

  async function handleResolve() {
    if (!selectedDispute) return;
    if (!resolution.trim()) {
      toast.error('Vui lòng nhập phán quyết tranh chấp');
      return;
    }
    const maxRefund = selectedDispute.tour_requests.tours.price;
    if (refundAmount < 0 || refundAmount > maxRefund) {
      toast.error(`Số tiền hoàn trả không hợp lệ (Tối đa ${maxRefund.toLocaleString('vi-VN')} VND)`);
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminApi.resolveDispute(selectedDispute.id, {
        resolutionNote: resolution.trim(),
        refundAmount: Number(refundAmount),
      });
      if (res?.success) {
        toast.success('Đã ghi nhận phán quyết giải quyết tranh chấp');
        setShowModal(false);
        fetchDisputes();
      }
    } catch (err) {
      console.error('Resolve dispute error:', err);
      toast.error('Không thể lưu phán quyết tranh chấp');
    } finally {
      setSubmitting(false);
    }
  };

  async function handleCopilotSuggest() {
    if (!selectedDispute) return;
    try {
      setCopilotLoading(true);
      const textToAnalyze = `Khách hàng: ${selectedDispute.tour_requests.users_tour_requests_user_idTousers.full_name}. HDV: ${selectedDispute.tour_requests.tours.guide_profiles.users.full_name}. Lý do khiếu nại: ${selectedDispute.reason}`;
      const res = await adminApi.getCopilotSuggestion(textToAnalyze);
      if (res?.success && res.data?.suggestion) {
        setResolution(res.data.suggestion);
        toast.success('AI đã tạo gợi ý thành công!');
      }
    } catch (err) {
      console.error('Copilot error:', err);
      toast.error('Lỗi khi gọi AI Co-Pilot');
    } finally {
      setCopilotLoading(false);
    }
  }

  const filteredDisputes = disputes.filter(d => {
    const textStr = `${d.tour_requests?.tours?.title} ${d.tour_requests?.users_tour_requests_user_idTousers?.full_name} ${d.tour_requests?.tours?.guide_profiles?.users?.full_name} ${d.reason}`.toLowerCase();
    const matchSearch = search ? textStr.includes(search.toLowerCase()) : true;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <PageContainer><LoadingBlock height={400} /></PageContainer>;

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          ⚖️ Phân Xử & Giải Quyết Tranh Chấp Đặt Tour
        </h1>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
          Tra cứu các khiếu nại, xem lịch sử chat thực tế giữa khách và HDV, đưa ra phán quyết và hoàn tiền.
        </p>
      </div>

      {/* Filters */}
      <Card style={{ padding: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo tên khách, HDV, tên tour, lý do..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '10px 16px',
              border: '1px solid var(--tc-border)',
              borderRadius: 'var(--tc-radius-md)',
              fontSize: 'var(--tc-font-size-sm)',
              outline: 'none',
            }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--tc-border)',
              borderRadius: 'var(--tc-radius-md)',
              fontSize: 'var(--tc-font-size-sm)',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Đang tranh chấp (Open)</option>
            <option value="resolved">Đã giải quyết (Resolved)</option>
          </select>
          <Button variant="outline" onClick={fetchDisputes}>🔄 Làm mới</Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--tc-border)' }}>
                {['Mã tranh chấp', 'Tên Tour / Giá', 'Khách hàng', 'Hướng dẫn viên', 'Lý do khiếu nại', 'Trạng thái', 'Ngày khiếu nại', 'Thao tác'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕊️</div>
                    <div style={{ fontWeight: 600 }}>Không tìm thấy tranh chấp đặt tour nào</div>
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((dispute) => {
                  const s = STATUS_MAP[dispute.status] || { label: dispute.status, color: '#64748b', bg: '#f8fafc' };
                  const tour = dispute.tour_requests?.tours;
                  const guide = tour?.guide_profiles?.users;
                  const customer = dispute.tour_requests?.users_tour_requests_user_idTousers;
                  
                  return (
                    <tr
                      key={dispute.id}
                      style={{ borderBottom: '1px solid var(--tc-border)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                        {dispute.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{tour?.title || 'Tour đã xóa'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Giá: {tour?.price ? `${tour.price.toLocaleString('vi-VN')} VND` : '—'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{customer?.full_name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{customer?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{guide?.full_name || '—'}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{guide?.email || '—'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569', maxWidth: '180px' }}>
                        <span title={dispute.reason} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {dispute.reason}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '999px',
                          backgroundColor: s.bg, color: s.color,
                          fontWeight: 700, fontSize: '11px',
                        }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '12px' }}>
                        {new Date(dispute.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Button
                          variant={dispute.status === 'open' ? 'primary' : 'outline'}
                          size="small"
                          onClick={() => handleOpenDispute(dispute)}
                        >
                          {dispute.status === 'open' ? '⚖️ Phân xử' : '👁 Xem'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resolution & Chat Log Modal */}
      {showModal && selectedDispute && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--tc-spacing-4)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--tc-radius-xl)',
            maxWidth: '1100px',
            width: '100%',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--tc-shadow-xl)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>
                  ⚖️ Chi Tiết Phân Xử Tranh Chấp #{selectedDispute.id.slice(0, 8).toUpperCase()}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Tour: <strong>{selectedDispute.tour_requests.tours.title}</strong>
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Split Screen */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', flex: 1, minHeight: 0 }}>
              {/* Left Column: Dispute Info & Verdict Form */}
              <div style={{
                padding: '24px',
                borderRight: '1px solid var(--tc-border)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {/* Dispute Metadata */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Thông tin các bên liên quan
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div style={{ backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>👤 Khách du lịch (Người mua):</span>
                      <div style={{ fontWeight: 600, marginTop: '2px' }}>
                        {selectedDispute.tour_requests.users_tour_requests_user_idTousers.full_name}
                      </div>
                      <div style={{ opacity: 0.8 }}>{selectedDispute.tour_requests.users_tour_requests_user_idTousers.email}</div>
                    </div>
                    
                    <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <span style={{ fontWeight: 700, color: '#166534' }}>🧭 Hướng dẫn viên (HDV):</span>
                      <div style={{ fontWeight: 600, marginTop: '2px' }}>
                        {selectedDispute.tour_requests.tours.guide_profiles.users.full_name}
                      </div>
                      <div style={{ opacity: 0.8 }}>{selectedDispute.tour_requests.tours.guide_profiles.users.email}</div>
                    </div>
                  </div>
                </div>

                {/* Dispute Details */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Chi tiết khiếu nại
                  </h4>
                  <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid var(--tc-border)', fontSize: '13px', lineHeight: '1.5' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Người gửi đơn: </span>
                      <strong>{selectedDispute.raised_by.full_name}</strong> ({selectedDispute.raised_by.email})
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Lý do khiếu nại:</span>
                      <p style={{ margin: '6px 0 0 0', fontWeight: 600, color: '#1e293b' }}>{selectedDispute.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Verdict Form / Resolved Info */}
                <div style={{ marginTop: 'auto' }}>
                  {selectedDispute.status === 'resolved' ? (
                    <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#166534', fontWeight: 700, fontSize: '14px' }}>
                        ✅ ĐÃ GIẢI QUYẾT TRANH CHẤP
                      </h5>
                      <div style={{ fontSize: '13px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>Phán quyết: <strong>{selectedDispute.resolution_note}</strong></div>
                        <div>Hoàn tiền: <strong style={{ color: '#dc2626' }}>{selectedDispute.refund_amount.toLocaleString('vi-VN')} VND</strong></div>
                        <div>Nhân viên phân xử: <strong>{selectedDispute.resolved_by?.full_name || 'Hệ thống'}</strong></div>
                        {selectedDispute.resolved_at && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Thời gian: {new Date(selectedDispute.resolved_at).toLocaleString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ borderTop: '2px solid var(--tc-border)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                          👨‍⚖️ Soạn phán quyết phân xử
                        </h4>
                        <button
                          type="button"
                          onClick={handleCopilotSuggest}
                          disabled={copilotLoading}
                          style={{
                            background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
                            padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          {copilotLoading ? '⏳ Đang phân tích...' : '🤖 AI Gợi ý'}
                        </button>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                          Phán quyết chính thức *
                        </label>
                        <textarea
                          value={resolution}
                          onChange={e => setResolution(e.target.value)}
                          placeholder="Mô tả lý do phân xử, kết quả tranh chấp..."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid var(--tc-border)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'none',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                          Số tiền hoàn trả (VND)
                        </label>
                        <input
                          type="number"
                          value={refundAmount}
                          onChange={e => setRefundAmount(Math.max(0, Number(e.target.value)))}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid var(--tc-border)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                          Số tiền tối đa có thể hoàn: <strong>{selectedDispute.tour_requests.tours.price.toLocaleString('vi-VN')} VND</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                          Đóng
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleResolve}
                          disabled={submitting || !resolution.trim()}
                        >
                          {submitting ? 'Đang gửi...' : '✅ Xác nhận phán quyết'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Chat Logs */}
              <div style={{
                padding: '24px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0,
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💬 Lịch sử trò chuyện trong Tour
                </h4>

                {chatLoading ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingBlock height={200} />
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px dashed #cbd5e1',
                    padding: '20px',
                  }}>
                    <span style={{ fontSize: '36px', marginBottom: '8px' }}>💬</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Không tìm thấy lịch sử chat giữa các bên</span>
                    <span style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>
                      (Cuộc hội thoại chưa được bắt đầu hoặc không gắn với mã Tour này)
                    </span>
                  </div>
                ) : (
                  <div style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid var(--tc-border)',
                    padding: '16px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    {chatMessages.map(msg => {
                      const isCustomer = msg.sender_id === selectedDispute.tour_requests.users_tour_requests_user_idTousers.id;
                      const isGuide = msg.sender_id === selectedDispute.tour_requests.tours.guide_profiles.users.id;
                      
                      let bubbleBg = '#f1f5f9';
                      let bubbleColor = '#0f172a';
                      let label = 'Người dùng';
                      let labelColor = '#475569';
                      let align = 'flex-start';

                      if (isCustomer) {
                        bubbleBg = '#dbeafe';
                        bubbleColor = '#1e3a8a';
                        label = `Khách: ${msg.users?.full_name}`;
                        labelColor = '#2563eb';
                        align = 'flex-end';
                      } else if (isGuide) {
                        bubbleBg = '#dcfce7';
                        bubbleColor = '#14532d';
                        label = `HDV: ${msg.users?.full_name}`;
                        labelColor = '#16a34a';
                        align = 'flex-start';
                      }

                      return (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: align as 'flex-start' | 'flex-end',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isCustomer ? 'flex-end' : 'flex-start',
                          }}
                        >
                          {/* Sender label */}
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: labelColor,
                            marginBottom: '4px',
                            marginRight: isCustomer ? '4px' : '0',
                            marginLeft: isCustomer ? '0' : '4px',
                          }}>
                            {label}
                          </span>

                          {/* Message bubble */}
                          <div style={{
                            backgroundColor: bubbleBg,
                            color: bubbleColor,
                            padding: '10px 14px',
                            borderRadius: '12px',
                            borderTopRightRadius: isCustomer ? '2px' : '12px',
                            borderTopLeftRadius: isCustomer ? '12px' : '2px',
                            fontSize: '13px',
                            lineHeight: '1.4',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            wordBreak: 'break-word',
                          }}>
                            {msg.content}
                          </div>

                          {/* Timestamp */}
                          <span style={{
                            fontSize: '10px',
                            color: '#94a3b8',
                            marginTop: '3px',
                            marginRight: isCustomer ? '4px' : '0',
                            marginLeft: isCustomer ? '0' : '4px',
                          }}>
                            {new Date(msg.sent_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
