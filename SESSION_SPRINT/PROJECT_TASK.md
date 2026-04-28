# PROJECT_TASK.md

> File này là **project task breakdown** chính thức của TravelConnectVN.  
> Trong hệ điều phối theo spec v3, file này **đóng vai trò của `SPRINT_PHASE_TASK_BREAKDOWN.md`** nhưng được đặt tên theo yêu cầu hiện tại là `PROJECT_TASK.md`.  
> Mục tiêu: để AI agent luôn biết **đang ở sprint nào, hôm nay phải làm gì, đang làm tới đâu, và bước nhỏ tiếp theo là gì**.

---

## 1. Quy tắc sử dụng file này

### 1.1. Nguyên tắc chung
- Chỉ làm task của **sprint hiện tại** hoặc phần còn thiếu trực tiếp để hoàn tất sprint hiện tại.
- Mỗi phiên chỉ nên làm:
  - **1 subtask nhỏ nhất**, hoặc
  - **1 cụm subtask rất gần nhau** trong cùng một lane.
- Không nhảy sang sprint sau nếu sprint hiện tại chưa đạt mức chấp nhận được theo:
  - `PROJECT_STATUS.md`
  - `SPRINT_CHECKLIST_MASTER.md`
  - `SPRINT_XX.md`
- Mỗi task hoàn tất phải có:
  - file đã tạo/sửa
  - cách test
  - kết quả mong muốn
  - cập nhật trạng thái tương ứng
- Task liên quan database phải:
  - đọc schema trước
  - không drop database
  - không truncate bảng
  - không xóa dữ liệu thật
  - migration phải additive
  - seed phải idempotent
- Task liên quan UI phải:
  - đọc `.agents/ui_style_guide_for_ai_agent.md`
  - đọc các skill UI liên quan trong `.agents/skills/`
  - tái sử dụng component tối đa
  - bám đúng design system của TravelConnectVN
  
Quy tắc làm việc với Supabase qua MCP
Antigravity đã được kết nối với MCP Supabase của dự án.
Khi triển khai hoặc phân tích nghiệp vụ, agent phải ưu tiên dựa trên dữ liệu thật đang có trong Supabase.
Agent phải đọc và đối chiếu schema, bảng, record, trạng thái dữ liệu hiện có trước khi đề xuất triển khai.
Nếu phát hiện:
thiếu dữ liệu mẫu,
thiếu seed,
thiếu quan hệ dữ liệu,
thiếu bảng/phần tử hỗ trợ demo,
dữ liệu sai hoặc chưa đủ để chạy luồng,
thì agent không được tự ý thêm, sửa, xóa dữ liệu.
Trong các trường hợp đó, agent phải:
mô tả rõ vấn đề phát hiện được,
nêu dữ liệu nào đang thiếu hoặc đang sai,
đề xuất phương án xử lý,
chờ người dùng xác nhận trước khi thực hiện bất kỳ thay đổi dữ liệu nào.
Agent chỉ được phép thao tác dữ liệu khi có chỉ đạo rõ ràng từ người dùng.
Mặc định:
không tự tạo data
không tự update data
không tự delete data
không tự seed data
Nếu cần dữ liệu mới để demo hoặc test, agent phải coi đó là đề xuất chờ duyệt, không phải hành động mặc định.
### 1.2. Cách đánh dấu
- `[ ]` chưa làm
- `[~]` đang làm
- `[x]` đã xong
- `[-]` hoãn / không làm ở vòng hiện tại

### 1.3. Bộ file agent phải đọc trước
- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `PROJECT_STATUS.md`
- `PROJECT_TASK.md`
- `SPRINT_MASTER.md`
- `SPRINT_CHECKLIST_MASTER.md`
- `SPRINT_XX.md` tương ứng
- `SESSION_LOG.md`

### 1.4. File cập nhật sau mỗi phiên
- `SESSION_LOG.md`
- `PROJECT_STATUS.md`
- `PROJECT_TASK.md`

