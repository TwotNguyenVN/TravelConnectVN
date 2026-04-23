import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, Card, Badge, Button, Table, LoadingBlock 
} from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import { companionService } from '../../services/companionService';
import './MyCompanionRequestsPage.css';

const MyCompanionRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await companionService.getMySentRequests({});
      if (response.success) {
        setRequests(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching my requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu này?')) {
      try {
        const response = await companionService.cancelRequest(id);
        if (response.success) {
          fetchRequests();
          toast.success('Đã hủy yêu cầu tham gia');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi hủy yêu cầu');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Chuyến đi',
      key: 'postTitle',
      render: (req: any) => (
        <div className="post-info">
          <span className="post-title" onClick={() => navigate(`/companions/${req.companion_posts?.id}`)}>
            {req.companion_posts?.title}
          </span>
          <span className="post-author">Chủ bài: {req.companion_posts?.users?.full_name}</span>
        </div>
      ),
    },
    {
      title: 'Lời nhắn',
      key: 'message',
      render: (req: any) => <span className="message-cell">{req.message || '—'}</span>,
    },
    {
      title: 'Ngày gửi',
      key: 'requestedAt',
      render: (req: any) => <span className="date-cell">{formatDate(req.requested_at)}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (req: any) => (
        <Badge variant={
          req.status === 'approved' ? 'success' : 
          req.status === 'rejected' ? 'danger' : 
          req.status === 'cancelled' ? 'secondary' :
          'warning'
        }>
          {req.status === 'approved' ? 'Đã duyệt' : 
           req.status === 'rejected' ? 'Từ chối' : 
           req.status === 'cancelled' ? 'Đã hủy' :
           'Đang chờ'}
        </Badge>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (req: any) => (
        <div className="action-btns">
          {req.status === 'pending' && (
            <Button variant="outline" size="small" onClick={() => handleCancel(req.id)}>Hủy yêu cầu</Button>
          )}
          <Button variant="outline" size="small" onClick={() => navigate(`/companions/${req.companion_posts?.id}`)}>Xem bài</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer className="my-companion-requests">
      <div className="page-header">
        <h1>Yêu cầu tham gia của tôi</h1>
        <p>Theo dõi trạng thái các yêu cầu tham gia chuyến đi bạn đã gửi.</p>
      </div>

      <Card className="table-card">
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table 
            columns={columns} 
            data={requests} 
            emptyText="Bạn chưa gửi yêu cầu tham gia nào."
            rowKey={(record) => record.id}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default MyCompanionRequestsPage;
