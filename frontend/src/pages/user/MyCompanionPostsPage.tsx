import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Table, LoadingBlock 
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

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await companionService.getMyPosts({});
      if (response.success) {
        setPosts(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      try {
        const response = await companionService.deletePost(id);
        if (response.success) {
          fetchMyPosts();
          toast.success('Xóa bài đăng thành công');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa bài đăng');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      key: 'title',
      render: (post: CompanionPost) => (
        <div className="post-cell">
          <span className="post-title-link" onClick={() => navigate(`/companions/${post.id}`)}>{post.title}</span>
          <span className="post-dest">{post.destination}</span>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (post: CompanionPost) => (
        <span className="date-cell">{formatDate(post.start_date)} - {formatDate(post.end_date)}</span>
      ),
    },
    {
      title: 'Yêu cầu',
      key: 'requests',
      render: (post: any) => (
        <div className="request-count">
          <Badge variant="primary">{post._count?.companion_requests || 0} Chờ</Badge>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (post: CompanionPost) => (
        <Badge variant={
          post.business_status === 'open' ? 'success' : 
          post.business_status === 'closed' ? 'secondary' : 
          'danger'
        }>
          {post.business_status === 'open' ? 'Đang tuyển' : 
           post.business_status === 'closed' ? 'Đã đóng' : 
           'Đã hủy'}
        </Badge>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (post: CompanionPost) => (
        <div className="action-btns">
          <Button variant="outline" size="small" onClick={() => navigate(`/user/companion-posts/${post.id}/requests`)}>Duyệt</Button>
          <Button variant="outline" size="small" onClick={() => navigate(`/user/companion-posts/${post.id}/edit`)}>Sửa</Button>
          <Button variant="danger" size="small" className="btn-delete" onClick={() => handleDelete(post.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer className="my-companion-posts">
      <div className="page-header">
        <div className="header-info">
          <h1>Bài đăng đồng hành của tôi</h1>
          <p>Quản lý các chuyến đi bạn đã khởi xướng và duyệt thành viên tham gia.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/user/companion-posts/create')}>
          + Tạo bài đăng mới
        </Button>
      </div>

      <Card className="table-card">
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table 
            columns={columns} 
            data={posts} 
            emptyText="Bạn chưa tạo bài đăng đồng hành nào."
            rowKey={(record) => record.id}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default MyCompanionPostsPage;
