import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/common/AppSidebar';
import { GuideHeader } from '../components/guide/GuideHeader';

export function GuideLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--tc-bg-subtle)' }}>
      <AppSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <GuideHeader />
        <main style={{ flex: 1, padding: 'var(--tc-spacing-5)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
