import React, { useState, useMemo } from 'react';
import '../../../components/tour/TourCalendar/TourCalendar.css'; // Reusing base styles
import './GuideTourCalendar.css';

interface Schedule {
  id: string;
  start_date: string | Date;
  price: number;
  max_participants: number;
  status: string;
}

interface GuideTourCalendarProps {
  schedules: Schedule[];
  onDateClick: (date: Date, schedule?: Schedule) => void;
}

const GuideTourCalendar: React.FC<GuideTourCalendarProps> = ({ schedules, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Months for sidebar: current + 7 months ahead
  const sidebarMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        m: d.getMonth(),
        y: d.getFullYear(),
        label: `${d.getMonth() + 1}/${d.getFullYear()}`
      });
    }
    return months;
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to get days in month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust for Vietnamese calendar (T2 starts week)
    const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    
    for (let i = 0; i < emptyDaysBefore; i++) {
      days.push({ day: null, fullDate: null, dateObj: null });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const schedule = schedules.find(s => {
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
        schedule,
        isPast
      });
    }
    
    return days;
  }, [year, month, schedules]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatPrice = (price: number) => {
    return (price / 1000).toLocaleString() + 'K';
  };

  const handleDayClick = (dayData: any) => {
    if (dayData.day && !dayData.isPast) {
      onDateClick(dayData.dateObj, dayData.schedule);
    }
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
          
          {calendarDays.map((dayData, idx) => (
            <div
              key={idx}
              className={`tc-day ${!dayData.day ? 'tc-day--empty' : ''} ${dayData.schedule ? 'tc-day--scheduled' : ''} ${dayData.isPast ? 'tc-day--past' : 'tc-day--clickable'}`}
              onClick={() => handleDayClick(dayData)}
              title={dayData.isPast ? 'Không thể thao tác trên ngày trong quá khứ' : 'Click để cấu hình lịch'}
            >
              {dayData.day && (
                <>
                  <span className="tc-day-number">{dayData.day}</span>
                  {dayData.schedule && (
                    <>
                      <span className="tc-day-price">{formatPrice(dayData.schedule.price)}</span>
                      <span className="tc-day-slots">
                        Max {dayData.schedule.max_participants}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="tc-calendar-footer">
          * Click vào ngày để thêm hoặc cập nhật thông tin khởi hành
        </div>
      </main>
    </div>
  );
};

export default GuideTourCalendar;
