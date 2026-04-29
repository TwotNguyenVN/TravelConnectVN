import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { getTourAccommodations } from '../../services/accommodationService';
import favoriteService from '../../services/favoriteService';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { TourMap } from '../../components/tours/TourMap';
import { TourCalendar } from '../../components/tour/TourCalendar/TourCalendar';
import './TourDetailPage.css';

export const TourDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'map' | 'reviews'>('overview');
  const [tour, setTour] = useState<any>(null);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [bookingNote, setBookingNote] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  // Gallery Carousel State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // Parallelize all primary requests to avoid waterfall loading
        const [detailRes, reviewsRes, accRes, favRes]: [any, any, any, any] = await Promise.all([
          tourService.getTourDetail(id),
          tourService.getTourReviews(id),
          getTourAccommodations(id),
          user ? favoriteService.checkIsFavorite(id) : Promise.resolve({ success: true, data: false })
        ]);
        
        if (detailRes.success && detailRes.data) {
          setTour({
            ...detailRes.data,
            reviews: reviewsRes?.data?.data || [],
          });

          if (accRes.success) {
            setAccommodations(accRes.data || []);
          }

          if (user && favRes.success) {
            setIsFavorited(favRes.data || false);
          }
        }
      } catch (error) {
        console.error('Error fetching tour data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
    window.scrollTo(0, 0);
  }, [id, user]);

  // Auto-slide effect for gallery
  useEffect(() => {
    if (tour && tour.images && tour.images.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % tour.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [tour]);

  const handleBooking = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để đặt tour");
      navigate('/login');
      return;
    }

    try {
      setIsBooking(true);
      
      if (tour.schedules?.length > 0 && !selectedSchedule) {
        toast.warning("Vui lòng chọn ngày khởi hành trên lịch");
        // Scroll to calendar section
        const calendarEl = document.getElementById('tour-calendar-section');
        if (calendarEl) calendarEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      await tourRequestService.createRequest({
        tourId: tour.id,
        scheduleId: selectedSchedule?.id,
        participantCount: participantCount,
        note: bookingNote || `Yêu cầu tham gia tour ${tour.title}${selectedSchedule ? ` ngày ${formatDate(selectedSchedule.startDate)}` : ''}`
      });
      toast.success("Yêu cầu của bạn đã được gửi thành công. Hướng dẫn viên sẽ sớm phản hồi!");
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.";
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };
  
  const handleChat = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để trò chuyện");
      navigate('/login');
      return;
    }
    
    try {
      toast.info("Đang kết nối với hướng dẫn viên...");
      const res = await chatService.createDirect(tour.guideId, tour.id);
      if (res.success && res.data) {
        navigate('/user/messages', { state: { conversationId: res.data.id } });
      } else {
        toast.error("Không thể tạo cuộc trò chuyện");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Có lỗi xảy ra khi kết nối");
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để lưu vào yêu thích");
      navigate('/login');
      return;
    }

    try {
      setIsTogglingFavorite(true);
      if (isFavorited) {
        await favoriteService.removeTourFavorite(tour.id);
        setIsFavorited(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await favoriteService.addTourFavorite(tour.id);
        setIsFavorited(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error: any) {
      console.error("Favorite error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="tc-loading-container">
        <div className="tc-loader"></div>
        <p>Đang chuẩn bị hành trình cho bạn...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tc-not-found">
        <h2>Hành trình không tồn tại</h2>
        <p>Có vẻ như đường dẫn này đã cũ hoặc tour đã bị gỡ bỏ.</p>
        <Link to="/tours" className="tc-btn-back">Khám phá các tour khác</Link>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return 'Linh hoạt';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="tc-tour-detail">
      {/* Breadcrumb */}
      <nav className="tc-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/tours">Danh sách Tour</Link>
        <span>/</span>
        <span>Chi tiết</span>
      </nav>

      {/* Header */}
      <header className="tc-tour-header">
        <h1 className="tc-tour-title">{tour.title}</h1>
        <div className="tc-tour-meta">
          <div className="tc-rating-badge">
            <span style={{ color: '#f59e0b' }}>★</span>
            <span className="tc-rating-value">{(tour.rating && Number(tour.rating) > 0) ? Number(tour.rating).toFixed(1) : '0'}</span>
            <span className="tc-review-count">({tour.reviewsCount || 0} đánh giá)</span>
          </div>
          <div className="tc-meta-item">
            <span>📍 {tour.location}</span>
          </div>
          <div className="tc-meta-item">
            <span>🏷 {tour.category}</span>
          </div>
        </div>
      </header>

      {/* Gallery Carousel - Re-ordered to top */}
      <section className="tc-tour-gallery-container">
        <div className="tc-gallery-main-frame">
          <img src={tour.images[activeImageIndex]} alt={tour.title} key={activeImageIndex} />
        </div>
        <div className="tc-gallery-thumbnails">
          {tour.images.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className={`tc-thumbnail-item ${activeImageIndex === idx ? 'tc-thumbnail-item--active' : ''}`}
              onClick={() => setActiveImageIndex(idx)}
            >
              <img src={img} alt={`${tour.title} thumbnail ${idx + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="tc-tour-layout">
        {/* Main Content */}
        <div className="tc-tour-main">
          <nav className="tc-tour-tabs">
            <button 
              className={`tc-tab-btn ${activeTab === 'overview' ? 'tc-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button 
              className={`tc-tab-btn ${activeTab === 'itinerary' ? 'tc-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Lịch trình
            </button>
            <button 
              className={`tc-tab-btn ${activeTab === 'map' ? 'tc-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              Bản đồ
            </button>
            <button 
              className={`tc-tab-btn ${activeTab === 'reviews' ? 'tc-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá
            </button>
          </nav>

          {activeTab === 'overview' && (
            <div className="tc-tab-content">
              <div className="tc-detail-section">
                <h2 className="tc-section-title">
                  <span>✨</span> Điểm nhấn hành trình
                </h2>
                <div className="tc-description">{tour.description}</div>
              </div>

              {tour.schedules?.length > 0 && (
                <div className="tc-detail-section" id="tour-calendar-section">
                  <h2 className="tc-section-title">
                    <span>📅</span> Lịch khởi hành
                  </h2>
                  <TourCalendar 
                    schedules={tour.schedules} 
                    onDateSelect={(s) => setSelectedSchedule(s)} 
                  />
                  {selectedSchedule && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #006ce4' }}>
                      <strong>Bạn đã chọn ngày:</strong> {formatDate(selectedSchedule.startDate)} 
                      <span style={{ marginLeft: '12px' }}><strong>Giá:</strong> {selectedSchedule.price.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>
              )}

              <div className="tc-detail-section">
                <h2 className="tc-section-title">
                  <span>📋</span> Thông tin chi tiết
                </h2>
                <div className="tc-feature-grid">
                  <div className="tc-feature-card">
                    <span className="tc-feature-label">Thời gian</span>
                    <span className="tc-feature-value">{tour.duration}</span>
                  </div>
                  <div className="tc-feature-card">
                    <span className="tc-feature-label">Khởi hành</span>
                    <span className="tc-feature-value">{formatDate(tour.startDate)}</span>
                  </div>
                  <div className="tc-feature-card">
                    <span className="tc-feature-label">Tối đa</span>
                    <span className="tc-feature-value">{tour.maxParticipants} khách</span>
                  </div>
                  <div className="tc-feature-card">
                    <span className="tc-feature-label">Điểm hẹn</span>
                    <span className="tc-feature-value">{tour.meetPoint}</span>
                  </div>
                </div>

                {tour.meetAddress && (
                  <div className="tc-meet-info">
                    <strong>Địa chỉ tập trung:</strong> {tour.meetAddress}
                    {tour.meetTime && <p style={{ marginTop: '4px', marginBottom: 0 }}><strong>Giờ tập trung:</strong> {tour.meetTime}</p>}
                  </div>
                )}
              </div>

              {tour.participantRequirements && (
                <div className="tc-detail-section">
                  <h2 className="tc-section-title">
                    <span>⚠️</span> Lưu ý quan trọng
                  </h2>
                  <div className="tc-description">{tour.participantRequirements}</div>
                </div>
              )}

              {accommodations.length > 0 && (
                <div className="tc-detail-section">
                  <h2 className="tc-section-title">
                    <span>🏨</span> Nơi lưu trú dự kiến
                  </h2>
                  <div className="tc-accommodation-list">
                    {accommodations.map((acc: any) => (
                      <div key={acc.id} className="tc-accommodation-item">
                        <div className="tc-accommodation-name">{acc.name}</div>
                        <div className="tc-accommodation-address">{acc.address}</div>
                        <div className="tc-accommodation-tags">
                          <span className="tc-accommodation-type">{acc.type}</span>
                          {acc.stars && <span className="tc-accommodation-stars">{'★'.repeat(acc.stars)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="tc-tab-content">
              <h2 className="tc-section-title">
                <span>📍</span> Lịch trình chi tiết
              </h2>
              <div className="tc-itinerary-timeline">
                {tour.itinerary?.length > 0 ? (
                  tour.itinerary.map((item: any) => (
                    <div key={item.day} className="tc-itinerary-item">
                      <div className="tc-itinerary-content">
                        <div className="tc-itinerary-header">
                          <div className="tc-day-badge">
                            <span className="tc-day-label">Ngày</span>
                            <span className="tc-day-number">{item.day}</span>
                          </div>
                          <h3 className="tc-itinerary-title">{item.title}</h3>
                        </div>
                        <p className="tc-itinerary-detail">{item.detail}</p>
                        
                        {(item.hasBreakfast || item.hasLunch || item.hasDinner) && (
                          <div className="tc-itinerary-meals" style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '13px' }}>
                            {item.hasBreakfast && <span>🍳 Sáng</span>}
                            {item.hasLunch && <span>🍲 Trưa</span>}
                            {item.hasDinner && <span>🍱 Tối</span>}
                          </div>
                        )}

                        {item.accommodation && (
                          <div className="tc-itinerary-extra" style={{ marginTop: '12px', fontSize: '14px', color: 'var(--tc-text-secondary)' }}>
                            <strong>🏨 Nghỉ đêm:</strong> {item.accommodation}
                          </div>
                        )}

                        {item.highlight && (
                          <div className="tc-itinerary-extra" style={{ marginTop: '8px', fontSize: '14px', color: 'var(--tc-primary)', fontWeight: '500' }}>
                            <strong>⭐ Highlight:</strong> {item.highlight}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Lịch trình chi tiết đang được cập nhật...</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="tc-tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="tc-section-title" style={{ margin: 0 }}>
                  <span>🗺️</span> Lộ trình trên bản đồ
                </h2>
                {tour.routeMapLink && (
                  <a 
                    href={tour.routeMapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="tc-btn tc-btn-outline"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'var(--tc-primary)',
                      border: '1px solid var(--tc-primary)',
                      fontWeight: '600'
                    }}
                  >
                    <span>🧭</span> Xem toàn bộ hành trình trên Google Maps
                  </a>
                )}
              </div>
              <TourMap points={tour.destinations || []} fallbackPoints={tour.itinerary || []} />
              
              <div className="tc-map-itinerary-steps" style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--tc-primary)' }}>📍</span> Trình tự các điểm đến
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {tour.destinations?.length > 0 ? (
                    tour.destinations.map((item: any) => (
                      <div key={item.id} className="tc-itinerary-card" style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          background: 'linear-gradient(135deg, var(--tc-primary) 0%, #0056b3 100%)', 
                          color: 'white', 
                          borderRadius: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '800',
                          flexShrink: 0,
                          boxShadow: '0 4px 10px rgba(0, 108, 228, 0.2)'
                        }}>{item.sequenceNo}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>{item.address}</div>
                          {item.googleMapsLink && (
                            <a 
                              href={item.googleMapsLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ fontSize: '12px', color: 'var(--tc-primary)', marginTop: '4px', textDecoration: 'none', fontWeight: '500' }}
                            >
                              📍 Xem trên Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Thông tin các điểm đến đang được cập nhật...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tc-tab-content">
              <h2 className="tc-section-title">
                <span>💬</span> Đánh giá từ cộng đồng ({tour.reviewsCount || 0})
              </h2>
              <div className="tc-review-list">
                {tour.reviews?.length > 0 ? (
                  tour.reviews.map((review: any) => (
                    <div key={review.id} className="tc-review-item" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                      <div className="tc-review-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
                        <img 
                          src={review.avatar || 'https://via.placeholder.com/40'} 
                          alt="Avatar" 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong className="tc-review-author" style={{ fontSize: '15px', color: '#333' }}>
                            {review.user || 'Khách hàng'}
                          </strong>
                          <span className="tc-review-date" style={{ fontSize: '12px', color: '#777' }}>
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                      <div className="tc-review-stars" style={{ marginTop: '8px', color: '#f59e0b', fontSize: '14px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <p className="tc-review-comment" style={{ marginTop: '8px', color: '#555', lineHeight: '1.5' }}>
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Chưa có đánh giá nào cho hành trình này.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="tc-tour-sidebar">
          <div className="tc-booking-card">
            <div className="tc-price-section">
              <span className="tc-price-label">Giá:</span>
              <div className="tc-price-amount">
                {(selectedSchedule ? selectedSchedule.price : tour.price).toLocaleString()} <span className="currency-symbol">đ</span>
                <span className="tc-price-unit"> / Khách</span>
              </div>
            </div>

            <div className="tc-tour-info-list">
              <div className="tc-info-item">
                <span className="tc-info-icon">🎟️</span>
                <span className="tc-info-label">Mã tour:</span>
                <span className="tc-info-value tc-info-code">TC-{tour.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="tc-info-item">
                <span className="tc-info-icon">📍</span>
                <span className="tc-info-label">Khởi hành:</span>
                <span className="tc-info-value">{tour.location}</span>
              </div>
              <div className="tc-info-item">
                <span className="tc-info-icon">📅</span>
                <span className="tc-info-label">Ngày khởi hành:</span>
                <span className="tc-info-value">
                  {selectedSchedule ? formatDate(selectedSchedule.startDate) : 'Vui lòng chọn ngày'}
                </span>
              </div>
              <div className="tc-info-item">
                <span className="tc-info-icon">🕒</span>
                <span className="tc-info-label">Thời gian:</span>
                <span className="tc-info-value">{tour.numDays}N{tour.numNights}Đ</span>
              </div>
              <div className="tc-info-item">
                <span className="tc-info-icon">👥</span>
                <span className="tc-info-label">Số chỗ còn:</span>
                <span className="tc-info-value tc-info-slots">
                  {selectedSchedule ? selectedSchedule.remainingSlots : tour.maxParticipants}
                </span>
              </div>
            </div>

            <div className="tc-booking-actions">
              <button className="tc-btn-icon-only" onClick={handleChat} title="Chat với HDV">
                <span role="img" aria-label="chat">📝</span>
              </button>
              <button className="tc-btn-outline" onClick={() => document.getElementById('tour-calendar-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Ngày khác
              </button>
              <button 
                className="tc-btn-primary-red" 
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? '...' : 'Đặt ngay'}
              </button>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <button 
                className={`tc-btn-favorite-simple ${isFavorited ? 'active' : ''}`} 
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                style={{ width: '100%', background: 'none', border: 'none', color: isFavorited ? 'var(--tc-danger)' : '#64748b', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isFavorited ? '❤️ Đã lưu' : '🤍 Lưu vào yêu thích'}
              </button>
            </div>
          </div>

          <Link to={`/guides/${tour.guideId}`} className="tc-guide-card">
            <div className="tc-guide-header">
              {tour.guide?.avatar ? (
                <img src={tour.guide.avatar} alt={tour.guide.name} className="tc-guide-avatar" />
              ) : (
                <div className="tc-guide-avatar-placeholder">
                  {tour.guide?.name?.charAt(0) || 'G'}
                </div>
              )}
              <div className="tc-guide-info">
                <div className="tc-guide-name">{tour.guide?.name}</div>
                <div className="tc-guide-tag">Hướng dẫn viên địa phương</div>
                <div className="tc-guide-rating">
                  ⭐ {tour.guide?.rating?.toFixed(1) || '5.0'}
                </div>
              </div>
            </div>
            <div className="tc-guide-exp">
              🎖 {tour.guide?.exp} kinh nghiệm
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default TourDetailPage;
