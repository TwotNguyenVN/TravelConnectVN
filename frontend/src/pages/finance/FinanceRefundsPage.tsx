import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

export const FinanceRefundsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<unknown[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  async function fetchRefunds() {
    try {
      setLoading(true);
      const res = await adminApi.getPendingRefunds();
      if (res.success) {
        setRefunds(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load pending refunds', err);
      toast.error('Không thể tải danh sách yêu cầu hoàn tiền');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  async function handleProcessRefund(id: string, action: 'approve' | 'reject') {
    setProcessingId(id);
    setActionType(action);
    setNote('');
  };

  async function submitProcess() {
    if (!processingId || !actionType) return;
    try {
      const res = await adminApi.processRefund(processingId, { action: actionType, note });
      if (res.success) {
        toast.success(actionType === 'approve' ? 'Đã duyệt hoàn tiền thành công!' : 'Đã từ chối hoàn tiền.');
        setProcessingId(null);
        setActionType(null);
        fetchRefunds();
      } else {
        toast.error(res.message || 'Xử lý hoàn tiền thất bại');
      }
    } catch (err: unknown) {
      console.error('Failed to process refund', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý hoàn tiền');
    }
  };

  if (loading) {
    return <div style={{ padding: 'var(--tc-spacing-20) 0' }}><LoadingBlock height={400} /></div>;
  }

  return (
    <div style={{ padding: 'var(--tc-spacing-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Yêu cầu Hoàn tiền</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>
            Danh sách các yêu cầu hoàn trả tiền do hủy tour đã thanh toán.
          </p>
        </div>
        <button 
          onClick={fetchRefunds} 
          style={{ 
            padding: '8px 16px', 
            background: 'white', 
            border: '1px solid var(--tc-border)', 
            borderRadius: 'var(--tc-radius-md)', 
            cursor: 'pointer', 
            fontSize: 'var(--tc-font-size-sm)' 
          }}
        >
          🔄 Tải lại
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Mã giao dịch</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Khách hàng</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Tour đặt</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Số tiền hoàn lại</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Phương thức</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
                  Không có yêu cầu hoàn tiền nào đang chờ duyệt.
                </td>
              </tr>
            ) : (
              refunds.map((refund) => (
                <tr key={refund.id} style={{ borderBottom: '1px solid var(--tc-border)', verticalAlign: 'middle' }}>
                  <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 500 }}>
                    {refund.transaction_code}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{refund.users?.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>{refund.users?.email}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                    {refund.tour_requests?.tours?.title || 'Tour không tìm thấy'}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--tc-danger)' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(refund.amount)}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    {refund.payment_method}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleProcessRefund(refund.id, 'approve')}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                        }}
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleProcessRefund(refund.id, 'reject')}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          color: 'var(--tc-danger)',
                          border: '1px solid var(--tc-danger-bg)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                        }}
                      >
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {processingId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>
              {actionType === 'approve' ? 'Phê duyệt hoàn tiền' : 'Từ chối hoàn tiền'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--tc-text-secondary)', marginBottom: '16px' }}>
              {actionType === 'approve' 
                ? 'Hãy thêm ghi chú duyệt (ví dụ: Đã chuyển khoản qua ngân hàng).' 
                : 'Lý do từ chối hoàn trả khoản tiền này cho khách.'}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú đối soát..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--tc-border)',
                marginBottom: '16px',
                resize: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => { setProcessingId(null); setActionType(null); }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                onClick={submitProcess}
                style={{
                  padding: '8px 16px',
                  backgroundColor: actionType === 'approve' ? '#10b981' : 'var(--tc-danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
