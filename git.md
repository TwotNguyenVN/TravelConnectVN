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
tôi có thắc mắc
Khi làm nhóm
Mỗi thành viên pull code từ develop về làm
khi làm xong 1 nhánh cho 1 chức năng rồi push lên github
Sau đó lại pull code từ nhanh develop về để làm chức năng tiếp theo à
nếu nhánh của chức năng vừa rồi chưa được Pull Request vào develop thì sao

Và khi làm nhóm 4 người khi bắt đầu  ngày mới
Mọi người đều pull code của ngày đó về để làm
Họ phát triển rất nhiều nhánh cho nhiều chức năng và để đến cuối ngày mới Pull Request vào develop 1 lần được không, tức là họ vẫn chỉ giữ 1 bản develop từ đầu ngày và phát triển thêm chắc năng mới ra các nhánh khác, khi xong chức năng đó thì push lên git và không Pull Request vào develop, nhưng pull code từ develop ( nhanh delelop này vẫn đang là bản cũ chưa có Pull Request nào ) và để đến cuối ngày họ Pull Request vào develop 1 lần vài chục nhánh chức năng

Đúng, bạn đang hỏi đúng “vấn đề thật” khi làm nhóm với Git: **nếu nhiều nhánh cùng phát triển song song mà chưa merge vào `develop` thì xử lý thế nào?**

Câu trả lời ngắn gọn:

> Mỗi chức năng nên tạo nhánh từ `develop` mới nhất. Làm xong chức năng nào thì nên tạo Pull Request sớm cho chức năng đó, không nên dồn vài chục nhánh đến cuối ngày mới PR cùng lúc.

---

# 1. Sau khi làm xong một nhánh feature, có cần pull `develop` để làm chức năng tiếp theo không?

Có.

Quy trình đúng là:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/chuc-nang-moi
```

Tức là mỗi khi bắt đầu chức năng mới, nên quay về `develop` và lấy code mới nhất.

Ví dụ bạn làm xong chức năng đăng nhập:

```text
feature/login
```

Bạn push lên GitHub:

```bash
git push origin feature/login
```

Sau đó tạo Pull Request:

```text
feature/login → develop
```

Nếu bạn muốn làm tiếp chức năng đăng ký, bạn nên làm:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/register
```

---

# 2. Nếu nhánh vừa làm chưa được Pull Request vào `develop` thì sao?

Có 2 trường hợp.

---

## Trường hợp 1: Chức năng tiếp theo KHÔNG phụ thuộc chức năng vừa làm

Ví dụ:

```text
Bạn vừa làm: feature/login
Bạn muốn làm tiếp: feature/contact-page
```

Hai chức năng này không phụ thuộc nhau nhiều.

Khi đó bạn cứ tạo nhánh mới từ `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/contact-page
```

Dù `feature/login` chưa được merge vào `develop`, cũng không sao.

Sơ đồ:

```text
develop
 ├── feature/login       chưa merge
 └── feature/contact-page
```

Hai nhánh độc lập, sau này PR riêng.

---

## Trường hợp 2: Chức năng tiếp theo PHỤ THUỘC chức năng vừa làm

Ví dụ:

```text
feature/login chưa merge
```

Nhưng bạn muốn làm tiếp:

```text
feature/user-profile
```

Mà `user-profile` cần code đăng nhập, token, auth service từ `feature/login`.

Lúc này nếu tạo `feature/user-profile` từ `develop`, bạn sẽ chưa có code login.

Có 2 cách xử lý.

---

## Cách tốt nhất: chờ `feature/login` được merge vào `develop`

Quy trình sạch nhất:

```text
feature/login → PR → develop
```

Sau khi merge xong:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-profile
```

Cách này sạch, dễ review, ít conflict.

---

## Cách tạm thời: tạo nhánh mới từ nhánh cũ

Nếu bắt buộc phải làm tiếp ngay, bạn có thể tạo nhánh mới từ `feature/login`.

```bash
git checkout feature/login
git checkout -b feature/user-profile
```

Sơ đồ:

```text
develop
 └── feature/login
      └── feature/user-profile
