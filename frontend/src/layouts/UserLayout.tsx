import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppSidebar } from '../components/common/AppSidebar';
import './UserLayout.css';

export function UserLayout() {
  const location = useLocation();
  const isAiAssistant = location.pathname === '/user/ai-assistant';

  return (
    <div className={`user-layout ${isAiAssistant ? 'user-layout-no-scroll' : ''}`}>
      <AppSidebar />

      <main className={`user-main ${isAiAssistant ? 'user-main-no-scroll' : ''}`}>
        {!isAiAssistant && (
          <header className="user-header">
            <h2>Dashboard người dùng</h2>
            <div className="user-header-actions">
              {/* Can add notifications toggle or user menu here */}
            </div>
          </header>
        )}
        <div className={`user-content ${isAiAssistant ? 'user-content-no-scroll' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

