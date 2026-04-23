import { Outlet, Link } from 'react-router-dom';

export function UserLayout() {
  return (
    <div className="user-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: '#e3f2fd', padding: '1rem' }}>
        <h3>User Area</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/user">My Profile</Link>
          <Link to="/user/requests">My Requests</Link>
          <Link to="/user/favorites">My Favorites</Link>
          <Link to="/user/notifications">Notifications</Link>
          <Link to="/user/activity-logs">Activity Logs</Link>
          <Link to="/user/messages">Tin nhắn</Link>
          <Link to="/user/ai-assistant" style={{ color: '#0284c7', fontWeight: 600 }}>✨ Trợ lý AI</Link>
          <Link to="/user/payments">Lịch sử thanh toán</Link>
          <Link to="/">Back to Home</Link>


        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <strong>User Dashboard</strong>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
