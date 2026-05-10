# DANH SÁCH CHỨC NĂNG & MÀN HÌNH HỆ THỐNG TRAVELCONNECTVN

> Tài liệu tổng hợp dựa trên audit thực tế từ source code (Frontend, Backend, Database).

---

## 1. THỐNG KÊ TỔNG QUAN
- **Tổng số chức năng nghiệp vụ:** 29 chức năng chính.
- **Tổng số màn hình thực tế (React Pages/Modals):** 50 màn hình.
- **Kiến trúc:** ReactJS 19 + NestJS 11 + PostgreSQL (Supabase).

---

## 2. DANH SÁCH CÁC CHỨC NĂNG HỆ THỐNG (NGHIỆP VỤ)

### 2.1. Nhóm chức năng Tài khoản & Bảo mật
1.  **Đăng ký tài khoản:** Cho phép người dùng mới tạo tài khoản qua Email.
2.  **Đăng nhập đa phương thức:** Đăng nhập bằng Email/Mật khẩu hoặc Google OAuth.
3.  **Quản lý mật khẩu:** Quên mật khẩu, đổi mật khẩu, xác thực OTP qua Email.
4.  **Phân quyền RBAC:** Hệ thống phân quyền 5 vai trò (User, Guide, Admin, Moderator, Staff).
5.  **Chuyển đổi vai trò:** Cho phép User hiện tại nâng cấp lên Hướng dẫn viên thông qua banner tuyển dụng tại trang Profile.

### 2.2. Nhóm chức năng Tour du lịch
6.  **Quản lý Tour (Guide):** Tạo mới, chỉnh sửa, xóa tour, quản lý trạng thái (Draft/Published).
7.  **Quản lý Lịch trình:** Xây dựng lộ trình tour chi tiết theo từng ngày (Itinerary).
8.  **Quản lý Hình ảnh:** Upload và quản lý bộ sưu tập ảnh tour (Media Gallery).
9.  **Quản lý Lịch khởi hành:** Tạo và quản lý các ngày khởi hành khác nhau cho cùng một tour.
10. **Tìm kiếm & Bộ lọc:** Tìm kiếm tour theo từ khóa, địa điểm, giá, loại hình, thời gian.
11. **Bản đồ tương tác:** Xem vị trí và lộ trình các điểm đến trên bản đồ (Leaflet).

### 2.3. Nhóm chức năng Đặt chỗ & Thanh toán
12. **Đặt tour (Booking):** Chọn ngày, số lượng khách và gửi yêu cầu tham gia.
13. **Thanh toán trực tuyến:** Tích hợp cổng VNPAY hỗ trợ thanh toán Full hoặc Đặt cọc.
14. **Quản lý Yêu cầu & Khách hàng:** Quản lý danh sách khách đặt tour (Tự động xác nhận khi thanh toán thành công).
15. **Quản lý Trạng thái Booking:** Theo dõi tiến độ (Pending, Approved, Paid, Completed, Cancelled).

### 2.4. Nhóm chức năng Đồng hành (Companion)
16. **Tạo bài tìm bạn:** Đăng bài tìm người đi cùng chuyến đi (mô tả, thời gian, số lượng).
17. **Quản lý Đăng ký:** Duyệt hoặc từ chối thành viên xin tham gia nhóm đồng hành.
18. **Trạng thái bài đăng:** Đóng/Mở đăng ký bài đồng hành (vẫn hiển thị công cộng cho SEO).

### 2.5. Nhóm chức năng Tương tác & Xã hội
19. **Chat Realtime:** Nhắn tin trực tiếp giữa khách và HDV, hoặc nhắn tin nhóm đồng hành.
20. **Hệ thống Đánh giá:** Rating 5 sao và viết nhận xét cho Tour và Hướng dẫn viên.
21. **Yêu thích (Favorites):** Lưu trữ danh sách các Tour và HDV quan tâm.
22. **Thông báo (Notifications):** Nhận thông báo realtime về booking, chat, duyệt yêu cầu.
23. **Báo cáo vi phạm:** Gửi báo cáo về các nội dung không phù hợp cho Admin xử lý.

### 2.6. Nhóm chức năng AI & Tiện ích
24. **Trợ lý ảo thông minh (AI Assistant):** Tích hợp mô hình ngôn ngữ lớn (Google Gemini) để tư vấn lộ trình, địa điểm và giải đáp thắc mắc du lịch theo thời gian thực.
25. **Cá nhân hóa trải nghiệm (Recommendation System):** Tự động gợi ý Tour và bạn đồng hành dựa trên sở thích và hành vi người dùng (Rule-based engine).
26. **Nhật ký hoạt động & Bảo mật (Audit Log):** Ghi lại lịch sử các thao tác quan trọng của người dùng trên hệ thống nhằm tăng tính minh bạch và an toàn thông tin.

### 2.7. Nhóm chức năng Quản trị (Admin)
27. **Dashboard Analytics:** Theo dõi biểu đồ tăng trưởng người dùng, tour và doanh thu.
28. **Quản lý thực thể:** Quản trị User (khóa/mở), duyệt Tour, duyệt bài đồng hành, đánh giá bình luận trong hệ thống
29. **Xác minh Guide:** Kiểm duyệt hồ sơ bằng cấp/CCCD để cấp chứng nhận cho HDV.

