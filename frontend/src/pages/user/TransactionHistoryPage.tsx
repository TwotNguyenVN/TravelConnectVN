import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import type { Column } from '../../components/common/Table/Table';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';
import './TransactionHistoryPage.css';

interface Transaction {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_code: string;
  created_at: string;
  tour_requests: {
    id: string;
    tours: {
      id: string;
      title: string;
    }
  }
}

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'cancelled'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getMyTransactions();
      if (res && res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy lịch sử giao dịch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy giao dịch này?')) return;
    
    try {
      setIsProcessing(true);
      const res = await paymentService.cancelTransaction(id);
      if (res.success) {
        toast.success('Đã hủy giao dịch thành công');
        setSelectedTransaction(null);
        fetchTransactions();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể hủy giao dịch');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async (tourRequestId: string) => {
    // Chuyển hướng sang trang booking hoặc gọi lại API lấy URL thanh toán
    // Ở đây đơn giản nhất là redirect hoặc mở lại VNPAY nếu chúng ta có tourRequestId
    try {
      setIsProcessing(true);
      const res = await paymentService.createVnpayUrl(tourRequestId);
      if (res.success && res.data.paymentUrl) {
        window.open(res.data.paymentUrl, '_blank');
      }
    } catch (error: any) {
      toast.error('Không thể tiếp tục thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Thành công</Badge>;
      case 'pending':
        return <Badge variant="warning">Đang chờ</Badge>;
      case 'failed':
        return <Badge variant="danger">Thất bại</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status || 'N/A'}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'paid') return t.status === 'paid';
    if (activeTab === 'cancelled') return t.status === 'cancelled' || t.status === 'failed';
    return true;
  });

  const columns: Column<Transaction>[] = [
    {
      title: 'Mã giao dịch',
      key: 'transaction_code',
      render: (record) => (
        <span 
          className="text-mono" 
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedTransaction(record)}
        >
          {record.transaction_code?.substring(0, 8) || 'N/A'}...
        </span>
      )
    },
    {
      title: 'Tour',
      key: 'tour',
      render: (record) => (
        <div 
          className="tour-title-link"
          onClick={() => setSelectedTransaction(record)}
        >
          {record.tour_requests?.tours?.title || 'N/A'}
        </div>
      )
    },
    {
      title: 'Số tiền',
      key: 'amount',
      render: (record) => <span className="amount">{Number(record.amount || 0).toLocaleString()}đ</span>
    },
    {
      title: 'Ngày giao dịch',
      key: 'created_at',
      render: (record) => record.created_at ? new Date(record.created_at).toLocaleString('vi-VN') : 'N/A'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record) => getStatusBadge(record.status)
    }
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'paid', label: 'Đã thanh toán' },
    { id: 'cancelled', label: 'Hủy/Lỗi' }
  ];

  return (
    <div className="transaction-history-container">
      <div className="page-header">
        <h1>Lịch sử giao dịch</h1>
        <p>Quản lý và theo dõi các giao dịch thanh toán tour của bạn.</p>
      </div>

      <div className="transaction-tabs-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
            {activeTab === tab.id && <div className="tab-indicator" />}
          </button>
        ))}
      </div>

      <Card>
        <Table
          columns={columns}
          data={filteredTransactions}
          isLoading={loading}
          emptyText={`Không có giao dịch nào trong mục ${tabs.find(t => t.id === activeTab)?.label}`}
          rowKey={(r) => r.id}
          onRowClick={(record) => setSelectedTransaction(record)}
        />
      </Card>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="transaction-modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="transaction-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết giao dịch</h2>
              <button className="close-btn" onClick={() => setSelectedTransaction(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Thông tin Tour</h3>
                <div 
                  className="detail-value tour-title-link" 
                  style={{ fontSize: '1.1rem', color: 'var(--tc-primary)' }}
                  onClick={() => navigate(`/tours/${selectedTransaction.tour_requests.tours.id}`)}
                >
                  {selectedTransaction.tour_requests?.tours?.title}
                </div>
              </div>

              <div className="detail-section">
                <h3>Chi tiết thanh toán</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Mã giao dịch</span>
                    <span className="detail-value text-mono">{selectedTransaction.transaction_code}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái</span>
                    <span className="detail-value">{getStatusBadge(selectedTransaction.status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phương thức</span>
                    <span className="detail-value" style={{ textTransform: 'uppercase' }}>{selectedTransaction.payment_method}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thời gian</span>
                    <span className="detail-value">{new Date(selectedTransaction.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section" style={{ textAlign: 'center', marginTop: '30px' }}>
                <span className="detail-label">Số tiền đã thực hiện</span>
                <div className="detail-value amount-large">
                  {Number(selectedTransaction.amount).toLocaleString()}đ
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setSelectedTransaction(null)}>Đóng</button>
              
              {selectedTransaction.status === 'pending' && (
                <>
                  <button 
                    className="btn-modal-cancel" 
                    onClick={() => handleCancel(selectedTransaction.id)}
                    disabled={isProcessing}
                  >
                    Hủy giao dịch
                  </button>
                  <button 
                    className="btn-modal-continue" 
                    onClick={() => handleContinue(selectedTransaction.tour_requests.id)}
                    disabled={isProcessing}
                  >
                    Tiếp tục thanh toán
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;
