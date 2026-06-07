# KẾ HOẠCH GO-LIVE & NÂNG CẤP HỆ THỐNG TRAVELCONNECT VN

Tài liệu này phác thảo chi tiết 5 hướng đi tiếp theo để đưa hệ thống từ trạng thái "Hoàn thiện Tính năng" (Feature Complete) sang trạng thái "Sẵn sàng Chạy thực tế" (Production Ready).

---

## 1. 🚀 Triển khai Production (Deployment)
**Mục tiêu:** Đưa nền tảng tiếp cận người dùng thực, đảm bảo tính ổn định, chịu tải và bảo mật.

*   **Kiến trúc Infrastructure:**
    *   Sử dụng **Docker Compose** trên một VPS (Virtual Private Server - VD: DigitalOcean Droplet, AWS EC2, hoặc Linode) để dễ quản lý.
    *   **Frontend (React/Vite):** Đóng gói thành Static Files, host bên trong một container Nginx cực nhẹ (dựa trên `nginxinc/nginx-unprivileged:alpine-slim`).
    *   **Backend (NestJS):** Chạy trong container Node.js LTS, kết nối tới Redis và CSDL.
    *   **Database & Storage:** Vẫn sử dụng **Supabase Cloud** (PostgreSQL & S3) để tiết kiệm tài nguyên máy chủ và dễ dàng mở rộng.
*   **Web Server & Bảo mật HTTPS:**
    *   Triển khai **Traefik** hoặc **Nginx Proxy Manager** làm Reverse Proxy.
    *   Tự động cấp phát chứng chỉ SSL/TLS miễn phí qua **Let's Encrypt** cho các domain (VD: `travelconnect.vn` và `api.travelconnect.vn`).
*   **Tự động hóa CI/CD (GitHub Actions):**
    *   Quy trình CI hiện tại (chạy Test, Lint, Build) đã hoàn thiện.
    *   Bổ sung bước **CD (Continuous Deployment):** Khi code được merge vào nhánh `main` và các bài test PASS, GitHub Actions sẽ tự động push Docker Image lên GHCR (GitHub Container Registry).
    *   VPS sẽ cấu hình Watchtower hoặc webhook để tự động pull ảnh mới về và restart service mà không làm gián đoạn hệ thống (Zero-downtime deployment).

---

## 2. 🛡️ Kiểm toán Bảo mật Toàn diện (Security Audit)
**Mục tiêu:** Vá mọi lỗ hổng có thể bị khai thác trước khi công bố ra công chúng.

*   **Chống DDoS và Botnet (Rate Limiting):**
    *   Sử dụng `@nestjs/throttler` (có cấu hình lưu qua Redis) giới hạn số lượng request.
    *   Tạo rule khắt khe hơn cho các endpoint nhạy cảm (VD: `/auth/login`, `/payments/webhook`, `/chat/media`) để chặn vét cạn mật khẩu hoặc tải file rác.
*   **Vá lỗi theo chuẩn OWASP Top 10:**
    *   **Cross-Site Scripting (XSS):** Audit cấu hình `helmet` (Content-Security-Policy). Frontend React đã mặc định chống XSS, nhưng cần kiểm tra nơi render HTML thô (Rich Text).
    *   **CSRF:** Đảm bảo không có cấu hình CORS lỏng lẻo.
    *   **Data Validation:** Kiểm tra tất cả các DTO xem có bật cấu hình `whitelist: true, forbidNonWhitelisted: true` để tránh Mass Assignment/Prototype Pollution.
*   **Audit Row-Level Security (RLS) của Supabase:**
    *   Vì Bucket `chat-media` đã được mở, cần thiết lập RLS chặt chẽ: chỉ authenticated users (thông qua JWT) mới được phép SELECT và INSERT file. Hạn chế kích thước file tối đa 5MB ở mức DB Storage.

---

## 3. ⚡ Tối ưu Hiệu năng & Refactor (Performance Optimization)
**Mục tiêu:** Hệ thống load nhanh dưới 1.5s, mang lại trải nghiệm mượt mà, giữ chân người dùng.

