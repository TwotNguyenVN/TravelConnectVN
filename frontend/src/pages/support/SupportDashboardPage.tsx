/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { PageContainer, Card, Button, LoadingBlock } from '../../components/common';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SupportStats {
  reportCount: number;
  userCount: number;
  tourCount: number;
  pendingVerificationCount: number;
  companionCount: number;
}

interface RecentReport {
  id: string;
  report_type: string;
  reason: string;
  status: string;
  created_at: string;
  reporter?: { full_name: string };
}

interface SosAlert {
  id: string;
  user_id: string;
  tour_id: string | null;
  latitude: number;
  longitude: number;
  status: 'active' | 'resolved';
  note: string | null;
  created_at: string;
  resolved_at: string | null;
  users?: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  tours?: {
    title: string;
    province: string;
  } | null;
}

const REPORT_TYPE_LABEL: Record<string, string> = {
  TOUR: '🗺️ Tour',
  GUIDE: '👤 HDV',
  REVIEW: '⭐ Đánh giá',
  USER: '👥 Người dùng',
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b',
  resolved: '#10b981',
  dismissed: '#94a3b8',
};

// Web Audio siren tone generator
function playSosBeep() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.3);
    osc1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.6);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(660, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.3);
    osc2.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);

    setTimeout(() => {
      ctx.close();
    }, 1000);
  } catch (e) {
    console.error('Failed to play audio:', e);
  }
};

