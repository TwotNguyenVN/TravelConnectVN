# Cấu trúc thư mục Cơ sở dữ liệu

Thư mục này chứa toàn bộ các file SQL liên quan đến baseline schema, migrations, và dữ liệu mẫu (seed data) phục vụ cho dự án **TravelConnectVN**.

## Cấu trúc hiện tại

- `schema/`: Chứa các script tạo cấu trúc bảng lõi và các object cơ sở dữ liệu ban đầu (functions, triggers). Trong Sprint 01, `01_baseline_tables.sql` đóng vai trò kiến trúc cho 5 bảng chính phục vụ xác thực và phân quyền.
- `migrations/`: (Chưa có nội dung) Sẽ chứa các file thay đổi database theo version khi dự án dùng các công cụ migration.
- `seed/`: Chứa các dữ liệu mồi mặc định (như cấu hình, role, v.v.) cần thiết để ứng dụng hoạt động ngay sau khi tạo schema. Các file trong đây bắt buộc viết theo hướng **idempotent** (có thể chạy lại nhiều lần không lỗi).

## Quy trình làm việc với Database

1. Đảm bảo cấu trúc thiết kế ở đây khớp 100% với `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md` trước khi tiến hành cập nhật.
2. AI Agent chỉ được phép đề xuất thay đổi file trong thư mục này, không tự ý đẩy cấu trúc lên Supabase nếu chưa được sự đồng ý của User.
3. Không thực hiện lệnh DROP, TRUNCATE trực tiếp trên dữ liệu thật. Mọi migration phải mang tính chất additive.