### 1.5. Quy tắc đặc biệt theo spec v3
- Đây là file **sprint-centric**, không dùng lại logic phase-centric cũ.
- Nếu có tên file cũ như `PHASE_TASK_BREAKDOWN.md` hoặc `SPRINT_PHASE_TASK_BREAKDOWN.md`, phải hiểu file này là bản dùng thật hiện tại.
- Mọi trạng thái trong file này phải khớp với:
  - `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
  - `PROJECT_STATUS.md`
  - `SPRINT_MASTER.md`
  - `SPRINT_CHECKLIST_MASTER.md`

---

## 2. Tổng quan roadmap chuẩn

### Giai đoạn A — Nền tảng và kiến trúc lõi
- Sprint 01 — Nền tảng kỹ thuật tổng thể
- Sprint 02 — Auth, hồ sơ cá nhân, phân quyền

### Giai đoạn B — Phiên bản lõi ưu tiên 1
- Sprint 03 — Public tour
- Sprint 04 — Guide profile
- Sprint 05 — Guide quản lý tour
- Sprint 06 — Tour request
- Sprint 07 — Companion post và companion request
- Sprint 08 — Admin core

### Giai đoạn C — Ổn định MVP và nhóm ưu tiên 2
- Sprint 09 — Ổn định MVP lõi
- Sprint 10 — Favorite, review, verification
- Sprint 11 — Map, activity log, notification, statistics

### Giai đoạn D — Nhóm mở rộng ưu tiên 3
- Sprint 12 — Chat trực tiếp và chat nhóm bài đồng hành
- Sprint 13 — AI, recommendation, accommodation, payment

### Giai đoạn E — Đóng gói và chuẩn bị bảo vệ
- Sprint 14 — Kiểm thử tổng thể, chuẩn hóa demo, hoàn thiện tài liệu và bảo vệ

---

## 3. Trạng thái tổng thể hiện tại

### 3.1. Đã xong chắc chắn
- [x] Chốt đề tài TravelConnectVN
- [x] Chốt 2 trục giá trị trung tâm
- [x] Chốt 4 Area
- [x] Chốt 6 nhóm vai trò
- [x] Chốt 29 chức năng
- [x] Chốt 47 màn hình
- [x] Chốt schema 38 bảng
- [x] Chốt roadmap 14 sprint
- [x] Có `SPRINT_MASTER.md`
- [x] Có `SPRINT_CHECKLIST_MASTER.md`
- [x] Có `SPRINT_01.md` … `SPRINT_14.md`
- [x] Có `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- [x] Có `PROJECT_STATUS.md` bản sẵn dùng theo spec v3

### 3.2. Đang làm thật sự
- [x] Khóa bộ file điều phối agent theo spec v3
- [x] Đồng bộ status và task breakdown theo logic sprint-centric
- [x] Hoàn thiện Sprint 01 ở lớp điều phối trước khi sang implementation nền thật
- [~] Chuyển sang baseline code thật (Database/Backend/Frontend)

### 3.3. Chưa bắt đầu thật sự
- [x] React project baseline
- [x] NestJS project baseline
- [ ] Database baseline implementation
- [ ] Auth implementation thật
- [ ] Public tour implementation thật
- [ ] Guide core implementation thật
- [ ] Admin implementation thật

---

## 4. Current Official Focus

### Current Phase
- [~] Giai đoạn E — Đóng gói và chuẩn bị bảo vệ

### Current Sprint
- [~] Sprint 12 — Chat trực tiếp và chat nhóm bài đồng hành

### Current Single Focus
- [x] Fix Database Connection (IPv6 → IPv4 Pooler)
- [x] Fix NestJS DI errors (TourRequestsModule, CompanionPostsModule)
- [x] Hoàn tất Sprint 11 (Map, Activity Log, Notification, Statistics)
- [~] Tạo ChatModule backend — ConversationController, endpoint GET /conversations

### Current Best Next Step
- [ ] `nest g module chat` + tạo ConversationController với endpoint `GET /conversations`





---

# 5. Sprint 01 — Nền tảng kỹ thuật tổng thể

> **Trạng thái sprint hiện tại:** `[x]`

## 5.1. Lane điều phối / tài liệu
- [x] Có `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- [x] Có `SPRINT_MASTER.md`
- [x] Có `SPRINT_CHECKLIST_MASTER.md`
- [x] Có `SPRINT_01.md` … `SPRINT_14.md`
- [x] Có `PROJECT_STATUS.md` bản sẵn dùng theo spec v3
- [x] Có `PROJECT_TASK.md` bản dùng thật
- [x] Có `AGENT_BOOTSTRAP_PROMPT.md`
- [x] Có `PROMPT_LIBRARY_BY_SPRINT.md`
- [x] Có `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- [x] Có `SESSION_LOG.md` bản sử dụng thật được xác nhận

