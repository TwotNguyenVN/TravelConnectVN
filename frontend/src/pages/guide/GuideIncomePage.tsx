import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Badge, Button, LoadingBlock } from '../../components/common';
import { tourService } from '../../services/tourService';
import tourRequestService from '../../services/tourRequestService';
import { useToast } from '../../contexts/ToastContext';
import './GuideIncomePage.css';

import * as XLSX from 'xlsx';

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

interface DetailedReportItem {
  id: string;
  date: string;
  tourTitle: string;
  price: number;
  participants: number;
  maxParticipants: number;
  grossRevenue: number;
  systemFee: number;
  netRevenue: number;
  status: string;
  tourId: string;
  start_date: string | Date;
  current_participants?: number;
  max_participants: number;
}

interface TourReportItem {
  tourId: string;
  tourTitle: string;
  avgPrice: number;
  grossRevenue: number;
  systemFee: number;
  netRevenue: number;
  passengerCount: number;
  totalSchedules: number;
  completedTours: number;
  cancelledTours: number;
}

export const GuideIncomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  
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
  const [activeTab, setActiveTab] = useState<'overview' | 'report'>('overview');
  const [reportView, setReportView] = useState<'monthly' | 'tour'>('monthly');

  const detailedReportData = React.useMemo<DetailedReportItem[]>(() => {
    return monthlySchedules.map(s => {
      const bookingsCount = s.current_participants || 0;
      const gross = s.status === 'completed' ? bookingsCount * s.price : 0;
      const fee = gross * 0.1;
      const net = gross * 0.9;
      return {
        id: s.id,
        date: new Date(s.start_date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        tourTitle: s.tourTitle,
        price: s.price,
        participants: bookingsCount,
        maxParticipants: s.max_participants,
        grossRevenue: gross,
        systemFee: fee,
        netRevenue: net,
        status: s.status,
        tourId: s.tourId,
        start_date: s.start_date,
        current_participants: bookingsCount,
        max_participants: s.max_participants
      };
    });
  }, [monthlySchedules]);

  const detailedTotals = React.useMemo(() => {
    return detailedReportData.reduce((acc, item) => {
      acc.participants += item.participants;
      acc.grossRevenue += item.grossRevenue;
      acc.systemFee += item.systemFee;
      acc.netRevenue += item.netRevenue;
      return acc;
    }, {
      participants: 0,
      grossRevenue: 0,
      systemFee: 0,
      netRevenue: 0
    });
  }, [detailedReportData]);

  const tourReportData = React.useMemo<TourReportItem[]>(() => {
    const groups: Record<string, CombinedSchedule[]> = {};
    monthlySchedules.forEach(s => {
      if (!groups[s.tourId]) {
        groups[s.tourId] = [];
      }
      groups[s.tourId].push(s);
    });

    return Object.keys(groups).map(tourId => {
      const tourSchedules = groups[tourId];
      const totalSchedules = tourSchedules.length;
      const completed = tourSchedules.filter(s => s.status === 'completed').length;
      const cancelled = tourSchedules.filter(s => s.status === 'cancelled').length;
      const gross = tourSchedules.filter(s => s.status === 'completed').reduce((sum, s) => sum + ((s.current_participants || 0) * s.price), 0);
      const fee = gross * 0.1;
      const net = gross * 0.9;
      const passengers = tourSchedules.filter(s => s.status !== 'cancelled').reduce((sum, s) => sum + (s.current_participants || 0), 0);
      
      const totalPrice = tourSchedules.reduce((sum, s) => sum + s.price, 0);
      const avgPrice = totalSchedules > 0 ? Math.round(totalPrice / totalSchedules) : 0;

      return {
        tourId,
        tourTitle: tourSchedules[0].tourTitle,
        avgPrice,
        grossRevenue: gross,
        systemFee: fee,
        netRevenue: net,
        passengerCount: passengers,
        totalSchedules,
        completedTours: completed,
        cancelledTours: cancelled
      };
    });
  }, [monthlySchedules]);

  const tourTotals = React.useMemo(() => {
    return tourReportData.reduce((acc, item) => {
      acc.totalSchedules += item.totalSchedules;
      acc.passengerCount += item.passengerCount;
      acc.grossRevenue += item.grossRevenue;
      acc.systemFee += item.systemFee;
      acc.netRevenue += item.netRevenue;
      return acc;
    }, {
      totalSchedules: 0,
      passengerCount: 0,
      grossRevenue: 0,
      systemFee: 0,
      netRevenue: 0
    });
  }, [tourReportData]);

  const exportToExcel = () => {
    if (monthlySchedules.length === 0) {
      toast.warning('Không có dữ liệu để xuất file Excel');
      return;
    }

    const [year, month] = selectedFilter.split('-');
    const timeLabel = `${month}_${year}`;

    let sheetData: any[] = [];
    let fileName = '';

    const getStatusLabelText = (item: any) => {
      if (item.status === 'cancelled') return 'Đã hủy';
      if (item.status === 'completed') return 'Hoàn thành';
      if (item.status === 'ongoing' || item.status === 'in_progress') return 'Đang đi';
      
      const isToday = new Date().toDateString() === new Date(item.start_date).toDateString();
      if (isToday) return 'Hôm nay';

      const current = item.current_participants || 0;
      if (current === 0) return 'Trống khách';
      if (current < item.max_participants) return 'Đang gom khách';
      return 'Đủ người';
    };

    if (reportView === 'monthly') {
      fileName = `Bao_cao_chi_tiet_doanh_thu_thang_${timeLabel}.xlsx`;
      sheetData = detailedReportData.map(item => ({
        'Ngày khởi hành': item.date,
        'Tên Tour du lịch': item.tourTitle,
        'Đơn giá (đ)': item.price,
        'Số khách đặt': `${item.participants}/${item.maxParticipants}`,
        'Doanh thu gộp (đ)': item.grossRevenue,
        'Phí hệ thống (10%) (đ)': item.systemFee,
        'Thực nhận (đ)': item.netRevenue,
        'Trạng thái': getStatusLabelText(item)
      }));

      // Append Total row
      sheetData.push({
        'Ngày khởi hành': 'Tổng cộng',
        'Tên Tour du lịch': '',
        'Đơn giá (đ)': '',
        'Số khách đặt': detailedTotals.participants,
        'Doanh thu gộp (đ)': detailedTotals.grossRevenue,
        'Phí hệ thống (10%) (đ)': detailedTotals.systemFee,
        'Thực nhận (đ)': detailedTotals.netRevenue,
        'Trạng thái': ''
      });
    } else {
      fileName = `Bao_cao_tong_hop_tour_thang_${timeLabel}.xlsx`;
      sheetData = tourReportData.map(item => ({
        'Tên Tour du lịch': item.tourTitle,
        'Giá tour trung bình (đ)': item.avgPrice,
        'Số lịch trình': item.totalSchedules,
        'Lịch hoàn thành': item.completedTours,
        'Lịch bị hủy': item.cancelledTours,
        'Tổng lượt khách': item.passengerCount,
        'Doanh thu gộp (đ)': item.grossRevenue,
        'Phí hệ thống (10%) (đ)': item.systemFee,
        'Thực nhận (đ)': item.netRevenue
      }));

      // Append Total row
      sheetData.push({
        'Tên Tour du lịch': 'Tổng cộng',
        'Giá tour trung bình (đ)': '',
        'Số lịch trình': tourTotals.totalSchedules,
        'Lịch hoàn thành': tourReportData.reduce((sum, item) => sum + item.completedTours, 0),
        'Lịch bị hủy': tourReportData.reduce((sum, item) => sum + item.cancelledTours, 0),
        'Tổng lượt khách': tourTotals.passengerCount,
        'Doanh thu gộp (đ)': tourTotals.grossRevenue,
        'Phí hệ thống (10%) (đ)': tourTotals.systemFee,
        'Thực nhận (đ)': tourTotals.netRevenue
      });
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      
      const maxProps = sheetData.reduce((acc, row) => {
        Object.keys(row).forEach(key => {
          const val = row[key] ? row[key].toString() : '';
          acc[key] = Math.max(acc[key] || 10, val.length + 2, key.length + 2);
        });
        return acc;
      }, {} as Record<string, number>);

      worksheet['!cols'] = Object.keys(maxProps).map(key => ({
        wch: maxProps[key]
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh Thu');
      XLSX.writeFile(workbook, fileName);
      toast.success(`Đã xuất báo cáo thành công: ${fileName}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Lỗi khi xuất file Excel');
    }
  };



  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allSchedules.length > 0 || allRequests.length > 0) {
      calculateStats(selectedFilter, allSchedules);
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

  const calculateStats = (filterVal: string, schedules: CombinedSchedule[]) => {
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

        {/* Tab Navigation */}
        <div className="income-tabs">
          <button 
            className={`income-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Tổng quan
          </button>
          <button 
            className={`income-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            📋 Báo cáo thống kê
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
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
          </>
        ) : (
          <div className="income-report-layout animate-up">
            <Card className="income-table-card">
              <div className="report-controls">
                <div className="report-view-toggle">
                  <button 
                    className={`toggle-btn ${reportView === 'monthly' ? 'active' : ''}`}
                    onClick={() => setReportView('monthly')}
                  >
                    Xem theo tháng
                  </button>
                  <button 
                    className={`toggle-btn ${reportView === 'tour' ? 'active' : ''}`}
                    onClick={() => setReportView('tour')}
                  >
                    Xem theo tour
                  </button>
                </div>

                <button className="btn-export-excel" onClick={exportToExcel}>
                  📥 Xuất file Excel
                </button>
              </div>

              {monthlySchedules.length === 0 ? (
                <div className="empty-table-state">
                  <span className="empty-icon">📭</span>
                  <p>Không có dữ liệu lịch trình khởi hành nào trong tháng này để tạo báo cáo.</p>
                </div>
              ) : reportView === 'monthly' ? (
                <div className="table-responsive-container">
                  <table className="income-detailed-table">
                    <thead>
                      <tr>
                        <th>Ngày khởi hành</th>
                        <th>Tên Tour du lịch</th>
                        <th>Đơn giá</th>
                        <th>Số khách đặt</th>
                        <th>Doanh thu gộp</th>
                        <th>Phí hệ thống (10%)</th>
                        <th>Thực nhận</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedReportData.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.date}</strong></td>
                          <td className="table-tour-title" title={item.tourTitle}>
                            <strong>{item.tourTitle}</strong>
                          </td>
                          <td>{formatPrice(item.price)}</td>
                          <td>
                            <strong className={item.participants === 0 ? 'text-muted' : 'text-primary'}>
                              {item.participants} / {item.maxParticipants}
                            </strong>
                          </td>
                          <td><strong className={item.grossRevenue > 0 ? 'text-success' : ''}>{formatPrice(item.grossRevenue)}</strong></td>
                          <td><strong className={item.systemFee > 0 ? 'text-muted' : ''}>{formatPrice(item.systemFee)}</strong></td>
                          <td><strong className={item.netRevenue > 0 ? 'text-success' : ''}>{formatPrice(item.netRevenue)}</strong></td>
                          <td>{getScheduleStatusLabel(item as any)}</td>
                        </tr>
                      ))}
                      <tr className="table-total-row">
                        <td><strong>Tổng cộng</strong></td>
                        <td></td>
                        <td></td>
                        <td><strong>{detailedTotals.participants} khách</strong></td>
                        <td><strong className="text-success">{formatPrice(detailedTotals.grossRevenue)}</strong></td>
                        <td><strong className="text-muted">{formatPrice(detailedTotals.systemFee)}</strong></td>
                        <td><strong className="text-success">{formatPrice(detailedTotals.netRevenue)}</strong></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive-container">
                  <table className="income-detailed-table">
                    <thead>
                      <tr>
                        <th>Tên Tour du lịch</th>
                        <th>Giá trung bình</th>
                        <th>Số lịch trình</th>
                        <th>Lịch hoàn thành</th>
                        <th>Lịch bị hủy</th>
                        <th>Tổng lượt khách</th>
                        <th>Doanh thu gộp</th>
                        <th>Phí hệ thống (10%)</th>
                        <th>Thực nhận</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourReportData.map((item, idx) => (
                        <tr key={`${item.tourId}-${idx}`}>
                          <td className="table-tour-title" title={item.tourTitle}>
                            <strong>{item.tourTitle}</strong>
                          </td>
                          <td>{formatPrice(item.avgPrice)}</td>
                          <td><strong>{item.totalSchedules}</strong></td>
                          <td><Badge variant="success">{item.completedTours}</Badge></td>
                          <td><Badge variant={item.cancelledTours > 0 ? 'danger' : 'secondary'}>{item.cancelledTours}</Badge></td>
                          <td><strong>{item.passengerCount}</strong></td>
                          <td><strong className={item.grossRevenue > 0 ? 'text-success' : ''}>{formatPrice(item.grossRevenue)}</strong></td>
                          <td><strong className={item.systemFee > 0 ? 'text-muted' : ''}>{formatPrice(item.systemFee)}</strong></td>
                          <td><strong className={item.netRevenue > 0 ? 'text-success' : ''}>{formatPrice(item.netRevenue)}</strong></td>
                        </tr>
                      ))}
                      <tr className="table-total-row">
                        <td><strong>Tổng cộng</strong></td>
                        <td></td>
                        <td><strong>{tourTotals.totalSchedules} lịch</strong></td>
                        <td><strong>{tourReportData.reduce((sum, item) => sum + item.completedTours, 0)}</strong></td>
                        <td><strong>{tourReportData.reduce((sum, item) => sum + item.cancelledTours, 0)}</strong></td>
                        <td><strong>{tourTotals.passengerCount} khách</strong></td>
                        <td><strong className="text-success">{formatPrice(tourTotals.grossRevenue)}</strong></td>
                        <td><strong className="text-muted">{formatPrice(tourTotals.systemFee)}</strong></td>
                        <td><strong className="text-success">{formatPrice(tourTotals.netRevenue)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default GuideIncomePage;