```

Nhưng cách này có rủi ro:

```text
- Pull Request user-profile sẽ chứa cả code của login
- Review khó hơn
- Nếu login bị sửa nhiều trước khi merge, user-profile dễ conflict
- Thứ tự merge phải đúng: login trước, user-profile sau
```

Nếu dùng cách này, cần nhớ:

```text
Merge feature/login vào develop trước.
Sau đó cập nhật feature/user-profile theo develop.
Rồi mới PR feature/user-profile vào develop.
```

---

# 3. Có nên cuối ngày mới Pull Request một lần vài chục nhánh không?

Không nên.

Về lý thuyết thì làm được, nhưng trong thực tế rất dễ rối.

Ví dụ nhóm 4 người, đầu ngày cùng pull `develop`:

```text
develop lúc 8:00 sáng
```

Sau đó mỗi người tạo nhiều nhánh:

```text
A: feature/login, feature/register, feature/profile
B: feature/course, feature/lesson, feature/video
C: feature/payment, feature/order, feature-coupon
D: feature/report, feature-dashboard, feature-export
```

Đến cuối ngày mới tạo Pull Request hàng loạt.

Vấn đề là: tất cả các nhánh này đều dựa trên `develop` cũ lúc 8:00 sáng.

Trong ngày, nếu không merge dần vào `develop`, thì:

```text
- Các nhánh không biết sự thay đổi của nhau
- Dễ sửa trùng file
- Conflict tăng mạnh cuối ngày
- Review bị quá tải
- Khó biết lỗi đến từ nhánh nào
- Nếu một PR lỗi, các PR phụ thuộc sau đó cũng bị kẹt
```

Đây là lỗi rất hay gặp khi làm nhóm.

---

# 4. Cách làm tốt hơn trong ngày

Thay vì dồn cuối ngày, nên làm kiểu:

```text
Làm xong chức năng nhỏ nào → push → tạo Pull Request sớm
```

Không cần đợi cuối ngày.

Ví dụ:

## Buổi sáng

```text
8:00
Tất cả pull develop mới nhất

9:30
A xong feature/login → PR vào develop

10:00
Leader/reviewer kiểm tra → merge vào develop

