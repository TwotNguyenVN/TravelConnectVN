import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

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
    avatar_url?: string;
  };
}

export const AdminActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState('');
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getActivityLogs({ module, take: 50 });
      setLogs(response.data?.items || []);
    } catch (err: any) {
      toast.error('Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [module]);

  const moduleConfig: Record<string, { label: string, color: string, bg: string, icon: string }> = {
    user_management: { label: 'Người dùng', color: '#3b82f6', bg: '#eff6ff', icon: '👤' },
    tour_moderation: { label: 'Tour', color: '#10b981', bg: '#ecfdf5', icon: '🏖️' },
    companion_moderation: { label: 'Đồng hành', color: '#8b5cf6', bg: '#f5f3ff', icon: '🤝' },
    guide_verification: { label: 'Xác minh', color: '#f59e0b', bg: '#fffbeb', icon: '🆔' },
    report_handling: { label: 'Báo cáo', color: '#ef4444', bg: '#fef2f2', icon: '🚩' },
  };

  const getActionStyle = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('approve') || a.includes('unlock') || a.includes('visible') || a.includes('unhide')) return { color: '#10b981', bg: '#ecfdf5' };
    if (a.includes('reject') || a.includes('lock') || a.includes('hidden') || a.includes('hide')) return { color: '#ef4444', bg: '#fef2f2' };
    if (a.includes('flag') || a.includes('warn')) return { color: '#f59e0b', bg: '#fffbeb' };
    return { color: '#64748b', bg: '#f1f5f9' };
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--tc-spacing-8)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b' }}>Nhật ký hoạt động</h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Theo dõi các thao tác quản trị trên toàn hệ thống</p>
        </div>
        <select 
          value={module} 
          onChange={(e) => setModule(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--tc-radius-lg)',
            border: '1px solid var(--tc-border)',
            backgroundColor: 'white',
            fontSize: 'var(--tc-font-size-sm)',
            outline: 'none',
            boxShadow: 'var(--tc-shadow-sm)'
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

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: 'var(--tc-radius-xl)', 
        border: '1px solid var(--tc-border)', 
        overflow: 'hidden',
        boxShadow: 'var(--tc-shadow-md)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--tc-border)' }}>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thời gian</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Người thực hiện</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Hành động</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Đối tượng</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center' }}><LoadingBlock /></td></tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
                  <div>Chưa có hoạt động nào được ghi lại</div>
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const mod = moduleConfig[log.module_name] || { label: log.module_name, color: '#64748b', bg: '#f1f5f9', icon: '⚙️' };
                const actionStyle = getActionStyle(log.action_type);
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }} className="admin-table-row">
                    <td style={{ padding: 'var(--tc-spacing-5)' }}>
                      <div style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 600, color: '#1e293b' }}>
                        {new Date(log.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(log.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--tc-spacing-5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                          {log.users?.avatar_url ? <img src={log.users.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : 'A'}
                        </div>
                        <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }}>{log.users?.full_name || 'Hệ thống'}</span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--tc-spacing-5)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: '4px', backgroundColor: actionStyle.bg, color: actionStyle.color,
                          fontSize: '10px', fontWeight: 700, width: 'fit-content', textTransform: 'uppercase'
                        }}>
                          {log.action_type.replace('_', ' ')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94a3b8' }}>
                          {mod.icon} {mod.label}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--tc-spacing-5)' }}>
                      <div style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{log.entity_type}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>{log.entity_pk?.substring(0, 13)}...</div>
                    </td>
                    <td style={{ padding: 'var(--tc-spacing-5)' }}>
                      <div style={{ 
                        fontSize: 'var(--tc-font-size-sm)', color: '#334155', fontStyle: log.reason ? 'normal' : 'italic',
                        maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }} title={log.reason}>
                        {log.reason || 'Không có lý do'}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
