# BÁO CÁO TỔNG HỢP ĐỒ ÁN TRAVELCONNECTVN — DỰA TRÊN SOURCE CODE

> Ngày tạo: 2026-05-02 | Audit toàn bộ source code frontend, backend, database

---

# CHƯƠNG 1. TỔNG QUAN

## 1.1. Giới thiệu đề tài

TravelConnectVN là website du lịch kết nối ba nhóm đối tượng: khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Hệ thống được xây dựng theo mô hình client-server với frontend ReactJS, backend NestJS và cơ sở dữ liệu PostgreSQL trên nền tảng Supabase.

Dự án giải quyết bài toán kết nối trong du lịch trải nghiệm thông qua hai trục giá trị: (1) kết nối khách du lịch với hướng dẫn viên địa phương am hiểu văn hóa, (2) kết nối những người có chung sở thích xê dịch để cùng khám phá.

Bằng chứng: `README.md`, `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`.

## 1.2. Tính cấp thiết và lý do hình thành đề tài

Du lịch tự túc ngày càng phổ biến tại Việt Nam, tạo ra các nhu cầu thực tế:
- Tìm hướng dẫn viên địa phương uy tín, có kinh nghiệm thực tế.
- Tìm bạn đồng hành cùng sở thích để chia sẻ chi phí và trải nghiệm.
- Quản lý tour, yêu cầu tham gia, đánh giá chất lượng dịch vụ.
- Báo cáo vi phạm và quản trị nội dung trên nền tảng.

Trong bối cảnh đồ án sinh viên, đề tài cho phép vận dụng tổng hợp các kiến thức: phân tích thiết kế hệ thống, lập trình web fullstack, cơ sở dữ liệu quan hệ, xác thực-phân quyền và thiết kế giao diện người dùng.

## 1.3. Ý nghĩa khoa học và thực tiễn

**Ý nghĩa khoa học:** Vận dụng phân tích thiết kế hệ thống thông tin, mô hình hóa UML, thiết kế RESTful API, cơ sở dữ liệu quan hệ 38+ bảng, hệ thống phân quyền RBAC 5 vai trò, thiết kế giao diện web theo mô hình 4 khu vực (Public/User/Guide/Admin).

**Ý nghĩa thực tiễn:** Xây dựng nền tảng hỗ trợ tìm kiếm tour du lịch, kết nối hướng dẫn viên, tạo bài tìm bạn đồng hành, quản lý yêu cầu tham gia, đánh giá dịch vụ, báo cáo vi phạm và quản trị nội dung. Tích hợp thêm chat realtime, AI chatbot, bản đồ tương tác và thanh toán trực tuyến.

## 1.4. Mục tiêu nghiên cứu

- Phân tích yêu cầu hệ thống website du lịch kết nối đa vai trò.
- Thiết kế cơ sở dữ liệu quan hệ phục vụ quản lý tour, HDV, đồng hành, đánh giá, báo cáo.
- Xây dựng frontend ReactJS với 50 màn hình phân theo 4 khu vực.
- Xây dựng backend API NestJS với 20 module nghiệp vụ.
- Triển khai xác thực Supabase Auth và phân quyền RBAC.
- Tích hợp các chức năng mở rộng: chat, AI, bản đồ, thanh toán.
- Tạo sản phẩm demo phục vụ bảo vệ đồ án.

Bằng chứng: `frontend/src/pages/` (50 file), `backend/src/` (20 module), `backend/prisma/schema.prisma` (65 model).

## 1.5. Đối tượng và phạm vi nghiên cứu

### Đối tượng sử dụng
- **Khách truy cập:** Xem tour, danh sách HDV, bài đồng hành.
- **Người dùng (USER):** Đặt tour, tạo bài đồng hành, đánh giá, chat, AI chatbot.
- **Hướng dẫn viên (GUIDE):** Tạo/quản lý tour, duyệt yêu cầu, xác minh hồ sơ.
- **Quản trị viên (ADMIN):** Quản lý users, kiểm duyệt nội dung, xử lý báo cáo.

Bằng chứng: `backend/src/common/enums/role.enum.ts` — 5 vai trò: USER, GUIDE, SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF.

### Phạm vi chức năng đã làm được
29 chức năng, 47 màn hình, 38+ bảng CSDL, 20 module backend, 17 service frontend. Chi tiết tại `SOURCE_AUDIT_FEATURES.md`.

### Phạm vi giới hạn
- Thanh toán VNPAY ở chế độ sandbox (thẻ test).
- AI chatbot dùng Google Gemini, chưa tích hợp dữ liệu tour nội bộ.
- Recommendation engine là rule-based, chưa dùng ML.
- Chưa triển khai production, chạy localhost.
- Chưa có ứng dụng mobile.

