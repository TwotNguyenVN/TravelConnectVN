import React, { useState, useEffect } from 'react';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import './TourCard.css';

export interface TourCardProps {
  tour: any;
  onClick?: () => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onClick }) => {
  const tourCode = `TC-${tour.id.substring(0, 8).toUpperCase()}`;
  const remainingSlots = tour.remainingSlots !== undefined 
    ? tour.remainingSlots 
    : (tour.maxParticipants ? Math.floor(tour.maxParticipants * 0.4) : Math.floor(Math.random() * 5) + 3);
  
  // Timer Logic
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = tour.startDate ? new Date(tour.startDate) : (tour.start_date ? new Date(tour.start_date) : null);
      if (!targetDate) return { d: 0, h: 0, m: 0, s: 0 };
      
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      
      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [tour.startDate, tour.start_date]);

  const formatTime = (n: number) => n.toString().padStart(2, '0');
  
  // Image URL handling
  const imageUrl = tour.tour_images?.[0]?.image_url || tour.cover || tour.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80';

  return (
    <Card 
      onClick={onClick}
      className="tc-tour-card-premium"
      padding="none"
    >
      {/* Image Section */}
      <div className="tour-card-image-section">
        <img 
          src={imageUrl} 
          alt={tour.title} 
          className="tour-card-img"
        />
        
        {/* Wishlist Icon */}
        <div className="tour-card-wishlist">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>

        {/* Bottom Overlays */}
        <div className="tour-card-timer-overlay">
          <div className="timer-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Đếm ngược
          </div>
          <div className="timer-value">
            {timeLeft.d > 0 ? `${timeLeft.d}d ` : ''}{formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="tour-card-content-section">
        <h3 className="tour-card-title-text">
          {tour.title}
        </h3>

        <div className="tour-card-info-grid">
          {/* Tour Code */}
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9M2 15v3.8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V15M2 9c1.66 0 3 1.34 3 3s-1.34 3-3 3M22 9c-1.66 0-3 1.34-3 3s1.34 3 3 3M12 5v2M12 17v2M12 11v2"/>
            </svg>
            <span className="info-text font-bold">{tourCode}</span>
          </div>
          
          {/* Departure */}
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="info-text">Khởi hành: <span className="location-highlight">{tour.province || tour.location}</span></span>
          </div>

          {/* Departure Date */}
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="info-text">Ngày khởi hành: <span className="font-semibold">
              {tour.startDate ? new Date(tour.startDate).toLocaleDateString('vi-VN') : 
               (tour.start_date ? new Date(tour.start_date).toLocaleDateString('vi-VN') : 'Liên hệ')}
            </span></span>
          </div>

          <div className="info-row-space">
            {/* Duration */}
            <div className="info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="info-text font-semibold">
                {(tour.numDays ?? 1)}N{(tour.numNights ?? 0)}Đ
              </span>
            </div>
            
            {/* Slots */}
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M9 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="info-text">Số chỗ còn: <span className="slots-highlight">{remainingSlots}</span></span>
            </div>
          </div>
        </div>

        {/* Price and Action Section */}
        <div className="tour-card-footer-premium">
          <div className="price-display">
            {Number(tour.price).toLocaleString()} <span className="currency-unit">đ</span>
          </div>
          <Button 
            variant="outline" 
            className="btn-book-now"
          >
            Đặt ngay
          </Button>
        </div>
      </div>
    </Card>
  );
};