## 5.2. Lane database
- [x] Tạo / xác nhận `database/`
- [x] Tạo `database/schema/`
- [x] Tạo `database/migrations/`
- [x] Tạo `database/seed/`
- [x] Import / đối chiếu schema 38 bảng
- [x] Seed roles:
  - [x] USER
  - [x] GUIDE
  - [x] SYSTEM_ADMIN
  - [x] CONTENT_MODERATOR
  - [x] SUPPORT_STAFF
- [x] Chốt migration baseline
- [x] Chốt seed baseline idempotent

## 5.3. Lane backend
- [x] Khởi tạo NestJS + TypeScript
- [x] Chốt module structure nền
- [x] Tạo constants / enums cho role
- [x] Tạo guard skeleton
- [x] Tạo response envelope chuẩn
- [x] Tạo exception filter skeleton
- [x] Tạo endpoint nền:
  - [x] `GET /health`
  - [x] `GET /me`
  - [x] `GET /me/roles`

## 5.4. Lane frontend
- [x] Khởi tạo ReactJS + TypeScript
- [x] Chốt package manager
- [x] Chốt router
- [x] Chốt naming convention cho pages/components/features
- [x] Dựng baseline layout cho 4 Area:
  - [x] Public
  - [x] User
  - [x] Guide
  - [x] Admin
- [x] Tạo component nền tối thiểu:
  - [x] Button
  - [x] Input
  - [x] Modal
  - [x] Select
  - [x] Card
    - [x] Implement logic check-in database (avoid duplicate)
    - [x] Standardize API Response `{ success, message, data }`
    - [x] Ownership check (user only manage their own favorites)
- [x] Badge
- [x] Table wrapper
- [x] Page container
- [x] Empty state
- [x] Loading block

## 5.5. Lane test & validation
- [x] Frontend chạy local
- [x] Backend chạy local
- [x] Kết nối database nền ổn
- [x] Route/layout khung 4 Area hoạt động
- [x] Không lỗi config nền

## 5.6. Lane UML / docs
- [x] Use Case tổng quát đã chốt trong tài liệu nền
- [x] Danh mục 29 chức năng đã chốt
- [x] Danh mục 47 màn hình đã chốt
- [x] Cấu trúc sprint 01–14 đã chốt
- [x] Chốt convention cập nhật session log sau mỗi phiên implementation thật

## 5.7. Sprint 01 exit conditions
- [x] Bộ file điều phối agent đủ dùng thật
- [x] Repo kỹ thuật thật có cấu trúc nền
- [x] Frontend/backend/database baseline tồn tại
- [x] Role constants và route skeleton tồn tại
- [x] Có thể chạy local ở mức nền
- [x] Không cần quay lại sửa kiến trúc điều phối

---

# 6. Sprint 02 — Auth, hồ sơ cá nhân, phân quyền

> **Trạng thái sprint:** `[x]` Hoàn thành

## 6.1. Lane database
- [x] Kiểm tra `users`
- [x] Kiểm tra `roles`
- [x] Kiểm tra `user_roles`
- [x] Chốt rule email / phone / avatar / status
- [x] Seed user mẫu theo từng vai trò (5 accounts: Admin, Content, Support, Guide, User)

## 6.2. Lane backend
- [x] `POST /auth/register` (Sử dụng Supabase Auth)
- [x] `POST /auth/login` (Sử dụng Supabase Auth)
- [x] `POST /auth/logout` (Sử dụng Supabase Auth)
- [x] `GET /me` (Sử dụng Supabase Auth)
- [x] `PATCH /me` (Postgres users table)
- [x] `PATCH /me/password` (Sử dụng Supabase Auth)
- [x] `GET /me/roles` (Sử dụng rls_user_roles)
- [x] `POST /auth/reset-password` (Supabase OTP recovery)

## 6.3. Lane frontend
- [x] M01 Đăng ký
- [x] M02 Đăng nhập
- [x] M15 Hồ sơ cá nhân
- [x] M16 Đổi mật khẩu
- [x] Route guard
- [x] Redirect theo role
- [x] Màn hình Quên mật khẩu & OTP (F01 mở rộng)

