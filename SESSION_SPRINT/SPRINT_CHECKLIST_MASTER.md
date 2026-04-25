# SPRINT_CHECKLIST_MASTER.md

# Checklist tổng hợp theo dõi tiến độ Sprint 01–14  
**Dự án:** Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành

---

## Cách dùng
- Mỗi sprint chỉ nên được xem là **hoàn thành** khi đã tick đủ các mục cốt lõi.
- Nếu thiếu thời gian, ưu tiên hoàn tất theo thứ tự: **Database → API/Backend → Frontend → Test flow → UML/Tài liệu**.
- Không mở rộng phạm vi sprint khi các mục lõi chưa hoàn tất.

## Trạng thái đề xuất
- `[ ]` Chưa làm
- `[-]` Đang làm
- `[x]` Hoàn thành

## Tiêu chuẩn “xong sprint” dùng chung
- [x] Có thay đổi schema/migration nếu sprint có đụng CSDL
- [x] Có seed hoặc dữ liệu demo để test
- [x] Có API chạy được
- [x] Có màn hình nối API
- [x] Có test flow tối thiểu
- [x] Có cập nhật UML/tài liệu liên quan

---

# Giai đoạn A. Nền tảng và kiến trúc lõi

## Sprint 01 – Nền tảng kỹ thuật tổng thể
### Mục tiêu chính
- [x] Chốt stack: ReactJS + NestJS + TypeScript + Supabase/PostgreSQL
- [x] Chốt kiến trúc 4 khu vực: Public / User / Guide / Admin
- [x] Chốt chuẩn response API, error format, naming convention
- [x] Chốt chiến lược migration, seed, env, cấu trúc source

### Database
- [x] Import schema final
- [x] Tạo seed roles cơ bản
- [ ] Tạo admin account ban đầu
- [x] Chuẩn bị bảng nền: users, roles, user_roles, admin_activity_logs, user_role_change_logs

### Backend
- [x] Khởi tạo project NestJS
- [x] Tạo module nền, auth guard, role guard
- [x] Tạo health check
- [ ] Tạo logger / audit service nền

### Frontend
- [x] Khởi tạo project ReactJS
- [x] Cấu hình router cho 4 area
- [x] Dựng app layout tổng thể
- [x] Dựng bộ component dùng chung tối thiểu

### Tài liệu / UML
- [x] Chốt use case tổng quát
- [x] Chốt kiến trúc area / role / priority
- [x] Cập nhật checklist chuẩn “xong sprint”

### Đầu ra
- [x] Source FE/BE chạy được
- [x] Schema import được
- [x] Seed role xong
- [x] Layout 4 area hoạt động

---

## Sprint 02 – Auth, hồ sơ cá nhân, phân quyền
### Mục tiêu chính
- [x] Hoàn tất đăng ký / đăng nhập / đăng xuất
- [x] Hoàn tất hồ sơ cá nhân cơ bản
- [x] Hoàn tất phân quyền theo role
- [x] Hoàn tất điều hướng sau đăng nhập theo vai trò

### Database
- [x] Kiểm tra ràng buộc users, roles, user_roles
- [x] Chốt rule email, phone, avatar, status
- [x] Seed user mẫu theo từng vai trò (Đã chuẩn bị script seed)

### Backend
- [x] POST /auth/register (Supabase)
- [x] POST /auth/login (Supabase)
- [x] POST /auth/logout (Supabase)
- [x] GET /me (Supabase/Postgres)
- [x] PATCH /me (Postgres)
- [x] PATCH /me/password (Supabase)
- [x] GET /me/roles (Postgres)

### Frontend
- [x] Màn hình đăng ký
- [x] Màn hình đăng nhập
- [x] Màn hình hồ sơ cá nhân
- [x] Màn hình đổi mật khẩu
- [x] Route guard / menu theo role

