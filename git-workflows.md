# 📜 HIẾN PHÁP GIT & GITHUB WORKFLOW (TRAVELCONNECT_VN)

> Quy trình Git chuẩn hóa dành cho mọi thành viên trong dự án TravelConnectVN. Hãy tuân thủ nghiêm ngặt để giữ mã nguồn luôn ổn định và tránh xung đột code.

---

## 1. MÔ HÌNH NHÁNH (BRANCHING MODEL)

Dự án áp dụng mô hình **Git Flow rút gọn**:

```text
main (Production)
 └── develop (Integration)
      ├── feature/auth (Tính năng mới)
      ├── fix/login-validation (Sửa lỗi)
      └── docs/update-readme (Tài liệu)
```

### Chi tiết vai trò các nhánh:
*   🔴 **`main`**: Nhánh ổn định nhất, dùng để deploy/demo. **Tuyệt đối KHÔNG code trực tiếp.** Chỉ nhận code từ `release/*` hoặc `hotfix/*`.
*   🟡 **`develop`**: Nhánh tích hợp chính. Chứa code mới nhất đã qua kiểm thử cơ bản. Mọi nhánh feature/fix đều được tách từ đây và merge về đây.
*   🟢 **`feature/*`**: Nhánh phát triển tính năng mới. Tách từ `develop`, merge về `develop`.
*   🟠 **`fix/*`** hoặc **`bugfix/*`**: Nhánh sửa lỗi phát triển. Tách từ `develop`, merge về `develop`.
*   🔵 **`docs/*`**: Nhánh cập nhật tài liệu (README, UML, API Spec).
*   🟣 **`release/*`**: Chuẩn bị demo/phát hành. Tách từ `develop`, merge vào `main` và `develop`.
*   🔴 **`hotfix/*`**: Sửa lỗi khẩn cấp trên production. Tách từ `main`, merge vào `main` và `develop`.

---

## 2. QUY TRÌNH PHÁT TRIỂN HẰNG NGÀY

### 2.1. Dành cho Thành viên (Developer Workflow)

#### Bước 1: Khởi đầu ngày làm việc (Luôn cập nhật develop mới nhất)
```bash
git checkout develop
git pull origin develop
```
#### Bước 2: Tạo nhánh nhánh mới cho công việc được giao
```bash
git checkout -b <type>/<ten-chuc-nang>
# Ví dụ: git checkout -b feature/user-profile
```
#### Bước 3: Code và kiểm tra ở local
```bash
npm run dev        # Chạy thử project
git status         # Kiểm tra các file thay đổi
```
#### Bước 4: Lưu thay đổi (Commit) & Đẩy code (Push)
```bash
git add .
git commit -m "feat: add user profile page layout"
git push -u origin feature/user-profile  # Lần đầu tiên. Lần sau chỉ cần: git push
```
#### Bước 5: Tạo Pull Request (PR)
1. Truy cập GitHub của dự án, chọn **Compare & pull request**.
2. Đảm bảo luồng merge: `feature/user-profile` ➡️ `develop` (Tuyệt đối không merge thẳng vào `main`).
3. Ghi rõ mô tả những gì đã làm, đính kèm screenshot UI (nếu có).
4. Nhờ đồng đội/leader review và merge.
5. Sau khi PR được merge:
```bash
git checkout develop
git pull origin develop
```

### 2.2. Dành cho Quản lý Repo (Leader Workflow)
*   **Thiết lập Bảo vệ nhánh `main` / `develop`**: Yêu cầu Pull Request trước khi merge, ít nhất 1 approval, chặn push trực tiếp.
*   **Review PR**: Kiểm tra code sạch, không chứa API key/file rác, chạy thử ở local trước khi approve.

---

## 3. QUY TRÌNH RELEASE & HOTFIX

### 3.1. Quy trình Release (Khi chuẩn bị Demo/Nộp bài)
```bash
# 1. Tạo nhánh release từ develop mới nhất
git checkout develop && git pull origin develop
git checkout -b release/v1.0
git push -u origin release/v1.0

# 2. Chỉ sửa lỗi nhỏ, cập nhật README, KHÔNG thêm tính năng lớn.
# 3. Tạo PR từ release/v1.0 vào main. Sau khi merge, tạo Tag trên main:
git checkout main && git pull origin main
git tag v1.0
git push origin v1.0

# 4. Merge ngược lại release vào develop để cập nhật các fix/docs mới.
git checkout develop && git merge release/v1.0 && git push origin develop
```

