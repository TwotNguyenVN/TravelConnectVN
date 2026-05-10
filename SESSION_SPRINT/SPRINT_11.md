# SPRINT 11 – Hoàn thiện nhóm ưu tiên 2: bản đồ, lịch sử hoạt động, thông báo và thống kê

## 1. Mục tiêu sprint

Sprint 11 là sprint hoàn thiện lớp chức năng **ưu tiên 2** còn lại sau khi:

- Sprint 09 đã ổn định MVP lõi;
- Sprint 10 đã bổ sung favorite, review và verification.

Nếu Sprint 10 làm hệ thống “dày” hơn theo hướng **uy tín và cá nhân hóa**, thì Sprint 11 làm hệ thống “đầy” hơn theo hướng:

- hỗ trợ người dùng theo dõi hành trình trực quan;
- cho người dùng xem lại lịch sử thao tác;
- cho người dùng và guide nhận thông tin cập nhật tập trung;
- cho admin có dashboard thống kê đủ dùng để trình bày khi bảo vệ.

Theo kế hoạch triển khai đã chốt, Sprint 11 tập trung vào 4 chức năng chính:

- **F04 – Quản lý lịch sử hoạt động cá nhân**
- **F07 – Nhận thông báo**
- **F15 – Xem lộ trình tour trên bản đồ**
- **F28 – Thống kê và báo cáo hệ thống**【turn36:4†KE_HOACH.docx†L1-L22】【turn37:18†KE_HOACH.docx†L1-L28】

Các màn hình trọng tâm tương ứng là:

- **M07 – Bản đồ lộ trình tour**
- **M17 – Lịch sử hoạt động cá nhân**
- **M19 – Trung tâm thông báo**
- **M46 – Thống kê và báo cáo hệ thống**【turn37:18†KE_HOACH.docx†L1-L28】【turn37:0†KE_HOACH.docx†L1-L28】

### Mục tiêu chính

- Hoàn thiện màn hình **bản đồ lộ trình tour** từ dữ liệu `tour_locations`, đủ để người dùng hình dung hành trình của tour theo thứ tự các điểm dừng.
- Hoàn thiện chức năng **lịch sử hoạt động cá nhân** từ bảng `user_activity_logs`, giúp user/guide xem lại các sự kiện đã phát sinh trên tài khoản của mình.
- Hoàn thiện **trung tâm thông báo** từ bảng `notifications`, cho phép xem danh sách thông báo, đánh dấu đã đọc từng mục và đánh dấu đã đọc tất cả.
- Hoàn thiện **dashboard thống kê quản trị** ở mức đồ án, cung cấp số liệu tổng quan về user, tour, bài đồng hành, báo cáo và thanh toán cơ bản.
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** để nhóm chức năng ưu tiên 2 khép kín, sẵn sàng chuyển sang giai đoạn mở rộng.【turn37:4†Ke_hoach_14_sprint_DOCX_ready.docx†L1-L22】【turn37:18†KE_HOACH.docx†L1-L28】

### Ý nghĩa của sprint này

Sprint 11 không phải sprint “mở trục nghiệp vụ mới”, mà là sprint nâng chất lượng hệ thống ở ba lớp:

1. **Lớp trải nghiệm người dùng**  
   Người dùng thấy tour trực quan hơn nhờ bản đồ, theo dõi hệ thống dễ hơn nhờ thông báo, và nhìn lại hành trình sử dụng nhờ lịch sử hoạt động.

2. **Lớp theo dõi vận hành**  
   Admin có thêm dashboard thống kê để mô tả trạng thái vận hành thay vì chỉ quản lý CRUD đơn lẻ.

3. **Lớp trình bày đồ án**  
   Đây là nhóm chức năng rất có giá trị khi bảo vệ vì giúp sản phẩm trông “thật hệ thống” hơn, thay vì chỉ có các luồng form và danh sách.

Nói ngắn gọn, Sprint 11 là sprint giúp hệ thống đạt độ **“đầy”** tốt cho phần ưu tiên 2, đúng như kế hoạch 14 sprint đã chốt.【turn37:8†KE_HOACH.docx†L1-L8】【turn37:3†BAO_CAO_TONG.docx†L1-L4】

---

## 2. Lưu ý trước khi triển khai

## 2.1. Đây vẫn là sprint ưu tiên 2, không được trượt sang nhóm mở rộng mức 3

Dù Sprint 11 nhìn có vẻ “đẹp sản phẩm”, nhưng vẫn chỉ thuộc nhóm hoàn thiện ưu tiên 2.  
Vì vậy, không nên nhân cơ hội này kéo thêm các nội dung như:

- realtime notification hoàn chỉnh;
- chat realtime;
- bản đồ nâng cao với chỉ đường, geocoding, clustering phức tạp;
- dashboard BI nâng cao;
- báo cáo xuất file PDF/Excel;
- phân tích thanh toán chi tiết như sản phẩm thương mại.

Sprint này phải bám đúng mức **đủ dùng, dễ demo, dễ báo cáo**. Các phần mở rộng sâu hơn nên để sang giai đoạn sau. Điều này cũng phù hợp với phạm vi đồ án đã chốt: bản đồ, lịch sử hoạt động, thông báo và thống kê là nhóm hoàn thiện sau phần lõi, không phải cam kết bắt buộc ngay từ đầu.【turn37:13†BAO_CAO_TONG.docx†L1-L10】

## 2.2. M07 chỉ là bản đồ lộ trình tour, không phải hệ thống bản đồ du lịch tổng quát

Màn hình M07 được xác định rất rõ: mục tiêu là hiển thị **lộ trình của một tour cụ thể** từ bảng `tour_locations`, gồm các điểm đến, marker, thứ tự di chuyển, thời gian ghé thăm và ghi chú cơ bản. Nó không phải:

- bản đồ toàn bộ tour trên hệ thống;
- bản đồ gợi ý du lịch theo khu vực;
- công cụ lập kế hoạch hành trình tự do;
- hệ thống dẫn đường thời gian thực.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

