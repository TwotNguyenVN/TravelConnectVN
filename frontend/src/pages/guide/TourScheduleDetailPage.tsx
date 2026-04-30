import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { DEFAULT_AVATAR } from '../../constants/images';
import './TourScheduleDetailPage.css';

interface Passenger {
  name: string;
  gender: string;
  dob: string;
  phone: string;
}

export const TourScheduleDetailPage: React.FC = () => {
  const { id: tourId, scheduleId } = useParams<{ id: string; scheduleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tour, setTour] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tourId, scheduleId]);

  const fetchData = async () => {
    if (!tourId || !scheduleId) return;
    try {
      setLoading(true);
      
      // Fetch Tour and Schedule
      const tourRes = await tourService.getTourDetailForGuide(tourId);
      const tourData = tourRes.data || tourRes;
      setTour(tourData);
      
      const foundSchedule = tourData.tour_schedules?.find((s: any) => s.id === scheduleId);
      if (foundSchedule) {
        setSchedule(foundSchedule);
        setMaxParticipants(foundSchedule.max_participants ?? foundSchedule.maxParticipants);
      } else {
        toast.error('Không tìm thấy lịch khởi hành');
        navigate(`/guide/tours/edit/${tourId}`);
        return;
      }

      // Fetch Requests for this schedule
      const reqRes = await tourRequestService.getGuideRequests({ scheduleId, limit: 100 });
      if (reqRes.data && reqRes.data.data) {
        // Sắp xếp theo thời gian đăng ký sớm nhất lên đầu
        const sortedData = [...reqRes.data.data].sort((a, b) => 
          new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
        );
        setRequests(sortedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!scheduleId || !tourId) return;
    try {
      setIsSaving(true);
      await tourService.updateTourSchedule(tourId, scheduleId, {
        maxParticipants: Number(maxParticipants)
      });
      toast.success('Cập nhật số lượng khách thành công!');
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi cập nhật lịch trình');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleId || !tourId) return;
    if (totalRegistered > 0) {
      toast.error('Không thể xóa lịch trình đã có khách đăng ký');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch khởi hành này?')) return;

    try {
      setIsSaving(true);
      await tourService.deleteTourSchedule(tourId, scheduleId);
      toast.success('Xóa lịch khởi hành thành công!');
      navigate(`/guide/tours/edit/${tourId}?tab=schedules`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa lịch khởi hành');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteSchedule = () => {
    setIsCompleteModalOpen(true);
  };

  const confirmCompleteSchedule = async () => {
    if (!scheduleId || !tourId) return;
    
    try {
      setIsSaving(true);
      await tourService.updateTourSchedule(tourId, scheduleId, {
        status: 'completed'
      });
      toast.success('Đã đánh dấu tour hoàn thành!');
      setIsCompleteModalOpen(false);
      navigate(`/guide/tours/edit/${tourId}?tab=schedules`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAccepting = async () => {
    if (!scheduleId || !tourId) return;
    
    const isCurrentlyAvailable = schedule.status === 'available';
    const newStatus = isCurrentlyAvailable ? 'full' : 'available';
    const actionText = isCurrentlyAvailable ? 'ngưng nhận thêm khách' : 'mở nhận khách trở lại';

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} cho lịch khởi hành này?`)) return;

    try {
      setIsSaving(true);
      await tourService.updateTourSchedule(tourId, scheduleId, {
        status: newStatus
      });
      toast.success(`Đã ${actionText} thành công!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setIsSaving(false);
    }
  };

  const parsePassengersFromNote = (note: string): Passenger[] => {
    if (!note) return [];
    const lines = note.split('\n');
    const passengers: Passenger[] = [];
    let isPassengerSection = false;
    
    for (const line of lines) {
      if (line.includes('- Danh sách khách')) {
        isPassengerSection = true;
        continue;
      }
      if (isPassengerSection) {
        const trimmed = line.trim();
        if (trimmed.match(/^\d+\./)) {
          // Format: 1. Nguyễn Văn A (Nam) - NS: 01/01/1990 - SĐT: 0123456789
          const match = trimmed.match(/^\d+\.\s+([^(]+)\s*\(([^)]+)\)\s*(?:-\s*NS:\s*([^-]+))?\s*(?:-\s*SĐT:\s*(.+))?$/);
          if (match) {
            passengers.push({
              name: match[1].trim(),
              gender: match[2].trim(),
              dob: match[3] ? match[3].trim() : 'Không có',
              phone: match[4] ? match[4].trim() : 'Không có'
            });
          } else {
            // Fallback parsing just in case
            passengers.push({
              name: trimmed.replace(/^\d+\.\s*/, ''),
              gender: 'N/A',
              dob: 'N/A',
              phone: 'N/A'
            });
          }
        } else if (trimmed === '') {
          isPassengerSection = false;
        }
      }
    }
    return passengers;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="tc-schedule-detail-loader">Đang tải dữ liệu...</div>;
  }

  if (!tour || !schedule) {
    return <div className="tc-schedule-detail-error">Không tìm thấy thông tin.</div>;
  }

  const totalRegistered = requests.reduce((sum, req) => sum + (req.participantCount || 0), 0);

  return (
    <div className="tc-schedule-detail-page">
      <div className="tc-schedule-detail-header">
        <div className="tc-header-top">
          <button className="tc-btn-back-manage" onClick={() => navigate(`/guide/tours/edit/${tourId}?tab=schedules`)}>
            ← Quay lại Lịch trình Tour
          </button>
          <div className="tc-header-actions">
            <Button 
              variant="outline" 
              className="tc-btn-delete-schedule"
              onClick={handleDeleteSchedule}
              disabled={isSaving || totalRegistered > 0}
            >
              Xóa lịch trình
            </Button>
            <Button 
              variant="outline" 
              onClick={handleToggleAccepting}
              disabled={isSaving || schedule.status === 'completed'}
            >
              {schedule.status === 'available' ? 'Ngưng Nhận Thêm' : 'Mở Nhận Lại'}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCompleteSchedule}
              disabled={isSaving || schedule.status === 'completed'}
            >
              {schedule.status === 'completed' ? 'Đã hoàn thành' : 'Hoàn thành Tour'}
            </Button>
          </div>
        </div>
        <h1 className="tc-schedule-detail-title">
          Chi tiết khởi hành: {formatDate(schedule.start_date || schedule.startDate)}
          {schedule.status === 'completed' && <span className="tc-status-completed-tag">Đã hoàn thành</span>}
          {schedule.status === 'full' && <span className="tc-status-full-tag">Ngưng nhận khách</span>}
        </h1>
        <p className="tc-schedule-detail-subtitle">{tour.title}</p>
      </div>

      <div className="tc-schedule-detail-content">
        {/* L/R Layout: Left is info/edit, Right is passenger lists */}
        <div className="tc-schedule-sidebar">
          <div className="tc-schedule-card">
            <h2 className="tc-schedule-card-title">Cấu hình Lịch Khởi Hành</h2>
            <div className="tc-schedule-form">
              <div className="tc-form-group">
                <label>Giá Tour (đ/khách)</label>
                <input 
                  type="text" 
                  value={(schedule.price || 0).toLocaleString() + ' đ'} 
                  disabled 
                  className="tc-input-disabled"
                />
                <span className="tc-form-hint">Giá được thiết lập cố định khi tạo lịch.</span>
              </div>
              <div className="tc-form-group">
                <label>Số lượng khách tối đa</label>
                <input 
                  type="number" 
                  value={maxParticipants} 
                  onChange={(e) => setMaxParticipants(Number(e.target.value))} 
                  min="1"
                  max="50"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={handleUpdateSchedule} 
                disabled={isSaving || maxParticipants === (schedule.max_participants || schedule.maxParticipants)}
                fullWidth
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </Button>
            </div>
          </div>
          
          <div className="tc-schedule-card tc-schedule-stats">
            <h2 className="tc-schedule-card-title">Thống kê</h2>
            <div className="tc-stat-row">
              <span>Đã đăng ký:</span>
              <span className="tc-stat-value tc-text-primary">{totalRegistered} khách</span>
            </div>
            <div className="tc-stat-row">
              <span>Số chỗ trống:</span>
              <span className="tc-stat-value tc-text-success">{Math.max(0, maxParticipants - totalRegistered)} chỗ</span>
            </div>
            <div className="tc-stat-row">
              <span>Tổng thu dự kiến:</span>
              <span className="tc-stat-value">{(totalRegistered * schedule.price).toLocaleString()} đ</span>
            </div>
          </div>
        </div>

        <div className="tc-schedule-main">
          <h2 className="tc-main-title">Danh sách Khách Hàng ({requests.length} Booking)</h2>
          
          {requests.length === 0 ? (
            <div className="tc-empty-state">
              <span className="tc-empty-icon">📭</span>
              <p>Chưa có khách hàng nào đăng ký cho ngày khởi hành này.</p>
            </div>
          ) : (
            <div className="tc-requests-list">
              {requests.map((req) => {
                const passengers = parsePassengersFromNote(req.note);
                const paymentProgress = req.paymentStatus;
                
                return (
                  <div key={req.id} className="tc-request-card">
                    <div className="tc-request-header">
                      <div className="tc-request-user">
                        <img 
                          src={req.userAvatar || DEFAULT_AVATAR} 
                          alt="Avatar" 
                          className="tc-request-avatar" 
                        />
                        <div>
                          <strong>{req.userName || 'Khách hàng'}</strong>
                          <span className="tc-request-count">{req.participantCount} khách</span>
                        </div>
                      </div>
                      <div className="tc-request-status">
                        <span className={`tc-badge tc-badge-${req.status}`}>
                          {req.status === 'paid' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                        </span>
                        <span className="tc-payment-tag">{paymentProgress}</span>
                      </div>
                    </div>
                    
                    {passengers.length > 0 ? (
                      <div className="tc-passengers-table-wrapper">
                        <table className="tc-passengers-table">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Họ và Tên</th>
                              <th>Giới tính</th>
                              <th>Ngày sinh</th>
                              <th>Số điện thoại</th>
                            </tr>
                          </thead>
                          <tbody>
                            {passengers.map((p, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td><strong>{p.name}</strong></td>
                                <td>{p.gender}</td>
                                <td>{p.dob}</td>
                                <td>{p.phone}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="tc-note-fallback">
                        <strong>Ghi chú Booking:</strong>
                        <pre>{req.note}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Completion */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Xác nhận hoàn thành Tour"
        size="small"
        footer={
          <div className="tc-modal-footer-actions">
            <Button 
              variant="outline" 
              onClick={() => setIsCompleteModalOpen(false)}
              disabled={isSaving}
            >
              Hủy bỏ
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmCompleteSchedule}
              disabled={isSaving}
            >
              {isSaving ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
            </Button>
          </div>
        }
      >
        <div className="tc-complete-confirm-body">
          <div className="tc-confirm-icon">✅</div>
          <p>Bạn có chắc chắn muốn đánh dấu lịch trình khởi hành này là <strong>Đã hoàn thành</strong>?</p>
          <p className="tc-confirm-hint">Hành động này sẽ cập nhật trạng thái tour và không thể hoàn tác.</p>
        </div>
      </Modal>
    </div>
  );
};

export default TourScheduleDetailPage;
