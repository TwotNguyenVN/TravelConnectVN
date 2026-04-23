import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { tourService } from '../../services/tourService';
import { getTourAccommodations } from '../../services/accommodationService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';


export const TourDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast: _toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [tour, setTour] = useState<any>(null);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch tour details and reviews
        const [detailRes, reviewsRes]: [any, any] = await Promise.all([
          tourService.getTourDetail(id),
          tourService.getTourReviews(id),
        ]);
        
        if (detailRes.success && detailRes.data) {
          setTour({
            ...detailRes.data,
            reviews: reviewsRes?.data?.data || [],
          });

          // Fetch accommodations
          try {
            const accRes = await getTourAccommodations(id);
            if (accRes.success) {
              setAccommodations(accRes.data || []);
            }
          } catch (e) {
            console.error('Error fetching accommodations:', e);
          }

          // If user logged in, fetch their requests for this tour
          if (user) {
            try {
              // This is a placeholder, adjust based on actual service if needed
              // Assuming tourService or tourRequestService has getMyRequests
            } catch (e) {}
          }
        }
      } catch (error) {
        console.error('Error fetching tour data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id, user]);



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
          <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold' }}>★ {tour.rating || 5.0} ({tour.reviewsCount || 0} đánh giá)</span>
          <span>📍 {tour.location || tour.province}</span>
          <span>🏷 {tour.category?.name || tour.category}</span>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--tc-spacing-3)', marginBottom: 'var(--tc-spacing-6)', borderRadius: 'var(--tc-radius-lg)', overflow: 'hidden', height: '400px' }}>
        <img src={tour.images?.[0] || 'https://images.unsplash.com/photo-1528127269322-539801943592'} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
          <img src={tour.images?.[1] || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'} alt="Gallery 1" style={{ width: '100%', height: 'calc(50% - 6px)', objectFit: 'cover' }} />
          <img src={tour.images?.[2] || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'} alt="Gallery 2" style={{ width: '100%', height: 'calc(50% - 6px)', objectFit: 'cover' }} />
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
              <ul style={{ color: 'var(--tc-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--tc-spacing-6)' }}>
                <li><strong>Thời gian:</strong> {tour.duration || 'Nhiều ngày'}</li>
                <li><strong>Điểm hẹn:</strong> {tour.meetPoint || tour.province}</li>
                <li><strong>Số lượng tối đa:</strong> {tour.maxParticipants || 10} người</li>
              </ul>

              {/* M14 - Accommodations List */}
              {accommodations.length > 0 && (
                <div style={{ marginTop: 'var(--tc-spacing-6)', padding: 'var(--tc-spacing-5)', background: '#f8fafc', borderRadius: 'var(--tc-radius-lg)', border: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-4)', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="bi bi-building"></i> Nơi lưu trú dự kiến
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-4)' }}>
                    {accommodations.map((acc, index) => (
                      <Card key={acc.id || index} style={{ padding: 'var(--tc-spacing-3)', border: '1px solid #e2e8f0', transition: 'transform 0.2s', cursor: 'default' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--tc-primary)', marginBottom: '4px' }}>{acc.name}</div>
                        <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', marginBottom: '8px' }}>
                          <i className="bi bi-geo-alt"></i> {acc.address}, {acc.province}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontSize: 'var(--tc-font-size-xs)' }}>
                          <span style={{ padding: '2px 8px', background: '#ecfdf5', color: '#059669', borderRadius: '10px' }}>{acc.type}</span>
                          {acc.stars && <span style={{ color: '#f59e0b' }}>{'★'.repeat(acc.stars)}</span>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-4)' }}>Lịch trình chi tiết</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
                {tour.itinerary?.map((day: any) => (
                  <div key={day.day} style={{ borderLeft: '2px solid var(--tc-border)', paddingLeft: 'var(--tc-spacing-4)', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-9px', top: 0, width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--tc-primary)' }}></div>
                    <h3 style={{ margin: '0 0 var(--tc-spacing-2) 0', fontSize: 'var(--tc-font-size-md)' }}>Ngày {day.day}: {day.title}</h3>
                    <p style={{ margin: 0, color: 'var(--tc-text-secondary)', lineHeight: 1.6 }}>{day.detail}</p>
                  </div>
                )) || <p>Chưa cập nhật lịch trình.</p>}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginBottom: 'var(--tc-spacing-4)' }}>Đánh giá từ khách hàng ({tour.reviewsCount || 0})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-4)' }}>
                {tour.reviews?.map((review: any) => (
                  <Card key={review.id} style={{ padding: 'var(--tc-spacing-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--tc-spacing-2)' }}>
                      <strong style={{ color: 'var(--tc-text-primary)' }}>{review.user?.full_name || 'Người dùng'}</strong>
                      <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ color: 'var(--tc-warning)', marginBottom: 'var(--tc-spacing-2)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    <p style={{ margin: 0, color: 'var(--tc-text-secondary)' }}>{review.comment}</p>
                  </Card>
                )) || <p>Chưa có đánh giá nào.</p>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '100px' }}>
          <Card style={{ padding: 'var(--tc-spacing-5)', border: '1px solid var(--tc-border)' }}>
            <div style={{ fontSize: 'var(--tc-font-size-2xl)', fontWeight: 'bold', color: 'var(--tc-danger)', marginBottom: 'var(--tc-spacing-2)' }}>
              {Number(tour.price || 0).toLocaleString()}đ <span style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', fontWeight: 'normal' }}>/ khách</span>
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
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-lg)', fontWeight: 'bold' }}>
                {tour.guide?.full_name?.charAt(0) || 'G'}
              </div>
              <div>
                <strong style={{ display: 'block' }}>{tour.guide?.full_name || 'Đang cập nhật'}</strong>
                <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>HDV Địa phương</span>
              </div>
            </div>
            <p style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', margin: 0, fontStyle: 'italic' }}>
              "{tour.guide?.bio || 'Sẵn sàng đồng hành cùng bạn trên mọi nẻo đường.'}"
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default TourDetailPage;