Do đó, chỉ cần làm tốt luồng:

**Chi tiết tour → mở bản đồ lộ trình → xem các điểm theo sequence → quay lại chi tiết tour**

là đủ phù hợp với đồ án.

## 2.3. Activity log phải có quy tắc ghi log nhất quán

Nếu không chốt rule ghi log, màn hình M17 sẽ rất nhanh rơi vào tình trạng:

- log quá ít nên không có gì để xem;
- log quá nhiều, rác và khó đọc;
- mỗi module ghi một kiểu khác nhau;
- metadata không thống nhất, frontend khó render.

Ngay từ đầu phải thống nhất:
- sự kiện nào cần ghi log;
- actor nào tạo log;
- `activity_type` sẽ đặt tên theo chuẩn nào;
- `entity_type`, `entity_id`, `metadata` sẽ dùng thế nào;
- frontend sẽ render danh sách log theo template hay theo text thuần.

Bảng `user_activity_logs` trong schema final khá gọn (`activity_type`, `entity_type`, `entity_id`, `metadata`, `created_at`), nên càng phải chốt convention trước khi code để tránh mất kiểm soát dữ liệu.【turn37:16†BAO_CAO_2_CSDL.docx†L16-L24】

## 2.4. Notification center không đồng nghĩa với realtime push notification

Chức năng F07 trong Sprint 11 chỉ cần đạt:

- có dữ liệu thông báo;
- có danh sách thông báo;
- phân biệt đã đọc / chưa đọc;
- có liên kết tới đối tượng liên quan;
- có thao tác đánh dấu đã đọc từng mục và đánh dấu đã đọc tất cả.【turn37:18†KE_HOACH.docx†L1-L28】【turn37:14†BAO_CAO_4_MAN_HINH.docx†L9-L15】

Không bắt buộc làm:
- websocket;
- push browser notification;
- background subscription phức tạp;
- đồng bộ thời gian thực giữa nhiều tab.

Triển khai phù hợp nhất cho đồ án là:
- tạo notification khi các sự kiện quan trọng phát sinh;
- frontend polling hoặc refetch khi mở trang/đổi view;
- badge số lượng chưa đọc ở header nếu đủ thời gian.

## 2.5. Dashboard thống kê chỉ cần “ra quyết định quản trị cơ bản”

M46 được mô tả là màn hình giúp theo dõi các chỉ số vận hành cơ bản: user, tour, bài đồng hành, báo cáo vi phạm, hồ sơ chờ duyệt và thanh toán cơ bản theo khoảng thời gian. Đây là dashboard phục vụ báo cáo quản trị, không phải hệ thống analytics sâu.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】

Vì vậy nên giới hạn ở:
- thẻ số liệu tổng quan;
- một vài biểu đồ hoặc bảng số liệu cơ bản;
- bộ lọc thời gian đơn giản;
- số liệu lấy từ truy vấn tổng hợp có kiểm soát.

Không nên mở rộng sang:
- cohort analysis;
- retention;
- funnel nhiều bước;
- export dashboard;
- cấu hình dashboard động.

## 2.6. Dữ liệu demo quyết định gần như toàn bộ chất lượng Sprint 11

Sprint 11 là sprint rất dễ “xong code nhưng không có gì để demo”.  
Nếu không chuẩn bị dữ liệu mẫu tốt thì:

- M07 không có đủ điểm để thành bản đồ có ý nghĩa;
- M17 chỉ hiện vài dòng log rời rạc;
- M19 không có thông báo đa dạng;
- M46 không có số liệu thú vị để trình bày.

Do đó, seed data ở sprint này là **bắt buộc**, không thể xem là việc phụ.  
Ít nhất phải có:

- vài tour có `tour_locations` theo nhiều điểm;
- log từ nhiều luồng: auth, tour request, companion, favorite/review, report;
- notification từ nhiều loại `notification_type`;
- dữ liệu đủ đa dạng để dashboard có số liệu khác nhau theo nhóm và thời gian.

---

## 3. Các vấn đề cần xác định trong sprint này

### 3.1. Phạm vi của M07 sẽ hiển thị tới mức nào

Cần chốt rõ M07 sẽ có:

- chỉ marker + danh sách điểm;
- hay marker + polyline đơn giản;
- có timeline bên cạnh hay không;
- có mở từ M06 theo tab, modal hay route riêng;
- có hiển thị `visit_time` nếu null hay không.

Trong phạm vi đồ án, phương án hợp lý nhất là:
- route riêng hoặc section riêng từ M06;
- bản đồ + danh sách điểm theo `sequence_no`;
- ưu tiên hiển thị các trường `location_name`, `address`, `visit_time`, `notes`;
- polyline chỉ làm nếu thư viện hỗ trợ thuận tiện.

### 3.2. Activity log sẽ ghi những sự kiện nào

Cần chốt danh mục sự kiện tối thiểu để M17 có giá trị:
- đăng ký tài khoản;
- đăng nhập;
- cập nhật hồ sơ cá nhân;
- gửi yêu cầu tham gia tour;
- hủy yêu cầu tour;
- tạo/cập nhật bài đồng hành;
- gửi request tham gia bài đồng hành;
- tạo review;
- thêm/bỏ favorite;
- gửi report;
- guide gửi verification request.

Không nên cố log toàn bộ mọi thao tác nhỏ vì sẽ làm hệ thống nặng và khó quản lý.

### 3.3. Notification sẽ được sinh từ những sự kiện nào

Cần xác định các nguồn sinh thông báo:
- trạng thái tour request thay đổi;
- trạng thái companion request thay đổi;
- report được tiếp nhận/xử lý;
- verification request thay đổi trạng thái;
- payment thay đổi trạng thái;
- thông báo hệ thống cơ bản.

Điều này phải bám vào miền giá trị `notification_type` trong schema final:
`system`, `tour_request`, `companion_request`, `message`, `report`, `verification`, `payment`.【turn37:18†KE_HOACH.docx†L1-L28】

