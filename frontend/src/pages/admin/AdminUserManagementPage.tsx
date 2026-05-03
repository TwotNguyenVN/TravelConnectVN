import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingBlock } from '../../components/common';

interface User {
  id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
  user_roles_user_roles_user_idTousers: { role_code: string }[];
}

export function AdminUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [roleStats, setRoleStats] = useState<any[]>([]);
  const { toast } = useToast();

  const roleConfig: Record<string, { label: string, color: string, bg: string, icon: string }> = {
    '': { label: 'Tất cả', color: '#64748b', bg: '#f1f5f9', icon: '👥' },
    'USER': { label: 'Người dùng', color: '#3b82f6', bg: '#eff6ff', icon: '👤' },
    'GUIDE': { label: 'Hướng dẫn viên', color: '#10b981', bg: '#ecfdf5', icon: '🗺️' },
    'SYSTEM_ADMIN': { label: 'Quản trị viên', color: '#ef4444', bg: '#fef2f2', icon: '🛡️' },
    'CONTENT_MODERATOR': { label: 'Kiểm duyệt', color: '#f59e0b', bg: '#fffbeb', icon: '⚖️' },
    'SUPPORT_STAFF': { label: 'Hỗ trợ', color: '#8b5cf6', bg: '#f5f3ff', icon: '🎧' },
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({ 
        search, 
        role: selectedRole || undefined,
        take: 50 
      });
      setUsers(response.data.items);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleStats = async () => {
    try {
      const response = await adminApi.getStatisticsUsers();
      if (response.success) {
        setRoleStats(response.data.roles);
      }
    } catch (error) {
      console.error('Failed to fetch role stats');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  useEffect(() => {
    fetchRoleStats();
  }, []);

  const getRoleCount = (code: string) => {
    if (!code) return roleStats.reduce((sum, r) => sum + r.value, 0);
    const stat = roleStats.find(r => r.name === code);
    return stat ? stat.value : 0;
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const reason = window.prompt(`Lý do thay đổi trạng thái sang ${newStatus}:`);
    if (reason === null) return;

    try {
      await adminApi.updateUserStatus(userId, { status: newStatus, reason });
      toast.success('Cập nhật trạng thái thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="admin-users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, margin: 0, color: '#1e293b' }}>Quản lý người dùng</h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Danh sách tài khoản và phân quyền hệ thống</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm tên, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              style={{
                padding: '10px 12px 10px 38px',
                borderRadius: 'var(--tc-radius-lg)',
                border: '1px solid var(--tc-border)',
                width: '300px',
                fontSize: 'var(--tc-font-size-sm)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>
          <button 
            onClick={fetchUsers}
            style={{
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              padding: '0 var(--tc-spacing-6)',
              borderRadius: 'var(--tc-radius-lg)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--tc-font-size-sm)',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
            }}>
            Lọc dữ liệu
          </button>
        </div>
      </div>

      {/* Role Cards / Tabs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: 'var(--tc-spacing-4)', 
        marginBottom: 'var(--tc-spacing-8)' 
      }}>
        {Object.entries(roleConfig).map(([code, config]) => (
          <div
            key={code}
            onClick={() => setSelectedRole(code)}
            style={{
              padding: 'var(--tc-spacing-5)',
              backgroundColor: 'white',
              borderRadius: 'var(--tc-radius-xl)',
              border: selectedRole === code ? `2px solid ${config.color}` : '1px solid var(--tc-border)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: selectedRole === code ? `0 10px 15px -3px ${config.color}20` : 'var(--tc-shadow-sm)',
              transform: selectedRole === code ? 'translateY(-2px)' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '-10px', 
              fontSize: '4rem', 
              opacity: 0.05,
              userSelect: 'none'
            }}>
              {config.icon}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: config.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {config.icon}
              </div>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: config.color, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {config.label}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
                {getRoleCount(code)}
              </div>
              <span style={{ fontSize: 'var(--tc-font-size-xs)', color: '#64748b' }}>thành viên</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: 'var(--tc-radius-xl)', 
        border: '1px solid var(--tc-border)', 
        overflow: 'hidden',
        boxShadow: 'var(--tc-shadow-md)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Họ tên</th>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Email</th>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Vai trò</th>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Trạng thái</th>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Ngày tạo</th>
              <th style={{ padding: 'var(--tc-spacing-5)', borderBottom: '1px solid var(--tc-border)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center' }}><LoadingBlock /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center', color: '#94a3b8', fontSize: 'var(--tc-font-size-sm)' }}>Không tìm thấy người dùng nào thuộc nhóm này</td></tr>
            ) : users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }} className="admin-table-row">
                <td style={{ padding: 'var(--tc-spacing-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--tc-font-size-sm)',
                      fontWeight: 600,
                      color: '#64748b'
                    }}>
                      {user.full_name?.charAt(0) || '?'}
                    </div>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{user.full_name}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--tc-spacing-5)', color: '#64748b', fontSize: 'var(--tc-font-size-sm)' }}>{user.email}</td>
                <td style={{ padding: 'var(--tc-spacing-5)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {user.user_roles_user_roles_user_idTousers.map(r => {
                      const cfg = roleConfig[r.role_code] || { color: '#64748b', bg: '#f1f5f9' };
                      return (
                        <span key={r.role_code} style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          padding: '3px 10px',
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          borderRadius: '6px',
                          fontWeight: 700,
                          border: `1px solid ${cfg.color}20`
                        }}>{r.role_code}</span>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: 'var(--tc-spacing-5)' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: user.status === 'active' ? '#ecfdf5' : '#fff1f2',
                    color: user.status === 'active' ? '#059669' : '#e11d48',
                    fontWeight: 700,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', marginRight: '8px' }}></span>
                    {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td style={{ padding: 'var(--tc-spacing-5)', color: '#94a3b8', fontSize: 'var(--tc-font-size-sm)' }}>
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: 'var(--tc-spacing-5)' }}>
                  <button 
                    onClick={() => handleStatusChange(user.id, user.status)}
                    style={{
                      backgroundColor: user.status === 'active' ? 'transparent' : '#10b981',
                      color: user.status === 'active' ? '#ef4444' : 'white',
                      border: `1px solid ${user.status === 'active' ? '#ef4444' : '#10b981'}`,
                      padding: '6px 12px',
                      borderRadius: 'var(--tc-radius-md)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      transition: 'all 0.2s ease'
                    }}>
                    {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
