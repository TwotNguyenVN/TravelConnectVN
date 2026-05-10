# SPRINT 01 – Khởi tạo dự án và xây dựng nền tảng kỹ thuật tổng thể

## 1. Mục tiêu sprint

Sprint 01 là sprint đặt nền móng kỹ thuật cho toàn bộ đồ án website du lịch kết nối **khách du lịch – hướng dẫn viên địa phương – người tìm bạn đồng hành**. Trọng tâm của sprint này **không phải hoàn thiện nghiệp vụ**, mà là chuẩn hóa toàn bộ khung triển khai để các sprint sau có thể phát triển đồng bộ giữa frontend, backend, database và tài liệu/UML.

### Mục tiêu chính
- Thiết lập bộ khung kỹ thuật chung cho toàn hệ thống theo kiến trúc:
  - **Frontend:** ReactJS + TypeScript
  - **Backend:** NestJS + TypeScript
  - **Database/Auth:** Supabase + PostgreSQL
- Chốt cách tổ chức hệ thống theo **4 khu vực chức năng**:
  - Public Area
  - User Area
  - Guide Area
  - Admin Area
- Dựng xong cấu trúc source code ban đầu để có thể phát triển tiếp mà không phải thay đổi lại kiến trúc tổng thể.
- Import và chuẩn hóa **schema 38 bảng** đã được chốt trong tài liệu.
- Seed dữ liệu nền quan trọng phục vụ xác thực, phân quyền và demo tối thiểu.
- Dựng khung giao diện dùng chung và hệ thống route nền cho toàn bộ dự án.
- Chuẩn hóa cách làm việc giữa 3 lớp: **frontend – backend – database**.
- Chốt bộ tài liệu lõi đi kèm code: Use Case tổng quát, danh mục chức năng, danh mục màn hình, cấu trúc module triển khai.

### Ý nghĩa của sprint này
Sprint 01 quyết định tính ổn định của toàn bộ roadmap 14 sprint. Nếu sprint này chốt không chắc, các sprint sau như Auth, Tour, Guide Profile, Tour Request, Companion Post và Admin sẽ rất dễ bị lệch giữa:
- dữ liệu và nghiệp vụ;
- frontend và backend;
- auth và phân quyền;
- tài liệu UML và code thật.

---

## 2. Lưu ý trước khi triển khai

### 2.1. Đây là sprint đặt móng, không làm sâu nghiệp vụ
Sprint này chỉ nên tập trung vào:
- nền tảng công nghệ;
- cấu trúc source;
- schema dữ liệu;
- layout tổng thể;
- cơ chế auth và role ở mức khung;
- component dùng chung;
- baseline API hạ tầng.

Không nên dành quá nhiều thời gian cho:
- UI quá đẹp hoặc animation phức tạp;
- tối ưu quá sớm;
- dựng component library quá nặng;
- làm sâu business logic của tour, guide, companion, review, report, payment, chat, AI.

### 2.2. Mọi quyết định nền phải chốt trước khi code sâu
Các quyết định sau phải thống nhất ngay trong Sprint 01:
- dùng Supabase Auth theo mô hình nào;
- dữ liệu nghiệp vụ người dùng nằm ở đâu;
- role được gán như thế nào;
- backend kiểm tra quyền ra sao;
- database kiểm soát quyền ở mức nào;
- naming convention, cấu trúc thư mục, module và response format dùng thống nhất cho toàn dự án.

### 2.3. Chỉ dựng “đủ dùng cho sprint sau”
Nguyên tắc là:
- dựng layout đủ tái sử dụng;
- dựng component đủ dùng;
- dựng module đủ mở rộng;
- không cố hoàn thiện 100% ngay ở sprint đầu.

### 2.4. Sprint 01 phải định nghĩa rõ “xong sprint” là gì
Sprint này chỉ được xem là hoàn thành khi có đủ:
- schema/migration baseline;
- source frontend/backend chạy được;
- API hạ tầng hoạt động;
- layout 4 khu vực hoạt động;
- seed dữ liệu nền;
- test flow tối thiểu;
- tài liệu/UML nền được cập nhật.

---

