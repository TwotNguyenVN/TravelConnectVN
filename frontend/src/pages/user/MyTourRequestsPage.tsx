import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Table } from '../../components/common/Table/Table';
import type { Column } from '../../components/common/Table/Table';
import { Button } from '../../components/common/Button/Button';
import tourRequestService from '../../services/tourRequestService';
import type { TourRequest } from '../../services/tourRequestService';
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');
import { useToast } from '../../contexts/ToastContext';
import { ReviewModal } from '../../components/common/Review/ReviewModal';
import { paymentService } from '../../services/paymentService';
import './MyTourRequestsPage.css';

export const MyTourRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'cancelled' | 'completed'>('all');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);
  const [reviewType, setReviewType] = useState<'tour' | 'guide'>('tour');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await tourRequestService.getMyRequests();
      if (response.success && response.data) {
        setRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenReview = (request: TourRequest, type: 'tour' | 'guide') => {
    setSelectedRequest(request);
    setReviewType(type);
    setReviewModalOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy yêu cầu này?')) return;

    try {
      setCancellingId(id);
      await tourRequestService.cancelRequest(id);
      await fetchRequests();
      toast.success('Đã hủy yêu cầu thành công');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Không thể hủy yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = async (id: string) => {
    try {
      setPayingId(id);
      const response = await paymentService.createVnpayUrl(id);
      if (response.success && response.data.paymentUrl) {
        window.open(response.data.paymentUrl, '_blank'); // Open VNPAY in new tab
      } else {
        toast.error('Không thể tạo giao dịch thanh toán.');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Lỗi khi kết nối đến cổng thanh toán.');
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Đang chờ</Badge>;
      case 'approved':
        return <Badge variant="success">Đã chấp nhận</Badge>;
      case 'rejected':
        return <Badge variant="danger">Bị từ chối</Badge>;
      case 'cancelled_by_user':
        return <Badge variant="secondary">Đã hủy</Badge>;
      case 'payment_pending':
        return <Badge variant="primary">Chờ thanh toán</Badge>;
      case 'paid':
        return <Badge variant="success">Đã thanh toán</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: Column<TourRequest>[] = [
    {
      title: 'Tour',
      key: 'tourTitle',
      render: (record: TourRequest) => (
        <div style={{ padding: 'var(--tc-spacing-2) 0' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--tc-primary)', marginBottom: '4px' }}>{record.tourTitle}</div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
            HDV: {record.guideName}
          </div>
          {record.responseNote && (
            <div style={{ 
              marginTop: 'var(--tc-spacing-3)', 
              fontSize: 'var(--tc-font-size-sm)', 
              color: 'var(--tc-text-primary)',
              fontStyle: 'italic',
              padding: '12px',
              backgroundColor: 'rgba(52, 152, 219, 0.05)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--tc-primary)',
              maxWidth: '400px'
            }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontStyle: 'normal', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-primary)' }}>
                💬 Phản hồi từ HDV:
              </strong> 
              "{record.responseNote}"
            </div>
          )}
          {record.status === 'cancelled_by_user' && record.cancellationNote && (
            <div style={{ 
              marginTop: 'var(--tc-spacing-2)', 
              fontSize: 'var(--tc-font-size-xs)', 
              color: 'var(--tc-text-secondary)',
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              maxWidth: '400px'
            }}>
              <strong>Lý do hủy:</strong> {record.cancellationNote}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Số người',
      key: 'participantCount',
    },
    {
      title: 'Ngày gửi',
      key: 'requestedAt',
      render: (record: TourRequest) => formatDate(record.requestedAt),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: TourRequest) => getStatusBadge(record.status),
    },
    {
      title: 'Thanh toán',
      key: 'paymentStatus',
      render: (record: TourRequest) => (
        <span style={{ 
          fontSize: 'var(--tc-font-size-sm)', 
          fontWeight: 600,
          color: record.paymentStatus?.includes('100%') ? 'var(--tc-success)' : 
                 record.paymentStatus?.includes('50%') ? 'var(--tc-primary)' : 'var(--tc-gray-600)'
        }}>
          {record.paymentStatus || 'Chưa thanh toán'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: TourRequest) => (
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)', flexWrap: 'wrap' }}>
          {(record.status === 'pending' || record.status === 'approved') && (
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => handleCancel(record.id)}
              isLoading={cancellingId === record.id}
            >
              Hủy
            </Button>
          )}

          {(record.status === 'approved' || record.status === 'payment_pending') && (
            <Button 
              variant="primary" 
              size="small" 
              onClick={() => handlePayment(record.id)}
              isLoading={payingId === record.id}
            >
              Thanh toán
            </Button>
          )}
          
          {(record.status === 'approved' || record.status === 'paid') && (
            <>
              {!record.hasTourReview && (
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => handleOpenReview(record, 'tour')}
                >
                  Đánh giá Tour
                </Button>
              )}
              {!record.hasGuideReview && (
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => handleOpenReview(record, 'guide')}
                >
                  Đánh giá HDV
                </Button>
              )}
              {record.hasTourReview && record.hasGuideReview && (
                <Badge variant="success">Đã đánh giá</Badge>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return req.status === 'approved' || req.status === 'payment_pending';
    if (activeTab === 'cancelled') return req.status === 'cancelled_by_user' || req.status === 'rejected';
    if (activeTab === 'completed') return req.status === 'paid';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'approved', label: 'Được duyệt' },
    { id: 'cancelled', label: 'Đã hủy' },
    { id: 'completed', label: 'Hoàn tất' }
  ];

  return (
    <div className="my-requests-container">
      <div className="page-header">
        <h1 className="page-title">Yêu cầu tham gia tour của tôi</h1>
        <p className="page-subtitle">Theo dõi và quản lý các yêu cầu tham gia tour bạn đã gửi cho hướng dẫn viên.</p>
      </div>

      <div className="requests-tabs-bar">
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

      <Card className="requests-card">
        <Table 
          columns={columns} 
          data={filteredRequests} 
          isLoading={loading}
          emptyText={`Không có yêu cầu nào trong mục ${tabs.find(t => t.id === activeTab)?.label}`}
          rowKey={(record) => record.id}
        />
      </Card>

      {selectedRequest && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          tourRequestId={selectedRequest.id}
          tourTitle={selectedRequest.tourTitle || ''}
          guideName={selectedRequest.guideName}
          type={reviewType}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};