## 6.4. Lane test & validation
- [x] Guest đăng ký được
- [x] User login được
- [x] Guide login được
- [x] Admin login được
- [x] Redirect đúng area
- [x] Chặn area sai role

## 6.5. Lane UML / docs
- [x] Activity đăng ký
- [x] Activity đăng nhập / đăng xuất
- [x] Activity cập nhật hồ sơ
- [x] Mô tả rule phân quyền

---

# 7. Sprint 03 — Public tour

> **Trạng thái sprint:** `[x]` DONE

## 7.1. Lane database
- [x] Kiểm tra `tour_categories`
- [x] Kiểm tra `tours`
- [x] Kiểm tra `tour_images`
- [x] Kiểm tra `tour_locations`
- [x] Chốt rule public visibility
- [x] Seed tour public mẫu

## 7.2. Lane backend
- [x] `GET /tour-categories`
- [x] `GET /tours`
- [x] `GET /tours/:id`
- [x] Filter theo địa điểm
- [x] Filter theo thời gian
- [x] Filter theo giá
- [x] Sorting
- [x] Pagination

## 7.3. Lane frontend
- [x] M03 Trang chủ
- [x] M04 Danh sách tour
- [x] M05 Tìm kiếm/lọc/sắp xếp tour
- [x] M06 Chi tiết tour

## 7.4. Lane test & validation
- [x] Tour list hoạt động
- [x] Filter hoạt động
- [x] Tour detail hoạt động
- [x] Chỉ hiển thị tour đủ điều kiện public

## 7.5. Lane UML / docs
- [x] Activity xem danh sách tour
- [x] Activity xem chi tiết tour
- [x] Rule “tour công khai là gì”

---

# 8. Sprint 04 — Guide profile

> **Trạng thái sprint:** `[x]` DONE (100%)

## 8.1. Lane database
- [x] Kiểm tra `guide_profiles`
- [x] Kiểm tra `languages`
- [x] Kiểm tra `skills`
- [x] Kiểm tra `guide_languages`
- [x] Kiểm tra `guide_skills`
- [x] Seed guide mẫu

## 8.2. Lane backend
- [x] `GET /guides`
- [x] `GET /guides/:id`
- [x] `POST /guide-profile`
- [x] `PATCH /guide-profile`
- [x] `PUT /guide-profile/languages`
- [x] `PUT /guide-profile/skills`
- [x] Logic ownership & validation (Đã tích hợp Auth thật)
- [x] `GET /languages`
- [x] `GET /skills`

## 8.3. Lane frontend
- [x] M08 Danh sách hướng dẫn viên công khai (Triển khai GuideCard và GuideListPage)
- [x] M09 Hồ sơ hướng dẫn viên công khai (Triển khai GuideDetailPage)
- [x] M31 Dashboard hướng dẫn viên (Triển khai GuideDashboardPage)
- [x] M32 Hồ sơ hướng dẫn viên của tôi (Triển khai giao diện & tích hợp API Master Data)

## 8.4. Lane test & validation
- [x] User có role GUIDE vào được Guide Area
- [x] Guide tạo/cập nhật profile được (Đã xong phần giao diện và gọi API lấy dữ liệu)
- [x] Guest xem được danh sách guide công khai (M08)
- [x] Guest xem được chi tiết guide công khai (M09)

## 8.5. Lane UML / docs
- [x] Activity tạo/cập nhật hồ sơ guide
- [x] Rule trở thành guide
- [x] Rule hiển thị guide public

---

# 9. Sprint 05 — Guide quản lý tour

> **Trạng thái sprint:** `[x]` DONE (100%)

## 9.1. Lane database
- [x] Kiểm tra bảng `tours`
- [x] Kiểm tra bảng `tour_images`
- [x] Kiểm tra bảng `tour_locations`
- [x] Kiểm tra bảng `tour_categories`
- [x] Seed danh mục `tour_categories` chuẩn
- [x] Seed tour mẫu gắn với guide profile thật

