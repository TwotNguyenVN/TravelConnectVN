import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';
import { LoadingBlock } from '../../components/common';

interface Report {
  id: string;
  target_type: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  target_id: string;
  users_reports_reporter_user_idTousers: { full_name: string; email: string; avatar_url?: string };
}

export const AdminReportManagementPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getReports({ take: 50 });
      setReports(response.data.items);
    } catch (error) {
      toast.error('Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleProcess = async (reportId: string, action: 'resolved' | 'rejected') => {
    const actionLabel = action === 'resolved' ? 'GIẢI QUYẾT' : 'BÁC BỎ';
    const note = window.prompt(`Nhập ghi chú xử lý (${actionLabel}):`);
    if (note === null) return;

    try {
      await adminApi.processReport(reportId, { status: action, resolution_note: note });
      toast.success(`Đã ${actionLabel.toLowerCase()} báo cáo`);
      fetchReports();
    } catch (error) {
      toast.error('Xử lý báo cáo thất bại');
    }
  };

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    open: { label: 'Chưa xử lý', color: '#ef4444', bg: '#fef2f2' },
    resolved: { label: 'Đã giải quyết', color: '#10b981', bg: '#ecfdf5' },
    rejected: { label: 'Đã bác bỏ', color: '#64748b', bg: '#f1f5f9' },
  };

  return (
    <div style={{ padding: 'var(--tc-spacing-6)' }}>
      <div style={{ marginBottom: 'var(--tc-spacing-8)' }}>
        <h1 style={{ margin: 0, fontSize: 'var(--tc-font-size-2xl)', fontWeight: 800, color: '#1e293b' }}>Báo cáo vi phạm</h1>
        <p style={{ color: '#64748b', fontSize: 'var(--tc-font-size-sm)', marginTop: '4px' }}>Xử lý các báo cáo từ người dùng về nội dung không phù hợp</p>
      </div>
      
      <div style={{ display: 'grid', gap: 'var(--tc-spacing-4)' }}>
        {loading ? (
          <div style={{ padding: 'var(--tc-spacing-20)' }}><LoadingBlock /></div>
        ) : reports.length === 0 ? (
          <div style={{ 
            textAlign: 'center', padding: 'var(--tc-spacing-20)', 
            backgroundColor: 'white', borderRadius: 'var(--tc-radius-xl)', 
            border: '1px solid var(--tc-border)', color: '#94a3b8' 
          }}>
            🎉 Tuyệt vời! Hiện không có báo cáo nào cần xử lý.
          </div>
        ) : reports.map(report => {
          const status = statusConfig[report.status] || statusConfig.open;
          return (
            <div key={report.id} style={{
              backgroundColor: 'white',
              padding: 'var(--tc-spacing-6)',
              borderRadius: 'var(--tc-radius-xl)',
              border: '1px solid var(--tc-border)',
              boxShadow: 'var(--tc-shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: report.target_type === 'tour' ? '#eff6ff' : '#f5f3ff',
                    color: report.target_type === 'tour' ? '#3b82f6' : '#8b5cf6',
                    fontSize: '10px',
                    fontWeight: 800,
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>{report.target_type === 'tour' ? '🏖️ TOUR' : '🤝 ĐỒNG HÀNH'}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 'var(--tc-font-size-lg)' }}>{report.reason}</span>
                </div>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: status.bg,
                  color: status.color,
                  fontSize: '10px',
                  fontWeight: 800,
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}>{status.label}</span>
              </div>

              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '16px', 
                borderRadius: 'var(--tc-radius-lg)',
                borderLeft: `4px solid ${status.color}`
              }}>
                <p style={{ margin: 0, color: '#334155', lineHeight: 1.6, fontSize: 'var(--tc-font-size-sm)' }}>
                  {report.description || 'Không có mô tả chi tiết.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {report.users_reports_reporter_user_idTousers?.avatar_url ? (
                      <img src={report.users_reports_reporter_user_idTousers.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : '👤'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{report.users_reports_reporter_user_idTousers?.full_name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(report.created_at).toLocaleString('vi-VN')}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => window.open(report.target_type === 'tour' ? `/tours/${report.target_id}` : `/companion/${report.target_id}`, '_blank')}
                    style={{
                      backgroundColor: 'white',
                      color: '#1e293b',
                      border: '1px solid #e2e8f0',
                      padding: '8px 16px',
                      borderRadius: 'var(--tc-radius-lg)',
                      cursor: 'pointer',
                      fontSize: 'var(--tc-font-size-xs)',
                      fontWeight: 600
                    }}>
                    Kiểm tra nội dung
                  </button>
                  
                  {report.status === 'open' && (
                    <>
                      <button 
                        onClick={() => handleProcess(report.id, 'resolved')}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: 'var(--tc-radius-lg)',
                          cursor: 'pointer',
                          fontSize: 'var(--tc-font-size-xs)',
                          fontWeight: 700,
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                        }}>
                        Giải quyết
                      </button>
                      <button 
                        onClick={() => handleProcess(report.id, 'rejected')}
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: 'var(--tc-radius-lg)',
                          cursor: 'pointer',
                          fontSize: 'var(--tc-font-size-xs)',
                          fontWeight: 700
                        }}>
                        Bác bỏ
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