10:15
Mọi người pull develop mới nhất nếu cần
```

## Buổi trưa

```text
B xong feature/course-list → PR
C xong feature/cart → PR
```

## Buổi chiều

```text
Những người làm chức năng mới sẽ tạo nhánh từ develop mới hơn
```

Như vậy `develop` được cập nhật từng bước, không bị dồn lỗi cuối ngày.

---

# 5. Quy trình khuyên dùng cho nhóm 4 người

## Đầu ngày

Mỗi người làm:

```bash
git checkout develop
git pull origin develop
```

Sau đó tạo nhánh cho chức năng mình làm:

```bash
git checkout -b feature/login
```

---

## Trong ngày

Khi làm xong một chức năng nhỏ:

```bash
git add .
git commit -m "feat: add login page"
git push origin feature/login
```

Sau đó tạo PR ngay:

```text
feature/login → develop
```

Không cần chờ cuối ngày.

---

## Sau khi PR được merge

Mọi người nên cập nhật lại `develop`:

```bash
git checkout develop
git pull origin develop
```

Rồi tạo nhánh mới:

```bash
git checkout -b feature/register
```

---

# 6. Nếu đang làm dở mà `develop` đã có code mới thì sao?

Ví dụ bạn đang ở nhánh:

```text
feature/payment
```

Trong lúc đó người khác đã merge `feature/login` vào `develop`.

Bạn nên cập nhật nhánh của bạn với `develop` mới.

Cách đơn giản, dễ hiểu:

```bash
git checkout feature/payment
git pull origin develop
```

Hoặc rõ hơn:

```bash
git checkout feature/payment
git fetch origin
git merge origin/develop
```

Sau đó xử lý conflict nếu có, rồi tiếp tục làm.

Cách chuyên nghiệp hơn là `rebase`, nhưng nếu nhóm chưa vững Git thì dùng `merge origin/develop` dễ hiểu hơn.

---

# 7. Có nên tạo nhiều nhánh trong ngày từ cùng một bản `develop` cũ không?

Chỉ nên làm nếu các chức năng thật sự độc lập.

Ví dụ có thể chấp nhận:

```text
feature/about-page
feature/contact-page
feature/footer-ui
```

Các chức năng này ít đụng nhau.

Nhưng không nên nếu các chức năng liên quan chặt:

```text
feature/auth-api
feature/login
feature/register
feature-profile
feature-role-permission
```

Vì các chức năng này dễ dùng chung file:

```text
authService
User model
routes/api.php
middleware
database migration
```

Nếu phát triển song song từ `develop` cũ, cuối ngày rất dễ conflict.

---

# 8. Nếu cuối ngày có nhiều PR cùng lúc thì nên merge thế nào?

Nếu đã lỡ có nhiều PR cùng lúc, không merge bừa hàng loạt.

Nên merge theo thứ tự:

```text
1. PR nền tảng trước
2. PR chức năng phụ thuộc sau
3. PR giao diện/tài liệu sau cùng
```

Ví dụ:

```text
1. feature/database-user-table
2. feature/auth-api
3. feature/login-page
4. feature/register-page
5. feature/user-profile
```

Sau mỗi lần merge một PR vào `develop`, các PR còn lại nên cập nhật lại với `develop`.

Ví dụ nhánh `feature/register` cần update:

```bash
git checkout feature/register
git fetch origin
git merge origin/develop
git push origin feature/register
```

Sau đó Pull Request sẽ được cập nhật.

---

# 9. Câu trả lời trực tiếp cho tình huống của bạn

Bạn hỏi:

> Mọi người pull `develop` đầu ngày, tạo rất nhiều nhánh, push lên GitHub nhưng không PR ngay, để cuối ngày PR vài chục nhánh vào `develop` được không?

Trả lời:

```text
Được, nhưng không nên.
```

Vì:

```text
- develop bị cũ suốt cả ngày
- các nhánh không nhận code mới của nhau
- cuối ngày conflict rất nhiều
- review quá tải
- dễ merge nhầm code lỗi
- khó kiểm soát thứ tự phụ thuộc giữa các chức năng
```

Cách tốt hơn:

```text
Xong chức năng nào thì PR sớm chức năng đó.
PR nhỏ, review nhanh, merge dần vào develop.
```

---

# 10. Quy tắc đơn giản nhất cho nhóm bạn

Nhóm nên thống nhất như sau:

```text
1. Đầu ngày tất cả pull develop mới nhất.
2. Mỗi người tạo nhánh feature từ develop.
3. Làm xong chức năng nào thì push và tạo PR ngay.
4. Không dồn quá nhiều PR đến cuối ngày.
5. Sau khi PR nào được merge, ai làm chức năng liên quan phải pull develop mới.
6. Nếu chức năng mới phụ thuộc chức năng cũ, chờ PR cũ merge rồi hãy tạo nhánh mới.
7. Nếu bắt buộc làm tiếp ngay, có thể tạo nhánh mới từ nhánh cũ, nhưng phải merge theo đúng thứ tự.
```

---

# 11. Ví dụ dễ hiểu

## Cách không nên

```text
8:00
A, B, C, D cùng pull develop

Cả ngày:
A tạo 5 nhánh
B tạo 5 nhánh
C tạo 5 nhánh
D tạo 5 nhánh

17:00
Tạo 20 Pull Request cùng lúc vào develop
```

Kết quả dễ gặp:

```text
- PR này đụng PR kia
- Merge PR đầu xong, PR sau bị conflict
- Reviewer không kiểm nổi
- Project develop có thể bị lỗi
```

---

## Cách nên làm

```text
8:00
Tất cả pull develop

9:30
A xong login → PR → review → merge

10:00
B pull develop mới nhất rồi làm register

11:00
C xong course-list → PR → review → merge

13:00
D pull develop mới nhất rồi làm report

15:00
B xong register → PR → review → merge

17:00
develop đã gom code ổn định trong ngày
```

Cách này ít conflict hơn rất nhiều.

---

# 12. Mô hình làm việc thực tế nên dùng

```text
main
└── develop
    ├── feature/login
    ├── feature/register
    ├── feature/payment
    └── feature/report
