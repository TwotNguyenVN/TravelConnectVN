import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';

interface Tour {
  id: string;
  title: string;
  visibility_status: string;
  price: number;
  province: string;
  category_id: string;
  tour_images?: any;
  created_at: string;
  guide_profiles: {
    users: {
      full_name: string;
    };
  };
}

export const AdminTourManagementPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [toursRes, statsRes] = await Promise.all([
        adminApi.getTours({ search, visibility, take: 50 }),
        adminApi.getStatisticsTours()
      ]);
      setTours(toursRes.data?.items || []);
      setStats(statsRes.data);
    } catch (err: any) {
      toast.error('Không thể tải dữ liệu tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [visibility]);

  const handleModerate = async (id: string, status: string) => {
    const actionLabel = status === 'visible' ? 'HIỂN THỊ' : status === 'hidden' ? 'ẨN' : 'CẢNH BÁO';
    const reason = window.prompt(`Nhập lý do thực hiện thao tác ${actionLabel}:`);
    if (reason === null) return;

    try {
      await adminApi.moderateTour(id, {
        visibility_status: status,
        reason
      });
      toast.success('Cập nhật trạng thái thành công');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    visible: { label: 'Đang hoạt động', color: '#059669', bg: '#ecfdf5' },
    hidden: { label: 'Đã ẩn', color: '#e11d48', bg: '#fff1f2' },
    flagged: { label: 'Cảnh báo', color: '#d97706', bg: '#fffbeb' },
  };

  const getTourImage = (images: any) => {
    if (!images) return '/default-tour.jpg';
    try {
      const imgs = typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        return typeof imgs[0] === 'string' ? imgs[0] : imgs[0].imageUrl;
      }
    } catch (e) {
      return '/default-tour.jpg';
    }
    return '/default-tour.jpg';
  };

  const statCards = [
    { title: 'Tổng Tour', count: stats?.statuses?.reduce((a: any, b: any) => a + b.value, 0) || 0, color: '#3b82f6', bg: '#eff6ff', icon: '🗺️' },
    { title: 'Đang hiển thị', count: stats?.statuses?.find((s: any) => s.name === 'visible')?.value || 0, color: '#10b981', bg: '#ecfdf5', icon: '✅' },
    { title: 'Đã ẩn', count: stats?.statuses?.find((s: any) => s.name === 'hidden')?.value || 0, color: '#ef4444', bg: '#fef2f2', icon: '🚫' },
    { title: 'Bị cảnh báo', count: stats?.statuses?.find((s: any) => s.name === 'flagged')?.value || 0, color: '#f59e0b', bg: '#fffbeb', icon: '🚩' },
  ];

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--tc-spacing-8)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b' }}>Quản trị Tour Du lịch</h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Kiểm duyệt nội dung và quản lý hiển thị trên toàn hệ thống</p>
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
            <option value="visible">Đang hoạt động</option>
            <option value="hidden">Đã ẩn</option>
            <option value="flagged">Bị gắn cờ</option>
          </select>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm tour..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              style={{
                padding: '10px 12px 10px 38px',
                borderRadius: 'var(--tc-radius-lg)',
                border: '1px solid var(--tc-border)',
                width: '300px',
                fontSize: 'var(--tc-font-size-sm)',
                outline: 'none'
              }}
            />
          </div>
          <button onClick={fetchData} style={{
            padding: '10px 24px',
            backgroundColor: 'var(--tc-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--tc-radius-lg)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 'var(--tc-font-size-sm)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}>Tìm kiếm</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--tc-spacing-5)', marginBottom: 'var(--tc-spacing-8)' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{
            backgroundColor: 'white',
            padding: 'var(--tc-spacing-5)',
            borderRadius: 'var(--tc-radius-xl)',
            border: '1px solid var(--tc-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--tc-spacing-4)',
            boxShadow: 'var(--tc-shadow-sm)'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px'
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 'var(--tc-font-size-xs)', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</div>
              <div style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: card.color }}>{card.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
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
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thông tin Tour</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Người đăng</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Giá & Địa điểm</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Trạng thái</th>
              <th style={{ padding: 'var(--tc-spacing-5)', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center' }}><LoadingBlock /></td></tr>
            ) : tours.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 'var(--tc-spacing-20)', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy tour nào</td></tr>
            ) : tours.map(tour => {
              const status = statusConfig[tour.visibility_status] || statusConfig.visible;
              return (
                <tr key={tour.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }} className="admin-table-row">
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-4)' }}>
                      <img 
                        src={getTourImage(tour.tour_images)} 
                        alt="" 
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 'var(--tc-font-size-sm)' }}>{tour.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ID: {tour.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👤</div>
                      <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 500 }}>{tour.guide_profiles?.users?.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--tc-spacing-5)' }}>
                    <div style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 700, color: 'var(--tc-primary)' }}>{Number(tour.price).toLocaleString()}đ</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>📍 {tour.province}</div>
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
                      {tour.visibility_status !== 'visible' && (
                        <button 
                          onClick={() => handleModerate(tour.id, 'visible')}
                          title="Hiển thị"
                          style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                        >👁️</button>
                      )}
                      {tour.visibility_status !== 'hidden' && (
                        <button 
                          onClick={() => handleModerate(tour.id, 'hidden')}
                          title="Ẩn"
                          style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                        >🙈</button>
                      )}
                      {tour.visibility_status !== 'flagged' && (
                        <button 
                          onClick={() => handleModerate(tour.id, 'flagged')}
                          title="Cảnh báo"
                          style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                        >🚩</button>
                      )}
                      <button 
                        onClick={() => window.open(`/tours/${tour.id}`, '_blank')}
                        title="Xem chi tiết"
                        style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}
                      >🔗</button>
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
