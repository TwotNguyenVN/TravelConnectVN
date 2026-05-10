# SPRINT 02 – Triển khai tài khoản, hồ sơ cá nhân và phân quyền người dùng

## 1. Mục tiêu sprint

Sprint 02 là sprint bắt đầu hiện thực **nghiệp vụ lõi đầu tiên** của hệ thống sau khi Sprint 01 đã dựng xong nền tảng kỹ thuật. Trọng tâm của sprint này là giúp hệ thống có thể:
- tạo tài khoản mới;
- đăng nhập và đăng xuất;
- lấy thông tin người dùng hiện tại;
- cập nhật hồ sơ cá nhân;
- đổi mật khẩu;
- điều hướng người dùng đúng khu vực theo vai trò.

Đây là sprint có tính chất **bắt buộc** vì gần như toàn bộ các sprint phía sau như Guide Profile, Tour, Tour Request, Companion Post, Report và Admin đều phụ thuộc trực tiếp vào lớp xác thực, hồ sơ người dùng và cơ chế phân quyền.

### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F01:** Đăng ký, đăng nhập, đăng xuất
  - **F02:** Quản lý hồ sơ cá nhân
  - **F03:** Phân quyền người dùng
- Làm cho luồng xác thực hoạt động xuyên suốt giữa:
  - Supabase Auth
  - `public.users`
  - `roles`
  - `user_roles`
- Thiết lập được cơ chế điều hướng sau đăng nhập theo từng vai trò:
  - User
  - Guide
  - Admin
- Chuẩn hóa dữ liệu hồ sơ cá nhân để các sprint sau có thể dùng lại.
- Dựng xong các màn hình xác thực và quản lý hồ sơ ở mức dùng thật, không chỉ là demo giao diện.
- Chốt cơ chế route guard, role guard và menu theo quyền.
- Chuẩn bị sẵn dữ liệu demo cho từng nhóm tài khoản để test flow nghiệp vụ.

### Ý nghĩa của sprint này
Nếu Sprint 02 làm chắc, các sprint sau sẽ có lợi thế rất lớn:
- frontend không phải sửa lại flow đăng nhập;
- backend không phải viết lại cơ chế đọc user hiện tại;
- database không bị lệch giữa `auth.users` và `public.users`;
- UML và báo cáo bám đúng flow thật;
- việc phân vai demo User / Guide / Admin trở nên rõ ràng và thuyết phục hơn.

---

## 2. Lưu ý trước khi triển khai

## 2.1. Không chỉ “đăng nhập được” là đủ
Sai lầm phổ biến của sprint auth là chỉ dừng ở mức:
- đăng ký xong;
- đăng nhập được;
- hiển thị token hoặc session.

Với đồ án này, Sprint 02 phải đi xa hơn:
- xác định rõ đăng nhập xong user đi đâu;
- guide đi đâu;
- admin đi đâu;
- menu nào hiển thị cho vai trò nào;
- màn hình nào cần chặn nếu không đủ quyền.

## 2.2. Phải thống nhất giữa Auth và hồ sơ nghiệp vụ
Cần giữ nguyên nguyên tắc đã chốt ở Sprint 01:
- `auth.users` là nơi Supabase quản lý xác thực;
- `public.users` là nơi lưu hồ sơ nghiệp vụ;
- `roles` là danh mục vai trò;
- `user_roles` là bảng gán vai trò thật.

Không nên:
- lưu toàn bộ hồ sơ vào metadata token rồi dùng tạm;
- hardcode role ở frontend;
- bỏ qua `public.users` để đi nhanh;
- để frontend tự suy ra quyền mà không hỏi backend.

## 2.3. Điều hướng theo vai trò phải được chốt ngay
Sprint này cần chốt sớm quy tắc điều hướng sau đăng nhập. Phương án triển khai thực tế nên là:
- tài khoản chỉ có `USER` → vào **User Area**;
- có `GUIDE` → được phép vào **Guide Area**;
- có một trong các role quản trị như `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF` → vào **Admin Area**;
- nếu một tài khoản có nhiều role, ưu tiên điều hướng theo role có khu vực làm việc cao hơn hoặc cho phép chọn area sau đăng nhập.

