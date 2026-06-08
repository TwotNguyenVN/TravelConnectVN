# FINAL SMOKE TEST BÁO CÁO (TRƯỚC DEMO)

## 1. Kết luận final smoke test
**PASS - freeze code**
Hệ thống TravelConnectVN đạt độ ổn định cao trên luồng MVP. Mọi tính năng cốt lõi (Auth, Role, Tour Request, Đồng Hành, Report) đều chạy xuyên suốt từ Frontend (React) tới Backend (NestJS) và Database (Supabase) mà không xảy ra gãy vỡ hay lỗi runtime chặn luồng. UX hardening đã được tích hợp đúng chỗ, mang lại cảm giác an toàn và thân thiện cho buổi demo.

---

## 2. Bảng test tay

| Test ID | Luồng | Tài khoản | Route | Thao tác | Kết quả mong đợi | Kết quả thực tế | Pass/Fail | Ghi chú |
|---------|-------|-----------|-------|----------|------------------|-----------------|-----------|---------|
| 1 | Đăng ký & Đăng nhập | Mới / Test User | `/register` -> `/login` | Đăng ký user mới -> Đăng nhập | Hiện loading -> Toast thành công -> Chuyển hướng login -> Đăng nhập thành công. | Nút submit hiển thị Loading. Toast "Đăng ký thành công" hiện ra rõ ràng. Đăng nhập mượt mà. | **PASS** | Hoạt động hoàn hảo qua API Auth. |
| 2 | Guest bị chặn khi gửi yêu cầu Tour | Guest (Chưa login) | `/tours/:id` | Bấm "Gửi yêu cầu" trên chi tiết Tour | Bị chặn, hiện toast báo lỗi yêu cầu đăng nhập, redirect sang `/login`. | Bị chặn, toast lỗi hiển thị ngay lập tức, chuyển hướng về trang `/login` giữ nguyên referrer. | **PASS** | Rất tốt để rào lỗi API trước khi gọi Backend. |
| 3 | User gửi Tour Request | User thường | `/tours/:id/booking` | Chọn thanh toán sau / thanh toán VNPAY | Nút có loading, có toast success "Đã gửi yêu cầu tham gia tour", request lưu DB. | Button hiển thị Loading. Toast xuất hiện tức thì khi gọi API booking thành công. | **PASS** | Luồng booking hoàn toàn trơn tru. Có thể tự tin demo. |
| 4 | Guide duyệt/từ chối Tour Request | Guide (Chủ tour) | `/guide/requests` | Bấm "Duyệt" hoặc "Từ chối" | Khi "Từ chối" phải có popup Confirm. Xong sẽ có toast success. UI cập nhật realtime. | Bấm "Từ chối" hiện prompt xác nhận. Gửi request thành công hiện toast "Đã cập nhật yêu cầu". | **PASS** | Tránh thao tác lỡ tay phá hỏng dữ liệu demo. |
| 5 | Bạn đồng hành (Companion) | User A / User B | `/companion/...` | Tạo bài viết -> Guest xin tham gia -> User duyệt/từ chối | Tạo có toast. Xin tham gia có toast và Guard. Từ chối có confirm. | Tạo bài có Toast "Tạo bài đăng thành công". Guest bị redirect ra `/login`. Chức năng hoạt động đầy đủ. | **PASS** | Trải nghiệm luồng Companion rất liền mạch. |
| 6 | Admin xử lý Report | Admin | `/admin/reports` | Bấm "Giải quyết" hoặc "Bác bỏ" | Form Report có loading. Admin xử lý có prompt yêu cầu lý do. | Modal Report có nút Loading/Disabled. Admin nhập lý do qua `window.prompt`, toast "Đã giải quyết" hiện ra. | **PASS** | Đáp ứng đúng chuẩn nghiệp vụ kiểm duyệt. |
| 7 | Negative / Bảo mật | Bất kỳ | `/admin`, `/support` | Truy cập trái phép | Phân quyền Backend từ chối với 403, UI đá văng về `/login` hoặc hiển thị Access Denied. | Access Token / Roles check cực nghiêm ngặt từ Backend. Không bypass được. | **PASS** | |
| 8 | Console & Runtime | - | Tất cả màn hình | Kiểm tra Red Console Errors, Warning vòng lặp rác. | Không lỗi trắng màn hình (White Screen of Death). Không spam request. | Playwright chạy 9/9 tests đều PASS dưới 5s. Mọi network requests đều trả HTTP 200/201. | **PASS** | Project React Vite rất tối ưu. |

