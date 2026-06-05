import React, { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface ReportModalProps {
  targetType: 'tour' | 'companion_post' | 'user' | 'guide_profile';
  targetId: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ targetType, targetId, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const reasons = [
    'Nội dung không phù hợp',
    'Spam/Quảng cáo',
    'Lừa đảo/Giả mạo',
    'Ngôn từ gây thù ghét',
    'Lý do khác'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.warning('Vui lòng chọn lý do báo cáo');
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = {
        target_type: targetType,
        reason,
        description
      };

      if (targetType === 'tour') payload.tour_id = targetId;
      if (targetType === 'companion_post') payload.companion_post_id = targetId;
      if (targetType === 'user') payload.reported_user_id = targetId;
      if (targetType === 'guide_profile') payload.guide_profile_id = targetId;

      await api.post('/reports', payload);
      toast.success('Đã gửi báo cáo. Chúng tôi sẽ xem xét sớm nhất có thể.');
      onClose();
    } catch (error) {
      toast.error('Gửi báo cáo thất bại. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 'var(--tc-spacing-4)'
    }}>
      <div style={{
        backgroundColor: 'var(--tc-bg-default)',
        padding: 'var(--tc-spacing-6)',
        borderRadius: 'var(--tc-radius-lg)',
        width: '100%',
        maxWidth: '500px',
        boxShadow: 'var(--tc-shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--tc-spacing-5)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--tc-font-size-xl)' }}>Báo cáo vi phạm</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--tc-spacing-2)', fontWeight: 500 }}>Lý do báo cáo</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--tc-spacing-2) var(--tc-spacing-3)',
                borderRadius: 'var(--tc-radius-md)',
                border: '1px solid var(--tc-border)'
              }}
              required
            >
              <option value="">-- Chọn lý do --</option>
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--tc-spacing-2)', fontWeight: 500 }}>Mô tả chi tiết (không bắt buộc)</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vui lòng cung cấp thêm chi tiết để chúng tôi xử lý nhanh hơn..."
              style={{
                width: '100%',
                padding: 'var(--tc-spacing-2) var(--tc-spacing-3)',
                borderRadius: 'var(--tc-radius-md)',
                border: '1px solid var(--tc-border)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: 'var(--tc-spacing-2) var(--tc-spacing-5)',
                borderRadius: 'var(--tc-radius-md)',
                border: '1px solid var(--tc-border)',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              style={{
                padding: 'var(--tc-spacing-2) var(--tc-spacing-6)',
                borderRadius: 'var(--tc-radius-md)',
                border: 'none',
                backgroundColor: 'var(--tc-danger)',
                color: 'white',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
