# ADR 0003: Phân tách 4 Vai trò Backoffice Độc lập

**Ngày:** 2026-06-07
**Trạng thái:** Đã chấp thuận

## Ngữ cảnh (Context)
Trong một nền tảng Marketplace như TravelConnect VN, có rất nhiều nghiệp vụ quản trị phức tạp: Duyệt hồ sơ, Khóa tài khoản, Xử lý giao dịch, Hoàn tiền, Xử lý SOS, Tranh chấp, và Cấu hình hệ thống. Nếu gộp chung tất cả vào một tài khoản "Admin" duy nhất, hệ thống sẽ gặp vấn đề lớn về bảo mật và phân quyền (Principle of Least Privilege).

## Quyết định (Decision)
Phân tách vai trò Backoffice thành 4 Role chuyên biệt:
1. **SYSTEM_ADMIN:** Quản trị cấu hình toàn cục, theo dõi sức khỏe server, xem log kỹ thuật.
2. **ACCOUNTANT:** Quản lý giao dịch, dòng tiền, xuất hóa đơn điện tử, đối soát tài chính, duyệt hoàn tiền.
3. **SUPPORT_STAFF:** Giải quyết khiếu nại, chat hỗ trợ, điều phối tín hiệu khẩn cấp SOS.
4. **CONTENT_MODERATOR:** Xét duyệt hồ sơ Hướng dẫn viên, kiểm duyệt tour và khóa nội dung vi phạm.

Mỗi vai trò sẽ có một Layout riêng trên Frontend (`AdminLayout`, `FinanceLayout`, `SupportLayout`, `ContentLayout`) và Role Guard riêng trên Backend (`@Roles(Role.ACCOUNTANT)`, v.v.).

## Lý do (Rationale)
1. **Bảo mật tối đa:** Một nhân viên CSKH bị lộ mật khẩu cũng không thể truy cập vào Module Kế toán để thực hiện lệnh chuyển tiền.
2. **Trải nghiệm người dùng:** Các menu và trang điều khiển (Dashboard) của từng Role sẽ gọn gàng và tập trung đúng vào chuyên môn của họ. Không bị "ngợp" bởi hàng tá chức năng không liên quan.
3. **Dễ dàng Scale nhân sự:** Khi công ty phát triển, việc tuyển thêm nhân viên Kế toán hay CSKH mới sẽ dễ dàng phân quyền hơn mà không lo rò rỉ quyền hạn hệ thống.

## Hệ quả (Consequences)
- **Tích cực:** Bảo mật cao, mã nguồn tách biệt, dễ bảo trì, dễ mở rộng (Scalability of Teams).
- **Tiêu cực:** Phải viết lặp lại nhiều Layout trên frontend và cấu hình Route phức tạp hơn. Phải thiết kế RoleGuard kỹ lưỡng trên backend. Tuy nhiên, sự đánh đổi này là hoàn toàn xứng đáng cho một hệ thống cấp Enterprise.