### Tài liệu / UML
- [x] Activity đăng ký (Đã mô tả luồng)
- [x] Activity đăng nhập / đăng xuất (Đã mô tả luồng)
- [x] Activity cập nhật hồ sơ (Đã mô tả luồng)
- [x] Mô tả phân quyền (Đã mô tả luồng)

### Đầu ra
- [x] User đăng nhập được
- [x] Điều hướng đúng theo role
- [x] Hồ sơ cá nhân cập nhật được

---

# Giai đoạn B. Phiên bản lõi ưu tiên 1

## Sprint 03 – Public tour
### Mục tiêu chính
- [ ] Hoàn tất luồng xem danh sách tour công khai
- [ ] Hoàn tất tìm kiếm / lọc / sắp xếp tour
- [ ] Hoàn tất chi tiết tour
- [ ] Chốt rule “tour public là tour nào”

### Database
- [ ] Kiểm tra tables: tours, tour_images, tour_locations, tour_categories
- [ ] Chốt rule published / visible / guide approved
- [ ] Seed tour public mẫu

### Backend
- [ ] GET /tours
- [ ] GET /tours/:id
- [ ] API filter / sort / pagination
- [ ] API dữ liệu cho trang chủ (nếu dùng)

### Frontend
- [ ] Trang chủ cơ bản
- [ ] Danh sách tour
- [ ] Bộ lọc / sắp xếp tour
- [ ] Chi tiết tour

### Tài liệu / UML
- [ ] Cập nhật use case xem tour
- [ ] Activity xem danh sách tour
- [ ] Activity xem chi tiết tour

### Đầu ra
- [ ] Khách chưa đăng nhập xem tour được
- [ ] Bộ lọc cơ bản dùng được
- [ ] Chi tiết tour hiển thị đúng dữ liệu

---

## Sprint 04 – Guide profile
### Mục tiêu chính
- [ ] Hoàn tất hồ sơ hướng dẫn viên
- [ ] Hoàn tất hồ sơ guide public
- [ ] Chốt rule user trở thành guide
- [ ] Chưa kéo verification quá sâu trong sprint này

### Database
- [ ] Kiểm tra guide_profiles
- [ ] Kiểm tra languages, skills
- [ ] Kiểm tra guide_languages, guide_skills
- [ ] Seed guide mẫu

### Backend
- [ ] GET /guides
- [ ] GET /guides/:id
- [ ] POST /guide-profile
- [ ] PATCH /guide-profile/:id
- [ ] PUT /guide-profile/:id/languages
- [ ] PUT /guide-profile/:id/skills
- [ ] GET /languages
- [ ] GET /skills

### Frontend
- [ ] Màn hình danh sách guide công khai
- [ ] Màn hình hồ sơ guide công khai
- [ ] Màn hình hồ sơ guide của tôi
- [ ] Form cập nhật profile guide

### Tài liệu / UML
- [ ] Activity tạo/cập nhật hồ sơ guide
- [ ] Mô tả dữ liệu profile guide public
- [ ] Quy tắc hiển thị guide public

### Đầu ra
- [ ] Guide có thể tạo/cập nhật hồ sơ
- [ ] Khách có thể xem hồ sơ guide công khai

---

## Sprint 05 – Guide quản lý tour
### Mục tiêu chính
- [ ] Hoàn tất guide tạo tour
- [ ] Hoàn tất guide sửa tour
- [ ] Hoàn tất quản lý ảnh tour và lịch trình cơ bản
- [ ] Chưa làm sâu accommodation trong sprint này

### Database
- [ ] Kiểm tra tour_categories
- [ ] Kiểm tra tours
- [ ] Kiểm tra tour_images
- [ ] Kiểm tra tour_locations
- [ ] Chuẩn bị tour_accommodations ở mức cấu trúc

### Backend
- [ ] GET /guide/tours
- [ ] POST /guide/tours
- [ ] PATCH /guide/tours/:id
- [ ] DELETE /guide/tours/:id hoặc soft delete
- [ ] POST /guide/tours/:id/images
- [ ] POST /guide/tours/:id/locations

