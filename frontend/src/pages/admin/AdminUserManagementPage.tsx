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
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({ search, take: 50 });
      setUsers(response.data.items);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)' }}>Quản lý người dùng</h1>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
              borderRadius: 'var(--tc-radius-md)',
              border: '1px solid var(--tc-border)'
            }}
          />
          <button 
            onClick={fetchUsers}
            style={{
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              padding: 'var(--tc-spacing-2) var(--tc-spacing-5)',
              borderRadius: 'var(--tc-radius-md)',
              cursor: 'pointer'
            }}>
            Tìm kiếm
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--tc-bg-default)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--tc-bg-subtle)' }}>
            <tr>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Họ tên</th>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Email</th>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Vai trò</th>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Trạng thái</th>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Ngày tạo</th>
              <th style={{ padding: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center' }}><LoadingBlock /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center' }}>Không tìm thấy người dùng</td></tr>
            ) : users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                <td style={{ padding: 'var(--tc-spacing-4)' }}>{user.full_name}</td>
                <td style={{ padding: 'var(--tc-spacing-4)' }}>{user.email}</td>
                <td style={{ padding: 'var(--tc-spacing-4)' }}>
                  {user.user_roles_user_roles_user_idTousers.map(r => (
                    <span key={r.role_code} style={{
                      display: 'inline-block',
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: 'var(--tc-bg-subtle)',
                      borderRadius: '10px',
                      marginRight: '4px'
                    }}>{r.role_code}</span>
                  ))}
                </td>
                <td style={{ padding: 'var(--tc-spacing-4)' }}>
                  <span style={{
                    color: user.status === 'active' ? 'var(--tc-success)' : 'var(--tc-danger)',
                    fontWeight: 600,
                    fontSize: 'var(--tc-font-size-sm)'
                  }}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--tc-spacing-4)', color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: 'var(--tc-spacing-4)' }}>
                  <button 
                    onClick={() => handleStatusChange(user.id, user.status)}
                    style={{
                      backgroundColor: 'transparent',
                      color: user.status === 'active' ? 'var(--tc-danger)' : 'var(--tc-success)',
                      border: `1px solid ${user.status === 'active' ? 'var(--tc-danger)' : 'var(--tc-success)'}`,
                      padding: 'var(--tc-spacing-1) var(--tc-spacing-3)',
                      borderRadius: 'var(--tc-radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--tc-font-size-xs)'
                    }}>
                    {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
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
