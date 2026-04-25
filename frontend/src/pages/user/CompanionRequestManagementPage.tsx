import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Modal, LoadingBlock 
} from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import { companionService } from '../../services/companionService';
import './CompanionRequestManagementPage.css';

const CompanionRequestManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processType, setProcessType] = useState<'approve' | 'reject'>('approve');
  const [responseNote, setResponseNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [postRes, reqRes] = await Promise.all([
        companionService.getPostDetail(id),
        companionService.getPostRequests(id, {})
      ]);
      
      if (postRes.success) setPost(postRes.data);
      if (reqRes.success) setRequests(reqRes.data.items);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleProcess = async () => {
    if (!selectedRequest) return;
    
    setSubmitting(true);
    try {
      const response = processType === 'approve' 
        ? await companionService.approveRequest(selectedRequest.id, { responseNote })
        : await companionService.rejectRequest(selectedRequest.id, { responseNote });
        
      if (response.success) {
        setShowProcessModal(false);
        setResponseNote('');
        fetchData();
        toast.success(processType === 'approve' ? 'Đã duyệt yêu cầu' : 'Đã từ chối yêu cầu');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingBlock />;

  return (
    <PageContainer className="request-management-page">
      <div className="page-header">
        <Button variant="outline" size="small" onClick={() => navigate('/user/companion-posts')}>← Quay lại</Button>
        <h1>Duyệt thành viên</h1>
        <p>Bài đăng: <strong>{post?.title}</strong></p>
      </div>

      <div className="stats-cards">
        <Card className="stat-item">
          <span className="label">Cần tuyển</span>
          <span className="value">{post?.expected_members}</span>
        </Card>
        <Card className="stat-item">
          <span className="label">Đã duyệt</span>
          <span className="value">{requests.filter(r => r.status === 'approved').length}</span>
        </Card>
        <Card className="stat-item">
          <span className="label">Đang chờ</span>
          <span className="value">{requests.filter(r => r.status === 'pending').length}</span>
        </Card>
      </div>

      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map(req => {
            const user = req.users || req.users_companion_requests_user_idTousers;
            return (
            <Card key={req.id} className={`request-card status-${req.status}`}>
              <div className="request-user">
                <img src={user?.avatar_url || 'https://via.placeholder.com/50'} alt="Avatar" />
                <div className="user-info">
                  <span className="user-name">{user?.full_name}</span>
                  <span className="request-time">Gửi lúc {formatDate(req.requested_at)}</span>
                </div>
              </div>

              <div className="request-body">
                <div className="message-box">
                  <span className="box-label">Lời nhắn từ người đăng ký:</span>
                  <p>{req.message || 'Không có lời nhắn'}</p>
                </div>
                
                {req.response_note && (
                  <div className="response-box">
                    <span className="box-label">Phản hồi của bạn:</span>
                    <p>{req.response_note}</p>
                  </div>
                )}
              </div>

              <div className="request-footer">
                <Badge variant={
                  req.status === 'approved' ? 'success' : 
                  req.status === 'rejected' ? 'danger' : 
                  req.status === 'cancelled' ? 'secondary' :
                  'warning'
                }>
                  {req.status === 'approved' ? 'Đã duyệt' : 
                   req.status === 'rejected' ? 'Từ chối' : 
                   req.status === 'cancelled' ? 'Người dùng đã hủy' :
                   'Đang chờ'}
                </Badge>

                {req.status === 'pending' && (
                  <div className="action-btns">
                    <Button variant="outline" size="small" onClick={() => {
                      setSelectedRequest(req);
                      setProcessType('reject');
                      setShowProcessModal(true);
                    }}>Từ chối</Button>
                    <Button variant="primary" size="small" onClick={() => {
                      setSelectedRequest(req);
                      setProcessType('approve');
                      setShowProcessModal(true);
                    }}>Duyệt tham gia</Button>
                  </div>
                )}
              </div>
            </Card>
          )})
        ) : (
          <Card className="empty-requests">
            <p>Chưa có yêu cầu nào cho bài đăng này.</p>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title={processType === 'approve' ? 'Duyệt thành viên' : 'Từ chối yêu cầu'}
      >
        <div className="process-form">
          <div className="user-preview">
            <img src={(selectedRequest?.users || selectedRequest?.users_companion_requests_user_idTousers)?.avatar_url || 'https://via.placeholder.com/40'} alt="" />
            <span><strong>{(selectedRequest?.users || selectedRequest?.users_companion_requests_user_idTousers)?.full_name}</strong></span>
          </div>
          
          <div className="input-group mb-4">
            <label className="input-label">Lời nhắn phản hồi (Tùy chọn)</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder={processType === 'approve' ? 'Chào mừng bạn tham gia chuyến đi...' : 'Rất tiếc, hiện tại nhóm đã...'}
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowProcessModal(false)}>Hủy</Button>
            <Button 
              variant={processType === 'approve' ? 'primary' : 'danger'} 
              isLoading={submitting} 
              onClick={handleProcess}
            >
              Xác nhận {processType === 'approve' ? 'Duyệt' : 'Từ chối'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default CompanionRequestManagementPage;
