# Kế hoạch phát triển tính năng: Lịch Khởi Hành (Tour Departure Calendar)

## 1. Tổng quan (Overview)
Hiện tại, hệ thống đang quản lý Tour theo dạng đơn lẻ (một Tour gắn liền với một ngày bắt đầu/kết thúc cụ thể). Điều này gây bất tiện khi Hướng dẫn viên (HDV) muốn tổ chức một tour lặp lại nhiều lần.
**Giải pháp:** Tách biệt thông tin "Mô tả Tour" và "Lịch khởi hành". Một Tour có thể có nhiều ngày khởi hành khác nhau để khách hàng lựa chọn.

## 2. Mục tiêu (Objectives)
- **Đối với Hướng dẫn viên:**
    - Có thể chủ động lên lịch trước cho các đợt khởi hành trong tương lai.
    - Dễ dàng quản lý số lượng người đăng ký (slots) theo từng ngày cụ thể.
    - Không cần phải tạo lại bài đăng mới cho mỗi đợt đi.
- **Đối với Khách hàng:**
    - Xem được toàn bộ các ngày khởi hành khả dụng của một Tour.
    - Lựa chọn ngày đi phù hợp với lịch cá nhân một cách thuận tiện.
    - Biết chính xác số chỗ còn trống cho từng đợt khởi hành.

## 3. Chức năng chi tiết (Detailed Features)

### 3.1. Quản lý Lịch dành cho HDV
- **Giao diện tạo/sửa Tour:** Bổ sung phần quản lý danh sách ngày khởi hành.
- **Thao tác:**
    - Chọn nhiều ngày khởi hành cùng lúc (Multi-select) hoặc định kỳ (ví dụ: Thứ 7 hàng tuần).
    - Thiết lập giá riêng cho từng ngày (nếu cần - ví dụ ngày lễ giá cao hơn).
    - Xem danh sách khách hàng đã đặt chỗ theo từng ngày (Schedules-based participant list).

### 3.2. Giao diện Đặt chỗ dành cho Khách hàng (User Interface)
- **Thành phần Calendar (Lịch khởi hành):**
    - Hiển thị theo dạng bảng lịch tháng (giống ảnh mẫu).
    - Các ngày có lịch khởi hành sẽ được làm nổi bật (In đậm, màu sắc khác).
    - Hiển thị giá tour ngay dưới mỗi ngày khởi hành (ví dụ: 1,990K).
    - Bộ lọc tháng ở sidebar bên trái để chuyển nhanh giữa các tháng trong năm.
- **Xử lý Logic:**
    - Khi khách chọn 1 ngày, hệ thống sẽ tự động cập nhật số chỗ còn lại (`remainingSlots`).
    - Các ngày đã hết chỗ hoặc đã qua sẽ được làm mờ (disabled).

## 4. Thay đổi kỹ thuật dự kiến (Technical Changes)

### 4.1. Cơ sở dữ liệu (Database Schema)
- Tạo bảng mới `tour_schedules`:
    - `id`: UUID
    - `tour_id`: Liên kết với bảng `tours`
    - `start_date`: Ngày khởi hành
    - `price`: Giá riêng cho ngày này (nếu có)
    - `max_participants`: Số lượng chỗ tối đa
    - `status`: (available, full, completed, cancelled)

### 4.2. Backend API
- Cập nhật API lấy chi tiết tour để bao gồm danh sách `tour_schedules`.
- Cập nhật API đặt tour: Booking sẽ liên kết với `schedule_id` thay vì `tour_id` trực tiếp.

### 4.3. Frontend Components
- Phát triển component `TourCalendar`:
    - Input: Mảng dữ liệu các ngày khởi hành.
    - Output: Ngày mà khách hàng đã chọn.
    - Công nghệ: Sử dụng `date-fns` hoặc thư viện Calendar tùy chỉnh theo UI mẫu.

## 5. Giao diện tham chiếu (UI Reference)
Hệ thống sẽ xây dựng dựa trên mẫu ảnh cung cấp:
- Tiêu đề: **LỊCH KHỞI HÀNH** (Chính giữa)
- Cấu trúc: 2 cột (Sidebar chọn tháng 20% | Calendar tháng 80%)
- Trạng thái ngày: Hiển thị giá tiền bên dưới số ngày cho các ngày có lịch khởi hành.
- Màu sắc chủ đạo: Xanh dương (TC-Primary) và Cam đỏ (TC-Warning/Price).
