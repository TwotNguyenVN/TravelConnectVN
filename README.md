# 🌍 TravelConnectVN

**Nền tảng kết nối du lịch thông minh: Hướng dẫn viên địa phương & Bạn đồng hành xê dịch**

[![Sprint](https://img.shields.io/badge/Sprint-14%20(Final)-green.svg)](https://github.com/zTwotz/TravelConnectVN)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20NestJS%20%7C%20Supabase-blue.svg)](https://github.com/zTwotz/TravelConnectVN)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Tổng quan dự án

**TravelConnectVN** là một nền tảng du lịch hiện đại, được thiết kế để giải quyết bài toán kết nối trong du lịch trải nghiệm. Hệ thống không chỉ đơn thuần là một website đặt tour (OTA), mà còn là một cộng đồng nơi:
1. **Khách du lịch** tìm kiếm những hướng dẫn viên (HDV) địa phương am hiểu văn hóa.
2. **Người xê dịch** tìm thấy những người bạn đồng hành cùng sở thích.
3. **Hướng dẫn viên** tự do thiết kế và quảng bá các sản phẩm du lịch cá nhân hóa.

Dự án được xây dựng với kiến trúc **Modular**, tối ưu hóa cho hiệu năng và khả năng mở rộng, tích hợp các công nghệ hiện đại như AI Chat và Bản đồ tương tác.

---

## ✨ Tính năng cốt lõi

Hệ thống được chia thành 9 phân hệ chức năng chính:

1.  **Quản lý tài khoản & Phân quyền:** Đăng ký/Đăng nhập (Google OAuth), quản lý hồ sơ và phân quyền đa cấp (Guest, User, Guide, Admin).
2.  **Hồ sơ Hướng dẫn viên chuyên sâu:** Xây dựng thương hiệu cá nhân với kỹ năng, kinh nghiệm và hệ thống xác thực thẻ HDV.
3.  **Hệ thống Quản lý Tour (CMS):** HDV tự thiết kế tour với lịch trình chi tiết, quản lý trạng thái (Draft, Published, Closed).
4.  **Tìm kiếm & Bộ lọc thông minh:** Tìm tour theo địa điểm, giá cả, thời gian và loại hình du lịch.
5.  **Cộng đồng Bạn đồng hành:** Đăng bài tìm người đi cùng, thiết lập các tiêu chí về phong cách chuyến đi.
6.  **Luồng Đặt chỗ & Phê duyệt:** Quy trình gửi yêu cầu tham gia và phê duyệt thời gian thực giữa Khách và Người tổ chức.
7.  **Đánh giá & Phản hồi (Social Proof):** Hệ thống đánh giá 5 sao và bình luận công khai minh bạch.
8.  **Bản đồ lộ trình tương tác:** Hiển thị tọa độ thực và tuyến đường di chuyển của các tour du lịch.
9.  **Bảng điều khiển Quản trị (Admin Dashboard):** Kiểm duyệt nội dung, quản lý người dùng và thống kê báo cáo chuyên sâu.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Lớp (Layer) | Công nghệ |
| :--- | :--- |
| **Frontend** | ReactJS (Vite), TypeScript, TailwindCSS/Vanilla CSS |
| **Backend** | NestJS (Node.js), Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | Supabase Auth (JWT, Google OAuth) |
| **Storage** | Supabase Storage (Hình ảnh, Tài liệu xác thực) |
| **Integrations** | Mapbox/Leaflet (Map), VNPAY (Payment Sandbox), AI Chat |

---

## 🏗 Kiến trúc hệ thống

Dự án được thiết kế theo mô hình **4 Area** riêng biệt:

*   **Public Area:** Trang chủ, tìm kiếm tour, bài đăng cộng đồng (Dành cho mọi khách truy cập).
*   **User Area:** Quản lý tour đã đặt, bài đăng đồng hành cá nhân, lịch sử hoạt động.
*   **Guide Area:** Bảng điều khiển dành riêng cho HDV để quản lý tour và khách hàng.
*   **Admin Area:** Quản trị toàn bộ hệ thống, kiểm duyệt và thống kê.

---

## 🚀 Hướng dẫn cài đặt & Sử dụng

### Yêu cầu hệ thống
*   **Node.js**: v24 trở lên (Script `setup.sh` có hỗ trợ tự động kiểm tra và cài đặt).
*   **NPM** hoặc **Yarn**.
*   **Terminal**:
    *   **macOS**: Dùng Terminal mặc định.
    *   **Windows**: Yêu cầu cài đặt [Git Bash](https://gitforwindows.org/) để chạy các script `.sh`.
*   Tài khoản Supabase (đã cấu hình schema và env).

### Các bước cài đặt

**1. Clone dự án:**
```bash
git clone https://github.com/zTwotz/TravelConnectVN.git
cd TravelConnectVN
```

**2. Lựa chọn phương thức cài đặt:**

Bạn có thể chọn 1 trong 2 cách dưới đây:

**Cách A: Cài đặt tự động qua Script (Khuyên dùng)**
Hệ thống cung cấp script tự động cài đặt các thư viện cần thiết cho cả Frontend và Backend, đồng thời kiểm tra/cài đặt Node.js nếu cần.

*   **Trên macOS (Terminal)** hoặc **Windows (Git Bash)**:
```bash
./setup.sh
```
*(Nếu Windows chưa có Node.js, script sẽ gọi `winget` để cài. Bạn có thể cần khởi động lại Git Bash sau khi cài đặt xong).*

**Cách B: Cài đặt thủ công (Tự kiểm soát từng bước)**
Dành cho người muốn theo dõi quá trình cài đặt chi tiết:

1.  **Cài đặt Backend & Khởi tạo Prisma:**
    ```bash
    cd backend
    npm install
    npx prisma generate
    cd ..
    ```
2.  **Cài đặt Frontend:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

**3. Cấu hình biến môi trường (.env):**
Bất kể dùng cách cài đặt nào, bạn cần kết nối ứng dụng với cơ sở dữ liệu Supabase của mình.
Hãy copy mẫu từ file `.env.example` (nếu có) hoặc tạo file mới:

*   **Thư mục Backend (`backend/.env`)**:
    ```env
    SUPABASE_URL=your_supabase_url
    DIRECT_URL=your_database_connection_string
    ```
*   **Thư mục Frontend (`frontend/.env`)**:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

**4. Khởi chạy dự án:**
Sau khi hoàn tất cấu hình, bạn cần mở **2 cửa sổ Terminal** chạy song song:

*   **Terminal 1 (Khởi chạy Backend):**
    ```bash
    cd backend
    npm run start:dev
    ```
    *(API sẽ chạy tại `http://localhost:3000`)*

*   **Terminal 2 (Khởi chạy Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
    *(Giao diện sẽ chạy tại `http://localhost:5173`, hãy mở link này trên trình duyệt)*

### Lệnh quan trọng
*   `npm run dev`: Chạy môi trường phát triển (trong thư mục frontend).
*   `./clean.sh`: Dọn dẹp máy sau khi làm việc (Lưu ý: trên Windows dùng Git Bash để chạy).
*   **Mở Prisma Studio (Giao diện CSDL):**
    ```bash
    cd backend
    npx prisma studio
    ```
*   **Xem tài liệu API (Swagger):** Mở trình duyệt và truy cập `http://localhost:3000/api/docs` (sau khi đã chạy backend).

---

## 📈 Lộ trình phát triển (Roadmap)

Dự án hiện đang ở **Sprint 14 (Giai đoạn Final)**:
- [x] Sprint 01-11: Hoàn thiện nền tảng, Auth, Tour, Companion, Admin Core.
- [x] Sprint 12: Hệ thống Chat trực tiếp.
- [x] Sprint 13: Tích hợp AI Chatbot & Thanh toán VNPAY.
- [~] **Sprint 14 (Current):** QA tổng thể, Polish UI/UX, Chuẩn hóa Demo Data & Báo cáo bảo vệ.

---

## 💳 Thông tin Thanh toán Demo (VNPAY Sandbox)

Để thử nghiệm chức năng thanh toán qua cổng VNPAY trong môi trường phát triển, vui lòng sử dụng thông tin thẻ test dưới đây (không sử dụng thẻ thật):
https://sandbox.vnpayment.vn/apis/vnpay-demo/

*   **Ngân hàng:** `NCB`
*   **Số thẻ:** `9704198526191432198`
*   **Tên chủ thẻ:** `NGUYEN VAN A`
*   **Ngày phát hành:** `07/15`
*   **Mã OTP:** `123456`

---

## ✍️ Tác giả & Liên hệ

*   **Dự án:** Đồ án Cơ sở - TravelConnectVN
*   **Phiên bản:** 1.0.0 (Build 2026)
*   **Người thực hiện:** [zTwotz]

---
*© 2026 TravelConnectVN. All rights reserved.*