### 3.4. Mức độ hiển thị thông báo liên quan tới nhiều role

M19 cho phép:
- user;
- guide;
- admin theo quyền
truy cập. Nhưng không có nghĩa là tất cả role nhìn cùng một nội dung. Cần chốt:
- user nhìn thông báo liên quan tới tài khoản của mình;
- guide nhìn thông báo liên quan tới hoạt động guide/tour của mình;
- admin chỉ nhìn thông báo hệ thống hoặc thông báo phục vụ vai trò admin nếu có.

Tóm lại, danh sách notification là **theo user hiện tại**, không phải inbox chung toàn hệ thống.

### 3.5. Phạm vi thống kê của M46

Cần chốt rõ M46 sẽ thống kê cái gì trong Sprint 11.  
Dựa trên mô tả màn hình và kế hoạch sprint, nên tập trung vào:

- tổng số user;
- số guide;
- số tour;
- số bài đồng hành;
- số report;
- số verification pending;
- số payment theo trạng thái cơ bản;
- một vài nhóm số liệu theo khoảng thời gian.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】【turn37:18†KE_HOACH.docx†L1-L28】

Không nên mở quá nhiều KPI vì vừa khó tính đúng, vừa khó kiểm chứng khi demo.

### 3.6. Có làm API thống kê tách nhỏ hay gom một endpoint

Tài liệu kế hoạch đã gợi ý tách theo:
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

Cần chốt:
- có giữ đúng tách nhỏ như vậy hay gom thành một endpoint lớn;
- frontend sẽ gọi song song hay gọi lazy theo từng widget;
- response của từng endpoint sẽ trả raw data hay data đã định dạng cho chart.

Trong đồ án, tách nhỏ là hợp lý hơn vì:
- dễ test;
- dễ cô lập lỗi;
- dễ mở rộng;
- khớp với tài liệu đã chốt.

### 3.7. Có cần thay đổi schema không

Sprint 11 chủ yếu dùng lại schema đã có:
- `tour_locations`
- `user_activity_logs`
- `notifications`
- `reports`
- `tours`
- `companion_posts`
- `payment_transactions`【turn37:18†KE_HOACH.docx†L1-L28】

Vì vậy nguyên tắc là:
- **không thay đổi schema lớn**;
- chỉ thêm index, helper, trigger hoặc view nếu thực sự cần;
- nếu có bổ sung, phải bảo đảm không phá vỡ sprint trước.

### 3.8. UML nào cần cập nhật ngay trong sprint này

Tài liệu kế hoạch chốt khá rõ: cần hoàn thiện Activity Diagram cho:
- xem bản đồ tour;
- lịch sử hoạt động;
- thông báo;
- thống kê. 【turn37:18†KE_HOACH.docx†L1-L28】

Ngoài ra, nếu có thời gian thì nên bổ sung:
- sequence diagram cho sinh notification;
- sequence diagram cho lấy dashboard statistics;
- mô tả mapping sự kiện → log → notification.

---

## 4. Hạng mục cần chốt

### 4.1. Hạng mục bản đồ tour
- Cấu trúc dữ liệu map trả về từ `tour_locations`
- Cách sắp xếp theo `sequence_no`
- Cách mở M07 từ M06
- Cách hiển thị marker, danh sách điểm, thời gian ghé thăm, ghi chú
- Rule hiển thị khi thiếu tọa độ

### 4.2. Hạng mục lịch sử hoạt động
- Danh sách `activity_type` chuẩn
- Sự kiện nào bắt buộc ghi log
- Cấu trúc `metadata`
- Quy tắc phân trang/lọc
- Giao diện timeline hay list

### 4.3. Hạng mục thông báo
- Nguồn sinh notification
- Cấu trúc `payload`
- Cách dẫn link tới đối tượng liên quan
- Rule `is_read` / `read_at`
- Có badge unread count hay không

### 4.4. Hạng mục thống kê
- Bộ KPI của M46
- Phạm vi lọc theo thời gian
- Cách tách endpoint statistics
- Quy tắc phân quyền xem thống kê
- Dạng hiển thị: card, table, chart cơ bản

### 4.5. Hạng mục kỹ thuật backend
- Chia module/service cho map, logs, notifications, statistics
- Chuẩn response
- Ownership / role guard
- Tối ưu query tổng hợp
- Logging lỗi cho statistics

### 4.6. Hạng mục dữ liệu
- Index cho `user_activity_logs`, `notifications`
- Seed `tour_locations`
- Seed log và notification mẫu
- Seed số liệu đủ để dashboard có ý nghĩa
- Có/không dùng trigger sinh log

### 4.7. Hạng mục tài liệu/UML
- Activity Diagram cho 4 luồng
- Cập nhật mô tả màn hình M07, M17, M19, M46 nếu cần
- Cập nhật mapping chức năng – API – bảng
- Rà soát tài liệu báo cáo để đồng bộ với code

---

## 5. Phương án được chọn

## 5.1. Phạm vi bản đồ được chọn

Chọn phương án triển khai **bản đồ lộ trình tour ở mức cơ bản nhưng trực quan**, gồm:

- lấy dữ liệu từ `GET /tours/:id/locations`;
- sắp xếp theo `sequence_no`;
- hiển thị marker theo từng điểm;
- hiển thị danh sách điểm ở panel phụ hoặc phía dưới;
- hiển thị `location_name`, `address`, `visit_time`, `notes` nếu có;
- nếu không có tọa độ thì vẫn hiển thị dưới dạng danh sách tuyến điểm.

Phương án này bám đúng vai trò của M07 là hỗ trợ người dùng hình dung hành trình tour, không biến sprint thành dự án bản đồ riêng.【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

## 5.2. Quy tắc activity log được chọn

Chọn phương án:
- chỉ log **các sự kiện nghiệp vụ có ý nghĩa**;
- không log mọi thao tác UI nhỏ;
- dùng format thống nhất cho `activity_type`;
- luôn cố gắng có `entity_type`, `entity_id`, `metadata` nếu sự kiện gắn với đối tượng cụ thể.

