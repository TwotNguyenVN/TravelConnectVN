# 📝 BẢN ĐẶC TẢ NGHIỆP VỤ & TÍNH NĂNG CHI TIẾT THEO VAI TRÒ (BACKOFFICE)

Tài liệu này xác định chi tiết các chức năng, nghiệp vụ thực tế và các ý tưởng sáng tạo cho 4 vai trò quản trị trong hệ thống **TravelConnectVN**, tương ứng với các phân vùng giao diện (Layout/Sidebar) đã được phân tách.

---

## 1. SYSTEM_ADMIN (Quản trị viên Hệ thống)
**Địa chỉ truy cập**: `http://localhost:5173/admin`  
**Layout/Sidebar**: `AdminLayout` / `AdminSidebar`  
**Tập trung vào**: Quản trị tối cao, vận hành hệ thống, bảo mật, kiểm toán hoạt động và quản lý nhân sự cấp dưới.

### 1.1. Các chức năng cốt lõi (Core Features)
*   **Quản lý Nhân sự & Phân quyền (Staff & RBAC Management)**:
    *   Tạo mới, đình chỉ, kích hoạt tài khoản của các nhân viên nội bộ (`CONTENT_MODERATOR`, `SUPPORT_STAFF`, `ACCOUNTANT`).
    *   Phân quyền chi tiết hoặc thay đổi vai trò (Role Mapping) của người dùng/nhân viên.
*   **Nhật ký kiểm toán hệ thống (System Audit Logs)**:
    *   Xem toàn bộ lịch sử hoạt động của nhân viên thông qua bảng `admin_activity_logs`.
    *   Ghi vết chi tiết: Ai đã thực hiện, hành động gì (Thêm/Sửa/Xóa/Duyệt), thời gian, địa chỉ IP, và dữ liệu trước/sau khi thay đổi.
*   **Cấu hình hệ thống toàn cục (Global Settings & Parameters)**:
    *   Cấu hình tỷ lệ phí dịch vụ/phí hoa hồng (Commission Rate) áp dụng trên mỗi lượt đặt tour thành công (ví dụ: 10%).
    *   Quản lý danh mục dùng chung toàn hệ thống: Tỉnh/Thành phố (`provinces`), Ngôn ngữ (`languages`), Kỹ năng (`skills`), Danh mục tour (`tour_categories`).
*   **Bảng giám sát sức khỏe hệ thống (System Health Dashboard)**:
    *   Theo dõi trạng thái kết nối và hiệu năng của các dịch vụ liên kết: Supabase Database, Storage, Auth, cổng thanh toán VNPAY, dịch vụ gửi Email.
    *   Thống kê tài nguyên lưu trữ (Storage Usage) của các hình ảnh tour và tài liệu xác minh.

### 1.2. Nghiệp vụ thực tế & Ý tưởng mới (Realistic & Novel Ideas)
*   **Chế độ Bảo trì Hệ thống (Maintenance Mode)**:
    *   Cho phép Admin kích hoạt chế độ bảo trì. Khi bật, toàn bộ ứng dụng Client sẽ hiển thị trang bảo trì và chặn các request ghi dữ liệu (POST/PATCH/DELETE) để đảm bảo an toàn khi nâng cấp cơ sở dữ liệu.
*   **Cảnh báo Đăng nhập & Hoạt động Bất thường (Anomaly Detection)**:
    *   Hệ thống tự động phát hiện và cảnh báo lên Dashboard nếu một nhân viên đăng nhập từ IP lạ, quốc gia khác, hoặc thực hiện hàng loạt thao tác thay đổi dữ liệu nhạy cảm trong thời gian ngắn.
*   **Công cụ Khôi phục Dữ liệu nhanh (Soft Delete Recovery Console)**:
    *   Giao diện cho phép Admin tìm kiếm và khôi phục các bản ghi đã bị xóa mềm (Soft Deleted) như bài đăng Tour, Tài khoản HDV hoặc Review mà không cần truy cập trực tiếp vào DB.

---

## 2. CONTENT_MODERATOR (Kiểm duyệt viên Nội dung)
**Địa chỉ truy cập**: `http://localhost:5173/content`  
**Layout/Sidebar**: `ContentLayout` / `ContentSidebar`  
**Tập trung vào**: Đảm bảo chất lượng thông tin, phê duyệt tài khoản hướng dẫn viên và xử lý báo cáo vi phạm nội dung.

### 2.1. Các chức năng cốt lõi (Core Features)
*   **Quy trình Phê duyệt Hướng dẫn viên (Guide Verification Workflow)**:
    *   Tiếp nhận các yêu cầu xác minh tài khoản HDV từ bảng `guide_verification_requests`.
    *   Xem hồ sơ năng lực, bằng cấp, thẻ HDV quốc tế/nội địa đính kèm trong `guide_verification_documents`.
    *   Phê duyệt để HDV có thể bắt đầu tạo tour, hoặc Từ chối kèm theo ghi chú lý do chi tiết (gửi email thông báo tự động cho HDV).
