import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { LoadingBlock } from '../../components/common';

export function AdminMaintenancePage() {
  const [maintenance, setMaintenance] = useState<{ enabled: boolean; bypassIps: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newIp, setNewIp] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getMaintenanceStatus();
      if (res?.success) {
        setMaintenance(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải trạng thái bảo trì.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    if (!maintenance) return;
    try {
      setSaving(true);
      setError(null);
      const res = await adminApi.toggleMaintenance(!maintenance.enabled, maintenance.bypassIps);
      if (res?.success) {
        setMaintenance(res.data);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err?.response?.data?.message || 'Không thể thay đổi trạng thái bảo trì.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenance || !newIp.trim()) return;
    const ip = newIp.trim();
    if (maintenance.bypassIps.includes(ip)) {
      setNewIp('');
      return;
    }
    const updatedIps = [...maintenance.bypassIps, ip];
    try {
      setSaving(true);
      setError(null);
      const res = await adminApi.toggleMaintenance(maintenance.enabled, updatedIps);
      if (res?.success) {
        setMaintenance(res.data);
        setNewIp('');
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err?.response?.data?.message || 'Không thể thêm IP.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveIp = async (ipToRemove: string) => {
    if (!maintenance) return;
    const updatedIps = maintenance.bypassIps.filter(ip => ip !== ipToRemove);
    try {
      setSaving(true);
      setError(null);
      const res = await adminApi.toggleMaintenance(maintenance.enabled, updatedIps);
      if (res?.success) {
        setMaintenance(res.data);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err?.response?.data?.message || 'Không thể xoá IP.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock height={400} />;

  return (
    <div style={{ padding: 'var(--tc-spacing-6)', maxWidth: '800px' }}>
      <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', marginBottom: 'var(--tc-spacing-6)' }}>🔧 Chế độ Bảo trì Hệ thống</h1>

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

      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--tc-border)',
        borderRadius: 'var(--tc-radius-lg)',
        padding: 'var(--tc-spacing-6)',
        marginBottom: 'var(--tc-spacing-6)',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 var(--tc-spacing-3) 0' }}>Trạng thái bảo trì hiện tại</h3>
        <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)' }}>
          Khi kích hoạt Chế độ bảo trì, hệ thống sẽ từ chối tất cả các yêu cầu ghi (POST, PUT, PATCH, DELETE) từ người dùng thông thường để đảm bảo an toàn dữ liệu trong lúc nâng cấp hệ thống.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-4)' }}>
          <div style={{
            fontSize: 'var(--tc-font-size-lg)',
            fontWeight: 'bold',
            color: maintenance?.enabled ? 'var(--tc-danger)' : 'var(--tc-success)',
            backgroundColor: maintenance?.enabled ? 'var(--tc-danger-bg)' : 'var(--tc-success-bg)',
            padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
            borderRadius: 'var(--tc-radius-full)'
          }}>
            {maintenance?.enabled ? 'Đang bảo trì (MAINTENANCE ON)' : 'Hoạt động bình thường (ONLINE)'}
          </div>

          <button
            onClick={handleToggle}
            disabled={saving}
            style={{
              padding: '10px 20px',
              backgroundColor: maintenance?.enabled ? 'var(--tc-success)' : 'var(--tc-danger)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {saving ? 'Đang cập nhật...' : maintenance?.enabled ? 'Tắt bảo trì' : 'Bật bảo trì'}
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--tc-border)',
        borderRadius: 'var(--tc-radius-lg)',
        padding: 'var(--tc-spacing-6)',
        boxShadow: 'var(--tc-shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 var(--tc-spacing-3) 0' }}>Danh sách IP được phép truy cập (Bypass IPs)</h3>
        <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-4)' }}>
          Các địa chỉ IP này sẽ không bị chặn khi hệ thống đang trong chế độ bảo trì (Ví dụ: IP của Đội ngũ Kỹ thuật).
        </p>

        <form onSubmit={handleAddIp} style={{ display: 'flex', gap: 'var(--tc-spacing-3)', marginBottom: 'var(--tc-spacing-6)' }}>
          <input
            type="text"
            placeholder="Ví dụ: 192.168.1.1"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            disabled={saving}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid var(--tc-border)',
              borderRadius: 'var(--tc-radius-md)'
            }}
          />
          <button
            type="submit"
            disabled={saving || !newIp.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--tc-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tc-radius-md)',
              cursor: 'pointer'
            }}
          >
            Thêm IP
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tc-spacing-2)' }}>
          {maintenance?.bypassIps.length === 0 ? (
            <p style={{ color: 'var(--tc-text-secondary)', fontStyle: 'italic' }}>Chưa có IP nào trong danh sách miễn trừ.</p>
          ) : (
            maintenance?.bypassIps.map(ip => (
              <div key={ip} style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--tc-neutral-light)',
                border: '1px solid var(--tc-border)',
                padding: '4px 10px',
                borderRadius: 'var(--tc-radius-full)',
                fontSize: 'var(--tc-font-size-sm)',
                gap: '8px'
              }}>
                <span>{ip}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIp(ip)}
                  disabled={saving}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--tc-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: 0
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