Danh mục `activity_type` gợi ý dùng chung:
- `auth.registered`
- `auth.logged_in`
- `profile.updated`
- `tour_request.created`
- `tour_request.cancelled`
- `companion_post.created`
- `companion_post.updated`
- `companion_request.created`
- `favorite.tour_added`
- `favorite.guide_added`
- `review.tour_created`
- `review.guide_created`
- `report.created`
- `guide_verification.submitted`

Phương án này giúp M17 vừa có dữ liệu phong phú, vừa dễ render theo template.

## 5.3. Quy tắc notification được chọn

Chọn phương án:
- notification được sinh ở backend khi các sự kiện chính phát sinh;
- lưu vào bảng `notifications`;
- frontend chỉ đọc và đánh dấu đã đọc;
- không làm realtime push trong Sprint 11.

Các `notification_type` bám theo schema:
- `system`
- `tour_request`
- `companion_request`
- `message`
- `report`
- `verification`
- `payment`【turn37:18†KE_HOACH.docx†L1-L28】

Các nguồn sinh thông báo chính trong sprint:
- guide duyệt/từ chối tour request;
- chủ bài duyệt/từ chối companion request;
- report được xử lý;
- verification được cập nhật;
- payment thay đổi trạng thái;
- thông báo hệ thống cơ bản do admin hoặc hệ thống sinh.

## 5.4. Mức độ realtime được chọn

Không làm websocket hay realtime subscription đầy đủ trong Sprint 11.

Chọn phương án:
- fetch notification khi vào M19;
- refetch khi người dùng thao tác trên trang;
- nếu có badge header thì dùng polling nhẹ hoặc reload khi điều hướng.

Cách này phù hợp với đồ án, giảm rủi ro kỹ thuật, nhưng vẫn đủ giá trị trình diễn.

## 5.5. Bộ KPI của M46 được chọn

Chọn bộ KPI cơ bản sau cho dashboard:

- Tổng số người dùng
- Tổng số hướng dẫn viên
- Tổng số tour
- Tổng số bài đồng hành
- Tổng số report
- Số verification pending
- Tổng số payment transaction
- Tổng giá trị thanh toán paid ở mức cơ bản
- Một vài breakdown theo trạng thái của report, tour, payment

Đây là tập KPI vừa đủ để M46 nhìn “đúng dashboard”, đồng thời vẫn tính toán được từ dữ liệu hiện có. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L7】【turn37:10†mapping_for_dev_backend:frontend.docx†L1-L23】

## 5.6. Cấu trúc API statistics được chọn

Giữ đúng hướng đã chốt trong kế hoạch:
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

Lý do:
- dễ test độc lập từng nhóm;
- frontend tải theo nhu cầu;
- dễ quản lý code backend;
- bám sát tài liệu đã có.

## 5.7. Phân quyền được chọn

- `GET /tours/:id/locations`: public hoặc theo rule công khai của tour.
- `GET /me/activity-logs`: chỉ user hiện tại xem log của chính mình.
- `GET /me/notifications`, `PATCH /me/notifications/...`: chỉ user hiện tại thao tác notification của chính mình.
- `GET /admin/statistics/*`: chỉ admin được phân quyền thống kê.

Phương án này nhất quán với mô hình phân quyền chung và mô tả màn hình. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L15】

## 5.8. Hướng xử lý dữ liệu demo được chọn

Chọn phương án seed theo 4 cụm:
1. tour + locations;
2. activity logs;
3. notifications;
4. statistics source data.

Dữ liệu phải đủ để demo:
- ít nhất 2–3 tour có nhiều điểm;
- 1 user và 1 guide có activity log đa dạng;
- 1 admin có dashboard có số liệu;
- notification thuộc nhiều loại.

## 5.9. Chia module backend

Giữ cách chia module đã khuyến nghị trong mapping:
- `reports-notifications`
- `tours`
- `auth-me`
- `admin`【turn37:7†mapping_for_dev_backend:frontend.docx†L24-L42】

Trong Sprint 11 có thể tổ chức thực tế như sau:
- `tours`: xử lý locations/map
- `auth-me`: activity logs của user
- `reports-notifications`: notifications
- `admin`: statistics

---

## 6. Ghi chú triển khai

### 6.1. Thứ tự triển khai nên làm
Nên làm theo thứ tự:
1. seed `tour_locations`
2. hoàn thiện M07 + API map
3. chốt convention `user_activity_logs`
4. sinh và đọc activity log
5. hoàn thiện notifications
6. hoàn thiện statistics dashboard
7. cập nhật UML/tài liệu

Lý do là M07 tương đối độc lập, dễ hoàn thành trước để tạo đà; còn logs/notifications/statistics phụ thuộc nhiều hơn vào dữ liệu hệ thống.

### 6.2. Không biến M17 thành “nhật ký hệ thống”
M17 chỉ là **lịch sử hoạt động cá nhân**, không phải audit log toàn hệ thống.  
Phải tách rõ với:
- `admin_activity_logs` ở Admin Area;
- log kỹ thuật của server;
- lịch sử moderation nội bộ.

### 6.3. Notification phải bám ngữ cảnh nghiệp vụ
Mỗi thông báo nên có:
- `title`
- `content`
- `entity_type`
- `entity_id`
- `payload`

Như vậy frontend mới dẫn hướng người dùng tới đúng màn hình liên quan.

### 6.4. Dashboard phải xử lý trường hợp “không có dữ liệu”
M46 cần có:
- empty state;
- giá trị 0 hợp lệ;
- loading state;
- lỗi truy vấn rõ ràng.

Đây là màn hình rất dễ gặp lỗi vì dữ liệu tổng hợp thường không đồng đều.

