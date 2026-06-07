# ADR 0002: Sử dụng Supabase Storage cho Tệp Đính Kèm

**Ngày:** 2026-06-07
**Trạng thái:** Đã chấp thuận

## Ngữ cảnh (Context)
Hệ thống TravelConnect VN cho phép người dùng (User) và Hướng dẫn viên (Guide) upload ảnh đại diện, ảnh tour, cũng như gửi hình ảnh và đoạn ghi âm (voice) trong tính năng Chat. Chúng ta cần một hệ thống lưu trữ tệp (Object Storage) bền bỉ, an toàn và dễ dùng từ Frontend và Backend.

## Quyết định (Decision)
Thay vì lưu ảnh trực tiếp trên ổ cứng máy chủ (Local Disk) hay dùng AWS S3 phức tạp, dự án quyết định sử dụng **Supabase Storage**.

## Lý do (Rationale)
1. **API thân thiện:** `supabase-js` cung cấp API tải lên và lấy public URL vô cùng đơn giản cả trên Frontend (React) và Backend (NestJS).
2. **Tích hợp bảo mật (RLS):** Supabase Storage hỗ trợ cấu hình Row Level Security, chặn được các truy cập trái phép.
3. **Hiệu suất & CDN:** Supabase tự động tối ưu và phân phối file qua CDN, giúp tải ảnh nhanh hơn rất nhiều so với tự host.
4. **Miễn phí & Dễ scale:** Gói miễn phí của Supabase hoàn toàn đủ cho nhu cầu ban đầu của dự án, việc nâng cấp cũng chỉ bằng vài cú click.

## Hệ quả (Consequences)
- **Tích cực:** Giảm thiểu cấu trúc hạ tầng server-side phức tạp để host file. Database backup cũng không bị phình to (vì chỉ lưu link URL của ảnh).
- **Tiêu cực:** Phụ thuộc vào dịch vụ bên thứ ba (Vendor lock-in). Tuy nhiên Supabase là mã nguồn mở nên việc tự host lại toàn bộ cụm Supabase trong tương lai vẫn khả thi.
