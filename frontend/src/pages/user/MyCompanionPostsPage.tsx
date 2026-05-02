import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, Badge, Button, LoadingBlock, EmptyState, Modal 
} from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import { companionService } from '../../services/companionService';
import type { CompanionPost } from '../../services/companionService';
import './MyCompanionPostsPage.css';

const MyCompanionPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'complete' | 'delete' | 'none';
    postId: string;
    postTitle: string;
  }>({
    show: false,
    type: 'none',
    postId: '',
    postTitle: '',
  });

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        keyword: searchKeyword || undefined
      };
      const response = await companionService.getMyPosts(params);
      if (response.success) {
        setPosts(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
      toast.error('Không thể tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [statusFilter, searchKeyword]);

  const handleStatusUpdate = async (id: string, newStatus: string, successMsg: string) => {
    try {
      const response = await companionService.updatePost(id, { businessStatus: newStatus });
      if (response.success) {
        toast.success(successMsg);
        fetchMyPosts();
      }
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái bài đăng');
    }
  };



  const handleConfirmAction = async () => {
    const { type, postId } = confirmModal;
    setConfirmModal(prev => ({ ...prev, show: false }));
    
    if (type === 'delete') {
      try {
        const response = await companionService.deletePost(postId);
        if (response.success) {
          toast.success('Xóa bài đăng thành công');
          fetchMyPosts();
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa bài đăng');
      }
    } else if (type === 'complete') {
      handleStatusUpdate(postId, 'completed', 'Chúc mừng bạn đã hoàn thành chuyến đi!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Đang tuyển';
      case 'closed': return 'Đang tạm ngưng';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Đã hoàn tất';
      default: return status;
    }
  };

  return (
    <PageContainer className="tc-my-companion-posts">
      <div className="tc-my-companion-posts__header">
        <div className="tc-my-companion-posts__title">
          <h1>Bài đăng đồng hành của tôi</h1>
          <p>Quản lý các chuyến đi bạn đã khởi xướng và duyệt thành viên tham gia.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/user/companion-posts/create')}>
          + Tạo bài đăng mới
        </Button>
      </div>

      <div className="tc-my-companion-posts__filters">
        <div className="tc-my-companion-posts__search">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tiêu đề bài đăng..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="tc-my-companion-posts__status-filter">
          {['all', 'open', 'closed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`tc-my-companion-posts__status-btn ${statusFilter === status ? 'tc-my-companion-posts__status-btn--active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : posts.length > 0 ? (
        <div className="tc-my-companion-posts__grid">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="tc-companion-manage-card"
              onClick={() => navigate(`/companions/${post.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="tc-companion-manage-card__image">
                {post.images && post.images.length > 0 ? (
                  <img src={post.images.find((img: any) => img.isCover)?.imageUrl || post.images[0].imageUrl} alt={post.title} />
                ) : (
                  <div className="tc-companion-manage-card__no-image">
                    <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/logo_gr.png" alt="Default" />
                  </div>
                )}
                <div className="tc-companion-manage-card__badges">
                  <span className={`tc-companion-manage-card__badge tc-companion-manage-card__badge--${post.business_status}`}>
                    {getStatusLabel(post.business_status || '')}
                  </span>
                </div>
              </div>
              <div className="tc-companion-manage-card__content">
                <div className="tc-companion-manage-card__dest">📍 {post.destination}</div>
                <h3 className="tc-companion-manage-card__title">{post.title}</h3>
                <div className="tc-companion-manage-card__info">
                  <div className="tc-companion-manage-card__info-item">
                    <span>📅 {formatDate(post.start_date)} - {formatDate(post.end_date)}</span>
                  </div>
                  <div className="tc-companion-manage-card__info-item">
                    <span>👥 {post._count?.companion_requests || 0} / {post.expected_members} thành viên</span>
                  </div>
                  <div className="tc-companion-manage-card__price">
                    {formatCurrency(post.estimated_cost)}
                  </div>
                </div>
              </div>
              <div className="tc-companion-manage-card__footer" onClick={(e) => e.stopPropagation()}>
                <div className="tc-companion-manage-card__row">
                  <Button 
                    variant="primary" 
                    size="small" 
                    fullWidth 
                    onClick={() => navigate(`/user/companion-posts/${post.id}/requests`)}
                  >
                    Duyệt thành viên
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small" 
                    fullWidth 
                    onClick={() => {
                      if (post.business_status === 'open') {
                        handleStatusUpdate(post.id, 'closed', 'Đã tạm ngưng đăng ký thành viên');
                      } else {
                        handleStatusUpdate(post.id, 'open', 'Đã mở lại đăng ký thành viên');
                      }
                    }}
                    disabled={post.business_status === 'completed' || post.business_status === 'cancelled'}
                  >
                    {post.business_status === 'open' ? 'Tạm Ngưng' : 'Mở Đăng Ký'}
                  </Button>
                </div>
                <div className="tc-companion-manage-card__row" style={{ marginTop: '8px' }}>
                  <Button 
                    variant="outline" 
                    size="small" 
                    fullWidth 
                    disabled={post.business_status === 'completed' || post.business_status === 'cancelled'}
                    onClick={() => setConfirmModal({
                      show: true,
                      type: 'complete',
                      postId: post.id,
                      postTitle: post.title
                    })}
                  >
                    Hoàn thành
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small" 
                    fullWidth 
                    className="tc-companion-manage-card__delete-btn"
                    onClick={() => setConfirmModal({
                      show: true,
                      type: 'delete',
                      postId: post.id,
                      postTitle: post.title
                    })}
                  >
                    Xóa bài
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Chưa có bài đăng nào"
          description="Bạn chưa tạo bất kỳ bài đăng tìm bạn đồng hành nào. Hãy bắt đầu ngay để kết nối với những người bạn mới!"
          action={
            <Button variant="primary" onClick={() => navigate('/user/companion-posts/create')}>
              Tạo bài đăng ngay
            </Button>
          }
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal(prev => ({ ...prev, show: false }))}
        title={confirmModal.type === 'delete' ? 'Xác nhận xóa bài đăng' : 'Xác nhận hoàn thành chuyến đi'}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
            {confirmModal.type === 'delete' 
              ? `Bạn có chắc chắn muốn xóa bài đăng "${confirmModal.postTitle}"? Thao tác này không thể hoàn tác.`
              : `Bạn xác nhận đã hoàn thành chuyến đi "${confirmModal.postTitle}"?`
            }
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}>
              Hủy bỏ
            </Button>
            <Button 
              variant={confirmModal.type === 'delete' ? 'danger' : 'primary'} 
              onClick={handleConfirmAction}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default MyCompanionPostsPage;
