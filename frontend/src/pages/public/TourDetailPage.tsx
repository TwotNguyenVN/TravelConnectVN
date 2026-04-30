import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { getTourAccommodations } from '../../services/accommodationService';
import favoriteService from '../../services/favoriteService';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import './TourDetailPage.css';

// Lazy load heavy components
const TourMap = lazy(() => import('../../components/tours/TourMap').then(module => ({ default: module.TourMap })));
const TourCalendar = lazy(() => import('../../components/tour/TourCalendar/TourCalendar').then(module => ({ default: module.TourCalendar })));

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
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

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
          const tourData = detailRes.data;
          setTour({
            ...tourData,
            reviews: reviewsRes?.data?.data || [],
          });

          // Auto-select the nearest upcoming schedule
          if (tourData.schedules && tourData.schedules.length > 0) {
            const sortedSchedules = [...tourData.schedules].sort((a, b) => 
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            setSelectedSchedule(sortedSchedules[0]);
          }

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

  const handleBooking = () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để đặt tour");
      navigate('/login');
      return;
    }

    if (tour.schedules?.length > 0 && !selectedSchedule) {
      toast.warning("Vui lòng chọn ngày khởi hành trên lịch");
      const calendarEl = document.getElementById('tour-calendar-section');
      if (calendarEl) calendarEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    let url = `/tours/${tour.id}/booking?participants=${participantCount}`;
    if (selectedSchedule) {
      url += `&scheduleId=${selectedSchedule.id}`;
    }
    navigate(url);
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
      <div className="tc-tour-detail">
        <div className="tc-skeleton-breadcrumb"></div>
        <div className="tc-skeleton-title"></div>
        <div className="tc-skeleton-meta"></div>
        <div className="tc-skeleton-gallery"></div>
        <div className="tc-tour-layout">
          <div className="tc-skeleton-main"></div>
          <div className="tc-skeleton-sidebar"></div>
        </div>
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
          <img src={tour.images[activeImageIndex]} alt={tour.title} key={activeImageIndex} loading="lazy" />
        </div>
        <div className="tc-gallery-thumbnails">
          {tour.images.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className={`tc-thumbnail-item ${activeImageIndex === idx ? 'tc-thumbnail-item--active' : ''}`}
              onClick={() => setActiveImageIndex(idx)}
            >
              <img src={img} alt={`${tour.title} thumbnail ${idx + 1}`} loading="lazy" />
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
                  <Suspense fallback={<div className="tc-loader" style={{margin: '40px auto'}}></div>}>
                    <TourCalendar 
                      schedules={tour.schedules} 
                      onDateSelect={(s) => setSelectedSchedule(s)} 
                    />
                  </Suspense>
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
                  <span>📍</span> Điểm Tập trung
                </h2>
                <div className="tc-feature-grid">
                  <div className="tc-feature-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gridColumn: 'span 1', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="tc-feature-label">Tên điểm tập trung</span>
                      <span className="tc-feature-value" style={{ fontSize: '1.2rem', fontWeight: '800' }}>{tour.meetPoint}</span>
                    </div>
                    {tour.googleMapsLink && (
                      <a 
                        href={tour.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="tc-btn-view-location"
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#006ce4',
                          color: 'white',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '700',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(0, 108, 228, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        📍 Xem vị trí
                      </a>
                    )}
                  </div>
                </div>

                {tour.meetAddress && (
                  <div className="tc-meet-info">
                    <strong>Địa chỉ tập trung:</strong> {tour.meetAddress}
                    {tour.meetTime && <p style={{ marginTop: '4px', marginBottom: 0 }}><strong>Giờ tập trung:</strong> {tour.meetTime}</p>}
                  </div>
                )}
              </div>

              {/* Accordion Itinerary moved here */}
              <div className="tc-detail-section">
                <h2 className="tc-section-title">
                  <span>📍</span> Lịch trình chi tiết
                </h2>
                <div className="tc-itinerary-accordion" style={{ marginTop: '20px' }}>
                  {tour.itinerary?.length > 0 ? (
                    tour.itinerary.map((item: any) => (
                      <div key={item.day} className="tc-accordion-item" style={{ marginBottom: '12px' }}>
                        <div 
                          className="tc-accordion-header" 
                          onClick={() => toggleDay(item.day)}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '16px 20px', 
                            background: expandedDays[item.day] ? '#fff' : '#f8fafc', 
                            borderRadius: expandedDays[item.day] ? '12px 12px 0 0' : '12px',
                            cursor: 'pointer',
                            border: expandedDays[item.day] ? '2px solid var(--tc-primary)' : '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            boxShadow: expandedDays[item.day] ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '16px', color: expandedDays[item.day] ? 'var(--tc-primary)' : '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                background: expandedDays[item.day] ? 'var(--tc-primary)' : '#cbd5e1', 
                                color: 'white', 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '12px' 
                              }}>
                                {item.day}
                              </span>
                              Ngày {item.day}: {item.title}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '13px', color: '#64748b', paddingLeft: '32px' }}>
                              {(item.hasBreakfast || item.hasLunch || item.hasDinner) && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  🍴 {[item.hasBreakfast && 'Sáng', item.hasLunch && 'Trưa', item.hasDinner && 'Tối'].filter(Boolean).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '20px', 
                            transition: 'transform 0.3s', 
                            transform: expandedDays[item.day] ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: expandedDays[item.day] ? 'var(--tc-primary)' : '#64748b'
                          }}>
                            ▼
                          </span>
                        </div>
                        
                        {expandedDays[item.day] && (
                          <div className="tc-accordion-content" style={{ 
                            padding: '24px', 
                            background: 'white', 
                            border: '2px solid var(--tc-primary)', 
                            borderTop: 'none',
                            borderRadius: '0 0 12px 12px',
                            animation: 'slideDown 0.3s ease-out'
                          }}>
                            <p className="tc-itinerary-detail" style={{ margin: 0, color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{item.detail}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                              {item.accommodation && (
                                <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '18px' }}>🏨</span> <strong>Nghỉ đêm:</strong> {item.accommodation}
                                </div>
                              )}
                              
                              {item.highlight && (
                                <div style={{ fontSize: '14px', color: 'var(--tc-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '18px' }}>⭐</span> <strong>Chú Ý:</strong> {item.highlight}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
                      Lịch trình chi tiết đang được cập nhật...
                    </p>
                  )}
                </div>
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
              <Suspense fallback={<div className="tc-loader" style={{margin: '40px auto'}}></div>}>
                <TourMap points={tour.destinations || []} fallbackPoints={tour.itinerary || []} />
              </Suspense>
              
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
                          src={review.avatar || DEFAULT_AVATAR} 
                          alt="Avatar" 
                          loading="lazy"
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
              <img 
                src={tour.guide?.avatar || DEFAULT_AVATAR} 
                alt={tour.guide?.name} 
                className="tc-guide-avatar" 
                loading="lazy" 
              />
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