## 3. Các vấn đề cần xác định trong sprint này

### 3.1. Stack công nghệ chính thức
Cần chốt một stack duy nhất để tránh sửa dây chuyền:
- Frontend dùng ReactJS + TypeScript
- Backend dùng NestJS + TypeScript
- CSDL dùng PostgreSQL trên Supabase
- Auth dùng Supabase Auth

### 3.2. Cơ chế xác thực và đồng bộ hồ sơ người dùng
Cần xác định rõ:
- `auth.users` dùng cho xác thực;
- `public.users` dùng cho hồ sơ nghiệp vụ;
- mối quan hệ 1–1 giữa `auth.users.id` và `public.users.id`;
- thời điểm tạo bản ghi `public.users`;
- thời điểm gán role mặc định `USER`.

### 3.3. Cơ chế phân quyền
Cần chốt:
- danh mục role chính thức;
- dùng `roles` + `user_roles`, không hardcode role tạm;
- backend kiểm tra role bằng guard;
- database hỗ trợ kiểm soát truy cập bằng RLS hoặc chính sách dữ liệu phù hợp;
- frontend có route guard và area guard theo vai trò.

### 3.4. Cấu trúc 4 area của toàn hệ thống
Cần xác định rõ phạm vi:
- **Public Area:** nội dung công khai, đăng ký, đăng nhập, tra cứu tour, bài đồng hành.
- **User Area:** hồ sơ cá nhân, yêu cầu tham gia tour, bài đồng hành, báo cáo vi phạm.
- **Guide Area:** hồ sơ hướng dẫn viên, quản lý tour, quản lý yêu cầu tham gia tour.
- **Admin Area:** quản trị người dùng, phân quyền, kiểm duyệt, tiếp nhận báo cáo, audit.

### 3.5. Cấu trúc source code và module
Cần chốt:
- cấu trúc thư mục frontend;
- cấu trúc module backend;
- nhóm module dùng chung;
- naming convention cho API, DTO, entity, table, component, page, hook, service.

### 3.6. Baseline schema và seed dữ liệu
Cần xác định:
- có import toàn bộ 38 bảng ngay từ đầu hay không;
- bảng nào là bảng lõi của sprint này;
- dữ liệu seed tối thiểu gồm những gì;
- tài khoản demo nào cần tạo để test role và layout.

### 3.7. Định nghĩa phạm vi không làm sâu trong Sprint 01
Cần chốt rõ để tránh trôi sprint:
- chưa làm sâu CRUD tour;
- chưa làm sâu guide profile;
- chưa làm request tham gia tour;
- chưa làm companion post;
- chưa làm moderation nghiệp vụ;
- chưa làm chat, AI, thanh toán, lưu trú.

---

## 4. Hạng mục cần chốt

### 4.1. Hạng mục kiến trúc
- Chốt kiến trúc triển khai tổng thể của hệ thống.
- Chốt hướng monolith modular cho backend NestJS.
- Chốt mô hình frontend theo area-based routing.
- Chốt việc dùng schema chính thức 38 bảng, không tách ra một schema rút gọn khác.

### 4.2. Hạng mục xác thực
- Chốt Supabase Auth là lớp xác thực duy nhất.
- Chốt `public.users` là bảng hồ sơ nghiệp vụ.
- Chốt JWT/session từ Supabase là đầu vào cho backend guard.

### 4.3. Hạng mục phân quyền
- Chốt 5 role chính thức:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- Chốt bảng `user_roles` là nguồn dữ liệu phân quyền duy nhất ở tầng nghiệp vụ.

### 4.4. Hạng mục kiểm soát dữ liệu
- Chốt nguyên tắc dùng:
  - guard ở backend để kiểm soát API;
  - RLS hoặc policy ở database để kiểm soát dữ liệu;
  - route guard ở frontend để kiểm soát truy cập màn hình.

### 4.5. Hạng mục triển khai UI nền
- Chốt layout tổng thể cho 4 area.
- Chốt hệ thống component dùng chung.
- Chốt quy ước responsive, spacing, typography, empty state, loading state.

