import React from 'react';
import { TourCalendar } from '../../components/tour/TourCalendar/TourCalendar';

const mockSchedules = [
  { date: '2026-07-04', price: 1990000, remainingSlots: 5, maxParticipants: 10 },
  { date: '2026-07-11', price: 1990000, remainingSlots: 2, maxParticipants: 10 },
  { date: '2026-07-18', price: 1990000, remainingSlots: 8, maxParticipants: 10 },
  { date: '2026-07-25', price: 1990000, remainingSlots: 0, maxParticipants: 10 },
  { date: '2026-08-01', price: 2190000, remainingSlots: 10, maxParticipants: 10 },
  { date: '2026-08-08', price: 2190000, remainingSlots: 4, maxParticipants: 10 },
];

export const CalendarDemoPage: React.FC = () => {
  const handleSelect = (schedule: any) => {
    console.log('Selected schedule:', schedule);
    alert(`Bạn đã chọn ngày khởi hành: ${schedule.date}\nGiá: ${schedule.price.toLocaleString()}đ`);
  };

  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e293b', fontSize: '32px', fontWeight: 800 }}>Demo: Lịch Khởi Hành</h1>
        <p style={{ color: '#64748b' }}>Giao diện đặt tour theo ngày khởi hành cụ thể</p>
      </div>

      <TourCalendar schedules={mockSchedules} onDateSelect={handleSelect} />
      
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Hướng dẫn tích hợp:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Import <code>TourCalendar</code> vào trang Chi tiết Tour (<code>TourDetailPage</code>).</li>
          <li>Truyền danh sách <code>schedules</code> từ API vào component.</li>
          <li>Lưu giá trị <code>selectedSchedule</code> khi người dùng chọn một ngày trên lịch.</li>
          <li>Gửi <code>scheduleId</code> kèm theo yêu cầu đặt tour khi nhấn nút "Đặt ngay".</li>
        </ol>
      </div>
    </div>
  );
};

export default CalendarDemoPage;
