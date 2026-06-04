/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer, Card, Button, LoadingBlock } from '../../components/common';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'payment' | 'dispute' | 'account' | 'other';
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  reporter: {
    full_name: string;
    email: string;
    phone?: string;
  };
  assignee?: {
    full_name: string;
    email: string;
  } | null;
  assigned_to_user_id?: string | null;
}

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  payment: { label: 'Thanh toán', icon: '💳', color: '#dc2626', bg: '#fef2f2' },
  dispute: { label: 'Tranh chấp', icon: '⚖️', color: '#d97706', bg: '#fffbeb' },
  account: { label: 'Tài khoản', icon: '👤', color: '#2563eb', bg: '#eff6ff' },
  other: { label: 'Khác', icon: '⚙️', color: '#4b5563', bg: '#f3f4f6' },
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xử lý', color: '#ea580c', bg: '#fff7ed' },
  processing: { label: 'Đang xử lý', color: '#2563eb', bg: '#eff6ff' },
  resolved: { label: 'Đã giải quyết', color: '#16a34a', bg: '#f0fdf4' },
  closed: { label: 'Đã đóng', color: '#4b5563', bg: '#f3f4f6' },
};

export const SupportTicketsPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getTickets(params);
      if (res?.success) {
        setTickets(res.data?.data || []);
        setTotal(res.data?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Không thể tải danh sách yêu cầu hỗ trợ');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleUpdateTicket = async (status: 'processing' | 'resolved' | 'closed', assignToMe = false) => {
    if (!selectedTicket) return;

    try {
      setSubmitting(true);
      const payload: { status?: string; assignedToUserId?: string } = { status };
      
      if (assignToMe && user?.id) {
        payload.assignedToUserId = user.id;
      }

      const res = await adminApi.updateTicket(selectedTicket.id, payload);
      if (res?.success) {
        toast.success('Cập nhật trạng thái ticket hỗ trợ thành công');
        setShowModal(false);
        fetchTickets();
      }
    } catch (err) {
      console.error('Error updating ticket:', err);
      toast.error('Không thể cập nhật ticket hỗ trợ');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const textStr = `${t.title} ${t.description} ${t.reporter?.full_name} ${t.reporter?.email}`.toLowerCase();
    return search ? textStr.includes(search.toLowerCase()) : true;
  });

  if (loading && tickets.length === 0) return <PageContainer><LoadingBlock height={400} /></PageContainer>;

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: 'var(--tc-spacing-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            🛟 Quản Lý Yêu Cầu Hỗ Trợ (Tickets)
          </h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
            Tổng số: <strong>{total}</strong> yêu cầu. Phản hồi thắc mắc, lỗi tài khoản, và hỗ trợ thanh toán cho thành viên.
          </p>
        </div>
        <Button variant="outline" onClick={fetchTickets}>🔄 Làm mới</Button>
      </div>

      {/* Filters */}
      <Card style={{ padding: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo tiêu đề, nội dung, người gửi..."
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
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--tc-border)',
              borderRadius: 'var(--tc-radius-md)',
              fontSize: 'var(--tc-font-size-sm)',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">Tất cả phân loại</option>
            <option value="payment">Thanh toán (Payment)</option>
            <option value="dispute">Tranh chấp (Dispute)</option>
            <option value="account">Tài khoản (Account)</option>
            <option value="other">Khác (Other)</option>
          </select>
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
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="closed">Đã đóng</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--tc-border)' }}>
                {['ID', 'Tiêu đề', 'Phân loại', 'Người gửi', 'Người phụ trách', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📥</div>
                    <div style={{ fontWeight: 600 }}>Không tìm thấy yêu cầu hỗ trợ nào</div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const cat = CATEGORY_MAP[ticket.category] || { label: ticket.category, icon: '❓', color: '#64748b', bg: '#f8fafc' };
                  const stat = STATUS_MAP[ticket.status] || { label: ticket.status, color: '#64748b', bg: '#f8fafc' };
                  
                  return (
                    <tr
                      key={ticket.id}
                      style={{ borderBottom: '1px solid var(--tc-border)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                        {ticket.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ticket.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ticket.description}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px',
                          backgroundColor: cat.bg, color: cat.color,
                          fontWeight: 600, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{ticket.reporter?.full_name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ticket.reporter?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {ticket.assignee ? (
                          <div style={{ color: '#1e293b', fontWeight: 500 }}>
                            🛠️ {ticket.assignee.full_name}
                          </div>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '11px', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '4px' }}>
                            Chưa phân công
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '999px',
                          backgroundColor: stat.bg, color: stat.color,
                          fontWeight: 700, fontSize: '11px',
                        }}>
                          {stat.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '12px' }}>
                        {new Date(ticket.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Button
                          variant={ticket.status === 'pending' ? 'primary' : 'outline'}
                          size="small"
                          onClick={() => handleOpenTicket(ticket)}
                        >
                          {ticket.status === 'pending' ? '🚀 Tiếp nhận' : '👁 Xem'}
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

      {/* Ticket Details & Action Modal */}
      {showModal && selectedTicket && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--tc-spacing-4)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--tc-radius-xl)',
            padding: 'var(--tc-spacing-6)',
            maxWidth: '600px',
            width: '100%',
            boxShadow: 'var(--tc-shadow-xl)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>
                  Chi tiết Ticket #{selectedTicket.id.slice(0, 8).toUpperCase()}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Ngày tạo: {new Date(selectedTicket.created_at).toLocaleString('vi-VN')}
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

            {/* Ticket Info Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {/* Category & Status Row */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '6px',
                  backgroundColor: CATEGORY_MAP[selectedTicket.category]?.bg,
                  color: CATEGORY_MAP[selectedTicket.category]?.color,
                  fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span>{CATEGORY_MAP[selectedTicket.category]?.icon}</span>
                  <span>Phân loại: {CATEGORY_MAP[selectedTicket.category]?.label}</span>
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px',
                  backgroundColor: STATUS_MAP[selectedTicket.status]?.bg,
                  color: STATUS_MAP[selectedTicket.status]?.color,
                  fontWeight: 700, fontSize: '11px',
                }}>
                  Trạng thái: {STATUS_MAP[selectedTicket.status]?.label}
                </span>
              </div>

              {/* Reporter Box */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--tc-border)', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', fontSize: '11px' }}>
                  👤 Người gửi yêu cầu
                </div>
                <div>Họ và tên: <strong>{selectedTicket.reporter.full_name}</strong></div>
                <div>Email liên hệ: <strong>{selectedTicket.reporter.email}</strong></div>
                {selectedTicket.reporter.phone && (
                  <div>Số điện thoại: <strong>{selectedTicket.reporter.phone}</strong></div>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                  {selectedTicket.title}
                </h4>
                <p style={{
                  margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6',
                  backgroundColor: '#fafafa', padding: '14px', borderRadius: '8px', border: '1px solid #f1f5f9',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>
                  {selectedTicket.description}
                </p>
              </div>

              {/* Assignee Information */}
              <div>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Nhân viên phụ trách: </span>
                {selectedTicket.assignee ? (
                  <strong>{selectedTicket.assignee.full_name} ({selectedTicket.assignee.email})</strong>
                ) : (
                  <strong style={{ color: '#ef4444' }}>Chưa có ai nhận xử lý</strong>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ borderTop: '1px solid var(--tc-border)', paddingTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Hủy
              </Button>
              
              {selectedTicket.status !== 'closed' && (
                <>
                  {/* Assign to me action if not already assigned */}
                  {selectedTicket.assigned_to_user_id !== user?.id && (
                    <button
                      onClick={() => handleUpdateTicket('processing', true)}
                      disabled={submitting}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      🚀 Nhận Xử Lý & Gán Cho Tôi
                    </button>
                  )}

                  {/* Mark as resolved action if processing */}
                  {selectedTicket.status === 'processing' && (
                    <button
                      onClick={() => handleUpdateTicket('resolved')}
                      disabled={submitting}
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      ✅ Đã Giải Quyết
                    </button>
                  )}

                  {/* Close Ticket action */}
                  <button
                    onClick={() => handleUpdateTicket('closed')}
                    disabled={submitting}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🚪 Đóng Ticket
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
