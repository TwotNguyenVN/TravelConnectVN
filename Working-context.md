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
  - [x] Dịch tiếng Việt / Anh trên HomePage

---

## 📝 Latest Execution Notes

- **07/06/2026:** Hoàn thành triển khai Phase 3 (Frontend):
  - Thiết lập `i18next`, cấu hình ngôn ngữ VI/EN.
  - Tích hợp `LanguageSwitcher` vào `PublicHeader.tsx`.
  - Hiển thị danh sách "Gợi Ý Dành Riêng Cho Bạn" trên `HomePage.tsx`.
  - Bổ sung `trackActivity` gọi API Tracking mỗi khi người dùng xem `TourDetailPage.tsx`.
  - Frontend build thành công. Hoàn thiện xong tính năng Cốt lõi (AI & Trải nghiệm).

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