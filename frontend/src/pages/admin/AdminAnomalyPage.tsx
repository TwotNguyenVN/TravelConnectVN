import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';

interface AnomalyAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  actor: string;
  timestamp: string;
  details: string;
}

export function AdminAnomalyPage() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [lastChecked, setLastChecked] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAlerts() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAnomalyAlerts();
      if (res?.success) {
        setAlerts(res.data.alerts);
        setTotalAlerts(res.data.totalAlerts);
        setLastChecked(res.data.lastChecked);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải các cảnh báo bất thường.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && alerts.length === 0) return <LoadingBlock height={400} />;

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-1) 0' }}>🚨 Cảnh Báo Hành Vi Bất Thường</h1>
          <p style={{ color: 'var(--tc-text-secondary)', margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            Hệ thống giám sát phát hiện các hành động hàng loạt hoặc nhạy cảm trong hệ thống admin.
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'white',
            border: '1px solid var(--tc-border)',
            borderRadius: 'var(--tc-radius-md)',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Đang làm mới...' : '🔄 Làm mới'}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--tc-danger-bg)',
          color: 'var(--tc-danger)',
          padding: 'var(--tc-spacing-4)',
          borderRadius: 'var(--tc-radius-md)',
          marginBottom: 'var(--tc-spacing-6)'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--tc-spacing-4)', marginBottom: 'var(--tc-spacing-6)' }}>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Tổng số cảnh báo</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: totalAlerts > 0 ? 'var(--tc-danger)' : 'var(--tc-success)' }}>
            {totalAlerts}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Trạng thái</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: totalAlerts > 5 ? 'var(--tc-danger)' : 'var(--tc-success)', marginTop: '8px' }}>
            {totalAlerts === 0 ? 'An Toàn' : totalAlerts > 5 ? 'Nguy Hiểm' : 'Cảnh Giác'}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: 'var(--tc-spacing-4)', borderRadius: 'var(--tc-radius-lg)', border: '1px solid var(--tc-border)' }}>
          <div style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>Cập nhật lần cuối</div>
          <div style={{ fontSize: 'var(--tc-font-size-md)', fontWeight: 'bold', marginTop: '12px' }}>
            {lastChecked ? new Date(lastChecked).toLocaleTimeString('vi-VN') : '---'}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--tc-border)',
        borderRadius: 'var(--tc-radius-lg)',
        overflow: 'hidden'
      }}>
        {alerts.length === 0 ? (
          <div style={{ padding: 'var(--tc-spacing-8)', textAlign: 'center', color: 'var(--tc-text-secondary)' }}>
            🎉 Không phát hiện bất kỳ hành vi bất thường nào trong 24 giờ qua.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {alerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 'var(--tc-spacing-5)',
                  borderBottom: index < alerts.length - 1 ? '1px solid var(--tc-border)' : 'none',
                  backgroundColor: alert.severity === 'high' ? '#fff5f5' : alert.severity === 'medium' ? '#fffbeb' : 'white'
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  marginRight: 'var(--tc-spacing-4)',
                  color: alert.severity === 'high' ? 'var(--tc-danger)' : 'var(--tc-warning)'
                }}>
                  {alert.severity === 'high' ? '🚨' : '⚠️'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: alert.severity === 'high' ? 'var(--tc-danger)' : 'var(--tc-warning)',
                      textTransform: 'uppercase',
                      fontSize: 'var(--tc-font-size-xs)'
                    }}>
                      Mức độ: {alert.severity === 'high' ? 'Cao' : alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                    <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
                      {new Date(alert.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: 'var(--tc-font-size-md)' }}>{alert.message}</h4>
                  <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)' }}>
                    <strong>Người thực hiện:</strong> {alert.actor}
                  </div>
                  <div style={{
                    fontSize: 'var(--tc-font-size-sm)',
                    color: 'var(--tc-text-secondary)',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    padding: '8px 12px',
                    borderRadius: 'var(--tc-radius-sm)',
                    marginTop: '8px',
                    fontFamily: 'monospace'
                  }}>
                    {alert.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
