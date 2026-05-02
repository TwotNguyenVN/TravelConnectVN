# DEMO FLOWS — CÁC LUỒNG DEMO CÓ THỂ TRÌNH BÀY KHI BẢO VỆ

> **Ngày tạo:** 2026-05-02  
> **Dự án:** TravelConnectVN  
> **Mục đích:** Liệt kê các luồng demo có thể trình diễn thực tế khi bảo vệ đồ án, dựa trên bằng chứng source code

---

## Luồng 1: Đăng ký – Đăng nhập – Phân quyền

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Khách truy cập → Người dùng (USER) |
| **Frontend** | `RegisterPage.tsx` → `LoginPage.tsx` → `RoleSelectionPage.tsx` → `OnboardingPage.tsx` |
| **Backend** | `backend/src/auth/` (Supabase Auth), `backend/src/users/users.controller.ts` |
| **Database** | `auth.users`, `public.users`, `roles`, `user_roles` |
| **Dữ liệu demo** | Tài khoản seed trong `database/seed/3.2_Seed_demo_accounts.sql` |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. Truy cập trang chủ → Nhấn "Đăng ký" → Điền form → Tạo tài khoản. 2. Đăng nhập bằng email/mật khẩu hoặc Google OAuth. 3. Chọn vai trò (USER/GUIDE). 4. Hệ thống redirect về trang phù hợp với vai trò. |
| **Hạn chế** | Google OAuth cần cấu hình đúng domain. Quên mật khẩu dùng flow OTP của Supabase. |

---

## Luồng 2: Khách du lịch xem và tìm kiếm tour

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Khách truy cập / Người dùng (USER) |
| **Frontend** | `HomePage.tsx` → `TourListPage.tsx` → `TourDetailPage.tsx` → `TourMapPage.tsx` |
| **Backend** | `tours.controller.ts` (GET /tours, GET /tours/:id) |
| **Database** | `tours`, `tour_images`, `tour_locations`, `tour_categories`, `tour_schedules`, `tour_destinations`, `provinces` |
| **Dữ liệu demo** | `database/seed/3.3_Seed_tours.sql`, `9.1_Master_Demo_Seed.sql`, `14.1_Premium_Demo_Data.sql` |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. Vào Trang chủ → Xem tour nổi bật. 2. Nhập địa điểm vào thanh tìm kiếm (có gợi ý). 3. Dùng bộ lọc giá (slider), loại hình. 4. Nhấn vào tour → Xem chi tiết lịch trình, ảnh, bản đồ. 5. Xem bản đồ lộ trình trên Leaflet. |
| **Hạn chế** | Bản đồ dùng OpenStreetMap miễn phí, không cần API key. |

---

## Luồng 3: Hướng dẫn viên tạo và quản lý tour

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Hướng dẫn viên (GUIDE) |
| **Frontend** | `GuideDashboardPage.tsx` → `MyToursPage.tsx` → `TourFormPage.tsx` → `TourManagementPage.tsx` → `TourItineraryPage.tsx` → `TourImagesPage.tsx` |
| **Backend** | `tours.controller.ts` (POST/PATCH/DELETE /tours), `guides.controller.ts` |
| **Database** | `tours`, `tour_images`, `tour_locations`, `tour_schedules`, `guide_profiles` |
| **Dữ liệu demo** | Tài khoản guide seed + tour seed |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. Đăng nhập tài khoản GUIDE → Vào Guide Dashboard. 2. Nhấn "Tạo tour mới" → Điền thông tin → Lưu bản nháp. 3. Thêm lịch trình, ảnh, địa điểm. 4. Đổi trạng thái Published → Tour xuất hiện trên trang công khai. 5. Quản lý danh sách tour: sửa, đóng, hoàn thành. |
| **Hạn chế** | Không có. Luồng hoàn chỉnh. |

---

