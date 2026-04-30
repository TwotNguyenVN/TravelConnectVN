import React, { useState, useEffect } from 'react';
import { PageContainer, Input, Button, LoadingBlock } from '../../components/common';
import { guideService, type MasterData, type GuideProfile } from '../../services/guideService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../utils/supabase';
import { DEFAULT_AVATAR } from '../../constants/images';
import './GuideProfilePage.css';

const GuideProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Partial<GuideProfile>>({
    bio: '',
    yearsOfExperience: 0,
    workingArea: '',
    otherLanguages: '',
    otherSkills: '',
    coverUrl: '',
    avatarUrl: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [languages, setLanguages] = useState<MasterData[]>([]);
  const [skills, setSkills] = useState<MasterData[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  
  // Province search states
  const [provinceSearch, setProvinceSearch] = useState('');
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  
  const [familiarSearch, setFamiliarSearch] = useState('');
  const [showFamiliarSuggestions, setShowFamiliarSuggestions] = useState(false);
  
  // Cover selection modal states
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [defaultCovers, setDefaultCovers] = useState<string[]>([]);
  const [isLoadingCovers, setIsLoadingCovers] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [langsRes, skillsRes, provincesRes, profileRes] = await Promise.all([
        guideService.getLanguages(),
        guideService.getSkills(),
        guideService.getProvinces(),
        guideService.getMyProfile(),
      ]);

      if (langsRes.success) setLanguages(langsRes.data);
      if (skillsRes.success) setSkills(skillsRes.data);
      if (provincesRes.success) setProvinces(provincesRes.data);
      
      if (profileRes.success && profileRes.data) {
        setProfile({
          ...profileRes.data,
          homeProvinceId: profileRes.data.homeProvince?.id,
        });
        setSelectedLanguages(profileRes.data.guideLanguages.map((l: any) => l.language.id));
        setSelectedSkills(profileRes.data.guideSkills.map((s: any) => s.skill.id));
        
        // Pre-fill search if already has a province
        if (profileRes.data.homeProvince) {
          setProvinceSearch(profileRes.data.homeProvince.name);
        }
        setIsNewProfile(false);
      } else {
        setIsNewProfile(true);
      }
    } catch (err: any) {
      console.error('Error fetching guide profile data:', err);
      toast.error('Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value }));
  };

  const toggleLanguage = (id: number) => {
    setSelectedLanguages(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const fetchDefaultCovers = async () => {
    try {
      setIsLoadingCovers(true);
      const res: any = await guideService.getDefaultCovers();
      
      if (res && res.success && res.data) {
        // Map the database objects to a simple array of URLs
        const urls = res.data.map((item: any) => item.url);
        setDefaultCovers(urls);
      } else {
        // Ultimate fallback if database is empty (showing all 5 as requested)
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
      console.error('Error fetching default covers from DB:', err);
      // Fallback on error
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
    setProfile(prev => ({ ...prev, coverUrl: url }));
    setIsCoverModalOpen(false);
    toast.success('Đã chọn ảnh bìa mặc định!');
  };

  const handleUploadNewCover = () => {
    setIsCoverModalOpen(false);
    coverInputRef.current?.click();
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger cover click
    avatarInputRef.current?.click();
  };

  const toggleFamiliarProvince = (name: string) => {
    setProfile(prev => {
      const current = prev.familiarProvinces ? prev.familiarProvinces.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      let next;
      if (current.includes(name)) {
        next = current.filter(s => s !== name);
      } else {
        next = [...current, name];
      }
      return { ...prev, familiarProvinces: next.join(', ') };
    });
    setFamiliarSearch('');
  };

  const removeFamiliarProvince = (name: string) => {
    setProfile(prev => {
      const current = prev.familiarProvinces ? prev.familiarProvinces.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      const next = current.filter(s => s !== name);
      return { ...prev, familiarProvinces: next.join(', ') };
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error('Kích thước ảnh đại diện không được vượt quá 1MB.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      toast.error('Lỗi khi tải ảnh lên: ' + err.message);
    } finally {
      setIsUploadingAvatar(false);
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, coverUrl: data.publicUrl }));
      toast.success('Tải ảnh hồ sơ lên thành công!');
    } catch (err: any) {
      console.error('Error uploading cover:', err);
      toast.error('Lỗi khi tải ảnh lên: ' + err.message);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleUseAccountAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      setProfile(prev => ({ ...prev, avatarUrl: user.user_metadata.avatar_url }));
      toast.success('Đã lấy ảnh tài khoản làm ảnh đại diện hồ sơ.');
    } else {
      toast.error('Bạn chưa có ảnh tài khoản.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      let profileUpdate;
      if (isNewProfile) {
        profileUpdate = await guideService.createProfile({
          bio: profile.bio,
          yearsOfExperience: profile.yearsOfExperience,
          workingArea: profile.workingArea,
          otherLanguages: profile.otherLanguages,
          otherSkills: profile.otherSkills,
          homeProvinceId: profile.homeProvinceId,
          familiarProvinces: profile.familiarProvinces,
          region: profile.region,
          coverUrl: profile.coverUrl,
          avatarUrl: profile.avatarUrl,
        });
      } else {
        profileUpdate = await guideService.updateProfile({
          bio: profile.bio,
          yearsOfExperience: profile.yearsOfExperience,
          workingArea: profile.workingArea,
          otherLanguages: profile.otherLanguages,
          otherSkills: profile.otherSkills,
          homeProvinceId: profile.homeProvinceId,
          familiarProvinces: profile.familiarProvinces,
          region: profile.region,
          coverUrl: profile.coverUrl,
          avatarUrl: profile.avatarUrl,
        });
      }

      if (!profileUpdate.success) throw new Error(profileUpdate.message);
      setIsNewProfile(false);

      await Promise.all([
        guideService.updateLanguages(selectedLanguages),
        guideService.updateSkills(selectedSkills),
      ]);

      toast.success('Cập nhật hồ sơ hướng dẫn viên thành công!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast.error(err.message || 'Có lỗi xảy ra khi lưu hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  const selectedLangs = languages.filter(l => selectedLanguages.includes(l.id)).sort((a, b) => a.name.localeCompare(b.name));
  const unselectedLangs = languages.filter(l => !selectedLanguages.includes(l.id)).sort((a, b) => a.name.localeCompare(b.name));

  const selectedSks = skills.filter(s => selectedSkills.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const unselectedSks = skills.filter(s => !selectedSkills.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="guide-profile-premium-header">
        <div className="profile-header-top">
          <div className="profile-banner-container" onClick={handleCoverClick}>
            {profile.coverUrl ? (
              <img src={profile.coverUrl} alt="Cover" className="profile-banner-img" />
            ) : (
              <div className="profile-banner-placeholder">
                <span className="banner-icon">🖼️</span>
                <span>Thêm ảnh bìa để hồ sơ chuyên nghiệp hơn</span>
              </div>
            )}
            
            <div className="banner-overlay">
              <span className="overlay-text">📸 Thay đổi ảnh bìa</span>
            </div>
            
            {(isUploadingCover || isUploadingAvatar) && (
              <div className="banner-loader">
                <div className="spinner"></div>
                <span>Đang tải lên...</span>
              </div>
            )}
          </div>

          <div className="profile-avatar-overlap" onClick={handleAvatarClick}>
            <div className="avatar-wrapper-inner">
              <img 
                src={profile.avatarUrl || (profile as any).avatar_url || DEFAULT_AVATAR} 
                alt="Avatar" 
                className="overlap-avatar-img"
              />
              <div className="avatar-overlay">
                <span className="avatar-overlay-icon">📸</span>
              </div>
            </div>
            <div className="avatar-status-dot online"></div>
            
            {/* New Button to sync from account avatar */}
            <button 
              type="button" 
              className="sync-avatar-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleUseAccountAvatar();
              }}
              title="Dùng ảnh đại diện tài khoản"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="header-action-bar">
          <div className="header-info">
            <div className="header-name-row">
              <h2>{user?.user_metadata?.full_name || 'Hướng dẫn viên'}</h2>
              <span className={`status-badge ${profile.verificationStatus}`}>
                {profile.verificationStatus === 'verified' || profile.verificationStatus === 'approved' ? 'Đã xác minh' : 'Chờ xác minh'}
              </span>
            </div>
            <p className="header-subtitle">Hồ sơ hướng dẫn viên du lịch chuyên nghiệp</p>
          </div>
          <div className="header-buttons">
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={saving}
              onClick={handleSave}
            >
              Lưu thay đổi
            </Button>
            <input 
              type="file" 
              ref={coverInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCoverChange} 
              accept="image/*" 
            />
            <input 
              type="file" 
              ref={avatarInputRef} 
              style={{ display: 'none' }} 
              onChange={handleAvatarChange} 
              accept="image/*" 
            />
          </div>
        </div>
      </div>


      <form className="guide-profile-form" onSubmit={handleSave}>
        <div className="form-section">
          <h3>Thông tin chung</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="tc-input-container tc-input-container--full-width">
              <label className="tc-input-label">Khu vực (Miền)</label>
              <select
                className="tc-input-field"
                name="region"
                value={profile.region || ''}
                onChange={(e) => {
                  const newRegion = e.target.value;
                  setProfile(prev => ({ 
                    ...prev, 
                    region: newRegion,
                    homeProvinceId: undefined, // Reset when region changes
                    familiarProvinces: '' 
                  }));
                }}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-white)' }}
                required
              >
                <option value="">Chọn miền</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
              </select>
            </div>

            {profile.region && (
              <div className="tc-input-container tc-input-container--full-width" style={{ position: 'relative' }}>
                <label className="tc-input-label">Tỉnh thành hoạt động chính / Am hiểu nhất</label>
                <input
                  type="text"
                  className="tc-input-field"
                  placeholder="Nhập tên tỉnh thành (Ví dụ: Hà Nội, Đà Nẵng...)"
                  value={provinceSearch}
                  onChange={(e) => {
                    setProvinceSearch(e.target.value);
                    setShowProvinceSuggestions(true);
                  }}
                  onFocus={() => setShowProvinceSuggestions(true)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-white)' }}
                  required
                />
                
                {showProvinceSuggestions && (
                  <div className="province-suggestions-list">
                    {provinces
                      .filter(p => 
                        p.region === profile.region && 
                        p.name.toLowerCase().includes(provinceSearch.toLowerCase())
                      )
                      .slice(0, 8)
                      .map(p => (
                        <div 
                          key={p.id} 
                          className="suggestion-item"
                          onClick={() => {
                            setProfile(prev => ({ 
                              ...prev, 
                              homeProvinceId: p.id,
                              workingArea: p.name 
                            }));
                            setProvinceSearch(p.name);
                            setShowProvinceSuggestions(false);
                          }}
                        >
                          {p.name}
                        </div>
                      ))}
                    {provinces.filter(p => p.region === profile.region && p.name.toLowerCase().includes(provinceSearch.toLowerCase())).length === 0 && (
                      <div className="suggestion-item no-results">Không tìm thấy tỉnh thành</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {profile.region && (
              <div className="tc-input-container tc-input-container--full-width" style={{ position: 'relative' }}>
                <label className="tc-input-label">Các tỉnh thành lân cận am hiểu khác (Chọn nhiều)</label>
                
                {/* Selected Familiar Provinces Tags */}
                <div className="selected-tags-container">
                  {profile.familiarProvinces && profile.familiarProvinces.split(',').map(s => s.trim()).filter(s => s !== '').map((name, idx) => (
                    <div key={idx} className="tag-chip">
                      <span>{name}</span>
                      <button type="button" className="tag-remove" onClick={() => removeFamiliarProvince(name)}>✕</button>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  className="tc-input-field"
                  placeholder="Tìm và chọn các tỉnh thành khác..."
                  value={familiarSearch}
                  onChange={(e) => {
                    setFamiliarSearch(e.target.value);
                    setShowFamiliarSuggestions(true);
                  }}
                  onFocus={() => setShowFamiliarSuggestions(true)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-white)' }}
                />

                {showFamiliarSuggestions && (
                  <div className="province-suggestions-list">
                    {provinces
                      .filter(p => 
                        p.region === profile.region && 
                        p.id !== profile.homeProvinceId &&
                        p.name.toLowerCase().includes(familiarSearch.toLowerCase()) &&
                        !(profile.familiarProvinces || '').split(',').map(s => s.trim()).includes(p.name)
                      )
                      .slice(0, 8)
                      .map(p => (
                        <div 
                          key={p.id} 
                          className="suggestion-item"
                          onClick={() => {
                            toggleFamiliarProvince(p.name);
                            setShowFamiliarSuggestions(false);
                          }}
                        >
                          {p.name}
                        </div>
                      ))}
                    {provinces.filter(p => p.region === profile.region && p.id !== profile.homeProvinceId && p.name.toLowerCase().includes(familiarSearch.toLowerCase()) && !(profile.familiarProvinces || '').split(',').map(s => s.trim()).includes(p.name)).length === 0 && (
                      <div className="suggestion-item no-results">Không còn tỉnh thành nào phù hợp</div>
                    )}
                  </div>
                )}
                <p className="tc-input-helper-text" style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Gợi ý: Chỉ hiển thị các tỉnh thuộc {profile.region}
                </p>
              </div>
            )}

            <Input
              label="Số năm kinh nghiệm"
              name="yearsOfExperience"
              type="number"
              value={profile.yearsOfExperience}
              onChange={handleProfileChange}
              fullWidth
              required
              min={0}
            />
            
            <div className="tc-input-container tc-input-container--full-width">
              <label className="tc-input-label">Giới thiệu bản thân</label>
              <textarea
                className="tc-input-field"
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                placeholder="Chia sẻ về kinh nghiệm, phong cách dẫn tour và lý do khách hàng nên chọn bạn..."
                rows={5}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ngôn ngữ thông thạo</h3>
          <div className="checkbox-grid">
            {selectedLangs.map(lang => (
              <div 
                key={lang.id} 
                className="checkbox-item active"
                onClick={() => setSelectedLanguages(prev => prev.filter(id => id !== lang.id))}
              >
                <span>{lang.name}</span>
              </div>
            ))}
            
            {selectedLangs.length > 0 && unselectedLangs.length > 0 && (
              <div className="grid-separator">
                <span>Lựa chọn khác</span>
              </div>
            )}

            {unselectedLangs.map(lang => (
              <div 
                key={lang.id} 
                className="checkbox-item"
                onClick={() => setSelectedLanguages(prev => [...prev, lang.id])}
              >
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px' }}>
            <Input
              label="Ngôn ngữ khác"
              name="otherLanguages"
              value={profile.otherLanguages || ''}
              onChange={handleProfileChange}
              placeholder="Ví dụ: Tiếng Lào, Tiếng Khmer..."
              fullWidth
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Kỹ năng & Chuyên môn</h3>
          <div className="checkbox-grid">
            {selectedSks.map(skill => (
              <div 
                key={skill.id} 
                className="checkbox-item active"
                onClick={() => setSelectedSkills(prev => prev.filter(id => id !== skill.id))}
              >
                <span>{skill.name}</span>
              </div>
            ))}

            {selectedSks.length > 0 && unselectedSks.length > 0 && (
              <div className="grid-separator">
                <span>Gợi ý kỹ năng khác</span>
              </div>
            )}

            {unselectedSks.map(skill => (
              <div 
                key={skill.id} 
                className="checkbox-item"
                onClick={() => setSelectedSkills(prev => [...prev, skill.id])}
              >
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px' }}>
            <Input
              label="Kỹ năng khác"
              name="otherSkills"
              value={profile.otherSkills || ''}
              onChange={handleProfileChange}
              placeholder="Ví dụ: Nhảy hiện đại, Quay phim flycam..."
              fullWidth
            />
          </div>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => fetchData()}
            disabled={saving}
          >
            Hủy thay đổi
          </Button>
          <Button 
            type="submit" 
            isLoading={saving}
          >
            Lưu hồ sơ
          </Button>
        </div>
      </form>

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
                      className={`cover-item ${profile.coverUrl === url ? 'selected' : ''}`}
                      onClick={() => handleSelectDefaultCover(url)}
                    >
                      <img src={url} alt={`Default Cover ${index + 1}`} />
                      {profile.coverUrl === url && <div className="selected-check">✓</div>}
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
    </PageContainer>
  );
};

export default GuideProfilePage;
