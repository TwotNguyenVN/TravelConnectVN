import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import './Auth.css';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (they should be after verifyOtp recovery)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setSuccessMsg('Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.');
      
      // Cleanup session storage
      sessionStorage.removeItem('reset_email');
      
      // Logout the user after password update (standard practice for password resets)
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-auth-container">
      <Card className="tc-auth-card" shadow="large">
        <div className="tc-auth-header">
          <h2>Đặt lại mật khẩu</h2>
          <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>
        
        {errorMsg && <div className="tc-auth-error">{errorMsg}</div>}
        {successMsg && <div className="tc-auth-success">{successMsg}</div>}
        
        <form onSubmit={handleResetPassword} className="tc-auth-form">
          <Input 
            label="Mật khẩu mới" 
            type="password" 
            placeholder="Nhập mật khẩu mới" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Input 
            label="Xác nhận mật khẩu" 
            type="password" 
            placeholder="Nhập lại mật khẩu mới" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Đổi mật khẩu
          </Button>
        </form>
      </Card>
    </div>
  );
};
