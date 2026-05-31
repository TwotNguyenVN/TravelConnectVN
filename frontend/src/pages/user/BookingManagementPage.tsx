import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, LoadingBlock, ReviewModal } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import tourRequestService from '../../services/tourRequestService';
import { companionService } from '../../services/companionService';
import { paymentService } from '../../services/paymentService';
import chatService from '../../services/chatService';
import { DEFAULT_AVATAR } from '../../constants/images';
import './BookingManagementPage.css';

interface NormalizedActivity {
  id: string;
  originalId: string;
  type: 'tour' | 'companion';
  title: string;
  image?: string;
  startDate?: string;
  guideId: string;
  guideUserId: string;
  guideName: string;
  guideAvatar?: string;
  participants: number;
  totalPrice?: number;
  amountPaid?: number;
  status: string;
  requestedAt: string;
  transactions: any[];
  responseNote?: string;
  cancellationNote?: string;
  entityId: string; // tourId or postId
  hasTourReview?: boolean;
  hasGuideReview?: boolean;
}

export const BookingManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed' | 'cancelled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tour' | 'companion'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<NormalizedActivity[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    type: 'tour' | 'guide';
    activity: NormalizedActivity | null;
  }>({ isOpen: false, type: 'tour', activity: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tourRes, companionRes, transRes] = await Promise.all([
        tourRequestService.getMyRequests({ limit: 100 }),
        companionService.getMySentRequests({ limit: 100 }),
        paymentService.getMyTransactions()
      ]);

      const transactions = transRes.success ? transRes.data : [];
      
      // Normalize Tour Requests
      const normalizedTours: NormalizedActivity[] = (tourRes.data?.data || []).map((req: any) => {
        const tourTransactions = transactions.filter((t: any) => t.tour_request_id === req.id);
        const paidAmount = tourTransactions
          .filter((t: any) => t.status === 'paid')
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        return {
          id: `tour-${req.id}`,
          originalId: req.id,
          type: 'tour',
          title: req.tourTitle,
          image: req.tourImage || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=400',
          startDate: req.startDate,
          guideId: req.guideId,
          guideUserId: req.guideUserId || '',
          guideName: req.guideName || 'Hướng dẫn viên',
          guideAvatar: req.guideAvatar,
          participants: req.participantCount,
          totalPrice: req.totalPrice,
          amountPaid: paidAmount,
          status: req.status,
          requestedAt: req.requestedAt,
          transactions: tourTransactions.map((t: any) => ({
            id: t.id,
            code: t.transaction_code,
            amount: Number(t.amount),
            date: new Date(t.created_at).toLocaleString('vi-VN'),
            status: t.status,
            method: t.payment_method
          })),
          responseNote: req.responseNote,
          cancellationNote: req.cancellationNote,
          entityId: req.tourId,
          hasTourReview: req.hasTourReview,
          hasGuideReview: req.hasGuideReview
        };
      });

      // Normalize Companion Requests
      const normalizedCompanions: NormalizedActivity[] = (companionRes.data?.items || []).map((req: any) => {
        const companionImages = req.companion_posts?.images as any[] | undefined;
        const coverImage = companionImages?.find((img: any) => img.isCover)?.imageUrl || companionImages?.[0]?.imageUrl;

        return {
          id: `companion-${req.id}`,
          originalId: req.id,
          type: 'companion',
          title: req.companion_posts?.title || 'Tìm bạn đồng hành',
          image: coverImage || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=400',
          startDate: req.companion_posts?.start_date,
          guideId: req.companion_posts?.users?.id || req.companion_posts?.user_id,
          guideUserId: req.companion_posts?.users?.id || req.companion_posts?.user_id,
          guideName: req.companion_posts?.users?.full_name || 'Chủ bài',
          guideAvatar: req.companion_posts?.users?.avatar_url,
          participants: 1, // Current user
          status: req.status,
          requestedAt: req.requested_at,
          transactions: [],
          responseNote: req.response_note,
          entityId: req.post_id
        };
      });

      const allActivities = [...normalizedTours, ...normalizedCompanions].sort(
        (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      );

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Không thể tải dữ liệu hoạt động');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayment = async (requestId: string) => {
    try {
      const response = await paymentService.createVnpayUrl(requestId, 'full');
      if (response.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Không thể tạo URL thanh toán');
      }
    } catch (error) {
      toast.error('Lỗi khi khởi tạo thanh toán');
    }
  };

  const handleCancelTour = async (activity: NormalizedActivity) => {
    const hasPaid = activity.amountPaid && activity.amountPaid > 0;
    let confirmMsg = 'Bạn có chắc chắn muốn hủy yêu cầu đặt tour này?';
    
    if (hasPaid) {
      confirmMsg = `Bạn đã thanh toán ${activity.amountPaid?.toLocaleString()}đ cho tour này.

Theo chính sách hoàn tiền:
- Hủy trước ngày khởi hành 3 ngày: Hoàn 100% số tiền đã trả.
- Hủy trước ngày khởi hành 1-2 ngày: Hoàn 50% số tiền đã trả.
- Hủy trong ngày khởi hành: Không hoàn tiền.

Hệ thống sẽ ghi nhận và hoàn tiền tự động. Bạn có chắc chắn muốn hủy đặt tour?`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        const response = await tourRequestService.cancelRequest(activity.originalId, 'Người dùng hủy từ trang quản lý');
        if (response.success) {
          toast.success(hasPaid ? 'Đã hủy đặt tour và gửi yêu cầu hoàn tiền thành công!' : 'Đã hủy đặt tour thành công.');
          fetchData();
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi hủy đặt tour');
      }
    }
  };

  const handleOpenGroupChat = async (companionPostId: string) => {
    try {
      const res = await chatService.createGroupCompanion(companionPostId);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error('Không thể mở nhóm chat.');
      }
    } catch (err: any) {
      console.error('Error opening group chat:', err);
      toast.error('Có lỗi xảy ra khi tạo nhóm chat. Vui lòng thử lại sau.');
    }
  };

  const handleOpenDirectChat = async (userId: string) => {
    try {
      const res = await chatService.createDirect(userId);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error('Không thể mở cuộc trò chuyện.');
      }
    } catch (err: any) {
      console.error('Error opening direct chat:', err);
      toast.error('Có lỗi xảy ra khi bắt đầu cuộc trò chuyện.');
    }
  };

  const handleCancelCompanion = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu tham gia này?')) {
      try {
        const response = await companionService.cancelRequest(id);
        if (response.success) {
          toast.success('Đã hủy yêu cầu tham gia');
          fetchData();
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi hủy yêu cầu');
      }
    }
  };

  const getStatusInfo = (status: string, type: 'tour' | 'companion', payPercent: number = 100) => {
    switch (status) {
      case 'paid':
        if (payPercent < 100) {
          return { label: 'Chưa hoàn tất thanh toán', variant: 'warning' as const };
        }
        return { label: 'Đã xác nhận', variant: 'success' as const };
      case 'payment_pending':
        return { label: 'Chờ thanh toán nốt', variant: 'primary' as const };
      case 'approved':
        return { label: type === 'tour' ? 'Đã xác nhận' : 'Đã duyệt', variant: 'success' as const };
      case 'pending':
        return { label: type === 'tour' ? 'Chờ thanh toán' : 'Chờ duyệt', variant: 'warning' as const };
      case 'rejected':
        return { label: 'Bị từ chối', variant: 'danger' as const };
      case 'cancelled':
      case 'cancelled_by_user':
        return { label: 'Đã hủy', variant: 'secondary' as const };
      case 'completed':
      case 'finished':
        return { label: 'Đã kết thúc', variant: 'success' as const };
      default:
        return { label: status, variant: 'secondary' as const };
    }
  };

  const handleReviewTour = (activity: NormalizedActivity) => {
    setReviewModal({ isOpen: true, type: 'tour', activity });
  };

  const handleReviewGuide = (activity: NormalizedActivity) => {
    setReviewModal({ isOpen: true, type: 'guide', activity });
  };

  const handleReviewSuccess = () => {
    setReviewModal({ isOpen: false, type: 'tour', activity: null });
    fetchData();
  };

  const filteredActivities = activities.filter(act => {
    if (typeFilter !== 'all' && act.type !== typeFilter) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'processing') return ['pending', 'approved', 'payment_pending'].includes(act.status);
    if (activeTab === 'completed') return ['paid', 'completed'].includes(act.status);
    if (activeTab === 'cancelled') return ['rejected', 'cancelled', 'cancelled_by_user'].includes(act.status);
    return true;
  });

  if (loading) return <LoadingBlock />;

  return (
    <div className="tc-booking-management-page">
      <div className="tc-mockup-header">
        <div className="tc-header-content">
          <h1>Hoạt động của tôi</h1>
          <p>Quản lý các chuyến đi và yêu cầu đồng hành của bạn tại một nơi duy nhất.</p>
        </div>
        
        <div className="tc-filter-controls">
          <div className="tc-type-filters">
            <button 
              className={`tc-type-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={`tc-type-btn ${typeFilter === 'tour' ? 'active' : ''}`}
              onClick={() => setTypeFilter('tour')}
            >
              Tour du lịch
            </button>
            <button 
              className={`tc-type-btn ${typeFilter === 'companion' ? 'active' : ''}`}
              onClick={() => setTypeFilter('companion')}
            >
              Bạn đồng hành
            </button>
          </div>

          <div className="tc-mockup-tabs">
            {[
              { id: 'all', label: 'Tất cả trạng thái' },
              { id: 'processing', label: 'Đang xử lý' },
              { id: 'completed', label: 'Hoàn tất' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`tc-mockup-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tc-booking-list">
        {filteredActivities.length === 0 ? (
          <div className="tc-empty-state">
            <div className="tc-empty-icon">📂</div>
            <p>Bạn chưa có hoạt động nào trong danh mục này.</p>
            <Button variant="primary" onClick={() => navigate('/tours')}>Khám phá Tour ngay</Button>
          </div>
        ) : (
          filteredActivities.map(activity => {
            const payPercent = activity.totalPrice ? Math.round((activity.amountPaid! / activity.totalPrice) * 100) : 0;
            const statusInfo = getStatusInfo(activity.status, activity.type, payPercent);
            const isExpanded = expandedId === activity.id;

            return (
              <Card key={activity.id} className={`tc-booking-card ${activity.status} ${activity.type}`}>
                <div className={`tc-card-main ${activity.type}`}>
                  <div className="tc-image-column">
                    <div className="tc-booking-tags">
                      <Badge variant={activity.type === 'tour' ? 'primary' : 'secondary'}>
                        {activity.type === 'tour' ? 'TOUR' : 'ĐỒNG HÀNH'}
                      </Badge>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                    <div className="tc-booking-image-wrapper">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="tc-booking-image"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=400'; }}
                      />
                    </div>
                  </div>

                  <div className="tc-booking-info">
                    <div className="tc-info-header">
                      <div className="tc-tour-meta">
                        <span className="tc-booking-id">Mã: {activity.originalId.substring(0, 8).toUpperCase()}</span>
                        <span className="tc-dot">•</span>
                        <span className="tc-booking-date">Đặt ngày: {new Date(activity.requestedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <h2 
                        className="tc-tour-title" 
                        onClick={() => navigate(activity.type === 'tour' ? `/tours/${activity.entityId}` : `/companions/${activity.entityId}`)}
                      >
                        {activity.title}
                      </h2>
                    </div>

                    <div className="tc-info-row">
                      <div className="tc-info-block">
                        <span className="tc-label">Lịch trình</span>
                        <div className="tc-value-with-icon">
                          <span className="tc-icon">📅</span>
                          <span className="tc-value">
                            {activity.startDate ? new Date(activity.startDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Chưa xác định'}
                          </span>
                        </div>
                      </div>

                      <div className="tc-info-block">
                        <span className="tc-label">{activity.type === 'tour' ? 'Hướng dẫn viên' : 'Chủ bài đăng'}</span>
                        <div 
                          className="tc-guide-inline-premium" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(activity.type === 'tour' ? `/guides/${activity.guideId}` : `/profile/${activity.guideId}`);
                          }}
                        >
                          <img 
                            src={activity.guideAvatar || DEFAULT_AVATAR} 
                            alt={activity.guideName} 
                            className="tc-guide-avatar-md"
                            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                          />
                          <div className="tc-guide-detail">
                            <span className="tc-value tc-link" title={activity.guideName}>{activity.guideName}</span>
                            <span className="tc-sub-value">Đối tác tin cậy</span>
                          </div>
                        </div>
                      </div>

                      <div className="tc-info-block">
                        <span className="tc-label">{activity.type === 'tour' ? 'Số lượng khách' : 'Số người tham gia'}</span>
                        <div className="tc-value-with-icon">
                          <span className="tc-icon">👥</span>
                          <span className="tc-value">{activity.participants} người</span>
                        </div>
                      </div>
                    </div>

                    {(activity.responseNote || activity.cancellationNote) && (
                      <div className={`tc-guide-note ${['rejected', 'cancelled', 'cancelled_by_user'].includes(activity.status) ? 'rejected' : ''}`}>
                        <span className="tc-note-icon">
                          {['rejected', 'cancelled', 'cancelled_by_user'].includes(activity.status) ? '🚫' : '💬'}
                        </span>
                        <div>
                          <strong className="tc-note-label">
                            {activity.status === 'rejected' ? 'Lý do từ chối:' : 
                             ['cancelled', 'cancelled_by_user'].includes(activity.status) ? 'Lý do hủy:' : 
                             'Phản hồi:'}
                          </strong>
                          <p>"{activity.responseNote || activity.cancellationNote}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="tc-booking-payment">
                    {activity.type === 'tour' && activity.totalPrice && (
                      <>
                        <div className="tc-payment-summary">
                          <span className="tc-label">Tổng thanh toán</span>
                          <span className="tc-total-amount">{activity.totalPrice.toLocaleString()}đ</span>
                        </div>
                        
                        {['paid', 'payment_pending', 'completed', 'cancelled_by_user'].includes(activity.status) && (
                          <div className="tc-payment-progress-wrapper">
                            <div className="tc-progress-labels">
                              <span>Đã trả: {activity.amountPaid?.toLocaleString()}đ</span>
                              <span>{payPercent}%</span>
                            </div>
                            <div className="tc-progress-bar">
                              <div className="tc-progress-fill" style={{ width: `${payPercent}%` }}></div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="tc-card-actions">
                      {activity.type === 'tour' ? (
                        <>
                          {activity.totalPrice && (
                            <div className="tc-payment-inline-badge">
                              <span>Đã thanh toán:</span>
                              <strong>{activity.amountPaid?.toLocaleString()}đ</strong>
                              <span className="tc-percent-pill">{payPercent}%</span>
                            </div>
                          )}

                          {(activity.status === 'pending' || activity.status === 'approved') && (
                            <Button variant="primary" fullWidth onClick={() => handlePayment(activity.originalId)}>
                              Thanh toán ngay
                            </Button>
                          )}
                          {activity.status === 'payment_pending' && (
                            <Button variant="primary" fullWidth onClick={() => handlePayment(activity.originalId)}>
                              Thanh toán tiếp
                            </Button>
                          )}
                          {(activity.status === 'pending' || activity.status === 'approved') && (
                            <Button variant="outline" fullWidth onClick={() => handleCancelTour(activity)}>
                              Hủy đặt tour
                            </Button>
                          )}
                          {activity.status === 'paid' && (
                            <>
                              {payPercent < 100 && (
                                <Button variant="primary" fullWidth onClick={() => handlePayment(activity.originalId)}>
                                  Hoàn tất thanh toán
                                </Button>
                              )}
                            </>
                          )}

                          {['approved', 'payment_pending', 'paid', 'completed'].includes(activity.status) && (
                            <Button 
                              variant="outline" 
                              fullWidth 
                              onClick={() => navigate(`/tours/${activity.entityId}/map`)}
                              className="tc-btn-map"
                            >
                              🗺️ Bản đồ lịch trình
                            </Button>
                          )}

                          {['approved', 'payment_pending', 'paid', 'completed'].includes(activity.status) && activity.guideUserId && (
                            <Button 
                              variant="outline" 
                              fullWidth 
                              onClick={() => handleOpenDirectChat(activity.guideUserId)}
                              className="tc-btn-chat"
                            >
                              💬 Nhắn tin hướng dẫn viên
                            </Button>
                          )}

                          <Button variant="outline" fullWidth onClick={() => navigate(`/tours/${activity.entityId}`)}>
                            Xem chi tiết tour
                          </Button>

                          {(activity.status === 'completed' || activity.status === 'finished') && (
                            <div className="tc-review-container">
                              <span className="tc-review-prompt">Chuyến đi đã kết thúc, hãy chia sẻ cảm nhận của bạn!</span>
                              <div className="tc-review-actions">
                                {activity.hasTourReview ? (
                                  <Button 
                                    variant="secondary" 
                                    fullWidth 
                                    disabled
                                    className="tc-btn-review"
                                  >
                                    ✓ Đã đánh giá Tour
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="primary" 
                                    fullWidth 
                                    onClick={() => handleReviewTour(activity)}
                                    className="tc-btn-review"
                                  >
                                    ⭐ Đánh giá Tour
                                  </Button>
                                )}
                                
                                {activity.hasGuideReview ? (
                                  <Button 
                                    variant="secondary" 
                                    fullWidth 
                                    disabled
                                    className="tc-btn-review"
                                  >
                                    ✓ Đã đánh giá HDV
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    fullWidth 
                                    onClick={() => handleReviewGuide(activity)}
                                    className="tc-btn-review"
                                  >
                                    👨‍💼 Đánh giá HDV
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {activity.status === 'pending' && (
                            <Button variant="outline" fullWidth onClick={() => handleCancelCompanion(activity.originalId)}>
                              Hủy yêu cầu
                            </Button>
                          )}
                          
                          {activity.status === 'approved' && (
                            <div className="tc-chat-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                              <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={() => handleOpenDirectChat(activity.guideId)}
                                className="tc-btn-chat"
                              >
                                💬 Nhắn tin chủ bài
                              </Button>
                              <Button 
                                variant="outline" 
                                fullWidth 
                                onClick={() => handleOpenGroupChat(activity.entityId)}
                                className="tc-btn-chat"
                              >
                                👥 Nhóm chat chuyến đi
                              </Button>
                            </div>
                          )}

                          <Button variant="outline" fullWidth onClick={() => navigate(`/companions/${activity.entityId}`)}>
                            Xem bài viết
                          </Button>
                          
                          {(activity.status === 'completed' || activity.status === 'finished') && (
                            <div className="tc-companion-completed-badge" style={{ textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.85rem', fontWeight: '600' }}>
                              ✓ Đã hoàn thành chuyến đi đồng hành!
                            </div>
                          )}
                        </>
                      )}
                      
                      {activity.transactions.length > 0 && (
                        <button 
                          className={`tc-toggle-history ${isExpanded ? 'active' : ''}`}
                          onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                        >
                          {isExpanded ? 'Ẩn lịch sử' : 'Xem lịch sử GD'} {isExpanded ? '▲' : '▼'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="tc-booking-history">
                    <h3>Lịch sử giao dịch</h3>
                    <div className="tc-transaction-table">
                      <div className="tc-tr tc-th">
                        <span>Mã GD</span>
                        <span>Ngày</span>
                        <span>Số tiền</span>
                        <span>Phương thức</span>
                        <span>Trạng thái</span>
                      </div>
                      {activity.transactions.map(tx => (
                        <div key={tx.id} className="tc-tr">
                          <span className="tc-tx-code">{tx.code}</span>
                          <span>{tx.date}</span>
                          <span className="tc-tx-amount">{tx.amount.toLocaleString()}đ</span>
                          <span className="tc-tx-method">{tx.method.toUpperCase()}</span>
                          <span>
                            <Badge variant={tx.status === 'paid' ? 'success' : tx.status === 'refunded' ? 'secondary' : tx.status === 'cancelled' ? 'danger' : 'warning'}>
                              {tx.status === 'paid' ? 'Thành công' : tx.status === 'refunded' ? 'Đã hoàn tiền' : tx.status === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}
                            </Badge>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {reviewModal.activity && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, type: 'tour', activity: null })}
          tourRequestId={reviewModal.activity.originalId}
          tourTitle={reviewModal.activity.title}
          guideName={reviewModal.activity.guideName}
          type={reviewModal.type}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default BookingManagementPage;