---

## 3. DANH SÁCH MÀN HÌNH CHI TIẾT (GIAO DIỆN)

### 3.1. Phân hệ Public & User (20 Màn hình)
| STT | Màn hình | Chức năng chi tiết |
|:---:|:---|:---|
| 1 | `HomePage.tsx` | Trang chủ: Banner, Tìm kiếm, Tour nổi bật |
| 2 | `TourListPage.tsx` | Danh sách tour + Bộ lọc |
| 3 | `TourDetailPage.tsx` | Chi tiết tour (Lịch trình, Đánh giá, Lưu trú) |
| 4 | `TourMapPage.tsx` | Bản đồ lộ trình tour |
| 5 | `CompanionListPage.tsx` | Danh sách bài tìm bạn đồng hành |
| 6 | `CompanionDetailPage.tsx` | Chi tiết bài đồng hành |
| 7 | `GuideListPage.tsx` | Danh mục hướng dẫn viên |
| 8 | `GuideDetailPage.tsx` | Hồ sơ chi tiết hướng dẫn viên |
| 9 | `LoginPage.tsx` | Đăng nhập |
| 10 | `RegisterPage.tsx` | Đăng ký |
| 11 | `ForgotPasswordPage.tsx` | Quên mật khẩu |
| 12 | `VerifyOtpPage.tsx` | Xác thực OTP |
| 13 | `ResetPasswordPage.tsx` | Đặt lại mật khẩu |
| 14 | `ProfilePage.tsx` | Cập nhật hồ sơ cá nhân |
| 15 | `PublicProfilePage.tsx` | Xem hồ sơ người khác |
| 16 | `BookingManagementPage.tsx` | Quản lý Booking (Tour/Đồng hành/Giao dịch) |
| 17 | `FavoritesPage.tsx` | Tour/HDV yêu thích |
| 18 | `NotificationsPage.tsx` | Danh sách thông báo |
| 19 | `ActivityLogsPage.tsx` | Nhật ký hoạt động |
| 20 | `VnpayReturnPage.tsx` | Kết quả thanh toán VNPAY |

### 3.2. Phân hệ Hướng dẫn viên (11 Màn hình)
| STT | Màn hình | Chức năng chi tiết |
|:---:|:---|:---|
| 21 | `GuideDashboardPage.tsx` | Thống kê HDV |
| 22 | `GuideProfilePage.tsx` | Hồ sơ năng lực HDV |
| 23 | `GuideVerificationPage.tsx` | Gửi hồ sơ xác minh |
| 24 | `MyToursPage.tsx` | Quản lý danh sách tour của tôi |
| 25 | `TourFormPage.tsx` | Tạo/Sửa Tour (Multi-step) |
| 26 | `TourManagementPage.tsx` | Quản lý trạng thái Tour |
| 27 | `TourItineraryPage.tsx` | Soạn thảo lịch trình |
| 28 | `TourImagesPage.tsx` | Quản lý thư viện ảnh |
| 29 | `TourScheduleDetailPage.tsx` | Chi tiết ngày khởi hành & Khách |
| 30 | `GuideRequestsPage.tsx` | Duyệt khách tham gia |
| 31 | `TourBookingPage.tsx` | Xem chi tiết đơn đặt chỗ |

### 3.3. Phân hệ Quản trị (8 Màn hình)
| STT | Màn hình | Chức năng chi tiết |
|:---:|:---|:---|
| 32 | `AdminDashboardPage.tsx` | Thống kê tổng quan hệ thống |
| 33 | `AdminUserManagementPage.tsx` | Quản trị tài khoản người dùng |
| 34 | `AdminTourManagementPage.tsx` | Kiểm duyệt danh sách tour |
| 35 | `AdminCompanionManagementPage.tsx` | Kiểm duyệt bài đồng hành |
| 36 | `AdminVerificationPage.tsx` | Phê duyệt hồ sơ HDV |
| 37 | `AdminReportManagementPage.tsx` | Xử lý báo cáo vi phạm |
| 38 | `AdminReviewManagementPage.tsx` | Quản lý đánh giá |
| 39 | `AdminActivityLogPage.tsx` | Nhật ký hệ thống |

### 3.4. Tương tác & Modals (11 Màn hình/Chức năng)
| STT | Màn hình/Modal | Chức năng chi tiết |
|:---:|:---|:---|
| 40 | `ChatPage.tsx` | Giao diện Chat realtime |
| 41 | `AiChatPage.tsx` | Giao diện Trợ lý AI |
| 42 | `MyCompanionPostsPage.tsx` | Quản lý bài đồng hành cá nhân |
| 43 | `CompanionFormPage.tsx` | Tạo bài tìm bạn |
| 44 | `CompanionRequestManagementPage.tsx` | Duyệt thành viên nhóm đồng hành |
| 45 | `ReviewModal.tsx` | Modal đánh giá Tour/HDV |
| 46 | `ReportModal` | Modal gửi báo cáo |
| 47 | `BookingDetailsModal` | Modal chi tiết thanh toán |
| 48 | `TourFilterDrawer` | Drawer lọc tour |
| 49 | `TourCalendar` | Lịch chọn ngày khởi hành |
| 50 | `AuthGuard/RoleGuard` | Các màn hình bảo mật/chặn quyền |
