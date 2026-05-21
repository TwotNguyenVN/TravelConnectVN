# Danh sách tài khoản trong hệ thống TravelConnectVN

Dưới đây là danh sách các tài khoản demo và tài khoản người dùng được tạo trong hệ thống cơ sở dữ liệu của TravelConnectVN, phục vụ cho việc kiểm thử và chạy thử nghiệm các tính năng.

> [!NOTE]
> - Mật khẩu mặc định cho tất cả các tài khoản demo được khởi tạo từ hệ thống seed là: **`Tcvn@123`**
> - Đối với các tài khoản được tạo trực tiếp từ chức năng Đăng ký trên web, mật khẩu sẽ do người dùng tự đặt tại thời điểm đăng ký.

---

## 1. Tài khoản Demo Hệ thống (Default Seed Accounts)

Các tài khoản này được tạo sẵn từ tập tin seed (`3.2_Seed_demo_accounts.sql`) dùng chung một mật khẩu là **`Tcvn@123`**.

| Họ và tên | Email đăng nhập | Vai trò (Role Code) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **TCVN Admin** | `admin.travelconnect@gmail.com` | `SYSTEM_ADMIN` | Quản trị viên hệ thống |
| **TravelConnect Content** | `content.travelconnect@gmail.com` | `CONTENT_MODERATOR` | Kiểm duyệt viên nội dung |
| **TravelConnect Support** | `support.travelconnect@gmail.com` | `SUPPORT_STAFF` | Nhân viên hỗ trợ |
| **TCVN Local Guide** | `guide.travelconnect@gmail.com` | `GUIDE` | Hướng dẫn viên du lịch |
| **TCVN Regular User** | `user.travelconnect@gmail.com` | `USER` / `GUIDE` | Thành viên du lịch |

---

## 2. Tài khoản Hướng dẫn viên (Guide Accounts)

Danh sách các tài khoản đang giữ vai trò `GUIDE` trong hệ thống:

| Họ và tên | Email đăng nhập | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Guider** | `guider.travelconnect@gmail.com` | Hoạt động | Hướng dẫn viên kiểm thử chính | Mk: Tcvn@123 
| **Trần Văn Bắc** | `guide.mienbac.tc@gmail.com` | Hoạt động | Hướng dẫn viên khu vực Miền Bắc | 
| **Trần Ngọc Trung** | `guide.mientrung.tc@gmail.com` | Hoạt động | Hướng dẫn viên khu vực Miền Trung |
| **Phạm Thành Nam** | `guide.miennam.tc@gmail.com` | Hoạt động | Hướng dẫn viên khu vực Miền Nam |
| **Trần Gia Nguyên** | `guide.taynguyen.tc@gmail.com` | Hoạt động | Hướng dẫn viên khu vực Tây Nguyên |
| **Luis Dong** | `luisdong0506@gmail.com` | Hoạt động | HDV kiểm thử |
| **Luis Dong** | `luisdong0506+1@gmail.com` | Hoạt động | HDV kiểm thử phụ |
| **Nguyễn Ngọc** | `thtruemiillkkkkk@gmail.com` | Hoạt động | Tài khoản HDV tự đăng ký |
| **Nguyễn Hoàng Tùng** | `thtruemittillk@gmail.com` | Hoạt động | Tài khoản HDV tự đăng ký |
| **nguyễn văn a** | `test1@gmail.com` | Hoạt động | Tài khoản kiểm thử |

---

## 3. Tài khoản Người dùng phổ thông (Regular User Accounts)

Danh sách các tài khoản đang giữ vai trò `USER` trong hệ thống (chủ yếu là khách du lịch):

| Họ và tên | Email đăng nhập | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Twot Nguyễn** | `nguyenngoctinh011258@gmail.com` | Hoạt động | Tài khoản người dùng kiểm thử chính | Mk: Tcvn@123 
| **User2** | `user2.travelconnect@gmail.com` | Hoạt động | Tài khoản người dùng phụ | 
| **true MILK TH** | `thtruemiillk@gmail.com` | Hoạt động | Người dùng đăng ký qua OAuth/Email | 
| **0158_Võ Thành Đông** | `vodong0506@gmail.com` | Hoạt động | Người dùng đăng ký qua OAuth/Email | 
| **Nguyễn Hoàng Tùng** | `thtrueemiillk@gmail.com` | Hoạt động | Người dùng đăng ký qua OAuth/Email | 
| **true MILK THhh** | `thtruemiillkkkkkkkkk@gmail.com` | Hoạt động | Người dùng đăng ký qua OAuth/Email |
| **aaaaaaaaa...** | `vothanhdong0506@gmail.com` | Hoạt động | Người dùng đăng ký qua OAuth/Email |
    