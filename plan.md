# Triển Khai DevOps, Monitoring & CI/CD 🚀

Tôi đã hoàn thiện hệ thống Production Readiness bao gồm Dockerization, Prometheus Monitoring, và CI/CD Pipeline. 

## Các Thay Đổi Chính (Changes Made)

### 1. Dockerization (Đóng gói ứng dụng)
- **Backend Dockerfile**: Sử dụng Node 20 Alpine với multi-stage build, tự động chạy `prisma generate` và build mã nguồn NestJS.
- **Frontend Dockerfile**: Build ứng dụng React (Vite) và sử dụng **Nginx** để serve các file tĩnh (static assets), đã cấu hình `nginx.conf` hỗ trợ SPA Routing (fallback về `index.html`) và Gzip compression.
- **Docker Compose**: Mở rộng `docker-compose.yml` để chạy toàn bộ stack cục bộ dễ dàng, bao gồm `redis`, `backend`, `frontend`, `prometheus`, và `grafana`.

### 2. Monitoring & Health Checks (NestJS)
- **Health Check Endpoint (`/api/health`)**: Sử dụng `@nestjs/terminus` để tự động ping Database (Prisma) và kiểm tra mức sử dụng RAM (Memory Heap). 
- **Prometheus Metrics (`/metrics`)**: Cài đặt `@willsoto/nestjs-prometheus` để phơi bày (expose) các chỉ số quan trọng của Node.js.
- **Prometheus Config**: Đã viết file `prometheus.yml` cấu hình scrape data từ backend mỗi 15 giây.

### 3. CI/CD Pipeline (GitHub Actions)
- Đã nâng cấp luồng `.github/workflows/ci.yml`.
- Xóa bỏ `continue-on-error: true` ở các bước Test & Build để chặn đứng mọi đoạn code lỗi trước khi merge vào `develop`.
- Thêm job **Test Build Docker Images** sử dụng `docker/build-push-action@v5` chạy mô phỏng build cả Frontend và Backend để đảm bảo Dockerfile hoạt động chính xác trước khi deploy.
- Tự động chạy CI/CD khi có sự kiện Push lên nhánh `develop` hoặc tạo Pull Request.

## Kết Quả Kiểm Tra (Validation)
- ✅ `npm run build` ở backend đã biên dịch thành công sau khi thêm module mới.
- ✅ Các file cấu hình (`nginx.conf`, `Dockerfile`, `prometheus.yml`) đều theo sát tiêu chuẩn thực tế.

> [!TIP]
> **Bước tiếp theo dành cho bạn**: 
> 1. Chạy thử `docker-compose up -d --build` tại máy local để trải nghiệm toàn bộ stack.
> 2. Truy cập [http://localhost:3000/api/health](http://localhost:3000/api/health) và [http://localhost:3000/metrics](http://localhost:3000/metrics).
> 3. Đăng nhập Grafana tại [http://localhost:3001](http://localhost:3001) và thêm Prometheus (URL: `http://prometheus:9090`) làm Data Source!