### Frontend
- [ ] Dashboard guide – danh sách tour của tôi
- [ ] Form tạo tour
- [ ] Form cập nhật tour
- [ ] UI ảnh tour
- [ ] UI lịch trình/địa điểm tour

### Tài liệu / UML
- [ ] Activity tạo tour
- [ ] Activity cập nhật tour
- [ ] Mô tả state cơ bản của tour

### Đầu ra
- [ ] Guide quản lý được tour của mình
- [ ] Tour draft/published thể hiện được trong hệ thống

---

## Sprint 06 – Tour request
### Mục tiêu chính
- [ ] Hoàn tất user gửi yêu cầu tham gia tour
- [ ] Hoàn tất guide duyệt / từ chối yêu cầu
- [ ] Chốt state machine của tour_requests

### Database
- [ ] Kiểm tra table tour_requests
- [ ] Chốt trạng thái pending / approved / rejected / cancelled
- [ ] Seed user + guide + tour + request mẫu

### Backend
- [ ] POST /tour-requests
- [ ] GET /me/tour-requests
- [ ] GET /guide/tour-requests
- [ ] PATCH /guide/tour-requests/:id/approve
- [ ] PATCH /guide/tour-requests/:id/reject
- [ ] PATCH /tour-requests/:id/cancel

### Frontend
- [ ] Nút gửi yêu cầu ở chi tiết tour
- [ ] Màn hình yêu cầu tham gia tour của tôi
- [ ] Màn hình guide quản lý yêu cầu tham gia tour

### Tài liệu / UML
- [ ] Activity gửi yêu cầu tham gia tour
- [ ] Activity guide duyệt / từ chối
- [ ] Sequence gửi yêu cầu tham gia tour

### Đầu ra
- [ ] User gửi request được
- [ ] Guide xử lý request được
- [ ] Trạng thái request đổi đúng

---

## Sprint 07 – Companion post và companion request
### Mục tiêu chính
- [ ] Hoàn tất bài tìm bạn đồng hành
- [ ] Hoàn tất gửi yêu cầu tham gia bài đồng hành
- [ ] Hoàn tất chủ bài duyệt / từ chối thành viên
- [ ] Tách rõ state của post và request

### Database
- [ ] Kiểm tra companion_posts
- [ ] Kiểm tra companion_requests
- [ ] Chốt state bài: open / closed / cancelled
- [ ] Chốt state request: pending / approved / rejected / cancelled

### Backend
- [ ] GET /companion-posts
- [ ] GET /companion-posts/:id
- [ ] POST /companion-posts
- [ ] PATCH /companion-posts/:id
- [ ] DELETE /companion-posts/:id
- [ ] POST /companion-requests
- [ ] GET /me/companion-requests
- [ ] GET /my-companion-posts/:id/requests
- [ ] PATCH /companion-requests/:id/approve
- [ ] PATCH /companion-requests/:id/reject
- [ ] PATCH /companion-requests/:id/cancel

### Frontend
- [ ] Danh sách bài đồng hành công khai
- [ ] Chi tiết bài đồng hành
- [ ] Danh sách bài đồng hành của tôi
- [ ] Form tạo/cập nhật bài đồng hành
- [ ] Danh sách request đã gửi
- [ ] UI duyệt request trên bài của tôi

### Tài liệu / UML
- [ ] Activity tạo bài đồng hành
- [ ] Activity gửi request đồng hành
- [ ] Activity chủ bài duyệt thành viên

### Đầu ra
- [ ] Demo được luồng đăng bài → gửi request → duyệt thành viên

---

## Sprint 08 – Admin lõi, report và kiểm duyệt
### Mục tiêu chính
- [ ] Hoàn tất admin dashboard cơ bản
- [ ] Hoàn tất report flow
- [ ] Hoàn tất quản lý user / role
- [ ] Hoàn tất moderation và verification cơ bản
- [ ] Hoàn tất audit log quản trị

