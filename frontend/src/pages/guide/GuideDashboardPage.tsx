import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock } from '../../components/common';
import { guideService, type GuideProfile } from '../../services/guideService';
import { useAuth } from '../../contexts/AuthContext';
import './GuideDashboardPage.css';

const GuideDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await guideService.getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching guide profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    );
  }

  return (
    <div className="guide-dashboard">
      <PageContainer>
        <div className="guide-welcome-banner">
          <div className="guide-welcome-text">
            <h1>Chào mừng trở lại, {user?.user_metadata?.full_name || 'Hướng dẫn viên'}!</h1>
            <p>Hôm nay bạn muốn làm gì để chuẩn bị cho các chuyến hành trình sắp tới?</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/guide/profile')}>
            Cập nhật hồ sơ
          </Button>
        </div>

        <div className="guide-stats-grid">
          <Card className="guide-stat-card">
            <div className="guide-stat-value">5.0</div>
            <div className="guide-stat-label">Đánh giá trung bình</div>
          </Card>
          <Card className="guide-stat-card">
            <div className="guide-stat-value">{profile?.yearsOfExperience || 0}</div>
            <div className="guide-stat-label">Năm kinh nghiệm</div>
          </Card>
          <Card className="guide-stat-card">
            <div className="guide-stat-value">0</div>
            <div className="guide-stat-label">Tours đã dẫn</div>
          </Card>
          <Card className="guide-stat-card">
            <div className="guide-stat-value">0đ</div>
            <div className="guide-stat-label">Thu nhập ước tính</div>
          </Card>
        </div>

        <div className="guide-dashboard-layout">
          <div className="guide-dashboard-main">
            <section>
              <h2 className="guide-dashboard-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Thao tác nhanh
              </h2>
              <div className="guide-quick-links">
                <Card className="guide-quick-link-card" onClick={() => navigate('/guide/profile')}>
                  <div className="guide-quick-link-icon">👤</div>
                  <div style={{ fontWeight: 600 }}>Chỉnh sửa hồ sơ</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Cập nhật kinh nghiệm & kỹ năng</div>
                </Card>
                <Card className="guide-quick-link-card" onClick={() => navigate('/guide/tours')}>
                  <div className="guide-quick-link-icon">🗺️</div>
                  <div style={{ fontWeight: 600 }}>Quản lý Tour</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Tạo và chỉnh sửa các tour của bạn</div>
                </Card>
                <Card className="guide-quick-link-card" onClick={() => navigate('/guide/tour-requests')}>
                  <div className="guide-quick-link-icon">📬</div>
                  <div style={{ fontWeight: 600 }}>Quản lý yêu cầu</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Duyệt yêu cầu tham gia từ khách</div>
                </Card>
                <Card className="guide-quick-link-card">
                  <div className="guide-quick-link-icon">⭐</div>
                  <div style={{ fontWeight: 600 }}>Đánh giá</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Xem phản hồi từ khách hàng</div>
                </Card>
              </div>
            </section>
          </div>

          <aside className="guide-dashboard-sidebar">
            <section>
              <h2 className="guide-dashboard-section-title">
                Trạng thái hồ sơ
              </h2>
              <Card>
                <div className="guide-profile-summary">
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Hiển thị công khai</span>
                    <Badge variant={profile?.verificationStatus === 'verified' ? 'success' : 'warning'}>
                      {profile?.verificationStatus === 'verified' ? 'Đang hiển thị' : 'Chờ xác minh'}
                    </Badge>
                  </div>
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Trạng thái nhận tour</span>
                    <Badge variant="success">Sẵn sàng</Badge>
                  </div>
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Khu vực hoạt động</span>
                    <span className="guide-summary-value">{profile?.workingArea || 'Chưa cập nhật'}</span>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                      Độ hoàn thiện hồ sơ: 85%
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: 'var(--color-primary)' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
};

export default GuideDashboardPage;