Trong phạm vi đồ án, để đơn giản hóa demo, có thể chốt thứ tự ưu tiên:
1. Admin
2. Guide
3. User

## 2.4. Dữ liệu hồ sơ cá nhân phải “dùng được thật”
Sprint này không nên chỉ tạo form cho có. Hồ sơ cá nhân phải cho phép xem và cập nhật tối thiểu các trường:
- họ tên;
- số điện thoại;
- ảnh đại diện;
- ngày sinh;
- giới tính.

Các trường này phải bám theo bảng `users` để tránh lệch báo cáo và code.

## 2.5. Đổi mật khẩu phải đi kèm kiểm tra dữ liệu
Màn hình đổi mật khẩu phải có tối thiểu:
- mật khẩu hiện tại;
- mật khẩu mới;
- xác nhận mật khẩu mới;
- kiểm tra hợp lệ;
- thông báo lỗi rõ ràng.

Không nên làm sơ sài kiểu chỉ nhập một trường mật khẩu mới, vì điều đó vừa kém thực tế vừa khó bảo vệ khi trình bày luồng bảo mật cơ bản.

## 2.6. Sprint 02 phải có định nghĩa “xong sprint” rõ ràng
Sprint này chỉ được coi là hoàn thành khi có đủ:
- màn hình đăng ký, đăng nhập, hồ sơ cá nhân, đổi mật khẩu;
- API auth và profile hoạt động;
- dữ liệu `public.users` được tạo/đồng bộ đúng;
- role được trả về đúng để frontend điều hướng;
- có tài khoản demo cho User, Guide, Admin;
- có test flow tối thiểu;
- có cập nhật Activity Diagram tương ứng.

---

## 3. Các vấn đề cần xác định trong sprint này

## 3.1. Luồng đăng ký tài khoản
Cần chốt:
- đăng ký bằng email + password;
- có xác nhận mật khẩu;
- có họ tên cơ bản;
- sau khi đăng ký thì tạo `public.users` khi nào;
- role mặc định có phải là `USER` hay không.

## 3.2. Luồng đăng nhập và đăng xuất
Cần xác định:
- đăng nhập bằng email/password;
- xử lý lỗi khi sai tài khoản hoặc mật khẩu;
- xử lý khi tài khoản đang `suspended` hoặc `locked`;
- đăng xuất sẽ hủy session ở mức nào;
- sau logout chuyển về đâu.

## 3.3. Route guard và role-based menu
Cần chốt:
- route nào yêu cầu đăng nhập;
- route nào chỉ dành cho Guide;
- route nào chỉ dành cho Admin;
- menu nào xuất hiện theo vai trò;
- khi không đủ quyền thì hiện thông báo gì.

## 3.4. Quy tắc dữ liệu của bảng `users`
Cần thống nhất:
- email có được xem là định danh chính hay không;
- phone có unique hay chưa;
- avatar lưu URL hay upload file ngay trong sprint này;
- trạng thái tài khoản gồm những giá trị nào;
- trường nào được phép sửa, trường nào không.

## 3.5. Cơ chế cập nhật hồ sơ cá nhân
Cần chốt:
- người dùng chỉ sửa dữ liệu của chính mình;
- không cho phép sửa role;
- không cho phép sửa trạng thái tài khoản;
- kiểm tra hợp lệ cho ngày sinh, giới tính, số điện thoại.

## 3.6. Cơ chế đổi mật khẩu
Cần xác định:
- dùng khả năng đổi mật khẩu qua Supabase Auth;
- có yêu cầu nhập mật khẩu hiện tại hay không;
- có chính sách độ dài tối thiểu hay không;
- có buộc đăng nhập lại sau khi đổi mật khẩu hay không.

---

## 4. Hạng mục cần chốt

Trong Sprint 02, các hạng mục sau phải được chốt dứt điểm trước khi đi sâu vào code:

- Luồng đăng ký tài khoản và tạo hồ sơ nghiệp vụ.
- Luồng đăng nhập, đăng xuất và lấy user hiện tại.
- Điều hướng sau đăng nhập theo từng vai trò.
- Cấu trúc màn hình xác thực và hồ sơ người dùng.
- Quy tắc dữ liệu của bảng `users`.
- Quy tắc phân quyền theo `roles` và `user_roles`.
- Phạm vi quyền của từng loại tài khoản trong giai đoạn đầu.
- Chuẩn response cho các API auth/profile.
- Dữ liệu mẫu để test User / Guide / Admin.
- Activity Diagram cho nhóm chức năng tài khoản và người dùng.

---

## 5. Phương án được chọn

## 5.1. Mô hình xác thực
- Dùng **Supabase Auth** để xử lý:
  - đăng ký;
  - đăng nhập;
  - đăng xuất;
  - quản lý thông tin xác thực;
  - đổi mật khẩu.
- Không tự xây hệ thống password hash riêng trong `public.users`.

## 5.2. Mô hình dữ liệu người dùng
- `auth.users` quản lý danh tính xác thực.
- `public.users` lưu hồ sơ nghiệp vụ mở rộng.
- `public.users.id` tham chiếu 1–1 tới `auth.users.id`.
- Khi đăng ký thành công, hệ thống phải tạo bản ghi trong `public.users`.
- Role mặc định sau đăng ký là `USER`.

## 5.3. Mô hình phân quyền
- Dùng bảng `roles` để lưu danh mục role:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- Dùng `user_roles` để gán nhiều vai trò cho một user nếu cần.
- Backend kiểm tra quyền bằng guard.
- Frontend dùng dữ liệu role từ API để:
  - điều hướng area;
  - hiển thị menu;
  - chặn route không phù hợp.

## 5.4. Điều hướng sau đăng nhập
Đề xuất chốt để nhất quán toàn bộ roadmap:
- Có role quản trị → chuyển vào dashboard/admin area.
- Nếu không có role quản trị nhưng có `GUIDE` → chuyển vào guide area.
- Nếu chỉ có `USER` → chuyển vào user area.
- Với tài khoản đa vai trò, có thể ưu tiên tự động theo thứ tự trên trong giai đoạn đầu để giảm độ phức tạp.

## 5.5. Mô hình hồ sơ cá nhân
Các trường cho phép hiển thị/cập nhật trong Sprint 02:
- `full_name`
- `phone`
- `avatar_url`
- `date_of_birth`
- `gender`

Các trường không cho người dùng tự sửa trực tiếp ở sprint này:
- `id`
- `email` (nếu muốn đổi email có thể để sau)
- `status`
- `role`

## 5.6. Mô hình trạng thái tài khoản
Theo schema đã chốt, `users.status` gồm:
- `active`
- `suspended`
- `locked`

Trong Sprint 02:
- `active`: đăng nhập bình thường;
- `suspended`: có thể chặn các thao tác hoặc chặn truy cập tùy rule triển khai;
- `locked`: không cho đăng nhập.

Để đơn giản trong giai đoạn này, nên áp dụng:
- `active` → cho phép đăng nhập;
- `suspended` và `locked` → từ chối đăng nhập và trả thông báo rõ ràng.

## 5.7. Mô hình đổi mật khẩu
- Dùng API/service của Supabase Auth để đổi mật khẩu.
- Form bắt buộc có:
  - mật khẩu hiện tại;
  - mật khẩu mới;
  - xác nhận mật khẩu mới.
- Kiểm tra:
  - mật khẩu mới khác mật khẩu cũ;
  - xác nhận trùng khớp;
  - độ dài tối thiểu hợp lý.

---

## 6. Ghi chú triển khai

- Sprint 02 là sprint nền nghiệp vụ, nên phải ưu tiên **độ chắc luồng** hơn là làm nhiều màn hình phụ.
- Chỉ nên làm đủ sâu cho:
  - đăng ký;
  - đăng nhập;
  - đăng xuất;
  - hồ sơ cá nhân;
  - đổi mật khẩu;
  - điều hướng theo vai trò.
- Không mở rộng sớm sang:
  - quên mật khẩu nâng cao;
  - xác thực hai lớp;
  - chỉnh email;
  - upload ảnh phức tạp;
  - quản lý role ở admin sâu.