### 4.6. Hạng mục tài liệu
- Chốt Use Case tổng quát.
- Chốt danh mục 29 chức năng.
- Chốt danh mục 47 màn hình.
- Chốt cấu trúc module giữa frontend, backend, database.
- Chốt tiêu chuẩn cập nhật UML theo từng sprint.

---

## 5. Phương án được chọn

## 5.1. Công nghệ triển khai
Phương án chính thức được chọn:
- **Frontend:** ReactJS + TypeScript
- **Backend:** NestJS + TypeScript
- **Cơ sở dữ liệu:** PostgreSQL trên Supabase
- **Xác thực:** Supabase Auth

### Lý do chọn
- Phổ biến, dễ học, dễ demo trong phạm vi đồ án sinh viên.
- Dễ chia tách rõ frontend, backend, database.
- Tương thích tốt với TypeScript toàn stack.
- Supabase hỗ trợ sẵn auth, PostgreSQL và khả năng mở rộng dữ liệu.
- Dễ viết báo cáo vì kiến trúc rõ ràng, hiện đại nhưng vẫn khả thi.

## 5.2. Mô hình dữ liệu người dùng
Phương án chọn:
- `auth.users`: lưu lớp xác thực.
- `public.users`: lưu hồ sơ nghiệp vụ.
- `public.users.id = auth.users.id`.

### Ý nghĩa
- Tách bạch xác thực và nghiệp vụ.
- Dễ mở rộng hồ sơ người dùng mà không can thiệp sâu vào hệ auth.
- Phù hợp với schema Supabase/PostgreSQL đã chốt.

## 5.3. Mô hình phân quyền
Phương án chọn:
- dùng bảng `roles` để lưu danh mục role;
- dùng bảng `user_roles` để gán role cho user;
- không hardcode role trong giao diện;
- backend dùng `AuthGuard` + `RoleGuard`;
- database kết hợp policy/RLS cho các bảng cần bảo vệ.

## 5.4. Mô hình area
Phương án chọn:
- toàn hệ thống chia thành 4 area độc lập về route và layout:
  - Public
  - User
  - Guide
  - Admin

### Lợi ích
- dễ tổ chức source code;
- dễ phân quyền;
- dễ demo luồng theo từng nhóm người dùng;
- dễ mở rộng màn hình ở các sprint sau.

## 5.5. Mô hình schema
Phương án chọn:
- **giữ nguyên schema chính thức 38 bảng**;
- Sprint 01 chỉ tập trung dùng sâu 5 bảng nền:
  - `users`
  - `roles`
  - `user_roles`
  - `admin_activity_logs`
  - `user_role_change_logs`

### Lợi ích
- không phải đập lại dữ liệu khi sang Sprint 2–14;
- bảo đảm đồng bộ giữa báo cáo, UML và triển khai;
- có thể mở rộng dần theo mô hình “lõi trước, mở rộng sau”.

## 5.6. Mô hình module backend
Phương án triển khai nền:
- tạo bộ khung backend dạng module hóa;
- chốt định hướng phát triển về sau theo các module:
  - `auth-me`
  - `guides`
  - `guide-verification`
  - `tours`
  - `tour-requests`
  - `reviews`
  - `companions`
  - `favorites`
  - `reports-notifications`
  - `chat-ai`
  - `admin`

Trong Sprint 01 chưa cần làm đầy đủ logic của toàn bộ module, nhưng cần chốt cấu trúc để các sprint sau đi đúng hướng.

---

## 6. Ghi chú triển khai

### 6.1. Phạm vi thực hiện thật trong sprint
Sprint 01 **phải làm thật**:
- khởi tạo frontend;
- khởi tạo backend;
- cấu hình kết nối Supabase/PostgreSQL;
- import schema 38 bảng;
- seed role và dữ liệu nền;
- dựng layout 4 area;
- tạo API hạ tầng;
- chuẩn hóa response, error, logging, guard;
- cập nhật bộ tài liệu nền.

### 6.2. Phạm vi không làm sâu trong sprint
Sprint 01 **không làm sâu**:
- CRUD tour;
- hồ sơ hướng dẫn viên hoàn chỉnh;
- yêu cầu tham gia tour;
- bài đăng tìm bạn đồng hành;
- quản lý yêu thích;
- review;
- report workflow;
- chat, AI, thanh toán, lưu trú.

