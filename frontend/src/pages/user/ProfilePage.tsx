import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card/Card';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { supabase } from '../../utils/supabase';
import { userService } from '../../services/userService';
import './Profile.css';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = await userService.getProfile();
        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            fullName: data.full_name || '',
            phone: data.phone || '',
            dateOfBirth: data.date_of_birth || '',
            gender: data.gender || '',
            avatarUrl: data.avatar_url || '',
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err.message);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 2MB.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const response = await userService.updateAvatar(file);
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }));
        await refreshProfile();
        setMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Lỗi khi cập nhật ảnh đại diện.' });
      }
    } catch (err: any) {
      console.error('DEBUG - Avatar upload error details:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi tải ảnh lên.';
      setMessage({ type: 'error', text: `Lỗi: ${errorMsg}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setMessage(null);
    setIsLoading(true);
    
    try {
      await userService.updateProfile(formData);
      await refreshProfile();
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khi cập nhật hồ sơ.' });
    } finally {
      setIsLoading(false);
    }
  };

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự.' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Lỗi khi cập nhật mật khẩu.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="tc-profile-container">
      <div className="tc-profile-header">
        <div className="tc-profile-cover"></div>
        <div className="tc-profile-avatar-wrapper">
          <div className="tc-profile-avatar-container">
            <div 
              className={`tc-profile-avatar ${isUploading ? 'tc-avatar-uploading' : ''}`}
              onClick={handleAvatarClick}
              title="Nhấn để đổi ảnh đại diện"
            >
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="tc-avatar-img" />
              ) : (
                <span className="tc-avatar-placeholder">
                  {formData.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </span>
              )}
              <div className="tc-avatar-overlay">
                <span className="tc-avatar-icon">📷</span>
              </div>
              {isUploading && <div className="tc-avatar-spinner"></div>}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
          <div className="tc-profile-title">
            <h2>{formData.fullName || 'Người dùng mới'}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="tc-profile-content">
        <Card shadow="medium" className="tc-profile-card" style={{ marginBottom: '2rem' }}>
          <h3 className="tc-profile-card-title">Thông tin cá nhân</h3>
          
          {message && (
            <div className={`tc-profile-message tc-profile-message--${message.type}`}>
              {message.text}
            </div>
          )}
          
          {isFetching ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <form onSubmit={handleSave} className="tc-profile-form">
              <div className="tc-profile-grid">
                <Input
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên đầy đủ"
                  fullWidth
                />
                <Input
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  fullWidth
                />
                <Input
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="tc-form-group tc-input-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="tc-input-label" style={{ fontWeight: 500, color: 'var(--tc-text-primary)' }}>Giới tính</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="tc-input-field"
                    style={{ padding: '0.75rem', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-gray-300)' }}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              
              <div className="tc-profile-actions">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card shadow="medium" className="tc-profile-card">
          <h3 className="tc-profile-card-title">Đổi mật khẩu</h3>
          
          {passwordMessage && (
            <div className={`tc-profile-message tc-profile-message--${passwordMessage.type}`}>
              {passwordMessage.text}
            </div>
          )}
          
          <form onSubmit={handlePasswordChange} className="tc-profile-form">
            <div className="tc-profile-grid">
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới"
                fullWidth
              />
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                fullWidth
              />
            </div>
            
            <div className="tc-profile-actions">
              <Button type="submit" variant="outline" isLoading={passwordLoading}>
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
