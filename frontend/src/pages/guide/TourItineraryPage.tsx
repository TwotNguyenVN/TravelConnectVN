import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import './TourItineraryPage.css';

interface ItineraryLocation {
  id?: string;
  locationName: string;
  address: string;
  notes: string;
  visitTime: string;
}

const TourItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<ItineraryLocation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const data = await tourService.getTourItinerary(id!);
      // Map backend naming to frontend naming
      const mappedData = data.map((loc: any) => ({
        id: loc.id,
        locationName: loc.location_name,
        address: loc.address || '',
        notes: loc.notes || '',
        visitTime: loc.visit_time ? new Date(loc.visit_time).toISOString().slice(0, 16) : ''
      }));
      setLocations(mappedData);
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      { locationName: '', address: '', notes: '', visitTime: '' }
    ]);
  };

  const removeLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const moveLocation = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === locations.length - 1) return;

    const newLocations = [...locations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLocations[index], newLocations[targetIndex]] = [newLocations[targetIndex], newLocations[index]];
    setLocations(newLocations);
  };

  const handleLocationChange = (index: number, field: keyof ItineraryLocation, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocations(newLocations);
  };

  const handleSave = async () => {
    // Basic validation
    if (locations.some(loc => !loc.locationName)) {
      toast.warning('Vui lòng điền tên địa điểm cho tất cả các mục');
      return;
    }

    try {
      setSubmitting(true);
      await tourService.updateTourItinerary(id!, locations);
      toast.success('Lưu lịch trình thành công!');
      navigate('/guide/tours');
    } catch (error) {
      console.error('Failed to save itinerary:', error);
      toast.error('Có lỗi xảy ra khi lưu lịch trình');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="tc-loading">Đang tải lịch trình...</div>;

  return (
    <div className="tc-tour-itinerary">
      <div className="tc-tour-itinerary__header">
        <div className="tc-tour-itinerary__title">
          <h1>Quản lý lịch trình</h1>
          <p>Thiết lập các điểm dừng chân và hoạt động trong tour của bạn</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/guide/tours')}>
          Quay lại
        </Button>
      </div>

      <div className="tc-tour-itinerary__list">
        {locations.length > 0 ? (
          locations.map((loc, index) => (
            <div key={index} className="tc-itinerary-item">
              <div className="tc-itinerary-item__sequence">
                {index + 1}
              </div>
              <div className="tc-itinerary-item__content">
                <div className="tc-itinerary-item__header">
                  <div className="tc-itinerary-item__main-info">
                    <input 
                      className="tc-form-input tc-itinerary-item__name-input"
                      style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}
                      value={loc.locationName}
                      onChange={(e) => handleLocationChange(index, 'locationName', e.target.value)}
                      placeholder="Tên địa điểm / Hoạt động (VD: Tham quan Bảo tàng)"
                    />
                  </div>
                  <div className="tc-itinerary-item__actions">
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => moveLocation(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => moveLocation(index, 'down')}
                      disabled={index === locations.length - 1}
                    >
                      ↓
                    </Button>
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => removeLocation(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
                
                <div className="tc-itinerary-item__form">
                  <div className="tc-form-group tc-form-group--full">
                    <label>Địa chỉ / Vị trí</label>
                    <input 
                      className="tc-form-input"
                      value={loc.address}
                      onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                      placeholder="Địa chỉ chi tiết"
                    />
                  </div>
                  <div className="tc-form-group">
                    <label>Thời gian (Dự kiến)</label>
                    <input 
                      type="datetime-local"
                      className="tc-form-input"
                      value={loc.visitTime}
                      onChange={(e) => handleLocationChange(index, 'visitTime', e.target.value)}
                    />
                  </div>
                  <div className="tc-form-group tc-form-group--full">
                    <label>Ghi chú / Hoạt động chi tiết</label>
                    <textarea 
                      className="tc-form-textarea"
                      style={{ minHeight: '80px' }}
                      value={loc.notes}
                      onChange={(e) => handleLocationChange(index, 'notes', e.target.value)}
                      placeholder="Mô tả các hoạt động tại đây..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="tc-tour-itinerary__empty">
            <h3>Chưa có lịch trình</h3>
            <p>Hãy thêm các địa điểm và hoạt động để khách du lịch nắm rõ lộ trình của tour.</p>
            <Button variant="primary" onClick={addLocation}>+ Thêm điểm đầu tiên</Button>
          </div>
        )}
      </div>

      {locations.length > 0 && (
        <button className="tc-tour-itinerary__add-btn" onClick={addLocation}>
          + Thêm điểm dừng chân mới
        </button>
      )}

      <div className="tc-tour-itinerary__footer">
        <Button variant="outline" onClick={() => navigate('/guide/tours')}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSave} isLoading={submitting}>
          Lưu lịch trình
        </Button>
      </div>
    </div>
  );
};

export default TourItineraryPage;
