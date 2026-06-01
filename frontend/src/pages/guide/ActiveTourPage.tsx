import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock } from '../../components/common';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_AVATAR } from '../../constants/images';
import './ActiveTourPage.css';

interface CombinedSchedule {
  id: string;
  start_date: string | Date;
  price: number;
  max_participants: number;
  current_participants?: number;
  status: string;
  tourId: string;
  tourTitle: string;
  tourCover?: string;
  meetPoint?: string;
  meetAddress?: string;
  meetTime?: string;
}

interface Passenger {
  name: string;
  gender: string;
  dob: string;
  phone: string;
}

export const ActiveTourPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTour, setActiveTour] = useState<CombinedSchedule | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [candidateTours, setCandidateTours] = useState<CombinedSchedule[]>([]);

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setActiveTour(null);
      setRequests([]);
      setCandidateTours([]);

      const toursRes = await tourService.getMyGuidedTours({ limit: 100 });
      if (toursRes.success && toursRes.data?.data) {
        const toursList = toursRes.data.data;
        const allSchedules: CombinedSchedule[] = [];

        await Promise.all(
          toursList.map(async (t: any) => {
            try {
              const res = await tourService.getTourDetailForGuide(t.id);
              const tourDetail = res.data || res;
              (tourDetail.tour_schedules || []).forEach((s: any) => {
                const bookedCount = s.tour_requests?.reduce((sum: number, req: any) => sum + req.participant_count, 0) || 0;
                allSchedules.push({
                  id: s.id,
                  start_date: s.start_date,
                  price: Number(s.price),
                  max_participants: s.max_participants,
                  current_participants: bookedCount,
                  status: s.status,
                  tourId: t.id,
                  tourTitle: t.title,
                  tourCover: t.cover || (tourDetail.tour_images?.[0]?.image_url) || t.cover,
                  meetPoint: tourDetail.meet_point,
                  meetAddress: tourDetail.meet_address,
                  meetTime: tourDetail.meet_time,
                });
              });
            } catch (err) {
              console.error(`Error fetching schedules for tour ${t.id}:`, err);
            }
          })
        );

        // 1. Tìm tour đang diễn ra
        const ongoing = allSchedules.find(s => s.status === 'ongoing' || s.status === 'in_progress');

        if (ongoing) {
          setActiveTour(ongoing);
          // Fetch requests for this schedule
          const reqRes = await tourRequestService.getGuideRequests({ scheduleId: ongoing.id, limit: 100 });
          if (reqRes.data && reqRes.data.data) {
            const sortedData = [...reqRes.data.data].sort((a, b) => 
              new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
            );
            setRequests(sortedData);
          }
        } else {
          // 2. Tìm các tour sắp khởi hành hôm nay theo Local Timezone
          const todayStr = formatDateLocal(new Date());
          const candidates = allSchedules
            .filter(s => {
              if (s.status === 'completed' || s.status === 'cancelled') return false;
              const schDateStr = formatDateLocal(new Date(s.start_date));
              return schDateStr === todayStr;
            })
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
          
          setCandidateTours(candidates);
        }
      }
    } catch (error) {
      console.error('Error fetching active tour:', error);
      toast.error('Không thể tải thông tin hành trình');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTour = async (tourId: string, scheduleId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn BẮT ĐẦU hành trình này? Trạng thái tour sẽ được cập nhật thành Đang diễn ra.')) return;
    try {
      setIsSaving(true);
      await tourService.updateTourSchedule(tourId, scheduleId, { status: 'ongoing' });
      toast.success('Bắt đầu hành trình thành công! Chúc bạn có một chuyến đi an toàn.');
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu tour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteTour = async (tourId: string, scheduleId: string) => {
    if (!window.confirm('Xác nhận HOÀN THÀNH hành trình này? Trạng thái tour và các booking liên quan sẽ được cập nhật thành Đã hoàn thành.')) return;
    try {
      setIsSaving(true);
      await tourService.updateTourSchedule(tourId, scheduleId, { status: 'completed' });
      toast.success('Hành trình đã hoàn thành xuất sắc!');
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hoàn thành tour');
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
          const match = trimmed.match(/^\d+\.\s+([^(]+)\s*\(([^)]+)\)\s*(?:-\s*NS:\s*([^-]+))?\s*(?:-\s*SĐT:\s*(.+))?$/);
          if (match) {
            passengers.push({
              name: match[1].trim(),
              gender: match[2].trim(),
              dob: match[3] ? match[3].trim() : 'Không có',
              phone: match[4] ? match[4].trim() : 'Không có'
            });
          } else {
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

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    );
  }

  // --- TRƯỜNG HỢP: CHƯA CÓ TOUR NÀO ĐANG DIỄN RA ---
  if (!activeTour) {
    return (
      <div className="active-tour-page active-tour-page--empty">
        <PageContainer size="full" className="active-tour-fullscreen-container">
          <div className="no-active-tour-card animate-up">
            <div className="no-tour-illustration">🧭</div>
            <h2>Hiện tại chưa có tour nào được bắt đầu</h2>
            <p className="no-tour-lead-text">Trạng thái hành trình sẽ chuyển sang Đang diễn ra khi bạn kích hoạt chuyến đi.</p>
            
            {candidateTours.length > 0 ? (
              <div className="candidate-tours-section">
                <h3 className="section-title-candidates">Các tour khởi hành hôm nay của bạn:</h3>
                <div className="candidate-tours-grid">
                  {candidateTours.map(tour => {
                    const isNoPassengers = (tour.current_participants || 0) === 0;
                    return (
                      <Card 
                        key={tour.id} 
                        className="candidate-tour-card"
                        onClick={() => navigate(`/guide/tours/${tour.tourId}/schedules/${tour.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {tour.tourCover && (
                          <div className="candidate-tour-cover">
                            <img src={tour.tourCover} alt={tour.tourTitle} />
                          </div>
                        )}
                        <div className="candidate-tour-content">
                          <h4>{tour.tourTitle}</h4>
                          <div className="candidate-tour-meta">
                            <p>📅 Ngày khởi hành: <strong>{formatDate(tour.start_date)}</strong></p>
                            <p>👥 Khách hàng: <strong className={isNoPassengers ? 'text-danger-custom' : 'text-success-custom'}>{tour.current_participants} / {tour.max_participants} người</strong></p>
                            {tour.meetTime && <p>⏰ Giờ tập trung: <strong>{tour.meetTime}</strong></p>}
                            {tour.meetPoint && <p>📍 Điểm tập trung: <strong>{tour.meetPoint}</strong></p>}
                          </div>
                          <div className="candidate-tour-actions">
                            <Button 
                              variant={isNoPassengers ? "secondary" : "primary"} 
                              fullWidth
                              isLoading={isSaving}
                              disabled={isSaving || isNoPassengers}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartTour(tour.tourId, tour.id);
                              }}
                            >
                              {isNoPassengers ? '🔒 Chưa có người đăng ký' : '🚀 Bắt đầu Tour ngay'}
                            </Button>
                            {isNoPassengers && (
                              <p className="no-passengers-warning-text">
                                * Tour chưa có người đăng ký khởi hành, không thể bắt đầu.
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="no-candidates-msg">
                <p>Hôm nay bạn không có lịch trình khởi hành nào. Để thiết lập hoặc xem lịch khởi hành, vui lòng truy cập:</p>
                <div className="no-candidates-links">
                  <Button variant="outline" onClick={() => navigate('/guide/schedules')}>Xem Lịch trình khởi hành</Button>
                  <Button variant="secondary" onClick={() => navigate('/guide/tours')}>Quản lý Tour</Button>
                </div>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    );
  }

  // --- TRƯỜNG HỢP: CÓ TOUR ĐANG DIỄN RA ---
  const allPassengers = requests.flatMap(req => parsePassengersFromNote(req.note));

  return (
    <div className="active-tour-page">
      <PageContainer size="full">
        <div className="active-tour-header-container">
          <div>
            <div className="active-badge-row">
              <span className="live-indicator"></span>
              <span className="active-tour-tag">ĐANG DIỄN RA</span>
            </div>
            <h1 className="active-tour-title">{activeTour.tourTitle}</h1>
            <p className="active-tour-subtitle">Khởi hành: {formatDate(activeTour.start_date)}</p>
          </div>
          <div className="active-tour-header-actions">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/guide/tours/edit/${activeTour.tourId}?tab=schedules`)}
            >
              📅 Lịch trình Tour
            </Button>
            <Button 
              variant="primary" 
              className="btn-complete-active-tour"
              isLoading={isSaving}
              disabled={isSaving}
              onClick={() => handleCompleteTour(activeTour.tourId, activeTour.id)}
            >
              🏁 Hoàn thành Chuyến đi
            </Button>
          </div>
        </div>

        <div className="active-tour-layout">
          {/* Cột trái: Thông tin hành trình và tập trung */}
          <div className="active-tour-info-sidebar">
            <Card className="info-section-card">
              <h3>📍 Điểm tập trung</h3>
              <div className="info-meta-row">
                <span className="info-icon">🧭</span>
                <div>
                  <strong>{activeTour.meetPoint || 'Chưa thiết lập'}</strong>
                  {activeTour.meetAddress && <p className="address-detail">{activeTour.meetAddress}</p>}
                </div>
              </div>
              {activeTour.meetTime && (
                <div className="info-meta-row" style={{ marginTop: '16px' }}>
                  <span className="info-icon">⏰</span>
                  <div>
                    <strong>{activeTour.meetTime}</strong>
                    <p className="address-detail">Thời gian tập trung</p>
                  </div>
                </div>
              )}
            </Card>

            <Card className="info-section-card summary-stats-card">
              <h3>📊 Thống kê chuyến đi</h3>
              <div className="stat-item">
                <span>Số lượng khách:</span>
                <strong>{activeTour.current_participants} / {activeTour.max_participants} người</strong>
              </div>
              <div className="stat-item">
                <span>Tổng số Booking:</span>
                <strong>{requests.length} đơn hàng</strong>
              </div>
              <div className="stat-item">
                <span>Trạng thái:</span>
                <Badge variant="success">Đang dẫn</Badge>
              </div>
            </Card>
          </div>

          {/* Cột phải: Danh sách khách hàng và danh sách hành khách chi tiết */}
          <div className="active-tour-passengers-main">
            <Card className="passenger-main-card">
              <div className="passenger-card-header">
                <h2>👥 Danh sách Hành khách ({allPassengers.length} người)</h2>
              </div>
              
              {allPassengers.length === 0 ? (
                <div className="empty-passenger-list">
                  <span className="empty-icon">📭</span>
                  <p>Chưa có thông tin hành khách chi tiết được khai báo.</p>
                  <p className="helper-text">Thông tin hành khách sẽ hiển thị ở đây khi khách hàng khai báo trong ghi chú booking.</p>
                </div>
              ) : (
                <div className="passengers-table-container">
                  <table className="passengers-table-active">
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
                      {allPassengers.map((p, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{p.name}</strong></td>
                          <td>
                            <span className={`gender-tag gender-${p.gender === 'Nam' ? 'male' : 'female'}`}>
                              {p.gender}
                            </span>
                          </td>
                          <td>{p.dob}</td>
                          <td>
                            <a href={`tel:${p.phone}`} className="phone-link">📞 {p.phone}</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Danh sách các Booking chi tiết */}
            <div className="booking-details-section">
              <h2 className="section-title-bookings">📦 Chi tiết Booking ({requests.length})</h2>
              <div className="bookings-list-active">
                {requests.map((req) => (
                  <Card key={req.id} className="booking-item-card">
                    <div className="booking-item-header">
                      <div className="booking-user-info">
                        <img 
                          src={req.userAvatar || DEFAULT_AVATAR} 
                          alt="Avatar" 
                          className="booking-avatar" 
                        />
                        <div>
                          <strong>{req.userName || 'Khách hàng'}</strong>
                          <span className="booking-date-meta">Đăng ký ngày: {new Date(req.requestedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="booking-badge-group">
                        <span className="booking-pax-count">{req.participantCount} khách</span>
                        <span className={`booking-status-tag status-${req.status}`}>
                          {req.status === 'paid' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                        </span>
                      </div>
                    </div>
                    {req.note && (
                      <div className="booking-note-content">
                        <strong>Ghi chú từ khách:</strong>
                        <pre>{req.note}</pre>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default ActiveTourPage;
