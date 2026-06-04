import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

interface DeletedItem {
  id: string;
  type: 'tour' | 'companion_post' | 'user';
  title: string;
  owner: string;
  created_at: string;
  deleted_at: string | null;
  status?: string;
}

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  tour: { label: 'Tour', color: '#10b981', bg: '#ecfdf5', icon: '🏖️' },
  companion_post: { label: 'Bài ghép đoàn', color: '#8b5cf6', bg: '#f5f3ff', icon: '🤝' },
  user: { label: 'Tài khoản', color: '#f59e0b', bg: '#fffbeb', icon: '👤' },
};

export const AdminRecoveryConsolePage: React.FC = () => {
  const [items, setItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDeletedItems();
      setItems(response.data || []);
    } catch {
      toast.error('Không thể tải danh sách bản ghi đã xóa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRestore = async (type: string, id: string) => {
    try {
      setRestoringId(id);
      await adminApi.restoreDeletedItem(type, id);
      toast.success('Khôi phục thành công!');
      setItems(prev => prev.filter(item => item.id !== id));
    } catch {
      toast.error('Không thể khôi phục bản ghi');
    } finally {
      setRestoringId(null);
    }
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--tc-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          🗑️ Console Khôi Phục Dữ Liệu
        </h1>
        <p style={{ color: 'var(--tc-text-secondary)', marginTop: '4px', fontSize: '14px' }}>
          Tra cứu và khôi phục các bản ghi đã bị xóa mềm (Tours, Bài ghép đoàn, Tài khoản)
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: '📋 Tất cả', count: items.length },
          { key: 'tour', label: '🏖️ Tours', count: items.filter(i => i.type === 'tour').length },
          { key: 'companion_post', label: '🤝 Bài ghép đoàn', count: items.filter(i => i.type === 'companion_post').length },
          { key: 'user', label: '👤 Tài khoản', count: items.filter(i => i.type === 'user').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: filter === tab.key ? '2px solid var(--tc-primary)' : '1px solid var(--tc-border)',
              background: filter === tab.key ? 'var(--tc-primary-light, #eff6ff)' : 'white',
              color: filter === tab.key ? 'var(--tc-primary)' : 'var(--tc-text-secondary)',
              fontWeight: filter === tab.key ? 600 : 400,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--tc-text-secondary)',
          fontSize: '15px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
          <div>Không có bản ghi nào cần khôi phục</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(item => {
            const cfg = typeConfig[item.type] || { label: item.type, color: '#64748b', bg: '#f1f5f9', icon: '📄' };
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid var(--tc-border)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '250px' }}>
                  <span style={{
                    fontSize: '24px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    background: cfg.bg,
                  }}>
                    {cfg.icon}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--tc-text-primary)', fontSize: '14px' }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: cfg.bg,
                        color: cfg.color,
                        fontWeight: 500,
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--tc-text-tertiary)' }}>
                        Chủ sở hữu: {item.owner}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    {item.deleted_at && (
                      <div style={{ fontSize: '12px', color: '#ef4444' }}>
                        🗑️ Xóa: {new Date(item.deleted_at).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                    {item.status && (
                      <div style={{ fontSize: '12px', color: '#f59e0b' }}>
                        Trạng thái: {item.status}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--tc-text-tertiary)', marginTop: '2px' }}>
                      Tạo: {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(item.type, item.id)}
                    disabled={restoringId === item.id}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: restoringId === item.id
                        ? 'var(--tc-text-tertiary)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: restoringId === item.id ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.15s ease',
                      opacity: restoringId === item.id ? 0.7 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {restoringId === item.id ? '⏳ Đang khôi phục...' : '♻️ Khôi Phục'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
