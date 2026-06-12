# Working Context - TravelConnect VN

Last updated: 2026-06-07

## Purpose
Dự án **TravelConnect VN** là nền tảng kết nối khách du lịch với hướng dẫn viên địa phương tại Việt Nam. Dự án cung cấp hệ sinh thái quản lý toàn diện bao gồm quản trị hệ thống (System Admin), kiểm duyệt nội dung (Content Moderator), kế toán tài chính (Accountant) và hỗ trợ khách hàng (Support Staff).

---

## Current Truth
- **Nhánh chính:** `develop` / `main`
- **Technology Stack:**
  - **Frontend:** React (Vite), TypeScript, Tailwind CSS, Playwright (E2E Testing).
  - **Backend:** NestJS, TypeScript, Prisma ORM, Jest (Unit Testing), Socket.io.
  - **Database:** PostgreSQL.
  - **AI Integration:** Gemini API (phục vụ AI Moderation, Chatbot, Content Analysis).
- **Trạng thái Code:** Đã hoàn thành bộ khung nền tảng, các tính năng cho Admin, Guide, User. Đang trong giai đoạn hoàn thiện các Role chuyên sâu (Enterprise Features).

---

## Current Constraints
- **Quy tắc Git Commit:** Tuân thủ Conventional Commits và tạo branch theo chuẩn (`feat/xxx`, `fix/xxx`, `docs/xxx`).
- **Quy trình làm việc Git:** Tự động tạo nhánh feature/bugfix từ `develop`, commit và tạo Pull Request bằng GitHub CLI.
- **Quy tắc Ngôn ngữ:** Tên biến/hàm và comment code bằng tiếng Anh. Giao diện (UI) và phản hồi người dùng bằng tiếng Việt.
- **Chất lượng Code:** Áp dụng Karpathy Principles (Suy nghĩ trước khi code, Thay đổi tối thiểu, Đơn giản là nhất).
- **Kiểm thử:** Mọi logic quan trọng (nhất là Backend) phải đi kèm Unit Test. Không dùng browser QA bot để test tự động mà phải dùng Playwright/Jest.

---

## 🚀 Active Queues (Tác vụ đang chờ/Đang xử lý)

- [x] Tính năng Recommendation Engine (Gợi ý Tour)
  - [x] Tạo `RecommendationModule` (NestJS) lấy tour qua Redis/Collaborative Filtering giả lập
  - [x] Bổ sung caching bằng `cache-manager`
  - [x] Tích hợp với Frontend (React) trên `HomePage.tsx`
  - [x] Thêm API track hành vi người dùng "VIEW", "BOOK", "FAVORITE"

- [x] Đa ngôn ngữ (i18n)
  - [x] Thiết lập `i18next` ở React
  - [x] Header Language Switcher

- [x] Tối ưu Hiệu năng & Kiểm toán Bảo mật (Performance & Security Phase)
  - [x] Bổ sung `@@index` Database (Prisma) giảm thiểu Full Table Scan.
  - [x] Kiểm định code splitting (React.lazy).
  - [x] Xác thực Rate Limiting toàn cầu với `@nestjs/throttler`.
  - [x] Xác thực `ValidationPipe` whitelist chặn payload rác.
  - [x] Pass toàn bộ Backend (105 tests) và Frontend (9 E2E tests).

- [x] Tài liệu & Bàn giao (Docs Phase)
  - [x] Hoàn thiện Swagger API (đã được setup sẵn tại `/api/docs`)
  - [x] Làm mới `README.md` chuyên nghiệp với Role details và Badges
  - [x] Soạn thảo `ADR-0002` về việc chia tách 4 Role Backoffice

---

## 📝 Latest Execution Notes

