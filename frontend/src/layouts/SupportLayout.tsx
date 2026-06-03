import { Outlet } from 'react-router-dom';
import { SupportSidebar } from '../components/support/SupportSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

export function SupportLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--tc-bg-subtle)' }}>
      <SupportSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader />
        <main style={{ flex: 1, padding: 'var(--tc-spacing-5)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
