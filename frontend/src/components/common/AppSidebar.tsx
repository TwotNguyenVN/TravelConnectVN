import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../layouts/UserLayout.css'; // Reuse the CSS

export const AppSidebar: React.FC = () => {
  const { roles } = useAuth();
  const isGuide = roles.includes('GUIDE');

  return (
    <aside className="user-sidebar">
      <div className="sidebar-logo">
        <span>🌍</span> TravelConnect
      </div>
      
      <div className="nav-group">
        <div className="nav-group-title">Trung tâm điều khiển</div>
        <nav className="nav-list">
          {isGuide ? (
            <NavLink to="/guide" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              📊 Dashboard Tổng hợp
            </NavLink>
          ) : (
            <NavLink to="/user" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              👤 Hồ sơ của tôi
            </NavLink>
          )}
          <NavLink to="/user/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            📅 Yêu cầu của tôi
          </NavLink>
          <NavLink to="/user/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            ❤️ Yêu thích
          </NavLink>
          <NavLink to="/user/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            🔔 Thông báo
          </NavLink>
          <NavLink to="/user/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            💬 Tin nhắn
          </NavLink>
          <NavLink to="/user/payments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            💳 Thanh toán
          </NavLink>
        </nav>
      </div>

      {isGuide && (
        <div className="nav-group">
          <div className="nav-group-title">Nghiệp vụ HDV</div>
          <nav className="nav-list">
            <NavLink to="/guide/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              🔧 Kỹ năng & Kinh nghiệm
            </NavLink>
            <NavLink to="/guide/tours" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              🎒 Quản lý Tour
            </NavLink>
            <NavLink to="/guide/tour-requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              📥 Yêu cầu từ khách
            </NavLink>
            <NavLink to="/guide/verification" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              ✅ Xác minh tài khoản
            </NavLink>
          </nav>
        </div>
      )}

      <div className="nav-group">
        <div className="nav-group-title">Khám phá</div>
        <nav className="nav-list">
          <NavLink to="/user/ai-assistant" className={({ isActive }) => `nav-item nav-item-ai ${isActive ? 'active' : ''}`}>
            ✨ Trợ lý AI
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link to="/" className="nav-item">
          🏠 Về trang chủ
        </Link>
      </div>
    </aside>
  );
};
