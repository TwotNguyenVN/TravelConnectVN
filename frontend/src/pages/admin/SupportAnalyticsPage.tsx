import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  summary: {
    totalTicketsResolved: number;
    totalDisputesResolved: number;
    avgResolutionHours: number;
  };
  staffLeaderboard: Array<{
    staffId: string;
    name: string;
    ticketsResolved: number;
    avgResolutionHours: number;
  }>;
  weeklyTrend: Array<{
    week: string;
    count: number;
  }>;
}

export function SupportAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getCsatAnalytics();
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu báo cáo phân tích CSAT & SLA.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingBlock height={500} />;

  if (error || !data) {
    return (
      <div style={{ padding: 'var(--tc-spacing-6)', color: 'var(--tc-danger)' }}>
        {error || 'Lỗi không xác định'}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-1) 0' }}>📊 Báo Cáo CSAT & Phân Tích SLA Nhân Viên Hỗ Trợ</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            Theo dõi hiệu suất giải quyết ticket hỗ trợ, tranh chấp và chỉ số cam kết SLA.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          style={{
            padding: '8px 16px',
            background: 'white',
            border: '1px solid var(--tc-border)',
            borderRadius: 'var(--tc-radius-md)',
            cursor: 'pointer'
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--tc-spacing-5)', marginBottom: 'var(--tc-spacing-6)' }}>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-5)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Ticket đã giải quyết (30 ngày)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tc-primary)', marginTop: '4px' }}>
            {data.summary.totalTicketsResolved}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-5)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Tranh chấp đã xử lý (30 ngày)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tc-success)', marginTop: '4px' }}>
            {data.summary.totalDisputesResolved}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-5)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Thời gian xử lý trung bình</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tc-warning)', marginTop: '4px' }}>
            {data.summary.avgResolutionHours} <span style={{ fontSize: 'var(--tc-font-size-sm)', fontWeight: 'normal' }}>giờ / ticket</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-6)' }}>
        {/* Weekly Trend Chart */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Xu hướng xử lý yêu cầu hỗ trợ theo tuần</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [value, 'Số lượng']} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Leaderboard */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-md)' }}>Hiệu suất nhân viên hỗ trợ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.staffLeaderboard.map((staff, idx) => (
              <div key={staff.staffId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid var(--tc-border)',
                borderRadius: 'var(--tc-radius-md)',
                backgroundColor: idx === 0 ? '#f0fdf4' : 'white'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--tc-font-size-sm)' }}>
                    {idx + 1}. {staff.name}
                  </div>
                  <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
                    Thời gian TB: {staff.avgResolutionHours} giờ
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'var(--tc-primary-bg)',
                  color: 'var(--tc-primary)',
                  padding: '4px 8px',
                  borderRadius: 'var(--tc-radius-sm)',
                  fontWeight: 'bold',
                  fontSize: 'var(--tc-font-size-xs)'
                }}>
                  {staff.ticketsResolved} tickets
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
