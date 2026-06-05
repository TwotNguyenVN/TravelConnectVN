/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingBlock } from '../../components/common';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
  user_roles_user_roles_user_idTousers: { role_code: string }[];
}

const AVAILABLE_ROLES = [
  { code: 'SYSTEM_ADMIN', label: 'Quản trị viên Hệ thống 🛡️' },
  { code: 'CONTENT_MODERATOR', label: 'Kiểm duyệt viên Nội dung ⚖️' },
  { code: 'SUPPORT_STAFF', label: 'Hỗ trợ Khách hàng 🎧' },
  { code: 'ACCOUNTANT', label: 'Kế toán & Tài chính 💳' },
  { code: 'GUIDE', label: 'Hướng dẫn viên du lịch 🗺️' },
  { code: 'USER', label: 'Khách du lịch 👤' },
];

export function AdminUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [roleStats, setRoleStats] = useState<{ name: string; value: number }[]>([]);
  const { toast } = useToast();

  // Create Staff States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffFullName, setStaffFullName] = useState('');
  const [staffRole, setStaffRole] = useState('CONTENT_MODERATOR');
  const [creating, setCreating] = useState(false);

  // Role Mapping States
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);

  const roleConfig: Record<string, { label: string, color: string, bg: string, icon: string }> = {
    '': { label: 'Tất cả', color: '#64748b', bg: '#f1f5f9', icon: '👥' },
    'USER': { label: 'Người dùng', color: '#3b82f6', bg: '#eff6ff', icon: '👤' },
    'GUIDE': { label: 'Hướng dẫn viên', color: '#10b981', bg: '#ecfdf5', icon: '🗺️' },
    'SYSTEM_ADMIN': { label: 'Quản trị viên', color: '#ef4444', bg: '#fef2f2', icon: '🛡️' },
    'CONTENT_MODERATOR': { label: 'Kiểm duyệt', color: '#f59e0b', bg: '#fffbeb', icon: '⚖️' },
    'SUPPORT_STAFF': { label: 'Hỗ trợ', color: '#8b5cf6', bg: '#f5f3ff', icon: '🎧' },
    'ACCOUNTANT': { label: 'Kế toán', color: '#06b6d4', bg: '#ecfeff', icon: '💳' },
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({ 
        search, 
        role: selectedRole || undefined,
        take: 50 
      });
      setUsers(response.data.items);
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [search, selectedRole, toast]);

  const fetchRoleStats = useCallback(async () => {
    try {
      const response = await adminApi.getStatisticsUsers();
      if (response.success) {
        setRoleStats(response.data.roles);
      }
    } catch {
      console.error('Failed to fetch role stats');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchRoleStats();
  }, [fetchRoleStats]);

  function getRoleCount(code: string) {
    if (!code) return roleStats.reduce((sum, r) => sum + r.value, 0);
    const stat = roleStats.find(r => r.name === code);
    return stat ? stat.value : 0;
  };

  async function handleStatusChange(userId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const reason = window.prompt(`Lý do thay đổi trạng thái sang ${newStatus}:`);
    if (reason === null) return;

    try {
      await adminApi.updateUserStatus(userId, { status: newStatus, reason });
      toast.success('Cập nhật trạng thái thành công');
      fetchUsers();
    } catch {
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  async function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!staffEmail.trim() || !staffPassword.trim() || !staffFullName.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      setCreating(true);
      await adminApi.createStaff({
        email: staffEmail.trim(),
        password: staffPassword,
        fullName: staffFullName.trim(),
        roleCode: staffRole,
      });
      toast.success('Tạo tài khoản nhân viên thành công');
      setShowCreateModal(false);
      setStaffEmail('');
      setStaffPassword('');
      setStaffFullName('');
      setStaffRole('CONTENT_MODERATOR');
      fetchUsers();
      fetchRoleStats();
    } catch (err: any) {
      console.error(err);
      toast.error((err as ApiError)?.response?.data?.message || 'Tạo nhân viên thất bại');
    } finally {
      setCreating(false);
    }
  };

  async function handleRoleToggle(roleCode: string, roleLabel: string) {
    if (!selectedUser) return;
    const hasRole = userRoles.includes(roleCode);
    const confirmMsg = hasRole 
      ? `Bạn có chắc chắn muốn thu hồi vai trò "${roleLabel}" từ người dùng "${selectedUser.full_name}" không?`
      : `Bạn có chắc chắn muốn gán vai trò "${roleLabel}" cho người dùng "${selectedUser.full_name}" không?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingRoles(true);
      if (hasRole) {
        await adminApi.revokeRole(selectedUser.id, roleCode);
        setUserRoles(prev => prev.filter(r => r !== roleCode));
        toast.success(`Đã thu hồi vai trò ${roleLabel}`);
      } else {
        await adminApi.assignRole(selectedUser.id, { roleCode, note: 'Cấp quyền từ bảng điều khiển Admin' });
        setUserRoles(prev => [...prev, roleCode]);
        toast.success(`Đã gán vai trò ${roleLabel}`);
      }
      fetchUsers();
      fetchRoleStats();
    } catch (err: any) {
      console.error(err);
      toast.error((err as ApiError)?.response?.data?.message || 'Cập nhật vai trò thất bại');
    } finally {
      setUpdatingRoles(false);
    }
  };

  return (
    <div className="admin-users" style={{ padding: 'var(--tc-spacing-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, margin: 0, color: '#1e293b' }}>Quản lý người dùng</h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Danh sách tài khoản và phân quyền hệ thống</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', alignItems: 'center' }}>
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
                width: '260px',
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
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid var(--tc-border)',
              padding: '10px var(--tc-spacing-5)',
              borderRadius: 'var(--tc-radius-lg)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--tc-font-size-sm)',
            }}>
            Tìm kiếm
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px var(--tc-spacing-5)',
              borderRadius: 'var(--tc-radius-lg)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--tc-font-size-sm)',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}>
            ➕ Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Role Cards / Tabs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
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

      {/* Users Table */}
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
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }}>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setUserRoles(user.user_roles_user_roles_user_idTousers.map(r => r.role_code));
                        setShowRoleModal(true);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--tc-primary)',
                        border: '1px solid var(--tc-primary)',
                        padding: '6px 12px',
                        borderRadius: 'var(--tc-radius-md)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      🛡️ Phân quyền
                    </button>
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
                      {user.status === 'active' ? 'Khóa' : 'Mở'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Staff */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--tc-spacing-4)'
        }}>
          <form 
            onSubmit={handleCreateStaff}
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--tc-radius-xl)',
              padding: 'var(--tc-spacing-6)',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--tc-shadow-xl)'
            }}
          >
            <h3 style={{ margin: '0 0 var(--tc-spacing-5) 0', fontSize: 'var(--tc-font-size-lg)', fontWeight: 800, color: '#1e293b' }}>
              ➕ Thêm Nhân viên mới
            </h3>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Họ và tên *</label>
              <input
                type="text"
                required
                placeholder="Nhập họ tên nhân viên..."
                value={staffFullName}
                onChange={e => setStaffFullName(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Email đăng nhập *</label>
              <input
                type="email"
                required
                placeholder="email.nhanvien@travelconnect.vn"
                value={staffEmail}
                onChange={e => setStaffEmail(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Mật khẩu khởi tạo *</label>
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự..."
                value={staffPassword}
                onChange={e => setStaffPassword(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--tc-spacing-6)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Vai trò công việc *</label>
              <select
                value={staffRole}
                onChange={e => setStaffRole(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)',
                  fontSize: '14px', outline: 'none', cursor: 'pointer', backgroundColor: 'white', boxSizing: 'border-box'
                }}
              >
                <option value="CONTENT_MODERATOR">Kiểm duyệt viên Nội dung (CONTENT_MODERATOR)</option>
                <option value="SUPPORT_STAFF">Nhân viên Hỗ trợ Khách hàng (SUPPORT_STAFF)</option>
                <option value="ACCOUNTANT">Nhân viên Kế toán & Tài chính (ACCOUNTANT)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                style={{
                  padding: '10px 16px', border: '1px solid var(--tc-border)', borderRadius: '8px',
                  backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontWeight: 600
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: '10px 20px', border: 'none', borderRadius: '8px',
                  backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 700,
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                }}
              >
                {creating ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Role Mapping (Phân quyền) */}
      {showRoleModal && selectedUser && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 'var(--tc-spacing-4)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--tc-radius-xl)',
            padding: 'var(--tc-spacing-6)',
            maxWidth: '460px',
            width: '100%',
            boxShadow: 'var(--tc-shadow-xl)'
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 'var(--tc-font-size-lg)', fontWeight: 800, color: '#1e293b' }}>
              🛡️ Cấu hình Vai trò & Phân quyền
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 var(--tc-spacing-5) 0' }}>
              Thiết lập các vai trò hoạt động cho <strong>{selectedUser.full_name}</strong> ({selectedUser.email})
            </p>

            <div style={{ 
              display: 'flex', flexDirection: 'column', gap: '12px',
              backgroundColor: '#f8fafc', padding: '16px', borderRadius: 'var(--tc-radius-lg)',
              border: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-6)'
            }}>
              {AVAILABLE_ROLES.map(role => {
                const isChecked = userRoles.includes(role.code);
                return (
                  <label 
                    key={role.code}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '8px 12px', borderRadius: '6px',
                      backgroundColor: isChecked ? 'white' : 'transparent',
                      border: `1px solid ${isChecked ? 'var(--tc-border)' : 'transparent'}`,
                      cursor: updatingRoles ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: 'var(--tc-font-size-sm)',
                      fontWeight: isChecked ? 600 : 500,
                      color: isChecked ? '#1e293b' : '#64748b'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={updatingRoles}
                      onChange={() => handleRoleToggle(role.code, role.label)}
                      style={{
                        width: '16px', height: '16px', cursor: updatingRoles ? 'not-allowed' : 'pointer'
                      }}
                    />
                    {role.label}
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                style={{
                  padding: '10px 20px', border: '1px solid var(--tc-border)', borderRadius: '8px',
                  backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
