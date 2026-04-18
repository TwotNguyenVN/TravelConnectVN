import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [featuredGuides, setFeaturedGuides] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [toursData, guidesData, postsData] = await Promise.all([
          tourService.getFeaturedTours(),
          tourService.getFeaturedGuides(),
          tourService.getLatestCompanions(),
        ]);
        setFeaturedTours(toursData);
        setFeaturedGuides(guidesData);
        setLatestPosts(postsData);
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
        minHeight: '400px', 
        backgroundColor: 'var(--tc-primary-light)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'var(--tc-spacing-6) var(--tc-spacing-5)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--tc-primary)', fontSize: 'var(--tc-font-size-2xl)', marginBottom: 'var(--tc-spacing-3)' }}>
          Trải nghiệm du lịch theo cách của bạn
        </h1>
        <p style={{ fontSize: 'var(--tc-font-size-lg)', color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-5)', maxWidth: '600px' }}>
          Khám phá những vùng đất mới cùng hướng dẫn viên địa phương nhiệt tình và những người bạn đồng hành chung đam mê.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--tc-spacing-3)', 
          backgroundColor: 'var(--tc-bg-default)', 
          padding: 'var(--tc-spacing-3)', 
          borderRadius: 'var(--tc-radius-lg)',
          boxShadow: 'var(--tc-shadow-md)',
          width: '100%',
          maxWidth: '800px',
          flexWrap: 'wrap'
        }}>
          <input type="text" placeholder="Bạn muốn đi đâu?" style={{ flex: 1, minWidth: '200px', padding: 'var(--tc-spacing-2) var(--tc-spacing-3)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)' }} />
          <input type="date" style={{ padding: 'var(--tc-spacing-2) var(--tc-spacing-3)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)' }} />
          <Button variant="primary">Tìm kiếm Tour</Button>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section style={{ padding: 'var(--tc-spacing-8) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-text-primary)' }}>Tour Nổi Bật</h2>
            <p style={{ color: 'var(--tc-text-secondary)' }}>Những hành trình được yêu thích nhất trong tuần</p>
          </div>
          <Link to="/tours" style={{ color: 'var(--tc-primary)', fontWeight: 500, textDecoration: 'none' }}>Xem tất cả &rarr;</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
          {featuredTours.map(tour => (
            <Card onClick={() => navigate(`/tours/${tour.id}`)} key={tour.id} style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', boxShadow: 'var(--tc-shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={tour.cover} alt={tour.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
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
      </section>

      {/* Featured Guides Section */}
      <section style={{ padding: 'var(--tc-spacing-8) var(--tc-spacing-5)', backgroundColor: 'var(--tc-bg-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--tc-spacing-5)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--tc-font-size-xl)', color: 'var(--tc-text-primary)' }}>Hướng dẫn viên địa phương</h2>
              <p style={{ color: 'var(--tc-text-secondary)' }}>Kết nối với người bản địa am hiểu khu vực</p>
            </div>
            <Link to="/guides" style={{ color: 'var(--tc-primary)', fontWeight: 500, textDecoration: 'none' }}>Xem tất cả &rarr;</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
            {featuredGuides.map(guide => (
              <Card key={guide.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--tc-spacing-4)', padding: 'var(--tc-spacing-4)', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', backgroundColor: 'var(--tc-bg-default)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--tc-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-success)', fontSize: 'var(--tc-font-size-lg)', fontWeight: 'bold' }}>
                  {guide.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-1) 0' }}>{guide.name}</h3>
                  <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>{guide.location} • ⭐ {guide.rating}</div>
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
