import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';

interface CompanionPost {
  id: string;
  title: string;
  visibility_status: string;
  destination: string;
  start_date: string;
  users: {
    full_name: string;
  };
  created_at: string;
}

export const AdminCompanionManagementPage: React.FC = () => {
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('');
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCompanionPosts({ search, visibility });
      const postData = response.data?.items || response.data || [];
      setPosts(Array.isArray(postData) ? postData : []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch Companion Posts Error:', err);
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'Không thể tải danh sách bài viết';
      const displayMsg = status ? `[${status}] ${msg}` : msg;
      setError(displayMsg);
      toast.error(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [visibility]);

  const handleModerate = async (id: string, status: string) => {
    const reason = prompt('Nhập lý do thay đổi trạng thái:');
    if (reason === null) return;

    try {
      await adminApi.moderateCompanionPost(id, {
        visibility_status: status,
        reason
      });
      toast.success('Cập nhật thành công');
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      visible: { backgroundColor: 'var(--tc-success-bg)', color: 'var(--tc-success)' },
      hidden: { backgroundColor: 'var(--tc-danger-bg)', color: 'var(--tc-danger)' },
      flagged: { backgroundColor: 'var(--tc-warning-bg)', color: 'var(--tc-warning)' },
    };
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: 'var(--tc-font-size-xs)',
        fontWeight: 600,
        ...styles[status]
      }}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)' }}>Quản trị bài Tìm bạn đồng hành</h1>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)' }}>
          <select 
            value={visibility} 
            onChange={(e) => setVisibility(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--tc-radius-md)',
              border: '1px solid var(--tc-border)'
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="visible">Hiển thị</option>
            <option value="hidden">Đã ẩn</option>
            <option value="flagged">Cảnh báo</option>
          </select>
          <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--tc-radius-md)',
                border: '1px solid var(--tc-border)',
                width: '250px'
              }}
            />
            <button 
              onClick={fetchPosts}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--tc-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--tc-radius-md)',
                cursor: 'pointer'
              }}
            >
              Tìm
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--tc-bg-default)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--tc-bg-subtle)', borderBottom: '1px solid var(--tc-border)' }}>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Bài viết</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Người đăng</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Điểm đến</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Trạng thái</th>
              <th style={{ padding: 'var(--tc-spacing-4)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center' }}>
                  <LoadingBlock />
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--tc-spacing-10)', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
                  Không tìm thấy bài viết nào.
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    <div style={{ fontWeight: 600 }}>{post.title}</div>
                    <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>ID: {post.id}</div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    {post.users?.full_name || 'N/A'}
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    {post.destination}
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    {getStatusBadge(post.visibility_status)}
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)' }}>
                      {post.visibility_status !== 'visible' && (
                        <button onClick={() => handleModerate(post.id, 'visible')} style={{ padding: '4px 8px', fontSize: 'var(--tc-font-size-xs)' }}>Hiện</button>
                      )}
                      {post.visibility_status !== 'hidden' && (
                        <button onClick={() => handleModerate(post.id, 'hidden')} style={{ padding: '4px 8px', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-danger)' }}>Ẩn</button>
                      )}
                      {post.visibility_status !== 'flagged' && (
                        <button onClick={() => handleModerate(post.id, 'flagged')} style={{ padding: '4px 8px', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-warning)' }}>Gắn cờ</button>
                      )}
                    </div>
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
