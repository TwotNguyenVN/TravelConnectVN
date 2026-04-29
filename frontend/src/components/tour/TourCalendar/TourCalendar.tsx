import React, { useState, useMemo } from 'react';
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
      days.push({ day: null, fullDate: null });
    }
    
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
        schedule
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
              className={`tc-day ${!dayData.day ? 'tc-day--empty' : ''} ${dayData.schedule ? 'tc-day--departure' : ''} ${selectedDate === dayData.fullDate ? 'tc-day--selected' : ''} ${dayData.schedule?.remainingSlots === 0 ? 'tc-day--full' : ''}`}
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
