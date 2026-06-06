# 📝 BẢN ĐẶC TẢ NGHIỆP VỤ & TÍNH NĂNG CHI TIẾT THEO VAI TRÒ (BACKOFFICE) - ENTERPRISE EDITION

Tài liệu này xác định chi tiết các chức năng, nghiệp vụ thực tế và các ý tưởng nâng cấp sáng tạo cho 4 vai trò quản trị trong hệ thống **TravelConnectVN**, tương ứng với các phân vùng giao diện (Layout/Sidebar) đã được phân tách.

---

## 1. 🔴 SYSTEM_ADMIN (Quản trị viên Hệ thống)
**Địa chỉ truy cập**: `http://localhost:5173/admin`  
**Layout/Sidebar**: `AdminLayout` / `AdminSidebar`  
**Tập trung vào**: Quản trị tối cao, vận hành hệ thống, bảo mật, kiểm toán hoạt động và quản lý nhân sự cấp dưới.

### 1.1. Các chức năng cốt lõi (Core Features)
*   **Quản lý Nhân sự & Phân quyền (Staff & RBAC Management)**: Tạo mới, đình chỉ, kích hoạt tài khoản của các nhân viên nội bộ (`CONTENT_MODERATOR`, `SUPPORT_STAFF`, `ACCOUNTANT`).
*   **Nhật ký kiểm toán hệ thống (System Audit Logs)**: Xem lịch sử hoạt động của nhân viên thông qua bảng `admin_activity_logs`. Ghi vết chi tiết hành động, IP, và dữ liệu trước/sau thay đổi.
*   **Cấu hình hệ thống toàn cục (Global Settings)**: Cấu hình tỷ lệ hoa hồng (Commission Rate) và quản lý danh mục dùng chung (Tỉnh thành, Ngôn ngữ, Kỹ năng, Danh mục tour).

### 1.2. Tính năng nâng cấp & Tự động hóa (Enterprise Upgrades)
*   **Kill Switch & Feature Flags (Quản lý tính năng động)**: Cho phép Admin bật/tắt các tính năng cụ thể (như VNPAY, Chat, tính năng ghép đoàn) ngay lập tức trên production mà không cần deploy lại code. Hỗ trợ "Chế độ Bảo trì" toàn trang khi nâng cấp DB.
*   **Security Dashboard & Auto-ban (Giám sát An ninh)**: Biểu đồ thời gian thực phát hiện các IP có dấu hiệu spam, cào dữ liệu hoặc tấn công DDoS. Hệ thống tự động chặn (Rate Limit / IP Ban) và báo cáo đỏ lên màn hình Admin.
*   **One-Click Backup & Recovery**: Giao diện kích hoạt sao lưu cơ sở dữ liệu (Database Backup) thủ công bằng 1 click hoặc thiết lập lịch backup tự động lên Cloud Storage. Tích hợp công cụ Khôi phục Dữ liệu nhanh (Soft Delete Recovery) trực tiếp trên giao diện.

---

## 2. 🟢 CONTENT_MODERATOR (Kiểm duyệt viên Nội dung)
**Địa chỉ truy cập**: `http://localhost:5173/content`  
**Layout/Sidebar**: `ContentLayout` / `ContentSidebar`  
**Tập trung vào**: Đảm bảo chất lượng thông tin, phê duyệt tài khoản hướng dẫn viên và xử lý báo cáo vi phạm.

### 2.1. Các chức năng cốt lõi (Core Features)
*   **Quy trình Phê duyệt Hướng dẫn viên**: Tiếp nhận yêu cầu xác minh, xem hồ sơ, bằng cấp, thẻ HDV để duyệt hoặc từ chối kèm lý do.
*   **Quản lý Báo cáo Vi phạm (Report Management)**: Xử lý báo cáo về Tour, Đánh giá, hoặc Hồ sơ HDV. Ra quyết định Ẩn nội dung hoặc Cảnh cáo.
*   **Kiểm duyệt Tour & Bài đăng**: Xác minh tour mới và bài viết ghép đoàn trước khi hiển thị công khai để ngăn chặn nội dung lừa đảo.

### 2.2. Tính năng nâng cấp & Tự động hóa (Enterprise Upgrades)
*   **AI Auto-Moderation (Duyệt nội dung bằng AI)**: 
    *   Tích hợp AI (Google Vision/Gemini) tự động quét hình ảnh nhạy cảm và văn bản tìm kiếm SĐT/Email "luồn lách" ra ngoài nền tảng.
    *   Tự động gắn cờ (Flag) và tô đỏ các từ khóa nghi ngờ để Moderator xử lý nhanh.
