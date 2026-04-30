import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { provinces } from '../../constants/provinces';
import { getRecommendedTours } from '../../services/recommendationService';
import type { Tour } from '../../services/tourService';
import { useAuth } from '../../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // TourCard Sub-component (M14)
  const TourCard = ({ tour, onClick }: { tour: any, onClick: () => void }) => {
    const tourCode = `TC-${tour.id.substring(0, 8).toUpperCase()}`;
    const remainingSlots = tour.remainingSlots !== undefined ? tour.remainingSlots : (tour.maxParticipants ? Math.floor(tour.maxParticipants * 0.4) : Math.floor(Math.random() * 5) + 3);
    
    // Timer Logic - Actual countdown to startDate
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
    const isOver = timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;

    return (
      <Card 
        onClick={onClick}
        style={{ 
          width: '300px',
          height: '500px',
          flexShrink: 0,
          overflow: 'hidden', 
          padding: 0, 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          transition: 'all 0.3s ease', 
          cursor: 'pointer',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Image Section */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <img 
            src={tour.tour_images?.[0]?.image_url || tour.cover || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'} 
            alt={tour.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          
          {/* Wishlist Icon */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>

          {/* Bottom Overlays */}
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px', 
            right: '10px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              color: '#006ce4', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '13px', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Đếm ngược
            </div>
            <div style={{ 
              backgroundColor: 'white', 
              color: '#e42b1f', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {timeLeft.d > 0 ? `${timeLeft.d}d ` : ''}{formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 800, 
            margin: '0 0 12px 0', 
            color: '#1a1a1a', 
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '44px'
          }}>
            {tour.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {/* Tour Code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9M2 15v3.8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V15M2 9c1.66 0 3 1.34 3 3s-1.34 3-3 3M22 9c-1.66 0-3 1.34-3 3s1.34 3 3 3M12 5v2M12 17v2M12 11v2"/>
              </svg>
              <span style={{ fontWeight: 600 }}>{tourCode}</span>
            </div>
            
            {/* Departure */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
              Khởi hành: <span style={{ color: '#006ce4', fontWeight: 800, marginLeft: '2px' }}>{tour.province || tour.location}</span>
            </div>

            {/* Departure Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Ngày khởi hành: <span style={{ fontWeight: 600, marginLeft: '2px' }}>
                {tour.startDate ? new Date(tour.startDate).toLocaleDateString('vi-VN') : 
                 (tour.start_date ? new Date(tour.start_date).toLocaleDateString('vi-VN') : 'Liên hệ')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span style={{ fontWeight: 600 }}>
                  {(tour.numDays ?? 1)}N{(tour.numNights ?? 0)}Đ
                </span>
              </div>
              
              {/* Slots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M9 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Số chỗ còn: <span style={{ color: '#e42b1f', fontWeight: 900, fontSize: '16px', marginLeft: '2px' }}>{remainingSlots}</span>
              </div>
            </div>
          </div>

          {/* Price and Action Section */}
          <div style={{ 
            marginTop: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            paddingTop: '16px',
            borderTop: '1.2px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#e42b1f', fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>
                {Number(tour.price).toLocaleString()} <span style={{ textDecoration: 'underline', fontSize: '18px', marginLeft: '-2px' }}>đ</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              style={{ 
                borderColor: '#e42b1f', 
                color: '#e42b1f', 
                borderRadius: '8px', 
                fontWeight: 800,
                padding: '8px 18px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              Đặt ngay
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const getDynamicBanner = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_sang.png";
    if (hour >= 10 && hour < 14) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_trua.png";
    if (hour >= 14 && hour < 18) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_chieu.png";
    return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_toi.png";
  };

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100000000);
  const minGap = 500000;
  const budgetRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const filteredProvinces = provinces.filter(p => 
    p.toLowerCase().includes(location.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('province', location);
    if (startDate) params.set('startDate', startDate);
    
    params.set('minPrice', minBudget.toString());
    params.set('maxPrice', maxBudget.toString());
    
    navigate(`/tours?${params.toString()}`);
  };

  const handleMinBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (maxBudget - value >= minGap) {
      setMinBudget(value);
    }
  };

  const handleMaxBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value - minBudget >= minGap) {
      setMaxBudget(value);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '0đ';
    if (price >= 100000000) return '100tr+';
    return `${(price / 1000000).toFixed(1).replace('.0', '')}tr`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [toursRes, guidesRes, postsRes] = await Promise.all([
          tourService.getFeaturedTours(),
          tourService.getFeaturedGuides(),
          tourService.getLatestCompanions(),
        ]);
        
        if (toursRes.success) setFeaturedTours(toursRes.data || []);
        if (guidesRes.success) setFeaturedGuides(guidesRes.data || []);
        if (postsRes.success) setLatestPosts(postsRes.data || []);
      } catch (error) {
        console.error('Error fetching public home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user && recommendedTours.length === 0) {
        try {
          const recRes = await getRecommendedTours();
          if (recRes.success) setRecommendedTours(recRes.data || []);
        } catch (e) {
          console.error('Failed to load recommendations', e);
        }
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'var(--tc-primary)' }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--tc-bg-default)' }}>
      {/* Hero Section */}
      <section style={{ 
        width: '100%',
        aspectRatio: '16 / 12',
        maxHeight: '700px',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${getDynamicBanner()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'var(--tc-spacing-10) var(--tc-spacing-5)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{ color: '#ffffff', fontSize: '48px', fontWeight: 800, marginBottom: 'var(--tc-spacing-4)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
          Trải nghiệm du lịch theo cách của bạn
        </h1>
        <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: 'var(--tc-spacing-8)', maxWidth: '650px', lineHeight: 1.6, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Khám phá những vùng đất mới cùng hướng dẫn viên địa phương nhiệt tình và những người bạn đồng hành chung đam mê.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--tc-spacing-3)', 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: 'var(--tc-spacing-4)', 
          borderRadius: 'var(--tc-radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '850px',
          flexWrap: 'wrap'
        }}>
          <div ref={locationRef} style={{ flex: 1.5, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Bạn muốn đi đâu?" 
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              style={{ width: '100%', height: '48px', padding: '0 var(--tc-spacing-4)', border: 'none', borderRadius: 'var(--tc-radius-md)', backgroundColor: '#ffffff', fontSize: 'var(--tc-font-size-md)', outline: 'none', color: '#1a1a1a' }} 
            />
            {showLocationSuggestions && location && filteredProvinces.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '8px'
              }}>
                {filteredProvinces.map(p => (
                  <div 
                    key={p}
                    onClick={() => {
                      setLocation(p);
                      setShowLocationSuggestions(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1a1a1a',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, height: '48px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 var(--tc-spacing-4)', backgroundColor: '#ffffff', borderRadius: 'var(--tc-radius-md)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '0', textTransform: 'uppercase' }}>Ngày đi</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '0', border: 'none', backgroundColor: 'transparent', color: '#1a1a1a', fontSize: '15px', outline: 'none', fontWeight: 600, cursor: 'pointer' }} 
            />
          </div>

          <div ref={budgetRef} style={{ flex: 1, height: '48px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 var(--tc-spacing-4)', backgroundColor: '#ffffff', borderRadius: 'var(--tc-radius-md)', cursor: 'pointer' }} onClick={() => setIsBudgetOpen(!isBudgetOpen)}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '0', textTransform: 'uppercase' }}>Ngân sách</span>
            <span style={{ color: '#1a1a1a', fontSize: '15px', fontWeight: 600 }}>{formatPrice(minBudget)} - {formatPrice(maxBudget)}</span>
            
            {isBudgetOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 12px)', 
                  left: 'calc(50% - 160px)', 
                  backgroundColor: 'white', 
                  borderRadius: '24px', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)', 
                  padding: '30px 24px', 
                  zIndex: 1000,
                  width: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  cursor: 'default',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxSizing: 'border-box',
                  overflowX: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.2px' }}>Khoảng giá</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--tc-primary)', backgroundColor: '#f0f7ff', padding: '6px 12px', borderRadius: '10px' }}>
                    {formatPrice(minBudget)} - {formatPrice(maxBudget)}
                  </span>
                </div>

                <div style={{ 
                  position: 'relative', 
                  height: '6px', 
                  margin: '20px 10px', 
                  width: '252px', 
                  backgroundColor: '#f1f5f9', 
                  borderRadius: '4px' 
                }}>
                  <div style={{ 
                    position: 'absolute', top: 0, bottom: 0, 
                    backgroundColor: 'var(--tc-primary)', borderRadius: '4px',
                    left: `${(minBudget / 100000000) * 100}%`,
                    right: `${100 - (maxBudget / 100000000) * 100}%`
                  }}></div>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max="100000000" 
                    step="500000"
                    value={minBudget} 
                    onChange={handleMinBudgetChange}
                    className="tc-range-slider"
                    style={{ zIndex: minBudget > 50000000 ? 1002 : 1000, width: '252px', margin: 0, padding: 0, left: 0 }}
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100000000" 
                    step="500000"
                    value={maxBudget} 
                    onChange={handleMaxBudgetChange}
                    className="tc-range-slider"
                    style={{ zIndex: 1001, width: '252px', margin: 0, padding: 0, left: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', fontWeight: 700, padding: '0 10px' }}>
                  <span>0đ</span>
                  <span>100tr+</span>
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="primary" 
            onClick={handleSearch}
            style={{ height: '48px', padding: '0 var(--tc-spacing-6)', fontWeight: 800, borderRadius: 'var(--tc-radius-md)', boxShadow: '0 4px 12px rgba(0, 108, 228, 0.2)' }}
          >
            Tìm kiếm
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/user/ai-assistant')} 
            style={{ 
              width: '48px',
              height: '48px',
              minWidth: '48px',
              padding: 0,
              border: 'none', 
              backgroundColor: '#ffffff', 
              color: 'var(--tc-primary)', 
              fontWeight: 800,
              fontSize: '20px',
              borderRadius: 'var(--tc-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            title="Hỏi trợ lý AI"
          >
            ✨
          </Button>
        </div>
      </section>

      {/* Recommended Tours Section (M12) */}
      {user && recommendedTours.length > 0 && (
        <section style={{ padding: 'var(--tc-spacing-8) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto', backgroundColor: '#f0f9ff', borderRadius: 'var(--tc-radius-lg)', marginTop: 'var(--tc-spacing-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✨ Gợi Ý Dành Riêng Cho Bạn
              </h2>
              <p style={{ color: 'var(--tc-text-secondary)' }}>Dựa trên sở thích và ngân sách của {profile?.full_name}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--tc-spacing-5)', overflowX: 'auto', paddingBottom: 'var(--tc-spacing-4)' }}>
            {recommendedTours.map((tour: any) => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onClick={() => navigate(`/tours/${tour.id}`)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Tours Section */}
      <section style={{ padding: 'var(--tc-spacing-8) 0', backgroundColor: 'var(--tc-bg-default)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--tc-spacing-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-text-primary)' }}>Tour Nổi Bật</h2>
              <p style={{ color: 'var(--tc-text-secondary)' }}>Những hành trình được yêu thích nhất trong tuần</p>
            </div>
            <Link to="/tours" style={{ color: 'var(--tc-primary)', fontWeight: 500, textDecoration: 'none' }}>Xem tất cả &rarr;</Link>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--tc-spacing-5)',
            justifyItems: 'center'
          }}>
            {featuredTours.map(tour => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onClick={() => navigate(`/tours/${tour.id}`)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section style={{ padding: 'var(--tc-spacing-8) 0', backgroundColor: 'var(--tc-bg-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--tc-spacing-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-text-primary)' }}>Hướng dẫn viên địa phương</h2>
              <p style={{ color: 'var(--tc-text-secondary)' }}>Kết nối với người bản địa am hiểu khu vực</p>
            </div>
            <Link to="/guides" style={{ color: 'var(--tc-primary)', fontWeight: 500, textDecoration: 'none' }}>Xem tất cả &rarr;</Link>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 'var(--tc-spacing-5)',
            justifyItems: 'center'
          }}>
            {featuredGuides.map(guide => (
              <Card 
                key={guide.id} 
                style={{ 
                  width: '100%',
                  minWidth: '280px',
                  maxWidth: '310px',
                  height: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden', 
                  padding: 0, 
                  border: '1px solid var(--tc-border)', 
                  borderRadius: 'var(--tc-radius-lg)', 
                  backgroundColor: 'var(--tc-bg-default)', 
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => navigate(`/guides/${guide.id}`)}
              >
                {/* Image Cover */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                  <img 
                    src={guide.coverUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'} 
                    alt={guide.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Avatar Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '-25px', 
                    left: '15px', 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    border: '3px solid white', 
                    overflow: 'hidden',
                    backgroundColor: 'var(--tc-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--tc-shadow-sm)',
                    zIndex: 2
                  }}>
                    {guide.avatar ? (
                      <img src={guide.avatar} alt={guide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'var(--tc-primary)', fontWeight: 'bold', fontSize: '20px' }}>{guide.name.charAt(0)}</span>
                    )}
                  </div>
                </div>

                <div style={{ padding: 'var(--tc-spacing-5)', marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--tc-text-primary)' }}>{guide.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                      <span style={{ color: '#006ce4' }}>🌐</span>
                      Ngôn ngữ: <span style={{ fontWeight: 600 }}>{guide.languages || 'Tiếng Việt'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                      <span style={{ color: '#006ce4' }}>🎯</span>
                      Khu vực: <span style={{ fontWeight: 600 }}>{guide.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                      <span style={{ color: '#006ce4' }}>📜</span>
                      Kinh nghiệm: <span style={{ fontWeight: 600 }}>{guide.yearsOfExperience} năm</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--tc-border)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--tc-text-primary)', fontWeight: 600 }}>
                      💼 {guide.yearsOfExperience || 0} năm KN
                    </span>
                    <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ★ {guide.rating || 5.0}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Companion Posts */}
      <section style={{ padding: 'var(--tc-spacing-8) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-text-primary)' }}>Bài đồng hành mới nhất</h2>
            <p style={{ color: 'var(--tc-text-secondary)' }}>Cùng chia sẻ chi phí và niềm vui</p>
          </div>
          <Link to="/companions" style={{ color: 'var(--tc-primary)', fontWeight: 500, textDecoration: 'none' }}>Xem tất cả &rarr;</Link>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--tc-spacing-5)',
          justifyItems: 'center'
        }}>
          {latestPosts.map(post => (
            <Card 
              key={post.id} 
              style={{ 
                width: '100%',
                minWidth: '280px',
                maxWidth: '310px',
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', 
                padding: 0, 
                border: '1px solid var(--tc-border)', 
                borderRadius: 'var(--tc-radius-lg)', 
                backgroundColor: 'var(--tc-bg-default)', 
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease'
              }} 
              onClick={() => navigate(`/companions/${post.id}`)}
            >
              {/* Image Cover */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <img 
                  src={post.coverUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'} 
                  alt={post.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {/* Avatar Overlay */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-25px', 
                  left: '15px', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  border: '3px solid white', 
                  overflow: 'hidden',
                  backgroundColor: 'var(--tc-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--tc-shadow-sm)',
                  zIndex: 2
                }}>
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={post.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--tc-primary)', fontWeight: 'bold', fontSize: '20px' }}>{post.authorName?.charAt(0) || 'U'}</span>
                  )}
                </div>
              </div>

              <div style={{ padding: 'var(--tc-spacing-5)', marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  fontSize: '17px', 
                  fontWeight: 700, 
                  margin: '0 0 10px 0', 
                  color: 'var(--tc-text-primary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '44px',
                  lineHeight: '1.3'
                }}>
                  {post.title}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                    <span style={{ color: '#e42b1f' }}>💰</span>
                    Chi phí: <span style={{ fontWeight: 700, color: '#e42b1f' }}>{Number(post.estimatedCost).toLocaleString()}đ</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                    <span style={{ color: '#006ce4' }}>👥</span>
                    Cần tìm: <span style={{ fontWeight: 700 }}>{post.expectedMembers} người</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                    <span style={{ color: '#006ce4' }}>📍</span>
                    Điểm đến: <span style={{ fontWeight: 600 }}>{post.destination}</span>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--tc-border)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--tc-primary)', fontWeight: 700 }}>
                    {post.authorName}
                  </span>
                  <Button variant="outline" size="small" style={{ borderRadius: '20px', padding: '4px 16px' }}>Tham gia</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
