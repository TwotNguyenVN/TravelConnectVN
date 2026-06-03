/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { PageContainer, Card, Button, LoadingBlock } from '../../components/common';

interface SystemReport {
  id: string;
  status: string;
  created_at: string;
  report_type: string;
  reason: string;
  reporter?: { full_name: string; email?: string };
  users?: { full_name: string; email: string };
  notes?: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb' },
  accepted: { label: 'Đã chấp nhận', color: '#3b82f6', bg: '#eff6ff' },
  paid: { label: 'Đã thanh toán', color: '#10b981', bg: '#ecfdf5' },
  completed: { label: 'Hoàn thành', color: '#6366f1', bg: '#eef2ff' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', bg: '#fef2f2' },
  rejected: { label: 'Bị từ chối', color: '#dc2626', bg: '#fef2f2' },
};

export const SupportDisputePage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SystemReport[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<SystemReport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReports({ limit: 50 });
      // Fallback: use reports to represent disputes since tour-requests endpoint may not exist yet
      if (res?.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Error fetching dispute data:', err);
      toast.error('Không thể tải danh sách tranh chấp');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenDispute = (req: SystemReport) => {
    setSelectedRequest(req);
    setResolution('');
    setShowModal(true);
  };

  const handleResolve = async () => {
    if (!selectedRequest || !resolution.trim()) {
      toast.error('Vui lòng nhập nội dung phán quyết');
      return;
    }
    try {
      setSubmitting(true);
      await adminApi.processReport(selectedRequest.id, {
        action: 'resolved',
        notes: resolution,
      });
      toast.success('Đã ghi nhận phán quyết tranh chấp');
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      console.error('Resolve dispute error:', err);
      toast.error('Không thể lưu phán quyết');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch = search
      ? JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
      : true;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <PageContainer><LoadingBlock height={400} /></PageContainer>;

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          ⚖️ Giải quyết Tranh chấp Đặt Tour
        </h1>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
          Tra cứu lịch sử đặt tour, xem thông tin hai bên và đưa ra phán quyết xử lý khiếu nại.
        </p>
      </div>

      {/* Filters */}
      <Card style={{ padding: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, email, tour..."
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
            <option value="pending">Chờ xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="dismissed">Bác bỏ</option>
          </select>
          <Button variant="outline" onClick={fetchRequests}>🔄 Làm mới</Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--tc-font-size-sm)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--tc-border)' }}>
                {['Loại vi phạm', 'Người báo cáo', 'Lý do', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                    <div>Không có tranh chấp nào cần xử lý</div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req: SystemReport) => {
                  const s = STATUS_MAP[req.status] || { label: req.status, color: '#64748b', bg: '#f8fafc' };
                  return (
                    <tr
                      key={req.id}
                      style={{ borderBottom: '1px solid var(--tc-border)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        {req.report_type || 'Khiếu nại'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#374151' }}>
                        {req.reporter?.full_name || req.users?.full_name || 'Người dùng'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', maxWidth: '200px' }}>
                        <span title={req.reason} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {req.reason || req.notes || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '999px',
                          backgroundColor: s.bg, color: s.color,
                          fontWeight: 600, fontSize: '11px',
                        }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '12px' }}>
                        {new Date(req.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleOpenDispute(req)}
                          disabled={req.status === 'resolved' || req.status === 'dismissed'}
                        >
                          {req.status === 'pending' ? 'Phán quyết' : 'Xem chi tiết'}
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

      {/* Resolution Modal */}
      {showModal && selectedRequest && (
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
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--tc-shadow-xl)',
          }}>
            <h3 style={{ margin: '0 0 var(--tc-spacing-5) 0', fontSize: 'var(--tc-font-size-lg)', fontWeight: 800, color: '#1e293b' }}>
              ⚖️ Phán quyết Tranh chấp
            </h3>

            <div style={{ background: '#f8fafc', borderRadius: 'var(--tc-radius-lg)', padding: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-5)' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Loại vi phạm</div>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                {selectedRequest.report_type || 'Khiếu nại'}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Lý do báo cáo</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
                {selectedRequest.reason || 'Không có thông tin chi tiết'}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>
                Nội dung phán quyết của bạn *
              </label>
              <textarea
                value={resolution}
                onChange={e => setResolution(e.target.value)}
                placeholder="Ghi rõ lý do quyết định xử lý: Ẩn nội dung / Cảnh cáo tài khoản / Chuyển kế toán hoàn tiền / Bác bỏ báo cáo..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleResolve}
                disabled={submitting || !resolution.trim()}
              >
                {submitting ? 'Đang lưu...' : '✅ Xác nhận phán quyết'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
