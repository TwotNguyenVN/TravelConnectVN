import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';
import { LoadingBlock, EmptyState } from '../../components/common';

export const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'newest',
  });

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tourService.getTours(filters);
      if (response.success && response.data) {
        // Tours are in response.data.data due to pagination structure
        setTours(response.data.data || []);
      } else {
        setError('Không tìm thấy dữ liệu tour.');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Đã xảy ra lỗi khi tải danh sách tour. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [filters]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--tc-spacing-6) var(--tc-spacing-5)', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 'var(--tc-spacing-8)' }}>
          <LoadingBlock height={40} width="300px" />
          <div style={{ marginTop: '10px' }}><LoadingBlock height={20} width="200px" /></div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--tc-spacing-6)' }}>
          <LoadingBlock width="280px" height={400} />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <LoadingBlock key={i} height={350} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--tc-spacing-10) 0' }}>
        <EmptyState 
          title="Có lỗi xảy ra" 
          description={error}
          action={<Button variant="primary" onClick={fetchTours}>Thử lại</Button>}
        />
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
            {tours.length > 0 ? (
              tours.map((tour: any) => (
                <Card onClick={() => navigate(`/tours/${tour.id}`)} key={tour.id} style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-lg)', boxShadow: 'var(--tc-shadow-sm)', transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={tour.cover} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 'var(--tc-spacing-4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)', marginBottom: 'var(--tc-spacing-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {tour.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ {tour.duration}</span>
                    </div>
                    
                    <h3 style={{ fontSize: 'var(--tc-font-size-md)', margin: '0 0 var(--tc-spacing-2) 0', color: 'var(--tc-text-primary)', fontWeight: '700', lineHeight: '1.4', height: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {tour.title}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tc-spacing-2)', marginBottom: 'var(--tc-spacing-3)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: 'rgba(0, 108, 228, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--tc-primary)' }}>
                        {tour.category}
                      </span>
                      {tour.maxParticipants && (
                        <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#64748b' }}>
                          👥 Tối đa {tour.maxParticipants} khách
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--tc-border)', paddingTop: 'var(--tc-spacing-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                        <span style={{ fontWeight: '700', color: 'var(--tc-text-primary)' }}>{tour.rating}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--tc-danger)', fontWeight: '800', fontSize: 'var(--tc-font-size-lg)' }}>
                          {tour.price.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <EmptyState 
                  title="Không tìm thấy tour nào" 
                  description="Hãy thử thay đổi bộ lọc hoặc tìm kiếm theo từ khóa khác nhé."
                  action={<Button variant="primary" onClick={() => window.location.reload()}>Tải lại trang</Button>}
                />
              </div>
            )}
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
