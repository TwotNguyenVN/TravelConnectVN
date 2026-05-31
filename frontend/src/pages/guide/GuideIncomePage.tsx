import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock } from '../../components/common';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { useToast } from '../../contexts/ToastContext';
import './GuideIncomePage.css';

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

export const GuideIncomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Stats state
  const [stats, setStats] = useState({
    grossRevenue: 0,
    netRevenue: 0,
    passengerCount: 0,
    completedTours: 0,
    cancelledTours: 0,
    emptyTours: 0,
    totalTours: 0,
  });

  const [monthlySchedules, setMonthlySchedules] = useState<CombinedSchedule[]>([]);
  const [allSchedules, setAllSchedules] = useState<CombinedSchedule[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);

  // Month-Year Selection options (recent 12 months)
  const filterOptions = React.useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      options.push({
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`,
        dateObj: d
      });
    }
    return options;
  }, []);

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allSchedules.length > 0 || allRequests.length > 0) {
      calculateStats(selectedFilter, allSchedules, allRequests);
    }
  }, [selectedFilter, allSchedules, allRequests]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch toàn bộ các requests của HDV
      const reqRes = await tourRequestService.getGuideRequests({ limit: 1000 });
      let requestsList: any[] = [];
      if (reqRes.data && reqRes.data.data) {
        requestsList = reqRes.data.data;
        setAllRequests(requestsList);
      }

      // 2. Fetch toàn bộ các tour và lịch khởi hành của HDV
      const toursRes = await tourService.getMyGuidedTours({ limit: 100 });
      const schedulesList: CombinedSchedule[] = [];

      if (toursRes.success && toursRes.data?.data) {
        const toursList = toursRes.data.data;

        await Promise.all(
          toursList.map(async (t: any) => {
            try {
              const res = await tourService.getTourDetailForGuide(t.id);
              const tourDetail = res.data || res;
              (tourDetail.tour_schedules || []).forEach((s: any) => {
                const bookedCount = s.tour_requests?.reduce((sum: number, req: any) => sum + req.participant_count, 0) || 0;
                schedulesList.push({
                  id: s.id,
                  start_date: s.start_date,
                  price: Number(s.price),
                  max_participants: s.max_participants,
                  current_participants: bookedCount,
                  status: s.status,
                  tourId: t.id,
                  tourTitle: t.title,
                  tourCover: t.cover || (tourDetail.tour_images?.[0]?.image_url) || t.cover,
                });
              });
            } catch (err) {
              console.error(`Error fetching schedules for tour ${t.id}:`, err);
            }
          })
        );

        setAllSchedules(schedulesList);
      }
    } catch (error) {
      console.error('Error fetching income details:', error);
      toast.error('Không thể tải thông tin thu nhập');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (filterVal: string, schedules: CombinedSchedule[], requests: any[]) => {
    const [yearStr, monthStr] = filterVal.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1; // 0-indexed month

    // Lọc lịch trình trong tháng được chọn (theo local timezone)
    const filteredSchedules = schedules.filter(s => {
      const sDate = new Date(s.start_date);
      return sDate.getFullYear() === year && sDate.getMonth() === monthIndex;
    }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    setMonthlySchedules(filteredSchedules);

    // Tính toán số tour
    const completed = filteredSchedules.filter(s => s.status === 'completed').length;
    const cancelled = filteredSchedules.filter(s => s.status === 'cancelled').length;
    
    // Tour trống = Lịch có status available/full nhưng chưa có ai đăng ký (current_participants === 0)
    const empty = filteredSchedules.filter(s => 
      s.status !== 'cancelled' && s.status !== 'completed' && (s.current_participants || 0) === 0
    ).length;

    // Doanh thu gộp từ các tour ĐÃ HOÀN THÀNH trong tháng
    const completedSchedules = filteredSchedules.filter(s => s.status === 'completed');
    const gross = completedSchedules.reduce((sum, s) => sum + ((s.current_participants || 0) * s.price), 0);
    
    // Lượt khách tham gia tour của cả tháng (tất cả lịch trình không bị hủy)
    const activeSchedules = filteredSchedules.filter(s => s.status !== 'cancelled');
    const passengers = activeSchedules.reduce((sum, s) => sum + (s.current_participants || 0), 0);

    // Thực nhận = Doanh thu gộp trừ 10% phí vận hành của TravelConnect
    const net = gross * 0.9;

    setStats({
      grossRevenue: gross,
      netRevenue: net,
      passengerCount: passengers,
      completedTours: completed,
      cancelledTours: cancelled,
      emptyTours: empty,
      totalTours: filteredSchedules.length,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const getScheduleStatusLabel = (sch: CombinedSchedule) => {
    if (sch.status === 'cancelled') return <Badge variant="danger">Đã hủy</Badge>;
    if (sch.status === 'completed') return <Badge variant="success">Hoàn thành</Badge>;
    if (sch.status === 'ongoing' || sch.status === 'in_progress') {
      return <Badge variant="warning">Đang đi</Badge>;
    }
    
    const isToday = new Date().toDateString() === new Date(sch.start_date).toDateString();
    if (isToday) return <Badge variant="warning">Hôm nay</Badge>;

    const current = sch.current_participants || 0;
    if (current === 0) return <Badge variant="secondary">Trống khách</Badge>;
    if (current < sch.max_participants) return <Badge variant="primary">Đang gom khách</Badge>;
    return <Badge variant="success">Đủ người</Badge>;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingBlock />
      </PageContainer>
    );
  }

  return (
    <div className="guide-income-page animate-up">
      <PageContainer size="full" className="income-page-container">
        {/* Header */}
        <div className="page-header income-header-row">
          <div>
            <h1 className="page-title">💰 Thống kê thu nhập &amp; Hiệu suất</h1>
            <p className="page-subtitle">Theo dõi báo cáo doanh thu, số lượng hành khách tham gia và đánh giá hiệu suất tổ chức tour trong tháng.</p>
          </div>

          <div className="income-filter-select-container">
            <span className="filter-label">Chọn thời gian:</span>
            <select 
              className="income-filter-dropdown"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thống kê KPIs (Apple Dashboard Grid) */}
        <div className="income-kpi-grid">
          <Card className="income-kpi-card gross-revenue">
            <div className="kpi-icon">💰</div>
            <div className="kpi-body">
              <span className="kpi-title">Doanh thu gộp</span>
              <h2 className="kpi-value">{formatPrice(stats.grossRevenue)}</h2>
              <span className="kpi-desc">Tổng số tiền khách hàng đã thanh toán</span>
            </div>
          </Card>

          <Card className="income-kpi-card net-revenue">
            <div className="kpi-icon">💸</div>
            <div className="kpi-body">
              <span className="kpi-title">Thực nhận (Sau chiết khấu)</span>
              <h2 className="kpi-value">{formatPrice(stats.netRevenue)}</h2>
              <span className="kpi-desc">Đã khấu trừ 10% phí vận hành nền tảng</span>
            </div>
          </Card>

          <Card className="income-kpi-card passengers">
            <div className="kpi-icon">👥</div>
            <div className="kpi-body">
              <span className="kpi-title">Khách hàng tham gia</span>
              <h2 className="kpi-value">{stats.passengerCount} lượt</h2>
              <span className="kpi-desc">Tổng số lượt khách tham gia tour trong tháng</span>
            </div>
          </Card>

          <Card className="income-kpi-card performance">
            <div className="kpi-icon">📊</div>
            <div className="kpi-body">
              <span className="kpi-title">Hiệu suất tổ chức</span>
              <h2 className="kpi-value">
                {stats.totalTours > 0 
                  ? `${Math.round((stats.completedTours / stats.totalTours) * 100)}%` 
                  : '0%'
                }
              </h2>
              <span className="kpi-desc">Tỉ lệ hoàn thành trên tổng số lịch đã lên</span>
            </div>
          </Card>
        </div>

        {/* Thống kê Tour detail */}
        <div className="income-detailed-layout">
          {/* Card hiệu suất chi tiết */}
          <Card className="tour-stats-summary-card">
            <h3>📈 Tóm tắt hoạt động trong tháng</h3>
            
            <div className="tour-stats-flex">
              <div className="tour-stats-item">
                <span className="stat-circle completed"></span>
                <div className="stat-info">
                  <strong>{stats.completedTours} tour</strong>
                  <span>Hoàn thành chuyến đi</span>
                </div>
              </div>

              <div className="tour-stats-item">
                <span className="stat-circle cancelled"></span>
                <div className="stat-info">
                  <strong>{stats.cancelledTours} tour</strong>
                  <span>Chuyến đi bị hủy bỏ</span>
                </div>
              </div>

              <div className="tour-stats-item">
                <span className="stat-circle empty"></span>
                <div className="stat-info">
                  <strong>{stats.emptyTours} tour</strong>
                  <span>Tour trống (Chưa có khách)</span>
                </div>
              </div>

              <div className="tour-stats-item">
                <span className="stat-circle total"></span>
                <div className="stat-info">
                  <strong>{stats.totalTours} tour</strong>
                  <span>Tổng lịch trình khởi hành</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Bảng chi tiết Lịch khởi hành */}
          <Card className="income-table-card">
            <div className="table-card-header">
              <h2>📅 Chi tiết lịch trình &amp; Doanh thu trong tháng</h2>
            </div>

            {monthlySchedules.length === 0 ? (
              <div className="empty-table-state">
                <span className="empty-icon">📭</span>
                <p>Không có lịch trình khởi hành nào được thiết lập trong tháng này.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/guide/schedules')}
                >
                  ➕ Tạo lịch trình khởi hành ngay
                </Button>
              </div>
            ) : (
              <div className="table-responsive-container">
                <table className="income-detailed-table">
                  <thead>
                    <tr>
                      <th>Ngày khởi hành</th>
                      <th>Hình ảnh</th>
                      <th>Tên Tour du lịch</th>
                      <th>Số khách đặt</th>
                      <th>Giá tour/khách</th>
                      <th>Doanh thu gộp</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySchedules.map((sch) => {
                      const bookingsCount = sch.current_participants || 0;
                      const scheduleRevenue = sch.status === 'cancelled' ? 0 : bookingsCount * sch.price;
                      return (
                        <tr key={sch.id}>
                          <td>
                            <strong>
                              {new Date(sch.start_date).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </strong>
                          </td>
                          <td>
                            {sch.tourCover && (
                              <img 
                                src={sch.tourCover} 
                                alt={sch.tourTitle} 
                                className="table-tour-thumb"
                              />
                            )}
                          </td>
                          <td className="table-tour-title" title={sch.tourTitle}>
                            <strong>{sch.tourTitle}</strong>
                          </td>
                          <td>
                            <strong className={bookingsCount === 0 ? 'text-muted' : 'text-primary'}>
                              {bookingsCount} / {sch.max_participants}
                            </strong>
                          </td>
                          <td>{formatPrice(sch.price)}</td>
                          <td>
                            <strong className={scheduleRevenue > 0 ? 'text-success' : ''}>
                              {formatPrice(scheduleRevenue)}
                            </strong>
                          </td>
                          <td>
                            {getScheduleStatusLabel(sch)}
                          </td>
                          <td>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => navigate(`/guide/tours/${sch.tourId}/schedules/${sch.id}`)}
                            >
                              Chi tiết
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default GuideIncomePage;
