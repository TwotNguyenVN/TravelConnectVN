# 📝 KẾ HOẠCH TRIỂN KHAI & NÂNG CẤP NGHIỆP VỤ (TRAVELCONNECTVN)

Tài liệu này chứa các kế hoạch nâng cấp và sửa lỗi nghiệp vụ hệ thống.

---

## PHẦN A: SỬA LỖI LOGIC & CÔNG NỢ NGHIỆP VỤ (ĐÃ TRIỂN KHAI)

### 1. Danh sách các file thay đổi (Proposed Changes)

#### 📂 Backend Components

##### [MODIFY] [trip-expenses.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/trip-expenses/trip-expenses.service.ts)
*   Cập nhật hàm `settleDebts` để thực hiện quyết toán nợ thông minh:
    1.  Chạy thuật toán Greedy tính toán số dư thực tế giống hệt hàm `getExpenses`.
    2.  Tìm khoản tiền chính xác (`settleAmount`) mà `debtorId` cần chuyển cho `creditorId`.
    3.  Tự động khấu trừ và cập nhật trạng thái `settled` cho các `trip_expense_splits` liên quan.

##### [MODIFY] [tour-requests.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/tour-requests/tour-requests.service.ts)
*   Cập nhật hàm `createRequest` để kiểm tra và bắt buộc chọn lịch khởi hành (`scheduleId`).
*   Cập nhật hàm `cancelRequest` để ghi nhận giao dịch hoàn tiền với số tiền dương (tránh lỗi constraint) và gán nhãn `refund_pending`.

##### [MODIFY] [admin.controller.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/admin/admin.controller.ts) & [admin.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/admin/admin.service.ts)
*   Thêm các API quản lý và phê duyệt yêu cầu hoàn tiền dành cho Admin.

---

## PHẦN B: NÂNG CẤP VÀ SỬA LỖI NGHIỆP VỤ CHO HƯỚNG DẪN VIÊN (GUIDE)

### 1. Lỗi tính toán động giá lịch sử đặt tour (Dynamic Booking Pricing - Rất Nghiêm Trọng 🔴)

#### Hiện trạng lỗi
*   Bảng `tour_requests` không lưu trữ giá tiền thực tế tại thời điểm đặt tour (`price_at_booking`).
*   Khi truy xuất danh sách yêu cầu, hệ thống đang tính động giá tour dẫn đến thay đổi giá hiển thị của hóa đơn cũ khi Guide đổi giá tour.

#### Giải pháp đề xuất
1.  **Cập nhật Database Schema (`schema.prisma`):** Thêm cột `price_at_booking` (Kiểu `Decimal`) vào bảng `tour_requests`.
2.  **Cập nhật logic tạo Tour Request (`createRequest` trong `tour-requests.service.ts`):** Gán giá hiện tại vào cột `price_at_booking` khi lưu.
3.  **Cập nhật logic tính toán hóa đơn vĩnh viễn:** Trong `getUserRequests`, `getGuideRequests`, và `payments.service.ts`, sử dụng `price_at_booking` làm giá trị gốc, fallback về giá động đối với bản ghi cũ.

---

### 2. Cho phép Guide tự trùng lịch hướng dẫn (Guide Double-Booking - Nghiêm Trọng 🟠)

#### Hiện trạng lỗi
*   Hàm phê duyệt yêu cầu đặt tour `processRequest` hoàn toàn không kiểm tra khoảng ngày chồng lấn của Guide dẫn đến trùng lịch thực tế ngoài đời.

#### Giải pháp đề xuất
1.  **Xác định khoảng thời gian của tour yêu cầu:** Lấy `startDate` và `numDays` của tour để tính `endDate`.
2.  **Xây dựng hàm kiểm tra trùng lịch (Overlap Detection):** Kiểm tra chồng lấn thời gian với các booking đã duyệt (`approved` hoặc `paid`) của cùng Hướng dẫn viên. Chặn nếu có xung đột.

---

### 3. Cho phép tạo đợt khởi hành trong quá khứ (Past Tour Schedule - Trung bình 🟡)

#### Hiện trạng lỗi
*   Hàm `createTourSchedule` trong `tours.service.ts` không chặn tạo lịch khởi hành cho thời gian trong quá khứ.

#### Giải pháp đề xuất
*   Thêm so sánh `startDate` với ngày hiện tại và chặn nếu nhỏ hơn ngày hiện tại.

---

### 4. Liên kết Tour ảo khi tạo phòng chat Direct (Chat Tour Association - Thấp 🟢)

#### Hiện trạng lỗi
*   Hàm `createOrGetDirect` trong `conversation.service.ts` nhận `relatedTourId` mà không xác minh tour đó có thuộc sở hữu của Guide đó không.

#### Giải pháp đề xuất
*   Thêm bước kiểm tra sở hữu tour của Guide trong cuộc hội thoại chat direct.
