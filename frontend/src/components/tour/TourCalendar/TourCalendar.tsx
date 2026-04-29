import React, { useState, useMemo, useEffect } from 'react';
import './TourCalendar.css';

interface DepartureDate {
  date: string; // ISO string YYYY-MM-DD
  price: number;
  remainingSlots: number;
  maxParticipants: number;
}

interface TourCalendarProps {
  schedules: DepartureDate[];
  onDateSelect?: (date: DepartureDate) => void;
}

export const TourCalendar: React.FC<TourCalendarProps> = ({ schedules, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Tự động chuyển đến tháng có lịch đầu tiên nếu tháng hiện tại không có lịch
  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const hasSchedulesThisMonth = schedules.some(s => {
        const sDate = new Date(s.startDate || (s as any).date);
        return sDate.getMonth() === month && sDate.getFullYear() === year;
      });

      if (!hasSchedulesThisMonth) {
        const futureSchedules = [...schedules]
          .filter(s => new Date(s.startDate || (s as any).date) >= today)
          .sort((a, b) => new Date(a.startDate || (a as any).date).getTime() - new Date(b.startDate || (b as any).date).getTime());

        if (futureSchedules.length > 0) {
          const firstDate = new Date(futureSchedules[0].startDate || (futureSchedules[0] as any).date);
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
        .filter(s => new Date(s.startDate || (s as any).date) >= startMonth)
        .sort((a, b) => new Date(a.startDate || (a as any).date).getTime() - new Date(b.startDate || (b as any).date).getTime());

      if (futureSchedules.length > 0) {
        const firstDate = new Date(futureSchedules[0].startDate || (futureSchedules[0] as any).date);
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
        fullDate: null,
        dateObj, 
        isOtherMonth: true,
        isPast: dateObj < today 
      });
    }
    
    // Fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      // Match schedule by date components to avoid timezone shifts
      const schedule = schedules.find(s => {
        const sDate = new Date(s.startDate || (s as any).date);
        const sYear = sDate.getFullYear();
        const sMonth = sDate.getMonth();
        const sDay = sDate.getDate();
        const sDateString = `${sYear}-${String(sMonth + 1).padStart(2, '0')}-${String(sDay).padStart(2, '0')}`;
        return sDateString === dateString;
      });
      
      days.push({
        day: d,
        fullDate: dateString,
        dateObj,
        schedule,
        isOtherMonth: false,
        isPast: dateObj < today
      });
    }

    // Fill next month days to complete 42 cells (7x6 grid)
    let nextMonthDay = 1;
    while (days.length < 42) {
      const dateObj = new Date(year, month + 1, nextMonthDay);
      days.push({ 
        day: nextMonthDay, 
        fullDate: null,
        dateObj, 
        isOtherMonth: true,
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
    if (dayData.isOtherMonth) {
      setCurrentDate(new Date(dayData.dateObj.getFullYear(), dayData.dateObj.getMonth(), 1));
      return;
    }

    if (dayData.schedule) {
      setSelectedDate(dayData.fullDate);
      if (onDateSelect) onDateSelect(dayData.schedule);
    }
  };

  return (
    <div className="tc-tour-calendar">
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
              className={`tc-day ${dayData.isOtherMonth ? 'tc-day--other-month' : ''} ${dayData.schedule ? 'tc-day--departure' : ''} ${dayData.fullDate && selectedDate === dayData.fullDate ? 'tc-day--selected' : ''} ${dayData.schedule?.remainingSlots === 0 ? 'tc-day--full' : ''}`}
              onClick={() => handleDayClick(dayData)}
            >
              {dayData.day && (
                <>
                  <span className="tc-day-number">{dayData.day}</span>
                  {dayData.schedule && (
                    <>
                      <span className="tc-day-price">{formatPrice(dayData.schedule.price)}</span>
                      <span className="tc-day-slots">
                        {dayData.schedule.remainingSlots > 0 
                          ? `Còn ${dayData.schedule.remainingSlots} chỗ` 
                          : 'Hết chỗ'}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="tc-calendar-footer">
          * Quý khách vui lòng chọn ngày phù hợp
        </div>
      </main>
    </div>
  );
};
