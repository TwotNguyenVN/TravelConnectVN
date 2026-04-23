import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { useToast } from '../../contexts/ToastContext';

interface Report {
  id: string;
  target_type: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  users_reports_reporter_user_idTousers: { full_name: string; email: string };
}

export function AdminReportManagementPage() {
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
    const note = window.prompt(`Ghi chú xử lý (${action}):`);
    if (note === null) return;

    try {
      await adminApi.processReport(reportId, { status: action, resolution_note: note });
      toast.success('Đã cập nhật trạng thái báo cáo');
      fetchReports();
    } catch (error) {
      toast.error('Xử lý báo cáo thất bại');
    }
  };

  return (
    <div className="admin-reports">
      <h1 style={{ marginBottom: 'var(--tc-spacing-6)', fontSize: 'var(--tc-font-size-2xl)' }}>Quản lý báo cáo vi phạm</h1>
      
      <div style={{ display: 'grid', gap: 'var(--tc-spacing-4)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--tc-spacing-10)' }}>Đang tải...</div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--tc-spacing-10)', backgroundColor: 'var(--tc-bg-default)', borderRadius: 'var(--tc-radius-lg)' }}>
            Không có báo cáo nào cần xử lý.
          </div>
        ) : reports.map(report => (
          <div key={report.id} style={{
            backgroundColor: 'var(--tc-bg-default)',
            padding: 'var(--tc-spacing-5)',
            borderRadius: 'var(--tc-radius-lg)',
            border: '1px solid var(--tc-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-3)', marginBottom: 'var(--tc-spacing-2)' }}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: 'var(--tc-danger-bg)',
                  color: 'var(--tc-danger)',
                  fontSize: 'var(--tc-font-size-xs)',
                  fontWeight: 600,
                  borderRadius: '10px',
                  textTransform: 'uppercase'
                }}>{report.target_type}</span>
                <span style={{ fontWeight: 600 }}>{report.reason}</span>
                <span style={{ color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-xs)' }}>
                  {new Date(report.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              <p style={{ margin: '0 0 var(--tc-spacing-3) 0', color: 'var(--tc-text-main)' }}>{report.description}</p>
              <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)' }}>
                Người báo cáo: <strong>{report.users_reports_reporter_user_idTousers?.full_name}</strong> ({report.users_reports_reporter_user_idTousers?.email})
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)', marginLeft: 'var(--tc-spacing-4)' }}>
              {report.status === 'open' ? (
                <>
                  <button 
                    onClick={() => handleProcess(report.id, 'resolved')}
                    style={{
                      backgroundColor: 'var(--tc-success)',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
                      borderRadius: 'var(--tc-radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--tc-font-size-sm)'
                    }}>
                    Giải quyết
                  </button>
                  <button 
                    onClick={() => handleProcess(report.id, 'rejected')}
                    style={{
                      backgroundColor: 'var(--tc-bg-subtle)',
                      color: 'var(--tc-text-main)',
                      border: '1px solid var(--tc-border)',
                      padding: 'var(--tc-spacing-2) var(--tc-spacing-4)',
                      borderRadius: 'var(--tc-radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--tc-font-size-sm)'
                    }}>
                    Bác bỏ
                  </button>
                </>
              ) : (
                <span style={{ color: 'var(--tc-text-secondary)', fontWeight: 500 }}>{report.status.toUpperCase()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
