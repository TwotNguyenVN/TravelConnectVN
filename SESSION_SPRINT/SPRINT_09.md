# SPRINT 09 – Ổn định phiên bản lõi và hoàn thiện MVP

## 1. Mục tiêu sprint

Sprint 09 là sprint **ổn định MVP lõi** của toàn bộ đồ án. Sau Sprint 01–08, hệ thống đã có đủ các trục nghiệp vụ quan trọng gồm **tài khoản và phân quyền, public tour, hồ sơ hướng dẫn viên, quản lý tour, yêu cầu tham gia tour, bài tìm bạn đồng hành, yêu cầu tham gia bài đồng hành, report flow và Admin lõi**. Tuy nhiên, việc “đã có chức năng” chưa đồng nghĩa với “đủ ổn định để demo chính”.

Mục tiêu của sprint này **không phải thêm chức năng mới**, mà là rà soát, kiểm thử, đồng bộ và làm sạch toàn bộ nhóm **ưu tiên 1** để tạo ra một phiên bản MVP lõi đủ ổn định, đủ mạch lạc và đủ thuyết phục khi trình bày đồ án.

### Mục tiêu chính
- Rà soát toàn bộ nhóm chức năng đã triển khai trong phạm vi:
  - **F01–F17**
  - **F25–F27**
  - **F29**
- Đồng bộ lại giữa **database – backend – frontend – tài liệu/UML** để giảm lệch logic giữa các lớp.
- Chốt **4 luồng demo chính** của hệ thống và kiểm thử theo luồng nghiệp vụ hoàn chỉnh, không test rời rạc từng API.
- Chuẩn hóa:
  - response API;
  - thông báo lỗi;
  - loading state / empty state / error state;
  - validation form;
  - menu theo vai trò;
  - phân trang / lọc / sắp xếp ở các màn hình lõi nếu còn thiếu.
- Refactor các service và query đang hoạt động được nhưng chưa sạch, chưa đồng nhất hoặc có nguy cơ lỗi khi demo.
- Làm sạch dữ liệu demo để mỗi luồng đều có dữ liệu đủ đẹp, đủ dễ hiểu, đủ nhất quán khi trình chiếu.
- Chuẩn bị **Postman collection**, **checklist test tay**, **script reset dữ liệu demo** và **kịch bản demo** để sang Sprint 10 có thể mở rộng tiếp mà không phải quay lại chữa nền.

### Ý nghĩa của sprint này
Sprint 09 là điểm chuyển từ “đã hoàn thành các sprint chức năng” sang “có một MVP lõi đủ dùng thật cho demo”. Nếu bỏ qua sprint này, hệ thống sẽ rất dễ gặp các vấn đề sau:
- UI mỗi khu vực một kiểu;
- API trả dữ liệu không đồng nhất;
- quyền truy cập bị lệch giữa frontend và backend;
- dữ liệu demo rời rạc, không kể được câu chuyện;
- UML, màn hình, API và CSDL không khớp nhau.

Nói ngắn gọn, Sprint 09 là sprint **siết chất lượng**. Sau sprint này, sản phẩm phải đủ ổn định để demo trọn vẹn các luồng:
1. **Luồng công khai / Public discovery**
2. **Luồng tham gia tour**
3. **Luồng bài tìm bạn đồng hành**
4. **Luồng quản trị và xử lý vi phạm**

---

## 2. Lưu ý trước khi triển khai

## 2.1. Sprint này không được biến thành sprint thêm tính năng mới
Tinh thần quan trọng nhất của Sprint 09 là: **không mở thêm phạm vi nghiệp vụ**.  
Các nhóm như favorite, review, verification nâng cao, bản đồ, thông báo, thống kê… là nội dung của Sprint 10–11. Nếu kéo vào Sprint 09, bạn sẽ làm loãng mục tiêu ổn định MVP.

Trong sprint này chỉ nên làm:
- sửa bug;
- polish UI;
- chuẩn hóa API;
- tối ưu query;
- chuẩn hóa dữ liệu demo;
- chốt tài liệu/UML;
- chuẩn bị demo.

## 2.2. Phải test theo luồng nghiệp vụ hoàn chỉnh
Không nên kiểm tra kiểu:
- API A chạy được;
- màn hình B hiển thị được;
- form C submit được.

Cách test đúng của Sprint 09 là test theo **luồng đầu-cuối**, ví dụ:
- khách truy cập vào danh sách tour → vào chi tiết tour → đăng nhập → gửi yêu cầu tham gia → guide duyệt → user thấy trạng thái đổi;
- user tạo bài đồng hành → người khác gửi request → chủ bài duyệt → trạng thái thay đổi đúng ở cả hai phía;
- user gửi report → admin tiếp nhận → cập nhật trạng thái xử lý → dữ liệu hiển thị đúng ở danh sách report;
- admin khóa user hoặc đổi role → menu / quyền truy cập thay đổi đúng.

## 2.3. Phải chốt trước danh sách bug ưu tiên
Sprint này rất dễ bị kéo dài vì mọi người thường “sửa tiếp cho đẹp hơn nữa”.  
Cần chia bug thành tối thiểu 3 mức:
- **Blocker / Critical**: lỗi làm hỏng luồng demo chính;
- **Major**: không chặn demo nhưng gây sai nghiệp vụ, sai quyền hoặc sai dữ liệu;
- **Minor**: lỗi giao diện, wording, khoảng cách, hiển thị phụ.

Nếu không có danh sách ưu tiên, bạn sẽ mất nhiều thời gian cho bug nhỏ nhưng bỏ sót bug phá luồng chính.