### Database
- [ ] Kiểm tra reports
- [ ] Kiểm tra report_processing_history
- [ ] Kiểm tra admin_activity_logs
- [ ] Kiểm tra user_role_change_logs
- [ ] Kiểm tra guide_verification_requests / documents

### Backend
- [ ] POST /reports
- [ ] GET /admin/dashboard
- [ ] GET /admin/users
- [ ] PATCH /admin/users/:id/status
- [ ] GET /admin/roles
- [ ] POST /admin/users/:id/roles
- [ ] DELETE /admin/users/:id/roles/:role
- [ ] GET /admin/reports
- [ ] PATCH /admin/reports/:id
- [ ] PATCH /admin/guides/:id/moderation
- [ ] PATCH /admin/tours/:id/moderation
- [ ] PATCH /admin/companion-posts/:id/moderation
- [ ] GET /admin/activity-logs

### Frontend
- [ ] Dashboard admin
- [ ] Quản lý user
- [ ] Phân quyền user
- [ ] Danh sách report
- [ ] Màn hình xử lý report
- [ ] Màn hình moderation guide/tour/companion
- [ ] Màn hình audit log

### Tài liệu / UML
- [ ] Activity gửi report
- [ ] Activity xử lý report
- [ ] Mô tả role admin nội bộ
- [ ] Mô tả state xử lý report / verification

### Đầu ra
- [ ] Admin xử lý được vi phạm
- [ ] Admin phân quyền được
- [ ] Có log quản trị cơ bản

---

# Giai đoạn C. Hoàn thiện nhóm chức năng ưu tiên 2

## Sprint 09 – Ổn định MVP lõi
### Mục tiêu chính
- [ ] Không mở chức năng mới
- [ ] Rà soát và sửa lỗi luồng lõi
- [ ] Chốt 4 luồng demo chính
- [ ] Làm sạch dữ liệu demo

### Checklist chính
- [ ] Regression test auth
- [ ] Regression test public tour
- [ ] Regression test guide/tour
- [ ] Regression test tour request
- [ ] Regression test companion
- [ ] Regression test admin/report
- [ ] Polish UI lỗi / loading / empty state
- [ ] Chuẩn hóa dữ liệu demo
- [ ] Cập nhật tài liệu và UML theo hiện trạng thật

### Đầu ra
- [ ] MVP lõi chạy ổn định
- [ ] Có 4 flow demo chính thức

---

## Sprint 10 – Favorite, review, verification
### Mục tiêu chính
- [ ] Hoàn tất favorite tour / guide
- [ ] Hoàn tất review tour / guide ở mức phù hợp
- [ ] Hoàn tất verification guide ở mức nghiệp vụ đã chốt
- [ ] Không làm phình MVP

### Database
- [ ] Kiểm tra favorite_tours
- [ ] Kiểm tra favorite_guides
- [ ] Kiểm tra tour_reviews
- [ ] Kiểm tra guide_reviews
- [ ] Kiểm tra guide_verification_requests / documents

### Backend
- [ ] POST /favorite-tours
- [ ] DELETE /favorite-tours/:tourId
- [ ] POST /favorite-guides
- [ ] DELETE /favorite-guides/:guideId
- [ ] GET /me/favorites
- [ ] POST /tour-reviews
- [ ] POST /guide-reviews
- [ ] GET review summary cần thiết
- [ ] POST /guide-verification-requests
- [ ] POST /guide-verification-documents

### Frontend
- [ ] Nút yêu thích tour
- [ ] Nút yêu thích guide
- [ ] Danh sách yêu thích
- [ ] Form đánh giá tour
- [ ] Form đánh giá guide
- [ ] Form gửi xác minh guide

### Tài liệu / UML
- [ ] Activity favorite
- [ ] Activity review
- [ ] Activity gửi xác minh hồ sơ guide

### Đầu ra
- [ ] User lưu yêu thích được
- [ ] User đánh giá được
- [ ] Guide gửi xác minh được

---

