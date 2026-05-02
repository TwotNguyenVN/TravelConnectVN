import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card/Card';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { LoadingBlock } from '../../components/common';
import { supabase } from '../../utils/supabase';
import { userService } from '../../services/userService';
import { guideService } from '../../services/guideService'; 
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import './Profile.css';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
    coverUrl: '',
    region: '',
    homeProvinceId: '' as string | number,
    travelStyle: '',
    preferredLanguageId: '' as string | number,
    otherLanguages: '', // Stores other languages as comma-separated string
    facebookUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  const [provinces, setProvinces] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);

  const styleSuggestions = ['Nghỉ dưỡng', 'Khám phá', 'Phượt', 'Chụp ảnh', 'Ăn uống', 'Tiết kiệm', 'Sang trọng', 'Văn hóa'];
  const [customStyle, setCustomStyle] = useState('');

  // Modal states
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [defaultCovers, setDefaultCovers] = useState<string[]>([]);
  const [isLoadingCovers, setIsLoadingCovers] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setIsFetching(true);
      const [profileRes, provincesRes, languagesRes] = await Promise.all([
        userService.getProfile(),
        guideService.getProvinces(),
        guideService.getLanguages()
      ]);

      if (provincesRes.success) setProvinces(provincesRes.data);
      if (languagesRes.success) setLanguages(languagesRes.data);

      if (profileRes.success && profileRes.data) {
        const data = profileRes.data;
        
        // Map database gender back to display gender
        const displayGender = data.gender === 'male' ? 'Nam' : 
                             data.gender === 'female' ? 'Nữ' : 
                             data.gender === 'other' ? 'Khác' : (data.gender || '');

        setFormData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          gender: displayGender,
          avatarUrl: data.avatar_url || '',
          coverUrl: data.cover_url || '',
          region: data.region || '',
          homeProvinceId: data.home_province_id || '',
          travelStyle: data.user_preferences?.preferred_trip_style || '',
          preferredLanguageId: data.user_preferences?.preferred_language_id || '',
          otherLanguages: data.user_preferences?.other_languages || '',
          facebookUrl: data.facebook_url || '',
        });

        if (data.home_province_id && provincesRes.data) {
          const prov = provincesRes.data.find((p: any) => p.id.toString() === data.home_province_id.toString());
          if (prov) setProvinceSearch(prov.name);
        }
      }
    } catch (err: any) {
      console.error('Error fetching profile data:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const fetchDefaultCovers = async () => {
    try {
      setIsLoadingCovers(true);
      const res: any = await guideService.getDefaultCovers();
      
      if (res && res.success && res.data) {
        const urls = res.data.map((item: any) => item.url);
        setDefaultCovers(urls);
      } else {
        const baseUrl = 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/profile_cover/';
        setDefaultCovers([
          `${baseUrl}profile_cover_1.png`,
          `${baseUrl}profile_cover_2.png`,
          `${baseUrl}profile_cover_3.png`,
          `${baseUrl}profile_cover_5.png`,
          `${baseUrl}profile_cover_6.png`
        ]);
      }
    } catch (err) {
      console.error('Error fetching default covers:', err);
      const baseUrl = 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/profile_cover/';
      setDefaultCovers([
        `${baseUrl}profile_cover_1.png`,
        `${baseUrl}profile_cover_2.png`,
        `${baseUrl}profile_cover_3.png`,
        `${baseUrl}profile_cover_5.png`,
        `${baseUrl}profile_cover_6.png`
      ]);
    } finally {
      setIsLoadingCovers(false);
    }
  };

  const handleCoverClick = () => {
    setIsCoverModalOpen(true);
    if (defaultCovers.length === 0) {
      fetchDefaultCovers();
    }
  };

  const handleSelectDefaultCover = (url: string) => {
    setFormData(prev => ({ ...prev, coverUrl: url }));
    setIsCoverModalOpen(false);
    toast.success('Đã chọn ảnh bìa mặc định!');
  };

  const handleUploadNewCover = () => {
    setIsCoverModalOpen(false);
    coverInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await userService.updateAvatar(file);
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }));
        await refreshProfile();
        toast.success('Cập nhật ảnh đại diện thành công!');
      }
    } catch (err: any) {
      toast.error('Lỗi khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB.');
      return;
    }

    setIsUploadingCover(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cover_${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, coverUrl: data.publicUrl }));
      toast.success('Cập nhật ảnh bìa thành công!');
    } catch (err: any) {
      toast.error('Lỗi khi tải ảnh bìa.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (error) throw error;
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cập nhật mật khẩu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const toggleTravelStyle = (style: string) => {
    const currentStyles = formData.travelStyle ? formData.travelStyle.split(',').map(s => s.trim()).filter(Boolean) : [];
    let newStyles;
    if (currentStyles.includes(style)) {
      newStyles = currentStyles.filter(s => s !== style);
    } else {
      newStyles = [...currentStyles, style];
    }
    setFormData(prev => ({ ...prev, travelStyle: newStyles.join(', ') }));
  };

  const toggleLanguage = (langId: string | number) => {
    // If it's the primary language, we don't toggle it here unless we have a better UI
    // For now, let's allow multiple selection for "Ngôn ngữ giao tiếp"
    const currentLangs = formData.otherLanguages ? formData.otherLanguages.split(',').map(s => s.trim()).filter(Boolean) : [];
    const idStr = langId.toString();
    
    let newLangs;
    if (currentLangs.includes(idStr)) {
      newLangs = currentLangs.filter(s => s !== idStr);
    } else {
      newLangs = [...currentLangs, idStr];
    }
    setFormData(prev => ({ ...prev, otherLanguages: newLangs.join(', ') }));
  };

  const handleAddCustomStyle = () => {
    if (!customStyle.trim()) return;
    toggleTravelStyle(customStyle.trim());
    setCustomStyle('');
  };

  const handleSave = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await userService.updateProfile(formData);
      await refreshProfile();
      toast.success('Cập nhật hồ sơ cá nhân thành công!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cập nhật hồ sơ.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="tc-profile-container">
        <LoadingBlock />
      </div>
    );
  }

  const currentStyles = formData.travelStyle ? formData.travelStyle.split(',').map(s => s.trim()).filter(Boolean) : [];
  const currentOtherLangs = formData.otherLanguages ? formData.otherLanguages.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="tc-profile-container">
      <div className="user-profile-premium-header">
        <div className="profile-header-top">
          <div className="profile-banner-container" onClick={handleCoverClick}>
            {formData.coverUrl ? (
              <img src={formData.coverUrl} alt="Cover" className="profile-banner-img" />
            ) : (
              <div className="profile-banner-placeholder">
                <span className="banner-icon">🖼️</span>
                <span>Thêm ảnh bìa để trang cá nhân đẹp hơn</span>
              </div>
            )}
            <div className="banner-overlay">
              <span className="overlay-text">📸 Thay đổi ảnh bìa</span>
            </div>
            {isUploadingCover && (
              <div className="banner-loader">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          <div className="profile-avatar-overlap" onClick={handleAvatarClick}>
            <div className="avatar-wrapper-inner">
              <img src={formData.avatarUrl || DEFAULT_AVATAR} alt="Avatar" className="overlap-avatar-img" />
              <div className="avatar-overlay">
                <span className="avatar-overlay-icon">📸</span>
              </div>
            </div>
            <div className="avatar-status-dot"></div>
            {isUploading && (
              <div className="avatar-loader-overlay">
                <div className="spinner-small"></div>
              </div>
            )}
          </div>
        </div>

        <div className="header-action-bar">
          <div className="header-info">
            <h2>{formData.fullName || 'Người dùng'}</h2>
            <p className="header-subtitle">{user?.email}</p>
          </div>
          <div className="header-buttons">
            <Button type="button" variant="primary" onClick={handleSave} isLoading={isLoading}>
              Lưu thay đổi
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
            <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        </div>
      </div>

      <form className="user-profile-form" onSubmit={handleSave}>
        {/* Section 1: Basic Info */}
        <div className="profile-form-section">
          <h3><span className="section-icon">👤</span> Thông tin cơ bản</h3>
          <div className="form-grid">
            <Input
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              fullWidth
            />
            <Input
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              fullWidth
            />
            <div className="tc-input-container">
              <label className="tc-input-label">Giới tính</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="tc-input-field">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <Input
              label="Ngày sinh"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Link Facebook"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="Nhập link Facebook của bạn (vd: https://facebook.com/username)"
              fullWidth
            />
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="profile-form-section">
          <h3><span className="section-icon">📍</span> Khu vực sinh sống</h3>
          <div className="form-grid">
            <div className="tc-input-container">
              <label className="tc-input-label">Miền</label>
              <select 
                name="region" 
                value={formData.region} 
                onChange={(e) => {
                  handleChange(e);
                  setProvinceSearch('');
                  setFormData(prev => ({ ...prev, homeProvinceId: '' }));
                }} 
                className="tc-input-field"
              >
                <option value="">Chọn miền</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
              </select>
            </div>
            <div className="tc-input-container" style={{ position: 'relative' }}>
              <label className="tc-input-label">Tỉnh thành</label>
              <input
                type="text"
                className="tc-input-field"
                placeholder={formData.region ? "Tìm tỉnh thành..." : "Vui lòng chọn miền trước"}
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  setShowProvinceSuggestions(true);
                }}
                onFocus={() => setShowProvinceSuggestions(true)}
                disabled={!formData.region}
              />
              {showProvinceSuggestions && formData.region && (
                <div className="suggestions-dropdown">
                  {provinces
                    .filter(p => p.region === formData.region && p.name.toLowerCase().includes(provinceSearch.toLowerCase()))
                    .map(p => (
                      <div 
                        key={p.id} 
                        className="suggestion-item"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, homeProvinceId: p.id }));
                          setProvinceSearch(p.name);
                          setShowProvinceSuggestions(false);
                        }}
                      >
                        {p.name}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Travel Style */}
        <div className="profile-form-section">
          <h3><span className="section-icon">✈️</span> Phong cách du lịch</h3>
          <div className="style-tags-container">
            {styleSuggestions.map(style => (
              <div 
                key={style} 
                className={`style-tag ${currentStyles.includes(style) ? 'active' : ''}`}
                onClick={() => toggleTravelStyle(style)}
              >
                {style}
              </div>
            ))}
          </div>
          <div className="custom-style-input">
            <input 
              type="text" 
              placeholder="Nhập phong cách riêng của bạn..." 
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomStyle())}
            />
            <Button type="button" variant="outline" size="small" onClick={handleAddCustomStyle}>Thêm</Button>
          </div>
          {currentStyles.filter(s => !styleSuggestions.includes(s)).length > 0 && (
            <div className="active-custom-tags">
              {currentStyles.filter(s => !styleSuggestions.includes(s)).map(s => (
                <div key={s} className="style-tag active custom">
                  {s} <span onClick={() => toggleTravelStyle(s)}>✕</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Languages */}
        <div className="profile-form-section">
          <h3><span className="section-icon">🌐</span> Ngôn ngữ & Hệ thống</h3>
          <div className="form-grid-single">
            <div className="tc-input-container">
              <label className="tc-input-label">Ngôn ngữ giao tiếp (Chọn nhiều)</label>
              <div className="style-tags-container">
                {languages.map(lang => (
                  <div 
                    key={lang.id} 
                    className={`style-tag ${formData.preferredLanguageId?.toString() === lang.id.toString() || currentOtherLangs.includes(lang.id.toString()) ? 'active' : ''}`}
                    onClick={() => {
                      if (formData.preferredLanguageId?.toString() === lang.id.toString()) {
                        setFormData(prev => ({ ...prev, preferredLanguageId: '' }));
                      } else if (!formData.preferredLanguageId) {
                        setFormData(prev => ({ ...prev, preferredLanguageId: lang.id }));
                      } else {
                        toggleLanguage(lang.id);
                      }
                    }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-grid mt-4">
            <div className="tc-input-container">
              <label className="tc-input-label">Email tài khoản</label>
              <input type="text" value={user?.email || ''} className="tc-input-field" disabled />
              <small style={{ color: 'var(--tc-text-secondary)', marginTop: '4px', display: 'block' }}>Email không thể thay đổi</small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" size="large" isLoading={isLoading} fullWidth>
            Lưu tất cả thay đổi
          </Button>
        </div>
      </form>

      {/* Become a Guide Recruitment Banner */}
      {!user?.roles?.some((r: any) => r.role_code === 'GUIDE') && (
        <div className="tc-guide-recruit-banner">
          <div className="recruit-content">
            <div className="recruit-icon">💎</div>
            <div className="recruit-text">
              <h4>Bạn am hiểu địa phương?</h4>
              <p>Trở thành Hướng dẫn viên trên TravelConnectVN để chia sẻ kiến thức và tăng thu nhập ngay hôm nay!</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            className="recruit-btn"
            onClick={() => navigate('/user/guide-verification')}
          >
            Đăng ký làm Hướng dẫn viên
          </Button>
        </div>
      )}

      {/* Section 5: Security - Separated as requested */}
      <div className="profile-form-section security-section">
        <h3><span className="section-icon">🔒</span> Bảo mật</h3>
        <div className="form-grid">
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới nếu muốn đổi"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            fullWidth
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            fullWidth
          />
        </div>
        <div className="security-action">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePasswordChange}
            isLoading={passwordLoading}
            disabled={!passwordData.newPassword}
            fullWidth
          >
            {passwordData.newPassword ? 'Cập nhật mật khẩu' : 'Nhập mật khẩu mới để cập nhật'}
          </Button>
        </div>
      </div>

      {/* Cover Selection Modal */}
      {isCoverModalOpen && (
        <div className="cover-modal-overlay" onClick={() => setIsCoverModalOpen(false)}>
          <div className="cover-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chọn ảnh bìa</h3>
              <button className="close-btn" onClick={() => setIsCoverModalOpen(false)}>✕</button>
            </div>
            
            <div className="covers-grid-container">
              {isLoadingCovers ? (
                <div className="modal-loading">
                  <div className="spinner-small"></div>
                  <span>Đang tải danh sách ảnh...</span>
                </div>
              ) : (
                <div className="covers-grid">
                  {defaultCovers.map((url, index) => (
                    <div 
                      key={index} 
                      className={`cover-item ${formData.coverUrl === url ? 'selected' : ''}`}
                      onClick={() => handleSelectDefaultCover(url)}
                    >
                      <img src={url} alt={`Default Cover ${index + 1}`} />
                      {formData.coverUrl === url && <div className="selected-check">✓</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <p className="modal-hint">Hoặc bạn có thể tự tải ảnh lên từ thiết bị</p>
              <Button variant="primary" fullWidth onClick={handleUploadNewCover}>
                📁 Tải ảnh mới lên
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
