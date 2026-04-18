import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import './Auth.css';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      // In Supabase resetting password via email can be configured to send a code
      // We assume the system is configured to send a 6-digit code to the email
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      setSuccessMsg('Mã xác thực đã được gửi về email của bạn.');
      
      // Store email in state or local storage to use in next step
      sessionStorage.setItem('reset_email', email);
      
      // Navigate to OTP verification page after a short delay
      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gửi mã xác thực thất bại. Vui lòng kiểm tra lại email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-auth-container">
      <Card className="tc-auth-card" shadow="large">
        <div className="tc-auth-header">
          <h2>Quên mật khẩu?</h2>
          <p>Nhập email để nhận mã xác thực (OTP)</p>
        </div>
        
        {errorMsg && <div className="tc-auth-error">{errorMsg}</div>}
        {successMsg && <div className="tc-auth-success">{successMsg}</div>}
        
        <form onSubmit={handleRequestOTP} className="tc-auth-form">
          <Input 
            label="Email" 
            type="email" 
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Gửi mã xác thực
          </Button>
        </form>
        
        <div className="tc-auth-footer">
          <Link to="/login" className="tc-auth-link">Quay lại đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};
