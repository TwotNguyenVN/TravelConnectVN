import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Table } from '../../components/common/Table/Table';
import type { Column } from '../../components/common/Table/Table';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import tourRequestService from '../../services/tourRequestService';
import type { TourRequest } from '../../services/tourRequestService';
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');
import { useToast } from '../../contexts/ToastContext';
import './GuideRequestsPage.css';

export const GuideRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  const [processType, setProcessType] = useState<'approve' | 'reject' | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await tourRequestService.getGuideRequests();
      if (response.success && response.data) {
        // Data is in response.data.data due to pagination
        setRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching guide requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenProcess = (request: TourRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setProcessType(type);
    setResponseNote('');
  };

  const handleProcessSubmit = async () => {
    if (!selectedRequest || !processType) return;

    try {
      setIsProcessing(true);
      if (processType === 'approve') {
        await tourRequestService.approveRequest(selectedRequest.id, responseNote);
      } else {
        await tourRequestService.rejectRequest(selectedRequest.id, responseNote);
      }
      setSelectedRequest(null);
      setProcessType(null);
      await fetchRequests();
      toast.success(processType === 'approve' ? 'Đã chấp nhận yêu cầu' : 'Đã từ chối yêu cầu');
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsProcessing(false);
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
        return <Badge variant="secondary">Khách đã hủy</Badge>;
      case 'cancelled_by_guide':
        return <Badge variant="danger">Đã hủy bởi HDV</Badge>;
      case 'refund_pending':
        return <Badge variant="warning">Chờ hoàn tiền</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Đã hoàn tiền</Badge>;
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
      title: 'Khách hàng',
      key: 'userName',
      render: (record: TourRequest) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-2)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--tc-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--tc-font-size-xs)', fontWeight: 'bold' }}>
            {(record.userName ?? '?').charAt(0)}
          </div>
          <span style={{ fontWeight: 'bold' }}>{record.userName ?? 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Tour',
      key: 'tourTitle',
      render: (record: TourRequest) => <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.tourTitle}</div>
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
          fontWeight: 500,
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
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)' }}>
          {record.status === 'pending' ? (
            <>
              <Button 
                variant="primary" 
                size="small" 
                onClick={() => handleOpenProcess(record, 'approve')}
              >
                Chấp nhận
              </Button>
              <Button 
                variant="outline" 
                size="small" 
                onClick={() => handleOpenProcess(record, 'reject')}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <Button variant="outline" size="small" onClick={() => setSelectedRequest(record)}>Chi tiết</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="guide-requests-container">
      <div className="page-header">
        <h1 className="page-title">Quản lý yêu cầu tham gia tour</h1>
        <p className="page-subtitle">Xem và xử lý các yêu cầu từ khách du lịch muốn tham gia tour của bạn.</p>
      </div>

      <Card className="requests-card">
        <Table 
          columns={columns} 
          data={requests} 
          isLoading={loading}
          emptyText="Chưa có yêu cầu nào cho các tour của bạn."
          rowKey={(record) => record.id}
        />
      </Card>

      {/* Process Modal */}
      <Modal
        isOpen={!!processType}
        onClose={() => !isProcessing && setProcessType(null)}
        title={processType === 'approve' ? 'Chấp nhận yêu cầu' : 'Từ chối yêu cầu'}
      >
        {selectedRequest && (
          <div>
            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <p>Bạn đang {processType === 'approve' ? 'chấp nhận' : 'từ chối'} yêu cầu của <strong>{selectedRequest.userName}</strong> tham gia tour <strong>{selectedRequest.tourTitle}</strong> ({selectedRequest.participantCount} khách).</p>
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--tc-spacing-2)', fontWeight: 'bold' }}>Lời nhắn gửi đến khách hàng</label>
              <textarea 
                rows={4}
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder={processType === 'approve' ? 'Ví dụ: Rất vui được đồng hành cùng bạn...' : 'Ví dụ: Xin lỗi, tour này đã đủ chỗ...'}
                style={{ width: '100%', padding: 'var(--tc-spacing-2)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setProcessType(null)} disabled={isProcessing}>Đóng</Button>
              <Button 
                variant={processType === 'approve' ? 'primary' : 'danger'} 
                onClick={handleProcessSubmit} 
                isLoading={isProcessing}
              >
                Xác nhận {processType === 'approve' ? 'Chấp nhận' : 'Từ chối'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal (for non-pending) */}
      <Modal
        isOpen={!!selectedRequest && !processType}
        onClose={() => setSelectedRequest(null)}
        title="Chi tiết yêu cầu"
      >
        {selectedRequest && (
          <div className="request-detail">
            <div className="detail-row">
              <span className="detail-label">Khách hàng:</span>
              <span className="detail-value">{selectedRequest.userName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tour:</span>
              <span className="detail-value">{selectedRequest.tourTitle}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Số người:</span>
              <span className="detail-value">{selectedRequest.participantCount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Ngày gửi:</span>
              <span className="detail-value">{formatDate(selectedRequest.requestedAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Trạng thái:</span>
              <span className="detail-value">{getStatusBadge(selectedRequest.status)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Thanh toán:</span>
              <span className="detail-value" style={{ fontWeight: 600, color: 'var(--tc-primary)' }}>
                {selectedRequest.paymentStatus || 'Chưa thanh toán'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tổng giá trị:</span>
              <span className="detail-value" style={{ fontWeight: 600 }}>
                {selectedRequest.totalPrice?.toLocaleString()} đ
              </span>
            </div>
            {selectedRequest.note && (
              <div className="detail-section">
                <p className="detail-label">Lời nhắn từ khách:</p>
                <div className="detail-box">"{selectedRequest.note}"</div>
              </div>
            )}
            {selectedRequest.responseNote && (
              <div className="detail-section">
                <p className="detail-label">Phản hồi của bạn:</p>
                <div className="detail-box" style={{ borderColor: 'var(--tc-primary-light)', backgroundColor: 'var(--tc-primary-bg)' }}>"{selectedRequest.responseNote}"</div>
              </div>
            )}
            <div style={{ marginTop: 'var(--tc-spacing-5)', textAlign: 'right' }}>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
