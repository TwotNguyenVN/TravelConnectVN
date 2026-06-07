<div align="center">
  <img src="https://placehold.co/1200x400/006ce4/ffffff?text=TravelConnect+VN" alt="TravelConnect VN Banner" width="100%" />

  # 🇻🇳 TravelConnect VN
  **Nền tảng Kết nối Khách Du Lịch và Hướng Dẫn Viên Địa Phương**

  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
</div>

---

## 🌟 Giới thiệu (Introduction)

**TravelConnect VN** là giải pháp toàn diện giúp số hóa và minh bạch hóa ngành du lịch tại Việt Nam. Nền tảng hoạt động như một Marketplace hai chiều, nơi khách du lịch có thể dễ dàng tìm kiếm, đánh giá và đặt lịch các hướng dẫn viên bản địa chuyên nghiệp. 

Hệ thống được thiết kế nguyên khối (Monolith) nhưng áp dụng nguyên tắc Domain-Driven Design (DDD) để sẵn sàng mở rộng (Scale).

> [!NOTE] 📸 Xem Screenshots thực tế
> *(Vui lòng chèn link ảnh thực tế của bạn tại đây)*
> ![Trang chủ](https://placehold.co/800x450/e6f0fa/006ce4?text=Trang+Chu)
> ![Admin Dashboard](https://placehold.co/800x450/e6f0fa/006ce4?text=Admin+Dashboard)

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
Copy file mẫu và điền thông tin (Database URL, Supabase Keys, Gemini API Key):
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Khởi chạy bằng Docker Compose (Đề xuất)
Chạy toàn bộ Database (Postgres), Redis, Backend và Frontend chỉ với 1 lệnh:
```bash
docker-compose up -d
```
- **Frontend:** http://localhost:8080 (hoặc cổng cấu hình)
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs

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
