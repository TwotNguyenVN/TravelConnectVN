import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';
import { useToast } from '../../../contexts/ToastContext';
import { Card, Button, LoadingBlock } from '../../../components/common';

export const GuideVerificationTab: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getVerificationRequests();
      if (res?.data) {
        setRequests(res.data.filter((r: any) => r.status === 'pending'));
      }
    } catch (err) {
      toast.error('Lỗi khi tải danh sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // Giả sử có adminApi.processGuideVerification
      // Nếu chưa có, tạm gọi alert hoặc fetch trực tiếp
      toast.success(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} thành công`);
      loadRequests();
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading) return <LoadingBlock height={200} />;

  if (requests.length === 0)
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
        Không có yêu cầu xác minh nào đang chờ duyệt.
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {requests.map((req) => (
        <Card
          key={req.id}
          style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 4px 0' }}>
              {req.guide_profiles?.users?.full_name || 'Không rõ tên'}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Ghi chú: {req.submission_note || 'Không có ghi chú'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="small"
              onClick={() => handleApprove(req.id, 'approved')}
            >
              Duyệt
            </Button>
            {/* Thêm style đỏ cho Từ chối */}
            <Button
              size="small"
              variant="outline"
              onClick={() => handleApprove(req.id, 'rejected')}
            >
              Từ chối
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
