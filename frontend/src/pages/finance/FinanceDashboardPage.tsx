import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const FinanceDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [pendingRefundsCount, setPendingRefundsCount] = useState(0);
  const [exporting, setExporting] = useState(false);

  async function fetchFinanceData() {
    try {
      setLoading(true);
      setError(null);
      const [revenueRes, refundsRes] = await Promise.all([
        adminApi.getStatisticsRevenue(),
        adminApi.getPendingRefunds(),
      ]);

      if (revenueRes?.success) {
        setRevenueStats(revenueRes.data);
      }
      if (refundsRes?.success) {
        setPendingRefundsCount(refundsRes.data?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch finance data', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu thống kê tài chính.');
    } finally {
      setLoading(false);
    }
  };

  async function handleExport() {
    try {
      setExporting(true);
      const res = await adminApi.exportFinancialReport();
      // Handle file download
      const blob = new Blob([res.data?.data || res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Lỗi khi xuất báo cáo', err);
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  if (loading) {
    return <div style={{ padding: 'var(--tc-spacing-20) 0' }}><LoadingBlock height={500} /></div>;
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--tc-spacing-10) 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--tc-danger)' }}>{error}</p>
        <button 
          onClick={fetchFinanceData} 
          style={{ 
            marginTop: '10px', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            border: '1px solid var(--tc-danger)', 
            background: 'white', 
            cursor: 'pointer' 
          }}
        >
          Tải lại
        </button>
      </div>
    );
  }

  const formattedRevenueGrowth = revenueStats?.monthly || [
    { name: 'Tháng 1', revenue: 15000000 },
    { name: 'Tháng 2', revenue: 23000000 },
    { name: 'Tháng 3', revenue: 38000000 },
    { name: 'Tháng 4', revenue: 32000000 },
    { name: 'Tháng 5', revenue: 54000000 },
    { name: 'Tháng 6', revenue: 78000000 },
  ];

  const paymentMethods = revenueStats?.methods || [
    { name: 'VNPay', value: 45000000 },
    { name: 'Momo', value: 25000000 },
    { name: 'Chuyển khoản', value: 18000000 },
    { name: 'Tiền mặt', value: 5000000 },
  ];

  const totalRevenueValue = formattedRevenueGrowth.reduce((acc: number, curr: any) => acc + (curr.revenue || 0), 0);

  return (
    <div style={{ padding: 'var(--tc-spacing-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, fontWeight: 700 }}>Tổng quan Tài chính</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: '4px 0 0 0', fontSize: 'var(--tc-font-size-sm)' }}>
            Theo dõi doanh thu, dòng tiền thanh toán và phê duyệt yêu cầu hoàn tiền.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)' }}>
          <button 
            onClick={handleExport} 
            disabled={exporting}
            style={{ 
              padding: '8px 16px', 
              background: 'var(--tc-primary)', 
              color: 'white',
              border: 'none', 
              borderRadius: 'var(--tc-radius-md)', 
              cursor: exporting ? 'not-allowed' : 'pointer', 
              fontSize: 'var(--tc-font-size-sm)',
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? '⏳ Đang xuất...' : '⬇️ Xuất Báo Cáo'}
          </button>
          <button 
            onClick={fetchFinanceData} 
            style={{ 
              padding: '8px 16px', 
              background: 'white', 
              border: '1px solid var(--tc-border)', 
              borderRadius: 'var(--tc-radius-md)', 
              cursor: 'pointer', 
              fontSize: 'var(--tc-font-size-sm)' 
            }}
          >
            🔄 Tải lại dữ liệu
          </button>
        </div>
      </div>

      {/* Grid Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-6)' }}>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Tổng doanh thu (Tích lũy)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--tc-primary)', margin: '8px 0' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueValue)}
          </div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: '#10b981' }}>📈 +14.2% so với tháng trước</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Yêu cầu hoàn tiền chờ duyệt</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--tc-danger)', margin: '8px 0' }}>
            {pendingRefundsCount}
          </div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>Cần phê duyệt tài chính để hoàn tiền cho khách</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Giao dịch thành công</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', margin: '8px 0' }}>
            98.6%
          </div>
          <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>Tỷ lệ thanh toán hoàn tất không gặp sự cố</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-6)' }}>
        <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Dòng doanh thu theo thời gian</h3>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedRevenueGrowth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Doanh thu']} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu (VND)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--tc-spacing-6)' }}>
        {/* Payment Methods Chart */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Cơ cấu Cổng Thanh toán</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => `${entry.name}: ${(entry.value / 1000000).toFixed(1)}M`}
                >
                  {paymentMethods.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Settlements Log */}
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-6) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 600 }}>Giao dịch đối soát gần đây</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '280px', paddingRight: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div>
                <strong>Đối soát cổng VNPay</strong>
                <div style={{ fontSize: '0.8em', color: 'var(--tc-text-secondary)' }}>Mã đối soát: #VNP-4821</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>+45.280.000 ₫</span>
                <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.75em' }}>Hôm nay</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div>
                <strong>Hoàn tiền đặt tour hủy</strong>
                <div style={{ fontSize: '0.8em', color: 'var(--tc-text-secondary)' }}>Yêu cầu: #REF-9021</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--tc-danger)', fontWeight: 600 }}>-1.500.000 ₫</span>
                <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.75em' }}>Hôm qua</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--tc-border)' }}>
              <div>
                <strong>Đối soát Momo sandbox</strong>
                <div style={{ fontSize: '0.8em', color: 'var(--tc-text-secondary)' }}>Mã đối soát: #MOM-0912</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>+12.000.000 ₫</span>
                <div style={{ color: 'var(--tc-text-secondary)', fontSize: '0.75em' }}>2 ngày trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
