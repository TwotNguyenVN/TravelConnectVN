# 📘 Hướng dẫn quy trình Git & GitHub cho TravelConnectVN

Tài liệu này hướng dẫn chi tiết cách sử dụng Git và GitHub theo mô hình **GitFlow rút gọn**, nhằm đảm bảo source code của dự án luôn sạch sẽ, dễ quản lý và hạn chế tối đa xung đột (conflict).

---

## 🏗 1. Cấu trúc nhánh (Branching Strategy)

Dự án sử dụng các nhánh chính sau:

*   🔴 **`main`**: Nhánh chứa code hoàn chỉnh, ổn định nhất. Dùng để deploy (chạy thực tế). **TUYỆT ĐỐI KHÔNG code trực tiếp trên nhánh này.**
*   🟡 **`develop`**: Nhánh "hội quân" (Integration Branch). Chứa code mới nhất đã qua kiểm thử cơ bản. Mọi tính năng mới đều phân nhánh từ đây và gộp (merge) về đây.
*   🟢 **`feature/*`**: Các nhánh dùng để làm tính năng mới. (Ví dụ: `feature/login`, `feature/tour-booking`).
*   🟠 **`fix/*`** hoặc **`bugfix/*`**: Nhánh dùng để sửa lỗi. (Ví dụ: `fix/ui-adjustments`).
*   🔵 **`docs/*`**: Nhánh dùng để cập nhật tài liệu.

---

## 🚀 2. Quy trình làm một tính năng mới (Feature Workflow)

Khi bạn muốn bắt đầu code một tính năng mới, hãy làm theo các bước sau theo thứ tự:

### Bước 1: Đảm bảo bạn đang ở nhánh `develop` và có code mới nhất
```bash
# Chuyển về nhánh develop
git checkout develop

# Lấy code mới nhất từ GitHub về máy
git pull origin develop
```

### Bước 2: Tạo nhánh mới cho tính năng
Tên nhánh cần mô tả ngắn gọn tính năng bạn sắp làm.
```bash
# Tạo và chuyển sang nhánh mới
git checkout -b feature/ten-tinh-nang

# Ví dụ: git checkout -b feature/user-profile
```

### Bước 3: Viết code và Lưu lại (Commit)
Làm việc trên VSCode/IDE của bạn. Khi code xong một phần logic, hãy commit lại.
```bash
# Thêm các file đã thay đổi vào danh sách chờ
git add .

# Lưu lại với lời nhắn có ý nghĩa
git commit -m "feat: thêm giao diện trang cá nhân người dùng"
```
*(Bạn có thể lặp lại Bước 3 nhiều lần cho đến khi xong tính năng)*

### Bước 4: Đẩy code lên GitHub
```bash
# Lần đầu tiên đẩy nhánh này lên GitHub:
git push -u origin feature/ten-tinh-nang

# Các lần sau chỉ cần:
git push
```

### Bước 5: Tạo Pull Request (PR)
1. Lên trang GitHub của dự án.
2. Sẽ có nút màu xanh **"Compare & pull request"** hiện lên -> Bấm vào đó.
3. Đảm bảo luồng merge là: `feature/ten-tinh-nang` ➡️ `develop`.
4. Viết mô tả những gì bạn đã làm và bấm **Create pull request**.
5. Nhờ đồng đội review code (nếu làm nhóm) hoặc tự review rồi bấm **Merge pull request**.

---

## 🛠 3. Quy trình sửa lỗi (Bugfix Workflow)

Giống hệt quy trình làm tính năng mới, nhưng cách đặt tên nhánh và commit sẽ khác.

```bash
git checkout develop
git pull origin develop

# Tạo nhánh sửa lỗi
git checkout -b fix/ten-loi
# Ví dụ: git checkout -b fix/loi-dang-nhap

# Code để sửa lỗi...

git add .
git commit -m "fix: sửa lỗi không thể đăng nhập bằng Google"
git push -u origin fix/ten-loi
```
Sau đó lên GitHub tạo Pull Request merge vào `develop`.