## 2.4. Phải xác định rõ 4 luồng demo chính
Sprint này chỉ thành công khi chốt được 4 luồng demo cốt lõi để:
- viết checklist test;
- chuẩn bị dữ liệu demo;
- dựng Postman collection;
- chụp ảnh màn hình;
- cập nhật UML và script thuyết trình.

Nếu chưa chốt 4 luồng demo, bạn sẽ không biết dữ liệu nào là dữ liệu “phải đẹp”, màn hình nào phải polish trước và API nào phải ổn định tuyệt đối.

## 2.5. Dữ liệu demo là một phần của MVP, không phải việc phụ
Một MVP để bảo vệ đồ án không chỉ cần code chạy, mà còn cần dữ liệu đủ đẹp để kể chuyện.  
Ví dụ:
- phải có tour ở nhiều trạng thái hợp lý;
- phải có request đang chờ, đã duyệt, đã từ chối;
- phải có bài đồng hành mở, đóng, có thành viên;
- phải có report đang chờ xử lý và report đã giải quyết;
- phải có tài khoản theo nhiều vai trò.

Nếu dữ liệu demo nghèo nàn hoặc lệch logic, buổi demo sẽ rất khó thuyết phục dù code đúng.

## 2.6. Cần rà soát điểm lệch giữa DB / API / UI / UML
Đây là sprint bắt buộc phải kiểm tra các loại lệch phổ biến:
- bảng dữ liệu có trạng thái nhưng UI không hiển thị hết;
- API backend dùng tên field khác với frontend;
- frontend cho thao tác nhưng backend chặn quyền;
- UML mô tả luồng khác với logic hiện thực;
- menu hoặc route guard chưa phản ánh đúng role.

Sprint 09 là nơi xử lý những “độ lệch nhỏ nhưng nguy hiểm” này.

## 2.7. “Xong sprint” không đồng nghĩa với “không còn bug”
Mục tiêu thực tế của Sprint 09 không phải triệt tiêu 100% bug.  
Mục tiêu đúng là:
- 4 luồng demo chạy ổn định;
- không còn lỗi blocker;
- dữ liệu demo nhất quán;
- tài liệu/UML khớp với bản hiện thực;
- hệ thống có thể reset về trạng thái demo chuẩn;
- người thực hiện có checklist test và kịch bản thuyết trình rõ ràng.

---

## 3. Các vấn đề cần xác định trong sprint này

## 3.1. Danh sách bug ưu tiên
Cần xác định:
- bug nào chặn demo;
- bug nào làm sai nghiệp vụ;
- bug nào chỉ là giao diện phụ;
- bug nào có thể để lại tới Sprint 14.

## 3.2. Bốn luồng demo chính của hệ thống
Cần chốt chính thức:
1. **Luồng công khai / Public discovery**
2. **Luồng tour**
3. **Luồng bài đồng hành**
4. **Luồng quản trị / report / moderation**

## 3.3. Phạm vi polish màn hình
Cần xác định:
- màn hình nào chỉ sửa state và wording;
- màn hình nào phải sửa form và validation;
- màn hình nào phải sửa table/filter/pagination;
- màn hình nào phải polish gấp vì dùng trong demo.

## 3.4. Phạm vi regression test API
Cần xác định:
- nhóm API nào bắt buộc phải test lại toàn bộ;
- endpoint nào cần thêm filter / sort / pagination;
- endpoint nào đang trả lỗi chưa đồng nhất;
- endpoint nào đang thiếu kiểm tra role hoặc ownership.

## 3.5. Phạm vi chuẩn hóa response và lỗi
Cần chốt:
- format response thành công;
- format lỗi nghiệp vụ;
- format lỗi validation;
- thông điệp lỗi người dùng nhìn thấy trên UI;
- mapping giữa HTTP status và lỗi hiển thị.

## 3.6. Chiến lược dữ liệu demo
Cần xác định:
- bộ seed demo chuẩn;
- script reset dữ liệu demo;
- tài khoản demo cho từng vai trò;
- bộ dữ liệu để kể đủ 4 luồng demo;
- dữ liệu nào nên cố định, dữ liệu nào sinh mới khi test.

## 3.7. Quy tắc kiểm tra phân quyền và ownership
Cần rà soát:
- user chỉ thấy dữ liệu của mình;
- guide chỉ quản lý tour / request thuộc phạm vi của mình;
- admin role đúng phạm vi quyền;
- route guard frontend và backend guard không lệch nhau.

## 3.8. Phạm vi cập nhật tài liệu/UML
Cần xác định:
- Activity Diagram nào phải chốt;
- màn hình nào phải cập nhật mô tả cuối;
- mapping nào cần sửa;
- phần nào đủ để dùng trong báo cáo giữa kỳ / demo chính.

---

## 4. Hạng mục cần chốt

Sprint 09 cần chốt rõ các hạng mục sau trước khi bắt đầu sửa đồng loạt:

- Không bổ sung nghiệp vụ mới trong sprint này.
- Danh sách bug theo mức độ ưu tiên.
- 4 luồng demo chính của hệ thống.
- Checklist test tay theo từng luồng nghiệp vụ.
- Danh sách màn hình lõi phải polish.
- Danh sách API lõi phải regression test.
- Quy ước response và error dùng chung.
- Bộ dữ liệu demo lõi và script reset.
- Tiêu chí nghiệm thu MVP.
- Danh sách tài liệu/UML phải cập nhật để khớp hiện trạng code.

---