```

Luồng làm việc:

```text
feature nhỏ → PR sớm → review → merge vào develop
```

Không nên:

```text
feature rất nhiều → cuối ngày PR hàng loạt → merge hàng loạt
```

---

# 13. Kết luận ngắn gọn

Khi làm nhóm:

```text
- Mỗi chức năng tạo nhánh từ develop mới nhất.
- Làm xong chức năng thì tạo Pull Request sớm.
- Không nên giữ develop cũ cả ngày rồi cuối ngày PR hàng loạt.
- Nếu chức năng tiếp theo phụ thuộc chức năng trước, tốt nhất chờ chức năng trước merge vào develop.
- Nếu không phụ thuộc, có thể tạo nhánh mới từ develop hiện tại.
- Nếu đang làm dở mà develop có thay đổi mới, nên cập nhật nhánh của mình bằng cách merge origin/develop vào nhánh đó.
```

Câu dễ nhớ:

> PR càng nhỏ và càng sớm thì càng dễ review, ít conflict, và project ổn định hơn.

Không, **code đang làm không tự nhiên mất** khi bạn cập nhật nhánh `feature/payment` với `develop` mới. Nhưng để an toàn, bạn phải biết code của bạn đang ở trạng thái nào:

```text
1. Đã commit rồi → rất an toàn
2. Chưa commit nhưng file đang sửa → cần cẩn thận
3. Có conflict → phải tự chọn giữ code nào
```

---

# 1. Trường hợp an toàn nhất: code của bạn đã commit

Ví dụ bạn đang ở nhánh:

```bash
git checkout feature/payment
```

Bạn đã làm và commit:

```bash
git add .
git commit -m "feat: add payment checkout UI"
```

Sau đó người khác merge `feature/login` vào `develop`.

Bây giờ bạn muốn cập nhật `feature/payment` theo `develop` mới:

```bash
git fetch origin
git merge origin/develop
```

Lúc này Git sẽ cố gắng gộp:

```text
code của bạn trong feature/payment
+
code mới từ develop
```

Code bạn đã commit **không mất**. Nếu hai bên sửa khác file hoặc khác đoạn code, Git tự gộp được.

---

# 2. Nếu code đang làm chưa commit thì sao?

Ví dụ bạn sửa vài file trong `feature/payment`, nhưng chưa commit.

Khi chạy:

```bash
git merge origin/develop
```

Git có thể báo lỗi kiểu:

```text
Your local changes would be overwritten by merge
```

Nghĩa là Git sợ việc merge sẽ đè lên phần bạn đang sửa.

## Cách xử lý tốt nhất

Trước khi cập nhật từ `develop`, luôn kiểm tra:

```bash
git status
```

Nếu thấy có file đang sửa, bạn có 2 lựa chọn.

---

## Cách A: Commit tạm trước khi cập nhật

Nếu phần bạn làm đã tương đối ổn:

```bash
git add .
git commit -m "wip: payment work in progress"
```

Sau đó cập nhật:

```bash
git fetch origin
git merge origin/develop
```

`wip` nghĩa là “work in progress”, tức là đang làm dở.

Sau này nếu muốn sửa commit cho đẹp hơn thì có thể chỉnh lại, nhưng với nhóm mới học Git, cách này rất an toàn.

---

## Cách B: Stash code đang làm

Nếu bạn chưa muốn commit, có thể dùng `stash`.

```bash
git stash
```

Lệnh này sẽ tạm cất code đang sửa vào một chỗ an toàn.

Sau đó cập nhật nhánh:

```bash
git fetch origin
git merge origin/develop
```

Rồi lấy lại code đang làm:

```bash
git stash pop
```

Quy trình đầy đủ:

```bash
git status
git stash
git fetch origin
git merge origin/develop
git stash pop
```

Nếu có conflict sau `stash pop`, bạn xử lý conflict rồi commit lại.

---

# 3. Nên dùng commit hay stash?

Với nhóm mới học Git, mình khuyên:

```text
Nếu code đang làm có ý nghĩa → commit tạm
Nếu chỉ sửa linh tinh/chưa muốn lưu lịch sử → stash
```

Thực tế dễ nhớ:

| Tình huống                    | Nên dùng                       |
| ----------------------------- | ------------------------------ |
| Làm xong một phần nhỏ         | `commit`                       |
| Đang sửa dở, chưa muốn commit | `stash`                        |
| Sợ mất code                   | `commit` an toàn hơn           |
| Muốn lịch sử Git sạch đẹp     | `stash` hoặc rebase/squash sau |

Ví dụ tốt:

```bash
git add .
git commit -m "wip: continue payment feature"
git fetch origin
git merge origin/develop
```

---

# 4. Nếu merge bị conflict thì code có mất không?

Không mất ngay. Git sẽ đánh dấu conflict trong file.

Ví dụ:

```js
<<<<<<< HEAD
const paymentStatus = "pending";
=======
const paymentStatus = "created";
>>>>>>> origin/develop
```

Ý nghĩa:

```text
HEAD = code hiện tại của bạn trong feature/payment
origin/develop = code mới từ develop
```

Bạn phải mở file lên và chọn phần đúng.

Ví dụ sau khi sửa:

```js
const paymentStatus = "pending";
```

Hoặc kết hợp cả hai nếu cần.

Sau đó:

```bash
git add .
git commit -m "fix: resolve conflict with develop"
```

---

# 5. `merge origin/develop` là gì?

Khi bạn đang ở nhánh `feature/payment` và chạy:

```bash
git merge origin/develop
```

Nghĩa là:

```text
Lấy code mới nhất từ develop gộp vào nhánh feature/payment của bạn.
```

Sau merge, lịch sử Git sẽ giống như có một điểm gộp:

```text
develop:        A---B---C
                     \