## Sprint 11 – Map, activity log, notification, statistics
### Mục tiêu chính
- [ ] Hoàn tất bản đồ lộ trình tour ở mức cơ bản
- [ ] Hoàn tất lịch sử hoạt động cá nhân
- [ ] Hoàn tất notification center
- [ ] Hoàn tất dashboard thống kê cơ bản cho admin

### Database
- [ ] Kiểm tra tour_locations
- [ ] Kiểm tra user_activity_logs
- [ ] Kiểm tra notifications
- [ ] Chuẩn bị query tổng hợp thống kê

### Backend
- [ ] GET /tours/:id/map
- [ ] GET /me/activity-logs
- [ ] GET /me/notifications
- [ ] PATCH /me/notifications/:id/read
- [ ] GET /admin/statistics
- [ ] GET /admin/dashboard-summary

### Frontend
- [ ] Màn hình bản đồ lộ trình tour
- [ ] Màn hình lịch sử hoạt động
- [ ] Notification center
- [ ] Dashboard thống kê admin cơ bản

### Tài liệu / UML
- [ ] Mô tả map flow ở mức đơn giản
- [ ] Mô tả notification và activity log
- [ ] Cập nhật dashboard admin

### Đầu ra
- [ ] Hệ thống “đầy” hơn để demo
- [ ] Admin có dashboard trực quan cơ bản

---

# Giai đoạn D. Mở rộng nhóm chức năng ưu tiên 3

## Sprint 12 – Chat trực tiếp và chat nhóm bài đồng hành
### Mục tiêu chính
- [ ] Hoàn tất chat cơ bản có lưu hội thoại
- [ ] Hoàn tất direct chat từ ngữ cảnh tour/guide
- [ ] Hoàn tất group chat cho bài đồng hành
- [ ] Chưa bắt buộc realtime/WebSocket

### Database
- [ ] Kiểm tra conversations
- [ ] Kiểm tra conversation_participants
- [ ] Kiểm tra messages
- [ ] Seed hội thoại mẫu

### Backend
- [ ] POST /conversations/direct
- [ ] POST /conversations/group
- [ ] GET /conversations
- [ ] GET /conversations/:id/messages
- [ ] POST /conversations/:id/messages
- [ ] GET /conversations/:id/participants

### Frontend
- [ ] Màn hình chat trực tiếp
- [ ] Màn hình chat nhóm bài đồng hành
- [ ] Danh sách hội thoại
- [ ] Khung nhắn tin cơ bản
- [ ] Polling / refresh định kỳ

### Tài liệu / UML
- [ ] Activity mở hội thoại
- [ ] Activity gửi tin nhắn
- [ ] Sequence chat cơ bản

### Đầu ra
- [ ] Nhắn tin được trong hệ thống
- [ ] Group chat chỉ mở cho thành viên hợp lệ

---

## Sprint 13 – AI, recommendation, accommodation, payment
### Mục tiêu chính
- [ ] Hoàn tất chatbot AI mức cơ bản
- [ ] Hoàn tất gợi ý tour rule-based
- [ ] Hoàn tất accommodation liên kết mức tham chiếu
- [ ] Hoàn tất payment ở mức sandbox hoặc mock flow

### Database
- [ ] Kiểm tra user_preferences
- [ ] Kiểm tra user_preferred_categories
- [ ] Kiểm tra ai_chat_sessions
- [ ] Kiểm tra ai_chat_messages
- [ ] Kiểm tra partner_accommodations
- [ ] Kiểm tra tour_accommodations
- [ ] Kiểm tra payment_transactions

### Backend
- [ ] GET /me/preferences
- [ ] PATCH /me/preferences
- [ ] GET /recommendations/tours
- [ ] POST /ai/chat/sessions
- [ ] POST /ai/chat/messages
- [ ] GET /accommodations
- [ ] GET /tours/:id/accommodations
- [ ] POST /payments/create
- [ ] POST /payments/confirm
- [ ] GET /me/payments