## 5. Phương án được chọn

## 5.1. Chiến lược tổng thể được chọn
Phương án được chọn cho Sprint 09 là:

- **không thêm chức năng mới**;
- tập trung vào **làm sạch – đồng bộ – kiểm thử – ổn định**;
- lấy **4 luồng demo chính** làm trục;
- ưu tiên sửa từ **blocker → major → minor**;
- mọi chỉnh sửa phải được đối chiếu qua 4 lớp:
  - database;
  - backend;
  - frontend;
  - tài liệu/UML.

### Quy tắc áp dụng
- bất kỳ thay đổi nào làm phát sinh nghiệp vụ mới sẽ chuyển sang sprint sau;
- thay đổi schema chỉ thực hiện nếu thật sự cần để sửa lỗi logic hoặc toàn vẹn dữ liệu;
- bug không ảnh hưởng demo có thể ghi lại để xử lý ở Sprint 14;
- chỉ polish sâu những màn hình nằm trong 4 luồng demo chính.

## 5.2. Bốn luồng demo chính được chọn
Bốn luồng demo chính được chọn để làm chuẩn kiểm thử và nghiệm thu MVP là:

### Luồng 1 – Công khai / Public discovery
- vào trang chủ;
- xem danh sách tour;
- lọc / tìm kiếm tour;
- xem chi tiết tour;
- xem danh sách bài đồng hành;
- xem chi tiết bài đồng hành;
- điều hướng sang đăng nhập / đăng ký khi cần thao tác sâu.

### Luồng 2 – Tham gia tour
- user đăng nhập;
- xem chi tiết tour;
- gửi yêu cầu tham gia tour;
- xem yêu cầu của tôi;
- guide vào khu vực quản lý yêu cầu tour;
- guide duyệt hoặc từ chối;
- user thấy trạng thái thay đổi đúng.

### Luồng 3 – Bài tìm bạn đồng hành
- user tạo bài đồng hành;
- bài hiển thị ở danh sách công khai;
- user khác xem chi tiết bài;
- gửi yêu cầu tham gia;
- chủ bài xem danh sách request;
- chủ bài duyệt hoặc từ chối;
- bên gửi request thấy đúng trạng thái kết quả.

### Luồng 4 – Quản trị và xử lý vi phạm
- user gửi báo cáo vi phạm;
- admin / staff tiếp nhận report;
- moderator hoặc admin thực hiện cập nhật xử lý;
- nếu cần thì khóa user hoặc moderation nội dung;
- hệ thống lưu log quản trị và lịch sử xử lý.

## 5.3. Cách ưu tiên bug được chọn
Bug được ưu tiên theo 3 mức:

### Mức 1 – Blocker
Lỗi thuộc mức này phải xử lý ngay:
- không đăng nhập được;
- không gửi request được;
- không duyệt request được;
- report flow không chạy;
- route guard sai làm lộ quyền;
- API crash hoặc trả sai cấu trúc khiến màn hình chính vỡ.

### Mức 2 – Major
Lỗi thuộc mức này xử lý sau blocker:
- trạng thái cập nhật sai giữa hai màn hình;
- pagination / filter sai;
- dữ liệu hiển thị thiếu trường quan trọng;
- validation thiếu khiến người dùng nhập sai dữ liệu;
- audit / log / ownership xử lý chưa đúng.

### Mức 3 – Minor
Lỗi có thể gom xử lý sau:
- wording chưa chuẩn;
- icon / spacing / alignment chưa đẹp;
- màu badge chưa thống nhất;
- text cảnh báo chưa thân thiện;
- một số empty state chưa đủ rõ.

## 5.4. Phạm vi màn hình được chọn
Sprint 09 sẽ polish và kiểm thử các màn hình lõi sau:

- **Public Area:** `M01–M06`, `M10–M11`
- **User Area:** `M15–M16`, `M20–M21`, `M23–M26`
- **Guide Area:** `M31–M32`, `M34–M37`
- **Admin Area:** `M38–M45`, `M47`

### Những gì chưa làm trong sprint này
- favorite / review / verification mở rộng của Sprint 10;
- map / notification / statistics của Sprint 11;
- chat / AI / accommodation / payment của các sprint sau.

## 5.5. Chuẩn hóa API được chọn
Phương án chuẩn hóa API trong sprint này là:
- giữ nguyên endpoint lõi đã có nếu không bắt buộc phải đổi;
- chỉ bổ sung hoặc chỉnh ở các điểm:
  - pagination;
  - filter;
  - sort;
  - error handling;
  - response wrapper;
  - validation message;
  - ownership / role checking.

### Quy tắc response
- danh sách trả theo cấu trúc thống nhất: `items`, `pagination`, `filtersApplied` nếu cần;
- chi tiết trả theo cấu trúc object rõ ràng, không dùng field mơ hồ;
- lỗi validation trả về đủ thông tin để frontend gắn vào field;
- lỗi nghiệp vụ phải có mã lỗi ngắn gọn, dễ map ra UI.

