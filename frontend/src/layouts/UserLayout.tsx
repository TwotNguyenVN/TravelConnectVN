import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppSidebar } from '../components/common/AppSidebar';
import './UserLayout.css';

export function UserLayout() {
  const location = useLocation();
  const isFullHeightPage = ['/user/ai-assistant', '/user/messages'].includes(location.pathname);

  return (
    <div className="user-layout">
      <AppSidebar />

      <main className={`user-main ${isFullHeightPage ? 'user-main-full-height' : ''}`}>
        {!isFullHeightPage && (
          <header className="user-header">
            <h2>Dashboard người dùng</h2>
            <div className="user-header-actions">
              {/* Can add notifications toggle or user menu here */}
            </div>
          </header>
        )}
        <div className={`user-content ${isFullHeightPage ? 'user-content-full-height' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