### 3.2. Quy trình Hotfix (Lỗi khẩn cấp trên Production)
```bash
# 1. Tạo nhánh hotfix trực tiếp từ main ổn định
git checkout main && git pull origin main
git checkout -b hotfix/fix-payment-crash

# 2. Sửa lỗi, commit và push lên GitHub
git commit -m "fix: resolve payment gateway crash"
git push -u origin hotfix/fix-payment-crash

# 3. Tạo PR gộp vào main và tạo tag phụ (ví dụ: v1.0.1).
# 4. Tạo PR gộp hotfix vào develop để đồng bộ.
```

---

## 4. TIÊU CHUẨN ĐẶT TÊN & COMMIT MESSAGE

### 4.1. Quy tắc đặt tên nhánh
*   **Nên dùng**: `<type>/<ten-ngan-gon>` (Ví dụ: `feature/payment`, `fix/navbar-responsive`, `docs/api-spec`).
*   **Tránh dùng**: `test`, `update`, `code-cua-tui`, `branch1`.

### 4.2. Viết Commit Message chuẩn Conventional Commits
Công thức: **`<type>(<scope>): <mô tả bằng tiếng Anh hoặc tiếng Việt>`** (Phần `(<scope>)` là không bắt buộc nhưng khuyến khích sử dụng để phân loại khu vực thay đổi, ví dụ: `frontend`, `backend`, `auth`, `payment`, `database`).

*Ví dụ:* `feat(backend): add Google OAuth login` hoặc `style(frontend): fix navbar mobile responsive alignment`.

| Type | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| `feat` | Thêm tính năng mới | `feat: add Google OAuth login` |
| `fix` | Sửa lỗi | `fix: resolve crash on invalid date format` |
| `docs` | Thay đổi tài liệu | `docs: update setup guide in README` |
| `style` | Sửa giao diện / format code | `style: fix navbar mobile responsive alignment` |
| `refactor`| Tối ưu cấu trúc code (không đổi logic) | `refactor: extract user validation logic` |
| `test` | Thêm hoặc sửa test | `test: add unit tests for payment service` |
| `chore` | Tác vụ phụ (config, package, build) | `chore: upgrade express dependency to v4.19` |
| `perf` | Tối ưu hóa hiệu năng | `perf: lazy load image components` |

---

## 5. XỬ LÝ NÂNG CAO & TÌNH HUỐNG ĐẶC BIỆT

### 5.1. Giải quyết Conflict (Xung đột code)
Conflict xảy ra khi hai người cùng sửa một đoạn code trên một file.
1. Mở VS Code để xem vị trí conflict (được đánh dấu đỏ).
2. Chọn cách xử lý phù hợp bằng các tuỳ chọn nhanh:
    *   **Accept Current Change**: Giữ code hiện tại ở máy bạn.
    *   **Accept Incoming Change**: Lấy code mới kéo từ GitHub về.
    *   **Accept Both Changes**: Giữ cả hai.
