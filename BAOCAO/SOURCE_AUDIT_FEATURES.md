# SOURCE AUDIT — BẢNG TỔNG HỢP TÍNH NĂNG DỰ ÁN TRAVELCONNECTVN

> **Ngày audit:** 2026-05-02  
> **Phạm vi:** Toàn bộ source code frontend, backend, database và tài liệu sprint  
> **Tiêu chí:** Chỉ ghi nhận tính năng có bằng chứng trong source code hoặc tài liệu sprint đã triển khai

---

## 1. Tóm tắt cấu trúc dự án

| Lớp | Công nghệ | Thư mục |
|-----|-----------|---------|
| Frontend | React 19 + TypeScript + Vite 8 | `frontend/` |
| Backend | NestJS 11 + TypeScript + Prisma 7 | `backend/` |
| Database | PostgreSQL (Supabase) — 38+ bảng public + auth schema | `database/` |
| Auth | Supabase Auth (JWT, Google OAuth) | `backend/src/auth/`, `frontend/src/contexts/AuthContext.tsx` |
| Realtime | Socket.io (WebSocket Gateway) | `backend/src/socket/`, `frontend/src/contexts/SocketContext.tsx` |
| AI | Google Generative AI (Gemini) | `backend/src/ai-chat/`, `@google/generative-ai` in package.json |
| Map | Leaflet + React-Leaflet | `frontend/package.json`, `TourMapPage.tsx` |
| Payment | VNPAY Sandbox | `backend/src/payments/`, `frontend/src/pages/user/VnpayReturnPage.tsx` |
| Charts | Recharts | `frontend/package.json` |

---

## 2. Bảng đối chiếu tính năng

### 2.1. Tài khoản và phân quyền

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Đăng ký | Đăng ký email/mật khẩu | Đã làm được | `backend/src/auth/` | `RegisterPage.tsx` | `auth.users`, `public.users` | Supabase Auth |
| Đăng nhập | Email + mật khẩu + Google OAuth | Đã làm được | `auth.module.ts` | `LoginPage.tsx`, `AuthContext.tsx` | `auth.users` | JWT từ Supabase |
| Quên/Reset mật khẩu | Quên MK, xác thực OTP, đặt lại MK | Đã làm được | — (Supabase native) | `ForgotPasswordPage.tsx`, `VerifyOtpPage.tsx`, `ResetPasswordPage.tsx` | — | Dùng Supabase Auth flow |
| Phân quyền | 5 vai trò: USER, GUIDE, SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF | Đã làm được | `role.enum.ts`, `auth.guard.ts`, `role.guard.ts` | `AuthGuard.tsx`, `RoleGuard.tsx` | `roles`, `user_roles` | RBAC đầy đủ |
| Chọn vai trò | Onboarding chọn role sau đăng ký | Đã làm được | — | `RoleSelectionPage.tsx`, `OnboardingPage.tsx` | `user_roles` | — |
| Hồ sơ cá nhân | Xem/sửa profile | Đã làm được | `users.controller.ts`, `public-users.controller.ts` | `ProfilePage.tsx`, `PublicProfilePage.tsx` | `public.users` | — |

### 2.2. Tour du lịch

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Xem tour công khai | Trang chủ, danh sách, chi tiết tour | Đã làm được | `tours.controller.ts` | `HomePage.tsx`, `TourListPage.tsx`, `TourDetailPage.tsx` | `tours`, `tour_images`, `tour_locations` | Có bộ lọc tìm kiếm |
| Tạo tour | HDV tạo tour mới (multi-step form) | Đã làm được | `tours.controller.ts` | `TourFormPage.tsx` | `tours`, `tour_images`, `tour_locations` | — |
| Quản lý tour | HDV sửa/xóa/đổi trạng thái tour | Đã làm được | `tours.service.ts` | `MyToursPage.tsx`, `TourManagementPage.tsx` | `tours` | Trạng thái: draft, published, closed, completed |
| Lịch trình tour | Quản lý itinerary theo ngày | Đã làm được | `tours.service.ts` | `TourItineraryPage.tsx` | `tour_schedules` | — |
| Ảnh tour | Upload/quản lý ảnh tour | Đã làm được | `tours.controller.ts` | `TourImagesPage.tsx` | `tour_images` | Supabase Storage |
| Bản đồ tour | Hiển thị lộ trình trên bản đồ | Đã làm được | `tours.service.ts` (tọa độ) | `TourMapPage.tsx` | `tour_locations`, `tour_destinations` | Leaflet/OpenStreetMap |
| Lịch tour | Xem lịch khởi hành | Đã làm được | `tours.service.ts` | `TourScheduleDetailPage.tsx`, `GuideTourCalendar.tsx` | `tour_schedules` | — |
| Tìm kiếm/lọc tour | Lọc theo địa điểm, giá, loại hình | Đã làm được | `tours.controller.ts` | `HomePage.tsx` (search bar), `TourListPage.tsx` | `tours`, `tour_categories`, `provinces` | Có gợi ý địa điểm, slider giá |