### Frontend
- [ ] Màn hình gợi ý tour
- [ ] Màn hình chatbot AI
- [ ] Màn hình accommodation liên kết
- [ ] UI thanh toán cơ bản

### Tài liệu / UML
- [ ] Mô tả rule recommendation
- [ ] Mô tả luồng AI có function/API nội bộ
- [ ] Mô tả payment sandbox/mock

### Đầu ra
- [ ] Có phần mở rộng để trình bày khi bảo vệ
- [ ] Không vượt quá phạm vi đồ án sinh viên

---

# Giai đoạn E. Đóng gói, kiểm thử tổng thể và chuẩn bị bảo vệ

## Sprint 14 – Đóng gói bản cuối và chuẩn bị bảo vệ
### Mục tiêu chính
- [ ] Không thêm chức năng mới
- [ ] Fix bug toàn hệ thống
- [ ] Chuẩn hóa dữ liệu demo cuối
- [ ] Hoàn thiện báo cáo, hình ảnh, kịch bản demo
- [ ] Chuẩn bị phương án dự phòng khi bảo vệ

### Checklist hệ thống
- [ ] Rà soát 29 chức năng
- [ ] Rà soát 47 màn hình
- [ ] Rà soát 38 bảng dữ liệu
- [ ] Regression test toàn bộ nhóm API
- [ ] Kiểm tra phân quyền các role
- [ ] Kiểm tra dữ liệu demo từ đầu đến cuối

### Checklist demo
- [ ] Chốt 4 flow demo bắt buộc
- [ ] Chốt tài khoản demo user / guide / admin
- [ ] Chốt tour / bài đồng hành / request / review / report mẫu
- [ ] Chuẩn bị script thuyết trình
- [ ] Chuẩn bị ảnh chụp màn hình / video dự phòng
- [ ] Chuẩn bị phương án fallback nếu API lỗi hoặc mạng lỗi

### Checklist tài liệu
- [ ] Cập nhật báo cáo tổng
- [ ] Cập nhật mô tả CSDL
- [ ] Cập nhật use case / activity / sequence / class diagram
- [ ] Cập nhật wireframe / màn hình cuối
- [ ] Đồng bộ code – tài liệu – demo

### Đầu ra
- [ ] Bản build cuối ổn định
- [ ] Bộ dữ liệu demo hoàn chỉnh
- [ ] Bộ tài liệu sẵn sàng nộp
- [ ] Kịch bản bảo vệ sẵn sàng

---

# Theo dõi nhanh toàn roadmap

| Sprint | Trạng thái | Ghi chú ngắn |
|---|---|---|
| Sprint 01 | [ ] | Nền tảng kỹ thuật |
| Sprint 02 | [ ] | Auth, hồ sơ, phân quyền |
| Sprint 03 | [ ] | Public tour |
| Sprint 04 | [ ] | Guide profile |
| Sprint 05 | [ ] | Guide quản lý tour |
| Sprint 06 | [ ] | Tour request |
| Sprint 07 | [ ] | Companion post/request |
| Sprint 08 | [ ] | Admin lõi, report, moderation |
| Sprint 09 | [ ] | Ổn định MVP lõi |
| Sprint 10 | [ ] | Favorite, review, verification |
| Sprint 11 | [ ] | Map, activity, notification, statistics |
| Sprint 12 | [ ] | Chat trực tiếp / chat nhóm |
| Sprint 13 | [ ] | AI, recommendation, accommodation, payment |
| Sprint 14 | [ ] | Đóng gói, test cuối, bảo vệ |

---

# Gợi ý cách cập nhật mỗi cuối sprint
- [ ] Ghi ngày bắt đầu
- [ ] Ghi ngày kết thúc dự kiến
- [ ] Ghi các hạng mục hoàn thành thật
- [ ] Ghi lỗi tồn đọng
- [ ] Ghi quyết định thay đổi phạm vi nếu có
- [ ] Ghi tài liệu/UML đã cập nhật