3. Xóa các ký tự marker (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Lưu file và hoàn tất merge:
```bash
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

### 5.2. Cập nhật nhánh Feature với Develop mới (Merge vs Rebase)
Trước khi tạo PR, bạn nên đồng bộ nhánh của mình với `develop` mới nhất trên GitHub:
*   **Cách 1 (Merge - Đơn giản, an toàn)**:
    ```bash
    git fetch origin
    git merge origin/develop
    ```
*   **Cách 2 (Rebase - Lịch sử Git sạch, thẳng)**:
    > ⚠️ **Chỉ dùng rebase trên nhánh cá nhân chưa tạo PR chung.** Không rebase trên `develop` hay `main`.
    ```bash
    git fetch origin
    git rebase origin/develop
    # Nếu có conflict, sửa xong thì: git rebase --continue
    git push --force-with-lease
    ```

### 5.3. Xử lý code đang làm dở khi cần chuyển nhánh
*   **Cách 1: Commit tạm (WIP)**:
    ```bash
    git add . && git commit -m "wip: save work before switching branch"
    ```
*   **Cách 2: Stash (Cất tạm)**:
    ```bash
    git stash       # Cất code dở dang đi
    # ... làm việc ở nhánh khác ...
    git stash pop   # Lấy lại code để làm tiếp
    ```

### 5.4. Đồng bộ ngược khi `develop` bị đi sau `main` (Behind main)
Khi `main` nhận các commit sửa lỗi trực tiếp từ `hotfix` hoặc `release` mà `develop` chưa có, hãy đồng bộ ngược:
```bash
git checkout develop && git fetch origin
git merge origin/main
git push origin develop
```

---

## 6. NGUYÊN TẮC VÀNG & CHECKLIST

### 6.1. File cấm push lên GitHub
Cấu hình `.gitignore` chuẩn để tuyệt đối không push:
*   File nhạy cảm: `.env`, `.env.local`, API keys, DB passwords.
*   Thư mục thư viện: `node_modules/`, `vendor/`.
*   Thư mục build: `dist/`, `build/`, `out/`, `.DS_Store`.

### 6.2. Checklist trước khi tạo Pull Request (Developer)
- [ ] Đang ở đúng nhánh feature/fix cá nhân.
- [ ] Đã pull và merge `develop` mới nhất về nhánh mình để giải quyết conflict.
- [ ] Code biên dịch bình thường, không lỗi cú pháp hoặc typecheck (`npx tsc --noEmit`).
- [ ] Không còn `console.log`, code dư thừa, hoặc file rác.
- [ ] Commit message rõ ràng, đúng chuẩn.
- [ ] Đích đến của PR là nhánh **`develop`** (KHÔNG merge thẳng vào `main`).

---

## 7. QUY ĐỊNH GIT DÀNH CHO AI ASSISTANT (ANTIGRAVITY / CLAUDE CODE)

Để đảm bảo quy trình Git luôn nhất quán và tự động hóa an toàn, AI Assistant khi làm việc bắt buộc phải tuân theo các quy tắc sau:

1.  **Quy trình bắt đầu phiên làm việc (Bắt đầu):**
    *   Tự động checkout về nhánh `develop` ở local.
    *   Thực hiện `git pull origin develop` để cập nhật mã nguồn mới nhất từ GitHub.
    *   Chờ yêu cầu tiếp theo từ người dùng.

2.  **Kiểm tra và Tách nhánh theo từng yêu cầu:**
    *   Với mỗi yêu cầu mới, kiểm tra xem yêu cầu đó có phù hợp với nhánh hiện tại đang đứng hay không.
    *   Nếu **không phù hợp**: Thông báo cho người dùng biết, sau đó tự động:
        1. Đẩy (`git push`) nhánh hiện tại lên GitHub (nhánh tương ứng).
        2. Chuyển về `develop` ở local và thực hiện `git pull origin develop` để đồng bộ nhánh chính (tránh tự ý merge local vào `develop` khi chưa được duyệt PR trên remote).
        3. Tạo nhánh mới (`git checkout -b <type>/<ten-nhanh>`) từ nhánh `develop` mới nhất để thực hiện yêu cầu mới.

3.  **Xử lý Conflict (Xung đột code):**
    *   Nếu xảy ra conflict trong quá trình rebase, merge hoặc pull, AI tuyệt đối không tự động giải quyết nếu không chắc chắn.
    *   AI phải dừng lại, liệt kê các file bị conflict và giải thích phương án xử lý (hoặc hỏi ý kiến người dùng) trước khi thực hiện.

4.  **Commit code ngay lập tức:**
    *   Với mỗi yêu cầu sau khi hoàn thành và chạy thử thành công, AI phải thực hiện commit code ngay lập tức với message mô tả đúng chuẩn Conventional Commits (kèm theo `<scope>` nếu liên quan đến module cụ thể).

5.  **Hạn chế tự ý Merge trực tiếp trên Remote:**
    *   AI chỉ merge các nhánh ở local khi được hướng dẫn hoặc đồng bộ phát triển. Tuyệt đối không tự ý merge trực tiếp lên nhánh `main` hoặc `develop` trên GitHub (remote) khi chưa có sự xác nhận qua PR được chấp nhận.

---

> **Khẩu quyết cần nhớ**: PR càng nhỏ và càng sớm thì càng dễ review, ít conflict, dự án hoạt động ổn định!
