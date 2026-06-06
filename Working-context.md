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

## Active Queues (Development Roadmap)
- [x] Xây dựng cốt lõi (User, Guide, Tour, Payment, Booking).
- [x] Triển khai **SYSTEM_ADMIN**: Dashboard, cấu hình hệ thống, kiểm toán bảo mật, Anomaly Detection, DevOps Monitoring.
- [x] Triển khai **CONTENT_MODERATOR**: Hệ thống phê duyệt hướng dẫn viên, kiểm duyệt báo cáo vi phạm, AI Moderation.
- [x] Triển khai **ACCOUNTANT**: Lịch sử giao dịch, xử lý hoàn tiền, quyết toán, Smart Auto-Reconciliation, Automated E-Invoicing, Cashflow Forecasting.
- [x] Triển khai **SUPPORT_STAFF**: Quản lý ticket hỗ trợ, giải quyết tranh chấp tour, điều phối SOS khẩn cấp.
- [ ] Hoàn thiện CI/CD, tối ưu hiệu năng và Audit bảo mật tổng thể.

---

## Latest Execution Notes

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

### 2026-06-06
- **Hoàn thành Role CONTENT_MODERATOR (Kiểm duyệt viên):**
  - **Quy trình Phê duyệt HDV:** Cải thiện `GuideVerificationTab`, cho phép xem chi tiết hồ sơ và xét duyệt. 
  - **Quản lý Vi phạm (Report Management):** Tích hợp xử lý cắm cờ (flag), cảnh cáo và ẩn nội dung vi phạm.
  - **AI Moderation & Trust Safety:** Bổ sung module AI Moderation dùng Gemini API tự động phát hiện ngôn từ độc hại, spam. Triển khai `TrustSafetyService` quản lý điểm uy tín của User/Guide.
  - Thiết kế layout và sidebar riêng biệt (`ContentLayout`, `ContentSidebar`). Tạo PR và gộp mã thành công.