### 2.3. Hướng dẫn viên

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Hồ sơ HDV | Tạo/sửa profile hướng dẫn viên | Đã làm được | `guides.controller.ts` | `GuideProfilePage.tsx` | `guide_profiles`, `guide_languages`, `guide_skills` | — |
| Danh sách HDV | Xem danh sách HDV công khai | Đã làm được | `guides.controller.ts` | `GuideListPage.tsx` | `guide_profiles` | — |
| Chi tiết HDV | Xem hồ sơ chi tiết HDV | Đã làm được | `guides.controller.ts` | `GuideDetailPage.tsx` | `guide_profiles`, `guide_reviews` | — |
| Dashboard HDV | Bảng điều khiển tổng quan | Đã làm được | — | `GuideDashboardPage.tsx` | — | Thống kê tour, yêu cầu |
| Xác minh HDV | Gửi/duyệt hồ sơ xác minh | Đã làm được | `guide-verification.controller.ts` | `GuideVerificationPage.tsx`, `AdminVerificationPage.tsx` | `guide_verification_requests`, `guide_verification_documents` | Upload tài liệu chứng minh |

### 2.4. Yêu cầu tham gia tour

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Gửi yêu cầu | User gửi request tham gia tour | Đã làm được | `tour-requests.controller.ts` | `TourBookingPage.tsx` | `tour_requests` | — |
| Quản lý yêu cầu (HDV) | HDV duyệt/từ chối request | Đã làm được | `tour-requests.controller.ts` | `GuideRequestsPage.tsx` | `tour_requests` | Trạng thái: pending, approved, rejected, paid, completed |
| Quản lý booking (User) | User xem trạng thái booking | Đã làm được | `tour-requests.controller.ts` | `BookingManagementPage.tsx` | `tour_requests` | Hợp nhất tour requests + companion requests |
| Thanh toán VNPAY | Thanh toán qua VNPAY sandbox | Đã làm được | `payments.controller.ts`, `payments.service.ts` | `VnpayReturnPage.tsx`, `BookingManagementPage.tsx` | `payment_transactions` | Sandbox — có IPN callback, hỗ trợ full/deposit |
| Lịch sử giao dịch | Xem lịch sử thanh toán | Đã làm được | `payments.controller.ts` (my-transactions) | `BookingManagementPage.tsx` | `payment_transactions` | — |

### 2.5. Bài tìm bạn đồng hành

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Xem danh sách | Trang danh sách bài đồng hành | Đã làm được | `companion-posts.controller.ts` | `CompanionListPage.tsx` | `companion_posts` | Có ảnh bìa |
| Chi tiết bài | Xem chi tiết bài đồng hành | Đã làm được | `companion-posts.controller.ts` | `CompanionDetailPage.tsx` | `companion_posts` | Có gallery ảnh, ghim card |
| Tạo/sửa bài | User tạo/sửa bài tìm bạn | Đã làm được | `companion-posts.controller.ts` | `CompanionFormPage.tsx` | `companion_posts` | — |
| Quản lý bài | User quản lý bài đã đăng | Đã làm được | `companion-posts.service.ts` | `MyCompanionPostsPage.tsx` | `companion_posts` | Trạng thái: open/closed/completed |
| Gửi yêu cầu tham gia | User gửi request đồng hành | Đã làm được | `companion-posts.controller.ts` | `CompanionDetailPage.tsx` | `companion_requests` | — |
| Duyệt yêu cầu | Chủ bài duyệt/từ chối request | Đã làm được | `companion-posts.controller.ts` | `CompanionRequestManagementPage.tsx` | `companion_requests` | — |

### 2.6. Quản trị hệ thống (Admin)

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Dashboard | Trang tổng quan thống kê | Đã làm được | `admin.controller.ts` | `AdminDashboardPage.tsx` | — | Recharts |
| Quản lý user | Xem, khóa/mở khóa tài khoản | Đã làm được | `admin.controller.ts` | `AdminUserManagementPage.tsx` | `public.users`, `user_roles` | — |
| Quản lý tour | Kiểm duyệt tour | Đã làm được | `admin.controller.ts` | `AdminTourManagementPage.tsx` | `tours` | — |
| Quản lý bài ĐH | Kiểm duyệt bài đồng hành | Đã làm được | `admin.controller.ts` | `AdminCompanionManagementPage.tsx` | `companion_posts` | — |
| Duyệt HDV | Xét duyệt hồ sơ xác minh HDV | Đã làm được | `guide-verification.controller.ts` | `AdminVerificationPage.tsx` | `guide_verification_requests` | — |
| Quản lý báo cáo | Xử lý báo cáo vi phạm | Đã làm được | `reports.controller.ts` | `AdminReportManagementPage.tsx` | `reports`, `report_processing_history` | — |
| Quản lý đánh giá | Kiểm duyệt review | Đã làm được | `reviews.controller.ts` | `AdminReviewManagementPage.tsx` | `tour_reviews`, `guide_reviews` | — |
| Nhật ký hoạt động | Xem admin activity log | Đã làm được | `user-activity-logs.controller.ts` | `AdminActivityLogPage.tsx` | `admin_activity_logs`, `user_activity_logs` | — |

