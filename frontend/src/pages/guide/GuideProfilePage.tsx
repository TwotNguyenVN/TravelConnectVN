import React, { useState, useEffect } from 'react';
import { PageContainer, Input, Button, LoadingBlock } from '../../components/common';
import { guideService, type MasterData, type GuideProfile } from '../../services/guideService';
import './GuideProfilePage.css';

const GuideProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Partial<GuideProfile>>({
    bio: '',
    yearsOfExperience: 0,
    workingArea: '',
  });
  const [languages, setLanguages] = useState<MasterData[]>([]);
  const [skills, setSkills] = useState<MasterData[]>([]);
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
      
      const [langsRes, skillsRes, profileRes] = await Promise.all([
        guideService.getLanguages(),
        guideService.getSkills(),
        guideService.getMyProfile(),
      ]);

      if (langsRes.success) setLanguages(langsRes.data);
      if (skillsRes.success) setSkills(skillsRes.data);
      
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
        });
      } else {
        profileUpdate = await guideService.updateProfile({
          bio: profile.bio,
          yearsOfExperience: profile.yearsOfExperience,
          workingArea: profile.workingArea,
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
            <Input
              label="Khu vực hoạt động"
              name="workingArea"
              value={profile.workingArea}
              onChange={handleProfileChange}
              placeholder="Ví dụ: Hà Nội, Hội An, TP. Hồ Chí Minh..."
              fullWidth
              required
            />
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
                  onChange={() => {}} // Handled by div click
                />
                <span>{lang.name}</span>
              </div>
            ))}
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
                  onChange={() => {}} // Handled by div click
                />
                <span>{skill.name}</span>
              </div>
            ))}
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
