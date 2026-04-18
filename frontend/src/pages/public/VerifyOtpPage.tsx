import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import { supabase } from '../../utils/supabase';
import './Auth.css';

export const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('reset_email');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    
    try {
      if (otp.length !== 6) {
        throw new Error('Mã OTP phải có 6 chữ số.');
      }

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      });
      
      if (error) throw error;
      
      // Verification success, Supabase automatically logs user in for recovery
      navigate('/reset-password');
    } catch (err: any) {
      setErrorMsg(err.message || 'Mã xác thực không chính xác hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tc-auth-container">
      <Card className="tc-auth-card" shadow="large">
        <div className="tc-auth-header">
          <h2>Xác thực OTP</h2>
          <p>Nhập mã 6 số đã được gửi tới <strong>{email}</strong></p>
        </div>
        
        {errorMsg && <div className="tc-auth-error">{errorMsg}</div>}
        
        <form onSubmit={handleVerifyOTP} className="tc-auth-form">
          <Input 
            label="Mã xác thực" 
            type="text" 
            placeholder="000000" 
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            fullWidth
            maxLength={6}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            isLoading={isLoading}
            className="tc-auth-submit-btn"
          >
            Xác nhận mã
          </Button>
        </form>
        
        <div className="tc-auth-footer">
          <button 
            type="button" 
            className="tc-auth-link" 
            onClick={() => navigate('/forgot-password')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Quay lại nhập email
          </button>
        </div>
      </Card>
    </div>
  );
};