feature/payment:      D---E---M
                           ↑
                         merge commit
```

Trong đó:

```text
D, E = commit của bạn
C = code mới từ develop
M = commit merge, gộp develop vào feature/payment
```

Ưu điểm:

```text
- Dễ hiểu
- An toàn
- Phù hợp với nhóm mới
- Ít làm thay đổi lịch sử commit
```

Nhược điểm:

```text
- Lịch sử commit có thể hơi rối vì nhiều merge commit
```

---

# 6. Rebase là gì?

`rebase` cũng dùng để cập nhật nhánh feature theo `develop`, nhưng cách hoạt động khác `merge`.

Khi bạn đang ở:

```text
feature/payment
```

và chạy:

```bash
git fetch origin
git rebase origin/develop
```

Git sẽ làm như sau:

```text
1. Tạm nhấc các commit của bạn ra
2. Đưa nhánh feature/payment lên nền develop mới nhất
3. Gắn lại các commit của bạn lên trên develop mới
```

Ví dụ trước rebase:

```text
develop:        A---B---C
                 \
feature/payment:  D---E
```

Sau khi `develop` có commit mới:

```text
develop:        A---B---C---F---G
                 \
feature/payment:  D---E
```

Nếu dùng rebase:

```text
develop:        A---B---C---F---G
                             \
feature/payment:              D'---E'
```

Dấu `'` nghĩa là Git tạo lại commit của bạn trên nền mới.

Hiểu đơn giản:

> Rebase giống như nói: “Hãy coi như tôi bắt đầu làm `feature/payment` từ bản `develop` mới nhất.”

---

# 7. Merge và rebase khác nhau thế nào?

## Merge

```bash
git merge origin/develop
```

Kết quả:

```text
Giữ nguyên lịch sử thật, thêm một commit merge.
```

Ưu điểm:

```text
- Dễ hiểu
- Ít nguy hiểm hơn
- Phù hợp cho nhóm mới
```

Nhược điểm:

```text
- Lịch sử có thể nhiều commit merge
```

---

## Rebase

```bash
git rebase origin/develop
```

Kết quả:

```text
Làm lịch sử thẳng và sạch hơn.
```

Ưu điểm:

```text
- Lịch sử đẹp hơn
- PR dễ nhìn hơn
- Ít commit merge phụ
```

Nhược điểm:

```text
- Có thể gây rối nếu dùng sai
- Vì rebase viết lại lịch sử commit
- Cần cẩn thận khi nhánh đã push lên GitHub và có người khác cùng dùng
```

---

# 8. Khi nào nên dùng merge, khi nào nên dùng rebase?

## Với nhóm mới học Git

Nên dùng:

```bash
git fetch origin
git merge origin/develop
```

Vì dễ hiểu và an toàn.

## Với nhóm đã quen Git hơn

Có thể dùng:

```bash
git fetch origin
git rebase origin/develop
```

Nhưng cần quy tắc:

```text
Chỉ rebase trên nhánh feature cá nhân của mình.
Không rebase develop.
Không rebase main.
Không rebase nhánh người khác đang dùng chung.
```

---

# 9. Rebase có làm mất code không?

Bình thường là không. Nhưng vì `rebase` viết lại lịch sử commit nên nếu dùng sai có thể gây rối.

Ví dụ an toàn:

```text
Bạn có nhánh feature/payment chỉ mình bạn làm.
Bạn rebase feature/payment lên origin/develop.
```

Cái này ổn.

Ví dụ nguy hiểm:

```text
Bạn và người khác cùng làm trên feature/payment.
Bạn rebase rồi force push.
Người kia có thể bị lệch lịch sử commit.
```

Vì vậy, nếu dùng rebase và đã push nhánh lên GitHub, sau rebase thường phải push kiểu:

```bash
git push --force-with-lease origin feature/payment
```

