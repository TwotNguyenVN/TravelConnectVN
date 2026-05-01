import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Modal, LoadingBlock, EmptyState 
} from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ReportModal } from '../../components/common/Report/ReportModal';
import { companionService } from '../../services/companionService';
import chatService from '../../services/chatService';
import type { CompanionRequest } from '../../services/companionService';
import { DEFAULT_AVATAR } from '../../constants/images';
import './CompanionDetailPage.css';

const CompanionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRequest, setMyRequest] = useState<CompanionRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const postRes = await companionService.getPostDetail(id);
      if (postRes.success) {
        setPost(postRes.data);
      } else {
        setError('Không tìm thấy bài đăng hoặc bài đăng đã bị xóa.');
      }

      if (user) {
        const reqRes = await companionService.getMyRequestForPost(id);
        if (reqRes.success && reqRes.data) {
          setMyRequest(reqRes.data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching companion detail:', err);
      if (err.response?.status === 404) {
        setError('Bài đăng không tồn tại hoặc đã bị gỡ bỏ.');
      } else {
        setError('Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleSendRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await companionService.sendRequest({
        postId: id!,
        message: requestMessage
      });
      if (response.success) {
        setMyRequest(response.data);
        setShowRequestModal(false);
        toast.success('Gửi yêu cầu thành công!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenGroupChat = async () => {
    if (!id) return;
    try {
      setChatLoading(true);
      const res = await chatService.createGroupCompanion(id);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error('Không thể mở nhóm chat.');
      }
    } catch (err: any) {
      console.error('Error opening group chat:', err);
      toast.error('Có lỗi xảy ra. Bạn chưa được duyệt hoặc nhóm chưa có đủ điều kiện.');
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return (
    <PageContainer>
      <LoadingBlock height={400} />
      <div style={{ marginTop: '20px' }}>
        <LoadingBlock height={200} />
      </div>
    </PageContainer>
  );

  if (error || !post) return (
    <PageContainer>
      <EmptyState 
        title="Không thể hiển thị bài đăng" 
        description={error || "Bài đăng này hiện không khả dụng."}
        action={<Button variant="primary" onClick={() => navigate('/companions')}>Quay lại danh sách</Button>}
      />
    </PageContainer>
  );

  const isOwner = user?.id === post.user_id;

  return (
    <PageContainer className="companion-detail-page">
      <div className="detail-layout">
        <div className="main-content">
          <Card className="detail-card">
            <div className="detail-header">
              <Badge variant={post.business_status === 'open' ? 'success' : 'secondary'}>
                {post.business_status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
              </Badge>
              <h1 className="detail-title">{post.title}</h1>
              <div className="detail-meta">
                <span>Đăng bởi <strong>{post.users?.full_name}</strong></span>
                <span> • </span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="info-box">
                <span className="label">Điểm đến</span>
                <span className="value">{post.destination}</span>
              </div>
              <div className="info-box">
                <span className="label">Thời gian</span>
                <span className="value">{formatDate(post.start_date)} - {formatDate(post.end_date)}</span>
              </div>
              <div className="info-box">
                <span className="label">Chi phí dự kiến</span>
                <span className="value">{formatCurrency(post.estimated_cost)}</span>
              </div>
              <div className="info-box">
                <span className="label">Thành viên</span>
                <span className="value">{post.companion_requests?.length || 0} / {post.expected_members} đã duyệt</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Mô tả lịch trình</h3>
              <p className="description-text">{post.description}</p>
            </div>

            {post.requirements && (
              <div className="detail-section">
                <h3>Yêu cầu đối với bạn đồng hành</h3>
                <p className="requirements-text">{post.requirements}</p>
              </div>
            )}
          </Card>

          <Card className="members-card">
            <h3>Danh sách thành viên ({post.companion_requests?.length || 0})</h3>
            <div className="members-list">
              {post.companion_requests && post.companion_requests.length > 0 ? (
                post.companion_requests.map((req: any) => (
                  <div key={req.id} className="member-item">
                    <img src={req.users_companion_requests_user_idTousers?.avatar_url || DEFAULT_AVATAR} alt="Avatar" />
                    <div className="member-info">
                      <span className="member-name">{req.users_companion_requests_user_idTousers?.full_name}</span>
                      <span className="member-tag">Thành viên</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-members">Chưa có thành viên nào được duyệt.</p>
              )}
            </div>
          </Card>
        </div>

        <aside className="side-content">
          <Card className="action-card">
            {isOwner ? (
              <div className="owner-actions">
                <p>Đây là bài đăng của bạn</p>
                <Button variant="primary" fullWidth onClick={() => navigate(`/user/companion-posts/${id}/requests`)}>
                  Quản lý yêu cầu
                </Button>
                <Button variant="outline" fullWidth onClick={() => navigate(`/user/companion-posts/${id}/edit`)}>
                  Chỉnh sửa bài đăng
                </Button>
                <Button variant="primary" fullWidth style={{ marginTop: '12px' }} onClick={handleOpenGroupChat} isLoading={chatLoading}>
                  Mở Nhóm Chat (M30)
                </Button>
              </div>
            ) : myRequest ? (
              <div className="request-status">
                <p>Trạng thái yêu cầu của bạn:</p>
                <Badge variant={
                  myRequest.status === 'approved' ? 'success' : 
                  myRequest.status === 'rejected' ? 'danger' : 
                  'warning'
                }>
                  {myRequest.status === 'approved' ? 'Đã được duyệt' : 
                   myRequest.status === 'rejected' ? 'Đã bị từ chối' : 
                   'Đang chờ duyệt'}
                </Badge>
                {myRequest.status === 'pending' && (
                  <Button variant="outline" fullWidth className="mt-4" onClick={() => {/* Handle cancel */}}>
                    Hủy yêu cầu
                  </Button>
                )}
                {myRequest.status === 'approved' && (
                  <Button variant="primary" fullWidth className="mt-4" onClick={handleOpenGroupChat} isLoading={chatLoading}>
                    Mở Nhóm Chat
                  </Button>
                )}
              </div>
            ) : (
              <div className="guest-actions">
                <h3>Tham gia chuyến đi?</h3>
                <p>Gửi yêu cầu để chủ bài đăng có thể duyệt bạn vào nhóm.</p>
                <Button variant="primary" fullWidth onClick={() => setShowRequestModal(true)} disabled={post.business_status !== 'open'}>
                  {post.business_status === 'open' ? 'Gửi yêu cầu tham gia' : 'Đã ngừng nhận người'}
                </Button>
              </div>
            )}
          </Card>

          <Card className="author-card">
            <h3>Về chủ bài đăng</h3>
            <div className="author-profile">
              <img src={post.users?.avatar_url || DEFAULT_AVATAR} alt="Author" />
              <div className="author-details">
                <span className="author-name">{post.users?.full_name}</span>
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => navigate(`/profile/${post.user_id}`)}
                >
                  Xem hồ sơ
                </Button>
              </div>
            </div>
            {!isOwner && (
              <div style={{ marginTop: 'var(--tc-spacing-4)', textAlign: 'center' }}>
                <button 
                  onClick={() => setShowReportModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--tc-text-secondary)',
                    fontSize: 'var(--tc-font-size-xs)',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Báo cáo bài đăng này
                </button>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {showReportModal && (
        <ReportModal 
          targetType="companion_post"
          targetId={id!}
          onClose={() => setShowReportModal(false)}
        />
      )}

      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Gửi yêu cầu tham gia"
      >
        <div className="request-form">
          <p className="mb-4">Hãy để lại lời nhắn cho chủ bài đăng về lý do bạn muốn tham gia hoặc kinh nghiệm của bạn.</p>
          <textarea
            className="form-control mb-4"
            rows={5}
            placeholder="Ví dụ: Mình rất muốn đi Hà Giang, mình có thể lái xe máy và chụp ảnh cho mọi người..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
          ></textarea>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>Hủy</Button>
            <Button variant="primary" isLoading={submitting} onClick={handleSendRequest}>Gửi ngay</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default CompanionDetailPage;