function createSosIcon() {
  return L.divIcon({
    className: 'sos-marker-custom',
    html: `<div class="sos-pin"></div><div class="sos-pulse"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

export const SupportDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [selectedSos, setSelectedSos] = useState<SosAlert | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes, sosRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getReports({ limit: 5, status: 'pending' }),
        adminApi.getSosAlerts(),
      ]);
      if (statsRes?.success) setStats(statsRes.data);
      if (reportsRes?.data) setRecentReports(reportsRes.data.slice(0, 5));
      if (sosRes?.success) setSosAlerts(sosRes.data || []);
    } catch (err) {
      console.error('Error loading support dashboard:', err);
      toast.error('Không thể tải dữ liệu hỗ trợ');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling for SOS alerts every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await adminApi.getSosAlerts();
        if (res?.success) {
          setSosAlerts(res.data || []);
        }
      } catch (err) {
        console.error('Error polling SOS alerts:', err);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeSosAlerts = sosAlerts.filter(a => a.status === 'active');
  const hasActiveSos = activeSosAlerts.length > 0;

  // Siren effect loop
  useEffect(() => {
    if (hasActiveSos && soundEnabled) {
      playSosBeep();
      const sirenTimer = setInterval(playSosBeep, 1500);
      return () => clearInterval(sirenTimer);
    }
  }, [hasActiveSos, soundEnabled]);

  function handleOpenResolveSos(alert: SosAlert) {
    setSelectedSos(alert);
    setResolveNote('');
    setShowSosModal(true);
  };

  async function handleResolveSos() {
    if (!selectedSos) return;
    if (!resolveNote.trim()) {
      toast.error('Vui lòng nhập ghi chú xử lý');
      return;
    }
    try {
      setResolving(true);
      const res = await adminApi.resolveSosAlert(selectedSos.id, resolveNote.trim());
      if (res?.success) {
        toast.success('Đã giải quyết cảnh báo SOS');
        setShowSosModal(false);
        // Refresh list
        const updated = await adminApi.getSosAlerts();
        if (updated?.success) setSosAlerts(updated.data || []);
      }
    } catch (err) {
      console.error('Error resolving SOS alert:', err);
      toast.error('Không thể giải quyết cảnh báo SOS');
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: '40px 0' }}>
          <LoadingBlock height={400} />
        </div>
      </PageContainer>
    );
  }

  const reportChartData = [
    { name: 'Báo cáo Tour', value: Math.round((stats?.reportCount || 0) * 0.45) },
    { name: 'Báo cáo HDV', value: Math.round((stats?.reportCount || 0) * 0.3) },
    { name: 'Báo cáo Review', value: Math.round((stats?.reportCount || 0) * 0.25) },
  ];

  const statCards = [
    { title: 'Báo cáo chờ xử lý', count: stats?.reportCount || 0, color: '#ef4444', bg: '#fef2f2', icon: '🚩', link: '/support/reports' },
    { title: 'Cảnh báo SOS Active', count: activeSosAlerts.length, color: '#dc2626', bg: '#fef2f2', icon: '🆘', link: '/support' },
    { title: 'Bài đồng hành', count: stats?.companionCount || 0, color: '#8b5cf6', bg: '#f5f3ff', icon: '🤝', link: '/support/reports' },
    { title: 'Tour đang hoạt động', count: stats?.tourCount || 0, color: '#10b981', bg: '#ecfdf5', icon: '🗺️', link: '/support/reports' },
  ];

  const quickLinks = [
    { title: 'Yêu cầu Hỗ trợ', description: 'Tiếp nhận và giải quyết phản hồi thắc mắc, sự cố tài khoản, lỗi thanh toán.', icon: '🛟', color: '#2563eb', link: '/support/tickets' },
    { title: 'Xử lý Báo cáo Vi phạm', description: 'Xem và phân xử các báo cáo từ người dùng về tour, HDV, bình luận.', icon: '🚩', color: '#ef4444', link: '/support/reports' },
    { title: 'Tranh chấp Đặt Tour', description: 'Tra cứu lịch sử đặt tour, phân xử khiếu nại giữa khách và HDV.', icon: '⚖️', color: '#f59e0b', link: '/support/disputes' },
    { title: 'Gửi Thông báo', description: 'Phát thông báo hệ thống đến khách hàng, HDV hoặc nhóm cụ thể.', icon: '📢', color: '#3b82f6', link: '/support/broadcast' },
  ];

  return (
    <PageContainer>
      {/* SOS Emergency Alert Banner */}
      {hasActiveSos && (
        <div
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            borderRadius: 'var(--tc-radius-xl)',
            padding: 'var(--tc-spacing-5)',
            marginBottom: 'var(--tc-spacing-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--tc-spacing-4)',
            boxShadow: '0 0 0 4px rgba(220,38,38,0.25), 0 8px 24px rgba(220,38,38,0.3)',
            animation: 'sosPulse 2s infinite',
            position: 'relative',
          }}
        >
          <style>{`
            @keyframes sosPulse {
              0%, 100% { box-shadow: 0 0 0 4px rgba(220,38,38,0.25), 0 8px 24px rgba(220,38,38,0.3); }
              50% { box-shadow: 0 0 0 8px rgba(220,38,38,0.15), 0 8px 32px rgba(220,38,38,0.4); }
            }
            .sos-marker-custom {
              background: none;
              border: none;
            }
            .sos-pin {
              width: 14px;
              height: 14px;
              background-color: #dc2626;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px rgba(220,38,38,0.8);
            }
            .sos-pulse {
              position: absolute;
              top: 0;
              left: 0;
              width: 14px;
              height: 14px;
              background-color: #dc2626;
              border-radius: 50%;
              animation: sosPulseRing 1.5s infinite ease-out;
              pointer-events: none;
            }
            @keyframes sosPulseRing {
              0% { transform: scale(1); opacity: 1; }
              100% { transform: scale(3.5); opacity: 0; }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-4)' }}>
              <div style={{ fontSize: '40px', animation: 'none' }}>🆘</div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>
                  CẢNH BÁO KHẨN CẤP ({activeSosAlerts.length}) — Khách hàng cần hỗ trợ ngay!
                </div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '2px' }}>
                  Vui lòng liên hệ trực tiếp hoặc xác nhận xử lý cảnh báo.
                </div>
              </div>
            </div>
            
            {/* Siren sound control */}
            <button
              onClick={() => {
                if (!soundEnabled) playSosBeep();
                setSoundEnabled(!soundEnabled);
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              {soundEnabled ? '🔊 Còi Đang Bật' : '🔇 Còi Đang Tắt'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
            {/* Left Column: List of alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {activeSosAlerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ color: 'white', fontSize: '14px', flex: 1, minWidth: '200px' }}>
                    <div>
                      <strong>👤 {alert.users?.full_name}</strong>
                      {alert.users?.phone && <span style={{ marginLeft: '10px', opacity: 0.9 }}>📞 {alert.users.phone}</span>}
                      <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                        ⏱ {new Date(alert.created_at).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>📍 GPS: {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}</span>
                      {alert.tours && (
                        <span style={{ fontSize: '11px', alignSelf: 'flex-start', marginTop: '2px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          🗺️ Tour: {alert.tours.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://maps.google.com/?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '12px',
                        textDecoration: 'none',
                      }}
                    >
                      🗺️ Bản Đồ
                    </a>
                    <button
                      onClick={() => handleOpenResolveSos(alert)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      ✅ Xử Lý
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Leaflet Map */}
            <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', zIndex: 1 }}>
              <MapContainer
                center={[Number(activeSosAlerts[0].latitude), Number(activeSosAlerts[0].longitude)]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {activeSosAlerts.map(alert => (
                  <Marker
                    key={alert.id}
                    position={[Number(alert.latitude), Number(alert.longitude)]}
                    icon={createSosIcon()}
                  >
                    <Popup>
                      <div style={{ fontSize: '12px', color: '#1e293b', fontFamily: 'sans-serif' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#dc2626' }}>🆘 CẢNH BÁO SOS</div>
                        <div style={{ marginTop: '4px' }}>Khách hàng: <strong>{alert.users?.full_name}</strong></div>
                        {alert.users?.phone && <div>SĐT: <strong>{alert.users.phone}</strong></div>}
                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#64748b' }}>📍 {Number(alert.latitude).toFixed(5)}, {Number(alert.longitude).toFixed(5)}</div>
                        {alert.tours && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>Tour: {alert.tours.title}</div>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* SOS Resolution Modal */}
      {showSosModal && selectedSos && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, padding: 'var(--tc-spacing-4)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--tc-radius-xl)',
            padding: 'var(--tc-spacing-6)',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--tc-shadow-xl)',
          }}>
            <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontSize: '18px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🆘 Giải Quyết Cảnh Báo Khẩn Cấp
            </h3>
            
            <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '16px', fontSize: '13px', color: '#991b1b' }}>
              <div>Khách hàng: <strong>{selectedSos.users?.full_name}</strong></div>
              <div>Số điện thoại: <strong>{selectedSos.users?.phone || '—'}</strong></div>
              <div>Tọa độ: <strong>{selectedSos.latitude}, {selectedSos.longitude}</strong></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Ghi chú/Biện pháp xử lý *
              </label>
              <textarea
                value={resolveNote}
                onChange={e => setResolveNote(e.target.value)}
                placeholder="Nhập chi tiết biện pháp đã thực hiện (ví dụ: đã gọi cứu hộ local, đã liên lạc thành công với HDV...)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--tc-border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowSosModal(false)} disabled={resolving}>
                Hủy
              </Button>
              <button
                onClick={handleResolveSos}
                disabled={resolving || !resolveNote.trim()}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {resolving ? 'Đang lưu...' : '✅ Xác nhận giải quyết'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Dashboard Hỗ trợ Khách hàng
          </h1>
          <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>
            Tiếp nhận báo cáo, giải quyết tranh chấp và gửi thông báo đến người dùng TravelConnectVN.
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>🔄 Làm mới</Button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--tc-spacing-5)',
        marginBottom: 'var(--tc-spacing-8)',
      }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.link)}
            style={{
              backgroundColor: 'white',
              padding: 'var(--tc-spacing-5)',
              borderRadius: 'var(--tc-radius-xl)',
              border: '1px solid var(--tc-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--tc-shadow-sm)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-md)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <h2 style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: card.color, margin: '4px 0 0 0' }}>
                {card.count}
              </h2>
            </div>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '12px',
              backgroundColor: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout: Chart + Pending Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--tc-spacing-6)', marginBottom: 'var(--tc-spacing-8)' }}>
        {/* Chart */}
        <Card style={{ padding: 'var(--tc-spacing-6)' }}>
          <h3 style={{ margin: '0 0 var(--tc-spacing-5) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
            Phân loại Báo cáo Vi phạm
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reportChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="value" name="Số báo cáo" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Reports Queue */}
        <Card style={{ padding: 'var(--tc-spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--tc-spacing-5)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
              Báo cáo mới nhất ({recentReports.length})
            </h3>
            <Button variant="outline" size="small" onClick={() => navigate('/support/reports')}>
              Xem tất cả
            </Button>
          </div>

          {recentReports.length === 0 ? (
            <div style={{ padding: 'var(--tc-spacing-10) 0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
              <h4 style={{ color: '#1e293b', margin: '0 0 4px 0' }}>Không có báo cáo mới</h4>
              <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-xs)', margin: 0 }}>Cộng đồng đang hoạt động tốt!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
              {recentReports.map(report => (
                <div
                  key={report.id}
                  style={{
                    padding: 'var(--tc-spacing-3) var(--tc-spacing-4)',
                    borderRadius: 'var(--tc-radius-lg)',
                    border: '1px solid var(--tc-border)',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--tc-spacing-3)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        {REPORT_TYPE_LABEL[report.report_type] || report.report_type}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: STATUS_COLOR[report.status] + '22',
                        color: STATUS_COLOR[report.status],
                        fontWeight: 600,
                      }}>
                        {report.status === 'pending' ? 'Chờ xử lý' : report.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                      {report.reason?.slice(0, 60)}{report.reason?.length > 60 ? '...' : ''}
                    </p>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(report.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <Button variant="outline" size="small" onClick={() => navigate('/support/reports')}>
                    Xử lý
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ margin: '0 0 var(--tc-spacing-4) 0', fontSize: 'var(--tc-font-size-md)', fontWeight: 700, color: '#1e293b' }}>
          Công cụ Hỗ trợ nhanh
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
          {quickLinks.map((link, idx) => (
            <Card
              key={idx}
              onClick={() => navigate(link.link)}
              style={{
                padding: 'var(--tc-spacing-5)',
                display: 'flex',
                gap: 'var(--tc-spacing-4)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = link.color;
                e.currentTarget.style.boxShadow = 'var(--tc-shadow-sm)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--tc-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '10px',
                backgroundColor: link.color + '15',
                border: `1px solid ${link.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>
                {link.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--tc-font-size-sm)', fontWeight: 700, color: '#1e293b' }}>
                  {link.title}
                </h4>
                <p style={{ margin: 0, fontSize: 'var(--tc-font-size-xs)', color: '#64748b', lineHeight: '1.4' }}>
                  {link.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