## 5.6. Chiến lược dữ liệu demo được chọn
Phương án được chọn là chuẩn hóa một **bộ seed demo lõi** gồm:
- tài khoản `USER`, `GUIDE`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF`;
- guide profile đã public và guide profile chưa hoàn chỉnh để test quyền;
- tour ở các trạng thái phù hợp cho public và guide area;
- tour request với `pending`, `approved`, `rejected`, `cancelled`;
- companion post với dữ liệu đẹp, đủ chi tiết;
- companion request ở nhiều trạng thái;
- report ở các trạng thái `pending`, `in_review`, `resolved`, `rejected`;
- log quản trị và role change log cơ bản.

### Quy tắc áp dụng
- luôn có script reset để đưa hệ thống về đúng trạng thái demo;
- dữ liệu dùng cho demo phải có mô tả, tên, trạng thái dễ hiểu;
- không để dữ liệu test bừa làm loãng màn hình danh sách;
- mọi dữ liệu phục vụ 4 luồng demo phải được kiểm tra lại sau mỗi đợt fix lớn.

## 5.7. Tiêu chí nghiệm thu MVP được chọn
MVP lõi sau Sprint 09 được xem là đạt khi thỏa các điều kiện sau:

1. **Không còn bug blocker** trong 4 luồng demo chính.  
2. Các màn hình lõi đều có:
   - loading state;
   - empty state;
   - error state;
   - thông báo thao tác thành công / thất bại cơ bản.
3. Menu và route theo vai trò hoạt động đúng.
4. Backend guard và ownership check hoạt động đúng.
5. Các API lõi được regression test lại.
6. Dữ liệu demo có thể reset về trạng thái chuẩn.
7. Activity Diagram của toàn bộ nhóm ưu tiên 1 đã được chốt.
8. Mapping chức năng – API – bảng dữ liệu không còn lệch logic nghiêm trọng.

---

## 6. Ghi chú triển khai

- Nên bắt đầu sprint bằng việc lập **bug board** và **test checklist**, không lao vào sửa UI ngay.
- Nên fix theo thứ tự:
  1. lỗi phá luồng;
  2. lỗi quyền;
  3. lỗi dữ liệu;
  4. lỗi API;
  5. lỗi UI/UX.
- Mỗi bug sửa xong cần test lại đúng luồng nghiệp vụ liên quan.
- Nếu phải đổi schema, chỉ đổi ở mức tối thiểu và phải cập nhật lại seed / reset script ngay.
- Không nên để Sprint 09 thành sprint refactor vô hạn; refactor chỉ làm ở những chỗ ảnh hưởng trực tiếp tới độ ổn định.
- Mọi thay đổi nên cập nhật đồng thời:
  - code;
  - dữ liệu demo;
  - checklist test;
  - tài liệu/UML liên quan.

---

## 7. Chức năng trọng tâm

Sprint 09 không thêm chức năng mới, mà tập trung rà soát và ổn định các chức năng đã triển khai trong nhóm **ưu tiên 1**.

### Phạm vi thực hiện trong Sprint 09
- **F01** Đăng ký, đăng nhập, đăng xuất
- **F02** Quản lý hồ sơ cá nhân
- **F03** Phân quyền người dùng
- **F06** Gửi báo cáo vi phạm
- **F08** Quản lý hồ sơ hướng dẫn viên
- **F10** Quản lý tour
- **F11** Quản lý yêu cầu tham gia tour
- **F12** Xem danh sách tour
- **F13** Tìm kiếm, lọc và sắp xếp tour
- **F14** Xem chi tiết tour
- **F16** Quản lý bài tìm bạn đồng hành
- **F17** Quản lý yêu cầu tham gia bài đồng hành
- **F25** Quản trị dữ liệu tổng thể
- **F26** Phê duyệt hồ sơ chuyên môn của hướng dẫn viên
- **F27** Quản lý nội dung vi phạm
- **F29** Giao diện quản trị trực quan

### Trọng tâm nghiệp vụ theo area

#### Public Area
- luồng truy cập công khai phải mượt;
- bộ lọc tour phải dùng được;
- trang chi tiết tour và chi tiết bài đồng hành phải rõ ràng, không lỗi dữ liệu;
- điều hướng sang auth khi cần thao tác sâu phải đúng.

#### User Area
- hồ sơ cá nhân và đổi mật khẩu phải ổn định;
- request tour của tôi phải hiển thị đúng trạng thái;
- bài đồng hành của tôi, yêu cầu tôi gửi và yêu cầu trên bài của tôi phải đồng bộ.

#### Guide Area
- dashboard và hồ sơ guide phải hiển thị đúng dữ liệu;
- danh sách tour của tôi, form tạo/sửa tour và locations phải hoạt động ổn định;
- xử lý request tour phải đúng quyền và đúng trạng thái.

#### Admin Area
- dashboard admin phải dùng được ở mức lõi;
- user management và role management phải ổn định;
- guide verification, moderation và report flow phải chạy xuyên suốt;
- audit log phải đủ để giải thích thao tác quản trị.

### Những gì chưa làm sâu trong sprint này
- yêu thích tour/guide;
- đánh giá tour / guide;
- bản đồ tour;
- lịch sử hoạt động;
- thông báo;
- thống kê nâng cao;
- chat, AI, lưu trú, thanh toán.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình
Phần màn hình trong Sprint 09 không xây mới, mà tập trung:
- polish UI;
- thống nhất layout;
- đồng bộ badge trạng thái;
- xử lý loading / error / empty state;
- sửa validation;
- kiểm tra route guard;
- tối ưu luồng thao tác để demo mượt.

## 8.2. Các màn hình cần triển khai trong Sprint 09

### Public Area
- **M01 – Trang chủ**
- **M02 – Đăng ký tài khoản**
- **M03 – Đăng nhập**
- **M04 – Danh sách tour**
- **M05 – Tìm kiếm / lọc / sắp xếp tour**
- **M06 – Chi tiết tour**
- **M10 – Danh sách bài tìm bạn đồng hành**
- **M11 – Chi tiết bài tìm bạn đồng hành**

### User Area
- **M15 – Hồ sơ cá nhân**
- **M16 – Đổi mật khẩu**
- **M20 – Gửi báo cáo vi phạm**
- **M21 – Yêu cầu tham gia tour của tôi**
- **M23 – Danh sách bài đồng hành của tôi**
- **M24 – Tạo/cập nhật bài tìm bạn đồng hành**
- **M25 – Yêu cầu tham gia bài đồng hành đã gửi**
- **M26 – Quản lý yêu cầu tham gia bài đồng hành**

### Guide Area
- **M31 – Dashboard hướng dẫn viên**
- **M32 – Quản lý hồ sơ hướng dẫn viên của tôi**
- **M34 – Danh sách tour của tôi**
- **M35 – Tạo / cập nhật tour**
- **M36 – Quản lý lịch trình / địa điểm tour**
- **M37 – Quản lý yêu cầu tham gia tour**

### Admin Area
- **M38 – Dashboard quản trị trực quan**
- **M39 – Quản lý người dùng và nhân sự quản trị**
- **M40 – Phân quyền quản trị**
- **M41 – Quản lý hồ sơ hướng dẫn viên và xác minh**
- **M42 – Quản trị tour toàn hệ thống**
- **M43 – Quản trị bài đồng hành toàn hệ thống**
- **M45 – Tiếp nhận / phân loại / cập nhật xử lý báo cáo**
- **M47 – Nhật ký hoạt động quản trị**

## 8.3. Thành phần UI dùng chung cần chuẩn hóa lại
- App layout theo area
- sidebar / topbar / breadcrumb
- card danh sách
- table dùng chung
- modal xác nhận
- badge trạng thái
- pagination
- filter bar
- form field + validation message
- empty state
- skeleton / loading state
- error state / retry state
- toast / alert thông báo thao tác

## 8.4. Kết quả mong đợi của phần màn hình
- các màn hình chính không còn lỗi vỡ layout ở dữ liệu demo chuẩn;
- badge trạng thái nhất quán giữa tour, request, report, tài khoản;
- thao tác submit form có loading và thông báo rõ ràng;
- menu theo role không còn hiển thị sai;
- màn hình danh sách có phân trang / lọc / sắp xếp ở mức đủ dùng nếu endpoint đã hỗ trợ;
- người xem demo có thể theo dõi luồng thao tác liền mạch, không phải “giải thích hộ giao diện”.

---

## 9. Bảng CSDL chính

Sprint 09 không thêm nhóm bảng mới, mà rà soát toàn bộ các bảng lõi đã dùng từ Sprint 01 đến Sprint 08.

## 9.1. Nhóm tài khoản, phân quyền và audit
- `users`
- `roles`
- `user_roles`
- `admin_activity_logs`
- `user_role_change_logs`

### Vai trò trong Sprint 09
- kiểm tra lại toàn vẹn role;
- kiểm tra route guard / ownership;
- kiểm tra tác động khi đổi role hoặc khóa user;
- làm sạch log và dữ liệu phân quyền demo.

## 9.2. Nhóm hồ sơ hướng dẫn viên
- `guide_profiles`
- `languages`
- `skills`
- `guide_languages`
- `guide_skills`
- `guide_verification_requests`
- `guide_verification_documents`

### Vai trò trong Sprint 09
- kiểm tra dữ liệu guide profile hiển thị đồng nhất giữa public / guide / admin;
- rà soát trạng thái hiển thị và xác minh đang dùng;
- chưa mở rộng thêm verification flow mới.

## 9.3. Nhóm tour và public tour
- `tour_categories`
- `tours`
- `tour_images`
- `tour_locations`
- `tour_requests`

### Vai trò trong Sprint 09
- kiểm tra public visibility của tour;
- rà soát dữ liệu ảnh, lịch trình, ngày bắt đầu / kết thúc;
- kiểm tra state machine request tour;
- tối ưu query danh sách / chi tiết / quản lý tour.

## 9.4. Nhóm bài tìm bạn đồng hành
- `companion_posts`
- `companion_requests`

### Vai trò trong Sprint 09
- kiểm tra trạng thái bài và request;
- kiểm tra dữ liệu hiển thị giữa public list, detail, dashboard user và admin;
- chuẩn hóa dữ liệu demo để luồng bài đồng hành kể chuyện tốt hơn.

## 9.5. Nhóm report và xử lý vi phạm
- `reports`
- `report_processing_history`

### Vai trò trong Sprint 09
- kiểm tra report flow từ user sang admin;
- kiểm tra target_type, status, action_type và lịch sử xử lý;
- rà soát các trường dùng cho moderation hiển thị đúng trên UI.

## 9.6. Bảng hỗ trợ cần lưu ý thêm
Ngoài các bảng lõi trên, Sprint 09 cũng cần kiểm tra các bảng liên quan gián tiếp đến hiển thị và thống nhất dữ liệu nếu chúng đã được dùng trong bản hiện thực:
- `tour_reviews` nếu đã đọc để hiển thị tóm tắt;
- `guide_reviews` nếu đã đọc để hiển thị tóm tắt;
- các bảng join / lookup đang được gọi ở dashboard hoặc detail screen.

Tuy nhiên, **không mở sâu logic favorite / review / notification / chat** trong sprint này.

## 9.7. Ghi chú triển khai dữ liệu
- rà soát FK, unique và check constraint trên toàn bộ nhóm bảng lõi;
- tối ưu index cho bảng danh sách lớn hoặc bảng dùng filter nhiều;
- chuẩn hóa seed demo;
- backup schema hiện tại trước khi refactor dữ liệu;
- chuẩn bị script reset dữ liệu demo cho 4 luồng chính.

---

## 10. API cần thiết

Sprint 09 không phát sinh nhóm API mới theo nghiệp vụ, nhưng phải regression test và chuẩn hóa toàn bộ API lõi đã dùng trong Sprint 01–08.

## 10.1. Nhóm auth và hồ sơ người dùng
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

### Mục tiêu của nhóm này
- kiểm tra đăng nhập / đăng xuất / điều hướng đúng role;
- kiểm tra dữ liệu hồ sơ cá nhân và đổi mật khẩu;
- chuẩn hóa lỗi auth và validation.

## 10.2. Nhóm public tour
- `GET /home/featured-tours`
- `GET /home/featured-guides`
- `GET /home/latest-companion-posts`
- `GET /tour-categories`
- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/reviews` nếu đã dùng

