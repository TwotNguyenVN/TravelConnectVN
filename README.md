<div align="center">
  <img src="https://placehold.co/1200x400/006ce4/ffffff?text=TravelConnect+VN" alt="TravelConnect VN Banner" width="100%" />

  # 🇻🇳 TravelConnect VN
  **Nền tảng Kết nối Khách Du Lịch và Hướng Dẫn Viên Địa Phương**

  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

## 🌟 Giới thiệu (Introduction)

**TravelConnect VN** là giải pháp toàn diện giúp số hóa và minh bạch hóa ngành du lịch tại Việt Nam. Nền tảng hoạt động như một Marketplace hai chiều, nơi khách du lịch có thể dễ dàng tìm kiếm, đánh giá và đặt lịch các hướng dẫn viên bản địa chuyên nghiệp. 

Hệ thống được thiết kế nguyên khối (Monolith) nhưng áp dụng nguyên tắc Domain-Driven Design (DDD) để dễ dàng mở rộng. Điểm đặc biệt của kiến trúc này là sự chia tách **4 Vai Trò Quản Trị Hệ Thống (Backoffice Roles)** độc lập để tăng tính bảo mật:
1. 👑 **System Admin (Quản trị viên):** Quản lý toàn bộ cấu hình hệ thống, phân quyền, và theo dõi các chỉ số sức khỏe của máy chủ.
2. 🛡️ **Content Moderator (Kiểm duyệt viên):** Duyệt hồ sơ hướng dẫn viên, kiểm duyệt các bài viết đồng hành và xử lý các nội dung vi phạm được AI (Gemini) phát hiện.
3. 💰 **Accountant (Kế toán):** Kiểm soát dòng tiền, xét duyệt các yêu cầu rút tiền của hướng dẫn viên và tính toán hoa hồng nền tảng.
4. 🎧 **Support Staff (Nhân viên CSKH):** Chuyên trách xử lý các khiếu nại (Disputes) giữa Khách du lịch và Hướng dẫn viên, đưa ra quyết định bồi thường.

---

## ✨ Các Tính Năng Nổi Bật (Key Features)
- **Gợi Ý Tour Thông Minh:** Thuật toán AI-based tự động đề xuất tour dựa trên lịch sử tương tác của người dùng.
- **Hệ Thống Chat Thời Gian Thực:** Giao tiếp trực tiếp giữa Khách và HDV qua WebSockets, hỗ trợ gửi ảnh/file.
- **Đa Ngôn Ngữ (i18n):** Hỗ trợ toàn diện Tiếng Việt và Tiếng Anh để mở rộng tệp khách hàng quốc tế.
- **Xử Lý Khiếu Nại Công Bằng:** Chức năng Report/Dispute với sự tham gia của Support Staff làm trọng tài.
- **Thanh Toán Điện Tử:** Tích hợp Payment Gateway (VNPAY/Momo) tự động hóa dòng tiền.

---

## 🛠️ Tech Stack (Công nghệ sử dụng)

### Frontend (Khách hàng & Hướng dẫn viên)
- **Framework:** React 18 với Vite (Nhanh, nhẹ, hỗ trợ HMR tốt).
- **Ngôn ngữ:** TypeScript.
- **Styling:** Tailwind CSS + Radix UI / Shadcn (Giao diện hiện đại, Accessibility cao).
- **Quản lý trạng thái:** Zustand / React Query.
- **Bản đồ:** React Leaflet / Mapbox.

### Backend & API
- **Framework:** NestJS (Node.js).
- **Database:** PostgreSQL (Lưu trữ dữ liệu quan hệ).
- **ORM:** Prisma (Type-safe database client).
- **Caching & Pub/Sub:** Redis (Quản lý phiên, giới hạn tốc độ, WebSockets).
- **Storage:** Supabase Storage (Lưu trữ ảnh, âm thanh, tài liệu).
- **Chat Real-time:** Socket.io với Redis Adapter.
- **AI Integration:** Google Gemini API (Kiểm duyệt nội dung AI, Hỗ trợ xử lý khiếu nại).

---

## 🚀 Khởi chạy Nhanh (Quick Start)

Yêu cầu hệ thống:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js v20.x](https://nodejs.org/)

### 1. Cấu hình Biến môi trường
Cần chuẩn bị các tài khoản dịch vụ sau:
- **Supabase:** Để lấy cấu hình Database URL và Storage Keys.
- **Google Gemini:** Để lấy API Key phân tích nội dung.

Copy file mẫu và điền thông tin tương ứng:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
*(Trong file `.env` của backend, chú ý điền đầy đủ `DATABASE_URL`, `REDIS_HOST`, `SUPABASE_URL`, `SUPABASE_KEY`)*

### 2. Khởi chạy bằng Docker Compose (Đề xuất)
Phương pháp này giúp bạn chạy toàn bộ dự án (Redis cục bộ, Backend, Frontend) trong các Container độc lập mà không cần cài đặt lẻ tẻ môi trường Node.js.

Chỉ với 1 lệnh duy nhất tại thư mục gốc:
```bash
docker-compose up -d --build
```
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs

**Lưu ý khi dùng Docker:**
- Khi bạn có thay đổi code mới, hãy chạy lại lệnh `docker-compose up -d --build` để Docker đóng gói lại bản mới nhất.
- Để tắt hoàn toàn dự án và giải phóng tài nguyên, dùng lệnh:
```bash
docker-compose down
```

### 3. Khởi chạy Thủ công (Môi trường Dev)
```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
---

## 💳 Thông tin Thanh toán Thử nghiệm (VNPAY Sandbox)

Khi thực hiện thử nghiệm luồng đặt tour và thực hiện thanh toán qua cổng VNPAY trong môi trường phát triển, vui lòng sử dụng thông tin thẻ thử nghiệm chính thức dưới đây (Tuyệt đối không dùng thẻ ngân hàng thật):

*   **Cổng thanh toán demo:** [VNPAY Sandbox Demo](https://sandbox.vnpayment.vn/apis/vnpay-demo/)
*   **Tên Ngân hàng chọn khi thanh toán:** `NCB` (Ngân hàng Quốc Dân)
*   **Số thẻ:** `9704198526191432198`
*   **Tên chủ thẻ (không dấu):** `NGUYEN VAN A`
*   **Ngày phát hành:** `07/15` (Tháng 7 năm 2015)
*   **Mã OTP xác thực giao dịch:** `123456`

---


## 📖 Tài liệu Dành cho Dev & Vận hành
* [Sổ tay Vận hành Backoffice (USER_MANUAL.md)](./docs/USER_MANUAL.md) - Hướng dẫn chi tiết cho Kế toán, CSKH, Kiểm duyệt viên.
* [Các Quyết định Kiến trúc (ADRs)](./docs/adr/) - Tại sao dự án lại chọn công nghệ này?
* [Swagger API](http://localhost:3000/api/docs) - Tài liệu tương tác API sau khi chạy backend.

---

## 🛡️ Bảo mật & Hiệu suất
* **Rate Limiting:** Chống DDoS, chặn request spam vào API nhạy cảm.
* **File Validation:** Kiểm duyệt mime-type, chống upload mã độc.
* **Code Splitting:** React.lazy() tải trang siêu tốc.
* **E2E Testing:** Bộ kịch bản Playwright đảm bảo tính ổn định.
