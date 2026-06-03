import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [commissionRate, setCommissionRate] = useState('0.10');
  const [savingSettings, setSavingSettings] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        dashboardRes, 
        userRes, 
        tourRes, 
        reportRes, 
        revenueRes,
        settingsRes
      ] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getStatisticsUsers(),
        adminApi.getStatisticsTours(),
        adminApi.getStatisticsReports(),
        adminApi.getStatisticsRevenue(),
        adminApi.getSettings()
      ]);

      if (dashboardRes?.success) setStats(dashboardRes.data);
      if (userRes?.success) setUserStats(userRes.data);
      if (tourRes?.success) setTourStats(tourRes.data);
      if (reportRes?.success) setReportStats(reportRes.data);
      if (revenueRes?.success) setRevenueStats(revenueRes.data);

      if (settingsRes?.data) {
        const list = settingsRes.data as Array<{ key: string; value: string }>;
        const mode = list.find((s) => s.key === 'maintenance_mode')?.value === 'true';
        const msg = list.find((s) => s.key === 'maintenance_message')?.value || '';
        const rate = list.find((s) => s.key === 'commission_rate')?.value || '0.10';
        setMaintenanceMode(mode);
        setMaintenanceMessage(msg);
        setCommissionRate(rate);
      }

    } catch (err) {
      console.error('Failed to fetch admin statistics', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu thống kê hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await Promise.all([
        adminApi.updateSetting('maintenance_mode', maintenanceMode ? 'true' : 'false'),
        adminApi.updateSetting('maintenance_message', maintenanceMessage.trim()),
        adminApi.updateSetting('commission_rate', commissionRate.trim())
      ]);

      toast.success('Cập nhật cấu hình hệ thống thành công');

      // Dispatch custom event to update warning banner in AdminLayout
      const event = new CustomEvent('maintenance-changed', {
        detail: { enabled: maintenanceMode }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật cấu hình hệ thống thất bại');
    } finally {
      setSavingSettings(false);
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

      {/* Global Config & Maintenance Card */}
      <div style={{
        backgroundColor: 'white',
        padding: 'var(--tc-spacing-6)',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)',
        marginTop: 'var(--tc-spacing-6)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 var(--tc-spacing-2) 0', fontSize: 'var(--tc-font-size-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚙️ Cấu hình Hệ thống & Bảo trì
        </h3>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-xs)', margin: '0 0 var(--tc-spacing-5) 0' }}>
          Quản lý trạng thái vận hành, thông báo bảo trì toàn cục và mức phí hoa hồng dịch vụ.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tc-spacing-6)' }}>
          {/* Maintenance Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: 'var(--tc-font-size-sm)' }}>Chế độ Bảo trì (Maintenance Mode)</span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>Khi bật, chặn toàn bộ thao tác thay đổi dữ liệu của khách hàng.</span>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: maintenanceMode ? '#6366f1' : '#cbd5e1',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px', width: '18px',
                    left: maintenanceMode ? '26px' : '4px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', fontSize: 'var(--tc-font-size-sm)' }}>Nội dung thông báo bảo trì</label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Nhập thông báo hiển thị cho người dùng..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--tc-border)',
                  fontSize: 'var(--tc-font-size-sm)',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Finance Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px', fontSize: 'var(--tc-font-size-sm)' }}>Tỷ lệ phí dịch vụ / hoa hồng đặt tour</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--tc-border)',
                    fontSize: 'var(--tc-font-size-sm)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ position: 'absolute', right: '14px', color: '#94a3b8', fontSize: 'var(--tc-font-size-sm)' }}>%</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '6px' }}>
                Mức phí hoa hồng áp dụng khi quyết toán thu nhập cho Hướng dẫn viên (ví dụ: 0.10 tương đương với 10% doanh thu).
              </span>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: 'var(--tc-font-size-sm)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
              >
                {savingSettings ? '⌛ Đang lưu...' : '💾 Lưu cài đặt'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