### 6.5. Quy tắc “xong sprint”
Sprint 11 chỉ được xem là hoàn thành khi:
- M07 hiển thị được lộ trình tour từ dữ liệu thật;
- M17 đọc được activity log có phân trang/lọc cơ bản;
- M19 đọc được notifications và đánh dấu đã đọc;
- M46 có dashboard số liệu và ít nhất một vài chart/card hiển thị đúng;
- có seed data phù hợp;
- có Activity Diagram cập nhật theo sprint. 【turn37:18†KE_HOACH.docx†L1-L28】

### 6.6. Dữ liệu demo nên chuẩn bị
- 3 tour public có từ 3–5 location
- 1 tour draft để kiểm tra rule map public/private
- 1 user có log về favorite, review, request
- 1 guide có log về verification, tour management
- 8–15 notification chia nhiều loại
- dữ liệu đủ để dashboard có card và biểu đồ thay đổi theo thời gian

---

## 7. Chức năng trọng tâm

### F04. Quản lý lịch sử hoạt động cá nhân
Chức năng này cho phép người dùng xem lại các hành động đã thực hiện như yêu cầu tham gia tour, bài đồng hành đã đăng, tour yêu thích hoặc thao tác gần đây. Đây là lớp chức năng giúp sản phẩm có chiều sâu về trải nghiệm sau khi các luồng lõi đã hoàn thiện. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

### F07. Nhận thông báo
Chức năng này cung cấp trung tâm thông báo cho các sự kiện quan trọng như thay đổi trạng thái yêu cầu tham gia, trạng thái report, cập nhật verification hoặc thông báo hệ thống. Đây là lớp liên kết mềm giữa các phân hệ. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L15】

### F15. Xem lộ trình tour trên bản đồ
Chức năng này giúp người truy cập hình dung trực quan hành trình tour. Đây là phần tăng giá trị minh họa của màn hình chi tiết tour và hỗ trợ quyết định tham gia. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

### F28. Thống kê và báo cáo hệ thống
Chức năng này giúp admin theo dõi các chỉ số vận hành cơ bản và hỗ trợ trình bày năng lực quản trị của hệ thống. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

### Kết luận cho nhóm chức năng
Bốn chức năng này không phải lõi bắt buộc ở giai đoạn đầu, nhưng lại là nhóm hoàn thiện rất có giá trị để hệ thống đạt độ thuyết phục cao khi trình bày đồ án.【turn37:13†BAO_CAO_TONG.docx†L1-L10】

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình

Phần màn hình trong Sprint 11 phải làm được hai việc cùng lúc:

- giúp người dùng/admin **thấy rõ giá trị** của các chức năng hỗ trợ;
- giữ giao diện **gọn, dễ demo, ít rủi ro kỹ thuật**.

Vì vậy, ưu tiên là:
- thông tin rõ ràng;
- trạng thái loading/empty/error đầy đủ;
- liên kết điều hướng hợp lý;
- không lạm dụng hiệu ứng hay biểu đồ phức tạp.

## 8.2. M07 – Bản đồ lộ trình tour

**Chức năng của màn hình**  
Giúp người dùng hình dung trực quan lộ trình của tour thông qua bản đồ. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

**Nội dung hiển thị chính**
- bản đồ;
- các marker địa điểm;
- thứ tự di chuyển;
- thời gian ghé thăm;
- tóm tắt lộ trình;
- ghi chú cho từng điểm. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L1-L8】

**Phạm vi triển khai trong Sprint 11**
- lấy location theo `tour_id`;
- render danh sách điểm theo `sequence_no`;
- nếu đủ tọa độ thì hiển thị marker;
- có panel chi tiết từng điểm;
- có nút quay lại M06.

**Không làm trong sprint này**
- chỉ đường theo giao thông;
- tối ưu tuyến;
- bản đồ nhiều tour cùng lúc;
- geocoding nâng cao.

## 8.3. M17 – Lịch sử hoạt động cá nhân

**Chức năng của màn hình**  
Cho phép người dùng xem lại các hành động đã thực hiện như yêu cầu tham gia tour, bài đồng hành đã đăng, tour yêu thích hoặc thao tác gần đây. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

**Nội dung hiển thị chính**
- danh sách hoạt động theo thời gian;
- loại hoạt động;
- bộ lọc;
- trạng thái từng mục;
- liên kết đến đối tượng liên quan. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L8-L13】

**Phạm vi triển khai trong Sprint 11**
- list hoặc timeline đơn giản;
- filter theo loại hoạt động;
- phân trang;
- liên kết mở tour/post/report liên quan nếu có.

## 8.4. M19 – Trung tâm thông báo

**Chức năng của màn hình**  
Hiển thị các thông báo liên quan đến yêu cầu tham gia, tin nhắn mới, trạng thái xử lý báo cáo hoặc cập nhật hệ thống. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L21】

**Nội dung hiển thị chính**
- danh sách thông báo;
- trạng thái đã đọc/chưa đọc;
- thời gian phát sinh;
- liên kết tới đối tượng liên quan;
- nút đánh dấu đã đọc. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L14-L21】

**Phạm vi triển khai trong Sprint 11**
- xem danh sách notification;
- read one;
- read all;
- nhấn vào item để mở đối tượng liên quan nếu xác định được.

## 8.5. M46 – Thống kê và báo cáo hệ thống

**Chức năng của màn hình**  
Cho phép theo dõi các chỉ số vận hành cơ bản và hỗ trợ việc ra quyết định quản trị. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

**Nội dung hiển thị chính**
- biểu đồ hoặc bảng số liệu về người dùng;
- tour;
- bài đồng hành;
- báo cáo vi phạm;
- hồ sơ chờ duyệt;
- thanh toán cơ bản theo khoảng thời gian. 【turn37:14†BAO_CAO_4_MAN_HINH.docx†L22-L27】

**Phạm vi triển khai trong Sprint 11**
- thẻ số liệu tổng quan;
- 2–4 biểu đồ đơn giản;
- bộ lọc thời gian cơ bản;
- bảng tóm tắt theo nhóm.

## 8.6. Kết quả mong đợi của phần màn hình

