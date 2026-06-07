# 📖 Sổ tay Vận hành Backoffice (User Manual)

Tài liệu này hướng dẫn chi tiết quy trình nghiệp vụ cho các vai trò vận hành trong nền tảng TravelConnect VN.

---

## 💼 1. Dành cho Kế toán (Accountant)

Vai trò: Quản lý dòng tiền, quyết toán cho Hướng dẫn viên (HDV) và xử lý yêu cầu hoàn tiền.

### 1.1 Quy trình Quyết toán (Settlement)
Mỗi khi một Tour kết thúc thành công, hệ thống tự động ghi nhận doanh thu dự kiến. Kế toán cần thực hiện quyết toán thực tế để chuyển tiền cho HDV.
1. Truy cập **Bảng điều khiển Kế toán** > tab **Quyết toán (Settlements)**.
2. Kiểm tra danh sách các Tour đã "Hoàn thành" (Completed) nhưng chưa được thanh toán (Pending Settlement).
3. Ấn nút **"Tạo lệnh Quyết toán"**.
4. Chọn danh sách giao dịch cần quyết toán. Hệ thống sẽ tự động giữ lại **10% Phí nền tảng** (Platform Fee) và hiển thị **90% Tiền thực nhận** của HDV.
5. Sau khi chuyển khoản cho HDV qua ngân hàng ngoài, cập nhật trạng thái thành **"Đã thanh toán" (Paid)**.

### 1.2 Xuất Hóa đơn điện tử (E-Invoicing)
1. Tại tab **Giao dịch (Transactions)**, tìm giao dịch của khách hàng.
2. Ấn nút **"Xuất Hóa đơn" (Generate Invoice)**. 
3. Hệ thống sẽ tạo PDF hóa đơn và tự động gửi email cho khách. Trạng thái sẽ chuyển từ *Uninvoiced* sang *Issued*.

### 1.3 Đối soát tự động (Reconciliation)
Vào cuối tháng, bạn có thể tải lên file sao kê ngân hàng (CSV) tại mục **Đối soát**.
1. Kéo thả file CSV vào khu vực tải lên.
2. Hệ thống sẽ quét qua thuật toán *Smart Auto-Reconciliation* để so khớp mã giao dịch (TxnRef).
3. Nếu phát hiện sai lệch (Thiếu tiền, thừa tiền), dòng đó sẽ bị bôi đỏ (Anomaly) để bạn xử lý thủ công.

---

## 🎧 2. Dành cho Chăm sóc Khách hàng (Support Staff)

Vai trò: Hỗ trợ người dùng, xử lý tranh chấp và điều phối tín hiệu khẩn cấp SOS.

### 2.1 Xử lý Tranh chấp Tour (Disputes)
Khi khách hàng hoặc HDV bấm "Báo cáo / Khiếu nại" trong màn hình Tour.
1. Truy cập **Support Dashboard** > tab **Tranh chấp (Disputes)**.
2. Nhấn vào một Ticket để xem chi tiết lý do. Bạn có thể xem lại lịch sử Chat giữa 2 bên để lấy bằng chứng.
3. 🤖 **AI Gợi ý (Agent Co-Pilot):** Nhấn nút "Hỏi AI" để Google Gemini phân tích lịch sử chat và đề xuất mức độ lỗi thuộc về ai.
4. Ra phán quyết: 
   - **Hoàn tiền 100% cho khách.** (Tiền sẽ chuyển sang hàng đợi của Kế toán).
   - **Thanh toán cho HDV.**
   - **Hòa giải.**

### 2.2 Xử lý Tín hiệu Khẩn cấp (SOS)
Tính năng SOS được thiết kế để giải quyết sự cố ngay lập tức trong quá trình đi tour.
1. Khi có báo động SOS, màn hình Dashboard sẽ nhấp nháy đỏ kèm âm thanh.
2. Click vào **SOS Alert** để xem tọa độ GPS hiện tại của khách hàng.
3. Gọi điện ngay lập tức cho số điện thoại của Khách hoặc HDV.
4. Sau khi giải quyết, đổi trạng thái thành **Đã xử lý (Resolved)**.

---

## 🛡️ 3. Dành cho Kiểm duyệt viên (Content Moderator)

Vai trò: Đảm bảo chất lượng Hướng dẫn viên và nội dung bài đăng.

### 3.1 Xét duyệt Hồ sơ Hướng dẫn viên (Verification)
Bất kỳ ai muốn trở thành HDV đều phải nộp hồ sơ KYC (CCCD, Bằng cấp/Thẻ HDV).
1. Truy cập **Content Dashboard** > tab **Xác thực (Verifications)**.
2. Kiểm tra tính hợp lệ của ảnh mặt trước/mặt sau CCCD và thẻ chứng nhận.
3. Chọn:
   - **Duyệt (Approve):** Tài khoản chính thức trở thành HDV.
   - **Từ chối (Reject):** Kèm theo lý do (Ví dụ: "Ảnh bị mờ", "Thẻ hết hạn").

### 3.2 Kiểm duyệt Tour và Bài viết
1. Hệ thống có tính năng **AI Moderation**. Mọi Tour hoặc Bài tìm bạn đồng hành có chứa từ ngữ phản cảm/độc hại sẽ tự động bị AI đánh cờ (Flagged).
2. Tại tab **Heatmap & Reports**, Kiểm duyệt viên sẽ xem lại các nội dung bị Flag.
3. Nếu vi phạm nghiêm trọng, tiến hành khóa nội dung hoặc khóa tài khoản cảnh cáo.