## Luồng 4: Đặt tour và thanh toán VNPAY

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) → Hướng dẫn viên (GUIDE) |
| **Frontend** | `TourDetailPage.tsx` → `TourBookingPage.tsx` → (VNPAY Popup) → `VnpayReturnPage.tsx` → `BookingManagementPage.tsx` |
| **Backend** | `tour-requests.controller.ts`, `payments.controller.ts` (create-vnpay-url, vnpay-ipn, my-transactions) |
| **Database** | `tour_requests`, `payment_transactions` |
| **Dữ liệu demo** | Thẻ test VNPAY: NCB / 9704198526191432198 / NGUYEN VAN A / 07/15 / OTP: 123456 |
| **Trạng thái** | ✅ Hoạt động (Sandbox) |
| **Kịch bản demo** | 1. User xem chi tiết tour → Nhấn "Đặt tour". 2. Điền thông tin booking → Chọn thanh toán (toàn phần/đặt cọc). 3. Redirect sang VNPAY Sandbox → Nhập thẻ test → Xác nhận OTP. 4. Quay về VnpayReturnPage → Cập nhật trạng thái. 5. HDV xem yêu cầu trong GuideRequestsPage → Duyệt/Từ chối. 6. User xem booking trong BookingManagementPage. |
| **Hạn chế** | Chỉ là sandbox VNPAY, không giao dịch tiền thật. |

---

## Luồng 5: Tìm bạn đồng hành

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) — Chủ bài và Người xin tham gia |
| **Frontend** | `CompanionListPage.tsx` → `CompanionDetailPage.tsx` → `CompanionFormPage.tsx` → `MyCompanionPostsPage.tsx` → `CompanionRequestManagementPage.tsx` |
| **Backend** | `companion-posts.controller.ts` |
| **Database** | `companion_posts`, `companion_requests` |
| **Dữ liệu demo** | `database/seed/7.1_Seed_companion_data.sql` |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. User A tạo bài tìm bạn đồng hành (điểm đến, thời gian, chi phí, yêu cầu). 2. User B xem danh sách → Xem chi tiết → Gửi yêu cầu tham gia. 3. User A xem yêu cầu → Duyệt hoặc Từ chối. 4. Khi đủ người → Chủ bài đổi trạng thái "Đã đủ người". 5. Kết thúc chuyến đi → Hoàn thành bài. |
| **Hạn chế** | Không có thanh toán riêng cho đồng hành. |

---

## Luồng 6: Chat trực tiếp và chat nhóm

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) ↔ Hướng dẫn viên (GUIDE), hoặc Nhóm đồng hành |
| **Frontend** | `ChatPage.tsx` (dùng chung cho 1-1 và nhóm) |
| **Backend** | `conversation.controller.ts`, `message.controller.ts`, `socket.gateway.ts` |
| **Database** | `conversations`, `conversation_participants`, `messages` |
| **Dữ liệu demo** | `database/seed/chat_seed.sql` |
| **Trạng thái** | ✅ Hoạt động |
| **Kịch bản demo** | 1. User mở trang chi tiết tour → Nhấn "Liên hệ HDV" → Mở chat 1-1. 2. Gửi tin nhắn realtime (WebSocket). 3. Tham gia bài đồng hành được duyệt → Tự động tham gia chat nhóm. 4. Xem danh sách thành viên trong panel bên phải. |
| **Hạn chế** | Chưa có gửi file/ảnh trong chat. Chưa có typing indicator. |

---

## Luồng 7: AI Chatbot hỗ trợ du lịch

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) |
| **Frontend** | `AiChatPage.tsx` |
| **Backend** | `ai-chat.controller.ts`, `ai-chat.service.ts` (Google Generative AI) |
| **Database** | `ai_chat_sessions`, `ai_chat_messages` |
| **Trạng thái** | ✅ Hoạt động |
| **Kịch bản demo** | 1. User vào "Trợ lý AI" trong sidebar. 2. Tạo phiên chat mới. 3. Hỏi về gợi ý du lịch, lịch trình, chi phí. 4. AI trả lời dựa trên ngữ cảnh du lịch Việt Nam. |
| **Hạn chế** | Cần API key Google Generative AI hợp lệ. AI chưa tích hợp sâu với dữ liệu tour trong hệ thống. |

---

