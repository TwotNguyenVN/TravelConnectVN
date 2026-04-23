import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/common/Card/Card';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { userService } from '../../../services/userService';
import { guideService, type MasterData } from '../../../services/guideService';
import { verificationService } from '../../../services/verificationService';
import { useToast } from '../../../contexts/ToastContext';
import '../Auth.css';

const OnboardingStep = {
  BASIC_INFO: 1,
  GUIDE_INFO: 2,
  VERIFICATION: 3,
} as const;

type OnboardingStepValue = typeof OnboardingStep[keyof typeof OnboardingStep];

export const OnboardingPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStepValue>(OnboardingStep.BASIC_INFO);
  const [isLoading, setIsLoading] = useState(false);
  const userRole = user?.user_metadata?.role || 'TOURIST';

  // Step 1 Data: Basic Profile
  const [basicInfo, setBasicInfo] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  // Step 2 Data: Guide Info
  const [guideInfo, setGuideInfo] = useState({
    workingArea: '',
    yearsOfExperience: 0,
    bio: '',
    otherLanguages: '',
    otherSkills: '',
  });
  const [languages, setLanguages] = useState<MasterData[]>([]);
  const [skills, setSkills] = useState<MasterData[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  // Step 3 Data: Verification
  const [verificationFiles, setVerificationFiles] = useState<{ [key: string]: any }>({
    national_id_front: null,
    national_id_back: null,
    tour_guide_card: null,
    certificate: [],
  });
  const [submissionNote, setSubmissionNote] = useState('');
  const [previews, setPreviews] = useState<{ [key: string]: any }>({
    certificate: [],
  });

  useEffect(() => {
    if (currentStep === OnboardingStep.GUIDE_INFO) {
      fetchGuideMasterData();
    }
  }, [currentStep]);

  const fetchGuideMasterData = async () => {
    try {
      const [langsRes, skillsRes] = await Promise.all([
        guideService.getLanguages(),
        guideService.getSkills(),
      ]);
      if (langsRes.success) setLanguages(langsRes.data);
      if (skillsRes.success) setSkills(skillsRes.data);

      // Optional: Check if profile already exists (to pre-fill if they refreshed)
      try {
        const profileRes = await guideService.getMyProfile();
        if (profileRes.success && profileRes.data) {
          setGuideInfo({
            workingArea: profileRes.data.workingArea || '',
            yearsOfExperience: profileRes.data.yearsOfExperience || 0,
            bio: profileRes.data.bio || '',
          });
          // Note: we don't pre-fill languages/skills here for simplicity in onboarding
        }
      } catch (err) {
        // 404 is expected for new users, so we just ignore it
        console.log('Guide profile not found, proceeding with new creation.');
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const handleSkip = () => {
    toast.info('Bạn đã bỏ qua thiết lập hồ sơ. Bạn có thể cập nhật sau trong phần Cài đặt.');
    navigate('/');
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (currentStep === OnboardingStep.BASIC_INFO) {
        // Save Step 1
        await userService.updateProfile(basicInfo);
        await refreshProfile();
        
        if (userRole === 'GUIDE') {
          setCurrentStep(OnboardingStep.GUIDE_INFO);
        } else {
          toast.success('Thiết lập hồ sơ thành công!');
          navigate('/');
        }
      } else if (currentStep === OnboardingStep.GUIDE_INFO) {
        // Save Step 2 - Check if we should create or update
        let profileRes;
        try {
          // Check if profile exists first
          const checkRes = await guideService.getMyProfile();
          if (checkRes.success && checkRes.data) {
            profileRes = await guideService.updateProfile(guideInfo);
          } else {
            profileRes = await guideService.createProfile(guideInfo);
          }
        } catch (err) {
          // If 404, create it
          profileRes = await guideService.createProfile(guideInfo);
        }

        if (!profileRes.success) throw new Error(profileRes.message);
        
        await Promise.all([
          guideService.updateLanguages(selectedLanguages),
          guideService.updateSkills(selectedSkills),
        ]);
        
        setCurrentStep(OnboardingStep.VERIFICATION);
      } else if (currentStep === OnboardingStep.VERIFICATION) {
        // Save Step 3
        const uploadedDocs = [];
        for (const [type, fileOrFiles] of Object.entries(verificationFiles)) {
          if (Array.isArray(fileOrFiles)) {
            for (const file of fileOrFiles) {
              const url = await verificationService.uploadDocument(file, user!.id);
              uploadedDocs.push({ documentType: type, fileUrl: url });
            }
          } else if (fileOrFiles) {
            const url = await verificationService.uploadDocument(fileOrFiles, user!.id);
            uploadedDocs.push({ documentType: type, fileUrl: url });
          }
        }
        await verificationService.submitRequest({ 
          documents: uploadedDocs,
          submissionNote: submissionNote 
        });
        
        toast.success('Hồ sơ của bạn đã được gửi đi để phê duyệt!');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = basicInfo.fullName && basicInfo.phone && basicInfo.dateOfBirth && basicInfo.gender;
  const isStep2Valid = guideInfo.workingArea && (guideInfo.yearsOfExperience !== undefined) && guideInfo.bio && selectedLanguages.length > 0;
  const isStep3Valid = verificationFiles.national_id_front && verificationFiles.national_id_back && verificationFiles.tour_guide_card && (verificationFiles.certificate?.length > 0);

  const renderStep1 = () => (
    <div className="tc-auth-form">
      <Input 
        label="Họ và tên" 
        value={basicInfo.fullName} 
        onChange={e => setBasicInfo({...basicInfo, fullName: e.target.value})}
        fullWidth
        required
      />
      <Input 
        label="Số điện thoại" 
        value={basicInfo.phone} 
        onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})}
        fullWidth
        required
      />
      <div className="tc-auth-row" style={{ gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Input 
            label="Ngày sinh" 
            type="date"
            value={basicInfo.dateOfBirth} 
            onChange={e => setBasicInfo({...basicInfo, dateOfBirth: e.target.value})}
            fullWidth
            required
            style={{ height: '48px', borderRadius: '8px' }}
          />
        </div>
        <div className="tc-input-container" style={{ flex: 1 }}>
          <label className="tc-input-label">Giới tính</label>
          <select 
            className="tc-input-field"
            value={basicInfo.gender}
            onChange={e => setBasicInfo({...basicInfo, gender: e.target.value})}
            style={{ width: '100%', height: '48px', borderRadius: '8px', padding: '0 12px' }}
          >
            <option value="">Chọn</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="tc-auth-form">
      <Input 
        label="Khu vực hoạt động" 
        placeholder="Vd: Hà Nội, Hội An..."
        value={guideInfo.workingArea} 
        onChange={e => setGuideInfo({...guideInfo, workingArea: e.target.value})}
        fullWidth
        required
      />
      <Input 
        label="Số năm kinh nghiệm" 
        type="number"
        value={guideInfo.yearsOfExperience || ''} 
        onChange={e => setGuideInfo({...guideInfo, yearsOfExperience: parseInt(e.target.value) || 0})}
        fullWidth
        required
      />
      <div className="tc-form-group">
        <label style={{ fontSize: '14px', fontWeight: 600 }}>Giới thiệu bản thân</label>
        <textarea 
          className="tc-input-field"
          rows={4}
          value={guideInfo.bio}
          onChange={e => setGuideInfo({...guideInfo, bio: e.target.value})}
          style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
          placeholder="Chia sẻ kinh nghiệm của bạn..."
        />
      </div>
      
      <div className="tc-form-group">
        <label style={{ fontSize: '14px', fontWeight: 600 }}>Ngôn ngữ (Chọn ít nhất 1)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {languages.map(lang => (
            <div 
              key={lang.id}
              onClick={() => setSelectedLanguages(prev => prev.includes(lang.id) ? prev.filter(i => i !== lang.id) : [...prev, lang.id])}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${selectedLanguages.includes(lang.id) ? 'var(--tc-primary)' : '#ddd'}`,
                background: selectedLanguages.includes(lang.id) ? 'var(--tc-primary-light)' : '#fff',
                color: selectedLanguages.includes(lang.id) ? 'var(--tc-primary)' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              {lang.name}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text"
            className="tc-input-field"
            placeholder="Ngôn ngữ khác (cách nhau bằng dấu phẩy)..."
            value={guideInfo.otherLanguages}
            onChange={e => setGuideInfo({...guideInfo, otherLanguages: e.target.value})}
            style={{ width: '100%', height: '40px', borderRadius: '8px', padding: '0 12px', fontSize: '13px' }}
          />
        </div>
      </div>

      <div className="tc-form-group" style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600 }}>Kỹ năng chuyên môn</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {skills.map(skill => (
            <div 
              key={skill.id}
              onClick={() => setSelectedSkills(prev => prev.includes(skill.id) ? prev.filter(i => i !== skill.id) : [...prev, skill.id])}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `1px solid ${selectedSkills.includes(skill.id) ? 'var(--tc-primary)' : '#ddd'}`,
                background: selectedSkills.includes(skill.id) ? 'var(--tc-primary-light)' : '#fff',
                color: selectedSkills.includes(skill.id) ? 'var(--tc-primary)' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              {skill.name}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text"
            className="tc-input-field"
            placeholder="Kỹ năng khác (cách nhau bằng dấu phẩy)..."
            value={guideInfo.otherSkills}
            onChange={e => setGuideInfo({...guideInfo, otherSkills: e.target.value})}
            style={{ width: '100%', height: '40px', borderRadius: '8px', padding: '0 12px', fontSize: '13px' }}
          />
        </div>
      </div>
    </div>
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setVerificationFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setVerificationFiles(prev => ({ ...prev, [type]: [...(prev[type] || []), ...newFiles] }));
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ 
            ...prev, 
            [type]: [...(prev[type] || []), reader.result as string] 
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const renderStep3 = () => (
    <div className="tc-auth-form" style={{ gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>CCCD Mặt trước *</label>
          <div 
            onClick={() => document.getElementById('id_front')?.click()}
            style={{ height: '140px', border: '2px dashed #ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
          >
            {previews.national_id_front ? <img src={previews.national_id_front} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Chọn ảnh</span>}
          </div>
          <input id="id_front" type="file" hidden onChange={e => handleFileChange(e, 'national_id_front')} />
        </div>
        <div>
          <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>CCCD Mặt sau *</label>
          <div 
            onClick={() => document.getElementById('id_back')?.click()}
            style={{ height: '140px', border: '2px dashed #ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
          >
            {previews.national_id_back ? <img src={previews.national_id_back} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Chọn ảnh</span>}
          </div>
          <input id="id_back" type="file" hidden onChange={e => handleFileChange(e, 'national_id_back')} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Thẻ hướng dẫn viên *</label>
        <div 
          onClick={() => document.getElementById('guide_card')?.click()}
          style={{ height: '180px', border: '2px dashed #ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
        >
          {previews.tour_guide_card ? <img src={previews.tour_guide_card} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Chọn ảnh thẻ HDV</span>}
        </div>
        <input id="guide_card" type="file" hidden onChange={e => handleFileChange(e, 'tour_guide_card')} />
      </div>

      <div>
        <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Chứng chỉ ngoại ngữ / Khác *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
          {previews.certificate?.map((preview: string, index: number) => (
            <div key={index} style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd', position: 'relative' }}>
              <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setVerificationFiles(prev => ({ ...prev, certificate: prev.certificate.filter((_: any, i: number) => i !== index) }));
                  setPreviews(prev => ({ ...prev, certificate: prev.certificate.filter((_: any, i: number) => i !== index) }));
                }}
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(212, 17, 30, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>
          ))}
          <div 
            onClick={() => document.getElementById('other_certs')?.click()}
            style={{ height: '140px', border: '2px dashed #ddd', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f9f9f9', gap: '5px' }}
          >
            <span style={{ fontSize: '24px', color: '#999' }}>+</span>
            <span style={{ fontSize: '12px', color: '#999' }}>Thêm ảnh</span>
          </div>
        </div>
        <input id="other_certs" type="file" multiple hidden onChange={e => handleMultipleFileChange(e, 'certificate')} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Ghi chú (Note)</label>
        <textarea 
          className="tc-input-field"
          rows={3}
          value={submissionNote}
          onChange={e => setSubmissionNote(e.target.value)}
          style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
          placeholder="Thông tin bổ sung cho người kiểm duyệt..."
        />
      </div>
    </div>
  );

  const stepTitles = {
    [OnboardingStep.BASIC_INFO]: 'Thông tin cơ bản',
    [OnboardingStep.GUIDE_INFO]: 'Hồ sơ hướng dẫn viên',
    [OnboardingStep.VERIFICATION]: 'Xác thực định danh',
  };

  const isCurrentStepValid = 
    currentStep === OnboardingStep.BASIC_INFO ? isStep1Valid :
    currentStep === OnboardingStep.GUIDE_INFO ? isStep2Valid :
    isStep3Valid;

  return (
    <div className="tc-role-page">
      <div className="tc-role-banner" style={{ height: '35vh', minHeight: '300px' }}>
        <img 
          src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner-select-role.png" 
          alt="Banner" 
          className="tc-role-banner-img"
        />
        <div className="tc-role-banner-overlay"></div>
        <div className="tc-role-banner-content">
          <span className="tc-role-tag">Bước {currentStep} / {userRole === 'GUIDE' ? 3 : 1}</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>{stepTitles[currentStep]}</h1>
          <p>Hoàn thiện hồ sơ để có trải nghiệm tốt nhất</p>
        </div>
      </div>

      <div className="tc-role-container" style={{ marginTop: '-80px', maxWidth: '780px' }}>
        <Card className="tc-auth-card" shadow="large" style={{ padding: '50px', maxWidth: '100%' }}>
          {currentStep === OnboardingStep.BASIC_INFO && renderStep1()}
          {currentStep === OnboardingStep.GUIDE_INFO && renderStep2()}
          {currentStep === OnboardingStep.VERIFICATION && renderStep3()}

          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <Button 
              variant="outline" 
              size="large" 
              onClick={handleSkip}
              style={{ flex: 1, height: '56px', borderRadius: '15px' }}
              disabled={isLoading}
            >
              Bỏ qua
            </Button>
            <Button 
              variant="primary" 
              size="large" 
              onClick={handleNext}
              disabled={!isCurrentStepValid || isLoading}
              isLoading={isLoading}
              style={{ flex: 2, height: '56px', borderRadius: '15px', fontWeight: 700 }}
            >
              {currentStep === (userRole === 'GUIDE' ? 3 : 1) ? 'Hoàn tất' : 'Tiếp tục'}
            </Button>
          </div>
        </Card>
        
        <div className="tc-role-footer-new">
          <p>© 2026 TravelConnectVN. Kiến tạo những hành trình ý nghĩa.</p>
        </div>
      </div>
    </div>
  );
};
