import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

interface Transaction {
  id: string;
  transaction_code: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  currency_code: string;
  gateway_response: any;
  provider_transaction_code: string | null;
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
  tour_requests?: {
    id: string;
    tours?: {
      id: string;
      title: string;
    };
  };
}

export const FinanceTransactionsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const limit = 10;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * limit;
      const res = await adminApi.getTransactions({
        skip,
        take: limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery ? searchQuery : undefined,
      });

      if (res.success) {
        setTransactions(res.data?.items || []);
        setTotal(res.data?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      toast.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  const getStatusBadgeStyle = (status: string) => {
    const base = {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
    };

    switch (status) {
      case 'paid':
      case 'success':
        return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'pending':
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
      case 'refund_pending':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'refunded':
        return { ...base, backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'refund_rejected':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'failed':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { ...base, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return 'Thành công';
      case 'pending':
        return 'Chờ thanh toán';
      case 'refund_pending':
        return 'Chờ hoàn tiền';
      case 'refunded':
        return 'Đã hoàn tiền';
      case 'refund_rejected':
        return 'Từ chối hoàn';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 'var(--tc-spacing-2)' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Lịch sử Giao dịch</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>
            Xem, tra cứu và đối soát toàn bộ các giao dịch tài chính đặt tour trên hệ thống.
          </p>
        </div>
        <button 
          onClick={fetchTransactions} 
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
          🔄 Làm mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'paid', 'pending', 'refund_pending', 'refunded', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid ' + (statusFilter === status ? 'var(--tc-primary)' : 'var(--tc-border)'),
                backgroundColor: statusFilter === status ? 'var(--tc-primary)' : 'transparent',
                color: statusFilter === status ? 'white' : 'var(--tc-text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Tìm mã giao dịch, tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--tc-radius-md)',
              border: '1px solid var(--tc-border)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Main Ledger Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 0' }}><LoadingBlock height={300} /></div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Mã giao dịch</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Khách hàng</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Tour liên kết</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Số tiền</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Thời gian tạo</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--tc-text-secondary)', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
                      Không tìm thấy giao dịch nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--tc-border)', verticalAlign: 'middle' }}>
                      <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--tc-text-primary)' }}>
                        {tx.transaction_code}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tx.users?.full_name || 'Hệ thống'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-secondary)' }}>{tx.users?.email || ''}</div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--tc-text-secondary)' }}>
                        {tx.tour_requests?.tours?.title || 'Tour không tìm thấy'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 700, color: tx.status === 'paid' ? '#10b981' : 'var(--tc-text-primary)' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: tx.currency_code || 'VND' }).format(tx.amount)}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>
                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={getStatusBadgeStyle(tx.status)}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'white',
                            border: '1px solid var(--tc-border)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                          }}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderTop: '1px solid var(--tc-border)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>
                  Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} trên tổng số {total} giao dịch
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: 'white',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      fontSize: '0.85rem',
                    }}
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid ' + (currentPage === i + 1 ? 'var(--tc-primary)' : 'var(--tc-border)'),
                        backgroundColor: currentPage === i + 1 ? 'var(--tc-primary)' : 'white',
                        color: currentPage === i + 1 ? 'white' : 'var(--tc-text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: 'white',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      fontSize: '0.85rem',
                    }}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
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
            width: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Chi tiết Giao dịch</h3>
              <button 
                onClick={() => setSelectedTransaction(null)}
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

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status Banner */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--tc-bg-subtle)',
                border: '1px solid var(--tc-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Mã giao dịch</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>{selectedTransaction.transaction_code}</div>
                </div>
                <span style={getStatusBadgeStyle(selectedTransaction.status)}>
                  {getStatusLabel(selectedTransaction.status)}
                </span>
              </div>

              {/* Grid Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Số tiền giao dịch</span>
                  <div style={{ fontWeight: 700, marginTop: '4px' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: selectedTransaction.currency_code }).format(selectedTransaction.amount)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Phương thức thanh toán</span>
                  <div style={{ fontWeight: 600, marginTop: '4px', textTransform: 'uppercase' }}>{selectedTransaction.payment_method}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Mã tham chiếu cổng</span>
                  <div style={{ marginTop: '4px' }}>{selectedTransaction.provider_transaction_code || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Thời điểm thanh toán</span>
                  <div style={{ marginTop: '4px' }}>
                    {selectedTransaction.paid_at ? new Date(selectedTransaction.paid_at).toLocaleString('vi-VN') : 'Chưa hoàn tất'}
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--tc-border)', margin: 0 }} />

              {/* Customer and Tour Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Khách hàng</span>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{selectedTransaction.users?.full_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)' }}>{selectedTransaction.users?.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Tour du lịch</span>
                  <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--tc-primary)' }}>{selectedTransaction.tour_requests?.tours?.title || 'Tour không tìm thấy'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)', marginTop: '2px' }}>Mã đặt tour: {selectedTransaction.tour_requests?.id}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--tc-border)', margin: 0 }} />

              {/* Gateway response raw JSON */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>Dữ liệu phản hồi từ Cổng thanh toán (Gateway JSON)</span>
                <pre style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap',
                }}>
                  {JSON.stringify(selectedTransaction.gateway_response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--tc-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'var(--tc-bg-subtle)',
              borderRadius: '0 0 12px 12px'
            }}>
              <button
                onClick={() => setSelectedTransaction(null)}
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
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
