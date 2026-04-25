import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { tourService } from '../../services/tourService';
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

  const getDynamicBanner = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_sang.png";
    if (hour >= 10 && hour < 14) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_trua.png";
    if (hour >= 14 && hour < 18) return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_chieu.png";
    return "https://zkeymmxuncvlrlezrbye.supabase.co/storage/v1/object/public/banner/banner_home/bannerhome_toi.png";
  };

  useEffect(() => {
    const fetchData = async () => {
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

        if (user) {
          try {
            const recRes = await getRecommendedTours();
            if (recRes.success) setRecommendedTours(recRes.data || []);
          } catch (e) {
            console.error('Failed to load recommendations', e);
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <input type="text" placeholder="Bạn muốn đi đâu?" style={{ flex: 1, minWidth: '200px', padding: 'var(--tc-spacing-3) var(--tc-spacing-4)', border: 'none', borderRadius: 'var(--tc-radius-md)', backgroundColor: '#ffffff', fontSize: 'var(--tc-font-size-md)', outline: 'none' }} />
          <input type="date" style={{ padding: 'var(--tc-spacing-3) var(--tc-spacing-4)', border: 'none', borderRadius: 'var(--tc-radius-md)', backgroundColor: '#ffffff', fontSize: 'var(--tc-font-size-md)', outline: 'none' }} />
          <Button variant="primary" style={{ padding: '0 var(--tc-spacing-6)', fontWeight: 600 }}>Tìm kiếm Tour</Button>
          <Button variant="outline" onClick={() => navigate('/user/ai-assistant')} style={{ border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'var(--tc-primary)', fontWeight: 600, padding: '0 var(--tc-spacing-6)' }}>
            ✨ Hỏi trợ lý AI
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
              <Card onClick={() => navigate(`/tours/${tour.id}`)} key={tour.id} style={{ width: '320px', minWidth: '320px', flex: '0 0 auto', overflow: 'hidden', padding: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', boxShadow: 'var(--tc-shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <img src={tour.tour_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'} alt={tour.title} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
                <div style={{ padding: 'var(--tc-spacing-4)' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {tour.match_reasons?.map((r: string, idx: number) => (
                      <span key={idx} style={{ fontSize: '11px', background: 'var(--tc-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{r}</span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-2) 0', color: 'var(--tc-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tour.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--tc-text-secondary)', fontSize: '13px' }}>📍 {tour.province}</span>
                    <span style={{ color: 'var(--tc-danger)', fontWeight: 'bold' }}>{Number(tour.price).toLocaleString()}đ</span>
                  </div>
                </div>
              </Card>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 320px)', gap: 'var(--tc-spacing-5)' }}>
            {featuredTours.map(tour => (
              <Card onClick={() => navigate(`/tours/${tour.id}`)} key={tour.id} style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', boxShadow: 'var(--tc-shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <img src={tour.cover} alt={tour.title} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
                <div style={{ padding: 'var(--tc-spacing-4)' }}>
                  <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-2) 0', color: 'var(--tc-text-primary)' }}>{tour.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold' }}>★ {tour.rating}</span>
                    <span style={{ color: 'var(--tc-danger)', fontWeight: 'bold' }}>{tour.price.toLocaleString()}đ</span>
                  </div>
                </div>
              </Card>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 320px)', gap: 'var(--tc-spacing-5)' }}>
            {featuredGuides.map(guide => (
              <Card 
                key={guide.id} 
                style={{ 
                  width: '320px', 
                  overflow: 'hidden', 
                  padding: 0, 
                  border: '1px solid var(--tc-border)', 
                  borderRadius: 'var(--tc-radius-lg)', 
                  backgroundColor: 'var(--tc-bg-default)', 
                  cursor: 'pointer',
                  position: 'relative'
                }} 
                onClick={() => navigate(`/guides/${guide.id}`)}
              >
                {/* Image Cover */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
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

                <div style={{ padding: 'var(--tc-spacing-4)', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--tc-text-primary)' }}>{guide.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tc-text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                    📍 {guide.location || 'Việt Nam'}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--tc-border)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--tc-text-secondary)', fontWeight: 500 }}>
                      💼 {guide.yearsOfExperience || 0} năm kinh nghiệm
                    </span>
                    <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ★ {guide.rating || 5}
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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
          {latestPosts.map(post => (
            <Card key={post.id} style={{ padding: 'var(--tc-spacing-4)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-2) 0' }}>{post.title}</h3>
                <span style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', backgroundColor: 'var(--tc-bg-subtle)', padding: 'var(--tc-spacing-1) var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-sm)' }}>📍 {post.destination} • 📅 {post.date}</span>
              </div>
              <Button variant="outline" size="small">Tham gia</Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
