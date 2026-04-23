import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Button, LoadingBlock, EmptyState, Card } from '../../components/common';
import { guideService } from '../../services/guideService';
import favoriteService from '../../services/favoriteService';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './GuideDetailPage.css';

interface GuideDetail {
  id: string;
  name: string;
  avatar: string;
  workingArea: string;
  yearsOfExperience: number;
  rating: number;
  verificationStatus: string;
  languages: string[];
  skills: string[];
  bio: string;
  isAcceptingTours: boolean;
  reviews: {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const GuideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGuideDetail = async () => {
    try {
      setLoading(true);
      const data: any = await guideService.getPublicGuideDetail(id!);
      setGuide(data);

      if (user && id) {
        const favRes: any = await favoriteService.getMyFavoriteGuides();
        if (favRes.success) {
          setIsFavorited(favRes.data.some((f: any) => f.id === id));
        }
      }
    } catch (error) {
      console.error('Error fetching guide detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGuideDetail();
    }
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/guides/${id}` } });
      return;
    }

    if (!id) return;

    try {
      setFavoriteLoading(true);
      if (isFavorited) {
        const res: any = await favoriteService.removeGuideFavorite(id);
        if (res.success) {
          setIsFavorited(false);
          toast.success('Đã bỏ lưu hướng dẫn viên');
        }
      } else {
        const res: any = await favoriteService.addGuideFavorite(id);
        if (res.success) {
          setIsFavorited(true);
          toast.success('Đã lưu hướng dẫn viên vào danh sách yêu thích');
        }
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleMessageGuide = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/guides/${id}` } });
      return;
    }

    if (!id) return;

    try {
      setMessageLoading(true);
      const res = await chatService.createDirect(id);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error('Không thể tạo cuộc trò chuyện');
      }
    } catch (err: any) {
      console.error('Error starting chat:', err);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="guide-detail-page">
        <PageContainer>
          <LoadingBlock />
        </PageContainer>
      </div>
    );
  }

  if (!guide) {
    return (
      <PageContainer>
        <EmptyState 
          title="Không tìm thấy hướng dẫn viên" 
          description="Hồ sơ này không tồn tại hoặc đã bị gỡ bỏ."
          action={
            <Button onClick={() => navigate('/guides')}>Quay lại danh sách</Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <div className="guide-detail-page">
      <div className="guide-detail-header">
        <PageContainer>
          <div className="guide-detail-header-content">
            <img 
              src={guide.avatar || 'https://via.placeholder.com/160?text=Guide'} 
              alt={guide.name} 
              className="guide-detail-avatar"
            />
            <div className="guide-detail-main-info">
              <h1 className="guide-detail-name">
                {guide.name}
                {guide.verificationStatus === 'approved' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Đã xác minh</title>

                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="var(--color-success)"/>
                  </svg>
                )}
              </h1>
              <div className="guide-detail-meta">
                <div className="guide-detail-meta-item">
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {guide.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="guide-detail-meta-item">
                  📍 {guide.workingArea}
                </div>
                <div className="guide-detail-meta-item">
                  💼 {guide.yearsOfExperience} năm kinh nghiệm
                </div>
              </div>
            </div>
            <div className="guide-detail-actions" style={{ display: 'flex', gap: '12px' }}>
              <Button 
                variant="outline"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  borderColor: isFavorited ? 'var(--color-danger)' : 'var(--color-border)',
                  color: isFavorited ? 'var(--color-danger)' : 'var(--color-text-primary)'
                }}
                onClick={handleToggleFavorite}
                isLoading={favoriteLoading}
              >
                {isFavorited ? '❤️ Đã lưu' : '🤍 Lưu'}
              </Button>
              <Button size="large" disabled={!guide.isAcceptingTours}>
                {guide.isAcceptingTours ? 'Liên hệ đặt Tour' : 'Tạm ngưng nhận Tour'}
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="guide-detail-layout">
          <div className="guide-detail-content">
            <section className="guide-detail-section">
              <h2>Giới thiệu bản thân</h2>
              <div className="guide-detail-bio">{guide.bio}</div>
            </section>

            <section className="guide-detail-section">
              <h2>Ngôn ngữ thông thạo</h2>
              <div className="guide-detail-tags">
                {guide.languages?.map((lang, index) => (
                  <span key={index} className="guide-detail-tag">{lang}</span>
                ))}
              </div>
            </section>

            <section className="guide-detail-section">
              <h2>Kỹ năng chuyên môn</h2>
              <div className="guide-detail-tags">
                {guide.skills?.map((skill, index) => (
                  <span key={index} className="guide-detail-tag">{skill}</span>
                ))}
              </div>
            </section>

            <section className="guide-detail-section">
              <h2>Đánh giá từ khách du lịch ({guide.reviews?.length || 0})</h2>
              <div className="guide-detail-reviews-list">
                {guide.reviews && guide.reviews.length > 0 ? (
                  guide.reviews.map(review => (
                    <div key={review.id} className="guide-review-item">
                      <div className="guide-review-header">
                        <div className="guide-review-user">
                          <div className="guide-review-avatar">
                            {review.avatar ? (
                              <img src={review.avatar} alt={review.user} />
                            ) : (
                              review.user?.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="guide-review-name">{review.user}</div>
                            <div className="guide-review-date">
                              {review.date ? new Date(review.date).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div style={{ color: '#fbbf24' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {review.comment}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--tc-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    Chưa có đánh giá nào.
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="guide-detail-sidebar">
            <Card className="guide-detail-sidebar-card">
              <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Trạng thái hoạt động</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: guide.isAcceptingTours ? 'var(--color-success)' : 'var(--color-error)' 
                }}></div>
                <span style={{ fontWeight: 600 }}>
                  {guide.isAcceptingTours ? 'Đang nhận Tour' : 'Đang bận'}
                </span>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Hướng dẫn viên này có thể hỗ trợ bạn thiết kế lịch trình riêng và dẫn tour tại khu vực {guide.workingArea}.
              </p>
              
              <Button fullWidth variant="outline" style={{ marginBottom: '12px' }} onClick={handleMessageGuide} isLoading={messageLoading}>
                Gửi tin nhắn
              </Button>
              <Button fullWidth>
                Xem các Tour đang dẫn
              </Button>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
};

export default GuideDetailPage;
