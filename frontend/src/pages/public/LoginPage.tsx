import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng nhập Google. Vui lòng thử lại.');
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
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Chào mừng trở lại</h1>
          <p>Tiếp tục khám phá những hành trình tuyệt vời cùng chúng tôi</p>
        </div>
      </div>

      <div className="tc-role-container" style={{ marginTop: '-120px', maxWidth: '780px' }}>
        <Card className="tc-auth-card" shadow="large" style={{ padding: '60px', maxWidth: '100%' }}>
          <div className="tc-auth-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--tc-text-primary)' }}>Đăng nhập hệ thống</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>Nhập thông tin tài khoản của bạn bên dưới</p>
          </div>
          
          {errorMsg && <div className="tc-auth-error" style={{ padding: '15px', fontSize: '16px' }}>{errorMsg}</div>}
          
          <form onSubmit={handleLogin} className="tc-auth-form" style={{ gap: '25px' }}>
            <Input 
              label="Email" 
              type="email" 
              placeholder="Nhập địa chỉ email của bạn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              style={{ height: '56px', fontSize: '16px' }}
            />
            <div>
              <Input 
                label="Mật khẩu" 
                type="password" 
                placeholder="Nhập mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                style={{ height: '56px', fontSize: '16px' }}
              />
              <div className="tc-auth-actions" style={{ marginTop: '10px' }}>
                <Link to="/forgot-password" style={{ color: 'var(--tc-primary)', fontSize: '15px', textDecoration: 'none', fontWeight: 500 }}>Quên mật khẩu?</Link>
              </div>
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              isLoading={isLoading}
              className="tc-auth-submit-btn"
              style={{ borderRadius: '15px', height: '60px', fontSize: '18px', fontWeight: 700, marginTop: '10px' }}
            >
              Đăng nhập ngay
            </Button>
          </form>

          <div className="tc-auth-divider" style={{ margin: '35px 0' }}>
            <span style={{ fontSize: '15px', color: '#999', background: '#fff', padding: '0 15px' }}>Hoặc tiếp tục với</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="tc-auth-google-btn"
            style={{ 
              height: '56px', 
              borderRadius: '15px', 
              border: '1px solid #ddd', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              background: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              style={{ width: '22px' }}
            />
            Đăng nhập bằng Google
          </button>
          
          <div className="tc-auth-footer" style={{ marginTop: '45px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
            <p style={{ fontSize: '17px', color: '#555' }}>
              Chưa có tài khoản? <Link to="/select-role" style={{ color: 'var(--tc-primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link>
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
