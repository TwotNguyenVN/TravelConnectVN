import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../api/admin.api';
import { MaintenancePage } from '../pages/public/MaintenancePage';

export const MaintenanceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { roles, isLoading: authLoading } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await adminApi.getPublicSettings();
        if (res.data) {
          setMaintenanceMode(res.data.maintenanceMode === true);
        }
      } catch (err) {
        console.error('Failed to load maintenance settings:', err);
      } finally {
        setChecking(false);
      }
    };

    checkMaintenance();

    // Check every 15 seconds so the app automatically restores when maintenance is turned off
    const interval = setInterval(checkMaintenance, 15000);
    return () => clearInterval(interval);
  }, []);

  if (authLoading || checking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.05)',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Đang kết nối hệ thống...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const isAdmin = roles.includes('SYSTEM_ADMIN');

  if (maintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};