Không nên dùng:

```bash
git push --force
```

Vì `--force` có thể ghi đè code người khác.
`--force-with-lease` an toàn hơn vì Git sẽ kiểm tra xem remote có thay đổi mới không.

---

# 10. Quy trình cập nhật nhánh feature an toàn nhất cho nhóm bạn

## Cách dễ và an toàn: dùng merge

Khi đang làm `feature/payment` và muốn cập nhật từ `develop`:

```bash
git status
```

Nếu có code đang sửa, commit tạm:

```bash
git add .
git commit -m "wip: payment feature progress"
```

Sau đó:

```bash
git fetch origin
git merge origin/develop
```

Nếu có conflict thì sửa conflict.

Sau đó:

```bash
git add .
git commit -m "fix: resolve conflict with develop"
git push origin feature/payment
```

---

# 11. Quy trình chuyên nghiệp hơn: dùng rebase

Chỉ dùng nếu nhánh đó là nhánh cá nhân của bạn.

```bash
git status
```

Nếu có code đang sửa:

```bash
git add .
git commit -m "wip: payment feature progress"
```

Sau đó:

```bash
git fetch origin
git rebase origin/develop
```

Nếu có conflict, Git sẽ dừng lại.

Bạn sửa conflict, rồi:

```bash
git add .
git rebase --continue
```

Nếu lại conflict tiếp, tiếp tục sửa rồi:

```bash
git add .
git rebase --continue
```

Nếu muốn hủy rebase:

```bash
git rebase --abort
```

Sau khi rebase xong, nếu nhánh đã từng push lên GitHub:

```bash
git push --force-with-lease origin feature/payment
```

Nếu chưa từng push nhánh đó lên GitHub:

```bash
git push origin feature/payment
```

---

# 12. Ví dụ thực tế dễ hiểu

Bạn đang làm:

```text
feature/payment
```

Code của bạn:

```text
PaymentPage.jsx
paymentService.js
```

Người khác merge vào `develop`:

```text
feature/login
```

Code mới trên `develop`:

```text
authService.js
UserContext.jsx
```

Nếu hai bên không sửa cùng file, cập nhật rất dễ:

```bash
git fetch origin
git merge origin/develop
```

Git tự gộp được.

Nhưng nếu cả hai cùng sửa:

```text
routes/api.php
```

thì dễ conflict. Khi đó bạn phải mở `routes/api.php` và chọn giữ cả route login và route payment.

Ví dụ sau khi sửa đúng:

```php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/payment', [PaymentController::class, 'createPayment']);
```

Rồi commit lại:

```bash
git add routes/api.php
git commit -m "fix: resolve api route conflict"
```

---

# 13. Câu trả lời ngắn gọn cho thắc mắc của bạn

## Khi cập nhật nhánh với `develop` mới, code đang làm có mất không?

```text
Không mất nếu bạn commit hoặc stash trước khi cập nhật.
```

Nguy hiểm nhất là:

```text
Bạn đang sửa nhiều file chưa commit,
sau đó merge/rebase mà không kiểm tra git status.
```

Vì vậy luôn nhớ:

```bash
git status
```

trước khi merge/rebase.

---

## Nên xử lý thế nào?

Quy trình an toàn:

```bash
git status
git add .
git commit -m "wip: save current work"

git fetch origin
git merge origin/develop
```

Hoặc nếu chưa muốn commit:

```bash
git stash
git fetch origin
git merge origin/develop
git stash pop
```

---

## Rebase là gì?

```text
Rebase là cách đưa nhánh feature của bạn lên nền develop mới nhất,
rồi phát lại các commit của bạn lên trên đó.
```

Hiểu đơn giản:

```text
Merge = gộp develop mới vào nhánh của bạn
Rebase = chuyển nhánh của bạn sang bắt đầu từ develop mới nhất
```

---

# 14. Khuyến nghị cho nhóm của bạn

Với nhóm đang học và làm đồ án, nên thống nhất:

```text
Dùng merge cho dễ hiểu và an toàn.
Chưa cần dùng rebase nếu các thành viên chưa vững Git.
```

Quy trình nên dùng:

```bash
git checkout feature/payment
git status
git add .
git commit -m "wip: payment progress"
git fetch origin
git merge origin/develop
git push origin feature/payment
```

Khi nhóm quen hơn, có thể chuyển sang rebase để lịch sử commit đẹp hơn.