*   **Quản lý Báo cáo Vi phạm (Report Management)**:
    *   Nhận thông tin báo cáo từ người dùng đối với các thực thể: Tour (`tours`), Đánh giá tour (`tour_reviews`), Hồ sơ HDV (`guide_profiles`).
    *   Xem lịch sử xử lý báo cáo (`report_processing_history`).
    *   Ra quyết định xử lý: Giữ nguyên, Ẩn nội dung (`visibility_status` = `'hidden'`), hoặc Cảnh cáo tài khoản vi phạm.
*   **Kiểm duyệt Tour đăng mới (Tour Review Workflow)**:
    *   Xác minh các tour du lịch mới do HDV tạo để đảm bảo thông tin mô tả rõ ràng, không chứa hình ảnh phản cảm, nội dung lừa đảo hoặc vi phạm thuần phong mỹ tục trước khi hiển thị công khai trên chợ tour.
*   **Quản lý Bài viết ghép đoàn (Companion Posts Moderation)**:
    *   Duyệt bài đăng ghép đoàn (`companion_posts`) và các yêu cầu tham gia (`companion_requests`) nhằm ngăn chặn tin rác, quảng cáo cờ bạc, spa, hoặc dịch vụ ngoài luồng.

### 2.2. Nghiệp vụ thực tế & Ý tưởng mới (Realistic & Novel Ideas)
*   **Hệ thống Hỗ trợ Kiểm duyệt bằng AI (AI-Assisted Auto-Moderation)**:
    *   Tích hợp bộ lọc từ ngữ nhạy cảm và mô hình AI phân tích hình ảnh/văn bản. Tự động gắn cờ (Flag) và tô đỏ các từ khóa nghi ngờ (SĐT, Email cá nhân trong lịch trình tour, ngôn từ xúc phạm trong review) để Moderator xử lý nhanh.
*   **Chỉ số Uy tín của Hướng dẫn viên (Guide Reputation Score)**:
    *   Thiết lập hệ thống điểm uy tín mặc định là 100. Điểm này tự động bị khấu trừ nếu HDV có tour bị báo cáo vi phạm được duyệt, tự ý hủy tour sát giờ, hoặc nhận đánh giá 1 sao. Điểm thấp dưới mức sàn sẽ tự động khóa tài khoản tạm thời.
*   **Bản đồ Nhiệt Báo cáo (Report Heatmap & Trends)**:
    *   Biểu đồ phân tích xu hướng báo cáo vi phạm (ví dụ: khu vực nào có nhiều báo cáo lừa đảo nhất, loại vi phạm nào đang phổ biến) để có biện pháp thắt chặt kiểm duyệt.

---

## 3. SUPPORT_STAFF (Nhân viên Hỗ trợ Khách hàng)
**Địa chỉ truy cập**: `http://localhost:5173/support`  
**Layout/Sidebar**: `SupportLayout` / `SupportSidebar`  
**Tập trung vào**: Chăm sóc khách hàng, giải quyết khiếu nại, hỗ trợ kỹ thuật và can thiệp giải quyết tranh chấp đặt tour.

### 3.1. Các chức năng cốt lõi (Core Features)
*   **Hệ thống Yêu cầu Hỗ trợ (Support Ticket Management)**:
    *   Tiếp nhận các yêu cầu trợ giúp từ người dùng (User/Guide) gửi qua biểu mẫu liên hệ hoặc email hỗ trợ.
    *   Phân loại ticket (Lỗi thanh toán, Tranh chấp lịch trình, Sự cố tài khoản, Đóng góp ý kiến).
    *   Gán trạng thái (Chờ xử lý, Đang xử lý, Đã đóng) và chỉ định nhân viên phụ trách (Assignee).
*   **Giao diện Can thiệp Tranh chấp (Dispute Resolution Console)**:
    *   Khi có khiếu nại về một chuyến đi (ví dụ: HDV không đến đón, khách hàng hành xử không đúng mực), Support Staff có thể truy cập xem thông tin đặt tour (`tour_requests`), lịch trình thực tế, và lịch sử đoạn chat của hai bên.
    *   Đưa ra phán quyết xử lý tranh chấp và chuyển tiếp yêu cầu hoàn tiền (nếu có) cho bộ phận Kế toán.
*   **Bộ công cụ Gửi Thông báo diện rộng (Notification Broadcaster)**:
    *   Soạn thảo và gửi thông báo hệ thống (`notifications`) đến các nhóm đối tượng mục tiêu (tất cả khách hàng, tất cả HDV tại Hà Nội, hoặc một cá nhân cụ thể).
*   **Kho câu hỏi thường gặp & Trả lời nhanh (FAQ & Quick Responses Editor)**:
    *   Quản lý danh sách các câu hỏi thường gặp. Nhân viên hỗ trợ có thể soạn thảo câu trả lời mẫu để chèn nhanh vào cửa sổ chat hỗ trợ khách hàng.

