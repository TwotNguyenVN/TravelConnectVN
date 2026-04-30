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

  const handleStatusUpdate = async (tourId: string, newStatus: string, successMsg: string) => {
    try {
      const response = await tourService.updateTour(tourId, { businessStatus: newStatus });
      if (response.success || response.id) {
        toast.success(successMsg);
        fetchTours();
      }
    } catch (error: any) {
      console.error('Update status error:', error);
      toast.error('Không thể cập nhật trạng thái tour');
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

  const handleStatusUpdateComplex = async (tourId: string, newStatus: string, newVisibility: string, successMsg: string) => {
    try {
      const response = await tourService.updateTour(tourId, { 
        businessStatus: newStatus,
        visibilityStatus: newVisibility
      });
      if (response.success || response.id) {
        toast.success(successMsg);
        fetchTours();
      }
    } catch (error: any) {
      console.error('Update status complex error:', error);
      toast.error('Không thể cập nhật trạng thái tour');
    }
  };

  const getStatusLabel = (business: string, visibility: string = 'visible') => {
    if (business === 'draft') return 'Bản nháp';
    if (business === 'published') return 'Đang mở';
    if (business === 'closed') {
      if (visibility === 'hidden') return 'Đang tạm ngưng';
      return 'Đã đóng ĐK';
    }
    if (business === 'cancelled') return 'Đã hủy';
    if (business === 'completed') return 'Đã hoàn tất';
    return 'Không rõ';
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
          {['all', 'draft', 'published', 'closed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`tc-my-tours__status-btn ${statusFilter === status ? 'tc-my-tours__status-btn--active' : ''}`}
               onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status, 'visible')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : tours.length > 0 ? (
        <div className="tc-my-tours__grid">
          {tours.map(tour => (
            <div 
              key={tour.id} 
              className="tc-tour-manage-card"
              onClick={() => navigate(`/guide/tours/edit/${tour.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="tc-tour-manage-card__image">
                <img src={tour.cover} alt={tour.title} />
                <div className="tc-tour-manage-card__badges">
                   <span className={`tc-tour-manage-card__badge tc-tour-manage-card__badge--${tour.businessStatus}`}>
                    {getStatusLabel(tour.businessStatus || '', tour.visibilityStatus || '')}
                  </span>
                  {tour.visibilityStatus === 'hidden' && tour.businessStatus !== 'closed' && (
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
              <div className="tc-tour-manage-card__footer" onClick={(e) => e.stopPropagation()}>
                {tour.businessStatus === 'draft' && (
                  <div className="tc-tour-manage-card__row">
                    <Button 
                      variant="outline" 
                      size="small" 
                      fullWidth 
                      onClick={() => navigate(`/guide/tours/edit/${tour.id}`)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="outline" 
                      size="small" 
                      fullWidth 
                      className="tc-tour-manage-card__delete-btn"
                      onClick={() => handleStatusUpdate(tour.id, 'cancelled', 'Tour đã được chuyển vào mục Đã hủy')}
                    >
                      Xóa tour
                    </Button>
                  </div>
                )}

                {(tour.businessStatus === 'published' || tour.businessStatus === 'completed' || (tour.businessStatus === 'closed' && tour.visibilityStatus === 'hidden')) && (
                  <div className="tc-tour-manage-card__footer-actions">
                    <div className="tc-tour-manage-card__row">
                      <Button 
                        variant="outline" 
                        size="small" 
                        fullWidth 
                        onClick={() => navigate(`/guide/tours/edit/${tour.id}?tab=details`)}
                      >
                        Chi Tiết
                      </Button>
                      <Button 
                        variant="outline" 
                        size="small" 
                        fullWidth 
                        onClick={() => navigate(`/guide/tours/edit/${tour.id}?tab=reviews`)}
                      >
                        Bình Luận
                      </Button>
                    </div>
                    <Button 
                      variant="primary" 
                      size="small" 
                      fullWidth 
                      onClick={() => navigate(`/guide/tours/edit/${tour.id}?tab=schedules`)}
                    >
                      Lịch Trình Tour
                    </Button>
                  </div>
                )}

                {tour.businessStatus === 'closed' && tour.visibilityStatus === 'visible' && (
                  <Button 
                    variant="primary" 
                    size="small" 
                    fullWidth 
                    onClick={() => handleStatusUpdate(tour.id, 'completed', 'Chúc mừng bạn đã hoàn thành tour!')}
                  >
                    Hoàn thành
                  </Button>
                )}

                {tour.businessStatus === 'cancelled' && (
                  <div className="tc-tour-manage-card__row">
                    <Button 
                      variant="outline" 
                      size="small" 
                      fullWidth 
                      onClick={() => handleStatusUpdate(tour.id, 'draft', 'Đã chuyển tour về bản nháp')}
                    >
                      Bản Nháp
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
                )}
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