## 1.6. Tóm tắt lý thuyết và nghiên cứu liên quan

Đề tài vận dụng các nền tảng lý thuyết:
- **Hệ thống thông tin du lịch:** Mô hình nền tảng kết nối cung-cầu dịch vụ du lịch.
- **Mô hình client-server:** Frontend giao tiếp backend qua RESTful API.
- **RBAC:** Phân quyền theo vai trò, kiểm soát truy cập tài nguyên.
- **Cơ sở dữ liệu quan hệ:** PostgreSQL với ràng buộc toàn vẹn, check constraints, foreign keys.
- **UML:** Use Case, Activity, Sequence Diagram mô hình hóa nghiệp vụ.
- **Bảo mật:** JWT, Supabase Auth, Row Level Security.
- **WebSocket:** Giao tiếp realtime cho chat.

## 1.7. Cấu trúc đồ án

- **Chương 1 — Tổng quan:** Giới thiệu đề tài, mục tiêu, phạm vi, lý thuyết liên quan.
- **Chương 2 — Cơ sở lý thuyết:** Kiến trúc hệ thống, công nghệ, CSDL, xác thực, UML, phương pháp giải quyết.
- **Chương 3 — Kết quả thực nghiệm:** Môi trường, kiến trúc source, CSDL, backend API, frontend, luồng demo.
- **Kết luận:** Kết quả, đóng góp, hạn chế, hướng phát triển.

---

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

## 2.1. Mô hình kiến trúc hệ thống

Hệ thống TravelConnectVN được thiết kế theo mô hình 3 lớp (Three-tier Architecture):

- **Lớp trình bày (Frontend):** ReactJS + TypeScript, build bằng Vite, giao tiếp backend qua HTTP REST API và WebSocket.
- **Lớp xử lý nghiệp vụ (Backend):** NestJS + TypeScript, tổ chức theo module, sử dụng Prisma ORM để truy vấn cơ sở dữ liệu.
- **Lớp dữ liệu (Database):** PostgreSQL trên Supabase, 38+ bảng public schema cùng auth schema của Supabase Auth.

Bằng chứng: `frontend/package.json` (React 19, Vite 8), `backend/package.json` (NestJS 11, Prisma 7), `backend/prisma/schema.prisma` (65 model).

Kiến trúc bổ sung:
- **Xác thực:** Supabase Auth (JWT, Google OAuth).
- **Lưu trữ file:** Supabase Storage (ảnh tour, tài liệu xác minh HDV).
- **Realtime:** Socket.io WebSocket Gateway.
- **AI:** Google Generative AI (Gemini).
- **Bản đồ:** Leaflet + OpenStreetMap.
- **Thanh toán:** VNPAY Sandbox.

## 2.2. Công nghệ frontend

Dựa trên `frontend/package.json` và source code thực tế:

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.2.4 | UI library |
| TypeScript | ~6.0.2 | Type safety |
| Vite | 8.0.4 | Build tool, dev server |
| React Router DOM | 7.14.1 | Routing theo 4 khu vực |
| Axios | 1.15.0 | HTTP client gọi API |
| Supabase JS | 2.103.3 | Auth client |
| Leaflet + React-Leaflet | 1.9.4 / 5.0.0 | Bản đồ tương tác |
| Recharts | 3.8.1 | Biểu đồ thống kê admin |
| Socket.io Client | 4.8.3 | Chat realtime |

Cách tổ chức source frontend:
- `pages/` — 50 trang chia theo: `public/`, `user/`, `guide/`, `admin/`, `chat/`.
- `components/` — Các component tái sử dụng.
- `services/` — 17 service gọi API backend.
- `contexts/` — AuthContext, SocketContext, ToastContext.
- `routes/` — Router chính, AuthGuard, RoleGuard.
- `layouts/` — PublicLayout, UserLayout, GuideLayout, AdminLayout.

## 2.3. Công nghệ backend

Dựa trên `backend/package.json` và source code:

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| NestJS | 11.0.1 | Framework backend |
| TypeScript | 5.7.3 | Type safety |
| Prisma | 7.7.0 | ORM cho PostgreSQL |
| Supabase JS | 2.103.3 | Auth verification |
| Socket.io | 4.8.3 | WebSocket server |
| Google Generative AI | 0.24.1 | AI chatbot |
| class-validator | 0.15.1 | DTO validation |
| class-transformer | 0.5.1 | Data transformation |
| Swagger | 11.3.0 | API documentation |

