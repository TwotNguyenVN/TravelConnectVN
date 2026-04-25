import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../services/tourService';
import { Button } from '../../components/common/Button/Button';
import { EmptyState } from '../../components/common';
import { LoadingBlock } from '../../components/common';
import { useToast } from '../../contexts/ToastContext';
import './MyToursPage.css';

const MyToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { toast } = useToast();
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

  const handleTourDelete = async (tourId: string, tourTitle: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tour "${tourTitle}"?`)) {
      try {
        const response = await tourService.deleteTour(tourId);
        if (response.success) {
          toast.success('Xóa tour thành công');
          fetchTours(); // Tải lại danh sách
        } else {
          toast.error(response.message || 'Xóa tour thất bại');
        }
      } catch (error: any) {
        console.error('Delete tour error:', error);
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa tour');
      }
    }
  };

  const handleToggleVisibility = async (tourId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'hidden' ? 'visible' : 'hidden';
      const response = await tourService.updateTour(tourId, { visibilityStatus: newStatus });
      
      if (response.success || response.id) {
        toast.success(newStatus === 'visible' ? 'Đã hiện bài đăng' : 'Đã ẩn bài đăng');
        fetchTours();
      }
    } catch (error: any) {
      console.error('Toggle visibility error:', error);
      toast.error('Không thể thay đổi trạng thái hiển thị');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Bản nháp';
      case 'published': return 'Đã hoàn tất';
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
                  variant={tour.visibilityStatus === 'hidden' ? 'primary' : 'outline'}
                  size="small" 
                  fullWidth 
                  onClick={() => handleToggleVisibility(tour.id, tour.visibilityStatus || 'visible')}
                >
                  {tour.visibilityStatus === 'hidden' ? 'Hiện bài' : 'Ẩn bài'}
                </Button>
                <Button 
                  variant="outline" 
                  size="small" 
                  fullWidth 
                  onClick={() => navigate(`/guide/tours/edit/${tour.id}`)}
                >
                  Sửa tour
                </Button>
                <Button 
                  variant="outline" 
                  size="small" 
                  fullWidth 
                  className="tc-tour-manage-card__delete-btn"
                  onClick={() => handleTourDelete(tour.id, tour.title)}
                >
                  Xóa tour
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
