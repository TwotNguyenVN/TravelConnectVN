import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { useToast } from '../../contexts/ToastContext';
import { adminApi } from '../../api/admin.api';

interface ReviewItem {
  id: string;
  type: 'TOUR' | 'GUIDE' | 'POST';
  targetName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  visibilityStatus: 'visible' | 'hidden';
  createdAt: string;
}

export const AdminReviewManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'post' | 'guide' | 'tour'>('all');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanningReviewId, setScanningReviewId] = useState<string | null>(null);
  const [aiScanResults, setAiScanResults] = useState<Record<string, unknown>>({});
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviewsAdmin();
      // Combine tours and guides
      const combined: ReviewItem[] = [
        ...response.data.tours,
        ...response.data.guides
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReviews(combined);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleAiScan = async (review: ReviewItem) => {
    try {
      setScanningReviewId(review.id);
      const textToAnalyze = `Đánh giá của ${review.userName} cho ${review.targetName} (${review.rating} sao): ${review.comment}`;
      const response = await adminApi.analyzeContent(textToAnalyze);
      setAiScanResults(prev => ({
        ...prev,
        [review.id]: response.data
      }));
      if (response.data.flagged) {
        toast.warning('AI phát hiện nghi vấn vi phạm chính sách!');
      } else {
        toast.success('AI quét hoàn tất: Nội dung an toàn.');
      }
    } catch {
      toast.error('AI quét thất bại');
    } finally {
      setScanningReviewId(null);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleVisibility = async (review: ReviewItem) => {
    try {
      const newStatus = review.visibilityStatus === 'visible' ? 'hidden' : 'visible';
      await reviewService.updateReviewVisibility(review.type as unknown, review.id, newStatus);
      
      setReviews(prev => prev.map(r => 
        (r.id === review.id && r.type === review.type) 
        ? { ...r, visibilityStatus: newStatus as unknown } 
        : r
      ));
      
      toast.success(`Đã ${newStatus === 'hidden' ? 'ẩn' : 'hiển thị'} đánh giá`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tour') return r.type === 'TOUR';
    if (activeTab === 'guide') return r.type === 'GUIDE';
    if (activeTab === 'post') return r.type === 'POST';
    return true;
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--tc-text-primary)' }}>
          Quản lý Đánh giá & Bình luận
        </h1>
        <p style={{ color: 'var(--tc-text-secondary)', marginTop: '4px' }}>
          Xem và quản lý tất cả phản hồi từ người dùng trên toàn hệ thống.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--tc-border)',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'post', label: 'Bài tìm bạn' },
          { id: 'guide', label: 'Hướng dẫn viên' },
          { id: 'tour', label: 'Tour' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as unknown)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--tc-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--tc-text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px', 
          background: 'white', 
          borderRadius: '16px',
          border: '1px solid var(--tc-border)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ color: 'var(--tc-text-primary)' }}>Không có đánh giá nào</h3>
          <p style={{ color: 'var(--tc-text-secondary)' }}>Hiện chưa có phản hồi nào trong mục này.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReviews.map(review => (
            <div key={`${review.type}-${review.id}`} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--tc-border)',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              opacity: review.visibilityStatus === 'hidden' ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}>
              <img 
                src={review.userAvatar || 'https://i.pravatar.cc/150?u=' + review.userName} 
                alt={review.userName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      backgroundColor: review.type === 'TOUR' ? '#e0f2fe' : review.type === 'GUIDE' ? '#fef3c7' : '#f3e8ff',
                      color: review.type === 'TOUR' ? '#0369a1' : review.type === 'GUIDE' ? '#92400e' : '#7e22ce',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}>
                      {review.type === 'TOUR' ? 'TOUR' : review.type === 'GUIDE' ? 'HDV' : 'BÀI VIẾT'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{review.userName}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--tc-text-secondary)', margin: '2px 0' }}>
                      Đánh giá cho: <strong style={{ color: 'var(--tc-text-primary)' }}>{review.targetName}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '700' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tc-text-secondary)', marginTop: '4px' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#334155'
                }}>
                  {review.comment || '(Không có nội dung bình luận)'}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button 
                    onClick={() => handleAiScan(review)}
                    disabled={scanningReviewId === review.id}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: '#f8fafc',
                      color: 'var(--tc-text-primary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      opacity: scanningReviewId === review.id ? 0.6 : 1
                    }}
                  >
                    {scanningReviewId === review.id ? '⏳ Đang quét...' : '🤖 Quét AI'}
                  </button>
                  <button 
                    onClick={() => handleToggleVisibility(review)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--tc-border)',
                      backgroundColor: review.visibilityStatus === 'hidden' ? '#10b981' : '#f43f5e',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {review.visibilityStatus === 'hidden' ? 'Hiện đánh giá' : 'Ẩn đánh giá'}
                  </button>
                </div>
                
                {aiScanResults[review.id] && (
                  <div style={{
                    marginTop: '12px',
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${aiScanResults[review.id].flagged ? '#fca5a5' : '#cbd5e1'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🤖</span>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>Kết quả Quét AI</span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 700,
                          backgroundColor: aiScanResults[review.id].flagged ? '#fef2f2' : '#f0fdf4',
                          color: aiScanResults[review.id].flagged ? '#ef4444' : '#16a34a'
                        }}>
                          {aiScanResults[review.id].flagged ? 'Nghi vấn vi phạm' : 'An toàn'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setAiScanResults(prev => {
                          const copy = { ...prev };
                          delete copy[review.id];
                          return copy;
                        })}
                        style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: '14px' }}
                      >✕</button>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                      <strong>Lý do:</strong> {aiScanResults[review.id].reason}
                    </p>
                    {aiScanResults[review.id].highlights && aiScanResults[review.id].highlights.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Chi tiết nghi vấn:</div>
                        {aiScanResults[review.id].highlights.map((h: { text: string; type: string; explanation: string }, idx: number) => (
                          <div key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '6px 12px',
                            backgroundColor: '#fffbeb',
                            borderLeft: '4px solid #f59e0b',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#78350f'
                          }}>
                            <span style={{ fontWeight: 700, textDecoration: 'underline' }}>"{h.text}"</span>
                            <span>({h.type === 'contact_info' ? 'Thông tin liên hệ' : h.type === 'offensive' ? 'Ngôn từ nhạy cảm' : 'Spam/Khác'}):</span>
                            <span>{h.explanation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