*   **Tối ưu Frontend (React Core Web Vitals):**
    *   **Code Splitting:** Sử dụng `React.lazy()` và `Suspense` để tách biệt bundle của `AdminLayout`, `ContentLayout`, `FinanceLayout`. Người dùng thường (User/Guide) sẽ không phải tải hàng MB code JS của giao diện quản trị.
    *   **Image Optimization:** Chuyển đổi toàn bộ tài nguyên ảnh sang định dạng WebP/AVIF. Áp dụng kỹ thuật Lazy Load cho các grid danh sách Tour.
*   **Tối ưu Backend (Caching & DB Indexing):**
    *   **Redis Caching:** Lưu trữ tạm thời các API đọc (GET) có tần suất truy cập cực cao nhưng ít biến động (VD: `GET /tours`, `GET /system-settings`, danh sách Category). Redis sẽ tự động invalidate cache khi có tour mới.
    *   **DB Indexing:** Đánh chỉ mục (`@@index`) trong Prisma Schema cho các cột thường xuyên được dùng để lọc và tìm kiếm (`status`, `created_at`, `user_id`, `price`).
*   **Loại bỏ Code thừa (Refactoring):**
    *   Dọn dẹp console.log, warning, cấu trúc lại các folder utility chưa chuẩn hóa.

---

## 4. 📚 Viết Tài liệu & Bàn giao (Documentation)
**Mục tiêu:** Tạo bộ tài liệu chuyên nghiệp giúp thu hút đối tác, lập trình viên mới, và hướng dẫn cho nhân viên vận hành.

*   **README.md Chuyên nghiệp:**
    *   Thêm hình ảnh Screenshot thực tế của ứng dụng (Frontend/Backend).
    *   Mô tả rành mạch Tech Stack.
    *   Hướng dẫn chạy ứng dụng bằng 1 lệnh duy nhất với Docker Compose.
*   **Swagger API Documentation:**
    *   Cài đặt `@nestjs/swagger` để hệ thống tự động sinh giao diện API Docs sống động tại `/api/docs`.
    *   Gắn decorator (`@ApiTags`, `@ApiOperation`, `@ApiProperty`) cho tất cả các endpoint cốt lõi.
*   **User Manual (Sổ tay Vận hành Backoffice):**
    *   Soạn thảo tài liệu markdown hướng dẫn quy trình đối soát kế toán, cách phân giải tranh chấp (Support Staff), cách xét duyệt hồ sơ HDV.
*   **Architecture Decision Records (ADRs):**
    *   Lưu trữ lại lý do đằng sau các quyết định kỹ thuật lớn (VD: Tại sao chọn Prisma? Tại sao dùng Supabase Storage? Tại sao tách rời 4 Role Backoffice?).

---

## 5. 🧪 End-to-End Testing (Kiểm thử UI tự động)
**Mục tiêu:** Đảm bảo toàn bộ luồng nghiệp vụ không bị hỏng sau mỗi lần cập nhật (Regression Testing).

*   **Bộ test Playwright cốt lõi:**
    *   Giả lập tương tác trình duyệt thật, viết các kịch bản kiểm thử (Test Cases) hoàn chỉnh:
        *   **Flow Booking:** Khách hàng (User) đăng nhập -> Tìm kiếm Tour theo từ khóa -> Chọn Tour -> Click Booking -> Mở Popup Thanh toán -> Hướng dẫn viên (Guide) nhận được Tour trong Dashboard.
        *   **Flow Chat & Support:** Khách nhắn tin cho HDV -> Có ảnh gửi đi -> Ấn nút Report báo cáo vi phạm -> Support Staff truy cập Dashboard và thấy ticket mới.
*   **Tích hợp Playwright vào CI/CD:**
    *   Khi đẩy PR mới, GitHub Actions sẽ khởi chạy Frontend/Backend trong môi trường test (Headless Mode) và chạy toàn bộ bộ E2E Test để xác nhận hệ thống không bị lỗi màn hình trắng hay vỡ layout.

---

> [!IMPORTANT]
> **Yêu cầu Quyết định từ Bạn:** 
> Bạn muốn chúng ta bắt đầu bằng hướng đi nào trước? (Ví dụ: Ưu tiên **Tối ưu Hiệu năng** trước để source code hoàn hảo, hay ưu tiên làm **Tài liệu Swagger** để bàn giao, hay setup **Triển khai Production** để chạy thử ngay lập tức?) Hãy báo cho tôi biết nhé!
