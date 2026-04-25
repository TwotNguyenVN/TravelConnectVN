# SPRINT 03 — TÀI LIỆU VÀ QUY TẮC NGHIỆP VỤ

## 1. Quy tắc hiển thị Public (Rule "Tour công khai là gì")

Theo thiết kế hệ thống TravelConnectVN, một tour được coi là **công khai** và hiển thị cho người dùng/khách vãng lai khi thỏa mãn tất cả các điều kiện sau:

1.  **Trạng thái kinh doanh (`business_status`):** Phải là `published`. Các trạng thái khác như `draft`, `closed`, `cancelled` sẽ không hiển thị trên Public Area.
2.  **Trạng thái hiển thị (`visibility_status`):** Phải là `visible`. Nếu là `hidden`, tour sẽ bị ẩn.
3.  **Trạng thái xóa (`is_deleted`):** Phải là `false`.
4.  **Hồ sơ Hướng dẫn viên (`guide_profile`):** Hồ sơ của người tổ chức tour phải ở trạng thái `visible` và không bị khóa.
5.  **Thời gian:** Tour phải có ngày bắt đầu (`start_date`) lớn hơn hoặc bằng thời điểm hiện tại (trừ trường hợp xem lại lịch sử).

---

## 2. Activity Diagrams

### F12 & F13: Xem danh sách và Tìm kiếm Tour

```mermaid
activityDiagram
    start
    :Khách truy cập vào trang Danh sách Tour;
    :Hệ thống truy vấn API GET /tours;
    if (Có bộ lọc/tìm kiếm?) then (có)
        :Áp dụng filter (địa điểm, giá, loại tour...);
    endif
    :Kiểm tra rule Public (published + visible);
    :Trả về danh sách tour đã phân trang;
    :Hiển thị danh sách card tour;
    stop
```

### F14: Xem chi tiết Tour

```mermaid
activityDiagram
    start
    :Người dùng click vào Card Tour;
    :Gửi yêu cầu GET /tours/:id;
    :Backend join dữ liệu (Ảnh, Guide, Lịch trình, Review);
    if (Tour tồn tại & là Public?) then (đúng)
        :Trả về dữ liệu chi tiết;
        :Hiển thị Màn hình Chi tiết Tour;
    else (sai)
        :Hiển thị thông báo Lỗi/Không tìm thấy;
    endif
    stop
```

---

## 3. Mô tả màn hình (Summary)

- **M01 — Trang chủ:** Điểm vào chính, hiển thị Tour nổi bật, Guide nổi bật và Bài đồng hành mới nhất để điều hướng người dùng.
- **M04 — Danh sách tour:** Hiển thị tất cả tour công khai dưới dạng Grid/List Card.
- **M05 — Tìm kiếm/Lọc:** Tích hợp bộ lọc đa tiêu chí (Tỉnh thành, Giá, Loại tour) để thu hẹp kết quả.
- **M06 — Chi tiết tour:** Cung cấp thông tin chuyên sâu bao gồm bộ sưu tập ảnh, lịch trình chi tiết và thông tin về người hướng dẫn.