Tổ chức theo pattern Module/Controller/Service của NestJS:
- 20 module nghiệp vụ trong `backend/src/`.
- 21 controller file xử lý HTTP endpoint.
- AuthGuard kiểm tra JWT token từ Supabase.
- RoleGuard kiểm tra vai trò qua bảng `user_roles`.
- HttpExceptionFilter và TransformInterceptor chuẩn hóa response.

Bằng chứng: `backend/src/common/guards/auth.guard.ts`, `backend/src/common/guards/role.guard.ts`.

## 2.4. Cơ sở dữ liệu và quản lý dữ liệu

**Nền tảng:** PostgreSQL 15+ trên Supabase, quản lý qua Prisma ORM.

**Schema 38+ bảng public**, chia thành các nhóm:

| Nhóm | Bảng | Mục đích |
|------|------|----------|
| Tài khoản & Phân quyền | `users`, `roles`, `user_roles`, `user_role_change_logs` | Quản lý danh tính, vai trò |
| Hướng dẫn viên | `guide_profiles`, `guide_languages`, `guide_skills`, `guide_availabilities`, `guide_verification_requests`, `guide_verification_documents` | Hồ sơ, kỹ năng, xác minh HDV |
| Tour | `tours`, `tour_images`, `tour_locations`, `tour_schedules`, `tour_categories`, `tour_destinations` | Quản lý tour, lịch trình, ảnh |
| Yêu cầu & Đặt chỗ | `tour_requests`, `payment_transactions` | Đặt tour, thanh toán |
| Đồng hành | `companion_posts`, `companion_requests` | Bài tìm bạn, yêu cầu tham gia |
| Đánh giá & Yêu thích | `tour_reviews`, `guide_reviews`, `favorite_tours`, `favorite_guides` | Social proof |
| Báo cáo & Quản trị | `reports`, `report_processing_history`, `admin_activity_logs` | Xử lý vi phạm |
| Chat | `conversations`, `conversation_participants`, `messages` | Chat 1-1 và nhóm |
| AI | `ai_chat_sessions`, `ai_chat_messages` | Chatbot AI |
| Mở rộng | `partner_accommodations`, `tour_accommodations`, `notifications`, `user_activity_logs`, `user_preferences`, `user_preferred_categories` | Lưu trú, thông báo, gợi ý |
| Dữ liệu nền | `languages`, `skills`, `provinces`, `default_covers` | Danh mục tham chiếu |

Bằng chứng: `database/schema/SUPABASE_FINAL_SCHEMA-38_TABLES.sql`, `database/ERD.txt`, `backend/prisma/schema.prisma`.

## 2.5. Xác thực và phân quyền

**Cơ chế đăng nhập:** Supabase Auth cấp JWT token. Frontend lưu token trong session, gửi kèm header `Authorization: Bearer <token>` mỗi request.

**AuthGuard** (`backend/src/common/guards/auth.guard.ts`): Xác thực JWT token qua Supabase, trích xuất user ID.

**RoleGuard** (`backend/src/common/guards/role.guard.ts`): Kiểm tra vai trò user trong bảng `user_roles`, so sánh với decorator `@Roles()`.

**5 vai trò** (bằng chứng: `backend/src/common/enums/role.enum.ts`):
- `USER` — Người dùng/Khách du lịch.
- `GUIDE` — Hướng dẫn viên.
- `SYSTEM_ADMIN` — Quản trị viên hệ thống.
- `CONTENT_MODERATOR` — Kiểm duyệt nội dung.
- `SUPPORT_STAFF` — Nhân viên hỗ trợ.

Frontend kiểm tra quyền qua `AuthGuard.tsx` (yêu cầu đăng nhập) và `RoleGuard.tsx` (yêu cầu vai trò cụ thể).

## 2.6. Phân tích thiết kế bằng UML

Dựa trên tài liệu sprint và source code, hệ thống có thể mô hình hóa bằng:

- **Use Case Diagram:** 29 chức năng, 4 actor chính (Guest, User, Guide, Admin). Suy ra từ `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`.
- **ERD:** 38+ bảng với quan hệ rõ ràng. Bằng chứng: `database/ERD.txt`.
- **Activity Diagram:** Các luồng nghiệp vụ chính (đặt tour, duyệt yêu cầu, xử lý báo cáo). Suy ra từ state machine trong source code.
- **Sequence Diagram:** Luồng xác thực, đặt tour + thanh toán. Suy ra từ controller/service interaction.

## 2.7. Các phương pháp giải quyết vấn đề trong hệ thống

