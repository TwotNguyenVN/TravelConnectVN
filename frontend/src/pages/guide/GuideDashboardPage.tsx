import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock } from '../../components/common';
import { guideService, type GuideProfile } from '../../services/guideService';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import './GuideDashboardPage.css';

const GuideDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Personal Profile State (for completion calculation)
  const [personalData, setPersonalData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guideRes, userRes] = await Promise.all([
        guideService.getMyProfile(),
        userService.getProfile()
      ]);
      
      if (guideRes.success && guideRes.data) {
        setProfile(guideRes.data);
      }
      
      if (userRes.success && userRes.data) {
        const data = userRes.data;
        setPersonalData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          gender: data.gender || '',
          avatarUrl: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (status: 'visible' | 'hidden') => {
    if (!profile) return;
    try {
      const response = await guideService.updateProfile({
        ...profile,
        visibilityStatus: status
      });
      if (response.success) {
        setProfile(prev => prev ? { ...prev, visibilityStatus: status } : null);
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const calculateCompletion = () => {
    const missing: string[] = [];
    let score = 0;
    const total = 8; // 8 items to check

    if (personalData && personalData.fullName) score++; else missing.push('Họ và tên');
    if (personalData && personalData.avatarUrl) score++; else missing.push('Ảnh đại diện');
    if (personalData && personalData.phone) score++; else missing.push('Số điện thoại');
    
    if (profile && profile.bio && profile.bio.length > 20) score++; else missing.push('Giới thiệu bản thân (tối thiểu 20 ký tự)');
    if (profile && profile.yearsOfExperience !== undefined) score++; else missing.push('Số năm kinh nghiệm');
    if (profile && profile.homeProvinceId) score++; else missing.push('Tỉnh thành hoạt động chính');
    if (profile && profile.guideLanguages && profile.guideLanguages.length > 0) score++; else missing.push('Ngôn ngữ thông thạo');
    if (profile && (profile.verificationStatus === 'approved' || profile.verificationStatus === 'verified')) score++; else missing.push('Xác minh danh tính');

    return {
      percent: Math.round((score / total) * 100),
      missing
    };
  };

  const completion = calculateCompletion();
  const isVerified = profile?.verificationStatus === 'approved' || profile?.verificationStatus === 'verified';

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
            <h1>Chào mừng trở lại, {personalData.fullName || user?.user_metadata?.full_name || 'Hướng dẫn viên'}!</h1>
            <p>Hôm nay bạn muốn làm gì để chuẩn bị cho các chuyến hành trình sắp tới?</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => navigate('/guide/profile')}>
              Hồ sơ nghiệp vụ
            </Button>
            <Button variant="secondary" onClick={() => navigate('/guide/tours/create')}>
              Tạo Tour mới
            </Button>
          </div>
        </div>

        {completion.percent < 100 && (
          <div className="profile-completeness-banner animate-up">
            <div className="completeness-banner-header">
              <div className="completeness-title">
                <span className="warning-icon">⚠️</span>
                <div>
                  <h3>Hồ sơ Hướng dẫn viên chưa hoàn thiện ({completion.percent}%)</h3>
                  <p>Hồ sơ và các tour của bạn đang bị ẩn. Vui lòng bổ sung đầy đủ các phần còn thiếu dưới đây để hồ sơ hiển thị công khai 100%.</p>
                </div>
              </div>
              <div className="completeness-percentage">
                <div className="percentage-circle" style={{ '--percent': completion.percent } as React.CSSProperties}>
                  <span className="percentage-text">{completion.percent}%</span>
                </div>
              </div>
            </div>
            
            <div className="completeness-checklist-section">
              <h4>Các phần còn thiếu cần bổ sung (Nhấp để đi đến thiết lập):</h4>
              <div className="completeness-checklist-grid">
                {completion.missing.map((item, idx) => {
                  let action = () => navigate('/guide/profile');
                  let icon = "📝";
                  if (item === 'Họ và tên') {
                    icon = "👤";
                  } else if (item === 'Ảnh đại diện') {
                    icon = "🖼️";
                  } else if (item === 'Số điện thoại') {
                    icon = "📞";
                  } else if (item === 'Giới thiệu bản thân (tối thiểu 20 ký tự)') {
                    icon = "✍️";
                  } else if (item === 'Số năm kinh nghiệm') {
                    icon = "💼";
                  } else if (item === 'Tỉnh thành hoạt động chính') {
                    icon = "📍";
                  } else if (item === 'Ngôn ngữ thông thạo') {
                    icon = "🗣️";
                  } else if (item === 'Xác minh danh tính') {
                    icon = "🪪";
                  }
                  
                  return (
                    <button 
                      key={idx} 
                      className="completeness-checklist-item" 
                      onClick={action}
                      title={`Click để thiết lập ${item}`}
                    >
                      <span className="item-icon">{icon}</span>
                      <span className="item-text">{item}</span>
                      <span className="item-arrow">→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
            <section style={{ marginTop: '0px' }}>
              <h2 className="guide-dashboard-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Thao tác nhanh
              </h2>
              <div className="guide-quick-links">
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
                <Card className="guide-quick-link-card" onClick={() => navigate('/guide/profile')}>
                  <div className="guide-quick-link-icon">✅</div>
                  <div style={{ fontWeight: 600 }}>Xác minh tài khoản</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Gửi hồ sơ và xem trạng thái xác minh</div>
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
                Trạng thái hoạt động
              </h2>
              <Card>
                <div className="guide-profile-summary">
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Xác minh danh tính</span>
                    <Badge variant={isVerified ? 'success' : 'warning'}>
                      {isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </Badge>
                  </div>
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Hiển thị hồ sơ</span>
                    {!isVerified ? (
                      <Badge variant="danger">Ẩn</Badge>
                    ) : (
                      <div className="visibility-toggle">
                        <button 
                          className={`visibility-btn ${profile?.visibilityStatus === 'visible' ? 'active' : ''}`}
                          onClick={() => handleToggleVisibility('visible')}
                        >
                          Hiện
                        </button>
                        <button 
                          className={`visibility-btn ${profile?.visibilityStatus === 'hidden' ? 'active' : ''}`}
                          onClick={() => handleToggleVisibility('hidden')}
                        >
                          Ẩn
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="guide-summary-item">
                    <span className="guide-summary-label">Vùng hoạt động</span>
                    <span className="guide-summary-value">{profile?.workingArea || profile?.homeProvince?.name || 'Chưa cập nhật'}</span>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                      Độ hoàn thiện hồ sơ: {completion.percent}%
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${completion.percent}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                    </div>
                    {completion.percent < 100 && (
                      <ul className="completion-notes">
                        {completion.missing.slice(0, 3).map((item, idx) => (
                          <li key={idx}>Thiếu {item}</li>
                        ))}
                        {completion.missing.length > 3 && <li>Và {completion.missing.length - 3} mục khác...</li>}
                      </ul>
                    )}
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