- Các API và giao diện ở sprint này phải được viết theo hướng tái sử dụng, vì gần như mọi sprint tiếp theo đều gọi lại `/me` hoặc phụ thuộc vào role hiện tại.
- Khi test sprint này, bắt buộc phải có ít nhất 3 nhóm tài khoản demo:
  - tài khoản User;
  - tài khoản Guide;
  - tài khoản Admin.

---

## 7. Chức năng trọng tâm

Sprint 02 tập trung hiện thực 3 chức năng lõi sau:

- **F01 – Đăng ký, đăng nhập, đăng xuất**
  - tạo tài khoản mới;
  - xác thực tài khoản;
  - hủy phiên làm việc.

- **F02 – Quản lý hồ sơ cá nhân**
  - xem thông tin cá nhân hiện tại;
  - cập nhật hồ sơ;
  - đổi mật khẩu.

- **F03 – Phân quyền người dùng**
  - xác định user đang có role nào;
  - dùng role để điều hướng và kiểm soát truy cập;
  - chuẩn bị nền cho Guide Area và Admin Area ở các sprint sau.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình
Các màn hình trong Sprint 02 phải thể hiện được:
- người dùng có thể bắt đầu sử dụng hệ thống;
- hệ thống nhận diện đúng người dùng;
- hệ thống điều hướng đúng khu vực;
- người dùng có thể quản lý hồ sơ cơ bản của mình.

## 8.2. Các màn hình cần triển khai trong Sprint 02

### M02 – Đăng ký tài khoản
Thành phần chính:
- email;
- mật khẩu;
- xác nhận mật khẩu;
- họ tên cơ bản;
- nút đăng ký;
- thông báo lỗi hợp lệ;
- liên kết sang đăng nhập.

Yêu cầu:
- kiểm tra trùng khớp mật khẩu;
- kiểm tra định dạng email;
- xử lý lỗi khi email đã tồn tại;
- sau đăng ký thành công, tạo được hồ sơ nghiệp vụ và role mặc định.

### M03 – Đăng nhập
Thành phần chính:
- email;
- mật khẩu;
- nút đăng nhập;
- thông báo lỗi;
- liên kết đăng ký;
- thông báo trạng thái tài khoản nếu bị chặn.

Yêu cầu:
- đăng nhập thành công phải lấy được user hiện tại;
- lấy được role hiện tại;
- điều hướng đúng area theo vai trò.

### M15 – Hồ sơ cá nhân
Thành phần chính:
- ảnh đại diện;
- họ tên;
- số điện thoại;
- ngày sinh;
- giới tính;
- email ở chế độ xem;
- nút cập nhật hồ sơ.

Yêu cầu:
- chỉ sửa dữ liệu của chính mình;
- dữ liệu hiển thị đúng từ `public.users`;
- có validate hợp lệ trước khi gửi.

### M16 – Đổi mật khẩu
Thành phần chính:
- mật khẩu hiện tại;
- mật khẩu mới;
- xác nhận mật khẩu mới;
- nút lưu thay đổi;
- thông báo thành công/thất bại.

Yêu cầu:
- kiểm tra xác nhận;
- xử lý lỗi hợp lệ;
- có phản hồi rõ ràng sau khi đổi.

## 8.3. Thành phần UI dùng chung cần tận dụng
Sprint này nên tái sử dụng bộ component từ Sprint 01:
- input;
- password input;
- button;
- alert/message;
- form validation state;
- loading state;
- protected layout;
- unauthorized state.

## 8.4. Kết quả mong đợi của phần màn hình
- Người dùng có thể tự đăng ký tài khoản.
- Có thể đăng nhập bằng tài khoản vừa tạo.
- Có thể xem hồ sơ cá nhân ngay sau khi đăng nhập.
- Có thể cập nhật hồ sơ mà không lỗi luồng.
- Có thể đổi mật khẩu thành công.
- Khi đăng nhập bằng các role khác nhau, giao diện điều hướng đúng khu vực.

---

## 9. Bảng CSDL chính

Sprint 02 tập trung vào 3 bảng lõi:

## 9.1. `users`
### Vai trò
Lưu hồ sơ nghiệp vụ mở rộng của người dùng.

### Trường quan trọng
- `id`
- `email`
- `full_name`
- `phone`
- `avatar_url`
- `date_of_birth`
- `gender`
- `status`
- `created_at`
- `updated_at`
- `last_seen_at`

### Ràng buộc quan trọng
- `id` tham chiếu `auth.users(id)`;
- `gender` thuộc một trong các giá trị `male`, `female`, `other` hoặc `null`;
- `status` thuộc một trong các giá trị `active`, `suspended`, `locked`;
- `date_of_birth` không được lớn hơn ngày hiện tại.

### Vai trò trong Sprint 02
- hiển thị hồ sơ;
- cập nhật hồ sơ;
- kiểm tra trạng thái tài khoản;
- làm dữ liệu nền cho điều hướng sau đăng nhập.

## 9.2. `roles`
### Vai trò
Lưu danh mục vai trò chính thức của hệ thống.

### Giá trị chính
- `USER`
- `GUIDE`
- `SYSTEM_ADMIN`
- `CONTENT_MODERATOR`
- `SUPPORT_STAFF`

### Vai trò trong Sprint 02
- xác định quyền truy cập theo nhóm người dùng;
- làm cơ sở cho role-based menu và route guard.

## 9.3. `user_roles`
### Vai trò
Liên kết giữa user và role.

### Trường quan trọng
- `user_id`
- `role_code`
- `assigned_by`
- `assigned_at`

### Vai trò trong Sprint 02
- trả về danh sách role hiện tại của người dùng;
- dùng để xác định điều hướng area;
- chuẩn bị cho các sprint guide/admin sau này.

## 9.4. Ghi chú triển khai dữ liệu
Trong Sprint 02, dù chỉ dùng 3 bảng chính để hiện thực nghiệp vụ, hệ thống vẫn phải bám theo schema 38 bảng đã chốt từ Sprint 01. Không nên tách một schema auth/profile riêng khác để đi nhanh, vì sẽ gây lệch so với tài liệu tổng thể.

---

## 10. API cần thiết

## 10.1. `POST /auth/register`
### Mục đích
Tạo tài khoản mới và khởi tạo hồ sơ nghiệp vụ.