| Vấn đề | Phương pháp | Trạng thái |
|--------|-------------|------------|
| Tìm kiếm/lọc tour | Query với filter theo địa điểm, giá, loại hình, thời gian | Đã làm thật |
| Quản lý trạng thái tour request | State machine: pending → approved/rejected → paid → completed | Đã làm thật |
| Quản lý trạng thái bài đồng hành | State: open → closed/completed | Đã làm thật |
| Quản lý báo cáo vi phạm | Luồng: gửi → admin xem xét → xử lý → ghi log | Đã làm thật |
| Đánh giá/yêu thích | Rating 1-5 sao + bình luận, toggle yêu thích | Đã làm thật |
| Thông báo | Notification trong DB, hiển thị frontend | Đã làm thật |
| Chat realtime | WebSocket (Socket.io), lưu message vào DB | Đã làm thật |
| AI chatbot | Google Gemini API, lưu session/message | Đã làm thật |
| Gợi ý tour | Rule-based dựa trên user_preferences | Đã làm (rule-based) |
| Thanh toán | VNPAY Sandbox, IPN callback | Đã làm (sandbox) |

## 2.8. Các ràng buộc nghiệp vụ

Tổng hợp từ source code và database schema:
- User chỉ sửa hồ sơ của chính mình (AuthGuard kiểm tra user ID).
- Guide chỉ quản lý tour do mình tạo (kiểm tra `guide_id` trong service).
- User gửi yêu cầu tham gia tour (tạo record trong `tour_requests`).
- Guide duyệt/từ chối request thuộc tour mình quản lý.
- Chủ bài đồng hành duyệt/từ chối companion request.
- Admin xử lý nội dung và báo cáo vi phạm, ghi log.
- Tour có trạng thái: draft, published, closed, completed.
- Tour request có trạng thái: pending, approved, rejected, paid, cancelled, completed.
- Report có trạng thái xử lý và lịch sử xử lý.
- Payment transaction ghi nhận loại thanh toán (full/deposit), trạng thái (pending/success/failed).

Bằng chứng: `database/schema/SUPABASE_FINAL_SCHEMA-38_TABLES.sql` (check constraints), `backend/src/tours/tours.service.ts`, `backend/src/tour-requests/tour-requests.controller.ts`.

---

# CHƯƠNG 3. KẾT QUẢ THỰC NGHIỆM

## 3.1. Môi trường thực nghiệm

| Thành phần | Chi tiết |
|------------|---------|
| Frontend | React 19 + TypeScript + Vite 8, chạy `npm run dev` (port 5173) |
| Backend | NestJS 11 + TypeScript + Prisma 7, chạy `npm run start:dev` (port 3000) |
| Database | PostgreSQL trên Supabase (cloud) |
| Auth | Supabase Auth (JWT + Google OAuth) |
| Node.js | v18+ |
| Lệnh cài đặt Backend | `cd backend && npm install && npx prisma generate && npm run start:dev` |
| Lệnh cài đặt Frontend | `cd frontend && npm install && npm run dev` |
| Seed dữ liệu | 14+ file SQL trong `database/seed/` |

## 3.2. Kết quả xây dựng kiến trúc source code

