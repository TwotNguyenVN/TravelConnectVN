# BÁO CÁO HƯỚNG DẪN MÔ HÌNH LÀM VIỆC NHÓM VỚI GIT/GITHUB

## Đơn giản nhưng chuyên nghiệp

---

## 1. Mục đích của mô hình làm việc nhóm với Git

Khi làm việc nhóm trong một dự án phần mềm, Git/GitHub không chỉ dùng để lưu code, mà còn giúp nhóm:

```text
- Quản lý phiên bản source code
- Tránh ghi đè code của nhau
- Theo dõi ai đã sửa gì
- Tách riêng từng chức năng để dễ quản lý
- Kiểm tra code trước khi đưa vào nhánh chính
- Giữ project luôn có một phiên bản ổn định
```

Nếu không có quy trình rõ ràng, nhóm rất dễ gặp các lỗi như:

```text
- Code của người này đè lên code người khác
- Nhánh main bị lỗi, project không chạy được
- Không biết ai sửa file nào
- Conflict nhiều và khó xử lý
- Mất code hoặc merge nhầm code chưa hoàn thiện
```

Vì vậy, nhóm cần thống nhất một mô hình làm việc đơn giản, dễ dùng nhưng vẫn chuyên nghiệp.

---

# 2. Mô hình Git đề xuất cho nhóm

Mô hình đề xuất:

```text
main
└── develop
    ├── feature/login
    ├── feature/register
    ├── feature/course-management
    ├── feature/payment
    └── feature/report
```

Trong đó:

```text
main       = nhánh chính thức, ổn định, dùng để demo/nộp bài
develop    = nhánh phát triển chung của nhóm
feature/*  = nhánh riêng cho từng chức năng
```

Đây là mô hình rút gọn từ Git Flow, phù hợp cho nhóm sinh viên, nhóm đồ án hoặc dự án nhỏ đến trung bình.

---

# 3. Ý nghĩa từng loại nhánh

## 3.1. Nhánh `main`

Nhánh `main` là nhánh quan trọng nhất của dự án.

```text
main = phiên bản ổn định nhất của project
```

Nhánh này dùng để:

```text
- Demo cho giảng viên/khách hàng
- Nộp bài
- Lưu phiên bản chính thức
- Tạo tag như v1.0, final, demo
```

Nguyên tắc:

```text
Không code trực tiếp trên main.
Không push trực tiếp lên main.
Chỉ merge vào main khi project đã kiểm tra ổn định.
```

---

## 3.2. Nhánh `develop`

Nhánh `develop` là nhánh làm việc chung của nhóm.

```text
develop = nơi gom các chức năng đã hoàn thành
```

Các thành viên không nên code trực tiếp trên `develop`, mà nên tạo nhánh riêng từ `develop`.

Ví dụ:

```text
develop → feature/login
develop → feature/payment
develop → feature/course-management
```

Khi chức năng hoàn thành, nhánh `feature` sẽ được merge lại vào `develop`.

---

## 3.3. Nhánh `feature/*`

Nhánh `feature` dùng để làm từng chức năng riêng.

Ví dụ:

```text
feature/login
feature/register
feature/payment
feature/course-management
feature/user-profile
```

Nguyên tắc:

```text
Mỗi chức năng nên có một nhánh riêng.
Nhánh feature được tạo từ develop.
Làm xong thì tạo Pull Request vào develop.
```

