import React, { useState, useMemo, useEffect } from 'react';
import '../../../components/tour/TourCalendar/TourCalendar.css'; // Reusing base styles
import './GuideTourCalendar.css';

interface Schedule {
  id: string;
  start_date: string | Date;
  price: number;
  max_participants: number;
  current_participants?: number;
  status: string;
}

interface GuideTourCalendarProps {
  schedules: Schedule[];
  onDateClick: (date: Date, schedule?: Schedule) => void;
}

const GuideTourCalendar: React.FC<GuideTourCalendarProps> = ({ schedules, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Tự động chuyển đến tháng có lịch đầu tiên nếu tháng hiện tại không có lịch
  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Kiểm tra xem tháng hiện tại có lịch nào không
      const hasSchedulesThisMonth = schedules.some(s => {
        const sDate = new Date(s.start_date);
        return sDate.getMonth() === month && sDate.getFullYear() === year;
      });

      if (!hasSchedulesThisMonth) {
        // Tìm lịch trình sớm nhất trong tương lai
        const futureSchedules = [...schedules]
          .filter(s => new Date(s.start_date) >= today)
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

        if (futureSchedules.length > 0) {
          const firstDate = new Date(futureSchedules[0].start_date);
          setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
        }
      }
    }
  }, [schedules]);

  // Months for sidebar: 12 months starting from the first month with a schedule
  const sidebarMonths = useMemo(() => {
    let startMonth = new Date();
    startMonth.setHours(0, 0, 0, 0);

    if (schedules && schedules.length > 0) {
      const futureSchedules = [...schedules]
        .filter(s => new Date(s.start_date) >= startMonth)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

      if (futureSchedules.length > 0) {
        const firstDate = new Date(futureSchedules[0].start_date);
        startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      }
    }

    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      months.push({
        m: d.getMonth(),
        y: d.getFullYear(),
        label: `${d.getMonth() + 1}/${d.getFullYear()}`
      });
    }
    return months;
  }, [schedules]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to get days in month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Adjust for Vietnamese calendar (T2 starts week)
    const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fill previous month days
    for (let i = emptyDaysBefore - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const dateObj = new Date(year, month - 1, d);
      days.push({ 
        day: d, 
        dateObj, 
        isOtherMonth: true,
        schedules: [],
        isPast: dateObj < today 
      });
    }
    
    // Fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const daySchedules = schedules.filter(s => {
        const sDate = new Date(s.start_date);
        const sYear = sDate.getFullYear();
        const sMonth = sDate.getMonth();
        const sDay = sDate.getDate();
        const sDateString = `${sYear}-${String(sMonth + 1).padStart(2, '0')}-${String(sDay).padStart(2, '0')}`;
        return sDateString === dateString;
      });
      
      const isPast = dateObj < today;

      days.push({
        day: d,
        fullDate: dateString,
        dateObj,
        schedules: daySchedules,
        isPast,
        isOtherMonth: false
      });
    }

    // Fill next month days to complete 42 cells (7x6 grid)
    let nextMonthDay = 1;
    while (days.length < 42) {
      const dateObj = new Date(year, month + 1, nextMonthDay);
      days.push({ 
        day: nextMonthDay, 
        dateObj, 
        isOtherMonth: true,
        schedules: [],
        isPast: dateObj < today 
      });
      nextMonthDay++;
    }
    
    return days;
  }, [year, month, schedules]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatPrice = (price: number) => {
    return (price / 1000).toLocaleString() + 'K';
  };

  const handleDayClick = (dayData: any) => {
    if (!dayData.dateObj) return;

    if (dayData.isOtherMonth) {
      setCurrentDate(new Date(dayData.dateObj.getFullYear(), dayData.dateObj.getMonth(), 1));
      return;
    }

    const hasSchedules = dayData.schedules && dayData.schedules.length > 0;
    if (dayData.day && (!dayData.isPast || hasSchedules)) {
      onDateClick(dayData.dateObj, hasSchedules ? dayData.schedules[0] : undefined);
    }
  };

  const getScheduleStatus = (sch: Schedule) => {
    if (!sch) return "available";
    if (sch.status === 'cancelled') return "cancelled";
    if (sch.status === 'completed') return "completed";
    if (sch.status === 'ongoing' || sch.status === 'in_progress') return "ongoing";
    if (sch.status === 'full') return "full";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(sch.start_date);
    startDate.setHours(0, 0, 0, 0);

    const current = sch.current_participants || 0;

    if (startDate < today && current === 0) {
      return "expired";
    }

    return sch.status || "available";
  };

  const getScheduleStatusClass = (schedule: Schedule) => {
    if (!schedule) return "";
    const status = getScheduleStatus(schedule);
    
    if (status === 'cancelled') return "tc-day--cancelled";
    if (status === 'ongoing') return "tc-day--ongoing";
    if (status === 'full') return "tc-day--full-manual";
    if (status === 'completed') return "tc-day--completed";
    if (status === 'expired') return "tc-day--expired";
    
    const current = schedule.current_participants || 0;
    const max = schedule.max_participants;

    if (current === 0) return "tc-day--empty";
    if (current < max) return "tc-day--has-guests";
    return "tc-day--full";
  };

  return (
    <div className="tc-tour-calendar tc-guide-calendar">
      {/* Sidebar chọn tháng */}
      <aside className="tc-calendar-sidebar">
        <div className="tc-calendar-sidebar__title">Chọn tháng</div>
        {sidebarMonths.map((m) => (
          <button
            key={m.label}
            className={`tc-month-btn ${month === m.m && year === m.y ? 'tc-month-btn--active' : ''}`}
            onClick={() => setCurrentDate(new Date(m.y, m.m, 1))}
          >
            {m.label}
          </button>
        ))}
      </aside>

      {/* Lịch chính */}
      <main className="tc-calendar-main">
        <header className="tc-calendar-header">
          <button className="tc-nav-btn" onClick={handlePrevMonth}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2>Tháng {month + 1}/{year}</h2>
          <button className="tc-nav-btn" onClick={handleNextMonth}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </header>

        <div className="tc-calendar-grid">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <div key={d} className="tc-weekday">{d}</div>
          ))}
          
          {calendarDays.map((dayData, idx) => {
            const hasSchedules = dayData.schedules && dayData.schedules.length > 0;
            const primarySchedule = hasSchedules ? dayData.schedules[0] : null;
            const statusClass = primarySchedule ? getScheduleStatusClass(primarySchedule) : "";

            return (
              <div
                key={idx}
                className={`tc-day ${dayData.isOtherMonth ? "tc-day--other-month" : ""} ${hasSchedules ? `tc-day--scheduled ${statusClass}` : ""} ${(dayData.isPast && !hasSchedules) ? "tc-day--past" : "tc-day--clickable"}`}
                onClick={() => handleDayClick(dayData)}
                title={hasSchedules ? "Click để xem chi tiết lịch trình" : (dayData.isPast ? "Không thể thao tác trên ngày trong quá khứ" : "Click để cấu hình lịch")}
              >
                {dayData.day && (
                  <>
                    <span className="tc-day-number">{dayData.day}</span>
                    {hasSchedules && (
                      <div className="tc-day-schedules-list">
                        {dayData.schedules.map((sch: any) => {
                          const computedStatus = getScheduleStatus(sch);
                          return (
                            <div 
                              key={sch.id} 
                              className={`tc-calendar-schedule-pill status-${computedStatus}`}
                              title={sch.tourTitle || "Lịch khởi hành"}
                            >
                              <div className="pill-text-container">
                                {sch.tourTitle && <span className="pill-tour-title">{sch.tourTitle}</span>}
                                <div className="pill-details">
                                  <span className="pill-price">💵 {formatPrice(sch.price)}</span>
                                  <span className="pill-slots">👥 {sch.current_participants || 0}/{sch.max_participants}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="tc-calendar-legend">
          <div className="tc-legend-item">
            <span className="tc-dot tc-dot--empty"></span> Chưa có khách
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot tc-dot--has-guests"></span> Đang có khách
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot tc-dot--full"></span> Đã đủ người
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot" style={{ backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>✓</span> Đã hoàn thành
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot" style={{ backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>
              <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="4" height="16"></rect>
                <rect x="15" y="4" width="4" height="16"></rect>
              </svg>
            </span> Tạm ngưng
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot" style={{ backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px', fontWeight: 'bold' }}>✕</span> Đã hủy
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot" style={{ backgroundColor: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '8px' }}>
              <span className="tc-ongoing-dot-pulse"></span>
            </span> Đang diễn ra
          </div>
          <div className="tc-legend-item">
            <span className="tc-dot tc-dot--expired" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>⌛</span> Quá hạn
          </div>
        </div>

        <div className="tc-calendar-footer">
          * Click vào ngày để thêm hoặc cập nhật thông tin khởi hành
        </div>
      </main>
    </div>
  );
};

export default GuideTourCalendar;
