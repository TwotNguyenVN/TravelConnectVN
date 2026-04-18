import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import './Auth.css';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

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
          }
        }
      });
      
      if (error) throw error;
      
      alert('Đăng ký thành công! Vui lòng kiểm tra hòm thư email của bạn để xác thực tài khoản trước khi đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-auth-container">
      <Card className="tc-auth-card" shadow="large">
        <div className="tc-auth-header">
          <h2>Tạo tài khoản mới</h2>
          <p>Tham gia TravelConnectVN ngay hôm nay</p>
        </div>
        
        {errorMsg && <div className="tc-auth-error">{errorMsg}</div>}
        
        <form onSubmit={handleRegister} className="tc-auth-form">
          <Input 
            label="Họ và tên" 
            name="fullName"
            type="text" 
            placeholder="Vd: Nguyễn Văn A" 
            value={formData.fullName}
            onChange={handleChange}
            required
            fullWidth
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
          />
          <Input 
            label="Mật khẩu" 
            name="password"
            type="password" 
            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Input 
            label="Xác nhận mật khẩu" 
            name="confirmPassword"
            type="password" 
            placeholder="Nhập lại mật khẩu" 
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            isLoading={isLoading}
            className="tc-auth-submit-btn"
          >
            Đăng ký tài khoản
          </Button>
        </form>
        
        <div className="tc-auth-footer">
          <p>
            Đã có tài khoản? <Link to="/login" className="tc-auth-link tc-auth-link--bold">Đăng nhập</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