Ví dụ:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/login
```

---

# 4. Quy trình làm việc tổng quát

Quy trình đơn giản của nhóm:

```text
Bước 1: Lấy code mới nhất từ develop
Bước 2: Tạo nhánh feature riêng
Bước 3: Code chức năng được giao
Bước 4: Commit code rõ ràng
Bước 5: Push nhánh lên GitHub
Bước 6: Tạo Pull Request vào develop
Bước 7: Thành viên khác review
Bước 8: Merge vào develop
Bước 9: Khi ổn định thì merge develop vào main
```

Sơ đồ quy trình:

```text
feature/login  ─┐
feature/payment ├──> develop ───> main
feature/report ─┘
```

---

# 5. Quy trình chi tiết cho từng thành viên

Giả sử một thành viên được giao làm chức năng đăng nhập.

## Bước 1: Chuyển sang nhánh `develop`

```bash
git checkout develop
```

## Bước 2: Lấy code mới nhất

```bash
git pull origin develop
```

## Bước 3: Tạo nhánh chức năng

```bash
git checkout -b feature/login
```

## Bước 4: Code chức năng

Thành viên tiến hành code phần được giao.

Ví dụ sửa các file:

```text
LoginPage.jsx
authService.js
UserController.php
routes/api.php
```

## Bước 5: Kiểm tra trạng thái file

```bash
git status
```

## Bước 6: Thêm file vào commit

```bash
git add .
```

Hoặc thêm từng file:

```bash
git add src/pages/LoginPage.jsx
git add src/services/authService.js
```

## Bước 7: Commit code

```bash
git commit -m "feat: add login page"
```

## Bước 8: Push nhánh lên GitHub

```bash
git push origin feature/login
```

## Bước 9: Tạo Pull Request

Trên GitHub tạo Pull Request:

```text
feature/login → develop
```

## Bước 10: Chờ review và merge

Thành viên khác hoặc leader kiểm tra code. Nếu ổn thì merge vào `develop`.

---

# 6. Quy trình dành cho leader hoặc người quản lý repo

Leader nên tạo sẵn các nhánh chính:

```text
main
develop
```

Sau khi tạo repo, leader làm:

```bash
git checkout -b develop
git push origin develop
```

Sau đó thông báo cho nhóm:

```text
Mọi người tạo branch từ develop, không làm trực tiếp trên main.
```

Leader nên quản lý Pull Request:

```text
- Kiểm tra code trước khi merge
- Không cho merge code lỗi
- Nhắc thành viên pull code mới nhất
- Giải quyết conflict nếu cần
- Đảm bảo main luôn ổn định
```

---

# 7. Khi nào merge vào `main`?

Không merge vào `main` sau mỗi chức năng nhỏ.

Chỉ merge `develop` vào `main` khi:

```text
- Các chức năng chính đã hoàn thành
- Project chạy ổn định
- Nhóm chuẩn bị demo
- Nhóm chuẩn bị nộp bài
- Đã test các chức năng quan trọng
```

Quy trình:

```text
develop → main
```

Sau đó có thể tạo tag:

```bash
git checkout main
git pull origin main
git tag v1.0
git push origin v1.0
```

Ý nghĩa tag:

```text
v0.1 = bản demo đầu tiên
v0.2 = bản sửa lỗi/hoàn thiện hơn
v1.0 = bản chính thức để nộp
```

---

# 8. Quy tắc đặt tên nhánh

Tên nhánh cần ngắn gọn, rõ ràng, dễ hiểu.

## Nhánh chức năng

```text
feature/login
feature/register
feature/course-management
feature/payment
feature/report-dashboard
```

## Nhánh sửa lỗi

```text
fix/login-validation
fix/navbar-responsive
fix/payment-status
```

## Nhánh tài liệu

```text
docs/update-readme
docs/update-usecase
docs/add-api-spec
```

Không nên đặt tên nhánh như:

```text
test
abc
new
update
code-cua-tui
branch1
```

Tên nhánh nên cho người khác biết ngay bạn đang làm gì.

---

# 9. Quy tắc viết commit message

Commit message cần rõ ràng, mô tả đúng việc đã làm.

Không nên:

```bash
git commit -m "update"
git commit -m "fix"
git commit -m "done"
git commit -m "abc"
```

Nên:

```bash
git commit -m "feat: add login form"
git commit -m "fix: validate empty password"
git commit -m "docs: update setup guide"
git commit -m "style: update navbar layout"
```

Một số prefix nên dùng:

| Prefix      | Ý nghĩa                                |
| ----------- | -------------------------------------- |
| `feat:`     | Thêm chức năng mới                     |
| `fix:`      | Sửa lỗi                                |
| `docs:`     | Cập nhật tài liệu                      |
| `style:`    | Chỉnh giao diện hoặc format            |
| `refactor:` | Sửa cấu trúc code, không đổi chức năng |
| `chore:`    | Việc phụ như config, package           |

Ví dụ tốt:

```bash
git commit -m "feat: add course detail page"
git commit -m "fix: handle invalid login message"
git commit -m "docs: add database setup instruction"
```

---

# 10. Pull Request nên viết như thế nào?

Pull Request không nên để trống. Nên ghi rõ đã làm gì để người review dễ kiểm tra.

Mẫu Pull Request:

```text
Tiêu đề:
feat: add payment checkout page

Mô tả:
Pull Request này thêm giao diện checkout cho chức năng thanh toán khóa học.

Đã làm:
- Tạo trang checkout
- Hiển thị thông tin khóa học
- Hiển thị tổng tiền
- Thêm lựa chọn phương thức thanh toán

