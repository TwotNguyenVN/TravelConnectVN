# SPRINT MASTER – Tổng hợp kế hoạch triển khai Sprint 01–14

## 1. Mục đích tài liệu

Tài liệu này tổng hợp toàn bộ kế hoạch triển khai của đồ án website du lịch kết nối **khách du lịch – hướng dẫn viên địa phương – người tìm bạn đồng hành** theo lộ trình **14 sprint**.  
Mục tiêu của file master là giúp theo dõi dự án tại **một nơi thống nhất**, thuận tiện cho các nhu cầu:
- theo dõi roadmap tổng thể;
- đối chiếu phạm vi giữa các sprint;
- dùng làm căn cứ triển khai frontend, backend, database;
- dùng làm khung viết báo cáo, trình bày tiến độ và chuẩn bị demo bảo vệ.

## 2. Nguyên tắc triển khai xuyên suốt

- Ưu tiên **lõi trước, mở rộng sau**.
- Mỗi sprint đều phải đi đủ các lớp: **database – backend – frontend – test – tài liệu/UML**.
- Không để một sprint có quá nhiều mục tiêu ngang nhau; mỗi sprint phải có **một trục chính**.
- Phải xác định rõ tiêu chí **“xong sprint”** trước khi chuyển sprint tiếp theo.
- Với các sprint có trạng thái nghiệp vụ, phải chốt trước:
  - state machine,
  - vai trò được phép chuyển trạng thái,
  - dữ liệu demo để test,
  - UML cần cập nhật ngay trong sprint đó.
- Các chức năng mở rộng như AI, chat nâng cao, lưu trú, thanh toán chỉ được triển khai khi phần lõi đã đủ ổn định.

## 3. Cấu trúc tổng thể của roadmap

### Giai đoạn A – Nền tảng và kiến trúc lõi
- Sprint 01: Nền tảng kỹ thuật tổng thể
- Sprint 02: Tài khoản, hồ sơ cá nhân, phân quyền

### Giai đoạn B – Phiên bản lõi ưu tiên 1
- Sprint 03: Public tour
- Sprint 04: Guide profile
- Sprint 05: Guide quản lý tour
- Sprint 06: Yêu cầu tham gia tour
- Sprint 07: Companion post và companion request
- Sprint 08: Admin lõi, report, kiểm duyệt, phân quyền quản trị

### Giai đoạn C – Ổn định MVP và nhóm ưu tiên 2
- Sprint 09: Ổn định MVP lõi
- Sprint 10: Favorite, review, verification
- Sprint 11: Bản đồ, lịch sử hoạt động, thông báo, thống kê

### Giai đoạn D – Nhóm mở rộng ưu tiên 3
- Sprint 12: Chat trực tiếp và chat nhóm bài đồng hành
- Sprint 13: AI, gợi ý tour, lưu trú, thanh toán

### Giai đoạn E – Đóng gói và chuẩn bị bảo vệ
- Sprint 14: Kiểm thử tổng thể, chuẩn hóa demo, hoàn thiện tài liệu và bảo vệ

## 4. Mục lục sprint

- [Sprint 01: Khởi tạo dự án và xây dựng nền tảng kỹ thuật tổng thể](#sprint-01)
- [Sprint 02: Triển khai tài khoản, hồ sơ cá nhân và phân quyền người dùng](#sprint-02)
- [Sprint 03: Triển khai khu vực công khai cho tour du lịch](#sprint-03)
- [Sprint 04: Triển khai hồ sơ hướng dẫn viên và khu vực công khai của hướng dẫn viên](#sprint-04)
- [Sprint 05: Triển khai chức năng quản lý tour cho hướng dẫn viên](#sprint-05)
- [Sprint 06: Triển khai yêu cầu tham gia tour](#sprint-06)
- [Sprint 07: Triển khai bài tìm bạn đồng hành và yêu cầu tham gia bài đồng hành](#sprint-07)
- [Sprint 08: Hoàn thiện Admin lõi, report flow, kiểm duyệt và phân quyền quản trị](#sprint-08)
- [Sprint 09: Ổn định phiên bản lõi và hoàn thiện MVP](#sprint-09)
- [Sprint 10: Hoàn thiện nhóm ưu tiên 2: yêu thích, đánh giá và xác minh hồ sơ](#sprint-10)
- [Sprint 11: Hoàn thiện nhóm ưu tiên 2: bản đồ, lịch sử hoạt động, thông báo và thống kê](#sprint-11)
- [Sprint 12: Mở rộng giao tiếp: chat trực tiếp và chat nhóm bài đồng hành](#sprint-12)
- [Sprint 13: Mở rộng giá trị trình bày: AI, gợi ý tour, lưu trú và thanh toán](#sprint-13)
- [Sprint 14: Đóng gói bản cuối, kiểm thử tổng thể và chuẩn bị bảo vệ](#sprint-14)

---

## 5. Nội dung chi tiết từng sprint

<a id="sprint-01"></a>
## SPRINT 01 – Khởi tạo dự án và xây dựng nền tảng kỹ thuật tổng thể

### 1. Mục tiêu sprint

Sprint 01 là sprint đặt nền móng kỹ thuật cho toàn bộ đồ án website du lịch kết nối **khách du lịch – hướng dẫn viên địa phương – người tìm bạn đồng hành**. Trọng tâm của sprint này **không phải hoàn thiện nghiệp vụ**, mà là chuẩn hóa toàn bộ khung triển khai để các sprint sau có thể phát triển đồng bộ giữa frontend, backend, database và tài liệu/UML.

#### Mục tiêu chính
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

#### Ý nghĩa của sprint này
Sprint 01 quyết định tính ổn định của toàn bộ roadmap 14 sprint. Nếu sprint này chốt không chắc, các sprint sau như Auth, Tour, Guide Profile, Tour Request, Companion Post và Admin sẽ rất dễ bị lệch giữa:
- dữ liệu và nghiệp vụ;
- frontend và backend;
- auth và phân quyền;
- tài liệu UML và code thật.

---

### 2. Lưu ý trước khi triển khai

#### 2.1. Đây là sprint đặt móng, không làm sâu nghiệp vụ
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

#### 2.2. Mọi quyết định nền phải chốt trước khi code sâu
Các quyết định sau phải thống nhất ngay trong Sprint 01:
- dùng Supabase Auth theo mô hình nào;
- dữ liệu nghiệp vụ người dùng nằm ở đâu;
- role được gán như thế nào;
- backend kiểm tra quyền ra sao;
- database kiểm soát quyền ở mức nào;
- naming convention, cấu trúc thư mục, module và response format dùng thống nhất cho toàn dự án.

#### 2.3. Chỉ dựng “đủ dùng cho sprint sau”
Nguyên tắc là:
- dựng layout đủ tái sử dụng;
- dựng component đủ dùng;
- dựng module đủ mở rộng;
- không cố hoàn thiện 100% ngay ở sprint đầu.

#### 2.4. Sprint 01 phải định nghĩa rõ “xong sprint” là gì
Sprint này chỉ được xem là hoàn thành khi có đủ:
- schema/migration baseline;
- source frontend/backend chạy được;
- API hạ tầng hoạt động;
- layout 4 khu vực hoạt động;
- seed dữ liệu nền;
- test flow tối thiểu;
- tài liệu/UML nền được cập nhật.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Stack công nghệ chính thức
Cần chốt một stack duy nhất để tránh sửa dây chuyền:
- Frontend dùng ReactJS + TypeScript
- Backend dùng NestJS + TypeScript
- CSDL dùng PostgreSQL trên Supabase
- Auth dùng Supabase Auth

#### 3.2. Cơ chế xác thực và đồng bộ hồ sơ người dùng
Cần xác định rõ:
- `auth.users` dùng cho xác thực;
- `public.users` dùng cho hồ sơ nghiệp vụ;
- mối quan hệ 1–1 giữa `auth.users.id` và `public.users.id`;
- thời điểm tạo bản ghi `public.users`;
- thời điểm gán role mặc định `USER`.

#### 3.3. Cơ chế phân quyền
Cần chốt:
- danh mục role chính thức;
- dùng `roles` + `user_roles`, không hardcode role tạm;
- backend kiểm tra role bằng guard;
- database hỗ trợ kiểm soát truy cập bằng RLS hoặc chính sách dữ liệu phù hợp;
- frontend có route guard và area guard theo vai trò.

#### 3.4. Cấu trúc 4 area của toàn hệ thống
Cần xác định rõ phạm vi:
- **Public Area:** nội dung công khai, đăng ký, đăng nhập, tra cứu tour, bài đồng hành.
- **User Area:** hồ sơ cá nhân, yêu cầu tham gia tour, bài đồng hành, báo cáo vi phạm.
- **Guide Area:** hồ sơ hướng dẫn viên, quản lý tour, quản lý yêu cầu tham gia tour.
- **Admin Area:** quản trị người dùng, phân quyền, kiểm duyệt, tiếp nhận báo cáo, audit.

#### 3.5. Cấu trúc source code và module
Cần chốt:
- cấu trúc thư mục frontend;
- cấu trúc module backend;
- nhóm module dùng chung;
- naming convention cho API, DTO, entity, table, component, page, hook, service.

#### 3.6. Baseline schema và seed dữ liệu
Cần xác định:
- có import toàn bộ 38 bảng ngay từ đầu hay không;
- bảng nào là bảng lõi của sprint này;
- dữ liệu seed tối thiểu gồm những gì;
- tài khoản demo nào cần tạo để test role và layout.

#### 3.7. Định nghĩa phạm vi không làm sâu trong Sprint 01
Cần chốt rõ để tránh trôi sprint:
- chưa làm sâu CRUD tour;
- chưa làm sâu guide profile;
- chưa làm request tham gia tour;
- chưa làm companion post;
- chưa làm moderation nghiệp vụ;
- chưa làm chat, AI, thanh toán, lưu trú.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục kiến trúc
- Chốt kiến trúc triển khai tổng thể của hệ thống.
- Chốt hướng monolith modular cho backend NestJS.
- Chốt mô hình frontend theo area-based routing.
- Chốt việc dùng schema chính thức 38 bảng, không tách ra một schema rút gọn khác.

#### 4.2. Hạng mục xác thực
- Chốt Supabase Auth là lớp xác thực duy nhất.
- Chốt `public.users` là bảng hồ sơ nghiệp vụ.
- Chốt JWT/session từ Supabase là đầu vào cho backend guard.

#### 4.3. Hạng mục phân quyền
- Chốt 5 role chính thức:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- Chốt bảng `user_roles` là nguồn dữ liệu phân quyền duy nhất ở tầng nghiệp vụ.

#### 4.4. Hạng mục kiểm soát dữ liệu
- Chốt nguyên tắc dùng:
  - guard ở backend để kiểm soát API;
  - RLS hoặc policy ở database để kiểm soát dữ liệu;
  - route guard ở frontend để kiểm soát truy cập màn hình.

#### 4.5. Hạng mục triển khai UI nền
- Chốt layout tổng thể cho 4 area.
- Chốt hệ thống component dùng chung.
- Chốt quy ước responsive, spacing, typography, empty state, loading state.

#### 4.6. Hạng mục tài liệu
- Chốt Use Case tổng quát.
- Chốt danh mục 29 chức năng.
- Chốt danh mục 47 màn hình.
- Chốt cấu trúc module giữa frontend, backend, database.
- Chốt tiêu chuẩn cập nhật UML theo từng sprint.

---

### 5. Phương án được chọn

### 5.1. Công nghệ triển khai
Phương án chính thức được chọn:
- **Frontend:** ReactJS + TypeScript
- **Backend:** NestJS + TypeScript
- **Cơ sở dữ liệu:** PostgreSQL trên Supabase
- **Xác thực:** Supabase Auth

#### Lý do chọn
- Phổ biến, dễ học, dễ demo trong phạm vi đồ án sinh viên.
- Dễ chia tách rõ frontend, backend, database.
- Tương thích tốt với TypeScript toàn stack.
- Supabase hỗ trợ sẵn auth, PostgreSQL và khả năng mở rộng dữ liệu.
- Dễ viết báo cáo vì kiến trúc rõ ràng, hiện đại nhưng vẫn khả thi.

### 5.2. Mô hình dữ liệu người dùng
Phương án chọn:
- `auth.users`: lưu lớp xác thực.
- `public.users`: lưu hồ sơ nghiệp vụ.
- `public.users.id = auth.users.id`.

#### Ý nghĩa
- Tách bạch xác thực và nghiệp vụ.
- Dễ mở rộng hồ sơ người dùng mà không can thiệp sâu vào hệ auth.
- Phù hợp với schema Supabase/PostgreSQL đã chốt.

### 5.3. Mô hình phân quyền
Phương án chọn:
- dùng bảng `roles` để lưu danh mục role;
- dùng bảng `user_roles` để gán role cho user;
- không hardcode role trong giao diện;
- backend dùng `AuthGuard` + `RoleGuard`;
- database kết hợp policy/RLS cho các bảng cần bảo vệ.

### 5.4. Mô hình area
Phương án chọn:
- toàn hệ thống chia thành 4 area độc lập về route và layout:
  - Public
  - User
  - Guide
  - Admin

#### Lợi ích
- dễ tổ chức source code;
- dễ phân quyền;
- dễ demo luồng theo từng nhóm người dùng;
- dễ mở rộng màn hình ở các sprint sau.

### 5.5. Mô hình schema
Phương án chọn:
- **giữ nguyên schema chính thức 38 bảng**;
- Sprint 01 chỉ tập trung dùng sâu 5 bảng nền:
  - `users`
  - `roles`
  - `user_roles`
  - `admin_activity_logs`
  - `user_role_change_logs`

#### Lợi ích
- không phải đập lại dữ liệu khi sang Sprint 2–14;
- bảo đảm đồng bộ giữa báo cáo, UML và triển khai;
- có thể mở rộng dần theo mô hình “lõi trước, mở rộng sau”.

### 5.6. Mô hình module backend
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

### 6. Ghi chú triển khai

#### 6.1. Phạm vi thực hiện thật trong sprint
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

#### 6.2. Phạm vi không làm sâu trong sprint
Sprint 01 **không làm sâu**:
- CRUD tour;
- hồ sơ hướng dẫn viên hoàn chỉnh;
- yêu cầu tham gia tour;
- bài đăng tìm bạn đồng hành;
- quản lý yêu thích;
- review;
- report workflow;
- chat, AI, thanh toán, lưu trú.

#### 6.3. Nguyên tắc phát triển
- mỗi hạng mục phải có đầu ra kiểm tra được;
- frontend không dựng màn hình rời rạc, phải bám area;
- backend không viết API tản mạn, phải bám module;
- database không tách schema phụ, phải bám schema chuẩn;
- tài liệu không để dồn cuối kỳ, phải cập nhật ngay từ sprint này.

#### 6.4. Quy tắc “xong sprint”
Sprint 01 chỉ được xem là hoàn thành khi thỏa đồng thời:
- chạy được frontend cục bộ;
- chạy được backend cục bộ;
- backend kết nối được database;
- có dữ liệu role và tài khoản demo;
- mở được layout theo 4 area;
- test được các API nền;
- tài liệu/UML nền đã được chốt.

#### 6.5. Dữ liệu demo nên chuẩn bị
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

### 7. Chức năng trọng tâm

Sprint 01 chưa triển khai nghiệp vụ đầy đủ, nhưng chuẩn bị nền cho các chức năng sau:

#### F01. Đăng ký / đăng nhập / đăng xuất
- Chưa hoàn thiện toàn bộ UI + logic auth.
- Nhưng phải chuẩn bị khung để Sprint 02 có thể triển khai ngay.
- Bao gồm route public, cơ chế session, auth guard và quy ước lấy user hiện tại.

#### F03. Phân quyền người dùng
- Chuẩn bị dữ liệu role và bảng gán quyền.
- Chuẩn bị role guard ở backend.
- Chuẩn bị route guard ở frontend.
- Chuẩn bị hướng điều hướng theo area sau khi xác thực.

#### F29. Giao diện quản trị trực quan
- Chưa làm dashboard quản trị đầy đủ.
- Nhưng phải dựng khung Admin Area, menu nền, layout và quyền truy cập.

#### Kết luận cho nhóm chức năng
Sprint này là sprint **chuẩn bị hạ tầng** cho:
- xác thực;
- nhận diện vai trò;
- điều hướng theo quyền;
- quản trị nền;
- truy vết audit quản trị.

---

### 8. Màn hình triển khai

Trong Sprint 01, hệ thống **chưa triển khai hoàn chỉnh từng màn hình nghiệp vụ**, mà tập trung dựng **khung tổng thể cho toàn bộ M01–M47**.

### 8.1. Mục tiêu của phần màn hình
- Có cấu trúc route rõ ràng.
- Có layout riêng cho từng area.
- Có bộ component dùng chung.
- Có các trang khung/placeholder để test điều hướng.
- Có thể dùng lại trực tiếp cho Sprint 02 trở đi.

### 8.2. Các màn hình/khung cần dựng trong Sprint 01

#### A. Public Area
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

#### B. User Area
Cần có:
- User Layout
- Sidebar/Navigation cá nhân
- Route guard cho người dùng đã đăng nhập
- Page shell cho:
  - Hồ sơ cá nhân
  - Đổi mật khẩu
  - Yêu cầu tham gia tour của tôi
  - Danh sách bài đồng hành của tôi

#### C. Guide Area
Cần có:
- Guide Layout
- Menu guide
- Guide dashboard shell
- Route khung cho:
  - Hồ sơ hướng dẫn viên của tôi
  - Danh sách tour của tôi
  - Quản lý yêu cầu tham gia tour

#### D. Admin Area
Cần có:
- Admin Layout
- Sidebar admin
- Breadcrumb admin
- Page shell cho:
  - Dashboard quản trị
  - Quản lý người dùng
  - Quản lý role
  - Nhật ký hoạt động quản trị

### 8.3. Component giao diện dùng chung bắt buộc
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

### 8.4. Kết quả mong đợi của phần màn hình
- điều hướng được qua 4 area;
- layout không vỡ;
- guard chặn được truy cập area sai vai trò;
- có khung đủ để nối API ở Sprint 02 mà không phải dựng lại giao diện nền.

---

### 9. Bảng CSDL chính

Sprint 01 tập trung chủ yếu vào 5 bảng nền, đồng thời import toàn bộ schema 38 bảng để bảo đảm đồng bộ thiết kế.

### 9.1. `users`
#### Vai trò
Lưu hồ sơ nghiệp vụ của người dùng.

#### Thuộc tính quan trọng
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

#### Ràng buộc đáng chú ý
- `date_of_birth <= current_date`
- email cần unique theo dạng lower-case
- phone unique nếu có giá trị
- `status` chỉ nhận các giá trị hợp lệ

#### Ý nghĩa trong Sprint 01
- làm nền cho `/me`
- làm nền cho hồ sơ cá nhân ở Sprint 02
- làm nền cho phân quyền và điều hướng area

### 9.2. `roles`
#### Vai trò
Lưu danh mục role chính thức của hệ thống.

#### Dữ liệu seed bắt buộc
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

#### Ý nghĩa trong Sprint 01
- làm nguồn chuẩn cho toàn bộ cơ chế phân quyền;
- tránh hardcode role ở frontend/backend.

### 9.3. `user_roles`
#### Vai trò
Liên kết nhiều–nhiều giữa người dùng và vai trò.

#### Thuộc tính quan trọng
- `user_id`
- `role_code`
- `assigned_by`
- `assigned_at`

#### Ý nghĩa trong Sprint 01
- phục vụ API `/me/roles`
- phục vụ route guard và role guard
- hỗ trợ mô hình nhiều role cho admin nội bộ

### 9.4. `admin_activity_logs`
#### Vai trò
Lưu lịch sử thao tác quản trị.

#### Thuộc tính quan trọng
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

#### Ý nghĩa trong Sprint 01
- chuẩn bị nền cho audit quản trị
- chuẩn bị API `/admin/activity-logs`
- tạo tính thuyết phục cho phần Admin Area trong đồ án

### 9.5. `user_role_change_logs`
#### Vai trò
Lưu lịch sử thay đổi quyền của người dùng.

#### Thuộc tính quan trọng
- `target_user_id`
- `changed_role_code`
- `action_type` (`assign`, `revoke`)
- `changed_by_user_id`
- `old_snapshot`
- `new_snapshot`
- `note`
- `created_at`

#### Ý nghĩa trong Sprint 01
- hỗ trợ truy vết việc gán hoặc thu hồi role;
- làm nền cho quản trị role ở các sprint sau;
- bảo đảm tính minh bạch và khả năng giải trình của quản trị viên.

### 9.6. Ghi chú về schema tổng thể
Mặc dù Sprint 01 chỉ dùng sâu 5 bảng trên, vẫn cần:
- import đủ **38 bảng chính thức**;
- không tự tạo một schema rút gọn khác;
- giữ nguyên định hướng mở rộng cho các sprint sau như tour, companion, report, review, chat, AI, payment.

---

### 10. API cần thiết

Sprint 01 chỉ triển khai **API hạ tầng**, chưa đi sâu vào nghiệp vụ.

### 10.1. `GET /health`
#### Mục đích
Kiểm tra trạng thái hoạt động của backend.

#### Kết quả mong đợi
- trả về trạng thái service;
- kiểm tra backend đã khởi chạy;
- có thể mở rộng kiểm tra DB connection.

#### Gợi ý response
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

### 10.2. `GET /me`
#### Mục đích
Lấy hồ sơ người dùng hiện tại từ `public.users`.

#### Yêu cầu
- cần access token hợp lệ;
- backend đọc danh tính user từ Supabase JWT/session.

#### Kết quả mong đợi
- trả về hồ sơ nghiệp vụ hiện tại;
- làm nền cho Sprint 02.

### 10.3. `GET /me/roles`
#### Mục đích
Lấy danh sách vai trò của user hiện tại.

#### Yêu cầu
- cần access token hợp lệ.

#### Kết quả mong đợi
- trả về mảng role;
- hỗ trợ route guard và điều hướng sau đăng nhập.

### 10.4. `GET /admin/roles`
#### Mục đích
Lấy danh mục role hệ thống.

#### Yêu cầu
- chỉ role quản trị được truy cập.

#### Kết quả mong đợi
- trả về danh sách role seed chuẩn;
- làm nền cho quản lý phân quyền sau này.

### 10.5. `GET /admin/activity-logs`
#### Mục đích
Lấy nhật ký thao tác quản trị.

#### Yêu cầu
- chỉ role phù hợp mới được truy cập.

#### Kết quả mong đợi
- trả về danh sách log;
- hỗ trợ kiểm tra audit flow và Admin Area.

### 10.6. Yêu cầu kỹ thuật chung cho API
Tất cả API trong Sprint 01 cần thống nhất:
- response envelope chung;
- error format chung;
- HTTP status code rõ ràng;
- xử lý unauthorized/forbidden thống nhất;
- log request/error tối thiểu;
- có thể test bằng Postman hoặc Swagger.

---

### 11. Công việc frontend

### 11.1. Khởi tạo dự án
- Tạo project ReactJS + TypeScript.
- Thiết lập cấu trúc thư mục chuẩn.
- Cấu hình biến môi trường.
- Thiết lập router tổng thể.

### 11.2. Tổ chức source theo area
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

### 11.3. Dựng App Layout tổng thể
- layout root;
- route tree theo area;
- area shell dùng lại được;
- page container chuẩn.

### 11.4. Xây dựng bộ component dùng chung
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

### 11.5. Chuẩn hóa quy ước giao diện
Cần chốt:
- màu chủ đạo;
- font và cỡ chữ;
- heading system;
- khoảng cách;
- style form;
- style bảng danh sách;
- style thông báo lỗi/thành công.

### 11.6. Guard và state nền
- chuẩn bị auth context/store;
- route guard theo đăng nhập;
- role guard theo area;
- cơ chế redirect khi không đủ quyền.

### 11.7. Nối API hạ tầng
Frontend cần test được:
- `/health`
- `/me`
- `/me/roles`
- `/admin/roles`
- `/admin/activity-logs`

Ở sprint này có thể dùng dữ liệu thật hoặc mock bán phần, nhưng phải chốt sẵn interface dữ liệu.

### 11.8. Kết quả mong đợi phía frontend
- có thể chạy app;
- điều hướng được giữa các area;
- có layout dùng lại được;
- có component nền dùng cho các sprint sau;
- sẵn sàng nối nghiệp vụ thật từ Sprint 02.

---

### 12. Công việc backend

### 12.1. Khởi tạo dự án NestJS
- tạo project NestJS + TypeScript;
- cấu hình env;
- cấu hình CORS;
- cấu hình module gốc;
- tách module dùng chung.

### 12.2. Chuẩn hóa cấu trúc backend
Cần có nền cho:
- `controller`
- `service`
- `guard`
- `interceptor`
- `filter`
- `dto`
- `common response`
- `logger`

### 12.3. Auth và role guard
- chuẩn bị `AuthGuard` đọc token từ Supabase;
- chuẩn bị `RoleGuard` kiểm tra quyền từ `user_roles`;
- chuẩn bị decorator hoặc metadata cho role.

### 12.4. Chuẩn hóa response và xử lý lỗi
Cần thống nhất:
- format thành công;
- format lỗi;
- business error;
- validation error;
- unauthorized/forbidden error;
- not found error.

### 12.5. Logging và audit
- log request cơ bản;
- log error cơ bản;
- chuẩn bị audit service để ghi `admin_activity_logs` trong các sprint sau;
- chốt convention cho `module_name`, `entity_type`, `action_type`.

### 12.6. Module nền cần có trong Sprint 01
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

### 12.7. API hạ tầng
Triển khai và test:
- `GET /health`
- `GET /me`
- `GET /me/roles`
- `GET /admin/roles`
- `GET /admin/activity-logs`

### 12.8. Tài liệu kỹ thuật backend cần chốt
- quy ước đặt tên controller/service;
- quy ước version API;
- quy ước response;
- quy ước guard;
- quy ước logging;
- quy ước viết DTO.

### 12.9. Kết quả mong đợi phía backend
- service chạy ổn định;
- kết nối được Supabase/PostgreSQL;
- xác định được user hiện tại;
- xác định được role hiện tại;
- có khung admin audit cơ bản;
- không phải refactor lớn khi vào Sprint 02.

---

### 13. Công việc database

### 13.1. Import schema 38 bảng
- import schema chính thức;
- không giản lược lại thành schema nhỏ;
- giữ cấu trúc tương thích hoàn toàn với tài liệu thiết kế dữ liệu.

### 13.2. Cấu hình Supabase/PostgreSQL
- tạo project database;
- cấu hình extension cần thiết;
- kiểm tra kết nối từ backend;
- kiểm tra quyền truy cập môi trường dev.

### 13.3. Seed role bắt buộc
Phải seed đủ:
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

### 13.4. Tạo dữ liệu nền người dùng
Nên tạo:
- 01 user thường
- 01 guide
- 01 system admin
- 01 moderator
- 01 support staff

### 13.5. Chuẩn hóa ràng buộc dữ liệu nền
Cần kiểm tra:
- unique email;
- unique phone nếu có;
- miền giá trị `status` của `users`;
- toàn vẹn khóa ngoại giữa `users`, `roles`, `user_roles`;
- log tables tham chiếu đúng `public.users` và `public.roles`.

### 13.6. Baseline migration
- tạo migration baseline đầu tiên;
- xác định nguyên tắc viết migration về sau;
- tách seed với migration nếu cần;
- ghi rõ thứ tự chạy script.

### 13.7. Chuẩn bị định hướng RLS/policy
Trong Sprint 01 chưa cần viết toàn bộ policy phức tạp, nhưng cần chốt nguyên tắc:
- bảng nào cần bảo vệ theo user hiện tại;
- bảng nào chỉ admin đọc;
- bảng nào công khai;
- tầng nào chịu trách nhiệm kiểm soát chính: database hay backend.

### 13.8. Kết quả mong đợi phía database
- schema chạy được;
- seed chạy được;
- dữ liệu nền dùng được cho frontend/backend test;
- sẵn sàng cho Auth + Profile + Role ở Sprint 02.

---

### 14. Tài liệu/UML

Sprint 01 phải chốt bộ tài liệu nền để toàn bộ roadmap đi thống nhất.

### 14.1. Tài liệu cần hoàn thiện
- Use Case tổng quát của toàn hệ thống
- Danh mục 29 chức năng
- Danh mục 47 màn hình
- Mô tả 4 area
- Nguyên tắc phân quyền theo vai trò
- Cấu trúc module triển khai
- Nguyên tắc phối hợp frontend – backend – database

### 14.2. UML cần chốt trong Sprint 01
#### Bắt buộc
- Use Case Diagram tổng quát

#### Nên chốt ở mức nền
- sơ đồ phân chia module hoặc sơ đồ kiến trúc triển khai
- sơ đồ điều hướng area ở mức khái quát

> Chưa cần dồn toàn bộ Activity Diagram và Sequence Diagram nghiệp vụ vào Sprint 01, vì phần đó sẽ đi sâu ở các sprint chức năng như Sprint 02, Sprint 05, Sprint 06, Sprint 07, Sprint 08.

### 14.3. Mục tiêu của phần tài liệu/UML
- để báo cáo và code đi cùng nhau;
- tránh tình trạng tài liệu nói một kiểu, code làm một kiểu;
- giảm rủi ro thiếu logic khi bảo vệ đồ án.

---

### 15. Đầu ra

Kết thúc Sprint 01, hệ thống cần đạt được các đầu ra sau:

#### 15.1. Đầu ra kỹ thuật
- Source code frontend đã được khởi tạo hoàn chỉnh.
- Source code backend đã được khởi tạo hoàn chỉnh.
- Kết nối được backend với Supabase/PostgreSQL.
- Database đã dựng xong theo schema 38 bảng.
- Seed role và dữ liệu nền đã chạy thành công.
- API hạ tầng đã chạy được.

#### 15.2. Đầu ra giao diện
- Layout tổng thể 4 khu vực hoạt động ổn định:
  - Public Area
  - User Area
  - Guide Area
  - Admin Area
- Có bộ component dùng chung sẵn sàng tái sử dụng.
- Có page shell đủ để nối nghiệp vụ ở Sprint 02.

#### 15.3. Đầu ra dữ liệu và phân quyền
- Có bảng users, roles, user_roles hoạt động đúng.
- Có dữ liệu role chuẩn.
- Có dữ liệu tài khoản demo.
- Có cơ chế lấy user hiện tại và role hiện tại.

#### 15.4. Đầu ra tài liệu
- Use Case tổng quát được chốt.
- Danh mục 29 chức năng được chốt.
- Danh mục 47 màn hình được chốt.
- Cấu trúc module triển khai được chốt.
- Nguyên tắc phối hợp giữa frontend, backend và database được chốt.

#### 15.5. Tiêu chí sẵn sàng sang Sprint 02
Sprint 01 chỉ được coi là thành công khi dự án đã sẵn sàng bước sang Sprint 02 mà **không cần quay lại sửa kiến trúc nền**, cụ thể:
- đã có khung auth;
- đã có khung profile;
- đã có khung role;
- đã có layout area;
- đã có schema chuẩn;
- đã có seed dữ liệu;
- đã có rule triển khai thống nhất cho toàn bộ dự án.

---

### 16. Kết luận sprint

Sprint 01 là sprint nền tảng có giá trị quyết định đối với toàn bộ đồ án. Thành công của sprint này không được đo bằng số lượng chức năng nghiệp vụ hoàn thành, mà được đo bằng mức độ **ổn định, đồng bộ và sẵn sàng mở rộng** của hệ thống. Nếu sprint này được làm chắc, các sprint sau như Auth, Guide Profile, Tour, Tour Request, Companion Post và Admin sẽ triển khai nhanh hơn, ít sửa hơn và nhất quán hơn giữa báo cáo, UML, cơ sở dữ liệu và mã nguồn.

---

<a id="sprint-02"></a>
## SPRINT 02 – Triển khai tài khoản, hồ sơ cá nhân và phân quyền người dùng

### 1. Mục tiêu sprint

Sprint 02 là sprint bắt đầu hiện thực **nghiệp vụ lõi đầu tiên** của hệ thống sau khi Sprint 01 đã dựng xong nền tảng kỹ thuật. Trọng tâm của sprint này là giúp hệ thống có thể:
- tạo tài khoản mới;
- đăng nhập và đăng xuất;
- lấy thông tin người dùng hiện tại;
- cập nhật hồ sơ cá nhân;
- đổi mật khẩu;
- điều hướng người dùng đúng khu vực theo vai trò.

Đây là sprint có tính chất **bắt buộc** vì gần như toàn bộ các sprint phía sau như Guide Profile, Tour, Tour Request, Companion Post, Report và Admin đều phụ thuộc trực tiếp vào lớp xác thực, hồ sơ người dùng và cơ chế phân quyền.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F01:** Đăng ký, đăng nhập, đăng xuất
  - **F02:** Quản lý hồ sơ cá nhân
  - **F03:** Phân quyền người dùng
- Làm cho luồng xác thực hoạt động xuyên suốt giữa:
  - Supabase Auth
  - `public.users`
  - `roles`
  - `user_roles`
- Thiết lập được cơ chế điều hướng sau đăng nhập theo từng vai trò:
  - User
  - Guide
  - Admin
- Chuẩn hóa dữ liệu hồ sơ cá nhân để các sprint sau có thể dùng lại.
- Dựng xong các màn hình xác thực và quản lý hồ sơ ở mức dùng thật, không chỉ là demo giao diện.
- Chốt cơ chế route guard, role guard và menu theo quyền.
- Chuẩn bị sẵn dữ liệu demo cho từng nhóm tài khoản để test flow nghiệp vụ.

#### Ý nghĩa của sprint này
Nếu Sprint 02 làm chắc, các sprint sau sẽ có lợi thế rất lớn:
- frontend không phải sửa lại flow đăng nhập;
- backend không phải viết lại cơ chế đọc user hiện tại;
- database không bị lệch giữa `auth.users` và `public.users`;
- UML và báo cáo bám đúng flow thật;
- việc phân vai demo User / Guide / Admin trở nên rõ ràng và thuyết phục hơn.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Không chỉ “đăng nhập được” là đủ
Sai lầm phổ biến của sprint auth là chỉ dừng ở mức:
- đăng ký xong;
- đăng nhập được;
- hiển thị token hoặc session.

Với đồ án này, Sprint 02 phải đi xa hơn:
- xác định rõ đăng nhập xong user đi đâu;
- guide đi đâu;
- admin đi đâu;
- menu nào hiển thị cho vai trò nào;
- màn hình nào cần chặn nếu không đủ quyền.

### 2.2. Phải thống nhất giữa Auth và hồ sơ nghiệp vụ
Cần giữ nguyên nguyên tắc đã chốt ở Sprint 01:
- `auth.users` là nơi Supabase quản lý xác thực;
- `public.users` là nơi lưu hồ sơ nghiệp vụ;
- `roles` là danh mục vai trò;
- `user_roles` là bảng gán vai trò thật.

Không nên:
- lưu toàn bộ hồ sơ vào metadata token rồi dùng tạm;
- hardcode role ở frontend;
- bỏ qua `public.users` để đi nhanh;
- để frontend tự suy ra quyền mà không hỏi backend.

### 2.3. Điều hướng theo vai trò phải được chốt ngay
Sprint này cần chốt sớm quy tắc điều hướng sau đăng nhập. Phương án triển khai thực tế nên là:
- tài khoản chỉ có `USER` → vào **User Area**;
- có `GUIDE` → được phép vào **Guide Area**;
- có một trong các role quản trị như `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF` → vào **Admin Area**;
- nếu một tài khoản có nhiều role, ưu tiên điều hướng theo role có khu vực làm việc cao hơn hoặc cho phép chọn area sau đăng nhập.

Trong phạm vi đồ án, để đơn giản hóa demo, có thể chốt thứ tự ưu tiên:
1. Admin
2. Guide
3. User

### 2.4. Dữ liệu hồ sơ cá nhân phải “dùng được thật”
Sprint này không nên chỉ tạo form cho có. Hồ sơ cá nhân phải cho phép xem và cập nhật tối thiểu các trường:
- họ tên;
- số điện thoại;
- ảnh đại diện;
- ngày sinh;
- giới tính.

Các trường này phải bám theo bảng `users` để tránh lệch báo cáo và code.

### 2.5. Đổi mật khẩu phải đi kèm kiểm tra dữ liệu
Màn hình đổi mật khẩu phải có tối thiểu:
- mật khẩu hiện tại;
- mật khẩu mới;
- xác nhận mật khẩu mới;
- kiểm tra hợp lệ;
- thông báo lỗi rõ ràng.

Không nên làm sơ sài kiểu chỉ nhập một trường mật khẩu mới, vì điều đó vừa kém thực tế vừa khó bảo vệ khi trình bày luồng bảo mật cơ bản.

### 2.6. Sprint 02 phải có định nghĩa “xong sprint” rõ ràng
Sprint này chỉ được coi là hoàn thành khi có đủ:
- màn hình đăng ký, đăng nhập, hồ sơ cá nhân, đổi mật khẩu;
- API auth và profile hoạt động;
- dữ liệu `public.users` được tạo/đồng bộ đúng;
- role được trả về đúng để frontend điều hướng;
- có tài khoản demo cho User, Guide, Admin;
- có test flow tối thiểu;
- có cập nhật Activity Diagram tương ứng.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Luồng đăng ký tài khoản
Cần chốt:
- đăng ký bằng email + password;
- có xác nhận mật khẩu;
- có họ tên cơ bản;
- sau khi đăng ký thì tạo `public.users` khi nào;
- role mặc định có phải là `USER` hay không.

### 3.2. Luồng đăng nhập và đăng xuất
Cần xác định:
- đăng nhập bằng email/password;
- xử lý lỗi khi sai tài khoản hoặc mật khẩu;
- xử lý khi tài khoản đang `suspended` hoặc `locked`;
- đăng xuất sẽ hủy session ở mức nào;
- sau logout chuyển về đâu.

### 3.3. Route guard và role-based menu
Cần chốt:
- route nào yêu cầu đăng nhập;
- route nào chỉ dành cho Guide;
- route nào chỉ dành cho Admin;
- menu nào xuất hiện theo vai trò;
- khi không đủ quyền thì hiện thông báo gì.

### 3.4. Quy tắc dữ liệu của bảng `users`
Cần thống nhất:
- email có được xem là định danh chính hay không;
- phone có unique hay chưa;
- avatar lưu URL hay upload file ngay trong sprint này;
- trạng thái tài khoản gồm những giá trị nào;
- trường nào được phép sửa, trường nào không.

### 3.5. Cơ chế cập nhật hồ sơ cá nhân
Cần chốt:
- người dùng chỉ sửa dữ liệu của chính mình;
- không cho phép sửa role;
- không cho phép sửa trạng thái tài khoản;
- kiểm tra hợp lệ cho ngày sinh, giới tính, số điện thoại.

### 3.6. Cơ chế đổi mật khẩu
Cần xác định:
- dùng khả năng đổi mật khẩu qua Supabase Auth;
- có yêu cầu nhập mật khẩu hiện tại hay không;
- có chính sách độ dài tối thiểu hay không;
- có buộc đăng nhập lại sau khi đổi mật khẩu hay không.

---

### 4. Hạng mục cần chốt

Trong Sprint 02, các hạng mục sau phải được chốt dứt điểm trước khi đi sâu vào code:

- Luồng đăng ký tài khoản và tạo hồ sơ nghiệp vụ.
- Luồng đăng nhập, đăng xuất và lấy user hiện tại.
- Điều hướng sau đăng nhập theo từng vai trò.
- Cấu trúc màn hình xác thực và hồ sơ người dùng.
- Quy tắc dữ liệu của bảng `users`.
- Quy tắc phân quyền theo `roles` và `user_roles`.
- Phạm vi quyền của từng loại tài khoản trong giai đoạn đầu.
- Chuẩn response cho các API auth/profile.
- Dữ liệu mẫu để test User / Guide / Admin.
- Activity Diagram cho nhóm chức năng tài khoản và người dùng.

---

### 5. Phương án được chọn

### 5.1. Mô hình xác thực
- Dùng **Supabase Auth** để xử lý:
  - đăng ký;
  - đăng nhập;
  - đăng xuất;
  - quản lý thông tin xác thực;
  - đổi mật khẩu.
- Không tự xây hệ thống password hash riêng trong `public.users`.

### 5.2. Mô hình dữ liệu người dùng
- `auth.users` quản lý danh tính xác thực.
- `public.users` lưu hồ sơ nghiệp vụ mở rộng.
- `public.users.id` tham chiếu 1–1 tới `auth.users.id`.
- Khi đăng ký thành công, hệ thống phải tạo bản ghi trong `public.users`.
- Role mặc định sau đăng ký là `USER`.

### 5.3. Mô hình phân quyền
- Dùng bảng `roles` để lưu danh mục role:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- Dùng `user_roles` để gán nhiều vai trò cho một user nếu cần.
- Backend kiểm tra quyền bằng guard.
- Frontend dùng dữ liệu role từ API để:
  - điều hướng area;
  - hiển thị menu;
  - chặn route không phù hợp.

### 5.4. Điều hướng sau đăng nhập
Đề xuất chốt để nhất quán toàn bộ roadmap:
- Có role quản trị → chuyển vào dashboard/admin area.
- Nếu không có role quản trị nhưng có `GUIDE` → chuyển vào guide area.
- Nếu chỉ có `USER` → chuyển vào user area.
- Với tài khoản đa vai trò, có thể ưu tiên tự động theo thứ tự trên trong giai đoạn đầu để giảm độ phức tạp.

### 5.5. Mô hình hồ sơ cá nhân
Các trường cho phép hiển thị/cập nhật trong Sprint 02:
- `full_name`
- `phone`
- `avatar_url`
- `date_of_birth`
- `gender`

Các trường không cho người dùng tự sửa trực tiếp ở sprint này:
- `id`
- `email` (nếu muốn đổi email có thể để sau)
- `status`
- `role`

### 5.6. Mô hình trạng thái tài khoản
Theo schema đã chốt, `users.status` gồm:
- `active`
- `suspended`
- `locked`

Trong Sprint 02:
- `active`: đăng nhập bình thường;
- `suspended`: có thể chặn các thao tác hoặc chặn truy cập tùy rule triển khai;
- `locked`: không cho đăng nhập.

Để đơn giản trong giai đoạn này, nên áp dụng:
- `active` → cho phép đăng nhập;
- `suspended` và `locked` → từ chối đăng nhập và trả thông báo rõ ràng.

### 5.7. Mô hình đổi mật khẩu
- Dùng API/service của Supabase Auth để đổi mật khẩu.
- Form bắt buộc có:
  - mật khẩu hiện tại;
  - mật khẩu mới;
  - xác nhận mật khẩu mới.
- Kiểm tra:
  - mật khẩu mới khác mật khẩu cũ;
  - xác nhận trùng khớp;
  - độ dài tối thiểu hợp lý.

---

### 6. Ghi chú triển khai

- Sprint 02 là sprint nền nghiệp vụ, nên phải ưu tiên **độ chắc luồng** hơn là làm nhiều màn hình phụ.
- Chỉ nên làm đủ sâu cho:
  - đăng ký;
  - đăng nhập;
  - đăng xuất;
  - hồ sơ cá nhân;
  - đổi mật khẩu;
  - điều hướng theo vai trò.
- Không mở rộng sớm sang:
  - quên mật khẩu nâng cao;
  - xác thực hai lớp;
  - chỉnh email;
  - upload ảnh phức tạp;
  - quản lý role ở admin sâu.
- Các API và giao diện ở sprint này phải được viết theo hướng tái sử dụng, vì gần như mọi sprint tiếp theo đều gọi lại `/me` hoặc phụ thuộc vào role hiện tại.
- Khi test sprint này, bắt buộc phải có ít nhất 3 nhóm tài khoản demo:
  - tài khoản User;
  - tài khoản Guide;
  - tài khoản Admin.

---

### 7. Chức năng trọng tâm

Sprint 02 tập trung hiện thực 3 chức năng lõi sau:

- **F01 – Đăng ký, đăng nhập, đăng xuất**
  - tạo tài khoản mới;
  - xác thực tài khoản;
  - hủy phiên làm việc.

- **F02 – Quản lý hồ sơ cá nhân**
  - xem thông tin cá nhân hiện tại;
  - cập nhật hồ sơ;
  - đổi mật khẩu.

- **F03 – Phân quyền người dùng**
  - xác định user đang có role nào;
  - dùng role để điều hướng và kiểm soát truy cập;
  - chuẩn bị nền cho Guide Area và Admin Area ở các sprint sau.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Các màn hình trong Sprint 02 phải thể hiện được:
- người dùng có thể bắt đầu sử dụng hệ thống;
- hệ thống nhận diện đúng người dùng;
- hệ thống điều hướng đúng khu vực;
- người dùng có thể quản lý hồ sơ cơ bản của mình.

### 8.2. Các màn hình cần triển khai trong Sprint 02

#### M02 – Đăng ký tài khoản
Thành phần chính:
- email;
- mật khẩu;
- xác nhận mật khẩu;
- họ tên cơ bản;
- nút đăng ký;
- thông báo lỗi hợp lệ;
- liên kết sang đăng nhập.

Yêu cầu:
- kiểm tra trùng khớp mật khẩu;
- kiểm tra định dạng email;
- xử lý lỗi khi email đã tồn tại;
- sau đăng ký thành công, tạo được hồ sơ nghiệp vụ và role mặc định.

#### M03 – Đăng nhập
Thành phần chính:
- email;
- mật khẩu;
- nút đăng nhập;
- thông báo lỗi;
- liên kết đăng ký;
- thông báo trạng thái tài khoản nếu bị chặn.

Yêu cầu:
- đăng nhập thành công phải lấy được user hiện tại;
- lấy được role hiện tại;
- điều hướng đúng area theo vai trò.

#### M15 – Hồ sơ cá nhân
Thành phần chính:
- ảnh đại diện;
- họ tên;
- số điện thoại;
- ngày sinh;
- giới tính;
- email ở chế độ xem;
- nút cập nhật hồ sơ.

Yêu cầu:
- chỉ sửa dữ liệu của chính mình;
- dữ liệu hiển thị đúng từ `public.users`;
- có validate hợp lệ trước khi gửi.

#### M16 – Đổi mật khẩu
Thành phần chính:
- mật khẩu hiện tại;
- mật khẩu mới;
- xác nhận mật khẩu mới;
- nút lưu thay đổi;
- thông báo thành công/thất bại.

Yêu cầu:
- kiểm tra xác nhận;
- xử lý lỗi hợp lệ;
- có phản hồi rõ ràng sau khi đổi.

### 8.3. Thành phần UI dùng chung cần tận dụng
Sprint này nên tái sử dụng bộ component từ Sprint 01:
- input;
- password input;
- button;
- alert/message;
- form validation state;
- loading state;
- protected layout;
- unauthorized state.

### 8.4. Kết quả mong đợi của phần màn hình
- Người dùng có thể tự đăng ký tài khoản.
- Có thể đăng nhập bằng tài khoản vừa tạo.
- Có thể xem hồ sơ cá nhân ngay sau khi đăng nhập.
- Có thể cập nhật hồ sơ mà không lỗi luồng.
- Có thể đổi mật khẩu thành công.
- Khi đăng nhập bằng các role khác nhau, giao diện điều hướng đúng khu vực.

---

### 9. Bảng CSDL chính

Sprint 02 tập trung vào 3 bảng lõi:

### 9.1. `users`
#### Vai trò
Lưu hồ sơ nghiệp vụ mở rộng của người dùng.

#### Trường quan trọng
- `id`
- `email`
- `full_name`
- `phone`
- `avatar_url`
- `date_of_birth`
- `gender`
- `status`
- `created_at`
- `updated_at`
- `last_seen_at`

#### Ràng buộc quan trọng
- `id` tham chiếu `auth.users(id)`;
- `gender` thuộc một trong các giá trị `male`, `female`, `other` hoặc `null`;
- `status` thuộc một trong các giá trị `active`, `suspended`, `locked`;
- `date_of_birth` không được lớn hơn ngày hiện tại.

#### Vai trò trong Sprint 02
- hiển thị hồ sơ;
- cập nhật hồ sơ;
- kiểm tra trạng thái tài khoản;
- làm dữ liệu nền cho điều hướng sau đăng nhập.

### 9.2. `roles`
#### Vai trò
Lưu danh mục vai trò chính thức của hệ thống.

#### Giá trị chính
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

#### Vai trò trong Sprint 02
- xác định quyền truy cập theo nhóm người dùng;
- làm cơ sở cho role-based menu và route guard.

### 9.3. `user_roles`
#### Vai trò
Liên kết giữa user và role.

#### Trường quan trọng
- `user_id`
- `role_code`
- `assigned_by`
- `assigned_at`

#### Vai trò trong Sprint 02
- trả về danh sách role hiện tại của người dùng;
- dùng để xác định điều hướng area;
- chuẩn bị cho các sprint guide/admin sau này.

### 9.4. Ghi chú triển khai dữ liệu
Trong Sprint 02, dù chỉ dùng 3 bảng chính để hiện thực nghiệp vụ, hệ thống vẫn phải bám theo schema 38 bảng đã chốt từ Sprint 01. Không nên tách một schema auth/profile riêng khác để đi nhanh, vì sẽ gây lệch so với tài liệu tổng thể.

---

### 10. API cần thiết

### 10.1. `POST /auth/register`
#### Mục đích
Tạo tài khoản mới và khởi tạo hồ sơ nghiệp vụ.

#### Request gợi ý
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123",
  "fullName": "Nguyen Van A"
}
```

#### Kết quả mong đợi
- tạo tài khoản trong Supabase Auth;
- tạo bản ghi ở `public.users`;
- gán role mặc định `USER`;
- trả về thông báo thành công hoặc lỗi hợp lệ.

### 10.2. `POST /auth/login`
#### Mục đích
Xác thực người dùng và khởi tạo session.

#### Request gợi ý
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

#### Kết quả mong đợi
- xác thực thành công;
- đọc được hồ sơ hiện tại;
- đọc được danh sách role hiện tại;
- trả về dữ liệu đủ để frontend điều hướng area.

### 10.3. `POST /auth/logout`
#### Mục đích
Kết thúc phiên làm việc hiện tại.

#### Kết quả mong đợi
- xóa session/token ở phía client theo cách triển khai;
- điều hướng người dùng về public area hoặc trang đăng nhập.

### 10.4. `GET /me`
#### Mục đích
Lấy hồ sơ nghiệp vụ của người dùng đang đăng nhập.

#### Yêu cầu
- cần access token hợp lệ.

#### Kết quả mong đợi
- trả về thông tin từ `public.users`;
- làm dữ liệu gốc cho trang hồ sơ cá nhân.

### 10.5. `PATCH /me`
#### Mục đích
Cập nhật hồ sơ cá nhân của người dùng hiện tại.

#### Request gợi ý
```json
{
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dateOfBirth": "2002-01-15",
  "gender": "male"
}
```

#### Kết quả mong đợi
- chỉ cập nhật các trường được phép;
- kiểm tra dữ liệu hợp lệ;
- trả về hồ sơ sau cập nhật.

### 10.6. `PATCH /me/password`
#### Mục đích
Đổi mật khẩu của tài khoản hiện tại.

#### Request gợi ý
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

#### Kết quả mong đợi
- đổi mật khẩu thành công qua Supabase Auth;
- trả về thông báo rõ ràng;
- xử lý lỗi nếu xác nhận không khớp hoặc mật khẩu không hợp lệ.

### 10.7. `GET /me/roles`
#### Mục đích
Lấy danh sách vai trò của user hiện tại.

#### Kết quả mong đợi
- trả về mảng role;
- hỗ trợ role-based menu;
- hỗ trợ redirect sau đăng nhập;
- làm nền cho guard ở frontend.

### 10.8. Yêu cầu kỹ thuật chung cho API
Tất cả API trong Sprint 02 phải thống nhất:
- response envelope chung;
- validation rõ ràng;
- thông báo lỗi dễ hiểu;
- xử lý `401 Unauthorized` và `403 Forbidden` thống nhất;
- log lỗi tối thiểu;
- có thể test bằng Swagger/Postman.

---

### 11. Công việc frontend

### 11.1. Xây dựng flow xác thực hoàn chỉnh
- hiện thực form đăng ký;
- hiện thực form đăng nhập;
- xử lý loading và lỗi;
- lưu session theo cách thống nhất;
- xử lý logout.

### 11.2. Xây dựng auth state dùng chung
- tạo `AuthContext` hoặc store tương đương;
- lưu user hiện tại;
- lưu roles hiện tại;
- xử lý trạng thái đã đăng nhập/chưa đăng nhập;
- hỗ trợ gọi lại `/me` và `/me/roles`.

### 11.3. Dựng route guard
Cần có tối thiểu:
- guard cho route yêu cầu đăng nhập;
- guard cho Guide Area;
- guard cho Admin Area;
- redirect khi không đủ quyền.

### 11.4. Dựng role-based menu
- user chỉ thấy menu user phù hợp;
- guide thấy khu vực guide;
- admin thấy khu vực admin;
- không hiển thị menu sai quyền.

### 11.5. Hiện thực màn hình hồ sơ cá nhân
- gọi `GET /me` để lấy dữ liệu;
- bind dữ liệu vào form;
- gọi `PATCH /me` để cập nhật;
- hiển thị lỗi hợp lệ theo từng trường.

### 11.6. Hiện thực màn hình đổi mật khẩu
- form 3 trường mật khẩu;
- validate xác nhận;
- gọi `PATCH /me/password`;
- thông báo thành công hoặc lỗi rõ ràng.

### 11.7. Xử lý điều hướng sau đăng nhập
- sau login gọi `/me/roles`;
- xác định area đích;
- redirect đúng theo vai trò;
- lưu ý xử lý tài khoản nhiều role theo rule đã chốt.

### 11.8. Test flow phía frontend
Bắt buộc test các kịch bản:
- đăng ký thành công;
- đăng ký sai dữ liệu;
- đăng nhập đúng;
- đăng nhập sai mật khẩu;
- đăng nhập bằng tài khoản bị khóa;
- cập nhật hồ sơ thành công;
- đổi mật khẩu thành công;
- redirect đúng theo User / Guide / Admin.

### 11.9. Kết quả mong đợi phía frontend
- 4 màn hình chính hoạt động ổn định;
- auth state dùng chung hoạt động đúng;
- route guard hoạt động đúng;
- menu theo vai trò hoạt động đúng;
- sẵn sàng cho các sprint Tour và Guide Profile.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module auth/profile
Tối thiểu nên có:
- `AuthController`
- `AuthService`
- `MeController`
- `MeService`

Hoặc gộp theo module `auth-me` để đơn giản hóa cấu trúc giai đoạn đầu.

### 12.2. Xử lý đăng ký tài khoản
- gọi Supabase Auth để tạo tài khoản;
- tạo `public.users`;
- gán role mặc định `USER`;
- rollback hoặc xử lý lỗi nhất quán nếu một bước thất bại.

### 12.3. Xử lý đăng nhập
- xác thực với Supabase Auth;
- kiểm tra trạng thái tài khoản trong `public.users`;
- trả về thông tin cần thiết cho frontend;
- hỗ trợ đọc roles hiện tại sau đăng nhập.

### 12.4. Xử lý đăng xuất
- hủy session theo cơ chế đang dùng;
- đảm bảo frontend có thể xóa trạng thái local đúng cách.

### 12.5. Xử lý lấy/cập nhật hồ sơ người dùng
- `GET /me` đọc hồ sơ hiện tại;
- `PATCH /me` chỉ cho phép sửa đúng các trường cho phép;
- validate dữ liệu cập nhật;
- cập nhật `updated_at` hợp lý.

### 12.6. Xử lý đổi mật khẩu
- xác minh request hợp lệ;
- gọi cơ chế đổi mật khẩu của Supabase;
- chuẩn hóa response thành công/thất bại.

### 12.7. Xử lý đọc role người dùng
- truy vấn `user_roles` theo `user_id`;
- join với `roles` nếu cần;
- trả về dạng dữ liệu đủ cho frontend xác định area đích.

### 12.8. Guard và chuẩn quyền
- tái sử dụng `AuthGuard` từ Sprint 01;
- triển khai `RoleGuard` dùng được thật;
- chuẩn bị decorator role cho các sprint Guide/Admin sau này.

### 12.9. Logging và kiểm lỗi
- log đăng ký thất bại;
- log đăng nhập thất bại;
- log lỗi cập nhật hồ sơ;
- giữ format lỗi nhất quán để frontend dễ xử lý.

### 12.10. Kết quả mong đợi phía backend
- toàn bộ API auth/profile chạy được;
- guard dùng được thật;
- backend trả role chính xác;
- backend sẵn sàng làm nền cho guide, tour và admin.

---

### 13. Công việc database

### 13.1. Đồng bộ giữa `auth.users` và `public.users`
Đây là việc quan trọng nhất của Sprint 02. Cần bảo đảm:
- tài khoản auth tạo xong thì có hồ sơ nghiệp vụ tương ứng;
- không có tình trạng có `auth.users` nhưng thiếu `public.users`;
- `id` được đồng bộ 1–1.

### 13.2. Hoàn thiện dữ liệu role
- bảo đảm bảng `roles` đã có đủ dữ liệu seed:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- kiểm tra `user_roles` có thể gán vai trò chính xác.

### 13.3. Chuẩn hóa ràng buộc dữ liệu
Cần kiểm tra và chốt:
- `status` chỉ nhận `active`, `suspended`, `locked`;
- `gender` đúng miền giá trị;
- `date_of_birth` không vượt quá ngày hiện tại;
- unique cho email hoặc phone theo cách triển khai đã chọn.

### 13.4. Seed dữ liệu demo
Phải có dữ liệu mẫu tối thiểu:
- 1 tài khoản User;
- 1 tài khoản Guide;
- 1 tài khoản Admin.

Có thể seed thêm:
- 1 tài khoản bị `suspended`;
- 1 tài khoản bị `locked`;
để test luồng đăng nhập lỗi.

### 13.5. Chuẩn bị truy vấn phục vụ `/me` và `/me/roles`
- truy vấn hồ sơ hiện tại;
- truy vấn danh sách role theo user;
- tối ưu ở mức đủ dùng, chưa cần tối ưu sâu.

### 13.6. Kiểm thử dữ liệu
Bắt buộc test:
- tạo user mới có sinh đúng hồ sơ hay không;
- role mặc định có được gán đúng hay không;
- user cập nhật hồ sơ có lưu đúng hay không;
- tài khoản bị khóa có bị chặn đúng hay không.

### 13.7. Kết quả mong đợi phía database
- dữ liệu auth và profile đồng bộ đúng;
- role hoạt động đúng;
- dữ liệu demo sẵn sàng cho test UI/API;
- schema không cần chỉnh sửa lại khi bước sang Sprint 03.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- mô tả chi tiết chức năng F01, F02, F03;
- mô tả quyền truy cập theo vai trò;
- mô tả màn hình M02, M03, M15, M16;
- cập nhật bảng mapping chức năng – màn hình – API – CSDL nếu cần.

### 14.2. Activity Diagram cần cập nhật
Bắt buộc hoàn thiện:
- Activity Diagram đăng ký tài khoản;
- Activity Diagram đăng nhập;
- Activity Diagram đăng xuất;
- Activity Diagram cập nhật hồ sơ cá nhân;
- Activity Diagram đổi mật khẩu;
- Activity Diagram phân quyền người dùng.

### 14.3. Nội dung nên mô tả rõ trong UML
- actor tham gia;
- điều kiện tiền đề;
- luồng chính;
- luồng lỗi;
- hậu điều kiện;
- dữ liệu nào được tạo/cập nhật;
- role nào được truy cập luồng nào.

### 14.4. Mục tiêu của phần tài liệu/UML
Phần tài liệu của Sprint 02 phải giúp người đọc thấy rõ:
- hệ thống không chỉ có giao diện đăng nhập;
- dữ liệu xác thực và dữ liệu nghiệp vụ được liên kết đúng;
- phân quyền đã có nền thật chứ không phải mô tả lý thuyết;
- các sprint sau có thể tái sử dụng trực tiếp lớp auth/profile này.

---

### 15. Đầu ra

Kết thúc Sprint 02, hệ thống cần đạt được các đầu ra sau:

### 15.1. Đầu ra chức năng
- Có thể tạo tài khoản mới.
- Có thể đăng nhập, đăng xuất.
- Có thể xem hồ sơ cá nhân.
- Có thể cập nhật hồ sơ cá nhân.
- Có thể đổi mật khẩu.
- Có thể điều hướng theo vai trò người dùng.

### 15.2. Đầu ra giao diện
- M02 Đăng ký tài khoản hoạt động.
- M03 Đăng nhập hoạt động.
- M15 Hồ sơ cá nhân hoạt động.
- M16 Đổi mật khẩu hoạt động.
- Route guard và menu theo vai trò hoạt động.

### 15.3. Đầu ra API
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

Tất cả phải test được bằng UI và/hoặc Postman.

### 15.4. Đầu ra dữ liệu
- `public.users` được tạo đúng khi đăng ký;
- role mặc định `USER` được gán đúng;
- dữ liệu hồ sơ được cập nhật đúng;
- có dữ liệu demo User / Guide / Admin;
- trạng thái tài khoản hoạt động đúng theo rule đã chốt.

### 15.5. Đầu ra tài liệu
- Activity Diagram nhóm auth/profile được cập nhật;
- mô tả vai trò và quyền được cập nhật;
- phần báo cáo về xác thực và hồ sơ người dùng đủ để đưa vào chương phân tích thiết kế.

### 15.6. Tiêu chí sẵn sàng sang Sprint 03
Sprint 02 chỉ được xem là thành công khi:
- user đăng nhập xong lấy được hồ sơ và role;
- điều hướng area không lỗi;
- frontend và backend thống nhất về quyền;
- database không lệch giữa auth và hồ sơ nghiệp vụ;
- hệ thống sẵn sàng bước sang Sprint 03 về Public Tour mà không phải quay lại sửa lớp auth/profile.

---

### 16. Kết luận sprint

Sprint 02 là sprint biến nền tảng kỹ thuật từ Sprint 01 thành **năng lực sử dụng thật đầu tiên của hệ thống**. Giá trị lớn nhất của sprint này không chỉ nằm ở việc có màn hình đăng ký hay đăng nhập, mà nằm ở việc hệ thống đã:
- nhận diện được người dùng;
- lưu được hồ sơ nghiệp vụ;
- đọc được vai trò;
- điều hướng đúng khu vực;
- kiểm soát được truy cập ở mức nền.

Nếu Sprint 02 được làm chắc, các sprint tiếp theo như Guide Profile, Public Tour, Tour Request và Admin sẽ triển khai nhanh hơn rất nhiều vì toàn bộ lớp nhận diện người dùng và phân quyền đã sẵn sàng dùng lại.

---

<a id="sprint-03"></a>
## SPRINT 03 – Triển khai khu vực công khai cho tour du lịch

### 1. Mục tiêu sprint

Sprint 03 là sprint mở đầu cho **luồng public có giá trị demo cao nhất** của hệ thống: khách truy cập và người dùng có thể vào trang chủ, xem danh sách tour công khai, lọc tour theo nhu cầu và mở chi tiết tour để xem đầy đủ thông tin trước khi quyết định tham gia.

Đây là sprint rất quan trọng vì nó thể hiện rõ trục giá trị cốt lõi của đề tài: **khách du lịch kết nối với hướng dẫn viên địa phương thông qua tour**. Sau khi Sprint 01 đã dựng nền tảng kỹ thuật và Sprint 02 đã hoàn thiện lớp xác thực – hồ sơ – phân quyền, Sprint 03 phải tạo được một luồng public hoàn chỉnh, dễ demo, dễ giải thích và đủ chắc để các sprint sau như Guide Profile, Guide Tour Management và Tour Request bám vào.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F12:** Xem danh sách tour
  - **F13:** Tìm kiếm, lọc và sắp xếp tour
  - **F14:** Xem chi tiết tour
- Dựng xong **luồng public đầu tiên hoàn chỉnh** cho dự án.
- Chốt rõ điều kiện để một tour được xem là **tour công khai**.
- Xây dựng trang chủ public ở mức vừa đủ để điều hướng:
  - tour nổi bật;
  - hướng dẫn viên nổi bật;
  - bài đồng hành mới.
- Tạo được danh sách tour có:
  - filter tối thiểu;
  - sort tối thiểu;
  - phân trang;
  - dữ liệu hiển thị rõ ràng, đồng nhất với backend.
- Tạo được màn hình chi tiết tour hiển thị:
  - ảnh;
  - mô tả;
  - lịch trình tóm tắt;
  - thông tin hướng dẫn viên;
  - đánh giá.
- Chuẩn hóa dữ liệu, chỉ hiển thị các bản ghi ở trạng thái phù hợp để frontend và backend không bị lệch logic.
- Chuẩn bị nền cho Sprint 04, Sprint 05 và Sprint 06:
  - hồ sơ guide công khai;
  - tạo/quản lý tour;
  - gửi yêu cầu tham gia tour.

#### Ý nghĩa của sprint này
Sprint 03 là sprint đầu tiên giúp người xem đồ án **nhìn thấy giá trị của hệ thống ngay lập tức**. Nếu sprint này làm tốt:
- người dùng có thể hiểu hệ thống đang giải quyết vấn đề gì;
- demo trở nên trực quan hơn nhiều so với chỉ trình bày auth hoặc profile;
- backend bắt đầu có các truy vấn public thực tế;
- database bắt đầu phát huy đúng vai trò với dữ liệu tour, ảnh, guide và review;
- các sprint sau sẽ dễ nối tiếp hơn vì đã có luồng “xem tour trước – thao tác sau”.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Phải chốt thật rõ “tour công khai” là gì
Nếu không định nghĩa rõ từ đầu, frontend và backend sẽ rất dễ hiển thị lệch nhau. Sprint này bắt buộc phải thống nhất:
- tour nào được phép lên danh sách public;
- tour nào chỉ tồn tại ở backend nhưng không được hiển thị;
- đánh giá nào được xem là đánh giá công khai;
- guide profile ở trạng thái nào thì được gắn lên tour công khai.

### 2.2. Mục tiêu là làm tốt luồng xem tour, không làm bộ lọc quá nặng
Sprint này chỉ nên tập trung vào **luồng xem tour**. Không nên mở rộng quá sớm thành:
- bộ lọc quá nhiều tiêu chí;
- search quá phức tạp;
- map nâng cao;
- gợi ý AI;
- thao tác yêu thích, gửi request, báo cáo ở mức nghiệp vụ sâu.

Các nút liên quan như “Yêu thích”, “Gửi yêu cầu tham gia”, “Báo cáo” có thể xuất hiện trên UI chi tiết tour để giữ bố cục chuẩn, nhưng **nghiệp vụ sâu của các nút này không phải trọng tâm Sprint 03**.

### 2.3. Trang chủ chỉ dựng ở mức phục vụ điều hướng
Trang chủ public trong Sprint 03 không nên biến thành một màn hình quá nặng. Mục tiêu chính là:
- giới thiệu nền tảng;
- đưa người dùng đi vào danh sách tour;
- hiển thị vài khối nội dung nổi bật để demo.

Không cần làm quá nhiều widget phức tạp hoặc cá nhân hóa sớm.

### 2.4. Chỉ dùng dữ liệu “đủ để xem”
Ở giai đoạn này, dữ liệu dùng cho danh sách tour và chi tiết tour chỉ nên lấy những gì thật sự cần:
- tên tour;
- ảnh cover;
- địa điểm;
- thời gian;
- giá;
- guide cơ bản;
- rating trung bình;
- review công khai;
- lịch trình tóm tắt nếu có.

Không nên kéo quá sâu những phần sẽ thuộc sprint sau như:
- payment;
- request state machine;
- moderation phức tạp;
- recommendation;
- accommodation.

### 2.5. Sprint 03 vẫn phải có định nghĩa “xong sprint” rõ ràng
Sprint này chỉ được xem là hoàn thành khi có đủ:
- trang chủ public;
- danh sách tour chạy được;
- bộ lọc tối thiểu chạy được;
- chi tiết tour chạy được;
- API public tour hoạt động;
- dữ liệu seed đủ để test;
- tài liệu/UML cập nhật theo luồng public thật.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Điều kiện hiển thị public của tour
Cần xác định rõ một tour được phép hiển thị khi nào. Tối thiểu phải xem xét:
- `business_status`;
- `visibility_status`;
- `is_deleted`;
- trạng thái của guide profile liên quan;
- điều kiện hiển thị review.

Ở mức sprint này, tư duy đúng là **chỉ cho lên public những dữ liệu đã ở trạng thái an toàn để hiển thị**.

### 3.2. Quan hệ giữa trạng thái tour và trạng thái guide
Không chỉ tour có trạng thái, hồ sơ hướng dẫn viên cũng có trạng thái hiển thị riêng. Vì vậy cần chốt:
- nếu tour đã `published` nhưng guide profile đang `hidden` hoặc `flagged` thì xử lý thế nào;
- có bắt buộc guide phải `approved` mới xuất hiện cùng tour public hay không;
- nếu guide chưa được xác minh sâu thì hiển thị thông tin ở mức nào.

### 3.3. Bộ lọc tối thiểu của danh sách tour
Cần khóa sớm bộ lọc tối thiểu để tránh sa đà. Theo các tài liệu chốt, bộ lọc nên giữ ở mức:
- địa điểm;
- thời gian;
- giá;
- loại tour.

Có thể bổ sung sort theo:
- mới nhất;
- giá tăng dần;
- giá giảm dần;
- rating cao;
- gần ngày đi.

Nhưng không nên mở rộng thêm nhiều tiêu chí phụ ngay ở sprint này.

### 3.4. Dữ liệu hiển thị ở danh sách tour
Danh sách tour phải rõ các trường nào là bắt buộc hiển thị. Nếu không chốt trước, frontend dễ làm thừa và backend dễ join quá nặng. Bộ dữ liệu phù hợp gồm:
- ảnh đại diện;
- tên tour;
- địa điểm;
- thời gian;
- giá;
- rating trung bình;
- trạng thái hiển thị phù hợp;
- thông tin guide ở mức ngắn gọn.

### 3.5. Dữ liệu hiển thị ở chi tiết tour
Chi tiết tour cần hiển thị đủ để người dùng đưa ra quyết định, nhưng chưa cần ôm cả nghiệp vụ gửi request. Những phần nên có:
- bộ ảnh tour;
- mô tả chi tiết;
- thời gian;
- điểm hẹn;
- số lượng người tối đa;
- điều kiện tham gia;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

### 3.6. Dữ liệu nào được lấy ra trang chủ
Trang chủ public cần chốt rõ:
- tiêu chí tour nổi bật;
- tiêu chí guide nổi bật;
- bài đồng hành mới hiển thị ở mức teaser hay đầy đủ;
- số lượng bản ghi mỗi block;
- có phân trang hay chỉ lấy một nhóm nhỏ.

---

### 4. Hạng mục cần chốt

Các hạng mục phải khóa trước khi code sâu trong Sprint 03 gồm:
- nguồn dữ liệu công khai;
- điều kiện hiển thị tour;
- bộ lọc tối thiểu;
- dữ liệu danh sách tour;
- dữ liệu chi tiết tour;
- rule hiển thị review công khai;
- tiêu chí chọn dữ liệu nổi bật ở trang chủ;
- phạm vi của chi tiết tour trong Sprint 03;
- mức độ sử dụng `tour_locations` ở giai đoạn này;
- chuẩn response của API list và detail.

---

### 5. Phương án được chọn

### 5.1. Nguồn dữ liệu công khai
Chỉ lấy dữ liệu đang ở trạng thái phù hợp để công khai. Tinh thần chung là:
- tour phải ở trạng thái **có thể hiển thị public**;
- guide profile đi kèm phải ở trạng thái hiển thị phù hợp;
- review phải là review công khai;
- dữ liệu bị ẩn, bị gắn cờ hoặc đã xóa mềm không được hiển thị.

### 5.2. Điều kiện hiển thị tour
Phương án an toàn cho Sprint 03 là:
- chỉ hiển thị tour có `business_status = 'published'`;
- chỉ hiển thị tour có `visibility_status = 'visible'`;
- không lấy tour đã `is_deleted = true`;
- không lấy dữ liệu đi kèm từ guide profile đang bị ẩn hoặc không phù hợp với hiển thị public.

### 5.3. Điều kiện hiển thị guide profile trên tour
Ở mức hiển thị public, thông tin guide đi kèm tour nên chỉ xuất hiện khi guide profile:
- không bị xóa mềm;
- có `visibility_status = 'visible'`;
- có trạng thái nghề nghiệp đủ an toàn để đưa ra public.

Trong phạm vi sprint này, có thể ưu tiên hiển thị các guide profile đã ở trạng thái `approved` hoặc tối thiểu là trạng thái public phù hợp, để tránh làm rối logic khi demo.

### 5.4. Bộ lọc tối thiểu
Bộ lọc chính thức của Sprint 03 gồm:
- địa điểm;
- thời gian;
- giá;
- loại tour.

Đây là bộ lọc đủ mạnh để demo nhu cầu tìm kiếm thực tế nhưng vẫn vừa sức trong phạm vi đồ án.

### 5.5. Dữ liệu danh sách tour
Mỗi card tour ở danh sách nên hiển thị:
- ảnh cover;
- tiêu đề;
- tỉnh/thành;
- thời gian khởi hành;
- khoảng giá;
- rating trung bình;
- tên hướng dẫn viên hoặc thông tin guide ngắn;
- nhãn loại tour nếu cần.

Không hiển thị quá nhiều trường phụ khiến card nặng và truy vấn khó tối ưu.

### 5.6. Dữ liệu chi tiết tour
Chi tiết tour hiển thị:
- tiêu đề;
- bộ ảnh;
- mô tả;
- địa điểm;
- thời gian bắt đầu – kết thúc;
- điểm hẹn;
- số lượng người tối đa;
- điều kiện tham gia;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

Các hành động phát sinh như gửi yêu cầu tham gia, yêu thích và báo cáo chỉ cần giữ chỗ UI hoặc tích hợp ở mức nhẹ nếu đã có sẵn nền, chưa phải trọng tâm của sprint này.

### 5.7. Rule hiển thị review công khai
Chỉ lấy các review có `visibility_status = 'visible'`. Điểm rating trung bình nếu tính ở danh sách và chi tiết tour cũng phải dựa trên tập review công khai để frontend và backend thống nhất.

### 5.8. Phương án cho trang chủ public
Trang chủ chỉ lấy:
- một nhóm tour nổi bật;
- một nhóm hướng dẫn viên nổi bật;
- một nhóm bài đồng hành mới.

Mục tiêu là tạo điểm vào hệ thống và điều hướng người dùng sang danh sách tour, không biến trang chủ thành màn hình xử lý nghiệp vụ nặng.

### 5.9. Phương án với `tour_locations`
Mặc dù chi tiết tour có thể cần lịch trình, Sprint 03 chỉ nên dùng `tour_locations` ở mức:
- đọc dữ liệu tóm tắt nếu có;
- hiển thị thứ tự điểm dừng;
- chưa làm sâu bản đồ tương tác.

Phần bản đồ lộ trình nên để trọng tâm cho sprint hoàn thiện sau.

---

### 6. Ghi chú triển khai

- Ưu tiên triển khai lần lượt theo thứ tự: **M04 → M05 → M06 → M01** hoặc **M01 → M04 → M05 → M06** tùy cách chia việc, nhưng luồng public cuối cùng phải liền mạch.
- Danh sách tour và chi tiết tour phải dùng chung một rule public, không được mỗi API tự định nghĩa một kiểu.
- Bộ lọc ở Sprint 03 chỉ cần đúng và ổn định, chưa cần quá đẹp hoặc quá tối ưu UX.
- Chi tiết tour nên có khả năng mở từ card tour ở cả trang chủ và danh sách tour.
- Dữ liệu review nên có seed đủ để nhìn ra chênh lệch rating giữa các tour.
- Không nên đưa nghiệp vụ tour request vào quá sâu trong sprint này, vì Sprint 06 mới là nơi xử lý state machine của yêu cầu tham gia tour.
- Nên chuẩn bị ít nhất 8–12 tour mẫu thuộc nhiều tỉnh/thành và 3–5 danh mục tour để việc filter có ý nghĩa khi demo.

---

### 7. Chức năng trọng tâm

Các chức năng trọng tâm của Sprint 03 gồm:

- **F12 – Xem danh sách tour**
  - Cho phép khách truy cập và người dùng xem toàn bộ tour công khai trên hệ thống.
  - Đây là điểm vào quan trọng nhất của phần public.

- **F13 – Tìm kiếm, lọc và sắp xếp tour**
  - Cho phép người dùng tìm tour theo nhu cầu thực tế.
  - Là chức năng thể hiện giá trị sử dụng rõ nhất ở phía khách du lịch.

- **F14 – Xem chi tiết tour**
  - Cho phép xem đầy đủ thông tin của một tour.
  - Là nơi chuẩn bị điều kiện cho các nghiệp vụ phát sinh ở các sprint sau như gửi yêu cầu tham gia, yêu thích, báo cáo và đánh giá.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Nhóm màn hình của Sprint 03 phải tạo thành **một hành trình public hoàn chỉnh**:
- vào trang chủ;
- đi sang danh sách tour;
- lọc tour theo nhu cầu;
- mở chi tiết tour để xem sâu hơn.

### 8.2. Các màn hình cần triển khai trong Sprint 03

#### M01 – Trang chủ
**Vai trò trong sprint**
- Là màn hình public đầu vào của hệ thống.
- Dùng để giới thiệu nhanh giá trị nền tảng và điều hướng tới danh sách tour.

**Nội dung chính nên có**
- banner giới thiệu hệ thống;
- menu điều hướng;
- block tour nổi bật;
- block hướng dẫn viên nổi bật;
- block bài đồng hành mới;
- nút đi tới danh sách tour;
- chân trang thông tin cơ bản.

**Điểm cần lưu ý**
- Không làm quá nhiều block phụ.
- Nội dung nổi bật nên lấy từ API riêng của trang chủ.
- Tập trung vào khả năng điều hướng rõ ràng.

#### M04 – Danh sách tour
**Vai trò trong sprint**
- Là màn hình public quan trọng nhất để người dùng duyệt tour.

**Nội dung chính nên có**
- danh sách card tour;
- ảnh đại diện;
- tên tour;
- địa điểm;
- thời gian;
- giá;
- rating trung bình;
- phân trang.

**Điểm cần lưu ý**
- Card phải dễ đọc, không nhồi quá nhiều thông tin.
- Khi click card phải đi được tới chi tiết tour.
- Dữ liệu phải bám đúng rule public.

#### M05 – Tìm kiếm / lọc / sắp xếp tour
**Vai trò trong sprint**
- Là màn hình hoặc khu vực thao tác giúp người dùng thu hẹp danh sách tour theo nhu cầu.

**Nội dung chính nên có**
- ô tìm kiếm;
- bộ lọc địa điểm;
- bộ lọc thời gian;
- bộ lọc giá;
- bộ lọc loại tour;
- tùy chọn sắp xếp;
- danh sách kết quả.

**Điểm cần lưu ý**
- Có thể triển khai dưới dạng một trang riêng hoặc tích hợp với danh sách tour, nhưng trong tài liệu vẫn giữ như một màn hình riêng để thuận tiện mô tả.
- Chỉ giữ bộ lọc tối thiểu đã chốt.

#### M06 – Chi tiết tour
**Vai trò trong sprint**
- Là màn hình thể hiện đầy đủ giá trị của dữ liệu tour.
- Là nơi tạo niềm tin cho người dùng trước khi phát sinh các nghiệp vụ khác ở sprint sau.

**Nội dung chính nên có**
- tên tour;
- bộ ảnh;
- mô tả chi tiết;
- lịch trình tóm tắt;
- thời gian bắt đầu – kết thúc;
- điểm hẹn;
- giá;
- số lượng người tối đa;
- điều kiện tham gia;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

**Điểm cần lưu ý**
- Có thể để sẵn nút “Yêu thích”, “Gửi yêu cầu tham gia”, “Báo cáo”, nhưng không cần làm sâu toàn bộ nghiệp vụ trong sprint này.
- Nếu có lịch trình, hiển thị dạng danh sách tóm tắt; chưa cần làm bản đồ nâng cao.

### 8.3. Thành phần UI dùng chung cần tận dụng
Sprint 03 nên tận dụng lại các component đã dựng ở Sprint 01 và Sprint 02 như:
- app/public layout;
- header;
- page container;
- card;
- badge trạng thái;
- filter form;
- pagination;
- empty state;
- loading state;
- error state;
- review list block.

### 8.4. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 03, người dùng có thể:
- vào trang chủ và thấy nội dung chính của nền tảng;
- xem danh sách tour công khai;
- lọc tour theo tiêu chí cơ bản;
- mở chi tiết tour để xem thông tin đầy đủ.

---

### 9. Bảng CSDL chính

### 9.1. `tour_categories`

#### Vai trò
Lưu danh mục loại tour để hỗ trợ hiển thị và lọc.

#### Trường quan trọng
- `id`
- `name`
- `description`
- `is_active`

#### Vai trò trong Sprint 03
- cung cấp dữ liệu cho bộ lọc loại tour;
- hiển thị nhãn loại tour nếu cần;
- hỗ trợ chuẩn hóa dữ liệu đầu ra của danh sách tour.

### 9.2. `tours`

#### Vai trò
Là bảng dữ liệu trung tâm của Sprint 03, lưu thông tin cốt lõi của từng tour.

#### Trường quan trọng
- `id`
- `guide_profile_id`
- `category_id`
- `title`
- `province`
- `district`
- `start_date`
- `end_date`
- `price`
- `max_participants`
- `meet_point`
- `description`
- `participant_requirements`
- `business_status`
- `visibility_status`
- `published_at`
- `is_deleted`

#### Vai trò trong Sprint 03
- cấp dữ liệu cho trang chủ, danh sách tour và chi tiết tour;
- là nguồn chính để filter, sort và phân trang;
- là nơi áp dụng rule public chính thức.

### 9.3. `tour_images`

#### Vai trò
Lưu ảnh đại diện và bộ ảnh của tour.

#### Trường quan trọng
- `id`
- `tour_id`
- `image_url`
- `caption`
- `sort_order`
- `is_cover`

#### Vai trò trong Sprint 03
- lấy ảnh cover cho card tour;
- lấy gallery cho chi tiết tour;
- phục vụ trực quan hóa dữ liệu public.

### 9.4. `guide_profiles`

#### Vai trò
Lưu hồ sơ nghề nghiệp của hướng dẫn viên gắn với tour.

#### Trường quan trọng
- `id`
- `user_id`
- `bio`
- `years_of_experience`
- `working_area`
- `avatar_url`
- `verification_status`
- `visibility_status`
- `is_accepting_tours`
- `is_deleted`

#### Vai trò trong Sprint 03
- cung cấp thông tin hướng dẫn viên đi kèm tour;
- là một phần của rule kiểm soát dữ liệu public;
- chuẩn bị nền cho Sprint 04.

### 9.5. `tour_reviews`

#### Vai trò
Lưu đánh giá của người dùng cho tour.

#### Trường quan trọng
- `id`
- `tour_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

#### Vai trò trong Sprint 03
- hiển thị khu vực đánh giá công khai;
- tính điểm rating trung bình;
- tạo độ tin cậy cho danh sách và chi tiết tour.

### 9.6. Bảng hỗ trợ cần lưu ý thêm: `tour_locations`
Mặc dù không phải bảng trọng tâm chính thức của sprint theo khung kế hoạch, `tour_locations` vẫn có ý nghĩa hỗ trợ cho màn hình chi tiết tour vì:
- chi tiết tour có phần lịch trình tóm tắt;
- một số tour cần hiển thị thứ tự điểm đến;
- sprint sau có thể mở rộng sang bản đồ lộ trình.

Trong Sprint 03, bảng này chỉ nên dùng ở mức hỗ trợ đọc dữ liệu, chưa cần làm sâu UI bản đồ.

### 9.7. Ghi chú triển khai dữ liệu
- Dữ liệu public phải thống nhất ở mọi API.
- Cần tránh để list tour hiển thị một tập dữ liệu khác với detail tour.
- Rating trung bình nên tính dựa trên review công khai.
- Nên có đủ dữ liệu demo để mỗi filter đều cho ra kết quả có ý nghĩa.

---

### 10. API cần thiết

### 10.1. `GET /home/featured-tours`

#### Mục đích
Lấy danh sách tour nổi bật cho trang chủ.

#### Query gợi ý
- `limit`
- `sort`

#### Kết quả mong đợi
Trả về một danh sách tour ngắn gọn gồm:
- id;
- title;
- cover image;
- province;
- start date;
- price;
- rating trung bình.

### 10.2. `GET /home/featured-guides`

#### Mục đích
Lấy nhóm hướng dẫn viên nổi bật để hiển thị ở trang chủ.

#### Kết quả mong đợi
Trả về danh sách guide ở mức teaser:
- id;
- tên;
- avatar;
- khu vực hoạt động;
- kinh nghiệm;
- trạng thái xác minh phù hợp.

### 10.3. `GET /home/latest-companion-posts`

#### Mục đích
Lấy vài bài đồng hành mới để làm block điều hướng trên trang chủ.

#### Kết quả mong đợi
Trả về teaser ngắn:
- id;
- title;
- destination;
- start_date;
- estimated_cost.

### 10.4. `GET /tour-categories`

#### Mục đích
Lấy danh mục loại tour để đổ vào bộ lọc.

#### Kết quả mong đợi
Trả về danh sách category đang hoạt động.

### 10.5. `GET /tours`

#### Mục đích
Lấy danh sách tour công khai.

#### Query gợi ý
- `keyword`
- `province`
- `categoryId`
- `startDateFrom`
- `startDateTo`
- `minPrice`
- `maxPrice`
- `sortBy`
- `page`
- `limit`

#### Kết quả mong đợi
Trả về:
- danh sách tour theo rule public;
- tổng số bản ghi;
- thông tin phân trang;
- dữ liệu đủ dùng cho card danh sách.

### 10.6. `GET /tours/:id`

#### Mục đích
Lấy chi tiết một tour công khai.

#### Kết quả mong đợi
Trả về đầy đủ:
- thông tin chính của tour;
- ảnh tour;
- guide profile;
- lịch trình tóm tắt nếu có;
- rating trung bình;
- thông tin mô tả cần thiết.

### 10.7. `GET /tours/:id/reviews`

#### Mục đích
Lấy danh sách review công khai của tour.

#### Query gợi ý
- `page`
- `limit`

#### Kết quả mong đợi
Trả về:
- danh sách review công khai;
- rating;
- comment;
- thời gian tạo;
- thông tin người đánh giá ở mức phù hợp nếu có.

### 10.8. Yêu cầu kỹ thuật chung cho API
- Tất cả API public phải dùng chung một rule kiểm tra dữ liệu hiển thị.
- Response phải nhất quán giữa list và detail.
- API list phải hỗ trợ phân trang ngay từ đầu.
- API filter phải xử lý được giá trị rỗng và trường hợp không có kết quả.
- API detail phải trả lỗi rõ ràng nếu tour không tồn tại hoặc không thuộc phạm vi public.

---

### 11. Công việc frontend

### 11.1. Dựng trang chủ public
- Thiết kế bố cục banner;
- dựng block tour nổi bật;
- dựng block guide nổi bật;
- dựng block bài đồng hành mới;
- thêm điều hướng rõ sang danh sách tour.

### 11.2. Dựng danh sách tour
- Thiết kế card tour;
- hiển thị cover image;
- hiển thị địa điểm, thời gian, giá, rating;
- hỗ trợ phân trang;
- thêm empty state và loading state.

### 11.3. Dựng bộ lọc và sắp xếp
- Tạo form filter tối thiểu:
  - địa điểm;
  - thời gian;
  - giá;
  - loại tour.
- Tạo sort option cơ bản.
- Đồng bộ query string với UI để dễ demo và dễ test.

### 11.4. Dựng chi tiết tour
- Hiển thị gallery ảnh;
- khối thông tin tour;
- mô tả chi tiết;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực review.

### 11.5. Xử lý điều hướng giữa các màn hình
- Từ trang chủ vào danh sách tour;
- từ card tour vào chi tiết tour;
- từ bộ lọc về lại danh sách kết quả;
- giữ trải nghiệm mượt khi reload hoặc đổi query.

### 11.6. Chuẩn hóa trạng thái giao diện
- loading cho trang chủ;
- loading cho danh sách tour;
- loading cho chi tiết tour;
- thông báo không có dữ liệu;
- xử lý lỗi API ở mức thân thiện.

### 11.7. Chuẩn hóa component tái sử dụng
- tour card;
- filter panel;
- review list;
- rating display;
- hero/banner block;
- section heading.

### 11.8. Test flow phía frontend
Cần test tối thiểu:
- vào trang chủ;
- click sang danh sách tour;
- filter theo tỉnh/thành;
- sort lại kết quả;
- mở chi tiết tour;
- xem review;
- trường hợp không có kết quả;
- trường hợp API lỗi.

### 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 03, frontend phải có được một luồng public trông đủ hoàn chỉnh để demo:
- đẹp vừa phải;
- dễ hiểu;
- không lệch dữ liệu với backend;
- có thể dùng làm hình ảnh trong báo cáo.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `tours`
- Tạo controller/service cho public tour;
- tách rõ logic list, detail, review, category;
- chuẩn hóa DTO cho query filter và response.

### 12.2. Xử lý truy vấn danh sách tour công khai
- Lọc theo rule public;
- hỗ trợ keyword;
- hỗ trợ province;
- hỗ trợ thời gian;
- hỗ trợ khoảng giá;
- hỗ trợ category;
- hỗ trợ sort;
- hỗ trợ pagination.

### 12.3. Xử lý truy vấn chi tiết tour
- Lấy thông tin tour;
- join ảnh;
- join guide profile;
- đọc lịch trình tóm tắt nếu có;
- lấy rating trung bình;
- kiểm tra tour có thuộc phạm vi public hay không.

### 12.4. Xử lý review công khai
- Chỉ lấy review có `visibility_status = 'visible'`;
- hỗ trợ phân trang review nếu cần;
- chuẩn hóa output cho frontend.

### 12.5. Xử lý dữ liệu trang chủ
- Tạo API tour nổi bật;
- tạo API guide nổi bật;
- tạo API bài đồng hành mới;
- tránh join quá nặng trong một endpoint duy nhất.

### 12.6. Tính toán rating trung bình
- Có thể tính trực tiếp trong query hoặc dùng aggregate query riêng;
- phải dùng cùng một cách tính cho list và detail;
- tránh để mỗi endpoint tính khác nhau.

### 12.7. Chuẩn hóa rule public dùng chung
Nên tạo một lớp rule hoặc helper dùng chung cho:
- list tours;
- detail tour;
- featured tours;
- featured guides;
- reviews public.

### 12.8. Logging và kiểm lỗi
- log query filter phổ biến để tiện debug;
- log lỗi detail tour không tồn tại;
- chuẩn hóa mã lỗi khi tour không public hoặc không tìm thấy.

### 12.9. Tối ưu hiệu năng truy vấn
- hạn chế join dư thừa;
- chỉ select trường thật sự cần;
- tận dụng index đã có hoặc chuẩn bị thêm index cần thiết;
- tránh N+1 query ở phần ảnh và review.

### 12.10. Kết quả mong đợi phía backend
Kết thúc Sprint 03, backend phải cấp dữ liệu ổn định cho:
- trang chủ public;
- danh sách tour;
- lọc tour;
- chi tiết tour;
- review công khai.

---

### 13. Công việc database

### 13.1. Seed danh mục tour
- Tạo dữ liệu `tour_categories`;
- bảo đảm có đủ loại tour để filter có tác dụng;
- giữ dữ liệu đơn giản, dễ hiểu, dễ demo.

### 13.2. Seed tour mẫu
- Tạo nhiều tour thuộc nhiều địa điểm;
- đa dạng về giá;
- đa dạng về thời gian;
- có đủ trạng thái để test rule public và rule không public.

### 13.3. Seed ảnh tour
- Mỗi tour nên có ít nhất một cover image;
- một số tour có thêm nhiều ảnh để demo gallery;
- kiểm tra tính đúng đắn của `is_cover`.

### 13.4. Seed guide profile liên quan
- Mỗi tour public cần gắn với một guide profile hợp lệ;
- nên có vài guide ở trạng thái khác nhau để test logic hiển thị;
- avatar và working area nên có dữ liệu mẫu dễ nhìn.

### 13.5. Seed review mẫu
- Tạo review công khai cho một số tour;
- có chênh lệch rating để dễ thấy hiệu quả filter/sort;
- chuẩn bị cả trường hợp tour chưa có review.

### 13.6. Kiểm tra dữ liệu public
- tour public phải đúng `published` + `visible`;
- guide profile phải ở trạng thái phù hợp;
- review hiển thị phải đúng `visible`;
- dữ liệu detail không được lệch với dữ liệu list.

### 13.7. Tối ưu index
Cần chú ý các index phục vụ sprint này:
- `title`
- `province`
- `business_status`
- `visibility_status`
- `category_id`
- `start_date`
- `price`

Ngoài ra, cần bảo đảm:
- `tour_images` truy xuất nhanh theo `tour_id`;
- `tour_locations` truy xuất nhanh theo `tour_id, sequence_no`;
- `tour_reviews` truy xuất nhanh theo `tour_id`.

### 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 03, database phải:
- có dữ liệu đủ đẹp để demo;
- có trạng thái đủ để test logic public;
- có cấu trúc hỗ trợ tốt cho list, detail, filter và review.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- Mô tả chức năng F12, F13, F14;
- cập nhật phần màn hình M01, M04, M05, M06;
- cập nhật mapping bảng – màn hình – API liên quan đến public tour.

### 14.2. Activity Diagram cần cập nhật
Cần hoàn thiện các luồng:
- xem danh sách tour;
- tìm kiếm/lọc/sắp xếp tour;
- xem chi tiết tour.

### 14.3. Nội dung nên mô tả rõ trong UML
- actor là khách truy cập và người dùng;
- đầu vào filter;
- bước truy vấn dữ liệu public;
- bước kiểm tra trạng thái hiển thị;
- bước hiển thị danh sách kết quả;
- bước mở chi tiết tour;
- trường hợp không tìm thấy tour hoặc không có dữ liệu phù hợp.

### 14.4. Mục tiêu của phần tài liệu/UML
Phần tài liệu/UML của Sprint 03 phải giúp người đọc nhìn ra:
- vì sao đây là luồng public đầu tiên hoàn chỉnh;
- hệ thống lấy dữ liệu từ đâu;
- điều kiện hiển thị public được kiểm soát như thế nào;
- chi tiết tour liên kết với guide và review ra sao.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- Khách truy cập xem được danh sách tour công khai.
- Người dùng tìm và lọc được tour theo tiêu chí cơ bản.
- Người dùng mở được chi tiết tour để xem đầy đủ thông tin.

### 15.2. Đầu ra giao diện
- Có trang chủ public ở mức dùng được.
- Có danh sách tour dạng card/list rõ ràng.
- Có bộ lọc tối thiểu.
- Có màn hình chi tiết tour với ảnh, mô tả, lịch trình tóm tắt, guide và review.

### 15.3. Đầu ra API
- `GET /home/featured-tours`
- `GET /home/featured-guides`
- `GET /home/latest-companion-posts`
- `GET /tour-categories`
- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/reviews`

### 15.4. Đầu ra dữ liệu
- Có danh mục tour;
- có tour mẫu;
- có ảnh tour;
- có guide profile liên quan;
- có review mẫu;
- có dữ liệu đủ để test filter và chi tiết tour.

### 15.5. Đầu ra tài liệu
- Activity Diagram cho F12, F13, F14;
- mô tả màn hình M01, M04, M05, M06;
- mô tả rõ rule hiển thị public của tour.

### 15.6. Tiêu chí sẵn sàng sang Sprint 04
Sprint 03 được xem là đủ tốt để sang Sprint 04 khi:
- luồng public xem tour đã ổn định;
- dữ liệu guide đã bắt đầu xuất hiện cùng tour;
- API detail đã có nền để mở rộng sâu sang hồ sơ guide;
- frontend đã có pattern hiển thị public nhất quán;
- database đã có đủ dữ liệu mẫu và index phục vụ truy vấn public.

---

### 16. Kết luận sprint

Sprint 03 là sprint chuyển dự án từ giai đoạn “có nền kỹ thuật và auth” sang giai đoạn “thấy được giá trị thật của hệ thống”. Nếu Sprint 01 là móng, Sprint 02 là lớp xác thực và phân quyền, thì Sprint 03 chính là **luồng public đầu tiên có thể demo thuyết phục**.

Kết thúc sprint này, hệ thống cần cho phép khách truy cập:
- xem danh sách tour;
- tìm tour phù hợp;
- mở chi tiết tour để xem đầy đủ thông tin.

Đây là tiền đề trực tiếp để bước sang Sprint 04 – hồ sơ hướng dẫn viên công khai, nơi người dùng không chỉ xem tour mà còn bắt đầu nhìn rõ “người tổ chức tour” trong hệ thống.

---

<a id="sprint-04"></a>
## SPRINT 04 – Triển khai hồ sơ hướng dẫn viên và khu vực công khai của hướng dẫn viên

### 1. Mục tiêu sprint

Sprint 04 là sprint chuyển trọng tâm của hệ thống từ **“xem tour”** sang **“xem và lựa chọn người tổ chức tour”**. Sau khi Sprint 03 đã dựng được khu vực public cho tour, Sprint 04 phải làm rõ vai trò của **hướng dẫn viên địa phương** trong toàn bộ đề tài bằng cách hiện thực hồ sơ nghề nghiệp của guide và khu vực công khai để khách du lịch có thể tra cứu, so sánh và đánh giá sơ bộ trước khi quyết định tham gia tour.

Đây là sprint có ý nghĩa chiến lược vì nó tạo cầu nối trực tiếp giữa:
- tài khoản người dùng đã có từ Sprint 02;
- khu vực public tour đã có từ Sprint 03;
- các sprint tiếp theo như quản lý tour, yêu cầu tham gia tour, review và verification.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F08:** Quản lý hồ sơ hướng dẫn viên
- Chuẩn hóa cơ chế để một tài khoản có thể trở thành **Guide** theo hướng rõ ràng, dễ kiểm soát.
- Cho phép hướng dẫn viên tạo mới và cập nhật hồ sơ nghề nghiệp của chính mình.
- Tạo khu vực công khai để khách du lịch xem:
  - danh sách hướng dẫn viên;
  - hồ sơ hướng dẫn viên chi tiết.
- Dựng **Dashboard Guide** ở mức cơ bản để làm điểm vào cho Guide Area.
- Hoàn thiện cụm dữ liệu nghề nghiệp của hướng dẫn viên:
  - hồ sơ nghề nghiệp;
  - kỹ năng;
  - ngôn ngữ hỗ trợ;
  - đánh giá hướng dẫn viên.
- Chuẩn hóa điều kiện hiển thị công khai của guide profile để không bị lệch giữa frontend, backend và database.
- Chuẩn bị nền dữ liệu và điều hướng cho Sprint 05:
  - quản lý tour;
  - gắn tour với hồ sơ guide;
  - hiển thị guide trên tour public.

#### Ý nghĩa của sprint này
Nếu Sprint 04 được làm chắc, hệ thống sẽ thể hiện rõ hơn bản chất của đề tài: **khách du lịch không chỉ chọn tour, mà còn chọn người dẫn tour**. Sprint này cũng giúp:
- tăng chiều sâu nghiệp vụ cho đồ án;
- làm demo thuyết phục hơn;
- tạo nền để dữ liệu tour ở các sprint sau “gắn đúng chủ thể”;
- đồng bộ tốt hơn giữa phân quyền, hồ sơ nghề nghiệp và khu vực public.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Phải chốt duy nhất một cơ chế trở thành hướng dẫn viên
Trước khi code, cần quyết định dứt khoát một tài khoản trở thành guide bằng cách nào. Ở bộ tài liệu chốt, hướng phù hợp nhất là:
- user được gán role `GUIDE` trước;
- sau đó mới được tạo hồ sơ nghề nghiệp.

Không nên để đồng thời tồn tại nhiều luồng như:
- user tự tạo hồ sơ guide trước rồi xin role sau;
- admin vừa cấp role vừa tự tạo profile hộ;
- frontend tự mở Guide Area dù chưa có role thật.

### 2.2. Phải xác định rõ các trường bắt buộc để public
Hồ sơ hướng dẫn viên công khai không thể chỉ là một record trống. Cần khóa trước tập dữ liệu tối thiểu để profile đủ giá trị khi hiển thị:
- mô tả nghề nghiệp;
- số năm kinh nghiệm;
- khu vực hoạt động;
- ngôn ngữ hỗ trợ;
- kỹ năng;
- ảnh hồ sơ;
- trạng thái xác minh.

Nếu không chốt sớm, frontend dễ làm form thiếu trường còn backend lại thiếu rule kiểm tra công khai.

### 2.3. Sprint này chỉ làm profile guide, không kéo verification đi quá sâu
Dù schema đã có nhóm bảng xác minh hồ sơ, Sprint 04 chỉ nên:
- hiển thị `verification_status` ở mức badge/trạng thái;
- chuẩn bị chỗ đứng cho verification ở các sprint sau.

Không nên làm sâu ngay:
- upload giấy tờ;
- nhiều vòng duyệt;
- xử lý hồ sơ xác minh;
- moderation chi tiết.

Các phần đó phù hợp hơn ở Sprint 10 hoặc sprint admin liên quan.

### 2.4. Dashboard Guide chỉ cần ở mức cơ bản
Dashboard hướng dẫn viên trong Sprint 04 chủ yếu là màn hình đầu vào để:
- hiển thị trạng thái hồ sơ;
- hiển thị một vài chỉ số cơ bản;
- điều hướng tới màn hình quản lý hồ sơ;
- chuẩn bị link sang quản lý tour ở Sprint 05.

Không nên biến dashboard thành màn hình analytics phức tạp quá sớm.

### 2.5. Phải định nghĩa rõ “xong sprint” là gì
Sprint 04 chỉ được xem là hoàn thành khi có đủ:
- guide có thể vào Guide Area;
- guide có thể tạo/cập nhật hồ sơ nghề nghiệp;
- danh mục `languages` và `skills` dùng được;
- khách du lịch xem được danh sách hướng dẫn viên công khai;
- khách du lịch xem được chi tiết hồ sơ hướng dẫn viên công khai;
- dữ liệu seed đủ để test;
- Activity Diagram cho quản lý hồ sơ hướng dẫn viên được cập nhật.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Cơ chế trở thành guide
Cần chốt:
- ai được gán role `GUIDE`;
- role này được gán ở sprint nào và bởi ai;
- khi đã có role thì guide có bắt buộc tạo profile ngay không;
- nếu có role nhưng chưa có profile thì Guide Area hiển thị gì.

### 3.2. Các trường bắt buộc của hồ sơ hướng dẫn viên
Cần xác định rõ trường nào là:
- bắt buộc để lưu hồ sơ;
- bắt buộc để hiển thị public;
- tùy chọn nhưng nên có;
- chưa cần làm ở sprint này.

### 3.3. Điều kiện công khai của guide profile
Phải chốt rõ một hồ sơ guide được lên public khi nào. Tối thiểu cần xét:
- `visibility_status`;
- `verification_status`;
- `is_deleted`;
- trạng thái tài khoản user liên quan;
- mức dữ liệu tối thiểu đã hoàn thiện hay chưa.

### 3.4. Quan hệ giữa profile guide và role
Không phải cứ có profile là được xem là guide hợp lệ. Cần thống nhất:
- role `GUIDE` là điều kiện truy cập Guide Area;
- `guide_profiles` là hồ sơ nghề nghiệp;
- `user_roles` quyết định quyền;
- `guide_profiles` quyết định dữ liệu hiển thị và khả năng gắn tour.

### 3.5. Quan hệ giữa guide profile và tour
Sprint này chưa làm tour management sâu, nhưng cần chốt sẵn:
- mỗi guide profile gắn với một `user_id` duy nhất;
- tour sau này sẽ tham chiếu `guide_profile_id`;
- hồ sơ guide phải ổn trước khi Sprint 05 tạo tour.

### 3.6. Cách hiển thị review guide ở giai đoạn đầu
Cần chốt rõ:
- Sprint 04 có cần cho phép tạo review hay chỉ hiển thị review mẫu;
- nếu hiển thị review thì dùng review công khai;
- có cần rating trung bình trên list/detail hay không.

Phương án hợp lý là:
- chưa mở luồng tạo review trong Sprint 04;
- chỉ hỗ trợ hiển thị review/rating mẫu nếu dữ liệu có sẵn.

---

### 4. Hạng mục cần chốt

Các hạng mục phải khóa trước khi code sâu trong Sprint 04 gồm:
- luồng chuyển role sang Guide;
- cấu trúc bảng `guide_profiles`;
- tập trường bắt buộc để hồ sơ có thể public;
- phạm vi hiển thị công khai của guide;
- quan hệ giữa `guide_profiles` với `guide_languages` và `guide_skills`;
- cách dùng `guide_reviews` ở giai đoạn đầu;
- phạm vi của Dashboard Guide;
- chuẩn response cho API list và detail của guide;
- rule phân quyền cho Guide Area;
- dữ liệu seed chuẩn cho guide mẫu.

---

### 5. Phương án được chọn

### 5.1. Luồng trở thành hướng dẫn viên
Phương án được chọn là:
- tài khoản phải có role `GUIDE` trước;
- sau đó mới tạo hồ sơ nghề nghiệp ở `guide_profiles`;
- Guide Area chỉ mở cho user có role `GUIDE`;
- nếu có role nhưng chưa có profile, hệ thống điều hướng về màn hình tạo hồ sơ.

Đây là hướng phù hợp nhất để tránh rối quyền giữa Sprint 04, Sprint 08 và Sprint 10.

### 5.2. Bộ dữ liệu tối thiểu của hồ sơ guide
Hồ sơ công khai tối thiểu nên có:
- `bio`;
- `years_of_experience`;
- `working_area`;
- `avatar_url`;
- danh sách ngôn ngữ;
- danh sách kỹ năng;
- `verification_status`.

Ngoài ra có thể tận dụng thêm từ bảng `users`:
- `full_name`;
- `avatar_url` chung nếu cần fallback;
- trạng thái tài khoản để kiểm soát hiển thị.

### 5.3. Điều kiện hiển thị public của guide profile
Phương án an toàn cho Sprint 04 là chỉ hiển thị guide profile công khai khi:
- profile chưa bị xóa mềm;
- `visibility_status = 'visible'`;
- user liên quan đang ở trạng thái hoạt động phù hợp;
- hồ sơ có đủ dữ liệu tối thiểu để hiển thị;
- `verification_status` được hiển thị như thông tin tham khảo, chưa biến thành rule moderation phức tạp.

Trong phạm vi sprint này, có thể cho phép profile xuất hiện public dù `verification_status` chưa phải `approved`, miễn là trạng thái hiển thị phù hợp và dữ liệu đủ tối thiểu. Tuy nhiên badge xác minh phải thể hiện trung thực.

### 5.4. Phạm vi của verification trong Sprint 04
Verification chỉ ở mức:
- lưu và hiển thị `verification_status`;
- phục vụ badge “chưa gửi / chờ duyệt / đã duyệt / bị từ chối”.

Không triển khai:
- form nộp giấy tờ;
- danh sách yêu cầu xác minh;
- xử lý phản hồi xác minh;
- admin verification flow.

### 5.5. Phạm vi của Dashboard Guide
Dashboard Guide chỉ cần:
- thẻ thông tin hồ sơ;
- trạng thái xác minh;
- số tour hiện có hoặc giá trị mặc định 0;
- điểm đánh giá trung bình hoặc placeholder;
- shortcut tới:
  - quản lý hồ sơ guide;
  - danh sách tour của tôi;
  - yêu cầu tham gia tour.

Các link tới tour/request có thể là placeholder chuẩn bị cho sprint sau.

### 5.6. Phạm vi hiển thị review
Ở Sprint 04:
- `guide_reviews` chủ yếu dùng để hiển thị ở hồ sơ công khai;
- chỉ lấy các review có `visibility_status = 'visible'`;
- chưa mở sâu luồng tạo review;
- có thể tính rating trung bình để hiển thị ở list/detail nếu dữ liệu seed có sẵn.

### 5.7. Quan hệ many-to-many cho ngôn ngữ và kỹ năng
Ngôn ngữ và kỹ năng được triển khai theo hướng:
- danh mục chuẩn ở `languages` và `skills`;
- liên kết nhiều-nhiều qua:
  - `guide_languages`;
  - `guide_skills`.

Frontend không được hardcode text tự do cho các giá trị chuẩn ngay trong sprint này, để tránh lệch dữ liệu giữa UI và database.

---

### 6. Ghi chú triển khai

- Sprint 04 phải ưu tiên **CRUD hồ sơ guide của chính mình** trước, rồi mới mở rộng khu vực public.
- Không nên làm xác minh hồ sơ quá sâu trong sprint này.
- Cần seed đủ dữ liệu guide mẫu để danh sách guide và chi tiết guide nhìn có chiều sâu khi demo.
- Nên chuẩn hóa sớm cấu trúc DTO cho `guide profile`, `languages`, `skills` vì Sprint 05 sẽ dùng lại nhiều dữ liệu này.
- Guide Area cần được dựng theo hướng có thể mở rộng ngay sang:
  - danh sách tour của tôi;
  - tạo/cập nhật tour;
  - quản lý yêu cầu tham gia tour.

---

### 7. Chức năng trọng tâm

Chức năng trọng tâm của Sprint 04 là:

- **F08 – Quản lý hồ sơ hướng dẫn viên**

Chức năng này bao gồm:
- tạo hồ sơ nghề nghiệp;
- cập nhật hồ sơ nghề nghiệp;
- quản lý ngôn ngữ hỗ trợ;
- quản lý kỹ năng;
- hiển thị hồ sơ công khai;
- hiển thị danh sách hướng dẫn viên công khai;
- chuẩn bị dữ liệu cho tour và review guide.

Đây là chức năng có vai trò nền cho:
- F10 Quản lý tour;
- F11 Quản lý yêu cầu tham gia tour;
- F18 Đánh giá hướng dẫn viên;
- F25 Quản trị dữ liệu liên quan đến guide.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình của Sprint 04 phải làm nổi bật được hai chiều:
- **Guide tự quản lý hồ sơ nghề nghiệp của mình**;
- **Khách du lịch xem được guide ở khu vực công khai**.

### 8.2. Các màn hình cần triển khai trong Sprint 04

#### M08 – Danh sách hướng dẫn viên công khai
Mục tiêu:
- cho khách truy cập và người dùng xem danh sách guide đang hiển thị công khai.

Nội dung hiển thị nên có:
- ảnh đại diện;
- tên hướng dẫn viên;
- khu vực hoạt động;
- số năm kinh nghiệm;
- ngôn ngữ hỗ trợ;
- điểm đánh giá trung bình;
- badge xác minh;
- nút xem chi tiết.

Yêu cầu:
- hỗ trợ filter nhẹ theo khu vực hoặc từ khóa nếu còn thời gian;
- phân trang hoặc load-more;
- chỉ hiển thị dữ liệu public hợp lệ.

#### M09 – Hồ sơ hướng dẫn viên công khai
Mục tiêu:
- hiển thị đầy đủ hồ sơ nghề nghiệp của một guide cụ thể.

Nội dung hiển thị nên có:
- ảnh đại diện;
- họ tên;
- mô tả nghề nghiệp;
- kinh nghiệm;
- khu vực hoạt động;
- ngôn ngữ;
- kỹ năng;
- badge xác minh;
- rating trung bình;
- danh sách review công khai;
- danh sách tour liên quan ở mức teaser hoặc block điều hướng.

Yêu cầu:
- dữ liệu phải đồng nhất với `guide_profiles`;
- review chỉ hiển thị review public;
- các thao tác nâng cao như yêu thích hoặc báo cáo có thể để placeholder cho sprint sau.

#### M31 – Dashboard hướng dẫn viên
Mục tiêu:
- làm màn hình đầu vào của Guide Area.

Nội dung hiển thị nên có:
- tóm tắt hồ sơ nghề nghiệp;
- trạng thái xác minh;
- số tour hiện có;
- số yêu cầu chờ duyệt;
- điểm đánh giá trung bình;
- các shortcut chính.

Yêu cầu:
- không cần analytics sâu;
- tập trung vào điều hướng;
- bố cục rõ và gọn.

#### M32 – Quản lý hồ sơ hướng dẫn viên của tôi
Mục tiêu:
- cho phép guide tạo mới hoặc cập nhật hồ sơ nghề nghiệp.

Nội dung hiển thị nên có:
- mô tả nghề nghiệp;
- số năm kinh nghiệm;
- khu vực hoạt động;
- ảnh hồ sơ;
- chọn ngôn ngữ;
- chọn kỹ năng;
- trạng thái hiển thị;
- badge xác minh;
- nút lưu.

Yêu cầu:
- hỗ trợ cả trường hợp chưa có profile và đã có profile;
- validate rõ các trường bắt buộc;
- đồng bộ tốt với API create/update.

### 8.3. Thành phần UI dùng chung cần tận dụng
Từ Sprint 01 và Sprint 02 có thể tận dụng:
- app layout;
- guide area layout;
- card;
- form field;
- multi-select;
- badge trạng thái;
- table/list container;
- loading state;
- empty state;
- toast thông báo.

### 8.4. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 04:
- guide vào được Guide Area;
- guide tạo/cập nhật được hồ sơ;
- khách xem được list guide;
- khách xem được detail guide;
- UI đủ chắc để nối tiếp Sprint 05.

---

### 9. Bảng CSDL chính

### 9.1. `guide_profiles`
#### Vai trò
Là bảng hồ sơ nghề nghiệp trung tâm của hướng dẫn viên.

#### Trường quan trọng
- `id`
- `user_id`
- `bio`
- `years_of_experience`
- `working_area`
- `avatar_url`
- `verification_status`
- `visibility_status`
- `is_accepting_tours`
- `is_deleted`
- `created_at`
- `updated_at`

#### Vai trò trong Sprint 04
- lưu hồ sơ nghề nghiệp;
- điều khiển hiển thị public;
- làm đầu mối gắn với tour về sau;
- làm đối tượng chính của Guide Area.

### 9.2. `languages`
#### Vai trò
Lưu danh mục ngôn ngữ chuẩn dùng cho hướng dẫn viên.

#### Trường quan trọng
- `id`
- `name`
- `is_active`

#### Vai trò trong Sprint 04
- cung cấp dữ liệu cho form chọn ngôn ngữ;
- dùng cho filter và hiển thị public.

### 9.3. `skills`
#### Vai trò
Lưu danh mục kỹ năng/thế mạnh của hướng dẫn viên.

#### Trường quan trọng
- `id`
- `name`
- `is_active`

#### Vai trò trong Sprint 04
- cung cấp dữ liệu cho form chọn kỹ năng;
- chuẩn hóa dữ liệu nghề nghiệp của guide.

### 9.4. `guide_languages`
#### Vai trò
Bảng liên kết nhiều-nhiều giữa hồ sơ guide và danh mục ngôn ngữ.

#### Trường quan trọng
- `guide_profile_id`
- `language_id`

#### Vai trò trong Sprint 04
- lưu danh sách ngôn ngữ mà guide hỗ trợ;
- phục vụ hiển thị ở list/detail và dashboard.

### 9.5. `guide_skills`
#### Vai trò
Bảng liên kết nhiều-nhiều giữa hồ sơ guide và danh mục kỹ năng.

#### Trường quan trọng
- `guide_profile_id`
- `skill_id`

#### Vai trò trong Sprint 04
- lưu kỹ năng nghề nghiệp của guide;
- phục vụ hiển thị hồ sơ công khai.

### 9.6. `guide_reviews`
#### Vai trò
Lưu đánh giá của người dùng dành cho hướng dẫn viên.

#### Trường quan trọng
- `id`
- `guide_profile_id`
- `tour_id`
- `tour_request_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

#### Vai trò trong Sprint 04
- chưa phải trọng tâm tạo mới;
- chủ yếu phục vụ hiển thị review/rating công khai ở profile guide;
- chuẩn bị cho sprint review phía sau.

### 9.7. Bảng hỗ trợ cần lưu ý thêm
Ngoài các bảng chính trên, Sprint 04 còn liên quan gián tiếp tới:
- `users`: lấy `full_name`, `avatar_url`, trạng thái tài khoản;
- `user_roles`: kiểm tra role `GUIDE`;
- `roles`: xác nhận danh mục role chính thức;
- `tours`: có thể dùng ở mức teaser “tour đã đăng” nếu muốn hiển thị ở hồ sơ guide.

### 9.8. Ghi chú triển khai dữ liệu
- Không để frontend tự giữ danh sách kỹ năng/ngôn ngữ cố định.
- Cần chốt dữ liệu demo cho tối thiểu 3–5 guide mẫu.
- Cần có index hỗ trợ truy vấn public theo `visibility_status`, `verification_status`, `is_deleted`.
- Không nên dùng dữ liệu review ảo quá nhiều; chỉ seed vừa đủ để giao diện có chiều sâu.

---

### 10. API cần thiết

### 10.1. `GET /guides`
#### Mục đích
Lấy danh sách hướng dẫn viên công khai.

#### Query gợi ý
```http
GET /guides?page=1&limit=12&keyword=da%20nang&workingArea=Da%20Nang
```

#### Kết quả mong đợi
- trả về danh sách guide public;
- có phân trang;
- có thông tin cơ bản đủ hiển thị card;
- có rating trung bình nếu dữ liệu có sẵn.

### 10.2. `GET /guides/:id`
#### Mục đích
Lấy chi tiết hồ sơ hướng dẫn viên công khai.

#### Kết quả mong đợi
- trả về dữ liệu chi tiết của guide;
- bao gồm mô tả, kinh nghiệm, ngôn ngữ, kỹ năng;
- có review công khai;
- có thể kèm danh sách tour liên quan ở mức gợi ý.

### 10.3. `POST /guide-profile`
#### Mục đích
Tạo hồ sơ nghề nghiệp cho hướng dẫn viên hiện tại.

#### Request gợi ý
```json
{
  "bio": "Huong dan vien dia phuong tai Da Nang, chuyen tour trai nghiem va am thuc.",
  "yearsOfExperience": 4,
  "workingArea": "Da Nang",
  "avatarUrl": "https://example.com/guide-avatar.jpg",
  "visibilityStatus": "visible",
  "isAcceptingTours": true
}
```

#### Kết quả mong đợi
- tạo bản ghi `guide_profiles`;
- gắn đúng `user_id` của guide hiện tại;
- kiểm tra role `GUIDE`;
- trả về profile sau khi tạo.

### 10.4. `PATCH /guide-profile/:id`
#### Mục đích
Cập nhật hồ sơ nghề nghiệp của guide.

#### Request gợi ý
```json
{
  "bio": "Cap nhat mo ta nghe nghiep",
  "yearsOfExperience": 5,
  "workingArea": "Da Nang - Hoi An",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "visibilityStatus": "visible",
  "isAcceptingTours": true
}
```

#### Kết quả mong đợi
- chỉ cho phép chủ hồ sơ cập nhật hồ sơ của mình;
- validate dữ liệu hợp lệ;
- trả về profile sau cập nhật.

### 10.5. `PUT /guide-profile/:id/languages`
#### Mục đích
Cập nhật danh sách ngôn ngữ hỗ trợ của hướng dẫn viên.

#### Request gợi ý
```json
{
  "languageIds": [1, 2, 4]
}
```

#### Kết quả mong đợi
- thay thế hoặc đồng bộ dữ liệu `guide_languages`;
- kiểm tra danh mục ngôn ngữ hợp lệ;
- trả về danh sách ngôn ngữ mới.

### 10.6. `PUT /guide-profile/:id/skills`
#### Mục đích
Cập nhật danh sách kỹ năng của hướng dẫn viên.

#### Request gợi ý
```json
{
  "skillIds": [1, 3, 5]
}
```

#### Kết quả mong đợi
- đồng bộ dữ liệu `guide_skills`;
- kiểm tra danh mục kỹ năng hợp lệ;
- trả về danh sách kỹ năng mới.

### 10.7. `GET /languages`
#### Mục đích
Lấy danh mục ngôn ngữ đang hoạt động.

#### Kết quả mong đợi
- trả về danh sách phục vụ form;
- chỉ lấy giá trị `is_active = true`.

### 10.8. `GET /skills`
#### Mục đích
Lấy danh mục kỹ năng đang hoạt động.

#### Kết quả mong đợi
- trả về danh sách phục vụ form;
- chỉ lấy giá trị `is_active = true`.

### 10.9. API hỗ trợ nên cân nhắc thêm
Nếu muốn triển khai thuận tiện hơn cho frontend, có thể bổ sung:
- `GET /me/guide-profile`
- `GET /guides/:id/reviews`

Hai API này không bắt buộc theo khung kế hoạch, nhưng rất hữu ích khi nối UI thực tế.

### 10.10. Yêu cầu kỹ thuật chung cho API
Tất cả API trong Sprint 04 phải thống nhất:
- response envelope chung;
- validate DTO rõ ràng;
- phân biệt `401` và `403`;
- check ownership với guide profile;
- không trả dữ liệu private cho route public;
- log lỗi tối thiểu;
- có thể test bằng Swagger/Postman.

---

### 11. Công việc frontend

### 11.1. Dựng Guide Area cơ bản
- tạo route cho Guide Area;
- áp dụng guard theo role `GUIDE`;
- dựng dashboard guide cơ bản;
- chuẩn hóa menu điều hướng guide.

### 11.2. Dựng màn hình quản lý hồ sơ hướng dẫn viên
- form tạo profile;
- form cập nhật profile;
- validate trường bắt buộc;
- xử lý trạng thái chưa có profile;
- hiển thị badge xác minh và hiển thị.

### 11.3. Dựng chọn ngôn ngữ và kỹ năng
- gọi `GET /languages`;
- gọi `GET /skills`;
- hiển thị multi-select hoặc checkbox group;
- đồng bộ với API update many-to-many.

### 11.4. Dựng danh sách guide công khai
- card guide public;
- phân trang hoặc load-more;
- trạng thái loading/empty/error;
- search hoặc filter nhẹ nếu còn thời gian.

### 11.5. Dựng chi tiết guide công khai
- block thông tin nghề nghiệp;
- block ngôn ngữ;
- block kỹ năng;
- block review công khai;
- block tour liên quan hoặc placeholder.

### 11.6. Đồng bộ badge trạng thái
Frontend cần hiển thị rõ:
- `verification_status`;
- `visibility_status`;
- trạng thái nhận tour nếu dùng `is_accepting_tours`.

### 11.7. Chuẩn hóa trải nghiệm nhập liệu
- kiểm tra giới hạn ký tự cho `bio`;
- kiểm tra số năm kinh nghiệm không âm;
- kiểm tra bắt buộc chọn ít nhất một ngôn ngữ/kỹ năng nếu rule được áp dụng;
- thông báo lỗi thân thiện.

### 11.8. Test flow phía frontend
Cần test tối thiểu:
- guide chưa có profile;
- guide đã có profile;
- khách xem list guide;
- khách xem detail guide;
- user thường cố truy cập Guide Area;
- profile ở trạng thái ẩn không xuất hiện ở public.

### 11.9. Kết quả mong đợi phía frontend
- Guide Area dùng được;
- form profile guide hoạt động ổn;
- list/detail guide công khai mạch lạc;
- dễ nối tiếp với quản lý tour ở Sprint 05.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `guides`
Nên tách riêng module `guides` để xử lý:
- query public;
- CRUD hồ sơ cá nhân của guide;
- mapping dữ liệu với `users`, `guide_languages`, `guide_skills`, `guide_reviews`.

### 12.2. Kiểm tra role và ownership
Backend phải kiểm tra:
- chỉ tài khoản có role `GUIDE` mới được tạo/cập nhật guide profile;
- chỉ chủ hồ sơ mới được sửa hồ sơ của mình;
- route public không để lộ dữ liệu nội bộ.

### 12.3. Xử lý create/update profile
- validate dữ liệu đầu vào;
- tránh tạo nhiều profile cho một user;
- xử lý create lần đầu và update các lần sau rõ ràng;
- chuẩn hóa response cho frontend.

### 12.4. Xử lý many-to-many cho ngôn ngữ và kỹ năng
- đồng bộ `guide_languages`;
- đồng bộ `guide_skills`;
- kiểm tra id danh mục hợp lệ;
- dùng transaction khi cần để tránh lệch dữ liệu.

### 12.5. Xử lý query public cho danh sách guide
- chỉ lấy profile thỏa điều kiện public;
- join dữ liệu cần thiết từ `users`;
- tính hoặc đính kèm rating trung bình nếu cần;
- tránh trả về dữ liệu quá nặng.

### 12.6. Xử lý query chi tiết guide
- lấy profile đầy đủ;
- lấy danh sách ngôn ngữ;
- lấy danh sách kỹ năng;
- lấy review công khai;
- có thể lấy tour liên quan nếu muốn gợi ý.

### 12.7. Chuẩn hóa rule public dùng chung
Nên có hàm/service dùng chung để xác định:
- profile nào được hiển thị public;
- review nào được hiển thị public;
- dữ liệu nào chỉ dành cho owner.

### 12.8. Logging và xử lý lỗi
- log lỗi validation;
- log lỗi không đủ quyền;
- log lỗi không tìm thấy profile;
- thống nhất mã lỗi để frontend dễ xử lý.

### 12.9. Chuẩn bị nền cho Sprint 05
Backend nên tổ chức dữ liệu sao cho Sprint 05 có thể dùng lại trực tiếp:
- `guide_profile_id`;
- trạng thái nhận tour;
- profile summary;
- join guide với tour.

### 12.10. Kết quả mong đợi phía backend
- API guide hoạt động ổn định;
- rule quyền rõ ràng;
- query public và query owner tách bạch;
- sẵn sàng mở sang module tour.

---

### 13. Công việc database

### 13.1. Seed danh mục ngôn ngữ
Chuẩn bị danh mục ngôn ngữ tối thiểu:
- tiếng Việt;
- tiếng Anh;
- tiếng Trung;
- tiếng Hàn;
- tiếng Nhật.

Có thể mở rộng thêm tùy phạm vi demo.

### 13.2. Seed danh mục kỹ năng
Chuẩn bị danh mục kỹ năng mẫu như:
- am hiểu văn hóa địa phương;
- hướng dẫn ẩm thực;
- chụp ảnh;
- hỗ trợ tiếng Anh;
- tổ chức nhóm nhỏ;
- du lịch trải nghiệm.

### 13.3. Seed guide profile mẫu
Cần có nhiều profile mẫu với mức độ hoàn thiện khác nhau:
- profile hoàn chỉnh và đang public;
- profile có badge xác minh khác nhau;
- profile bị ẩn để test rule public;
- profile chưa đủ dữ liệu để test form.

### 13.4. Seed liên kết ngôn ngữ và kỹ năng
- gắn mỗi guide với 2–4 ngôn ngữ/kỹ năng;
- bảo đảm list/detail hiển thị phong phú;
- tránh toàn bộ guide có cùng bộ dữ liệu.

### 13.5. Seed review guide mẫu
- chuẩn bị một số review công khai;
- có rating khác nhau để tính điểm trung bình;
- nếu chưa có luồng review thật, vẫn cần seed đủ để UI public có chiều sâu.

### 13.6. Kiểm tra toàn vẹn dữ liệu
Cần kiểm tra:
- mỗi `user_id` chỉ có một `guide_profile`;
- các id trong bảng liên kết là hợp lệ;
- không có profile public bị thiếu dữ liệu tối thiểu;
- không có profile public thuộc user bị khóa hoặc không phù hợp.

### 13.7. Tối ưu index
Các index quan trọng cần lưu ý:
- index theo `user_id` của `guide_profiles`;
- index theo `visibility_status`, `verification_status`, `is_deleted`;
- index ở bảng liên kết để join nhanh hơn khi lấy detail.

### 13.8. Kết quả mong đợi phía database
- dữ liệu guide sạch và nhất quán;
- đủ bản ghi cho list/detail;
- đủ dữ liệu để demo dashboard guide;
- sẵn sàng cho Sprint 05 gắn tour vào guide profile.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
Trong Sprint 04 nên cập nhật:
- mô tả chức năng F08;
- mô tả vai trò Guide trong báo cáo phân quyền;
- mô tả màn hình M08, M09, M31, M32;
- mô tả dữ liệu nhóm guide profile trong báo cáo CSDL.

### 14.2. Activity Diagram cần cập nhật
Cần hoàn thiện tối thiểu Activity Diagram cho:
- tạo/cập nhật hồ sơ hướng dẫn viên;
- xem danh sách hướng dẫn viên công khai;
- xem hồ sơ hướng dẫn viên công khai.

### 14.3. Nội dung nên mô tả rõ trong UML
- actor tham gia: Guide, Guest/User;
- tiền điều kiện: có role `GUIDE` với luồng quản lý hồ sơ;
- kiểm tra điều kiện public;
- luồng chọn ngôn ngữ/kỹ năng;
- hậu điều kiện sau khi lưu hồ sơ;
- trường hợp ngoại lệ khi chưa đủ quyền hoặc dữ liệu không hợp lệ.

### 14.4. Mục tiêu của phần tài liệu/UML
- làm rõ luồng nghề nghiệp của guide;
- liên kết chặt giữa role, dữ liệu và giao diện;
- tạo nền cho sequence/class diagram liên quan ở các sprint sau.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- Guide có thể tạo hồ sơ nghề nghiệp của mình.
- Guide có thể cập nhật hồ sơ nghề nghiệp của mình.
- Khách du lịch có thể xem danh sách guide công khai.
- Khách du lịch có thể xem chi tiết hồ sơ guide công khai.

### 15.2. Đầu ra giao diện
- hoàn thành M08;
- hoàn thành M09;
- hoàn thành M31 ở mức cơ bản;
- hoàn thành M32.

### 15.3. Đầu ra API
- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /languages`
- `GET /skills`

### 15.4. Đầu ra dữ liệu
- seed languages và skills;
- seed guide profile mẫu;
- seed liên kết many-to-many;
- seed guide review mẫu;
- tối ưu index phục vụ query public.

### 15.5. Đầu ra tài liệu
- cập nhật Activity Diagram quản lý hồ sơ hướng dẫn viên;
- cập nhật mô tả vai trò Guide;
- cập nhật phần màn hình guide public và guide area;
- cập nhật mô tả bảng liên quan tới guide profile.

### 15.6. Tiêu chí sẵn sàng sang Sprint 05
Chỉ nên sang Sprint 05 khi:
- role `GUIDE` hoạt động đúng;
- guide profile đã tạo/cập nhật ổn định;
- guide list/detail public hoạt động đúng rule;
- seed dữ liệu guide đủ dùng;
- frontend, backend và database thống nhất cách hiểu về guide public;
- `guide_profile_id` đã sẵn sàng để gắn với tour.

---

### 16. Kết luận sprint

Sprint 04 là sprint hoàn thiện **bản sắc nghề nghiệp của hướng dẫn viên** trong hệ thống. Nếu Sprint 03 giúp người dùng thấy được “tour đang có gì”, thì Sprint 04 giúp họ thấy được “ai là người dẫn tour”. Đây là bước rất quan trọng để đồ án thể hiện đúng giá trị kết nối giữa khách du lịch và hướng dẫn viên địa phương.

Khi kết thúc sprint này, hệ thống phải đạt được một nền tảng đủ chắc để bước sang Sprint 05 với trọng tâm là **quản lý tour cho hướng dẫn viên**, trong đó mọi tour đều gắn với một hồ sơ guide rõ ràng, có thể hiển thị công khai và có giá trị thuyết phục khi demo.

---

<a id="sprint-05"></a>
## SPRINT 05 – Triển khai chức năng quản lý tour cho hướng dẫn viên

### 1. Mục tiêu sprint

Sprint 05 là sprint hiện thực **trục nghiệp vụ cốt lõi phía hướng dẫn viên**: tạo tour, cập nhật tour, quản lý ảnh tour và quản lý lịch trình/địa điểm của tour. Sau khi Sprint 04 đã hình thành được hồ sơ nghề nghiệp và khu vực công khai của hướng dẫn viên, Sprint 05 phải giúp hệ thống đi thêm một bước rất quan trọng: **Guide bắt đầu tạo ra dữ liệu tour thật để toàn bộ nền tảng vận hành đúng bản chất đề tài**.

Đây là sprint mang tính bản lề vì nó kết nối trực tiếp giữa:
- hồ sơ hướng dẫn viên đã có từ Sprint 04;
- khu vực công khai tour đã có từ Sprint 03;
- luồng yêu cầu tham gia tour sẽ triển khai ở Sprint 06;
- quản trị tour và kiểm duyệt tour ở các sprint sau.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F10:** Quản lý tour
- Cho phép hướng dẫn viên:
  - tạo tour mới;
  - cập nhật tour đã tạo;
  - quản lý bộ ảnh tour;
  - quản lý lịch trình/địa điểm theo thứ tự hành trình;
  - thay đổi trạng thái tour theo phạm vi cho phép.
- Dựng đầy đủ cụm màn hình Guide Area liên quan tới tour:
  - danh sách tour của tôi;
  - tạo/cập nhật tour;
  - quản lý lịch trình/địa điểm tour.
- Chuẩn hóa dữ liệu tour để dùng lại cho:
  - danh sách tour public;
  - chi tiết tour;
  - yêu cầu tham gia tour;
  - quản trị tour;
  - review tour;
  - bản đồ lộ trình tour.
- Chốt rõ mối quan hệ giữa:
  - `guide_profiles`;
  - `tours`;
  - `tour_images`;
  - `tour_locations`;
  - `tour_categories`;
  - `tour_accommodations`.
- Chốt rõ logic trạng thái của tour để frontend, backend và database không lệch nhau.
- Chuẩn bị dữ liệu demo tour đủ tốt để các sprint sau có thể test thật thay vì chỉ dùng dữ liệu giả nghèo nàn.

#### Ý nghĩa của sprint này
Nếu Sprint 05 được làm chắc, hệ thống sẽ bắt đầu thể hiện đầy đủ bản chất nghiệp vụ của đề tài:
- hướng dẫn viên không chỉ có hồ sơ, mà còn có **nội dung tour thật để kinh doanh và kết nối**;
- khách du lịch có dữ liệu thật để xem ở khu vực public;
- Sprint 06 có đầu vào đúng để triển khai yêu cầu tham gia tour;
- Demo hệ thống trở nên thuyết phục hơn rất nhiều vì đã có chuỗi logic:
  - có guide;
  - guide tạo tour;
  - tour hiển thị công khai;
  - user xem tour và chuẩn bị tham gia.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Phải chốt cấu trúc một tour chuẩn ngay từ đầu
Sprint này rất dễ bị rối nếu không thống nhất sớm một tour gồm những phần bắt buộc nào. Cần chốt ngay:
- thông tin chính của tour;
- bộ ảnh tour;
- lịch trình/địa điểm;
- loại tour;
- trạng thái nghiệp vụ;
- trạng thái hiển thị.

Không nên để:
- mỗi màn hình dùng một bộ field khác nhau;
- frontend nhập một kiểu nhưng backend validate kiểu khác;
- dữ liệu hiển thị public khác dữ liệu guide vừa tạo.

### 2.2. Phải tách rõ trạng thái nghiệp vụ và trạng thái hiển thị
Tour cần được quản lý ít nhất theo hai lớp trạng thái:
- **`business_status`**: phản ánh trạng thái nghiệp vụ như nháp, công khai, đóng tour, hủy;
- **`visibility_status`**: phản ánh trạng thái hiển thị hoặc moderation như visible, hidden, flagged.

Nếu không tách rõ hai lớp này:
- guide sẽ khó hiểu tour của mình “đang ở đâu”;
- public query sẽ dễ sai;
- admin moderation về sau sẽ phải sửa lại logic.

### 2.3. Không làm quá sâu `tour_accommodations` ở sprint này
Theo tài liệu chốt, `tour_accommodations` vẫn là một phần của schema tổng thể, nhưng trong Sprint 05 chỉ nên:
- giữ đúng cấu trúc bảng;
- chuẩn bị quan hệ dữ liệu;
- sẵn sàng cho mở rộng sau.

Không nên làm sâu:
- giao diện chọn đối tác lưu trú hoàn chỉnh;
- luồng booking;
- liên kết thanh toán lưu trú;
- module accommodation đầy đủ.

### 2.4. Phải kiểm tra ownership rất chặt
Sprint này là nơi bắt đầu xuất hiện dữ liệu do Guide tự tạo. Vì vậy phải kiểm tra nghiêm:
- guide chỉ được xem tour của chính mình ở Guide Area;
- guide chỉ được sửa tour của chính mình;
- guide chỉ được thay đổi ảnh và lịch trình của tour thuộc quyền sở hữu;
- guide không được truy cập tour của guide khác qua URL trực tiếp.

### 2.5. “Xong sprint” không phải chỉ là tạo được tour
Sprint 05 chỉ được xem là hoàn thành khi đạt đủ:
- tạo được tour;
- sửa được tour;
- thêm/xóa ảnh tour;
- cập nhật được lịch trình/địa điểm;
- trạng thái tour hiển thị đúng;
- tour public lấy được dữ liệu đúng theo rule đã chốt;
- có seed dữ liệu tour đủ sâu để demo;
- UML được cập nhật theo đúng flow.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Bộ trường bắt buộc của tour
Cần xác định rõ các trường tối thiểu bắt buộc khi tạo tour:
- `title`;
- `category_id`;
- `province`;
- `start_date`;
- `end_date`;
- `price`;
- `max_participants`;
- `meet_point`;
- `description`.

Các trường khác như:
- `district`;
- `meet_latitude`;
- `meet_longitude`;
- `participant_requirements`;
- `published_at`
có thể là tùy tình huống hoặc được backend bổ sung khi đổi trạng thái.

### 3.2. Cách lưu trạng thái của tour
Cần thống nhất sớm vòng đời của tour:
- `draft`;
- `published`;
- `closed`;
- `cancelled`.

Đồng thời phải chốt khi nào thì:
- tự động set `published_at`;
- cho phép từ draft sang published;
- cho phép từ published sang closed;
- cho phép từ published hoặc closed sang cancelled;
- không cho sửa sâu dữ liệu nếu tour đã ở trạng thái không phù hợp.

### 3.3. Điều kiện để tour được hiển thị công khai
Sprint này phải chốt rõ:
- tour nào vào danh sách tour public;
- tour nào chỉ thấy ở Guide Area;
- tour nào bị ẩn khỏi public nhưng vẫn tồn tại nội bộ.

Hướng hợp lý là public query chỉ lấy các tour:
- chưa bị xóa mềm;
- `business_status = 'published'`;
- `visibility_status = 'visible'`;
- gắn với guide profile hợp lệ và đủ điều kiện hiển thị.

### 3.4. Cách quản lý ảnh tour
Cần xác định:
- có một ảnh cover hay nhiều ảnh cover;
- sắp xếp ảnh bằng `sort_order` như thế nào;
- xóa ảnh có phải xóa file vật lý hay chỉ xóa bản ghi;
- nếu xóa ảnh cover thì chọn ảnh cover mới ra sao.

### 3.5. Cách quản lý lịch trình/địa điểm tour
Cần thống nhất:
- mỗi địa điểm có `sequence_no` duy nhất trong tour;
- địa điểm có bắt buộc tọa độ hay không;
- `visit_time` có bắt buộc không;
- cập nhật theo từng item hay gửi cả mảng itinerary.

Trong phạm vi sprint này, hướng thực dụng nhất là:
- cho frontend gửi cả danh sách itinerary theo tour;
- backend replace/update theo danh sách chuẩn hóa;
- ràng buộc uniqueness ở database bảo vệ `sequence_no`.

### 3.6. Cách liên kết Guide với Tour
Cần xác định rõ:
- Guide Area không dùng trực tiếp `users.id` để sở hữu tour;
- quyền sở hữu tour gắn với `guide_profiles.id`;
- một guide profile có thể có nhiều tour;
- tour không tồn tại nếu chưa có guide profile hợp lệ.

### 3.7. Phạm vi của `tour_accommodations`
Cần làm rõ:
- bảng này đã tồn tại trong schema final;
- nhưng Sprint 05 chưa bắt buộc phải có UI quản lý riêng;
- có thể chuẩn bị API hoặc DTO nền, nhưng không kéo sâu để tránh tràn sprint.

---

### 4. Hạng mục cần chốt

Trong Sprint 05, các hạng mục cần chốt gồm:

- cấu trúc dữ liệu chuẩn của một tour;
- vòng đời trạng thái `business_status` của tour;
- quy tắc hiển thị công khai của tour;
- cơ chế quản lý ảnh tour và ảnh cover;
- cơ chế quản lý itinerary bằng `tour_locations`;
- quyền sở hữu tour theo `guide_profile_id`;
- phạm vi áp dụng của `tour_accommodations` trong giai đoạn đầu;
- form field bắt buộc ở màn hình tạo/cập nhật tour;
- bộ dữ liệu seed tour mẫu để phục vụ demo;
- luồng UML cho tạo tour, cập nhật tour và quản lý lịch trình.

---

### 5. Phương án được chọn

### 5.1. Cấu trúc một tour chuẩn trong Sprint 05
Một tour trong phạm vi Sprint 05 được tổ chức thành 3 lớp dữ liệu chính:

1. **Thông tin chính của tour** trong `tours`
   - tiêu đề;
   - loại tour;
   - địa bàn;
   - thời gian;
   - giá;
   - số chỗ;
   - điểm hẹn;
   - mô tả;
   - yêu cầu người tham gia;
   - trạng thái.

2. **Bộ ảnh tour** trong `tour_images`
   - ảnh cover;
   - ảnh chi tiết;
   - thứ tự hiển thị;
   - caption nếu cần.

3. **Lịch trình/địa điểm** trong `tour_locations`
   - tên địa điểm;
   - địa chỉ;
   - tọa độ;
   - thời điểm ghé thăm;
   - ghi chú;
   - thứ tự hành trình.

### 5.2. Trạng thái tour được chọn
Trong Sprint 05, trạng thái nghiệp vụ của tour được chốt như sau:
- `draft`: tour đang soạn hoặc chưa đủ điều kiện public;
- `published`: tour đã sẵn sàng hiển thị công khai;
- `closed`: tour ngừng nhận thêm người tham gia;
- `cancelled`: tour bị hủy.

Trạng thái hiển thị được dùng riêng:
- `visible`;
- `hidden`;
- `flagged`.

Hướng này phù hợp với schema final vì bảng `tours` đã tách riêng `business_status` và `visibility_status`.

### 5.3. Điều kiện hiển thị public của tour
Phương án an toàn cho Sprint 05 là chỉ hiển thị tour công khai khi đồng thời thỏa các điều kiện:
- tour chưa bị xóa mềm;
- `business_status = 'published'`;
- `visibility_status = 'visible'`;
- guide profile liên kết chưa bị xóa mềm;
- guide profile đang ở trạng thái có thể hiển thị ở mức public theo rule đã chốt ở Sprint 04.

Trong phạm vi hiện tại, không biến verification thành điều kiện chặn tuyệt đối nếu điều đó làm nghẽn demo, nhưng badge/trạng thái liên quan phải hiển thị trung thực khi cần.

### 5.4. Cơ chế quản lý ảnh tour
Ảnh tour được triển khai theo hướng:
- mỗi ảnh là một bản ghi trong `tour_images`;
- dùng `sort_order` để xác định thứ tự hiển thị;
- chỉ có tối đa **một ảnh cover** tại một thời điểm;
- khi đổi cover, backend phải bảo đảm reset cover cũ;
- nếu xóa ảnh cover, backend nên ưu tiên chọn ảnh tiếp theo làm cover hoặc trả trạng thái “chưa có cover”.

### 5.5. Cơ chế quản lý lịch trình
Itinerary được triển khai theo hướng:
- lưu tại `tour_locations`;
- `sequence_no` là khóa logic của thứ tự điểm đến;
- frontend thao tác theo danh sách;
- backend kiểm tra:
  - không trùng `sequence_no`;
  - địa điểm có tên;
  - tọa độ nếu có thì phải hợp lệ;
  - `visit_time` nếu có thì đúng định dạng.

### 5.6. Quyền sở hữu tour
Quyền sở hữu tour được xác định duy nhất theo:
- tài khoản hiện tại có role `GUIDE`;
- tài khoản đó có `guide_profile`;
- `guide_profile.id` của tài khoản trùng với `guide_profile_id` của tour.

Frontend không được dựa vào UI ẩn nút để coi như đủ bảo mật. Rule ownership phải được backend kiểm tra ở mọi API ghi dữ liệu.

### 5.7. Phạm vi của `tour_accommodations`
Trong Sprint 05, `tour_accommodations` được giữ ở mức:
- có trong schema;
- hiểu rõ quan hệ dữ liệu;
- có thể seed một số bản ghi mẫu nếu cần;
- chưa bắt buộc mở UI quản lý riêng.

Điều này giúp:
- giữ đồng bộ với schema 38 bảng;
- không phải đập lại dữ liệu về sau;
- nhưng vẫn bảo vệ tiến độ sprint lõi.

### 5.8. Bộ field bắt buộc của form tạo tour
Form tạo/cập nhật tour nên yêu cầu tối thiểu:
- tên tour;
- loại tour;
- tỉnh/thành;
- ngày bắt đầu;
- ngày kết thúc;
- giá;
- số người tối đa;
- điểm hẹn;
- mô tả;
- ít nhất một ảnh hoặc placeholder theo rule UI đã thống nhất.

Các field nâng cao:
- quận/huyện;
- tọa độ điểm hẹn;
- yêu cầu tham gia
có thể cho phép nhập sau, nhưng cấu trúc backend vẫn phải sẵn sàng.

---

### 6. Ghi chú triển khai

- Sprint 05 phải ưu tiên **tạo/sửa tour và itinerary** trước, sau đó mới polish phần hiển thị đẹp.
- Không nên kéo sâu phần lưu trú, thanh toán hoặc moderation vào sprint này.
- Cần tái sử dụng dữ liệu `guide_profile` từ Sprint 04 thay vì tạo luồng độc lập mới.
- Màn hình Guide Area phải có cảm giác “quản lý nội dung thật”, không chỉ là form demo.
- Cần seed ít nhất:
  - tour nháp;
  - tour đã publish;
  - tour đã đóng;
  - tour có nhiều ảnh;
  - tour có nhiều địa điểm.
- Nên thống nhất sớm DTO cho:
  - create tour;
  - update tour;
  - update itinerary;
  - upload image;
  - change status.
- Sprint 05 phải chuẩn bị trực tiếp đầu vào cho Sprint 06:
  - tour đủ chuẩn;
  - trạng thái rõ ràng;
  - chỗ trống hợp lệ;
  - dữ liệu public query ổn định.

---

### 7. Chức năng trọng tâm

Chức năng trọng tâm của Sprint 05 là:

- **F10 – Quản lý tour**

Chức năng này bao gồm:
- tạo tour;
- cập nhật tour;
- quản lý trạng thái tour;
- quản lý bộ ảnh tour;
- quản lý lịch trình/địa điểm tour;
- liên kết tour với hồ sơ hướng dẫn viên;
- chuẩn bị dữ liệu cho public tour, tour request và admin moderation.

Đây là chức năng trung tâm nối tiếp trực tiếp từ:
- F08 Quản lý hồ sơ hướng dẫn viên

và tạo nền cho:
- F11 Quản lý yêu cầu tham gia tour;
- F12 Xem danh sách tour;
- F14 Xem chi tiết tour;
- F15 Xem lộ trình tour trên bản đồ;
- F25 Quản trị dữ liệu tổng thể liên quan tới tour.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình của Sprint 05 phải làm nổi bật được hai chiều:
- **Guide có thể quản lý tour như một thực thể nghiệp vụ hoàn chỉnh**;
- **Tour tạo ra có thể chảy ngược ra Public Area để phục vụ người dùng**.

### 8.2. Các màn hình cần triển khai trong Sprint 05

#### M34 – Danh sách tour của tôi
Mục tiêu:
- cho hướng dẫn viên xem toàn bộ tour của chính mình;
- theo dõi trạng thái từng tour;
- thao tác nhanh sang sửa, quản lý itinerary hoặc đổi trạng thái.

Nội dung hiển thị nên có:
- tiêu đề tour;
- ảnh cover;
- loại tour;
- địa phương;
- ngày bắt đầu/kết thúc;
- giá;
- số lượng người đăng ký hoặc placeholder;
- `business_status`;
- `visibility_status`;
- nút sửa;
- nút ẩn/hiện;
- nút đóng tour;
- liên kết sang quản lý lịch trình.

Yêu cầu:
- có filter tối thiểu theo trạng thái;
- có sort theo ngày tạo hoặc ngày khởi hành nếu còn thời gian;
- phải thể hiện rõ sự khác nhau giữa tour nháp và tour public.

#### M35 – Tạo / cập nhật tour
Mục tiêu:
- là màn hình nghiệp vụ chính để Guide tạo mới hoặc chỉnh sửa tour.

Nội dung hiển thị nên có:
- tên tour;
- loại tour;
- tỉnh/thành;
- quận/huyện;
- thời gian bắt đầu/kết thúc;
- giá;
- đơn vị tiền;
- số chỗ tối đa;
- điểm hẹn;
- tọa độ điểm hẹn nếu có;
- mô tả;
- yêu cầu đối với người tham gia;
- khu vực upload ảnh;
- trạng thái lưu nháp hoặc công khai.

Yêu cầu:
- validate dữ liệu ngay trên form;
- cảnh báo nếu ngày kết thúc nhỏ hơn ngày bắt đầu;
- cảnh báo nếu giá âm hoặc số chỗ không hợp lệ;
- hỗ trợ mở ở hai chế độ:
  - tạo mới;
  - cập nhật.

#### M36 – Quản lý lịch trình / địa điểm tour
Mục tiêu:
- cho phép guide thêm, sửa, xóa và sắp xếp các điểm đến của tour.

Nội dung hiển thị nên có:
- danh sách địa điểm theo thứ tự;
- tên địa điểm;
- địa chỉ;
- tọa độ;
- thời điểm ghé thăm;
- ghi chú;
- nút thêm;
- nút sửa;
- nút xóa;
- drag-and-drop hoặc cơ chế đổi thứ tự đơn giản nếu đủ thời gian.

Yêu cầu:
- phải bảo đảm thứ tự hành trình không bị trùng;
- cập nhật xong thì dữ liệu dùng lại được cho:
  - chi tiết tour;
  - bản đồ lộ trình;
  - phần mô tả hành trình trong public area.

### 8.3. Thành phần UI dùng chung cần tận dụng
Sprint 05 nên tái sử dụng tối đa các component đã có từ Sprint 01–04:
- app layout của Guide Area;
- breadcrumb;
- table hoặc card list;
- modal xác nhận đổi trạng thái;
- upload box;
- badge trạng thái;
- form field;
- date picker;
- loading state;
- empty state;
- confirm dialog.

### 8.4. Kết quả mong đợi của phần màn hình
Sau Sprint 05:
- Guide vào dashboard có thể điều hướng sang cụm tour rõ ràng;
- Guide thấy được danh sách tour của mình;
- Guide tạo được tour mới;
- Guide cập nhật được tour cũ;
- Guide quản lý được itinerary;
- Dữ liệu sau khi lưu phản ánh đúng lên public area nếu đủ điều kiện hiển thị.

---

### 9. Bảng CSDL chính

### 9.1. `tour_categories`

#### Vai trò
Lưu danh mục loại tour để chuẩn hóa dữ liệu phân loại và phục vụ filter/sort về sau.

#### Trường quan trọng
- `id`
- `name`
- `description`
- `is_active`
- `created_at`

#### Vai trò trong Sprint 05
- cung cấp dữ liệu chọn loại tour cho form tạo/cập nhật tour;
- tránh nhập text tự do cho loại tour;
- chuẩn bị cho Public Area và gợi ý tour về sau.

### 9.2. `tours`

#### Vai trò
Là bảng trung tâm lưu thông tin nghiệp vụ chính của tour do hướng dẫn viên tạo.

#### Trường quan trọng
- `id`
- `guide_profile_id`
- `category_id`
- `title`
- `province`
- `district`
- `start_date`
- `end_date`
- `price`
- `currency_code`
- `max_participants`
- `meet_point`
- `meet_latitude`
- `meet_longitude`
- `description`
- `participant_requirements`
- `business_status`
- `visibility_status`
- `published_at`
- `is_deleted`
- `deleted_at`
- `created_at`
- `updated_at`

#### Vai trò trong Sprint 05
- là nơi tạo/sửa dữ liệu tour;
- điều khiển trạng thái nghiệp vụ của tour;
- liên kết trực tiếp với guide profile;
- là đầu vào cho danh sách tour public và chi tiết tour.

### 9.3. `tour_images`

#### Vai trò
Lưu bộ ảnh của tour, bao gồm ảnh cover và ảnh chi tiết.

#### Trường quan trọng
- `id`
- `tour_id`
- `image_url`
- `caption`
- `sort_order`
- `is_cover`
- `created_at`

#### Vai trò trong Sprint 05
- cho phép guide quản lý ảnh tour;
- hỗ trợ hiển thị cover ở:
  - danh sách tour của tôi;
  - danh sách tour public;
  - chi tiết tour;
- tạo chiều sâu demo cho tour thay vì chỉ có dữ liệu text.

### 9.4. `tour_locations`

#### Vai trò
Lưu các điểm đến trong hành trình của tour.

#### Trường quan trọng
- `id`
- `tour_id`
- `sequence_no`
- `location_name`
- `address`
- `latitude`
- `longitude`
- `visit_time`
- `notes`
- `created_at`

#### Vai trò trong Sprint 05
- là dữ liệu chính cho màn hình quản lý lịch trình;
- quyết định khả năng hiển thị itinerary ở chi tiết tour;
- là nền cho tính năng bản đồ ở sprint sau.

### 9.5. `tour_accommodations`

#### Vai trò
Liên kết giữa tour và nơi lưu trú đối tác trong schema tổng thể.

#### Trường quan trọng
- `tour_id`
- `accommodation_id`
- `check_in_date`
- `check_out_date`
- `notes`
- `sort_order`
- `created_at`

#### Vai trò trong Sprint 05
- chủ yếu giữ đúng cấu trúc dữ liệu tổng thể;
- chưa phải trọng tâm UI/UX ở sprint này;
- có thể được chuẩn bị ở mức seed hoặc mô tả tài liệu để tránh vỡ schema sau này.

### 9.6. Bảng hỗ trợ cần lưu ý thêm
Ngoài 5 bảng trọng tâm ở trên, Sprint 05 còn phụ thuộc gián tiếp vào:
- `guide_profiles`: xác định ownership của tour;
- `partner_accommodations`: nếu chuẩn bị quan hệ `tour_accommodations`;
- `tour_requests`: chưa triển khai sâu trong sprint này nhưng là đầu vào của Sprint 06;
- `tour_reviews`: chưa triển khai tạo review, nhưng tour phải được thiết kế tương thích cho review sau này.

### 9.7. Ghi chú triển khai dữ liệu
Cần đặc biệt chú ý các ràng buộc:
- `end_date >= start_date`;
- `price >= 0`;
- `max_participants > 0`;
- mỗi tour chỉ có tối đa một ảnh cover;
- `(tour_id, sequence_no)` trong `tour_locations` phải là duy nhất về mặt logic;
- tọa độ nếu nhập phải nằm trong miền giá trị hợp lệ;
- guide chỉ được tạo tour nếu đã có `guide_profile`.

---

### 10. API cần thiết

### 10.1. `GET /guide/tours`

#### Mục đích
Lấy danh sách tour của chính hướng dẫn viên hiện tại.

#### Query gợi ý
- `status`
- `visibility`
- `page`
- `limit`
- `keyword`

#### Kết quả mong đợi
- chỉ trả về tour thuộc `guide_profile` hiện tại;
- có đủ thông tin list view:
  - tiêu đề;
  - ảnh cover;
  - trạng thái;
  - thời gian;
  - giá;
  - số lượng yêu cầu liên quan nếu có.

### 10.2. `POST /tours`

#### Mục đích
Tạo mới tour cho hướng dẫn viên hiện tại.

#### Request gợi ý
```json
{
  "categoryId": 1,
  "title": "Khám phá Chợ Bến Thành và trung tâm Sài Gòn",
  "province": "TP. Hồ Chí Minh",
  "district": "Quận 1",
  "startDate": "2026-05-10",
  "endDate": "2026-05-10",
  "price": 650000,
  "currencyCode": "VND",
  "maxParticipants": 8,
  "meetPoint": "Cổng chính Chợ Bến Thành",
  "meetLatitude": 10.7725,
  "meetLongitude": 106.6980,
  "description": "Tour trải nghiệm ẩm thực và lịch sử khu trung tâm.",
  "participantRequirements": "Đi bộ mức nhẹ, phù hợp nhóm nhỏ.",
  "businessStatus": "draft",
  "visibilityStatus": "visible"
}
```

#### Kết quả mong đợi
- tạo được bản ghi tour mới gắn đúng `guide_profile_id`;
- validate đầy đủ dữ liệu;
- trả về `id` để frontend điều hướng sang:
  - cập nhật tour;
  - upload ảnh;
  - quản lý lịch trình.

### 10.3. `PATCH /tours/:id`

#### Mục đích
Cập nhật thông tin chính của tour.

#### Request gợi ý
Cho phép cập nhật các trường nghiệp vụ chính như:
- tiêu đề;
- loại tour;
- địa phương;
- thời gian;
- giá;
- số chỗ;
- điểm hẹn;
- mô tả;
- yêu cầu tham gia.

#### Kết quả mong đợi
- chỉ guide sở hữu mới sửa được;
- kiểm tra logic ngày tháng, giá, số chỗ;
- giữ đồng bộ `updated_at`.

### 10.4. `POST /tours/:id/images`

#### Mục đích
Thêm ảnh mới vào tour.

#### Request gợi ý
```json
{
  "imageUrl": "https://example.com/tours/tour-01-cover.jpg",
  "caption": "Ảnh check-in trung tâm thành phố",
  "sortOrder": 0,
  "isCover": true
}
```

#### Kết quả mong đợi
- lưu thêm ảnh vào `tour_images`;
- nếu `isCover = true` thì xử lý đúng rule chỉ có một cover;
- trả lại danh sách ảnh mới nhất hoặc ảnh vừa tạo.

### 10.5. `DELETE /tours/:id/images/:imageId`

#### Mục đích
Xóa ảnh khỏi tour.

#### Kết quả mong đợi
- chỉ xóa được ảnh của tour thuộc quyền sở hữu guide hiện tại;
- nếu ảnh là cover thì backend xử lý rule cover thay thế hoặc phản hồi phù hợp;
- frontend cập nhật danh sách ảnh ngay sau thao tác.

### 10.6. `GET /tours/:id/locations`

#### Mục đích
Lấy itinerary hiện tại của tour.

#### Kết quả mong đợi
- trả về danh sách điểm đến đã sắp theo `sequence_no`;
- phục vụ cho:
  - màn hình quản lý itinerary;
  - chi tiết tour;
  - bản đồ lộ trình sau này.

### 10.7. `PUT /tours/:id/locations`

#### Mục đích
Cập nhật toàn bộ danh sách địa điểm của tour.

#### Request gợi ý
```json
{
  "locations": [
    {
      "sequenceNo": 1,
      "locationName": "Nhà thờ Đức Bà",
      "address": "01 Công xã Paris, Quận 1",
      "latitude": 10.7798,
      "longitude": 106.6990,
      "visitTime": "2026-05-10T08:30:00+07:00",
      "notes": "Điểm dừng đầu tiên"
    },
    {
      "sequenceNo": 2,
      "locationName": "Bưu điện Thành phố",
      "address": "02 Công xã Paris, Quận 1",
      "latitude": 10.7801,
      "longitude": 106.6993,
      "visitTime": "2026-05-10T09:30:00+07:00",
      "notes": "Chụp ảnh và tham quan kiến trúc"
    }
  ]
}
```

#### Kết quả mong đợi
- itinerary được lưu đúng thứ tự;
- không trùng `sequence_no`;
- dữ liệu cũ được cập nhật theo cơ chế rõ ràng;
- frontend có thể render ngay sau khi lưu.

### 10.8. `PATCH /tours/:id/status`

#### Mục đích
Thay đổi trạng thái nghiệp vụ của tour.

#### Request gợi ý
```json
{
  "businessStatus": "published"
}
```

#### Kết quả mong đợi
- backend kiểm tra điều kiện trước khi publish;
- có thể set `published_at` nếu lần đầu public;
- chặn chuyển trạng thái không hợp lệ.

### 10.9. API hỗ trợ nên cân nhắc thêm
Nếu còn thời gian, nên bổ sung:
- `GET /tour-categories`
- `GET /tours/:id`
- `PATCH /tours/:id/visibility`
- `POST /tours/:id/images/reorder` hoặc xử lý reorder trong cùng API ảnh

Các API này không nhất thiết phải tách hết trong Sprint 05, nhưng nên được nghĩ sẵn để giảm sửa về sau.

### 10.10. Yêu cầu kỹ thuật chung cho API
Toàn bộ API của Sprint 05 cần bảo đảm:
- kiểm tra `GUIDE` role;
- kiểm tra ownership theo `guide_profile_id`;
- validate DTO chặt;
- response format thống nhất với các sprint trước;
- thông báo lỗi dễ hiểu cho frontend;
- không để frontend tự suy luận business rule quan trọng.

---

### 11. Công việc frontend

### 11.1. Dựng cụm màn hình tour trong Guide Area
Cần hoàn thiện route và điều hướng cho:
- `/guide/tours`
- `/guide/tours/create`
- `/guide/tours/:id/edit`
- `/guide/tours/:id/locations`

Guide Area phải tạo cảm giác là khu vực làm việc thật, không phải các màn hình rời rạc.

### 11.2. Dựng danh sách tour của tôi
Cần làm:
- list/card tour;
- trạng thái hiển thị bằng badge;
- nút tạo tour mới;
- action sửa tour;
- action đổi trạng thái;
- link sang quản lý lịch trình.

Nên hỗ trợ:
- empty state khi chưa có tour;
- loading state;
- filter trạng thái tối thiểu.

### 11.3. Dựng form tạo/cập nhật tour
Cần làm rõ:
- nhóm field thông tin chính;
- nhóm field thời gian;
- nhóm field giá và sức chứa;
- nhóm field điểm hẹn;
- nhóm field mô tả và yêu cầu tham gia;
- nhóm upload ảnh.

Phải có validate ở UI cho:
- ngày tháng;
- số tiền;
- số lượng;
- field bắt buộc.

### 11.4. Dựng khu vực upload ảnh tour
Frontend cần:
- chọn ảnh;
- hiển thị preview;
- đánh dấu cover;
- xóa ảnh;
- sắp xếp ảnh ở mức tối thiểu.

Trong đồ án sinh viên, có thể dùng upload đơn giản theo URL hoặc giả lập upload trước nếu hạ tầng file chưa hoàn chỉnh, nhưng cấu trúc màn hình phải sẵn sàng cho cách làm đúng.

### 11.5. Dựng màn hình quản lý itinerary
Cần cho phép:
- thêm item mới;
- sửa item;
- xóa item;
- đổi thứ tự item;
- nhập địa chỉ, tọa độ, thời gian ghé thăm, ghi chú.

Nếu chưa kịp drag-and-drop, có thể dùng `sequence_no` trực tiếp kèm nút tăng/giảm thứ tự.

### 11.6. Đồng bộ trạng thái tour trên UI
Badge và nút thao tác phải phản ánh rõ:
- draft;
- published;
- closed;
- cancelled;
- visible;
- hidden;
- flagged.

Không được trộn lẫn hai lớp trạng thái vào một label mơ hồ.

### 11.7. Chuẩn hóa trải nghiệm nhập liệu
Cần làm tốt:
- auto focus hợp lý;
- thông báo lỗi gần field;
- cảnh báo trước khi thoát nếu chưa lưu;
- confirm dialog khi đóng/hủy tour;
- giữ lại dữ liệu form khi validate lỗi.

### 11.8. Test flow phía frontend
Cần test tối thiểu:
- guide chưa có tour nào;
- guide tạo tour mới;
- guide sửa tour;
- guide thêm ảnh;
- guide xóa ảnh;
- guide cập nhật itinerary;
- guide publish tour thành công;
- public area thấy tour đúng rule.

### 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 05, frontend phải cho cảm giác:
- Guide tự quản trị được tour của mình;
- dữ liệu nhập có kiểm soát;
- màn hình đủ rõ ràng để demo trước giảng viên;
- có thể nối ngay với Sprint 06 mà không phải đập lại UI.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `tours`
Backend cần tách rõ module tour, bao gồm:
- controller;
- service;
- DTO create/update;
- DTO change status;
- DTO update locations;
- service quản lý ảnh.

### 12.2. Kiểm tra role và ownership
Tất cả API ghi dữ liệu phải kiểm tra:
- user hiện tại có role `GUIDE`;
- user hiện tại có `guide_profile`;
- tour đang thao tác thuộc đúng `guide_profile_id`.

### 12.3. Xử lý create/update tour
Backend phải:
- validate field bắt buộc;
- kiểm tra ngày hợp lệ;
- kiểm tra `max_participants > 0`;
- kiểm tra `price >= 0`;
- xử lý đúng `business_status` và `visibility_status`;
- set `published_at` khi publish hợp lệ.

### 12.4. Xử lý quản lý ảnh tour
Backend cần:
- thêm ảnh;
- xóa ảnh;
- kiểm tra ảnh thuộc đúng tour;
- bảo đảm một tour không có nhiều cover cùng lúc;
- hỗ trợ sort nếu cần.

### 12.5. Xử lý itinerary
Backend phải:
- đọc danh sách location mới;
- kiểm tra uniqueness của `sequence_no`;
- kiểm tra miền giá trị tọa độ;
- lưu theo thứ tự logic;
- bảo đảm itinerary luôn nhất quán sau cập nhật.

### 12.6. Xử lý đổi trạng thái tour
Backend cần cho phép guide đổi trạng thái trong phạm vi cho phép, ví dụ:
- draft -> published;
- published -> closed;
- published -> cancelled;
- closed -> cancelled.

Không nên cho phép state flow quá tự do nếu chưa định nghĩa rõ.

### 12.7. Chuẩn hóa query public dùng lại cho Sprint 03
Sau khi Sprint 05 hoàn thành, backend nên bảo đảm public query của Sprint 03:
- lấy đúng tour đã publish;
- có cover image;
- có guide profile hợp lệ;
- có itinerary nếu cần.

Điều này giúp dữ liệu Guide tạo ra chảy đúng ra Public Area.

### 12.8. Logging và xử lý lỗi
Cần ghi log đủ dùng cho:
- tạo tour;
- cập nhật tour;
- xóa ảnh;
- đổi trạng thái;
- cập nhật itinerary.

Thông báo lỗi nên phân biệt rõ:
- không đủ quyền;
- không tìm thấy tour;
- dữ liệu đầu vào sai;
- tour chưa đủ điều kiện publish.

### 12.9. Chuẩn bị nền cho Sprint 06
Backend của Sprint 05 phải giúp Sprint 06 dễ triển khai hơn bằng cách:
- bảo đảm tour có trạng thái rõ ràng;
- bảo đảm chỗ tối đa lưu đúng;
- bảo đảm ownership của guide đã chắc;
- bảo đảm public detail của tour đã đủ dữ liệu.

### 12.10. Kết quả mong đợi phía backend
Kết thúc Sprint 05, backend phải cho phép:
- guide tạo tour;
- guide cập nhật tour;
- guide upload/xóa ảnh;
- guide cập nhật itinerary;
- guide đổi trạng thái tour;
- public area lấy tour đúng rule hiển thị.

---

### 13. Công việc database

### 13.1. Seed danh mục tour
Cần seed `tour_categories` với số lượng vừa đủ để demo, ví dụ:
- city tour;
- food tour;
- historical tour;
- eco tour;
- adventure tour.

Không cần quá nhiều loại, nhưng phải đủ để nhìn hệ thống có chiều sâu.

### 13.2. Seed tour mẫu
Cần seed tối thiểu:
- tour nháp;
- tour đã publish;
- tour đã đóng;
- tour có 1 ảnh;
- tour có nhiều ảnh;
- tour có 2–4 địa điểm trong itinerary.

### 13.3. Seed ảnh tour mẫu
`tour_images` nên có dữ liệu cho:
- cover image;
- ảnh gallery;
- sort order rõ ràng;
- trường hợp tour chưa có nhiều ảnh để test empty state.

### 13.4. Seed itinerary mẫu
`tour_locations` nên có:
- các điểm đến thứ tự rõ ràng;
- một số tour có `visit_time`;
- một số tour có tọa độ để test map về sau;
- ghi chú ngắn để chi tiết tour nhìn thuyết phục hơn.

### 13.5. Kiểm tra toàn vẹn dữ liệu
Cần xác nhận lại:
- `end_date >= start_date`;
- `max_participants > 0`;
- `price >= 0`;
- một tour không có hai cover image;
- `sequence_no` không trùng trong cùng một tour;
- dữ liệu tour không tồn tại nếu thiếu `guide_profile_id` hợp lệ.

### 13.6. Tối ưu index
Các index quan trọng của cụm tour cần được bảo đảm:
- `guide_profile_id`;
- `category_id`;
- nhóm public search;
- `tour_id, sort_order` ở `tour_images`;
- `tour_id, sequence_no` ở `tour_locations`.

### 13.7. Giữ `tour_accommodations` đúng schema nhưng không code sâu
Database nên giữ nguyên bảng `tour_accommodations` trong schema chính thức để:
- không lệch tài liệu;
- không phải sửa ERD sau này;
- sẵn sàng mở rộng cho sprint hoàn thiện hoặc mở rộng.

Có thể chưa cần seed sâu nếu không dùng trong demo chính của Sprint 05.

### 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 05, database phải:
- có danh mục tour chuẩn;
- có tour mẫu đủ sâu;
- có ảnh tour và itinerary có thể demo thật;
- có ràng buộc bảo vệ dữ liệu quan trọng;
- sẵn sàng cho Sprint 06 dùng tiếp.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
Cần cập nhật:
- mô tả chức năng F10 Quản lý tour;
- mô tả Guide Area liên quan tới tour;
- mô tả các màn hình M34, M35, M36;
- mô tả bảng `tours`, `tour_images`, `tour_locations`, `tour_categories`, `tour_accommodations`;
- mapping API tour.

### 14.2. Activity Diagram cần cập nhật
Cần hoàn thiện ít nhất các activity sau:
- tạo tour;
- cập nhật tour;
- đổi trạng thái tour;
- quản lý ảnh tour;
- quản lý lịch trình/địa điểm tour.

### 14.3. Nội dung nên mô tả rõ trong UML
Trong UML cần làm rõ:
- actor là Guide;
- tiền điều kiện là đã có role `GUIDE` và có `guide_profile`;
- dữ liệu đầu vào của tour;
- nhánh validate lỗi;
- nhánh lưu nháp;
- nhánh publish;
- nhánh cập nhật itinerary;
- hậu điều kiện là tour được lưu hợp lệ và sẵn sàng hiển thị công khai nếu đủ điều kiện.

### 14.4. Mục tiêu của phần tài liệu/UML
Phần tài liệu/UML của Sprint 05 phải giúp người đọc hiểu được:
- Guide tạo tour như thế nào;
- tour gồm những thành phần dữ liệu nào;
- dữ liệu chảy từ Guide Area ra Public Area ra sao;
- vì sao Sprint 06 có thể nối tiếp vào luồng yêu cầu tham gia tour.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- Guide tạo được tour mới.
- Guide cập nhật được tour đã có.
- Guide quản lý được ảnh tour.
- Guide quản lý được lịch trình/địa điểm tour.
- Guide đổi được trạng thái tour trong phạm vi cho phép.

### 15.2. Đầu ra giao diện
- Có màn hình danh sách tour của tôi.
- Có màn hình tạo/cập nhật tour.
- Có màn hình quản lý lịch trình/địa điểm tour.
- Badge trạng thái hiển thị rõ ràng.
- Guide Area điều hướng mạch lạc hơn.

### 15.3. Đầu ra API
- `GET /guide/tours`
- `POST /tours`
- `PATCH /tours/:id`
- `POST /tours/:id/images`
- `DELETE /tours/:id/images/:imageId`
- `GET /tours/:id/locations`
- `PUT /tours/:id/locations`
- `PATCH /tours/:id/status`

### 15.4. Đầu ra dữ liệu
- Có seed `tour_categories`.
- Có tour mẫu đủ nhiều trạng thái.
- Có ảnh tour và itinerary mẫu.
- Dữ liệu public area lấy đúng từ tour do guide tạo.

### 15.5. Đầu ra tài liệu
- Cập nhật mô tả chức năng F10.
- Cập nhật mô tả màn hình M34, M35, M36.
- Cập nhật UML liên quan đến tour.
- Cập nhật mô tả bảng dữ liệu cụm tour.

### 15.6. Tiêu chí sẵn sàng sang Sprint 06
Sprint 05 chỉ nên được xem là sẵn sàng bàn giao sang Sprint 06 khi:
- có ít nhất một tour `published` hiển thị public;
- tour có đủ ảnh và itinerary;
- guide ownership đã kiểm tra chắc;
- public detail lấy đúng dữ liệu;
- trạng thái tour rõ ràng;
- có dữ liệu đủ để user gửi yêu cầu tham gia tour ở sprint sau.

---

### 16. Kết luận sprint

Sprint 05 là sprint biến hệ thống từ mức **“có hướng dẫn viên”** sang mức **“hướng dẫn viên có thể tạo sản phẩm du lịch thật”**. Đây là bước trưởng thành rất quan trọng của toàn bộ đồ án, vì từ thời điểm này:
- Public Area có dữ liệu tour thật để hiển thị;
- Guide Area có nghiệp vụ quản trị nội dung rõ ràng;
- Sprint 06 có thể triển khai luồng đăng ký tham gia tour trên dữ liệu thật;
- phần demo của đề tài trở nên thuyết phục hơn nhiều.

Nếu Sprint 05 được thực hiện đúng trọng tâm, bạn sẽ có một nền rất tốt để nối tiếp chuỗi giá trị chính của hệ thống:
**Guide tạo tour → tour hiển thị công khai → user xem tour → user gửi yêu cầu tham gia → guide xử lý yêu cầu**.

---

<a id="sprint-06"></a>
## SPRINT 06 – Triển khai yêu cầu tham gia tour

### 1. Mục tiêu sprint

Sprint 06 là sprint hoàn thiện **luồng nghiệp vụ trung tâm đầu tiên** của toàn bộ đồ án: **khách du lịch xem chi tiết tour → gửi yêu cầu tham gia tour → hướng dẫn viên tiếp nhận và xử lý yêu cầu**. Sau Sprint 03 đã có khu vực public cho tour, Sprint 04 đã có hồ sơ hướng dẫn viên, và Sprint 05 đã cho hướng dẫn viên tạo được tour thật, Sprint 06 phải làm cho các phần đó **liên kết thành một flow vận hành hoàn chỉnh**.

Đây là sprint có giá trị demo rất cao vì nó thể hiện rõ bản chất của đề tài: hệ thống không chỉ dừng ở việc hiển thị tour, mà còn hỗ trợ **kết nối thực sự giữa người muốn tham gia tour và người tổ chức tour** thông qua cơ chế request có trạng thái, có kiểm tra quyền, có phản hồi xử lý và có thông báo.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F11:** Quản lý yêu cầu tham gia tour
- Hoàn thành **luồng lõi đầu tiên có tính khép kín** của hệ thống:
  - người dùng xem tour;
  - gửi yêu cầu tham gia;
  - theo dõi trạng thái yêu cầu của mình;
  - hướng dẫn viên xem toàn bộ yêu cầu liên quan tới tour của mình;
  - hướng dẫn viên duyệt hoặc từ chối yêu cầu;
  - hệ thống cập nhật trạng thái và tạo thông báo.
- Chuẩn hóa **state machine của `tour_requests`** để frontend, backend, database và UML bám cùng một logic.
- Tạo nền cho các sprint sau như:
  - đánh giá tour / hướng dẫn viên;
  - thanh toán tour;
  - thông báo thời gian thực;
  - quản trị nội dung và báo cáo vận hành.

#### Ý nghĩa của sprint này
Sprint 06 là mốc chứng minh rằng hệ thống đã đi qua được một chuỗi nghiệp vụ thật, không còn là các module rời rạc. Nếu Sprint 05 chứng minh guide có thể tạo tour, thì Sprint 06 chứng minh **tour đó có thể được người dùng tương tác và xử lý theo đúng vòng đời nghiệp vụ**.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Phải chốt state machine của `tour_requests` ngay từ đầu
Sprint 06 là sprint rất nhạy cảm về trạng thái. Nếu không chốt rõ `tour_requests.status` từ đầu thì:
- frontend sẽ không biết nút nào được hiển thị ở từng trạng thái;
- backend sẽ dễ cho phép chuyển trạng thái sai;
- dữ liệu demo sẽ bị lẫn lộn;
- UML sẽ không phản ánh đúng nghiệp vụ.

Vì vậy, trước khi code phải thống nhất rõ:
- trạng thái khởi tạo là gì;
- ai có quyền chuyển trạng thái;
- điều kiện nào cho phép duyệt;
- điều kiện nào cho phép từ chối;
- điều kiện nào cho phép hủy;
- trạng thái nào chỉ để dành cho sprint thanh toán sau này.

### 2.2. Sprint này phụ thuộc trực tiếp vào Sprint 03, 04 và 05
Sprint 06 chỉ có thể chạy trơn tru nếu các sprint trước đã ổn định:
- Sprint 03 phải có `M06 Chi tiết tour` và dữ liệu public tour hoạt động đúng;
- Sprint 04 phải có guide profile để xác định chủ tour;
- Sprint 05 phải có tour thật, ảnh tour, itinerary và ownership rõ ràng;
- Sprint 02 phải có auth và role guard ổn định.

Nếu đầu vào từ các sprint trước chưa chắc, Sprint 06 sẽ rất dễ phát sinh lỗi dây chuyền.

### 2.3. Không được làm hỏng trải nghiệm public của `M06 Chi tiết tour`
Form gửi yêu cầu tham gia là phần mở rộng trên màn hình chi tiết tour, nhưng **không được làm M06 trở nên rối và nặng**. Mục tiêu của màn hình này vẫn là giúp người dùng đọc và hiểu tour trước. Khối request phải:
- gọn;
- rõ điều kiện;
- hiển thị trạng thái dễ hiểu;
- chỉ mở rộng khi người dùng đã đăng nhập và có quyền thao tác.

### 2.4. Kiểm tra quyền và ownership phải chặt hơn các sprint trước
Ở Sprint 06, sai quyền không chỉ gây lỗi hiển thị mà còn làm sai nghiệp vụ:
- người dùng không được gửi request vào tour không hợp lệ;
- người dùng không được duyệt request của người khác;
- hướng dẫn viên chỉ được xử lý request thuộc tour do mình quản lý;
- user không được sửa hoặc hủy yêu cầu sau khi đã qua trạng thái không còn hợp lệ.

Vì vậy, tầng backend phải coi ownership và state validation là kiểm tra bắt buộc, không chỉ là kiểm tra giao diện.

### 2.5. “Xong sprint” không phải chỉ là gửi request thành công
Sprint 06 chỉ được xem là hoàn thành khi đạt đủ:
- có API tạo request và xử lý request chạy được;
- có màn hình user theo dõi request đã gửi;
- có màn hình guide quản lý request;
- có dữ liệu demo đa trạng thái;
- có flow kiểm thử tối thiểu;
- có UML cập nhật theo đúng luồng gửi yêu cầu và duyệt / từ chối yêu cầu.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. State machine của `tour_requests`
Cần xác định rõ hệ trạng thái dùng trong hệ thống. Theo schema final, bảng `tour_requests` cho phép các trạng thái:
- `pending`
- `approved`
- `rejected`
- `cancelled_by_user`
- `cancelled_by_guide`
- `payment_pending`
- `paid`

Tuy nhiên, không nhất thiết Sprint 06 phải hiện thực sâu toàn bộ vòng đời thanh toán. Cần chốt rõ:
- trạng thái nào là **lõi bắt buộc** của Sprint 06;
- trạng thái nào chỉ cần **giữ tương thích schema** cho sprint sau.

### 3.2. Điều kiện để người dùng được gửi yêu cầu
Cần chốt rõ những ràng buộc khi tạo request:
- tour phải tồn tại;
- tour không bị xóa mềm;
- tour phải ở trạng thái có thể nhận người tham gia;
- tour phải đủ chỗ;
- user không phải là chủ tour;
- user chưa có một request đang còn hiệu lực cho chính tour đó;
- số lượng người đi cùng (`participant_count`) phải hợp lệ.

### 3.3. Cách tính số chỗ còn lại của tour
Cần xác định chỗ trống được tính theo:
- số request đã gửi;
- hay chỉ tính các request đã được duyệt;
- có trừ theo `participant_count` hay chỉ theo số request;
- khi user hủy hoặc guide từ chối thì có trả lại chỗ hay không.

Đây là chỗ rất dễ sai nếu frontend và backend không dùng cùng một nguyên tắc.

### 3.4. Quy tắc hủy yêu cầu
Cần chốt user được hủy trong trường hợp nào:
- chỉ khi request còn `pending`;
- hay cho phép hủy cả khi `approved` nhưng chưa thanh toán;
- có cho guide chủ động hủy request trong tình huống đặc biệt hay không;
- khi hủy có bắt buộc nhập lý do hay không.

### 3.5. Cách duyệt yêu cầu của hướng dẫn viên
Cần quyết định rõ hướng dẫn viên khi xử lý request:
- duyệt trực tiếp thành `approved`;
- hay chuyển sang `payment_pending`;
- có bắt buộc nhập `response_note` khi từ chối hay không;
- có giới hạn duyệt khi số chỗ còn lại không đủ hay không.

### 3.6. Cách tạo thông báo
Sprint này có liên quan đến `notifications`, nên cần xác định:
- tạo thông báo cho guide khi user gửi request;
- tạo thông báo cho user khi guide duyệt / từ chối;
- có tạo thông báo khi user tự hủy hay không;
- notification dùng loại nào, entity nào và payload nào để sau này dễ mở rộng real-time.

### 3.7. Phạm vi của thanh toán trong Sprint 06
Schema đã chuẩn bị `payment_pending` và `paid`, nhưng thanh toán là một phân hệ riêng ở sprint sau. Vì vậy phải chốt:
- Sprint 06 chỉ làm **flow request lõi**;
- thanh toán chưa triển khai đầy đủ;
- trạng thái `payment_pending` và `paid` chỉ được **giữ sẵn trong thiết kế** hoặc seed để không phá schema về sau.

---

### 4. Hạng mục cần chốt

Trong Sprint 06, các hạng mục cần chốt trước khi code gồm:
- state machine chính thức của `tour_requests`;
- điều kiện hợp lệ để gửi yêu cầu tham gia tour;
- nguyên tắc tính sức chứa còn lại của tour;
- quy tắc hủy yêu cầu của user;
- quy tắc duyệt / từ chối yêu cầu của guide;
- cách lưu `response_note`, `processed_at`, `processed_by_user_id`;
- chiến lược tạo notification ở mức cơ bản;
- phạm vi của trạng thái liên quan đến thanh toán trong sprint này;
- danh sách màn hình phải hoàn tất;
- checklist “xong Sprint 06”.

---

### 5. Phương án được chọn

### 5.1. State machine được chọn cho Sprint 06
Trong Sprint 06, hệ thống sử dụng đầy đủ tập trạng thái của schema để bảo đảm tương thích dài hạn:

- `pending`
- `approved`
- `rejected`
- `cancelled_by_user`
- `cancelled_by_guide`
- `payment_pending`
- `paid`

Tuy nhiên, **phần nghiệp vụ bắt buộc hiện thực thật trong Sprint 06** chỉ tập trung vào các chuyển trạng thái sau:
- `pending` → `approved`
- `pending` → `rejected`
- `pending` → `cancelled_by_user`

Ngoài ra:
- `cancelled_by_guide` được giữ như một hướng mở rộng có thể dùng trong trường hợp guide chủ động đóng request vì lý do nghiệp vụ;
- `payment_pending` và `paid` được giữ đúng schema, có thể seed dữ liệu mô phỏng, nhưng **không bắt buộc làm sâu trong UI/flow của Sprint 06**.

Cách chọn này giúp sprint bám đúng nguyên tắc:
- **lõi trước, mở rộng sau**;
- không phá thiết kế CSDL đã chốt;
- vẫn giữ được khả năng nối sang sprint thanh toán sau này.

### 5.2. Điều kiện gửi request được chọn
Người dùng được gửi yêu cầu tham gia tour khi thỏa các điều kiện sau:
- đã đăng nhập;
- có role người dùng hợp lệ;
- tour tồn tại;
- tour không bị xóa mềm;
- tour có `business_status = published`;
- tour có `visibility_status = visible`;
- guide của tour vẫn ở trạng thái profile hợp lệ để tiếp nhận tour;
- tổng số chỗ đã được duyệt cộng với `participant_count` mới không vượt `max_participants`;
- người gửi chưa có request đang còn hiệu lực cho cùng tour.

Nếu vi phạm bất kỳ điều kiện nào, backend trả lỗi nghiệp vụ rõ ràng để frontend hiển thị thông báo đúng ngữ cảnh.

### 5.3. Cách tính sức chứa được chọn
Sức chứa còn lại của tour được tính theo tổng `participant_count` của các request đang ở trạng thái **đã chiếm chỗ thực sự**, tối thiểu gồm:
- `approved`
- có thể mở rộng thêm `payment_pending` nếu về sau thanh toán được tích hợp ngay sau bước duyệt

Trong phạm vi Sprint 06:
- luồng chính lấy tổng người từ request `approved`;
- request `pending`, `rejected`, `cancelled_by_user`, `cancelled_by_guide` không chiếm chỗ;
- nếu đã seed `payment_pending` để test trước, backend phải xem rõ trạng thái này có chiếm chỗ hay không theo một rule thống nhất trong service.

Phương án khuyến nghị cho sprint này:
- **`approved` chiếm chỗ**
- **`payment_pending` được giữ tương thích nhưng chưa đưa thành logic chính bắt buộc**

### 5.4. Quy tắc hủy yêu cầu được chọn
Trong Sprint 06, user được phép hủy request khi request vẫn đang ở trạng thái:
- `pending`

Nếu muốn an toàn hơn trong giai đoạn đầu, không nên cho phép hủy khi request đã `approved`, vì điều đó sẽ kéo theo các câu hỏi về hoàn chỗ, hoàn thanh toán và lịch sử tham gia.

Khi user hủy:
- cập nhật `status = cancelled_by_user`;
- ghi `cancelled_at`;
- cập nhật `updated_at`;
- có thể tạo notification cho guide nếu muốn tăng tính minh bạch của flow.

### 5.5. Quy tắc xử lý request của guide được chọn
Guide chỉ được xử lý request khi:
- guide đã đăng nhập;
- có role `GUIDE`;
- tour của request thuộc guide đó;
- request đang ở trạng thái `pending`.

Guide có hai thao tác chính:
- duyệt → `approved`
- từ chối → `rejected`

Khi xử lý:
- ghi `processed_at`;
- ghi `processed_by_user_id`;
- cho phép lưu `response_note` để giải thích kết quả, đặc biệt hữu ích khi từ chối.

### 5.6. Cơ chế notification được chọn
Trong Sprint 06, notification được triển khai ở mức cơ bản nhưng đủ dùng:
- khi user gửi request:
  - tạo notification cho guide;
- khi guide duyệt / từ chối:
  - tạo notification cho user.

Bản ghi notification nên chứa:
- `notification_type = 'tour_request'`
- `entity_type = 'tour_requests'` hoặc giá trị tương đương thống nhất trong backend
- `entity_id = id của request`
- `payload` chứa các thông tin nhẹ như:
  - `tourId`
  - `tourTitle`
  - `status`
  - `actorUserId`

### 5.7. Phạm vi thanh toán được chọn
Sprint 06 **không triển khai sâu thanh toán**. Mục tiêu vẫn là hoàn tất flow request lõi. Vì vậy:
- UI không cần dựng flow thanh toán thật;
- API request không bắt buộc gắn payment flow;
- `payment_pending` và `paid` chỉ cần giữ trong schema / dữ liệu seed / tài liệu mô tả để không phải refactor ở sprint sau.

### 5.8. Quy tắc hiển thị nút thao tác được chọn
Trên giao diện:
- ở `M06 Chi tiết tour`:
  - user chưa đăng nhập: hiển thị CTA đăng nhập để gửi yêu cầu;
  - user đã đăng nhập và đủ điều kiện: hiển thị form gửi yêu cầu;
  - user đã có request còn hiệu lực: không cho gửi trùng;
  - guide là chủ tour: không hiển thị nút gửi yêu cầu.
- ở `M21 Yêu cầu tham gia tour của tôi`:
  - chỉ cho hủy khi trạng thái `pending`;
  - các trạng thái khác hiển thị read-only.
- ở `M37 Quản lý yêu cầu tham gia tour`:
  - chỉ hiển thị nút duyệt / từ chối với request `pending`;
  - request đã xử lý chỉ hiển thị trạng thái và thông tin xử lý.

---

### 6. Ghi chú triển khai

Kết thúc Sprint 06, hệ thống phải đạt được một flow đủ mạnh để demo:
1. người dùng truy cập chi tiết tour;
2. gửi yêu cầu tham gia thành công;
3. mở “Yêu cầu tham gia tour của tôi” để xem request vừa gửi;
4. hướng dẫn viên đăng nhập vào khu vực quản lý request;
5. duyệt hoặc từ chối một request;
6. người dùng quay lại và thấy trạng thái được cập nhật;
7. hệ thống có notification cơ bản tương ứng.

Ngoài ra, Sprint 06 cần giữ tinh thần:
- không mở rộng quá sớm sang thanh toán thật;
- không làm UI quá nặng;
- không phá dữ liệu tour public đã có;
- ưu tiên tính đúng nghiệp vụ hơn là làm nhiều tính năng phụ.

---

### 7. Chức năng trọng tâm

Sprint 06 tập trung vào một nhóm chức năng duy nhất:

- **F11 – Quản lý yêu cầu tham gia tour**

Trong phạm vi sprint này, F11 được tách thành ba cụm thao tác chính:

1. **Người dùng gửi yêu cầu tham gia tour**
   - gửi từ `M06 Chi tiết tour`;
   - nhập số lượng người tham gia;
   - nhập ghi chú nếu cần;
   - hệ thống kiểm tra điều kiện nghiệp vụ trước khi lưu.

2. **Người dùng theo dõi và hủy yêu cầu của mình**
   - xem danh sách request đã gửi tại `M21`;
   - xem trạng thái hiện tại của từng request;
   - hủy request còn đang chờ xử lý.

3. **Hướng dẫn viên quản lý yêu cầu liên quan tới tour của mình**
   - xem danh sách request theo tour hoặc theo trạng thái tại `M37`;
   - duyệt hoặc từ chối;
   - nhập phản hồi ngắn;
   - hệ thống cập nhật trạng thái và gửi thông báo.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần giao diện của Sprint 06 phải làm được hai việc đồng thời:
- biến `M06` từ màn hình xem tour thành màn hình có thể **bắt đầu giao dịch nghiệp vụ**;
- tạo hai khu vực quản lý riêng để user và guide theo dõi cùng một request từ hai góc nhìn khác nhau.

### 8.2. Các màn hình cần triển khai trong Sprint 06

#### M06 – Chi tiết tour (mở rộng phần gửi yêu cầu tham gia)
Đây là điểm bắt đầu của flow request. Trong Sprint 06, `M06` cần bổ sung thêm:
- khối CTA gửi yêu cầu tham gia;
- form nhỏ gồm:
  - `participantCount`
  - `note`
- trạng thái điều kiện tham gia:
  - còn chỗ / hết chỗ;
  - đã đăng nhập / chưa đăng nhập;
  - đã gửi request trước đó hay chưa;
- thông báo thành công / thất bại sau khi gửi;
- điều hướng hoặc liên kết nhanh tới `M21 Yêu cầu tham gia tour của tôi`.

Khối này phải được đặt ở vị trí hợp lý để không phá luồng đọc nội dung tour.

#### M21 – Yêu cầu tham gia tour của tôi
Đây là màn hình phía user dùng để theo dõi toàn bộ request đã gửi. Màn hình nên có:
- danh sách request dạng table hoặc card;
- các cột/trường hiển thị chính:
  - tên tour;
  - ngày gửi;
  - số lượng người;
  - trạng thái;
  - ghi chú gửi đi;
  - ghi chú phản hồi từ guide;
  - thời điểm xử lý;
- bộ lọc theo trạng thái;
- nút hủy request nếu request còn `pending`;
- empty state rõ ràng nếu user chưa gửi request nào.

#### M37 – Quản lý yêu cầu tham gia tour
Đây là màn hình phía guide để xử lý request liên quan tới tour mình quản lý. Màn hình cần có:
- danh sách request;
- bộ lọc theo:
  - tour;
  - trạng thái;
  - thời gian gửi;
- vùng hiển thị thông tin người gửi;
- hiển thị `participant_count`, `note`, trạng thái hiện tại;
- vùng nhập `response_note`;
- nút:
  - duyệt;
  - từ chối;
- trạng thái xử lý xong phải được phản ánh ngay trên UI.

### 8.3. Thành phần UI dùng chung cần tận dụng
Sprint 06 nên tận dụng lại các component đã có từ Sprint 01–05:
- table / data grid;
- badge trạng thái;
- modal xác nhận;
- textarea input;
- empty state;
- loading state;
- toast notification;
- filter bar;
- pagination nếu cần.

Không nên dựng một UI framework mới chỉ cho request flow này.

### 8.4. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 06:
- `M06` có thể gửi request thật;
- `M21` theo dõi được request của user theo trạng thái;
- `M37` giúp guide xử lý request dễ hiểu và đúng quyền;
- các màn hình phản ánh nhất quán cùng một trạng thái dữ liệu.

---

### 9. Bảng CSDL chính

### 9.1. `tour_requests`

#### Vai trò
Đây là bảng lõi của Sprint 06, dùng để lưu toàn bộ yêu cầu tham gia tour do user gửi.

#### Trường quan trọng
- `id`
- `tour_id`
- `user_id`
- `participant_count`
- `note`
- `response_note`
- `status`
- `requested_at`
- `processed_at`
- `processed_by_user_id`
- `cancelled_at`
- `created_at`
- `updated_at`

#### Vai trò trong Sprint 06
- tạo mới request;
- theo dõi trạng thái xử lý;
- lưu ghi chú từ user và phản hồi từ guide;
- ghi nhận thời điểm xử lý / hủy;
- làm căn cứ cho các sprint sau như payment, review và báo cáo.

### 9.2. `tours`

#### Vai trò
Là bảng nguồn để xác định request đang gửi vào tour nào và tour đó có hợp lệ hay không.

#### Trường quan trọng
- `id`
- `guide_profile_id`
- `title`
- `max_participants`
- `business_status`
- `visibility_status`
- `published_at`
- `is_deleted`
- `deleted_at`

#### Vai trò trong Sprint 06
- kiểm tra tour có được phép nhận request hay không;
- xác định sức chứa tối đa;
- xác định ownership của guide thông qua `guide_profile_id`;
- hiển thị thông tin tour trên màn hình user và guide.

### 9.3. `users`

#### Vai trò
Lưu hồ sơ nghiệp vụ của user và guide.

#### Trường quan trọng
- `id`
- `email`
- `full_name`
- `avatar_url`
- `status`

#### Vai trò trong Sprint 06
- xác định người gửi request;
- xác định guide xử lý request;
- hiển thị thông tin cơ bản trên UI;
- kiểm tra tài khoản có đang bị khóa / hạn chế hay không nếu cần.

### 9.4. `notifications`

#### Vai trò
Lưu thông báo cho user hoặc guide khi request có thay đổi đáng chú ý.

#### Trường quan trọng
- `id`
- `user_id`
- `notification_type`
- `title`
- `content`
- `entity_type`
- `entity_id`
- `payload`
- `is_read`
- `created_at`
- `read_at`

#### Vai trò trong Sprint 06
- gửi thông báo cho guide khi có request mới;
- gửi thông báo cho user khi request được duyệt / từ chối;
- chuẩn bị nền cho sprint notification hoặc realtime sau này.

### 9.5. Bảng hỗ trợ cần lưu ý thêm
Dù không phải bảng trọng tâm chính thức của Sprint 06, backend vẫn sẽ phải join hoặc kiểm tra thêm từ:
- `guide_profiles`
- `user_roles`
- `roles`

Lý do:
- `guide_profiles` dùng để xác định tour thuộc guide nào;
- `user_roles` và `roles` hỗ trợ xác định quyền guide / user ở tầng guard.

### 9.6. Ghi chú triển khai dữ liệu
Trong Sprint 06, dữ liệu demo tối thiểu nên có:
- 2–3 guide đã có tour published;
- nhiều user khác nhau;
- các request ở nhiều trạng thái:
  - pending
  - approved
  - rejected
  - cancelled_by_user
- có thể seed thêm 1–2 bản ghi `payment_pending` để giữ tương thích báo cáo / demo schema.

---

### 10. API cần thiết

### 10.1. `POST /tour-requests`

#### Mục đích
Tạo mới yêu cầu tham gia tour từ `M06 Chi tiết tour`.

#### Request gợi ý
```json
{
  "tourId": "uuid",
  "participantCount": 2,
  "note": "Tôi muốn tham gia cùng 1 người bạn."
}
```

#### Kết quả mong đợi
- tạo request mới với `status = pending`;
- trả về request vừa tạo;
- tạo notification cho guide;
- trả lỗi rõ ràng nếu:
  - tour không hợp lệ;
  - hết chỗ;
  - tour không còn mở;
  - user đã gửi request trước đó.

### 10.2. `GET /me/tour-requests`

#### Mục đích
Lấy danh sách request của user hiện tại để hiển thị ở `M21`.

#### Query gợi ý
- `status`
- `page`
- `limit`
- `sort`

#### Kết quả mong đợi
Trả về danh sách request kèm thông tin tour cơ bản:
- tên tour;
- ngày bắt đầu;
- guide;
- trạng thái;
- ghi chú xử lý;
- thời gian gửi và thời gian xử lý.

### 10.3. `PATCH /tour-requests/:id/cancel`

#### Mục đích
Cho user hủy request của chính mình khi request còn hợp lệ để hủy.

#### Request gợi ý
```json
{
  "reason": "Tôi thay đổi kế hoạch cá nhân."
}
```

#### Kết quả mong đợi
- cập nhật `status = cancelled_by_user`;
- ghi `cancelled_at`;
- không cho hủy nếu request đã không còn ở trạng thái cho phép hủy.

### 10.4. `GET /guide/tour-requests`

#### Mục đích
Lấy danh sách request thuộc các tour do guide hiện tại quản lý.

#### Query gợi ý
- `tourId`
- `status`
- `page`
- `limit`
- `keyword`

#### Kết quả mong đợi
- trả về danh sách request theo ngữ cảnh guide;
- có thể lọc theo tour và trạng thái;
- có thông tin người gửi, tour liên quan, số lượng người, ghi chú và trạng thái hiện tại.

### 10.5. `PATCH /guide/tour-requests/:id/approve`

#### Mục đích
Cho guide duyệt một request đang chờ xử lý.

#### Request gợi ý
```json
{
  "responseNote": "Đã xác nhận tham gia. Hẹn gặp bạn đúng giờ."
}
```

#### Kết quả mong đợi
- cập nhật `status = approved`;
- ghi `processed_at`;
- ghi `processed_by_user_id`;
- lưu `response_note` nếu có;
- tạo notification cho user;
- từ chối thao tác nếu:
  - guide không phải chủ tour;
  - request không còn `pending`;
  - tour không còn đủ chỗ.

### 10.6. `PATCH /guide/tour-requests/:id/reject`

#### Mục đích
Cho guide từ chối một request đang chờ xử lý.

#### Request gợi ý
```json
{
  "responseNote": "Tour đã đủ thành viên phù hợp."
}
```

#### Kết quả mong đợi
- cập nhật `status = rejected`;
- ghi `processed_at`;
- ghi `processed_by_user_id`;
- lưu `response_note`;
- tạo notification cho user.

### 10.7. API hỗ trợ nên cân nhắc thêm
Không bắt buộc phải công bố rộng ngay ở Sprint 06, nhưng có thể cân nhắc:
- `GET /guide/tours/:id/requests-summary`
- `GET /tour-requests/:id`
- `POST /notifications/read-all` hoặc `PATCH /notifications/:id/read`

Các API này chỉ nên làm khi phần lõi đã ổn.

### 10.8. Yêu cầu kỹ thuật chung cho API
Toàn bộ API trong Sprint 06 cần bảo đảm:
- dùng auth guard;
- dùng role guard ở endpoint guide;
- validate DTO chặt;
- kiểm tra ownership trong service;
- trả lỗi nghiệp vụ rõ ràng;
- chuẩn hóa response format;
- log các thao tác đổi trạng thái.

---

### 11. Công việc frontend

### 11.1. Mở rộng `M06 Chi tiết tour` với form gửi yêu cầu
Frontend cần bổ sung một khối gửi yêu cầu tham gia tour, gồm:
- input số lượng người;
- textarea ghi chú;
- nút gửi yêu cầu;
- thông báo lỗi / thành công.

Khối này phải chỉ hiển thị đúng ngữ cảnh:
- guest: yêu cầu đăng nhập;
- user hợp lệ: cho gửi;
- guide là chủ tour: không hiển thị nút gửi.

### 11.2. Dựng `M21 Yêu cầu tham gia tour của tôi`
Cần xây dựng màn hình quản lý theo góc nhìn user:
- danh sách request đã gửi;
- bộ lọc trạng thái;
- badge trạng thái màu sắc rõ ràng;
- nút hủy cho request đang chờ xử lý;
- hiển thị thông tin phản hồi của guide nếu có.

### 11.3. Dựng `M37 Quản lý yêu cầu tham gia tour`
Đây là màn hình làm việc chính của guide trong Sprint 06. Cần có:
- bảng request;
- filter theo tour / trạng thái;
- modal hoặc panel chi tiết request;
- textarea nhập phản hồi;
- nút duyệt / từ chối.

### 11.4. Chuẩn hóa badge trạng thái
Nên xây một bộ hiển thị trạng thái dùng chung cho:
- `pending`
- `approved`
- `rejected`
- `cancelled_by_user`
- `cancelled_by_guide`
- `payment_pending`
- `paid`

Dù chưa dùng hết ở Sprint 06, việc dựng sẵn từ đầu sẽ giúp các sprint sau đỡ sửa UI.

### 11.5. Tạo UX chống gửi trùng và chống thao tác sai
Frontend cần:
- disable nút gửi khi request đang submit;
- disable nút approve / reject khi đang xử lý;
- confirm trước khi hủy request;
- refresh hoặc optimistic update đúng cách sau khi đổi trạng thái.

### 11.6. Hiển thị lỗi nghiệp vụ dễ hiểu
Các lỗi như:
- tour đã đóng;
- tour hết chỗ;
- đã gửi request trước đó;
- không đủ quyền xử lý;
- request không còn chờ xử lý

phải được map ra thông báo dễ hiểu, không hiển thị raw message kỹ thuật.

### 11.7. Kết nối notification cơ bản
Nếu có khu vực notification hoặc toast dùng chung, frontend nên hiển thị:
- gửi request thành công;
- duyệt thành công;
- từ chối thành công;
- hủy thành công.

### 11.8. Test flow phía frontend
Cần test ít nhất các trường hợp:
- gửi request hợp lệ;
- gửi request trùng;
- gửi request vào tour hết chỗ;
- user hủy request pending;
- guide duyệt request;
- guide từ chối request;
- guide xử lý request không thuộc tour của mình.

### 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 06:
- user thao tác request được từ màn hình tour;
- user theo dõi được request đã gửi;
- guide xử lý được request trên một màn hình riêng;
- UI phản ánh trạng thái request rõ ràng và nhất quán.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `tour-requests`
Cần tách module đủ rõ:
- controller
- service
- dto
- mapper / presenter nếu cần
- policy / permission helper

### 12.2. Xử lý create request
Khi tạo request, backend phải:
- xác thực user;
- lấy tour;
- kiểm tra tour hợp lệ;
- kiểm tra duplicate request;
- kiểm tra sức chứa;
- tạo request mới;
- tạo notification cho guide.

### 12.3. Xử lý list request của user
Endpoint `GET /me/tour-requests` phải:
- chỉ lấy request của chính user hiện tại;
- hỗ trợ filter trạng thái;
- join thông tin tour cần thiết;
- không trả dữ liệu thừa.

### 12.4. Xử lý cancel request
Backend phải:
- kiểm tra request có thuộc user hiện tại không;
- kiểm tra state hiện tại có cho phép hủy không;
- cập nhật `status`, `cancelled_at`, `updated_at`;
- ngăn hủy nhiều lần.

### 12.5. Xử lý list request của guide
Backend phải:
- xác định guide hiện tại;
- join request với tour và user;
- chỉ trả các request thuộc tour của guide đó;
- hỗ trợ filter trạng thái và tour.

### 12.6. Xử lý approve / reject request
Khi guide xử lý request, backend phải:
- kiểm tra request tồn tại;
- kiểm tra ownership tour;
- kiểm tra request còn `pending`;
- kiểm tra sức chứa nếu duyệt;
- cập nhật trạng thái;
- ghi `processed_at`, `processed_by_user_id`, `response_note`;
- tạo notification cho user.

### 12.7. Chuẩn hóa rule về sức chứa
Service phải dùng một hàm thống nhất để tính số chỗ đã chiếm và số chỗ còn lại. Không nên để logic này lặp ở nhiều endpoint khác nhau.

### 12.8. Logging và xử lý lỗi
Các thao tác quan trọng cần được log ở mức đủ dùng:
- tạo request;
- hủy request;
- approve;
- reject.

Lỗi cần chia rõ:
- lỗi validate input;
- lỗi permission;
- lỗi state;
- lỗi business rule;
- lỗi hệ thống.

### 12.9. Chuẩn bị nền cho sprint thanh toán và review
Dù chưa làm sâu thanh toán, backend nên giữ kiến trúc đủ mở để sau này có thể:
- chuyển `approved` sang `payment_pending`;
- nối `tour_requests` với `payment_transactions`;
- nối `tour_requests` với `tour_reviews` và `guide_reviews`.

### 12.10. Kết quả mong đợi phía backend
Kết thúc Sprint 06:
- toàn bộ API request hoạt động ổn định;
- rule nghiệp vụ không bị lệch giữa user và guide;
- trạng thái được kiểm soát đúng;
- dữ liệu sẵn sàng cho sprint sau mà không cần refactor lớn.

---

### 13. Công việc database

### 13.1. Chuẩn hóa dữ liệu `tour_requests`
Cần bảo đảm bảng `tour_requests` dùng thống nhất các trạng thái trong schema:
- `pending`
- `approved`
- `rejected`
- `cancelled_by_user`
- `cancelled_by_guide`
- `payment_pending`
- `paid`

### 13.2. Thêm index cần thiết
Nên bổ sung / xác nhận index theo:
- `tour_id`
- `user_id`
- `status`

Nếu cần tối ưu hơn cho guide screen, có thể cân nhắc index ghép theo:
- `(tour_id, status)`
- `(user_id, status)`

### 13.3. Seed dữ liệu request đa trạng thái
Cần seed:
- request đang chờ;
- request đã được duyệt;
- request bị từ chối;
- request bị user hủy;
- có thể thêm request `payment_pending` để phục vụ demo cấu trúc dữ liệu.

### 13.4. Seed notification cơ bản
Nên có dữ liệu notification mẫu cho:
- guide nhận request mới;
- user nhận kết quả duyệt;
- user nhận kết quả từ chối.

### 13.5. Kiểm tra toàn vẹn dữ liệu
Cần rà lại:
- `tour_id` có tồn tại không;
- `user_id` có hợp lệ không;
- `processed_by_user_id` có hợp lệ không;
- các request không trỏ tới tour bị xóa / không hợp lệ trong seed demo.

### 13.6. Kiểm tra tính nhất quán với tour
Dữ liệu seed phải bám đúng:
- `tours.max_participants`
- `tours.business_status`
- `tours.visibility_status`

Không seed request vào tour đang ở trạng thái không nên nhận request nếu không có mục đích test ngoại lệ.

### 13.7. Kiểm tra RLS / quyền truy cập dữ liệu
Nếu dự án đang dùng Supabase RLS, cần rà lại để bảo đảm:
- user chỉ đọc / sửa request của mình;
- guide chỉ đọc / xử lý request thuộc tour của mình;
- notification chỉ đọc theo owner hoặc backoffice.

### 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 06:
- dữ liệu request có thể test đủ các flow chính;
- index đủ để truy vấn màn hình user và guide không bị chậm;
- schema không phải chỉnh lớn khi sang sprint thanh toán hoặc review.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
Trong Sprint 06 cần cập nhật rõ:
- mô tả nghiệp vụ gửi yêu cầu tham gia tour;
- mô tả nghiệp vụ duyệt / từ chối yêu cầu;
- mô hình trạng thái của `tour_requests`;
- mapping màn hình – API – bảng dữ liệu liên quan tới flow request.

### 14.2. Activity Diagram cần cập nhật
Cần hoàn thiện tối thiểu:
- Activity Diagram – User gửi yêu cầu tham gia tour
- Activity Diagram – Guide duyệt hoặc từ chối yêu cầu tham gia tour

### 14.3. Sequence Diagram cần đồng bộ
Đây là sprint rất phù hợp để dùng Sequence Diagram vì flow có nhiều bước kiểm tra:
- kiểm tra đăng nhập;
- kiểm tra tour hợp lệ;
- kiểm tra sức chứa;
- kiểm tra request trùng;
- cập nhật trạng thái;
- tạo notification.

Nên đồng bộ với:
- `POST /tour-requests`
- `PATCH /guide/tour-requests/:id/approve`
- `PATCH /guide/tour-requests/:id/reject`

### 14.4. Mục tiêu của phần tài liệu/UML
Phần UML của Sprint 06 phải đủ rõ để khi bảo vệ có thể giải thích:
- ai gửi request;
- ai xử lý;
- dữ liệu nào thay đổi;
- điều kiện nào gây lỗi;
- vì sao flow này là luồng lõi có giá trị demo cao nhất của hệ thống ở giai đoạn đầu.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- User gửi được yêu cầu tham gia tour từ `M06`.
- User xem được danh sách request của mình tại `M21`.
- User hủy được request còn `pending`.
- Guide xem được toàn bộ request thuộc tour của mình tại `M37`.
- Guide duyệt hoặc từ chối request thành công.

### 15.2. Đầu ra giao diện
- `M06` có form gửi yêu cầu rõ ràng.
- `M21` hiển thị trạng thái request mạch lạc.
- `M37` có bộ lọc và thao tác xử lý request đúng ngữ cảnh guide.
- Badge trạng thái và thông báo UI nhất quán.

### 15.3. Đầu ra API
- `POST /tour-requests`
- `GET /me/tour-requests`
- `PATCH /tour-requests/:id/cancel`
- `GET /guide/tour-requests`
- `PATCH /guide/tour-requests/:id/approve`
- `PATCH /guide/tour-requests/:id/reject`

### 15.4. Đầu ra dữ liệu
- `tour_requests` được chuẩn hóa trạng thái;
- có dữ liệu demo đa trạng thái;
- `notifications` sinh đúng bản ghi cơ bản;
- dữ liệu đủ để demo từ góc nhìn user và guide.

### 15.5. Đầu ra tài liệu
- cập nhật mô tả nghiệp vụ request tour;
- cập nhật Activity Diagram gửi request;
- cập nhật Activity Diagram duyệt / từ chối request;
- cập nhật Sequence Diagram tương ứng;
- chốt state machine của `tour_requests`.

### 15.6. Tiêu chí sẵn sàng sang Sprint 07
Sprint 06 được xem là hoàn tất khi:
- flow xem tour → gửi yêu cầu → guide xử lý chạy được từ đầu đến cuối;
- API và UI đều hoạt động với dữ liệu thật;
- quyền user / guide không bị lệch;
- trạng thái request không bị sai logic;
- dự án sẵn sàng chuyển sang trục giá trị thứ hai là **bài tìm bạn đồng hành**.

---

### 16. Kết luận sprint

Sprint 06 là sprint đánh dấu việc hệ thống bắt đầu vận hành như một nền tảng kết nối thực thụ. Đây không còn là giai đoạn chỉ “xem được dữ liệu”, mà là giai đoạn người dùng và hướng dẫn viên **bắt đầu tương tác với nhau thông qua một vòng đời nghiệp vụ có trạng thái, có quyền xử lý và có phản hồi**.

Nếu Sprint 06 được làm chắc, đồ án sẽ có ngay một luồng demo rất mạnh:
- dễ trình bày;
- dễ kiểm thử;
- dễ mở rộng sang review, payment và notification;
- thể hiện rõ nhất tính thực tiễn của đề tài.

Vì vậy, ưu tiên lớn nhất của sprint này không phải làm nhiều màn hình phụ, mà là làm cho **flow request tour chạy đúng, rõ và ổn định**.

---

<a id="sprint-07"></a>
## SPRINT 07 – Triển khai bài tìm bạn đồng hành và yêu cầu tham gia bài đồng hành

### 1. Mục tiêu sprint

Sprint 07 là sprint hiện thực **trục giá trị thứ hai** của toàn bộ đề tài: **kết nối người dùng với nhau thông qua bài tìm bạn đồng hành**. Nếu Sprint 06 đã hoàn thành luồng kết nối giữa khách du lịch và hướng dẫn viên thông qua tour, thì Sprint 07 phải giúp hệ thống đi thêm một bước rất quan trọng: cho phép người dùng chủ động tạo bài đăng tìm người đi cùng, tiếp nhận yêu cầu tham gia, và quản lý danh sách thành viên theo đúng logic nghiệp vụ riêng của companion post.

Đây là sprint có ý nghĩa chiến lược vì nó tạo ra **bản sắc riêng** cho đồ án. Hệ thống từ đây không còn chỉ là một website tour thông thường, mà trở thành một nền tảng kết nối đa chiều:
- kết nối **khách du lịch – hướng dẫn viên** thông qua tour;
- kết nối **người dùng – người dùng** thông qua bài tìm bạn đồng hành.

#### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F16:** Quản lý bài tìm bạn đồng hành
  - **F17:** Quản lý yêu cầu tham gia bài đồng hành
- Hoàn thành **luồng lõi thứ hai có tính khép kín** của hệ thống:
  - người dùng tạo bài tìm bạn đồng hành;
  - người khác xem danh sách bài và mở chi tiết bài;
  - người dùng gửi yêu cầu tham gia;
  - chủ bài xem danh sách yêu cầu;
  - chủ bài duyệt hoặc từ chối thành viên;
  - hệ thống đồng bộ trạng thái bài và trạng thái yêu cầu.
- Chuẩn hóa **state machine** cho:
  - `companion_posts.business_status`
  - `companion_requests.status`
- Dựng xong cụm màn hình Public Area và User Area liên quan tới companion post ở mức dùng thật, không chỉ dừng ở bản demo giao diện.
- Chuẩn bị nền dữ liệu và kiến trúc để các sprint sau có thể mở rộng sang:
  - chat nhóm bài đồng hành;
  - báo cáo vi phạm bài đồng hành;
  - notification;
  - quản trị và kiểm duyệt nội dung đồng hành.

#### Ý nghĩa của sprint này
Sprint 07 là nơi hệ thống bắt đầu thể hiện rõ **sự khác biệt về ý tưởng đề tài**. Nếu làm chắc sprint này, bạn sẽ có thêm một luồng demo rất mạnh khi bảo vệ:
- User A tạo bài tìm bạn đồng hành;
- User B vào xem chi tiết bài;
- User B gửi yêu cầu tham gia;
- User A duyệt thành viên;
- hệ thống thay đổi trạng thái theo đúng quy tắc.

Đây là một trong bốn luồng demo bắt buộc đã được nhấn mạnh trong các tài liệu chốt, nên sprint này không được làm nửa vời.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Phải tách rất rõ companion post với tour
Tài liệu đã chốt rất rõ: **tour** là hoạt động do guide tổ chức; còn **bài tìm bạn đồng hành** là bài do **user tạo để tìm người đi cùng**. Hai nhóm này phải khác nhau về:
- vai trò tạo dữ liệu;
- dữ liệu chính;
- quyền thao tác;
- trạng thái nghiệp vụ;
- màn hình quản lý;
- logic duyệt người tham gia.

Không được dùng lại tư duy của `tour_requests` để áp thẳng sang `companion_requests` mà không điều chỉnh, vì:
- chủ thể tạo bài khác;
- quy mô bài nhỏ hơn tour;
- không có guide_profile;
- không gắn logic thanh toán ở sprint này;
- logic “đủ thành viên thì đóng bài” phải được xử lý nhẹ và linh hoạt hơn.

### 2.2. Đây là sprint nghiệp vụ của User Area, không phải Guide Area
Sprint 07 chủ yếu xoay quanh:
- Public Area:
  - M10 Danh sách bài tìm bạn đồng hành
  - M11 Chi tiết bài tìm bạn đồng hành
- User Area:
  - M23 Danh sách bài đồng hành của tôi
  - M24 Tạo/cập nhật bài tìm bạn đồng hành
  - M25 Yêu cầu tham gia bài đồng hành đã gửi
  - M26 Quản lý yêu cầu tham gia bài đồng hành

Guide không phải actor trung tâm trong sprint này. Vì vậy:
- không kéo guide dashboard vào flow companion;
- không pha trộn companion post với tour của guide;
- không gắn nghiệp vụ xác minh guide vào companion post.

### 2.3. Phải chốt trạng thái bài và trạng thái request trước khi code
Sprint 07 rất nhạy về trạng thái. Nếu không chốt ngay từ đầu:
- frontend sẽ không biết khi nào hiển thị nút “Gửi yêu cầu”, “Hủy yêu cầu”, “Duyệt”, “Từ chối”;
- backend sẽ dễ cho phép chuyển trạng thái sai;
- database seed ra dữ liệu lẫn lộn;
- Activity Diagram và Sequence Diagram sẽ không nhất quán.

Các trạng thái tối thiểu phải thống nhất:
- bài đồng hành: `open`, `closed`, `cancelled`
- request tham gia: `pending`, `approved`, `rejected`, `cancelled`

### 2.4. Phải chốt sớm quy tắc số lượng thành viên
Một trong các điểm dễ phát sinh sửa logic nhất của Sprint 07 là câu hỏi:
- `expected_members` là số người mong muốn hay số người tối đa được duyệt?
- khi đủ người thì bài có tự đóng hay chủ bài tự đóng?
- một người đã bị từ chối có được gửi lại yêu cầu không?
- chủ bài có được duyệt quá số lượng không?

Tài liệu chốt cho phép chọn hướng hợp lý, dễ triển khai cho đồ án:
- `expected_members` là số thành viên mong muốn / tối đa duyệt;
- chủ bài là người quyết định duyệt thành viên;
- có thể áp dụng quy tắc **tự đóng khi đủ số lượng** để giảm rủi ro logic;
- nếu chưa đủ số lượng thì bài vẫn ở trạng thái mở.

### 2.5. Không kéo chat nhóm vào sprint này
Một số tài liệu mapping cho biết màn hình quản lý yêu cầu bài đồng hành có liên quan đến `conversations`, nhưng phần **chat nhóm bài đồng hành** được để cho Sprint 12. Vì vậy trong Sprint 07:
- không cần làm giao diện chat nhóm;
- không cần tạo conversation thật;
- chỉ cần giữ thiết kế đủ sạch để sau này có thể nối chat vào sau khi request được duyệt.

### 2.6. “Xong sprint” không phải chỉ là tạo bài được
Một Sprint 07 đạt yêu cầu phải có đủ:
- tạo bài được;
- sửa và xóa mềm bài được;
- bài xuất hiện đúng ở khu vực public khi hợp lệ;
- người khác gửi request được;
- chủ bài xem request được;
- chủ bài duyệt / từ chối được;
- người gửi request xem trạng thái của mình được;
- dữ liệu demo đủ đẹp để minh họa toàn flow;
- UML được cập nhật bám đúng logic thật.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Tập trường bắt buộc của `companion_posts`
Theo tài liệu chốt, companion post phải có đủ các trường nền:
- tiêu đề;
- điểm đến;
- thời gian bắt đầu;
- thời gian kết thúc;
- số lượng thành viên mong muốn;
- chi phí dự kiến;
- mô tả;
- yêu cầu đối với người tham gia.

Cần xác định rõ:
- trường nào là bắt buộc tuyệt đối;
- trường nào cho phép null;
- trường nào hiển thị ở danh sách;
- trường nào hiển thị ở chi tiết;
- trường nào chỉ dùng cho backend validation.

### 3.2. State machine của `companion_posts`
Bài đồng hành cần tối thiểu các trạng thái:
- `open`
- `closed`
- `cancelled`

Cần chốt thêm:
- bài mới tạo ở trạng thái nào;
- khi đủ thành viên thì tự đóng hay chủ bài đóng tay;
- chủ bài có được mở lại bài đã đóng hay không;
- bài bị hủy có được khôi phục trong sprint này hay không.

### 3.3. State machine của `companion_requests`
Request tham gia cần tối thiểu các trạng thái:
- `pending`
- `approved`
- `rejected`
- `cancelled`

Cần chốt thêm:
- ai được tạo request;
- ai được hủy request;
- ai được duyệt hoặc từ chối;
- một request đã rejected có được chuyển lại pending không;
- một request đã approved có được chủ bài thu hồi không trong sprint này hay không.

### 3.4. Quy tắc gửi request
Cần xác định:
- người tạo bài có được tự gửi request vào bài của chính mình hay không;
- một user có được gửi nhiều request cho cùng một bài hay không;
- nếu đã từng `cancelled` hoặc `rejected` thì có gửi lại được không;
- bài đã `closed` hoặc `cancelled` có cho gửi request không.

### 3.5. Quy tắc số lượng thành viên
Cần chốt:
- `expected_members` tính theo số người được duyệt hay tổng số người quan tâm;
- khi duyệt một request thì có cần kiểm tra số lượng approved hiện có hay không;
- khi vượt số lượng mong muốn thì xử lý thế nào;
- khi đã đủ số lượng thì:
  - tự động chuyển `business_status = closed`
  - hay chỉ chặn gửi request mới.

### 3.6. Quy tắc hiển thị bài công khai
Cần xác định một bài được hiển thị tại `M10` và `M11` khi nào. Tối thiểu phải xét:
- `business_status`;
- `visibility_status`;
- `is_deleted`;
- tính hợp lệ của ngày;
- user có phải chủ bài hay không.

### 3.7. Phạm vi xóa bài trong sprint này
Cần chốt rằng “xóa bài” ở Sprint 07 nên theo hướng:
- **xóa mềm**;
- không xóa cứng khỏi database;
- ẩn khỏi public list;
- chủ bài không còn thao tác duyệt request trên bài đã xóa.

### 3.8. Phạm vi notification / report / chat
Dù companion post có liên quan tới:
- `notifications`
- `reports`
- `conversations`

nhưng Sprint 07 không nên mở rộng quá sâu. Cần chốt:
- notification chỉ ở mức tùy chọn hoặc tạo log đơn giản;
- report dành cho Sprint 08;
- chat nhóm dành cho Sprint 12.

---

### 4. Hạng mục cần chốt

- Phạm vi nghiệp vụ của bài tìm bạn đồng hành.
- Phân biệt rạch ròi giữa companion post và tour.
- Bộ trường bắt buộc của `companion_posts`.
- State machine của `companion_posts`.
- State machine của `companion_requests`.
- Quy tắc số lượng thành viên và cơ chế tự đóng bài.
- Quy tắc gửi request, hủy request, duyệt request, từ chối request.
- Điều kiện hiển thị bài công khai.
- Điều kiện xóa mềm bài.
- Phạm vi của notification, report và chat trong Sprint 07.
- Tập dữ liệu demo phục vụ luồng bảo vệ.

---

### 5. Phương án được chọn

### 5.1. Bộ trường bắt buộc được chọn cho `companion_posts`
Theo hướng chốt khả thi cho đồ án, bài đồng hành bắt buộc có:
- `title`
- `destination`
- `start_date`
- `end_date`
- `expected_members`
- `estimated_cost`
- `description`

Trường:
- `requirements` được khuyến nghị có, nhưng có thể cho phép rỗng nếu người dùng không đặt điều kiện cụ thể.

#### Quy tắc validation gợi ý
- `title`: 10–200 ký tự
- `destination`: bắt buộc, không để rỗng
- `start_date <= end_date`
- `start_date` không nên nhỏ hơn ngày hiện tại đối với bài mới
- `expected_members > 0`
- `estimated_cost >= 0`

### 5.2. State machine được chọn cho `companion_posts`
Trạng thái nghiệp vụ của bài:
- `open`: bài đang mở, cho phép gửi request
- `closed`: bài đã đủ người hoặc chủ bài chủ động đóng
- `cancelled`: bài bị hủy, không còn hiệu lực

Trạng thái hiển thị:
- `visible`: hiển thị công khai
- `hidden`: không hiển thị công khai
- `flagged`: dành cho admin/moderation ở sprint sau

#### Quy tắc chuyển trạng thái
- tạo bài mới -> `open`
- `open` -> `closed`:
  - khi chủ bài đóng tay; hoặc
  - khi số request `approved` đạt `expected_members`
- `open` -> `cancelled`: chủ bài hủy bài
- `closed` không mở lại trong Sprint 07 để giảm phức tạp
- `cancelled` không khôi phục trong Sprint 07

### 5.3. State machine được chọn cho `companion_requests`
Trạng thái request:
- `pending`
- `approved`
- `rejected`
- `cancelled`

#### Quy tắc chuyển trạng thái
- tạo request mới -> `pending`
- `pending` -> `approved`: chủ bài duyệt
- `pending` -> `rejected`: chủ bài từ chối
- `pending` -> `cancelled`: người gửi tự hủy
- các trạng thái cuối (`approved`, `rejected`, `cancelled`) không chuyển ngược trong Sprint 07

### 5.4. Quy tắc gửi request được chọn
Người dùng được gửi yêu cầu tham gia khi thỏa tất cả điều kiện:
- đã đăng nhập;
- không phải là chủ bài;
- bài đang ở trạng thái `open`;
- bài có `visibility_status = visible`;
- bài chưa bị xóa mềm;
- chưa có request `pending` hoặc `approved` cho cùng bài.

#### Quy tắc gửi lại request
- nếu request trước là `rejected` hoặc `cancelled`, **không cho gửi lại ngay trong Sprint 07** để đơn giản hóa logic.
- Nếu muốn mở rộng sau, có thể thêm luồng “gửi lại yêu cầu” ở sprint hoàn thiện.

### 5.5. Quy tắc duyệt thành viên được chọn
Chủ bài là người duy nhất được:
- xem danh sách request trên bài của mình;
- duyệt request;
- từ chối request.

Khi duyệt:
- backend phải đếm số request đang `approved`;
- nếu số lượng đã đạt `expected_members` thì không cho duyệt thêm;
- sau khi duyệt thành công và số lượng vừa đủ, bài chuyển sang `closed`.

### 5.6. Quy tắc số lượng thành viên được chọn
- `expected_members` được hiểu là **số thành viên mong muốn / số lượng tối đa có thể duyệt**.
- Không cần tạo bảng membership riêng trong Sprint 07.
- Danh sách thành viên được suy ra từ các request có `status = approved`.

Đây là cách làm phù hợp với phạm vi sinh viên vì:
- giảm số bảng phải thêm;
- dễ truy vấn;
- dễ trình bày trong báo cáo;
- đủ mạnh để demo flow thực tế.

### 5.7. Điều kiện hiển thị bài công khai được chọn
Bài xuất hiện ở `M10` và cho phép xem ở `M11` khi:
- `business_status = open`
- `visibility_status = visible`
- `is_deleted = false`

Đối với chủ bài:
- vẫn có thể xem bài của mình trong khu vực quản lý kể cả khi `closed`;
- bài `cancelled` chỉ hiển thị trong “bài của tôi”, không hiển thị public.

### 5.8. Phạm vi xóa bài được chọn
- Dùng **xóa mềm** qua `is_deleted` và `deleted_at`.
- Không xóa cứng.
- Bài đã xóa mềm:
  - không hiển thị public;
  - không cho gửi request mới;
  - không cho tiếp tục duyệt request;
  - vẫn giữ dữ liệu để phục vụ audit / admin sau này.

### 5.9. Phạm vi notification / report / chat được chọn
- **Notification:** chưa bắt buộc làm sâu ở Sprint 07.
- **Report companion post:** để Sprint 08 xử lý chung trong admin/report flow.
- **Chat nhóm companion:** để Sprint 12.

Điều này giúp Sprint 07 giữ đúng tinh thần:
- làm chắc luồng lõi;
- không mở rộng quá sớm;
- bảo đảm đúng roadmap đã chốt.

---

### 6. Ghi chú triển khai

- Đây là một trong bốn luồng demo bắt buộc nên **phải seed dữ liệu đẹp từ sớm**.
- Nên chuẩn bị ít nhất:
  - 6–8 tài khoản user;
  - 6–8 bài đồng hành;
  - request ở đủ trạng thái `pending`, `approved`, `rejected`, `cancelled`.
- Cần có các tình huống demo riêng:
  - bài đang mở và còn chỗ;
  - bài đã đủ người và tự đóng;
  - bài bị chủ bài hủy;
  - user gửi request thành công;
  - user không gửi được vì là chủ bài;
  - user không gửi được vì bài đã đóng;
  - chủ bài duyệt thành công;
  - chủ bài không duyệt được vì đã đủ người.
- Nên cập nhật UML song song với code, tránh để dồn tới cuối.

---

### 7. Chức năng trọng tâm

- **F16 – Quản lý bài tìm bạn đồng hành**
- **F17 – Quản lý yêu cầu tham gia bài đồng hành**

#### Phạm vi thực hiện trong Sprint 07
- Public list companion posts
- Companion post detail
- Create / update / soft delete companion post
- Send companion request
- Cancel companion request
- List requests sent by current user
- List requests on my post
- Approve / reject request by post owner

#### Những gì chưa làm sâu trong sprint này
- chat nhóm bài đồng hành;
- report / moderation chuyên sâu;
- notification realtime;
- thống kê nâng cao;
- gợi ý companion thông minh.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình của Sprint 07 phải phục vụ đồng thời hai lớp sử dụng:
- **người xem public**: xem danh sách bài, xem chi tiết bài;
- **người dùng đã đăng nhập**:
  - tạo và quản lý bài của mình;
  - gửi request vào bài của người khác;
  - theo dõi request đã gửi;
  - duyệt / từ chối request trên bài của mình.

### 8.2. Các màn hình cần triển khai trong Sprint 07

#### M10 – Danh sách bài tìm bạn đồng hành
**Vai trò:**
- Public Area

**Mục đích:**
- hiển thị các bài đồng hành đang mở;
- giúp người dùng duyệt nhanh và chọn bài phù hợp.

**Nội dung hiển thị chính:**
- tiêu đề bài;
- điểm đến;
- ngày đi / ngày về;
- chi phí dự kiến;
- số thành viên mong muốn;
- trạng thái bài;
- nút xem chi tiết;
- bộ lọc cơ bản.

**Yêu cầu chính:**
- chỉ hiển thị bài `open`, `visible`, chưa xóa mềm;
- hỗ trợ lọc tối thiểu theo:
  - điểm đến;
  - thời gian;
  - trạng thái;
- phân trang hoặc infinite list ở mức cơ bản.

#### M11 – Chi tiết bài tìm bạn đồng hành
**Vai trò:**
- Public Area / User Area

**Mục đích:**
- hiển thị đầy đủ thông tin của bài;
- hỗ trợ user gửi yêu cầu tham gia.

**Nội dung hiển thị chính:**
- tiêu đề;
- điểm đến;
- thời gian đi / về;
- chi phí dự kiến;
- số lượng mong muốn;
- mô tả;
- yêu cầu tham gia;
- thông tin người tạo bài ở mức cơ bản;
- nút gửi yêu cầu;
- badge trạng thái bài.

**Yêu cầu chính:**
- nếu chưa đăng nhập: cho xem nhưng nút gửi request chuyển hướng sang đăng nhập;
- nếu là chủ bài: ẩn nút gửi request;
- nếu bài đã đóng / hủy: khóa nút gửi request;
- nếu người dùng đã có request: hiển thị đúng trạng thái hiện tại.

#### M23 – Danh sách bài đồng hành của tôi
**Vai trò:**
- User Area

**Mục đích:**
- giúp người dùng quản lý toàn bộ bài do mình tạo.

**Nội dung hiển thị chính:**
- danh sách bài của tôi;
- trạng thái bài;
- số request đang chờ;
- số request đã duyệt;
- thao tác sửa / xóa mềm / xem danh sách request.

**Yêu cầu chính:**
- lọc theo trạng thái;
- hiển thị thống kê nhẹ theo từng bài;
- điều hướng sang M24 và M26.

#### M24 – Tạo/cập nhật bài tìm bạn đồng hành
**Vai trò:**
- User Area

**Mục đích:**
- cho phép người dùng tạo mới hoặc cập nhật bài.

**Nội dung hiển thị chính:**
- form nhập:
  - tiêu đề
  - điểm đến
  - ngày đi
  - ngày về
  - chi phí dự kiến
  - số thành viên mong muốn
  - mô tả
  - yêu cầu
- nút lưu;
- validate lỗi;
- thông báo thành công.

**Yêu cầu chính:**
- một form dùng chung cho create và edit;
- validate chặt các trường ngày và số lượng;
- edit chỉ cho chủ bài;
- không cho sửa bài đã cancelled trong Sprint 07.

#### M25 – Yêu cầu tham gia bài đồng hành đã gửi
**Vai trò:**
- User Area

**Mục đích:**
- giúp người dùng theo dõi các request mình đã gửi tới bài của người khác.

**Nội dung hiển thị chính:**
- tiêu đề bài;
- điểm đến;
- thời gian;
- trạng thái request;
- lời nhắn đã gửi;
- thời điểm gửi;
- nút hủy request nếu đang `pending`.

**Yêu cầu chính:**
- chỉ hiển thị request của user hiện tại;
- hỗ trợ lọc theo trạng thái;
- cập nhật badge rõ ràng.

#### M26 – Quản lý yêu cầu tham gia bài đồng hành
**Vai trò:**
- User Area (chủ bài)

**Mục đích:**
- cho phép chủ bài xem và xử lý các request trên bài của mình.

**Nội dung hiển thị chính:**
- thông tin bài;
- danh sách request;
- user gửi request;
- lời nhắn;
- trạng thái;
- nút duyệt;
- nút từ chối.

**Yêu cầu chính:**
- chỉ chủ bài mới xem được;
- khi bài đã đủ người, các nút duyệt phải bị khóa;
- hiển thị rõ số lượng approved / expected_members;
- chuẩn bị UX sạch để sau này nối chat nhóm nếu cần.

### 8.3. Thành phần UI dùng chung cần tận dụng
- card danh sách
- status badge
- filter bar
- confirm modal
- empty state
- loading state
- toast / alert
- protected route
- pagination hoặc load more

### 8.4. Kết quả mong đợi của phần màn hình
Sau Sprint 07, người dùng có thể:
- vào danh sách bài công khai;
- mở chi tiết bài;
- tạo bài mới;
- sửa bài của mình;
- xóa mềm bài;
- gửi request tham gia;
- theo dõi request đã gửi;
- duyệt / từ chối thành viên trên bài của mình.

---

### 9. Bảng CSDL chính

### 9.1. `companion_posts`
#### Vai trò
Lưu bài tìm bạn đồng hành do người dùng tạo.

#### Trường quan trọng
- `post_id`
- `user_id`
- `title`
- `destination`
- `start_date`
- `end_date`
- `estimated_cost`
- `expected_members`
- `description`
- `requirements`
- `business_status`
- `visibility_status`
- `is_deleted`
- `deleted_at`
- `created_at`
- `updated_at`

#### Vai trò trong Sprint 07
Đây là bảng trung tâm của sprint, phục vụ:
- danh sách bài công khai;
- chi tiết bài;
- danh sách bài của tôi;
- tạo / sửa / xóa mềm bài;
- kiểm soát trạng thái mở / đóng / hủy.

### 9.2. `companion_requests`
#### Vai trò
Lưu yêu cầu tham gia của user vào một companion post.

#### Trường quan trọng
- `request_id`
- `post_id`
- `user_id`
- `message`
- `status`
- `requested_at`
- `processed_at`
- `processed_by_user_id`

#### Vai trò trong Sprint 07
Đây là bảng trung tâm thứ hai của sprint, phục vụ:
- gửi request tham gia;
- xem request đã gửi;
- xem request trên bài của tôi;
- duyệt / từ chối request;
- suy ra số thành viên đã được duyệt.

### 9.3. `users`
#### Vai trò
Lưu hồ sơ nghiệp vụ của người dùng trong hệ thống.

#### Trường quan trọng
- `id`
- `email`
- `full_name`
- `avatar_url`
- `status`

#### Vai trò trong Sprint 07
Dùng để:
- xác định chủ bài;
- hiển thị thông tin người gửi request;
- kiểm tra tài khoản có hợp lệ để thao tác hay không.

### 9.4. Bảng hỗ trợ cần lưu ý thêm
- `reports`: dùng cho sprint report / moderation sau
- `conversations`: dùng cho chat nhóm sau
- `notifications`: dùng cho thông báo sau
- `user_activity_logs`: có thể log hoạt động ở mức nhẹ nếu muốn

### 9.5. Ghi chú triển khai dữ liệu
- Không cần thêm bảng membership riêng trong Sprint 07.
- Thành viên được duyệt = các dòng `companion_requests.status = approved`.
- Nên thêm unique logic ở tầng backend hoặc database để hạn chế duplicate request theo `(post_id, user_id)` trong phạm vi trạng thái đang hiệu lực.

---

### 10. API cần thiết

### 10.1. `GET /companion-posts`
#### Mục đích
Lấy danh sách bài đồng hành công khai.

#### Query gợi ý
- `destination`
- `startDateFrom`
- `startDateTo`
- `status`
- `page`
- `limit`

#### Kết quả mong đợi
- chỉ trả bài `open`, `visible`, chưa xóa mềm;
- hỗ trợ filter tối thiểu;
- trả summary đủ để render card danh sách.

### 10.2. `GET /companion-posts/:id`
#### Mục đích
Lấy chi tiết một bài đồng hành.

#### Kết quả mong đợi
- thông tin đầy đủ của bài;
- thông tin cơ bản của chủ bài;
- trạng thái hiện tại;
- nếu user đã đăng nhập, có thể kèm trạng thái request của chính user với bài này.

### 10.3. `POST /companion-posts`
#### Mục đích
Tạo bài đồng hành mới.

#### Request gợi ý
```json
{
  "title": "Tìm bạn đi Đà Lạt cuối tuần",
  "destination": "Đà Lạt",
  "startDate": "2026-05-10",
  "endDate": "2026-05-12",
  "estimatedCost": 2500000,
  "expectedMembers": 3,
  "description": "Ưu tiên đi nhẹ nhàng, thích chụp ảnh và cafe.",
  "requirements": "Vui vẻ, đúng giờ"
}
```

#### Kết quả mong đợi
- tạo bài với `business_status = open`
- `visibility_status = visible`
- trả về bản ghi vừa tạo

### 10.4. `PATCH /companion-posts/:id`
#### Mục đích
Cập nhật bài đồng hành của chính mình.

#### Request gợi ý
Cho phép cập nhật các trường nội dung, không cho đổi owner.

#### Kết quả mong đợi
- chỉ chủ bài được sửa;
- validate lại dữ liệu ngày và số lượng;
- không cho sửa bài đã `cancelled`.

### 10.5. `DELETE /companion-posts/:id`
#### Mục đích
Xóa mềm bài đồng hành của chính mình.

#### Kết quả mong đợi
- set `is_deleted = true`
- set `deleted_at`
- ẩn khỏi public area

### 10.6. `POST /companion-requests`
#### Mục đích
Gửi yêu cầu tham gia bài đồng hành.

#### Request gợi ý
```json
{
  "postId": 101,
  "message": "Mình muốn tham gia, lịch trình phù hợp và có thể đi đúng ngày."
}
```

#### Kết quả mong đợi
- chỉ tạo khi bài đang mở;
- không cho chủ bài tự gửi;
- không cho gửi trùng request đang hiệu lực;
- tạo request với `status = pending`.

### 10.7. `GET /me/companion-requests`
#### Mục đích
Lấy danh sách request bài đồng hành do user hiện tại đã gửi.

#### Query gợi ý
- `status`
- `page`
- `limit`

#### Kết quả mong đợi
- trả kèm thông tin cơ bản của bài;
- hỗ trợ badge trạng thái.

### 10.8. `GET /my-companion-posts/:id/requests`
#### Mục đích
Lấy danh sách request trên một bài do chính tôi làm chủ.

#### Kết quả mong đợi
- chỉ chủ bài truy cập được;
- trả danh sách request + thông tin user gửi;
- hỗ trợ lọc theo `status`.

### 10.9. `PATCH /companion-requests/:id/cancel`
#### Mục đích
Người gửi request tự hủy request của mình.

#### Kết quả mong đợi
- chỉ cho hủy khi `status = pending`;
- cập nhật `status = cancelled`.

### 10.10. `PATCH /my-companion-requests/:id/approve`
#### Mục đích
Chủ bài duyệt request tham gia.

#### Kết quả mong đợi
- chỉ chủ bài được duyệt;
- chỉ duyệt request `pending`;
- kiểm tra số lượng approved hiện tại;
- nếu vừa đủ `expected_members`, tự đóng bài.

### 10.11. `PATCH /my-companion-requests/:id/reject`
#### Mục đích
Chủ bài từ chối request tham gia.

#### Kết quả mong đợi
- chỉ chủ bài được từ chối;
- chỉ từ chối request `pending`;
- cập nhật `processed_at`, `processed_by_user_id`.

### 10.12. API hỗ trợ nên cân nhắc thêm
- `GET /me/companion-posts`
- `GET /companion-posts/:id/my-request`
- `PATCH /companion-posts/:id/close`
- `PATCH /companion-posts/:id/cancel`

Các API này không bắt buộc theo tài liệu gốc, nhưng nếu thêm sẽ giúp frontend sạch hơn.

### 10.13. Yêu cầu kỹ thuật chung cho API
- Kiểm tra auth cho mọi API của User Area.
- Kiểm tra ownership cho API sửa bài và quản lý request.
- Chuẩn hóa response format giống các sprint trước.
- Trả lỗi nghiệp vụ rõ ràng:
  - bài đã đóng;
  - bài đã hủy;
  - không phải chủ bài;
  - request trùng;
  - đã đủ thành viên.

---

### 11. Công việc frontend

### 11.1. Dựng `M10 Danh sách bài tìm bạn đồng hành`
- render card bài đồng hành công khai;
- filter cơ bản;
- badge trạng thái;
- pagination hoặc load more.

### 11.2. Dựng `M11 Chi tiết bài tìm bạn đồng hành`
- hiển thị đầy đủ dữ liệu bài;
- form gửi request;
- trạng thái đăng nhập / chưa đăng nhập;
- trạng thái đã gửi request / bài đã đóng.

### 11.3. Dựng `M23 Danh sách bài đồng hành của tôi`
- danh sách bài theo user hiện tại;
- nút sửa / xóa mềm / xem request;
- hiển thị số request theo từng bài.

### 11.4. Dựng `M24 Tạo/cập nhật bài tìm bạn đồng hành`
- form dùng chung create / edit;
- validate phía client;
- xử lý lỗi ngày tháng và số lượng.

### 11.5. Dựng `M25 Yêu cầu tham gia bài đồng hành đã gửi`
- danh sách request của tôi;
- lọc theo trạng thái;
- hủy request pending.

### 11.6. Dựng `M26 Quản lý yêu cầu tham gia bài đồng hành`
- danh sách request theo bài;
- duyệt / từ chối;
- hiển thị approved count / expected_members;
- khóa thao tác nếu bài đã đủ người.

### 11.7. Chuẩn hóa component badge trạng thái
Cần có badge riêng cho:
- bài: `open`, `closed`, `cancelled`
- request: `pending`, `approved`, `rejected`, `cancelled`

### 11.8. Tạo UX chống thao tác sai
- disable nút submit khi đang gửi;
- confirm modal trước khi xóa bài;
- confirm trước khi duyệt / từ chối nếu muốn;
- refresh đúng danh sách sau thao tác.

### 11.9. Hiển thị lỗi nghiệp vụ dễ hiểu
Ví dụ:
- “Bạn không thể gửi yêu cầu vào bài của chính mình.”
- “Bài đồng hành đã đóng nên không thể gửi yêu cầu mới.”
- “Bài này đã đủ thành viên.”
- “Bạn đã có yêu cầu tham gia trước đó.”

### 11.10. Test flow phía frontend
Ít nhất phải test:
- guest xem danh sách và chi tiết bài;
- user tạo bài;
- user sửa bài;
- user xóa mềm bài;
- user gửi request;
- user hủy request;
- chủ bài duyệt request;
- chủ bài từ chối request.

### 11.11. Kết quả mong đợi phía frontend
Frontend phải cho cảm giác hệ thống đã có một module companion hoàn chỉnh, không bị rời rạc hoặc “nửa demo nửa thật”.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `companions`
Theo mapping backend/frontend, companion nên đi trong module riêng:
- controller
- service
- repository/query layer nếu có

### 12.2. Xử lý CRUD bài đồng hành
- create post
- get public list
- get detail
- update own post
- soft delete own post

### 12.3. Xử lý create request
- validate bài tồn tại;
- validate bài đang mở;
- validate user không phải chủ bài;
- validate không gửi trùng;
- tạo request `pending`.

### 12.4. Xử lý list request của user hiện tại
- query request theo `user_id`;
- join thông tin bài;
- hỗ trợ filter theo status.

### 12.5. Xử lý list request trên bài của chủ bài
- kiểm tra ownership trước;
- join user gửi request;
- sắp xếp theo thời gian gửi.

### 12.6. Xử lý approve / reject request
- chỉ cho phép trên request `pending`;
- chỉ chủ bài được thao tác;
- khi approve phải kiểm tra quota;
- khi đủ quota thì đóng bài.

### 12.7. Chuẩn hóa rule về số lượng thành viên
- approved count = count request có `status = approved`
- nếu approved count >= expected_members:
  - không cho approve thêm;
  - không cho tạo request mới;
  - đóng bài về `closed`.

### 12.8. Xử lý cancel request
- chỉ người gửi request được hủy;
- chỉ được hủy khi request đang `pending`.

### 12.9. Logging và xử lý lỗi
- log các thao tác create / update / delete / approve / reject / cancel;
- trả lỗi nghiệp vụ rõ ràng;
- bảo đảm không lộ dữ liệu bài của người khác trong API quản lý riêng.

### 12.10. Chuẩn bị nền cho sprint sau
- report companion cho Sprint 08
- chat nhóm companion cho Sprint 12
- notification cho sprint hoàn thiện

### 12.11. Kết quả mong đợi phía backend
Backend phải đủ chắc để frontend chỉ cần gọi API là đi hết được toàn bộ flow demo companion.

---

### 13. Công việc database

### 13.1. Chuẩn hóa dữ liệu `companion_posts`
- kiểm tra `end_date >= start_date`
- kiểm tra `expected_members > 0`
- kiểm tra `estimated_cost >= 0`
- chuẩn hóa `business_status`
- chuẩn hóa `visibility_status`

### 13.2. Chuẩn hóa dữ liệu `companion_requests`
- chuẩn hóa `status`
- lưu `processed_at`
- lưu `processed_by_user_id`

### 13.3. Thêm index cần thiết
Ưu tiên index cho:
- `companion_posts(destination)`
- `companion_posts(start_date)`
- `companion_posts(user_id)`
- `companion_posts(business_status, visibility_status)`
- `companion_requests(post_id)`
- `companion_requests(user_id)`
- `companion_requests(status)`

### 13.4. Cân nhắc ràng buộc chống request trùng
Tùy cách triển khai, có thể:
- xử lý ở backend; hoặc
- thêm unique logic phù hợp.

Đối với đồ án sinh viên, xử lý ở backend thường dễ linh hoạt hơn.

### 13.5. Seed dữ liệu đa trạng thái
Cần có:
- bài `open`
- bài `closed`
- bài `cancelled`
- request `pending`
- request `approved`
- request `rejected`
- request `cancelled`

### 13.6. Seed dữ liệu demo đẹp phục vụ bảo vệ
Ít nhất nên có:
- 6–8 bài đồng hành;
- nhiều điểm đến khác nhau;
- bài đã đủ người;
- bài còn chỗ;
- request chờ duyệt;
- request đã duyệt;
- request đã từ chối.

### 13.7. Kiểm tra toàn vẹn dữ liệu
- post owner hợp lệ
- request user hợp lệ
- processed_by_user_id hợp lệ
- bài xóa mềm không bị lộ trong public query

### 13.8. Kiểm tra RLS / quyền truy cập dữ liệu
- public query chỉ đọc dữ liệu công khai;
- user chỉ sửa bài của mình;
- user chỉ xem request mình gửi;
- chủ bài chỉ xem request trên bài của mình.

### 13.9. Kết quả mong đợi phía database
Database phải đủ sạch để:
- truy vấn public không lẫn bài ẩn / xóa mềm;
- truy vấn cá nhân đúng ownership;
- seed demo ra đúng các tình huống thuyết trình.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- mô tả chức năng F16, F17
- mô tả vai trò User trong companion flow
- mô tả bảng `companion_posts`, `companion_requests`
- cập nhật mapping màn hình – dữ liệu – API

### 14.2. Activity Diagram cần cập nhật
- tạo bài tìm bạn đồng hành
- gửi yêu cầu tham gia bài đồng hành
- chủ bài duyệt / từ chối yêu cầu

### 14.3. Sequence Diagram nên bổ sung
Nếu có thời gian, nên bổ sung:
- user gửi request tham gia bài đồng hành
- chủ bài duyệt request

Hai sơ đồ này rất hợp để trình bày trong báo cáo vì luồng rõ, actor rõ, trạng thái rõ.

### 14.4. Mục tiêu của phần tài liệu/UML
- bảo đảm tài liệu đi cùng code thật;
- giúp báo cáo không bị chung chung;
- hỗ trợ giải thích rõ sự khác nhau giữa tour request và companion request.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- user tạo bài đồng hành được;
- user sửa bài của mình được;
- user xóa mềm bài của mình được;
- public xem danh sách bài được;
- public xem chi tiết bài được;
- user gửi request tham gia được;
- user hủy request pending được;
- chủ bài duyệt / từ chối request được.

### 15.2. Đầu ra giao diện
- hoàn thiện M10, M11, M23, M24, M25, M26 ở mức dùng thật;
- badge trạng thái rõ ràng;
- luồng điều hướng sạch giữa public và user area.

### 15.3. Đầu ra API
- bộ API companion chạy ổn định;
- kiểm tra auth và ownership đúng;
- trả lỗi nghiệp vụ dễ hiểu.

### 15.4. Đầu ra dữ liệu
- `companion_posts` và `companion_requests` hoạt động đúng logic;
- dữ liệu demo đủ các trạng thái;
- query public và query cá nhân không lẫn nhau.

### 15.5. Đầu ra tài liệu
- Activity Diagram companion hoàn chỉnh;
- mô tả CSDL companion đồng bộ với code;
- tài liệu sprint và báo cáo có thể dùng trực tiếp.

### 15.6. Tiêu chí sẵn sàng sang Sprint 08
Chỉ nên sang Sprint 08 khi:
- flow “đăng bài → gửi request → chủ bài duyệt thành viên” chạy ổn định;
- dữ liệu demo companion đã đủ đẹp;
- các trạng thái không bị lệch giữa frontend, backend, database;
- tài liệu UML của Sprint 07 đã cập nhật xong.

---

### 16. Kết luận sprint

Sprint 07 là sprint giúp đồ án thoát khỏi hình ảnh của một website tour đơn thuần để trở thành một **nền tảng kết nối du lịch có chiều sâu hơn**. Khi sprint này hoàn thành tốt, hệ thống sẽ có thêm một luồng demo mạnh, rõ ràng và rất phù hợp để bảo vệ trước hội đồng: **người dùng tự tạo bài tìm bạn đồng hành, tiếp nhận thành viên và quản lý tương tác theo trạng thái nghiệp vụ cụ thể**.

Đây là mốc quan trọng trước khi bước sang Sprint 08, nơi hệ thống bắt đầu hoàn thiện phần quản trị lõi, báo cáo vi phạm và kiểm duyệt nội dung.

---

<a id="sprint-08"></a>
## SPRINT 08 – Hoàn thiện Admin lõi, report flow, kiểm duyệt và phân quyền quản trị

### 1. Mục tiêu sprint

Sprint 08 là sprint hoàn thiện **trục quản trị lõi** của toàn bộ hệ thống. Nếu Sprint 06 đã hoàn thành luồng kết nối **khách du lịch – hướng dẫn viên** thông qua tour, và Sprint 07 đã hoàn thành luồng kết nối **người dùng – người dùng** thông qua bài tìm bạn đồng hành, thì Sprint 08 phải giúp hệ thống có thêm một lớp vận hành bắt buộc: **quản trị tài khoản, phân quyền, kiểm duyệt nội dung, xử lý báo cáo vi phạm và phê duyệt xác minh hồ sơ hướng dẫn viên**.

Đây là sprint quyết định độ “đầy đặn” của đồ án dưới góc nhìn hệ thống thông tin hoàn chỉnh. Nếu không có sprint này, sản phẩm sẽ giống một website demo chức năng phía người dùng nhưng thiếu cơ chế kiểm soát, thiếu chiều sâu quản trị và thiếu phần phản hồi khi phát sinh vi phạm. Vì vậy, Sprint 08 không chỉ làm đẹp Admin Area, mà phải biến khu vực quản trị thành **một trục nghiệp vụ có thể demo được**.

#### Mục tiêu chính
- Hoàn thành nhóm chức năng:
  - **F06:** Gửi báo cáo vi phạm
  - **F25:** Quản trị dữ liệu tổng thể
  - **F26:** Phê duyệt hồ sơ chuyên môn hướng dẫn viên
  - **F27:** Quản lý nội dung vi phạm
  - **F29:** Giao diện quản trị trực quan
- Hoàn thành **luồng lõi thứ tư** của hệ thống:
  - người dùng gửi báo cáo vi phạm;
  - hệ thống tiếp nhận báo cáo;
  - nhân sự quản trị tiếp nhận, phân loại, gán xử lý;
  - quản trị viên cập nhật trạng thái xử lý;
  - quản trị viên thực hiện hành động moderation phù hợp;
  - hệ thống ghi log và lưu lịch sử xử lý.
- Thiết lập rõ mô hình **đa vai trò trong Admin Area**:
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- Chuẩn hóa các cơ chế quản trị cốt lõi:
  - khóa / mở khóa tài khoản;
  - gán / thu hồi vai trò;
  - duyệt / từ chối xác minh hướng dẫn viên;
  - ẩn / hiện / gắn cờ nội dung;
  - theo dõi log hoạt động quản trị.
- Dựng được bộ màn hình Admin đủ để demo ở mức nghiệp vụ thật, không chỉ là dashboard tĩnh.
- Chuẩn bị nền dữ liệu và cấu trúc để Sprint 09 có thể đi vào giai đoạn ổn định MVP mà không phải sửa ngược lại mô hình quyền và moderation.

#### Ý nghĩa của sprint này
Sprint 08 là nơi hệ thống chuyển từ “có chức năng” sang “có khả năng vận hành”. Sau sprint này, bạn có thể demo được một chuỗi tình huống thuyết phục:
- User gửi báo cáo vi phạm từ một tour hoặc bài đồng hành;
- Support Staff tiếp nhận báo cáo;
- Content Moderator kiểm tra nội dung và chuyển trạng thái hiển thị;
- System Admin xem log, khóa tài khoản hoặc chỉnh lại vai trò nếu cần;
- hệ thống lưu lịch sử xử lý đầy đủ.

Đây là một trong những sprint làm tăng mạnh giá trị trình bày khi bảo vệ đồ án, vì nó thể hiện tư duy hệ thống chứ không chỉ là tư duy giao diện.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Sprint này là Admin lõi, không phải full backoffice
Mục tiêu của Sprint 08 là **hoàn thiện quản trị lõi có giá trị demo cao**, không phải triển khai toàn bộ quản trị mở rộng. Vì vậy:
- tập trung vào **user management, role assignment, guide verification, content moderation, report handling, audit log**;
- chưa cần làm sâu:
  - thống kê nâng cao;
  - biểu đồ phức tạp;
  - export file;
  - workflow nhiều cấp quá nặng;
  - moderation chi tiết cho mọi loại review nếu chưa đủ thời gian.

Admin Area trong sprint này phải **đủ dùng, đúng nghiệp vụ và dễ bảo vệ**, thay vì cố mở rộng quá nhiều.

### 2.2. Phải tách rõ 3 vai trò quản trị
Trong Admin Area, không nên gom tất cả quyền vào một role duy nhất rồi làm cho nhanh. Tài liệu đã định hướng khá rõ ba lớp vai trò:
- **System Admin**: quyền cao nhất, quản lý tài khoản, phân quyền, xem log, can thiệp toàn hệ thống;
- **Content Moderator**: tập trung vào kiểm duyệt nội dung công khai;
- **Support Staff / Complaint Staff**: tập trung vào tiếp nhận và xử lý báo cáo, khiếu nại, phản ánh.

Nếu không tách sớm:
- backend guard sẽ rối;
- frontend menu sẽ khó tổ chức;
- tài liệu UML mất tính thuyết phục;
- phần demo quản trị sẽ kém chiều sâu.

### 2.3. Moderation không đồng nghĩa với xóa cứng dữ liệu
Tài liệu đã nhấn mạnh rằng kiểm duyệt **không nhất thiết phải xóa dữ liệu**, mà nên ưu tiên:
- ẩn nội dung;
- gắn cờ nội dung;
- chuyển trạng thái hiển thị;
- khóa tài khoản trong trường hợp cần thiết.

Vì vậy, Sprint 08 phải đi theo hướng:
- **soft moderation** trước;
- **hard delete** không phải trọng tâm;
- action quản trị phải dễ giải thích trong báo cáo.

Đây là hướng hợp lý hơn cho đồ án vì vừa an toàn dữ liệu, vừa phù hợp cơ chế audit.

### 2.4. Report flow phải khép kín từ User Area sang Admin Area
Sprint 08 không thể chỉ làm M45 ở phía admin mà bỏ qua M20 ở phía user. Luồng báo cáo chỉ có ý nghĩa khi khép kín:
1. user gửi báo cáo;
2. hệ thống tạo `reports`;
3. hệ thống tạo `report_processing_history` ban đầu;
4. nhân sự quản trị tiếp nhận;
5. cập nhật trạng thái;
6. ghi chú xử lý;
7. nếu cần thì thực hiện moderation trên đối tượng bị báo cáo.

Nếu chỉ có “màn hình xử lý báo cáo” mà không có đầu vào từ người dùng, sprint sẽ bị đứt luồng.

### 2.5. Phải chốt state machine trước khi code
Sprint 08 đụng tới nhiều trạng thái:
- `users.status`
- `reports.status`
- `guide_profiles.verification_status`
- `guide_verification_requests.status`
- `guide_verification_documents.status`
- `tours.visibility_status`
- `companion_posts.visibility_status`
- `guide_profiles.visibility_status`

Đây là sprint rất dễ lệch giữa frontend, backend và database. Vì vậy:
- phải chốt trạng thái hợp lệ;
- phải chốt ai được quyền đổi trạng thái nào;
- phải chốt thao tác nào bắt buộc ghi log;
- phải chốt trạng thái nào chỉ được đổi thông qua admin.

### 2.6. Dashboard admin trong sprint này chỉ cần “thống kê vận hành cơ bản”
Tài liệu đã xác định dashboard admin ở mức truy vấn tổng hợp đơn giản:
- số user;
- số tour;
- số bài đồng hành;
- số báo cáo;
- số hồ sơ guide chờ duyệt.

Không cần làm BI hay analytics nâng cao trong sprint này. Chỉ cần:
- hiển thị đúng;
- điều hướng nhanh;
- thể hiện được tính trực quan và hữu ích.

### 2.7. “Xong sprint” không phải chỉ là vào được Admin Area
Sprint 08 chỉ được xem là hoàn thành khi đáp ứng đủ:
- có role và guard rõ ràng;
- có dữ liệu admin seed sẵn;
- có màn hình admin nối API;
- có report flow chạy được;
- có audit log hoặc role-change log được ghi;
- có dữ liệu mẫu cho các ca xử lý khác nhau;
- có UML cập nhật theo đúng luồng.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Cơ chế phân vai trò quản trị
Cần chốt:
- dùng `roles` + `user_roles` làm nguồn sự thật chính thức;
- một user có thể có nhiều role hay không;
- role nào là “primary role” khi điều hướng vào Admin Area;
- quyền nào kiểm tra ở frontend, quyền nào kiểm tra ở backend;
- thay đổi vai trò có bắt buộc ghi lịch sử hay không.

### 3.2. State machine của `users.status`
Cần chốt tập trạng thái tài khoản:
- `active`
- `suspended`
- `locked`

Đồng thời phải xác định:
- `suspended` khác `locked` như thế nào;
- role nào được đổi trạng thái;
- hệ quả của từng trạng thái khi user đăng nhập hoặc thao tác.

### 3.3. State machine của `reports.status`
Cần chốt quy trình xử lý báo cáo:
- `open`
- `assigned`
- `in_review`
- `resolved`
- `rejected`

Ngoài ra cần xác định:
- khi nào một report được xem là “tiếp nhận”;
- khi nào có người phụ trách;
- khi nào bắt buộc cập nhật `processed_by_user_id`;
- khi nào phải ghi lịch sử xử lý.

### 3.4. Quy tắc chọn đối tượng bị báo cáo
Cần xác định rõ `target_type` có thể là:
- `tour`
- `companion_post`
- `user`
- `guide_profile`
- `tour_review`
- `guide_review`

Trong Sprint 08, cần chọn phạm vi trọng tâm để giảm độ phức tạp nhưng vẫn đúng schema.

### 3.5. Logic xử lý xác minh hướng dẫn viên
Cần chốt:
- admin duyệt trên `guide_verification_requests` hay trực tiếp sửa `guide_profiles.verification_status`;
- khi approve thì document có đổi trạng thái không;
- khi reject có bắt buộc `result_note` không;
- sau khi approve thì hồ sơ guide có tự động visible hay không.

### 3.6. Logic moderation tour / companion / guide profile
Cần xác định:
- sprint này ưu tiên moderation bằng `visibility_status` hay `business_status`;
- khi bị báo cáo thì hệ thống ẩn ngay hay chỉ gắn cờ;
- role nào được thao tác với tour, companion post, guide profile;
- có cần action “restore / unhide” hay chưa.

### 3.7. Phạm vi dashboard quản trị
Cần chốt dashboard chỉ hiển thị:
- các số liệu tổng quan;
- shortcut tới các module;
- danh sách chờ xử lý cơ bản.

Không nên biến dashboard thành nơi hiển thị toàn bộ nghiệp vụ chi tiết.

### 3.8. Phạm vi audit trong sprint này
Cần xác định:
- action nào bắt buộc ghi `admin_activity_logs`;
- thay đổi role có ghi thêm `user_role_change_logs`;
- report history khác gì admin activity log;
- có cần lưu `old_data` / `new_data` ở mọi action hay chỉ các action quan trọng.

### 3.9. Phạm vi màn hình trong Sprint 08
Theo tài liệu, Sprint 08 tập trung vào:
- M20
- M38
- M39
- M40
- M41
- M42
- M43
- M45
- M47

Cần chốt rõ:
- M44 kiểm duyệt review chưa phải trọng tâm;
- M46 thống kê và báo cáo hệ thống chưa làm sâu;
- Sprint 08 chỉ làm **Admin lõi**, không tràn sang nhóm hoàn thiện nâng cao.

---

### 4. Hạng mục cần chốt

Sprint 08 cần chốt các hạng mục sau trước khi triển khai sâu:

1. **Mô hình quyền quản trị**
   - `SYSTEM_ADMIN`
   - `CONTENT_MODERATOR`
   - `SUPPORT_STAFF`

2. **Quy tắc truy cập Admin Area**
   - route guard;
   - menu theo vai trò;
   - quyền truy cập từng màn hình;
   - quyền thao tác từng action.

3. **Quy tắc khóa / mở khóa tài khoản**
   - ai được thực hiện;
   - trạng thái nào hợp lệ;
   - hiển thị gì với tài khoản bị khóa.

4. **Quy tắc gán / thu hồi vai trò**
   - ai được gán role;
   - có cấm tự hạ quyền chính mình hay không;
   - có log lịch sử thay đổi vai trò hay không.

5. **Quy tắc gửi và xử lý báo cáo**
   - target hợp lệ;
   - trạng thái xử lý;
   - yêu cầu bắt buộc khi resolve / reject;
   - ghi lịch sử xử lý.

6. **Quy tắc phê duyệt xác minh guide**
   - trạng thái request;
   - trạng thái document;
   - đồng bộ sang `guide_profiles.verification_status`.

7. **Quy tắc moderation nội dung**
   - tour;
   - companion post;
   - guide profile;
   - ưu tiên hide / flag thay vì delete.

8. **Quy tắc ghi log**
   - `admin_activity_logs`;
   - `user_role_change_logs`;
   - `report_processing_history`.

9. **Bộ dữ liệu demo admin**
   - tài khoản admin;
   - moderator;
   - support staff;
   - dữ liệu vi phạm mẫu;
   - guide chờ duyệt;
   - tài khoản bị khóa;
   - report ở nhiều trạng thái khác nhau.

---

### 5. Phương án được chọn

### 5.1. Mô hình phân quyền được chọn
Phương án được chọn là:
- dùng **`roles` + `user_roles`** làm nguồn dữ liệu phân quyền chính thức;
- backend kiểm tra quyền bằng **guard theo role**;
- frontend hiển thị menu và action theo role hiện có;
- mọi thay đổi phân quyền phải ghi vào **`user_role_change_logs`**.

#### Quy tắc áp dụng
- `SYSTEM_ADMIN`: toàn quyền trong Admin Area;
- `CONTENT_MODERATOR`: tập trung moderation nội dung, xem dashboard, xem report liên quan nội dung;
- `SUPPORT_STAFF`: tập trung xử lý report, cập nhật tiến độ, phối hợp moderation khi cần;
- user có thể có nhiều role, nhưng menu hiển thị theo tập quyền thực tế.

### 5.2. Mô hình quản lý trạng thái tài khoản được chọn
Phương án được chọn:
- dùng trực tiếp `public.users.status` với ba giá trị:
  - `active`
  - `suspended`
  - `locked`

#### Quy tắc chuyển trạng thái
- `active -> suspended`: dùng khi cần hạn chế truy cập tạm thời;
- `active -> locked`: dùng khi vi phạm nghiêm trọng hoặc cần chặn đăng nhập;
- `suspended -> active`: mở lại sau xử lý;
- `locked -> active`: chỉ System Admin mới nên thực hiện;
- không cho role thấp hơn tự đổi trạng thái tài khoản quản trị cấp cao.

### 5.3. State machine được chọn cho `reports`
Phương án được chọn:
- `open`
- `assigned`
- `in_review`
- `resolved`
- `rejected`

#### Quy tắc chuyển trạng thái
- khi user gửi report, hệ thống tạo report ở `open`;
- khi Support Staff hoặc admin nhận xử lý, report chuyển sang `assigned`;
- khi đang kiểm tra hoặc phối hợp moderation, chuyển sang `in_review`;
- khi đã có kết luận và hành động phù hợp, chuyển sang `resolved`;
- nếu report không hợp lệ hoặc không đủ căn cứ, chuyển sang `rejected`.

#### Quy tắc dữ liệu đi kèm
- `assigned_to_user_id` phải có khi trạng thái là `assigned` hoặc `in_review`;
- `processed_by_user_id`, `processed_at`, `resolution_note` nên có khi `resolved` hoặc `rejected`;
- mọi thay đổi trạng thái phải ghi vào `report_processing_history`.

### 5.4. Quy tắc đối tượng bị báo cáo được chọn
Schema hỗ trợ nhiều `target_type`, nhưng trong Sprint 08 nên ưu tiên các nhóm có giá trị demo cao nhất:
- `tour`
- `companion_post`
- `user`
- `guide_profile`

#### Những gì chưa làm sâu
- `tour_review`
- `guide_review`

Hai nhóm review vẫn giữ đúng schema nhưng chưa cần làm flow moderation quá sâu trong sprint này.

### 5.5. Quy tắc phê duyệt xác minh hướng dẫn viên được chọn
Phương án được chọn:
- luồng nghiệp vụ đi qua **`guide_verification_requests`**;
- tài liệu xác minh đi qua **`guide_verification_documents`**;
- kết quả duyệt đồng bộ ngược sang **`guide_profiles.verification_status`**.

#### Quy tắc xử lý
- request mới tạo ở `pending`;
- admin duyệt -> request `approved`, guide profile `approved`;
- admin từ chối -> request `rejected`, guide profile `rejected`;
- khi cần, document có thể đổi sang `accepted` / `rejected` để thể hiện chi tiết;
- `result_note` nên bắt buộc khi từ chối.

### 5.6. Quy tắc moderation được chọn
Phương án được chọn:
- ưu tiên moderation bằng **`visibility_status`**:
  - `visible`
  - `hidden`
  - `flagged`
- chỉ can thiệp `business_status` khi thực sự liên quan nghiệp vụ nội dung.

#### Ứng dụng theo từng loại dữ liệu
- `guide_profiles.visibility_status`
- `tours.visibility_status`
- `companion_posts.visibility_status`

#### Nguyên tắc xử lý
- nội dung đáng ngờ: `flagged`;
- nội dung xác định vi phạm: `hidden`;
- nội dung phục hồi sau xử lý: `visible`.

### 5.7. Phạm vi dashboard được chọn
Dashboard admin chỉ làm ở mức:
- số lượng user;
- số lượng tour;
- số lượng bài đồng hành;
- số lượng report đang mở;
- số hồ sơ guide chờ duyệt;
- lối tắt tới M39, M41, M42, M43, M45, M47.

Không làm biểu đồ nặng, không làm analytics nâng cao trong sprint này.

### 5.8. Phạm vi audit được chọn
Phương án được chọn:
- thao tác admin quan trọng ghi vào `admin_activity_logs`;
- thay đổi role ghi thêm `user_role_change_logs`;
- xử lý report ghi vào `report_processing_history`.

#### Action nên bắt buộc ghi log
- khóa / mở khóa tài khoản;
- gán / thu hồi role;
- duyệt / từ chối xác minh guide;
- hide / unhide / flag content;
- assign / resolve report.

### 5.9. Phạm vi màn hình được chọn
Sprint 08 triển khai:
- **M20** Gửi báo cáo vi phạm
- **M38** Dashboard quản trị trực quan
- **M39** Quản lý người dùng và nhân sự quản trị
- **M40** Phân quyền quản trị
- **M41** Quản lý hồ sơ hướng dẫn viên và xác minh
- **M42** Quản trị tour toàn hệ thống
- **M43** Quản trị bài đồng hành toàn hệ thống
- **M45** Tiếp nhận / phân loại / cập nhật xử lý báo cáo
- **M47** Nhật ký hoạt động quản trị

#### Những gì chưa làm sâu trong sprint này
- **M44** Kiểm duyệt đánh giá và nội dung phản hồi
- **M46** Thống kê và báo cáo hệ thống nâng cao

---

### 6. Ghi chú triển khai

- Sprint 08 phải tái sử dụng tối đa nền kỹ thuật đã dựng ở Sprint 01–07:
  - auth;
  - role guard;
  - layout theo area;
  - bảng dữ liệu;
  - badge trạng thái;
  - modal xác nhận;
  - chuẩn response API.
- Không nên tách một dashboard admin quá cầu kỳ. Quan trọng nhất là:
  - có dữ liệu thật;
  - có điều hướng nhanh;
  - có trạng thái rõ ràng;
  - có thao tác đúng quyền.
- Nên xây theo hướng mỗi màn hình admin là một module rõ:
  - users
  - roles
  - guides-verification
  - tours moderation
  - companion moderation
  - reports
  - audit logs
- Luồng report và luồng moderation phải liên kết được với nhau, nhưng không cần ép tất cả xử lý trong cùng một API.
- Kết thúc sprint này phải có một bộ **tài khoản demo đa vai trò** để phục vụ test và bảo vệ.

---

### 7. Chức năng trọng tâm

Sprint 08 tập trung vào 5 nhóm chức năng sau:

- **F06 – Gửi báo cáo vi phạm**
- **F25 – Quản trị dữ liệu tổng thể**
- **F26 – Phê duyệt hồ sơ chuyên môn hướng dẫn viên**
- **F27 – Quản lý nội dung vi phạm**
- **F29 – Giao diện quản trị trực quan**

#### Phạm vi thực hiện trong Sprint 08
- user gửi report từ các đối tượng hợp lệ;
- admin xem dashboard tổng quan;
- System Admin quản lý user và role;
- admin duyệt / từ chối xác minh hướng dẫn viên;
- Content Moderator quản lý hiển thị tour và bài đồng hành;
- Support Staff tiếp nhận và xử lý report;
- hệ thống ghi audit và history phù hợp.

#### Những gì chưa làm sâu trong sprint này
- thống kê nâng cao;
- review moderation toàn diện;
- export file;
- workflow nhiều bước quá nặng;
- hệ thống phân công xử lý phức tạp kiểu SLA.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình trong Sprint 08 phải thể hiện được:
- có đầu vào từ user;
- có khu vực xử lý ở admin;
- có phân quyền truy cập;
- có bảng danh sách, bộ lọc, badge trạng thái, action rõ ràng;
- có log và lịch sử xử lý đủ để giải thích nghiệp vụ.

### 8.2. Các màn hình cần triển khai trong Sprint 08

#### M20 – Gửi báo cáo vi phạm
**Vai trò:** User đã đăng nhập.

**Mục tiêu màn hình**
- cho phép người dùng phản ánh đối tượng không phù hợp;
- tạo điểm vào chính thức cho report flow.

**Nội dung chính**
- loại đối tượng bị báo cáo;
- thông tin đối tượng liên quan;
- lý do báo cáo;
- mô tả chi tiết;
- nút gửi;
- thông báo tiếp nhận.

**Ghi chú triển khai**
- có thể mở dưới dạng modal từ chi tiết tour / chi tiết bài đồng hành / hồ sơ guide;
- nên khóa nút gửi khi thiếu reason hoặc target không hợp lệ;
- sau khi gửi thành công, cho phép user xem `GET /me/reports`.

#### M38 – Dashboard quản trị trực quan
**Vai trò:** `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF` theo quyền.

**Mục tiêu màn hình**
- là điểm vào của Admin Area;
- cung cấp số liệu vận hành cơ bản;
- điều hướng nhanh tới các khu vực xử lý.

**Nội dung chính**
- số lượng user;
- số lượng tour;
- số lượng bài đồng hành;
- số report mở;
- số guide verification chờ duyệt;
- shortcut tới user management, reports, verification, moderation, audit logs.

**Ghi chú triển khai**
- không cần biểu đồ nặng;
- mỗi card nên click được để đi tới module tương ứng.

#### M39 – Quản lý người dùng và nhân sự quản trị
**Vai trò:** `SYSTEM_ADMIN`.

**Mục tiêu màn hình**
- quản lý tài khoản user và tài khoản quản trị;
- khóa / mở khóa tài khoản;
- xem vai trò và trạng thái hiện tại.

**Nội dung chính**
- danh sách tài khoản;
- bộ lọc vai trò;
- bộ lọc trạng thái;
- chi tiết hồ sơ cơ bản;
- action khóa / mở khóa;
- liên kết sang phân quyền.

**Ghi chú triển khai**
- nên có cảnh báo khi thao tác với tài khoản quản trị;
- nên ngăn tự khóa tài khoản đang đăng nhập nếu gây mất quyền.

#### M40 – Phân quyền quản trị
**Vai trò:** `SYSTEM_ADMIN`.

**Mục tiêu màn hình**
- gán, thu hồi hoặc điều chỉnh role quản trị;
- hiển thị lịch sử thay đổi quyền.

**Nội dung chính**
- danh sách tài khoản;
- role hiện tại;
- danh sách role khả dụng;
- action assign / revoke;
- lịch sử thay đổi quyền;
- ghi chú thay đổi nếu cần.

**Ghi chú triển khai**
- mọi thay đổi phải ghi `user_role_change_logs`;
- có thể mở dạng trang + drawer chi tiết cho từng user.

#### M41 – Quản lý hồ sơ hướng dẫn viên và xác minh
**Vai trò:** `SYSTEM_ADMIN`, người được giao duyệt; `CONTENT_MODERATOR` phối hợp kiểm duyệt nội dung hồ sơ.

**Mục tiêu màn hình**
- xem hồ sơ guide;
- xem tài liệu xác minh;
- duyệt hoặc từ chối xác minh;
- điều chỉnh hiển thị hồ sơ nếu cần.

**Nội dung chính**
- danh sách guide profile;
- trạng thái verification;
- tài liệu xác minh;
- ghi chú xử lý;
- nút approve / reject;
- nút hide / unhide profile.

**Ghi chú triển khai**
- nên tách rõ hai nhóm action:
  - action xác minh nghề nghiệp;
  - action moderation hiển thị hồ sơ.

#### M42 – Quản trị tour toàn hệ thống
**Vai trò:** `SYSTEM_ADMIN`, `CONTENT_MODERATOR`.

**Mục tiêu màn hình**
- kiểm soát dữ liệu tour trên toàn hệ thống;
- hỗ trợ ẩn / hiện / gắn cờ nội dung tour;
- hỗ trợ truy vết guide sở hữu.

**Nội dung chính**
- danh sách tour;
- guide sở hữu;
- trạng thái nghiệp vụ;
- trạng thái hiển thị;
- số lượng người tham gia;
- action view detail / hide / unhide / flag.

**Ghi chú triển khai**
- ưu tiên moderation trên `visibility_status`;
- không làm sửa tour trực tiếp từ admin nếu chưa cần.

#### M43 – Quản trị bài đồng hành toàn hệ thống
**Vai trò:** `SYSTEM_ADMIN`, `CONTENT_MODERATOR`.

**Mục tiêu màn hình**
- kiểm soát bài tìm bạn đồng hành trên toàn hệ thống;
- xử lý bài bị báo cáo hoặc có dấu hiệu vi phạm.

**Nội dung chính**
- danh sách bài;
- chủ bài;
- điểm đến;
- thời gian;
- trạng thái hiển thị;
- action view detail / hide / unhide / flag.

**Ghi chú triển khai**
- cách thao tác nên tương tự M42 để giữ UX nhất quán.

#### M45 – Tiếp nhận / phân loại / cập nhật xử lý báo cáo
**Vai trò:** `SUPPORT_STAFF`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR` phối hợp khi liên quan nội dung.

**Mục tiêu màn hình**
- là trung tâm xử lý report;
- gán người xử lý;
- cập nhật tiến độ;
- xem lịch sử xử lý;
- phối hợp moderation.

**Nội dung chính**
- danh sách report;
- target bị báo cáo;
- người báo cáo;
- lý do;
- trạng thái;
- người phụ trách;
- ghi chú;
- lịch sử xử lý;
- action assign / review / resolve / reject.

**Ghi chú triển khai**
- nên có filter theo `status`, `target_type`, `assigned_to`, thời gian;
- nên có panel chi tiết hiển thị thông tin target để admin không phải nhảy màn hình quá nhiều.

#### M47 – Nhật ký hoạt động quản trị
**Vai trò:** `SYSTEM_ADMIN`.

**Mục tiêu màn hình**
- theo dõi thao tác quản trị;
- phục vụ minh bạch và truy vết.

**Nội dung chính**
- actor;
- role thực hiện;
- module;
- entity;
- action;
- thời gian;
- reason;
- metadata cơ bản;
- bộ lọc theo người thực hiện hoặc loại action.

**Ghi chú triển khai**
- hiển thị log gần nhất trước;
- nên có filter theo khoảng thời gian và module.

### 8.3. Thành phần UI dùng chung cần tận dụng
- layout admin;
- sidebar theo role;
- table chuẩn có filter và pagination;
- badge trạng thái;
- modal xác nhận hành động nhạy cảm;
- drawer xem chi tiết;
- tabs cho profile / verification / history;
- card tổng hợp dashboard;
- empty state;
- loading state;
- toast thành công / thất bại.

### 8.4. Kết quả mong đợi của phần màn hình
- user gửi report được từ màn hình phù hợp;
- admin vào dashboard thấy số liệu cơ bản;
- System Admin quản lý user và role được;
- admin xử lý report được;
- moderator ẩn / gắn cờ tour hoặc bài đồng hành được;
- System Admin xem audit log được.

---

### 9. Bảng CSDL chính

### 9.1. `reports`
#### Vai trò
Lưu báo cáo vi phạm do user gửi lên hệ thống.

#### Trường quan trọng
- `id`
- `reporter_user_id`
- `target_type`
- `tour_id`
- `companion_post_id`
- `reported_user_id`
- `guide_profile_id`
- `reason`
- `description`
- `status`
- `assigned_to_user_id`
- `processed_by_user_id`
- `processed_at`
- `resolution_note`
- `created_at`
- `updated_at`

#### Vai trò trong Sprint 08
Đây là bảng trung tâm của report flow. M20 ghi dữ liệu vào đây, M45 đọc và cập nhật dữ liệu từ đây.

### 9.2. `report_processing_history`
#### Vai trò
Lưu lịch sử xử lý của từng report.

#### Trường quan trọng
- `report_id`
- `action_by_user_id`
- `action_type`
- `old_status`
- `new_status`
- `note`
- `created_at`

#### Vai trò trong Sprint 08
Dùng để truy vết các bước:
- created
- assigned
- status_changed
- note_added
- resolved
- rejected
- hidden_target
- restored_target

### 9.3. `users`
#### Vai trò
Lưu hồ sơ nghiệp vụ của người dùng và trạng thái tài khoản.

#### Trường quan trọng
- `id`
- `email`
- `full_name`
- `phone`
- `avatar_url`
- `status`
- `created_at`
- `updated_at`
- `last_seen_at`

#### Vai trò trong Sprint 08
Dùng cho:
- M39 quản lý user;
- M45 xác định reporter / assignee / processor;
- xác định actor trong audit log.

### 9.4. `roles`
#### Vai trò
Danh mục vai trò hệ thống.

#### Trường quan trọng
- `role_code`
- `description`

#### Vai trò trong Sprint 08
Dùng để dựng M40 và seed vai trò:
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

### 9.5. `user_roles`
#### Vai trò
Liên kết user với role.

#### Trường quan trọng
- `user_id`
- `role_code`
- `assigned_by`
- `assigned_at`

#### Vai trò trong Sprint 08
Dùng để kiểm tra quyền truy cập Admin Area và quyền thao tác cụ thể.

### 9.6. `guide_verification_requests`
#### Vai trò
Lưu yêu cầu xác minh của hướng dẫn viên.

#### Trường quan trọng
- `guide_profile_id`
- `submitted_at`
- `status`
- `submission_note`
- `processed_by_user_id`
- `processed_at`
- `result_note`

#### Vai trò trong Sprint 08
Là nguồn dữ liệu chính của M41 cho luồng duyệt / từ chối xác minh.

### 9.7. `guide_verification_documents`
#### Vai trò
Lưu tài liệu xác minh đi kèm với request xác minh.

#### Trường quan trọng
- `verification_request_id`
- `document_type`
- `file_url`
- `uploaded_at`
- `status`
- `note`

#### Vai trò trong Sprint 08
Cho phép admin xem tài liệu và quyết định xác minh.

### 9.8. `guide_profiles`
#### Vai trò
Lưu hồ sơ nghề nghiệp của hướng dẫn viên.

#### Trường quan trọng
- `user_id`
- `bio`
- `years_of_experience`
- `working_area`
- `verification_status`
- `visibility_status`
- `is_accepting_tours`

#### Vai trò trong Sprint 08
Dùng cho moderation hồ sơ guide và đồng bộ trạng thái sau khi xử lý verification.

### 9.9. `admin_activity_logs`
#### Vai trò
Lưu log thao tác quản trị.

#### Trường quan trọng
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
- `created_at`

#### Vai trò trong Sprint 08
Là nền cho M47 và cho tính minh bạch của toàn bộ Admin Area.

### 9.10. `user_role_change_logs`
#### Vai trò
Lưu lịch sử thay đổi quyền của user.

#### Trường quan trọng
- `target_user_id`
- `changed_role_code`
- `action_type`
- `changed_by_user_id`
- `old_snapshot`
- `new_snapshot`
- `note`
- `created_at`

#### Vai trò trong Sprint 08
Là căn cứ truy vết cho M40 khi gán hoặc thu hồi vai trò.

### 9.11. Bảng hỗ trợ cần lưu ý thêm
Dù không phải bảng trung tâm của sprint, M42 và M43 vẫn cần đọc / cập nhật:
- `tours`
- `companion_posts`

Trong đó trọng tâm là:
- `business_status`
- `visibility_status`
- `is_deleted`

### 9.12. Ghi chú triển khai dữ liệu
- cần seed đủ dữ liệu report ở nhiều trạng thái;
- cần seed ít nhất 1 guide đang `pending verification`;
- cần seed ít nhất 1 tour bị `flagged`;
- cần seed ít nhất 1 companion post bị `hidden`;
- cần seed ít nhất 1 user `suspended` và 1 user `locked`.

---

### 10. API cần thiết

### 10.1. `POST /reports`
#### Mục đích
Tạo báo cáo vi phạm từ phía user.

#### Request gợi ý
```json
{
  "targetType": "tour",
  "tourId": "uuid",
  "reason": "Thông tin tour không phù hợp",
  "description": "Nội dung mô tả và dữ liệu thực tế không khớp."
}
```

#### Kết quả mong đợi
- tạo bản ghi `reports` ở trạng thái `open`;
- tạo history ban đầu trong `report_processing_history`;
- trả về thông báo tiếp nhận thành công.

### 10.2. `GET /me/reports`
#### Mục đích
Cho user xem danh sách report do chính mình gửi.

#### Query gợi ý
- `status`
- `page`
- `limit`

#### Kết quả mong đợi
- user theo dõi được tình trạng báo cáo;
- tránh phải gửi lại trùng lặp vì không biết report cũ đang ở đâu.

### 10.3. `GET /admin/dashboard`
#### Mục đích
Lấy dữ liệu tổng hợp cho M38.

#### Kết quả mong đợi
Trả về các chỉ số tổng quan:
- totalUsers
- totalTours
- totalCompanionPosts
- openReports
- pendingGuideVerifications

### 10.4. `GET /admin/users`
#### Mục đích
Lấy danh sách user cho M39.

#### Query gợi ý
- `keyword`
- `role`
- `status`
- `page`
- `limit`

#### Kết quả mong đợi
Có thể lọc theo:
- role;
- status;
- user thường / nhân sự quản trị.

### 10.5. `PATCH /admin/users/:id/status`
#### Mục đích
Khóa / mở khóa / tạm đình chỉ tài khoản.

#### Request gợi ý
```json
{
  "status": "locked",
  "reason": "Vi phạm nhiều lần sau khi đã nhắc nhở."
}
```

#### Kết quả mong đợi
- cập nhật `users.status`;
- ghi `admin_activity_logs`;
- chặn tài khoản thao tác theo đúng rule.

### 10.6. `GET /admin/roles`
#### Mục đích
Lấy danh sách role để hiển thị ở M40.

#### Kết quả mong đợi
Frontend có nguồn dữ liệu chuẩn để assign / revoke role.

### 10.7. `POST /admin/users/:id/roles`
#### Mục đích
Gán vai trò cho user.

#### Request gợi ý
```json
{
  "roleCode": "SUPPORT_STAFF",
  "note": "Bổ sung nhân sự xử lý report."
}
```

#### Kết quả mong đợi
- thêm bản ghi vào `user_roles`;
- ghi `user_role_change_logs`;
- ghi `admin_activity_logs`.

### 10.8. `DELETE /admin/users/:id/roles/:role`
#### Mục đích
Thu hồi vai trò của user.

#### Kết quả mong đợi
- xóa bản ghi ở `user_roles`;
- ghi log thay đổi quyền;
- không cho thu hồi theo cách phá vỡ toàn bộ quyền truy cập hệ thống nếu chưa có rule dự phòng.

### 10.9. `GET /admin/role-change-logs`
#### Mục đích
Lấy lịch sử thay đổi role.

#### Kết quả mong đợi
Phục vụ truy vết tại M40 hoặc màn chi tiết quyền.

### 10.10. `GET /admin/guides`
#### Mục đích
Lấy danh sách hồ sơ hướng dẫn viên cho M41.

#### Query gợi ý
- `verificationStatus`
- `visibilityStatus`
- `keyword`
- `page`
- `limit`

#### Kết quả mong đợi
Có thể lọc nhanh các hồ sơ đang chờ duyệt.

### 10.11. `GET /admin/guide-verification`
#### Mục đích
Lấy danh sách request xác minh và tài liệu đi kèm.

#### Kết quả mong đợi
Phục vụ tab verification riêng trong M41.

### 10.12. `PATCH /admin/guide-verification/:id`
#### Mục đích
Duyệt hoặc từ chối request xác minh.

#### Request gợi ý
```json
{
  "status": "approved",
  "resultNote": "Hồ sơ hợp lệ, giấy tờ đầy đủ."
}
```

#### Kết quả mong đợi
- cập nhật `guide_verification_requests.status`;
- cập nhật `guide_profiles.verification_status`;
- ghi `admin_activity_logs`.

### 10.13. `PATCH /admin/guides/:id/moderation`
#### Mục đích
Ẩn / hiện / gắn cờ hồ sơ guide.

#### Request gợi ý
```json
{
  "visibilityStatus": "hidden",
  "reason": "Hồ sơ hiển thị thông tin chưa phù hợp."
}
```

#### Kết quả mong đợi
- cập nhật `guide_profiles.visibility_status`;
- ghi log moderation.

### 10.14. `GET /admin/tours`
#### Mục đích
Lấy danh sách tour toàn hệ thống cho M42.

#### Query gợi ý
- `businessStatus`
- `visibilityStatus`
- `province`
- `guideId`
- `page`
- `limit`

#### Kết quả mong đợi
Phục vụ moderation tour ở mức toàn hệ thống.

### 10.15. `PATCH /admin/tours/:id/moderation`
#### Mục đích
Ẩn / hiện / gắn cờ tour.

#### Request gợi ý
```json
{
  "visibilityStatus": "flagged",
  "reason": "Tour bị nhiều người dùng phản ánh."
}
```

#### Kết quả mong đợi
- cập nhật `tours.visibility_status`;
- ghi log moderation;
- nếu có report liên quan, có thể cập nhật history tương ứng.

### 10.16. `GET /admin/companion-posts`
#### Mục đích
Lấy danh sách bài đồng hành toàn hệ thống cho M43.

#### Query gợi ý
- `businessStatus`
- `visibilityStatus`
- `destination`
- `page`
- `limit`

#### Kết quả mong đợi
Phục vụ moderation bài đồng hành.

### 10.17. `PATCH /admin/companion-posts/:id/moderation`
#### Mục đích
Ẩn / hiện / gắn cờ bài đồng hành.

#### Request gợi ý
```json
{
  "visibilityStatus": "hidden",
  "reason": "Bài đăng có nội dung không phù hợp."
}
```

#### Kết quả mong đợi
- cập nhật `companion_posts.visibility_status`;
- ghi log moderation.

### 10.18. `GET /admin/reports`
#### Mục đích
Lấy danh sách report cho M45.

#### Query gợi ý
- `status`
- `targetType`
- `assignedTo`
- `keyword`
- `page`
- `limit`

#### Kết quả mong đợi
Có thể lọc nhanh report đang mở, đã gán, đang review, đã giải quyết.

### 10.19. `PATCH /admin/reports/:id`
#### Mục đích
Cập nhật trạng thái và nội dung xử lý report.

#### Request gợi ý
```json
{
  "status": "resolved",
  "assignedToUserId": "uuid",
  "resolutionNote": "Đã ẩn nội dung vi phạm và thông báo cho người dùng."
}
```

#### Kết quả mong đợi
- cập nhật `reports`;
- thêm bản ghi `report_processing_history`;
- nếu cần thì đồng bộ moderation target.

### 10.20. `GET /admin/reports/:id/history`
#### Mục đích
Xem toàn bộ lịch sử xử lý của một report.

#### Kết quả mong đợi
Admin có thể giải thích rõ report đã đi qua những bước nào.

### 10.21. `GET /admin/activity-logs`
#### Mục đích
Lấy dữ liệu cho M47.

#### Query gợi ý
- `module`
- `actionType`
- `actorUserId`
- `dateFrom`
- `dateTo`
- `page`
- `limit`

#### Kết quả mong đợi
Hỗ trợ truy vết thao tác quản trị.

### 10.22. API hỗ trợ nên cân nhắc thêm
- `GET /admin/statistics` nếu muốn tách khỏi dashboard;
- `GET /admin/users/:id/role-history`;
- `POST /rpc/write_admin_activity_log` nếu backend cần gọi RPC hoặc hàm DB riêng.

### 10.23. Yêu cầu kỹ thuật chung cho API
- trả lỗi rõ ràng theo role / permission;
- thống nhất response shape giữa admin modules;
- có pagination cho danh sách lớn;
- có filter tối thiểu cho report, user, guide, tour, companion;
- mọi action nhạy cảm phải có reason hoặc note nếu phù hợp.

---

### 11. Công việc frontend

### 11.1. Dựng `M20 Gửi báo cáo vi phạm`
- tạo form báo cáo dùng lại được ở nhiều màn hình;
- hiển thị đúng target đang báo cáo;
- validate trường bắt buộc;
- sau khi gửi thành công, reset form và thông báo tiếp nhận.

### 11.2. Dựng `M38 Dashboard quản trị`
- card tổng hợp số liệu;
- quick action links;
- skeleton loading;
- empty state nếu chưa có dữ liệu.

### 11.3. Dựng `M39 Quản lý người dùng và nhân sự quản trị`
- bảng danh sách user;
- lọc theo role / status;
- badge trạng thái tài khoản;
- modal đổi trạng thái;
- liên kết sang phân quyền.

### 11.4. Dựng `M40 Phân quyền quản trị`
- form assign role;
- bảng role hiện có;
- hiển thị lịch sử thay đổi quyền;
- xác nhận trước khi revoke role.

### 11.5. Dựng `M41 Quản lý hồ sơ hướng dẫn viên và xác minh`
- bảng guide profile;
- panel chi tiết hồ sơ;
- tab verification documents;
- nút approve / reject;
- badge verification status và visibility status.

### 11.6. Dựng `M42 Quản trị tour toàn hệ thống`
- bảng tour toàn hệ thống;
- bộ lọc trạng thái;
- action hide / unhide / flag;
- liên kết xem chi tiết.

### 11.7. Dựng `M43 Quản trị bài đồng hành toàn hệ thống`
- bảng companion posts;
- bộ lọc destination / status;
- action moderation;
- hiển thị chủ bài và thời gian.

### 11.8. Dựng `M45 Tiếp nhận và xử lý báo cáo`
- bảng report có filter;
- badge trạng thái report;
- drawer chi tiết report;
- tab history;
- action assign / in_review / resolve / reject.

### 11.9. Dựng `M47 Nhật ký hoạt động quản trị`
- bảng log;
- filter actor / module / action type;
- hiển thị thời gian và lý do;
- xem chi tiết old/new data ở mức rút gọn.

### 11.10. Chuẩn hóa menu và điều hướng theo role
- `SYSTEM_ADMIN`: thấy đầy đủ;
- `CONTENT_MODERATOR`: ẩn các màn quản lý role / log không được phép;
- `SUPPORT_STAFF`: tập trung dashboard + reports.

### 11.11. Chuẩn hóa component badge trạng thái
Cần thống nhất badge cho:
- user status;
- report status;
- verification status;
- visibility status.

### 11.12. Tạo UX chống thao tác sai
- modal confirm cho lock account, revoke role, reject verification, hide content;
- disable nút khi không đủ quyền;
- tooltip giải thích lý do action bị khóa.

### 11.13. Hiển thị lỗi nghiệp vụ dễ hiểu
Ví dụ:
- không đủ quyền;
- không thể thu hồi role cuối cùng của tài khoản quản trị chính;
- report đã được xử lý trước đó;
- guide verification request không còn ở trạng thái pending.

### 11.14. Test flow phía frontend
Cần test ít nhất:
1. user gửi report thành công;
2. support staff nhận report và cập nhật trạng thái;
3. moderator ẩn tour hoặc bài đồng hành;
4. system admin khóa user;
5. system admin gán role;
6. system admin duyệt guide verification;
7. system admin xem log.

### 11.15. Kết quả mong đợi phía frontend
- giao diện admin rõ ràng;
- menu đúng theo vai trò;
- thao tác mượt, ít nhầm;
- thể hiện rõ chiều sâu quản trị khi demo.

---

### 12. Công việc backend

### 12.1. Hoàn thiện module `reports-notifications` cho report flow
- endpoint tạo report;
- endpoint list report của user;
- validate target hợp lệ;
- tạo history ban đầu.

### 12.2. Hoàn thiện module `admin`
- dashboard service;
- users service;
- roles service;
- reports service;
- moderation service;
- audit log service.

### 12.3. Xử lý quản lý trạng thái tài khoản
- update `users.status`;
- chặn thao tác khi tài khoản bị khóa;
- kiểm tra không cho role thấp tác động lên role cao.

### 12.4. Xử lý role assignment
- assign / revoke role;
- kiểm tra role hợp lệ;
- chống duplicate role;
- ghi `user_role_change_logs`;
- ghi `admin_activity_logs`.

### 12.5. Xử lý guide verification approval
- list request pending;
- approve / reject request;
- đồng bộ sang guide profile;
- lưu `processed_by_user_id`, `processed_at`, `result_note`.

### 12.6. Xử lý moderation guide profile
- update `guide_profiles.visibility_status`;
- ghi log hide / unhide / flag.

### 12.7. Xử lý moderation tour
- list tour toàn hệ thống;
- cập nhật `tours.visibility_status`;
- ghi audit log.

### 12.8. Xử lý moderation companion post
- list companion posts toàn hệ thống;
- cập nhật `companion_posts.visibility_status`;
- ghi audit log.

### 12.9. Xử lý report lifecycle
- open -> assigned;
- assigned -> in_review;
- in_review -> resolved / rejected;
- ghi `report_processing_history` ở mọi bước;
- lưu `assigned_to_user_id`, `processed_by_user_id`, `resolution_note`.

### 12.10. Xử lý audit log
- tạo helper / interceptor / service ghi `admin_activity_logs`;
- chuẩn hóa `module_name`, `entity_type`, `action_type`;
- lưu `old_data`, `new_data` khi cần.

### 12.11. Xử lý role-based guard nhiều cấp
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

Cần tách rõ:
- ai được xem;
- ai được cập nhật;
- ai được gán role;
- ai được khóa tài khoản.

### 12.12. Kiểm tra ownership và thứ bậc vai trò
Backend nên chống các trường hợp:
- support staff khóa system admin;
- content moderator gán role quản trị;
- user thường tự gọi admin endpoint.

### 12.13. Chuẩn hóa response và lỗi cho admin modules
- cùng format trả về;
- cùng format lỗi validation;
- dễ debug khi test Postman.

### 12.14. Kết nối moderation với report flow ở mức hợp lý
Không bắt buộc mọi report phải tự động ẩn nội dung, nhưng nên có khả năng:
- admin xử lý report;
- sau đó thực hiện action moderation tương ứng;
- history thể hiện được việc đó.

### 12.15. Kết quả mong đợi phía backend
- API admin chạy ổn định;
- guard chặt chẽ;
- history và log ghi đúng;
- report flow khép kín.

---

### 13. Công việc database

### 13.1. Chuẩn hóa dữ liệu `reports`
- kiểm tra ràng buộc `target_type`;
- bảo đảm mỗi report chỉ tham chiếu đúng loại target;
- tối ưu `status`, `assigned_to_user_id`, `created_at`.

### 13.2. Chuẩn hóa dữ liệu `report_processing_history`
- action_type đồng bộ với flow thực tế;
- cho phép truy vết trạng thái cũ / mới;
- ghi chú rõ ràng cho thao tác quan trọng.

### 13.3. Chuẩn hóa dữ liệu phân quyền
- seed đầy đủ `roles`;
- kiểm tra unique trên `user_roles`;
- chuẩn hóa seed cho admin accounts.

### 13.4. Chuẩn hóa dữ liệu verification
- seed guide verification pending / approved / rejected;
- gắn tài liệu tương ứng;
- bảo đảm relation `guide_profile -> request -> documents`.

### 13.5. Chuẩn hóa dữ liệu moderation
- bảo đảm tour / companion / guide có các giá trị:
  - `visible`
  - `hidden`
  - `flagged`

### 13.6. Thêm index cần thiết
Ưu tiên index cho:
- `reports(status, assigned_to_user_id, created_at)`
- `guide_verification_requests(status, submitted_at)`
- `admin_activity_logs(actor_user_id, module_name, created_at)`
- `user_role_change_logs(target_user_id, created_at)`

### 13.7. Seed tài khoản quản trị
Tối thiểu:
- 1 `SYSTEM_ADMIN`
- 1 `CONTENT_MODERATOR`
- 1 `SUPPORT_STAFF`

### 13.8. Seed dữ liệu vi phạm mẫu
Tối thiểu cần có:
- 1 tour bị report;
- 1 companion post bị report;
- 1 guide profile chờ duyệt;
- 1 report đang `open`;
- 1 report `assigned`;
- 1 report `in_review`;
- 1 report `resolved`;
- 1 report `rejected`.

### 13.9. Seed dữ liệu log mẫu
- 1 log assign role;
- 1 log lock account;
- 1 log approve verification;
- 1 log hide companion post;
- 1 log resolve report.

### 13.10. Kiểm tra toàn vẹn dữ liệu
- role tồn tại trước khi gán;
- user phải tồn tại trước khi đổi status;
- report history phải tham chiếu report hợp lệ;
- verification documents phải thuộc request hợp lệ.

### 13.11. Kiểm tra RLS / quyền truy cập dữ liệu
- user thường không truy cập admin data;
- support staff chỉ truy cập phần được phép;
- admin endpoints vẫn nên qua backend để kiểm soát tốt hơn.

### 13.12. Kết quả mong đợi phía database
- dữ liệu demo đủ đẹp để test;
- index đủ cho truy vấn admin;
- không có dữ liệu trạng thái sai logic.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- mô tả quyền theo vai trò admin;
- mô tả report flow;
- mô tả moderation flow;
- mô tả guide verification flow;
- mô tả audit log và role-change log.

### 14.2. Activity Diagram cần cập nhật
- user gửi báo cáo vi phạm;
- admin tiếp nhận và xử lý báo cáo;
- system admin gán / thu hồi role;
- system admin khóa / mở khóa tài khoản;
- admin duyệt / từ chối xác minh guide.

### 14.3. Sequence Diagram nên bổ sung
- gửi báo cáo vi phạm;
- cập nhật trạng thái report;
- gán role quản trị;
- phê duyệt guide verification;
- khóa tài khoản user.

### 14.4. Class Diagram / nhóm lớp nên bổ sung
Có thể bổ sung nhóm lớp hoặc service class logic cho:
- User / Role / UserRole
- Report / ReportProcessingHistory
- GuideProfile / GuideVerificationRequest / GuideVerificationDocument
- AdminActivityLog / UserRoleChangeLog

### 14.5. Mục tiêu của phần tài liệu/UML
- cho thấy Admin Area không phải phần phụ;
- thể hiện rõ actor, quyền, trạng thái, đầu ra;
- đồng bộ với code và database;
- hỗ trợ tốt cho phần bảo vệ đồ án.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- user gửi report được;
- admin xử lý report được;
- system admin quản lý tài khoản và role được;
- admin duyệt guide verification được;
- moderator ẩn / gắn cờ tour, bài đồng hành, hồ sơ guide được.

### 15.2. Đầu ra giao diện
- có dashboard admin;
- có user management;
- có role management;
- có guide verification;
- có moderation tour / companion;
- có report handling;
- có activity log.

### 15.3. Đầu ra API
- bộ API admin lõi chạy được;
- role guard đúng;
- response thống nhất;
- có history và audit cho action quan trọng.

### 15.4. Đầu ra dữ liệu
- seed tài khoản quản trị;
- seed report đa trạng thái;
- seed guide verification pending;
- seed moderation case;
- seed log mẫu.

### 15.5. Đầu ra tài liệu
- Activity Diagram cập nhật;
- Sequence Diagram bổ sung;
- mô tả nghiệp vụ admin rõ ràng;
- phần báo cáo thể hiện được chiều sâu quản trị.

### 15.6. Tiêu chí sẵn sàng sang Sprint 09
Sprint 08 được xem là hoàn tất khi:
- Admin Area vào được theo role;
- report flow chạy trọn;
- role assignment có log;
- khóa tài khoản có log;
- guide verification có xử lý và đồng bộ trạng thái;
- moderation tour / companion / guide chạy được;
- có dữ liệu demo đủ để regression test;
- có tài liệu UML cập nhật.

---

### 16. Kết luận sprint

Sprint 08 là sprint khép lại nhóm **chức năng lõi ưu tiên 1** dưới góc nhìn vận hành và kiểm soát hệ thống. Sau sprint này, website du lịch không chỉ có khả năng:
- cho người dùng đăng ký, đăng nhập, tìm tour, gửi yêu cầu, tạo bài đồng hành;

mà còn có khả năng:
- tiếp nhận phản ánh;
- quản trị người dùng;
- kiểm duyệt nội dung;
- duyệt hồ sơ hướng dẫn viên;
- theo dõi thao tác quản trị.

Đây là bước rất quan trọng trước khi bước sang Sprint 09 – giai đoạn **ổn định MVP lõi**, nơi trọng tâm không còn là thêm chức năng mới, mà là rà soát, đồng bộ, polish và chuẩn bị cho demo chính của đồ án.

---

<a id="sprint-09"></a>
## SPRINT 09 – Ổn định phiên bản lõi và hoàn thiện MVP

### 1. Mục tiêu sprint

Sprint 09 là sprint **ổn định MVP lõi** của toàn bộ đồ án. Sau Sprint 01–08, hệ thống đã có đủ các trục nghiệp vụ quan trọng gồm **tài khoản và phân quyền, public tour, hồ sơ hướng dẫn viên, quản lý tour, yêu cầu tham gia tour, bài tìm bạn đồng hành, yêu cầu tham gia bài đồng hành, report flow và Admin lõi**. Tuy nhiên, việc “đã có chức năng” chưa đồng nghĩa với “đủ ổn định để demo chính”.

Mục tiêu của sprint này **không phải thêm chức năng mới**, mà là rà soát, kiểm thử, đồng bộ và làm sạch toàn bộ nhóm **ưu tiên 1** để tạo ra một phiên bản MVP lõi đủ ổn định, đủ mạch lạc và đủ thuyết phục khi trình bày đồ án.

#### Mục tiêu chính
- Rà soát toàn bộ nhóm chức năng đã triển khai trong phạm vi:
  - **F01–F17**
  - **F25–F27**
  - **F29**
- Đồng bộ lại giữa **database – backend – frontend – tài liệu/UML** để giảm lệch logic giữa các lớp.
- Chốt **4 luồng demo chính** của hệ thống và kiểm thử theo luồng nghiệp vụ hoàn chỉnh, không test rời rạc từng API.
- Chuẩn hóa:
  - response API;
  - thông báo lỗi;
  - loading state / empty state / error state;
  - validation form;
  - menu theo vai trò;
  - phân trang / lọc / sắp xếp ở các màn hình lõi nếu còn thiếu.
- Refactor các service và query đang hoạt động được nhưng chưa sạch, chưa đồng nhất hoặc có nguy cơ lỗi khi demo.
- Làm sạch dữ liệu demo để mỗi luồng đều có dữ liệu đủ đẹp, đủ dễ hiểu, đủ nhất quán khi trình chiếu.
- Chuẩn bị **Postman collection**, **checklist test tay**, **script reset dữ liệu demo** và **kịch bản demo** để sang Sprint 10 có thể mở rộng tiếp mà không phải quay lại chữa nền.

#### Ý nghĩa của sprint này
Sprint 09 là điểm chuyển từ “đã hoàn thành các sprint chức năng” sang “có một MVP lõi đủ dùng thật cho demo”. Nếu bỏ qua sprint này, hệ thống sẽ rất dễ gặp các vấn đề sau:
- UI mỗi khu vực một kiểu;
- API trả dữ liệu không đồng nhất;
- quyền truy cập bị lệch giữa frontend và backend;
- dữ liệu demo rời rạc, không kể được câu chuyện;
- UML, màn hình, API và CSDL không khớp nhau.

Nói ngắn gọn, Sprint 09 là sprint **siết chất lượng**. Sau sprint này, sản phẩm phải đủ ổn định để demo trọn vẹn các luồng:
1. **Luồng công khai / Public discovery**
2. **Luồng tham gia tour**
3. **Luồng bài tìm bạn đồng hành**
4. **Luồng quản trị và xử lý vi phạm**

---

### 2. Lưu ý trước khi triển khai

### 2.1. Sprint này không được biến thành sprint thêm tính năng mới
Tinh thần quan trọng nhất của Sprint 09 là: **không mở thêm phạm vi nghiệp vụ**.  
Các nhóm như favorite, review, verification nâng cao, bản đồ, thông báo, thống kê… là nội dung của Sprint 10–11. Nếu kéo vào Sprint 09, bạn sẽ làm loãng mục tiêu ổn định MVP.

Trong sprint này chỉ nên làm:
- sửa bug;
- polish UI;
- chuẩn hóa API;
- tối ưu query;
- chuẩn hóa dữ liệu demo;
- chốt tài liệu/UML;
- chuẩn bị demo.

### 2.2. Phải test theo luồng nghiệp vụ hoàn chỉnh
Không nên kiểm tra kiểu:
- API A chạy được;
- màn hình B hiển thị được;
- form C submit được.

Cách test đúng của Sprint 09 là test theo **luồng đầu-cuối**, ví dụ:
- khách truy cập vào danh sách tour → vào chi tiết tour → đăng nhập → gửi yêu cầu tham gia → guide duyệt → user thấy trạng thái đổi;
- user tạo bài đồng hành → người khác gửi request → chủ bài duyệt → trạng thái thay đổi đúng ở cả hai phía;
- user gửi report → admin tiếp nhận → cập nhật trạng thái xử lý → dữ liệu hiển thị đúng ở danh sách report;
- admin khóa user hoặc đổi role → menu / quyền truy cập thay đổi đúng.

### 2.3. Phải chốt trước danh sách bug ưu tiên
Sprint này rất dễ bị kéo dài vì mọi người thường “sửa tiếp cho đẹp hơn nữa”.  
Cần chia bug thành tối thiểu 3 mức:
- **Blocker / Critical**: lỗi làm hỏng luồng demo chính;
- **Major**: không chặn demo nhưng gây sai nghiệp vụ, sai quyền hoặc sai dữ liệu;
- **Minor**: lỗi giao diện, wording, khoảng cách, hiển thị phụ.

Nếu không có danh sách ưu tiên, bạn sẽ mất nhiều thời gian cho bug nhỏ nhưng bỏ sót bug phá luồng chính.

### 2.4. Phải xác định rõ 4 luồng demo chính
Sprint này chỉ thành công khi chốt được 4 luồng demo cốt lõi để:
- viết checklist test;
- chuẩn bị dữ liệu demo;
- dựng Postman collection;
- chụp ảnh màn hình;
- cập nhật UML và script thuyết trình.

Nếu chưa chốt 4 luồng demo, bạn sẽ không biết dữ liệu nào là dữ liệu “phải đẹp”, màn hình nào phải polish trước và API nào phải ổn định tuyệt đối.

### 2.5. Dữ liệu demo là một phần của MVP, không phải việc phụ
Một MVP để bảo vệ đồ án không chỉ cần code chạy, mà còn cần dữ liệu đủ đẹp để kể chuyện.  
Ví dụ:
- phải có tour ở nhiều trạng thái hợp lý;
- phải có request đang chờ, đã duyệt, đã từ chối;
- phải có bài đồng hành mở, đóng, có thành viên;
- phải có report đang chờ xử lý và report đã giải quyết;
- phải có tài khoản theo nhiều vai trò.

Nếu dữ liệu demo nghèo nàn hoặc lệch logic, buổi demo sẽ rất khó thuyết phục dù code đúng.

### 2.6. Cần rà soát điểm lệch giữa DB / API / UI / UML
Đây là sprint bắt buộc phải kiểm tra các loại lệch phổ biến:
- bảng dữ liệu có trạng thái nhưng UI không hiển thị hết;
- API backend dùng tên field khác với frontend;
- frontend cho thao tác nhưng backend chặn quyền;
- UML mô tả luồng khác với logic hiện thực;
- menu hoặc route guard chưa phản ánh đúng role.

Sprint 09 là nơi xử lý những “độ lệch nhỏ nhưng nguy hiểm” này.

### 2.7. “Xong sprint” không đồng nghĩa với “không còn bug”
Mục tiêu thực tế của Sprint 09 không phải triệt tiêu 100% bug.  
Mục tiêu đúng là:
- 4 luồng demo chạy ổn định;
- không còn lỗi blocker;
- dữ liệu demo nhất quán;
- tài liệu/UML khớp với bản hiện thực;
- hệ thống có thể reset về trạng thái demo chuẩn;
- người thực hiện có checklist test và kịch bản thuyết trình rõ ràng.

---

### 3. Các vấn đề cần xác định trong sprint này

### 3.1. Danh sách bug ưu tiên
Cần xác định:
- bug nào chặn demo;
- bug nào làm sai nghiệp vụ;
- bug nào chỉ là giao diện phụ;
- bug nào có thể để lại tới Sprint 14.

### 3.2. Bốn luồng demo chính của hệ thống
Cần chốt chính thức:
1. **Luồng công khai / Public discovery**
2. **Luồng tour**
3. **Luồng bài đồng hành**
4. **Luồng quản trị / report / moderation**

### 3.3. Phạm vi polish màn hình
Cần xác định:
- màn hình nào chỉ sửa state và wording;
- màn hình nào phải sửa form và validation;
- màn hình nào phải sửa table/filter/pagination;
- màn hình nào phải polish gấp vì dùng trong demo.

### 3.4. Phạm vi regression test API
Cần xác định:
- nhóm API nào bắt buộc phải test lại toàn bộ;
- endpoint nào cần thêm filter / sort / pagination;
- endpoint nào đang trả lỗi chưa đồng nhất;
- endpoint nào đang thiếu kiểm tra role hoặc ownership.

### 3.5. Phạm vi chuẩn hóa response và lỗi
Cần chốt:
- format response thành công;
- format lỗi nghiệp vụ;
- format lỗi validation;
- thông điệp lỗi người dùng nhìn thấy trên UI;
- mapping giữa HTTP status và lỗi hiển thị.

### 3.6. Chiến lược dữ liệu demo
Cần xác định:
- bộ seed demo chuẩn;
- script reset dữ liệu demo;
- tài khoản demo cho từng vai trò;
- bộ dữ liệu để kể đủ 4 luồng demo;
- dữ liệu nào nên cố định, dữ liệu nào sinh mới khi test.

### 3.7. Quy tắc kiểm tra phân quyền và ownership
Cần rà soát:
- user chỉ thấy dữ liệu của mình;
- guide chỉ quản lý tour / request thuộc phạm vi của mình;
- admin role đúng phạm vi quyền;
- route guard frontend và backend guard không lệch nhau.

### 3.8. Phạm vi cập nhật tài liệu/UML
Cần xác định:
- Activity Diagram nào phải chốt;
- màn hình nào phải cập nhật mô tả cuối;
- mapping nào cần sửa;
- phần nào đủ để dùng trong báo cáo giữa kỳ / demo chính.

---

### 4. Hạng mục cần chốt

Sprint 09 cần chốt rõ các hạng mục sau trước khi bắt đầu sửa đồng loạt:

- Không bổ sung nghiệp vụ mới trong sprint này.
- Danh sách bug theo mức độ ưu tiên.
- 4 luồng demo chính của hệ thống.
- Checklist test tay theo từng luồng nghiệp vụ.
- Danh sách màn hình lõi phải polish.
- Danh sách API lõi phải regression test.
- Quy ước response và error dùng chung.
- Bộ dữ liệu demo lõi và script reset.
- Tiêu chí nghiệm thu MVP.
- Danh sách tài liệu/UML phải cập nhật để khớp hiện trạng code.

---

### 5. Phương án được chọn

### 5.1. Chiến lược tổng thể được chọn
Phương án được chọn cho Sprint 09 là:

- **không thêm chức năng mới**;
- tập trung vào **làm sạch – đồng bộ – kiểm thử – ổn định**;
- lấy **4 luồng demo chính** làm trục;
- ưu tiên sửa từ **blocker → major → minor**;
- mọi chỉnh sửa phải được đối chiếu qua 4 lớp:
  - database;
  - backend;
  - frontend;
  - tài liệu/UML.

#### Quy tắc áp dụng
- bất kỳ thay đổi nào làm phát sinh nghiệp vụ mới sẽ chuyển sang sprint sau;
- thay đổi schema chỉ thực hiện nếu thật sự cần để sửa lỗi logic hoặc toàn vẹn dữ liệu;
- bug không ảnh hưởng demo có thể ghi lại để xử lý ở Sprint 14;
- chỉ polish sâu những màn hình nằm trong 4 luồng demo chính.

### 5.2. Bốn luồng demo chính được chọn
Bốn luồng demo chính được chọn để làm chuẩn kiểm thử và nghiệm thu MVP là:

#### Luồng 1 – Công khai / Public discovery
- vào trang chủ;
- xem danh sách tour;
- lọc / tìm kiếm tour;
- xem chi tiết tour;
- xem danh sách bài đồng hành;
- xem chi tiết bài đồng hành;
- điều hướng sang đăng nhập / đăng ký khi cần thao tác sâu.

#### Luồng 2 – Tham gia tour
- user đăng nhập;
- xem chi tiết tour;
- gửi yêu cầu tham gia tour;
- xem yêu cầu của tôi;
- guide vào khu vực quản lý yêu cầu tour;
- guide duyệt hoặc từ chối;
- user thấy trạng thái thay đổi đúng.

#### Luồng 3 – Bài tìm bạn đồng hành
- user tạo bài đồng hành;
- bài hiển thị ở danh sách công khai;
- user khác xem chi tiết bài;
- gửi yêu cầu tham gia;
- chủ bài xem danh sách request;
- chủ bài duyệt hoặc từ chối;
- bên gửi request thấy đúng trạng thái kết quả.

#### Luồng 4 – Quản trị và xử lý vi phạm
- user gửi báo cáo vi phạm;
- admin / staff tiếp nhận report;
- moderator hoặc admin thực hiện cập nhật xử lý;
- nếu cần thì khóa user hoặc moderation nội dung;
- hệ thống lưu log quản trị và lịch sử xử lý.

### 5.3. Cách ưu tiên bug được chọn
Bug được ưu tiên theo 3 mức:

#### Mức 1 – Blocker
Lỗi thuộc mức này phải xử lý ngay:
- không đăng nhập được;
- không gửi request được;
- không duyệt request được;
- report flow không chạy;
- route guard sai làm lộ quyền;
- API crash hoặc trả sai cấu trúc khiến màn hình chính vỡ.

#### Mức 2 – Major
Lỗi thuộc mức này xử lý sau blocker:
- trạng thái cập nhật sai giữa hai màn hình;
- pagination / filter sai;
- dữ liệu hiển thị thiếu trường quan trọng;
- validation thiếu khiến người dùng nhập sai dữ liệu;
- audit / log / ownership xử lý chưa đúng.

#### Mức 3 – Minor
Lỗi có thể gom xử lý sau:
- wording chưa chuẩn;
- icon / spacing / alignment chưa đẹp;
- màu badge chưa thống nhất;
- text cảnh báo chưa thân thiện;
- một số empty state chưa đủ rõ.

### 5.4. Phạm vi màn hình được chọn
Sprint 09 sẽ polish và kiểm thử các màn hình lõi sau:

- **Public Area:** `M01–M06`, `M10–M11`
- **User Area:** `M15–M16`, `M20–M21`, `M23–M26`
- **Guide Area:** `M31–M32`, `M34–M37`
- **Admin Area:** `M38–M45`, `M47`

#### Những gì chưa làm trong sprint này
- favorite / review / verification mở rộng của Sprint 10;
- map / notification / statistics của Sprint 11;
- chat / AI / accommodation / payment của các sprint sau.

### 5.5. Chuẩn hóa API được chọn
Phương án chuẩn hóa API trong sprint này là:
- giữ nguyên endpoint lõi đã có nếu không bắt buộc phải đổi;
- chỉ bổ sung hoặc chỉnh ở các điểm:
  - pagination;
  - filter;
  - sort;
  - error handling;
  - response wrapper;
  - validation message;
  - ownership / role checking.

#### Quy tắc response
- danh sách trả theo cấu trúc thống nhất: `items`, `pagination`, `filtersApplied` nếu cần;
- chi tiết trả theo cấu trúc object rõ ràng, không dùng field mơ hồ;
- lỗi validation trả về đủ thông tin để frontend gắn vào field;
- lỗi nghiệp vụ phải có mã lỗi ngắn gọn, dễ map ra UI.

### 5.6. Chiến lược dữ liệu demo được chọn
Phương án được chọn là chuẩn hóa một **bộ seed demo lõi** gồm:
- tài khoản `USER`, `GUIDE`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF`;
- guide profile đã public và guide profile chưa hoàn chỉnh để test quyền;
- tour ở các trạng thái phù hợp cho public và guide area;
- tour request với `pending`, `approved`, `rejected`, `cancelled`;
- companion post với dữ liệu đẹp, đủ chi tiết;
- companion request ở nhiều trạng thái;
- report ở các trạng thái `pending`, `in_review`, `resolved`, `rejected`;
- log quản trị và role change log cơ bản.

#### Quy tắc áp dụng
- luôn có script reset để đưa hệ thống về đúng trạng thái demo;
- dữ liệu dùng cho demo phải có mô tả, tên, trạng thái dễ hiểu;
- không để dữ liệu test bừa làm loãng màn hình danh sách;
- mọi dữ liệu phục vụ 4 luồng demo phải được kiểm tra lại sau mỗi đợt fix lớn.

### 5.7. Tiêu chí nghiệm thu MVP được chọn
MVP lõi sau Sprint 09 được xem là đạt khi thỏa các điều kiện sau:

1. **Không còn bug blocker** trong 4 luồng demo chính.  
2. Các màn hình lõi đều có:
   - loading state;
   - empty state;
   - error state;
   - thông báo thao tác thành công / thất bại cơ bản.
3. Menu và route theo vai trò hoạt động đúng.
4. Backend guard và ownership check hoạt động đúng.
5. Các API lõi được regression test lại.
6. Dữ liệu demo có thể reset về trạng thái chuẩn.
7. Activity Diagram của toàn bộ nhóm ưu tiên 1 đã được chốt.
8. Mapping chức năng – API – bảng dữ liệu không còn lệch logic nghiêm trọng.

---

### 6. Ghi chú triển khai

- Nên bắt đầu sprint bằng việc lập **bug board** và **test checklist**, không lao vào sửa UI ngay.
- Nên fix theo thứ tự:
  1. lỗi phá luồng;
  2. lỗi quyền;
  3. lỗi dữ liệu;
  4. lỗi API;
  5. lỗi UI/UX.
- Mỗi bug sửa xong cần test lại đúng luồng nghiệp vụ liên quan.
- Nếu phải đổi schema, chỉ đổi ở mức tối thiểu và phải cập nhật lại seed / reset script ngay.
- Không nên để Sprint 09 thành sprint refactor vô hạn; refactor chỉ làm ở những chỗ ảnh hưởng trực tiếp tới độ ổn định.
- Mọi thay đổi nên cập nhật đồng thời:
  - code;
  - dữ liệu demo;
  - checklist test;
  - tài liệu/UML liên quan.

---

### 7. Chức năng trọng tâm

Sprint 09 không thêm chức năng mới, mà tập trung rà soát và ổn định các chức năng đã triển khai trong nhóm **ưu tiên 1**.

#### Phạm vi thực hiện trong Sprint 09
- **F01** Đăng ký, đăng nhập, đăng xuất
- **F02** Quản lý hồ sơ cá nhân
- **F03** Phân quyền người dùng
- **F06** Gửi báo cáo vi phạm
- **F08** Quản lý hồ sơ hướng dẫn viên
- **F10** Quản lý tour
- **F11** Quản lý yêu cầu tham gia tour
- **F12** Xem danh sách tour
- **F13** Tìm kiếm, lọc và sắp xếp tour
- **F14** Xem chi tiết tour
- **F16** Quản lý bài tìm bạn đồng hành
- **F17** Quản lý yêu cầu tham gia bài đồng hành
- **F25** Quản trị dữ liệu tổng thể
- **F26** Phê duyệt hồ sơ chuyên môn của hướng dẫn viên
- **F27** Quản lý nội dung vi phạm
- **F29** Giao diện quản trị trực quan

#### Trọng tâm nghiệp vụ theo area

##### Public Area
- luồng truy cập công khai phải mượt;
- bộ lọc tour phải dùng được;
- trang chi tiết tour và chi tiết bài đồng hành phải rõ ràng, không lỗi dữ liệu;
- điều hướng sang auth khi cần thao tác sâu phải đúng.

##### User Area
- hồ sơ cá nhân và đổi mật khẩu phải ổn định;
- request tour của tôi phải hiển thị đúng trạng thái;
- bài đồng hành của tôi, yêu cầu tôi gửi và yêu cầu trên bài của tôi phải đồng bộ.

##### Guide Area
- dashboard và hồ sơ guide phải hiển thị đúng dữ liệu;
- danh sách tour của tôi, form tạo/sửa tour và locations phải hoạt động ổn định;
- xử lý request tour phải đúng quyền và đúng trạng thái.

##### Admin Area
- dashboard admin phải dùng được ở mức lõi;
- user management và role management phải ổn định;
- guide verification, moderation và report flow phải chạy xuyên suốt;
- audit log phải đủ để giải thích thao tác quản trị.

#### Những gì chưa làm sâu trong sprint này
- yêu thích tour/guide;
- đánh giá tour / guide;
- bản đồ tour;
- lịch sử hoạt động;
- thông báo;
- thống kê nâng cao;
- chat, AI, lưu trú, thanh toán.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình trong Sprint 09 không xây mới, mà tập trung:
- polish UI;
- thống nhất layout;
- đồng bộ badge trạng thái;
- xử lý loading / error / empty state;
- sửa validation;
- kiểm tra route guard;
- tối ưu luồng thao tác để demo mượt.

### 8.2. Các màn hình cần triển khai trong Sprint 09

#### Public Area
- **M01 – Trang chủ**
- **M02 – Đăng ký tài khoản**
- **M03 – Đăng nhập**
- **M04 – Danh sách tour**
- **M05 – Tìm kiếm / lọc / sắp xếp tour**
- **M06 – Chi tiết tour**
- **M10 – Danh sách bài tìm bạn đồng hành**
- **M11 – Chi tiết bài tìm bạn đồng hành**

#### User Area
- **M15 – Hồ sơ cá nhân**
- **M16 – Đổi mật khẩu**
- **M20 – Gửi báo cáo vi phạm**
- **M21 – Yêu cầu tham gia tour của tôi**
- **M23 – Danh sách bài đồng hành của tôi**
- **M24 – Tạo/cập nhật bài tìm bạn đồng hành**
- **M25 – Yêu cầu tham gia bài đồng hành đã gửi**
- **M26 – Quản lý yêu cầu tham gia bài đồng hành**

#### Guide Area
- **M31 – Dashboard hướng dẫn viên**
- **M32 – Quản lý hồ sơ hướng dẫn viên của tôi**
- **M34 – Danh sách tour của tôi**
- **M35 – Tạo / cập nhật tour**
- **M36 – Quản lý lịch trình / địa điểm tour**
- **M37 – Quản lý yêu cầu tham gia tour**

#### Admin Area
- **M38 – Dashboard quản trị trực quan**
- **M39 – Quản lý người dùng và nhân sự quản trị**
- **M40 – Phân quyền quản trị**
- **M41 – Quản lý hồ sơ hướng dẫn viên và xác minh**
- **M42 – Quản trị tour toàn hệ thống**
- **M43 – Quản trị bài đồng hành toàn hệ thống**
- **M45 – Tiếp nhận / phân loại / cập nhật xử lý báo cáo**
- **M47 – Nhật ký hoạt động quản trị**

### 8.3. Thành phần UI dùng chung cần chuẩn hóa lại
- App layout theo area
- sidebar / topbar / breadcrumb
- card danh sách
- table dùng chung
- modal xác nhận
- badge trạng thái
- pagination
- filter bar
- form field + validation message
- empty state
- skeleton / loading state
- error state / retry state
- toast / alert thông báo thao tác

### 8.4. Kết quả mong đợi của phần màn hình
- các màn hình chính không còn lỗi vỡ layout ở dữ liệu demo chuẩn;
- badge trạng thái nhất quán giữa tour, request, report, tài khoản;
- thao tác submit form có loading và thông báo rõ ràng;
- menu theo role không còn hiển thị sai;
- màn hình danh sách có phân trang / lọc / sắp xếp ở mức đủ dùng nếu endpoint đã hỗ trợ;
- người xem demo có thể theo dõi luồng thao tác liền mạch, không phải “giải thích hộ giao diện”.

---

### 9. Bảng CSDL chính

Sprint 09 không thêm nhóm bảng mới, mà rà soát toàn bộ các bảng lõi đã dùng từ Sprint 01 đến Sprint 08.

### 9.1. Nhóm tài khoản, phân quyền và audit
- `users`
- `roles`
- `user_roles`
- `admin_activity_logs`
- `user_role_change_logs`

#### Vai trò trong Sprint 09
- kiểm tra lại toàn vẹn role;
- kiểm tra route guard / ownership;
- kiểm tra tác động khi đổi role hoặc khóa user;
- làm sạch log và dữ liệu phân quyền demo.

### 9.2. Nhóm hồ sơ hướng dẫn viên
- `guide_profiles`
- `languages`
- `skills`
- `guide_languages`
- `guide_skills`
- `guide_verification_requests`
- `guide_verification_documents`

#### Vai trò trong Sprint 09
- kiểm tra dữ liệu guide profile hiển thị đồng nhất giữa public / guide / admin;
- rà soát trạng thái hiển thị và xác minh đang dùng;
- chưa mở rộng thêm verification flow mới.

### 9.3. Nhóm tour và public tour
- `tour_categories`
- `tours`
- `tour_images`
- `tour_locations`
- `tour_requests`

#### Vai trò trong Sprint 09
- kiểm tra public visibility của tour;
- rà soát dữ liệu ảnh, lịch trình, ngày bắt đầu / kết thúc;
- kiểm tra state machine request tour;
- tối ưu query danh sách / chi tiết / quản lý tour.

### 9.4. Nhóm bài tìm bạn đồng hành
- `companion_posts`
- `companion_requests`

#### Vai trò trong Sprint 09
- kiểm tra trạng thái bài và request;
- kiểm tra dữ liệu hiển thị giữa public list, detail, dashboard user và admin;
- chuẩn hóa dữ liệu demo để luồng bài đồng hành kể chuyện tốt hơn.

### 9.5. Nhóm report và xử lý vi phạm
- `reports`
- `report_processing_history`

#### Vai trò trong Sprint 09
- kiểm tra report flow từ user sang admin;
- kiểm tra target_type, status, action_type và lịch sử xử lý;
- rà soát các trường dùng cho moderation hiển thị đúng trên UI.

### 9.6. Bảng hỗ trợ cần lưu ý thêm
Ngoài các bảng lõi trên, Sprint 09 cũng cần kiểm tra các bảng liên quan gián tiếp đến hiển thị và thống nhất dữ liệu nếu chúng đã được dùng trong bản hiện thực:
- `tour_reviews` nếu đã đọc để hiển thị tóm tắt;
- `guide_reviews` nếu đã đọc để hiển thị tóm tắt;
- các bảng join / lookup đang được gọi ở dashboard hoặc detail screen.

Tuy nhiên, **không mở sâu logic favorite / review / notification / chat** trong sprint này.

### 9.7. Ghi chú triển khai dữ liệu
- rà soát FK, unique và check constraint trên toàn bộ nhóm bảng lõi;
- tối ưu index cho bảng danh sách lớn hoặc bảng dùng filter nhiều;
- chuẩn hóa seed demo;
- backup schema hiện tại trước khi refactor dữ liệu;
- chuẩn bị script reset dữ liệu demo cho 4 luồng chính.

---

### 10. API cần thiết

Sprint 09 không phát sinh nhóm API mới theo nghiệp vụ, nhưng phải regression test và chuẩn hóa toàn bộ API lõi đã dùng trong Sprint 01–08.

### 10.1. Nhóm auth và hồ sơ người dùng
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

#### Mục tiêu của nhóm này
- kiểm tra đăng nhập / đăng xuất / điều hướng đúng role;
- kiểm tra dữ liệu hồ sơ cá nhân và đổi mật khẩu;
- chuẩn hóa lỗi auth và validation.

### 10.2. Nhóm public tour
- `GET /home/featured-tours`
- `GET /home/featured-guides`
- `GET /home/latest-companion-posts`
- `GET /tour-categories`
- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/reviews` nếu đã dùng

#### Mục tiêu của nhóm này
- kiểm tra dữ liệu công khai;
- kiểm tra filter / sort / pagination;
- kiểm tra chi tiết tour không lỗi join dữ liệu;
- kiểm tra trạng thái tour public hiển thị đúng.

### 10.3. Nhóm guide profile
- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /languages`
- `GET /skills`

#### Mục tiêu của nhóm này
- kiểm tra create / update guide profile;
- kiểm tra hiển thị công khai và hiển thị ở dashboard guide;
- kiểm tra ownership.

### 10.4. Nhóm guide tour management
- `GET /guide/tours`
- `POST /tours`
- `PATCH /tours/:id`
- `POST /tours/:id/images`
- `DELETE /tours/:id/images/:imageId`
- `GET /tours/:id/locations`
- `PUT /tours/:id/locations`
- `PATCH /tours/:id/status`

#### Mục tiêu của nhóm này
- kiểm tra luồng quản lý tour xuyên suốt;
- kiểm tra create / update / publish / close;
- kiểm tra ảnh và locations.

### 10.5. Nhóm tour requests
- `POST /tour-requests`
- `GET /me/tour-requests`
- `PATCH /tour-requests/:id/cancel`
- `GET /guide/tour-requests`
- `PATCH /guide/tour-requests/:id/approve`
- `PATCH /guide/tour-requests/:id/reject`

#### Mục tiêu của nhóm này
- kiểm tra state machine `pending / approved / rejected / cancelled`;
- kiểm tra user view và guide view đồng bộ;
- kiểm tra giới hạn quyền thao tác.

### 10.6. Nhóm companion posts và companion requests
- `GET /companion-posts`
- `GET /companion-posts/:id`
- `POST /companion-posts`
- `PATCH /companion-posts/:id`
- `DELETE /companion-posts/:id`
- `POST /companion-requests`
- `GET /me/companion-requests`
- `GET /my-companion-posts/:id/requests`
- `PATCH /companion-requests/:id/cancel`
- `PATCH /my-companion-requests/:id/approve`
- `PATCH /my-companion-requests/:id/reject`

#### Mục tiêu của nhóm này
- kiểm tra luồng đồng hành đầu-cuối;
- kiểm tra đồng bộ trạng thái giữa chủ bài và người gửi request;
- kiểm tra ownership ở post và request.

### 10.7. Nhóm report và admin lõi
- `POST /reports`
- `GET /me/reports`
- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/roles`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles/:role`
- `GET /admin/role-change-logs`
- `GET /admin/guides`
- `GET /admin/guide-verification`
- `PATCH /admin/guide-verification/:id`
- `PATCH /admin/guides/:id/moderation`
- `GET /admin/tours`
- `PATCH /admin/tours/:id/moderation`
- `GET /admin/companion-posts`
- `PATCH /admin/companion-posts/:id/moderation`
- `GET /admin/reports`
- `PATCH /admin/reports/:id`
- `GET /admin/reports/:id/history`
- `GET /admin/activity-logs`

#### Mục tiêu của nhóm này
- kiểm tra phân quyền admin nhiều lớp;
- kiểm tra report flow;
- kiểm tra moderation flow;
- kiểm tra audit log và role change log.

### 10.8. Yêu cầu kỹ thuật chung cho API
- response phải đồng nhất giữa các module;
- lỗi validation phải parse được ở frontend;
- lỗi quyền phải phân biệt rõ `401 / 403 / 404`;
- endpoint danh sách cần bổ sung `page`, `limit`, `sort`, `order`, filter nếu hợp lý;
- service không được để N+1 query rõ rệt ở màn hình danh sách;
- Postman collection phải bám theo 4 luồng demo chính.

---

### 11. Công việc frontend

### 11.1. Đồng bộ UI giữa 4 area
- rà soát lại style của Public, User, Guide, Admin;
- đồng bộ spacing, typography, màu badge, kích thước nút, table cell, modal footer;
- bảo đảm các layout lớn không bị “mỗi sprint một kiểu”.

### 11.2. Chuẩn hóa trạng thái màn hình
Mỗi màn hình lõi cần có đủ:
- loading state;
- empty state;
- error state;
- success state sau submit;
- retry state nếu API lỗi.

### 11.3. Rà soát menu và điều hướng theo role
- kiểm tra menu sau đăng nhập của `USER`, `GUIDE`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF`;
- kiểm tra route ẩn / hiện đúng theo quyền;
- kiểm tra redirect khi không đủ quyền.

### 11.4. Hoàn thiện validation form
Tập trung vào:
- đăng ký / đăng nhập;
- hồ sơ cá nhân;
- hồ sơ hướng dẫn viên;
- tạo / cập nhật tour;
- gửi yêu cầu tour;
- tạo / cập nhật bài đồng hành;
- gửi report;
- phân quyền / đổi trạng thái user trong admin.

### 11.5. Polish các màn hình công khai
- `M01–M06`, `M10–M11`
- kiểm tra card list, filter bar, detail section, CTA button, empty state và điều hướng đăng nhập.

### 11.6. Polish các màn hình User Area
- `M15–M16`, `M20–M21`, `M23–M26`
- kiểm tra timeline thao tác, danh sách request, trạng thái request, form tạo bài, form report.

### 11.7. Polish các màn hình Guide Area
- `M31–M32`, `M34–M37`
- kiểm tra danh sách tour, form tour, location manager, request manager, badge trạng thái.

### 11.8. Polish các màn hình Admin Area
- `M38–M45`, `M47`
- kiểm tra table lớn, filter, action button, modal confirm, lịch sử xử lý, log, phân quyền.

### 11.9. Chuẩn hóa component dùng chung
- button;
- badge trạng thái;
- confirm dialog;
- textarea có đếm ký tự nếu cần;
- table container;
- pagination;
- filter toolbar;
- search box;
- info card / stats card cơ bản.

### 11.10. Tạo checklist test phía frontend
Checklist nên bám vào từng luồng:
- public;
- tour;
- companion;
- admin.

Mỗi bước test cần ghi:
- input;
- hành động;
- kết quả mong đợi;
- trạng thái pass/fail;
- ghi chú bug nếu có.

### 11.11. Kết quả mong đợi phía frontend
- UI đồng nhất hơn rõ rệt;
- không còn màn hình chính thiếu loading / empty / error state;
- thao tác submit dễ hiểu hơn;
- demo đi theo luồng ít phải “nói đỡ” cho giao diện.

---

### 12. Công việc backend

### 12.1. Refactor service ở các module lõi
Tập trung vào:
- auth;
- users;
- guide-profile;
- tours;
- tour-requests;
- companion-posts;
- companion-requests;
- reports;
- admin.

### 12.2. Tối ưu query cho màn hình danh sách
Các màn hình sau cần rà soát query:
- danh sách tour;
- danh sách bài đồng hành;
- danh sách tour của guide;
- danh sách request tour;
- danh sách request đồng hành;
- danh sách users / reports / tours / companion posts ở admin.

### 12.3. Chuẩn hóa response và lỗi
- thống nhất wrapper response;
- thống nhất cách trả validation error;
- chuẩn hóa lỗi nghiệp vụ như:
  - không đủ quyền;
  - không đúng ownership;
  - trạng thái không cho phép thao tác;
  - dữ liệu không tồn tại / đã bị ẩn / đã xóa mềm.

### 12.4. Rà soát role guard và ownership
Cần kiểm tra lại:
- user chỉ sửa dữ liệu của mình;
- guide chỉ thao tác với tour và request thuộc mình;
- admin role không vượt hoặc thiếu quyền ngoài thiết kế;
- frontend hide route và backend protect route cùng một logic.

### 12.5. Bổ sung pagination / filter / sort nếu còn thiếu
Các endpoint danh sách quan trọng cần hỗ trợ tối thiểu:
- `page`, `limit`
- `sortBy`, `sortOrder`
- filter theo trạng thái nếu có ý nghĩa
- query text cơ bản nếu có màn hình tìm kiếm / quản trị danh sách lớn.

### 12.6. Tạo Postman collection theo 4 luồng demo
Collection nên chia folder:
1. Public
2. Tour flow
3. Companion flow
4. Admin flow

Mỗi folder nên có:
- request chạy đúng thứ tự;
- environment variables;
- dữ liệu mẫu;
- ghi chú expected result.

### 12.7. Tạo checklist regression test backend
- test happy path;
- test validation fail;
- test forbidden;
- test not found;
- test wrong state transition;
- test ownership violation.

### 12.8. Kết quả mong đợi phía backend
- API lõi ổn định hơn;
- lỗi trả ra nhất quán hơn;
- query danh sách đỡ nặng hơn;
- role / ownership ít lệch hơn;
- demo ít gặp lỗi bất ngờ do dữ liệu hoặc trạng thái.

---

### 13. Công việc database

### 13.1. Rà soát khóa ngoại và toàn vẹn tham chiếu
Kiểm tra lại:
- request có trỏ đúng parent object không;
- log / history có FK hợp lý không;
- dữ liệu xóa mềm có gây mồ côi dữ liệu hay không;
- các bảng join có bản ghi trùng / thiếu không.

### 13.2. Rà soát unique và check constraint
Các điểm nên kiểm tra kỹ:
- role assignment trùng;
- request trùng logic;
- trạng thái không hợp lệ;
- ngày tour không hợp lệ;
- dữ liệu profile cơ bản sai miền giá trị;
- moderation / report status sai enum.

### 13.3. Tối ưu index
Index nên ưu tiên cho:
- các bảng danh sách lớn;
- các bảng lọc theo trạng thái;
- các bảng join hoặc lookup nhiều;
- các cột search / sort hay dùng ở admin.

### 13.4. Chuẩn hóa lại seed data
Seed lại dữ liệu theo bộ demo lõi:
- user thường;
- guide;
- admin;
- moderator;
- support staff;
- tour và request mẫu;
- companion post và request mẫu;
- report và log mẫu.

### 13.5. Backup schema và script reset dữ liệu demo
Sprint 09 bắt buộc nên có:
- bản backup schema đang chạy ổn;
- seed chuẩn cho demo;
- script reset về trạng thái “đẹp” sau khi test phá dữ liệu.

### 13.6. Rà soát trạng thái dữ liệu thực tế
Ví dụ:
- tour public có thật sự `published` và `visible`;
- request đã duyệt có khớp số lượng hiển thị;
- bài đồng hành đóng có còn nhận request hay không;
- user bị khóa còn đăng nhập được không;
- nội dung bị moderation có còn hiện ở public list không.

### 13.7. Kết quả mong đợi phía database
- dữ liệu demo sạch, đẹp, đúng logic;
- ràng buộc chặt hơn;
- ít rủi ro lệch trạng thái khi demo;
- có khả năng reset dữ liệu nhanh trước buổi trình bày.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- chốt lại phạm vi MVP lõi;
- cập nhật mô tả màn hình đã code;
- cập nhật mapping chức năng – API – bảng dữ liệu;
- cập nhật checklist test và script demo;
- ghi rõ phần nào đã hoàn thiện, phần nào để sprint sau.

### 14.2. Activity Diagram cần chốt
Sprint 09 nên chốt đầy đủ Activity Diagram cho nhóm ưu tiên 1:
- đăng ký / đăng nhập / đăng xuất;
- cập nhật hồ sơ cá nhân;
- tạo / cập nhật hồ sơ hướng dẫn viên;
- xem danh sách tour / chi tiết tour;
- guide tạo / sửa tour;
- user gửi yêu cầu tham gia tour;
- guide duyệt / từ chối yêu cầu tour;
- tạo bài đồng hành;
- gửi / duyệt / từ chối yêu cầu tham gia bài đồng hành;
- gửi report;
- admin xử lý report và moderation cơ bản.

### 14.3. Sequence Diagram nên rà soát lại
Nếu đã có Sequence Diagram cho luồng chính, cần kiểm tra chúng còn khớp với bản hiện thực hay không, đặc biệt là:
- gửi yêu cầu tham gia tour;
- duyệt yêu cầu tour;
- gửi yêu cầu tham gia bài đồng hành;
- xử lý report.

### 14.4. Mapping cần rà soát
- mã chức năng ↔ màn hình;
- màn hình ↔ bảng dữ liệu;
- bảng dữ liệu ↔ API;
- quyền theo role ↔ màn hình ↔ endpoint.

### 14.5. Mục tiêu của phần tài liệu/UML
Sau Sprint 09, tài liệu không chỉ “có để nộp”, mà phải đủ để:
- giải thích luồng demo;
- đối chiếu logic khi sửa bug;
- dùng trực tiếp cho báo cáo và bảo vệ.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng
- không thêm chức năng mới;
- toàn bộ nhóm ưu tiên 1 được rà soát và ổn định hơn;
- 4 luồng demo chính chạy được đầu-cuối.

### 15.2. Đầu ra giao diện
- màn hình lõi được polish rõ rệt;
- loading / empty / error state đầy đủ hơn;
- menu và điều hướng theo quyền rõ ràng hơn;
- form dễ dùng và ít lỗi hơn.

### 15.3. Đầu ra API
- API lõi đã regression test;
- response và error thống nhất hơn;
- endpoint danh sách quan trọng có pagination / filter / sort ở mức cần thiết;
- có Postman collection bám theo 4 luồng demo chính.

### 15.4. Đầu ra dữ liệu
- dữ liệu demo đẹp, dễ kể chuyện;
- có script reset dữ liệu demo;
- có backup schema ổn định;
- bảng lõi được rà soát constraint và index.

### 15.5. Đầu ra tài liệu
- Activity Diagram nhóm ưu tiên 1 được chốt;
- mô tả màn hình được cập nhật theo bản hiện thực;
- mapping chức năng – API – bảng dữ liệu được rà soát lại;
- có checklist test tay và script demo.

### 15.6. Tiêu chí sẵn sàng sang Sprint 10
Sprint 09 được xem là hoàn thành tốt khi:
- 4 luồng demo chính không còn bug blocker;
- quyền truy cập và ownership đã ổn;
- dữ liệu demo đã đẹp và reset được;
- backend và frontend đã đồng bộ hơn;
- tài liệu/UML không còn lệch nghiêm trọng với code;
- bạn có thể tự tin demo MVP lõi trước khi mở rộng sang favorite, review và verification sâu hơn.

---

### 16. Kết luận sprint

Sprint 09 là sprint mang tính “đóng lõi” của toàn bộ giai đoạn ưu tiên 1. Giá trị lớn nhất của sprint này không nằm ở việc thêm một chức năng mới, mà nằm ở việc biến các phần đã làm thành **một MVP lõi thực sự có thể trình diễn, có thể kiểm thử, có thể giải thích và có thể bảo vệ**.

Nếu thực hiện tốt Sprint 09, bạn sẽ có một hệ thống đủ ổn định để:
- demo mạch lạc;
- sửa lỗi có định hướng;
- viết báo cáo dễ hơn;
- mở rộng Sprint 10–11 mà không bị quay lại sửa nền liên tục.

Nói cách khác, Sprint 09 là sprint giúp đồ án chuyển từ trạng thái **“đã làm nhiều phần”** sang trạng thái **“có một phiên bản lõi hoàn chỉnh và thuyết phục”**.

---

<a id="sprint-10"></a>
## SPRINT 10 – Hoàn thiện nhóm ưu tiên 2: yêu thích, đánh giá và xác minh hồ sơ

### 1. Mục tiêu sprint

Sprint 10 là sprint bổ sung lớp chức năng **ưu tiên 2** sau khi phần MVP lõi đã được ổn định ở Sprint 09. Nếu Sprint 01–09 giúp hệ thống hình thành được các luồng bắt buộc để demo, thì Sprint 10 giúp sản phẩm **“dày hơn”, đáng tin hơn và có tính cá nhân hóa rõ hơn**.

Trọng tâm của sprint này không còn nằm ở việc mở thêm một trục nghiệp vụ hoàn toàn mới, mà là bổ sung ba nhóm chức năng có giá trị thực tế cao:

- **F05 – Quản lý danh sách yêu thích**
- **F09 – Xác minh hồ sơ hướng dẫn viên**
- **F18 – Đánh giá tour và hướng dẫn viên**

Ba nhóm này có vai trò khác nhau nhưng liên kết chặt với nhau:

- **favorite** giúp người dùng lưu lại đối tượng quan tâm để quay lại sau;
- **review** giúp tăng độ tin cậy xã hội của tour và guide;
- **verification** giúp tăng độ tin cậy nghề nghiệp của hồ sơ hướng dẫn viên.

#### Mục tiêu chính
- Bổ sung chức năng **lưu / bỏ lưu tour và hướng dẫn viên** ở mức đủ dùng, dễ demo và dễ nối với các màn hình chi tiết.
- Cho phép người dùng **đánh giá tour** và **đánh giá hướng dẫn viên** theo điều kiện nghiệp vụ rõ ràng, tránh biến review thành dữ liệu “ảo”.
- Cho phép hướng dẫn viên **gửi yêu cầu xác minh hồ sơ** và tải lên giấy tờ/chứng chỉ theo một luồng đơn giản, nhất quán với schema cuối.
- Mở rộng các màn hình đang có:
  - **M06 – Chi tiết tour**
  - **M09 – Hồ sơ hướng dẫn viên công khai**
  để hiển thị tốt hơn thông tin review, điểm trung bình và trạng thái yêu thích.
- Hoàn thiện các màn hình riêng:
  - **M18 – Danh sách yêu thích**
  - **M27 – Đánh giá tour**
  - **M28 – Đánh giá hướng dẫn viên**
  - **M33 – Xác minh hồ sơ hướng dẫn viên**
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** cho toàn bộ nhóm ưu tiên 2 này.
- Giữ đúng nguyên tắc: **không làm phình sprint**, không kéo sâu sang chat, notification thời gian thực, moderation review phức tạp hay analytics nâng cao.

#### Ý nghĩa của sprint này
Sprint 10 là bước chuyển từ một MVP lõi “đủ chạy luồng” sang một phiên bản có chiều sâu hơn về trải nghiệm và độ tin cậy. Đây là sprint rất phù hợp để:

- tăng chất lượng trình diễn đồ án;
- làm phần báo cáo phong phú hơn;
- cho thấy hệ thống không chỉ xử lý CRUD cơ bản mà còn có logic cộng đồng, tín nhiệm và xác minh.

Nếu làm tốt Sprint 10, khi bảo vệ đồ án bạn sẽ có thêm các điểm cộng sau:

- hệ thống có **tính cá nhân hóa** thông qua favorite;
- hệ thống có **tính phản hồi cộng đồng** thông qua review;
- hệ thống có **cơ chế tăng uy tín cho guide** thông qua verification;
- các màn hình chi tiết tour/guide nhìn “thật sản phẩm” hơn, không còn chỉ là trang đọc thông tin tĩnh.

---

### 2. Lưu ý trước khi triển khai

#### 2.1. Đây là sprint ưu tiên 2, không được phá vỡ MVP lõi
Sprint 10 chỉ nên bắt đầu sau khi Sprint 09 đã làm ổn định các luồng chính.  
Không nên dùng sprint này để sửa nền quá nhiều, cũng không nên kéo thêm các nhóm mở rộng như:

- chat trực tiếp;
- chat nhóm;
- thông báo thời gian thực đầy đủ;
- gợi ý tour;
- AI chatbot;
- thanh toán;
- tích hợp lưu trú.

Nếu trong lúc triển khai xuất hiện lỗi nền của Sprint 01–09, chỉ sửa các lỗi ảnh hưởng trực tiếp tới favorite, review hoặc verification. Những lỗi nền nhỏ khác nên gom lại để xử lý có kiểm soát, tránh làm loãng mục tiêu sprint.

#### 2.2. Review phải có điều kiện nghiệp vụ rõ ràng
Đây là lưu ý quan trọng nhất của Sprint 10.  
Không được cho phép mọi user đã đăng nhập đều đánh giá tùy ý, vì như vậy dữ liệu đánh giá sẽ mất giá trị nghiệp vụ và mất tính thuyết phục khi demo.

Cần chốt rõ:
- user chỉ được review khi có **tour_request hợp lệ**;
- request đó phải thuộc tour tương ứng;
- request phải ở trạng thái đủ điều kiện, tối thiểu là **approved** hoặc **paid** theo rule triển khai;
- một request chỉ được tạo review đúng số lần cho phép.

#### 2.3. Verification không được biến thành hệ thống xử lý hồ sơ quá nặng
Trong phạm vi đồ án sinh viên, verification chỉ cần đi tới mức:

- guide tạo yêu cầu xác minh;
- guide tải tài liệu lên;
- admin/backoffice có thể xem và xử lý ở sprint quản trị liên quan;
- trạng thái xác minh phản ánh lại ở guide profile và dashboard.

Không nên làm quá sâu các nội dung như:
- OCR giấy tờ;
- chấm điểm hồ sơ tự động;
- đối soát danh tính nhiều bước;
- phê duyệt nhiều cấp;
- lưu trữ pháp lý phức tạp.

#### 2.4. Phải thống nhất state machine với schema final
Tài liệu lưu ý có nhắc tới hướng trạng thái như `draft`, `submitted`, `approved`, `rejected` cho verification. Tuy nhiên schema final hiện tại của dự án đã chốt:

- `guide_verification_requests.status`: `pending`, `approved`, `rejected`
- `guide_verification_documents.status`: `submitted`, `accepted`, `rejected`

Vì Sprint 10 là sprint hiện thực hóa, **phải ưu tiên bám schema final** để tránh lệch giữa CSDL, API và tài liệu triển khai.

#### 2.5. Favorite là chức năng nhỏ nhưng cần làm gọn và chắc
Favorite dễ bị xem là “chức năng phụ”, nhưng lại là chức năng rất hiệu quả khi demo.  
Chỉ cần làm tốt các hành vi sau là đủ:
- lưu tour;
- bỏ lưu tour;
- lưu guide;
- bỏ lưu guide;
- xem danh sách đã lưu theo hai tab.

Không cần làm sâu:
- phân nhóm yêu thích;
- ghi chú cá nhân;
- đề xuất từ danh sách yêu thích;
- sync thông báo theo favorite.

#### 2.6. Seed dữ liệu là yếu tố bắt buộc
Sprint 10 gần như không thể nhìn “ra sản phẩm” nếu không có dữ liệu mẫu đủ tốt.  
Cần seed sẵn:

- một số tour đã có review;
- một số guide đã có review;
- dữ liệu favorite cho ít nhất 2–3 user mẫu;
- ít nhất 1–2 guide đã gửi verification request với tài liệu mẫu;
- điểm trung bình hiển thị được ở danh sách/chi tiết.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Phạm vi thật của chức năng yêu thích
Cần xác định Sprint 10 chỉ triển khai favorite cho:
- **tour**
- **guide**

Không mở thêm:
- favorite companion post;
- favorite accommodation;
- favorite chat/contact.

Việc giới hạn đúng phạm vi giúp module `favorites` gọn, dễ kiểm thử và dễ báo cáo.

#### 3.2. Điều kiện tạo review
Cần chốt rõ rule tạo review:
- user phải là chủ của `tour_request`;
- `tour_request` phải thuộc đúng `tour_id`;
- `guide_review` phải gắn với đúng `guide_profile_id` của tour;
- trạng thái request phải đủ điều kiện;
- không được review hộ người khác;
- không được review khi request đã bị từ chối hoặc hủy.

Đây là rule quyết định chất lượng nghiệp vụ của cả Sprint 10.

#### 3.3. Một request được tạo bao nhiêu review
Theo schema final:
- `tour_reviews.tour_request_id` là `unique`
- `guide_reviews.tour_request_id` cũng là `unique`

Điều đó ngụ ý:
- một `tour_request` có thể tạo **tối đa 1 tour review**
- và **tối đa 1 guide review**

Đây là mô hình hợp lý nhất cho phạm vi đồ án:
- đủ chặt để chống spam;
- vẫn phản ánh được việc user đánh giá cả tour lẫn guide.

#### 3.4. Điều kiện hiển thị review công khai
Không phải mọi review sinh ra đều được hiển thị công khai ngay theo mọi ngữ cảnh.  
Cần xác định rõ:
- chỉ hiển thị review có `visibility_status = 'visible'`;
- review bị `hidden` hoặc `flagged` vẫn lưu trong hệ thống nhưng không xuất hiện ở UI public;
- dữ liệu điểm trung bình ở tour/guide nên chỉ tính từ review đang hiển thị.

#### 3.5. Luồng verification của hướng dẫn viên
Cần quyết định:
- mỗi guide có được tạo nhiều request hay không;
- có cho phép tạo request mới khi đang có request `pending` không;
- document upload diễn ra trước hay sau khi tạo request;
- guide có được sửa request sau khi gửi không;
- admin xử lý request ở sprint này hay chỉ chuẩn bị dữ liệu cho sprint quản trị liên quan.

#### 3.6. Mức độ tích hợp lên M06 và M09
M06 và M09 đã tồn tại từ sprint trước, nên Sprint 10 chỉ nên mở rộng đúng phần cần thiết:
- M06:
  - nút lưu/bỏ lưu tour;
  - khu vực điểm trung bình;
  - danh sách review tour;
  - nút mở form đánh giá nếu đủ điều kiện.
- M09:
  - nút lưu/bỏ lưu guide;
  - badge xác minh;
  - điểm trung bình của guide;
  - danh sách review guide.

Không nên làm lại toàn bộ layout hai màn hình này.

#### 3.7. Dữ liệu tài liệu xác minh sẽ lưu theo hướng nào
Cần chốt rõ:
- file thực tế lưu ở storage;
- database chỉ lưu `file_url`, `document_type`, `status`, `note`;
- metadata tài liệu phải đủ để admin đọc và xử lý;
- không lưu binary trực tiếp vào database.

#### 3.8. Có thay đổi schema hay không
Cần rà soát:
- nhiều ràng buộc của Sprint 10 đã có sẵn trong schema final;
- `favorite_tours` và `favorite_guides` đã có primary key dạng composite;
- `tour_reviews` và `guide_reviews` đã có unique theo `tour_request_id`.

Vì vậy Sprint 10 **không nên tạo schema rẽ nhánh mới**.  
Chỉ bổ sung:
- index nếu thực sự cần;
- seed data;
- policy/RLS hoặc service validation;
- migration nhỏ nếu phát hiện thiếu trường phụ thực sự bắt buộc.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục yêu thích
- phạm vi favorite chỉ gồm tour và guide;
- hành vi gồm add / remove / list;
- danh sách yêu thích chia 2 tab;
- hiển thị tóm tắt và liên kết về màn hình chi tiết.

#### 4.2. Hạng mục đánh giá
- điều kiện đủ để review;
- số lần review tối đa theo `tour_request`;
- kiểu dữ liệu rating;
- cách hiển thị comment;
- logic tính điểm trung bình;
- phạm vi hiển thị công khai và ẩn.

#### 4.3. Hạng mục xác minh hồ sơ guide
- trạng thái request;
- trạng thái tài liệu;
- rule một guide có request `pending` hay không;
- loại tài liệu được chấp nhận;
- cách phản hồi kết quả;
- nơi hiển thị trạng thái xác minh.

#### 4.4. Hạng mục hiển thị UI
- M18;
- M27;
- M28;
- M33;
- phần mở rộng tại M06 và M09.

#### 4.5. Hạng mục kỹ thuật backend
- chia module `favorites`, `reviews`, `guide-verification`;
- chuẩn hóa DTO/validation;
- ownership check;
- public query cho review;
- private query cho verification;
- rule tích hợp với admin ở mức vừa đủ.

#### 4.6. Hạng mục dữ liệu
- seed review mẫu;
- seed favorite mẫu;
- seed verification request và document mẫu;
- chuẩn bị dữ liệu tính rating trung bình;
- dữ liệu hiển thị được trên cả public area và guide area.

#### 4.7. Hạng mục tài liệu/UML
- Activity Diagram cho favorite;
- Activity Diagram cho review tour;
- Activity Diagram cho review guide;
- Activity Diagram cho gửi xác minh hồ sơ;
- cập nhật mô tả màn hình M18, M27, M28, M33;
- rà soát mapping chức năng – API – bảng.

---

### 5. Phương án được chọn

### 5.1. Phạm vi triển khai favorite
Phương án được chọn là:
- triển khai favorite cho **tour** và **guide**;
- favorite hoạt động theo cơ chế **toggle đơn giản**:
  - đã lưu thì bỏ lưu;
  - chưa lưu thì thêm vào;
- danh sách yêu thích tách thành 2 nhóm:
  - tour yêu thích;
  - hướng dẫn viên yêu thích.

Đây là phương án phù hợp nhất vì:
- ít rủi ro;
- dễ nối với M06 và M09;
- dễ tạo cảm giác sản phẩm “thật” khi demo.

### 5.2. Điều kiện đánh giá được chọn
Phương án được chọn là:
- user chỉ được review nếu có `tour_request` của chính mình;
- `tour_request.status` phải ở mức đã tham gia/được chấp nhận đủ điều kiện, tối thiểu là:
  - `approved`
  - hoặc `paid`
- review phải gắn với đúng `tour_id`, `guide_profile_id`, `tour_request_id`, `user_id`;
- không cho phép tạo review nếu request:
  - `rejected`
  - `cancelled_by_user`
  - `cancelled_by_guide`

Đây là hướng hợp lý nhất vì vừa bám nghiệp vụ tour request, vừa bám được ràng buộc của schema final.

### 5.3. Quy tắc số lần review
Phương án được chọn là:
- một `tour_request` được tạo tối đa:
  - **1 review cho tour**
  - **1 review cho guide**
- không cho sửa/xóa review quá sâu trong Sprint 10;
- nếu cần cập nhật, chỉ mở mức chỉnh sửa nhẹ trong nội bộ owner hoặc để Sprint sau.

Hướng này giúp:
- giảm độ phức tạp;
- tránh spam review;
- bám sát unique constraint hiện có.

### 5.4. Mô hình trạng thái verification được chọn
Mặc dù tài liệu lưu ý từng gợi ý hướng `draft/submitted/approved/rejected`, Sprint 10 chốt theo **schema final**:

- `guide_verification_requests.status`
  - `pending`
  - `approved`
  - `rejected`

- `guide_verification_documents.status`
  - `submitted`
  - `accepted`
  - `rejected`

Đây là lựa chọn bắt buộc để:
- không lệch giữa database và backend;
- không phải sửa nhiều tài liệu kỹ thuật về sau;
- giữ đồng bộ với phần admin verification.

### 5.5. Quy tắc active verification request
Schema hiện tại chưa thể hiện bằng unique partial index cho rule “mỗi guide chỉ có 1 request pending”.  
Phương án được chọn là:

- **enforce tại service layer** trong Sprint 10;
- một guide **không được tạo request mới nếu đang có request `pending`**;
- guide có thể tạo request mới khi request cũ đã:
  - `approved`
  - hoặc `rejected`

Đây là cách an toàn vì không phải thay đổi mạnh schema final, nhưng vẫn giữ logic nghiệp vụ chặt.

### 5.6. Phạm vi upload tài liệu xác minh
Phương án được chọn là:
- guide tạo request trước;
- sau đó upload 1 hoặc nhiều tài liệu vào request đó;
- file lưu ở storage;
- DB chỉ lưu metadata:
  - `verification_request_id`
  - `document_type`
  - `file_url`
  - `status`
  - `note`

Hướng này phù hợp với phạm vi đồ án và dễ nối với Supabase Storage.

### 5.7. Phạm vi hiển thị review công khai
Phương án được chọn là:
- ở public area chỉ hiển thị review có `visibility_status = 'visible'`;
- `hidden` và `flagged` là dữ liệu nội bộ hoặc moderation;
- điểm trung bình của tour/guide chỉ tính trên review visible;
- nếu chưa có review thì hiển thị rõ trạng thái “chưa có đánh giá”.

### 5.8. Phạm vi tích hợp M06 và M09
M06 và M09 chỉ mở rộng ở mức:
- nút favorite;
- badge xác minh;
- danh sách review public;
- summary rating;
- CTA đánh giá khi đủ điều kiện.

Không làm:
- trang moderation review riêng cho user;
- analytics review;
- so sánh guide nâng cao;
- đề xuất từ favorite.

### 5.9. Chia module backend
Phương án được chọn:
- module `favorites`
- module `reviews`
- module `guide-verification`

Ba module này tách khỏi:
- `tours`
- `guides`
- `admin`

nhưng vẫn dùng chung:
- auth guard;
- role guard;
- ownership helper;
- response format chuẩn.

---

### 6. Ghi chú triển khai

#### 6.1. Thứ tự triển khai nên làm
Nên triển khai theo thứ tự:
1. **favorite**
2. **review**
3. **verification**

Lý do:
- favorite dễ làm, ít rủi ro, tạo hiệu ứng UI nhanh;
- review có nhiều rule nghiệp vụ hơn, nên làm sau khi M06/M09 đã ổn;
- verification có upload/document/status nên phức tạp hơn, làm cuối sprint để không chặn các phần khác.

#### 6.2. Không làm sâu CRUD review
Trong Sprint 10 chỉ cần:
- tạo review;
- lấy review public;
- hiển thị review.

Không bắt buộc làm:
- edit review;
- delete review;
- moderation review đầy đủ ở user side;
- phản hồi review;
- like/dislike review.

#### 6.3. Verification chỉ cần đủ cho guide gửi hồ sơ
Phần xử lý phê duyệt sâu có thể nối với admin, nhưng bản thân Sprint 10 không nên biến thành sprint quản trị mới.  
Mục tiêu là:
- guide gửi được hồ sơ;
- trạng thái được lưu;
- dữ liệu đủ để admin xem/duyệt ở sprint quản trị liên quan.

#### 6.4. Luôn kiểm tra ownership
Các luồng của Sprint 10 đều phải kiểm tra ownership:
- chỉ user của mình mới xem danh sách favorite cá nhân;
- chỉ chủ request mới được tạo review từ request đó;
- chỉ chủ guide profile mới được gửi verification cho profile của mình;
- chỉ owner/backoffice mới xem được hồ sơ xác minh tương ứng.

#### 6.5. Quy tắc “xong sprint”
Sprint 10 chỉ được coi là hoàn thành khi:
- có API chạy được;
- có màn hình nối API;
- có dữ liệu demo;
- có test luồng tối thiểu;
- có cập nhật UML/tài liệu;
- M06 và M09 hiển thị được favorite/review/verification state theo dữ liệu thật.

#### 6.6. Dữ liệu demo nên chuẩn bị
Cần chuẩn bị ít nhất:
- 3–5 tour có review;
- 3–5 guide có review;
- 2–3 user có favorite tour;
- 2–3 user có favorite guide;
- 1 guide đã approved verification;
- 1 guide đang pending verification;
- 1 guide từng bị rejected verification;
- dữ liệu comment review đủ đa dạng để màn hình nhìn tự nhiên.

---

### 7. Chức năng trọng tâm

#### F05. Quản lý danh sách yêu thích
Mục tiêu của F05 là cho phép người dùng lưu lại các tour và hướng dẫn viên mà mình quan tâm để tiện quay lại sau.  
Trong Sprint 10, F05 được triển khai ở mức vừa đủ để:
- lưu tour;
- bỏ lưu tour;
- lưu guide;
- bỏ lưu guide;
- xem danh sách yêu thích theo hai nhóm.

Giá trị chính của chức năng này là:
- tăng tính cá nhân hóa;
- tăng cảm giác gắn bó của user với hệ thống;
- tạo dữ liệu nền cho gợi ý tour ở các sprint sau.

#### F09. Xác minh hồ sơ hướng dẫn viên
Mục tiêu của F09 là tăng độ tin cậy cho hồ sơ hướng dẫn viên thông qua cơ chế gửi giấy tờ/chứng chỉ để xác minh.  
Trong Sprint 10, F09 được triển khai ở mức:
- guide tạo verification request;
- guide upload document;
- guide theo dõi trạng thái request và tài liệu;
- hệ thống hiển thị lại trạng thái xác minh ở các nơi liên quan.

Giá trị chính:
- làm rõ sự khác biệt giữa guide chưa xác minh và đã xác minh;
- tăng độ thuyết phục cho hồ sơ công khai;
- tạo cơ sở cho admin verification flow.

#### F18. Đánh giá tour và hướng dẫn viên
Mục tiêu của F18 là bổ sung kênh phản hồi chất lượng từ người dùng sau khi tham gia tour.  
Trong Sprint 10, F18 tập trung vào:
- tạo review tour;
- tạo review guide;
- lấy review công khai;
- hiển thị rating trung bình và danh sách review ở trang chi tiết.

Giá trị chính:
- tăng uy tín cộng đồng;
- làm dữ liệu tour/guide trở nên sống động hơn;
- hỗ trợ người dùng khác ra quyết định.

#### Kết luận cho nhóm chức năng
Ba nhóm F05, F09, F18 là lớp hoàn thiện tự nhiên sau MVP lõi.  
Chúng không thay đổi cấu trúc nền của hệ thống, nhưng giúp sản phẩm:
- có chiều sâu hơn;
- có giá trị demo cao hơn;
- thuyết phục hơn khi bảo vệ.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình
Phần màn hình của Sprint 10 phải đạt được hai mục tiêu:
- có các màn hình riêng cho nhóm nghiệp vụ mới;
- mở rộng đúng mức các màn hình chi tiết đang có để dữ liệu được nhìn thấy ở đúng nơi người dùng cần.

### 8.2. M18 – Danh sách yêu thích
Màn hình này thuộc **User Area**.

#### Mục tiêu
- cho người dùng xem lại các đối tượng đã lưu;
- điều hướng nhanh về chi tiết tour hoặc hồ sơ guide;
- bỏ lưu trực tiếp ngay trên danh sách nếu cần.

#### Nội dung chính
- hai tab:
  - **Tour yêu thích**
  - **Hướng dẫn viên yêu thích**
- card hoặc table hiển thị:
  - ảnh đại diện;
  - tiêu đề/tên;
  - thông tin tóm tắt;
  - thời gian lưu;
  - nút bỏ lưu;
  - liên kết xem chi tiết.

#### Trạng thái UI cần có
- loading;
- empty state cho từng tab;
- error state;
- confirm hoặc feedback nhẹ khi bỏ lưu.

### 8.3. M27 – Đánh giá tour
Màn hình này là form để user chấm điểm và nhận xét cho tour.

#### Mục tiêu
- tạo review cho tour sau khi user đủ điều kiện;
- bám đúng tour và đúng request liên quan.

#### Nội dung chính
- thông tin tour ngắn gọn;
- rating 1–5 sao;
- ô nhận xét;
- thông tin request liên quan;
- nút gửi đánh giá;
- cảnh báo nếu user không đủ điều kiện.

#### Rule hiển thị
- chỉ mở cho user đã đăng nhập;
- chỉ hiển thị CTA khi có request hợp lệ;
- nếu đã review rồi thì hiển thị trạng thái đã đánh giá.

### 8.4. M28 – Đánh giá hướng dẫn viên
Màn hình này tương tự M27 nhưng áp dụng cho guide.

#### Mục tiêu
- cho phép user đánh giá chất lượng hướng dẫn viên;
- tạo dữ liệu điểm trung bình và nhận xét công khai cho guide profile.

#### Nội dung chính
- thông tin guide;
- tour liên quan;
- rating 1–5 sao;
- ô nhận xét;
- trạng thái review hiện tại;
- nút gửi.

#### Ghi chú
M27 và M28 có thể tái sử dụng chung component form review để giảm công phát triển frontend.

### 8.5. M33 – Xác minh hồ sơ hướng dẫn viên
Màn hình này thuộc **Guide Area**.

#### Mục tiêu
- cho guide gửi hồ sơ xác minh;
- theo dõi các lần gửi và kết quả xử lý.

#### Nội dung chính
- danh sách request đã gửi;
- trạng thái từng request;
- biểu mẫu tạo request mới;
- phần upload tài liệu;
- loại tài liệu;
- ghi chú gửi;
- phản hồi kết quả nếu đã xử lý.

#### Trạng thái cần có
- chưa từng gửi;
- đang chờ xử lý;
- đã được duyệt;
- bị từ chối.

### 8.6. M06 – Chi tiết tour (mở rộng trong Sprint 10)
M06 đã có từ sprint trước, Sprint 10 chỉ bổ sung:

- nút **lưu / bỏ lưu tour**;
- summary rating:
  - điểm trung bình;
  - số lượng review;
- danh sách review công khai;
- CTA mở form đánh giá nếu user đủ điều kiện.

#### Không làm sâu
- không nhúng editor review quá nặng vào chính M06;
- không làm moderation review tại đây;
- không làm phân tích review nâng cao.

### 8.7. M09 – Hồ sơ hướng dẫn viên công khai (mở rộng trong Sprint 10)
M09 được bổ sung:

- nút **lưu / bỏ lưu guide**;
- badge xác minh;
- điểm đánh giá trung bình của guide;
- danh sách review guide công khai;
- CTA đánh giá khi đủ điều kiện.

#### Mục tiêu
M09 phải giúp người xem trả lời nhanh ba câu hỏi:
- guide này có được xác minh chưa;
- guide này được đánh giá ra sao;
- tôi có muốn lưu hồ sơ này lại hay không.

### 8.8. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 10:
- user nhìn thấy được toàn bộ luồng favorite của mình ở M18;
- user đánh giá được tour/guide từ M27/M28;
- guide gửi xác minh được ở M33;
- M06 và M09 nhìn “đủ sản phẩm” hơn nhờ favorite + review + verification badge.

---

### 9. Bảng CSDL chính

### 9.1. `favorite_tours`

#### Vai trò
Lưu quan hệ yêu thích giữa người dùng và tour.

#### Thuộc tính quan trọng
- `user_id`
- `tour_id`
- `created_at`

#### Ràng buộc đáng chú ý
- khóa chính composite: `(user_id, tour_id)`

#### Ý nghĩa trong Sprint 10
Bảng này đủ để triển khai trọn vẹn:
- lưu tour;
- bỏ lưu tour;
- truy vấn danh sách tour yêu thích của user.

### 9.2. `favorite_guides`

#### Vai trò
Lưu quan hệ yêu thích giữa người dùng và hồ sơ hướng dẫn viên.

#### Thuộc tính quan trọng
- `user_id`
- `guide_profile_id`
- `created_at`

#### Ràng buộc đáng chú ý
- khóa chính composite: `(user_id, guide_profile_id)`

#### Ý nghĩa trong Sprint 10
Bảng này phục vụ:
- lưu guide;
- bỏ lưu guide;
- hiển thị danh sách guide yêu thích.

### 9.3. `tour_reviews`

#### Vai trò
Lưu đánh giá của người dùng đối với tour.

#### Thuộc tính quan trọng
- `id`
- `tour_id`
- `tour_request_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

#### Ràng buộc đáng chú ý
- `rating` từ 1 đến 5;
- `tour_request_id` là `unique`;
- có `visibility_status` để phục vụ moderation.

#### Ý nghĩa trong Sprint 10
Bảng này là lõi của:
- form đánh giá tour;
- hiển thị điểm trung bình;
- hiển thị danh sách review public ở M06.

### 9.4. `guide_reviews`

#### Vai trò
Lưu đánh giá của người dùng đối với hướng dẫn viên.

#### Thuộc tính quan trọng
- `id`
- `guide_profile_id`
- `tour_id`
- `tour_request_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

#### Ràng buộc đáng chú ý
- `rating` từ 1 đến 5;
- `tour_request_id` là `unique`;
- review gắn với đúng guide đã tổ chức tour.

#### Ý nghĩa trong Sprint 10
Bảng này giúp:
- hiển thị uy tín của guide;
- tính điểm trung bình của guide;
- hiển thị review tại M09.

### 9.5. `guide_verification_requests`

#### Vai trò
Lưu yêu cầu xác minh hồ sơ hướng dẫn viên.

#### Thuộc tính quan trọng
- `id`
- `guide_profile_id`
- `submitted_at`
- `status`
- `submission_note`
- `processed_by_user_id`
- `processed_at`
- `result_note`

#### Trạng thái được chốt
- `pending`
- `approved`
- `rejected`

#### Ý nghĩa trong Sprint 10
Đây là bảng đại diện cho “hồ sơ gửi xác minh” ở cấp request.

### 9.6. `guide_verification_documents`

#### Vai trò
Lưu metadata các tài liệu gắn với một verification request.

#### Thuộc tính quan trọng
- `id`
- `verification_request_id`
- `document_type`
- `file_url`
- `uploaded_at`
- `status`
- `note`

#### Trạng thái được chốt
- `submitted`
- `accepted`
- `rejected`

#### Loại tài liệu được chốt
- `national_id`
- `tour_guide_card`
- `certificate`
- `license`
- `other`

#### Ý nghĩa trong Sprint 10
Bảng này giúp guide upload nhiều loại tài liệu vào cùng một request và giúp admin/backoffice xử lý theo từng tài liệu nếu cần.

### 9.7. Bảng phụ thuộc cần dùng kèm
Mặc dù không phải “bảng chính” của Sprint 10, nhưng các bảng sau là phụ thuộc bắt buộc:

- `tours`
- `guide_profiles`
- `tour_requests`
- `users`

Lý do:
- favorite phải join về tour/guide để hiển thị;
- review phải dựa trên `tour_requests`;
- verification phải gắn với `guide_profiles`;
- toàn bộ ownership và hiển thị công khai đều phải nối với `users`.

### 9.8. Ghi chú quan trọng về schema
Sprint 10 nên giữ nguyên tinh thần **schema 38 bảng là chuẩn cuối**.  
Không nên tách thêm bảng favorite hay review mới ngoài mô hình đã chốt.  
Các rule còn thiếu ở mức constraint cứng có thể xử lý tại service layer nếu việc thay đổi schema làm tăng rủi ro.

---

### 10. API cần thiết

### 10.1. `POST /favorites/tours/:tourId`

#### Mục đích
Thêm tour vào danh sách yêu thích của user hiện tại.

#### Yêu cầu
- đã đăng nhập;
- `tourId` hợp lệ;
- tour còn cho phép hiển thị theo rule nghiệp vụ.

#### Kết quả mong đợi
- tạo bản ghi tại `favorite_tours`;
- trả về trạng thái đã lưu.

### 10.2. `DELETE /favorites/tours/:tourId`

#### Mục đích
Bỏ tour khỏi danh sách yêu thích.

#### Yêu cầu
- đã đăng nhập;
- chỉ thao tác trên favorite của chính mình.

#### Kết quả mong đợi
- xóa quan hệ favorite tương ứng;
- UI cập nhật tức thời.

### 10.3. `GET /me/favorites/tours`

#### Mục đích
Lấy danh sách tour yêu thích của user.

#### Kết quả mong đợi
- trả danh sách có join thông tin tour;
- hỗ trợ phân trang nếu muốn;
- có empty state rõ ràng.

### 10.4. `POST /favorites/guides/:guideId`

#### Mục đích
Thêm guide vào danh sách yêu thích.

#### Yêu cầu
- đã đăng nhập;
- `guideId` hợp lệ;
- guide profile tồn tại.

#### Kết quả mong đợi
- tạo bản ghi tại `favorite_guides`.

### 10.5. `DELETE /favorites/guides/:guideId`

#### Mục đích
Bỏ lưu guide.

#### Kết quả mong đợi
- xóa favorite tương ứng;
- cập nhật lại trạng thái UI.

### 10.6. `GET /me/favorites/guides`

#### Mục đích
Lấy danh sách guide yêu thích.

#### Kết quả mong đợi
- có thông tin cơ bản của guide;
- có trạng thái xác minh và điểm đánh giá nếu cần.

### 10.7. `POST /tour-reviews`

#### Mục đích
Tạo đánh giá cho tour.

#### Body gợi ý
- `tourId`
- `tourRequestId`
- `rating`
- `comment`

#### Yêu cầu
- đã đăng nhập;
- owner của `tourRequestId`;
- request đủ điều kiện review;
- chưa có `tour_review` cho request đó.

#### Kết quả mong đợi
- tạo 1 bản ghi trong `tour_reviews`;
- cập nhật được dữ liệu hiển thị ở M06.

### 10.8. `POST /guide-reviews`

#### Mục đích
Tạo đánh giá cho hướng dẫn viên.

#### Body gợi ý
- `guideProfileId`
- `tourId`
- `tourRequestId`
- `rating`
- `comment`

#### Yêu cầu
- user phải là chủ request;
- request thuộc đúng tour;
- guide phải là guide của tour tương ứng;
- chưa có `guide_review` cho request đó.

#### Kết quả mong đợi
- tạo bản ghi trong `guide_reviews`;
- M09 hiển thị được review mới sau refresh hoặc cập nhật cục bộ.

### 10.9. `GET /tours/:id/reviews`

#### Mục đích
Lấy danh sách review công khai của một tour.

#### Kết quả mong đợi
- chỉ trả review `visible`;
- có rating trung bình;
- có tổng số review;
- có thể hỗ trợ phân trang.

### 10.10. `GET /guides/:id/reviews`

#### Mục đích
Lấy danh sách review công khai của guide.

#### Kết quả mong đợi
- danh sách review visible;
- điểm trung bình;
- số lượt đánh giá.

### 10.11. `POST /guide-verification/requests`

#### Mục đích
Tạo yêu cầu xác minh hồ sơ guide.

#### Body gợi ý
- `guideProfileId`
- `submissionNote`

#### Yêu cầu
- user có role `GUIDE`;
- sở hữu `guideProfileId`;
- không có request `pending` khác.

#### Kết quả mong đợi
- tạo bản ghi trong `guide_verification_requests`;
- trạng thái hồ sơ chuyển sang chờ xử lý tương ứng.

### 10.12. `GET /guide-verification/requests`

#### Mục đích
Lấy danh sách verification request của guide hiện tại.

#### Kết quả mong đợi
- lịch sử các lần gửi;
- trạng thái từng request;
- dữ liệu phản hồi;
- danh sách document đính kèm.

### 10.13. `POST /guide-verification/requests/:id/documents`

#### Mục đích
Upload metadata tài liệu cho verification request.

#### Body gợi ý
- `documentType`
- `fileUrl`
- `note`

#### Yêu cầu
- request thuộc guide của chính user hiện tại;
- request còn ở trạng thái cho phép thêm tài liệu.

#### Kết quả mong đợi
- tạo bản ghi trong `guide_verification_documents`;
- request hiển thị được danh sách document.

### 10.14. Yêu cầu kỹ thuật chung cho API
- response format phải thống nhất với các sprint trước;
- lỗi validation phải rõ ràng;
- ưu tiên tách:
  - public query;
  - query cá nhân;
  - query nghiệp vụ guide;
- review và verification phải có ownership check chặt;
- favorite nên idempotent ở mức hợp lý để tránh lỗi thao tác lặp.

---

### 11. Công việc frontend

### 11.1. Xây dựng màn hình M18
- tạo màn hình danh sách yêu thích;
- chia 2 tab tour / guide;
- hiển thị card/tóm tắt;
- cho phép bỏ lưu nhanh;
- có empty state riêng cho từng tab.

### 11.2. Tích hợp nút favorite vào M06 và M09
- bổ sung icon/button favorite;
- lấy trạng thái đã lưu hay chưa;
- toggle ngay trên UI;
- đồng bộ lại dữ liệu khi user thao tác.

### 11.3. Xây dựng form đánh giá dùng lại được
Nên tạo component review form dùng chung cho:
- M27 – review tour;
- M28 – review guide.

Component nên hỗ trợ:
- chọn rating sao;
- nhập comment;
- validate ký tự tối thiểu/tối đa;
- hiển thị lỗi dễ hiểu;
- trạng thái submit success/fail.

### 11.4. Hiển thị review tại màn hình chi tiết
- M06 hiển thị review tour;
- M09 hiển thị review guide;
- có summary rating;
- có danh sách review;
- có phân trang hoặc “xem thêm” nếu cần.

### 11.5. Xây dựng M33
- danh sách request đã gửi;
- form tạo request;
- khu vực tải tài liệu;
- trạng thái từng request/document;
- phản hồi từ hệ thống/backoffice.

### 11.6. Validation phía frontend
Cần có validation cho:
- rating bắt buộc 1–5;
- comment không quá dài;
- loại tài liệu hợp lệ;
- file upload có định dạng phù hợp;
- không cho submit khi đang có request pending nếu API đã báo lỗi tương ứng.

### 11.7. Trạng thái hiển thị cần chuẩn hóa
- loading;
- submitting;
- success;
- empty;
- error;
- disabled state khi user không đủ điều kiện đánh giá hoặc gửi hồ sơ.

### 11.8. Tối ưu trải nghiệm sử dụng
- M18 phải dễ quét mắt;
- M27/M28 nên đơn giản, ít trường;
- M33 nên rõ “đang chờ / đã duyệt / bị từ chối”;
- M06/M09 phải hiển thị badge/trạng thái nổi bật, không chôn thông tin quan trọng.

### 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 10, frontend phải đạt được:
- user nhìn thấy và thao tác được favorite;
- user tạo được review khi đủ điều kiện;
- guide gửi được hồ sơ xác minh;
- M06 và M09 thể hiện rõ độ tin cậy và phản hồi cộng đồng.

---

### 12. Công việc backend

### 12.1. Tổ chức module
Cần triển khai tối thiểu:
- `favorites`
- `reviews`
- `guide-verification`

Ngoài ra cần tái sử dụng:
- auth guard;
- role guard;
- ownership helper;
- query helper;
- audit/logging nếu có.

### 12.2. Xử lý logic favorite
- add favorite tour;
- remove favorite tour;
- list favorite tours;
- add favorite guide;
- remove favorite guide;
- list favorite guides.

Cần lưu ý:
- tránh insert trùng;
- xử lý idempotent tốt;
- query đủ dữ liệu để UI hiển thị đẹp.

### 12.3. Xử lý logic review
- validate `tourRequestId`;
- kiểm tra ownership;
- kiểm tra trạng thái request;
- kiểm tra relation giữa request – tour – guide;
- chống tạo review trùng;
- tạo review;
- lấy review public.

### 12.4. Tính rating summary
Backend nên hỗ trợ query tổng hợp:
- average rating;
- count reviews.

Có thể:
- query trực tiếp;
- hoặc trả kèm summary trong endpoint detail/list review;
- nhưng phải thống nhất logic chỉ tính review `visible`.

### 12.5. Xử lý logic verification
- tạo verification request;
- chặn tạo request mới khi đang có request `pending`;
- upload document metadata;
- lấy danh sách request của owner;
- lấy chi tiết request kèm document.

### 12.6. Kết nối storage cho tài liệu xác minh
Trong phạm vi sprint này:
- backend chỉ cần nhận file URL hoặc xử lý upload tối giản;
- lưu metadata vào DB;
- không cần triển khai pipeline xử lý tài liệu phức tạp.

### 12.7. Ownership và phân quyền
Cần đảm bảo:
- user chỉ xem được favorite của mình;
- guide chỉ xem verification của hồ sơ mình;
- review public endpoint không lộ dữ liệu riêng tư;
- endpoint admin verification xử lý ở phần quản trị tương ứng, không gộp sai vào luồng user/guide.

### 12.8. Logging và audit ở mức cần thiết
Nếu có tích hợp audit:
- log tạo verification request;
- log upload document;
- log tạo review nếu cần;
- log thao tác xử lý verification ở admin side khi nối sang sprint quản trị.

### 12.9. Kết quả mong đợi phía backend
Backend phải bảo đảm:
- logic review chặt;
- favorite nhẹ, ổn định;
- verification nhất quán với schema final;
- API public/private tách rõ;
- dữ liệu trả về đủ cho frontend dựng màn hình gọn.

---

### 13. Công việc database

### 13.1. Giữ nguyên schema 38 bảng làm chuẩn
Không tạo schema rút gọn mới.  
Sprint 10 dùng trực tiếp các bảng đã có trong schema final:
- `favorite_tours`
- `favorite_guides`
- `tour_reviews`
- `guide_reviews`
- `guide_verification_requests`
- `guide_verification_documents`

### 13.2. Rà soát ràng buộc hiện có
Cần xác nhận:
- `favorite_tours` có PK composite;
- `favorite_guides` có PK composite;
- `tour_reviews.tour_request_id` là unique;
- `guide_reviews.tour_request_id` là unique;
- rating có range 1–5;
- verification request/document có state hợp lệ.

### 13.3. Bổ sung index nếu thực sự cần
Các index đáng cân nhắc:
- index cho favorite theo `user_id`;
- index cho review theo `tour_id` / `guide_profile_id` nếu chưa đủ;
- index cho verification request theo `guide_profile_id, status, submitted_at`.

Tuy nhiên chỉ thêm khi:
- query thực sự chậm;
- hoặc phục vụ rõ cho dashboard/màn hình list.

### 13.4. Chính sách dữ liệu và RLS
Nên rà soát:
- owner được đọc favorite/review riêng của mình ở mức cần thiết;
- review public chỉ đọc review visible;
- verification request/document chỉ owner hoặc backoffice đọc được;
- insert document chỉ cho owner của request.

### 13.5. Seed dữ liệu mẫu
Bắt buộc seed:
- favorite tour;
- favorite guide;
- tour review;
- guide review;
- verification request;
- verification documents.

Seed phải đủ để:
- M18 không rỗng;
- M06 có điểm đánh giá;
- M09 có review và badge verification;
- M33 có lịch sử gửi hồ sơ.

### 13.6. Chuẩn hóa dữ liệu rating và comment
- rating nên phân bố tự nhiên, không seed toàn 5 sao;
- comment phải ngắn gọn, hợp ngữ cảnh;
- có cả trường hợp chưa có review để test empty state.

### 13.7. Chuẩn bị storage cho tài liệu xác minh
Dù không hoàn toàn là “database work”, nhưng cần chốt cùng Sprint 10:
- bucket hoặc vùng lưu file;
- naming rule cho file;
- cách map `file_url` về database;
- quy ước loại tài liệu.

### 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 10:
- bảng và ràng buộc hỗ trợ đủ favorite/review/verification;
- dữ liệu seed nhìn “thật”;
- rule public/private rõ;
- không làm phát sinh schema lệch so với bộ tài liệu chính.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện
- mô tả chức năng favorite;
- mô tả chức năng review tour;
- mô tả chức năng review guide;
- mô tả chức năng verification guide;
- cập nhật phần màn hình M18, M27, M28, M33;
- cập nhật mapping chức năng – API – bảng.

### 14.2. UML cần chốt trong Sprint 10

#### Bắt buộc
- Activity Diagram: lưu/bỏ lưu tour
- Activity Diagram: lưu/bỏ lưu guide
- Activity Diagram: đánh giá tour
- Activity Diagram: đánh giá hướng dẫn viên
- Activity Diagram: gửi xác minh hồ sơ hướng dẫn viên

#### Nên bổ sung nếu còn thời gian
- Sequence Diagram: user tạo review tour
- Sequence Diagram: guide gửi verification request
- cập nhật Class Diagram ở các thực thể review/favorite/verification nếu bộ UML tổng đang mở rộng.

### 14.3. Mục tiêu của phần tài liệu/UML
Tài liệu của Sprint 10 phải giúp người đọc thấy rõ:
- đây là lớp chức năng hoàn thiện sau MVP;
- review được ràng buộc bằng dữ liệu tham gia thật;
- verification là luồng có trạng thái rõ ràng;
- favorite là chức năng nhỏ nhưng có giá trị trải nghiệm.

---

### 15. Đầu ra

#### 15.1. Đầu ra kỹ thuật
- module `favorites` hoạt động;
- module `reviews` hoạt động;
- module `guide-verification` hoạt động;
- API public/private phục vụ favorite, review, verification chạy ổn định.

#### 15.2. Đầu ra giao diện
- M18 hoàn chỉnh;
- M27 và M28 dùng được;
- M33 dùng được;
- M06 và M09 hiển thị được:
  - favorite state;
  - review summary;
  - review list;
  - verification badge.

#### 15.3. Đầu ra dữ liệu và nghiệp vụ
- favorite lưu đúng và không trùng;
- review tạo đúng điều kiện;
- rating summary đúng;
- verification request và document lưu đúng;
- trạng thái request/document hiển thị đúng.

#### 15.4. Đầu ra tài liệu
- Activity Diagram cho favorite, review, verification;
- cập nhật mô tả màn hình;
- cập nhật mapping bảng – API – chức năng;
- cập nhật ghi chú trạng thái theo schema final.

#### 15.5. Tiêu chí sẵn sàng sang Sprint 11
Hệ thống được coi là sẵn sàng sang Sprint 11 khi:
- MVP lõi vẫn ổn định sau khi gắn thêm Sprint 10;
- favorite/review/verification không phá luồng demo cũ;
- M06/M09 có chất lượng hiển thị tốt hơn rõ rệt;
- dữ liệu demo đủ để kể câu chuyện về độ tin cậy và cá nhân hóa;
- tài liệu không bị lệch với CSDL thực tế.

---

### 16. Kết luận sprint

Sprint 10 là sprint hoàn thiện rất quan trọng vì nó bổ sung **lớp niềm tin và tương tác cộng đồng** cho hệ thống. Nếu Sprint 01–09 giúp đồ án có một lõi nghiệp vụ chắc chắn, thì Sprint 10 giúp sản phẩm trông gần với một nền tảng du lịch thật hơn.

Điểm cốt lõi của sprint này là phải làm **đúng mức**:

- favorite phải gọn;
- review phải có điều kiện nghiệp vụ;
- verification phải nhất quán với schema final;
- UI phải bổ sung đúng chỗ, không làm nặng lại toàn bộ màn hình cũ.

Kết thúc Sprint 10, hệ thống cần đạt được trạng thái:
- có thêm dữ liệu tín nhiệm và phản hồi;
- có thêm tính cá nhân hóa rõ ràng;
- có hồ sơ guide đáng tin cậy hơn;
- đủ nền để bước sang Sprint 11 với nhóm hoàn thiện tiếp theo mà không làm rối cấu trúc đã chốt.

---

<a id="sprint-11"></a>
## SPRINT 11 – Hoàn thiện nhóm ưu tiên 2: bản đồ, lịch sử hoạt động, thông báo và thống kê

### 1. Mục tiêu sprint

Sprint 11 là sprint hoàn thiện lớp chức năng **ưu tiên 2** còn lại sau khi:

- Sprint 09 đã ổn định MVP lõi;
- Sprint 10 đã bổ sung favorite, review và verification.

Nếu Sprint 10 làm hệ thống “dày” hơn theo hướng **uy tín và cá nhân hóa**, thì Sprint 11 làm hệ thống “đầy” hơn theo hướng:

- hỗ trợ người dùng theo dõi hành trình trực quan;
- cho người dùng xem lại lịch sử thao tác;
- cho người dùng và guide nhận thông tin cập nhật tập trung;
- cho admin có dashboard thống kê đủ dùng để trình bày khi bảo vệ.

Theo kế hoạch triển khai đã chốt, Sprint 11 tập trung vào 4 chức năng chính:

- **F04 – Quản lý lịch sử hoạt động cá nhân**
- **F07 – Nhận thông báo**
- **F15 – Xem lộ trình tour trên bản đồ**
- **F28 – Thống kê và báo cáo hệ thống**【turn36:4†KE_HOACH.docx†L1-L22】【turn37:18†KE_HOACH.docx†L1-L28】

Các màn hình trọng tâm tương ứng là:

- **M07 – Bản đồ lộ trình tour**
- **M17 – Lịch sử hoạt động cá nhân**
- **M19 – Trung tâm thông báo**
- **M46 – Thống kê và báo cáo hệ thống**【turn37:18†KE_HOACH.docx†L1-L28】【turn37:0†KE_HOACH.docx†L1-L28】

#### Mục tiêu chính

- Hoàn thiện màn hình **bản đồ lộ trình tour** từ dữ liệu `tour_locations`, đủ để người dùng hình dung hành trình của tour theo thứ tự các điểm dừng.
- Hoàn thiện chức năng **lịch sử hoạt động cá nhân** từ bảng `user_activity_logs`, giúp user/guide xem lại các sự kiện đã phát sinh trên tài khoản của mình.
- Hoàn thiện **trung tâm thông báo** từ bảng `notifications`, cho phép xem danh sách thông báo, đánh dấu đã đọc từng mục và đánh dấu đã đọc tất cả.
- Hoàn thiện **dashboard thống kê quản trị** ở mức đồ án, cung cấp số liệu tổng quan về user, tour, bài đồng hành, báo cáo và thanh toán cơ bản.
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** để nhóm chức năng ưu tiên 2 khép kín, sẵn sàng chuyển sang giai đoạn mở rộng.【turn37:4†Ke_hoach_14_sprint_DOCX_ready.docx†L1-L22】【turn37:18†KE_HOACH.docx†L1-L28】

#### Ý nghĩa của sprint này

Sprint 11 không phải sprint “mở trục nghiệp vụ mới”, mà là sprint nâng chất lượng hệ thống ở ba lớp:

1. **Lớp trải nghiệm người dùng**  
   Người dùng thấy tour trực quan hơn nhờ bản đồ, theo dõi hệ thống dễ hơn nhờ thông báo, và nhìn lại hành trình sử dụng nhờ lịch sử hoạt động.

2. **Lớp theo dõi vận hành**  
   Admin có thêm dashboard thống kê để mô tả trạng thái vận hành thay vì chỉ quản lý CRUD đơn lẻ.

3. **Lớp trình bày đồ án**  
   Đây là nhóm chức năng rất có giá trị khi bảo vệ vì giúp sản phẩm trông “thật hệ thống” hơn, thay vì chỉ có các luồng form và danh sách.

Nói ngắn gọn, Sprint 11 là sprint giúp hệ thống đạt độ **“đầy”** tốt cho phần ưu tiên 2, đúng như kế hoạch 14 sprint đã chốt.【turn37:8†KE_HOACH.docx†L1-L8】【turn37:3†BAO_CAO_TONG.docx†L1-L4】

---

### 2. Lưu ý trước khi triển khai

### 2.1. Đây vẫn là sprint ưu tiên 2, không được trượt sang nhóm mở rộng mức 3

Dù Sprint 11 nhìn có vẻ “đẹp sản phẩm”, nhưng vẫn chỉ thuộc nhóm hoàn thiện ưu tiên 2.  
Vì vậy, không nên nhân cơ hội này kéo thêm các nội dung như:

- realtime notification hoàn chỉnh;
- chat realtime;
- bản đồ nâng cao với chỉ đường, geocoding, clustering phức tạp;
- dashboard BI nâng cao;
- báo cáo xuất file PDF/Excel;
- phân tích thanh toán chi tiết như sản phẩm thương mại.

Sprint này phải bám đúng mức **đủ dùng, dễ demo, dễ báo cáo**. Các phần mở rộng sâu hơn nên để sang giai đoạn sau. Điều này cũng phù hợp với phạm vi đồ án đã chốt: bản đồ, lịch sử hoạt động, thông báo và thống kê là nhóm hoàn thiện sau phần lõi, không phải cam kết bắt buộc ngay từ đầu.【turn37:13†BAO_CAO_TONG.docx†L1-L10】

### 2.2. M07 chỉ là bản đồ lộ trình tour, không phải hệ thống bản đồ du lịch tổng quát

Màn hình M07 được xác định rất rõ: mục tiêu là hiển thị **lộ trình của một tour cụ thể** từ bảng `tour_locations`, gồm các điểm đến, marker, thứ tự di chuyển, thời gian ghé thăm và ghi chú cơ bản. Nó không phải:

- bản đồ toàn bộ tour trên hệ thống;
- bản đồ gợi ý du lịch theo khu vực;
- công cụ lập kế hoạch hành trình tự do;
- hệ thống dẫn đường thời gian thực.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

Do đó, chỉ cần làm tốt luồng:

**Chi tiết tour → mở bản đồ lộ trình → xem các điểm theo sequence → quay lại chi tiết tour**

là đủ phù hợp với đồ án.

### 2.3. Activity log phải có quy tắc ghi log nhất quán

Nếu không chốt rule ghi log, màn hình M17 sẽ rất nhanh rơi vào tình trạng:

- log quá ít nên không có gì để xem;
- log quá nhiều, rác và khó đọc;
- mỗi module ghi một kiểu khác nhau;
- metadata không thống nhất, frontend khó render.

Ngay từ đầu phải thống nhất:
- sự kiện nào cần ghi log;
- actor nào tạo log;
- `activity_type` sẽ đặt tên theo chuẩn nào;
- `entity_type`, `entity_id`, `metadata` sẽ dùng thế nào;
- frontend sẽ render danh sách log theo template hay theo text thuần.

Bảng `user_activity_logs` trong schema final khá gọn (`activity_type`, `entity_type`, `entity_id`, `metadata`, `created_at`), nên càng phải chốt convention trước khi code để tránh mất kiểm soát dữ liệu.【turn37:16†BAO_CAO_2_CSDL.docx†L16-L24】

### 2.4. Notification center không đồng nghĩa với realtime push notification

Chức năng F07 trong Sprint 11 chỉ cần đạt:

- có dữ liệu thông báo;
- có danh sách thông báo;
- phân biệt đã đọc / chưa đọc;
- có liên kết tới đối tượng liên quan;
- có thao tác đánh dấu đã đọc từng mục và đánh dấu đã đọc tất cả.【turn37:18†KE_HOACH.docx†L1-L28】【turn37:14†BAO_CAO_4_MAN_HINH.docx†L9-L15】

Không bắt buộc làm:
- websocket;
- push browser notification;
- background subscription phức tạp;
- đồng bộ thời gian thực giữa nhiều tab.

Triển khai phù hợp nhất cho đồ án là:
- tạo notification khi các sự kiện quan trọng phát sinh;
- frontend polling hoặc refetch khi mở trang/đổi view;
- badge số lượng chưa đọc ở header nếu đủ thời gian.

### 2.5. Dashboard thống kê chỉ cần “ra quyết định quản trị cơ bản”

M46 được mô tả là màn hình giúp theo dõi các chỉ số vận hành cơ bản: user, tour, bài đồng hành, báo cáo vi phạm, hồ sơ chờ duyệt và thanh toán cơ bản theo khoảng thời gian. Đây là dashboard phục vụ báo cáo quản trị, không phải hệ thống analytics sâu.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】

Vì vậy nên giới hạn ở:
- thẻ số liệu tổng quan;
- một vài biểu đồ hoặc bảng số liệu cơ bản;
- bộ lọc thời gian đơn giản;
- số liệu lấy từ truy vấn tổng hợp có kiểm soát.

Không nên mở rộng sang:
- cohort analysis;
- retention;
- funnel nhiều bước;
- export dashboard;
- cấu hình dashboard động.

### 2.6. Dữ liệu demo quyết định gần như toàn bộ chất lượng Sprint 11

Sprint 11 là sprint rất dễ “xong code nhưng không có gì để demo”.  
Nếu không chuẩn bị dữ liệu mẫu tốt thì:

- M07 không có đủ điểm để thành bản đồ có ý nghĩa;
- M17 chỉ hiện vài dòng log rời rạc;
- M19 không có thông báo đa dạng;
- M46 không có số liệu thú vị để trình bày.

Do đó, seed data ở sprint này là **bắt buộc**, không thể xem là việc phụ.  
Ít nhất phải có:

- vài tour có `tour_locations` theo nhiều điểm;
- log từ nhiều luồng: auth, tour request, companion, favorite/review, report;
- notification từ nhiều loại `notification_type`;
- dữ liệu đủ đa dạng để dashboard có số liệu khác nhau theo nhóm và thời gian.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Phạm vi của M07 sẽ hiển thị tới mức nào

Cần chốt rõ M07 sẽ có:

- chỉ marker + danh sách điểm;
- hay marker + polyline đơn giản;
- có timeline bên cạnh hay không;
- có mở từ M06 theo tab, modal hay route riêng;
- có hiển thị `visit_time` nếu null hay không.

Trong phạm vi đồ án, phương án hợp lý nhất là:
- route riêng hoặc section riêng từ M06;
- bản đồ + danh sách điểm theo `sequence_no`;
- ưu tiên hiển thị các trường `location_name`, `address`, `visit_time`, `notes`;
- polyline chỉ làm nếu thư viện hỗ trợ thuận tiện.

#### 3.2. Activity log sẽ ghi những sự kiện nào

Cần chốt danh mục sự kiện tối thiểu để M17 có giá trị:
- đăng ký tài khoản;
- đăng nhập;
- cập nhật hồ sơ cá nhân;
- gửi yêu cầu tham gia tour;
- hủy yêu cầu tour;
- tạo/cập nhật bài đồng hành;
- gửi request tham gia bài đồng hành;
- tạo review;
- thêm/bỏ favorite;
- gửi report;
- guide gửi verification request.

Không nên cố log toàn bộ mọi thao tác nhỏ vì sẽ làm hệ thống nặng và khó quản lý.

#### 3.3. Notification sẽ được sinh từ những sự kiện nào

Cần xác định các nguồn sinh thông báo:
- trạng thái tour request thay đổi;
- trạng thái companion request thay đổi;
- report được tiếp nhận/xử lý;
- verification request thay đổi trạng thái;
- payment thay đổi trạng thái;
- thông báo hệ thống cơ bản.

Điều này phải bám vào miền giá trị `notification_type` trong schema final:
`system`, `tour_request`, `companion_request`, `message`, `report`, `verification`, `payment`.【turn37:18†KE_HOACH.docx†L1-L28】

#### 3.4. Mức độ hiển thị thông báo liên quan tới nhiều role

M19 cho phép:
- user;
- guide;
- admin theo quyền
truy cập. Nhưng không có nghĩa là tất cả role nhìn cùng một nội dung. Cần chốt:
- user nhìn thông báo liên quan tới tài khoản của mình;
- guide nhìn thông báo liên quan tới hoạt động guide/tour của mình;
- admin chỉ nhìn thông báo hệ thống hoặc thông báo phục vụ vai trò admin nếu có.

Tóm lại, danh sách notification là **theo user hiện tại**, không phải inbox chung toàn hệ thống.

#### 3.5. Phạm vi thống kê của M46

Cần chốt rõ M46 sẽ thống kê cái gì trong Sprint 11.  
Dựa trên mô tả màn hình và kế hoạch sprint, nên tập trung vào:

- tổng số user;
- số guide;
- số tour;
- số bài đồng hành;
- số report;
- số verification pending;
- số payment theo trạng thái cơ bản;
- một vài nhóm số liệu theo khoảng thời gian.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】【turn37:18†KE_HOACH.docx†L1-L28】

Không nên mở quá nhiều KPI vì vừa khó tính đúng, vừa khó kiểm chứng khi demo.

#### 3.6. Có làm API thống kê tách nhỏ hay gom một endpoint

Tài liệu kế hoạch đã gợi ý tách theo:
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

Cần chốt:
- có giữ đúng tách nhỏ như vậy hay gom thành một endpoint lớn;
- frontend sẽ gọi song song hay gọi lazy theo từng widget;
- response của từng endpoint sẽ trả raw data hay data đã định dạng cho chart.

Trong đồ án, tách nhỏ là hợp lý hơn vì:
- dễ test;
- dễ cô lập lỗi;
- dễ mở rộng;
- khớp với tài liệu đã chốt.

#### 3.7. Có cần thay đổi schema không

Sprint 11 chủ yếu dùng lại schema đã có:
- `tour_locations`
- `user_activity_logs`
- `notifications`
- `reports`
- `tours`
- `companion_posts`
- `payment_transactions`【turn37:18†KE_HOACH.docx†L1-L28】

Vì vậy nguyên tắc là:
- **không thay đổi schema lớn**;
- chỉ thêm index, helper, trigger hoặc view nếu thực sự cần;
- nếu có bổ sung, phải bảo đảm không phá vỡ sprint trước.

#### 3.8. UML nào cần cập nhật ngay trong sprint này

Tài liệu kế hoạch chốt khá rõ: cần hoàn thiện Activity Diagram cho:
- xem bản đồ tour;
- lịch sử hoạt động;
- thông báo;
- thống kê. 【turn37:18†KE_HOACH.docx†L1-L28】

Ngoài ra, nếu có thời gian thì nên bổ sung:
- sequence diagram cho sinh notification;
- sequence diagram cho lấy dashboard statistics;
- mô tả mapping sự kiện → log → notification.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục bản đồ tour
- Cấu trúc dữ liệu map trả về từ `tour_locations`
- Cách sắp xếp theo `sequence_no`
- Cách mở M07 từ M06
- Cách hiển thị marker, danh sách điểm, thời gian ghé thăm, ghi chú
- Rule hiển thị khi thiếu tọa độ

#### 4.2. Hạng mục lịch sử hoạt động
- Danh sách `activity_type` chuẩn
- Sự kiện nào bắt buộc ghi log
- Cấu trúc `metadata`
- Quy tắc phân trang/lọc
- Giao diện timeline hay list

#### 4.3. Hạng mục thông báo
- Nguồn sinh notification
- Cấu trúc `payload`
- Cách dẫn link tới đối tượng liên quan
- Rule `is_read` / `read_at`
- Có badge unread count hay không

#### 4.4. Hạng mục thống kê
- Bộ KPI của M46
- Phạm vi lọc theo thời gian
- Cách tách endpoint statistics
- Quy tắc phân quyền xem thống kê
- Dạng hiển thị: card, table, chart cơ bản

#### 4.5. Hạng mục kỹ thuật backend
- Chia module/service cho map, logs, notifications, statistics
- Chuẩn response
- Ownership / role guard
- Tối ưu query tổng hợp
- Logging lỗi cho statistics

#### 4.6. Hạng mục dữ liệu
- Index cho `user_activity_logs`, `notifications`
- Seed `tour_locations`
- Seed log và notification mẫu
- Seed số liệu đủ để dashboard có ý nghĩa
- Có/không dùng trigger sinh log

#### 4.7. Hạng mục tài liệu/UML
- Activity Diagram cho 4 luồng
- Cập nhật mô tả màn hình M07, M17, M19, M46 nếu cần
- Cập nhật mapping chức năng – API – bảng
- Rà soát tài liệu báo cáo để đồng bộ với code

---

### 5. Phương án được chọn

### 5.1. Phạm vi bản đồ được chọn

Chọn phương án triển khai **bản đồ lộ trình tour ở mức cơ bản nhưng trực quan**, gồm:

- lấy dữ liệu từ `GET /tours/:id/locations`;
- sắp xếp theo `sequence_no`;
- hiển thị marker theo từng điểm;
- hiển thị danh sách điểm ở panel phụ hoặc phía dưới;
- hiển thị `location_name`, `address`, `visit_time`, `notes` nếu có;
- nếu không có tọa độ thì vẫn hiển thị dưới dạng danh sách tuyến điểm.

Phương án này bám đúng vai trò của M07 là hỗ trợ người dùng hình dung hành trình tour, không biến sprint thành dự án bản đồ riêng.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

### 5.2. Quy tắc activity log được chọn

Chọn phương án:
- chỉ log **các sự kiện nghiệp vụ có ý nghĩa**;
- không log mọi thao tác UI nhỏ;
- dùng format thống nhất cho `activity_type`;
- luôn cố gắng có `entity_type`, `entity_id`, `metadata` nếu sự kiện gắn với đối tượng cụ thể.

Danh mục `activity_type` gợi ý dùng chung:
- `auth.registered`
- `auth.logged_in`
- `profile.updated`
- `tour_request.created`
- `tour_request.cancelled`
- `companion_post.created`
- `companion_post.updated`
- `companion_request.created`
- `favorite.tour_added`
- `favorite.guide_added`
- `review.tour_created`
- `review.guide_created`
- `report.created`
- `guide_verification.submitted`

Phương án này giúp M17 vừa có dữ liệu phong phú, vừa dễ render theo template.

### 5.3. Quy tắc notification được chọn

Chọn phương án:
- notification được sinh ở backend khi các sự kiện chính phát sinh;
- lưu vào bảng `notifications`;
- frontend chỉ đọc và đánh dấu đã đọc;
- không làm realtime push trong Sprint 11.

Các `notification_type` bám theo schema:
- `system`
- `tour_request`
- `companion_request`
- `message`
- `report`
- `verification`
- `payment`【turn37:18†KE_HOACH.docx†L1-L28】

Các nguồn sinh thông báo chính trong sprint:
- guide duyệt/từ chối tour request;
- chủ bài duyệt/từ chối companion request;
- report được xử lý;
- verification được cập nhật;
- payment thay đổi trạng thái;
- thông báo hệ thống cơ bản do admin hoặc hệ thống sinh.

### 5.4. Mức độ realtime được chọn

Không làm websocket hay realtime subscription đầy đủ trong Sprint 11.

Chọn phương án:
- fetch notification khi vào M19;
- refetch khi người dùng thao tác trên trang;
- nếu có badge header thì dùng polling nhẹ hoặc reload khi điều hướng.

Cách này phù hợp với đồ án, giảm rủi ro kỹ thuật, nhưng vẫn đủ giá trị trình diễn.

### 5.5. Bộ KPI của M46 được chọn

Chọn bộ KPI cơ bản sau cho dashboard:

- Tổng số người dùng
- Tổng số hướng dẫn viên
- Tổng số tour
- Tổng số bài đồng hành
- Tổng số report
- Số verification pending
- Tổng số payment transaction
- Tổng giá trị thanh toán paid ở mức cơ bản
- Một vài breakdown theo trạng thái của report, tour, payment

Đây là tập KPI vừa đủ để M46 nhìn “đúng dashboard”, đồng thời vẫn tính toán được từ dữ liệu hiện có. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】【turn37:10†mapping_for_dev_backend:frontend.docx†L1-L23】

### 5.6. Cấu trúc API statistics được chọn

Giữ đúng hướng đã chốt trong kế hoạch:
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

Lý do:
- dễ test độc lập từng nhóm;
- frontend tải theo nhu cầu;
- dễ quản lý code backend;
- bám sát tài liệu đã có.

### 5.7. Phân quyền được chọn

- `GET /tours/:id/locations`: public hoặc theo rule công khai của tour.
- `GET /me/activity-logs`: chỉ user hiện tại xem log của chính mình.
- `GET /me/notifications`, `PATCH /me/notifications/...`: chỉ user hiện tại thao tác notification của chính mình.
- `GET /admin/statistics/*`: chỉ admin được phân quyền thống kê.

Phương án này nhất quán với mô hình phân quyền chung và mô tả màn hình. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L15】

### 5.8. Hướng xử lý dữ liệu demo được chọn

Chọn phương án seed theo 4 cụm:
1. tour + locations;
2. activity logs;
3. notifications;
4. statistics source data.

Dữ liệu phải đủ để demo:
- ít nhất 2–3 tour có nhiều điểm;
- 1 user và 1 guide có activity log đa dạng;
- 1 admin có dashboard có số liệu;
- notification thuộc nhiều loại.

### 5.9. Chia module backend

Giữ cách chia module đã khuyến nghị trong mapping:
- `reports-notifications`
- `tours`
- `auth-me`
- `admin`【turn37:7†mapping_for_dev_backend:frontend.docx†L24-L42】

Trong Sprint 11 có thể tổ chức thực tế như sau:
- `tours`: xử lý locations/map
- `auth-me`: activity logs của user
- `reports-notifications`: notifications
- `admin`: statistics

---

### 6. Ghi chú triển khai

#### 6.1. Thứ tự triển khai nên làm
Nên làm theo thứ tự:
1. seed `tour_locations`
2. hoàn thiện M07 + API map
3. chốt convention `user_activity_logs`
4. sinh và đọc activity log
5. hoàn thiện notifications
6. hoàn thiện statistics dashboard
7. cập nhật UML/tài liệu

Lý do là M07 tương đối độc lập, dễ hoàn thành trước để tạo đà; còn logs/notifications/statistics phụ thuộc nhiều hơn vào dữ liệu hệ thống.

#### 6.2. Không biến M17 thành “nhật ký hệ thống”
M17 chỉ là **lịch sử hoạt động cá nhân**, không phải audit log toàn hệ thống.  
Phải tách rõ với:
- `admin_activity_logs` ở Admin Area;
- log kỹ thuật của server;
- lịch sử moderation nội bộ.

#### 6.3. Notification phải bám ngữ cảnh nghiệp vụ
Mỗi thông báo nên có:
- `title`
- `content`
- `entity_type`
- `entity_id`
- `payload`

Như vậy frontend mới dẫn hướng người dùng tới đúng màn hình liên quan.

#### 6.4. Dashboard phải xử lý trường hợp “không có dữ liệu”
M46 cần có:
- empty state;
- giá trị 0 hợp lệ;
- loading state;
- lỗi truy vấn rõ ràng.

Đây là màn hình rất dễ gặp lỗi vì dữ liệu tổng hợp thường không đồng đều.

#### 6.5. Quy tắc “xong sprint”
Sprint 11 chỉ được xem là hoàn thành khi:
- M07 hiển thị được lộ trình tour từ dữ liệu thật;
- M17 đọc được activity log có phân trang/lọc cơ bản;
- M19 đọc được notifications và đánh dấu đã đọc;
- M46 có dashboard số liệu và ít nhất một vài chart/card hiển thị đúng;
- có seed data phù hợp;
- có Activity Diagram cập nhật theo sprint. 【turn37:18†KE_HOACH.docx†L1-L28】

#### 6.6. Dữ liệu demo nên chuẩn bị
- 3 tour public có từ 3–5 location
- 1 tour draft để kiểm tra rule map public/private
- 1 user có log về favorite, review, request
- 1 guide có log về verification, tour management
- 8–15 notification chia nhiều loại
- dữ liệu đủ để dashboard có card và biểu đồ thay đổi theo thời gian

---

### 7. Chức năng trọng tâm

#### F04. Quản lý lịch sử hoạt động cá nhân
Chức năng này cho phép người dùng xem lại các hành động đã thực hiện như yêu cầu tham gia tour, bài đồng hành đã đăng, tour yêu thích hoặc thao tác gần đây. Đây là lớp chức năng giúp sản phẩm có chiều sâu về trải nghiệm sau khi các luồng lõi đã hoàn thiện. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

#### F07. Nhận thông báo
Chức năng này cung cấp trung tâm thông báo cho các sự kiện quan trọng như thay đổi trạng thái yêu cầu tham gia, trạng thái report, cập nhật verification hoặc thông báo hệ thống. Đây là lớp liên kết mềm giữa các phân hệ. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L15】

#### F15. Xem lộ trình tour trên bản đồ
Chức năng này giúp người truy cập hình dung trực quan hành trình tour. Đây là phần tăng giá trị minh họa của màn hình chi tiết tour và hỗ trợ quyết định tham gia. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

#### F28. Thống kê và báo cáo hệ thống
Chức năng này giúp admin theo dõi các chỉ số vận hành cơ bản và hỗ trợ trình bày năng lực quản trị của hệ thống. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

#### Kết luận cho nhóm chức năng
Bốn chức năng này không phải lõi bắt buộc ở giai đoạn đầu, nhưng lại là nhóm hoàn thiện rất có giá trị để hệ thống đạt độ thuyết phục cao khi trình bày đồ án.【turn37:13†BAO_CAO_TONG.docx†L1-L10】

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình

Phần màn hình trong Sprint 11 phải làm được hai việc cùng lúc:

- giúp người dùng/admin **thấy rõ giá trị** của các chức năng hỗ trợ;
- giữ giao diện **gọn, dễ demo, ít rủi ro kỹ thuật**.

Vì vậy, ưu tiên là:
- thông tin rõ ràng;
- trạng thái loading/empty/error đầy đủ;
- liên kết điều hướng hợp lý;
- không lạm dụng hiệu ứng hay biểu đồ phức tạp.

### 8.2. M07 – Bản đồ lộ trình tour

**Chức năng của màn hình**  
Giúp người dùng hình dung trực quan lộ trình của tour thông qua bản đồ. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

**Nội dung hiển thị chính**
- bản đồ;
- các marker địa điểm;
- thứ tự di chuyển;
- thời gian ghé thăm;
- tóm tắt lộ trình;
- ghi chú cho từng điểm. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

**Phạm vi triển khai trong Sprint 11**
- lấy location theo `tour_id`;
- render danh sách điểm theo `sequence_no`;
- nếu đủ tọa độ thì hiển thị marker;
- có panel chi tiết từng điểm;
- có nút quay lại M06.

**Không làm trong sprint này**
- chỉ đường theo giao thông;
- tối ưu tuyến;
- bản đồ nhiều tour cùng lúc;
- geocoding nâng cao.

### 8.3. M17 – Lịch sử hoạt động cá nhân

**Chức năng của màn hình**  
Cho phép người dùng xem lại các hành động đã thực hiện như yêu cầu tham gia tour, bài đồng hành đã đăng, tour yêu thích hoặc thao tác gần đây. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

**Nội dung hiển thị chính**
- danh sách hoạt động theo thời gian;
- loại hoạt động;
- bộ lọc;
- trạng thái từng mục;
- liên kết đến đối tượng liên quan. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

**Phạm vi triển khai trong Sprint 11**
- list hoặc timeline đơn giản;
- filter theo loại hoạt động;
- phân trang;
- liên kết mở tour/post/report liên quan nếu có.

### 8.4. M19 – Trung tâm thông báo

**Chức năng của màn hình**  
Hiển thị các thông báo liên quan đến yêu cầu tham gia, tin nhắn mới, trạng thái xử lý báo cáo hoặc cập nhật hệ thống. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L21】

**Nội dung hiển thị chính**
- danh sách thông báo;
- trạng thái đã đọc/chưa đọc;
- thời gian phát sinh;
- liên kết tới đối tượng liên quan;
- nút đánh dấu đã đọc. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L21】

**Phạm vi triển khai trong Sprint 11**
- xem danh sách notification;
- read one;
- read all;
- nhấn vào item để mở đối tượng liên quan nếu xác định được.

### 8.5. M46 – Thống kê và báo cáo hệ thống

**Chức năng của màn hình**  
Cho phép theo dõi các chỉ số vận hành cơ bản và hỗ trợ việc ra quyết định quản trị. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

**Nội dung hiển thị chính**
- biểu đồ hoặc bảng số liệu về người dùng;
- tour;
- bài đồng hành;
- báo cáo vi phạm;
- hồ sơ chờ duyệt;
- thanh toán cơ bản theo khoảng thời gian. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

**Phạm vi triển khai trong Sprint 11**
- thẻ số liệu tổng quan;
- 2–4 biểu đồ đơn giản;
- bộ lọc thời gian cơ bản;
- bảng tóm tắt theo nhóm.

### 8.6. Kết quả mong đợi của phần màn hình

Kết thúc Sprint 11, phần giao diện phải đạt:
- M07 trực quan, dùng được với dữ liệu thật;
- M17 rõ ràng, không rối;
- M19 đủ giống một inbox hệ thống;
- M46 có giá trị trình bày quản trị, không chỉ là vài con số rời rạc.

---

### 9. Bảng CSDL chính

### 9.1. `tour_locations`

Đây là bảng trung tâm của M07.  
Theo schema final, bảng này lưu:
- `tour_id`
- `sequence_no`
- `location_name`
- `address`
- `latitude`
- `longitude`
- `visit_time`
- `notes`
- `created_at`
và có ràng buộc `unique (tour_id, sequence_no)`.【turn37:18†KE_HOACH.docx†L1-L28】

**Vai trò trong Sprint 11**
- làm nguồn dữ liệu hiển thị lộ trình;
- xác định thứ tự điểm dừng;
- cung cấp tọa độ để render map;
- cung cấp ghi chú và thời gian để làm panel chi tiết.

### 9.2. `user_activity_logs`

Theo schema final, bảng này tối giản nhưng đủ mạnh:
- `user_id`
- `activity_type`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`【turn37:16†BAO_CAO_2_CSDL.docx†L16-L24】

**Vai trò trong Sprint 11**
- nguồn dữ liệu của M17;
- hỗ trợ truy vết hoạt động cá nhân;
- là cầu nối mềm giữa nhiều phân hệ đã xây từ Sprint 01–10.

### 9.3. `notifications`

Theo schema final, bảng này gồm:
- `user_id`
- `notification_type`
- `title`
- `content`
- `entity_type`
- `entity_id`
- `payload`
- `is_read`
- `created_at`
- `read_at`【turn37:18†KE_HOACH.docx†L1-L28】

`notification_type` được giới hạn trong các giá trị:
- `system`
- `tour_request`
- `companion_request`
- `message`
- `report`
- `verification`
- `payment`

**Vai trò trong Sprint 11**
- nguồn dữ liệu của M19;
- hỗ trợ badge unread;
- dẫn hướng người dùng quay lại đối tượng liên quan.

### 9.4. `reports`

Bảng `reports` không phải trung tâm UI của sprint này, nhưng là nguồn dữ liệu quan trọng cho statistics:
- tổng số report;
- breakdown theo trạng thái;
- xu hướng report theo thời gian.

Ngoài ra, khi report thay đổi trạng thái, nó cũng có thể là nguồn sinh notification.

### 9.5. `tours`

Bảng `tours` được dùng làm nguồn dữ liệu:
- cho M07 thông qua liên kết với `tour_locations`;
- cho dashboard thống kê số lượng tour;
- cho các breakdown theo trạng thái tour.

### 9.6. `companion_posts`

Bảng này hỗ trợ M46 cho nhóm thống kê:
- số bài đồng hành;
- trạng thái bài;
- số bài mở / đóng / hủy nếu triển khai thống kê trạng thái.

### 9.7. `payment_transactions`

Theo schema final, bảng này lưu:
- `tour_request_id`
- `user_id`
- `amount`
- `currency_code`
- `payment_method`
- `status`
- `transaction_code`
- `provider_transaction_code`
- `gateway_response`
- `created_at`
- `paid_at`
- `expires_at`【turn37:18†KE_HOACH.docx†L1-L28】

**Vai trò trong Sprint 11**
- cung cấp số liệu thanh toán cơ bản cho M46;
- có thể là nguồn sinh notification loại `payment`.

### 9.8. Bảng phụ thuộc cần dùng kèm

Ngoài 7 bảng chính, Sprint 11 còn có thể cần join hoặc phụ thuộc vào:
- `users`
- `guide_profiles`
- `tour_requests`
- `companion_requests`
- `guide_verification_requests`
- `report_processing_history`

Mục đích là:
- render tên đối tượng liên quan trong activity log/notification;
- tính statistics theo ngữ cảnh nghiệp vụ.

### 9.9. Ghi chú quan trọng về schema

Sprint 11 **không nên thay đổi mô hình dữ liệu lõi**.  
Chỉ nên:
- thêm index;
- thêm helper function;
- thêm trigger sinh log/notification nếu thật sự cần;
- thêm view/materialized query nhẹ nếu cần dashboard nhanh hơn.

---

### 10. API cần thiết

### 10.1. `GET /tours/:id/locations`

API lấy danh sách location của một tour để phục vụ M07.  
Yêu cầu:
- kiểm tra quyền xem tour theo trạng thái public/private;
- sort theo `sequence_no`;
- trả đủ dữ liệu hiển thị map và panel chi tiết.

### 10.2. `GET /me/activity-logs`

API lấy lịch sử hoạt động cá nhân của user hiện tại để phục vụ M17.  
Nên hỗ trợ:
- pagination;
- filter theo `activity_type`;
- sort theo `created_at desc`.

### 10.3. `GET /me/notifications`

API lấy danh sách thông báo của user hiện tại để phục vụ M19.  
Nên hỗ trợ:
- phân trang;
- filter `is_read`;
- sort `created_at desc`.

### 10.4. `PATCH /me/notifications/:id/read`

API đánh dấu một thông báo là đã đọc.  
Yêu cầu:
- chỉ cho phép user cập nhật notification của chính mình;
- set `is_read = true`;
- cập nhật `read_at`.

### 10.5. `PATCH /me/notifications/read-all`

API đánh dấu tất cả thông báo của user hiện tại là đã đọc.  
Đây là API nhỏ nhưng rất quan trọng cho trải nghiệm M19.

### 10.6. `GET /admin/statistics/overview`

API lấy tổng quan dashboard:
- total users
- total guides
- total tours
- total companion posts
- total reports
- total payments
- pending verification

### 10.7. `GET /admin/statistics/reports`

API thống kê report:
- số lượng theo trạng thái;
- số lượng theo thời gian;
- có thể thêm breakdown theo loại đối tượng bị report.

### 10.8. `GET /admin/statistics/tours`

API thống kê tour:
- tổng số tour;
- tour theo trạng thái;
- có thể thêm phân nhóm theo category/province nếu dễ làm.

### 10.9. `GET /admin/statistics/users`

API thống kê user:
- tổng số user;
- tổng số guide;
- user tăng theo thời gian;
- có thể thêm active/inactive nếu dữ liệu phù hợp.

### 10.10. Yêu cầu kỹ thuật chung cho API

- Response phải nhất quán với các sprint trước.
- Pagination nên dùng cùng format toàn hệ thống.
- Query statistics phải có timeout hợp lý và tránh N+1 query.
- API dashboard chỉ mở cho admin có quyền phù hợp.
- API `me/*` luôn bám actor hiện tại, không nhận `userId` từ client.

---

### 11. Công việc frontend

### 11.1. Xây dựng M07

- Chọn thư viện bản đồ phù hợp, dễ tích hợp.
- Render map container rõ ràng, không quá nặng.
- Tạo panel danh sách điểm.
- Hiển thị marker theo `sequence_no`.
- Xử lý fallback khi thiếu tọa độ.

### 11.2. Tích hợp M07 từ M06

- thêm nút/tab “Xem lộ trình tour” ở M06;
- điều hướng sang M07 hoặc mở section riêng;
- giữ ngữ cảnh quay lại chi tiết tour.

### 11.3. Xây dựng M17

- giao diện list hoặc timeline;
- filter activity type;
- trạng thái loading/empty/error;
- link tới đối tượng liên quan.

### 11.4. Xây dựng M19

- danh sách notification;
- style phân biệt read/unread;
- nút “Đánh dấu đã đọc”;
- nút “Đánh dấu tất cả đã đọc”;
- điều hướng theo entity liên quan.

### 11.5. Badge thông báo ở layout chung

Nếu còn thời gian, nên thêm badge unread count ở header hoặc user menu.  
Đây là chi tiết nhỏ nhưng tăng cảm giác “thật sản phẩm” khá rõ.

### 11.6. Xây dựng M46

- thẻ số liệu tổng quan;
- bảng hoặc chart đơn giản;
- bộ lọc theo khoảng thời gian;
- loading skeleton;
- empty state cho dashboard.

### 11.7. Chuẩn hóa chart component

Chart ở Sprint 11 chỉ nên dùng:
- bar chart;
- line chart;
- pie/donut nếu cần thật sự.

Không nên đưa quá nhiều loại chart gây rối giao diện.

### 11.8. Trạng thái hiển thị cần chuẩn hóa

Cần chuẩn hóa:
- loading state cho map, logs, notifications, dashboard;
- empty state;
- error state;
- pagination state;
- filter state.

### 11.9. Kết quả mong đợi phía frontend

Kết thúc Sprint 11, frontend phải:
- có 4 màn hình chạy được với dữ liệu thật;
- điều hướng rõ ràng;
- UI đồng đều với các sprint trước;
- đủ đẹp và đủ rõ để đưa vào demo/báo cáo.

---

### 12. Công việc backend

### 12.1. Tổ chức module

Nên chia trách nhiệm rõ:
- `tours` xử lý map/locations;
- `auth-me` hoặc `profile` xử lý activity logs;
- `reports-notifications` xử lý notifications;
- `admin` xử lý statistics. 【turn37:7†mapping_for_dev_backend:frontend.docx†L24-L42】

### 12.2. Xử lý logic lấy dữ liệu map

- validate `tourId`;
- kiểm tra quyền truy cập tour;
- lấy `tour_locations` theo thứ tự;
- trả response gọn, đúng cho map UI.

### 12.3. Xử lý logic activity logs

- cung cấp endpoint đọc log cá nhân;
- chuẩn hóa cách ghi log ở các service nghiệp vụ;
- tạo helper chung để tránh module nào cũng tự ghi kiểu riêng.

### 12.4. Xử lý logic notifications

- tạo helper/service sinh notification;
- chuẩn hóa payload;
- triển khai read one / read all;
- bảo đảm ownership tuyệt đối.

### 12.5. Xử lý logic statistics

- viết query tổng hợp cho overview;
- viết query breakdown cho reports/tours/users;
- tối ưu query bằng index và aggregate hợp lý;
- tách service để code dễ bảo trì.

### 12.6. Phân quyền và ownership

- `me/activity-logs` và `me/notifications` chỉ thao tác dữ liệu cá nhân;
- statistics chỉ dành cho admin được phân quyền;
- map public phải bám rule hiển thị tour hiện có.

### 12.7. Logging và audit ở mức cần thiết

Sprint 11 nên log:
- lỗi query dashboard;
- lỗi lấy dữ liệu map;
- lỗi read/update notification;
- lỗi helper sinh notification nếu có.

Không cần tạo hệ thống observability quá nặng.

### 12.8. Kết quả mong đợi phía backend

Backend phải đạt:
- API map ổn định;
- API logs và notifications nhất quán;
- statistics query trả số liệu đúng;
- code đủ gọn để nối tiếp Sprint 12 mà không phải refactor lớn.

---

### 13. Công việc database

### 13.1. Giữ nguyên schema 38 bảng làm chuẩn

Sprint 11 không nên thay đổi bản chất schema, chỉ khai thác đúng các bảng đã có trong schema final. Đây là nguyên tắc giúp bộ tài liệu và code đồng bộ. 【turn37:18†KE_HOACH.docx†L1-L28】

### 13.2. Bổ sung index cần thiết

Ưu tiên thêm hoặc rà soát index cho:
- `user_activity_logs(user_id, created_at)`
- `notifications(user_id, is_read, created_at)`
- `tour_locations(tour_id, sequence_no)`
- các cột dùng để aggregate ở statistics nếu thiếu

Điều này cũng phù hợp với lưu ý trong kế hoạch về việc tối ưu logs và notifications. 【turn37:18†KE_HOACH.docx†L1-L28】

### 13.3. Helper hoặc trigger ghi log

Nên chọn một trong hai hướng:
- ghi log ở service backend;
- hoặc dùng helper DB / RPC hỗ trợ.

Trong phạm vi đồ án, ghi ở backend service thường dễ kiểm soát hơn; trigger chỉ nên dùng nếu rule rất rõ và ít thay đổi.

### 13.4. Helper sinh notification

Tương tự activity log, notification có thể được sinh:
- trực tiếp ở service backend;
- hoặc qua helper DB.

Phương án khuyến nghị: sinh ở backend để dễ đọc luồng nghiệp vụ và dễ demo.

### 13.5. Seed dữ liệu map

- tạo `tour_locations` cho vài tour thật;
- sequence phải hợp lý;
- có đủ cả dữ liệu có tọa độ và dữ liệu thiếu tọa độ để test fallback.

### 13.6. Seed activity log và notification

- seed log theo nhiều `activity_type`;
- seed notification theo nhiều `notification_type`;
- tạo cả bản ghi read và unread;
- metadata/payload phải đủ để frontend render.

### 13.7. Seed dữ liệu cho statistics

Chuẩn bị dữ liệu:
- user ở nhiều trạng thái;
- report ở nhiều trạng thái;
- payment ở nhiều trạng thái;
- tour/companion post có phân nhóm đủ khác nhau.

### 13.8. Kết quả mong đợi phía database

Database phải đạt:
- query map, log, notification chạy nhanh ổn;
- statistics có dữ liệu đủ để demo;
- không phát sinh thay đổi schema lớn làm lệch sprint trước.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện

- cập nhật mô tả Sprint 11 trong kế hoạch;
- cập nhật mô tả chức năng F04, F07, F15, F28 nếu cần chi tiết hơn;
- cập nhật mô tả M07, M17, M19, M46;
- cập nhật mapping API – màn hình – bảng.

### 14.2. UML cần chốt trong Sprint 11

Theo kế hoạch, cần hoàn thiện Activity Diagram cho:
- xem bản đồ tour;
- xem lịch sử hoạt động;
- xem thông báo;
- xem thống kê hệ thống. 【turn37:18†KE_HOACH.docx†L1-L28】

### 14.3. Sequence Diagram nên bổ sung nếu còn thời gian

Nếu còn thời gian, nên thêm:
- Sequence Diagram sinh notification khi trạng thái request thay đổi;
- Sequence Diagram lấy dashboard statistics;
- Sequence Diagram mở M17 và truy vấn log.

### 14.4. Mapping cần rà soát

Cần rà soát để bảo đảm:
- F04 ↔ M17 ↔ `user_activity_logs` ↔ `GET /me/activity-logs`
- F07 ↔ M19 ↔ `notifications` ↔ `GET/PATCH /me/notifications*`
- F15 ↔ M07 ↔ `tour_locations` ↔ `GET /tours/:id/locations`
- F28 ↔ M46 ↔ statistics queries ↔ `GET /admin/statistics/*`

### 14.5. Mục tiêu của phần tài liệu/UML

Kết thúc Sprint 11, phần tài liệu phải đủ để:
- đưa thẳng vào báo cáo;
- giải thích logic khi bảo vệ;
- nối tiếp mượt sang Sprint 12 mà không phải quay lại vá tài liệu.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng

- Xem bản đồ lộ trình tour
- Xem lịch sử hoạt động cá nhân
- Xem và đọc thông báo
- Xem dashboard thống kê cơ bản

### 15.2. Đầu ra giao diện

- M07 chạy được với dữ liệu tour thật
- M17 hiển thị log rõ ràng
- M19 hiển thị notification và read/unread
- M46 có card + chart/table cơ bản

### 15.3. Đầu ra API

- `GET /tours/:id/locations`
- `GET /me/activity-logs`
- `GET /me/notifications`
- `PATCH /me/notifications/:id/read`
- `PATCH /me/notifications/read-all`
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

### 15.4. Đầu ra dữ liệu

- seed `tour_locations`
- seed `user_activity_logs`
- seed `notifications`
- seed dữ liệu statistics

### 15.5. Đầu ra tài liệu

- Activity Diagram cho 4 luồng Sprint 11
- cập nhật mô tả màn hình
- cập nhật mapping chức năng – API – bảng

### 15.6. Tiêu chí sẵn sàng sang Sprint 12

Hệ thống được xem là sẵn sàng sang Sprint 12 khi:
- nhóm ưu tiên 2 gần như đã khép kín;
- DB/API/UI/UML của Sprint 11 đồng bộ;
- dữ liệu demo đủ “dày” cho bảo vệ;
- không còn lỗi lớn ở map/log/notification/statistics.

---

### 16. Kết luận sprint

Sprint 11 là sprint hoàn thiện mạnh về **trải nghiệm và khả năng trình bày**, nhưng vẫn phải giữ đúng tinh thần của đồ án sinh viên:

- đủ thực tế;
- đủ đồng bộ;
- đủ đẹp để demo;
- không quá nặng về kỹ thuật.

Nếu Sprint 11 được triển khai đúng phạm vi đã chốt, hệ thống sẽ đạt trạng thái gần như hoàn thiện toàn bộ nhóm **ưu tiên 2**, đúng với kế hoạch 14 sprint: sản phẩm không chỉ có các luồng lõi chạy được, mà còn có bản đồ, lịch sử, thông báo và thống kê để trở thành một hệ thống thuyết phục hơn cả về nghiệp vụ lẫn giao diện.【turn37:18†KE_HOACH.docx†L1-L28】【turn37:17†Ke_hoach_14_sprint_DOCX_ready.docx†L1-L19】

---

<a id="sprint-12"></a>
## SPRINT 12 – Mở rộng giao tiếp: chat trực tiếp và chat nhóm bài đồng hành

### 1. Mục tiêu sprint

Sprint 12 là sprint mở rộng theo đúng lộ trình 14 sprint, tập trung vào **nhóm chức năng giao tiếp** để làm hệ thống có chiều sâu tương tác hơn sau khi:

- Sprint 09 đã ổn định MVP lõi;
- Sprint 10 đã bổ sung favorite, review và verification;
- Sprint 11 đã làm sản phẩm “đầy” hơn với map, activity log, notification và statistics.

Nếu Sprint 11 giúp hệ thống hoàn thiện hơn về **theo dõi và hiển thị vận hành**, thì Sprint 12 giúp sản phẩm có thêm một lớp trải nghiệm quan trọng: **người dùng có thể trao đổi trực tiếp với hướng dẫn viên, và các thành viên của một bài đồng hành có thể trao đổi trong không gian chung**.

Theo kế hoạch đã chốt, Sprint 12 tập trung vào 2 chức năng chính:

- **F19 – Chat trực tiếp**
- **F20 – Chat nhóm bài đồng hành**

Các màn hình trọng tâm tương ứng là:

- **M29 – Chat trực tiếp user–guide**
- **M30 – Chat nhóm bài đồng hành**

#### Mục tiêu chính

- Hoàn thiện **module chat cơ bản** có thể lưu hội thoại và tin nhắn, đủ để minh họa khả năng giao tiếp của nền tảng.
- Cho phép mở **chat trực tiếp giữa user và guide** trong ngữ cảnh phù hợp, chủ yếu từ chi tiết guide hoặc chi tiết tour.
- Cho phép mở **chat nhóm của bài đồng hành** để chủ bài và các thành viên đã được duyệt có không gian trao đổi chung.
- Hỗ trợ các thao tác cơ bản:
  - xem danh sách conversation;
  - xem participant;
  - lấy message theo hội thoại;
  - gửi message mới;
  - cập nhật trạng thái đã đọc ở mức cơ bản.
- Giữ đúng tinh thần đồ án:
  - **có lưu hội thoại**;
  - **có cấu trúc dữ liệu rõ ràng**;
  - **có UI đủ để demo**;
  - nhưng **không bắt buộc realtime/WebSocket**.
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** để Sprint 12 khép kín, sẵn sàng sang Sprint 13.

#### Ý nghĩa của sprint này

Sprint 12 không phải sprint lõi bắt buộc như tour, guide, companion hay admin. Tuy nhiên, đây là sprint có **giá trị trình bày rất cao** vì nó làm hệ thống giống một nền tảng kết nối thực sự hơn.

Giá trị của sprint này nằm ở 3 điểm:

1. **Tăng tính kết nối thực tế**  
   Người dùng không chỉ xem tour hay gửi request, mà còn có thể trao đổi trực tiếp với guide hoặc trao đổi trong nhóm đồng hành.

2. **Tăng chiều sâu khi demo**  
   Khi bảo vệ, module chat luôn là phần dễ tạo ấn tượng vì thể hiện rõ khả năng tương tác giữa các actor.

3. **Tạo nền cho mở rộng sau này**  
   Sau Sprint 12, hệ thống đã có nền conversation/message. Về sau có thể mở rộng sang realtime, notification sâu hơn, gửi file, chatbot hoặc các trải nghiệm hỗ trợ khác.

Nói ngắn gọn, Sprint 12 là sprint giúp hệ thống có thêm **“lớp giao tiếp”**, nhưng vẫn phải giữ đúng mức **cơ bản, dễ demo, dễ báo cáo và khả thi cho đồ án sinh viên**.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Đây là sprint mở rộng, không được kéo chậm phần lõi đã ổn định

Sprint 12 thuộc nhóm mở rộng có giá trị trình bày cao. Vì vậy, mục tiêu không phải là xây một hệ thống chat hoàn chỉnh như sản phẩm thương mại, mà là làm một module chat đủ rõ về:

- actor;
- conversation;
- participant;
- message;
- điều kiện truy cập;
- trạng thái đã đọc ở mức cơ bản.

Không nên để sprint này kéo dài vì các nội dung như realtime, socket gateway, media upload, đồng bộ đa tab hay unread counter phức tạp.

### 2.2. Không đẩy ngay sang WebSocket hoặc realtime đầy đủ

Nếu làm một mình hoặc nguồn lực hạn chế, Sprint 12 không nên đẩy ngay sang:

- WebSocket gateway;
- realtime push;
- presence online/offline;
- typing indicator;
- delivery status nhiều tầng;
- sync nhiều tab;
- đẩy notification popup tức thời.

Mức phù hợp nhất cho đồ án là:

- lưu hội thoại vào database;
- lấy danh sách conversation bằng REST;
- lấy message bằng REST;
- gửi message bằng REST;
- dùng **polling** hoặc **refresh định kỳ** để cập nhật màn hình.

### 2.3. Direct chat phải có ngữ cảnh tạo rõ ràng

Nếu không chốt ngữ cảnh tạo chat, direct chat rất dễ bị mở tràn lan và khó giải thích khi viết báo cáo.  
Ngay từ đầu phải thống nhất:

- direct chat được mở từ đâu;
- có cho tạo direct chat từ trang bất kỳ hay không;
- một cặp user–guide có được tạo nhiều conversation direct giống nhau hay không;
- có gắn conversation với `related_tour_id` hay chỉ lưu theo cặp participant.

Hướng hợp lý nhất cho đồ án là:
- direct chat chỉ nên phát sinh từ **chi tiết guide** hoặc **chi tiết tour**;
- nếu đã có conversation direct phù hợp thì mở lại conversation cũ thay vì tạo trùng quá nhiều.

### 2.4. Group chat chỉ nên gắn với bài đồng hành

Sprint 12 chỉ hỗ trợ hai loại chat:

- **direct**
- **group_companion**

Không nên mở thêm:
- group chat cho tour;
- group chat tự tạo tùy ý;
- room công khai;
- room theo tỉnh/thành;
- voice room hoặc video room.

Chat nhóm phải gắn với **một bài đồng hành cụ thể**, và participant chỉ gồm:
- chủ bài;
- các thành viên đã được duyệt tham gia bài đồng hành.

Điều này giúp chat nhóm bám chặt vào nghiệp vụ đã có từ Sprint 07, không biến Sprint 12 thành một sản phẩm nhắn tin độc lập.

### 2.5. Read-state phải đơn giản, nhất quán và đủ demo

Nếu làm read-state quá sâu, hệ thống sẽ phát sinh rất nhiều logic:

- unread count theo message;
- read receipt theo từng participant;
- seen status cho từng tin;
- đồng bộ nhiều thiết bị;
- message delivery.

Với đồ án, chỉ cần chọn một cách đơn giản và ổn định.  
Hướng phù hợp là lưu `last_read_at` ở `conversation_participants`, từ đó frontend/backend suy ra unread ở mức tổng quát.

### 2.6. Không mở rộng voice, video, gửi file phức tạp

Schema có thể cho phép mở rộng `message_type`, nhưng Sprint 12 không nên kéo sâu sang:

- gửi voice;
- gọi video;
- gửi file dung lượng lớn;
- chia sẻ vị trí realtime;
- image gallery;
- moderation message nhiều tầng.

Chỉ cần ưu tiên:
- text message;
- message hệ thống cơ bản nếu cần;
- file/image chỉ để mở rộng sau.

### 2.7. Dữ liệu demo quyết định chất lượng của module chat

Chat là nhóm chức năng rất khó demo nếu thiếu dữ liệu mẫu.  
Muốn Sprint 12 nhìn thuyết phục, phải chuẩn bị sẵn:

- ít nhất 1 direct conversation giữa user và guide;
- ít nhất 1 group conversation gắn với companion post;
- vài participant đã join vào group;
- nhiều message với mốc thời gian khác nhau;
- trạng thái đã đọc / chưa đọc khác nhau;
- 1–2 tình huống participant rời group hoặc bị ẩn tin nhắn nếu muốn minh họa.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Direct chat được tạo trong ngữ cảnh nào

Cần chốt rõ:
- từ chi tiết tour có nút “Nhắn guide” hay không;
- từ hồ sơ hướng dẫn viên công khai có nút “Nhắn guide” hay không;
- có cho admin tham gia flow này không;
- direct chat có yêu cầu người dùng đã gửi request tour trước đó hay chỉ cần đăng nhập.

#### 3.2. Group chat gắn với companion post nào

Cần xác định:
- group conversation được tạo ngay khi bài đồng hành được tạo, hay chỉ tạo khi có thành viên đầu tiên được duyệt;
- group conversation có 1–1 với companion post hay có thể nhiều hơn 1;
- title của conversation lấy theo tiêu đề bài đồng hành hay tự đặt.

#### 3.3. Participant của từng loại conversation gồm những ai

Cần chốt:
- direct chat chỉ gồm 2 người hay có cho admin/support vào xem không;
- group chat gồm chủ bài + thành viên approved, có cho người bị reject vào xem không;
- khi thành viên bị hủy duyệt hoặc rời nhóm thì xử lý `left_at` thế nào.

#### 3.4. Trạng thái đọc được lưu theo cách nào

Cần thống nhất:
- dùng `last_read_at` ở participant;
- có cập nhật mỗi khi mở conversation hay mỗi lần kéo tới cuối danh sách;
- unread count tính phía backend hay frontend.

#### 3.5. Có cho soft delete message hay không

Schema đã có `is_deleted`, `deleted_at`, vì vậy cần chốt:
- Sprint 12 có hiện thực xóa mềm message hay chưa;
- nếu chưa làm UI xóa message thì backend có cần chuẩn bị sẵn không;
- khi message bị xóa thì frontend hiển thị thế nào.

#### 3.6. Có chống trùng conversation direct hay không

Đây là điểm quan trọng vì nếu không chốt trước sẽ dễ phát sinh dữ liệu rác.  
Cần xác định:
- mỗi cặp user–guide chỉ có 1 direct conversation chính;
- hay cho phép nhiều conversation theo từng tour;
- nếu user nhắn cùng một guide từ hai tour khác nhau thì hệ thống mở conversation nào.

#### 3.7. Phân quyền truy cập conversation được kiểm tra ở đâu

Cần chốt:
- check participant ở database hay service;
- endpoint lấy messages có luôn kiểm tra membership không;
- PATCH read-state có kiểm tra participant không;
- GET participants có giới hạn theo role không.

#### 3.8. Có cần thay đổi schema không

Schema final đã có đủ:
- `conversations`
- `conversation_participants`
- `messages`

Nhưng vẫn cần rà soát:
- index nào còn thiếu;
- có cần unique rule bổ sung cho direct conversation hay không;
- có cần trigger cập nhật `updated_at` cho `conversations` khi có tin nhắn mới hay không.

#### 3.9. UML nào cần cập nhật ngay trong sprint này

Tối thiểu phải xác định:
- Activity Diagram cho direct chat;
- Activity Diagram cho group companion chat;
- nếu còn thời gian, thêm Sequence Diagram cho luồng gửi message.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục chiến lược chat

- Chỉ làm chat cơ bản, chưa bắt buộc realtime.
- Chỉ hỗ trợ 2 loại conversation: `direct` và `group_companion`.
- Dùng REST API + polling/refresh định kỳ.

#### 4.2. Hạng mục ngữ cảnh tạo conversation

- Direct chat phát sinh từ ngữ cảnh guide/tour.
- Group chat gắn với bài đồng hành.
- Không cho tạo conversation tự do ngoài hai ngữ cảnh trên.

#### 4.3. Hạng mục participant

- Direct chat: user và guide.
- Group chat: chủ bài + thành viên đã approved.
- Participant được kiểm tra chặt ở mọi endpoint đọc/ghi chat.

#### 4.4. Hạng mục message

- Hỗ trợ gửi text message là chính.
- Có thể để mở `message_type = system` cho thông báo nội bộ đơn giản.
- Chưa bắt buộc UI cho image/file trong sprint này.

#### 4.5. Hạng mục read-state

- Dùng `last_read_at` trong `conversation_participants`.
- Cho phép đánh dấu đã đọc ở mức conversation.
- Unread count nếu có thì tính ở mức cơ bản.

#### 4.6. Hạng mục frontend

- Danh sách conversation.
- Khung chat direct.
- Khung chat group.
- Participant list cơ bản.
- Empty state, loading state, error state.

#### 4.7. Hạng mục backend

- Tạo direct conversation.
- Tạo group conversation gắn companion post.
- Lấy danh sách conversation của current user.
- Lấy message theo conversation.
- Gửi message.
- Cập nhật read-state.
- Kiểm tra quyền truy cập conversation.

#### 4.8. Hạng mục database

- Seed conversation và message mẫu.
- Bổ sung index cần thiết.
- Chuẩn hóa relation giữa group conversation và companion post.
- Chuẩn bị convention cập nhật `updated_at`.

#### 4.9. Hạng mục tài liệu/UML

- Activity Diagram cho chat trực tiếp.
- Activity Diagram cho chat nhóm bài đồng hành.
- Mô tả use case và rule phân quyền chat.

---

### 5. Phương án được chọn

### 5.1. Chiến lược chat được chọn

Sprint 12 triển khai **chat ở mức cơ bản, có lưu hội thoại**, chưa bắt buộc realtime.  
Giải pháp phù hợp nhất là:

- backend REST API;
- frontend polling/refetch định kỳ;
- chưa dùng WebSocket trong sprint này.

Hướng này vừa phù hợp với tài liệu chốt, vừa bảo đảm tính khả thi cho đồ án.

### 5.2. Loại chat được chọn

Chỉ hỗ trợ:

- **direct chat user–guide**
- **group chat bài đồng hành**

Không hỗ trợ thêm:
- group chat tự do;
- group chat cho tour;
- voice/video;
- room công khai.

### 5.3. Điều kiện tạo conversation được chọn

- **Direct chat** chỉ nên tạo từ **chi tiết guide** hoặc **chi tiết tour**.
- **Group chat** chỉ gắn với **một companion post cụ thể**.
- Với group chat, chỉ **chủ bài** và **thành viên đã được duyệt** mới được vào conversation.
- Nếu direct conversation phù hợp đã tồn tại, hệ thống nên **mở lại conversation cũ** thay vì tạo trùng.

### 5.4. Quy tắc participant được chọn

- `conversation_participants` là nguồn sự thật để kiểm tra quyền truy cập.
- Direct chat có đúng 2 participant hoạt động.
- Group chat có thể nhiều participant, nhưng chỉ gồm những người hợp lệ theo nghiệp vụ companion.
- Khi một người rời conversation/group, ưu tiên cập nhật `left_at` thay vì xóa cứng record participant.

### 5.5. Cách lưu read-state được chọn

- Dùng `last_read_at` trong bảng `conversation_participants`.
- Khi người dùng mở conversation hoặc thực hiện action “đánh dấu đã đọc”, backend cập nhật `last_read_at`.
- Unread state được suy ra bằng cách so `last_read_at` với `sent_at` của tin nhắn mới nhất hoặc tin chưa đọc.

### 5.6. Mức độ message được chọn

- Ưu tiên `message_type = text`.
- Có thể cho phép `system` ở mức tối thiểu để minh họa các tin như:
  - thành viên mới tham gia;
  - chủ bài đã duyệt thành viên.
- `image` và `file` chỉ giữ như hướng mở rộng của schema, chưa bắt buộc triển khai UI/flow trong Sprint 12.

### 5.7. Mức độ realtime được chọn

- **Không bắt buộc realtime push**.
- Có thể dùng:
  - refetch khi mở conversation;
  - refetch theo khoảng thời gian;
  - refresh thủ công khi cần.
- Không làm typing indicator, online presence hay delivered/seen phức tạp.

### 5.8. Hướng xử lý dữ liệu demo được chọn

Chuẩn bị ít nhất:

- 1 direct conversation giữa 1 user và 1 guide;
- 1 direct conversation khác có nhiều message cũ/mới;
- 1 group conversation gắn với 1 companion post;
- 3–5 participant trong group;
- nhiều message với mốc thời gian khác nhau;
- ít nhất 1 participant có `last_read_at` cũ để thấy unread state.

### 5.9. Chia module backend

Phù hợp nhất là để chat nằm trong module:

- **`chat-ai`** nếu muốn bám sát mapping đã chốt;
hoặc
- tách riêng **`chat`** nếu muốn clean code hơn trong triển khai thực tế.

Trong phạm vi bộ tài liệu hiện tại, nên giữ theo hướng:

- controller/service/chat logic nằm trong **`chat-ai`**
- nhưng code nội bộ tách rõ:
  - `conversation.service`
  - `message.service`
  - `participant.service`

để sang Sprint 13 nối AI Chat thuận tiện hơn.

---

### 6. Ghi chú triển khai

#### 6.1. Thứ tự triển khai nên làm

Nên triển khai theo thứ tự sau:

1. rà lại schema chat và seed dữ liệu mẫu;
2. làm API list conversations;
3. làm API lấy messages theo conversation;
4. làm API gửi message;
5. làm API tạo direct conversation;
6. làm API tạo group conversation từ companion post;
7. làm API read-state;
8. dựng UI M29 và M30;
9. cập nhật UML.

#### 6.2. Không biến M29 thành “messenger” hoàn chỉnh

M29 chỉ cần đủ:

- danh sách conversation;
- chọn conversation;
- xem message history;
- gửi text message;
- thông tin đối tác trò chuyện.

Không cần:
- sticker;
- emoji picker phức tạp;
- pin chat;
- search chat toàn cục;
- media gallery;
- archive chat.

#### 6.3. Không biến M30 thành group social network

M30 chỉ là không gian trao đổi cho một bài đồng hành cụ thể.  
Không nên thêm:

- quản trị nhóm nhiều tầng;
- phân vai thành viên;
- tạo nhiều room con;
- chia topic;
- invite link;
- approval vào chat tách rời approval vào bài đồng hành.

#### 6.4. Conversation direct nên tránh tạo trùng

Về triển khai, nên có helper:

- tìm direct conversation hiện có giữa hai người;
- nếu đã tồn tại thì trả về conversation cũ;
- nếu chưa có mới tạo conversation mới.

Như vậy dữ liệu chat gọn hơn và UI dễ hiểu hơn.

#### 6.5. Group chat nên tạo sau khi có dữ liệu companion ổn định

Không nên làm group chat trước rồi mới vá nghiệp vụ companion.  
Group chat chỉ đẹp khi Sprint 07 đã có:

- companion post;
- companion request;
- approved member;
- chủ bài rõ ràng.

Vì vậy, ở Sprint 12 phải dùng lại đúng dữ liệu nền từ Sprint 07.

#### 6.6. Quy tắc “xong sprint”

Sprint 12 chỉ được coi là hoàn thành khi tối thiểu đáp ứng:

- có bảng chat đúng schema;
- có seed dữ liệu chat mẫu;
- có API list / detail / create / send / read chạy được;
- có M29 và M30 nối API;
- có test flow tối thiểu;
- có cập nhật tài liệu/UML liên quan.

#### 6.7. Dữ liệu demo nên chuẩn bị

Nên seed các nhóm dữ liệu:

- user thường;
- guide;
- companion post đã mở;
- companion request đã approved;
- conversation direct đang hoạt động;
- conversation group có nhiều thành viên;
- message text nhiều mốc thời gian;
- vài message hệ thống nếu muốn minh họa.

---

### 7. Chức năng trọng tâm

#### F19. Chat trực tiếp

Chức năng này hỗ trợ **người dùng đã đăng nhập** và **hướng dẫn viên** trao đổi trực tiếp về:

- tour;
- thời gian;
- yêu cầu cụ thể;
- thông tin cần làm rõ trước khi tham gia.

Giá trị của F19 là tăng khả năng kết nối trực tiếp giữa hai actor chính của nền tảng: **khách du lịch** và **hướng dẫn viên**.

#### F20. Chat nhóm bài đồng hành

Chức năng này tạo một không gian trao đổi chung cho:

- chủ bài đồng hành;
- các thành viên đã được duyệt vào bài.

Giá trị của F20 là hỗ trợ phối hợp trước chuyến đi, trao đổi về thời gian, điểm hẹn, kế hoạch hoặc các lưu ý chung.

#### Kết luận cho nhóm chức năng

Sprint 12 chỉ tập trung vào **2 chức năng giao tiếp cốt lõi nhất** của giai đoạn mở rộng.  
Mục tiêu không phải làm một nền tảng nhắn tin độc lập, mà là làm cho hệ thống du lịch có đủ “lớp giao tiếp” để:

- hợp logic nghiệp vụ;
- hợp phạm vi đồ án;
- đủ mạnh để demo và viết báo cáo.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình

Phần màn hình trong Sprint 12 phải làm rõ được ba điều:

1. Người dùng/guide **nhìn thấy các conversation của mình**.
2. Người dùng/guide **đọc được nội dung trao đổi** trong một conversation cụ thể.
3. Người dùng/guide **gửi được message mới** và nhìn thấy trạng thái cơ bản của conversation.

### 8.2. M29 – Chat trực tiếp user–guide

M29 là màn hình hỗ trợ trao đổi trực tiếp giữa user và guide.

#### Thành phần chính nên có

- danh sách cuộc trò chuyện ở cột trái;
- khung message ở vùng trung tâm;
- thông tin đối tác trò chuyện ở phần header;
- input gửi tin;
- timestamp cơ bản;
- empty state khi chưa chọn conversation;
- empty state khi chưa có conversation nào.

#### Hành vi chính

- mở từ chi tiết guide hoặc chi tiết tour;
- nếu chưa có direct conversation thì tạo mới;
- nếu đã có conversation thì mở lại;
- lấy danh sách message theo conversation đang chọn;
- gửi message mới;
- cập nhật read-state khi mở conversation.

#### Điều cần tránh

- không làm layout quá phức tạp như ứng dụng chat thương mại;
- không phụ thuộc vào realtime để màn hình hoạt động;
- không thêm quá nhiều cột/phần phụ gây rối.

### 8.3. M30 – Chat nhóm bài đồng hành

M30 là không gian trao đổi nhóm cho một companion post cụ thể.

#### Thành phần chính nên có

- tên nhóm hoặc title theo bài đồng hành;
- danh sách thành viên;
- khung message nhóm;
- thông báo thành viên mới nếu cần;
- liên kết quay lại bài đồng hành;
- input gửi tin;
- empty state khi chưa có group conversation.

#### Hành vi chính

- mở từ khu vực bài đồng hành của người dùng;
- chỉ chủ bài và thành viên approved mới vào được;
- lấy participant list;
- lấy message list;
- gửi message mới;
- cập nhật read-state.

#### Điều cần tránh

- không tạo nhiều group con cho một bài;
- không thêm quyền quản trị nhóm phức tạp;
- không tách group chat thành module mạng xã hội.

### 8.4. Kết quả mong đợi của phần màn hình

Kết thúc Sprint 12, người dùng có thể:

- mở direct chat với guide trong ngữ cảnh phù hợp;
- xem các cuộc trò chuyện của mình;
- gửi và nhận message ở mức lưu trữ cơ bản;
- tham gia chat nhóm bài đồng hành nếu là thành viên hợp lệ.

---

### 9. Bảng CSDL chính

### 9.1. `conversations`

Đây là bảng trung tâm của module chat.

#### Vai trò dữ liệu

- lưu metadata của conversation;
- xác định loại conversation;
- xác định người tạo;
- liên kết với tour hoặc companion post nếu cần.

#### Thuộc tính đáng chú ý

- `id`
- `conversation_type`
- `title`
- `created_by_user_id`
- `related_tour_id`
- `related_companion_post_id`
- `created_at`
- `updated_at`

#### Quy tắc quan trọng

- `conversation_type` chỉ nên là:
  - `direct`
  - `group_companion`
- nếu là `group_companion` thì phải có `related_companion_post_id`.
- direct chat có thể không cần `title`;
- group chat nên có `title` dễ hiểu theo bài đồng hành.

### 9.2. `conversation_participants`

Đây là bảng kiểm soát membership của conversation.

#### Vai trò dữ liệu

- xác định ai thuộc conversation nào;
- lưu thời điểm join;
- lưu thời điểm rời;
- lưu trạng thái mute;
- lưu read-state tổng quát bằng `last_read_at`.

#### Thuộc tính đáng chú ý

- `conversation_id`
- `user_id`
- `joined_at`
- `left_at`
- `is_muted`
- `last_read_at`

#### Quy tắc quan trọng

- direct chat phải có đúng 2 participant hoạt động;
- group chat có nhiều participant;
- nếu participant rời nhóm, ưu tiên cập nhật `left_at` thay vì xóa record;
- mọi endpoint đọc/ghi chat phải check participant từ bảng này.

### 9.3. `messages`

Đây là bảng lưu nội dung trao đổi trong conversation.

#### Vai trò dữ liệu

- lưu người gửi;
- lưu nội dung;
- lưu loại tin nhắn;
- lưu thời điểm gửi;
- hỗ trợ soft delete nếu cần.

#### Thuộc tính đáng chú ý

- `id`
- `conversation_id`
- `sender_user_id`
- `content`
- `message_type`
- `attachment_url`
- `sent_at`
- `edited_at`
- `is_deleted`
- `deleted_at`

#### Quy tắc quan trọng

- Sprint 12 ưu tiên `message_type = text`;
- `system` có thể dùng ở mức tối thiểu;
- `image`, `file` là hướng mở rộng, chưa bắt buộc UI;
- soft delete có thể chuẩn bị sẵn ở DB nhưng chưa bắt buộc hiện thực đầy đủ trong UI.

### 9.4. Bảng phụ thuộc cần dùng kèm

Ngoài 3 bảng chính, module chat vẫn cần dựa vào các bảng đã có của hệ thống:

- `users`  
  để hiển thị tên, avatar, trạng thái tài khoản của participant.

- `guide_profiles`  
  để direct chat với guide có ngữ cảnh rõ ràng từ hồ sơ/tour.

- `tours`  
  để direct chat có thể gắn với tour nếu cần.

- `companion_posts`  
  để group chat gắn với bài đồng hành.

- `companion_requests`  
  để xác định thành viên approved nào được vào group chat.

### 9.5. Ghi chú quan trọng về schema

Schema final hiện tại đã đủ tốt cho Sprint 12.  
Các việc cần làm thêm thiên về:

- index;
- convention tạo conversation;
- trigger cập nhật `updated_at`;
- seed dữ liệu.

Không nên phá vỡ schema lớn ở sprint này trừ khi phát hiện lỗi thật sự ảnh hưởng tới chat flow.

---

### 10. API cần thiết

### 10.1. `GET /conversations`

#### Mục đích
Lấy danh sách conversation của người dùng hiện tại.

#### Dữ liệu nên trả về
- `conversationId`
- `conversationType`
- `title`
- `lastMessagePreview`
- `lastMessageAt`
- `unreadCount` hoặc cờ unread cơ bản
- `participants` rút gọn
- `relatedCompanionPostId` / `relatedTourId` nếu có

#### Ghi chú
Danh sách nên sắp theo conversation có hoạt động mới nhất.

### 10.2. `POST /conversations/direct`

#### Mục đích
Tạo direct conversation giữa current user và guide.

#### Input gợi ý
- `guideUserId`
- `relatedTourId` (nếu tạo từ tour)
- `initialMessage` (tùy chọn)

#### Rule chính
- chỉ user đăng nhập hợp lệ mới được tạo;
- guide đích phải tồn tại;
- nếu conversation phù hợp đã có thì trả về conversation cũ;
- không tạo direct chat trùng vô hạn.

### 10.3. `POST /conversations/group-companion`

#### Mục đích
Tạo group conversation cho một companion post.

#### Input gợi ý
- `companionPostId`

#### Rule chính
- chỉ tạo trong ngữ cảnh companion post hợp lệ;
- conversation gắn với `related_companion_post_id`;
- participant ban đầu ít nhất gồm chủ bài;
- các thành viên approved được thêm vào theo rule nghiệp vụ.

### 10.4. `GET /conversations/:id/messages`

#### Mục đích
Lấy danh sách messages của một conversation.

#### Rule chính
- chỉ participant mới được truy cập;
- phân trang hoặc load theo batch;
- ẩn tin đã xóa nếu áp dụng soft delete.

### 10.5. `POST /conversations/:id/messages`

#### Mục đích
Gửi message mới vào conversation.

#### Input gợi ý
- `content`
- `messageType` (mặc định `text`)

#### Rule chính
- sender phải là participant hợp lệ;
- không cho gửi message rỗng;
- cập nhật `updated_at` của conversation;
- có thể cập nhật unread cho participant khác theo logic suy ra từ `last_read_at`.

### 10.6. `PATCH /conversations/:id/read`

#### Mục đích
Đánh dấu conversation đã đọc.

#### Hướng xử lý
- cập nhật `last_read_at` cho participant hiện tại;
- không cần read receipt chi tiết theo từng tin nhắn.

### 10.7. `GET /conversations/:id/participants`

#### Mục đích
Lấy danh sách participant của conversation.

#### Rule chính
- chỉ participant mới được xem;
- với direct chat chỉ trả về danh sách tối giản;
- với group chat có thể trả avatar, tên, vai trò trong group theo mức cơ bản.

### 10.8. Yêu cầu kỹ thuật chung cho API

- mọi endpoint đều phải kiểm tra auth;
- mọi endpoint conversation detail đều phải kiểm tra membership;
- response format phải đồng nhất với các sprint trước;
- xử lý tốt các case:
  - conversation không tồn tại;
  - user không phải participant;
  - participant đã rời group;
  - guide/user bị khóa tài khoản;
  - companion post không hợp lệ cho group chat.

---

### 11. Công việc frontend

### 11.1. Xây dựng danh sách conversation

- dựng sidebar hoặc panel danh sách conversation;
- hiển thị title hoặc đối tác trò chuyện;
- hiển thị preview tin cuối;
- hiển thị thời gian gần nhất;
- trạng thái unread cơ bản.

### 11.2. Xây dựng M29

- layout chat 2 cột hoặc 3 vùng;
- header hiển thị thông tin guide/user đối thoại;
- message bubble rõ ràng;
- input gửi tin;
- loading, empty, error state.

### 11.3. Xây dựng M30

- layout tương tự M29 nhưng thêm danh sách thành viên;
- title nhóm theo companion post;
- hiển thị system message nếu có;
- link quay lại chi tiết bài đồng hành.

### 11.4. Tích hợp từ các màn hình nguồn

- từ **chi tiết tour** hoặc **hồ sơ guide** có nút mở direct chat;
- từ **khu vực companion post** có điểm vào group chat;
- điều hướng phải rõ, tránh tạo cảm giác chat bị “đứng riêng” ngoài nghiệp vụ.

### 11.5. Chuẩn hóa UI message

- bubble cho message của mình / của người khác;
- timestamp dễ đọc;
- trạng thái gửi cơ bản;
- danh sách dài phải scroll ổn định;
- không cần animation phức tạp.

### 11.6. Polling hoặc refetch

- refetch khi mở conversation;
- refetch theo khoảng thời gian phù hợp;
- refetch sau khi gửi message;
- tránh spam request quá dày.

### 11.7. Xử lý trường hợp rỗng và lỗi

- chưa có conversation nào;
- chưa có message nào;
- không đủ quyền vào conversation;
- participant không còn hợp lệ;
- lỗi gửi tin.

### 11.8. Kết quả mong đợi phía frontend

Kết thúc Sprint 12, frontend phải có:

- M29 chạy được với API thật;
- M30 chạy được với API thật;
- điểm vào chat từ các màn hình nghiệp vụ liên quan;
- danh sách conversation;
- khung chat hiển thị và gửi tin ổn định.

---

### 12. Công việc backend

### 12.1. Tổ chức module

Giữ chat trong module `chat-ai` hoặc tách service con rõ ràng:

- conversation service
- message service
- participant service

### 12.2. Xử lý logic direct conversation

- validate guide/user hợp lệ;
- kiểm tra conversation direct đã có chưa;
- nếu có thì trả conversation cũ;
- nếu chưa có thì tạo mới;
- thêm participant tương ứng.

### 12.3. Xử lý logic group companion conversation

- validate companion post;
- validate quyền của chủ bài hoặc logic khởi tạo;
- tạo conversation gắn `related_companion_post_id`;
- thêm chủ bài và participant approved;
- tránh tạo nhiều group conversation trùng cho một bài.

### 12.4. Xử lý logic lấy conversation list

- chỉ lấy conversation mà current user là participant;
- join dữ liệu message mới nhất;
- join participant rút gọn;
- sort theo hoạt động gần nhất.

### 12.5. Xử lý logic gửi message

- validate membership;
- sanitize nội dung;
- tạo message;
- cập nhật timestamp conversation;
- trả message mới để frontend append vào UI.

### 12.6. Xử lý logic read-state

- cập nhật `last_read_at`;
- tính unread ở mức cơ bản nếu cần;
- không làm receipt quá chi tiết.

### 12.7. Phân quyền và ownership

- direct chat: chỉ đúng participant mới đọc/ghi;
- group chat: chỉ chủ bài và thành viên approved mới đọc/ghi;
- participant có `left_at` cần được kiểm soát rõ quyền xem tiếp hay không.

### 12.8. Logging và đồng bộ với hệ thống hiện có

Nếu đủ thời gian, có thể bổ sung:

- ghi `user_activity_logs` khi mở conversation đầu tiên hoặc gửi tin đầu tiên;
- sinh `notifications` khi có tin nhắn mới ở mức cơ bản.

Tuy nhiên, đây chỉ là phần phụ trợ, không được làm chậm luồng chat chính.

### 12.9. Kết quả mong đợi phía backend

Kết thúc Sprint 12, backend phải có:

- API conversation list;
- API tạo direct/group conversation;
- API lấy messages;
- API gửi message;
- API read-state;
- API participants;
- kiểm tra quyền truy cập conversation ổn định.

---

### 13. Công việc database

### 13.1. Giữ nguyên schema 38 bảng làm chuẩn

Sprint 12 nên bám schema final đã chốt, đặc biệt là 3 bảng:

- `conversations`
- `conversation_participants`
- `messages`

### 13.2. Bổ sung index cần thiết

Nên rà soát và bổ sung index cho:

- `conversation_participants(user_id)`
- `messages(conversation_id, sent_at desc)`
- `conversations(related_companion_post_id)`
- `conversations(updated_at desc)` nếu cần list nhanh

### 13.3. Helper cập nhật `updated_at` cho conversation

Khi có message mới, nên có cơ chế:
- cập nhật `conversations.updated_at`;
- giúp list conversation sắp xếp đúng theo hoạt động gần nhất.

### 13.4. Seed dữ liệu direct chat

Chuẩn bị:
- 1–2 guide;
- 2–3 user;
- vài conversation direct;
- message cũ/mới xen kẽ;
- participant có `last_read_at` khác nhau.

### 13.5. Seed dữ liệu group chat

Chuẩn bị:
- 1 companion post;
- chủ bài;
- vài thành viên approved;
- 1 group conversation;
- nhiều message nhóm;
- vài system message nếu muốn trình bày đẹp hơn.

### 13.6. Rà soát relation với companion

Phải kiểm tra:
- `related_companion_post_id` đúng FK;
- participant group khớp dữ liệu approved trong `companion_requests`;
- không để group chat tồn tại với companion post đã bị xóa mềm/hủy mà không có rule rõ ràng.

### 13.7. Kết quả mong đợi phía database

Kết thúc Sprint 12, database phải có:

- schema chat ổn định;
- index đủ dùng;
- dữ liệu demo phong phú;
- helper/trigger cập nhật dữ liệu conversation hợp lý;
- relation với companion rõ ràng.

---

### 14. Tài liệu/UML

### 14.1. Tài liệu cần hoàn thiện

- mô tả chức năng chat trực tiếp;
- mô tả chức năng chat nhóm bài đồng hành;
- rule actor và quyền truy cập;
- mapping màn hình – API – bảng dữ liệu.

### 14.2. UML cần chốt trong Sprint 12

Tối thiểu nên cập nhật:

- **Activity Diagram – Chat trực tiếp user–guide**
- **Activity Diagram – Chat nhóm bài đồng hành**

Hai sơ đồ này là đủ quan trọng để đưa vào báo cáo và bám trực tiếp vào M29, M30.

### 14.3. Sequence Diagram nên bổ sung nếu còn thời gian

Nếu còn thời gian, nên bổ sung:

- **Sequence Diagram – Tạo direct conversation và gửi tin nhắn đầu tiên**
- **Sequence Diagram – Gửi message trong group companion chat**

Hai sequence này rất hợp với phần trình bày backend và logic kiểm tra quyền truy cập.

### 14.4. Mapping cần rà soát

- F19 ↔ M29 ↔ conversations / participants / messages
- F20 ↔ M30 ↔ conversations / participants / messages / companion_posts / companion_requests

### 14.5. Mục tiêu của phần tài liệu/UML

Phần tài liệu/UML phải làm rõ rằng:
- chat của hệ thống **bám vào nghiệp vụ hiện có**;
- không phải module chat độc lập tách rời hệ thống;
- direct chat phục vụ kết nối user–guide;
- group chat phục vụ cộng tác trong companion post;
- mọi actor, API và bảng dữ liệu đều có mối liên hệ rõ ràng.

---

### 15. Đầu ra

### 15.1. Đầu ra chức năng

- Có direct chat cơ bản giữa user và guide.
- Có group chat cơ bản cho bài đồng hành.
- Có read-state ở mức conversation.
- Có rule truy cập theo participant.

### 15.2. Đầu ra giao diện

- Có **M29** hoạt động với dữ liệu thật.
- Có **M30** hoạt động với dữ liệu thật.
- Có danh sách conversation và khung message đủ dùng để demo.

### 15.3. Đầu ra API

- `GET /conversations`
- `POST /conversations/direct`
- `POST /conversations/group-companion`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `PATCH /conversations/:id/read`
- `GET /conversations/:id/participants`

### 15.4. Đầu ra dữ liệu

- Có seed data cho direct chat;
- có seed data cho group chat;
- có unread/read state cơ bản;
- có relation conversation ↔ participant ↔ message rõ ràng.

### 15.5. Đầu ra tài liệu

- cập nhật mô tả Sprint 12;
- cập nhật Activity Diagram cho 2 luồng chat;
- cập nhật mapping API – màn hình – dữ liệu;
- bổ sung mô tả nghiệp vụ chat vào báo cáo nếu cần.

### 15.6. Tiêu chí sẵn sàng sang Sprint 13

Sprint 12 được coi là đủ tốt để sang Sprint 13 khi:

- chat module hoạt động ổn định ở mức cơ bản;
- không phụ thuộc realtime;
- dữ liệu demo đủ để trình bày;
- UI đủ trực quan;
- tài liệu/UML đã cập nhật;
- không còn lỗi phân quyền conversation nghiêm trọng.

---

### 16. Kết luận sprint

Sprint 12 là sprint mở rộng nhưng có giá trị trình bày rất cao. Nếu triển khai đúng hướng, đây sẽ là sprint giúp hệ thống trở nên “sống” hơn vì xuất hiện tương tác trực tiếp giữa các actor thay vì chỉ có form, request và dashboard.

Điểm quan trọng nhất của Sprint 12 không nằm ở việc làm chat thật nhiều tính năng, mà nằm ở việc **chốt đúng phạm vi**:

- chat có lưu hội thoại;
- direct chat user–guide;
- group chat bài đồng hành;
- participant rõ ràng;
- read-state cơ bản;
- chưa bắt buộc realtime;
- UI đủ đẹp để demo;
- logic đủ rõ để viết báo cáo.

Làm được như vậy là Sprint 12 đã hoàn thành đúng vai trò của nó: **tạo lớp giao tiếp mở rộng hợp lý, khả thi và thuyết phục**, đồng thời chuẩn bị nền tốt để bước sang Sprint 13.

---

<a id="sprint-13"></a>
## SPRINT 13 – Mở rộng giá trị trình bày: AI, gợi ý tour, lưu trú và thanh toán

### 1. Mục tiêu sprint

Sprint 13 là sprint mở rộng cuối cùng trước giai đoạn đóng gói bản cuối. Sau khi:

- Sprint 09 đã ổn định MVP lõi;
- Sprint 10 đã bổ sung favorite, review và verification;
- Sprint 11 đã làm hệ thống “đầy” hơn bằng map, activity log, notification và statistics;
- Sprint 12 đã thêm lớp giao tiếp cơ bản với chat trực tiếp và chat nhóm bài đồng hành;

thì Sprint 13 tập trung vào **nhóm chức năng mở rộng còn lại** để tạo điểm nhấn cho phần trình bày và bảo vệ đồ án.

Theo kế hoạch triển khai đã chốt, Sprint 13 không nhằm biến hệ thống thành một nền tảng thương mại điện tử hay AI đầy đủ, mà chỉ bổ sung những lớp chức năng có giá trị minh họa cao:

- **F21 – Gợi ý tour thông minh**
- **F22 – Chatbot AI tư vấn du lịch**
- **F23 – Liên kết dịch vụ lưu trú**
- **F24 – Thanh toán trực tuyến**

Các màn hình trọng tâm tương ứng là:

- **M12 – Gợi ý tour thông minh**
- **M13 – Chatbot AI tư vấn du lịch**
- **M14 – Liên kết dịch vụ lưu trú**
- **M22 – Thanh toán trực tuyến**

#### Mục tiêu chính

- Bổ sung cơ chế **gợi ý tour ở mức rule-based** dựa trên dữ liệu sở thích và một phần lịch sử hành vi của người dùng.
- Hoàn thiện **chatbot AI tư vấn du lịch** ở mức có phiên hội thoại, có lịch sử message, có thể gọi function nội bộ để lấy dữ liệu phù hợp và trả lời theo phạm vi an toàn của hệ thống.
- Hiển thị **nơi lưu trú liên quan đến tour** dưới dạng danh sách tham khảo, tạo chiều sâu cho trải nghiệm nhưng không mở rộng sang nghiệp vụ đặt phòng thật.
- Hoàn thiện **thanh toán trực tuyến ở mức sandbox / mock**, đủ để minh họa được flow thanh toán và trạng thái giao dịch, nhưng không kéo hệ thống sang bài toán payment production.
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** để nhóm chức năng mở rộng này khép kín và phục vụ tốt cho phần bảo vệ.
- Giữ đúng nguyên tắc của đồ án:
  - làm **đủ để trình bày**;
  - có **logic hợp lý**;
  - có **màn hình, API, dữ liệu demo**;
  - nhưng **không làm nặng phần lõi** đã hoàn thành ở các sprint trước.

#### Ý nghĩa của sprint này

Sprint 13 có giá trị lớn ở khía cạnh **trình bày định hướng phát triển**. Nếu Sprint 03–08 là phần “phải có để chứng minh hệ thống chạy được”, thì Sprint 13 là phần “làm sản phẩm trông có tầm nhìn hơn”.

Giá trị của sprint này nằm ở 4 điểm:

1. **Tăng cảm giác thông minh của hệ thống**  
   Sự xuất hiện của recommendation và chatbot AI giúp sản phẩm không còn chỉ là tập hợp các màn hình CRUD, mà giống một nền tảng có khả năng hỗ trợ người dùng ra quyết định.

2. **Tăng tính hoàn chỉnh của hệ sinh thái du lịch**  
   Khi có thêm accommodation và payment, hệ thống thể hiện được bức tranh rộng hơn của hành trình du lịch: tìm tour, tìm thông tin hỗ trợ, và mô phỏng bước thanh toán.

3. **Tăng điểm nhấn khi demo**  
   AI chat, gợi ý tour và thanh toán sandbox là những phần rất dễ tạo ấn tượng nếu triển khai gọn, đúng mức và có dữ liệu minh họa tốt.

4. **Giữ được tính khả thi của đồ án sinh viên**  
   Tài liệu đã chốt rõ đây là sprint mở rộng, nên mọi quyết định triển khai đều phải theo hướng **mô phỏng hợp lý**, tránh biến sprint này thành cụm tích hợp quá lớn.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Đây là sprint mở rộng, không được kéo chậm phần lõi

Sprint 13 nằm ở nhóm ưu tiên 3. Vì vậy, nguyên tắc bắt buộc là:

- phần lõi ở các sprint trước phải được giữ ổn định;
- nếu thiếu thời gian, phải ưu tiên mức **mô phỏng tốt** thay vì cố triển khai quá sâu;
- tuyệt đối không để AI, payment hoặc accommodation làm phát sinh quá nhiều refactor vào các module auth, tour request, admin hoặc companion đã ổn định.

### 2.2. AI chỉ đóng vai trò trợ lý tư vấn, không thay thế logic nghiệp vụ hệ thống

AI trong sprint này không được xem là một “AI agent” toàn quyền. Nó chỉ nên:

- tư vấn du lịch ở mức nội dung;
- giải thích thông tin tour;
- gợi ý điểm đến, loại tour, phong cách du lịch;
- kết hợp dữ liệu nội bộ khi cần thông qua function/API có kiểm soát.

AI **không được**:

- truy cập tự do database;
- tự thay đổi dữ liệu hệ thống;
- tự tạo yêu cầu tham gia tour;
- tự thanh toán;
- tự sinh hành động nghiệp vụ thay người dùng.

### 2.3. Recommendation chỉ nên ở mức rule-based

Tài liệu chốt đã xác định rõ: recommendation trong sprint này chỉ nên là **rule-based recommendation**, không triển khai machine learning phức tạp.

Điều đó có nghĩa:

- ưu tiên dựa trên `user_preferences`, `user_preferred_categories`;
- có thể tham khảo `user_activity_logs` để tăng độ hợp lý;
- sắp xếp theo điểm phù hợp đơn giản;
- không cần huấn luyện mô hình riêng;
- không cần lưu “embedding”, “vector search” hay pipeline phân tích nặng.

### 2.4. Accommodation chỉ ở mức liên kết / tham khảo

Sprint 13 chỉ nên làm:

- danh sách nơi lưu trú liên quan;
- thẻ accommodation gắn với tour;
- màn hình xem thông tin lưu trú.

Không nên làm:

- đặt phòng thật;
- quản lý booking accommodation;
- đồng bộ tồn kho;
- flow thanh toán cho accommodation riêng;
- chính sách hoàn phòng, hủy phòng.

### 2.5. Payment chỉ ở mức sandbox hoặc mock flow

Tài liệu chốt cho phép:

- **PayPal Sandbox + Orders API v2**, hoặc
- **mock flow nội bộ**.

Vì đây là đồ án sinh viên, hướng đi an toàn là:

- có thể chuẩn bị kiến trúc để nối cổng sandbox;
- nhưng vẫn cho phép fallback sang mock flow nếu phát sinh rủi ro tích hợp;
- chỉ cần minh họa rõ:
  - tạo giao dịch;
  - cập nhật trạng thái;
  - xác nhận thanh toán;
  - hiển thị lịch sử thanh toán của người dùng.

### 2.6. AI phải đi qua function hoặc API nội bộ

Điểm này rất quan trọng. AI không nên lấy dữ liệu “tự do” từ toàn hệ thống. Thay vào đó:

- backend chuẩn bị các function/API nội bộ như:
  - lấy danh sách tour phù hợp;
  - lấy chi tiết tour công khai;
  - lấy accommodation của tour;
  - lấy danh mục tỉnh/thành hoặc category nếu cần;
- lớp AI chỉ gọi đúng các function đã whitelist;
- mọi dữ liệu trả về cho AI đều phải được kiểm soát phạm vi.

### 2.7. Không nên biến Sprint 13 thành tích hợp AI quá phức tạp

Sprint này không nên làm:

- multi-agent;
- memory dài hạn phức tạp;
- prompt routing nhiều tầng;
- tool orchestration nâng cao;
- voice AI;
- AI streaming bắt buộc;
- personalization quá sâu theo lịch sử dài hạn.

Cách làm đúng là:

- 1 chatbot cơ bản;
- 1 flow recommendation đơn giản;
- 1 module accommodation nhẹ;
- 1 payment sandbox/mock rõ ràng.

### 2.8. Dữ liệu demo quyết định chất lượng của sprint này

Sprint 13 là sprint “điểm nhấn”. Nếu dữ liệu demo nghèo nàn, các màn hình AI/recommendation/payment sẽ rất dễ bị rỗng hoặc thiếu thuyết phục.

Cần chuẩn bị sẵn:

- user có sở thích du lịch khác nhau;
- category đa dạng;
- tour public đủ phong cách, tỉnh/thành, giá và thời gian;
- accommodation gắn với một số tour cụ thể;
- payment transaction đủ trạng thái minh họa;
- 1–2 session AI có lịch sử chat mẫu.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Vai trò chính thức của AI trong hệ thống là gì

Phải chốt rõ AI phục vụ mục đích nào:

- chatbot tư vấn du lịch;
- giải đáp câu hỏi về tour;
- hỗ trợ gợi ý tour cơ bản;
- giải thích lựa chọn phù hợp theo sở thích.

Không được để AI “phình vai trò” sang các nghiệp vụ cốt lõi như xử lý request, moderation hay payment authorization.

#### 3.2. AI sử dụng công nghệ nào

Cần chốt rõ:

- API nào dùng để gọi mô hình;
- mô hình mặc định là gì;
- backend gọi AI trực tiếp hay qua service riêng;
- có dùng streaming không;
- có lưu toàn bộ lịch sử vào `ai_chat_messages` không.

#### 3.3. AI được phép truy cập dữ liệu theo cơ chế nào

Cần chốt:

- AI chỉ được truy cập dữ liệu qua function nội bộ;
- function nào được mở cho AI;
- loại dữ liệu nào được phép đọc;
- loại dữ liệu nào bị cấm;
- có lọc theo public/private trước khi trả kết quả cho AI hay không.

#### 3.4. Recommendation sẽ tính theo logic nào

Phải xác định rõ input của recommendation:

- `user_preferences`;
- `user_preferred_categories`;
- `user_activity_logs` ở mức tham khảo;
- thông tin public của `tours`.

Cần chốt cách cho điểm:

- match category;
- match price range;
- match địa điểm quan tâm;
- match thời gian hoặc loại tour;
- loại bỏ tour không public, không published, hoặc guide/profile không phù hợp.

#### 3.5. Accommodation liên kết với tour theo mức nào

Cần quyết định:

- tour có thể gắn nhiều accommodation;
- accommodation chỉ hiển thị như gợi ý tham khảo;
- có màn hình list riêng và block hiển thị trong tour detail;
- có cho guide tự gắn accommodation vào tour hay chỉ seed sẵn để demo.

#### 3.6. Payment gắn với thực thể nào

Phải chốt payment trong sprint này gắn với:

- `tour_requests`;
- người dùng đã có yêu cầu tham gia tour;
- transaction chỉ đại diện cho bước thanh toán liên quan đến yêu cầu đó.

Như vậy flow sẽ rõ hơn so với việc cho thanh toán “mơ hồ” từ nhiều nguồn khác nhau.

#### 3.7. Trạng thái thanh toán được định nghĩa như thế nào

Phải chốt state machine tối thiểu cho `payment_transactions`, ví dụ:

- `pending`
- `authorized`
- `paid`
- `failed`
- `cancelled`
- `refunded` (nếu chỉ để dự phòng mở rộng, không bắt buộc dùng trong demo)

Nếu sprint chỉ làm sandbox/mock cơ bản, có thể dùng một tập trạng thái gọn hơn, miễn là nhất quán.

#### 3.8. Có cần tích hợp payment thật hay chỉ mock

Phải chốt ngay từ đầu:

- dùng PayPal Sandbox thật ở mức có thể demo được, hoặc
- fallback sang mock flow nội bộ.

Không nên để tới cuối sprint mới quyết định, vì phần UI, backend và trạng thái dữ liệu phụ thuộc trực tiếp vào lựa chọn này.

#### 3.9. Dữ liệu demo của AI và payment nên được chuẩn bị ra sao

Cần chuẩn bị:

- người dùng có preferences rõ ràng;
- một số category tour tiêu biểu;
- tour gắn accommodation;
- ít nhất một giao dịch thành công và một giao dịch thất bại / pending;
- ít nhất một phiên chat AI với nhiều message để màn hình không bị trống.

#### 3.10. UML nào cần cập nhật trong sprint này

Tài liệu đã định hướng cần hoàn thiện Activity Diagram cho:

- gợi ý tour;
- chatbot AI;
- xem lưu trú liên quan;
- thanh toán trực tuyến.

Ngoài ra, nếu còn thời gian có thể bổ sung:

- sequence cho AI chat;
- sequence cho payment sandbox;
- class diagram ở mức service boundary cho recommendation / payment.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục chiến lược mở rộng

- Sprint 13 là sprint mở rộng, không được đụng sâu phần lõi.
- Mọi module ở sprint này phải có thể “cắt gọn” nếu thiếu thời gian.
- Mục tiêu ưu tiên là **trình bày tốt**, không phải “production hóa” toàn bộ.

#### 4.2. Hạng mục AI

- Vai trò AI.
- API gọi AI.
- Model mặc định.
- Prompt nền của chatbot.
- Danh sách function nội bộ được phép gọi.
- Quy tắc chặn truy cập dữ liệu nhạy cảm.
- Chính sách log message.

#### 4.3. Hạng mục recommendation

- Dữ liệu đầu vào.
- Công thức chấm điểm.
- Điều kiện loại trừ tour.
- Thứ tự ưu tiên giữa category, price, location và hành vi.
- Có lưu lịch sử recommendation hay không.

#### 4.4. Hạng mục accommodation

- Accommodation list là public hay theo tour.
- Cách liên kết tour – accommodation.
- Dữ liệu tối thiểu của accommodation.
- Có hiển thị link ngoài hay chỉ hiển thị thông tin mô phỏng.
- Có cho quản trị chỉnh dữ liệu accommodation hay chỉ seed demo.

#### 4.5. Hạng mục payment

- Payment provider.
- Kiểu giao dịch sandbox/mock.
- Mã giao dịch.
- State machine.
- Mối liên hệ với `tour_requests`.
- Màn hình lịch sử thanh toán.
- Cách xác nhận thanh toán thành công / thất bại.

#### 4.6. Hạng mục frontend

- Bố cục M12, M13, M14, M22.
- Cách điều hướng từ tour detail sang accommodation/payment.
- Cách hiển thị AI chat session.
- Thành phần reuse cho payment status, recommendation card, accommodation card.

#### 4.7. Hạng mục backend

- Chia module recommendation, ai-chat, accommodations, payments.
- Validation dữ liệu đầu vào.
- Rule truy cập dữ liệu public.
- Chuẩn response cho AI chat và payment.
- Logging cho transaction và AI request.

#### 4.8. Hạng mục database

- Chuẩn hóa dữ liệu preferences.
- Seed category, preferences, accommodation, payment.
- Index cho session, message, transaction.
- Ràng buộc khóa ngoại cho payment và accommodation.
- Chuẩn hóa miền giá trị trạng thái.

#### 4.9. Hạng mục tài liệu/UML

- Activity Diagram.
- Cập nhật mô tả màn hình M12, M13, M14, M22.
- Cập nhật phần định hướng mở rộng trong báo cáo.
- Cập nhật mapping function – screen – API – table.

---

### 5. Phương án được chọn

### 5.1. Chiến lược tổng thể được chọn

Sprint 13 được triển khai theo nguyên tắc:

- **làm đủ 4 điểm nhấn mở rộng**;
- mỗi điểm nhấn đều có:
  - dữ liệu,
  - API,
  - UI,
  - demo flow;
- nhưng tất cả chỉ ở **mức phù hợp với đồ án sinh viên**.

Nói cách khác, đây là sprint của **giá trị trình bày cao – độ phức tạp được kiểm soát**.

### 5.2. Vai trò AI được chọn

AI chỉ đóng vai trò:

- chatbot tư vấn du lịch;
- hỗ trợ hỏi đáp về thông tin tour, loại tour, vùng du lịch;
- hỗ trợ gợi ý tour cơ bản.

AI **không** giữ vai trò xử lý nghiệp vụ thay người dùng.

### 5.3. Công nghệ AI được chọn

Theo tài liệu chốt:

- dùng **OpenAI Responses API**;
- model mặc định là **gpt-5.4-mini**.

Trong phần hiện thực backend, nên bọc lớp gọi AI vào một `AiChatService` riêng để:

- dễ thay model;
- dễ thay provider;
- dễ kiểm soát prompt và tool;
- dễ log.

### 5.4. Cơ chế truy cập dữ liệu của AI được chọn

AI chỉ được truy cập dữ liệu thông qua:

- function nội bộ đã whitelist;
- dữ liệu public hoặc dữ liệu thuộc user hiện tại nếu hợp lệ;
- lớp service đã kiểm soát quyền truy cập.

Điều này giúp:

- tránh lộ dữ liệu;
- giữ cho AI không “đi vượt” nghiệp vụ của hệ thống;
- khiến phần báo cáo thiết kế an toàn và hợp lý hơn.

### 5.5. Cách làm recommendation được chọn

Recommendation được làm ở mức **rule-based**.

Đầu vào ưu tiên:

- `user_preferences`
- `user_preferred_categories`
- `user_activity_logs` ở mức tham khảo
- dữ liệu public của `tours`, `tour_categories`

Hướng tính điểm đề xuất:

- cộng điểm nếu category trùng sở thích;
- cộng điểm nếu địa điểm nằm trong nhóm user quan tâm;
- cộng điểm nếu mức giá phù hợp;
- cộng điểm nếu thời gian hoặc phong cách tour phù hợp;
- trừ hoặc loại nếu tour không còn public/published.

Kết quả trả về:

- danh sách tour đã xếp hạng;
- có thể kèm theo một trường `match_reasons` để giải thích tại sao tour được gợi ý.

### 5.6. Mức độ accommodation được chọn

Accommodation chỉ ở mức:

- hiển thị danh sách nơi lưu trú liên quan;
- gắn với tour qua `tour_accommodations`;
- cho người dùng xem thông tin tham khảo.

Không triển khai:

- đặt phòng;
- booking;
- thanh toán accommodation;
- quản lý tồn kho;
- đồng bộ đối tác thật.

### 5.7. Giải pháp payment được chọn

Giải pháp chốt là:

- **PayPal Sandbox + Orders API v2**, hoặc
- **mock flow nội bộ** nếu cần giảm rủi ro.

Trong tài liệu sprint nên mô tả theo hướng:

- kiến trúc ưu tiên hỗ trợ sandbox;
- triển khai thực tế có thể dùng mock flow nếu mục tiêu là bảo vệ đồ án ổn định hơn.

### 5.8. Phạm vi payment được chọn

Payment chỉ phục vụ minh họa cho:

- tạo giao dịch thanh toán của một `tour_request`;
- xem thông tin giao dịch;
- xác nhận thanh toán;
- xem lịch sử thanh toán của user.

Không triển khai:

- hoàn tiền thật;
- webhook production;
- đối soát;
- đa cổng thanh toán;
- hệ thống hóa đơn hoàn chỉnh.

### 5.9. Hướng tổ chức module backend được chọn

Nên chia thành 4 module mở rộng:

- `recommendations`
- `ai-chat`
- `accommodations`
- `payments`

Cách chia này giúp:

- mỗi phần có controller/service riêng;
- dễ cô lập lỗi;
- dễ mô tả trong báo cáo;
- dễ test và dễ bỏ bớt nếu cần.

### 5.10. Hướng dữ liệu demo được chọn

Chuẩn bị tối thiểu:

- 2–3 user có sở thích du lịch khác nhau;
- 5–10 tour có category, giá và tỉnh/thành khác nhau;
- 3–5 accommodation gắn với một số tour;
- 2–3 payment transaction với các trạng thái khác nhau;
- 1–2 session AI với lịch sử message.

---

### 6. Ghi chú triển khai

#### 6.1. Thứ tự triển khai nên làm

Thứ tự hợp lý:

1. Chuẩn hóa database cho preferences, AI chat, accommodation, payment.
2. Seed dữ liệu demo.
3. Hoàn thiện recommendation API.
4. Hoàn thiện accommodation API.
5. Hoàn thiện payment mock/sandbox API.
6. Hoàn thiện AI chat API.
7. Làm frontend cho M12, M14, M22.
8. Làm frontend cho M13.
9. Kiểm thử end-to-end và cập nhật UML.

Lý do là:

- recommendation, accommodation, payment phụ thuộc mạnh vào dữ liệu demo;
- AI chat nên làm sau khi đã có dữ liệu và function nội bộ để gọi.

#### 6.2. Không biến M12 thành hệ thống đề xuất quá phức tạp

M12 chỉ cần:

- hiển thị danh sách tour gợi ý;
- có lý do gợi ý ở mức ngắn;
- có filter hoặc chip giải thích;
- có CTA đi tới chi tiết tour.

Không cần:

- mô hình học máy;
- gợi ý thời gian thực;
- A/B test;
- ranking phức tạp nhiều tầng.

#### 6.3. Không biến M13 thành “agent đa năng”

M13 nên là chatbot tư vấn du lịch gọn, rõ:

- khung chat;
- session list;
- message history;
- ô nhập câu hỏi;
- gợi ý prompt mẫu;
- một số tool nội bộ như tìm tour phù hợp hoặc lấy chi tiết tour public.

Không nên mở rộng:

- tạo task tự động;
- thay đổi dữ liệu hệ thống;
- ghi nhớ dài hạn quá sâu;
- truy cập dữ liệu quản trị.

#### 6.4. Không biến M14 thành marketplace lưu trú

M14 chỉ là màn hình **liên kết dịch vụ lưu trú**. Vì vậy:

- chỉ cần list card accommodation;
- có ảnh, tên, địa chỉ/khu vực, mô tả ngắn, mức giá tham khảo, liên hệ hoặc link ngoài;
- có thể hiển thị theo ngữ cảnh tour hoặc dạng danh sách tổng.

Không cần:

- phân trang quá phức tạp;
- so sánh chi tiết;
- booking;
- checkout accommodation.

#### 6.5. Không biến M22 thành hệ thống thanh toán production

M22 chỉ cần mô phỏng rõ flow:

- chọn thanh toán;
- tạo giao dịch;
- chờ xác nhận;
- thành công/thất bại;
- xem lịch sử thanh toán.

Không nên làm:

- nhiều provider thật;
- retry logic phức tạp;
- webhook nhiều trạng thái;
- hoàn tiền thật;
- bảo mật production-grade ở mức quá sâu so với đồ án.

#### 6.6. AI prompt và tool phải được kiểm soát

Ở tầng backend cần có:

- system prompt giới hạn phạm vi trả lời;
- danh sách function được gọi rõ ràng;
- validation trước khi gọi function;
- log request/response ở mức phù hợp;
- chặn câu trả lời “bịa” liên quan đến dữ liệu không có trong hệ thống.

#### 6.7. Quy tắc “xong sprint”

Sprint 13 chỉ được xem là hoàn thành khi đạt đủ:

- có dữ liệu preferences, AI chat, accommodation, payment;
- có API recommendation, AI chat, accommodation, payment chạy được;
- có màn hình M12, M13, M14, M22 nối API;
- có dữ liệu demo dùng được để trình bày;
- có Activity Diagram cho 4 luồng chính;
- có ít nhất 1 script demo ngắn cho từng nhóm chức năng.

#### 6.8. Dữ liệu demo nên chuẩn bị

Nên có các mẫu sau:

- user thích tour văn hóa, ngân sách trung bình;
- user thích tour thiên nhiên, ngân sách thấp;
- một tour biển có accommodation gần điểm hẹn;
- một tour miền núi không có accommodation để minh họa trường hợp rỗng;
- một payment pending;
- một payment paid;
- một payment failed;
- một AI session hỏi “tour phù hợp với ngân sách 2 triệu ở Đà Lạt”;
- một AI session hỏi “tour nào phù hợp đi cuối tuần”.

---

### 7. Chức năng trọng tâm

#### F21. Gợi ý tour thông minh

##### Mục tiêu
Giúp người dùng nhận được danh sách tour phù hợp hơn thay vì chỉ tự tìm kiếm thủ công.

##### Actor chính
- User đã đăng nhập

##### Dữ liệu chính
- `user_preferences`
- `user_preferred_categories`
- `user_activity_logs`
- `tours`
- `tour_categories`

##### Kết quả đầu ra
- danh sách tour gợi ý đã được xếp hạng;
- lý do gợi ý ngắn gọn;
- liên kết sang màn hình chi tiết tour.

##### Mức độ triển khai phù hợp
- rule-based;
- không dùng ML phức tạp;
- không cần cá nhân hóa sâu thời gian thực.

#### F22. Chatbot AI tư vấn du lịch

##### Mục tiêu
Cho phép người dùng đặt câu hỏi tự nhiên về du lịch, tour hoặc tư vấn định hướng chuyến đi.

##### Actor chính
- User đã đăng nhập
- Có thể mở rộng cho guest ở giai đoạn sau, nhưng Sprint 13 nên ưu tiên user đã đăng nhập

##### Dữ liệu chính
- `ai_chat_sessions`
- `ai_chat_messages`
- dữ liệu tour/accommodation public thông qua function nội bộ

##### Kết quả đầu ra
- session chat;
- lịch sử trao đổi;
- câu trả lời AI có kiểm soát;
- khả năng gọi tool nội bộ ở mức cơ bản.

##### Mức độ triển khai phù hợp
- text chat;
- 1 session nhiều message;
- không cần voice, file, memory nâng cao.

#### F23. Liên kết dịch vụ lưu trú

##### Mục tiêu
Hiển thị nơi lưu trú liên quan đến tour hoặc danh sách lưu trú đối tác để làm trải nghiệm phong phú hơn.

##### Actor chính
- Guest
- User
- Guide
- Admin có thể xem khi test/demo

##### Dữ liệu chính
- `partner_accommodations`
- `tour_accommodations`
- `tours`

##### Kết quả đầu ra
- danh sách accommodation liên quan;
- card thông tin accommodation;
- liên kết từ tour sang accommodation phù hợp.

##### Mức độ triển khai phù hợp
- hiển thị thông tin;
- không đặt phòng thật.

#### F24. Thanh toán trực tuyến

##### Mục tiêu
Mô phỏng hoặc sandbox hóa bước thanh toán cho yêu cầu tham gia tour.

##### Actor chính
- User
- Có thể có admin xem lịch sử khi kiểm tra dữ liệu, nhưng không phải actor thao tác chính

##### Dữ liệu chính
- `payment_transactions`
- `tour_requests`
- `users`

##### Kết quả đầu ra
- giao dịch mới;
- cập nhật trạng thái;
- lịch sử giao dịch theo user;
- màn hình thanh toán và kết quả thanh toán.

##### Mức độ triển khai phù hợp
- sandbox/mock;
- không production.

#### Kết luận cho nhóm chức năng

Bốn chức năng trong Sprint 13 không nằm ở lớp bắt buộc của MVP lõi, nhưng lại có giá trị rất cao khi:

- làm báo cáo;
- làm demo;
- trình bày định hướng phát triển;
- tạo cảm giác hệ thống có tầm nhìn sản phẩm rõ ràng.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình

Các màn hình trong Sprint 13 cần đạt 3 tiêu chí:

- dễ hiểu với hội đồng;
- có dữ liệu demo minh họa;
- nối được với các màn hình đã có trước đó.

### 8.2. M12 – Gợi ý tour thông minh

#### Thành phần chính nên có

- tiêu đề giới thiệu khu vực gợi ý;
- block mô tả “gợi ý dựa trên sở thích / hành vi”;
- chip hoặc tag thể hiện lý do gợi ý;
- danh sách card tour;
- bộ lọc nhẹ nếu cần;
- empty state khi chưa có preferences.

#### Hành vi chính

- lấy preferences của user hiện tại;
- gọi `GET /recommendations/tours`;
- render danh sách gợi ý theo điểm phù hợp;
- click vào card để đi tới chi tiết tour.

#### Điều cần tránh

- không biến M12 thành một trang tìm kiếm đầy đủ thay cho M05;
- không nhồi quá nhiều điều kiện lọc;
- không giải thích thuật toán quá phức tạp trên UI.

### 8.3. M13 – Chatbot AI tư vấn du lịch

#### Thành phần chính nên có

- sidebar hoặc dropdown chọn session;
- vùng hiển thị message history;
- ô nhập prompt;
- nút gửi;
- prompt mẫu;
- trạng thái loading / đang trả lời;
- cảnh báo phạm vi sử dụng nếu cần.

#### Hành vi chính

- tạo session mới;
- tải lịch sử của session;
- gửi message mới;
- nhận trả lời AI;
- lưu message vào lịch sử.

#### Điều cần tránh

- không để AI trả lời kiểu “toàn tri” không kiểm soát;
- không cho AI truy cập dữ liệu riêng tư;
- không bắt buộc streaming nếu chưa ổn định.

### 8.4. M14 – Liên kết dịch vụ lưu trú

#### Thành phần chính nên có

- danh sách accommodation;
- card ảnh / tên / khu vực / mô tả ngắn;
- mức giá tham khảo;
- chỉ dẫn liên quan đến tour;
- empty state khi tour chưa có accommodation liên kết.

#### Hành vi chính

- lấy accommodation theo tour hoặc list tổng;
- hiển thị thông tin tham khảo;
- điều hướng từ chi tiết tour sang khu vực accommodation.

#### Điều cần tránh

- không biến thành trang booking;
- không làm quy trình đặt phòng;
- không cần form thanh toán lưu trú.

### 8.5. M22 – Thanh toán trực tuyến

#### Thành phần chính nên có

- thông tin tour request liên quan;
- tổng tiền / số lượng / mô tả giao dịch;
- trạng thái thanh toán;
- nút tạo thanh toán;
- nút xác nhận mô phỏng hoặc quay lại provider sandbox;
- khu vực hiển thị kết quả thành công / thất bại;
- lịch sử thanh toán của user.

#### Hành vi chính

- tạo payment transaction;
- điều hướng / mô phỏng bước thanh toán;
- cập nhật trạng thái;
- hiển thị lịch sử giao dịch theo user.

#### Điều cần tránh

- không mô phỏng nhiều provider;
- không làm flow checkout quá dài;
- không làm luồng refund thật.

#### Kết luận cho phần màn hình

Bốn màn hình của Sprint 13 nên được dựng theo hướng:

- rõ chức năng;
- ngắn gọn;
- có dữ liệu đẹp để demo;
- gắn chặt với các luồng tour / user / recommendation đã có.

---

### 9. Bảng CSDL chính

### 9.1. Mục tiêu của phần dữ liệu

Phần dữ liệu trong Sprint 13 cần phục vụ đủ cho:

- recommendation;
- AI chat;
- accommodation;
- payment.

Không cần mở thêm quá nhiều bảng mới ngoài những bảng đã có trong schema final.

### 9.2. `user_preferences`

#### Vai trò
Lưu hồ sơ sở thích du lịch của user.

#### Dùng cho
- recommendation;
- giải thích vì sao tour được gợi ý;
- đầu vào cho AI nếu cần cá nhân hóa ở mức nhẹ.

#### Dữ liệu nên có
- khoảng ngân sách ưa thích;
- khu vực / tỉnh thành quan tâm;
- loại hình du lịch;
- thời lượng ưa thích;
- style du lịch (nghỉ dưỡng, khám phá, văn hóa, thiên nhiên...).

### 9.3. `user_preferred_categories`

#### Vai trò
Lưu quan hệ nhiều – nhiều giữa user và các category tour ưa thích.

#### Dùng cho
- chấm điểm recommendation;
- lọc tour theo nhóm yêu thích;
- thống nhất với `tour_categories`.

### 9.4. `ai_chat_sessions`

#### Vai trò
Lưu phiên hội thoại AI của user.

#### Dùng cho
- danh sách session;
- mở lại lịch sử chat;
- đóng / tiếp tục session.

#### Gợi ý vận hành
- mỗi session thuộc về một user;
- có `started_at`, `closed_at`, `status` nếu schema hỗ trợ;
- có thể lưu `title` ngắn do hệ thống sinh ra.

### 9.5. `ai_chat_messages`

#### Vai trò
Lưu message trong từng AI session.

#### Dùng cho
- render lịch sử hội thoại;
- kiểm tra prompt / response đã trao đổi;
- phân tích flow demo.

#### Gợi ý vận hành
- cần phân biệt message của user và assistant;
- nên có thời gian tạo;
- có thể có trường metadata/tool_call nếu muốn mở rộng về sau, nhưng Sprint 13 không bắt buộc.

### 9.6. `partner_accommodations`

#### Vai trò
Lưu danh sách nơi lưu trú đối tác / tham khảo.

#### Dùng cho
- M14;
- hiển thị thông tin accommodation theo tour;
- làm dữ liệu minh họa hệ sinh thái du lịch.

#### Dữ liệu nên có
- tên accommodation;
- mô tả;
- địa chỉ / khu vực;
- giá tham khảo;
- ảnh;
- liên hệ hoặc link ngoài;
- trạng thái active.

### 9.7. `tour_accommodations`

#### Vai trò
Liên kết nhiều – nhiều giữa tour và accommodation.

#### Dùng cho
- lấy danh sách accommodation liên quan của tour;
- block accommodation trong chi tiết tour hoặc trang accommodation.

### 9.8. `payment_transactions`

#### Vai trò
Lưu giao dịch thanh toán liên quan đến `tour_requests`.

#### Dùng cho
- tạo giao dịch;
- xác nhận thanh toán;
- xem lịch sử payment của user;
- hiển thị payment status.

#### Dữ liệu nên chuẩn hóa
- transaction code;
- amount;
- currency;
- status;
- payment provider;
- created_at / updated_at;
- reference tới `tour_request_id` và `user_id`.

#### Kết luận cho phần dữ liệu

Nhóm bảng của Sprint 13 không nhiều, nhưng là nhóm bảng “rất dễ lỏng logic” nếu không chốt phạm vi từ đầu. Vì vậy cần ưu tiên:

- đơn giản hóa;
- dữ liệu demo đẹp;
- relation rõ ràng;
- trạng thái nhất quán.

---

### 10. API cần thiết

### 10.1. Nhóm preferences / recommendation

#### `GET /me/preferences`
Mục đích:

- lấy hồ sơ sở thích hiện tại của user;
- phục vụ M12 và các form chỉnh sở thích.

#### `PUT /me/preferences`
Mục đích:

- cập nhật sở thích tổng quát của user.

#### `PUT /me/preferred-categories`
Mục đích:

- cập nhật danh sách category ưa thích.

#### `GET /recommendations/tours`
Mục đích:

- trả về danh sách tour gợi ý cho user;
- có thể kèm điểm và lý do gợi ý.

### 10.2. Nhóm AI chat

#### `GET /ai-chat/sessions`
Mục đích:

- lấy danh sách session của user.

#### `POST /ai-chat/sessions`
Mục đích:

- tạo phiên chat mới.

#### `GET /ai-chat/sessions/:id/messages`
Mục đích:

- lấy lịch sử message của một session.

#### `POST /ai-chat/sessions/:id/messages`
Mục đích:

- gửi câu hỏi mới;
- lưu message của user;
- gọi AI;
- lưu câu trả lời của assistant;
- trả kết quả cho frontend.

#### `PATCH /ai-chat/sessions/:id/close` *(nếu dùng theo mapping mở rộng)*
Mục đích:

- đóng session;
- giúp UI quản lý hội thoại rõ hơn.

### 10.3. Nhóm accommodation

#### `GET /tours/:id/accommodations`
Mục đích:

- lấy accommodation liên quan của một tour.

#### `GET /accommodations`
Mục đích:

- lấy danh sách accommodation tổng;
- phục vụ M14 nếu dựng theo dạng list riêng.

#### `PUT /tours/:id/accommodations` *(nếu bật cho guide/admin ở mức seed quản lý)*
Mục đích:

- gắn accommodation cho tour;
- không bắt buộc mở trên UI public trong sprint này.

### 10.4. Nhóm payment

#### `POST /payments`
Mục đích:

- tạo giao dịch thanh toán mới cho một `tour_request`.

#### `GET /payments/:id`
Mục đích:

- lấy chi tiết giao dịch.

#### `POST /payments/:id/confirm`
Mục đích:

- xác nhận kết quả thanh toán sandbox/mock.

#### `GET /me/payments`
Mục đích:

- lấy lịch sử thanh toán của user hiện tại.

#### Kết luận cho phần API

API của Sprint 13 nên rõ, ít nhưng đủ dùng. Quan trọng nhất là:

- dễ nối màn hình;
- dễ test;
- dễ giải thích trong báo cáo;
- không phát sinh quá nhiều nhánh phụ.

---

### 11. Công việc frontend

### 11.1. Mục tiêu tổng thể của frontend sprint này

Frontend cần thể hiện được rằng hệ thống không chỉ có các luồng lõi, mà còn có:

- lớp cá nhân hóa;
- lớp hỗ trợ AI;
- lớp dịch vụ liên kết;
- lớp mô phỏng thanh toán.

### 11.2. Công việc cho M12 – Gợi ý tour

- dựng giao diện khu vực gợi ý tour;
- gọi API `GET /me/preferences` và `GET /recommendations/tours`;
- hiển thị tour card, match reason, badge category, giá, địa điểm;
- xử lý empty state khi user chưa khai báo sở thích;
- thêm CTA sang chi tiết tour hoặc trang cập nhật sở thích.

### 11.3. Công việc cho M13 – Chatbot AI

- dựng layout chat gồm session list + message panel;
- tạo session mới;
- load message history;
- gửi prompt mới;
- hiển thị assistant message;
- xử lý loading, error, retry;
- thêm prompt suggestion để demo nhanh.

### 11.4. Công việc cho M14 – Accommodation

- dựng danh sách accommodation card;
- hỗ trợ hiển thị theo tour hoặc list riêng;
- hiển thị thông tin tham khảo rõ ràng;
- xử lý empty state;
- thêm liên kết từ tour detail nếu muốn giữ flow liền mạch.

### 11.5. Công việc cho M22 – Payment

- dựng giao diện tóm tắt giao dịch;
- form / nút tạo payment;
- trạng thái pending / paid / failed;
- màn hình hoặc dialog kết quả;
- lịch sử thanh toán của user;
- xử lý sandbox/mock redirect hoặc confirm result.

### 11.6. Component dùng chung nên bổ sung

- `RecommendationCard`
- `MatchReasonChip`
- `AiMessageBubble`
- `AiSessionList`
- `AccommodationCard`
- `PaymentStatusBadge`
- `PaymentSummaryPanel`
- `EmptyState`
- `LoadingPanel`

### 11.7. Kiểm thử frontend nên có

- user có preferences và không có preferences;
- AI chat session mới / session cũ;
- tour có accommodation / không có accommodation;
- payment pending / success / fail;
- responsive cơ bản cho 4 màn hình.

---

### 12. Công việc backend

### 12.1. Mục tiêu tổng thể của backend sprint này

Backend cần bảo đảm 4 điều:

- recommendation hợp lý;
- AI chat có kiểm soát;
- accommodation query rõ ràng;
- payment sandbox/mock nhất quán.

### 12.2. Module recommendation

- xây service đọc `user_preferences`, `user_preferred_categories`, `user_activity_logs`;
- lấy danh sách `tours` public/published hợp lệ;
- chấm điểm rule-based;
- sắp xếp kết quả;
- trả thêm lý do gợi ý;
- log request nhẹ nếu cần.

### 12.3. Module AI chat

- tạo session;
- lấy lịch sử session;
- lưu message user;
- gọi OpenAI Responses API qua service riêng;
- cho AI gọi function nội bộ đã whitelist;
- lưu assistant response;
- kiểm soát lỗi, timeout, fallback.

### 12.4. Module accommodations

- truy vấn accommodation theo tour;
- truy vấn list accommodation tổng;
- filter accommodation active;
- join với `tour_accommodations`;
- chuẩn hóa response card-friendly cho frontend.

### 12.5. Module payments

- tạo payment transaction;
- sinh transaction code;
- gắn transaction với `tour_request_id` và `user_id`;
- cập nhật trạng thái payment;
- trả về response để frontend mô phỏng thanh toán;
- hỗ trợ confirm flow;
- lấy lịch sử thanh toán theo user.

### 12.6. Validation và permission

- recommendation chỉ cho user hợp lệ;
- AI chat chỉ cho chủ session truy cập;
- payment chỉ cho user là chủ của `tour_request`;
- accommodation public chỉ trả về dữ liệu được phép hiển thị;
- không để AI gọi dữ liệu private hoặc admin-only.

### 12.7. Logging và error handling

- log payment transaction ở mức đủ tra cứu;
- log AI call theo session/message;
- bắt lỗi provider hoặc mock flow;
- chuẩn hóa mã lỗi cho frontend hiển thị.

---

### 13. Công việc database

### 13.1. Mục tiêu tổng thể của database sprint này

Database trong Sprint 13 phải bảo đảm:

- đủ dữ liệu để demo recommendation;
- đủ lịch sử để demo AI chat;
- đủ liên kết để demo accommodation;
- đủ transaction để demo payment.

### 13.2. Chuẩn hóa dữ liệu preferences

- kiểm tra cấu trúc `user_preferences`;
- chuẩn hóa miền giá trị phù hợp với logic recommendation;
- seed dữ liệu cho nhiều kiểu user khác nhau;
- gắn `user_preferred_categories` hợp lý.

### 13.3. Chuẩn bị dữ liệu AI chat

- seed 1–2 `ai_chat_sessions`;
- seed `ai_chat_messages` mẫu;
- thêm index cho session/message nếu cần;
- kiểm tra quan hệ `session -> messages`.

### 13.4. Chuẩn bị dữ liệu accommodation

- seed `partner_accommodations`;
- seed `tour_accommodations`;
- bảo đảm tour demo có ít nhất một số liên kết accommodation;
- chuẩn hóa giá tham khảo, khu vực và mô tả.

### 13.5. Chuẩn bị dữ liệu payment

- seed `payment_transactions`;
- chuẩn hóa `transaction_code`;
- chuẩn hóa `status`;
- bảo đảm liên kết với `tour_requests` hợp lệ;
- có dữ liệu cho success / fail / pending.

### 13.6. Index và tối ưu cơ bản

Nên cân nhắc index cho:

- `ai_chat_sessions.user_id`
- `ai_chat_messages.session_id`
- `payment_transactions.user_id`
- `payment_transactions.tour_request_id`
- `tour_accommodations.tour_id`

### 13.7. Kiểm tra toàn vẹn dữ liệu

- foreign key của payment phải đúng với `tour_requests` và `users`;
- foreign key của AI session/message phải đúng;
- foreign key của accommodation relation phải đúng;
- dữ liệu seed không được tạo bản ghi mồ côi;
- transaction code không được trùng.

---

### 14. Tài liệu/UML

### 14.1. Activity Diagram cần hoàn thiện

Cần hoàn thiện Activity Diagram cho 4 luồng:

- gợi ý tour;
- chatbot AI;
- xem lưu trú liên quan;
- thanh toán trực tuyến.

### 14.2. Mô tả báo cáo cần cập nhật

- mô tả chức năng F21–F24;
- mô tả các màn hình M12, M13, M14, M22;
- cập nhật mapping giữa bảng – màn hình – API;
- cập nhật phần định hướng phát triển mở rộng.

### 14.3. Sequence Diagram có thể bổ sung nếu còn thời gian

Ưu tiên bổ sung:

- sequence “User hỏi chatbot AI”;
- sequence “User tạo payment transaction và xác nhận thanh toán”;
- sequence “User lấy recommendation”.

### 14.4. Nội dung cần nhấn mạnh khi viết báo cáo

Khi đưa Sprint 13 vào báo cáo, nên nhấn mạnh:

- đây là nhóm chức năng mở rộng;
- hệ thống triển khai ở mức phù hợp với đồ án;
- recommendation là rule-based;
- AI có kiểm soát truy cập dữ liệu;
- accommodation chỉ là liên kết tham khảo;
- payment ở mức sandbox/mock.

---

### 15. Đầu ra

Kết thúc Sprint 13, hệ thống cần đạt được các đầu ra sau:

#### 15.1. Về chức năng

- có recommendation tour cơ bản;
- có chatbot AI tư vấn du lịch;
- có accommodation list liên quan đến tour;
- có payment flow ở mức sandbox/mock.

#### 15.2. Về màn hình

- M12 chạy được với dữ liệu demo;
- M13 chat được với session/message;
- M14 hiển thị accommodation hợp lý;
- M22 mô phỏng được luồng thanh toán.

#### 15.3. Về API

- API preferences / recommendation chạy được;
- API AI session/message chạy được;
- API accommodations chạy được;
- API payments chạy được.

#### 15.4. Về dữ liệu

- có seed preferences;
- có seed AI chat;
- có seed accommodation;
- có seed payment transaction.

#### 15.5. Về tài liệu

- Activity Diagram cho 4 luồng đã cập nhật;
- mô tả màn hình và chức năng đã cập nhật;
- phần định hướng mở rộng trong báo cáo đã hoàn thiện hơn.

#### 15.6. Về giá trị bảo vệ đồ án

Sau Sprint 13, hệ thống có đầy đủ các nhóm chức năng mở rộng quan trọng để:

- tăng chất lượng trình bày;
- tạo điểm nhấn công nghệ;
- chứng minh tầm nhìn phát triển sản phẩm;
- nhưng vẫn giữ được tính khả thi và tính hợp lý của đồ án sinh viên.

#### 15.7. Định nghĩa “xong sprint”

Sprint 13 chỉ nên được xem là hoàn tất khi:

- có đủ 4 nhóm chức năng mở rộng hoạt động ở mức demo được;
- có dữ liệu demo thuyết phục;
- có UI nối API;
- có trạng thái payment rõ;
- có AI session/message rõ;
- có recommendation logic giải thích được;
- có cập nhật UML/tài liệu đi kèm.

---

### Kết luận

Sprint 13 là sprint “điểm nhấn” của giai đoạn mở rộng. Nó không nhằm thay đổi cấu trúc hệ thống lõi, mà nhằm làm cho đồ án:

- hiện đại hơn;
- có chiều sâu hơn;
- dễ trình bày hơn;
- và có câu chuyện phát triển sản phẩm rõ hơn.

Nếu triển khai đúng tinh thần tài liệu đã chốt, Sprint 13 sẽ mang lại hiệu quả rất tốt cho phần bảo vệ:

- có AI nhưng không quá phức tạp;
- có recommendation nhưng không mơ hồ;
- có accommodation nhưng không biến thành hệ thống booking;
- có payment nhưng không kéo sang bài toán production.

Đó cũng chính là mức triển khai phù hợp nhất với một đồ án sinh viên theo hướng **khả thi, dễ demo và dễ bảo vệ**.

---

<a id="sprint-14"></a>
## SPRINT 14 – Đóng gói bản cuối, kiểm thử tổng thể và chuẩn bị bảo vệ

### 1. Mục tiêu sprint

Sprint 14 là sprint cuối cùng của toàn bộ roadmap 14 sprint. Đây không còn là sprint để mở rộng nghiệp vụ, mà là giai đoạn **đóng gói sản phẩm cuối**, **kiểm thử tổng thể**, **sửa lỗi**, **chuẩn hóa dữ liệu demo** và **hoàn thiện toàn bộ tài liệu phục vụ bảo vệ đồ án**.

Sau khi:

- Sprint 01–08 đã hoàn thành phần nền tảng và các luồng nghiệp vụ lõi;
- Sprint 09 đã ổn định MVP lõi;
- Sprint 10–11 đã làm sản phẩm đầy đặn hơn với favorite, review, verification, bản đồ, activity log, notification và statistics;
- Sprint 12–13 đã bổ sung chat, AI, recommendation, accommodation và payment ở mức phù hợp với phạm vi đồ án;

thì Sprint 14 có nhiệm vụ **chuyển hệ thống từ trạng thái “đã làm xong nhiều phần” sang trạng thái “sẵn sàng để demo và bảo vệ”**.

#### Mục tiêu chính

- Không bổ sung chức năng mới, chỉ tập trung **fix bug, test cuối và đóng gói sản phẩm**.
- Rà soát lại toàn bộ **29 chức năng**, **47 màn hình** và **38 bảng dữ liệu** theo đúng phạm vi đã chốt.
- Chuẩn hóa bộ **dữ liệu demo cuối cùng** để mọi luồng trình bày đều chạy ổn định, dễ hiểu và có tính thuyết phục.
- Kiểm thử lại toàn bộ các nhóm API chính:
  - auth;
  - tour;
  - guide;
  - companion;
  - admin;
  - review / favorite / notification;
  - chat;
  - AI / accommodation / payment.
- Chốt **4 luồng demo bắt buộc** dùng trong buổi bảo vệ.
- Hoàn thiện bộ tài liệu trình bày cuối:
  - báo cáo;
  - ERD;
  - Use Case;
  - Activity Diagram;
  - mô tả màn hình;
  - README;
  - slide;
  - script demo;
  - checklist kiểm thử.
- Chuẩn bị **phương án dự phòng** nếu một phần chức năng mở rộng gặp lỗi trong buổi demo.
- Bảo đảm môi trường demo cuối đạt 3 tiêu chí:
  - ổn định;
  - nhất quán;
  - dễ trình bày.

#### Ý nghĩa của sprint này

Sprint 14 là sprint có tác động trực tiếp nhất đến **ấn tượng của hội đồng** khi xem sản phẩm. Trong bối cảnh đồ án sinh viên, giảng viên thường đánh giá không chỉ theo số lượng chức năng, mà còn theo:

1. **Mức độ hoàn chỉnh của sản phẩm**
2. **Tính logic của luồng nghiệp vụ**
3. **Sự đồng bộ giữa code, dữ liệu, UML và báo cáo**
4. **Khả năng trình bày mạch lạc và kiểm soát demo**

Vì vậy, Sprint 14 có ý nghĩa rất lớn ở 4 khía cạnh:

1. **Biến sản phẩm thành một phiên bản trình bày được**
   Nhiều dự án “đã code rất nhiều” nhưng không demo tốt vì dữ liệu lộn xộn, màn hình chưa thống nhất, flow dễ lỗi và tài liệu không khớp với sản phẩm. Sprint này xử lý đúng điểm đó.

2. **Giảm rủi ro vào giai đoạn cuối**
   Việc dành riêng một sprint cho đóng gói và bảo vệ giúp giảm áp lực dồn việc, đúng như tinh thần kế hoạch 14 sprint.

3. **Tăng tính thuyết phục**
   Một hệ thống có thể chưa sâu ở nhóm mở rộng, nhưng nếu core flow ổn định, dữ liệu demo rõ ràng, slide tốt và script bảo vệ mạch lạc thì vẫn rất thuyết phục.

4. **Chuyển từ tư duy “làm chức năng” sang “trình bày sản phẩm”**
   Ở sprint cuối, tư duy quan trọng không còn là “thêm cái gì nữa”, mà là:
   - cái gì cần chạy thật;
   - cái gì chỉ cần minh họa;
   - cái gì cần nói rõ phạm vi;
   - cái gì cần chuẩn bị phương án dự phòng.

Nói ngắn gọn, Sprint 14 là sprint **đóng gói giá trị của toàn bộ đồ án**.

---

### 2. Lưu ý trước khi triển khai

### 2.1. Tuyệt đối không mở thêm chức năng mới

Nguyên tắc quan trọng nhất của Sprint 14 là:

- không thêm module mới;
- không mở thêm bảng mới nếu không thật sự bắt buộc;
- không làm lại kiến trúc;
- không kéo thêm yêu cầu ngoài phạm vi đồ án.

Mọi thời gian của sprint này phải dồn cho:

- sửa lỗi;
- làm sạch dữ liệu;
- kiểm thử;
- chụp hình;
- viết tài liệu;
- luyện demo.

### 2.2. Đây là sprint “đóng gói để bảo vệ”, không phải sprint “cố hoàn hảo hóa sản phẩm”

Hệ thống trong đồ án không cần đạt mức production. Mục tiêu đúng là:

- các luồng lõi chạy được;
- dữ liệu demo hợp lý;
- giao diện đủ sạch;
- tài liệu khớp với sản phẩm;
- có thể trình bày mạch lạc.

Không nên cố:

- tối ưu vi mô quá sâu;
- triển khai thêm phần mở rộng chưa ổn;
- refactor lớn ở backend;
- thay UI framework hoặc thay kiến trúc.

### 2.3. Phải phân loại rõ màn hình nào demo thật, màn hình nào chỉ trình bày

Trong 47 màn hình của hệ thống, không nhất thiết tất cả đều phải được demo live. Sprint 14 phải phân loại rõ:

- **màn hình demo thật:** dùng trực tiếp trong buổi bảo vệ;
- **màn hình đã làm cơ bản:** có thể mở minh họa nhanh;
- **màn hình mở rộng / skeleton:** chỉ giới thiệu phạm vi và định hướng.

Nếu không chốt rõ, phần trình bày sẽ dễ lan man và thiếu kiểm soát.

### 2.4. Dữ liệu demo quan trọng gần như ngang với phần code

Một hệ thống có code đúng nhưng dữ liệu demo yếu vẫn rất khó thuyết phục. Sprint này phải chuẩn bị bộ dữ liệu có chủ đích, bao gồm:

- tài khoản user;
- tài khoản guide;
- tài khoản admin;
- tour với nhiều trạng thái;
- companion post với nhiều trạng thái;
- request đang chờ / đã duyệt / đã từ chối;
- review, report, notification, payment;
- dữ liệu AI chat và chat hội thoại mẫu nếu cần minh họa.

### 2.5. Tài liệu phải khớp với sản phẩm thật

Các tài liệu sau bắt buộc phải được rà soát để tránh lệch với hệ thống đang demo:

- Use Case;
- ERD;
- Activity Diagram;
- Sequence Diagram bổ sung;
- mô tả màn hình;
- bảng chức năng;
- bảng role – quyền thao tác dữ liệu;
- mô tả API / module;
- báo cáo tổng;
- README chạy demo.

### 2.6. Phải có flow dự phòng nếu demo lỗi

Sprint 14 phải chuẩn bị sẵn:

- phương án demo bằng dữ liệu có sẵn;
- tài khoản back-up;
- ảnh chụp hoặc video ngắn cho một số màn hình dễ lỗi;
- phương án chuyển từ live demo sang mô tả luồng + ảnh màn hình nếu cần.

### 2.7. Ưu tiên sự ổn định và tính thuyết phục hơn sự cầu kỳ

Trong sprint này, mọi quyết định nên ưu tiên:

- ít rủi ro hơn;
- dễ giải thích hơn;
- khớp báo cáo hơn;
- có thể trình bày mạch lạc hơn.

### 2.8. Định nghĩa “xong sprint” phải rất cụ thể

Sprint 14 chỉ được xem là hoàn thành khi có đủ:

- dữ liệu demo cuối;
- regression test tối thiểu cho các nhóm API chính;
- 4 luồng demo bắt buộc chạy ổn;
- screenshot / hình minh họa;
- báo cáo và UML được chốt;
- slide trình bày;
- script demo;
- checklist bảo vệ.

---

### 3. Các vấn đề cần xác định trong sprint này

#### 3.1. Bộ dữ liệu demo cuối cùng gồm những gì

Cần xác định rõ danh sách dữ liệu nào sẽ xuất hiện trong buổi demo, ví dụ:

- 1 admin;
- 1 guide đã xác minh;
- 1 guide chưa xác minh hoặc đã bị moderation;
- 2–3 user thường;
- 3–5 tour với trạng thái khác nhau;
- 2–3 companion post;
- 1 số request tour / companion ở nhiều trạng thái;
- 1 số review, report, notification, payment mẫu.

#### 3.2. 4 luồng demo bắt buộc sẽ là những luồng nào

Sprint 14 phải chốt **4 luồng demo chính thức** để tránh bảo vệ lan man. Cần chọn các luồng:

- có giá trị nghiệp vụ cao;
- ít rủi ro;
- thể hiện được cả user, guide, admin;
- khớp với phần phân tích trong báo cáo.

#### 3.3. Màn hình nào sẽ demo live, màn hình nào chỉ trình bày

Không phải mọi màn hình đều nên mở live. Cần quyết định rõ:

- màn hình nào mở trực tiếp;
- màn hình nào chỉ nói nhanh bằng screenshot;
- màn hình nào chỉ nhắc là định hướng phát triển.

#### 3.4. Nhóm chức năng mở rộng có demo live hay không

Chat, AI, recommendation, accommodation, payment có thể tạo ấn tượng tốt, nhưng cũng dễ lỗi hơn. Cần xác định:

- demo live toàn bộ;
- demo một phần;
- hoặc chỉ minh họa bằng dữ liệu sẵn có.

#### 3.5. Có cần reset dữ liệu trước buổi demo hay dùng snapshot cố định

Cần chốt cách đưa hệ thống về trạng thái sạch trước khi bảo vệ:

- reset toàn bộ DB theo script;
- dùng một bản seed snapshot cố định;
- hoặc giữ môi trường demo riêng biệt.

#### 3.6. Tài liệu cuối nào bắt buộc phải hoàn thành

Cần chốt rõ danh sách tài liệu bắt buộc, ví dụ:

- báo cáo tổng;
- báo cáo màn hình;
- báo cáo CSDL;
- báo cáo UML;
- README;
- slide;
- script demo;
- checklist kiểm thử.

#### 3.7. Cách kiểm thử tổng thể sẽ làm theo mức nào

Cần thống nhất kiểm thử ở mức phù hợp với đồ án:

- smoke test toàn hệ thống;
- regression test các API cốt lõi;
- kiểm thử thủ công theo demo flow;
- không nhất thiết triển khai test automation quá nặng nếu chưa có nền.

#### 3.8. Permission nào phải rà soát lại lần cuối

Sprint 14 cần kiểm tra lại các quyền quan trọng:

- guest chỉ xem dữ liệu public;
- user chỉ sửa dữ liệu của mình;
- guide chỉ quản lý tour / hồ sơ của mình;
- admin mới có quyền phân quyền, moderation, xử lý report, xem dashboard quản trị.

#### 3.9. API nào phải ưu tiên regression test

Cần chốt ưu tiên test:

- auth;
- hồ sơ người dùng;
- public tours;
- guide profile;
- tour requests;
- companion posts / requests;
- reports / admin moderation;
- favorites / reviews;
- notifications;
- chat;
- AI / accommodation / payment.

#### 3.10. UML nào cần chốt ở trạng thái cuối

Không nhất thiết phải bổ sung thêm quá nhiều sơ đồ mới, nhưng phải chốt các sơ đồ đã làm:

- Use Case tổng quát;
- ERD;
- Activity Diagram các luồng chính;
- Sequence Diagram quan trọng;
- Class Diagram nếu đã đưa vào báo cáo.

#### 3.11. Flow dự phòng khi demo lỗi là gì

Cần xác định rõ:

- nếu API lỗi thì chuyển sang flow chụp màn hình;
- nếu payment lỗi thì mô tả sandbox/mock;
- nếu AI lỗi thì trình bày session đã lưu;
- nếu chat lỗi thì minh họa conversation có sẵn.

#### 3.12. README và hướng dẫn chạy demo có cần chi tiết đến mức nào

Cần chốt mức tối thiểu:

- cách cài môi trường;
- biến môi trường chính;
- lệnh chạy frontend/backend;
- cách seed DB;
- tài khoản demo;
- cách reset dữ liệu.

---

### 4. Hạng mục cần chốt

#### 4.1. Hạng mục chiến lược đóng gói

- Phạm vi demo cuối cùng
- Danh sách chức năng demo thật
- Danh sách chức năng chỉ minh họa
- 4 luồng demo bắt buộc
- Flow dự phòng khi demo lỗi

#### 4.2. Hạng mục dữ liệu demo

- Tài khoản user / guide / admin
- Tour mẫu
- Companion post mẫu
- Request mẫu
- Review mẫu
- Report mẫu
- Notification mẫu
- Payment mẫu
- Dữ liệu chat / AI session mẫu nếu dùng khi trình bày

#### 4.3. Hạng mục frontend

- Fix bug hiển thị
- Chuẩn hóa text và label
- Rà soát responsive cơ bản
- Chụp ảnh màn hình
- Chuẩn bị video demo nếu cần
- Kiểm tra loading / empty / error state

#### 4.4. Hạng mục backend

- Fix bug logic
- Kiểm tra permission
- Rà soát logging
- Tối ưu query cuối ở mức cần thiết
- Chuẩn hóa response / error
- Chốt danh sách endpoint

#### 4.5. Hạng mục database

- Seed dữ liệu demo cuối
- Backup schema
- Backup dữ liệu mẫu
- Kiểm tra migration
- Chuẩn bị script reset demo
- Kiểm tra toàn vẹn dữ liệu và quan hệ khóa ngoại

#### 4.6. Hạng mục API / test

- Smoke test hệ thống
- Regression test API lõi
- Test thủ công theo demo flow
- Kiểm tra role / guard / permission
- Kiểm tra dữ liệu đầu ra của các API dễ trình bày

#### 4.7. Hạng mục tài liệu/UML

- Chốt ERD
- Chốt Use Case
- Chốt Activity Diagram
- Chốt Sequence Diagram cần thiết
- Hoàn thiện mô tả màn hình
- Hoàn thiện báo cáo tổng
- Hoàn thiện README
- Hoàn thiện slide
- Hoàn thiện script thuyết trình

#### 4.8. Hạng mục bảo vệ

- Checklist trước khi demo
- Tài khoản demo
- URL hoặc môi trường chạy
- Kịch bản trình bày 5–10 phút
- Kịch bản trả lời câu hỏi phản biện
- Phương án dự phòng

---

### 5. Phương án được chọn

### 5.1. Chiến lược tổng thể được chọn

Chọn phương án:

- **không mở thêm chức năng mới**;
- dùng Sprint 14 hoàn toàn cho:
  - fix bug;
  - test cuối;
  - seed demo;
  - chốt tài liệu;
  - chuẩn bị bảo vệ.

Đây là phương án phù hợp nhất với đồ án sinh viên và đúng tinh thần các file kế hoạch đã chốt.

### 5.2. Phương án demo được chọn

Chọn hướng:

- demo trọng tâm theo **4 luồng nghiệp vụ bắt buộc**;
- các chức năng mở rộng chỉ demo khi ổn định;
- nếu rủi ro cao thì chuyển thành minh họa có kiểm soát.

### 5.3. 4 luồng demo bắt buộc được chọn

Chọn 4 luồng có giá trị trình bày cao nhất và bám sát phạm vi chính thức của đồ án:

1. **Luồng 1 – Đăng ký / đăng nhập / xem hồ sơ cá nhân / phân quyền điều hướng**
   - thể hiện nền tảng auth và role;
   - chứng minh hệ thống chia area rõ ràng.

2. **Luồng 2 – Xem tour công khai → gửi yêu cầu tham gia tour → guide duyệt yêu cầu**
   - thể hiện trục kết nối khách du lịch – hướng dẫn viên;
   - là một trong các core flow quan trọng nhất.

3. **Luồng 3 – Tạo bài tìm bạn đồng hành → user khác gửi yêu cầu tham gia → chủ bài duyệt**
   - thể hiện trục kết nối người dùng với nhau;
   - chứng minh hệ thống có giá trị cộng đồng, không chỉ là website tour.

4. **Luồng 4 – Gửi report → admin xử lý / moderation**
   - thể hiện lớp quản trị và kiểm duyệt;
   - giúp sản phẩm có chiều sâu quản lý hệ thống.

Nếu còn thời gian hoặc hệ thống ổn định, có thể minh họa thêm:

- favorite / review;
- guide verification;
- notification;
- chat;
- AI / recommendation;
- payment sandbox.

### 5.4. Phân loại màn hình được chọn

Chọn chia 47 màn hình thành 3 lớp:

- **Lớp A – demo thật:** màn hình tham gia trực tiếp vào 4 luồng demo bắt buộc
- **Lớp B – minh họa mở nhanh:** màn hình đã làm cơ bản, có thể giới thiệu bổ sung
- **Lớp C – trình bày phạm vi:** màn hình mở rộng / skeleton / mô phỏng

### 5.5. Phương án dữ liệu demo được chọn

Chọn chuẩn bị **bộ seed demo cố định**, có thể reset nhanh trước buổi bảo vệ, gồm:

- 1 admin;
- 1 guide chính để demo;
- 1 guide phụ để minh họa trạng thái khác;
- 2–3 user thường;
- bộ tour và companion post đa trạng thái;
- request ở các trạng thái pending / approved / rejected / cancelled;
- 1 số review, report, notification;
- 1–2 payment transaction mẫu;
- 1–2 conversation / AI session mẫu nếu cần mở rộng.

### 5.6. Phương án kiểm thử được chọn

Chọn cách làm thực tế:

- smoke test toàn hệ thống;
- regression test các nhóm API chính;
- kiểm thử thủ công theo từng luồng demo;
- không ép triển khai test automation nặng ở sprint cuối nếu chưa có nền.

### 5.7. Phương án tài liệu được chọn

Chọn chốt toàn bộ tài liệu ở mức:

- khớp với bản demo thật;
- ưu tiên sơ đồ và mô tả các luồng lõi;
- các phần mở rộng trình bày đúng bản chất: đã làm cơ bản, mô phỏng, hoặc định hướng phát triển.

### 5.8. Phương án bảo vệ được chọn

Chọn chuẩn bị:

- slide ngắn, rõ, ít chữ;
- script nói theo 4 luồng demo;
- ảnh chụp màn hình dự phòng;
- README nội bộ để tự setup nhanh;
- checklist trước giờ demo.

### 5.9. Phương án xử lý rủi ro được chọn

Chọn nguyên tắc:

- nếu tính năng mở rộng không ổn định thì không ép demo live;
- ưu tiên core flow đã chắc;
- dùng dữ liệu snapshot, ảnh chụp và màn hình mở nhanh để giảm rủi ro.

### 5.10. Phương án chốt phạm vi được chọn

Chọn nhấn mạnh lại với hội đồng:

- phạm vi bắt buộc đã hoàn thành ở nhóm lõi;
- nhóm ưu tiên 2 đã được bổ sung có chọn lọc;
- nhóm ưu tiên 3 ở mức minh họa / sandbox / mô phỏng đúng theo định hướng của đồ án.

---

### 6. Ghi chú triển khai

#### 6.1. Thứ tự triển khai nên làm

Thứ tự hợp lý trong Sprint 14:

1. Chốt danh sách 4 luồng demo
2. Rà soát và sửa bug của 4 luồng này trước
3. Chuẩn hóa dữ liệu demo
4. Regression test API theo nhóm
5. Rà soát UI / ảnh chụp / responsive cơ bản
6. Chốt ERD / UML / mô tả màn hình
7. Hoàn thiện slide + script
8. Chạy thử toàn bộ như một buổi bảo vệ thật

#### 6.2. Fix bug phải ưu tiên theo giá trị demo

Không phải bug nào cũng ưu tiên như nhau. Thứ tự nên là:

- bug làm hỏng luồng demo;
- bug sai quyền truy cập;
- bug sai dữ liệu hiển thị;
- bug giao diện dễ nhìn thấy;
- bug nhỏ ít ảnh hưởng.

#### 6.3. Không refactor lớn ở sprint cuối

Sprint 14 không nên làm:

- đổi kiến trúc module;
- đổi auth flow;
- đổi schema lớn;
- đổi routing lớn;
- đổi thư viện trọng yếu.

#### 6.4. Chỉ tối ưu query ở mức cần thiết

Chỉ tối ưu khi:

- API quá chậm đến mức ảnh hưởng demo;
- query join sai logic;
- dữ liệu demo trả về không ổn định.

Không nên mở rộng tối ưu hóa quá mức trong sprint cuối.

#### 6.5. Chú ý sự nhất quán của text và nhãn hiển thị

Rất nhiều sản phẩm bị trừ cảm nhận chỉ vì:

- label không thống nhất;
- nút tiếng Việt / tiếng Anh lẫn lộn;
- trạng thái hiển thị khác tên trong báo cáo;
- thông báo lỗi quá kỹ thuật.

Sprint 14 phải rà soát lại toàn bộ các text quan trọng.

#### 6.6. Chuẩn bị ảnh chụp màn hình có chủ đích

Ảnh chụp không chỉ để bỏ vào báo cáo, mà còn để dự phòng khi demo. Nên chụp các nhóm:

- trang chủ;
- đăng nhập;
- danh sách tour;
- chi tiết tour;
- gửi request tour;
- dashboard guide;
- bài đồng hành;
- dashboard admin;
- report / moderation;
- statistics / notification;
- AI / payment / chat nếu có.

#### 6.7. Slide và script phải bám đúng sản phẩm thật

Không nên viết slide theo “hệ thống lý tưởng”. Slide phải phản ánh đúng:

- cái gì đã làm thật;
- cái gì làm ở mức cơ bản;
- cái gì là mở rộng / định hướng.

#### 6.8. README nên thiên về “chạy demo được”

README của đồ án không cần quá dài, nhưng nên đủ để:

- clone / mở source;
- cấu hình env;
- chạy frontend;
- chạy backend;
- seed DB;
- đăng nhập bằng tài khoản demo.

#### 6.9. Dữ liệu demo nên dễ kể chuyện

Dữ liệu không chỉ đúng kỹ thuật mà còn nên có câu chuyện:

- user A tìm tour của guide B;
- user C xin tham gia;
- guide B duyệt;
- user A tạo bài đồng hành;
- user khác gửi request;
- admin xử lý report.

Dữ liệu có ngữ cảnh sẽ giúp buổi bảo vệ tự nhiên và thuyết phục hơn.

#### 6.10. Quy tắc “xong sprint”

Sprint 14 chỉ được xem là xong khi:

- 4 luồng demo chính chạy được;
- dữ liệu demo cuối đã seed xong;
- API lõi đã regression test ở mức tối thiểu;
- báo cáo / UML / màn hình đã cập nhật;
- slide và script đã chốt;
- có phương án dự phòng nếu demo lỗi.

---

### 7. Chức năng trọng tâm

Sprint 14 không thêm chức năng nghiệp vụ mới. Vì vậy, “chức năng trọng tâm” của sprint này được hiểu là **nhóm công việc đóng gói toàn hệ thống**.

#### Nhóm 1. Kiểm thử tổng thể hệ thống

##### Mục tiêu

- Bảo đảm các luồng lõi chạy thông suốt
- Phát hiện bug cuối trước buổi bảo vệ
- Giảm rủi ro lỗi live demo

##### Actor chính

- Developer / người thực hiện đồ án
- Giảng viên / hội đồng (ở góc nhìn người xem sản phẩm)

##### Dữ liệu chính

- Tất cả dữ liệu demo đã seed
- Tài khoản demo
- Log lỗi / checklist test

##### Kết quả đầu ra

- Danh sách bug đã sửa
- Checklist test đã chạy
- 4 luồng demo ổn định

##### Mức độ triển khai phù hợp

- kiểm thử thủ công + smoke test + regression test API lõi;
- không cần mở rộng thành test automation toàn diện nếu không có nền.

#### Nhóm 2. Chuẩn hóa dữ liệu demo

##### Mục tiêu

- Tạo bộ dữ liệu đẹp, rõ, dễ trình bày
- Tránh dữ liệu rỗng hoặc sai logic khi demo

##### Actor chính

- Developer / người chuẩn bị bảo vệ

##### Dữ liệu chính

- users, roles, user_roles
- guide_profiles, tours, tour_requests
- companion_posts, companion_requests
- reviews, reports, notifications
- conversations, ai_chat_sessions, payment_transactions

##### Kết quả đầu ra

- Bộ seed cuối cùng
- Script reset dữ liệu demo
- Snapshot dữ liệu dùng cho bảo vệ

##### Mức độ triển khai phù hợp

- ưu tiên dữ liệu vừa đủ nhưng có ý nghĩa;
- không seed tràn lan gây rối phần trình bày.

#### Nhóm 3. Hoàn thiện tài liệu và UML

##### Mục tiêu

- Bảo đảm tài liệu khớp sản phẩm thật
- Tăng tính học thuật và tính thuyết phục khi bảo vệ

##### Actor chính

- Developer / người viết báo cáo
- Hội đồng chấm đồ án

##### Dữ liệu chính

- Use Case
- ERD
- Activity Diagram
- Sequence Diagram
- mô tả màn hình
- báo cáo tổng

##### Kết quả đầu ra

- Bộ tài liệu chốt cuối
- Báo cáo hoàn chỉnh
- Slide và script nhất quán

##### Mức độ triển khai phù hợp

- ưu tiên chốt đúng những gì đã làm thật;
- tránh vẽ quá nhiều sơ đồ không dùng trong bảo vệ.

#### Nhóm 4. Chuẩn bị trình bày và bảo vệ

##### Mục tiêu

- Giúp phần demo mạch lạc, tự tin
- Kiểm soát tốt thời gian và rủi ro

##### Actor chính

- Người bảo vệ đồ án

##### Dữ liệu chính

- slide
- script nói
- screenshot
- video ngắn dự phòng
- checklist trước demo

##### Kết quả đầu ra

- Bộ tài liệu trình bày hoàn chỉnh
- Flow bảo vệ rõ ràng
- Phương án dự phòng sẵn sàng

##### Mức độ triển khai phù hợp

- gọn, rõ, thực chiến;
- tránh làm slide quá dài hoặc demo quá dàn trải.

#### Kết luận cho nhóm chức năng

Sprint 14 không có chức năng nghiệp vụ mới, nhưng lại là sprint quyết định sản phẩm có **thật sự sẵn sàng để bảo vệ hay không**. Nhóm trọng tâm của sprint này là:

- kiểm thử;
- chuẩn hóa dữ liệu;
- hoàn thiện tài liệu;
- chuẩn bị trình bày.

---

### 8. Màn hình triển khai

### 8.1. Mục tiêu của phần màn hình

Khác với các sprint trước, Sprint 14 không xây thêm màn hình mới mà tập trung **rà soát toàn bộ 47 màn hình** theo 3 lớp:

- màn hình demo thật;
- màn hình mở nhanh minh họa;
- màn hình mở rộng / skeleton chỉ trình bày.

### 8.2. Nhóm màn hình demo thật nên ưu tiên

Đây là nhóm nên tham gia trực tiếp vào 4 luồng demo bắt buộc.

#### Public / dùng chung

- **M01 – Trang chủ**
- **M02 – Đăng ký tài khoản**
- **M03 – Đăng nhập**
- **M04 – Danh sách tour**
- **M05 – Tìm kiếm / lọc / sắp xếp tour**
- **M06 – Chi tiết tour**
- **M10 – Danh sách bài tìm bạn đồng hành**
- **M11 – Chi tiết bài tìm bạn đồng hành**

#### User Area

- **M15 – Hồ sơ cá nhân**
- **M20 – Gửi báo cáo vi phạm**
- **M21 – Yêu cầu tham gia tour của tôi**
- **M23 – Danh sách bài đồng hành của tôi**
- **M24 – Tạo bài đồng hành**
- **M25 – Cập nhật bài đồng hành**
- **M26 – Yêu cầu tham gia bài đồng hành đã gửi**

#### Guide Area

- **M31 – Hồ sơ hướng dẫn viên**
- **M34 – Danh sách tour của tôi**
- **M35 – Tạo / cập nhật tour**
- **M37 – Quản lý yêu cầu tham gia tour**

#### Admin Area

- **M39 – Quản lý người dùng**
- **M40 – Phân quyền quản trị**
- **M43 – Quản lý báo cáo vi phạm**
- **M46 – Dashboard / thống kê quản trị**
- **M47 – Nhật ký hoạt động quản trị**

### 8.3. Nhóm màn hình mở nhanh để minh họa thêm

Các màn hình này có thể mở nhanh nếu còn thời gian hoặc khi hội đồng hỏi sâu:

- **M07 – Bản đồ lộ trình tour**
- **M08 – Danh sách hướng dẫn viên công khai**
- **M09 – Hồ sơ hướng dẫn viên công khai**
- **M16 – Đổi mật khẩu**
- **M17 – Lịch sử hoạt động cá nhân**
- **M18 – Danh sách yêu thích**
- **M19 – Thông báo**
- **M27 – Danh sách review / đánh giá**
- **M28 – Gửi yêu cầu xác minh hướng dẫn viên**
- **M29 – Chat trực tiếp**
- **M30 – Chat nhóm bài đồng hành**
- **M32 – Hồ sơ hướng dẫn viên công khai ở góc quản trị / kiểm duyệt**
- **M33 – Danh sách yêu cầu xác minh hướng dẫn viên**
- **M36 – Chi tiết tour / quản trị tour ở guide area**
- **M38 – Dashboard hướng dẫn viên**
- **M41 – Kiểm duyệt hồ sơ hướng dẫn viên**
- **M42 – Kiểm duyệt tour / bài đồng hành**
- **M44 – Chi tiết xử lý report**
- **M45 – Quản lý nội dung vi phạm**

### 8.4. Nhóm màn hình mở rộng / định hướng

Nhóm này có thể chỉ cần screenshot hoặc minh họa ngắn:

- **M12 – Gợi ý tour thông minh**
- **M13 – Chatbot AI tư vấn du lịch**
- **M14 – Liên kết dịch vụ lưu trú**
- **M22 – Thanh toán trực tuyến**

### 8.5. Điều cần làm với toàn bộ màn hình trong Sprint 14

- Rà soát text hiển thị
- Kiểm tra breadcrumb, title, button
- Kiểm tra loading / empty / error state
- Kiểm tra route guard
- Kiểm tra dữ liệu hiển thị khớp role
- Chụp ảnh màn hình theo bộ minh họa báo cáo

#### Kết luận cho phần màn hình

Sprint 14 phải làm rõ rằng:

- không phải mọi màn hình đều demo live;
- nhưng mọi màn hình đưa vào báo cáo đều phải có trạng thái trình bày rõ ràng;
- các màn hình thuộc core flow phải ổn định hơn phần mở rộng.

---

### 9. Bảng CSDL chính

### 9.1. Mục tiêu của phần dữ liệu

Sprint 14 không thêm bảng mới mà rà soát **toàn bộ 38 bảng** theo các mục tiêu:

- toàn vẹn dữ liệu;
- logic khóa ngoại;
- trạng thái dữ liệu;
- dữ liệu demo;
- khả năng reset về trạng thái bảo vệ.

### 9.2. Nhóm tài khoản, phân quyền và audit quản trị

- `users`
- `roles`
- `user_roles`
- `admin_activity_logs`
- `user_role_change_logs`

#### Vai trò trong Sprint 14

- kiểm tra tài khoản demo;
- kiểm tra role và quyền truy cập;
- kiểm tra audit log phục vụ admin demo.

### 9.3. Nhóm hồ sơ hướng dẫn viên

- `guide_profiles`
- `languages`
- `skills`
- `guide_languages`
- `guide_skills`
- `guide_verification_requests`
- `guide_verification_documents`

#### Vai trò trong Sprint 14

- seed guide profile đủ đẹp để demo;
- bảo đảm trạng thái verification hợp lý;
- có ít nhất 1 hồ sơ dùng được trong luồng tour.

### 9.4. Nhóm tour và tham gia tour

- `tour_categories`
- `tours`
- `tour_images`
- `tour_locations`
- `tour_requests`
- `tour_reviews`
- `guide_reviews`
- `favorite_tours`
- `favorite_guides`

#### Vai trò trong Sprint 14

- tạo bộ tour mẫu để demo public tour;
- bảo đảm request tour có đủ trạng thái;
- có sẵn review / favorite minh họa nếu cần.

### 9.5. Nhóm companion

- `companion_posts`
- `companion_requests`

#### Vai trò trong Sprint 14

- chuẩn bị ít nhất 1 luồng bài đồng hành hoàn chỉnh;
- có request pending / approved / rejected để minh họa.

### 9.6. Nhóm report, notification, activity

- `reports`
- `report_processing_history`
- `notifications`
- `user_activity_logs`

#### Vai trò trong Sprint 14

- phục vụ luồng user report → admin xử lý;
- hỗ trợ trình bày notification và activity log nếu được hỏi sâu.

### 9.7. Nhóm chat, AI, accommodation, payment

- `conversations`
- `conversation_participants`
- `messages`
- `user_preferences`
- `user_preferred_categories`
- `ai_chat_sessions`
- `ai_chat_messages`
- `partner_accommodations`
- `tour_accommodations`
- `payment_transactions`

#### Vai trò trong Sprint 14

- dùng làm dữ liệu minh họa cho phần mở rộng;
- không bắt buộc demo sâu nếu chưa ổn định.

### 9.8. Kiểm tra dữ liệu cuối cần thực hiện

- kiểm tra orphan record;
- kiểm tra khóa ngoại;
- kiểm tra duplicate dữ liệu demo;
- kiểm tra trạng thái dữ liệu có logic;
- kiểm tra script reset chạy được;
- backup snapshot dữ liệu cuối.

#### Kết luận cho phần dữ liệu

Trong Sprint 14, phần “Bảng CSDL chính” được hiểu là **toàn bộ 38 bảng của schema cuối**, nhưng mức ưu tiên rà soát phải bám theo 4 luồng demo bắt buộc và nhóm mở rộng chỉ cần đủ để trình bày.

---

### 10. API cần thiết

### 10.1. Mục tiêu của phần API

Sprint 14 không thiết kế thêm API mới, mà tập trung:

- regression test;
- rà soát permission;
- kiểm tra response;
- chốt danh sách endpoint phục vụ báo cáo và demo.

### 10.2. Nhóm auth / profile

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

#### Mục tiêu

- xác minh đăng ký / đăng nhập / đăng xuất;
- kiểm tra phân quyền và điều hướng.

### 10.3. Nhóm public / tours

- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/locations`
- `GET /tour-categories`
- `POST /tour-requests`
- `GET /me/tour-requests`
- `PATCH /tour-requests/:id/cancel`

#### Mục tiêu

- bảo đảm public tour và luồng gửi request tour ổn định.

### 10.4. Nhóm guide

- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /guide/tours`
- `POST /guide/tours`
- `PATCH /guide/tours/:id`
- `GET /guide/tours/:id/requests`
- `PATCH /guide/tour-requests/:id/status`

#### Mục tiêu

- bảo đảm luồng guide profile và guide duyệt request tour chạy được.

### 10.5. Nhóm companion

- `GET /companion-posts`
- `GET /companion-posts/:id`
- `POST /companion-posts`
- `PATCH /companion-posts/:id`
- `DELETE /companion-posts/:id`
- `POST /companion-posts/:id/requests`
- `GET /me/companion-posts`
- `GET /me/companion-requests`
- `GET /companion-posts/:id/requests`
- `PATCH /companion-requests/:id/status`

#### Mục tiêu

- bảo đảm luồng bài đồng hành và duyệt thành viên hoạt động ổn định.

### 10.6. Nhóm report / admin

- `POST /reports`
- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/roles`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles/:role`
- `GET /admin/reports`
- `GET /admin/reports/:id`
- `PATCH /admin/reports/:id`
- `GET /admin/activity-logs`
- `GET /admin/role-change-logs`

#### Mục tiêu

- bảo đảm luồng report và quản trị lõi có thể trình bày rõ.

### 10.7. Nhóm review / favorite / notification

- `POST /tours/:id/favorite`
- `DELETE /tours/:id/favorite`
- `POST /guides/:id/favorite`
- `DELETE /guides/:id/favorite`
- `POST /tours/:id/reviews`
- `POST /guides/:id/reviews`
- `GET /me/favorites`
- `GET /me/notifications`
- `PATCH /me/notifications/:id/read`

#### Mục tiêu

- regression test và minh họa nếu cần.

### 10.8. Nhóm chat / AI / accommodation / payment

- `GET /conversations`
- `POST /conversations/direct`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `GET /recommendations/tours`
- `POST /ai-chat/sessions`
- `GET /ai-chat/sessions/:id/messages`
- `POST /ai-chat/sessions/:id/messages`
- `GET /accommodations`
- `GET /tours/:id/accommodations`
- `POST /payments`
- `GET /payments/:id`
- `POST /payments/:id/confirm`
- `GET /me/payments`

#### Mục tiêu

- kiểm tra ở mức mở rộng / minh họa;
- không bắt buộc demo live toàn bộ nếu rủi ro cao.

### 10.9. Kết quả mong muốn ở phần API

- Có danh sách endpoint rõ ràng
- Có kết quả test tối thiểu cho các nhóm API chính
- Có thể trả lời hội đồng khi được hỏi về kiến trúc API

#### Kết luận cho phần API

Sprint 14 phải kết thúc với một **danh sách API đã được rà soát và có mức độ tin cậy đủ để demo**, thay vì chỉ là tập endpoint rời rạc chưa kiểm tra lần cuối.

---

### 11. Công việc frontend

### 11.1. Mục tiêu tổng thể của frontend sprint này

- Fix bug giao diện
- Chuẩn hóa dữ liệu hiển thị
- Rà soát luồng demo
- Hoàn thiện ảnh chụp / video / minh họa
- Tăng tính nhất quán của toàn bộ trải nghiệm sử dụng

### 11.2. Rà soát layout và điều hướng

- Kiểm tra header, sidebar, breadcrumb
- Kiểm tra route guard theo role
- Kiểm tra redirect sau login
- Kiểm tra điều hướng giữa Public / User / Guide / Admin

### 11.3. Fix bug trên các màn hình demo thật

Ưu tiên sửa lỗi ở:

- M03, M04, M05, M06
- M15, M20, M21, M23, M24, M25, M26
- M31, M34, M35, M37
- M39, M43, M46, M47

### 11.4. Chuẩn hóa trạng thái giao diện

- loading state
- empty state
- error state
- success toast / modal xác nhận
- badge trạng thái thống nhất

### 11.5. Chuẩn hóa dữ liệu demo hiển thị

- avatar, tên, tiêu đề, mô tả, trạng thái
- ngày giờ hiển thị
- tiền tệ và giá tour
- số lượng thành viên / chỗ trống
- text thông báo cho report, request, payment

### 11.6. Rà soát responsive cơ bản

- kiểm tra trên viewport laptop phổ biến
- kiểm tra tối thiểu trên tablet / mobile ở các màn hình quan trọng
- tránh vỡ layout trong buổi demo

### 11.7. Chuẩn bị screenshot và tài nguyên trình bày

- chụp bộ hình cho báo cáo
- chụp bộ hình dự phòng cho slide
- quay video ngắn nếu cần cho phần mở rộng

### 11.8. Kiểm thử frontend theo demo script

- chạy thử 4 luồng demo
- kiểm tra text hiển thị
- kiểm tra button / form / validation
- ghi lại điểm dễ lỗi để fix cuối

---

### 12. Công việc backend

### 12.1. Mục tiêu tổng thể của backend sprint này

- sửa lỗi logic cuối;
- rà soát permission;
- chuẩn hóa response;
- kiểm tra logging;
- chốt danh sách endpoint.

### 12.2. Rà soát auth và role guard

- đăng ký / đăng nhập / đăng xuất
- lấy profile hiện tại
- lấy role hiện tại
- kiểm tra role guard theo area
- kiểm tra trường hợp account bị khóa / suspended

### 12.3. Rà soát nhóm nghiệp vụ lõi

- public tour
- guide profile
- tour requests
- companion posts / requests
- reports / admin moderation

Đây là phần phải ưu tiên nhất vì gắn trực tiếp với 4 luồng demo.

### 12.4. Rà soát nhóm nghiệp vụ bổ sung

- favorite
- review
- notifications
- statistics
- guide verification

### 12.5. Rà soát nhóm mở rộng

- chat
- AI
- accommodation
- payment

Mục tiêu ở mức:

- chạy được nếu demo;
- nếu chưa ổn định thì ít nhất phải đúng logic, đúng response mẫu, dễ trình bày.

### 12.6. Kiểm tra permission lần cuối

- user không sửa dữ liệu người khác
- guide không thao tác ngoài phạm vi tour của mình
- admin mới được moderation / phân quyền / xem nhật ký
- guest chỉ xem dữ liệu public

### 12.7. Kiểm tra logging và audit

- log admin activity
- log đổi quyền
- log xử lý report nếu có
- log payment / AI / chat ở mức cơ bản nếu đã triển khai

### 12.8. Tối ưu query cuối ở mức cần thiết

Chỉ tối ưu ở các API:

- danh sách tour;
- chi tiết tour;
- dashboard admin;
- danh sách report;
- danh sách request;
- notifications / activity log nếu bị chậm.

### 12.9. Hoàn thiện danh sách API docs

- danh sách endpoint
- method
- request body chính
- response chính
- role được phép gọi

---

### 13. Công việc database

### 13.1. Mục tiêu tổng thể của database sprint này

- seed dữ liệu demo cuối;
- backup schema và snapshot;
- kiểm tra toàn vẹn dữ liệu;
- chuẩn bị script reset trước demo.

### 13.2. Chuẩn hóa bộ seed demo

- user / guide / admin
- guide profile
- tour
- companion post
- request
- review
- report
- notification
- payment
- conversation / AI session nếu cần

### 13.3. Kiểm tra toàn vẹn dữ liệu

- khóa ngoại
- ràng buộc unique
- trạng thái dữ liệu
- dữ liệu ngày giờ
- dữ liệu tiền tệ / số lượng

### 13.4. Rà soát migration

- migration đã chạy đúng chưa
- migration nào còn thừa / không dùng
- có cần script tổng hợp để dựng DB mới hay không

### 13.5. Backup schema và dữ liệu mẫu

- backup schema cuối
- backup seed cuối
- backup snapshot môi trường demo

### 13.6. Chuẩn bị script reset demo

Script này nên đủ để:

- xóa dữ liệu phát sinh khi chạy thử;
- seed lại trạng thái demo chuẩn;
- đưa hệ thống về đúng trạng thái trước buổi bảo vệ.

### 13.7. Kiểm tra dữ liệu phục vụ 4 luồng demo

- mỗi luồng đều có đủ actor và dữ liệu liên quan;
- không bị thiếu record khi trình bày;
- trạng thái dữ liệu nhất quán với script nói.

### 13.8. Chuẩn bị dữ liệu dự phòng

- tài khoản backup
- tour backup
- companion post backup
- report backup
- payment backup

---

### 14. Tài liệu/UML

### 14.1. Use Case cần chốt cuối

- Use Case tổng quát toàn hệ thống
- actor: Guest, User, Guide, Admin
- bảo đảm khớp phạm vi chính thức của đồ án

### 14.2. ERD cần chốt cuối

- sơ đồ logic khớp schema final 38 bảng
- nếu báo cáo tách ERD lõi / ERD mở rộng thì phải nhất quán với sản phẩm thật

### 14.3. Activity Diagram cần chốt

Ưu tiên các luồng:

- đăng ký / đăng nhập
- xem tour / gửi request tour
- guide duyệt request tour
- tạo bài đồng hành / gửi request / duyệt request
- gửi report / admin xử lý
- payment hoặc AI nếu đã đưa vào báo cáo

### 14.4. Sequence Diagram cần chốt

Ưu tiên các sơ đồ có giá trị trình bày cao:

- gửi yêu cầu tham gia tour
- guide duyệt yêu cầu tham gia tour
- gửi yêu cầu tham gia bài đồng hành
- xử lý report vi phạm

### 14.5. Mô tả màn hình cần cập nhật

- trạng thái thật của từng màn hình
- nội dung chính hiển thị
- actor truy cập
- chức năng liên quan
- dữ liệu liên quan

### 14.6. Báo cáo tổng cần hoàn thiện

- phạm vi đề tài
- chức năng hệ thống
- công nghệ triển khai
- phân tích dữ liệu
- UML
- thiết kế màn hình
- kế hoạch sprint
- kết quả đạt được
- hướng phát triển

### 14.7. README và tài liệu chạy demo

- yêu cầu môi trường
- cách cấu hình
- cách chạy frontend/backend
- cách seed dữ liệu
- tài khoản demo
- lưu ý demo

### 14.8. Slide và script bảo vệ

- slide giới thiệu đề tài
- bài toán và mục tiêu
- kiến trúc hệ thống
- nhóm chức năng chính
- CSDL / UML
- demo 4 luồng
- kết quả đạt được
- hạn chế và hướng phát triển

#### Nội dung cần nhấn mạnh khi viết báo cáo và bảo vệ

- hệ thống có 2 trục giá trị chính:
  - kết nối khách du lịch với hướng dẫn viên qua tour;
  - kết nối người dùng với nhau qua bài tìm bạn đồng hành.
- lõi đã được triển khai trước, mở rộng làm sau;
- nhóm chức năng mở rộng được phát triển đúng mức phù hợp với đồ án.

---

### 15. Đầu ra

#### 15.1. Về chức năng

- Không thêm chức năng mới
- 4 luồng demo bắt buộc chạy ổn
- Nhóm chức năng mở rộng có thể mở minh họa nếu ổn định

#### 15.2. Về màn hình

- Toàn bộ 47 màn hình được phân loại rõ:
  - demo thật;
  - minh họa nhanh;
  - trình bày phạm vi.
- Bộ ảnh màn hình đã được chụp xong

#### 15.3. Về API

- Các nhóm API chính đã regression test ở mức tối thiểu
- Danh sách endpoint đã được chốt
- Permission quan trọng đã được rà soát lại

#### 15.4. Về dữ liệu

- Bộ seed demo cuối đã chuẩn bị xong
- Có script reset demo
- Có snapshot dữ liệu phục vụ buổi bảo vệ

#### 15.5. Về tài liệu

- ERD, Use Case, Activity Diagram đã chốt
- Mô tả màn hình hoàn thiện
- Báo cáo cuối khớp với sản phẩm
- README, slide, script demo sẵn sàng

#### 15.6. Về giá trị bảo vệ đồ án

Kết thúc Sprint 14, hệ thống đạt trạng thái:

- môi trường demo ổn định;
- dữ liệu demo hợp lý;
- luồng demo rõ ràng;
- tài liệu đồng bộ;
- sẵn sàng bảo vệ đồ án.

#### 15.7. Định nghĩa “xong sprint”

Sprint 14 được xem là hoàn thành khi đồng thời thỏa mãn:

- không còn bug nghiêm trọng trên 4 luồng demo chính;
- dữ liệu demo cuối đã seed và reset được;
- các nhóm API cốt lõi đã test lại;
- báo cáo và UML đã khớp với hệ thống thật;
- screenshot / slide / script / README đã chốt;
- có flow dự phòng nếu demo live gặp sự cố.

---

### Kết luận

Sprint 14 là giai đoạn chốt toàn bộ giá trị của đồ án. Nếu các sprint trước tập trung xây dựng hệ thống, thì sprint này tập trung **biến hệ thống thành một sản phẩm có thể trình bày thuyết phục trước hội đồng**.

Điểm quan trọng nhất của Sprint 14 không nằm ở việc thêm tính năng, mà nằm ở việc:

- giữ phạm vi ổn định;
- làm sạch dữ liệu;
- test lại toàn hệ thống;
- hoàn thiện tài liệu;
- chuẩn bị một buổi demo mạch lạc, tự tin và có phương án dự phòng.

Đây là sprint quyết định việc đồ án được nhìn nhận như một sản phẩm **đã hoàn thiện trong phạm vi sinh viên**, chứ không chỉ là một tập hợp chức năng đã code xong rời rạc.