---

## 📝 4. Quy ước đặt tên Commit

Dự án áp dụng quy chuẩn **Conventional Commits** để lịch sử code dễ đọc:

*   `feat: [thông điệp]`: Thêm một tính năng mới.
    *(VD: feat: tích hợp thanh toán VNPay)*
*   `fix: [thông điệp]`: Sửa một lỗi (bug).
    *(VD: fix: sửa lỗi hiển thị sai giá tour)*
*   `docs: [thông điệp]`: Cập nhật tài liệu (README, Markdown, UML).
*   `style: [thông điệp]`: Chỉnh sửa format, khoảng trắng, dấu phẩy... (không thay đổi logic code).
*   `refactor: [thông điệp]`: Viết lại code cho sạch đẹp, tối ưu hơn nhưng không làm đổi tính năng.
*   `chore: [thông điệp]`: Các việc vặt (cập nhật thư viện, config `.gitignore`,...).

---

## ⚠️ 5. Xử lý khi bị Conflict (Xung đột)

Conflict xảy ra khi 2 người cùng sửa chung 1 dòng code, hoặc bạn sửa file mà người khác cũng vừa sửa và đẩy lên `develop` trước bạn.

**Cách xử lý khi đang làm tính năng mà cần lấy code mới nhất:**
```bash
# Đảm bảo bạn đã commit code của mình
git add .
git commit -m "..."

# Kéo code mới nhất từ nhánh develop về nhánh hiện tại của bạn để gộp
git pull origin develop
```
Lúc này, nếu có conflict, Git sẽ báo lỗi.
1. Mở VSCode lên, vào các file bị báo lỗi.
2. VSCode sẽ bôi màu các đoạn xung đột. Bạn chọn "Accept Current Change" (giữ code của bạn), "Accept Incoming Change" (lấy code mới kéo về), hoặc tự gộp cả hai.
3. Sau khi sửa xong, lưu file lại.
4. Chạy lệnh:
```bash
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

---

## 🛑 6. Nguyên tắc vàng khi Push lên GitHub (Push Guidelines)

Để đảm bảo dự án vận hành trơn tru và chất lượng code luôn cao, bạn **bắt buộc** phải tuân thủ các nguyên tắc sau trước khi `git push`:

1. **Kiểm tra biên dịch & Linter**: Luôn chạy lệnh kiểm tra lỗi cú pháp và type check ở máy local (`npx tsc --noEmit` hoặc linter) trước khi push. Tuyệt đối không đẩy code lỗi lên repo chung.
2. **Không Force Push bừa bãi**: Tuyệt đối **không bao giờ** dùng `git push --force` (hoặc `-f`) trên các nhánh dùng chung như `develop` và `main`. Điều này sẽ ghi đè lịch sử commit của người khác và làm hỏng repo.
3. **Cập nhật code mới nhất**: Trước khi push code, hãy kéo phiên bản mới nhất trên GitHub về (`git pull origin develop`) để giải quyết mọi xung đột ở máy cá nhân trước khi đưa lên.
4. **Không push file nhạy cảm**: Đảm bảo không vô tình push các file `.env`, file cấu hình tài khoản cá nhân, thư mục `node_modules` hay thư mục build (`dist`, `build`). Hãy cập nhật `.gitignore` đầy đủ.
5. **Đúng nhánh, đúng việc**: Chỉ push lên nhánh `feature/*` hoặc `fix/*` do bạn tự tạo. Tuyệt đối không push trực tiếp lên `develop` hoặc `main` nếu chưa qua bước tạo Pull Request (PR) để review.

---

## 🎯 Tóm tắt các lệnh hay dùng nhất
*   Xem trạng thái file: `git status`
*   Xem danh sách nhánh: `git branch` (nhấn `q` để thoát)
*   Chuyển nhánh: `git checkout ten_nhanh`
*   Hoàn tác file lỡ tay sửa (chưa add): `git checkout -- ten_file`