Cần kiểm tra:
- Giao diện checkout
- Logic tính tổng tiền
- Responsive trên màn hình nhỏ
```

Một Pull Request tốt giúp nhóm hiểu nhanh thay đổi và review dễ hơn.

---

# 11. Quy tắc review code

Trước khi merge vào `develop`, nên có ít nhất một người review.

Người review cần kiểm tra:

```text
- Code có chạy không?
- Có đúng chức năng được giao không?
- Có làm hỏng phần khác không?
- Có file rác không?
- Có push file .env không?
- Có conflict không?
- Tên biến, tên hàm có dễ hiểu không?
```

Comment review nên lịch sự, rõ ràng.

Ví dụ tốt:

```text
Chỗ này nên xử lý thêm trường hợp email rỗng.
```

```text
Nên tách phần gọi API sang file authService để dễ quản lý hơn.
```

Không nên comment kiểu:

```text
Sai hết rồi.
Code gì kỳ vậy?
Làm lại đi.
```

---

# 12. Cách tránh conflict khi làm nhóm

Conflict thường xảy ra khi nhiều người cùng sửa một file.

Các file dễ conflict:

```text
routes/api.php
routes/web.php
package.json
composer.json
README.md
App.jsx
main.jsx
.env.example
database/migrations
```

Cách hạn chế conflict:

```text
- Luôn pull develop trước khi tạo nhánh
- Mỗi người làm một chức năng riêng
- Hạn chế nhiều người sửa cùng một file
- Nếu cần sửa file chung, báo nhóm trước
- Commit và push thường xuyên
- Tạo Pull Request sớm
```

Ví dụ nhắn nhóm:

```text
Mình đang sửa routes/api.php cho phần payment, mọi người tạm thời đừng sửa file này nha.
```

---

# 13. Cách xử lý conflict cơ bản

Khi Git báo conflict, trong file sẽ có dạng:

```text
<<<<<<< HEAD
code của bạn
=======
code từ nhánh khác
>>>>>>> develop
```

Cần đọc kỹ hai phần code, sau đó giữ lại phần đúng hoặc kết hợp cả hai.

Ví dụ conflict:

```js
<<<<<<< HEAD
const apiUrl = "http://localhost:3000/api";
=======
const apiUrl = "http://localhost:8000/api";
>>>>>>> develop
```

Sau khi sửa:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

Sau đó chạy:

```bash
git add .
git commit -m "fix: resolve merge conflict"
```

Không nên bấm “Accept Current” hoặc “Accept Incoming” bừa nếu chưa hiểu nội dung.

---

# 14. File `.gitignore`

Dự án cần có file `.gitignore` để tránh đẩy file không cần thiết lên GitHub.

Ví dụ với Node.js/React:

```gitignore
node_modules
dist
build
.env
.env.local
.DS_Store
```

Ví dụ với Laravel:

```gitignore
/vendor
/node_modules
.env
/storage/logs/*.log
/public/storage
.DS_Store
```

Không nên push các file sau:

```text
.env
node_modules
vendor
file log
mật khẩu database
API key
token cá nhân
file test cá nhân
```

Nên có file `.env.example` để hướng dẫn người khác tạo môi trường local.

Ví dụ:

```env
APP_NAME=MyProject
APP_ENV=local
DB_HOST=127.0.0.1
DB_DATABASE=project_db
DB_USERNAME=root
DB_PASSWORD=
```

---

# 15. README cho dự án nhóm

File `README.md` giúp thành viên khác biết cách chạy project.

README nên có:

```text
1. Tên dự án
2. Mô tả ngắn
3. Thành viên nhóm
4. Công nghệ sử dụng
5. Cách cài đặt
6. Cách chạy project
7. Cách tạo database
8. Tài khoản demo nếu có
9. Quy trình Git của nhóm
```

Ví dụ:

````markdown
# LMS - Learning Management System

## Mô tả
Hệ thống quản lý khóa học trực tuyến.

## Công nghệ sử dụng
- Frontend: React
- Backend: Laravel
- Database: MySQL

## Cách cài đặt
```bash
git clone <repo-url>
cd project-name
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
npm run dev
````

````

README rõ ràng sẽ giúp nhóm tiết kiệm rất nhiều thời gian khi clone project về máy khác.

---

# 16. Quy trình làm việc hằng ngày

Mỗi ngày trước khi code, thành viên nên làm:

```bash
git checkout develop
git pull origin develop
````

Sau đó tạo nhánh mới:

```bash
git checkout -b feature/ten-chuc-nang
```

Trong quá trình làm:

```bash
git status
git add .
git commit -m "feat: describe your work"
git push origin feature/ten-chuc-nang
```

Khi xong:

```text
Tạo Pull Request: feature/ten-chuc-nang → develop
```

Sau khi PR được merge:

```bash
git checkout develop
git pull origin develop
```

Rồi tiếp tục tạo nhánh mới cho chức năng tiếp theo.

---

# 17. Checklist trước khi tạo Pull Request

Trước khi tạo Pull Request, thành viên cần tự kiểm tra:

```text
[ ] Đã pull code mới nhất từ develop
[ ] Code chạy được trên máy cá nhân
[ ] Không còn console.log/debug dư
[ ] Không push file .env
[ ] Không push file rác
[ ] Commit message rõ ràng
[ ] Chức năng làm đúng yêu cầu
[ ] Không làm hỏng chức năng khác
[ ] Đã ghi mô tả Pull Request
```

---

# 18. Checklist trước khi merge vào develop

Người review nên kiểm tra:

```text
[ ] Pull Request có mô tả rõ ràng
[ ] Code đúng chức năng
[ ] Không có conflict
[ ] Không có file nhạy cảm
[ ] Không có file rác
[ ] Project vẫn chạy được
[ ] Không ảnh hưởng chức năng khác
[ ] Tên biến, tên hàm rõ ràng
```

Nếu đạt thì mới merge vào `develop`.

---

# 19. Quy trình chuẩn bị bản nộp/demo

Khi nhóm gần hoàn thành dự án:

## Bước 1: Kiểm tra nhánh `develop`

```bash
git checkout develop
git pull origin develop
```

## Bước 2: Test toàn bộ chức năng

Cần kiểm tra:

```text
- Đăng ký
- Đăng nhập
- Phân quyền
- Quản lý dữ liệu
- Thanh toán nếu có
- Báo cáo nếu có
- Giao diện responsive
- Database migration
- README
```

## Bước 3: Sửa lỗi nhỏ trên nhánh riêng

Nếu có lỗi, tạo nhánh:

```bash
git checkout -b fix/final-bugs
```

Sửa xong thì PR vào `develop`.

## Bước 4: Merge `develop` vào `main`

Khi ổn định:

```text
develop → main
```

## Bước 5: Tạo tag bản nộp

```bash
git checkout main
git pull origin main
git tag v1.0
git push origin v1.0
```

---

# 20. Những lỗi thường gặp và cách tránh

| Lỗi thường gặp             | Cách tránh                                     |
| -------------------------- | ---------------------------------------------- |
| Code trực tiếp trên `main` | Chỉ code trên nhánh `feature`                  |
| Quên pull code mới nhất    | Luôn `git pull origin develop` trước khi làm   |
| Commit tên không rõ        | Viết commit theo dạng `feat:`, `fix:`, `docs:` |
| Push file `.env`           | Thêm `.env` vào `.gitignore`                   |
| Conflict nhiều             | Chia việc rõ, tránh sửa cùng file              |
| Pull Request trống         | Luôn ghi mô tả PR                              |
| Merge code chưa test       | Chạy project trước khi merge                   |

---

# 21. Mô hình khuyến nghị cho nhóm

Mô hình đơn giản nhất nhưng vẫn chuyên nghiệp:

```text
main
develop
feature/*
fix/*
docs/*
```

Có thể chưa cần dùng `release` và `hotfix` nếu dự án không quá lớn.

Cấu trúc mẫu:

```text
main
└── develop
    ├── feature/auth
    ├── feature/user-management
    ├── feature/course-management
    ├── feature/payment
    ├── feature/report
    ├── fix/login-validation
    └── docs/update-readme
```

Quy trình chính:

```text
feature/* → develop → main
fix/* → develop
docs/* → develop
```

Khi chuẩn bị nộp:

```text
develop → main
tag v1.0
```

---

# 22. Kết luận

Mô hình làm việc nhóm với Git nên vừa đủ đơn giản để mọi thành viên dễ dùng, vừa đủ chuyên nghiệp để tránh lỗi trong quá trình phát triển.

Mô hình đề xuất:

```text
main = bản ổn định để demo/nộp bài
develop = bản phát triển chung
feature/* = nhánh làm từng chức năng
fix/* = nhánh sửa lỗi
docs/* = nhánh cập nhật tài liệu
```

Quy trình cần nhớ:

```text
1. Không code trực tiếp trên main
2. Mỗi chức năng tạo một nhánh riêng từ develop
3. Làm xong tạo Pull Request vào develop
4. Review code trước khi merge
5. Khi project ổn định thì merge develop vào main
6. Tạo tag cho bản demo/nộp bài
```

Câu quan trọng nhất:

```text
Làm việc nhóm với Git không chỉ là biết lệnh Git, mà là biết tổ chức quy trình để code của mọi người không đè lên nhau và project luôn có một bản ổn định.
```
