import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ActivityLog {
  id: string;
  actor_user_id: string;
  module_name: string;
  entity_type: string;
  entity_pk: string;
  action_type: string;
  reason: string;
  created_at: string;
  users: {
    full_name: string;
  };
}

export const AdminActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/activity-logs', {
        headers: { Authorization: `Bearer ${token}` },
        params: { module }
      });
      const logData = response.data?.items || response.data || [];
      setLogs(Array.isArray(logData) ? logData : []);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [module]);

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)' }}>Nhật ký hoạt động quản trị</h1>
        <select 
          value={module} 
          onChange={(e) => setModule(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--tc-radius-md)',
            border: '1px solid var(--tc-border)'
          }}
        >
          <option value="">Tất cả module</option>
          <option value="user_management">Quản lý người dùng</option>
          <option value="tour_moderation">Kiểm duyệt Tour</option>
          <option value="companion_moderation">Kiểm duyệt Bài đồng hành</option>
          <option value="guide_verification">Xác minh HDV</option>
          <option value="report_handling">Xử lý báo cáo</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'var(--tc-bg-default)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Thời gian</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Người thực hiện</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Hành động</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Đối tượng</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center' }}>Chưa có hoạt động nào.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                  <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)' }}>
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    {log.users?.full_name || 'Hệ thống'}
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    <span style={{ fontWeight: 600 }}>{log.action_type.toUpperCase()}</span>
                    <div style={{ fontSize: '10px', color: 'var(--tc-text-secondary)' }}>{log.module_name}</div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)' }}>
                    {log.entity_type} ({log.entity_pk.substring(0, 8)}...)
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)' }}>
                    {log.reason || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