### Mục tiêu của nhóm này
- kiểm tra dữ liệu công khai;
- kiểm tra filter / sort / pagination;
- kiểm tra chi tiết tour không lỗi join dữ liệu;
- kiểm tra trạng thái tour public hiển thị đúng.

## 10.3. Nhóm guide profile
- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /languages`
- `GET /skills`

### Mục tiêu của nhóm này
- kiểm tra create / update guide profile;
- kiểm tra hiển thị công khai và hiển thị ở dashboard guide;
- kiểm tra ownership.

## 10.4. Nhóm guide tour management
- `GET /guide/tours`
- `POST /tours`
- `PATCH /tours/:id`
- `POST /tours/:id/images`
- `DELETE /tours/:id/images/:imageId`
- `GET /tours/:id/locations`
- `PUT /tours/:id/locations`
- `PATCH /tours/:id/status`

### Mục tiêu của nhóm này
- kiểm tra luồng quản lý tour xuyên suốt;
- kiểm tra create / update / publish / close;
- kiểm tra ảnh và locations.

## 10.5. Nhóm tour requests
- `POST /tour-requests`
- `GET /me/tour-requests`
- `PATCH /tour-requests/:id/cancel`
- `GET /guide/tour-requests`
- `PATCH /guide/tour-requests/:id/approve`
- `PATCH /guide/tour-requests/:id/reject`

### Mục tiêu của nhóm này
- kiểm tra state machine `pending / approved / rejected / cancelled`;
- kiểm tra user view và guide view đồng bộ;
- kiểm tra giới hạn quyền thao tác.

## 10.6. Nhóm companion posts và companion requests
- `GET /companion-posts`
- `GET /companion-posts/:id`
- `POST /companion-posts`
- `PATCH /companion-posts/:id`
- `DELETE /companion-posts/:id`
- `POST /companion-requests`
- `GET /me/companion-requests`
- `GET /my-companion-posts/:id/requests`
- `PATCH /companion-requests/:id/cancel`
- `PATCH /my-companion-requests/:id/approve`
- `PATCH /my-companion-requests/:id/reject`

### Mục tiêu của nhóm này
- kiểm tra luồng đồng hành đầu-cuối;
- kiểm tra đồng bộ trạng thái giữa chủ bài và người gửi request;
- kiểm tra ownership ở post và request.

## 10.7. Nhóm report và admin lõi
- `POST /reports`
- `GET /me/reports`
- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/roles`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles/:role`
- `GET /admin/role-change-logs`
- `GET /admin/guides`
- `GET /admin/guide-verification`
- `PATCH /admin/guide-verification/:id`
- `PATCH /admin/guides/:id/moderation`
- `GET /admin/tours`
- `PATCH /admin/tours/:id/moderation`
- `GET /admin/companion-posts`
- `PATCH /admin/companion-posts/:id/moderation`
- `GET /admin/reports`
- `PATCH /admin/reports/:id`
- `GET /admin/reports/:id/history`
- `GET /admin/activity-logs`

### Mục tiêu của nhóm này
- kiểm tra phân quyền admin nhiều lớp;
- kiểm tra report flow;
- kiểm tra moderation flow;
- kiểm tra audit log và role change log.

## 10.8. Yêu cầu kỹ thuật chung cho API
- response phải đồng nhất giữa các module;
- lỗi validation phải parse được ở frontend;
- lỗi quyền phải phân biệt rõ `401 / 403 / 404`;
- endpoint danh sách cần bổ sung `page`, `limit`, `sort`, `order`, filter nếu hợp lý;
- service không được để N+1 query rõ rệt ở màn hình danh sách;
- Postman collection phải bám theo 4 luồng demo chính.

---

## 11. Công việc frontend

## 11.1. Đồng bộ UI giữa 4 area
- rà soát lại style của Public, User, Guide, Admin;
- đồng bộ spacing, typography, màu badge, kích thước nút, table cell, modal footer;
- bảo đảm các layout lớn không bị “mỗi sprint một kiểu”.

## 11.2. Chuẩn hóa trạng thái màn hình
Mỗi màn hình lõi cần có đủ:
- loading state;
- empty state;
- error state;
- success state sau submit;
- retry state nếu API lỗi.

## 11.3. Rà soát menu và điều hướng theo role
- kiểm tra menu sau đăng nhập của `USER`, `GUIDE`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR`, `SUPPORT_STAFF`;
- kiểm tra route ẩn / hiện đúng theo quyền;
- kiểm tra redirect khi không đủ quyền.

