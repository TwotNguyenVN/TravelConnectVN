import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import api from '../../services/api';

export const WalletVnpayReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Đang xử lý kết quả nạp tiền ví...');

  useEffect(() => {
    async function processReturn() {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const vnp_Amount = searchParams.get('vnp_Amount');

      if (!vnp_ResponseCode) {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin giao dịch.');
        return;
      }

      if (vnp_ResponseCode === '00') {
        setStatus('success');
        setMessage(`Nạp tiền vào ví thành công giao dịch mã ${vnp_TxnRef}. Số tiền: ${Number(vnp_Amount) / 100}đ`);
        try {
          await api.get(`/wallet/vnpay-ipn${window.location.search}`);
        } catch(e) {
           console.error("IPN Trigger failed", e);
        }
      } else {
        setStatus('failed');
        setMessage(`Nạp tiền thất bại hoặc đã bị hủy (Mã lỗi: ${vnp_ResponseCode})`);
      }
    };

    processReturn();
  }, [searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ padding: 'var(--tc-spacing-8)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        {status === 'loading' && (
          <div>
            <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--tc-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto var(--tc-spacing-4)' }} />
            <h2>Đang xử lý</h2>
            <p style={{ color: 'var(--tc-text-secondary)' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--tc-success-bg)', color: 'var(--tc-success)', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--tc-spacing-4)' }}>✓</div>
            <h2 style={{ color: 'var(--tc-success)' }}>Nạp Tiền Thành Công!</h2>
            <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)', lineHeight: 1.6 }}>{message}</p>
            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => navigate('/user/wallet')}>Quay lại Ví của tôi</Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fff5f5', color: 'var(--tc-danger)', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--tc-spacing-4)' }}>✕</div>
            <h2 style={{ color: 'var(--tc-danger)' }}>Nạp Tiền Thất Bại</h2>
            <p style={{ color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)' }}>{message}</p>
            <div style={{ display: 'flex', gap: 'var(--tc-spacing-3)', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => navigate('/user/wallet')}>Quay lại Ví của tôi</Button>
            </div>
          </div>
        )}
      </Card>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
