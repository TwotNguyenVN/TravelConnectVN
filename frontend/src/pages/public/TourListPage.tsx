import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';
import { LoadingBlock, EmptyState, TourCard } from '../../components/common';
import './TourListPage.css';

import { provinces } from '../../constants/provinces';

export const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'newest',
    province: searchParams.get('province') || '',
    categoryId: '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 100000000,
    startDate: searchParams.get('startDate') || ''
  });

  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState(searchParams.get('province') || '');
  const [startDateSearch, setStartDateSearch] = useState(searchParams.get('startDate') || '');
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Price range state
  const [minPrice, setMinPrice] = useState<number>(searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0);
  const [maxPrice, setMaxPrice] = useState<number>(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 100000000);
  const minGap = 500000; // Minimum gap between min and max

  const filteredProvinces = provinces.filter((p) =>
    p.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const selectProvince = (p: string) => {
    setLocationSearch(p);
    setShowProvinceSuggestions(false);
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      province: locationSearch,
      categoryId: selectedCategories.join(','),
      minPrice,
      maxPrice,
      startDate: startDateSearch,
      sortBy
    });
  };

  const handleClearFilters = () => {
    setLocationSearch('');
    setStartDateSearch('');
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(100000000);
    setFilters({
      page: 1,
      limit: 10,
      sortBy: sortBy,
      province: '',
      categoryId: '',
      minPrice: 0,
      maxPrice: 100000000,
      startDate: ''
    });
    navigate('/tours');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await tourService.getCategories();
        if (res && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);


  // Price range state is already initialized above

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (maxPrice - value >= minGap) {
      setMinPrice(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value - minPrice >= minGap) {
      setMaxPrice(value);
    }
  };

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
    const province = searchParams.get('province') || '';
    const minP = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
    const maxP = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 100000000;
    const sDate = searchParams.get('startDate') || '';
    
    setLocationSearch(province);
    setStartDateSearch(sDate);
    setMinPrice(minP);
    setMaxPrice(maxP);
    
    setFilters(prev => ({
      ...prev,
      province,
      minPrice: minP,
      maxPrice: maxP,
      startDate: sDate
    }));
  }, [searchParams]);

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
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Tất cả địa điểm"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onFocus={() => setShowProvinceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowProvinceSuggestions(false), 200)}
                style={{ width: '100%', padding: 'var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)', outline: 'none' }}
              />
              {showProvinceSuggestions && filteredProvinces.length > 0 && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--tc-border)', borderRadius: 'var(--tc-radius-md)', maxHeight: '200px', overflowY: 'auto', zIndex: 10, margin: '4px 0 0 0', padding: 0, listStyle: 'none', boxShadow: 'var(--tc-shadow-sm)' }}>
                  {filteredProvinces.map(p => (
                    <li 
                      key={p} 
                      onClick={() => selectProvince(p)}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={(e) => (e.target as HTMLLIElement).style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => (e.target as HTMLLIElement).style.backgroundColor = 'transparent'}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Ngày bắt đầu</h3>
            <input 
              type="date" 
              value={startDateSearch}
              onChange={(e) => setStartDateSearch(e.target.value)}
              style={{ width: '100%', padding: 'var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)', outline: 'none', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-4)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Loại Tour</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-1)' }}>
              {categories.map(cat => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  /> 
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--tc-spacing-5)' }}>
            <h3 style={{ fontSize: 'var(--tc-font-size-sm)', marginBottom: 'var(--tc-spacing-2)' }}>Khoảng giá</h3>
            <div style={{ position: 'relative', height: '6px', marginBottom: 'var(--tc-spacing-4)' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: '#e2e8f0', borderRadius: '3px' 
              }}></div>
              <div style={{ 
                position: 'absolute', top: 0, bottom: 0, 
                backgroundColor: 'var(--tc-primary)', borderRadius: '3px',
                left: `${(minPrice / 100000000) * 100}%`,
                right: `${100 - (maxPrice / 100000000) * 100}%`
              }}></div>
              
              <input 
                type="range" 
                min="0" 
                max="100000000" 
                step="500000"
                value={minPrice} 
                onChange={handleMinChange}
                className="tc-range-slider"
                style={{ zIndex: minPrice > 50000000 ? 5 : 3 }}
              />
              <input 
                type="range" 
                min="0" 
                max="100000000" 
                step="500000"
                value={maxPrice} 
                onChange={handleMaxChange}
                className="tc-range-slider"
                style={{ zIndex: 4 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tc-font-size-xs)', color: 'var(--tc-text-secondary)' }}>
              <span>{minPrice === 0 ? '0đ' : `${(minPrice / 1000000).toFixed(1).replace('.0', '')}tr`}</span>
              <span>{maxPrice >= 100000000 ? '100tr+' : `${(maxPrice / 1000000).toFixed(1).replace('.0', '')}tr`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tc-spacing-3)' }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
            <Button variant="outline" style={{ width: '100%' }} onClick={handleClearFilters}>Xóa bộ lọc</Button>
          </div>
        </aside>

        {/* Main Content: List & Sort */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--tc-spacing-4)' }}>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setFilters(prev => ({ ...prev, sortBy: e.target.value }));
              }}
              style={{ padding: 'var(--tc-spacing-2)', borderRadius: 'var(--tc-radius-md)', border: '1px solid var(--tc-border)' }}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao xuống Thấp</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--tc-spacing-5)' }}>
            {tours.length > 0 ? (
              tours.map((tour: any) => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  onClick={() => navigate(`/tours/${tour.id}`)} 
                />
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
