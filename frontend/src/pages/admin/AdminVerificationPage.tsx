import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { 
  PageContainer, 
  Table, 
  Badge, 
  Button, 
  Card, 
  Modal, 
  LoadingBlock, 
  EmptyState 
} from '../../components/common';
import './AdminVerificationPage.css';

interface VerificationDocument {
  id: string;
  document_type: string;
  file_url: string;
  status: string;
  note?: string;
}

interface VerificationRequest {
  id: string;
  guide_profile_id: string;
  status: string;
  submission_note: string;
  submitted_at: string;
  processed_at?: string;
  result_note?: string;
  guide_profiles: {
    working_area: string;
    users: { full_name: string; email: string };
  };
  guide_verification_documents: VerificationDocument[];
}

export function AdminVerificationPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getVerificationRequests();
      setRequests(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách xác minh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenDetail = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
    setShowRejectionForm(false);
    setRejectionNote('');
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const handleProcess = async (status: 'approved' | 'rejected') => {
    if (!selectedRequest) return;
    
    if (status === 'rejected' && !rejectionNote.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(true);
      await adminApi.processVerification(selectedRequest.id, { 
        status, 
        result_note: status === 'rejected' ? rejectionNote : 'Hồ sơ hợp lệ.' 
      });
      
      toast.success(status === 'approved' ? 'Đã phê duyệt hồ sơ' : 'Đã từ chối hồ sơ');
      handleCloseDetail();
      fetchRequests();
    } catch (error) {
      toast.error('Xử lý xác minh thất bại');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      key: 'guide',
      title: 'Hướng dẫn viên',
      render: (row: VerificationRequest) => (
        <div className="guide-info">
          <div style={{ fontWeight: 600 }}>{row.guide_profiles?.users?.full_name}</div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
            {row.guide_profiles?.users?.email}
          </div>
        </div>
      )
    },
    {
      key: 'area',
      title: 'Khu vực',
      render: (row: VerificationRequest) => row.guide_profiles?.working_area || 'N/A'
    },
    {
      key: 'date',
      title: 'Ngày gửi',
      render: (row: VerificationRequest) => new Date(row.submitted_at).toLocaleDateString('vi-VN')
    },
    {
      key: 'docs',
      title: 'Tài liệu',
      render: (row: VerificationRequest) => (
        <div className="document-links">
          {row.guide_verification_documents?.length || 0} tệp
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (row: VerificationRequest) => {
        const variant = row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger';
        const label = row.status === 'approved' ? 'Đã duyệt' : row.status === 'pending' ? 'Chờ xử lý' : 'Từ chối';
        return <Badge variant={variant as any}>{label}</Badge>;
      }
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (row: VerificationRequest) => (
        <Button variant="outline" size="small" onClick={() => handleOpenDetail(row)}>
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <PageContainer className="admin-verification-container">
      <div className="verification-header">
        <h1>Quản lý Xác minh Hướng dẫn viên</h1>
        <p>Xem xét và phê duyệt các yêu cầu xác minh hồ sơ năng lực của hướng dẫn viên địa phương.</p>
      </div>
      
      <Card className="verification-table-card">
        {loading ? (
          <LoadingBlock />
        ) : requests.length === 0 ? (
          <EmptyState 
            title="Không có yêu cầu nào" 
            description="Hiện tại không có yêu cầu xác minh nào cần xử lý."
          />
        ) : (
          <Table 
            columns={columns} 
            data={requests} 
            rowKey={(row) => row.id} 
          />
        )}
      </Card>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        title="Chi tiết yêu cầu xác minh"
        size="large"
        footer={
          <div className="action-buttons">
            <Button variant="outline" onClick={handleCloseDetail} disabled={processing}>
              Đóng
            </Button>
            {selectedRequest?.status === 'pending' && !showRejectionForm && (
              <>
                <Button 
                  variant="danger" 
                  onClick={() => setShowRejectionForm(true)}
                  disabled={processing}
                >

                  Từ chối
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => handleProcess('approved')}
                  isLoading={processing}
                  disabled={processing}
                >
                  Phê duyệt hồ sơ
                </Button>
              </>
            )}
            {showRejectionForm && (
              <Button 
                variant="danger" 
                onClick={() => handleProcess('rejected')}
                isLoading={processing}
                disabled={processing}
              >
                Xác nhận từ chối
              </Button>
            )}
          </div>
        }
      >
        {selectedRequest && (
          <div className="verification-modal-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tc-spacing-4)' }}>
              <div className="request-detail-item">
                <span className="request-detail-label">Hướng dẫn viên</span>
                <span className="request-detail-value">{selectedRequest.guide_profiles?.users?.full_name}</span>
              </div>
              <div className="request-detail-item">
                <span className="request-detail-label">Email liên hệ</span>
                <span className="request-detail-value">{selectedRequest.guide_profiles?.users?.email}</span>
              </div>
              <div className="request-detail-item">
                <span className="request-detail-label">Khu vực hoạt động</span>
                <span className="request-detail-value">{selectedRequest.guide_profiles?.working_area || 'Chưa cập nhật'}</span>
              </div>
              <div className="request-detail-item">
                <span className="request-detail-label">Thời gian gửi</span>
                <span className="request-detail-value">{new Date(selectedRequest.submitted_at).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div className="request-detail-item">
              <span className="request-detail-label">Ghi chú từ Hướng dẫn viên</span>
              <div className="request-detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedRequest.submission_note || 'Không có ghi chú.'}
              </div>
            </div>

            <div className="request-detail-item">
              <span className="request-detail-label">Tài liệu đính kèm ({selectedRequest.guide_verification_documents?.length || 0})</span>
              <div className="document-preview-grid">
                {selectedRequest.guide_verification_documents?.map(doc => {
                  const label = doc.document_type === 'national_id' ? 'CCCD/Hộ chiếu' : 
                               doc.document_type === 'national_id_front' ? 'CCCD (Mặt trước)' :
                               doc.document_type === 'national_id_back' ? 'CCCD (Mặt sau)' :
                               doc.document_type === 'tour_guide_card' ? 'Thẻ HDV' : 
                               doc.document_type === 'certificate' ? 'Chứng chỉ' : 'Tài liệu khác';
                  return (
                    <div 
                      key={doc.id} 
                      className="document-preview-item"
                      onClick={() => setPreviewImage({ url: doc.file_url, title: label })}
                    >
                      <div className="document-image-container">
                        <img src={doc.file_url} alt={doc.document_type} />
                      </div>
                      <div className="document-info-bar">
                        <span className="document-icon">
                          {doc.document_type.startsWith('national_id') ? '🪪' : doc.document_type === 'tour_guide_card' ? '🆔' : '📜'}
                        </span>
                        <span className="document-name">{label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {showRejectionForm && (
              <div className="rejection-form">
                <label htmlFor="rejectionNote">Lý do từ chối <span className="required" style={{ color: 'var(--tc-danger)' }}>*</span></label>
                <textarea
                  id="rejectionNote"
                  placeholder="Nhập lý do cụ thể để hướng dẫn viên có thể cập nhật lại hồ sơ..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {selectedRequest.status !== 'pending' && (
              <div className="request-detail-item" style={{ marginTop: 'var(--tc-spacing-4)', paddingTop: 'var(--tc-spacing-4)', borderTop: '1px solid var(--tc-border)' }}>
                <span className="request-detail-label">Kết quả xử lý</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-2)', marginTop: 'var(--tc-spacing-1)' }}>
                  <Badge variant={selectedRequest.status === 'approved' ? 'success' : 'danger'}>
                    {selectedRequest.status === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                  </Badge>
                  <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
                    vào {selectedRequest.processed_at ? new Date(selectedRequest.processed_at).toLocaleString('vi-VN') : 'N/A'}
                  </span>
                </div>
                {selectedRequest.result_note && (
                  <div className="request-detail-value" style={{ marginTop: 'var(--tc-spacing-2)', backgroundColor: 'var(--tc-primary-light)' }}>
                    <strong>Ghi chú Admin:</strong> {selectedRequest.result_note}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Lightbox for Image Preview */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title || 'Xem tài liệu'}
        size="large"
      >
        {previewImage && (
          <div className="lightbox-content">
            <img src={previewImage.url} alt={previewImage.title} className="lightbox-image" />
            <div className="lightbox-actions">
              <Button variant="outline" onClick={() => window.open(previewImage.url, '_blank')}>
                Mở trong tab mới
              </Button>
              <Button variant="primary" onClick={() => setPreviewImage(null)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