### Request gợi ý
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123",
  "fullName": "Nguyen Van A"
}
```

### Kết quả mong đợi
- tạo tài khoản trong Supabase Auth;
- tạo bản ghi ở `public.users`;
- gán role mặc định `USER`;
- trả về thông báo thành công hoặc lỗi hợp lệ.

## 10.2. `POST /auth/login`
### Mục đích
Xác thực người dùng và khởi tạo session.

### Request gợi ý
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Kết quả mong đợi
- xác thực thành công;
- đọc được hồ sơ hiện tại;
- đọc được danh sách role hiện tại;
- trả về dữ liệu đủ để frontend điều hướng area.

## 10.3. `POST /auth/logout`
### Mục đích
Kết thúc phiên làm việc hiện tại.

### Kết quả mong đợi
- xóa session/token ở phía client theo cách triển khai;
- điều hướng người dùng về public area hoặc trang đăng nhập.

## 10.4. `GET /me`
### Mục đích
Lấy hồ sơ nghiệp vụ của người dùng đang đăng nhập.

### Yêu cầu
- cần access token hợp lệ.

### Kết quả mong đợi
- trả về thông tin từ `public.users`;
- làm dữ liệu gốc cho trang hồ sơ cá nhân.

## 10.5. `PATCH /me`
### Mục đích
Cập nhật hồ sơ cá nhân của người dùng hiện tại.

### Request gợi ý
```json
{
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dateOfBirth": "2002-01-15",
  "gender": "male"
}
```

### Kết quả mong đợi
- chỉ cập nhật các trường được phép;
- kiểm tra dữ liệu hợp lệ;
- trả về hồ sơ sau cập nhật.

## 10.6. `PATCH /me/password`
### Mục đích
Đổi mật khẩu của tài khoản hiện tại.

### Request gợi ý
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

### Kết quả mong đợi
- đổi mật khẩu thành công qua Supabase Auth;
- trả về thông báo rõ ràng;
- xử lý lỗi nếu xác nhận không khớp hoặc mật khẩu không hợp lệ.

## 10.7. `GET /me/roles`
### Mục đích
Lấy danh sách vai trò của user hiện tại.

### Kết quả mong đợi
- trả về mảng role;
- hỗ trợ role-based menu;
- hỗ trợ redirect sau đăng nhập;
- làm nền cho guard ở frontend.

## 10.8. Yêu cầu kỹ thuật chung cho API
Tất cả API trong Sprint 02 phải thống nhất:
- response envelope chung;
- validation rõ ràng;
- thông báo lỗi dễ hiểu;
- xử lý `401 Unauthorized` và `403 Forbidden` thống nhất;
- log lỗi tối thiểu;
- có thể test bằng Swagger/Postman.

---

## 11. Công việc frontend

## 11.1. Xây dựng flow xác thực hoàn chỉnh
- hiện thực form đăng ký;
- hiện thực form đăng nhập;
- xử lý loading và lỗi;
- lưu session theo cách thống nhất;
- xử lý logout.

## 11.2. Xây dựng auth state dùng chung
- tạo `AuthContext` hoặc store tương đương;
- lưu user hiện tại;
- lưu roles hiện tại;
- xử lý trạng thái đã đăng nhập/chưa đăng nhập;
- hỗ trợ gọi lại `/me` và `/me/roles`.

## 11.3. Dựng route guard
Cần có tối thiểu:
- guard cho route yêu cầu đăng nhập;
- guard cho Guide Area;
- guard cho Admin Area;
- redirect khi không đủ quyền.

## 11.4. Dựng role-based menu
- user chỉ thấy menu user phù hợp;
- guide thấy khu vực guide;
- admin thấy khu vực admin;
- không hiển thị menu sai quyền.

## 11.5. Hiện thực màn hình hồ sơ cá nhân
- gọi `GET /me` để lấy dữ liệu;
- bind dữ liệu vào form;
- gọi `PATCH /me` để cập nhật;
- hiển thị lỗi hợp lệ theo từng trường.

## 11.6. Hiện thực màn hình đổi mật khẩu
- form 3 trường mật khẩu;
- validate xác nhận;
- gọi `PATCH /me/password`;
- thông báo thành công hoặc lỗi rõ ràng.

## 11.7. Xử lý điều hướng sau đăng nhập
- sau login gọi `/me/roles`;
- xác định area đích;
- redirect đúng theo vai trò;
- lưu ý xử lý tài khoản nhiều role theo rule đã chốt.

## 11.8. Test flow phía frontend
Bắt buộc test các kịch bản:
- đăng ký thành công;
- đăng ký sai dữ liệu;
- đăng nhập đúng;
- đăng nhập sai mật khẩu;
- đăng nhập bằng tài khoản bị khóa;
- cập nhật hồ sơ thành công;
- đổi mật khẩu thành công;
- redirect đúng theo User / Guide / Admin.

## 11.9. Kết quả mong đợi phía frontend
- 4 màn hình chính hoạt động ổn định;
- auth state dùng chung hoạt động đúng;
- route guard hoạt động đúng;
- menu theo vai trò hoạt động đúng;
- sẵn sàng cho các sprint Tour và Guide Profile.

---

## 12. Công việc backend

## 12.1. Hoàn thiện module auth/profile
Tối thiểu nên có:
- `AuthController`
- `AuthService`
- `MeController`
- `MeService`

Hoặc gộp theo module `auth-me` để đơn giản hóa cấu trúc giai đoạn đầu.

## 12.2. Xử lý đăng ký tài khoản
- gọi Supabase Auth để tạo tài khoản;
- tạo `public.users`;
- gán role mặc định `USER`;
- rollback hoặc xử lý lỗi nhất quán nếu một bước thất bại.

## 12.3. Xử lý đăng nhập
- xác thực với Supabase Auth;
- kiểm tra trạng thái tài khoản trong `public.users`;
- trả về thông tin cần thiết cho frontend;
- hỗ trợ đọc roles hiện tại sau đăng nhập.

## 12.4. Xử lý đăng xuất
- hủy session theo cơ chế đang dùng;
- đảm bảo frontend có thể xóa trạng thái local đúng cách.

## 12.5. Xử lý lấy/cập nhật hồ sơ người dùng
- `GET /me` đọc hồ sơ hiện tại;
- `PATCH /me` chỉ cho phép sửa đúng các trường cho phép;
- validate dữ liệu cập nhật;
- cập nhật `updated_at` hợp lý.

## 12.6. Xử lý đổi mật khẩu
- xác minh request hợp lệ;
- gọi cơ chế đổi mật khẩu của Supabase;
- chuẩn hóa response thành công/thất bại.

## 12.7. Xử lý đọc role người dùng
- truy vấn `user_roles` theo `user_id`;
- join với `roles` nếu cần;
- trả về dạng dữ liệu đủ cho frontend xác định area đích.

## 12.8. Guard và chuẩn quyền
- tái sử dụng `AuthGuard` từ Sprint 01;
- triển khai `RoleGuard` dùng được thật;
- chuẩn bị decorator role cho các sprint Guide/Admin sau này.

## 12.9. Logging và kiểm lỗi
- log đăng ký thất bại;
- log đăng nhập thất bại;
- log lỗi cập nhật hồ sơ;
- giữ format lỗi nhất quán để frontend dễ xử lý.

## 12.10. Kết quả mong đợi phía backend
- toàn bộ API auth/profile chạy được;
- guard dùng được thật;
- backend trả role chính xác;
- backend sẵn sàng làm nền cho guide, tour và admin.

---

## 13. Công việc database

## 13.1. Đồng bộ giữa `auth.users` và `public.users`
Đây là việc quan trọng nhất của Sprint 02. Cần bảo đảm:
- tài khoản auth tạo xong thì có hồ sơ nghiệp vụ tương ứng;
- không có tình trạng có `auth.users` nhưng thiếu `public.users`;
- `id` được đồng bộ 1–1.

## 13.2. Hoàn thiện dữ liệu role
- bảo đảm bảng `roles` đã có đủ dữ liệu seed:
  - `USER`
  - `GUIDE`
  - `SYSTEM_ADMIN`
  - `CONTENT_MODERATOR`
  - `SUPPORT_STAFF`
- kiểm tra `user_roles` có thể gán vai trò chính xác.

## 13.3. Chuẩn hóa ràng buộc dữ liệu
Cần kiểm tra và chốt:
- `status` chỉ nhận `active`, `suspended`, `locked`;
- `gender` đúng miền giá trị;
- `date_of_birth` không vượt quá ngày hiện tại;
- unique cho email hoặc phone theo cách triển khai đã chọn.

## 13.4. Seed dữ liệu demo
Phải có dữ liệu mẫu tối thiểu:
- 1 tài khoản User;
- 1 tài khoản Guide;
- 1 tài khoản Admin.

Có thể seed thêm:
- 1 tài khoản bị `suspended`;
- 1 tài khoản bị `locked`;
để test luồng đăng nhập lỗi.

## 13.5. Chuẩn bị truy vấn phục vụ `/me` và `/me/roles`
- truy vấn hồ sơ hiện tại;
- truy vấn danh sách role theo user;
- tối ưu ở mức đủ dùng, chưa cần tối ưu sâu.

## 13.6. Kiểm thử dữ liệu
Bắt buộc test:
- tạo user mới có sinh đúng hồ sơ hay không;
- role mặc định có được gán đúng hay không;
- user cập nhật hồ sơ có lưu đúng hay không;
- tài khoản bị khóa có bị chặn đúng hay không.

## 13.7. Kết quả mong đợi phía database
- dữ liệu auth và profile đồng bộ đúng;
- role hoạt động đúng;
- dữ liệu demo sẵn sàng cho test UI/API;
- schema không cần chỉnh sửa lại khi bước sang Sprint 03.

---

## 14. Tài liệu/UML

## 14.1. Tài liệu cần hoàn thiện
- mô tả chi tiết chức năng F01, F02, F03;
- mô tả quyền truy cập theo vai trò;
- mô tả màn hình M02, M03, M15, M16;
- cập nhật bảng mapping chức năng – màn hình – API – CSDL nếu cần.

## 14.2. Activity Diagram cần cập nhật
Bắt buộc hoàn thiện:
- Activity Diagram đăng ký tài khoản;
- Activity Diagram đăng nhập;
- Activity Diagram đăng xuất;
- Activity Diagram cập nhật hồ sơ cá nhân;
- Activity Diagram đổi mật khẩu;
- Activity Diagram phân quyền người dùng.

## 14.3. Nội dung nên mô tả rõ trong UML
- actor tham gia;
- điều kiện tiền đề;
- luồng chính;
- luồng lỗi;
- hậu điều kiện;
- dữ liệu nào được tạo/cập nhật;
- role nào được truy cập luồng nào.

## 14.4. Mục tiêu của phần tài liệu/UML
Phần tài liệu của Sprint 02 phải giúp người đọc thấy rõ:
- hệ thống không chỉ có giao diện đăng nhập;
- dữ liệu xác thực và dữ liệu nghiệp vụ được liên kết đúng;
- phân quyền đã có nền thật chứ không phải mô tả lý thuyết;
- các sprint sau có thể tái sử dụng trực tiếp lớp auth/profile này.

---

## 15. Đầu ra

Kết thúc Sprint 02, hệ thống cần đạt được các đầu ra sau:

## 15.1. Đầu ra chức năng
- Có thể tạo tài khoản mới.
- Có thể đăng nhập, đăng xuất.
- Có thể xem hồ sơ cá nhân.
- Có thể cập nhật hồ sơ cá nhân.
- Có thể đổi mật khẩu.
- Có thể điều hướng theo vai trò người dùng.

## 15.2. Đầu ra giao diện
- M02 Đăng ký tài khoản hoạt động.
- M03 Đăng nhập hoạt động.
- M15 Hồ sơ cá nhân hoạt động.
- M16 Đổi mật khẩu hoạt động.
- Route guard và menu theo vai trò hoạt động.

## 15.3. Đầu ra API
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

Tất cả phải test được bằng UI và/hoặc Postman.

## 15.4. Đầu ra dữ liệu
- `public.users` được tạo đúng khi đăng ký;
- role mặc định `USER` được gán đúng;
- dữ liệu hồ sơ được cập nhật đúng;
- có dữ liệu demo User / Guide / Admin;
- trạng thái tài khoản hoạt động đúng theo rule đã chốt.

## 15.5. Đầu ra tài liệu
- Activity Diagram nhóm auth/profile được cập nhật;
- mô tả vai trò và quyền được cập nhật;
- phần báo cáo về xác thực và hồ sơ người dùng đủ để đưa vào chương phân tích thiết kế.

## 15.6. Tiêu chí sẵn sàng sang Sprint 03
Sprint 02 chỉ được xem là thành công khi:
- user đăng nhập xong lấy được hồ sơ và role;
- điều hướng area không lỗi;
- frontend và backend thống nhất về quyền;
- database không lệch giữa auth và hồ sơ nghiệp vụ;
- hệ thống sẵn sàng bước sang Sprint 03 về Public Tour mà không phải quay lại sửa lớp auth/profile.

---

## 16. Kết luận sprint

Sprint 02 là sprint biến nền tảng kỹ thuật từ Sprint 01 thành **năng lực sử dụng thật đầu tiên của hệ thống**. Giá trị lớn nhất của sprint này không chỉ nằm ở việc có màn hình đăng ký hay đăng nhập, mà nằm ở việc hệ thống đã:
- nhận diện được người dùng;
- lưu được hồ sơ nghiệp vụ;
- đọc được vai trò;
- điều hướng đúng khu vực;
- kiểm soát được truy cập ở mức nền.

Nếu Sprint 02 được làm chắc, các sprint tiếp theo như Guide Profile, Public Tour, Tour Request và Admin sẽ triển khai nhanh hơn rất nhiều vì toàn bộ lớp nhận diện người dùng và phân quyền đã sẵn sàng dùng lại.
