import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';

interface ForecastData {
  period: {
    pastStart: string;
    now: string;
    futureEnd: string;
  };
  summary: {
    totalRecentRevenue: number;
    totalUpcomingRevenue: number;
    totalPendingRefunds: number;
    netForecast: number;
  };
  dailyRevenue: Record<string, number>;
  upcomingRevenue: Record<string, number>;
  pendingRefundCount: number;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const FinanceForecastingPage: React.FC = () => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        const response = await api.get('/payments/forecast/cashflow');
        setData(response.data?.data || null);
      } catch {
        toast.error('Không thể tải dữ liệu dự báo');
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) return <LoadingBlock />;
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>Không có dữ liệu</div>;

  // Build chart data from dailyRevenue and upcomingRevenue
  const allDays: string[] = [];
  const now = new Date();
  for (let i = -30; i <= 30; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    allDays.push(d.toISOString().split('T')[0]);
  }

  const maxRevenue = Math.max(
    ...allDays.map(d => (data.dailyRevenue[d] || 0) + (data.upcomingRevenue[d] || 0)),
    1,
  );

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--tc-text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          📊 Dự Báo Dòng Tiền 30 Ngày
        </h1>
        <p style={{ color: 'var(--tc-text-secondary)', marginTop: '4px', fontSize: '14px' }}>
          Phân tích doanh thu thực tế và dự báo dựa trên lịch đặt tour sắp tới
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <SummaryCard
          icon="💰"
          label="Doanh thu 30 ngày qua"
          value={formatVND(data.summary.totalRecentRevenue)}
          color="#10b981"
          bg="#ecfdf5"
        />
        <SummaryCard
          icon="📈"
          label="Dự báo 30 ngày tới"
          value={formatVND(data.summary.totalUpcomingRevenue)}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <SummaryCard
          icon="↩️"
          label="Hoàn tiền chờ xử lý"
          value={formatVND(data.summary.totalPendingRefunds)}
          color="#ef4444"
          bg="#fef2f2"
          subtitle={`${data.pendingRefundCount} giao dịch`}
        />
        <SummaryCard
          icon="🎯"
          label="Dòng tiền ròng (dự báo)"
          value={formatVND(data.summary.netForecast)}
          color={data.summary.netForecast >= 0 ? '#10b981' : '#ef4444'}
          bg={data.summary.netForecast >= 0 ? '#ecfdf5' : '#fef2f2'}
        />
      </div>

      {/* Chart visualization */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid var(--tc-border)',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tc-text-primary)', margin: 0 }}>
            Biểu đồ dòng tiền
          </h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981', display: 'inline-block' }} />
              Thực tế
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#3b82f6', display: 'inline-block' }} />
              Dự báo
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '200px', overflowX: 'auto', paddingBottom: '30px', position: 'relative' }}>
          {allDays.map((day, idx) => {
            const actual = data.dailyRevenue[day] || 0;
            const forecast = data.upcomingRevenue[day] || 0;
            const totalHeight = ((actual + forecast) / maxRevenue) * 170;
            const actualHeight = maxRevenue > 0 ? (actual / maxRevenue) * 170 : 0;
            const forecastHeight = maxRevenue > 0 ? (forecast / maxRevenue) * 170 : 0;
            const isToday = day === now.toISOString().split('T')[0];
            const showLabel = idx % 5 === 0 || isToday;

            return (
              <div
                key={day}
                style={{
                  flex: '0 0 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '200px',
                  position: 'relative',
                }}
                title={`${day}\nThực tế: ${formatVND(actual)}\nDự báo: ${formatVND(forecast)}`}
              >
                {isToday && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '9px',
                    color: '#f59e0b',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    HÔM NAY
                  </div>
                )}

                {/* Bars stacked */}
                {forecastHeight > 0 && (
                  <div style={{
                    width: '10px',
                    height: `${forecastHeight}px`,
                    backgroundColor: '#93c5fd',
                    borderRadius: '2px 2px 0 0',
                  }} />
                )}
                {actualHeight > 0 && (
                  <div style={{
                    width: '10px',
                    height: `${actualHeight}px`,
                    backgroundColor: '#34d399',
                    borderRadius: forecastHeight > 0 ? '0' : '2px 2px 0 0',
                  }} />
                )}
                {totalHeight === 0 && (
                  <div style={{
                    width: '10px',
                    height: '2px',
                    backgroundColor: 'var(--tc-border)',
                    borderRadius: '1px',
                  }} />
                )}

                {/* Date label */}
                {showLabel && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-24px',
                    fontSize: '9px',
                    color: isToday ? '#f59e0b' : 'var(--tc-text-tertiary)',
                    fontWeight: isToday ? 700 : 400,
                    transform: 'rotate(-45deg)',
                    whiteSpace: 'nowrap',
                  }}>
                    {day.slice(5)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily breakdown tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
        <DailyTable
          title="💰 Doanh thu thực tế (30 ngày qua)"
          data={data.dailyRevenue}
          color="#10b981"
        />
        <DailyTable
          title="📈 Doanh thu dự báo (30 ngày tới)"
          data={data.upcomingRevenue}
          color="#3b82f6"
        />
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
  subtitle?: string;
}> = ({ icon, label, value, color, bg, subtitle }) => (
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
    {subtitle && <div style={{ fontSize: '12px', color: 'var(--tc-text-tertiary)', marginTop: '4px' }}>{subtitle}</div>}
  </div>
);

const DailyTable: React.FC<{
  title: string;
  data: Record<string, number>;
  color: string;
}> = ({ title, data, color }) => {
  const entries = Object.entries(data).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div style={{
      background: 'white',
      borderRadius: '14px',
      border: '1px solid var(--tc-border)',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tc-text-primary)', marginBottom: '12px', margin: '0 0 12px 0' }}>
        {title}
      </h3>
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--tc-text-tertiary)', fontSize: '13px' }}>
          Không có dữ liệu
        </div>
      ) : (
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {entries.map(([day, amount]) => (
            <div
              key={day}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid var(--tc-border)',
                fontSize: '13px',
              }}
            >
              <span style={{ color: 'var(--tc-text-secondary)' }}>
                {new Date(day).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
              </span>
              <span style={{ fontWeight: 600, color }}>{formatVND(amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