### 2.7. Đánh giá và yêu thích

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Đánh giá tour | Đánh giá sao + bình luận tour | Đã làm được | `reviews.controller.ts` | `TourDetailPage.tsx`, `TourReviewsTab.tsx` | `tour_reviews` | — |
| Đánh giá HDV | Đánh giá sao + bình luận HDV | Đã làm được | `reviews.controller.ts` | `GuideDetailPage.tsx` | `guide_reviews` | — |
| Yêu thích tour | Lưu tour yêu thích | Đã làm được | `favorites.controller.ts` | `FavoritesPage.tsx` | `favorite_tours` | — |
| Yêu thích HDV | Lưu HDV yêu thích | Đã làm được | `favorites.controller.ts` | `FavoritesPage.tsx` | `favorite_guides` | — |

### 2.8. Chat, AI, Thông báo

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Chat trực tiếp | Chat 1-1 giữa user và guide | Đã làm được | `conversation.controller.ts`, `message.controller.ts`, `socket.gateway.ts` | `ChatPage.tsx` | `conversations`, `conversation_participants`, `messages` | WebSocket realtime |
| Chat nhóm | Chat nhóm bài đồng hành | Đã làm được | `conversation.service.ts` | `ChatPage.tsx` | `conversations` (type group) | Tự động đồng bộ thành viên đã duyệt |
| AI Chatbot | Trò chuyện với AI hỗ trợ du lịch | Đã làm được | `ai-chat.controller.ts`, `ai-chat.service.ts` | `AiChatPage.tsx` | `ai_chat_sessions`, `ai_chat_messages` | Google Generative AI (Gemini) |
| Gợi ý tour | Recommendation engine | Đã làm một phần | `recommendations.controller.ts`, `recommendations.service.ts` | `HomePage.tsx` | `user_preferences`, `user_preferred_categories` | Rule-based, không phải ML |
| Thông báo | Hệ thống notification | Đã làm được | `notifications.controller.ts` | `NotificationsPage.tsx` | `notifications` | — |
| Lịch sử hoạt động | User activity log | Đã làm được | `user-activity-logs.controller.ts` | `ActivityLogsPage.tsx` | `user_activity_logs` | — |

### 2.9. Lưu trú và Báo cáo vi phạm

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |
|---|---|---|---|---|---|---|
| Lưu trú | Quản lý thông tin lưu trú đối tác | Đã làm một phần | `accommodations.controller.ts` | — | `partner_accommodations`, `tour_accommodations` | Có backend API, chưa thấy frontend riêng |
| Báo cáo vi phạm | Gửi báo cáo vi phạm nội dung | Đã làm được | `reports.controller.ts` | `CompanionDetailPage.tsx` (nút báo cáo), `AdminReportManagementPage.tsx` | `reports`, `report_processing_history` | Luồng đầy đủ: gửi → admin xử lý |

---

## 3. Tổng kết thống kê

| Chỉ số | Giá trị |
|--------|---------|
| Tổng số model Prisma | 65 (bao gồm auth schema của Supabase) |
| Bảng public schema chính | ~42 bảng |
| Backend modules | 20 module (auth, users, roles, tours, guides, guide-verification, tour-requests, companion-posts, chat, ai-chat, payments, reports, reviews, favorites, notifications, accommodations, recommendations, user-activity-logs, socket, admin) |
| Backend controllers | 21 file controller |
| Frontend pages | 50 file .tsx trong pages/ |
| Frontend services | 17 service files |
| Frontend routes | 4 area (Public, User, Guide, Admin) |
| Dữ liệu seed | 14+ file SQL seed |
| Sprint đã triển khai | Sprint 01 → Sprint 14 (Final) |

---

## 4. Nhận xét tổng quan

### Đã làm được tốt
- Kiến trúc 3 lớp frontend/backend/database đầy đủ và đồng bộ.
- RBAC 5 vai trò triển khai xuyên suốt từ DB → backend guard → frontend guard.
- Các luồng nghiệp vụ lõi (Tour, Companion, Guide, Admin) hoàn thiện end-to-end.
- Tích hợp thanh toán VNPAY sandbox với IPN callback.
- Chat realtime qua WebSocket.
- AI chatbot tích hợp Google Gemini.
- Bản đồ tương tác với Leaflet.
- Hệ thống đánh giá, yêu thích, thông báo, báo cáo vi phạm hoàn chỉnh.

### Phần còn hạn chế
- Thanh toán VNPAY chỉ ở mức sandbox, chưa tích hợp production.
- Recommendation engine là rule-based, chưa dùng ML.
- Module accommodation có backend nhưng chưa thấy frontend chuyên dụng.
- Chưa có test tự động (unit test/e2e test) đáng kể.
- Chưa triển khai production/deployment pipeline.