## Luồng 8: Quản trị hệ thống

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Quản trị viên (SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF) |
| **Frontend** | `AdminDashboardPage.tsx` → `AdminUserManagementPage.tsx` → `AdminTourManagementPage.tsx` → `AdminCompanionManagementPage.tsx` → `AdminVerificationPage.tsx` → `AdminReportManagementPage.tsx` → `AdminReviewManagementPage.tsx` → `AdminActivityLogPage.tsx` |
| **Backend** | `admin.controller.ts`, `reports.controller.ts`, `guide-verification.controller.ts`, `reviews.controller.ts` |
| **Database** | `public.users`, `tours`, `companion_posts`, `reports`, `guide_verification_requests`, `admin_activity_logs` |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. Đăng nhập tài khoản Admin. 2. Dashboard tổng quan: thống kê users, tours, reports. 3. Quản lý user: xem danh sách, khóa/mở khóa tài khoản. 4. Duyệt hồ sơ HDV: xem giấy tờ, chấp nhận/từ chối. 5. Kiểm duyệt tour và bài đồng hành. 6. Xử lý báo cáo vi phạm: xem chi tiết → xử lý → ghi log. 7. Xem nhật ký hoạt động. |
| **Hạn chế** | Chưa có phân quyền chi tiết giữa CONTENT_MODERATOR và SUPPORT_STAFF ở frontend. |

---

## Luồng 9: Đánh giá tour và HDV

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) — sau khi hoàn thành tour |
| **Frontend** | `TourDetailPage.tsx` (phần reviews), `GuideDetailPage.tsx`, `BookingManagementPage.tsx` (nút đánh giá) |
| **Backend** | `reviews.controller.ts` |
| **Database** | `tour_reviews`, `guide_reviews` |
| **Trạng thái** | ✅ Hoạt động |
| **Kịch bản demo** | 1. User hoàn thành tour → Vào BookingManagementPage. 2. Nhấn "Đánh giá Tour" hoặc "Đánh giá HDV". 3. Chấm sao 1-5 + viết bình luận. 4. Đánh giá hiển thị trên trang chi tiết tour/HDV. |
| **Hạn chế** | Modal đánh giá đang hoàn thiện ở Sprint 14. |

---

## Luồng 10: Yêu thích và Gợi ý tour

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Người dùng (USER) |
| **Frontend** | `FavoritesPage.tsx`, `HomePage.tsx` (phần gợi ý) |
| **Backend** | `favorites.controller.ts`, `recommendations.controller.ts` |
| **Database** | `favorite_tours`, `favorite_guides`, `user_preferences`, `user_preferred_categories` |
| **Trạng thái** | ✅ Yêu thích hoạt động. Gợi ý: rule-based. |
| **Kịch bản demo** | 1. User xem tour → Nhấn "Yêu thích". 2. Vào trang Yêu thích → Xem danh sách đã lưu. 3. Trang chủ hiển thị gợi ý tour dựa trên sở thích. |
| **Hạn chế** | Recommendation là rule-based, không phải ML. |

---

## Luồng 11: Xác minh hồ sơ hướng dẫn viên

| Mục | Chi tiết |
|-----|---------|
| **Actor** | Hướng dẫn viên (GUIDE) → Quản trị viên (ADMIN) |
| **Frontend** | `GuideVerificationPage.tsx` → `AdminVerificationPage.tsx` |
| **Backend** | `guide-verification.controller.ts` |
| **Database** | `guide_verification_requests`, `guide_verification_documents` |
| **Trạng thái** | ✅ Hoạt động đầy đủ |
| **Kịch bản demo** | 1. HDV vào trang xác minh → Upload giấy tờ (thẻ HDV, CCCD). 2. Gửi yêu cầu xác minh. 3. Admin xem danh sách yêu cầu → Xem tài liệu → Chấp nhận/Từ chối. 4. Trạng thái HDV cập nhật (verified/rejected). |
| **Hạn chế** | Không có. Luồng hoàn chỉnh. |

---

## Tóm tắt — Thứ tự demo đề xuất khi bảo vệ

| STT | Luồng | Thời lượng ước tính |
|-----|-------|---------------------|
| 1 | Đăng ký – Đăng nhập – Phân quyền | 2-3 phút |
| 2 | Khách xem và tìm kiếm tour + Bản đồ | 3-4 phút |
| 3 | HDV tạo và quản lý tour | 3-4 phút |
| 4 | Đặt tour + Thanh toán VNPAY | 3-4 phút |
| 5 | Tìm bạn đồng hành | 3-4 phút |
| 6 | Chat trực tiếp + Chat nhóm | 2-3 phút |
| 7 | AI Chatbot | 1-2 phút |
| 8 | Quản trị hệ thống | 3-4 phút |
| 9 | Đánh giá + Yêu thích | 1-2 phút |
| 10 | Xác minh HDV | 2-3 phút |
| **Tổng** | | **~25-35 phút** |