### 6.3. Nguyên tắc phát triển
- mỗi hạng mục phải có đầu ra kiểm tra được;
- frontend không dựng màn hình rời rạc, phải bám area;
- backend không viết API tản mạn, phải bám module;
- database không tách schema phụ, phải bám schema chuẩn;
- tài liệu không để dồn cuối kỳ, phải cập nhật ngay từ sprint này.

### 6.4. Quy tắc “xong sprint”
Sprint 01 chỉ được xem là hoàn thành khi thỏa đồng thời:
- chạy được frontend cục bộ;
- chạy được backend cục bộ;
- backend kết nối được database;
- có dữ liệu role và tài khoản demo;
- mở được layout theo 4 area;
- test được các API nền;
- tài liệu/UML nền đã được chốt.

### 6.5. Dữ liệu demo nên chuẩn bị
Nên có tối thiểu:
- 01 tài khoản `USER`
- 01 tài khoản `GUIDE`
- 01 tài khoản `SYSTEM_ADMIN`
- 01 tài khoản `CONTENT_MODERATOR` (có thể dùng chung admin nếu cần gọn)
- 01 tài khoản `SUPPORT_STAFF` (nếu có thời gian)

Mục đích:
- test phân quyền;
- test điều hướng theo area;
- test API `/me`, `/me/roles`, `/admin/roles`, `/admin/activity-logs`.

---

## 7. Chức năng trọng tâm

Sprint 01 chưa triển khai nghiệp vụ đầy đủ, nhưng chuẩn bị nền cho các chức năng sau:

### F01. Đăng ký / đăng nhập / đăng xuất
- Chưa hoàn thiện toàn bộ UI + logic auth.
- Nhưng phải chuẩn bị khung để Sprint 02 có thể triển khai ngay.
- Bao gồm route public, cơ chế session, auth guard và quy ước lấy user hiện tại.

### F03. Phân quyền người dùng
- Chuẩn bị dữ liệu role và bảng gán quyền.
- Chuẩn bị role guard ở backend.
- Chuẩn bị route guard ở frontend.
- Chuẩn bị hướng điều hướng theo area sau khi xác thực.

### F29. Giao diện quản trị trực quan
- Chưa làm dashboard quản trị đầy đủ.
- Nhưng phải dựng khung Admin Area, menu nền, layout và quyền truy cập.

### Kết luận cho nhóm chức năng
Sprint này là sprint **chuẩn bị hạ tầng** cho:
- xác thực;
- nhận diện vai trò;
- điều hướng theo quyền;
- quản trị nền;
- truy vết audit quản trị.

---

## 8. Màn hình triển khai

Trong Sprint 01, hệ thống **chưa triển khai hoàn chỉnh từng màn hình nghiệp vụ**, mà tập trung dựng **khung tổng thể cho toàn bộ M01–M47**.

## 8.1. Mục tiêu của phần màn hình
- Có cấu trúc route rõ ràng.
- Có layout riêng cho từng area.
- Có bộ component dùng chung.
- Có các trang khung/placeholder để test điều hướng.
- Có thể dùng lại trực tiếp cho Sprint 02 trở đi.

## 8.2. Các màn hình/khung cần dựng trong Sprint 01

### A. Public Area
Cần có:
- Public Layout
- Header công khai
- Footer công khai
- Trang chủ khung
- Route khung cho:
  - Đăng ký
  - Đăng nhập
  - Danh sách tour
  - Chi tiết tour
  - Danh sách bài đồng hành
  - Chi tiết bài đồng hành

> Lưu ý: ở Sprint 01 chỉ cần route và page shell; chưa bắt buộc có nghiệp vụ sâu.

### B. User Area
Cần có:
- User Layout
- Sidebar/Navigation cá nhân
- Route guard cho người dùng đã đăng nhập
- Page shell cho:
  - Hồ sơ cá nhân
  - Đổi mật khẩu
  - Yêu cầu tham gia tour của tôi
  - Danh sách bài đồng hành của tôi

