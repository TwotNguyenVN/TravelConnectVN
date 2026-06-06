import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface DashboardStats {
  userCount: number;
  tourCount: number;
  companionCount: number;
  reportCount: number;
  pendingVerificationCount: number;
  totalRevenue: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [tourStats, setTourStats] = useState<any>(null);
  const [reportStats, setReportStats] = useState<any>(null);
  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [healthStats, setHealthStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const [
        dashboardRes, 
        userRes, 
        tourRes, 
        reportRes, 
        revenueRes
      ] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getStatisticsUsers(),
        adminApi.getStatisticsTours(),
        adminApi.getStatisticsReports(),
        adminApi.getStatisticsRevenue(),
        adminApi.getSystemHealth()
      ]);

      if (dashboardRes?.success) setStats(dashboardRes.data);
      if (userRes?.success) setUserStats(userRes.data);
      if (tourRes?.success) setTourStats(tourRes.data);
      if (reportRes?.success) setReportStats(reportRes.data);
      if (revenueRes?.success) setRevenueStats(revenueRes.data);
      if (healthRes) setHealthStats(healthRes); // Depending on axios interceptor, it might just be the direct response.

    } catch (err) {
      console.error('Failed to fetch admin statistics', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu thống kê hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 'var(--tc-spacing-20) 0' }}><LoadingBlock height={600} /></div>;

  if (error) return (
    <div style={{ padding: 'var(--tc-spacing-10) 0' }}>
      <div style={{ 
        backgroundColor: 'var(--tc-danger-bg)', 
        color: 'var(--tc-danger)', 
        padding: 'var(--tc-spacing-4)', 
        borderRadius: 'var(--tc-radius-md)',
        textAlign: 'center'
      }}>
        <p>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '5px 15px', borderRadius: '4px', border: '1px solid var(--tc-danger)', background: 'white', cursor: 'pointer' }}>Thử lại</button>
      </div>
    </div>
  );

  const statCards = [
    { title: 'Tổng người dùng', value: stats?.userCount || 0, color: '#3b82f6', icon: '👥' },
    { title: 'Tổng tour', value: stats?.tourCount || 0, color: '#10b981', icon: '🗺️' },
    { title: 'Bài đồng hành', value: stats?.companionCount || 0, color: '#f59e0b', icon: '🤝' },
    { title: 'Báo cáo mới', value: stats?.reportCount || 0, color: '#ef4444', icon: '🚩' },
    { title: 'Doanh thu (VND)', value: (stats?.totalRevenue || 0).toLocaleString('vi-VN'), color: '#059669', icon: '💰' },
    { title: 'Xác minh HDV', value: stats?.pendingVerificationCount || 0, color: '#8b5cf6', icon: '🛡️' },
  ];

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0 }}>Dashboard Quản trị</h1>
        <button onClick={fetchData} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)', cursor: 'pointer', fontSize: 'var(--tc-font-size-sm)' }}>
          🔄 Làm mới dữ liệu
        </button>
      </div>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--tc-spacing-5)', marginBottom: 'var(--tc-spacing-8)' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{
            backgroundColor: 'white',
            padding: 'var(--tc-spacing-5)',
            borderRadius: 'var(--tc-radius-lg)',
            border: '1px solid var(--tc-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 700, color: card.color }}>{card.value}</div>
            </div>
            <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-xs)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</div>
          </div>
        ))}
      </div>

      {/* System Health Section */}
      {healthStats && (
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-8)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Bảng giám sát sức khỏe hệ thống</span>
            <span className="text-sm font-normal text-gray-500">Cập nhật lúc: {new Date(healthStats.lastChecked).toLocaleTimeString('vi-VN')}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(healthStats.services || {}).map(([key, service]: [string, any]) => (
              <div key={key} className="p-4 border rounded-md bg-gray-50 flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600 uppercase mb-2">{key}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full mb-2 ${service.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {service.status === 'healthy' ? 'ONLINE' : 'OFFLINE'}
                </span>
                <span className="text-xs text-gray-500">{service.latency} ms</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Storage Usage (Supabase S3)</span>
            <span className="text-sm font-bold text-blue-600">{healthStats.storageUsageMB} MB / 50 GB</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-6)' }}>
        {/* Revenue Chart */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Doanh thu 7 ngày qua</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueStats?.daily || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Doanh thu']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tour Categories Pie */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Cơ cấu danh mục Tour</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tourStats?.categories || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(tourStats?.categories || []).map((_entry: any, index: number) => (

                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tc-spacing-6)' }}>
        {/* User Roles Bar */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Phân bổ Vai trò Người dùng</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userStats?.roles || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {(userStats?.roles || []).map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report Status Bar */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Trạng thái Báo cáo vi phạm</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStats?.statuses || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
