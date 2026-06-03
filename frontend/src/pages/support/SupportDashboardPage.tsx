import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { PageContainer, Card, Button, LoadingBlock } from '../../components/common';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SupportStats {
  reportCount: number;
  userCount: number;
  tourCount: number;
  pendingVerificationCount: number;
  companionCount: number;
}

interface RecentReport {
  id: string;
  report_type: string;
  reason: string;
  status: string;
  created_at: string;
  reporter?: { full_name: string };
}

const REPORT_TYPE_LABEL: Record<string, string> = {
  TOUR: '🗺️ Tour',
  GUIDE: '👤 HDV',
  REVIEW: '⭐ Đánh giá',
  USER: '👥 Người dùng',
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b',
  resolved: '#10b981',
  dismissed: '#94a3b8',
};

// Simulated SOS alerts (in production, this would come from a WebSocket)
const DEMO_SOS_ALERTS = [
  { id: 'sos-1', name: 'Nguyễn Thị Mai', location: 'Hội An, Quảng Nam', time: '2 phút trước', tourCode: '#TCN-2415', active: true },
];

export const SupportDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [sosVisible, setSosVisible] = useState(true);
  const sosRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getReports({ limit: 5, status: 'pending' }),
      ]);
      if (statsRes?.success) setStats(statsRes.data);
      if (reportsRes?.data) setRecentReports(reportsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error loading support dashboard:', err);
      toast.error('Không thể tải dữ liệu hỗ trợ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: '40px 0' }}>
          <LoadingBlock height={400} />
        </div>
      </PageContainer>
    );
  }

  const reportChartData = [
    { name: 'Báo cáo Tour', value: Math.round((stats?.reportCount || 0) * 0.45) },
    { name: 'Báo cáo HDV', value: Math.round((stats?.reportCount || 0) * 0.3) },
    { name: 'Báo cáo Review', value: Math.round((stats?.reportCount || 0) * 0.25) },
  ];

  const statCards = [
    { title: 'Báo cáo chờ xử lý', count: stats?.reportCount || 0, color: '#ef4444', bg: '#fef2f2', icon: '🚩', link: '/support/reports' },
    { title: 'Tổng người dùng', count: stats?.userCount || 0, color: '#3b82f6', bg: '#eff6ff', icon: '👥', link: '/support/reports' },
    { title: 'Bài đồng hành', count: stats?.companionCount || 0, color: '#8b5cf6', bg: '#f5f3ff', icon: '🤝', link: '/support/reports' },
    { title: 'Tour đang hoạt động', count: stats?.tourCount || 0, color: '#10b981', bg: '#ecfdf5', icon: '🗺️', link: '/support/reports' },
  ];

  const quickLinks = [
    { title: 'Xử lý Báo cáo Vi phạm', description: 'Xem và phân xử các báo cáo từ người dùng về tour, HDV, bình luận.', icon: '🚩', color: '#ef4444', link: '/support/reports' },
    { title: 'Tranh chấp Đặt Tour', description: 'Tra cứu lịch sử đặt tour, phân xử khiếu nại giữa khách và HDV.', icon: '⚖️', color: '#f59e0b', link: '/support/disputes' },
    { title: 'Gửi Thông báo', description: 'Phát thông báo hệ thống đến khách hàng, HDV hoặc nhóm cụ thể.', icon: '📢', color: '#3b82f6', link: '/support/broadcast' },
  ];

  return (
    <PageContainer>
      {/* SOS Emergency Alert */}
      {sosVisible && DEMO_SOS_ALERTS.length > 0 && (
        <div
          ref={sosRef}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            borderRadius: 'var(--tc-radius-xl)',
            padding: 'var(--tc-spacing-5)',
            marginBottom: 'var(--tc-spacing-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--tc-spacing-5)',
            boxShadow: '0 0 0 4px rgba(220,38,38,0.25), 0 8px 24px rgba(220,38,38,0.3)',
            animation: 'sosPulse 2s infinite',
            position: 'relative',
          }}
        >
          <style>{`
            @keyframes sosPulse {
              0%, 100% { box-shadow: 0 0 0 4px rgba(220,38,38,0.25), 0 8px 24px rgba(220,38,38,0.3); }
              50% { box-shadow: 0 0 0 8px rgba(220,38,38,0.15), 0 8px 32px rgba(220,38,38,0.4); }
            }
          `}</style>
          <div style={{ fontSize: '40px', flexShrink: 0, animation: 'none' }}>🆘</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>
              KHẨN CẤP — Khách hàng cần hỗ trợ ngay!
            </div>
            {DEMO_SOS_ALERTS.map(alert => (
              <div key={alert.id} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                <strong>{alert.name}</strong> — Tour {alert.tourCode} tại <strong>{alert.location}</strong>
                <span style={{ marginLeft: '12px', fontSize: '12px', opacity: 0.8 }}>⏱ {alert.time}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => navigate('/support/disputes')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Xử lý ngay
            </button>
            <button
              onClick={() => setSosVisible(false)}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Dashboard Hỗ trợ Khách hàng
          </h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
            Tiếp nhận báo cáo, giải quyết tranh chấp và gửi thông báo đến người dùng TravelConnectVN.
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>🔄 Làm mới</Button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--tc-spacing-5)',
        marginBottom: 'var(--tc-spacing-8)',
      }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.link)}
            style={{
              backgroundColor: 'white',
              padding: 'var(--tc-spacing-5)',
              borderRadius: 'var(--tc-radius-xl)',
              border: '1px solid var(--tc-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--tc-shadow-sm)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-md)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <h2 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: card.color, margin: '4px 0 0 0' }}>
                {card.count}
              </h2>
            </div>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '12px',
              backgroundColor: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout: Chart + Pending Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-8)' }}>
        {/* Chart */}
        <Card style={{ padding: 'var(--tc-spacing-6)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-5) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
            Phân loại Báo cáo Vi phạm
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reportChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="value" name="Số báo cáo" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Reports Queue */}
        <Card style={{ padding: 'var(--tc-spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
              Báo cáo mới nhất ({recentReports.length})
            </h3>
            <Button variant="outline" size="small" onClick={() => navigate('/support/reports')}>
              Xem tất cả
            </Button>
          </div>

          {recentReports.length === 0 ? (
            <div style={{ padding: 'var(--tc-spacing-10) 0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
              <h4 style={{ color: '#1e293b', margin: '0 0 4px 0' }}>Không có báo cáo mới</h4>
              <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-xs)', margin: 0 }}>Cộng đồng đang hoạt động tốt!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
              {recentReports.map(report => (
                <div
                  key={report.id}
                  style={{
                    padding: 'var(--tc-spacing-3) var(--tc-spacing-4)',
                    borderRadius: 'var(--tc-radius-lg)',
                    border: '1px solid var(--tc-border)',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--tc-spacing-3)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        {REPORT_TYPE_LABEL[report.report_type] || report.report_type}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: STATUS_COLOR[report.status] + '22',
                        color: STATUS_COLOR[report.status],
                        fontWeight: 600,
                      }}>
                        {report.status === 'pending' ? 'Chờ xử lý' : report.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                      {report.reason?.slice(0, 60)}{report.reason?.length > 60 ? '...' : ''}
                    </p>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(report.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <Button variant="outline" size="small" onClick={() => navigate('/support/reports')}>
                    Xử lý
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
          Công cụ Hỗ trợ nhanh
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
          {quickLinks.map((link, idx) => (
            <Card
              key={idx}
              onClick={() => navigate(link.link)}
              style={{
                padding: 'var(--tc-spacing-5)',
                display: 'flex',
                gap: 'var(--tc-spacing-4)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = link.color;
                e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--tc-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '10px',
                backgroundColor: link.color + '15',
                border: `1px solid ${link.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>
                {link.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--tc-font-size-sm)', fontWeight: 700, color: '#1e293b' }}>
                  {link.title}
                </h4>
                <p style={{ margin: 0, fontSize: 'var(--tc-font-size-xs)', color: '#64748b', lineHeight: '1.4' }}>
                  {link.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