### C. Guide Area
Cần có:
- Guide Layout
- Menu guide
- Guide dashboard shell
- Route khung cho:
  - Hồ sơ hướng dẫn viên của tôi
  - Danh sách tour của tôi
  - Quản lý yêu cầu tham gia tour

### D. Admin Area
Cần có:
- Admin Layout
- Sidebar admin
- Breadcrumb admin
- Page shell cho:
  - Dashboard quản trị
  - Quản lý người dùng
  - Quản lý role
  - Nhật ký hoạt động quản trị

## 8.3. Component giao diện dùng chung bắt buộc
- `AppLayout`
- `PageContainer`
- `Header`
- `Sidebar`
- `Breadcrumb`
- `Table`
- `Modal`
- `ConfirmDialog`
- `Button`
- `Input/FormField`
- `Select`
- `BadgeStatus`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `UnauthorizedState`

## 8.4. Kết quả mong đợi của phần màn hình
- điều hướng được qua 4 area;
- layout không vỡ;
- guard chặn được truy cập area sai vai trò;
- có khung đủ để nối API ở Sprint 02 mà không phải dựng lại giao diện nền.

---

## 9. Bảng CSDL chính

Sprint 01 tập trung chủ yếu vào 5 bảng nền, đồng thời import toàn bộ schema 38 bảng để bảo đảm đồng bộ thiết kế.

## 9.1. `users`
### Vai trò
Lưu hồ sơ nghiệp vụ của người dùng.

### Thuộc tính quan trọng
- `id` – khóa chính, tham chiếu `auth.users(id)`
- `email`
- `full_name`
- `phone`
- `avatar_url`
- `date_of_birth`
- `gender`
- `status` (`active`, `suspended`, `locked`)
- `created_at`
- `updated_at`
- `last_seen_at`

### Ràng buộc đáng chú ý
- `date_of_birth <= current_date`
- email cần unique theo dạng lower-case
- phone unique nếu có giá trị
- `status` chỉ nhận các giá trị hợp lệ

### Ý nghĩa trong Sprint 01
- làm nền cho `/me`
- làm nền cho hồ sơ cá nhân ở Sprint 02
- làm nền cho phân quyền và điều hướng area

## 9.2. `roles`
### Vai trò
Lưu danh mục role chính thức của hệ thống.

### Dữ liệu seed bắt buộc
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

### Ý nghĩa trong Sprint 01
- làm nguồn chuẩn cho toàn bộ cơ chế phân quyền;
- tránh hardcode role ở frontend/backend.

## 9.3. `user_roles`
### Vai trò
Liên kết nhiều–nhiều giữa người dùng và vai trò.

### Thuộc tính quan trọng
- `user_id`
- `role_code`
- `assigned_by`
- `assigned_at`

### Ý nghĩa trong Sprint 01
- phục vụ API `/me/roles`
- phục vụ route guard và role guard
- hỗ trợ mô hình nhiều role cho admin nội bộ

## 9.4. `admin_activity_logs`
### Vai trò
Lưu lịch sử thao tác quản trị.

### Thuộc tính quan trọng
- `actor_user_id`
- `actor_role_code`
- `module_name`
- `entity_type`
- `entity_pk`
- `action_type`
- `reason`
- `old_data`
- `new_data`
- `metadata`
- `ip_address`
- `user_agent`
- `created_at`

### Ý nghĩa trong Sprint 01
- chuẩn bị nền cho audit quản trị
- chuẩn bị API `/admin/activity-logs`
- tạo tính thuyết phục cho phần Admin Area trong đồ án

## 9.5. `user_role_change_logs`
### Vai trò
Lưu lịch sử thay đổi quyền của người dùng.

### Thuộc tính quan trọng
- `target_user_id`
- `changed_role_code`
- `action_type` (`assign`, `revoke`)
- `changed_by_user_id`
- `old_snapshot`
- `new_snapshot`
- `note`
- `created_at`

### Ý nghĩa trong Sprint 01
- hỗ trợ truy vết việc gán hoặc thu hồi role;
- làm nền cho quản trị role ở các sprint sau;
- bảo đảm tính minh bạch và khả năng giải trình của quản trị viên.

