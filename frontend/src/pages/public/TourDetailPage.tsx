import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { tourService } from '../../services/tourService';

export const TourDetailPage: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [detailData, reviewsData] = await Promise.all([
          tourService.getTourDetail(id),
          tourService.getTourReviews(id),
        ]);
        setTour({
          ...detailData,
          reviews: reviewsData.data,
        });
      } catch (error) {
        console.error('Error fetching tour data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'var(--tc-primary)' }}>
        Đang tải thông tin chi tiết tour...
      </div>
    );
  }

  if (!tour) {
    return (
      <div style={{ padding: 'var(--tc-spacing-10) var(--tc-spacing-5)', textAlign: 'center' }}>
        <h2>Không tìm thấy tour này</h2>
        <Link to="/tours" style={{ color: 'var(--tc-primary)' }}>Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--tc-spacing-6) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-4)' }}>
        <Link to="/" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}>Trang chủ</Link> / 
        <Link to="/tours" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}> Danh sách Tour</Link> / Chi tiết
      </div>

      {/* Header Info */}
      <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: '0 0 var(--tc-spacing-2) 0', color: 'var(--tc-text-primary)' }}>{tour.title}</h1>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', alignItems: 'center' }}>
          <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold' }}>★ {tour.rating} ({tour.reviewsCount} đánh giá)</span>
          <span>📍 {tour.location}</span>
          <span>🏷 {tour.category}</span>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--tc-spacing-3)', marginBottom: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', overflow: 'hidden', height: '400px' }}>
        <img src={tour.images[0]} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
          <img src={tour.images[1]} alt="Gallery 1" style={{ width: '100%', height: 'calc(50% - 6px)', objectFit: 'cover' }} />
          <img src={tour.images[2]} alt="Gallery 2" style={{ width: '100%', height: 'calc(50% - 6px)', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--tc-spacing-6)', alignItems: 'flex-start' }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 'var(--tc-spacing-4)', borderBottom: '1px solid var(--tc-border)', marginBottom: 'var(--tc-spacing-5)' }}>
            <button onClick={() => setActiveTab('overview')} style={{ padding: 'var(--tc-spacing-3) 0', border: 'none', background: 'none', fontSize: 'var(--tc-font-size-md)', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', color: activeTab === 'overview' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', borderBottom: activeTab === 'overview' ? '2px solid var(--tc-primary)' : '2px solid transparent', cursor: 'pointer' }}>Tổng quan</button>
            <button onClick={() => setActiveTab('itinerary')} style={{ padding: 'var(--tc-spacing-3) 0', border: 'none', background: 'none', fontSize: 'var(--tc-font-size-md)', fontWeight: activeTab === 'itinerary' ? 'bold' : 'normal', color: activeTab === 'itinerary' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', borderBottom: activeTab === 'itinerary' ? '2px solid var(--tc-primary)' : '2px solid transparent', cursor: 'pointer' }}>Lịch trình</button>
            <button onClick={() => setActiveTab('reviews')} style={{ padding: 'var(--tc-spacing-3) 0', border: 'none', background: 'none', fontSize: 'var(--tc-font-size-md)', fontWeight: activeTab === 'reviews' ? 'bold' : 'normal', color: activeTab === 'reviews' ? 'var(--tc-primary)' : 'var(--tc-text-secondary)', borderBottom: activeTab === 'reviews' ? '2px solid var(--tc-primary)' : '2px solid transparent', cursor: 'pointer' }}>Đánh giá</button>
          </div>

          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-3)' }}>Điểm nhấn hành trình</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-6)' }}>{tour.description}</p>
              
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-3)' }}>Thông tin quan trọng</h2>
              <ul style={{ color: 'var(--tc-text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Thời gian:</strong> {tour.duration}</li>
                <li><strong>Điểm hẹn:</strong> {tour.meetPoint}</li>
                <li><strong>Số lượng tối đa:</strong> {tour.maxParticipants} người</li>
              </ul>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-4)' }}>Lịch trình chi tiết</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
                {tour.itinerary.map(day => (
                  <div key={day.day} style={{ borderLeft: '2px solid var(--tc-border)', paddingLeft: 'var(--tc-spacing-4)', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-9px', top: 0, width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--tc-primary)' }}></div>
                    <h3 style={{ margin: '0 0 var(--tc-spacing-2) 0', fontSize: 'var(--tc-font-size-md)' }}>Ngày {day.day}: {day.title}</h3>
                    <p style={{ margin: 0, color: 'var(--tc-text-secondary)', lineHeight: 1.6 }}>{day.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-4)' }}>Đánh giá từ khách hàng ({tour.reviewsCount})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
                {tour.reviews.map(review => (
                  <Card key={review.id} style={{ padding: 'var(--tc-spacing-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--tc-spacing-2)' }}>
                      <strong style={{ color: 'var(--tc-text-primary)' }}>{review.user}</strong>
                      <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>{review.date}</span>
                    </div>
                    <div style={{ color: 'var(--tc-warning)', marginBottom: 'var(--tc-spacing-2)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    <p style={{ margin: 0, color: 'var(--tc-text-secondary)' }}>{review.comment}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '100px' }}>
          <Card style={{ padding: 'var(--tc-spacing-5)', border: '1px solid var(--tc-border)' }}>
            <div style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 'bold', color: 'var(--tc-danger)', marginBottom: 'var(--tc-spacing-2)' }}>
              {tour.price.toLocaleString()}đ <span style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', fontWeight: 'normal' }}>/ khách</span>
            </div>
            <div style={{ marginBottom: 'var(--tc-spacing-4)', color: 'var(--tc-text-secondary)', fontSize: 'var(--tc-font-size-sm)' }}>
              Không bao gồm VAT. Nhận hủy miễn phí trước 2 ngày.
            </div>
            
            <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--tc-font-size-sm)', fontWeight: 'bold', marginBottom: 'var(--tc-spacing-2)' }}>Chọn ngày đi</label>
              <input type="date" style={{ width: '100%', padding: 'var(--tc-spacing-2)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)' }} />
            </div>

            <Button variant="primary" style={{ width: '100%', marginBottom: 'var(--tc-spacing-3)', padding: 'var(--tc-spacing-3)' }}>
              Gửi yêu cầu tham gia
            </Button>
            <Button variant="outline" style={{ width: '100%', padding: 'var(--tc-spacing-2)' }}>
              Lưu vào danh sách yêu thích
            </Button>
          </Card>

          <Card style={{ padding: 'var(--tc-spacing-5)', border: '1px solid var(--tc-border)', marginTop: 'var(--tc-spacing-5)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-md)', marginTop: 0, marginBottom: 'var(--tc-spacing-3)' }}>Hướng dẫn viên</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-3)', marginBottom: 'var(--tc-spacing-3)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--tc-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-success)', fontSize: 'var(--tc-font-size-lg)', fontWeight: 'bold' }}>
                {tour.guide.avatar}
              </div>
              <div>
                <strong style={{ display: 'block' }}>{tour.guide.name}</strong>
                <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>Kinh nghiệm: {tour.guide.exp}</span>
              </div>
            </div>
            <p style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', margin: 0, fontStyle: 'italic' }}>
              "{tour.guide.bio}"
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};
