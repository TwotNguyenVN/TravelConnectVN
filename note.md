# 📋 ĐÁNH GIÁ TOÀN DIỆN DỰ ÁN TRAVELCONNECTVN

> **Ngày đánh giá:** 2026-06-02
> **Phạm vi:** Backend (NestJS), Frontend (React Vite), Database (Prisma/PostgreSQL)
> **Phương pháp:** Đọc toàn bộ source code, phân tích logic nghiệp vụ, cross-reference giữa các module

---

## MỤC LỤC

1. [BUG TIỀM ẨN & RỦI RO NGHIÊM TRỌNG](#-1-bug-tiềm-ẩn--rủi-ro-nghiêm-trọng)
2. [CHỨC NĂNG NGHIỆP VỤ CÒN THIẾU / CHƯA HOÀN THIỆN](#-2-chức-năng-nghiệp-vụ-còn-thiếu--chưa-hoàn-thiện)
3. [CÁC PHẦN CHƯA ĐƯỢC PHÁT TRIỂN / KHAI THÁC](#-3-các-phần-chưa-được-phát-triển--khai-thác)
4. [TESTING & CHẤT LƯỢNG CODE](#-4-testing--chất-lượng-code)
5. [BẢO MẬT & HIỆU SUẤT](#-5-bảo-mật--hiệu-suất)
6. [ĐỀ XUẤT ƯU TIÊN PHÁT TRIỂN](#-6-đề-xuất-ưu-tiên-phát-triển)

---

## 🔴 1. BUG TIỀM ẨN & RỦI RO NGHIÊM TRỌNG

### 1.1. THANH TOÁN (Payments) — Mức độ: 🔴 CRITICAL

#### a) Tính tổng tiền đã thanh toán SAI khi trả cọc + trả phần còn lại
- **File:** `payments.service.ts` (dòng 47-53) + `tour-requests.service.ts` (dòng 170-183)
- **Mô tả:** Khi tính `paymentStatus`, hệ thống chỉ lấy **giao dịch paid mới nhất** (`take: 1` hoặc `[0]`) để so sánh, thay vì **tổng tất cả giao dịch paid**. Nếu khách trả cọc 50% trước, rồi trả tiếp 50% sau → giao dịch thứ 2 chỉ là 50% → hiển thị sai "Đã thanh toán 50% (Cọc)" thay vì "Đã thanh toán 100%".
- **Ảnh hưởng:** Guide nhìn thấy khách đã trả đủ nhưng hiển thị chỉ trả cọc, gây nhầm lẫn.
- **Khuyến nghị:** Tính `SUM(amount)` từ TẤT CẢ payment_transactions có status='paid' cho cùng tour_request_id.

#### b) Race Condition khi tạo Payment URL
- **File:** `payments.service.ts` (dòng 67-99)
- **Mô tả:** Kiểm tra `findFirst` pending transaction rồi mới `create` → Nếu 2 request đồng thời thì có thể tạo 2 giao dịch pending trùng lặp.
- **Khuyến nghị:** Dùng `upsert` hoặc database-level unique constraint.

#### c) Thiếu kiểm tra `expires_at` của giao dịch pending
- **File:** `payments.service.ts`
- **Mô tả:** Giao dịch pending không có `expires_at`, không tự hết hạn. Nếu khách tạo URL thanh toán rồi không thực hiện, giao dịch pending sẽ tồn tại mãi mãi.
- **Khuyến nghị:** Thêm `expires_at` khi tạo, scheduler tự hủy pending đã quá hạn.

#### d) VNPAY IPN không verify số tiền
- **File:** `payments.service.ts` (dòng 154-266)
- **Mô tả:** IPN callback chỉ verify `SecureHash` và `ResponseCode`, KHÔNG kiểm tra `vnp_Amount` có khớp với `transaction.amount` hay không. Đây là yêu cầu bảo mật bắt buộc từ VNPAY.
- **Khuyến nghị:** Thêm kiểm tra `Number(vnp_Params['vnp_Amount']) / 100 === Number(transaction.amount)` trước khi xử lý.

### 1.2. ĐẶT TOUR (Tour Requests) — Mức độ: 🟠 HIGH

#### a) Ghi log trùng lặp khi Guide xử lý yêu cầu
- **File:** `tour-requests.service.ts` (dòng 502-508 và 531-538)
- **Mô tả:** Trong method `processRequest`, activity log được ghi **HAI LẦN** với 2 event khác nhau (`tour_request.processed` và `TOUR_REQUEST_PROCESSED`). Đây là code thừa.

#### b) Cho phép thanh toán khi status = "pending" (chưa được Guide duyệt)
- **File:** `payments.service.ts` (dòng 42-44)
- **Mô tả:** `request.status !== 'approved' && request.status !== 'pending' && request.status !== 'paid'` → Khách có thể thanh toán MÀ CHƯA CẦN Guide duyệt. Điều này đi ngược lại luồng nghiệp vụ mô tả trong README: "Khách gửi yêu cầu → HDV duyệt → Khách thanh toán".
- **Khuyến nghị:** Bỏ `'pending'` ra khỏi danh sách trạng thái được phép thanh toán.

#### c) Scheduler hủy đơn chỉ xét tour có `tour_schedules`
- **File:** `scheduler.service.ts` (dòng 47-48)
- **Mô tả:** `if (!req.tour_schedules) continue;` → Các tour KHÔNG có lịch trình cụ thể (tour_schedules = null) sẽ KHÔNG BAO GIỜ bị tự động hủy dù quá hạn.

### 1.3. COMPANION POSTS — Mức độ: 🟡 MEDIUM

#### a) Không giới hạn số lần gửi lại yêu cầu sau khi bị từ chối
- **File:** `companion-posts.service.ts` (dòng 358-364)
- **Mô tả:** Chỉ chặn khi status là `pending` hoặc `approved`. Nếu bị reject, user có thể gửi lại request vô hạn lần → spam.
- **Khuyến nghị:** Thêm cooldown hoặc giới hạn số lần gửi lại.

#### b) Chưa reject tự động các request pending khi post đóng
- **Mô tả:** Khi `business_status` chuyển sang `closed` (do hết hạn hoặc đủ member), các request vẫn ở trạng thái `pending` mà không được tự động reject.

### 1.4. REVIEWS — Mức độ: 🟡 MEDIUM

#### a) Không validate rating range
- **File:** `reviews.service.ts`
- **Mô tả:** Không kiểm tra `dto.rating` nằm trong khoảng hợp lệ (1-5). Nếu client gửi rating = 0, -1, hoặc 100 → vẫn được lưu.
- **Khuyến nghị:** Validate `rating >= 1 && rating <= 5` trong DTO hoặc service.

#### b) Recommendations service hardcode `rating: 0.0`
- **File:** `recommendations.service.ts` (dòng 136)
- **Mô tả:** Rating luôn trả về `0.0` cứng, không tính từ dữ liệu thực tế `tour_reviews` hay `guide_reviews`. Tour 5 sao và tour 1 sao đều hiển thị giống nhau.

### 1.5. SOCKET / REALTIME — Mức độ: 🟡 MEDIUM

#### a) Socket Gateway CORS `origin: '*'` 
- **File:** `socket.gateway.ts` (dòng 15)
- **Mô tả:** Mở CORS cho tất cả origin, ghi chú "Trong production nên giới hạn lại" nhưng chưa có config phân biệt dev/prod.

#### b) Mỗi user chỉ được 1 socket connection
- **File:** `socket.gateway.ts` (dòng 25, 45)
- **Mô tả:** `userSockets` là `Map<string, string>` (1-to-1). Nếu user mở 2 tab trình duyệt, tab đầu tiên sẽ mất kết nối socket → không nhận realtime.
- **Khuyến nghị:** Dùng `Map<string, Set<string>>` hoặc dùng room-based approach (đã có `client.join`).

---

## 🟠 2. CHỨC NĂNG NGHIỆP VỤ CÒN THIẾU / CHƯA HOÀN THIỆN

### 2.1. Luồng Hoàn tiền (Refund) — CHƯA CÓ THỰC THI

- **File:** `tour-requests.service.ts` (dòng 394-406)
- **Hiện trạng:** Khi khách hủy tour đã thanh toán, hệ thống tạo record `refund_pending` với `amount` âm, nhưng **KHÔNG CÓ** cơ chế thực tế nào xử lý hoàn tiền:
  - ❌ Không có API/endpoint cho Admin xác nhận hoàn tiền
  - ❌ Không có tích hợp VNPAY refund API
  - ❌ Không có UI Admin để quản lý refund pending
  - ❌ Không có scheduler kiểm tra refund quá hạn
- **Ảnh hưởng:** Khách hủy tour thì tiền "bị treo" mãi mãi.

### 2.2. Trạng thái Tour Request `payment_pending`

- **Mô tả:** Trong `tour-requests.service.ts` line 87 và 116, status `payment_pending` được sử dụng trong query aggregation, nhưng KHÔNG CÓ chỗ nào trong code thực sự SET status này. Có thể đây là một trạng thái dự kiến nhưng chưa được implement.

### 2.3. Auth Module — RỖI GẦNHẾT

- **File:** `auth/auth.module.ts` chỉ có 1 dòng `@Module({})` rỗng.
- **Hiện trạng:** Toàn bộ authentication dựa vào Supabase client-side. Backend có `SupabaseModule` nhưng không có middleware validate JWT token cho từng request.
- **Rủi ro:** Nếu Supabase Auth Guard ở NestJS chưa hoạt động đúng, có thể bypass phân quyền.

### 2.4. Thiếu chức năng Admin Refund Management

- Không có page nào trong admin frontend để:
  - Xem danh sách giao dịch refund_pending
  - Xử lý hoàn tiền cho khách
  - Xem tổng doanh thu / thống kê tài chính chi tiết

### 2.5. Thiếu chức năng User Notification Settings

- Không có UI/API cho user tùy chỉnh thông báo:
  - Bật/tắt loại thông báo cụ thể
  - Cấu hình email notification
  - Mute conversation chưa có UI (DB hỗ trợ `is_muted` nhưng chưa có endpoint)

### 2.6. Thiếu chức năng xóa tài khoản (Account Deletion)

- Không có endpoint hay UI cho user yêu cầu xóa tài khoản
- Cần thiết cho tuân thủ GDPR / luật bảo vệ dữ liệu cá nhân

---

## 🟡 3. CÁC PHẦN CHƯA ĐƯỢC PHÁT TRIỂN / KHAI THÁC

### 3.1. Hệ thống Đề xuất / Gợi ý (Recommendations) — SƠ KHAI

- **Hiện trạng:** Chỉ là rule-based scoring đơn giản dựa trên category + budget + province.
- **Tiềm năng phát triển:**
  - Collaborative filtering: gợi ý dựa trên hành vi người dùng tương tự
  - Content-based: phân tích mô tả tour, kỹ năng Guide
  - Trending tours: dựa trên lượt xem, lượt đặt gần đây
  - "Người dùng cũng xem" trên trang chi tiết tour
  - Gợi ý bạn đồng hành phù hợp dựa trên profile + sở thích

### 3.2. User Activity Logs — CÓ SẴN NHƯNG CHƯA KHAI THÁC

- **Hiện trạng:** Ghi log tốt (tour_request, companion, review) nhưng chỉ có page `ActivityLogsPage.tsx` hiển thị danh sách.
- **Tiềm năng:**
  - Analytics Dashboard cho user: thống kê hoạt động theo thời gian
  - Hệ thống "Thành tích / Badges" cho user tích cực
  - Dữ liệu đầu vào cho Recommendation Engine

### 3.3. Trip Expenses (Chi phí chuyến đi) — CÓ BACKEND, CHƯA FRONTEND RÕ RÀNG

- **Hiện trạng:** Backend có đầy đủ CRUD + chia tiền (`trip_expense_splits`) cho companion posts.
- **Thiếu:**
  - Không rõ frontend integration ở đâu (không có page riêng `TripExpensesPage`)
  - Chưa có báo cáo tổng hợp chi phí chuyến đi
  - Chưa có tính năng thanh toán / settle splits giữa các thành viên

### 3.4. Companion Reviews — MỚI THÊM, CẦN HOÀN THIỆN

- **Hiện trạng:** Model, service, controller đã có. Spec test đã viết.
- **Thiếu:**
  - Chưa rõ frontend có hiển thị đầy đủ trên `CompanionDetailPage` không
  - Chưa có admin management cho companion reviews (ẩn/hiện)
  - Chưa tích hợp vào hệ thống report

### 3.5. Tour Map / Route Visualization

- **Hiện trạng:** Có `TourMapPage.tsx` (7KB) và model `tour_destinations`, `tour_routes` trong DB.
- **Tiềm năng:**
  - Tích hợp bản đồ trực quan hóa lộ trình với Leaflet/Mapbox
  - Hiển thị timeline + marker cho từng điểm dừng
  - So sánh lộ trình giữa các tour

### 3.6. Accommodations (Lưu trú đối tác) — CÓ NHƯNG DÙNG ÍT

- **Hiện trạng:** Backend có `AccommodationsModule` + model `partner_accommodations` + `tour_accommodations`.
- **Thiếu:**
  - Chưa có page quản lý accommodations cho Admin
  - Chưa có UI cho Guide gán accommodation vào tour trên frontend
  - Chưa có page danh sách / chi tiết accommodation cho public

### 3.7. Guide Availability (Lịch rảnh HDV) — CÓ MODEL, CHƯA THẤY UI

- **Model:** `guide_availabilities` với date, start_time, end_time, status
- **Hiện trạng:** `GuideSchedulesPage.tsx` tồn tại (28KB) nhưng chủ yếu xoay quanh tour schedules, không rõ có tích hợp quản lý guide_availabilities riêng không.
- **Thiếu:** Khách chưa thể xem lịch rảnh của Guide để chọn thời gian phù hợp khi đặt tour.

### 3.8. Trang Admin Statistics — ĐANG REDIRECT

- **Route:** `/admin/statistics` → redirect về `AdminDashboardPage` (cùng component)
- **Thiếu:** Trang thống kê chuyên sâu riêng biệt (biểu đồ doanh thu, lượng user, tour trending, conversion rate...) chưa được xây dựng.

### 3.9. Trang Admin Companion Management — CÓ NHƯNG ÍT CHỨC NĂNG

- **Hiện trạng:** `AdminCompanionManagementPage.tsx` (10KB) — chủ yếu list và view
- **Thiếu:** 
  - Không có thao tác ẩn/xóa bài đăng vi phạm từ admin
  - Không có filter/search nâng cao
  - Không có bulk actions

---

## 🔵 4. TESTING & CHẤT LƯỢNG CODE

### 4.1. Tổng quan Test Coverage

| Module | Có spec? | Loại test | Đánh giá |
|--------|---------|-----------|----------|
| `tours.service` | ✅ | Unit (6KB) | Cơ bản |
| `tour-requests.service` | ✅ | Unit (5KB) | Cơ bản |
| `payments.service` | ✅ | Unit (474B) | ⚠️ Gần như rỗng / Scaffold |
| `payments.controller` | ✅ | Unit (506B) | ⚠️ Gần như rỗng / Scaffold |
| `reviews.service` | ✅ | Unit (6KB) | Khá tốt |
| `scheduler.service` | ✅ | Unit (5KB) | Tốt |
| `companion-reviews.service` | ✅ | Unit (5KB) | Tốt |
| `guide-verification.service` | ✅ | Unit | Có |
| `recommendations.service` | ✅ | Unit (523B) | ⚠️ Scaffold |
| `companion-posts.service` | ❌ | Không có | 🔴 THIẾU - Module nghiệp vụ lớn |
| `admin.service` | ❌ | Không có | 🔴 THIẾU - Module quan trọng |
| `chat / conversation.service` | ❌ | Không có | 🔴 THIẾU |
| `message.service` | ❌ | Không có | 🔴 THIẾU |
| `users.service` | ❌ | Không có | 🟠 THIẾU |
| `guides.service` | ❌ | Không có | 🟠 THIẾU |
| `notifications.service` | ❌ | Không có | 🟡 THIẾU |
| `ai-chat` | ❌ | Không có | 🟡 THIẾU |
| `trip-expenses.service` | ❌ | Không có | 🟡 THIẾU |
| E2E tests | ❌ | Scaffold (725B) | 🔴 Chỉ có scaffold app.e2e |
| Frontend tests | ❌ | Không có | 🔴 HOÀN TOÀN THIẾU |

### 4.2. Nhận xét chung

- **Payments module** là phần QUAN TRỌNG NHẤT nhưng test gần như rỗng → Rủi ro cực cao
- **Companion Posts** — module nghiệp vụ lớn nhất (718 dòng) KHÔNG CÓ test
- **Admin module** (17KB service) — quản lý toàn bộ hệ thống nhưng KHÔNG CÓ test
- **Frontend: 0 test** — không có Jest, không có React Testing Library, không có Playwright/Cypress

### 4.3. Code Quality Issues

1. **Dùng `any` nhiều:** Nhiều chỗ dùng `as any` để bypass TypeScript strict mode (companion-posts.service.ts dòng 231, recommendations.service.ts dòng 121)
2. **Empty catch blocks:** `recommendations.service.ts` dòng 116 — nuốt lỗi im lặng
3. **Console.log trong production:** Nhiều file dùng `console.log` / `console.error` trực tiếp thay vì Logger service
4. **Duplicated code:** Logic tính `paymentStatus` ("Đã thanh toán 50%", "100%") bị copy-paste giữa `getUserRequests` và `getGuideRequests` trong `tour-requests.service.ts`
5. **File TourFormPage.tsx: 60KB** — Quá lớn, nên tách thành nhiều component con

---

## 🟣 5. BẢO MẬT & HIỆU SUẤT

### 5.1. Bảo mật

| Vấn đề | Mức độ | Chi tiết |
|--------|--------|---------|
| VNPAY IPN không verify amount | 🔴 Critical | Đã mô tả ở 1.1.d |
| Socket CORS `origin: '*'` | 🟠 High | Nên restrict theo FRONTEND_URL |
| Auth module rỗng | 🟠 High | Cần verify JWT token ở backend level |
| Không có Rate Limiting | 🟡 Medium | API endpoints không có throttle → DDoS risk |
| Không có Input Sanitization tập trung | 🟡 Medium | Mỗi service tự validate riêng lẻ |
| `.env` file chứa secrets commit-able | 🟡 Medium | File `.env` nằm ngoài `.gitignore`? Cần kiểm tra |

### 5.2. Hiệu suất

| Vấn đề | Chi tiết |
|--------|---------|
| N+1 queries trong Scheduler | `completeEndedTours()` và `cancelExpiredUnpaidBookings()` lấy ALL records rồi loop update từng cái → Nên dùng `updateMany` với điều kiện |
| N+1 trong `getUnreadMessageCount` | Loop qua từng conversation để count → Nên dùng 1 aggregation query |
| Recommendations load ALL tours | `getRecommendations()` load TẤT CẢ tours published rồi filter in-memory → Sẽ chậm khi có nhiều tour |
| Missing pagination trong một số endpoint | Ví dụ: `getMyTransactions` trả về tất cả giao dịch không phân trang |

---

## 📌 6. ĐỀ XUẤT ƯU TIÊN PHÁT TRIỂN

### Tier 1: SỬA NGAY (Bug & Security)

1. ✅ Fix VNPAY IPN verify amount
2. ✅ Fix tính tổng `paymentStatus` — SUM tất cả paid transactions thay vì chỉ lấy 1
3. ✅ Bỏ cho phép thanh toán khi status='pending' (chưa được Guide duyệt)
4. ✅ Fix SocketGateway hỗ trợ multi-tab (Map → Set)
5. ✅ Xóa log trùng lặp trong `processRequest`

### Tier 2: BỔ SUNG QUAN TRỌNG (1-2 tuần)

6. Viết unit tests cho: `payments.service`, `companion-posts.service`, `admin.service`
7. Implement luồng Refund hoàn chỉnh (Admin UI + API + scheduler)
8. Thêm Rate Limiting (NestJS Throttler)
9. Fix Scheduler để xử lý cả tour không có `tour_schedules`
10. Tự động reject pending companion requests khi post đóng

### Tier 3: PHÁT TRIỂN MỚI (2-4 tuần)

11. Trip Expenses frontend integration — trang quản lý chi phí cho nhóm đồng hành
12. Admin Statistics Dashboard chuyên sâu (biểu đồ, doanh thu, conversion)
13. Nâng cấp Recommendations: tích hợp rating thực, collaborative filtering
14. Guide Availability UI — hiển thị lịch rảnh cho khách khi đặt tour
15. Companion Reviews integration hoàn thiện (frontend + admin)

### Tier 4: NÂNG CAP TRẢI NGHIỆM (Nice-to-have)

16. Email notification system
17. Notification preferences (bật/tắt loại thông báo)
18. Tour comparison feature
19. Advanced search / filter (giá, rating, thời lượng, ngôn ngữ HDV)
20. Social sharing (chia sẻ tour / bài đồng hành lên mạng xã hội)
21. User achievement / badges system
22. Dark/Light mode toggle (CSS tokens đã sẵn sàng theo README)

---

## 📊 TỔNG KẾT NHANH

| Phân hệ | Độ hoàn thiện | Nhận xét |
|---------|--------------|---------|
| Auth & RBAC | ⭐⭐⭐⭐ | Tốt, dựa trên Supabase Auth + NestJS Guards |
| Tour CRUD & CMS Guide | ⭐⭐⭐⭐ | Rất đầy đủ, form phức tạp 60KB |
| Tour Booking & Schedules | ⭐⭐⭐⭐ | Luồng chặt chẽ, có schedule management |
| Payment VNPAY | ⭐⭐⭐ | Hoạt động nhưng có bug verify + refund thiếu |
| Companion Posts | ⭐⭐⭐⭐ | Hoàn thiện tốt CRUD + requests + auto-close |
| Chat Realtime | ⭐⭐⭐⭐ | Direct + Group, unread count, mark as read |
| AI Assistant | ⭐⭐⭐ | Hoạt động nhưng chưa rõ về prompt / context tuning |
| Guide Verification | ⭐⭐⭐⭐ | Luồng chặt chẽ, admin review, upload docs |
| Reviews (Tour + Guide) | ⭐⭐⭐⭐ | Đủ CRUD, admin visibility control |
| Companion Reviews | ⭐⭐⭐ | Mới thêm, cần integration thêm |
| Admin Dashboard | ⭐⭐⭐ | Có nhưng thiếu thống kê chuyên sâu |
| Recommendations | ⭐⭐ | Sơ khai, chưa dùng rating thực |
| Trip Expenses | ⭐⭐ | Backend xong, frontend chưa rõ |
| Accommodations | ⭐⭐ | Backend có, nhưng chưa dùng nhiều |
| Notifications | ⭐⭐⭐⭐ | Scheduler nhắc nhở tốt, realtime socket |
| Testing | ⭐⭐ | Có unit tests cơ bản, thiếu nhiều module quan trọng, 0 E2E |

---

> **Ghi chú cuối:** Dự án TravelConnectVN có kiến trúc modular tốt, schema DB thiết kế chặt chẽ với indexing hợp lý, và UI/UX frontend phong phú. Các vấn đề nêu trên chủ yếu thuộc về edge cases trong logic nghiệp vụ thanh toán và thiếu test coverage. Nếu tập trung fix Tier 1 & 2 thì hệ thống sẽ đạt mức production-ready tốt cho một dự án đồ án cơ sở.