## 9.6. Ghi chú về schema tổng thể
Mặc dù Sprint 01 chỉ dùng sâu 5 bảng trên, vẫn cần:
- import đủ **38 bảng chính thức**;
- không tự tạo một schema rút gọn khác;
- giữ nguyên định hướng mở rộng cho các sprint sau như tour, companion, report, review, chat, AI, payment.

---

## 10. API cần thiết

Sprint 01 chỉ triển khai **API hạ tầng**, chưa đi sâu vào nghiệp vụ.

## 10.1. `GET /health`
### Mục đích
Kiểm tra trạng thái hoạt động của backend.

### Kết quả mong đợi
- trả về trạng thái service;
- kiểm tra backend đã khởi chạy;
- có thể mở rộng kiểm tra DB connection.

### Gợi ý response
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "ok",
    "timestamp": "ISO_DATE",
    "service": "travelconnect-backend"
  }
}
```

## 10.2. `GET /me`
### Mục đích
Lấy hồ sơ người dùng hiện tại từ `public.users`.

### Yêu cầu
- cần access token hợp lệ;
- backend đọc danh tính user từ Supabase JWT/session.

### Kết quả mong đợi
- trả về hồ sơ nghiệp vụ hiện tại;
- làm nền cho Sprint 02.

## 10.3. `GET /me/roles`
### Mục đích
Lấy danh sách vai trò của user hiện tại.

### Yêu cầu
- cần access token hợp lệ.

### Kết quả mong đợi
- trả về mảng role;
- hỗ trợ route guard và điều hướng sau đăng nhập.

## 10.4. `GET /admin/roles`
### Mục đích
Lấy danh mục role hệ thống.

### Yêu cầu
- chỉ role quản trị được truy cập.

### Kết quả mong đợi
- trả về danh sách role seed chuẩn;
- làm nền cho quản lý phân quyền sau này.

## 10.5. `GET /admin/activity-logs`
### Mục đích
Lấy nhật ký thao tác quản trị.

### Yêu cầu
- chỉ role phù hợp mới được truy cập.

### Kết quả mong đợi
- trả về danh sách log;
- hỗ trợ kiểm tra audit flow và Admin Area.

## 10.6. Yêu cầu kỹ thuật chung cho API
Tất cả API trong Sprint 01 cần thống nhất:
- response envelope chung;
- error format chung;
- HTTP status code rõ ràng;
- xử lý unauthorized/forbidden thống nhất;
- log request/error tối thiểu;
- có thể test bằng Postman hoặc Swagger.

---

## 11. Công việc frontend

## 11.1. Khởi tạo dự án
- Tạo project ReactJS + TypeScript.
- Thiết lập cấu trúc thư mục chuẩn.
- Cấu hình biến môi trường.
- Thiết lập router tổng thể.

## 11.2. Tổ chức source theo area
Gợi ý cấu trúc:
- `public/`
- `user/`
- `guide/`
- `admin/`
- `shared/`
- `components/`
- `layouts/`
- `hooks/`
- `services/`
- `routes/`

## 11.3. Dựng App Layout tổng thể
- layout root;
- route tree theo area;
- area shell dùng lại được;
- page container chuẩn.

## 11.4. Xây dựng bộ component dùng chung
Cần dựng phiên bản nền cho:
- button;
- input;
- select;
- modal;
- confirm dialog;
- table;
- status badge;
- loading skeleton;
- empty state;
- unauthorized state.

## 11.5. Chuẩn hóa quy ước giao diện
Cần chốt:
- màu chủ đạo;
- font và cỡ chữ;
- heading system;
- khoảng cách;
- style form;
- style bảng danh sách;
- style thông báo lỗi/thành công.

## 11.6. Guard và state nền
- chuẩn bị auth context/store;
- route guard theo đăng nhập;
- role guard theo area;
- cơ chế redirect khi không đủ quyền.

## 11.7. Nối API hạ tầng
Frontend cần test được:
- `/health`
- `/me`
- `/me/roles`
- `/admin/roles`
- `/admin/activity-logs`

Ở sprint này có thể dùng dữ liệu thật hoặc mock bán phần, nhưng phải chốt sẵn interface dữ liệu.

## 11.8. Kết quả mong đợi phía frontend
- có thể chạy app;
- điều hướng được giữa các area;
- có layout dùng lại được;
- có component nền dùng cho các sprint sau;
- sẵn sàng nối nghiệp vụ thật từ Sprint 02.

---

## 12. Công việc backend

## 12.1. Khởi tạo dự án NestJS
- tạo project NestJS + TypeScript;
- cấu hình env;
- cấu hình CORS;
- cấu hình module gốc;
- tách module dùng chung.

## 12.2. Chuẩn hóa cấu trúc backend
Cần có nền cho:
- `controller`
- `service`
- `guard`
- `interceptor`
- `filter`
- `dto`
- `common response`
- `logger`

## 12.3. Auth và role guard
- chuẩn bị `AuthGuard` đọc token từ Supabase;
- chuẩn bị `RoleGuard` kiểm tra quyền từ `user_roles`;
- chuẩn bị decorator hoặc metadata cho role.

## 12.4. Chuẩn hóa response và xử lý lỗi
Cần thống nhất:
- format thành công;
- format lỗi;
- business error;
- validation error;
- unauthorized/forbidden error;
- not found error.

## 12.5. Logging và audit
- log request cơ bản;
- log error cơ bản;
- chuẩn bị audit service để ghi `admin_activity_logs` trong các sprint sau;
- chốt convention cho `module_name`, `entity_type`, `action_type`.

## 12.6. Module nền cần có trong Sprint 01
Tối thiểu nên có:
- `health`
- `auth-me`
- `admin`
- `common`
- `database`

Có thể dựng trước skeleton cho:
- `guides`
- `tours`
- `companions`
- `reports-notifications`

## 12.7. API hạ tầng
Triển khai và test:
- `GET /health`
- `GET /me`
- `GET /me/roles`
- `GET /admin/roles`
- `GET /admin/activity-logs`

## 12.8. Tài liệu kỹ thuật backend cần chốt
- quy ước đặt tên controller/service;
- quy ước version API;
- quy ước response;
- quy ước guard;
- quy ước logging;
- quy ước viết DTO.

## 12.9. Kết quả mong đợi phía backend
- service chạy ổn định;
- kết nối được Supabase/PostgreSQL;
- xác định được user hiện tại;
- xác định được role hiện tại;
- có khung admin audit cơ bản;
- không phải refactor lớn khi vào Sprint 02.

---

## 13. Công việc database

## 13.1. Import schema 38 bảng
- import schema chính thức;
- không giản lược lại thành schema nhỏ;
- giữ cấu trúc tương thích hoàn toàn với tài liệu thiết kế dữ liệu.

## 13.2. Cấu hình Supabase/PostgreSQL
- tạo project database;
- cấu hình extension cần thiết;
- kiểm tra kết nối từ backend;
- kiểm tra quyền truy cập môi trường dev.

## 13.3. Seed role bắt buộc
Phải seed đủ:
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

## 13.4. Tạo dữ liệu nền người dùng
Nên tạo:
- 01 user thường
- 01 guide
- 01 system admin
- 01 moderator
- 01 support staff

## 13.5. Chuẩn hóa ràng buộc dữ liệu nền
Cần kiểm tra:
- unique email;
- unique phone nếu có;
- miền giá trị `status` của `users`;
- toàn vẹn khóa ngoại giữa `users`, `roles`, `user_roles`;
- log tables tham chiếu đúng `public.users` và `public.roles`.

## 13.6. Baseline migration
- tạo migration baseline đầu tiên;
- xác định nguyên tắc viết migration về sau;
- tách seed với migration nếu cần;
- ghi rõ thứ tự chạy script.

## 13.7. Chuẩn bị định hướng RLS/policy
Trong Sprint 01 chưa cần viết toàn bộ policy phức tạp, nhưng cần chốt nguyên tắc:
- bảng nào cần bảo vệ theo user hiện tại;
- bảng nào chỉ admin đọc;
- bảng nào công khai;
- tầng nào chịu trách nhiệm kiểm soát chính: database hay backend.

## 13.8. Kết quả mong đợi phía database
- schema chạy được;
- seed chạy được;
- dữ liệu nền dùng được cho frontend/backend test;
- sẵn sàng cho Auth + Profile + Role ở Sprint 02.

---

## 14. Tài liệu/UML

Sprint 01 phải chốt bộ tài liệu nền để toàn bộ roadmap đi thống nhất.

## 14.1. Tài liệu cần hoàn thiện
- Use Case tổng quát của toàn hệ thống
- Danh mục 29 chức năng
- Danh mục 47 màn hình
- Mô tả 4 area
- Nguyên tắc phân quyền theo vai trò
- Cấu trúc module triển khai
- Nguyên tắc phối hợp frontend – backend – database

## 14.2. UML cần chốt trong Sprint 01
### Bắt buộc
- Use Case Diagram tổng quát

### Nên chốt ở mức nền
- sơ đồ phân chia module hoặc sơ đồ kiến trúc triển khai
- sơ đồ điều hướng area ở mức khái quát

> Chưa cần dồn toàn bộ Activity Diagram và Sequence Diagram nghiệp vụ vào Sprint 01, vì phần đó sẽ đi sâu ở các sprint chức năng như Sprint 02, Sprint 05, Sprint 06, Sprint 07, Sprint 08.

## 14.3. Mục tiêu của phần tài liệu/UML
- để báo cáo và code đi cùng nhau;
- tránh tình trạng tài liệu nói một kiểu, code làm một kiểu;
- giảm rủi ro thiếu logic khi bảo vệ đồ án.

---

## 15. Đầu ra

Kết thúc Sprint 01, hệ thống cần đạt được các đầu ra sau:

### 15.1. Đầu ra kỹ thuật
- Source code frontend đã được khởi tạo hoàn chỉnh.
- Source code backend đã được khởi tạo hoàn chỉnh.
- Kết nối được backend với Supabase/PostgreSQL.
- Database đã dựng xong theo schema 38 bảng.
- Seed role và dữ liệu nền đã chạy thành công.
- API hạ tầng đã chạy được.

### 15.2. Đầu ra giao diện
- Layout tổng thể 4 khu vực hoạt động ổn định:
  - Public Area
  - User Area
  - Guide Area
  - Admin Area
- Có bộ component dùng chung sẵn sàng tái sử dụng.
- Có page shell đủ để nối nghiệp vụ ở Sprint 02.

### 15.3. Đầu ra dữ liệu và phân quyền
- Có bảng users, roles, user_roles hoạt động đúng.
- Có dữ liệu role chuẩn.
- Có dữ liệu tài khoản demo.
- Có cơ chế lấy user hiện tại và role hiện tại.

### 15.4. Đầu ra tài liệu
- Use Case tổng quát được chốt.
- Danh mục 29 chức năng được chốt.
- Danh mục 47 màn hình được chốt.
- Cấu trúc module triển khai được chốt.
- Nguyên tắc phối hợp giữa frontend, backend và database được chốt.

### 15.5. Tiêu chí sẵn sàng sang Sprint 02
Sprint 01 chỉ được coi là thành công khi dự án đã sẵn sàng bước sang Sprint 02 mà **không cần quay lại sửa kiến trúc nền**, cụ thể:
- đã có khung auth;
- đã có khung profile;
- đã có khung role;
- đã có layout area;
- đã có schema chuẩn;
- đã có seed dữ liệu;
- đã có rule triển khai thống nhất cho toàn bộ dự án.

---

## 16. Kết luận sprint

Sprint 01 là sprint nền tảng có giá trị quyết định đối với toàn bộ đồ án. Thành công của sprint này không được đo bằng số lượng chức năng nghiệp vụ hoàn thành, mà được đo bằng mức độ **ổn định, đồng bộ và sẵn sàng mở rộng** của hệ thống. Nếu sprint này được làm chắc, các sprint sau như Auth, Guide Profile, Tour, Tour Request, Companion Post và Admin sẽ triển khai nhanh hơn, ít sửa hơn và nhất quán hơn giữa báo cáo, UML, cơ sở dữ liệu và mã nguồn.
