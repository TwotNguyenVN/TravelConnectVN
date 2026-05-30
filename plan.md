# Plan - TravelConnect VN

---

## Tính năng: Tạo ngày bắt đầu mới từ trang Lịch trình (`/guide/schedules`)

**Mục tiêu:** Hướng dẫn viên có thể tạo một ngày khởi hành mới cho tour trực tiếp từ trang lịch trình, mà không cần phải vào từng tour để cấu hình.

### Luồng UX

1. **Hướng dẫn viên truy cập `/guide/schedules`**
   - Nhìn thấy lịch tháng hoặc lịch tuần.
   - Các ngày trong tương lai có thể click được.

2. **Click vào một ngày trong tương lai**
   - Mở modal/panel hiển thị **danh sách các tour** mà hướng dẫn viên đang quản lý.
   - Hướng dẫn viên chọn tour muốn tạo ngày khởi hành.

3. **Sau khi chọn tour, hiển thị form cấu hình lịch:**
   - **Giá tour:** Hiển thị giá mặc định của tour, cho phép hướng dẫn viên tăng/giảm so với giá gốc.
   - **Số lượng người tối đa:** Nhập số lượng khách tối đa có thể tham gia tour trong lịch này.

4. **Ấn "Xác nhận"**
   - Hiển thị hộp thoại xác nhận: *"Bạn có chắc muốn tạo ngày khởi hành [ngày] cho tour [tên tour] không?"*
   - Nếu đồng ý → gọi API tạo lịch trình mới.
   - Nếu huỷ → đóng hộp thoại, quay lại form.

5. **Sau khi tạo thành công**
   - Hiển thị thông báo thành công (toast).
   - Lịch tự động cập nhật để hiển thị ngày mới vừa tạo.

---

### Ghi chú kỹ thuật

- **API endpoint cần dùng:** `POST /api/tours/:tourId/schedules` (đã có sẵn)
- **Payload:** `{ start_date, price, max_participants }`
- **Danh sách tour của guide:** `GET /api/tours/my-tours` (đã có sẵn)
- **Lấy giá mặc định tour:** Từ field `price` của tour detail (dùng làm giá gợi ý ban đầu)
- **Validation:**
  - Ngày phải là ngày trong tương lai.
  - Giá phải > 0.
  - Số người tối đa phải >= 1.
- **State management:** Sau khi tạo thành công → gọi lại `fetchAllSchedules()` để refresh calendar.

---

### Files cần chỉnh sửa

- `frontend/src/pages/guide/GuideSchedulesPage.tsx` — Thêm logic mở modal khi click ngày trống, thêm flow chọn tour & tạo lịch.
- `frontend/src/pages/guide/GuideSchedulesPage.css` — Style cho modal chọn tour, form cấu hình giá/số người.
- `frontend/src/pages/guide/tabs/GuideTourCalendar.tsx` — Phân biệt click ngày có lịch vs ngày trống để trigger đúng flow.

---

*Ghi chú ngày: 2026-05-29*