## 9.2. Lane backend
- [x] `GET /guide/tours` (Danh sách tour của tôi) - Triển khai tại `/tours/guide/me`
- [x] `GET /tours/categories` (Lấy danh mục tour)
- [x] `POST /tours/guide/create` (Tạo tour)
- [x] `PATCH /tours/guide/:id` (Cập nhật tour)
- [x] `POST /tours/:id/images` (Quản lý ảnh - Supabase Storage)
- [x] `GET /tours/:id/images` (Lấy danh sách ảnh)
- [x] `GET /tours/:id/itinerary` (Lấy hành trình)
- [x] `POST /tours/:id/itinerary` (Cập nhật hành trình - Batch Update)
- [x] `PATCH /tours/guide/:id` (Hỗ trợ cập nhật trạng thái nghiệp vụ/hiển thị)

## 9.3. Lane frontend
- [x] M34 Danh sách tour của tôi
- [x] M35 Tạo / cập nhật tour
- [x] M36 Quản lý lịch trình / địa điểm tour
- [x] M37 Quản lý hình ảnh tour (Supabase Storage)

## 9.4. Lane test & validation
- [x] Guide tạo tour mới thành công
- [x] Guide sửa tour của mình thành công
- [x] Guide không sửa được tour của người khác
- [x] Tour mới tạo hiển thị đúng ở trang Public (M05/M06)

## 9.5. Lane UML / docs
- [x] Activity tạo tour
- [x] Activity cập nhật tour
- [x] Rule draft / published / closed / cancelled

---

# 10. Sprint 06 — Tour request

> **Trạng thái sprint:** `[x]` DONE (100%)

## 10.1. Lane database
- [x] Kiểm tra `tour_requests`
- [x] Chốt state machine `tour_requests`
- [x] Seed request mẫu đa trạng thái

## 10.2. Lane backend
- [x] `POST /tour-requests`
- [x] `GET /me/tour-requests`
- [x] `GET /guide/tour-requests`
- [x] `PATCH /tour-requests/:id/cancel`
- [x] `PATCH /guide/tour-requests/:id/approve`
- [x] `PATCH /guide/tour-requests/:id/reject`

## 10.3. Lane frontend
- [x] Form gửi request ở M06
- [x] M21 Yêu cầu tham gia tour của tôi
- [x] M37 Quản lý yêu cầu tham gia tour

## 10.4. Lane test & validation
- [x] User gửi request được
- [x] Guide approve/reject được
- [x] Ownership đúng
- [x] Overbook không xảy ra

## 10.5. Lane UML / docs
- [x] Activity gửi yêu cầu tham gia tour
- [x] Activity guide duyệt / từ chối
- [x] Sequence tour request

---

# 11. Sprint 07 — Companion post và companion request

> **Trạng thái sprint:** `[x]` (100% DONE)

## 11.1. Lane database
- [x] Kiểm tra `companion_posts`
- [x] Kiểm tra `companion_requests`
- [x] Chốt state bài
- [x] Chốt state request
- [x] Seed bài đồng hành mẫu

## 11.2. Lane backend
- [x] `GET /companion-posts`
- [x] `GET /companion-posts/:id`
- [x] `POST /companion-posts`
- [x] `PATCH /companion-posts/:id`
- [x] `DELETE /companion-posts/:id`
- [x] `POST /companion-requests`
- [x] `GET /me/companion-requests`
- [x] `PATCH /companion-requests/:id/cancel`
- [x] `PATCH /my-companion-requests/:id/approve`
- [x] `PATCH /my-companion-requests/:id/reject`

## 11.3. Lane frontend
- [x] M10 Danh sách bài tìm bạn đồng hành
- [x] M11 Chi tiết bài tìm bạn đồng hành
- [x] M23 Danh sách bài đồng hành của tôi
- [x] M24 Tạo/cập nhật bài đồng hành
- [x] M25 Yêu cầu tham gia bài đồng hành đã gửi
- [x] M26 Quản lý yêu cầu tham gia bài đồng hành

## 11.4. Lane test & validation
- [x] Cập nhật UML (Activity, Sequence) vào tài liệu
- [x] Tối ưu Database Indexes cho Companion module
- [x] Triển khai Toast Notification cho trải nghiệm người dùng
- [x] User tạo bài được
- [x] User khác gửi request được
- [x] Chủ bài duyệt thành viên được
- [x] Không nhầm rule giữa companion và tour

## 11.5. Lane UML / docs
- [x] Activity tạo bài đồng hành
- [x] Activity gửi request đồng hành
- [x] Activity chủ bài duyệt request

---

# 12. Sprint 08 — Admin core

> **Trạng thái sprint:** `[x]` DONE (100%)

