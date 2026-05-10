# SPRINT 02 DOCS – Auth, Hồ sơ cá nhân & Phân quyền

Tài liệu này tổng hợp các quy tắc nghiệp vụ và sơ đồ hoạt động (Activity Diagrams) cho nhóm chức năng Xác thực và Quản lý người dùng trong dự án TravelConnectVN.

---

## 1. Quy tắc nghiệp vụ (Business Rules)

### 1.1. Xác thực (Authentication)
- **Đăng ký:** Người dùng cung cấp Email, Mật khẩu và Họ tên. Hệ thống sử dụng Supabase Auth để tạo tài khoản và tự động tạo bản ghi tương ứng trong bảng `public.users`.
- **Đăng nhập:** Xác thực qua Supabase. Sau khi đăng nhập thành công, hệ thống phải xác định được vai trò (Roles) của người dùng để điều hướng.
- **Trạng thái tài khoản:** 
    - `active`: Hoạt động bình thường.
    - `suspended`: Bị tạm ngưng (có thể xem nhưng không thể tạo mới dữ liệu).
    - `locked`: Khóa hoàn toàn, không thể đăng nhập.

### 1.2. Phân quyền (Authorization)
- **Role mặc định:** `USER` (Khách du lịch).
- **Quy tắc điều hướng Area:**
    - Admin/Moderator -> `/admin`
    - Guide -> `/guide`
    - User -> `/user` (hoặc trang chủ cho Public)

---

## 2. Sơ đồ hoạt động (Activity Diagrams)

### 2.1. Đăng ký & Khởi tạo hồ sơ
```mermaid
activityDiagram
    start
    :Người dùng nhập Email, Pass, FullName;
    :Gửi yêu cầu tới Supabase Auth;
    if (Email đã tồn tại?) then (Có)
        :Thông báo lỗi;
        stop
    else (Không)
        :Tạo Auth User;
        :Trigger/Logic tạo public.users (id = auth.id);
        :Gán role mặc định 'USER';
        :Thông báo thành công;
        :Điều hướng tới trang chủ;
        stop
    endif
```

### 2.2. Đăng nhập & Điều hướng theo vai trò
```mermaid
activityDiagram
    start
    :Người dùng nhập Email, Password;
    :Xác thực qua Supabase;
    if (Sai thông tin?) then (Có)
        :Thông báo lỗi;
        stop
    else (Không)
        :Lấy danh sách roles từ user_roles;
        if (Có role Admin/Mod?) then (Có)
            :Điều hướng tới /admin;
        else if (Có role Guide?) then (Có)
            :Điều hướng tới /guide;
        else
            :Điều hướng tới /user hoặc /;
        endif
        stop
    endif
```

### 2.3. Cập nhật hồ sơ cá nhân
```mermaid
activityDiagram
    start
    :Người dùng sửa thông tin (Tên, SĐT, Ngày sinh...);
    :Kiểm tra tính hợp lệ (SĐT 10 số, Ngày sinh quá khứ);
    if (Hợp lệ?) then (Không)
        :Báo lỗi validation;
    else (Có)
        :Cập nhật vào bảng public.users;
        :Thông báo thành công;
        :Cập nhật state ứng dụng;
    endif
    stop
```

---

## 3. Danh mục màn hình liên quan
- **M01:** Đăng ký
- **M02:** Đăng nhập
- **M15:** Hồ sơ cá nhân
- **M16:** Đổi mật khẩu