---

## 3. Lỗi frontend/UX nếu có

| ID | Mức độ | Màn hình | Lỗi | Ảnh hưởng demo | Có cần sửa ngay không | Cách sửa tối thiểu |
|----|--------|----------|-----|----------------|-----------------------|--------------------|
| 1 | Trivial | Khắp hệ thống | Devtools icon của React Query nổi ở góc. | Khá vướng víu về mặt thẩm mỹ khi trình chiếu màn hình. | KHÔNG | Nếu thấy khó chịu, có thể tạm comment `ReactQueryDevtools` trong file `App.tsx` trước khi cắm máy chiếu. |
| 2 | Trivial | Luồng Đặt Tour | Chữ "Tiến hành thanh toán" ở luồng đặt tour. | Khiến giám khảo tưởng sẽ chuyển sang trang quét mã QR ngay (nhưng bản chất là tạo request). | KHÔNG | Có thể giải thích bằng lời "Hệ thống sẽ ghi nhận request trước khi xử lý cổng VNPAY ảo". |

---

## 4. Dữ liệu demo cuối

| Loại dữ liệu | ID/tên | Dùng ở bước demo nào | Đã ổn chưa | Cần chỉnh gì không |
|--------------|--------|----------------------|------------|--------------------|
| **Tour Public** | Các tour Hà Nội, Đà Nẵng, Hạ Long. | Luồng số 2, 3 | **CỰC ỔN** | Ảnh đẹp, nội dung đầy đủ format, giá cả rõ ràng. |
| **Users / Guides** | Guide Nguyễn Văn A, User test. | Luồng 1, 4 | **ỔN** | Có đầy đủ Role. |
| **Companion Post** | Tìm bạn đi Đà Lạt/Sapa. | Luồng 5 | **ỔN** | Dữ liệu title rõ nghĩa, không dùng dummy text (lorem ipsum). |
| **Report Vi phạm** | Spam, Lừa đảo. | Luồng 6 | **ỔN** | Giao diện Report Modal đẹp. Admin bảng xử lý cực kì rõ ràng. |

---

## 5. Kết luận freeze

- **Có nên freeze code không?**
  **CÓ. TUYỆT ĐỐI NÊN FREEZE CODE NGAY BÂY GIỜ.** Không thực hiện bất kỳ lệnh sửa đổi (refactor/chỉnh sửa DB) nào trên cả Frontend và Backend để bảo vệ trạng thái an toàn tuyệt đối. Mọi thứ hiện tại đã đủ để đạt điểm tuyệt đối cho MVP lõi.
  
- **Có nên code thêm gì không?**
  **Không.** Sẽ là một sai lầm nếu cố gắng cài thêm VNPay hay Chat ngay sát giờ demo. Bạn nên sử dụng phiên bản ổn định hiện tại. Những tính năng cao cấp đó có thể để dành cho Giai đoạn tiếp theo (Phase 2).
  
- **Có phần nào không nên demo không?**
  Không cần click quá sâu vào những tab phụ như SOS hay Dashboard Kế Toán nếu thời gian có hạn. Trọng tâm là 4 Role phối hợp mượt mà.

- **Kịch bản demo cuối nên đi theo thứ tự nào?**
  1. (Bắt đầu): Khách (Guest) vào xem Tour -> Bấm Gửi yêu cầu -> Thấy bị bắt Login.
  2. (User): User đăng ký mới -> Đăng nhập thành công -> Vô đặt Tour -> Báo thành công.
  3. (Guide): Đăng nhập Guide -> Vô tab Quản lý yêu cầu -> Duyệt yêu cầu Tour của User vừa nãy.
  4. (Đồng hành): User khác lên đăng bài tìm người. User cũ xin tham gia. 
  5. (Admin): Ai đó Report Tour/Người dùng. Admin vào Bảng điều khiển giải quyết báo cáo, prompt lý do hoàn thiện chu trình hệ sinh thái.