## 12.1. Lane database
- [x] Kiểm tra `reports`
- [x] Kiểm tra `report_processing_history`
- [x] Kiểm tra `admin_activity_logs`
- [x] Kiểm tra `user_role_change_logs`
- [x] Kiểm tra `guide_verification_requests`
- [x] Kiểm tra `guide_verification_documents`

## 12.2. Lane backend
- [x] `GET /admin/dashboard`
- [x] `GET /admin/users`
- [x] `PATCH /admin/users/:id/status`
- [x] `POST /admin/users/:id/roles`
- [x] `DELETE /admin/users/:id/roles/:role`
- [x] `GET /admin/guides`
- [x] `PATCH /admin/guides/:id/moderation`
- [x] `GET /admin/tours`
- [x] `PATCH /admin/tours/:id/moderation`
- [x] `GET /admin/companion-posts`
- [x] `PATCH /admin/companion-posts/:id/moderation`
- [x] `GET /admin/reports`
- [x] `PATCH /admin/reports/:id`
- [x] `GET /admin/reports/:id/history`
- [x] `GET /admin/activity-logs`
- [x] `GET /admin/statistics`
- [x] `POST /reports` (User-side reporting)

## 12.3. Lane frontend
- [x] M38 Dashboard quản trị
- [x] M39 Quản lý người dùng
- [x] M40 Phân quyền người dùng / quản lý role
- [x] M41 Quản lý hồ sơ guide và xác minh
- [x] M42 Quản trị tour
- [x] M43 Quản trị bài đồng hành
- [x] M45 Xử lý báo cáo vi phạm
- [x] M47 Nhật ký hoạt động quản trị
- [x] M20 Gửi báo cáo vi phạm (ReportModal & Integration)

## 12.4. Lane test & validation
- [x] SYSTEM_ADMIN vào dashboard được
- [x] CONTENT_MODERATOR thấy đúng scope
- [x] SUPPORT_STAFF thấy đúng scope
- [x] Moderation flow chạy
- [x] Report flow chạy
- [x] Log đọc được

## 12.5. Lane UML / docs
- [x] Activity gửi report
- [x] Activity xử lý report
- [x] Rule 3 role quản trị
- [x] State machine moderation / verification

---

# 13. Sprint 09 — Ổn định MVP lõi

> **Trạng thái sprint:** `[x]` Hoàn thành (100%)

## 13.1. Lane regression & cleanup
- [x] Regression auth
- [x] Regression public tour
- [x] Regression guide/tour
- [x] Regression tour request
- [x] Regression companion
- [x] Regression admin/report
- [x] Chuẩn hóa loading / empty / error state
- [x] Chuẩn hóa dữ liệu demo
- [x] Chuẩn hóa response API (Standardized Envelope handling)

## 13.2. Lane demo
- [x] Chốt 4 luồng demo chính
- [x] Chuẩn bị dữ liệu demo cho 4 luồng
- [x] Chốt actor demo
- [x] Chốt script demo cơ bản

## 13.3. Lane docs
- [x] Đồng bộ DB / API / UI / UML
- [x] Cập nhật báo cáo theo hiện trạng thật

---

# 14. Sprint 10 — Favorite, review, verification

> **Trạng thái sprint hiện tại:** `[x]` DONE (100%)

## 14.1. Lane favorites
- [x] `GET /me/favorite-tours`
- [x] `POST /favorite-tours`
- [x] `DELETE /favorite-tours/:tourId`
- [x] `GET /me/favorite-guides`
- [x] `POST /favorite-guides`
- [x] `DELETE /favorite-guides/:guideId`
- [x] M18 Danh sách yêu thích (UI Stable)

## 14.2. Lane reviews
- [x] `GET /tours/:id/reviews`
- [x] `POST /tour-reviews`
- [x] `GET /guides/:id/reviews`
- [x] `POST /guide-reviews`
- [x] M27 Đánh giá tour (UI Stable)
- [x] M28 Đánh giá hướng dẫn viên (UI Stable)

## 14.3. Lane verification
- [x] `GET /guide-verification/requests`
- [x] `POST /guide-verification/requests`
- [x] `POST /guide-verification/requests/:id/documents`
- [x] `GET /admin/guide-verification`
- [x] `PATCH /admin/guide-verification/:id`
- [x] M33 hoàn thiện hơn (Guide & Admin side DONE)