## 11.4. Hoàn thiện validation form
Tập trung vào:
- đăng ký / đăng nhập;
- hồ sơ cá nhân;
- hồ sơ hướng dẫn viên;
- tạo / cập nhật tour;
- gửi yêu cầu tour;
- tạo / cập nhật bài đồng hành;
- gửi report;
- phân quyền / đổi trạng thái user trong admin.

## 11.5. Polish các màn hình công khai
- `M01–M06`, `M10–M11`
- kiểm tra card list, filter bar, detail section, CTA button, empty state và điều hướng đăng nhập.

## 11.6. Polish các màn hình User Area
- `M15–M16`, `M20–M21`, `M23–M26`
- kiểm tra timeline thao tác, danh sách request, trạng thái request, form tạo bài, form report.

## 11.7. Polish các màn hình Guide Area
- `M31–M32`, `M34–M37`
- kiểm tra danh sách tour, form tour, location manager, request manager, badge trạng thái.

## 11.8. Polish các màn hình Admin Area
- `M38–M45`, `M47`
- kiểm tra table lớn, filter, action button, modal confirm, lịch sử xử lý, log, phân quyền.

## 11.9. Chuẩn hóa component dùng chung
- button;
- badge trạng thái;
- confirm dialog;
- textarea có đếm ký tự nếu cần;
- table container;
- pagination;
- filter toolbar;
- search box;
- info card / stats card cơ bản.

