import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../../services/tourService';
import { useToast } from '../../../contexts/ToastContext';
import { Button } from '../../../components/common/Button/Button';
import { Modal } from '../../../components/common/Modal/Modal';
import GuideTourCalendar from './GuideTourCalendar';
import './TourSchedulesTab.css';

interface TourSchedulesTabProps {
  tourId: string;
}

export const TourSchedulesTab: React.FC<TourSchedulesTabProps> = ({ tourId }) => {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTourDetail();
  }, [tourId]);

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      const res = await tourService.getTourDetailForGuide(tourId);
      const data = res.data || res;
      setTour(data);
      if (data.price) setPrice(data.price);
      if (data.max_participants || data.maxParticipants) {
        setMaxParticipants(data.max_participants || data.maxParticipants);
      }
    } catch (error) {
      toast.error('Không thể tải lịch trình');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date, schedule: any) => {
    if (schedule) {
      navigate(`/guide/tours/${tourId}/schedules/${schedule.id}`);
      return;
    }
    
    setSelectedDate(date);
    setEditingSchedule(null);
    setPrice(tour?.price || 0);
    setMaxParticipants(tour?.max_participants || tour?.maxParticipants || 10);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedDate || price <= 0 || maxParticipants <= 0) {
      toast.warning('Vui lòng nhập giá và số chỗ hợp lệ');
      return;
    }

    try {
      setSaving(true);
      if (editingSchedule) {
        await tourService.updateTourSchedule(tourId, editingSchedule.id, {
          price,
          maxParticipants
        });
        toast.success('Cập nhật lịch khởi hành thành công');
      } else {
        // adjust timezone to local before saving to avoid drift
        const localDateString = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        await tourService.createTourSchedule(tourId, {
          startDate: localDateString,
          price,
          maxParticipants
        });
        toast.success('Thêm lịch khởi hành thành công');
      }
      setIsModalOpen(false);
      fetchTourDetail(); // refresh
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!editingSchedule) return;
    if (!window.confirm('Bạn có chắc muốn xóa lịch này không?')) return;

    try {
      setSaving(true);
      await tourService.deleteTourSchedule(tourId, editingSchedule.id);
      toast.success('Xóa lịch thành công');
      setIsModalOpen(false);
      fetchTourDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa lịch đã có người đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải lịch...</div>;
  if (!tour) return <div>Không tìm thấy dữ liệu</div>;

  const schedules = tour.tour_schedules || [];

  return (
    <div className="tc-tour-schedules-tab">
      <div className="tc-schedules-header">
        <h2>Quản lý lịch khởi hành</h2>
        <p>Chọn ngày trên lịch để mở hoặc cập nhật thông tin khởi hành.</p>
      </div>

      <div className="tc-schedules-calendar-container">
        <GuideTourCalendar 
          schedules={schedules} 
          onDateClick={handleDateClick} 
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? "Cập nhật lịch khởi hành" : "Thêm lịch khởi hành"}
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
            {editingSchedule && (
              <Button variant="danger" onClick={handleDeleteSchedule} disabled={saving}>
                Xóa lịch
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>Hủy</Button>
            <Button variant="primary" onClick={handleSaveSchedule} isLoading={saving}>Xác Nhận Mở</Button>
          </div>
        }
      >
        <div className="tc-schedule-modal-content">
          <div className="tc-form-group">
            <label>Ngày khởi hành</label>
            <input 
              type="text" 
              className="tc-form-input" 
              value={selectedDate ? selectedDate.toLocaleDateString('vi-VN') : ''} 
              disabled 
            />
          </div>
          <div className="tc-form-group">
            <label>Giá (VND)</label>
            <input 
              type="number" 
              className="tc-form-input" 
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))} 
              min={0}
              step={10000}
            />
          </div>
          <div className="tc-form-group">
            <label>Số lượng khách tối đa</label>
            <input 
              type="number" 
              className="tc-form-input" 
              value={maxParticipants} 
              onChange={(e) => setMaxParticipants(Number(e.target.value))} 
              min={1}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
