import React, { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import reviewService from '../../../services/reviewService';
import { useToast } from '../../../contexts/ToastContext';
import './ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourRequestId: string;
  tourTitle: string;
  guideName?: string;
  onSuccess?: () => void;
  type: 'tour' | 'guide';
}

const RATING_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Rất tệ', emoji: '😞' },
  2: { text: 'Kém', emoji: '😕' },
  3: { text: 'Bình thường', emoji: '😐' },
  4: { text: 'Tốt', emoji: '😊' },
  5: { text: 'Tuyệt vời!', emoji: '🤩' },
};

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
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayRating = hoveredRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      toast.error('Vui lòng viết nhận xét ít nhất 10 ký tự.');
      return;
    }
    try {
      setSubmitting(true);
      const data = {
        tourRequestId,
        rating,
        comment: comment.trim()
      };

      let res: any;
      if (type === 'tour') {
        res = await reviewService.createTourReview(data);
      } else {
        res = await reviewService.createGuideReview(data);
      }

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setRating(5);
          setComment('');
          onSuccess?.();
          onClose();
        }, 1500);
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

  const handleClose = () => {
    if (!submitting) {
      setRating(5);
      setHoveredRating(0);
      setComment('');
      setSubmitted(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={type === 'tour' ? '⭐ Đánh giá chuyến đi' : '👨‍💼 Đánh giá hướng dẫn viên'}>
      {submitted ? (
        <div className="rv-success-state">
          <div className="rv-success-icon">✅</div>
          <h3 className="rv-success-title">Cảm ơn bạn!</h3>
          <p className="rv-success-text">
            Đánh giá của bạn đã được ghi nhận và sẽ giúp cộng đồng tìm được dịch vụ tốt hơn.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rv-form">
          <div className="rv-subject">
            <div className="rv-subject-icon">
              {type === 'tour' ? '🏔️' : '🧑‍💼'}
            </div>
            <div className="rv-subject-info">
              <span className="rv-subject-label">
                {type === 'tour' ? 'Tour' : 'Hướng dẫn viên'}
              </span>
              <span className="rv-subject-name">
                {type === 'tour' ? tourTitle : guideName}
              </span>
            </div>
          </div>

          <div className="rv-rating-section">
            <label className="rv-rating-label">Chấm điểm</label>
            <div className="rv-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rv-star ${star <= displayRating ? 'active' : ''} ${star <= hoveredRating ? 'hovered' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`${star} sao`}
                >
                  {star <= displayRating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <div className="rv-rating-feedback">
              <span className="rv-rating-emoji">{RATING_LABELS[displayRating].emoji}</span>
              <span className="rv-rating-text">{RATING_LABELS[displayRating].text}</span>
            </div>
          </div>

          <div className="rv-comment-section">
            <label className="rv-comment-label" htmlFor="rv-comment">
              Nhận xét chi tiết
            </label>
            <textarea
              id="rv-comment"
              required
              rows={4}
              minLength={10}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={type === 'tour'
                ? 'Bạn thấy chuyến đi thế nào? Lịch trình, dịch vụ, cảnh quan có đáng trải nghiệm không?'
                : 'Hướng dẫn viên có nhiệt tình, chuyên nghiệp không? Kiến thức có phong phú không?'}
              className="rv-textarea"
            />
            <span className="rv-char-count">
              {comment.length}/500 ký tự {comment.length < 10 && comment.length > 0 && '(tối thiểu 10)'}
            </span>
          </div>

          <div className="rv-actions">
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting} disabled={comment.trim().length < 10}>
              Gửi đánh giá
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