## 11.10. Tạo checklist test phía frontend
Checklist nên bám vào từng luồng:
- public;
- tour;
- companion;
- admin.

Mỗi bước test cần ghi:
- input;
- hành động;
- kết quả mong đợi;
- trạng thái pass/fail;
- ghi chú bug nếu có.

## 11.11. Kết quả mong đợi phía frontend
- UI đồng nhất hơn rõ rệt;
- không còn màn hình chính thiếu loading / empty / error state;
- thao tác submit dễ hiểu hơn;
- demo đi theo luồng ít phải “nói đỡ” cho giao diện.

---

## 12. Công việc backend

## 12.1. Refactor service ở các module lõi
Tập trung vào:
- auth;
- users;
- guide-profile;
- tours;
- tour-requests;
- companion-posts;
- companion-requests;
- reports;
- admin.

## 12.2. Tối ưu query cho màn hình danh sách
Các màn hình sau cần rà soát query:
- danh sách tour;
- danh sách bài đồng hành;
- danh sách tour của guide;
- danh sách request tour;
- danh sách request đồng hành;
- danh sách users / reports / tours / companion posts ở admin.

## 12.3. Chuẩn hóa response và lỗi
- thống nhất wrapper response;
- thống nhất cách trả validation error;
- chuẩn hóa lỗi nghiệp vụ như:
  - không đủ quyền;
  - không đúng ownership;
  - trạng thái không cho phép thao tác;
  - dữ liệu không tồn tại / đã bị ẩn / đã xóa mềm.

## 12.4. Rà soát role guard và ownership
Cần kiểm tra lại:
- user chỉ sửa dữ liệu của mình;
- guide chỉ thao tác với tour và request thuộc mình;
- admin role không vượt hoặc thiếu quyền ngoài thiết kế;
- frontend hide route và backend protect route cùng một logic.

## 12.5. Bổ sung pagination / filter / sort nếu còn thiếu
Các endpoint danh sách quan trọng cần hỗ trợ tối thiểu:
- `page`, `limit`
- `sortBy`, `sortOrder`
- filter theo trạng thái nếu có ý nghĩa
- query text cơ bản nếu có màn hình tìm kiếm / quản trị danh sách lớn.

## 12.6. Tạo Postman collection theo 4 luồng demo
Collection nên chia folder:
1. Public
2. Tour flow
3. Companion flow
4. Admin flow

Mỗi folder nên có:
- request chạy đúng thứ tự;
- environment variables;
- dữ liệu mẫu;
- ghi chú expected result.

## 12.7. Tạo checklist regression test backend
- test happy path;
- test validation fail;
- test forbidden;
- test not found;
- test wrong state transition;
- test ownership violation.

## 12.8. Kết quả mong đợi phía backend
- API lõi ổn định hơn;
- lỗi trả ra nhất quán hơn;
- query danh sách đỡ nặng hơn;
- role / ownership ít lệch hơn;
- demo ít gặp lỗi bất ngờ do dữ liệu hoặc trạng thái.

---

## 13. Công việc database

## 13.1. Rà soát khóa ngoại và toàn vẹn tham chiếu
Kiểm tra lại:
- request có trỏ đúng parent object không;
- log / history có FK hợp lý không;
- dữ liệu xóa mềm có gây mồ côi dữ liệu hay không;
- các bảng join có bản ghi trùng / thiếu không.

## 13.2. Rà soát unique và check constraint
Các điểm nên kiểm tra kỹ:
- role assignment trùng;
- request trùng logic;
- trạng thái không hợp lệ;
- ngày tour không hợp lệ;
- dữ liệu profile cơ bản sai miền giá trị;
- moderation / report status sai enum.

## 13.3. Tối ưu index
Index nên ưu tiên cho:
- các bảng danh sách lớn;
- các bảng lọc theo trạng thái;
- các bảng join hoặc lookup nhiều;
- các cột search / sort hay dùng ở admin.

## 13.4. Chuẩn hóa lại seed data
Seed lại dữ liệu theo bộ demo lõi:
- user thường;
- guide;
- admin;
- moderator;
- support staff;
- tour và request mẫu;
- companion post và request mẫu;
- report và log mẫu.

