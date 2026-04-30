import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Button, LoadingBlock, EmptyState, Card, Badge, TourCard } from '../../components/common';
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
  coverUrl?: string;
  bio: string;
  isAcceptingTours: boolean;
  homeProvince?: { name: string };
  familiarProvinces?: string;
  reviews: {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  tours?: {
    id: string;
    title: string;
    price: number;
    province: string;
    image: string;
    category: string;
    duration: string;
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
      const res: any = await guideService.getPublicGuideDetail(id!);
      if (res.success) {
        const guideData = res.data;
        setGuide(guideData);

        // Fetch favorite status using the ACTUAL guide profile ID
        if (user && guideData.id) {
          const favRes: any = await favoriteService.getMyFavoriteGuides();
          if (favRes.success) {
            setIsFavorited(favRes.data.some((f: any) => f.id === guideData.id));
          }
        }
      } else {
        toast.error(res.message || 'Không thể tải thông tin hướng dẫn viên');
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
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleMessageGuide = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/guides/${id}` } });
      return;
    }

    if (!guide) return;

    try {
      setMessageLoading(true);
      const res: any = await chatService.getOrCreateConversation(guide.id);
      if (res.success) {
        navigate(`/chat?id=${res.data.id}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Không thể bắt đầu trò chuyện');
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
      <div className="guide-detail-profile-header">
        <PageContainer>
          <div className="profile-header-wrapper">
            <div className="profile-cover-container">
              <div className="profile-cover-wrapper">
                {guide.coverUrl ? (
                  <img src={guide.coverUrl} alt="Cover" className="profile-cover-img" />
                ) : (
                  <div className="profile-cover-placeholder"></div>
                )}
              </div>
              
              <div className="profile-avatar-absolute-section">
                <div className="profile-avatar-container">
                  <img 
                    src={guide.avatar || 'https://via.placeholder.com/168?text=Guide'} 
                    alt={guide.name} 
                    className="profile-avatar-img"
                  />
                  <div className={`profile-status-dot ${guide.isAcceptingTours ? 'online' : 'busy'}`}></div>
                </div>
              </div>
            </div>

            <div className="profile-header-main">
              <div className="profile-avatar-spacer"></div>

              <div className="profile-info-section">
                <div className="profile-info-content">
                  <h1 className="profile-display-name">
                    {guide.name}
                    {(guide.verificationStatus === 'approved' || guide.verificationStatus === 'verified') && (
                      <span className="verified-badge-icon" title="Đã xác minh">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#1877F2"/>
                        </svg>
                      </span>
                    )}
                  </h1>
                  <div className="profile-quick-stats">
                    <div className="tc-rating-badge">
                      <span className="rating-value">{guide.rating && guide.rating > 0 ? guide.rating.toFixed(1) : '0'}</span>
                      <span className="rating-star">★</span>
                    </div>
                    <span className="stat-separator">•</span>
                    <span className="stat-item">📍 {guide.workingArea}</span>
                    <span className="stat-separator">•</span>
                    <span className="stat-item">💼 {guide.yearsOfExperience} năm kinh nghiệm</span>
                  </div>
                </div>

                <div className="profile-actions-section">
                  <Button 
                    variant="primary" 
                    size="medium" 
                    disabled={!guide.isAcceptingTours} 
                    className="contact-btn"
                    onClick={handleMessageGuide}
                    isLoading={messageLoading}
                  >
                    {guide.isAcceptingTours ? '💬 Nhắn tin ngay' : 'Tạm ngưng'}
                  </Button>
                  <Button 
                    variant="outline"
                    className={`fav-btn ${isFavorited ? 'is-favorited' : ''}`}
                    onClick={handleToggleFavorite}
                    isLoading={favoriteLoading}
                  >
                    {isFavorited ? '❤️ Đã lưu' : '🤍 Lưu'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="guide-detail-layout">
          <div className="guide-detail-content">
            {/* Bio Section */}
            <section className="guide-detail-section animate-up">
              <div className="section-header">
                <span className="section-icon">📝</span>
                <h2>Giới thiệu bản thân</h2>
              </div>
              <div className="guide-detail-bio">{guide.bio}</div>
            </section>

            {/* Languages & Skills Grid */}
            <div className="guide-detail-grid-info">
              <section className="guide-detail-section animate-up" style={{ animationDelay: '0.1s' }}>
                <div className="section-header">
                  <span className="section-icon">🗣️</span>
                  <h2>Ngôn ngữ</h2>
                </div>
                <div className="guide-detail-tags">
                  {guide.languages?.map((lang, index) => (
                    <span key={index} className="guide-detail-tag">{lang}</span>
                  ))}
                </div>
              </section>

              <section className="guide-detail-section animate-up" style={{ animationDelay: '0.2s' }}>
                <div className="section-header">
                  <span className="section-icon">🚀</span>
                  <h2>Kỹ năng</h2>
                </div>
                <div className="guide-detail-tags">
                  {guide.skills?.map((skill, index) => (
                    <span key={index} className="guide-detail-tag">{skill}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* Familiar Provinces Section */}
            <section className="guide-detail-section animate-up" style={{ animationDelay: '0.3s' }}>
              <div className="section-header">
                <span className="section-icon">🗺️</span>
                <h2>Khu vực quen thuộc khác</h2>
              </div>
              <div className="guide-detail-bio">
                {guide.familiarProvinces || 'Chưa cập nhật thông tin khu vực lân cận.'}
              </div>
            </section>
          </div>

          <aside className="guide-detail-sidebar">
            <Card className="guide-detail-sidebar-card sticky-sidebar animate-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="sidebar-title">Thông tin tóm tắt</h3>
              
              <div className="summary-info-list">
                <div className="summary-item">
                  <div className="summary-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Khu vực hoạt động:
                  </div>
                  <div className="summary-value">{guide.workingArea}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    Kinh nghiệm:
                  </div>
                  <div className="summary-value">{guide.yearsOfExperience} năm</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Đánh giá:
                  </div>
                  <div className="summary-value">
                    <div className="tc-rating-badge small">
                      <span className="rating-value">{guide.rating?.toFixed(1) || '0.0'}</span>
                      <span className="rating-star">★</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="sidebar-note">
                Sẵn sàng đồng hành cùng bạn trên mọi nẻo đường tại {guide.workingArea}.
              </p>

              <div className="sidebar-actions">
                <Button variant="primary" fullWidth onClick={handleMessageGuide} isLoading={messageLoading} size="large">
                  Nhắn tin ngay
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  size="large"
                  onClick={() => {
                    const el = document.getElementById('guide-tours-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Xem Tour của Guide
                </Button>
              </div>
            </Card>
          </aside>
        </div>

        {/* Full Width Sections */}
        <div className="full-width-sections">
          {/* Tours Section */}
          <section id="guide-tours-section" className="tours-section animate-up" style={{ animationDelay: '0.4s' }}>
            <div className="section-header">
              <span className="section-icon">🎒</span>
              <h2>Tất cả Tour của {guide.name}</h2>
            </div>

            {guide.tours && guide.tours.length > 0 ? (
              <div className="tours-grid-premium">
                {guide.tours.map(tour => (
                  <TourCard 
                    key={tour.id} 
                    tour={tour} 
                    onClick={() => navigate(`/tours/${tour.id}`)} 
                  />
                ))}
              </div>
            ) : (
              <div className="guide-detail-section" style={{ textAlign: 'center', padding: '40px', background: '#f8fafc' }}>
                <p style={{ color: '#64748b' }}>Hiện chưa có tour nào được đăng tải bởi hướng dẫn viên này.</p>
              </div>
            )}
          </section>

          {/* Reviews Section */}
          <section className="guide-detail-section animate-up" style={{ animationDelay: '0.5s' }}>
            <div className="section-header">
              <span className="section-icon">💬</span>
              <h2>Đánh giá từ du khách ({guide.reviews?.length || 0})</h2>
            </div>
            <div className="guide-detail-reviews-list">
              {guide.reviews && guide.reviews.length > 0 ? (
                guide.reviews.map(review => (
                  <div key={review.id} className="guide-review-item">
                    <div className="guide-review-header">
                      <div className="guide-review-user">
                        <div className="guide-review-avatar">
                          <img src={review.avatar || 'https://via.placeholder.com/40'} alt={review.user} />
                        </div>
                        <div>
                          <div className="guide-review-name">{review.user}</div>
                          <div className="guide-review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>
                      <div className="guide-review-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div className="guide-review-comment">{review.comment}</div>
                  </div>
                ))
              ) : (
                <div className="empty-reviews">
                  Chưa có đánh giá nào cho hướng dẫn viên này.
                </div>
              )}
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
};

export default GuideDetailPage;
