import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Input, Select, LoadingBlock, EmptyState 
} from '../../components/common';
import { companionService } from '../../services/companionService';
import type { CompanionPost } from '../../services/companionService';
import { DEFAULT_AVATAR } from '../../constants/images';
import './CompanionListPage.css';

const CompanionListPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    destination: '',
    status: 'open',
  });

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await companionService.getPublicPosts(filters);
      if (response.success && response.data) {
        setPosts(response.data.items || []);
      } else {
        setError('Không tìm thấy dữ liệu bài đăng.');
      }
    } catch (err) {
      console.error('Error fetching companion posts:', err);
      setError('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại đường truyền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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

  return (
    <PageContainer className="companion-list-page">
      <div className="companion-header">
        <div className="header-main-content">
          <h1>Tìm bạn đồng hành</h1>
          <p>Kết nối với những người cùng đam mê xê dịch, cùng nhau khám phá những vùng đất mới.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/user/companion-posts/create')}
          className="create-post-btn"
        >
          ➕ Đăng bài ngay
        </Button>
      </div>

      <div className="filter-section">
        <div className="filter-grid">
          <Input
            name="destination"
            label="Điểm đến"
            placeholder="Bạn muốn đi đâu?"
            value={filters.destination}
            onChange={handleFilterChange}
          />
          <Select
            name="status"
            label="Trạng thái"
            options={[
              { value: 'open', label: 'Đang mở' },
              { value: 'closed', label: 'Đã đóng' },
              { value: 'completed', label: 'Đã hoàn tất' },
            ]}
            value={filters.status}
            onChange={handleFilterChange}
          />
          <div className="filter-actions">
            <Button variant="primary" onClick={fetchPosts}>Tìm kiếm</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="companion-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <LoadingBlock key={i} height={320} />)}
        </div>
      ) : error ? (
        <EmptyState 
          title="Có lỗi xảy ra" 
          description={error}
          action={<Button variant="primary" onClick={fetchPosts}>Thử lại</Button>}
        />
      ) : posts.length > 0 ? (
        <div className="companion-grid">
          {posts.map(post => (
            <Card key={post.id} className="companion-card" onClick={() => navigate(`/companions/${post.id}`)}>
              <div className="post-image-container">
                {post.images && post.images.length > 0 ? (
                  <img 
                    src={post.images.find((img: any) => img.isCover)?.imageUrl || post.images[0].imageUrl} 
                    alt={post.title} 
                    className="post-cover"
                  />
                ) : (
                  <div className="post-no-image">
                    <img src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/logo_gr.png" alt="Default" />
                  </div>
                )}
                <div className="post-badge-overlay">
                  <Badge variant={
                    post.business_status === 'open' ? 'success' : 
                    post.business_status === 'completed' ? 'primary' :
                    'secondary'
                  }>
                    {post.business_status === 'open' ? 'Đang tuyển' : 
                     post.business_status === 'closed' ? 'Đã đủ người' :
                     post.business_status === 'completed' ? 'Đã hoàn tất' :
                     'Đã hủy'}
                  </Badge>
                </div>
              </div>

              <div className="post-content">
                <div className="post-header">
                  <span className="post-date">{formatDate(post.created_at)}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <div className="post-info">
                  <div className="info-item">
                    <i className="lucide-map-pin"></i>
                    <span>{post.destination}</span>
                  </div>
                  <div className="info-item">
                    <i className="lucide-calendar"></i>
                    <span>{formatDate(post.start_date)} - {formatDate(post.end_date)}</span>
                  </div>
                  <div className="info-item">
                    <i className="lucide-users"></i>
                    <span>{post._count?.companion_requests || 0} / {post.expected_members} thành viên</span>
                  </div>
                  <div className="info-item">
                    <i className="lucide-banknote"></i>
                    <span>{formatCurrency(post.estimated_cost)}</span>
                  </div>
                </div>
                <div className="post-footer">
                  <div 
                    className="post-author"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${post.user_id}`);
                    }}
                  >
                    <img src={post.users?.avatar_url || DEFAULT_AVATAR} alt={post.users?.full_name} />
                    <span>{post.users?.full_name}</span>
                  </div>
                  <Button variant="outline" size="small">Chi tiết</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Không tìm thấy bài đăng nào" 
          description="Hãy thử thay đổi bộ lọc hoặc quay lại sau nhé."
          action={<Button variant="primary" onClick={() => setFilters({ destination: '', status: 'open' })}>Xóa bộ lọc</Button>}
        />
      )}
    </PageContainer>
  );
};

export default CompanionListPage;
