import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface HeatmapData {
  total: number;
  byType: Array<{ type: string; count: number }>;
  byWeek: Array<{ week: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

export function ContentReportHeatmapPage() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchHeatmap() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getReportHeatmapData();
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải bản đồ nhiệt và xu hướng báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  if (loading) return <LoadingBlock height={500} />;

  if (error || !data) {
    return (
      <div style={{ padding: 'var(--tc-spacing-6)', color: 'var(--tc-danger)' }}>
        {error || 'Lỗi không xác định'}
      </div>
    );
  }

  function translateStatus(status: string) {
    switch (status.toLowerCase()) {
      case 'pending': return 'Đang chờ';
      case 'resolved': return 'Đã xử lý';
      case 'rejected': return 'Bác bỏ';
      default: return status;
    }
  };

  function translateType(type: string) {
    switch (type.toLowerCase()) {
      case 'tour': return 'Tours';
      case 'companion': return 'Bài đồng hành';
      case 'guide': return 'Hướng dẫn viên';
      case 'review': return 'Đánh giá';
      case 'user': return 'Người dùng';
      default: return type;
    }
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-1) 0' }}>🗺️ Xu Hướng & Bản Đồ Nhiệt Báo Cáo Vi Phạm</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            Thống kê xu hướng và phân loại các báo cáo vi phạm được gửi từ người dùng trong 30 ngày qua.
          </p>
        </div>
        <button
          onClick={fetchHeatmap}
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

      <div style={{
        backgroundColor: 'white',
        padding: 'var(--tc-spacing-5)',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)',
        marginBottom: 'var(--tc-spacing-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Tổng số báo cáo nhận được (30 ngày)</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-2xl)', color: 'var(--tc-danger)' }}>{data.total}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-6)' }}>
        {/* Reports by Type */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Phân loại vi phạm theo loại đối tượng</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byType}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="type" tickFormatter={translateType} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [value, 'Số lượng']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports by Status */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Trạng thái xử lý báo cáo</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '60%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(props: unknown) => `${translateStatus(props.status || props.name || 'Unknown')}: ${((props.percent || 0) * 100).toFixed(0)}%`}
                  >
                    {data.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Reports by Week Trend */}
      <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
        <h3 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-md)' }}>Xu hướng báo cáo theo tuần</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byWeek}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [value, 'Số lượng']} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
