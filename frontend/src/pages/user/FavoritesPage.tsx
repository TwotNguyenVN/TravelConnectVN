import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, Card, Button, LoadingBlock, EmptyState } from '../../components/common';
import favoriteService from '../../services/favoriteService';
import type { FavoriteTour, FavoriteGuide } from '../../services/favoriteService';
import { useToast } from '../../contexts/ToastContext';
import './FavoritesPage.css';

const FavoritesPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'tours' | 'guides'>('tours');
  const [tours, setTours] = useState<FavoriteTour[]>([]);
  const [guides, setGuides] = useState<FavoriteGuide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const [toursRes, guidesRes]: [any, any] = await Promise.all([
        favoriteService.getMyFavoriteTours(),
        favoriteService.getMyFavoriteGuides(),
      ]);

      if (toursRes.success) setTours(toursRes.data);
      if (guidesRes.success) setGuides(guidesRes.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveTour = async (e: React.MouseEvent, tourId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res: any = await favoriteService.removeTourFavorite(tourId);
      if (res.success) {
        setTours(prev => prev.filter(t => t.id !== tourId));
        toast.success('Đã xóa khỏi danh sách yêu thích');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };

  const handleRemoveGuide = async (e: React.MouseEvent, guideId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res: any = await favoriteService.removeGuideFavorite(guideId);
      if (res.success) {
        setGuides(prev => prev.filter(g => g.id !== guideId));
        toast.success('Đã xóa khỏi danh sách yêu thích');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="favorites-header">
          <LoadingBlock width="300px" height="40px" />
          <LoadingBlock width="200px" height="20px" />
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
          <LoadingBlock width="100px" height="40px" />
          <LoadingBlock width="100px" height="40px" />
        </div>
        <div className="favorites-grid">
          {[1, 2, 3].map(i => <LoadingBlock key={i} height="300px" />)}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>Danh sách yêu thích</h1>
          <p>Lưu lại những chuyến đi và hướng dẫn viên mà bạn quan tâm.</p>
        </div>

        <div className="favorites-tabs">
          <button 
            className={`favorites-tab ${activeTab === 'tours' ? 'active' : ''}`}
            onClick={() => setActiveTab('tours')}
          >
            Chuyến đi ({tours.length})
          </button>
          <button 
            className={`favorites-tab ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            Hướng dẫn viên ({guides.length})
          </button>
        </div>

        {activeTab === 'tours' && (
          <div className="favorites-content">
            {tours.length > 0 ? (
              <div className="favorites-grid">
                {tours.map(tour => (
                  <Card key={tour.id} className="favorite-card">
                    <Link to={`/tours/${tour.id}`}>
                      <img src={tour.cover} alt={tour.title} className="favorite-card-image" />
                    </Link>
                    <div className="favorite-card-content">
                      <Link to={`/tours/${tour.id}`} className="favorite-card-title">
                        {tour.title}
                      </Link>
                      <div className="favorite-card-meta">
                        📍 {tour.location} | {tour.category}
                      </div>
                      <div className="favorite-card-price">
                        {tour.price.toLocaleString()}đ
                      </div>
                      <div className="favorite-card-actions">
                        <Button 
                          variant="outline" 
                          size="small" 
                          fullWidth 
                          onClick={(e) => handleRemoveTour(e, tour.id)}
                        >
                          Bỏ lưu
                        </Button>
                        <Button 
                          variant="primary" 
                          size="small" 
                          fullWidth
                          onClick={() => window.location.href = `/tours/${tour.id}`}
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Chưa có chuyến đi yêu thích" 
                description="Hãy khám phá các tour du lịch hấp dẫn và nhấn lưu để xem lại sau."
                action={<Button onClick={() => window.location.href = '/tours'}>Khám phá ngay</Button>}
              />
            )}
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="favorites-content">
            {guides.length > 0 ? (
              <div className="favorites-grid">
                {guides.map(guide => (
                  <Card key={guide.id}>
                    <div className="guide-favorite-card">
                      <Link to={`/guides/${guide.id}`}>
                        <img 
                          src={guide.avatar || 'https://via.placeholder.com/80?text=Guide'} 
                          alt={guide.name} 
                          className="guide-favorite-avatar" 
                        />
                      </Link>
                      <div className="guide-favorite-info">
                        <Link to={`/guides/${guide.id}`} className="guide-favorite-name">
                          {guide.name}
                        </Link>
                        <div className="guide-favorite-location">📍 {guide.location}</div>
                        <div className="favorite-card-actions">
                          <Button 
                            variant="outline" 
                            size="small" 
                            onClick={(e) => handleRemoveGuide(e, guide.id)}
                          >
                            Bỏ lưu
                          </Button>
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => window.location.href = `/guides/${guide.id}`}
                          >
                            Hồ sơ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Chưa có hướng dẫn viên yêu thích" 
                description="Tìm kiếm những người đồng hành chuyên nghiệp cho chuyến đi của bạn."
                action={<Button onClick={() => window.location.href = '/guides'}>Tìm hướng dẫn viên</Button>}
              />
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default FavoritesPage;
