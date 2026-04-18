import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--tc-bg-subtle)',
      borderTop: '1px solid var(--tc-border)',
      padding: 'var(--tc-spacing-6) var(--tc-spacing-5) var(--tc-spacing-4)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--tc-spacing-5)',
        marginBottom: 'var(--tc-spacing-6)'
      }}>
        <div>
          <h3 style={{ color: 'var(--tc-primary)', marginBottom: 'var(--tc-spacing-3)' }}>TravelConnect</h3>
          <p style={{ fontSize: 'var(--tc-font-size-sm)' }}>
            Nền tảng kết nối du lịch thông minh, giúp bạn tìm kiếm hướng dẫn viên địa phương và bạn đồng hành cho mỗi chuyến đi.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--tc-spacing-3)' }}>Về chúng tôi</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/about" style={{ color: 'var(--tc-text-secondary)' }}>Giới thiệu</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/careers" style={{ color: 'var(--tc-text-secondary)' }}>Tuyển dụng</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/contact" style={{ color: 'var(--tc-text-secondary)' }}>Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--tc-spacing-3)' }}>Khám phá</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/tours" style={{ color: 'var(--tc-text-secondary)' }}>Tất cả Tour</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/guides" style={{ color: 'var(--tc-text-secondary)' }}>Hướng dẫn viên</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/companions" style={{ color: 'var(--tc-text-secondary)' }}>Tìm bạn đồng hành</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: 'var(--tc-spacing-3)' }}>Chính sách</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--tc-font-size-sm)' }}>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/terms" style={{ color: 'var(--tc-text-secondary)' }}>Điều khoản sử dụng</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/privacy" style={{ color: 'var(--tc-text-secondary)' }}>Bảo mật thông tin</Link></li>
            <li style={{ marginBottom: 'var(--tc-spacing-2)' }}><Link to="/refund" style={{ color: 'var(--tc-text-secondary)' }}>Chính sách hoàn tiền</Link></li>
          </ul>
        </div>
      </div>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '1px solid var(--tc-border)',
        paddingTop: 'var(--tc-spacing-4)',
        fontSize: 'var(--tc-font-size-sm)',
        color: 'var(--tc-text-disabled)'
      }}>
        © 2026 TravelConnectVN. All rights reserved.
      </div>
    </footer>
  );
};