Dự án tổ chức thành 5 thư mục chính:
- **frontend/** — React app với 50 trang, 17 service, 3 context, 4 layout.
- **backend/** — NestJS app với 20 module, 21 controller, Prisma schema 65 model.
- **database/** — Schema SQL 38+ bảng, RLS policies, 14+ file seed.
- **docs/** — Tài liệu sprint (3 file).
- **SESSION_SPRINT/** — 25+ file tài liệu quản lý dự án theo 14 sprint.

## 3.3. Kết quả xây dựng cơ sở dữ liệu

- **Tổng số bảng public schema:** 42 bảng (không tính auth schema của Supabase).
- **Bảng lõi:** `users`, `roles`, `user_roles`, `guide_profiles`, `tours`, `tour_requests`, `companion_posts`, `companion_requests`.
- **Bảng mở rộng:** `conversations`, `messages`, `ai_chat_sessions`, `payment_transactions`, `partner_accommodations`, `notifications`.
- **Bảng danh mục:** `languages`, `skills`, `provinces`, `tour_categories`, `default_covers`.
- **Dữ liệu seed:** 14+ file bao gồm tài khoản demo, tour mẫu, dữ liệu HDV, bài đồng hành, chat, admin data, premium demo data.
- **Ràng buộc:** Check constraints cho gender, status, role_code; Foreign keys đầy đủ; RLS policies.

Bằng chứng: `database/schema/SUPABASE_FINAL_SCHEMA-38_TABLES.sql`, `database/ERD.txt`.

## 3.4. Kết quả xây dựng backend API

### Tổng quan: 20 module, 21 controller

| Module | Controller | Chức năng chính | Bảng liên quan | Trạng thái |
|--------|-----------|-----------------|----------------|------------|
| auth | — (Supabase Auth) | Đăng ký, đăng nhập, JWT | auth.users | Đã làm được |
| users | users.controller, public-users.controller | CRUD hồ sơ user | public.users | Đã làm được |
| roles | — (module only) | Quản lý vai trò | roles, user_roles | Đã làm được |
| tours | tours.controller | CRUD tour, lọc, tìm kiếm | tours, tour_images, tour_locations, tour_schedules | Đã làm được |
| guides | guides.controller | CRUD hồ sơ HDV | guide_profiles, guide_languages, guide_skills | Đã làm được |
| guide-verification | guide-verification.controller | Gửi/duyệt xác minh HDV | guide_verification_requests, guide_verification_documents | Đã làm được |
| tour-requests | tour-requests.controller | Gửi/duyệt yêu cầu tham gia | tour_requests | Đã làm được |
| companion-posts | companion-posts.controller | CRUD bài đồng hành, request | companion_posts, companion_requests | Đã làm được |
| reports | reports.controller | Gửi/xử lý báo cáo vi phạm | reports, report_processing_history | Đã làm được |
| reviews | reviews.controller | Đánh giá tour và HDV | tour_reviews, guide_reviews | Đã làm được |
| favorites | favorites.controller | Yêu thích tour/HDV | favorite_tours, favorite_guides | Đã làm được |
| notifications | notifications.controller | Quản lý thông báo | notifications | Đã làm được |
| admin | admin.controller | Dashboard, quản lý user/tour | Nhiều bảng | Đã làm được |
| chat | conversation.controller, message.controller | Chat 1-1 và nhóm | conversations, messages | Đã làm được |
| ai-chat | ai-chat.controller | AI chatbot | ai_chat_sessions, ai_chat_messages | Đã làm được |
| recommendations | recommendations.controller | Gợi ý tour | user_preferences | Đã làm một phần (rule-based) |
| accommodations | accommodations.controller | Thông tin lưu trú | partner_accommodations | Đã làm một phần |
| payments | payments.controller | Thanh toán VNPAY | payment_transactions | Đã làm được (sandbox) |
| user-activity-logs | user-activity-logs.controller | Lịch sử hoạt động | user_activity_logs | Đã làm được |
| socket | socket.gateway | WebSocket realtime | — | Đã làm được |

## 3.5. Kết quả xây dựng frontend

### Public Area (Khách truy cập)
| Màn hình | File | Chức năng | API/Service |
|----------|------|-----------|-------------|
| Trang chủ | HomePage.tsx | Tour nổi bật, tìm kiếm, gợi ý | tourService, recommendationService |
| Danh sách tour | TourListPage.tsx | Lọc/tìm tour | tourService |
| Chi tiết tour | TourDetailPage.tsx | Xem chi tiết, đánh giá, đặt tour | tourService, reviewService |
| Bản đồ tour | TourMapPage.tsx | Lộ trình trên Leaflet | tourService |
| Đặt tour | TourBookingPage.tsx | Form đặt chỗ | tourRequestService, paymentService |
| Danh sách HDV | GuideListPage.tsx | Xem HDV | guideService |
| Chi tiết HDV | GuideDetailPage.tsx | Hồ sơ HDV chi tiết | guideService, reviewService |
| Danh sách đồng hành | CompanionListPage.tsx | Xem bài tìm bạn | companionService |
| Chi tiết đồng hành | CompanionDetailPage.tsx | Xem chi tiết, gửi yêu cầu | companionService |
| Đăng nhập | LoginPage.tsx | Email/Google OAuth | AuthContext (Supabase) |
| Đăng ký | RegisterPage.tsx | Tạo tài khoản | AuthContext (Supabase) |
| Quên/Reset MK | ForgotPasswordPage, VerifyOtpPage, ResetPasswordPage | Khôi phục tài khoản | Supabase Auth |
| Hồ sơ công khai | PublicProfilePage.tsx | Xem profile user khác | userService |

### User Area (Người dùng đã đăng nhập)
| Màn hình | File | Chức năng |
|----------|------|-----------|
| Hồ sơ cá nhân | ProfilePage.tsx | Sửa thông tin cá nhân |
| Quản lý booking | BookingManagementPage.tsx | Tour requests + companion requests + transactions |
| Bài đồng hành của tôi | MyCompanionPostsPage.tsx | Quản lý bài đã đăng |
| Tạo/sửa bài ĐH | CompanionFormPage.tsx | Form tạo/sửa |
| Quản lý yêu cầu ĐH | CompanionRequestManagementPage.tsx | Duyệt/từ chối |
| Yêu thích | FavoritesPage.tsx | Tour/HDV đã lưu |
| Thông báo | NotificationsPage.tsx | Danh sách thông báo |
| Lịch sử hoạt động | ActivityLogsPage.tsx | Nhật ký |
| Chat | ChatPage.tsx | Chat 1-1 và nhóm |
| AI Chatbot | AiChatPage.tsx | Trợ lý AI |
| VNPAY Return | VnpayReturnPage.tsx | Xử lý callback thanh toán |

### Guide Area (Hướng dẫn viên)
| Màn hình | File | Chức năng |
|----------|------|-----------|
| Dashboard | GuideDashboardPage.tsx | Tổng quan thống kê |
| Hồ sơ HDV | GuideProfilePage.tsx | Sửa thông tin HDV |
| Xác minh | GuideVerificationPage.tsx | Gửi hồ sơ xác minh |
| Tour của tôi | MyToursPage.tsx | Danh sách tour |
| Tạo tour | TourFormPage.tsx | Multi-step form tạo tour |
| Quản lý tour | TourManagementPage.tsx | Sửa/cập nhật tour |
| Lịch trình | TourItineraryPage.tsx | Quản lý itinerary |
| Ảnh tour | TourImagesPage.tsx | Upload/quản lý ảnh |
| Lịch tour | TourScheduleDetailPage.tsx | Chi tiết lịch khởi hành |
| Yêu cầu tham gia | GuideRequestsPage.tsx | Duyệt/từ chối booking |

### Admin Area (Quản trị viên)
| Màn hình | File | Chức năng |
|----------|------|-----------|
| Dashboard | AdminDashboardPage.tsx | Thống kê tổng quan (Recharts) |
| Quản lý user | AdminUserManagementPage.tsx | Khóa/mở khóa tài khoản |
| Quản lý tour | AdminTourManagementPage.tsx | Kiểm duyệt tour |
| Quản lý ĐH | AdminCompanionManagementPage.tsx | Kiểm duyệt bài ĐH |
| Duyệt HDV | AdminVerificationPage.tsx | Xét duyệt hồ sơ HDV |
| Báo cáo VP | AdminReportManagementPage.tsx | Xử lý báo cáo vi phạm |
| Đánh giá | AdminReviewManagementPage.tsx | Kiểm duyệt review |
| Nhật ký | AdminActivityLogPage.tsx | Activity log hệ thống |

## 3.6. Hồ sơ thiết kế phần mềm

| Hồ sơ | Trạng thái | Bằng chứng |
|-------|------------|------------|
| Danh sách 29 chức năng | Có | `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md` |
| Danh sách 47 màn hình | Có | `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`, `frontend/src/pages/` |
| ERD 38+ bảng | Có | `database/ERD.txt`, `database/schema/SUPABASE_FINAL_SCHEMA-38_TABLES.sql` |
| Prisma Schema | Có | `backend/prisma/schema.prisma` (65 model) |
| Mapping FE/BE/DB | Có | Đối chiếu `routes/index.tsx`, controllers, schema |
| Sprint planning | Có | `SPRINT_MASTER.md`, `SPRINT_01.md` → `SPRINT_14.md` |
| Session logs | Có | `SESSION_LOG.md` (29+ session entries) |

## 3.7. Các luồng thực nghiệm chính đã kiểm tra

| Luồng demo | Actor | Frontend | Backend | Database | Kết quả | Hạn chế |
|-----------|-------|----------|---------|----------|---------|---------|
| Đăng ký/Đăng nhập/Phân quyền | Guest→User | RegisterPage, LoginPage, RoleSelectionPage | auth module, Supabase Auth | auth.users, users, user_roles | ✅ Hoạt động | Google OAuth cần cấu hình domain |
| Xem/Tìm kiếm tour | Guest/User | HomePage, TourListPage, TourDetailPage | tours.controller | tours, tour_images, provinces | ✅ Hoạt động | Không có |
| HDV tạo/quản lý tour | Guide | TourFormPage, MyToursPage, TourManagementPage | tours.controller | tours, tour_images, tour_schedules | ✅ Hoạt động | Không có |
| Đặt tour + Thanh toán | User→Guide | TourBookingPage, VnpayReturnPage | tour-requests, payments | tour_requests, payment_transactions | ✅ Sandbox | Thẻ test VNPAY |
| Tìm bạn đồng hành | User↔User | CompanionFormPage, CompanionListPage | companion-posts.controller | companion_posts, companion_requests | ✅ Hoạt động | Không có thanh toán riêng |
| Chat 1-1 và nhóm | User↔Guide | ChatPage | conversation, message, socket | conversations, messages | ✅ Hoạt động | Chưa gửi file/ảnh |
| AI Chatbot | User | AiChatPage | ai-chat.controller | ai_chat_sessions | ✅ Hoạt động | Cần API key Gemini |
| Quản trị hệ thống | Admin | AdminDashboard, AdminUserMgmt, AdminReportMgmt | admin.controller, reports.controller | users, reports, tours | ✅ Hoạt động | Chưa phân quyền chi tiết CM/SS |
| Đánh giá tour/HDV | User | TourDetailPage, GuideDetailPage | reviews.controller | tour_reviews, guide_reviews | ✅ Hoạt động | Modal đang hoàn thiện |
| Yêu thích | User | FavoritesPage | favorites.controller | favorite_tours, favorite_guides | ✅ Hoạt động | Không có |
| Xác minh HDV | Guide→Admin | GuideVerificationPage, AdminVerificationPage | guide-verification.controller | guide_verification_requests | ✅ Hoạt động | Không có |

## 3.8. Kết quả đạt được theo nhóm chức năng

| Nhóm chức năng | Kết quả đạt được | Bằng chứng source/tài liệu | Đánh giá |
|---------------|------------------|----------------------------|----------|
| Tài khoản & Phân quyền | Đăng ký, đăng nhập, 5 vai trò, quản lý hồ sơ | auth module, AuthGuard, RoleGuard, 6 trang | Đầy đủ |
| Tour du lịch | Xem, tìm kiếm, lọc, tạo, quản lý, lịch trình, ảnh, bản đồ | tours module, 10+ trang, 6+ bảng | Đầy đủ |
| Hướng dẫn viên | Hồ sơ, danh sách, chi tiết, dashboard, xác minh | guides + guide-verification module, 5+ trang | Đầy đủ |
| Yêu cầu tham gia tour | Gửi, duyệt, từ chối, thanh toán, quản lý | tour-requests + payments module, 3+ trang | Đầy đủ |
| Bài đồng hành | Tạo, xem, quản lý, gửi/duyệt yêu cầu | companion-posts module, 5+ trang | Đầy đủ |
| Quản trị hệ thống | Dashboard, user mgmt, tour mgmt, report mgmt, verification | admin module, 8 trang admin | Đầy đủ |
| Báo cáo vi phạm | Gửi báo cáo, admin xử lý | reports module, nút báo cáo trên CompanionDetailPage | Đầy đủ |
| Đánh giá/Yêu thích | Rating 5 sao, bình luận, lưu yêu thích | reviews + favorites module, FavoritesPage | Đầy đủ |
| Chat | Chat 1-1 (User↔Guide), chat nhóm (đồng hành) | chat module, SocketGateway, ChatPage | Đầy đủ |
| AI Chatbot | Trò chuyện AI hỗ trợ du lịch | ai-chat module (Google Gemini), AiChatPage | Hoạt động, chưa tích hợp dữ liệu nội bộ |
| Thanh toán | VNPAY Sandbox (full/deposit), IPN callback | payments module, VnpayReturnPage | Sandbox |
| Gợi ý tour | Rule-based recommendation | recommendations module | Rule-based |
| Lưu trú | API quản lý accommodation | accommodations module | Backend only, thiếu frontend riêng |

## 3.9. Hạn chế còn tồn tại

1. **Thanh toán VNPAY** chỉ ở mức sandbox, chưa tích hợp production merchant account.
2. **AI Chatbot** dùng Google Gemini trả lời chung, chưa query dữ liệu tour/guide trong hệ thống (chưa RAG).
3. **Recommendation** là rule-based (dựa trên sở thích), chưa dùng ML (collaborative/content-based filtering).
4. **Module accommodation** có backend API nhưng chưa có trang frontend chuyên dụng.
5. **Kiểm thử tự động** chưa có unit test/e2e test đáng kể ngoài file mặc định NestJS.
6. **Phân quyền admin chi tiết** giữa CONTENT_MODERATOR và SUPPORT_STAFF chưa phân biệt ở frontend.
7. **Chat** chưa hỗ trợ gửi file/ảnh, chưa có typing indicator.
8. **Chưa triển khai production** — dự án chạy ở localhost.
9. **Modal đánh giá** tour/HDV sau chuyến đi đang hoàn thiện ở Sprint 14.

## 3.10. Định hướng phát triển tiếp theo

1. Hoàn thiện realtime chat: gửi file/ảnh, typing indicator, read receipt.
2. Tích hợp thanh toán VNPAY production với merchant account thật.
3. Nâng cấp recommendation engine từ rule-based lên collaborative filtering hoặc content-based filtering.
4. Tích hợp RAG (Retrieval-Augmented Generation) cho AI chatbot để trả lời dựa trên dữ liệu tour thật.
5. Cải thiện quản trị: phân quyền chi tiết CONTENT_MODERATOR/SUPPORT_STAFF, dashboard analytics nâng cao.
6. Bổ sung kiểm thử tự động: unit test cho backend module lõi, e2e test cho luồng chính.
7. Triển khai production: Vercel (frontend) + Railway/Render (backend) + Supabase (database).
8. Phát triển ứng dụng mobile (React Native) cho người dùng cuối.
9. Tối ưu hiệu năng: caching, lazy loading, image optimization.
10. Nâng cấp bảo mật: rate limiting, input sanitization, CSRF protection.

---

# KẾT LUẬN

## 1. Kết quả đạt được

Đồ án đã xây dựng thành công website TravelConnectVN — nền tảng du lịch kết nối khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành, với các kết quả chính:

- **Kiến trúc hệ thống:** Frontend ReactJS + Backend NestJS + Database PostgreSQL/Supabase hoạt động đồng bộ, có khả năng mở rộng.
- **Cơ sở dữ liệu:** 42 bảng public schema với ràng buộc toàn vẹn, check constraints, RLS policies và 14+ file dữ liệu seed phục vụ demo.
- **Backend API:** 20 module NestJS với 21 controller, hệ thống xác thực JWT/Supabase Auth và phân quyền RBAC 5 vai trò.
- **Frontend:** 50 trang giao diện phân theo 4 khu vực (Public/User/Guide/Admin), 17 service gọi API, 3 context quản lý state.
- **Tích hợp nâng cao:** Chat realtime (WebSocket), AI chatbot (Google Gemini), bản đồ tương tác (Leaflet), thanh toán (VNPAY Sandbox), biểu đồ thống kê (Recharts).
- **Tài liệu:** Hệ thống tài liệu quản lý dự án theo 14 sprint, ERD, spec v3 và session log chi tiết.

## 2. Đóng góp của đề tài

- Xây dựng nền tảng kết nối ba nhóm đối tượng (khách du lịch, HDV, người tìm bạn đồng hành) trong cùng một hệ thống.
- Tổ chức nghiệp vụ theo vai trò với hệ thống phân quyền RBAC 5 cấp.
- Triển khai đầy đủ các luồng nghiệp vụ: quản lý tour, đặt chỗ, thanh toán, đồng hành, đánh giá, báo cáo vi phạm.
- Hỗ trợ quản trị viên kiểm duyệt nội dung, xác minh HDV và xử lý báo cáo.
- Tạo nền tảng mở rộng cho AI/chat/payment/lưu trú, sẵn sàng phát triển tiếp.

## 3. Hạn chế

- Thanh toán VNPAY chỉ ở chế độ sandbox, chưa giao dịch tiền thật.
- AI chatbot dùng Google Gemini trả lời kiến thức chung, chưa tích hợp sâu dữ liệu tour nội bộ.
- Recommendation engine là rule-based, phù hợp đồ án nhưng chưa đạt mức sản phẩm thương mại.
- Kiểm thử tự động chưa đầy đủ, chủ yếu kiểm thử thủ công.
- Chưa triển khai production, dự án hoạt động ở môi trường localhost.
- Một số chức năng nâng cao (module accommodation, phân quyền chi tiết admin) chưa hoàn thiện 100%.

## 4. Kiến nghị và hướng phát triển

- Hoàn thiện kiểm thử tự động cho các module lõi để đảm bảo chất lượng phần mềm.
- Tăng cường bảo mật: rate limiting, CSRF protection, input sanitization.
- Nâng cấp trải nghiệm người dùng: responsive design, micro-animations, dark mode.
- Tích hợp dịch vụ thanh toán thật (VNPAY production hoặc các cổng khác).
- Nâng cấp AI chatbot bằng RAG để trả lời chính xác dựa trên dữ liệu tour thực tế.
- Triển khai thực tế trên cloud (Vercel + Railway + Supabase) phục vụ người dùng cuối.
- Phát triển ứng dụng mobile bổ sung cho trải nghiệm đa nền tảng.

---

*Báo cáo này được tạo tự động dựa trên phân tích source code thực tế của dự án TravelConnectVN. Mọi nhận định đều có bằng chứng từ file/thư mục tương ứng trong repository.*
