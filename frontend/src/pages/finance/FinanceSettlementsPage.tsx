import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

interface GuideSettlement {
  guideProfileId: string;
  guideUserId: string;
  fullName: string;
  email: string;
  phone: string | null;
  bankId: string | null;
  accountNo: string | null;
  accountName: string | null;
  unsettledTxCount: number;
  totalUnpaidAmount: number;
  commissionFee: number;
  netPayable: number;
  transactions: {
    id: string;
    amount: number;
    transaction_code: string;
    created_at: string;
  }[];
}

export const FinanceSettlementsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<GuideSettlement[]>([]);
  const [selectedSettlement, setSelectedSettlement] = useState<GuideSettlement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function fetchSettlements() {
    try {
      setLoading(true);
      const res = await adminApi.getGuideSettlements();
      if (res.success) {
        // Only show guides who have unsettled transactions
        const activeSettlements = (res.data || []).filter(
          (s: GuideSettlement) => s.unsettledTxCount > 0
        );
        setSettlements(activeSettlements);
      }
    } catch (err) {
      console.error('Failed to load settlements data', err);
      toast.error('Không thể tải danh sách quyết toán Hướng dẫn viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  async function handleSettleSubmit() {
    if (!selectedSettlement) return;
    try {
      setIsProcessing(true);
      const res = await adminApi.settleGuideTransactions(selectedSettlement.guideProfileId);
      if (res.success) {
        toast.success(res.message || 'Quyết toán thành công!');
        setSelectedSettlement(null);
        fetchSettlements();
      } else {
        toast.error(res.message || 'Quyết toán thất bại');
      }
    } catch (err: any) {
      console.error('Failed to process guide settlement', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thực hiện quyết toán');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-2)' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Quyết toán Hướng dẫn viên</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>
            Quản lý và thực hiện thanh toán thu nhập của HDV (90% doanh thu đặt tour sau khi khấu trừ 10% phí vận hành).
          </p>
        </div>
        <button 
          onClick={fetchSettlements} 
          style={{ 
            padding: '8px 16px', 
            background: 'white', 
            border: '1px solid var(--tc-border)', 
            borderRadius: 'var(--tc-radius-md)', 
            cursor: 'pointer', 
            fontSize: 'var(--tc-font-size-sm)',
            fontWeight: 500,
          }}
        >
          🔄 Tải lại
        </button>
      </div>

      {/* Main Settlements Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 0' }}><LoadingBlock height={300} /></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Hướng dẫn viên</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Tài khoản Ngân hàng</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)', textAlign: 'center' }}>Số GD chưa trả</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Doanh thu gộp</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Phí hệ thống (10%)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Thực nhận (90%)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
                    Tất cả Hướng dẫn viên đã được quyết toán sạch công nợ.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s.guideProfileId} style={{ borderBottom: '1px solid var(--tc-border)', verticalAlign: 'middle' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>{s.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>SĐT: {s.phone || 'Chưa cung cấp'}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {s.bankId ? (
                        <>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.bankId}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-primary)' }}>STK: {s.accountNo}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)', textTransform: 'uppercase' }}>Tên: {s.accountName}</div>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--tc-danger)', fontWeight: 500 }}>Chưa thiết lập tài khoản</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {s.unsettledTxCount}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.totalUnpaidAmount)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--tc-text-secondary)' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.commissionFee)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--tc-primary)' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.netPayable)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedSettlement(s)}
                        disabled={!s.bankId}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: s.bankId ? 'var(--tc-primary)' : '#e2e8f0',
                          color: s.bankId ? 'white' : '#94a3b8',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: s.bankId ? 'pointer' : 'not-allowed',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Quyết toán
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Settlement Confirmation Modal */}
      {selectedSettlement && (
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
            borderRadius: '12px',
            width: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Xác nhận chuyển khoản Quyết toán</h3>
              <button 
                onClick={() => setSelectedSettlement(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--tc-text-secondary)'
                }}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--tc-text-primary)', lineHeight: 1.5 }}>
                Bạn đang tạo lệnh xác nhận thanh toán thu nhập cho Hướng dẫn viên <strong>{selectedSettlement.fullName}</strong>.
              </p>

              {/* Bank Transfer info card */}
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px dashed var(--tc-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Thông tin thụ hưởng ngân hàng</span>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--tc-text-secondary)' }}>Ngân hàng:</span>
                  <strong style={{ color: 'var(--tc-text-primary)' }}>{selectedSettlement.bankId}</strong>
                  <span style={{ color: 'var(--tc-text-secondary)' }}>Số tài khoản:</span>
                  <strong style={{ color: 'var(--tc-text-primary)', fontSize: '1.05rem', letterSpacing: '0.5px' }}>{selectedSettlement.accountNo}</strong>
                  <span style={{ color: 'var(--tc-text-secondary)' }}>Tên tài khoản:</span>
                  <strong style={{ color: 'var(--tc-text-primary)', textTransform: 'uppercase' }}>{selectedSettlement.accountName}</strong>
                  <span style={{ color: 'var(--tc-text-secondary)', fontWeight: 600 }}>Số tiền chuyển:</span>
                  <strong style={{ color: 'var(--tc-primary)', fontSize: '1.2rem' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSettlement.netPayable)}
                  </strong>
                </div>
              </div>

              {/* Transactions Break Down */}
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', fontWeight: 600 }}>Chi tiết các giao dịch kết chuyển ({selectedSettlement.unsettledTxCount} giao dịch):</span>
                <div style={{
                  marginTop: '8px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '6px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontSize: '0.85rem'
                }}>
                  {selectedSettlement.transactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '8px 12px', 
                        borderBottom: '1px solid var(--tc-border)' 
                      }}
                    >
                      <span>Mã GD: <strong>{tx.transaction_code}</strong></span>
                      <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(tx.amount) * 0.9)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--tc-text-secondary)',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                padding: '12px',
                borderRadius: '6px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '1rem' }}>⚠️</span>
                <span>
                  <strong>Chú ý:</strong> Hệ thống không tự động chuyển khoản tiền ngân hàng thực tế. Bạn phải thực hiện chuyển tiền thủ công qua ngân hàng dựa trên thông tin thụ hưởng phía trên trước khi ấn nút <strong>"Xác nhận đã chuyển tiền"</strong>.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: 'var(--tc-bg-subtle)',
              borderRadius: '0 0 12px 12px'
            }}>
              <button
                disabled={isProcessing}
                onClick={() => setSelectedSettlement(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Hủy
              </button>
              <button
                disabled={isProcessing}
                onClick={handleSettleSubmit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--tc-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {isProcessing ? 'Đang quyết toán...' : 'Xác nhận đã chuyển tiền'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
