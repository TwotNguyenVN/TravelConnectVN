import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/common/AppSidebar';
import { GuideHeader } from '../components/guide/GuideHeader';
import './UserLayout.css';

export function GuideLayout() {
  return (
    <div className="guide-layout">
      <AppSidebar />
      <div className="guide-main-container">
        <GuideHeader />
        <main className="guide-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