Kết thúc Sprint 11, phần giao diện phải đạt:
- M07 trực quan, dùng được với dữ liệu thật;
- M17 rõ ràng, không rối;
- M19 đủ giống một inbox hệ thống;
- M46 có giá trị trình bày quản trị, không chỉ là vài con số rời rạc.

---

## 9. Bảng CSDL chính

## 9.1. `tour_locations`

Đây là bảng trung tâm của M07.  
Theo schema final, bảng này lưu:
- `tour_id`
- `sequence_no`
- `location_name`
- `address`
- `latitude`
- `longitude`
- `visit_time`
- `notes`
- `created_at`
và có ràng buộc `unique (tour_id, sequence_no)`.【turn37:18†KE_HOACH.docx†L1-L28】

**Vai trò trong Sprint 11**
- làm nguồn dữ liệu hiển thị lộ trình;
- xác định thứ tự điểm dừng;
- cung cấp tọa độ để render map;
- cung cấp ghi chú và thời gian để làm panel chi tiết.

## 9.2. `user_activity_logs`

Theo schema final, bảng này tối giản nhưng đủ mạnh:
- `user_id`
- `activity_type`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`【turn37:16†BAO_CAO_2_CSDL.docx†L16-L24】

**Vai trò trong Sprint 11**
- nguồn dữ liệu của M17;
- hỗ trợ truy vết hoạt động cá nhân;
- là cầu nối mềm giữa nhiều phân hệ đã xây từ Sprint 01–10.

## 9.3. `notifications`

Theo schema final, bảng này gồm:
- `user_id`
- `notification_type`
- `title`
- `content`
- `entity_type`
- `entity_id`
- `payload`
- `is_read`
- `created_at`
- `read_at`【turn37:18†KE_HOACH.docx†L1-L28】

`notification_type` được giới hạn trong các giá trị:
- `system`
- `tour_request`
- `companion_request`
- `message`
- `report`
- `verification`
- `payment`

**Vai trò trong Sprint 11**
- nguồn dữ liệu của M19;
- hỗ trợ badge unread;
- dẫn hướng người dùng quay lại đối tượng liên quan.

## 9.4. `reports`

Bảng `reports` không phải trung tâm UI của sprint này, nhưng là nguồn dữ liệu quan trọng cho statistics:
- tổng số report;
- breakdown theo trạng thái;
- xu hướng report theo thời gian.

Ngoài ra, khi report thay đổi trạng thái, nó cũng có thể là nguồn sinh notification.

## 9.5. `tours`

Bảng `tours` được dùng làm nguồn dữ liệu:
- cho M07 thông qua liên kết với `tour_locations`;
- cho dashboard thống kê số lượng tour;
- cho các breakdown theo trạng thái tour.

## 9.6. `companion_posts`

Bảng này hỗ trợ M46 cho nhóm thống kê:
- số bài đồng hành;
- trạng thái bài;
- số bài mở / đóng / hủy nếu triển khai thống kê trạng thái.

## 9.7. `payment_transactions`

Theo schema final, bảng này lưu:
- `tour_request_id`
- `user_id`
- `amount`
- `currency_code`
- `payment_method`
- `status`
- `transaction_code`
- `provider_transaction_code`
- `gateway_response`
- `created_at`
- `paid_at`
- `expires_at`【turn37:18†KE_HOACH.docx†L1-L28】

**Vai trò trong Sprint 11**
- cung cấp số liệu thanh toán cơ bản cho M46;
- có thể là nguồn sinh notification loại `payment`.

## 9.8. Bảng phụ thuộc cần dùng kèm

Ngoài 7 bảng chính, Sprint 11 còn có thể cần join hoặc phụ thuộc vào:
- `users`
- `guide_profiles`
- `tour_requests`
- `companion_requests`
- `guide_verification_requests`
- `report_processing_history`

Mục đích là:
- render tên đối tượng liên quan trong activity log/notification;
- tính statistics theo ngữ cảnh nghiệp vụ.

## 9.9. Ghi chú quan trọng về schema

Sprint 11 **không nên thay đổi mô hình dữ liệu lõi**.  
Chỉ nên:
- thêm index;
- thêm helper function;
- thêm trigger sinh log/notification nếu thật sự cần;
- thêm view/materialized query nhẹ nếu cần dashboard nhanh hơn.

---

## 10. API cần thiết

## 10.1. `GET /tours/:id/locations`

API lấy danh sách location của một tour để phục vụ M07.  
Yêu cầu:
- kiểm tra quyền xem tour theo trạng thái public/private;
- sort theo `sequence_no`;
- trả đủ dữ liệu hiển thị map và panel chi tiết.

## 10.2. `GET /me/activity-logs`

API lấy lịch sử hoạt động cá nhân của user hiện tại để phục vụ M17.  
Nên hỗ trợ:
- pagination;
- filter theo `activity_type`;
- sort theo `created_at desc`.

## 10.3. `GET /me/notifications`

API lấy danh sách thông báo của user hiện tại để phục vụ M19.  
Nên hỗ trợ:
- phân trang;
- filter `is_read`;
- sort `created_at desc`.

## 10.4. `PATCH /me/notifications/:id/read`

API đánh dấu một thông báo là đã đọc.  
Yêu cầu:
- chỉ cho phép user cập nhật notification của chính mình;
- set `is_read = true`;
- cập nhật `read_at`.

## 10.5. `PATCH /me/notifications/read-all`

API đánh dấu tất cả thông báo của user hiện tại là đã đọc.  
Đây là API nhỏ nhưng rất quan trọng cho trải nghiệm M19.

## 10.6. `GET /admin/statistics/overview`

API lấy tổng quan dashboard:
- total users
- total guides
- total tours
- total companion posts
- total reports
- total payments
- pending verification

## 10.7. `GET /admin/statistics/reports`

API thống kê report:
- số lượng theo trạng thái;
- số lượng theo thời gian;
- có thể thêm breakdown theo loại đối tượng bị report.

## 10.8. `GET /admin/statistics/tours`

API thống kê tour:
- tổng số tour;
- tour theo trạng thái;
- có thể thêm phân nhóm theo category/province nếu dễ làm.

## 10.9. `GET /admin/statistics/users`

API thống kê user:
- tổng số user;
- tổng số guide;
- user tăng theo thời gian;
- có thể thêm active/inactive nếu dữ liệu phù hợp.

## 10.10. Yêu cầu kỹ thuật chung cho API

- Response phải nhất quán với các sprint trước.
- Pagination nên dùng cùng format toàn hệ thống.
- Query statistics phải có timeout hợp lý và tránh N+1 query.
- API dashboard chỉ mở cho admin có quyền phù hợp.
- API `me/*` luôn bám actor hiện tại, không nhận `userId` từ client.

---

## 11. Công việc frontend

## 11.1. Xây dựng M07

- Chọn thư viện bản đồ phù hợp, dễ tích hợp.
- Render map container rõ ràng, không quá nặng.
- Tạo panel danh sách điểm.
- Hiển thị marker theo `sequence_no`.
- Xử lý fallback khi thiếu tọa độ.

## 11.2. Tích hợp M07 từ M06

- thêm nút/tab “Xem lộ trình tour” ở M06;
- điều hướng sang M07 hoặc mở section riêng;
- giữ ngữ cảnh quay lại chi tiết tour.

## 11.3. Xây dựng M17

- giao diện list hoặc timeline;
- filter activity type;
- trạng thái loading/empty/error;
- link tới đối tượng liên quan.

## 11.4. Xây dựng M19

- danh sách notification;
- style phân biệt read/unread;
- nút “Đánh dấu đã đọc”;
- nút “Đánh dấu tất cả đã đọc”;
- điều hướng theo entity liên quan.

## 11.5. Badge thông báo ở layout chung

Nếu còn thời gian, nên thêm badge unread count ở header hoặc user menu.  
Đây là chi tiết nhỏ nhưng tăng cảm giác “thật sản phẩm” khá rõ.

## 11.6. Xây dựng M46

- thẻ số liệu tổng quan;
- bảng hoặc chart đơn giản;
- bộ lọc theo khoảng thời gian;
- loading skeleton;
- empty state cho dashboard.

## 11.7. Chuẩn hóa chart component

Chart ở Sprint 11 chỉ nên dùng:
- bar chart;
- line chart;
- pie/donut nếu cần thật sự.

Không nên đưa quá nhiều loại chart gây rối giao diện.

## 11.8. Trạng thái hiển thị cần chuẩn hóa

Cần chuẩn hóa:
- loading state cho map, logs, notifications, dashboard;
- empty state;
- error state;
- pagination state;
- filter state.

## 11.9. Kết quả mong đợi phía frontend

Kết thúc Sprint 11, frontend phải:
- có 4 màn hình chạy được với dữ liệu thật;
- điều hướng rõ ràng;
- UI đồng đều với các sprint trước;
- đủ đẹp và đủ rõ để đưa vào demo/báo cáo.

---

## 12. Công việc backend

## 12.1. Tổ chức module

Nên chia trách nhiệm rõ:
- `tours` xử lý map/locations;
- `auth-me` hoặc `profile` xử lý activity logs;
- `reports-notifications` xử lý notifications;
- `admin` xử lý statistics. 【turn37:7†mapping_for_dev_backend:frontend.docx†L24-L42】

## 12.2. Xử lý logic lấy dữ liệu map

- validate `tourId`;
- kiểm tra quyền truy cập tour;
- lấy `tour_locations` theo thứ tự;
- trả response gọn, đúng cho map UI.

## 12.3. Xử lý logic activity logs

- cung cấp endpoint đọc log cá nhân;
- chuẩn hóa cách ghi log ở các service nghiệp vụ;
- tạo helper chung để tránh module nào cũng tự ghi kiểu riêng.

## 12.4. Xử lý logic notifications

- tạo helper/service sinh notification;
- chuẩn hóa payload;
- triển khai read one / read all;
- bảo đảm ownership tuyệt đối.

## 12.5. Xử lý logic statistics

- viết query tổng hợp cho overview;
- viết query breakdown cho reports/tours/users;
- tối ưu query bằng index và aggregate hợp lý;
- tách service để code dễ bảo trì.

## 12.6. Phân quyền và ownership

- `me/activity-logs` và `me/notifications` chỉ thao tác dữ liệu cá nhân;
- statistics chỉ dành cho admin được phân quyền;
- map public phải bám rule hiển thị tour hiện có.

## 12.7. Logging và audit ở mức cần thiết

Sprint 11 nên log:
- lỗi query dashboard;
- lỗi lấy dữ liệu map;
- lỗi read/update notification;
- lỗi helper sinh notification nếu có.

Không cần tạo hệ thống observability quá nặng.

## 12.8. Kết quả mong đợi phía backend

Backend phải đạt:
- API map ổn định;
- API logs và notifications nhất quán;
- statistics query trả số liệu đúng;
- code đủ gọn để nối tiếp Sprint 12 mà không phải refactor lớn.

---

## 13. Công việc database

## 13.1. Giữ nguyên schema 38 bảng làm chuẩn

Sprint 11 không nên thay đổi bản chất schema, chỉ khai thác đúng các bảng đã có trong schema final. Đây là nguyên tắc giúp bộ tài liệu và code đồng bộ. 【turn37:18†KE_HOACH.docx†L1-L28】

## 13.2. Bổ sung index cần thiết

Ưu tiên thêm hoặc rà soát index cho:
- `user_activity_logs(user_id, created_at)`
- `notifications(user_id, is_read, created_at)`
- `tour_locations(tour_id, sequence_no)`
- các cột dùng để aggregate ở statistics nếu thiếu

Điều này cũng phù hợp với lưu ý trong kế hoạch về việc tối ưu logs và notifications. 【turn37:18†KE_HOACH.docx†L1-L28】

## 13.3. Helper hoặc trigger ghi log

Nên chọn một trong hai hướng:
- ghi log ở service backend;
- hoặc dùng helper DB / RPC hỗ trợ.

Trong phạm vi đồ án, ghi ở backend service thường dễ kiểm soát hơn; trigger chỉ nên dùng nếu rule rất rõ và ít thay đổi.

## 13.4. Helper sinh notification

Tương tự activity log, notification có thể được sinh:
- trực tiếp ở service backend;
- hoặc qua helper DB.

Phương án khuyến nghị: sinh ở backend để dễ đọc luồng nghiệp vụ và dễ demo.

## 13.5. Seed dữ liệu map

- tạo `tour_locations` cho vài tour thật;
- sequence phải hợp lý;
- có đủ cả dữ liệu có tọa độ và dữ liệu thiếu tọa độ để test fallback.

## 13.6. Seed activity log và notification

- seed log theo nhiều `activity_type`;
- seed notification theo nhiều `notification_type`;
- tạo cả bản ghi read và unread;
- metadata/payload phải đủ để frontend render.

## 13.7. Seed dữ liệu cho statistics

Chuẩn bị dữ liệu:
- user ở nhiều trạng thái;
- report ở nhiều trạng thái;
- payment ở nhiều trạng thái;
- tour/companion post có phân nhóm đủ khác nhau.

## 13.8. Kết quả mong đợi phía database

Database phải đạt:
- query map, log, notification chạy nhanh ổn;
- statistics có dữ liệu đủ để demo;
- không phát sinh thay đổi schema lớn làm lệch sprint trước.

---

## 14. Tài liệu/UML

## 14.1. Tài liệu cần hoàn thiện

- cập nhật mô tả Sprint 11 trong kế hoạch;
- cập nhật mô tả chức năng F04, F07, F15, F28 nếu cần chi tiết hơn;
- cập nhật mô tả M07, M17, M19, M46;
- cập nhật mapping API – màn hình – bảng.

## 14.2. UML cần chốt trong Sprint 11

Theo kế hoạch, cần hoàn thiện Activity Diagram cho:
- xem bản đồ tour;
- xem lịch sử hoạt động;
- xem thông báo;
- xem thống kê hệ thống. 【turn37:18†KE_HOACH.docx†L1-L28】

## 14.3. Sequence Diagram nên bổ sung nếu còn thời gian

Nếu còn thời gian, nên thêm:
- Sequence Diagram sinh notification khi trạng thái request thay đổi;
- Sequence Diagram lấy dashboard statistics;
- Sequence Diagram mở M17 và truy vấn log.

## 14.4. Mapping cần rà soát

Cần rà soát để bảo đảm:
- F04 ↔ M17 ↔ `user_activity_logs` ↔ `GET /me/activity-logs`
- F07 ↔ M19 ↔ `notifications` ↔ `GET/PATCH /me/notifications*`
- F15 ↔ M07 ↔ `tour_locations` ↔ `GET /tours/:id/locations`
- F28 ↔ M46 ↔ statistics queries ↔ `GET /admin/statistics/*`

## 14.5. Mục tiêu của phần tài liệu/UML

Kết thúc Sprint 11, phần tài liệu phải đủ để:
- đưa thẳng vào báo cáo;
- giải thích logic khi bảo vệ;
- nối tiếp mượt sang Sprint 12 mà không phải quay lại vá tài liệu.

---

## 15. Đầu ra

## 15.1. Đầu ra chức năng

- Xem bản đồ lộ trình tour
- Xem lịch sử hoạt động cá nhân
- Xem và đọc thông báo
- Xem dashboard thống kê cơ bản

## 15.2. Đầu ra giao diện

- M07 chạy được với dữ liệu tour thật
- M17 hiển thị log rõ ràng
- M19 hiển thị notification và read/unread
- M46 có card + chart/table cơ bản

## 15.3. Đầu ra API

- `GET /tours/:id/locations`
- `GET /me/activity-logs`
- `GET /me/notifications`
- `PATCH /me/notifications/:id/read`
- `PATCH /me/notifications/read-all`
- `GET /admin/statistics/overview`
- `GET /admin/statistics/reports`
- `GET /admin/statistics/tours`
- `GET /admin/statistics/users`【turn37:18†KE_HOACH.docx†L1-L28】

## 15.4. Đầu ra dữ liệu

- seed `tour_locations`
- seed `user_activity_logs`
- seed `notifications`
- seed dữ liệu statistics

## 15.5. Đầu ra tài liệu

- Activity Diagram cho 4 luồng Sprint 11
- cập nhật mô tả màn hình
- cập nhật mapping chức năng – API – bảng

## 15.6. Tiêu chí sẵn sàng sang Sprint 12

Hệ thống được xem là sẵn sàng sang Sprint 12 khi:
- nhóm ưu tiên 2 gần như đã khép kín;
- DB/API/UI/UML của Sprint 11 đồng bộ;
- dữ liệu demo đủ “dày” cho bảo vệ;
- không còn lỗi lớn ở map/log/notification/statistics.

---

## 16. Kết luận sprint

Sprint 11 là sprint hoàn thiện mạnh về **trải nghiệm và khả năng trình bày**, nhưng vẫn phải giữ đúng tinh thần của đồ án sinh viên:

- đủ thực tế;
- đủ đồng bộ;
- đủ đẹp để demo;
- không quá nặng về kỹ thuật.

Nếu Sprint 11 được triển khai đúng phạm vi đã chốt, hệ thống sẽ đạt trạng thái gần như hoàn thiện toàn bộ nhóm **ưu tiên 2**, đúng với kế hoạch 14 sprint: sản phẩm không chỉ có các luồng lõi chạy được, mà còn có bản đồ, lịch sử, thông báo và thống kê để trở thành một hệ thống thuyết phục hơn cả về nghiệp vụ lẫn giao diện.【turn37:18†KE_HOACH.docx†L1-L28】【turn37:17†Ke_hoach_14_sprint_DOCX_ready.docx†L1-L19】
