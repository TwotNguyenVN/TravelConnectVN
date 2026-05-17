import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock, Input } from '../../components/common';
import { guideService, type GuideProfile } from '../../services/guideService';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import './GuideDashboardPage.css';

const GuideDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Personal Profile State
  const [personalData, setPersonalData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
  });
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [personalMessage, setPersonalMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setPersonalMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 2MB.' });
      return;
    }

    setIsUploading(true);
    setPersonalMessage(null);

    try {
      const response = await userService.updateAvatar(file);
      if (response.success && response.data) {
        setPersonalData(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }));
        await refreshProfile();
        setPersonalMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
      }
    } catch (err: any) {
      setPersonalMessage({ type: 'error', text: 'Lỗi khi tải ảnh lên.' });
    } finally {
      setIsUploading(false);
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

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Phone number validation (digits only)
    if (personalData.phone) {
      if (!/^[0-9]+$/.test(personalData.phone)) {
        setPersonalMessage({ type: 'error', text: 'Số điện thoại chỉ được phép chứa các ký tự số (không chứa chữ hoặc ký tự đặc biệt)' });
        return;
      }
    }

    // 2. Date of Birth validation (valid date, year >= 1950, not in the future)
    if (personalData.dateOfBirth) {
      const dob = new Date(personalData.dateOfBirth);
      if (isNaN(dob.getTime())) {
        setPersonalMessage({ type: 'error', text: 'Ngày sinh không hợp lệ' });
        return;
      }
      const year = dob.getFullYear();
      if (year < 1950) {
        setPersonalMessage({ type: 'error', text: 'Năm sinh không được trước năm 1950' });
        return;
      }
      if (dob > new Date()) {
        setPersonalMessage({ type: 'error', text: 'Ngày sinh không được ở tương lai' });
        return;
      }
    }

    setSavingPersonal(true);
    setPersonalMessage(null);
    
    try {
      await userService.updateProfile(personalData);
      await refreshProfile();
      setPersonalMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (err: any) {
      setPersonalMessage({ type: 'error', text: err.message || 'Lỗi khi cập nhật thông tin.' });
    } finally {
      setSavingPersonal(false);
    }
  };

  const calculateCompletion = () => {
    if (!profile || !personalData) return { percent: 0, missing: [] };
    
    const missing: string[] = [];
    let score = 0;
    const total = 8; // 8 items to check

    if (personalData.fullName) score++; else missing.push('Họ và tên');
    if (personalData.avatarUrl) score++; else missing.push('Ảnh đại diện');
    if (personalData.phone) score++; else missing.push('Số điện thoại');
    if (profile.bio && profile.bio.length > 20) score++; else missing.push('Giới thiệu bản thân (tối thiểu 20 ký tự)');
    if (profile.yearsOfExperience !== undefined) score++; else missing.push('Số năm kinh nghiệm');
    if (profile.homeProvinceId) score++; else missing.push('Tỉnh thành hoạt động chính');
    if (profile.guideLanguages && profile.guideLanguages.length > 0) score++; else missing.push('Ngôn ngữ thông thạo');
    if (profile.verificationStatus === 'approved' || profile.verificationStatus === 'verified') score++; else missing.push('Xác minh danh tính');

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
            {/* Personal Information Section merged from ProfilePage */}
            <section className="dashboard-personal-section">
              <h2 className="guide-dashboard-section-title">
                <span style={{ marginRight: '8px' }}>👤</span> Thông tin cá nhân
              </h2>
              <Card className="personal-info-card">
                <form onSubmit={handleSavePersonal}>
                  <div className="personal-header-row">
                    <div className="personal-avatar-edit" onClick={handleAvatarClick}>
                      <img src={personalData.avatarUrl || DEFAULT_AVATAR} alt="Avatar" />
                      <div className="avatar-overlay">📷</div>
                      {isUploading && <div className="avatar-spinner"></div>}
                    </div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} accept="image/*" />
                    
                    <div className="personal-basic-info">
                      <div className="info-grid">
                        <Input
                          label="Họ và tên"
                          name="fullName"
                          value={personalData.fullName}
                          onChange={handlePersonalChange}
                          fullWidth
                          required
                        />
                        <Input
                          label="Số điện thoại"
                          name="phone"
                          value={personalData.phone}
                          onChange={handlePersonalChange}
                          fullWidth
                          required
                        />
                      </div>
                      
                      <div className="info-grid">
                        <Input
                          label="Ngày sinh"
                          name="dateOfBirth"
                          type="date"
                          value={personalData.dateOfBirth}
                          onChange={handlePersonalChange}
                          fullWidth
                          required
                        />
                        <div className="tc-input-container tc-input--full-width">
                          <label className="tc-input-label">Giới tính</label>
                          <select 
                            name="gender" 
                            value={personalData.gender} 
                            onChange={handlePersonalChange}
                            className="tc-input-field"
                            style={{ width: '100%', outline: 'none' }}
                            required
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {personalMessage && (
                    <div className={`dashboard-message ${personalMessage.type}`} style={{ marginTop: '16px' }}>
                      {personalMessage.text}
                    </div>
                  )}

                  <div className="personal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" isLoading={savingPersonal}>
                      Lưu thông tin cá nhân
                    </Button>
                  </div>
                </form>
              </Card>
            </section>

            <section style={{ marginTop: '32px' }}>
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
                <Card className="guide-quick-link-card" onClick={() => navigate('/guide/verification')}>
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
                    <span className="guide-summary-value">{profile?.workingArea || profile?.home_province?.name || 'Chưa cập nhật'}</span>
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
