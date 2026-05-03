import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Button, LoadingBlock, EmptyState, Card, Badge } from '../../components/common';
import { userService } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import './PublicProfilePage.css';

interface PublicProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  coverUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  region: string;
  homeProvince: string;
  joinedAt: string;
  facebookUrl: string;
  gender: string;
  preferences?: {
    travelStyle?: string;
    preferredLanguage?: string;
    otherLanguages?: string;
  };
  guideProfile: {
    id: string;
    isVerified: boolean;
  } | null;
  companionPosts: {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: string;
    images: any;
  }[];
}

export const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res: any = await userService.getPublicProfile(id!);
        if (res.success) {
          setProfile(res.data);
        } else {
          toast.error(res.message || 'Không thể tải thông tin hồ sơ');
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
        toast.error('Đã có lỗi xảy ra khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) return (
    <div className="public-profile-page">
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    </div>
  );

  if (!profile) return (
    <PageContainer>
      <EmptyState 
        title="Không tìm thấy hồ sơ" 
        description="Hồ sơ người dùng không tồn tại hoặc đã bị xóa." 
        action={<Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>}
      />
    </PageContainer>
  );

  return (
    <div className="public-profile-page">
      {/* Premium Header Section */}
      <div className="profile-header-container">
        <PageContainer>
          <div className="profile-header-wrapper">
            <div className="profile-cover-section">
              <div className="profile-cover-wrapper">
                {profile.coverUrl ? (
                  <img src={profile.coverUrl} alt="Cover" className="profile-cover-img" />
                ) : (
                  <div className="profile-cover-placeholder" />
                )}
              </div>
              
              <div className="profile-avatar-absolute-section">
                <div className="profile-avatar-container">
                  <img 
                    src={profile.avatarUrl || DEFAULT_AVATAR} 
                    alt={profile.fullName} 
                    className="profile-avatar-img" 
                  />
                  {profile.guideProfile && (
                    <div className="guide-status-badge" title="Hướng dẫn viên">
                      <Badge variant={profile.guideProfile.isVerified ? "success" : "warning"} size="small">
                        HDV {profile.guideProfile.isVerified && '✓'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-header-main">
              <div className="profile-avatar-spacer"></div>

              <div className="profile-info-section">
                <div className="profile-info-content">
                  <h1 className="profile-display-name">
                    {profile.fullName}
                    {profile.guideProfile?.isVerified && (
                      <span className="verified-badge-icon" title="Đã xác minh">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#1877F2"/>
                        </svg>
                      </span>
                    )}
                  </h1>
                  <div className="profile-quick-stats">
                    <span className="stat-item">Thành viên từ {formatDate(profile.joinedAt)}</span>
                    {(profile.homeProvince || profile.region) && (
                      <>
                        <span className="stat-separator">•</span>
                        <span className="stat-item">📍 {profile.homeProvince || profile.region}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="profile-actions-section">
                  {profile.guideProfile && (
                    <Button 
                      variant="primary" 
                      size="medium" 
                      onClick={() => navigate(`/guides/${profile.guideProfile?.id}`)}
                      className="view-guide-btn"
                    >
                      Xem hồ sơ HDV
                    </Button>
                  )}
                  {profile.facebookUrl && (
                    <Button 
                      variant="outline" 
                      size="medium"
                      onClick={() => window.open(profile.facebookUrl, '_blank')}
                      className="fb-action-btn"
                    >
                      Facebook
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="profile-content-layout">
          {/* Left Column: Sidebar with all details */}
          <div className="profile-sidebar">
            <Card className="profile-info-card">
              <h3 className="sidebar-title">Giới thiệu</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="icon">📍</span>
                  <div className="info-label">
                    <p className="label">Khu vực</p>
                    <p className="value">{profile.homeProvince || profile.region || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">👤</span>
                  <div className="info-label">
                    <p className="label">Giới tính</p>
                    <p className="value">{profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}</p>
                  </div>
                </div>
                {profile.dateOfBirth && (
                  <div className="info-item">
                    <span className="icon">🎂</span>
                    <div className="info-label">
                      <p className="label">Ngày sinh</p>
                      <p className="value">{formatBirthDate(profile.dateOfBirth)}</p>
                    </div>
                  </div>
                )}
                {profile.phone && (
                  <div className="info-item">
                    <span className="icon">📞</span>
                    <div className="info-label">
                      <p className="label">Số điện thoại</p>
                      <p className="value">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {(profile.preferences?.travelStyle || profile.preferences?.preferredLanguage) && (
                <div className="sidebar-divider"></div>
              )}

              {profile.preferences?.travelStyle && (
                <div className="sidebar-section">
                  <p className="sidebar-section-title">Phong cách du lịch</p>
                  <div className="style-tags">
                    {profile.preferences.travelStyle.split(',').map((style, idx) => (
                      <span key={idx} className="style-tag">{style.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {(profile.preferences?.preferredLanguage || profile.preferences?.otherLanguages) && (
                <div className="sidebar-section">
                  <p className="sidebar-section-title">Ngôn ngữ</p>
                  <div className="language-list">
                    {profile.preferences.preferredLanguage && (
                      <Badge variant="secondary" className="lang-badge">
                        {profile.preferences.preferredLanguage}
                      </Badge>
                    )}
                    {profile.preferences.otherLanguages && profile.preferences.otherLanguages.split(',').map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="lang-badge">
                        {lang.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="sidebar-divider"></div>

              <div className="sidebar-social-actions">
                {profile.facebookUrl && (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="social-btn facebook"
                    onClick={() => window.open(profile.facebookUrl, '_blank')}
                  >
                    <span className="btn-icon-svg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    Facebook
                  </Button>
                )}
                {profile.phone && (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="social-btn zalo"
                    onClick={() => window.open(`https://zalo.me/${profile.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                  >
                    <span className="btn-icon-svg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 5.8 2 10.5c0 2.5 1.2 4.7 3.2 6.2-.2 1.3-1 3.3-1 3.3 0 .1.1.2.2.2s.2 0 .3-.1l3.5-2.2c1.2.4 2.5.6 3.8.6 5.523 0 10-3.8 10-8.5S17.523 2 12 2z" fill="white"/>
                      </svg>
                    </span>
                    Zalo
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Activities */}
          <div className="profile-main-content">
            <div className="section-header-row">
              <h3 className="section-title">Bài đăng tìm bạn đồng hành</h3>
            </div>
            
            {profile.companionPosts.length > 0 ? (
              <div className="companion-posts-grid">
                {profile.companionPosts.map(post => {
                  let coverImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
                  
                  if (post.images) {
                    if (typeof post.images === 'string') {
                      try {
                        const parsed = JSON.parse(post.images);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          const firstImg = parsed[0];
                          coverImage = typeof firstImg === 'string' ? firstImg : (firstImg.imageUrl || coverImage);
                        }
                      } catch (e) {}
                    } else if (Array.isArray(post.images) && post.images.length > 0) {
                      const firstImg = post.images[0];
                      coverImage = typeof firstImg === 'string' ? firstImg : (firstImg.imageUrl || coverImage);
                    }
                  }
                    
                  return (
                    <Card key={post.id} className="mini-companion-card" onClick={() => navigate(`/companions/${post.id}`)}>
                      <div className="card-image">
                        <img src={coverImage} alt={post.title} />
                        <Badge variant={post.status === 'open' ? 'success' : 'secondary'} className="post-status">
                          {post.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                        </Badge>
                      </div>
                      <div className="card-body">
                        <h4>{post.title}</h4>
                        <p className="destination">📍 {post.destination}</p>
                        <p className="dates">📅 {formatDate(post.startDate)}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="empty-activity">
                <p>Chưa có bài đăng tìm bạn đồng hành nào.</p>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
