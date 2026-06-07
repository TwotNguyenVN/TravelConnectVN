import React, { useState, useEffect } from 'react';
import { financeApi } from '../../api/finance.api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

interface ForecastData {
  days: number;
  totalExpectedRevenue: number;
  totalPlatformFee: number;
  totalGuidePayout: number;
  series: Array<{
    date: string;
    expectedRevenue: number;
    platformFee: number;
    guidePayout: number;
  }>;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const FinanceForecastingPage: React.FC = () => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        const response = await financeApi.getForecasting(days);
        setData(response.data || response);
      } catch (err) {
        toast.error('Không thể tải dữ liệu dự báo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [days, toast]);

  if (loading) return <LoadingBlock />;
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có dữ liệu</div>;

  const maxRevenue = Math.max(...data.series.map(d => d.expectedRevenue), 1);

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tc-text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📊 Dự Báo Dòng Tiền ({days} Ngày Tới)
          </h1>
          <p style={{ color: 'var(--tc-text-secondary)', marginTop: '4px', fontSize: '14px' }}>
            Phân tích doanh thu dự kiến dựa trên các tour đã được đặt và sắp khởi hành.
          </p>
        </div>
        <div>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--tc-border)', outline: 'none' }}
          >
            <option value={7}>7 Ngày</option>
            <option value={15}>15 Ngày</option>
            <option value={30}>30 Ngày</option>
            <option value={60}>60 Ngày</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <SummaryCard
          icon="📈"
          label="Tổng Doanh Thu Dự Kiến"
          value={formatVND(data.totalExpectedRevenue)}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <SummaryCard
          icon="💎"
          label="Phí Nền Tảng (Thu nhập TravelConnect)"
          value={formatVND(data.totalPlatformFee)}
          color="#10b981"
          bg="#ecfdf5"
        />
        <SummaryCard
          icon="👥"
          label="Tiền trả Hướng dẫn viên"
          value={formatVND(data.totalGuidePayout)}
          color="#f59e0b"
          bg="#fffbeb"
        />
      </div>

      {/* Chart visualization */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid var(--tc-border)',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tc-text-primary)', margin: 0 }}>
            Biểu đồ Dự báo Doanh thu
          </h2>
        </div>

        {data.series.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '40px', color: 'var(--tc-text-secondary)' }}>Không có giao dịch nào trong {days} ngày tới</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '220px', overflowX: 'auto', paddingBottom: '30px', position: 'relative' }}>
            {data.series.map((item, idx) => {
              const height = (item.expectedRevenue / maxRevenue) * 170;
              const showLabel = data.series.length <= 15 ? true : idx % Math.ceil(data.series.length / 10) === 0;

              return (
                <div
                  key={item.date}
                  style={{
                    flex: '1',
                    minWidth: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '200px',
                    position: 'relative',
                  }}
                  title={`${item.date}\nDoanh thu: ${formatVND(item.expectedRevenue)}\nHoa hồng TC: ${formatVND(item.platformFee)}`}
                >
                  <div style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${Math.max(height, 2)}px`,
                    backgroundColor: '#93c5fd',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s'
                  }} />

                  {/* Date label */}
                  {showLabel && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-24px',
                      fontSize: '10px',
                      color: 'var(--tc-text-tertiary)',
                      transform: 'rotate(-45deg)',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.date.slice(5)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--tc-border)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Chi tiết từng ngày</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--tc-border)', textAlign: 'left', color: 'var(--tc-text-secondary)' }}>
              <th style={{ padding: '12px' }}>Ngày</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Doanh thu dự kiến</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Phí nền tảng</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Thanh toán HDV</th>
            </tr>
          </thead>
          <tbody>
            {data.series.length === 0 && (
               <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu</td></tr>
            )}
            {data.series.map((item) => (
              <tr key={item.date} style={{ borderBottom: '1px solid var(--tc-border)' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>{item.date}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#3b82f6', fontWeight: 600 }}>{formatVND(item.expectedRevenue)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>{formatVND(item.platformFee)}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#f59e0b', fontWeight: 600 }}>{formatVND(item.guidePayout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  color: string;
  bg: string;
}> = ({ icon, label, value, color, bg }) => (
  <div style={{
    background: 'white',
    borderRadius: '14px',
    border: '1px solid var(--tc-border)',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <span style={{
        fontSize: '20px',
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        background: bg,
      }}>
        {icon}
      </span>
      <span style={{ fontSize: '13px', color: 'var(--tc-text-secondary)', fontWeight: 500 }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 700, color }}>{value}</div>
  </div>
);
