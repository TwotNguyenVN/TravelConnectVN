import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';
import './Auth.css';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!selectedRole || !['USER', 'GUIDE'].includes(selectedRole)) {
      navigate('/select-role');
    }
  }, [selectedRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: selectedRole,
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Đăng ký thành công! Hãy hoàn thiện hồ sơ của bạn.');
      navigate('/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-role-page">
      <div className="tc-role-banner">
        <img 
          src="https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner-select-role.png" 
          alt="Banner" 
          className="tc-role-banner-img"
        />
        <div className="tc-role-banner-overlay"></div>
        <div className="tc-role-banner-content">
          <span className="tc-role-tag">TravelConnectVN</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Hoàn tất đăng ký</h1>
          <p>Chỉ còn vài bước nữa để bắt đầu hành trình của bạn</p>
        </div>
      </div>

      <div className="tc-role-container" style={{ marginTop: '-120px', maxWidth: '780px' }}>
        <Card className="tc-auth-card" shadow="large" style={{ padding: '50px', maxWidth: '100%' }}>
          <div className="tc-auth-header" style={{ marginBottom: '45px' }}>
            <div className="tc-auth-back-btn" style={{ fontSize: '24px', top: '-10px' }} onClick={() => navigate('/select-role')}>
              <i className="fas fa-arrow-left"></i>
            </div>
            
            <div className={`tc-register-role-badge tc-register-role-badge--${selectedRole?.toLowerCase()}`} style={{ padding: '8px 20px', fontSize: '15px' }}>
              <i className={`fas fa-${selectedRole === 'GUIDE' ? 'compass' : 'suitcase-rolling'}`}></i>
              {selectedRole === 'GUIDE' ? 'Hướng dẫn viên' : 'Người du lịch'}
            </div>
            
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--tc-text-primary)', marginTop: '15px' }}>Thông tin tài khoản</h2>
          </div>
          
          {errorMsg && <div className="tc-auth-error" style={{ padding: '15px', fontSize: '16px' }}>{errorMsg}</div>}
          
          <form onSubmit={handleRegister} className="tc-auth-form" style={{ gap: '25px' }}>
            <Input 
              label="Họ và tên" 
              name="fullName"
              type="text" 
              placeholder="Vd: Nguyễn Văn A" 
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              style={{ height: '56px', fontSize: '16px' }}
            />
            <Input 
              label="Email" 
              name="email"
              type="email" 
              placeholder="Nhập địa chỉ email của bạn" 
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              style={{ height: '56px', fontSize: '16px' }}
            />
            
            <div className="tc-auth-row" style={{ gap: '20px' }}>
              <Input 
                label="Mật khẩu" 
                name="password"
                type="password" 
                placeholder="Ít nhất 6 ký tự" 
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                style={{ height: '56px', fontSize: '16px' }}
              />
              <Input 
                label="Xác nhận" 
                name="confirmPassword"
                type="password" 
                placeholder="Nhập lại" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
                style={{ height: '56px', fontSize: '16px' }}
              />
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              isLoading={isLoading}
              className="tc-auth-submit-btn"
              style={{ borderRadius: '15px', height: '60px', fontSize: '18px', fontWeight: 700, marginTop: '20px' }}
            >
              Đăng ký ngay
            </Button>
          </form>
          
          <div className="tc-auth-footer" style={{ marginTop: '40px', paddingTop: '30px' }}>
            <p style={{ fontSize: '17px' }}>
              Đã có tài khoản? <Link to="/login" className="tc-auth-link tc-auth-link--bold">Đăng nhập ngay</Link>
            </p>
          </div>
        </Card>

        <div className="tc-role-footer-new" style={{ marginTop: '40px' }}>
          <p>© 2026 TravelConnectVN. Kiến tạo những hành trình ý nghĩa.</p>
        </div>
      </div>
    </div>
  );
};