## 14.4. Lane test & validation
- [x] Favorite không tạo trùng
- [x] Review đúng điều kiện
- [x] Verification đi đúng state (Full Flow DONE)
- [x] Đã đồng bộ Badge xác minh tại GuideDetailPage
- [x] Đã tích hợp Review CTA tại TourDetailPage

---

# 15. Sprint 11 — Map, activity log, notification, statistics

> **Trạng thái sprint:** `[x]` DONE (100%)

## 15.1. Lane activity & notification
- [x] M17 Lịch sử hoạt động cá nhân (Backend Baseline + Filter 10 loại activity_type)
- [x] M19 Trung tâm thông báo (Backend Baseline + Badge unread header)
- [x] `GET /me/activity-logs` (đã đồng bộ từ `/user-activity-logs/me` đúng spec, hỗ trợ `?activityType=` filter)
- [x] `GET /notifications/me`
- [x] `PATCH /notifications/:id/read`
- [x] `PATCH /notifications/read-all`
- [x] Tích hợp Activity Logging vào TourRequestsService
- [x] M19 Giao diện Notification Center
- [x] M17 Giao diện Activity Log Page (10 filter tabs + icon-bubble timeline)



## 15.2. Lane map & statistics
- [x] M07 Bản đồ lộ trình tour hoàn thiện (tọa độ thực 5 tỉnh thành)
- [x] M46 hoàn thiện dashboard thống kê (Recharts AreaChart + PieChart + BarChart)
- [x] `GET /admin/statistics`


## 15.3. Lane test & validation
- [x] Notification dùng được ở mức đồ án
- [x] Activity log đọc được
- [x] Map ổn định
- [x] Statistics đủ trình bày (Seeded demo data)

---

# 16. Sprint 12 — Chat trực tiếp và chat nhóm bài đồng hành

> **Trạng thái sprint:** `[~]` Đang tiến hành

## 16.1. Lane database
- [x] Kiểm tra `conversations` (tồn tại trong Prisma + DB)
- [x] Kiểm tra `conversation_participants` (tồn tại trong Prisma + DB)
- [x] Kiểm tra `messages` (tồn tại trong Prisma + DB)
- [x] Seed hội thoại mẫu (4 conversations, 8 participants, 24 messages — `database/seed/chat_seed.sql`)

## 16.2. Lane backend
- [x] `GET /conversations` — Danh sách conversation của current user (last message + unread flag)
- [x] `POST /conversations/direct` — Tạo/lấy lại direct chat (dedup logic)
- [x] `POST /conversations/group-companion` — Tạo group chat bài đồng hành
- [x] `GET /conversations/:id/messages` — Lấy messages (phân trang)
- [x] `POST /conversations/:id/messages` — Gửi message mới
- [x] `PATCH /conversations/:id/read` — Đánh dấu đã đọc (last_read_at)
- [x] `GET /conversations/:id/participants` — Danh sách participant
- [x] ChatModule đăng ký vào AppModule — đã compile và test 401 response

## 16.3. Lane frontend
- [x] M29 Chat trực tiếp User – Guide
- [x] M30 Chat nhóm bài đồng hành

## 16.4. Lane test & validation
- [x] Seed data để test full flow
- [x] Bổ sung Activity Diagram cho M29, M30 vào tài liệu SPRINT_12.md
- [x] Done Sprint 12
- [ ] Chưa cần realtime/WebSocket đầy đủ

---

# 17. Sprint 13 — AI, recommendation, accommodation, payment

> **Trạng thái sprint:** `[x]` Hoàn thành

## 17.1. Lane AI chat
- [x] M13 Chatbot AI tư vấn du lịch
- [x] `GET /ai-chat/sessions`
- [x] `POST /ai-chat/sessions`
- [x] `GET /ai-chat/sessions/:id/messages`
- [x] `POST /ai-chat/sessions/:id/messages`

## 17.2. Lane recommendation
- [x] M12 Gợi ý tour thông minh
- [x] Recommendation rule-based tối thiểu
- [x] User preferences cơ bản

## 17.3. Lane accommodation
- [x] M14 Liên kết dịch vụ lưu trú
- [x] `GET /accommodations`
- [x] `GET /accommodations/:id`

