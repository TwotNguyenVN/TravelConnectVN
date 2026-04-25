import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { useToast } from '../../contexts/ToastContext';

interface ReviewItem {
  id: string;
  type: 'TOUR' | 'GUIDE' | 'POST';
  targetName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  visibilityStatus: 'visible' | 'hidden';
  createdAt: string;
}

export const AdminReviewManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'post' | 'guide' | 'tour'>('all');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviewsAdmin();
      // Combine tours and guides
      const combined: ReviewItem[] = [
        ...response.data.tours,
        ...response.data.guides
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReviews(combined);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast('Không thể tải danh sách đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (review: ReviewItem) => {
    try {
      const newStatus = review.visibilityStatus === 'visible' ? 'hidden' : 'visible';
      await reviewService.updateReviewVisibility(review.type as any, review.id, newStatus);
      
      setReviews(prev => prev.map(r => 
        (r.id === review.id && r.type === review.type) 
        ? { ...r, visibilityStatus: newStatus as any } 
        : r
      ));
      
      toast(`Đã ${newStatus === 'hidden' ? 'ẩn' : 'hiển thị'} đánh giá`, 'success');
    } catch (error) {
      toast('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tour') return r.type === 'TOUR';
    if (activeTab === 'guide') return r.type === 'GUIDE';
    if (activeTab === 'post') return r.type === 'POST';
    return true;
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--tc-text-primary)' }}>
          Quản lý Đánh giá & Bình luận
        </h1>
        <p style={{ color: 'var(--tc-text-secondary)', marginTop: '4px' }}>
          Xem và quản lý tất cả phản hồi từ người dùng trên toàn hệ thống.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--tc-border)',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'post', label: 'Bài tìm bạn' },
          { id: 'guide', label: 'Hướng dẫn viên' },
          { id: 'tour', label: 'Tour' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--tc-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--tc-text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px', 
          background: 'white', 
          borderRadius: '16px',
          border: '1px solid var(--tc-border)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ color: 'var(--tc-text-primary)' }}>Không có đánh giá nào</h3>
          <p style={{ color: 'var(--tc-text-secondary)' }}>Hiện chưa có phản hồi nào trong mục này.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReviews.map(review => (
            <div key={`${review.type}-${review.id}`} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--tc-border)',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              opacity: review.visibilityStatus === 'hidden' ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={review.userAvatar || 'https://i.pravatar.cc/150?u=' + review.userName} 
                alt={review.userName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      backgroundColor: review.type === 'TOUR' ? '#e0f2fe' : review.type === 'GUIDE' ? '#fef3c7' : '#f3e8ff',
                      color: review.type === 'TOUR' ? '#0369a1' : review.type === 'GUIDE' ? '#92400e' : '#7e22ce',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}>
                      {review.type === 'TOUR' ? 'TOUR' : review.type === 'GUIDE' ? 'HDV' : 'BÀI VIẾT'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{review.userName}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--tc-text-secondary)', margin: '2px 0' }}>
                      Đánh giá cho: <strong style={{ color: 'var(--tc-text-primary)' }}>{review.targetName}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '700' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tc-text-secondary)', marginTop: '4px' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#334155'
                }}>
                  {review.comment || '(Không có nội dung bình luận)'}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button 
                    onClick={() => handleToggleVisibility(review)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: review.visibilityStatus === 'hidden' ? '#10b981' : '#f43f5e',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {review.visibilityStatus === 'hidden' ? 'Hiện đánh giá' : 'Ẩn đánh giá'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
