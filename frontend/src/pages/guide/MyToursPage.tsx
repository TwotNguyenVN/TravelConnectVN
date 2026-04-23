import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';
import { Button } from '../../components/common/Button/Button';
import { EmptyState } from '../../components/common';
import { LoadingBlock } from '../../components/common';
import './MyToursPage.css';

const MyToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, [statusFilter, searchKeyword]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        keyword: searchKeyword || undefined,
        limit: 100 // Lấy hết để demo cho dễ
      };
      const response = await tourService.getMyGuidedTours(params);
      if (response.success && response.data) {
        setTours(response.data.data || []);
      } else {
        setTours([]);
      }
    } catch (error) {
      console.error('Failed to fetch guided tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Bản nháp';
      case 'published': return 'Đang công khai';
      case 'closed': return 'Đã đóng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="tc-my-tours">
      <div className="tc-my-tours__header">
        <div className="tc-my-tours__title">
          <h1>Tour của tôi</h1>
          <p>Quản lý các tour du lịch bạn đang dẫn dắt</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/guide/tours/create')}>
          + Tạo tour mới
        </Button>
      </div>

      <div className="tc-my-tours__filters">
        <div className="tc-my-tours__search">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên tour..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="tc-my-tours__status-filter">
          {['all', 'draft', 'published', 'closed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`tc-my-tours__status-btn ${statusFilter === status ? 'tc-my-tours__status-btn--active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : tours.length > 0 ? (
        <div className="tc-my-tours__grid">
          {tours.map(tour => (
            <div key={tour.id} className="tc-tour-manage-card">
              <div className="tc-tour-manage-card__image">
                <img src={tour.cover} alt={tour.title} />
                <div className="tc-tour-manage-card__badges">
                  <span className={`tc-tour-manage-card__badge tc-tour-manage-card__badge--${tour.businessStatus}`}>
                    {getStatusLabel(tour.businessStatus || '')}
                  </span>
                  {tour.visibilityStatus === 'hidden' && (
                    <span className="tc-tour-manage-card__badge tc-tour-manage-card__badge--hidden">
                      Bị ẩn
                    </span>
                  )}
                </div>
              </div>
              <div className="tc-tour-manage-card__content">
                <div className="tc-tour-manage-card__category">{tour.category}</div>
                <h3 className="tc-tour-manage-card__title">{tour.title}</h3>
                <div className="tc-tour-manage-card__info">
                  <div className="tc-tour-manage-card__info-item">
                    <span>📍 {tour.province}</span>
                  </div>
                  <div className="tc-tour-manage-card__info-item">
                    <span>📅 {formatDate(tour.startDate || '')} - {formatDate(tour.endDate || '')}</span>
                  </div>
                  <div className="tc-tour-manage-card__price">
                    {formatPrice(tour.price)}
                  </div>
                </div>
              </div>
              <div className="tc-tour-manage-card__footer">
                <Button 
                  variant="outline" 
                  size="small" 
                  fullWidth 
                  onClick={() => navigate(`/guide/tours/${tour.id}/edit`)}
                >
                  Sửa tour
                </Button>
                <Button 
                  variant="secondary" 
                  size="small" 
                  fullWidth 
                  onClick={() => navigate(`/guide/tours/${tour.id}/itinerary`)}
                >
                  Lịch trình
                </Button>
                <Button 
                  variant="outline" 
                  size="small" 
                  fullWidth 
                  onClick={() => navigate(`/guide/tours/${tour.id}/images`)}
                >
                  Ảnh tour
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Chưa có tour nào"
          description="Bạn chưa tạo bất kỳ tour du lịch nào. Hãy bắt đầu ngay để kết nối với khách du lịch!"
          action={
            <Button variant="primary" onClick={() => navigate('/guide/tours/create')}>
              Tạo tour ngay
            </Button>
          }
        />
      )}
    </div>
  );
};

export default MyToursPage;