*   **Trust & Safety Score (Điểm tín nhiệm tự động)**: Hệ thống tự động tính điểm uy tín (0-100) của HDV/User dựa trên số lần bị report, tỷ lệ hủy tour, và review sao. Điểm thấp dưới sàn sẽ tự động bị "Shadow ban" hoặc khóa tài khoản tạm thời.
*   **Diff Viewer (Trình so sánh thay đổi)**: Khi HDV sửa thông tin một tour đã duyệt, hệ thống hiển thị giao diện bôi xanh (thêm) và bôi đỏ (xóa) giống GitHub PR, giúp Moderator duyệt siêu tốc mà không cần đọc lại toàn bộ bài.

---

## 3. 🔵 SUPPORT_STAFF (Nhân viên Hỗ trợ Khách hàng)
**Địa chỉ truy cập**: `http://localhost:5173/support`  
**Layout/Sidebar**: `SupportLayout` / `SupportSidebar`  
**Tập trung vào**: Chăm sóc khách hàng, giải quyết khiếu nại, hỗ trợ kỹ thuật và can thiệp tranh chấp.

### 3.1. Các chức năng cốt lõi (Core Features)
*   **Hệ thống Yêu cầu Hỗ trợ (Support Ticket)**: Tiếp nhận ticket, phân loại (Lỗi thanh toán, Tranh chấp, Sự cố tài khoản), gán trạng thái và nhân viên phụ trách.
*   **Giao diện Can thiệp Tranh chấp**: Truy cập thông tin lịch trình, lịch sử chat giữa khách và HDV để đưa ra phán quyết.
*   **Kho câu hỏi thường gặp (FAQ)**: Quản lý câu hỏi mẫu và trả lời nhanh.

### 3.2. Tính năng nâng cấp & Tự động hóa (Enterprise Upgrades)
*   **Smart Ticket Routing & SLA Countdown**: 
    *   Phân luồng thông minh: Ticket chứa từ khóa "thanh toán, tiền" tự động chuyển cho Kế toán.
    *   Đồng hồ SLA: Đặt thời gian xử lý tối đa (ví dụ 2h), ticket gần hết hạn sẽ nhấp nháy đỏ báo động.
*   **SOS Emergency Dashboard (Điều phối Khẩn cấp)**: Tính năng SOS trên App khi khách gặp nạn/đi lạc. Gửi cảnh báo âm thanh lớn trên Dashboard kèm hiển thị **tọa độ GPS Real-time** của khách và HDV trên bản đồ để hỗ trợ lập tức.
*   **Live Co-Browsing / Session Replay**: Cho phép hỗ trợ viên xem lại video replay thao tác cuối cùng của người dùng (via LogRocket/Sentry) để hiểu rõ họ đang kẹt ở bước nào mà không cần khách mô tả dài dòng.

---

## 4. 🟡 ACCOUNTANT (Kế toán & Tài chính)
**Địa chỉ truy cập**: `http://localhost:5173/accountant`  
**Layout/Sidebar**: `FinanceLayout` / `FinanceSidebar`  
**Tập trung vào**: Quản lý dòng tiền, xử lý thanh toán/hoàn tiền, quyết toán doanh thu hoa hồng.

### 4.1. Các chức năng cốt lõi (Core Features)
*   **Lịch sử Giao dịch (Transaction Ledger)**: Giám sát toàn bộ giao dịch VNPAY/MOMO, tra cứu mã tham chiếu, trạng thái.
*   **Xử lý Hoàn tiền (Refund Operations)**: Xử lý yêu cầu hoàn tiền do hủy tour hợp lệ, đánh dấu xác nhận hoàn tiền.
*   **Quyết toán (Guide Payouts)**: Tính toán thu nhập thực tế của HDV sau khi trừ hoa hồng, tạo lệnh chuyển tiền.

### 4.2. Tính năng nâng cấp & Tự động hóa (Enterprise Upgrades)
*   **Smart Auto-Reconciliation (Đối soát chéo tự động)**: Kế toán tải file Excel sao kê từ ngân hàng lên. Thuật toán tự động khớp (map) các mã giao dịch (Transaction ID) với cơ sở dữ liệu, tự động tô đỏ các khoản lệch tiền, thiếu hoặc thừa giao dịch.
*   **Automated E-Invoicing (Hóa đơn điện tử tự động)**: Tích hợp API của bên thứ ba (VNPT Invoice/MISA). Ngay khi tour hoàn tất, hệ thống tự động xuất hóa đơn VAT điện tử bản PDF chuẩn hóa và gửi email cho khách.
*   **Cashflow Forecasting (Dự báo dòng tiền)**: Biểu đồ dự báo thông minh dựa trên lượng tour đã đặt trước trong 30-90 ngày tới, tính toán trước "Tiền thực thu" và "Tiền hoa hồng phải trả" để tối ưu hóa vốn lưu động.
