import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import {
  PageContainer,
  Card,
  Button,
  LoadingBlock
} from '../../components/common';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

interface DashboardStats {
  userCount: number;
  tourCount: number;
  companionCount: number;
  reportCount: number;
  pendingVerificationCount: number;
}

interface VerificationRequest {
  id: string;
  status: string;
  submission_note: string;
  submitted_at: string;
  guide_profiles: {
    working_area: string;
    users: { full_name: string; email: string };
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ContentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tourStats, setTourStats] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<VerificationRequest[]>([]);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsRes, tourStatsRes, verificationRequestsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getStatisticsTours(),
        adminApi.getVerificationRequests(),
      ]);

      if (statsRes?.success) {
        setStats(statsRes.data);
      }
      if (tourStatsRes?.success) {
        setTourStats(tourStatsRes.data);
      }
      if (verificationRequestsRes?.data) {
        // Filter only pending requests and take the top 3
        const pending = verificationRequestsRes.data
          .filter((req: any) => req.status === 'pending')
          .slice(0, 3);
        setPendingRequests(pending);
      }
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err);
      toast.error('Không thể tải thông tin thống kê kiểm duyệt');
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

  const statCards = [
    {
      title: 'HDV chờ duyệt',
      count: stats?.pendingVerificationCount || 0,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      icon: '🛡️',
      link: '/content/guides'
    },
    {
      title: 'Bài đồng hành',
      count: stats?.companionCount || 0,
      color: '#3b82f6',
      bg: '#eff6ff',
      icon: '🤝',
      link: '/content/companion-posts'
    },
    {
      title: 'Báo cáo vi phạm',
      count: stats?.reportCount || 0,
      color: '#ef4444',
      bg: '#fef2f2',
      icon: '🚩',
      link: '/support/reports' // support team handles reports but content mod can see count
    },
    {
      title: 'Tổng số Tour',
      count: stats?.tourCount || 0,
      color: '#10b981',
      bg: '#ecfdf5',
      icon: '🗺️',
      link: '/content/tours'
    }
  ];

  const quickLinks = [
    {
      title: 'Xác minh Hướng dẫn viên',
      description: 'Phê duyệt thẻ HDV, chứng chỉ ngoại ngữ và kích hoạt tài khoản HDV.',
      icon: '🛡️',
      color: '#8b5cf6',
      link: '/content/guides'
    },
    {
      title: 'Kiểm duyệt Tour du lịch',
      description: 'Kiểm tra thông tin mô tả, lịch trình và hình ảnh các tour mới đăng.',
      icon: '🗺️',
      color: '#10b981',
      link: '/content/tours'
    },
    {
      title: 'Giám sát Bài đồng hành',
      description: 'Ẩn bài viết rác, tin quảng cáo hoặc các tài khoản tìm bạn ghép đoàn sai luật.',
      icon: '👥',
      color: '#3b82f6',
      link: '/content/companion-posts'
    },
    {
      title: 'Quản lý Đánh giá & Reviews',
      description: 'Kiểm duyệt và gỡ bỏ bình luận khiếm nhã từ khách hàng hoặc HDV.',
      icon: '💬',
      color: '#f59e0b',
      link: '/content/reviews'
    }
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--tc-spacing-6)'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Dashboard Kiểm duyệt viên
          </h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
            Giám sát chất lượng nội dung, xác thực thông tin và đảm bảo an toàn cộng đồng TravelConnectVN.
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          🔄 Làm mới dữ liệu
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--tc-spacing-5)',
        marginBottom: 'var(--tc-spacing-8)'
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
            }}
          >
            <div>
              <span style={{ fontSize: 'var(--tc-font-size-xs)', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <h2 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: card.color, margin: '4px 0 0 0' }}>
                {card.count}
              </h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 'var(--tc-spacing-6)',
        marginBottom: 'var(--tc-spacing-8)'
      }}>
        {/* Left Column: Verification Requests Queue */}
        <Card style={{ padding: 'var(--tc-spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
              Yêu cầu xác minh HDV chờ xử lý ({pendingRequests.length})
            </h3>
            <Button variant="outline" size="small" onClick={() => navigate('/content/guides')}>
              Xem tất cả
            </Button>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ padding: 'var(--tc-spacing-10) 0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
              <h4 style={{ color: '#1e293b', margin: '0 0 4px 0' }}>Đã hoàn thành kiểm duyệt</h4>
              <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-xs)', margin: 0 }}>Không có hồ sơ Hướng dẫn viên nào đang đợi bạn.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: 'var(--tc-spacing-4)',
                    borderRadius: 'var(--tc-radius-lg)',
                    border: '1px solid var(--tc-border)',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div style={{ flex: 1, marginRight: 'var(--tc-spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--tc-font-size-sm)', color: '#1e293b' }}>
                        {req.guide_profiles?.users?.full_name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        📍 {req.guide_profiles?.working_area || 'Chưa cập nhật'}
                      </span>
                    </div>
                    <p style={{
                      margin: '6px 0 0 0',
                      fontSize: 'var(--tc-font-size-xs)',
                      color: '#64748b',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      <strong>Ghi chú:</strong> {req.submission_note || 'Không có ghi chú.'}
                    </p>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                      Gửi lúc: {new Date(req.submitted_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <Button variant="outline" size="small" onClick={() => navigate('/content/guides')}>
                    Xét duyệt
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Column: Tour Categories Analysis */}
        <Card style={{ padding: 'var(--tc-spacing-6)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-5) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
            Phân bổ danh mục Tour
          </h3>
          <div style={{ flex: 1, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {tourStats?.categories && tourStats.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={tourStats.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {tourStats.categories.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tour`, 'Số lượng']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: 'var(--tc-font-size-sm)' }}>Không có dữ liệu</span>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Action Shortcuts Panel */}
      <div>
        <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
          Lối tắt công việc Kiểm duyệt
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--tc-spacing-5)'
        }}>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = link.color;
                e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--tc-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--tc-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
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
