import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppSidebar } from '../components/common/AppSidebar';
import './UserLayout.css';

export function UserLayout() {
  return (
    <div className="user-layout">
      <AppSidebar />

      <main className="user-main">
        <header className="user-header">
          <h2>Dashboard người dùng</h2>
          <div className="user-header-actions">
            {/* Can add notifications toggle or user menu here */}
          </div>
        </header>
        <div className="user-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