### 3.2. Nghiệp vụ thực tế & Ý tưởng mới (Realistic & Novel Ideas)
*   **Bảng Điều phối Hỗ trợ Khẩn cấp (SOS/Emergency Dashboard)**:
    *   Tính năng đặc biệt dành cho các tình huống khẩn cấp ngoài đời thực (khách hàng gặp tai nạn, lạc đường khi đang đi tour). Khi khách hàng ấn nút SOS trên app, hệ thống lập tức đổ chuông cảnh báo lớn trên Dashboard của Support Staff kèm vị trí GPS thời gian thực.
*   **Trợ lý Chatbot Hỗ trợ Nhân viên (Agent Co-Pilot)**:
    *   Khi nhân viên đang chat với khách hàng, AI sẽ gợi ý câu trả lời phù hợp dựa trên kho dữ liệu FAQ và lịch sử các cuộc hội thoại tương tự đã giải quyết trong quá khứ.
*   **Báo cáo Đánh giá Độ hài lòng (CSAT & SLA Analytics)**:
    *   Thống kê thời gian phản hồi trung bình (SLA) của từng nhân viên và hiển thị biểu đồ điểm đánh giá độ hài lòng (Customer Satisfaction Score) do khách hàng gửi sau khi ticket được đóng.

---

## 4. ACCOUNTANT (Kế toán & Tài chính)
**Địa chỉ truy cập**: `http://localhost:5173/accountant`  
**Layout/Sidebar**: `FinanceLayout` / `FinanceSidebar`  
**Tập trung vào**: Quản lý dòng tiền, xử lý thanh toán/hoàn tiền, quyết toán doanh thu hoa hồng cho hướng dẫn viên và báo cáo tài chính.

### 4.1. Các chức năng cốt lõi (Core Features)
*   **Lịch sử Giao dịch & Đối soát (Transaction Ledger)**:
    *   Giám sát toàn bộ các giao dịch tài chính (`payment_transactions`) trong hệ thống.
    *   Tra cứu thông tin chi tiết: Mã tham chiếu cổng thanh toán (VNPAY/MOMO), số tiền, trạng thái, thời gian, tài khoản thực hiện.
*   **Phê duyệt & Thực hiện Hoàn tiền (Refund Operations)**:
    *   Xử lý các yêu cầu hoàn tiền đang chờ (`refund_pending`) phát sinh từ việc hủy đặt tour hợp lệ.
    *   Tích hợp API cổng thanh toán để thực hiện hoàn tiền tự động (Auto-Refund), hoặc cho phép đánh dấu xác nhận hoàn tiền thủ công (nếu chuyển khoản ngoài) kèm biên lai đính kèm.
*   **Quyết toán Thu nhập cho Hướng dẫn viên (Guide Payouts & Commission)**:
    *   Tính toán thu nhập thực tế của HDV (Doanh thu bán tour trừ đi phí hoa hồng của hệ thống).
    *   Tạo danh sách lệnh chuyển tiền định kỳ cho các HDV có số dư đạt hạn mức thanh toán tối thiểu.
    *   Theo dõi và đối soát các khoản nợ phát sinh trong chuyến đi (`trip_expenses`) đã được quyết toán thông qua `settleDebts`.
*   **Báo cáo & Thống kê Tài chính (Financial Analytics)**:
    *   Biểu đồ doanh thu tổng (Gross Revenue), doanh thu thuần (Net Commission Revenue), số tiền đã hoàn trả (Refunded).
    *   Thống kê dòng tiền theo phương thức thanh toán, theo thời gian (ngày, tuần, tháng, quý).
    *   Xuất dữ liệu báo cáo tài chính ra file Excel/PDF phục vụ khai báo thuế và quản trị doanh nghiệp.

### 4.2. Nghiệp vụ thực tế & Ý tưởng mới (Realistic & Novel Ideas)
*   **Đối soát Tự động thông minh (Smart Reconciliation)**:
    *   Cho phép kế toán tải lên file Excel sao kê từ ngân hàng hoặc cổng thanh toán. Hệ thống sẽ tự động chạy thuật toán đối chiếu chênh lệch giữa dữ liệu giao dịch trên Database hệ thống và dữ liệu sao kê thực tế, tự động phát hiện và gắn cờ các giao dịch sai lệch số tiền hoặc bị bỏ sót.
*   **Hóa đơn điện tử tự động (Automated E-Invoicing)**:
    *   Ngay sau khi giao dịch đặt tour thành công và được cập nhật, hệ thống tự động xuất hóa đơn VAT điện tử (dưới dạng PDF đẹp, chuẩn hóa) và gửi qua email cho khách hàng, đồng thời lưu trữ vào kho hóa đơn để phục vụ quyết toán thuế cuối năm.
*   **Hệ thống Dự báo Dòng tiền (Cash Flow Forecasting)**:
    *   Dựa trên số lượng tour đã được đặt và lịch khởi hành trong tương lai gần, hệ thống tính toán và dự báo dòng tiền dự kiến sẽ thu được và số tiền dự kiến phải thanh toán cho HDV trong 30 ngày tiếp theo.
