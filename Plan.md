# Kế hoạch triển khai: Trợ lý AI Đa Phân Quyền (Role-Based AI Assistant)

## 1. Tầm nhìn (Vision)
Xây dựng một trợ lý AI thông minh, không chỉ biết tư vấn du lịch chung chung mà còn đóng vai trò là một **Chuyên gia dữ liệu cá nhân hóa** cho từng nhóm người dùng trên hệ thống TravelConnectVN.

---

## 2. Phân quyền và Chức năng (Roles & Features)

### A. Nhóm Khách hàng (User)
**Mục tiêu:** Tăng tỷ lệ chuyển đổi (mua tour) và kết nối cộng đồng.
- **Tra cứu Tour:** AI phân tích yêu cầu (ví dụ: "Tôi thích leo núi nhưng ngân sách dưới 2tr") để gợi ý Tour chính xác từ DB.
- **Kết nối bạn đồng hành:** Tìm kiếm các bài đăng `Companion Posts` có cùng điểm đến hoặc thời gian khởi hành mà người dùng đang quan tâm.
- **Dữ liệu cung cấp:** Danh sách Tour hoạt động, Danh sách Companion Posts đang tuyển thành viên.

### B. Nhóm Hướng dẫn viên (Guide)
**Mục tiêu:** Công cụ quản lý tour tinh gọn.
- **Báo cáo vận hành:** AI tóm tắt số lượng khách tham gia trong ngày, danh sách người mới đăng ký vào tour.
- **Quản lý lịch trình:** Nhắc nhở các tour sắp khởi hành, các mốc thời gian quan trọng trong tour hiện tại.
- **Dữ liệu cung cấp:** Danh sách Tour do Guide đó quản lý, Lịch sử Booking của khách hàng đối với các tour của Guide, Lịch trình chi tiết.

### C. Nhóm Quản trị viên (Admin)
**Mục tiêu:** Giám sát hệ thống nhanh chóng bằng ngôn ngữ tự nhiên.
- **Số liệu tăng trưởng:** Thống kê nhanh số người dùng mới đăng ký hôm nay, tổng doanh thu (nếu cần).
- **Xử lý vi phạm:** Tổng hợp danh sách các Báo cáo (Reports) chưa xử lý, tóm tắt nội dung báo cáo để Admin ra quyết định nhanh.
- **Xác thực định danh:** Thông báo và tóm tắt các yêu cầu xác thực tài khoản từ Guide đang chờ duyệt.
- **Dữ liệu cung cấp:** Thống kê Users, Reports, Guide Verification Requests, Tổng quan hệ thống.

---

## 3. Cơ chế hoạt động (Technical Logic)

1. **Nhận diện Role:** Khi người dùng gửi tin nhắn, Backend kiểm tra Role từ JWT Token.
2. **Nạp dữ liệu động (Dynamic Context):**
   - Dựa vào Role, Backend chạy các câu lệnh SQL/Prisma tương ứng để lấy "Snapshot dữ liệu" của ngày hôm nay.
   - Dữ liệu được chuyển thành văn bản (JSON/Text) và đẩy vào phần **System Instruction** của Gemini.
3. **Phản hồi thông minh:** AI tổng hợp dữ liệu được cung cấp để trả lời đúng trọng tâm phân quyền của người dùng đó.

---

## 4. Bảo mật & Riêng tư (Security)
- **Data Isolation:** AI của Guide A sẽ không bao giờ nhìn thấy dữ liệu của Guide B.
- **Sensitive Data Striping:** Loại bỏ hoàn toàn thông tin nhạy cảm (mật khẩu, mã token...) trước khi gửi dữ liệu lên AI.
- **Read-Only Context:** AI chỉ nhận dữ liệu để đọc và tư vấn, không có quyền tự ý sửa đổi Database.

---

## 5. Danh sách Task chi tiết (Detailed Task List)

### Task 1: Tái cấu trúc bộ cung cấp ngữ cảnh (Refactor Context Provider)
- **Mô tả:** Chỉnh sửa `AiChatService` để nhận diện Role của người dùng ngay khi bắt đầu một tin nhắn mới. Xây dựng một hàm trung tâm gọi là `getRoleBasedContext(userId, role)` để điều hướng việc lấy dữ liệu.
- **Chi tiết kỹ thuật:** 
    - Truy vấn bảng `public_users` để lấy Role.
    - Tạo cấu trúc Prompt cơ sở (Base Prompt) chứa quy tắc chung cho AI.

### Task 2: Hiện thực hóa ngữ cảnh cho User (Tours & Companions)
- **Mô tả:** Cho phép AI "nhìn thấy" các bài đăng tìm bạn đồng hành và tour phù hợp.
- **Chi tiết kỹ thuật:** 
    - Viết hàm `fetchUserContext()`: Lấy top 10 Tour nổi bật + 10 Companion Posts mới nhất.
    - Định dạng dữ liệu thành bảng văn bản đơn giản để AI dễ tra cứu.
    - AI sẽ trả lời được: "Có ai đang tìm bạn đi Hà Giang vào tháng 5 không?"

### Task 3: Hiện thực hóa ngữ cảnh cho Guide (Tour Management)
- **Mô tả:** Cung cấp cho Guide khả năng quản lý tour bằng giọng nói/văn bản.
- **Chi tiết kỹ thuật:**
    - Viết hàm `fetchGuideContext(guideUserId)`: Chỉ lấy dữ liệu Tour thuộc quyền quản lý của Guide này.
    - Thống kê: Số lượng `TourRequests` đã được duyệt cho ngày hôm nay, danh sách tên khách hàng, lịch trình tour tiếp theo.
    - AI sẽ trả lời được: "Hôm nay tôi có bao nhiêu khách khởi hành?" hoặc "Lịch trình tour Sài Gòn chiều nay là gì?"

### Task 4: Hiện thực hóa ngữ cảnh cho Admin (System Monitoring)
- **Mô tả:** Giúp Admin giám sát hệ thống mà không cần vào Dashboard.
- **Chi tiết kỹ thuật:**
    - Viết hàm `fetchAdminContext()`: Thống kê số lượng bản ghi mới trong 24h qua (Users, Tours, Bookings).
    - Lấy danh sách 5 Báo cáo (Reports) gần nhất chưa xử lý.
    - Lấy danh sách 5 yêu cầu xác thực Guide (`GuideVerificationRequests`) đang chờ.
    - AI sẽ trả lời được: "Hệ thống hôm nay có gì mới không?" hoặc "Có báo cáo nào gấp từ người dùng không?"

### Task 5: Tối ưu hóa Prompt & Định dạng đầu ra
- **Mô tả:** Huấn luyện AI cách phản hồi dựa trên dữ liệu được cung cấp.
- **Chi tiết kỹ thuật:**
    - Thiết lập "Nhân cách AI": Nếu là Admin thì trả lời ngắn gọn, số liệu chính xác. Nếu là User thì trả lời truyền cảm hứng, thân thiện.
    - Sử dụng `ReactMarkdown` để hiển thị các báo cáo dữ liệu dưới dạng bảng (Table) hoặc danh sách (List).

### Task 6: Kiểm thử & Bảo mật dữ liệu
- **Mô tả:** Đảm bảo dữ liệu không bị rò rỉ chéo.
- **Chi tiết kỹ thuật:**
    - Test case 1: Dùng User A hỏi về dữ liệu nội bộ của Guide B (Kết quả mong muốn: AI không biết).
    - Test case 2: Dùng Admin hỏi về thống kê (Kết quả mong muốn: Trả ra số liệu chính xác).
