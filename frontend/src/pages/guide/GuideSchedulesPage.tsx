import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageContainer, LoadingBlock } from '../../components/common';
import { tourService } from '../../services/tourService';
import GuideTourCalendar from './tabs/GuideTourCalendar';
import { Modal } from '../../components/common/Modal/Modal';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import './GuideSchedulesPage.css';

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
}

interface TourOption {
  id: string;
  title: string;
  cover?: string;
  defaultPrice: number;
  defaultMaxParticipants?: number;
}

// Step of the "create schedule" flow
type CreateStep = 'select-tour' | 'configure' | 'confirm';

const GuideSchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<CombinedSchedule[]>([]);
  const [tourOptions, setTourOptions] = useState<TourOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

  // --- View schedule modal state ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedules, setSelectedSchedules] = useState<CombinedSchedule[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // --- Create schedule flow state ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [createStep, setCreateStep] = useState<CreateStep>('select-tour');
  const [selectedTour, setSelectedTour] = useState<TourOption | null>(null);
  const [createPrice, setCreatePrice] = useState<number>(0);
  const [createMaxParticipants, setCreateMaxParticipants] = useState<number>(10);
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAllSchedules = async () => {
    try {
      setLoading(true);
      const toursRes = await tourService.getMyGuidedTours({ limit: 100 });
      if (toursRes.success && toursRes.data?.data) {
        const toursList = toursRes.data.data;

        // Build tour options list for the create flow
        // Only include tours that are published AND visible (not draft / hidden)
        const options: TourOption[] = toursList
          .filter((t: any) => t.businessStatus === 'published' && t.visibilityStatus === 'visible')
          .map((t: any) => ({
            id: t.id,
            title: t.title,
            cover: t.cover,
            defaultPrice: Number(t.price) || 0,
            defaultMaxParticipants: t.maxParticipants || 10,
          }));
        setTourOptions(options);

        const details = await Promise.all(
          toursList.map(async (t: any) => {
            try {
              const res = await tourService.getTourDetailForGuide(t.id);
              const tourDetail = res.data || res;
              const tourSchedules = (tourDetail.tour_schedules || []).map((s: any) => {
                const bookedCount = s.tour_requests?.reduce((sum: number, req: any) => sum + req.participant_count, 0) || 0;
                return {
                  id: s.id,
                  start_date: s.start_date,
                  price: Number(s.price),
                  max_participants: s.max_participants,
                  current_participants: bookedCount,
                  status: s.status,
                  tourId: t.id,
                  tourTitle: t.title,
                  tourCover: t.cover || (tourDetail.tour_images?.[0]?.image_url) || t.cover,
                };
              });
              return tourSchedules;
            } catch (err) {
              console.error(`Error fetching schedules for tour ${t.id}:`, err);
              return [];
            }
          })
        );
        const combined = details.flat();
        setSchedules(combined);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Không thể tải danh sách lịch trình');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSchedules();
  }, []);

// Helper to format date in YYYY-MM-DD using local timezone
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  // --- View schedule detail handler (existing) ---
  const handleDateClick = (date: Date, _schedule?: any) => {
    const dateString = formatDateLocal(date);
    const daySchedules = schedules.filter(s => {
      const sDate = new Date(s.start_date);
      const sDateString = formatDateLocal(sDate);
      return sDateString === dateString;
    });
    setSelectedDate(date);
    setSelectedSchedules(daySchedules);
    setIsViewModalOpen(true);
  };

  // --- Create schedule handlers ---
  const handleCreateSchedule = (date: Date) => {
    setCreateDate(date);
    setSelectedTour(null);
    setCreatePrice(0);
    setCreateMaxParticipants(10);
    setCreateStep('select-tour');
    setIsCreateModalOpen(true);
  };

  const handleSelectTour = (tour: TourOption) => {
    setSelectedTour(tour);
    setCreatePrice(tour.defaultPrice);
    setCreateMaxParticipants(tour.defaultMaxParticipants || 10);
    setCreateStep('configure');
  };

  const handleConfigureConfirm = () => {
    if (createPrice <= 0) {
      toast.error('Giá tour phải lớn hơn 0');
      return;
    }
    if (createMaxParticipants < 1) {
      toast.error('Số lượng người tối thiểu là 1');
      return;
    }
    setCreateStep('confirm');
  };

  const handleFinalConfirm = async () => {
    if (!selectedTour || !createDate) return;
    try {
      setIsCreating(true);
      const startDate = formatDateLocal(createDate);
      await tourService.createTourSchedule(selectedTour.id, {
        startDate,
        price: createPrice,
        maxParticipants: createMaxParticipants,
      });
      toast.success(`Đã tạo lịch khởi hành ngày ${createDate.toLocaleDateString('vi-VN')} cho tour "${selectedTour.title}"!`);
      setIsCreateModalOpen(false);
      await fetchAllSchedules();
    } catch (err: any) {
      console.error('Error creating schedule:', err);
      toast.error(err?.response?.data?.message || 'Không thể tạo lịch trình. Vui lòng thử lại.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedTour(null);
    setCreateStep('select-tour');
  };

  // --- Status helpers ---
  const getScheduleStatus = (sch: CombinedSchedule) => {
    if (!sch) return 'empty';
    if (sch.status === 'cancelled') return 'cancelled';
    if (sch.status === 'completed') return 'completed';
    if (sch.status === 'ongoing' || sch.status === 'in_progress') return 'ongoing';
    if (sch.status === 'paused') return 'paused';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(sch.start_date);
    startDate.setHours(0, 0, 0, 0);

    const current = sch.current_participants || 0;
    const max = sch.max_participants;

    if (startDate < today && current === 0) return 'expired';
    if (current === 0) return 'empty';
    if (current < max) return 'has-guests';
    return 'full';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'cancelled') return 'Đã hủy';
    if (status === 'completed') return 'Đã hoàn thành';
    if (status === 'expired') return 'Quá hạn';
    if (status === 'ongoing') return 'Đang diễn ra';
    if (status === 'paused') return 'Tạm ngưng';
    if (status === 'empty') return 'Chưa có khách';
    if (status === 'has-guests') return 'Đang có khách';
    if (status === 'full') return 'Đã đủ người';
    return 'Hoạt động';
  };

  // --- Weekly view helpers ---
  const getStartOfWeek = (date: Date) => {
    const temp = new Date(date);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(temp.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekDays = () => {
    const start = getStartOfWeek(currentWeekDate);
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(start);
      d.setDate(start.getDate() + idx);
      return d;
    });
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekDate);
    prev.setDate(currentWeekDate.getDate() - 7);
    setCurrentWeekDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekDate);
    next.setDate(currentWeekDate.getDate() + 7);
    setCurrentWeekDate(next);
  };

  const handleCurrentWeek = () => setCurrentWeekDate(new Date());

  const getDayName = (dayIndex: number) => {
    const names = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    return names[dayIndex];
  };

  const weekDays = getWeekDays();
  const startOfWeek = weekDays[0];
  const endOfWeek = weekDays[6];

  // --- Create Modal title based on step ---
  const getCreateModalTitle = () => {
    if (!createDate) return 'Tạo lịch khởi hành';
    const dateLabel = createDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (createStep === 'select-tour') return `📅 Chọn tour — ${dateLabel}`;
    if (createStep === 'configure') return `⚙️ Cấu hình lịch — ${selectedTour?.title}`;
    return `✅ Xác nhận tạo lịch`;
  };

  return (
    <div className="guide-schedules-container">
      <PageContainer size="full" className="schedules-page-container">
        <div className="page-header schedules-header-row">
          <div>
            <h1 className="page-title">📅 Quản lý Lịch trình Khởi hành</h1>
            <p className="page-subtitle">Xem lịch khởi hành tổng hợp của toàn bộ các tour du lịch bạn đang dẫn dắt. Nhấn vào ngày trống để tạo lịch mới.</p>
          </div>

          <div className="view-mode-toggle-group">
            <button
              className={`view-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Xem theo tháng
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Xem theo tuần
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingBlock />
        ) : viewMode === 'month' ? (
          <Card className="schedules-calendar-card">
            <GuideTourCalendar
              schedules={schedules}
              onDateClick={handleDateClick}
              onCreateSchedule={handleCreateSchedule}
            />
          </Card>
        ) : (
          <div className="weekly-view-container animate-up">
            <div className="weekly-nav-bar">
              <div className="weekly-nav-actions">
                <Button variant="outline" size="small" onClick={handlePrevWeek}>
                  &larr; Tuần trước
                </Button>
                <Button variant="secondary" size="small" onClick={handleCurrentWeek}>
                  Tuần này
                </Button>
                <Button variant="outline" size="small" onClick={handleNextWeek}>
                  Tuần sau &rarr;
                </Button>
              </div>
              <h3 className="weekly-range-title">
                {startOfWeek.toLocaleDateString('vi-VN')} - {endOfWeek.toLocaleDateString('vi-VN')}
              </h3>
            </div>

            <div className="weekly-grid">
              {weekDays.map((day, idx) => {
                const dateString = formatDateLocal(day);
                const daySchedules = schedules.filter(s => {
                  const sDate = new Date(s.start_date);
                  const sDateString = formatDateLocal(sDate);
                  return sDateString === dateString;
                });

                const isToday = new Date().toDateString() === day.toDateString();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isFuture = day >= today;

                return (
                  <div key={idx} className={`weekly-day-column ${isToday ? 'is-today' : ''}`}>
                    <div className="weekly-day-header">
                      <span className="day-name">{getDayName(idx)}</span>
                      <span className="day-date">{day.getDate()}/{day.getMonth() + 1}</span>
                    </div>

                    <div className="weekly-day-content">
                      {daySchedules.length === 0 ? (
                        <div
                          className={`weekly-empty-day ${isFuture ? 'weekly-empty-day--clickable' : ''}`}
                          onClick={() => isFuture && handleCreateSchedule(day)}
                          title={isFuture ? 'Click để tạo lịch khởi hành' : undefined}
                        >
                          <span className="empty-icon">{isFuture ? '➕' : '📅'}</span>
                          <span>{isFuture ? 'Tạo lịch mới' : 'Không có lịch'}</span>
                        </div>
                      ) : (
                        daySchedules.map(sch => {
                          const fillPercent = Math.min(100, Math.round(((sch.current_participants || 0) / sch.max_participants) * 100));
                          const computedStatus = getScheduleStatus(sch);
                          return (
                            <div
                              key={sch.id}
                              className={`weekly-schedule-card status-${computedStatus}`}
                              onClick={() => handleDateClick(day)}
                              title={`${sch.tourTitle} - Click để xem chi tiết`}
                            >
                              {sch.tourCover && (
                                <div className="weekly-sch-image">
                                  <img src={sch.tourCover} alt={sch.tourTitle} />
                                  <span className={`status-badge status-${computedStatus}`}>
                                    {getStatusLabel(computedStatus)}
                                  </span>
                                </div>
                              )}
                              <div className="weekly-sch-body">
                                <div className="weekly-sch-title" title={sch.tourTitle}>{sch.tourTitle}</div>
                                <div className="weekly-sch-info">
                                  <span className="sch-price">💵 {sch.price.toLocaleString('vi-VN')} đ</span>
                                  <span className="sch-capacity">👥 {sch.current_participants || 0}/{sch.max_participants}</span>
                                </div>
                                <div className="sch-progress-bar-container">
                                  <div className="sch-progress-bar" style={{ width: `${fillPercent}%` }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="weekly-calendar-legend">
              <div className="tc-legend-item status-empty">
                <span className="tc-dot tc-dot--empty"></span> Chưa có khách
              </div>
              <div className="tc-legend-item status-has-guests">
                <span className="tc-dot tc-dot--has-guests"></span> Đang có khách
              </div>
              <div className="tc-legend-item status-full">
                <span className="tc-dot tc-dot--full"></span> Đã đủ người
              </div>
              <div className="tc-legend-item status-completed">
                <span className="tc-dot" style={{ backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>✓</span> Đã hoàn thành
              </div>
              <div className="tc-legend-item status-paused">
                <span className="tc-dot" style={{ backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16"></rect>
                    <rect x="15" y="4" width="4" height="16"></rect>
                  </svg>
                </span> Tạm ngưng
              </div>
              <div className="tc-legend-item status-cancelled">
                <span className="tc-dot" style={{ backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px', fontWeight: 'bold' }}>✕</span> Đã hủy
              </div>
              <div className="tc-legend-item status-ongoing">
                <span className="tc-dot" style={{ backgroundColor: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>
                  <span className="tc-ongoing-dot-pulse"></span>
                </span> Đang diễn ra
              </div>
              <div className="tc-legend-item status-expired">
                <span className="tc-dot tc-dot--expired" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>⌛</span> Quá hạn
              </div>
            </div>
          </div>
        )}
      </PageContainer>

      {/* ===== VIEW SCHEDULE MODAL ===== */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Lịch trình ngày ${selectedDate ? selectedDate.toLocaleDateString('vi-VN') : ''}`}
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
        }
      >
        <div className="day-schedules-list">
          {selectedSchedules.length === 0 ? (
            <div className="no-schedules-prompt">
              <p>Chưa có lịch khởi hành nào được thiết lập cho ngày này.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Để mở lịch, vui lòng truy cập vào <strong>Quản lý Tour</strong>, chọn tour cụ thể và thêm lịch khởi hành.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Button variant="primary" onClick={() => navigate('/guide/tours')}>Đi đến Quản lý Tour</Button>
              </div>
            </div>
          ) : (
            selectedSchedules.map(sch => {
              const computedStatus = getScheduleStatus(sch);
              return (
                <div key={sch.id} className="day-schedule-item-card">
                  <div className="schedule-item-header">
                    <h4 className="tour-title">{sch.tourTitle}</h4>
                    <span className={`status-tag status-${computedStatus}`}>
                      {getStatusLabel(computedStatus)}
                    </span>
                  </div>
                  <div className="schedule-item-details">
                    <div className="detail-row">
                      <span className="label">Giá tour:</span>
                      <span className="value">{sch.price.toLocaleString()} đ</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Số lượng khách:</span>
                      <span className="value">{sch.current_participants || 0} / {sch.max_participants}</span>
                    </div>
                  </div>
                  <div className="schedule-item-actions">
                    <Button
                      variant="outline"
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/guide/tours/${sch.tourId}/schedules/${sch.id}`)}
                    >
                      Quản lý &amp; Cập nhật
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>

      {/* ===== CREATE SCHEDULE MODAL ===== */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={getCreateModalTitle()}
        size="medium"
      >
        {/* Step 1: Select Tour */}
        {createStep === 'select-tour' && (
          <div className="create-schedule-step">
            <p className="create-step-description">
              Chọn tour bạn muốn tạo lịch khởi hành cho ngày <strong>{createDate?.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>:
            </p>

            {tourOptions.length === 0 ? (
              <div className="no-tours-prompt">
                <span style={{ fontSize: '2.5rem' }}>🔍</span>
                <p style={{ margin: 0, fontWeight: 600 }}>Không có tour nào đủ điều kiện</p>
                <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6 }}>
                  Chỉ các tour đã được <strong>đăng tải</strong> và <strong>hiển thị công khai</strong> mới có thể tạo lịch khởi hành.<br />
                  Tour đang ở trạng thái <em>nháp</em> hoặc <em>bị ẩn</em> sẽ không xuất hiện ở đây.
                </p>
                <Button variant="primary" onClick={() => { handleCloseCreateModal(); navigate('/guide/tours'); }}>
                  Đi đến Quản lý Tour
                </Button>
              </div>
            ) : (
              <div className="tour-options-list">
                {tourOptions.map(tour => (
                  <div
                    key={tour.id}
                    className="tour-option-card"
                    onClick={() => handleSelectTour(tour)}
                  >
                    {tour.cover && (
                      <img src={tour.cover} alt={tour.title} className="tour-option-cover" />
                    )}
                    <div className="tour-option-info">
                      <div className="tour-option-title">{tour.title}</div>
                      <div className="tour-option-price">
                        Giá gốc: <strong>{tour.defaultPrice.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    </div>
                    <div className="tour-option-arrow">›</div>
                  </div>
                ))}
              </div>
            )}

            <div className="create-step-footer">
              <Button variant="outline" onClick={handleCloseCreateModal}>Hủy</Button>
            </div>
          </div>
        )}

        {/* Step 2: Configure price & participants */}
        {createStep === 'configure' && selectedTour && (
          <div className="create-schedule-step">
            <div className="selected-tour-preview">
              {selectedTour.cover && (
                <img src={selectedTour.cover} alt={selectedTour.title} className="selected-tour-cover" />
              )}
              <div>
                <div className="selected-tour-name">{selectedTour.title}</div>
                <div className="selected-tour-meta">
                  📅 Ngày: <strong>{createDate?.toLocaleDateString('vi-VN')}</strong>
                </div>
              </div>
            </div>

            <div className="configure-form">
              <div className="form-field">
                <label htmlFor="schedule-price" className="form-label">
                  💰 Giá tour (đ)
                  {selectedTour.defaultPrice > 0 && (
                    <span className="form-label-hint">Giá gốc: {selectedTour.defaultPrice.toLocaleString('vi-VN')} đ</span>
                  )}
                </label>
                <input
                  id="schedule-price"
                  type="number"
                  min={0}
                  step={10000}
                  value={createPrice}
                  onChange={e => setCreatePrice(Number(e.target.value))}
                  className="form-input"
                  placeholder="Nhập giá tour..."
                />
                {selectedTour.defaultPrice > 0 && createPrice !== selectedTour.defaultPrice && (
                  <span className={`price-diff ${createPrice > selectedTour.defaultPrice ? 'price-diff--up' : 'price-diff--down'}`}>
                    {createPrice > selectedTour.defaultPrice ? '▲' : '▼'} {Math.abs(createPrice - selectedTour.defaultPrice).toLocaleString('vi-VN')} đ so với giá gốc
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="schedule-max" className="form-label">
                  👥 Số lượng người tối đa
                </label>
                <input
                  id="schedule-max"
                  type="number"
                  min={1}
                  max={200}
                  value={createMaxParticipants}
                  onChange={e => setCreateMaxParticipants(Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="create-step-footer">
              <Button variant="outline" onClick={() => setCreateStep('select-tour')}>← Quay lại</Button>
              <Button variant="primary" onClick={handleConfigureConfirm}>Tiếp theo →</Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {createStep === 'confirm' && selectedTour && createDate && (
          <div className="create-schedule-step create-schedule-confirm">
            <div className="confirm-icon">✅</div>
            <h3 className="confirm-title">Xác nhận tạo lịch khởi hành?</h3>

            <div className="confirm-details">
              <div className="confirm-row">
                <span className="confirm-label">🗺️ Tour:</span>
                <span className="confirm-value">{selectedTour.title}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">📅 Ngày khởi hành:</span>
                <span className="confirm-value">
                  {createDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">💰 Giá:</span>
                <span className="confirm-value confirm-value--price">{createPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">👥 Số người tối đa:</span>
                <span className="confirm-value">{createMaxParticipants} người</span>
              </div>
            </div>

            <div className="create-step-footer">
              <Button variant="outline" onClick={() => setCreateStep('configure')}>← Chỉnh sửa</Button>
              <Button
                variant="primary"
                onClick={handleFinalConfirm}
                isLoading={isCreating}
                disabled={isCreating}
              >
                🚀 Xác nhận tạo lịch
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GuideSchedulesPage;
