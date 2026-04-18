import React from 'react';
import { Outlet } from 'react-router-dom';
import { GuideSidebar } from '../components/guide/GuideSidebar';
import { GuideHeader } from '../components/guide/GuideHeader';

export function GuideLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--tc-bg-subtle)' }}>
      <GuideSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <GuideHeader />
        <main style={{ flex: 1, padding: 'var(--tc-spacing-5)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
