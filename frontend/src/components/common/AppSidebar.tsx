import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../layouts/UserLayout.css'; // Reuse the CSS

export const AppSidebar: React.FC = () => {
  const { roles } = useAuth();
  const isGuide = roles.includes('GUIDE');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'personal';

  return (
    <aside className="user-sidebar">
      <div className="sidebar-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌍</span> TravelConnect
        </Link>
      </div>
      
      <div className="nav-group">
        <div className="nav-group-title">Trung tâm điều khiển</div>
        <nav className="nav-list">
          {isGuide ? (
            <>
              <NavLink to="/guide" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                📊 Dashboard Tổng hợp
              </NavLink>
              <NavLink to="/guide/schedules" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                📅 Lịch trình
              </NavLink>
            </>
          ) : (
            <NavLink to="/user" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              👤 Hồ sơ của tôi
            </NavLink>
          )}
          <NavLink to="/user/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            📅 Hoạt động của tôi
          </NavLink>
          <NavLink to="/user/companion-posts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            🤝 Bài đăng đồng hành
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
        </nav>
      </div>

      {isGuide && (
        <div className="nav-group">
          <div className="nav-group-title">Nghiệp vụ HDV</div>
          <nav className="nav-list">
            <NavLink to="/guide/profile" className={`nav-item ${location.pathname === '/guide/profile' ? 'active' : ''}`}>
              👤 Hồ sơ & Xác minh
            </NavLink>
            <NavLink to="/guide/tours" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              🎒 Quản lý Tour
            </NavLink>
            <NavLink to="/guide/tour-requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              📥 Yêu cầu từ khách
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
