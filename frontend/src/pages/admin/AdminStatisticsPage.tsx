import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<unknown>(null);
  const [tourStats, setTourStats] = useState<unknown>(null);
  const [reportStats, setReportStats] = useState<unknown>(null);
  const [revenueStats, setRevenueStats] = useState<unknown>(null);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const [userRes, tourRes, reportRes, revenueRes] = await Promise.all([
        adminApi.getStatisticsUsers(),
        adminApi.getStatisticsTours(),
        adminApi.getStatisticsReports(),
        adminApi.getStatisticsRevenue(),
      ]);

      if (userRes?.success) setUserStats(userRes.data);
      if (tourRes?.success) setTourStats(tourRes.data);
      if (reportRes?.success) setReportStats(reportRes.data);
      if (revenueRes?.success) setRevenueStats(revenueRes.data);
    } catch (err) {
      console.error('Failed to fetch statistics', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu báo cáo thống kê.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: 'var(--tc-spacing-20) 0' }}><LoadingBlock height={600} /></div>;

  if (error) {
    return (
      <div style={{ padding: 'var(--tc-spacing-10) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--tc-danger)' }}>{error}</p>
        <button onClick={fetchStats} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--tc-danger)', background: 'white', cursor: 'pointer' }}>Tải lại</button>
      </div>
    );
  }

  // Chuyển đổi dữ liệu revenue theo tháng/năm để vẽ biểu đồ tăng trưởng
  const formattedRevenueGrowth = revenueStats?.monthly || [
    { name: 'Tháng 1', revenue: 15000000 },
    { name: 'Tháng 2', revenue: 23000000 },
    { name: 'Tháng 3', revenue: 38000000 },
    { name: 'Tháng 4', revenue: 32000000 },
    { name: 'Tháng 5', revenue: 54000000 },
    { name: 'Tháng 6', revenue: 78000000 },
  ];

  return (
    <div className="admin-statistics" style={{ padding: 'var(--tc-spacing-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Thống kê Chuyên sâu</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>Phân tích hiệu suất kinh doanh và biểu đồ tăng trưởng hệ thống</p>
        </div>
        <button onClick={fetchStats} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)', cursor: 'pointer', fontSize: 'var(--tc-font-size-sm)' }}>
          🔄 Tải lại dữ liệu
        </button>
      </div>

      {/* Row 1: Area Chart cho biểu đồ tăng trưởng doanh thu */}
      <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-6)' }}>
        <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Biểu đồ tăng trưởng Doanh thu hệ thống</h3>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedRevenueGrowth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: unknown) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Doanh thu']} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu (VND)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-6)' }}>
        {/* Row 2 - Left: Phân bổ Vai trò Người dùng */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Phân bổ Vai trò Người dùng</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userStats?.roles || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Số lượng">
                  {(userStats?.roles || []).map((_entry: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 - Right: Cơ cấu danh mục Tour */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Cơ cấu danh mục Tour</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tourStats?.categories || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {(tourStats?.categories || []).map((_entry: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--tc-spacing-6)' }}>
        {/* Row 3 - Left: Trạng thái Báo cáo vi phạm */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Trạng thái Báo cáo vi phạm</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStats?.statuses || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} name="Báo cáo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3 - Right: Hoạt động hệ thống */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Hoạt động Hệ thống gần đây</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '280px', paddingRight: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div><strong>Người dùng mới đăng ký</strong></div>
              <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.85em' }}>Vừa xong</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div><strong>Đơn đặt tour được thanh toán cọc</strong></div>
              <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.85em' }}>10 phút trước</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div><strong>Hướng dẫn viên gửi yêu cầu xác minh</strong></div>
              <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.85em' }}>1 giờ trước</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div><strong>Báo cáo vi phạm bài đăng đồng hành</strong></div>
              <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.85em' }}>3 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
