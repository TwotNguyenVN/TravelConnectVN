import React, { useState, useEffect } from 'react';
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
    avatar_url?: string;
  };
  created_at: string;
}

export const AdminCompanionManagementPage: React.FC = () => {
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('');
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCompanionPosts({ search, visibility, take: 50 });
      setPosts(response.data?.items || []);
    } catch (err: any) {
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [visibility]);

  const handleModerate = async (id: string, status: string) => {
    const actionLabel = status === 'visible' ? 'HIỂN THỊ' : status === 'hidden' ? 'ẨN' : 'CẢNH BÁO';
    const reason = window.prompt(`Nhập lý do thực hiện thao tác ${actionLabel}:`);
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

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    visible: { label: 'Đang hiển thị', color: '#059669', bg: '#ecfdf5' },
    hidden: { label: 'Đã ẩn', color: '#e11d48', bg: '#fff1f2' },
    flagged: { label: 'Cảnh báo', color: '#d97706', bg: '#fffbeb' },
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--tc-spacing-8)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b' }}>Quản trị Tìm bạn đồng hành</h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Quản lý bài đăng tìm bạn đồng hành của người dùng</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)' }}>
          <select 
            value={visibility} 
            onChange={(e) => setVisibility(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--tc-radius-lg)',
              border: '1px solid var(--tc-border)',
              backgroundColor: 'white',
              fontSize: 'var(--tc-font-size-sm)',
              outline: 'none'
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="visible">Đang hiển thị</option>
            <option value="hidden">Đã ẩn</option>
            <option value="flagged">Cảnh báo</option>
          </select>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              style={{
                padding: '10px 12px 10px 38px',
                borderRadius: 'var(--tc-radius-lg)',
                border: '1px solid var(--tc-border)',
                width: '280px',
                fontSize: 'var(--tc-font-size-sm)',
                outline: 'none'
              }}
            />
          </div>
          <button onClick={fetchPosts} style={{
            padding: '10px 20px',
            backgroundColor: 'var(--tc-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--tc-radius-lg)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 'var(--tc-font-size-sm)'
          }}>Lọc</button>
        </div>
      </div>

      {/* Table */}
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
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Bài viết & Điểm đến</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Người đăng</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thời gian</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Trạng thái</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center' }}><LoadingBlock /></td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy bài viết nào</td></tr>
            ) : posts.map(post => {
              const status = statusConfig[post.visibility_status] || statusConfig.visible;
              return (
                <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }} className="admin-table-row">
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 'var(--tc-font-size-sm)' }}>{post.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>📍 {post.destination}</div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        {post.users?.avatar_url ? <img src={post.users.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : 'U'}
                      </div>
                      <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }}>{post.users?.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 600 }}>{new Date(post.start_date).toLocaleDateString('vi-VN')}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Đăng lúc: {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 10px', borderRadius: '20px', backgroundColor: status.bg, color: status.color,
                      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase'
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {post.visibility_status !== 'visible' && (
                        <button onClick={() => handleModerate(post.id, 'visible')} title="Hiển thị" style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}>👁️</button>
                      )}
                      {post.visibility_status !== 'hidden' && (
                        <button onClick={() => handleModerate(post.id, 'hidden')} title="Ẩn" style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}>🙈</button>
                      )}
                      {post.visibility_status !== 'flagged' && (
                        <button onClick={() => handleModerate(post.id, 'flagged')} title="Cảnh báo" style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}>🚩</button>
                      )}
                      <button onClick={() => window.open(`/companion/${post.id}`, '_blank')} title="Xem chi tiết" style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}>🔗</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
