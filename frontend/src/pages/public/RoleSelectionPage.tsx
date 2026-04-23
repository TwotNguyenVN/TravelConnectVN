import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import './Auth.css';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const bannerUrl = 'https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner-select-role.png';

  const handleSelectRole = (role: 'USER' | 'GUIDE') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="tc-role-page">
      {/* Banner Section */}
      <section className="tc-role-banner">
        <img src={bannerUrl} alt="Travel banner" className="tc-role-banner-img" />
        <div className="tc-role-banner-overlay"></div>
        <div className="tc-role-banner-content">
          <div className="tc-brand-tag">TravelConnectVN</div>
          <h1>Chọn hành trình của bạn</h1>
          <p>Bạn muốn khám phá những vùng đất mới hay trở thành người dẫn dắt những hành trình?</p>
        </div>
      </section>

      <div className="tc-role-container">
        <div className="tc-role-grid">
          {/* Tourist Option */}
          <div className="tc-role-card-new" onClick={() => handleSelectRole('USER')}>
            <div className="tc-role-card-icon tc-role-card-icon--user">
              <i className="fas fa-suitcase-rolling"></i>
            </div>
            <div className="tc-role-card-info">
              <h3>Người du lịch</h3>
              <p>Khám phá, đặt tour và tìm những người bạn đồng hành cho chuyến đi của bạn.</p>
              <ul className="tc-role-features">
                <li><i className="fas fa-check"></i> Tìm kiếm hàng ngàn tour hấp dẫn</li>
                <li><i className="fas fa-check"></i> Kết nối bạn đồng hành dễ dàng</li>
                <li><i className="fas fa-check"></i> Đánh giá & chia sẻ trải nghiệm</li>
              </ul>
              <Button variant="primary" fullWidth>Đăng ký User</Button>
            </div>
          </div>

          {/* Guide Option */}
          <div className="tc-role-card-new" onClick={() => handleSelectRole('GUIDE')}>
            <div className="tc-role-card-icon tc-role-card-icon--guide">
              <i className="fas fa-compass"></i>
            </div>
            <div className="tc-role-card-info">
              <h3>Hướng dẫn viên</h3>
              <p>Chia sẻ kiến thức địa phương và dẫn dắt những hành trình đầy cảm hứng.</p>
              <ul className="tc-role-features">
                <li><i className="fas fa-check"></i> Tạo và quản lý tour cá nhân</li>
                <li><i className="fas fa-check"></i> Tiếp cận cộng đồng du khách lớn</li>
                <li><i className="fas fa-check"></i> Xây dựng uy tín & thu nhập</li>
              </ul>
              <Button variant="secondary" fullWidth>Đăng ký Guide</Button>
            </div>
          </div>
        </div>

        <div className="tc-role-footer-new">
          <p>
            Đã có tài khoản? 
            <span className="tc-role-login-link" onClick={() => navigate('/login')}> Đăng nhập ngay</span>
          </p>
        </div>
      </div>
    </div>
  );
};
