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

  return (
    <div className="tc-auth-container">
      <Card className="tc-auth-card" shadow="large">
        <div className="tc-auth-header">
          <h2>Chào mừng trở lại</h2>
          <p>Đăng nhập vào hệ thống TravelConnectVN</p>
        </div>
        
        {errorMsg && <div className="tc-auth-error">{errorMsg}</div>}
        
        <form onSubmit={handleLogin} className="tc-auth-form">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Nhập địa chỉ email của bạn" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Input 
            label="Mật khẩu" 
            type="password" 
            placeholder="Nhập mật khẩu" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          
          <div className="tc-auth-actions">
            <Link to="/forgot-password" className="tc-auth-link">Quên mật khẩu?</Link>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            isLoading={isLoading}
            className="tc-auth-submit-btn"
          >
            Đăng nhập
          </Button>
        </form>
        
        <div className="tc-auth-footer">
          <p>
            Chưa có tài khoản? <Link to="/register" className="tc-auth-link tc-auth-link--bold">Đăng ký ngay</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