## 17.4. Lane payment
- [x] M22 Thanh toán trực tuyến sandbox/mock
- [x] `POST /payments` (vnpay-url)
- [x] `GET /me/payments` (my-transactions)
- [x] `GET /payments/:id`
- [x] `POST /payments/:id/confirm` (vnpay-ipn)

## 17.5. Lane test & validation
- [x] AI chat log được session/messages
- [x] Recommendation hiển thị được
- [x] Accommodation hiển thị được
- [x] Payment sandbox không phá lõi

---

# 18. Sprint 14 — Final QA, demo data, tài liệu, bảo vệ

> **Trạng thái sprint:** `[~]` Đang triển khai

### 18.0. Lane Infrastructure (DONE)
- [x] Fix Database Connection: IPv6 host không resolve → chuyển sang IPv4 Pooler (`aws-1-ap-southeast-1.pooler.supabase.com`)
- [x] Fix NestJS DI: Thêm SocketModule, UserActivityLogsModule, NotificationsModule vào TourRequestsModule
- [x] Fix NestJS DI: Thêm SocketModule, NotificationsModule vào CompanionPostsModule
- [x] Cập nhật PrismaService cho PgBouncer compatibility
- [x] Xác nhận 3 Home API endpoints hoạt động (tours, guides, companions)

## 18.1. Lane QA
- [x] Test Guest
- [x] Test User
- [x] Test Guide
- [x] Test SYSTEM_ADMIN
- [x] Test CONTENT_MODERATOR
- [x] Test SUPPORT_STAFF
- [x] Test multi-role
- [x] Test route protection
- [x] Test empty/loading/error states (Initial Polish DONE)
- [x] Fix recommendation loading sync with Auth state (HomePage)

## 18.2. Lane demo
- [x] Chốt flow tour
- [x] Chốt flow companion
- [x] Chốt flow guide
- [x] Chốt flow admin moderation
- [x] Chốt tài khoản demo
- [x] Chốt script thuyết trình

## 18.3. Lane data
- [x] Guide demo đẹp
- [x] Tour demo đẹp
- [x] Companion post demo đẹp
- [x] Review demo đủ dùng
- [x] Report demo đủ dùng
- [x] Seeder không tạo trùng

## 18.4. Lane docs & handoff
- [x] Chụp ảnh màn hình (Mockups)
- [x] Chốt sitemap
- [x] Chốt ERD / API / UML trong báo cáo
- [x] Chốt phần roadmap
- [x] Chốt phần demo flow
- [x] Chốt handoff
- [x] Repo gọn
- [x] Docs đủ
- [x] Status/task/session không lỗi thời

---

## 19. Definition of Done kiểm soát theo hiện trạng

### 19.1. Giai đoạn A chỉ được coi là đủ khi
- [x] Có master spec v3
- [x] Có sprint master
- [x] Có sprint checklist master
- [x] Có sprint files 01–14
- [x] Có project status dùng thật
- [x] Có project task dùng thật
- [x] Có bootstrap
- [x] Có handoff
- [x] Có prompt library
- [x] Có session log dùng thật
- [x] Có repo kỹ thuật thật với frontend/backend/database baseline
- [x] Có chạy local thành công

### 19.2. Chỉ khi Giai đoạn A đạt mức chấp nhận mới nên sang Sprint 02 implementation thật

---

## 20. Mẫu cập nhật sau mỗi phiên

```md
## 20. Session Update (2026-04-22) - Sprint 10 Final Polish

### Sprint
- Sprint hiện tại: Sprint 10
- Session focus: Final Polish & Synchronization
- Chosen subtask: Chuẩn hóa dữ liệu và giao diện Sprint 10

### Done
- Hoàn thiện huy hiệu xác minh Guide (`approved` state).
- Tích hợp Review CTA vào trang chi tiết Tour.
- Rà soát tính Idempotent cho module Favorites.
- Gỡ bỏ log debug và chuẩn hóa trạng thái điều phối.

### Files Changed
- `frontend/src/pages/guide/GuideVerificationPage.tsx`
- `frontend/src/pages/public/GuideDetailPage.tsx`
- `frontend/src/pages/public/TourDetailPage.tsx`

### Result
- [x] Xong hoàn toàn Sprint 10

### Suggested Next Single Step
- Bắt đầu Sprint 11: Thiết kế schema bảng `notifications`.
