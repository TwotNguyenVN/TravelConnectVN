import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Input, Button, LoadingBlock, EmptyState } from '../../components/common';
import GuideCard, { type GuideListItem } from '../../components/public/GuideCard';
import { guideService } from '../../services/guideService';
import './GuideListPage.css';

const GuideListPage: React.FC = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    workingArea: '',
    page: 1,
    limit: 12,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchGuides();
  }, [filters.page, filters.workingArea]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await guideService.getPublicGuides(filters);
      if (res.success && res.data) {
        setGuides(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchGuides();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="guide-list-page">
      <div className="guide-list-header">
        <PageContainer>
          <h1>Hướng dẫn viên địa phương</h1>
          <p>Tìm kiếm người bạn đồng hành bản địa để có trải nghiệm du lịch tuyệt vời nhất.</p>
        </PageContainer>
      </div>

      <PageContainer>
        <form className="guide-filter-bar" onSubmit={handleSearch}>
          <Input 
            label="Từ khóa" 
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="Tìm theo tên, giới thiệu..."
            fullWidth
          />
          <Input 
            label="Khu vực" 
            name="workingArea"
            value={filters.workingArea}
            onChange={handleFilterChange}
            placeholder="Hà Nội, Hội An, TP. HCM..."
            fullWidth
          />
          <Button type="submit" size="large">Tìm kiếm</Button>
        </form>

        {loading ? (
          <LoadingBlock />
        ) : guides.length > 0 ? (
          <>
            <div className="guide-grid">
              {guides.map(guide => (
                <GuideCard 
                  key={guide.id} 
                  guide={guide} 
                  onClick={() => navigate(`/guides/${guide.id}`)}
                />
              ))}
            </div>
            
            {total > filters.limit && (
              <div className="guide-pagination">
                <Button 
                  variant="outline" 
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Trang trước
                </Button>
                <Button 
                  variant="outline"
                  disabled={filters.page * filters.limit >= total}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            title="Không tìm thấy hướng dẫn viên" 
            description="Hãy thử thay đổi từ khóa hoặc khu vực tìm kiếm khác."
            action={
              <Button 
                variant="outline" 
                onClick={() => setFilters({ keyword: '', workingArea: '', page: 1, limit: 12 })}
              >
                Xem tất cả hướng dẫn viên
              </Button>
            }
          />
        )}
      </PageContainer>
    </div>
  );
};

export default GuideListPage;
