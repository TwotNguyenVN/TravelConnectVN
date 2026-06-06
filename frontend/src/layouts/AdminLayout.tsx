import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { adminApi } from '../api/admin.api';

export function AdminLayout() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    adminApi.getPublicSettings()
      .then((res) => {
        setIsMaintenance(res.data?.maintenanceMode === true);
      })
      .catch((err) => console.error('Failed to load maintenance state in layout:', err));

    const handleMaintenanceChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMaintenance(customEvent.detail.enabled);
    };

    window.addEventListener('maintenance-changed', handleMaintenanceChange);
    return () => window.removeEventListener('maintenance-changed', handleMaintenanceChange);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--tc-bg-subtle)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader />
        
        {isMaintenance && (
          <div style={{
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fef3c7',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#b45309',
            fontSize: '14px',
            fontWeight: 600,
            zIndex: 100
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <span>Hệ thống đang hoạt động ở Chế độ Bảo trì. Người dùng thông thường không thể thao tác ghi dữ liệu.</span>
          </div>
        )}

        <main style={{ flex: 1, padding: 'var(--tc-spacing-5)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
