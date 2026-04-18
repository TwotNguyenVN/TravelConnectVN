import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';

export const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'newest',
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await tourService.getTours(filters);
        setTours(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'var(--tc-primary)' }}>
        Đang tải danh sách tour...
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--tc-spacing-6) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Breadcrumb & Title */}
      <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
        <div style={{ fontSize: 'var(--tc-font-size-sm)', color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-2)' }}>
          <Link to="/" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}>Trang chủ</Link> / Danh sách Tour
        </div>
        <h1 style={{ fontSize: 'var(--tc-font-size-2xl)', margin: 0, color: 'var(--tc-text-primary)' }}>Khám phá các điểm đến tuyệt vời</h1>
        <p style={{ color: 'var(--tc-text-secondary)' }}>Tìm thấy {tours.length} tour phù hợp với bạn</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--tc-spacing-6)', alignItems: 'flex-start' }}>
        {/* Sidebar Filter */}
        <aside style={{ width: '280px', flexShrink: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', padding: 'var(--tc-spacing-5)', backgroundColor: 'var(--tc-bg-default)' }}>
          <h2 style={{ fontSize: 'var(--tc-font-size-lg)', marginTop: 0, marginBottom: 'var(--tc-spacing-4)' }}>Bộ lọc tìm kiếm</h2>
          
          <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Địa điểm</h3>
            <select style={{ width: '100%', padding: 'var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <option value="">Tất cả địa điểm</option>
              <option value="lam-dong">Lâm Đồng</option>
              <option value="quang-ninh">Quảng Ninh</option>
              <option value="kien-giang">Kiên Giang</option>
            </select>
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Loại Tour</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-1)' }}>
              <label><input type="checkbox" /> Khám phá</label>
              <label><input type="checkbox" /> Nghỉ dưỡng</label>
              <label><input type="checkbox" /> Văn hóa</label>
              <label><input type="checkbox" /> Thể thao mạo hiểm</label>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Khoảng giá</h3>
            <input type="range" min="0" max="10000000" style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
              <span>0đ</span>
              <span>10tr+</span>
            </div>
          </div>

          <Button variant="primary" style={{ width: '100%' }}>Áp dụng bộ lọc</Button>
        </aside>

        {/* Main Content: List & Sort */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--tc-spacing-4)' }}>
            <select style={{ padding: 'var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao xuống Thấp</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
            {tours.map(tour => (
              <Card onClick={() => navigate(`/tours/${tour.id}`)} key={tour.id} style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', boxShadow: 'var(--tc-shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                <img src={tour.cover} alt={tour.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: 'var(--tc-spacing-4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-1)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 {tour.location}</span>
                    <span>⏱ {tour.duration}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-3) 0', color: 'var(--tc-text-primary)' }}>{tour.title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--tc-spacing-2)', marginBottom: 'var(--tc-spacing-3)' }}>
                    <span style={{ fontSize: 'var(--tc-font-size-xs)', backgroundColor: 'var(--tc-bg-subtle)', padding: 'var(--tc-spacing-1) var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-sm)', color: 'var(--tc-text-secondary)' }}>{tour.category}</span>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--tc-border)', paddingTop: 'var(--tc-spacing-3)' }}>
                    <span style={{ color: 'var(--tc-warning)', fontWeight: 'bold' }}>★ {tour.rating}</span>
                    <span style={{ color: 'var(--tc-danger)', fontWeight: 'bold', fontSize: 'var(--tc-font-size-lg)' }}>{tour.price.toLocaleString()}đ</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--tc-spacing-8)', gap: 'var(--tc-spacing-2)' }}>
            <Button variant="outline" size="small" disabled>Trước</Button>
            <Button variant="primary" size="small">1</Button>
            <Button variant="outline" size="small">2</Button>
            <Button variant="outline" size="small">3</Button>
            <Button variant="outline" size="small">Sau</Button>
          </div>
        </main>
      </div>
    </div>
  );
};
