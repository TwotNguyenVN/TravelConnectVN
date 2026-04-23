import React, { useState, useEffect } from 'react';
import { PageContainer, Input, Button, LoadingBlock } from '../../components/common';
import { guideService, type MasterData, type GuideProfile } from '../../services/guideService';
import './GuideProfilePage.css';

const GuideProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Partial<GuideProfile>>({
    bio: '',
    yearsOfExperience: 0,
    workingArea: '',
    otherLanguages: '',
    otherSkills: '',
  });
  const [languages, setLanguages] = useState<MasterData[]>([]);
  const [skills, setSkills] = useState<MasterData[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        setProfile(profileRes.data);
        setSelectedLanguages(profileRes.data.guideLanguages.map((gl: any) => gl.language.id));
        setSelectedSkills(profileRes.data.guideSkills.map((gs: any) => gs.skill.id));
        setIsNewProfile(false);
      } else {
        setIsNewProfile(true);
      }
    } catch (err: any) {
      console.error('Error fetching guide profile data:', err);
      setError('Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

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
        });
      }

      if (!profileUpdate.success) throw new Error(profileUpdate.message);
      setIsNewProfile(false);

      await Promise.all([
        guideService.updateLanguages(selectedLanguages),
        guideService.updateSkills(selectedSkills),
      ]);

      setSuccess('Cập nhật hồ sơ hướng dẫn viên thành công!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Có lỗi xảy ra khi lưu hồ sơ.');
    } finally {
      setSaving(false);
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
    <PageContainer>
      <div className="guide-profile-header">
        <h1>Hồ sơ hướng dẫn viên</h1>
        <p>Cập nhật thông tin chuyên môn để thu hút khách du lịch.</p>
      </div>

      {error && (
        <div className="tc-alert tc-alert--danger" style={{ marginBottom: '24px', padding: '16px', borderRadius: '8px', background: 'var(--color-accent-soft)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="tc-alert tc-alert--success" style={{ marginBottom: '24px', padding: '16px', borderRadius: '8px', background: 'var(--color-trust-soft)', color: 'var(--color-success)', border: '1px solid var(--color-success)' }}>
          {success}
        </div>
      )}

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
              <div className="tc-input-container tc-input-container--full-width">
                <label className="tc-input-label">Tỉnh thành hoạt động chính / Am hiểu nhất</label>
                <select
                  className="tc-input-field"
                  name="homeProvinceId"
                  value={profile.homeProvinceId || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const prov = provinces.find(p => p.id === id);
                    setProfile(prev => ({ 
                      ...prev, 
                      homeProvinceId: id,
                      workingArea: prov ? prov.name : '' 
                    }));
                  }}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-white)' }}
                  required
                >
                  <option value="">Chọn tỉnh thành</option>
                  {provinces.filter(p => p.region === profile.region).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {profile.region && (
              <Input
                label="Các tỉnh thành lân cận am hiểu khác"
                name="familiarProvinces"
                value={profile.familiarProvinces || ''}
                onChange={handleProfileChange}
                placeholder="Ví dụ: Ninh Bình, Thanh Hóa..."
                fullWidth
                helperText={`Chỉ nhập các tỉnh thuộc ${profile.region}`}
              />
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
            {languages.map(lang => (
              <div 
                key={lang.id} 
                className={`checkbox-item ${selectedLanguages.includes(lang.id) ? 'active' : ''}`}
                onClick={() => toggleLanguage(lang.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedLanguages.includes(lang.id)}
                  readOnly
                />
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
            {skills.map(skill => (
              <div 
                key={skill.id} 
                className={`checkbox-item ${selectedSkills.includes(skill.id) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedSkills.includes(skill.id)}
                  readOnly
                />
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
    </PageContainer>
  );
};

export default GuideProfilePage;
