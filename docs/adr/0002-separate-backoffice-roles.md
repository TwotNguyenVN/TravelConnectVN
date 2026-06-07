# ADR 0002: Tách biệt 4 Vai trò Quản trị (Backoffice Roles)

**Date:** 2026-06-07  
**Status:** Accepted  

## Context (Bối cảnh)
Trong các hệ thống thương mại điện tử hoặc marketplace truyền thống, thường chỉ có một vai trò "Admin" nắm giữ toàn bộ quyền sinh sát (duyệt người dùng, xem báo cáo tài chính, cấu hình hệ thống). Tuy nhiên, khi nền tảng TravelConnect VN mở rộng, việc gom chung mọi quyền hạn vào một vai trò duy nhất sẽ gây ra các rủi ro bảo mật nghiêm trọng:
1. **Bảo mật dòng tiền:** Một nhân viên kiểm duyệt nội dung không được phép truy cập vào các giao dịch tài chính hoặc rút tiền.
2. **Quy trình xử lý:** Hệ thống có tính năng khiếu nại (Dispute), đòi hỏi phải có nhân sự chuyên biệt đóng vai trò trọng tài để tránh cảm tính.
3. **Phân quyền Backend:** Việc kiểm tra quyền `if (user.role === 'ADMIN' && user.permissions.includes('FINANCE'))` sẽ làm phình to logic ở các API Controllers.

## Decision (Quyết định)
Thay vì sử dụng chung một Role `ADMIN` kết hợp với hệ thống Permissions phức tạp (RBAC), chúng ta quyết định **tách hẳn vai trò quản trị thành 4 Roles độc lập (Distinct Roles)** trong Database (Enum `Role`):

1. **`SYSTEM_ADMIN`**: Quản trị viên tối cao. Chuyên quản lý cấu hình hệ thống (System Settings), quản lý nhân sự (tạo tài khoản cho Kế toán, Kiểm duyệt viên) và xem các chỉ số Health Check của máy chủ.
2. **`CONTENT_MODERATOR`**: Kiểm duyệt viên. Đảm nhận việc phê duyệt/từ chối hồ sơ (Verification) của Hướng dẫn viên, duyệt các bài đăng (Companion Posts) và khóa các tài khoản vi phạm.
3. **`ACCOUNTANT`**: Kế toán. Chuyên trách quản lý luồng tiền (Cash Flow), đối soát thanh toán, và duyệt các yêu cầu rút tiền (Withdrawal Requests) của Hướng dẫn viên.
4. **`SUPPORT_STAFF`**: Nhân viên CSKH. Đóng vai trò trọng tài xử lý các khiếu nại (Disputes) trong các chuyến đi, xem xét bằng chứng và đưa ra phán quyết hoàn tiền (Refund).

Tương ứng ở Frontend, thay vì nhét chung mọi tính năng vào một trang `/admin`, chúng ta sẽ chia thành các layouts tách biệt để dễ dàng cấu hình code-splitting.

## Consequences (Hệ quả)
- **Ưu điểm:** 
  - Code rõ ràng, tường minh. Phân quyền ở mức Controller (sử dụng `@Roles(Role.ACCOUNTANT)`) trở nên cực kỳ ngắn gọn và dễ audit (kiểm toán mã nguồn).
  - An toàn tối đa cho dòng tiền và dữ liệu cá nhân. Các module Backend được cô lập (Loose Coupling).
- **Nhược điểm:** 
  - Đội ngũ phát triển Frontend phải xây dựng 4 thanh điều hướng (Sidebar) riêng biệt cho từng vai trò thay vì dùng chung 1 cái.
  - Sẽ tốn thêm một chút thời gian để thiết lập tài khoản test cho đủ cả 4 role này khi triển khai.
