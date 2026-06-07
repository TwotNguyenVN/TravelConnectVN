# ADR 0001: Sử dụng Prisma ORM thay vì TypeORM

**Ngày:** 2026-06-07
**Trạng thái:** Đã chấp thuận

## Ngữ cảnh (Context)
Dự án TravelConnect VN sử dụng Node.js (NestJS) và PostgreSQL. Chúng ta cần một công cụ ánh xạ dữ liệu (ORM) để thao tác với cơ sở dữ liệu. TypeORM là mặc định của hệ sinh thái NestJS, tuy nhiên nó có vấn đề về Type-safety và cấu hình migration khá phức tạp.

## Quyết định (Decision)
Chúng ta quyết định chọn **Prisma ORM**.

## Lý do (Rationale)
1. **Type-safety tuyệt đối:** Prisma tạo ra các Type TypeScript tự động dựa trên `schema.prisma`. Bất kỳ thay đổi nào trong DB đều lập tức phản ánh lên code, giúp trình biên dịch phát hiện lỗi ngay từ lúc code (compile-time) thay vì lúc chạy (runtime).
2. **Schema Declarative:** Toàn bộ cấu trúc CSDL được định nghĩa trong 1 file duy nhất (`schema.prisma`), rất dễ đọc và quản lý.
3. **Migration dễ dàng:** `prisma migrate dev` hoạt động cực kỳ mượt mà, tự sinh ra mã SQL chuẩn xác.
4. **Hỗ trợ tốt JSON & mảng:** Rất phù hợp với PostgreSQL khi lưu các trường dữ liệu linh hoạt (như `tour_images` hay các meta data).

## Hệ quả (Consequences)
- **Tích cực:** Tốc độ code (Developer Experience) nhanh hơn rất nhiều. Hầu như không có lỗi sai chính tả truy vấn SQL.
- **Tiêu cực:** Prisma Client có thể tiêu tốn bộ nhớ khởi tạo lúc đầu lớn hơn một chút so với TypeORM. Tuy nhiên, điều này chấp nhận được với kiến trúc Server thông thường.