- **07/06/2026:** Hoàn thành triển khai Phase Performance & Security:
  - Bổ sung Index vào `schema.prisma` cho các bảng heavy `public_users`, `tour_requests`, `payment_transactions` để tối ưu truy vấn.
  - Kiểm toán cấu hình bảo mật `ThrottlerModule` và `ValidationPipe` đã được thiết lập nghiêm ngặt từ trước, đáp ứng chuẩn Enterprise.
  - Đã chạy 100% tests (Backend Jest & Frontend Playwright) pass xanh mượt mà, xác minh không lỗi lầm.
  - Đã tạo PR lên `develop` (PR #88) thông qua quy trình Automation Git cực nhanh.

- **07/06/2026:** Hoàn thành triển khai Phase 3 (Frontend):
  - Thiết lập `i18next`, cấu hình ngôn ngữ VI/EN.
  - Tích hợp `LanguageSwitcher` vào `PublicHeader.tsx`.
  - Hiển thị danh sách "Gợi Ý Dành Riêng Cho Bạn" trên `HomePage.tsx`.
  - Bổ sung `trackActivity` gọi API Tracking mỗi khi người dùng xem `TourDetailPage.tsx`.
  - Frontend build thành công. Hoàn thiện xong tính năng Cốt lõi (AI & Trải nghiệm).
  - Viết thêm E2E test `home-i18n-recommendations.spec.ts` kiểm thử Playwright cho i18n pass 100% (9/9 suites pass).
  - Tạo PR #82 trên Github cho toàn bộ nhánh `feat/ai-recommendation-i18n`.

### 2026-06-06
* **Date**: 2026-06-06
* **Component**: Backend Backoffice & Unit Tests
* **Action**: Sửa lỗi Dependency Injection trong `ai-moderation` và `reviews` module, đạt 100% Pass Rate cho toàn bộ Unit Tests. Tái cấu trúc `MaintenanceGuard` để sử dụng cấu hình từ bảng `system_settings` trong DB thay vì In-Memory. Xác minh logic trừ điểm uy tín (Reputation) đã được triển khai đầy đủ.
* **Status**: Completed

### 2026-06-07 (SYSTEM_ADMIN Phase 1.x Debug & Refactor)
- **Rà soát & Sửa lỗi (Refactoring) cho module `admin` và `support`:**
  - Chạy `npm run lint` và khắc phục triệt để ~60 lỗi TypeScript (chủ yếu là `any` type usage) trong `admin.service.ts`, `ai-moderation.service.ts` và loại bỏ các biến `params` không sử dụng ở `support.service.ts`.
  - Giảm số lượng lint errors của module admin từ 58 xuống 0, nâng cao độ an toàn (Type Safety).
  - Cập nhật Unit Tests trong `admin.service.spec.ts` cho các hàm mới như `getSystemHealth()` và `createCategory()`, đảm bảo pass 100% khi chạy `npm run test -- admin`.

### 2026-06-07 (SYSTEM_ADMIN Phase 1.1)
- **Hoàn thành Role SYSTEM_ADMIN (Cấu hình hệ thống & Sức khỏe hệ thống):**
  - Tạo model `system_settings` trong `schema.prisma` để lưu trữ biến cấu hình toàn cục (như Commission Rate).
  - Viết logic và API endpoint trong `AdminController` và `AdminService` cho:
    - Quản lý Global Settings (`GET /admin/settings/:key`, `PATCH /admin/settings/:key`).
    - Quản lý Dictionaries động (ngôn ngữ, kỹ năng, tỉnh/thành, thể loại tour) qua `PrismaService`.
    - Lấy thông tin sức khỏe hệ thống (System Health) báo cáo trạng thái DB và External APIs (`GET /admin/system/health`).
  - Xây dựng giao diện `AdminSettingsPage.tsx` tích hợp đầy đủ UI cấu hình chiết khấu và danh mục (CRUD table với Tabs).
  - Cập nhật `AdminDashboardPage.tsx` hiển thị Dashboard Sức khỏe hệ thống với ping latency và Storage Usage.
  - Cập nhật `routes/index.tsx` và `AdminSidebar.tsx` để truy cập trang Settings. Đã verify frontend build không lỗi kiểu.

### 2026-06-07
  - Tạo mới hoàn toàn backend module `support` thay vì dùng chung `admin`.
  - Xây dựng hệ thống API cho Quản lý Tickets, Giải quyết tranh chấp (kèm logic thông báo tự động và hoàn tiền), Gửi thông báo diện rộng Broadcast, và Quản lý câu hỏi thường gặp FAQ.
  - Triển khai thành công các tính năng nâng cao (Phase 3.2):
    - **SOS Dashboard**: Di dời hệ thống quản lý tín hiệu cầu cứu SOS từ `/admin/sos` sang `/support/sos`, tích hợp đầy đủ với Frontend `SupportDashboardPage`.
    - **CSAT Analytics**: Xây dựng API thống kê hiệu suất giải quyết ticket/tranh chấp của nhân viên, thời gian xử lý trung bình và Leaderboard.
    - **Agent Co-Pilot**: Tích hợp Google Gemini sinh tự động câu trả lời và phán quyết gợi ý dựa trên ngữ cảnh tranh chấp, bổ sung nút "🤖 AI Gợi ý" trên màn hình xử lý khiếu nại.
  - Cập nhật Frontend API để map với các endpoint `/support/...` mới.
  - Đã vá lỗi bảo mật (AuthGuard) cho module Kế toán (`FinanceController`).

- **Hoàn thành Role ACCOUNTANT (Kế toán & Tài chính):**
  - **Smart Auto-Reconciliation (Đối soát tự động):** Xây dựng trang `FinanceReconciliationPage` trên frontend dùng `papaparse` parse CSV mượt mà; Backend triển khai `ReconciliationService` tự động khớp mã giao dịch, phát hiện lệch tiền, thiếu/thừa giao dịch.
  - **Automated E-Invoicing (Hóa đơn điện tử):** Thêm model `invoices` vào Prisma schema. Cập nhật `InvoiceService` và giao diện `FinanceTransactionsPage` để cho phép kế toán bấm nút "Xuất Hóa đơn điện tử" ngay trên lưới giao dịch.
  - **Cashflow Forecasting (Dự báo dòng tiền):** Tạo biểu đồ Recharts trong `FinanceForecastingPage`, lọc và tính toán tiền thực thu (Platform Fee 10%) và tiền phải trả HDV (90%) qua `CashflowForecastingService`.
  - **Refunds & Settlements:** Hoàn thiện giao diện duyệt yêu cầu Hoàn tiền (`FinanceRefundsPage`) và tạo lệnh Quyết toán thủ công cho HDV (`FinanceSettlementsPage`).
  - Đã chạy qua toàn bộ Backend Unit Tests (`finance` module) đạt 100% Pass và bổ sung E2E test bằng Playwright (`finance.spec.ts`). Đã tạo Pull Request `#74` trên nhánh `feat/accountant-role`.

### 2026-06-07 (Security & Deployment CI/CD)
- **Tổng kiểm tra Bảo mật (Security Audit):**
  - Chạy `npm audit fix` trên Backend và Frontend để vá các lỗ hổng (như RCE, Prototype Pollution) của `axios` và `ws`.
  - Cài đặt `helmet` cho Backend để bổ sung 11 HTTP Security Headers (CSP, HSTS, XSS Filter).
  - Khóa chặt cấu hình CORS tại `main.ts`, loại bỏ `Access-Control-Allow-Origin: *` và chỉ cho phép `FRONTEND_URL` truy cập.
- **Tối ưu Docker & Thiết lập CI/CD:**
  - Chuyển đổi `Dockerfile` của Backend sang sử dụng `USER node` (non-root) và ghim phiên bản `node:20.12.0-alpine`.
  - Chuyển Frontend sang dùng `nginxinc/nginx-unprivileged:alpine-slim` chạy ở port 8080 (non-root).
  - Tạo `docker-compose.yml` để dễ dàng khởi chạy toàn bộ stack cục bộ (Frontend, Backend, Redis).
  - Viết luồng GitHub Actions CI tại `.github/workflows/ci.yml` tự động cài đặt, chạy Linting, Unit Testing và build Docker. Toàn bộ `Active Queues` của dự án đã chính thức được hoàn tất!

### 2026-06-07 (Chat Real-time)
- **Hoàn thành hệ thống Chat Real-time (User-Guide Messaging):**
  - Cấu hình Backend tích hợp `Redis Adapter` cho NestJS WebSocket (Sẵn sàng cho việc scale nhiều instance).
  - Viết API `POST /chat/media` kết nối tới bucket `chat-media` của Supabase Storage để nhận ảnh và voice record thay vì lưu ổ đĩa local.
  - Cập nhật `chat.service.ts` để lưu type của message (text/image/audio) và URL đính kèm.
  - Nâng cấp Frontend `ChatInput.tsx` để hỗ trợ upload ảnh và thu âm Mic trực tiếp bằng `MediaRecorder`.
  - Hoàn thiện UI `ChatWindow.tsx` hiển thị bong bóng chat với thẻ `<img>` và `<audio controls>`.
  - Tạo PR `#77` trên nhánh `feat/realtime-chat`. Khẳng định dự án đã có đầy đủ tính năng cốt lõi cho môi trường Marketplace du lịch.

### 2026-06-07 (Security Audit - Rate Limiting & File Validation)
- **Vá lỗ hổng bảo mật nghiêm trọng trên API Upload & Webhook:**
  - Bổ sung `@Throttle` cho `uploadMedia` (10 reqs/min) và VNPAY Webhook `vnpay-ipn` (50 reqs/min) để chống Spam/DDoS.
  - Tích hợp `ParseFilePipe`, `MaxFileSizeValidator` (10MB) và `FileTypeValidator` cho endpoint `POST /chat/media`.
  - Từ nay API chỉ chấp nhận file ảnh (`.png`, `.jpg`, `.webp`) và âm thanh (`.mp3`, `.wav`, `.webm`, `.m4a`), ngăn chặn triệt để nguy cơ user upload file thực thi độc hại (`.exe`, `.sh`) lên Supabase Storage.
  - Chạy `npm audit fix` trên backend để vá các lỗ hổng dependency từ `@hono/node-server`.
  - Backend đã build và pass 100% tests thành công. Đã commit và push các bản vá bảo mật.

### 2026-06-07 (Performance Optimization)
- **Tối ưu hóa hiệu năng tải trang (Frontend Code Splitting):**
  - Viết script tự động thay thế 69 import tĩnh thành `React.lazy()` cho các trang (Pages) nằm trong các Layouts (Admin, Content, Support, Finance, Guide, User) tại `routes/index.tsx`.
  - Áp dụng `<Suspense fallback={<LoadingSpinner/>}>` bọc các Layouts chính.
  - Chạy `npm run build` thành công, chia nhỏ file main bundle (index.js) từ vài MB xuống còn 120KB (gzipped) và tạo ra >80 chunk files nhỏ, giúp ứng dụng load tức thì.
- **Tối ưu hóa Backend (Redis Caching):**
  - Áp dụng `@UseInterceptors(CacheInterceptor)` vào endpoint `GET /system-settings/public` để cache cấu hình hệ thống toàn cục, giảm tải truy vấn lặp đi lặp lại vào CSDL.
  - Cập nhật `README.md` chuyên nghiệp với Tech Stack, badges và hướng dẫn khởi chạy nhanh bằng Docker Compose.
  - Tự động hóa Swagger API Docs: Viết script Node.js quét và gán tự động `@ApiTags` vào toàn bộ 24 Controllers của Backend. Swagger UI giờ đã có phân nhóm rõ ràng (Tours, Admin, Chat, Payments...).
  - Biên soạn `docs/USER_MANUAL.md` (Sổ tay vận hành) hướng dẫn các tác vụ cho Accountant, Support Staff và Content Moderator.
  - Viết 3 tệp tin `Architecture Decision Records (ADRs)` giải thích các quyết định kiến trúc cốt lõi: Sử dụng Prisma, Supabase Storage và phân tách 4 role Backoffice.

### 2026-06-07 (End-to-End Testing & CI/CD)
- **Tích hợp Kiểm thử Tự động Playwright:**
  - Cập nhật kịch bản `booking.spec.ts` kiểm thử toàn diện luồng người dùng từ đăng nhập, truy cập danh sách Tour, đến hoàn tất thanh toán.
  - Xây dựng kịch bản mới `chat-support.spec.ts` kiểm tra luồng Nhắn tin giữa User và Guide, cũng như tính năng Report vi phạm gửi tới Support Staff.
  - Chạy `npx playwright test --project=chromium` tại máy ảo, 8/8 kịch bản test (bao gồm Finance và Content Moderator) đều PASS với tốc độ 2.0s.
- **Tích hợp CI/CD (GitHub Actions):**
  - Viết file workflow `.github/workflows/e2e-tests.yml` giúp tự động khởi tạo môi trường (PostgreSQL, Redis, Backend, Frontend) và chạy Playwright ở chế độ Headless mỗi khi có Pull Request hoặc Push code lên nhánh chính. Hệ thống đảm bảo ứng dụng không bao giờ bị dính lỗi "White Screen" trên Production.

### 2026-06-08 (UI/UX & Debugging Note)
- **Về React Query Devtools (Icon bãi biển ở góc dưới phải):**
  - Hiện tại bảng điều khiển trống trơn do Frontend đang gọi API theo cách truyền thống (`useEffect` + `axios/fetch`) chứ chưa chuyển sang dùng Hook chuẩn của React Query (`useQuery`, `useMutation`).
  - **Lựa chọn 1:** Nếu vướng víu, có thể yêu cầu ẩn/xóa icon này đi.
  - **Lựa chọn 2:** Mặc kệ nó. Khi nào tối ưu hóa tốc độ load trang và refactor code sang chuẩn React Query, dữ liệu sẽ tự động xuất hiện.
  - Vui lòng xem và yêu cầu lựa chọn để tiến hành bước tiếp theo.

### 2026-06-08 (UX Hardening & Demo Preparation)
- **Hoàn thiện UX trải nghiệm người dùng trên 10 màn hình MVP lõi:**
  - `LoginPage` / `RegisterPage`: Bổ sung Loading Indicator và Toasts chuẩn hóa (`sonner`) cho các luồng xác thực auth.
  - `TourDetailPage` / `CompanionDetailPage`: Tích hợp chặt chẽ Login Guards ngay tại các nút gọi hành động chính ("Gửi yêu cầu"). Chuyển hướng Guest đến form đăng nhập kèm thông báo Toast hợp lý.
  - `TourBookingPage`: Thiết lập Toast success `"Đã gửi yêu cầu tham gia tour"` ngay sau khi tạo request thành công trước khi forward sang VNPAY.
  - `GuideRequestsPage` / `CompanionManagementPage`: Thêm lớp bảo mật UX thông qua `window.confirm` cho các hành động mang tính phá hủy/không thể hoàn tác ("Từ chối" yêu cầu).
  - `ReportModal` / `AdminReportManagementPage`: Thêm loading overlay trên Report Form và dùng `window.prompt` bắt buộc nhập lý do cho Admin khi giải quyết khiếu nại.
- **Regression Test Validation:** Toàn bộ các luồng chức năng MVP (Đăng ký, Đăng nhập, Duyệt hồ sơ, Đặt Tour, Thanh toán, Tìm bạn đồng hành, Khiếu nại) đều đã được kiểm tra (Verified) và hoạt động mượt mà E2E thông qua backend integration script (`test_regression.ts`). Không có lỗi phát sinh sau quá trình hardening. 
 # # #   2 0 2 6 - 0 6 - 1 2   ( B a c k e n d   D e b u g   &   H o t f i x )  
 -   * * S �a   l �i   B a c k e n d   b �  C r a s h   d o   R e d i s   ( E A D D R I N U S E   &   S o c k e t C l o s e d U n e x p e c t e d l y E r r o r ) : * *  
     -   T � m   v �   k i l l   t i �n   t r � n h   Z o m b i e   a n g   c h i �m   g i �  c �n g   3 0 0 0 .  
     -   C �u   h � n h   l �i   t o � n   b �  U p s t a s h   R e d i s   c o n n e c t i o n   t r o n g   \  p p . m o d u l e . t s \ ,   \  e d i s - i o . a d a p t e r . t s \ ,   \ s o c k e t / r e d i s . a d a p t e r . t s \   �  s �  d �n g   U R L   s c h e m e   \  e d i s s : / / \   c �   T L S   v �   p a s s w o r d .  
     -   G i �i   q u y �t   m e r g e   c o n f l i c t s   v �i   n h � n h   \ d e v e l o p \   v �   t �o   P R   \ # 1 0 0 \   t h � n h   c � n g   q u a   G i t H u b   C L I .  
     -   S �a   l �i   C I :   F i x   P r i s m a   S c h e m a   \ 	 o u r _ i m a g e s \   ( c h u y �n   t �  1 - t o - 1   t h � n h   1 - t o - m a n y )   v �   c �p   n h �t   T y p e S c r i p t   b i n d i n g s   t r o n g   a p p . m o d u l e ,   r e c o m m e n d a t i o n s . s e r v i c e ,   t o u r - r e q u e s t s . s e r v i c e .  
     -   S �a   l �i   D o c k e r   B u i l d   C I :   C o p y   \ p r i s m a \   v �   \ p r i s m a . c o n f i g . t s \   t r ��c   k h i   c h �y   \ 
 p m   c i \   t r o n g   D o c k e r f i l e .  
     -   S �a   l �i   P l a y w r i g h t   C I :   L o �i   b �  \ @ d e f a u l t ( d b g e n e r a t e d ( . . . ) ) \   b �  l �i   c �a   c �t   \ e m a i l \   t r o n g   b �n g   \  u t h . i d e n t i t i e s \   �  \ s c h e m a . p r i s m a \   �  c �   t h �  c h �y   M i g r a t i o n .  
     -   S �a   l �i   P l a y w r i g h t   C I   ( t i �p ) :   L o �i   b �  \ @ d e f a u l t ( d b g e n e r a t e d ( . . . ) ) \   b �  l �i   c �a   c �t   \ c o n f i r m e d _ a t \   t r o n g   b �n g   \  u t h . u s e r s \   �  \ s c h e m a . p r i s m a \   �  c �   t h �  c h �y   M i g r a t i o n .  
 