## 13.5. Backup schema và script reset dữ liệu demo
Sprint 09 bắt buộc nên có:
- bản backup schema đang chạy ổn;
- seed chuẩn cho demo;
- script reset về trạng thái “đẹp” sau khi test phá dữ liệu.

## 13.6. Rà soát trạng thái dữ liệu thực tế
Ví dụ:
- tour public có thật sự `published` và `visible`;
- request đã duyệt có khớp số lượng hiển thị;
- bài đồng hành đóng có còn nhận request hay không;
- user bị khóa còn đăng nhập được không;
- nội dung bị moderation có còn hiện ở public list không.

## 13.7. Kết quả mong đợi phía database
- dữ liệu demo sạch, đẹp, đúng logic;
- ràng buộc chặt hơn;
- ít rủi ro lệch trạng thái khi demo;
- có khả năng reset dữ liệu nhanh trước buổi trình bày.

---

## 14. Tài liệu/UML

## 14.1. Tài liệu cần hoàn thiện
- chốt lại phạm vi MVP lõi;
- cập nhật mô tả màn hình đã code;
- cập nhật mapping chức năng – API – bảng dữ liệu;
- cập nhật checklist test và script demo;
- ghi rõ phần nào đã hoàn thiện, phần nào để sprint sau.

## 14.2. Activity Diagram cần chốt
Sprint 09 nên chốt đầy đủ Activity Diagram cho nhóm ưu tiên 1:
- đăng ký / đăng nhập / đăng xuất;
- cập nhật hồ sơ cá nhân;
- tạo / cập nhật hồ sơ hướng dẫn viên;
- xem danh sách tour / chi tiết tour;
- guide tạo / sửa tour;
- user gửi yêu cầu tham gia tour;
- guide duyệt / từ chối yêu cầu tour;
- tạo bài đồng hành;
- gửi / duyệt / từ chối yêu cầu tham gia bài đồng hành;
- gửi report;
- admin xử lý report và moderation cơ bản.

## 14.3. Sequence Diagram nên rà soát lại
Nếu đã có Sequence Diagram cho luồng chính, cần kiểm tra chúng còn khớp với bản hiện thực hay không, đặc biệt là:
- gửi yêu cầu tham gia tour;
- duyệt yêu cầu tour;
- gửi yêu cầu tham gia bài đồng hành;
- xử lý report.

## 14.4. Mapping cần rà soát
- mã chức năng ↔ màn hình;
- màn hình ↔ bảng dữ liệu;
- bảng dữ liệu ↔ API;
- quyền theo role ↔ màn hình ↔ endpoint.

## 14.5. Mục tiêu của phần tài liệu/UML
Sau Sprint 09, tài liệu không chỉ “có để nộp”, mà phải đủ để:
- giải thích luồng demo;
- đối chiếu logic khi sửa bug;
- dùng trực tiếp cho báo cáo và bảo vệ.

---

## 15. Đầu ra

## 15.1. Đầu ra chức năng
- không thêm chức năng mới;
- toàn bộ nhóm ưu tiên 1 được rà soát và ổn định hơn;
- 4 luồng demo chính chạy được đầu-cuối.

## 15.2. Đầu ra giao diện
- màn hình lõi được polish rõ rệt;
- loading / empty / error state đầy đủ hơn;
- menu và điều hướng theo quyền rõ ràng hơn;
- form dễ dùng và ít lỗi hơn.

## 15.3. Đầu ra API
- API lõi đã regression test;
- response và error thống nhất hơn;
- endpoint danh sách quan trọng có pagination / filter / sort ở mức cần thiết;
- có Postman collection bám theo 4 luồng demo chính.

## 15.4. Đầu ra dữ liệu
- dữ liệu demo đẹp, dễ kể chuyện;
- có script reset dữ liệu demo;
- có backup schema ổn định;
- bảng lõi được rà soát constraint và index.

## 15.5. Đầu ra tài liệu
- Activity Diagram nhóm ưu tiên 1 được chốt;
- mô tả màn hình được cập nhật theo bản hiện thực;
- mapping chức năng – API – bảng dữ liệu được rà soát lại;
- có checklist test tay và script demo.

## 15.6. Tiêu chí sẵn sàng sang Sprint 10
Sprint 09 được xem là hoàn thành tốt khi:
- 4 luồng demo chính không còn bug blocker;
- quyền truy cập và ownership đã ổn;
- dữ liệu demo đã đẹp và reset được;
- backend và frontend đã đồng bộ hơn;
- tài liệu/UML không còn lệch nghiêm trọng với code;
- bạn có thể tự tin demo MVP lõi trước khi mở rộng sang favorite, review và verification sâu hơn.

---

## 16. Kết luận sprint

Sprint 09 là sprint mang tính “đóng lõi” của toàn bộ giai đoạn ưu tiên 1. Giá trị lớn nhất của sprint này không nằm ở việc thêm một chức năng mới, mà nằm ở việc biến các phần đã làm thành **một MVP lõi thực sự có thể trình diễn, có thể kiểm thử, có thể giải thích và có thể bảo vệ**.

Nếu thực hiện tốt Sprint 09, bạn sẽ có một hệ thống đủ ổn định để:
- demo mạch lạc;
- sửa lỗi có định hướng;
- viết báo cáo dễ hơn;
- mở rộng Sprint 10–11 mà không bị quay lại sửa nền liên tục.

Nói cách khác, Sprint 09 là sprint giúp đồ án chuyển từ trạng thái **“đã làm nhiều phần”** sang trạng thái **“có một phiên bản lõi hoàn chỉnh và thuyết phục”**.
