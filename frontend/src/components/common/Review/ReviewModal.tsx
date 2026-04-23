import React, { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import reviewService from '../../../services/reviewService';
import { useToast } from '../../../contexts/ToastContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourRequestId: string;
  tourTitle: string;
  guideName?: string;
  onSuccess?: () => void;
  type: 'tour' | 'guide';
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  tourRequestId,
  tourTitle,
  guideName,
  onSuccess,
  type
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = {
        tourRequestId,
        rating,
        comment
      };

      let res: any;
      if (type === 'tour') {
        res = await reviewService.createTourReview(data);
      } else {
        res = await reviewService.createGuideReview(data);
      }

      if (res.success) {
        toast.success(`Đã gửi đánh giá ${type === 'tour' ? 'tour' : 'hướng dẫn viên'} thành công!`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'tour' ? 'Đánh giá chuyến đi' : 'Đánh giá hướng dẫn viên'}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {type === 'tour' ? `Tour: ${tourTitle}` : `Hướng dẫn viên: ${guideName}`}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--tc-text-secondary)' }}>
            Chia sẻ trải nghiệm của bạn để giúp cộng đồng và cải thiện dịch vụ.
          </p>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>Chấm điểm</label>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '32px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer', color: star <= rating ? '#fbbf24' : '#d1d5db' }}
              >
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--tc-text-secondary)' }}>
            {rating === 5 ? 'Tuyệt vời!' : rating === 4 ? 'Tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất tệ'}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nhận xét chi tiết</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bạn thấy chuyến đi thế nào? Có điều gì cần cải thiện không?"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--tc-border)',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button type="submit" variant="primary" isLoading={submitting}>Gửi đánh giá</Button>
        </div>
      </form>
    </Modal>
  );
};
