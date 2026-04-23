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

export const MyTourRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const { toast } = useToast();

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
        window.location.href = response.data.paymentUrl; // Redirect to VNPAY
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
        <div>
          <div style={{ fontWeight: 'bold', color: 'var(--tc-primary)' }}>{record.tourTitle}</div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
            HDV: {record.guideName}
          </div>
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

          {record.status === 'approved' && (
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

  return (
    <div className="my-requests-container">
      <div className="page-header">
        <h1 className="page-title">Yêu cầu tham gia tour của tôi</h1>
        <p className="page-subtitle">Theo dõi và quản lý các yêu cầu tham gia tour bạn đã gửi cho hướng dẫn viên.</p>
      </div>

      <Card className="requests-card">
        <Table 
          columns={columns} 
          data={requests} 
          isLoading={loading}
          emptyText="Bạn chưa gửi yêu cầu tham gia tour nào."
          rowKey={(record) => record.id}
        />
      </Card>

      {requests.some(r => r.responseNote) && (
        <div className="notes-section" style={{ marginTop: 'var(--tc-spacing-6)' }}>
          <h3 style={{ fontSize: 'var(--tc-font-size-md)', marginBottom: 'var(--tc-spacing-3)' }}>Phản hồi từ hướng dẫn viên</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
            {requests.filter(r => r.responseNote).map(req => (
              <Card key={`note-${req.id}`} style={{ padding: 'var(--tc-spacing-3)', borderLeft: '4px solid var(--tc-primary)' }}>
                <div style={{ fontWeight: 'bold', marginBottom: 'var(--tc-spacing-1)' }}>{req.tourTitle}</div>
                <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)' }}>"{req.responseNote}"</div>
              </Card>
            ))}
          </div>
        </div>
      )}

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
