import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';

export const MaintenancePage: React.FC = () => {
  const [message, setMessage] = useState('Hệ thống đang tiến hành bảo trì định kỳ để nâng cấp dịch vụ. Vui lòng quay lại sau.');

  useEffect(() => {
    adminApi.getPublicSettings()
      .then((res) => {
        if (res.data?.maintenanceMessage) {
          setMessage(res.data.maintenanceMessage);
        }
      })
      .catch((err) => {
        console.error('Failed to load maintenance status:', err);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      padding: '24px',
      color: '#f8fafc',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background blobs for depth */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
        top: '10%',
        left: '20%',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)',
        bottom: '10%',
        right: '10%',
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />

      {/* Glass Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '48px 32px',
        width: '100%',
        maxWidth: '560px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Animated Gears Logo */}
        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '32px' }}>
          {/* Main Gear */}
          <div style={{
            fontSize: '64px',
            position: 'absolute',
            top: '10px',
            left: '10px',
            animation: 'spin-clockwise 10s linear infinite',
            lineHeight: 1
          }}>
            ⚙️
          </div>
          {/* Small Gear */}
          <div style={{
            fontSize: '40px',
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            animation: 'spin-counterclockwise 6s linear infinite',
            lineHeight: 1
          }}>
            ⚙️
          </div>
        </div>

        {/* Header */}
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          marginBottom: '16px',
          background: 'linear-gradient(to right, #818cf8, #f472b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Hệ Thống Đang Bảo Trì
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#cbd5e1',
          lineHeight: '1.7',
          marginBottom: '32px',
          fontWeight: 400
        }}>
          {message}
        </p>

        {/* Decorative Divider */}
        <div style={{
          width: '80px',
          height: '4px',
          background: 'linear-gradient(to right, #6366f1, #ec4899)',
          borderRadius: '2px',
          marginBottom: '32px'
        }} />

        {/* Countdown / Meta Info */}
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '0.9rem',
          color: '#94a3b8',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite' }} />
          <span>Chúng tôi sẽ sớm hoạt động trở lại. Cảm ơn sự thông cảm của bạn!</span>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
