import React, { useState, useEffect } from 'react';
import { tourService } from '../../../services/tourService';

interface TourReviewsTabProps {
  tourId: string;
}

export const TourReviewsTab: React.FC<TourReviewsTabProps> = ({ tourId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await tourService.getTourReviews(tourId);
      setReviews(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải đánh giá...</div>;

  return (
    <div style={{ padding: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Đánh giá từ khách hàng</h2>
      {reviews.length === 0 ? (
        <p style={{ color: 'var(--tc-text-secondary)' }}>Tour này chưa có đánh giá nào.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review: any) => (
            <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.1rem' }}>{review.users?.full_name || 'Khách hàng'}</strong>
                <span style={{ color: '#f59e0b' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--tc-text-primary)' }}>{review.comment}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)' }}>
                {new Date(review.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
