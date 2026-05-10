# SPRINT 14 – Đóng gói bản cuối, kiểm thử tổng thể và chuẩn bị bảo vệ

## 1. Mục tiêu sprint

Sprint 14 là sprint cuối cùng của toàn bộ roadmap 14 sprint. Đây không còn là sprint để mở rộng nghiệp vụ, mà là giai đoạn **đóng gói sản phẩm cuối**, **kiểm thử tổng thể**, **sửa lỗi**, **chuẩn hóa dữ liệu demo** và **hoàn thiện toàn bộ tài liệu phục vụ bảo vệ đồ án**.

Sau khi:

- Sprint 01–08 đã hoàn thành phần nền tảng và các luồng nghiệp vụ lõi;
- Sprint 09 đã ổn định MVP lõi;
- Sprint 10–11 đã làm sản phẩm đầy đặn hơn với favorite, review, verification, bản đồ, activity log, notification và statistics;
- Sprint 12–13 đã bổ sung chat, AI, recommendation, accommodation và payment ở mức phù hợp với phạm vi đồ án;

thì Sprint 14 có nhiệm vụ **chuyển hệ thống từ trạng thái “đã làm xong nhiều phần” sang trạng thái “sẵn sàng để demo và bảo vệ”**.

### Mục tiêu chính

- Không bổ sung chức năng mới, chỉ tập trung **fix bug, test cuối và đóng gói sản phẩm**.
- Rà soát lại toàn bộ **29 chức năng**, **47 màn hình** và **38 bảng dữ liệu** theo đúng phạm vi đã chốt.
- Chuẩn hóa bộ **dữ liệu demo cuối cùng** để mọi luồng trình bày đều chạy ổn định, dễ hiểu và có tính thuyết phục.
- Kiểm thử lại toàn bộ các nhóm API chính:
  - auth;
  - tour;
  - guide;
  - companion;
  - admin;
  - review / favorite / notification;
  - chat;
  - AI / accommodation / payment.
- Chốt **4 luồng demo bắt buộc** dùng trong buổi bảo vệ.
- Hoàn thiện bộ tài liệu trình bày cuối:
  - báo cáo;
  - ERD;
  - Use Case;
  - Activity Diagram;
  - mô tả màn hình;
  - README;
  - slide;
  - script demo;
  - checklist kiểm thử.
- Chuẩn bị **phương án dự phòng** nếu một phần chức năng mở rộng gặp lỗi trong buổi demo.
- Bảo đảm môi trường demo cuối đạt 3 tiêu chí:
  - ổn định;
  - nhất quán;
  - dễ trình bày.

### Ý nghĩa của sprint này

Sprint 14 là sprint có tác động trực tiếp nhất đến **ấn tượng của hội đồng** khi xem sản phẩm. Trong bối cảnh đồ án sinh viên, giảng viên thường đánh giá không chỉ theo số lượng chức năng, mà còn theo:

1. **Mức độ hoàn chỉnh của sản phẩm**
2. **Tính logic của luồng nghiệp vụ**
3. **Sự đồng bộ giữa code, dữ liệu, UML và báo cáo**
4. **Khả năng trình bày mạch lạc và kiểm soát demo**

Vì vậy, Sprint 14 có ý nghĩa rất lớn ở 4 khía cạnh:

1. **Biến sản phẩm thành một phiên bản trình bày được**
   Nhiều dự án “đã code rất nhiều” nhưng không demo tốt vì dữ liệu lộn xộn, màn hình chưa thống nhất, flow dễ lỗi và tài liệu không khớp với sản phẩm. Sprint này xử lý đúng điểm đó.

2. **Giảm rủi ro vào giai đoạn cuối**
   Việc dành riêng một sprint cho đóng gói và bảo vệ giúp giảm áp lực dồn việc, đúng như tinh thần kế hoạch 14 sprint.

3. **Tăng tính thuyết phục**
   Một hệ thống có thể chưa sâu ở nhóm mở rộng, nhưng nếu core flow ổn định, dữ liệu demo rõ ràng, slide tốt và script bảo vệ mạch lạc thì vẫn rất thuyết phục.

4. **Chuyển từ tư duy “làm chức năng” sang “trình bày sản phẩm”**
   Ở sprint cuối, tư duy quan trọng không còn là “thêm cái gì nữa”, mà là:
   - cái gì cần chạy thật;
   - cái gì chỉ cần minh họa;
   - cái gì cần nói rõ phạm vi;
   - cái gì cần chuẩn bị phương án dự phòng.

Nói ngắn gọn, Sprint 14 là sprint **đóng gói giá trị của toàn bộ đồ án**.

---

## 2. Lưu ý trước khi triển khai

## 2.1. Tuyệt đối không mở thêm chức năng mới

Nguyên tắc quan trọng nhất của Sprint 14 là:

- không thêm module mới;
- không mở thêm bảng mới nếu không thật sự bắt buộc;
- không làm lại kiến trúc;
- không kéo thêm yêu cầu ngoài phạm vi đồ án.

Mọi thời gian của sprint này phải dồn cho:

- sửa lỗi;
- làm sạch dữ liệu;
- kiểm thử;
- chụp hình;
- viết tài liệu;
- luyện demo.

## 2.2. Đây là sprint “đóng gói để bảo vệ”, không phải sprint “cố hoàn hảo hóa sản phẩm”

Hệ thống trong đồ án không cần đạt mức production. Mục tiêu đúng là:

- các luồng lõi chạy được;
- dữ liệu demo hợp lý;
- giao diện đủ sạch;
- tài liệu khớp với sản phẩm;
- có thể trình bày mạch lạc.

Không nên cố:

- tối ưu vi mô quá sâu;
- triển khai thêm phần mở rộng chưa ổn;
- refactor lớn ở backend;
- thay UI framework hoặc thay kiến trúc.

## 2.3. Phải phân loại rõ màn hình nào demo thật, màn hình nào chỉ trình bày

Trong 47 màn hình của hệ thống, không nhất thiết tất cả đều phải được demo live. Sprint 14 phải phân loại rõ:

- **màn hình demo thật:** dùng trực tiếp trong buổi bảo vệ;
- **màn hình đã làm cơ bản:** có thể mở minh họa nhanh;
- **màn hình mở rộng / skeleton:** chỉ giới thiệu phạm vi và định hướng.

Nếu không chốt rõ, phần trình bày sẽ dễ lan man và thiếu kiểm soát.

## 2.4. Dữ liệu demo quan trọng gần như ngang với phần code

Một hệ thống có code đúng nhưng dữ liệu demo yếu vẫn rất khó thuyết phục. Sprint này phải chuẩn bị bộ dữ liệu có chủ đích, bao gồm:

- tài khoản user;
- tài khoản guide;
- tài khoản admin;
- tour với nhiều trạng thái;
- companion post với nhiều trạng thái;
- request đang chờ / đã duyệt / đã từ chối;
- review, report, notification, payment;
- dữ liệu AI chat và chat hội thoại mẫu nếu cần minh họa.

## 2.5. Tài liệu phải khớp với sản phẩm thật

Các tài liệu sau bắt buộc phải được rà soát để tránh lệch với hệ thống đang demo:

- Use Case;
- ERD;
- Activity Diagram;
- Sequence Diagram bổ sung;
- mô tả màn hình;
- bảng chức năng;
- bảng role – quyền thao tác dữ liệu;
- mô tả API / module;
- báo cáo tổng;
- README chạy demo.

## 2.6. Phải có flow dự phòng nếu demo lỗi

Sprint 14 phải chuẩn bị sẵn:

- phương án demo bằng dữ liệu có sẵn;
- tài khoản back-up;
- ảnh chụp hoặc video ngắn cho một số màn hình dễ lỗi;
- phương án chuyển từ live demo sang mô tả luồng + ảnh màn hình nếu cần.

## 2.7. Ưu tiên sự ổn định và tính thuyết phục hơn sự cầu kỳ

Trong sprint này, mọi quyết định nên ưu tiên:

- ít rủi ro hơn;
- dễ giải thích hơn;
- khớp báo cáo hơn;
- có thể trình bày mạch lạc hơn.

## 2.8. Định nghĩa “xong sprint” phải rất cụ thể

Sprint 14 chỉ được xem là hoàn thành khi có đủ:

- dữ liệu demo cuối;
- regression test tối thiểu cho các nhóm API chính;
- 4 luồng demo bắt buộc chạy ổn;
- screenshot / hình minh họa;
- báo cáo và UML được chốt;
- slide trình bày;
- script demo;
- checklist bảo vệ.

---

## 3. Các vấn đề cần xác định trong sprint này

### 3.1. Bộ dữ liệu demo cuối cùng gồm những gì

Cần xác định rõ danh sách dữ liệu nào sẽ xuất hiện trong buổi demo, ví dụ:

- 1 admin;
- 1 guide đã xác minh;
- 1 guide chưa xác minh hoặc đã bị moderation;
- 2–3 user thường;
- 3–5 tour với trạng thái khác nhau;
- 2–3 companion post;
- 1 số request tour / companion ở nhiều trạng thái;
- 1 số review, report, notification, payment mẫu.

### 3.2. 4 luồng demo bắt buộc sẽ là những luồng nào

Sprint 14 phải chốt **4 luồng demo chính thức** để tránh bảo vệ lan man. Cần chọn các luồng:

- có giá trị nghiệp vụ cao;
- ít rủi ro;
- thể hiện được cả user, guide, admin;
- khớp với phần phân tích trong báo cáo.

### 3.3. Màn hình nào sẽ demo live, màn hình nào chỉ trình bày

Không phải mọi màn hình đều nên mở live. Cần quyết định rõ:

- màn hình nào mở trực tiếp;
- màn hình nào chỉ nói nhanh bằng screenshot;
- màn hình nào chỉ nhắc là định hướng phát triển.

### 3.4. Nhóm chức năng mở rộng có demo live hay không

Chat, AI, recommendation, accommodation, payment có thể tạo ấn tượng tốt, nhưng cũng dễ lỗi hơn. Cần xác định:

- demo live toàn bộ;
- demo một phần;
- hoặc chỉ minh họa bằng dữ liệu sẵn có.

### 3.5. Có cần reset dữ liệu trước buổi demo hay dùng snapshot cố định

Cần chốt cách đưa hệ thống về trạng thái sạch trước khi bảo vệ:

- reset toàn bộ DB theo script;
- dùng một bản seed snapshot cố định;
- hoặc giữ môi trường demo riêng biệt.

### 3.6. Tài liệu cuối nào bắt buộc phải hoàn thành

Cần chốt rõ danh sách tài liệu bắt buộc, ví dụ:

- báo cáo tổng;
- báo cáo màn hình;
- báo cáo CSDL;
- báo cáo UML;
- README;
- slide;
- script demo;
- checklist kiểm thử.

### 3.7. Cách kiểm thử tổng thể sẽ làm theo mức nào

Cần thống nhất kiểm thử ở mức phù hợp với đồ án:

- smoke test toàn hệ thống;
- regression test các API cốt lõi;
- kiểm thử thủ công theo demo flow;
- không nhất thiết triển khai test automation quá nặng nếu chưa có nền.

### 3.8. Permission nào phải rà soát lại lần cuối

Sprint 14 cần kiểm tra lại các quyền quan trọng:

- guest chỉ xem dữ liệu public;
- user chỉ sửa dữ liệu của mình;
- guide chỉ quản lý tour / hồ sơ của mình;
- admin mới có quyền phân quyền, moderation, xử lý report, xem dashboard quản trị.

### 3.9. API nào phải ưu tiên regression test

Cần chốt ưu tiên test:

- auth;
- hồ sơ người dùng;
- public tours;
- guide profile;
- tour requests;
- companion posts / requests;
- reports / admin moderation;
- favorites / reviews;
- notifications;
- chat;
- AI / accommodation / payment.

### 3.10. UML nào cần chốt ở trạng thái cuối

Không nhất thiết phải bổ sung thêm quá nhiều sơ đồ mới, nhưng phải chốt các sơ đồ đã làm:

- Use Case tổng quát;
- ERD;
- Activity Diagram các luồng chính;
- Sequence Diagram quan trọng;
- Class Diagram nếu đã đưa vào báo cáo.

### 3.11. Flow dự phòng khi demo lỗi là gì

Cần xác định rõ:

- nếu API lỗi thì chuyển sang flow chụp màn hình;
- nếu payment lỗi thì mô tả sandbox/mock;
- nếu AI lỗi thì trình bày session đã lưu;
- nếu chat lỗi thì minh họa conversation có sẵn.

### 3.12. README và hướng dẫn chạy demo có cần chi tiết đến mức nào

Cần chốt mức tối thiểu:

- cách cài môi trường;
- biến môi trường chính;
- lệnh chạy frontend/backend;
- cách seed DB;
- tài khoản demo;
- cách reset dữ liệu.

---

## 4. Hạng mục cần chốt

### 4.1. Hạng mục chiến lược đóng gói

- Phạm vi demo cuối cùng
- Danh sách chức năng demo thật
- Danh sách chức năng chỉ minh họa
- 4 luồng demo bắt buộc
- Flow dự phòng khi demo lỗi

### 4.2. Hạng mục dữ liệu demo

- Tài khoản user / guide / admin
- Tour mẫu
- Companion post mẫu
- Request mẫu
- Review mẫu
- Report mẫu
- Notification mẫu
- Payment mẫu
- Dữ liệu chat / AI session mẫu nếu dùng khi trình bày

### 4.3. Hạng mục frontend

- Fix bug hiển thị
- Chuẩn hóa text và label
- Rà soát responsive cơ bản
- Chụp ảnh màn hình
- Chuẩn bị video demo nếu cần
- Kiểm tra loading / empty / error state

### 4.4. Hạng mục backend

- Fix bug logic
- Kiểm tra permission
- Rà soát logging
- Tối ưu query cuối ở mức cần thiết
- Chuẩn hóa response / error
- Chốt danh sách endpoint

### 4.5. Hạng mục database

- Seed dữ liệu demo cuối
- Backup schema
- Backup dữ liệu mẫu
- Kiểm tra migration
- Chuẩn bị script reset demo
- Kiểm tra toàn vẹn dữ liệu và quan hệ khóa ngoại

### 4.6. Hạng mục API / test

- Smoke test hệ thống
- Regression test API lõi
- Test thủ công theo demo flow
- Kiểm tra role / guard / permission
- Kiểm tra dữ liệu đầu ra của các API dễ trình bày

### 4.7. Hạng mục tài liệu/UML

- Chốt ERD
- Chốt Use Case
- Chốt Activity Diagram
- Chốt Sequence Diagram cần thiết
- Hoàn thiện mô tả màn hình
- Hoàn thiện báo cáo tổng
- Hoàn thiện README
- Hoàn thiện slide
- Hoàn thiện script thuyết trình

### 4.8. Hạng mục bảo vệ

- Checklist trước khi demo
- Tài khoản demo
- URL hoặc môi trường chạy
- Kịch bản trình bày 5–10 phút
- Kịch bản trả lời câu hỏi phản biện
- Phương án dự phòng

---

## 5. Phương án được chọn

## 5.1. Chiến lược tổng thể được chọn

Chọn phương án:

- **không mở thêm chức năng mới**;
- dùng Sprint 14 hoàn toàn cho:
  - fix bug;
  - test cuối;
  - seed demo;
  - chốt tài liệu;
  - chuẩn bị bảo vệ.

Đây là phương án phù hợp nhất với đồ án sinh viên và đúng tinh thần các file kế hoạch đã chốt.

## 5.2. Phương án demo được chọn

Chọn hướng:

- demo trọng tâm theo **4 luồng nghiệp vụ bắt buộc**;
- các chức năng mở rộng chỉ demo khi ổn định;
- nếu rủi ro cao thì chuyển thành minh họa có kiểm soát.

## 5.3. 4 luồng demo bắt buộc được chọn

Chọn 4 luồng có giá trị trình bày cao nhất và bám sát phạm vi chính thức của đồ án:

1. **Luồng 1 – Đăng ký / đăng nhập / xem hồ sơ cá nhân / phân quyền điều hướng**
   - thể hiện nền tảng auth và role;
   - chứng minh hệ thống chia area rõ ràng.

2. **Luồng 2 – Xem tour công khai → gửi yêu cầu tham gia tour → guide duyệt yêu cầu**
   - thể hiện trục kết nối khách du lịch – hướng dẫn viên;
   - là một trong các core flow quan trọng nhất.

3. **Luồng 3 – Tạo bài tìm bạn đồng hành → user khác gửi yêu cầu tham gia → chủ bài duyệt**
   - thể hiện trục kết nối người dùng với nhau;
   - chứng minh hệ thống có giá trị cộng đồng, không chỉ là website tour.

4. **Luồng 4 – Gửi report → admin xử lý / moderation**
   - thể hiện lớp quản trị và kiểm duyệt;
   - giúp sản phẩm có chiều sâu quản lý hệ thống.

Nếu còn thời gian hoặc hệ thống ổn định, có thể minh họa thêm:

- favorite / review;
- guide verification;
- notification;
- chat;
- AI / recommendation;
- payment sandbox.

## 5.4. Phân loại màn hình được chọn

Chọn chia 47 màn hình thành 3 lớp:

- **Lớp A – demo thật:** màn hình tham gia trực tiếp vào 4 luồng demo bắt buộc
- **Lớp B – minh họa mở nhanh:** màn hình đã làm cơ bản, có thể giới thiệu bổ sung
- **Lớp C – trình bày phạm vi:** màn hình mở rộng / skeleton / mô phỏng

## 5.5. Phương án dữ liệu demo được chọn

Chọn chuẩn bị **bộ seed demo cố định**, có thể reset nhanh trước buổi bảo vệ, gồm:

- 1 admin;
- 1 guide chính để demo;
- 1 guide phụ để minh họa trạng thái khác;
- 2–3 user thường;
- bộ tour và companion post đa trạng thái;
- request ở các trạng thái pending / approved / rejected / cancelled;
- 1 số review, report, notification;
- 1–2 payment transaction mẫu;
- 1–2 conversation / AI session mẫu nếu cần mở rộng.

## 5.6. Phương án kiểm thử được chọn

Chọn cách làm thực tế:

- smoke test toàn hệ thống;
- regression test các nhóm API chính;
- kiểm thử thủ công theo từng luồng demo;
- không ép triển khai test automation nặng ở sprint cuối nếu chưa có nền.

## 5.7. Phương án tài liệu được chọn

Chọn chốt toàn bộ tài liệu ở mức:

- khớp với bản demo thật;
- ưu tiên sơ đồ và mô tả các luồng lõi;
- các phần mở rộng trình bày đúng bản chất: đã làm cơ bản, mô phỏng, hoặc định hướng phát triển.

## 5.8. Phương án bảo vệ được chọn

Chọn chuẩn bị:

- slide ngắn, rõ, ít chữ;
- script nói theo 4 luồng demo;
- ảnh chụp màn hình dự phòng;
- README nội bộ để tự setup nhanh;
- checklist trước giờ demo.

## 5.9. Phương án xử lý rủi ro được chọn

Chọn nguyên tắc:

- nếu tính năng mở rộng không ổn định thì không ép demo live;
- ưu tiên core flow đã chắc;
- dùng dữ liệu snapshot, ảnh chụp và màn hình mở nhanh để giảm rủi ro.

## 5.10. Phương án chốt phạm vi được chọn

Chọn nhấn mạnh lại với hội đồng:

- phạm vi bắt buộc đã hoàn thành ở nhóm lõi;
- nhóm ưu tiên 2 đã được bổ sung có chọn lọc;
- nhóm ưu tiên 3 ở mức minh họa / sandbox / mô phỏng đúng theo định hướng của đồ án.

---

## 6. Ghi chú triển khai

### 6.1. Thứ tự triển khai nên làm

Thứ tự hợp lý trong Sprint 14:

1. Chốt danh sách 4 luồng demo
2. Rà soát và sửa bug của 4 luồng này trước
3. Chuẩn hóa dữ liệu demo
4. Regression test API theo nhóm
5. Rà soát UI / ảnh chụp / responsive cơ bản
6. Chốt ERD / UML / mô tả màn hình
7. Hoàn thiện slide + script
8. Chạy thử toàn bộ như một buổi bảo vệ thật

### 6.2. Fix bug phải ưu tiên theo giá trị demo

Không phải bug nào cũng ưu tiên như nhau. Thứ tự nên là:

- bug làm hỏng luồng demo;
- bug sai quyền truy cập;
- bug sai dữ liệu hiển thị;
- bug giao diện dễ nhìn thấy;
- bug nhỏ ít ảnh hưởng.

### 6.3. Không refactor lớn ở sprint cuối

Sprint 14 không nên làm:

- đổi kiến trúc module;
- đổi auth flow;
- đổi schema lớn;
- đổi routing lớn;
- đổi thư viện trọng yếu.

### 6.4. Chỉ tối ưu query ở mức cần thiết

Chỉ tối ưu khi:

- API quá chậm đến mức ảnh hưởng demo;
- query join sai logic;
- dữ liệu demo trả về không ổn định.

Không nên mở rộng tối ưu hóa quá mức trong sprint cuối.

### 6.5. Chú ý sự nhất quán của text và nhãn hiển thị

Rất nhiều sản phẩm bị trừ cảm nhận chỉ vì:

- label không thống nhất;
- nút tiếng Việt / tiếng Anh lẫn lộn;
- trạng thái hiển thị khác tên trong báo cáo;
- thông báo lỗi quá kỹ thuật.

Sprint 14 phải rà soát lại toàn bộ các text quan trọng.

### 6.6. Chuẩn bị ảnh chụp màn hình có chủ đích

Ảnh chụp không chỉ để bỏ vào báo cáo, mà còn để dự phòng khi demo. Nên chụp các nhóm:

- trang chủ;
- đăng nhập;
- danh sách tour;
- chi tiết tour;
- gửi request tour;
- dashboard guide;
- bài đồng hành;
- dashboard admin;
- report / moderation;
- statistics / notification;
- AI / payment / chat nếu có.

### 6.7. Slide và script phải bám đúng sản phẩm thật

Không nên viết slide theo “hệ thống lý tưởng”. Slide phải phản ánh đúng:

- cái gì đã làm thật;
- cái gì làm ở mức cơ bản;
- cái gì là mở rộng / định hướng.

### 6.8. README nên thiên về “chạy demo được”

README của đồ án không cần quá dài, nhưng nên đủ để:

- clone / mở source;
- cấu hình env;
- chạy frontend;
- chạy backend;
- seed DB;
- đăng nhập bằng tài khoản demo.

### 6.9. Dữ liệu demo nên dễ kể chuyện

Dữ liệu không chỉ đúng kỹ thuật mà còn nên có câu chuyện:

- user A tìm tour của guide B;
- user C xin tham gia;
- guide B duyệt;
- user A tạo bài đồng hành;
- user khác gửi request;
- admin xử lý report.

Dữ liệu có ngữ cảnh sẽ giúp buổi bảo vệ tự nhiên và thuyết phục hơn.

### 6.10. Quy tắc “xong sprint”

Sprint 14 chỉ được xem là xong khi:

- 4 luồng demo chính chạy được;
- dữ liệu demo cuối đã seed xong;
- API lõi đã regression test ở mức tối thiểu;
- báo cáo / UML / màn hình đã cập nhật;
- slide và script đã chốt;
- có phương án dự phòng nếu demo lỗi.

---

## 7. Chức năng trọng tâm

Sprint 14 không thêm chức năng nghiệp vụ mới. Vì vậy, “chức năng trọng tâm” của sprint này được hiểu là **nhóm công việc đóng gói toàn hệ thống**.

### Nhóm 1. Kiểm thử tổng thể hệ thống

#### Mục tiêu

- Bảo đảm các luồng lõi chạy thông suốt
- Phát hiện bug cuối trước buổi bảo vệ
- Giảm rủi ro lỗi live demo

#### Actor chính

- Developer / người thực hiện đồ án
- Giảng viên / hội đồng (ở góc nhìn người xem sản phẩm)

#### Dữ liệu chính

- Tất cả dữ liệu demo đã seed
- Tài khoản demo
- Log lỗi / checklist test

#### Kết quả đầu ra

- Danh sách bug đã sửa
- Checklist test đã chạy
- 4 luồng demo ổn định

#### Mức độ triển khai phù hợp

- kiểm thử thủ công + smoke test + regression test API lõi;
- không cần mở rộng thành test automation toàn diện nếu không có nền.

### Nhóm 2. Chuẩn hóa dữ liệu demo

#### Mục tiêu

- Tạo bộ dữ liệu đẹp, rõ, dễ trình bày
- Tránh dữ liệu rỗng hoặc sai logic khi demo

#### Actor chính

- Developer / người chuẩn bị bảo vệ

#### Dữ liệu chính

- users, roles, user_roles
- guide_profiles, tours, tour_requests
- companion_posts, companion_requests
- reviews, reports, notifications
- conversations, ai_chat_sessions, payment_transactions

#### Kết quả đầu ra

- Bộ seed cuối cùng
- Script reset dữ liệu demo
- Snapshot dữ liệu dùng cho bảo vệ

#### Mức độ triển khai phù hợp

- ưu tiên dữ liệu vừa đủ nhưng có ý nghĩa;
- không seed tràn lan gây rối phần trình bày.

### Nhóm 3. Hoàn thiện tài liệu và UML

#### Mục tiêu

- Bảo đảm tài liệu khớp sản phẩm thật
- Tăng tính học thuật và tính thuyết phục khi bảo vệ

#### Actor chính

- Developer / người viết báo cáo
- Hội đồng chấm đồ án

#### Dữ liệu chính

- Use Case
- ERD
- Activity Diagram
- Sequence Diagram
- mô tả màn hình
- báo cáo tổng

#### Kết quả đầu ra

- Bộ tài liệu chốt cuối
- Báo cáo hoàn chỉnh
- Slide và script nhất quán

#### Mức độ triển khai phù hợp

- ưu tiên chốt đúng những gì đã làm thật;
- tránh vẽ quá nhiều sơ đồ không dùng trong bảo vệ.

### Nhóm 4. Chuẩn bị trình bày và bảo vệ

#### Mục tiêu

- Giúp phần demo mạch lạc, tự tin
- Kiểm soát tốt thời gian và rủi ro

#### Actor chính

- Người bảo vệ đồ án

#### Dữ liệu chính

- slide
- script nói
- screenshot
- video ngắn dự phòng
- checklist trước demo

#### Kết quả đầu ra

- Bộ tài liệu trình bày hoàn chỉnh
- Flow bảo vệ rõ ràng
- Phương án dự phòng sẵn sàng

#### Mức độ triển khai phù hợp

- gọn, rõ, thực chiến;
- tránh làm slide quá dài hoặc demo quá dàn trải.

### Kết luận cho nhóm chức năng

Sprint 14 không có chức năng nghiệp vụ mới, nhưng lại là sprint quyết định sản phẩm có **thật sự sẵn sàng để bảo vệ hay không**. Nhóm trọng tâm của sprint này là:

- kiểm thử;
- chuẩn hóa dữ liệu;
- hoàn thiện tài liệu;
- chuẩn bị trình bày.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình

Khác với các sprint trước, Sprint 14 không xây thêm màn hình mới mà tập trung **rà soát toàn bộ 47 màn hình** theo 3 lớp:

- màn hình demo thật;
- màn hình mở nhanh minh họa;
- màn hình mở rộng / skeleton chỉ trình bày.

## 8.2. Nhóm màn hình demo thật nên ưu tiên

Đây là nhóm nên tham gia trực tiếp vào 4 luồng demo bắt buộc.

### Public / dùng chung

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
- **M20 – Gửi báo cáo vi phạm**
- **M21 – Yêu cầu tham gia tour của tôi**
- **M23 – Danh sách bài đồng hành của tôi**
- **M24 – Tạo bài đồng hành**
- **M25 – Cập nhật bài đồng hành**
- **M26 – Yêu cầu tham gia bài đồng hành đã gửi**

### Guide Area

- **M31 – Hồ sơ hướng dẫn viên**
- **M34 – Danh sách tour của tôi**
- **M35 – Tạo / cập nhật tour**
- **M37 – Quản lý yêu cầu tham gia tour**

### Admin Area

- **M39 – Quản lý người dùng**
- **M40 – Phân quyền quản trị**
- **M43 – Quản lý báo cáo vi phạm**
- **M46 – Dashboard / thống kê quản trị**
- **M47 – Nhật ký hoạt động quản trị**

## 8.3. Nhóm màn hình mở nhanh để minh họa thêm

Các màn hình này có thể mở nhanh nếu còn thời gian hoặc khi hội đồng hỏi sâu:

- **M07 – Bản đồ lộ trình tour**
- **M08 – Danh sách hướng dẫn viên công khai**
- **M09 – Hồ sơ hướng dẫn viên công khai**
- **M16 – Đổi mật khẩu**
- **M17 – Lịch sử hoạt động cá nhân**
- **M18 – Danh sách yêu thích**
- **M19 – Thông báo**
- **M27 – Danh sách review / đánh giá**
- **M28 – Gửi yêu cầu xác minh hướng dẫn viên**
- **M29 – Chat trực tiếp**
- **M30 – Chat nhóm bài đồng hành**
- **M32 – Hồ sơ hướng dẫn viên công khai ở góc quản trị / kiểm duyệt**
- **M33 – Danh sách yêu cầu xác minh hướng dẫn viên**
- **M36 – Chi tiết tour / quản trị tour ở guide area**
- **M38 – Dashboard hướng dẫn viên**
- **M41 – Kiểm duyệt hồ sơ hướng dẫn viên**
- **M42 – Kiểm duyệt tour / bài đồng hành**
- **M44 – Chi tiết xử lý report**
- **M45 – Quản lý nội dung vi phạm**

## 8.4. Nhóm màn hình mở rộng / định hướng

Nhóm này có thể chỉ cần screenshot hoặc minh họa ngắn:

- **M12 – Gợi ý tour thông minh**
- **M13 – Chatbot AI tư vấn du lịch**
- **M14 – Liên kết dịch vụ lưu trú**
- **M22 – Thanh toán trực tuyến**

## 8.5. Điều cần làm với toàn bộ màn hình trong Sprint 14

- Rà soát text hiển thị
- Kiểm tra breadcrumb, title, button
- Kiểm tra loading / empty / error state
- Kiểm tra route guard
- Kiểm tra dữ liệu hiển thị khớp role
- Chụp ảnh màn hình theo bộ minh họa báo cáo

### Kết luận cho phần màn hình

Sprint 14 phải làm rõ rằng:

- không phải mọi màn hình đều demo live;
- nhưng mọi màn hình đưa vào báo cáo đều phải có trạng thái trình bày rõ ràng;
- các màn hình thuộc core flow phải ổn định hơn phần mở rộng.

---

## 9. Bảng CSDL chính

## 9.1. Mục tiêu của phần dữ liệu

Sprint 14 không thêm bảng mới mà rà soát **toàn bộ 38 bảng** theo các mục tiêu:

- toàn vẹn dữ liệu;
- logic khóa ngoại;
- trạng thái dữ liệu;
- dữ liệu demo;
- khả năng reset về trạng thái bảo vệ.

## 9.2. Nhóm tài khoản, phân quyền và audit quản trị

- `users`
- `roles`
- `user_roles`
- `admin_activity_logs`
- `user_role_change_logs`

### Vai trò trong Sprint 14

- kiểm tra tài khoản demo;
- kiểm tra role và quyền truy cập;
- kiểm tra audit log phục vụ admin demo.

## 9.3. Nhóm hồ sơ hướng dẫn viên

- `guide_profiles`
- `languages`
- `skills`
- `guide_languages`
- `guide_skills`
- `guide_verification_requests`
- `guide_verification_documents`

### Vai trò trong Sprint 14

- seed guide profile đủ đẹp để demo;
- bảo đảm trạng thái verification hợp lý;
- có ít nhất 1 hồ sơ dùng được trong luồng tour.

## 9.4. Nhóm tour và tham gia tour

- `tour_categories`
- `tours`
- `tour_images`
- `tour_locations`
- `tour_requests`
- `tour_reviews`
- `guide_reviews`
- `favorite_tours`
- `favorite_guides`

### Vai trò trong Sprint 14

- tạo bộ tour mẫu để demo public tour;
- bảo đảm request tour có đủ trạng thái;
- có sẵn review / favorite minh họa nếu cần.

## 9.5. Nhóm companion

- `companion_posts`
- `companion_requests`

### Vai trò trong Sprint 14

- chuẩn bị ít nhất 1 luồng bài đồng hành hoàn chỉnh;
- có request pending / approved / rejected để minh họa.

## 9.6. Nhóm report, notification, activity

- `reports`
- `report_processing_history`
- `notifications`
- `user_activity_logs`

### Vai trò trong Sprint 14

- phục vụ luồng user report → admin xử lý;
- hỗ trợ trình bày notification và activity log nếu được hỏi sâu.

## 9.7. Nhóm chat, AI, accommodation, payment

- `conversations`
- `conversation_participants`
- `messages`
- `user_preferences`
- `user_preferred_categories`
- `ai_chat_sessions`
- `ai_chat_messages`
- `partner_accommodations`
- `tour_accommodations`
- `payment_transactions`

### Vai trò trong Sprint 14

- dùng làm dữ liệu minh họa cho phần mở rộng;
- không bắt buộc demo sâu nếu chưa ổn định.

## 9.8. Kiểm tra dữ liệu cuối cần thực hiện

- kiểm tra orphan record;
- kiểm tra khóa ngoại;
- kiểm tra duplicate dữ liệu demo;
- kiểm tra trạng thái dữ liệu có logic;
- kiểm tra script reset chạy được;
- backup snapshot dữ liệu cuối.

### Kết luận cho phần dữ liệu

Trong Sprint 14, phần “Bảng CSDL chính” được hiểu là **toàn bộ 38 bảng của schema cuối**, nhưng mức ưu tiên rà soát phải bám theo 4 luồng demo bắt buộc và nhóm mở rộng chỉ cần đủ để trình bày.

---

## 10. API cần thiết

## 10.1. Mục tiêu của phần API

Sprint 14 không thiết kế thêm API mới, mà tập trung:

- regression test;
- rà soát permission;
- kiểm tra response;
- chốt danh sách endpoint phục vụ báo cáo và demo.

## 10.2. Nhóm auth / profile

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

### Mục tiêu

- xác minh đăng ký / đăng nhập / đăng xuất;
- kiểm tra phân quyền và điều hướng.

## 10.3. Nhóm public / tours

- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/locations`
- `GET /tour-categories`
- `POST /tour-requests`
- `GET /me/tour-requests`
- `PATCH /tour-requests/:id/cancel`

### Mục tiêu

- bảo đảm public tour và luồng gửi request tour ổn định.

## 10.4. Nhóm guide

- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /guide/tours`
- `POST /guide/tours`
- `PATCH /guide/tours/:id`
- `GET /guide/tours/:id/requests`
- `PATCH /guide/tour-requests/:id/status`

### Mục tiêu

- bảo đảm luồng guide profile và guide duyệt request tour chạy được.

## 10.5. Nhóm companion

- `GET /companion-posts`
- `GET /companion-posts/:id`
- `POST /companion-posts`
- `PATCH /companion-posts/:id`
- `DELETE /companion-posts/:id`
- `POST /companion-posts/:id/requests`
- `GET /me/companion-posts`
- `GET /me/companion-requests`
- `GET /companion-posts/:id/requests`
- `PATCH /companion-requests/:id/status`

### Mục tiêu

- bảo đảm luồng bài đồng hành và duyệt thành viên hoạt động ổn định.

## 10.6. Nhóm report / admin

- `POST /reports`
- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/roles`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles/:role`
- `GET /admin/reports`
- `GET /admin/reports/:id`
- `PATCH /admin/reports/:id`
- `GET /admin/activity-logs`
- `GET /admin/role-change-logs`

### Mục tiêu

- bảo đảm luồng report và quản trị lõi có thể trình bày rõ.

## 10.7. Nhóm review / favorite / notification

- `POST /tours/:id/favorite`
- `DELETE /tours/:id/favorite`
- `POST /guides/:id/favorite`
- `DELETE /guides/:id/favorite`
- `POST /tours/:id/reviews`
- `POST /guides/:id/reviews`
- `GET /me/favorites`
- `GET /me/notifications`
- `PATCH /me/notifications/:id/read`

### Mục tiêu

- regression test và minh họa nếu cần.

## 10.8. Nhóm chat / AI / accommodation / payment

- `GET /conversations`
- `POST /conversations/direct`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `GET /recommendations/tours`
- `POST /ai-chat/sessions`
- `GET /ai-chat/sessions/:id/messages`
- `POST /ai-chat/sessions/:id/messages`
- `GET /accommodations`
- `GET /tours/:id/accommodations`
- `POST /payments`
- `GET /payments/:id`
- `POST /payments/:id/confirm`
- `GET /me/payments`

### Mục tiêu

- kiểm tra ở mức mở rộng / minh họa;
- không bắt buộc demo live toàn bộ nếu rủi ro cao.

## 10.9. Kết quả mong muốn ở phần API

- Có danh sách endpoint rõ ràng
- Có kết quả test tối thiểu cho các nhóm API chính
- Có thể trả lời hội đồng khi được hỏi về kiến trúc API

### Kết luận cho phần API

Sprint 14 phải kết thúc với một **danh sách API đã được rà soát và có mức độ tin cậy đủ để demo**, thay vì chỉ là tập endpoint rời rạc chưa kiểm tra lần cuối.

---

## 11. Công việc frontend

## 11.1. Mục tiêu tổng thể của frontend sprint này

- Fix bug giao diện
- Chuẩn hóa dữ liệu hiển thị
- Rà soát luồng demo
- Hoàn thiện ảnh chụp / video / minh họa
- Tăng tính nhất quán của toàn bộ trải nghiệm sử dụng

## 11.2. Rà soát layout và điều hướng

- Kiểm tra header, sidebar, breadcrumb
- Kiểm tra route guard theo role
- Kiểm tra redirect sau login
- Kiểm tra điều hướng giữa Public / User / Guide / Admin

## 11.3. Fix bug trên các màn hình demo thật

Ưu tiên sửa lỗi ở:

- M03, M04, M05, M06
- M15, M20, M21, M23, M24, M25, M26
- M31, M34, M35, M37
- M39, M43, M46, M47

## 11.4. Chuẩn hóa trạng thái giao diện

- loading state
- empty state
- error state
- success toast / modal xác nhận
- badge trạng thái thống nhất

## 11.5. Chuẩn hóa dữ liệu demo hiển thị

- avatar, tên, tiêu đề, mô tả, trạng thái
- ngày giờ hiển thị
- tiền tệ và giá tour
- số lượng thành viên / chỗ trống
- text thông báo cho report, request, payment

## 11.6. Rà soát responsive cơ bản

- kiểm tra trên viewport laptop phổ biến
- kiểm tra tối thiểu trên tablet / mobile ở các màn hình quan trọng
- tránh vỡ layout trong buổi demo

## 11.7. Chuẩn bị screenshot và tài nguyên trình bày

- chụp bộ hình cho báo cáo
- chụp bộ hình dự phòng cho slide
- quay video ngắn nếu cần cho phần mở rộng

## 11.8. Kiểm thử frontend theo demo script

- chạy thử 4 luồng demo
- kiểm tra text hiển thị
- kiểm tra button / form / validation
- ghi lại điểm dễ lỗi để fix cuối

---

## 12. Công việc backend

## 12.1. Mục tiêu tổng thể của backend sprint này

- sửa lỗi logic cuối;
- rà soát permission;
- chuẩn hóa response;
- kiểm tra logging;
- chốt danh sách endpoint.

## 12.2. Rà soát auth và role guard

- đăng ký / đăng nhập / đăng xuất
- lấy profile hiện tại
- lấy role hiện tại
- kiểm tra role guard theo area
- kiểm tra trường hợp account bị khóa / suspended

## 12.3. Rà soát nhóm nghiệp vụ lõi

- public tour
- guide profile
- tour requests
- companion posts / requests
- reports / admin moderation

Đây là phần phải ưu tiên nhất vì gắn trực tiếp với 4 luồng demo.

## 12.4. Rà soát nhóm nghiệp vụ bổ sung

- favorite
- review
- notifications
- statistics
- guide verification

## 12.5. Rà soát nhóm mở rộng

- chat
- AI
- accommodation
- payment

Mục tiêu ở mức:

- chạy được nếu demo;
- nếu chưa ổn định thì ít nhất phải đúng logic, đúng response mẫu, dễ trình bày.

## 12.6. Kiểm tra permission lần cuối

- user không sửa dữ liệu người khác
- guide không thao tác ngoài phạm vi tour của mình
- admin mới được moderation / phân quyền / xem nhật ký
- guest chỉ xem dữ liệu public

## 12.7. Kiểm tra logging và audit

- log admin activity
- log đổi quyền
- log xử lý report nếu có
- log payment / AI / chat ở mức cơ bản nếu đã triển khai

## 12.8. Tối ưu query cuối ở mức cần thiết

Chỉ tối ưu ở các API:

- danh sách tour;
- chi tiết tour;
- dashboard admin;
- danh sách report;
- danh sách request;
- notifications / activity log nếu bị chậm.

## 12.9. Hoàn thiện danh sách API docs

- danh sách endpoint
- method
- request body chính
- response chính
- role được phép gọi

---

## 13. Công việc database

## 13.1. Mục tiêu tổng thể của database sprint này

- seed dữ liệu demo cuối;
- backup schema và snapshot;
- kiểm tra toàn vẹn dữ liệu;
- chuẩn bị script reset trước demo.

## 13.2. Chuẩn hóa bộ seed demo

- user / guide / admin
- guide profile
- tour
- companion post
- request
- review
- report
- notification
- payment
- conversation / AI session nếu cần

## 13.3. Kiểm tra toàn vẹn dữ liệu

- khóa ngoại
- ràng buộc unique
- trạng thái dữ liệu
- dữ liệu ngày giờ
- dữ liệu tiền tệ / số lượng

## 13.4. Rà soát migration

- migration đã chạy đúng chưa
- migration nào còn thừa / không dùng
- có cần script tổng hợp để dựng DB mới hay không

## 13.5. Backup schema và dữ liệu mẫu

- backup schema cuối
- backup seed cuối
- backup snapshot môi trường demo

## 13.6. Chuẩn bị script reset demo

Script này nên đủ để:

- xóa dữ liệu phát sinh khi chạy thử;
- seed lại trạng thái demo chuẩn;
- đưa hệ thống về đúng trạng thái trước buổi bảo vệ.

## 13.7. Kiểm tra dữ liệu phục vụ 4 luồng demo

- mỗi luồng đều có đủ actor và dữ liệu liên quan;
- không bị thiếu record khi trình bày;
- trạng thái dữ liệu nhất quán với script nói.

## 13.8. Chuẩn bị dữ liệu dự phòng

- tài khoản backup
- tour backup
- companion post backup
- report backup
- payment backup

---

## 14. Tài liệu/UML

## 14.1. Use Case cần chốt cuối

- Use Case tổng quát toàn hệ thống
- actor: Guest, User, Guide, Admin
- bảo đảm khớp phạm vi chính thức của đồ án

## 14.2. ERD cần chốt cuối

- sơ đồ logic khớp schema final 38 bảng
- nếu báo cáo tách ERD lõi / ERD mở rộng thì phải nhất quán với sản phẩm thật

## 14.3. Activity Diagram cần chốt

Ưu tiên các luồng:

- đăng ký / đăng nhập
- xem tour / gửi request tour
- guide duyệt request tour
- tạo bài đồng hành / gửi request / duyệt request
- gửi report / admin xử lý
- payment hoặc AI nếu đã đưa vào báo cáo

## 14.4. Sequence Diagram cần chốt

Ưu tiên các sơ đồ có giá trị trình bày cao:

- gửi yêu cầu tham gia tour
- guide duyệt yêu cầu tham gia tour
- gửi yêu cầu tham gia bài đồng hành
- xử lý report vi phạm

## 14.5. Mô tả màn hình cần cập nhật

- trạng thái thật của từng màn hình
- nội dung chính hiển thị
- actor truy cập
- chức năng liên quan
- dữ liệu liên quan

## 14.6. Báo cáo tổng cần hoàn thiện

- phạm vi đề tài
- chức năng hệ thống
- công nghệ triển khai
- phân tích dữ liệu
- UML
- thiết kế màn hình
- kế hoạch sprint
- kết quả đạt được
- hướng phát triển

## 14.7. README và tài liệu chạy demo

- yêu cầu môi trường
- cách cấu hình
- cách chạy frontend/backend
- cách seed dữ liệu
- tài khoản demo
- lưu ý demo

## 14.8. Slide và script bảo vệ

- slide giới thiệu đề tài
- bài toán và mục tiêu
- kiến trúc hệ thống
- nhóm chức năng chính
- CSDL / UML
- demo 4 luồng
- kết quả đạt được
- hạn chế và hướng phát triển

### Nội dung cần nhấn mạnh khi viết báo cáo và bảo vệ

- hệ thống có 2 trục giá trị chính:
  - kết nối khách du lịch với hướng dẫn viên qua tour;
  - kết nối người dùng với nhau qua bài tìm bạn đồng hành.
- lõi đã được triển khai trước, mở rộng làm sau;
- nhóm chức năng mở rộng được phát triển đúng mức phù hợp với đồ án.

---

## 15. Đầu ra

### 15.1. Về chức năng

- Không thêm chức năng mới
- 4 luồng demo bắt buộc chạy ổn
- Nhóm chức năng mở rộng có thể mở minh họa nếu ổn định

### 15.2. Về màn hình

- Toàn bộ 47 màn hình được phân loại rõ:
  - demo thật;
  - minh họa nhanh;
  - trình bày phạm vi.
- Bộ ảnh màn hình đã được chụp xong

### 15.3. Về API

- Các nhóm API chính đã regression test ở mức tối thiểu
- Danh sách endpoint đã được chốt
- Permission quan trọng đã được rà soát lại

### 15.4. Về dữ liệu

- Bộ seed demo cuối đã chuẩn bị xong
- Có script reset demo
- Có snapshot dữ liệu phục vụ buổi bảo vệ

### 15.5. Về tài liệu

- ERD, Use Case, Activity Diagram đã chốt
- Mô tả màn hình hoàn thiện
- Báo cáo cuối khớp với sản phẩm
- README, slide, script demo sẵn sàng

### 15.6. Về giá trị bảo vệ đồ án

Kết thúc Sprint 14, hệ thống đạt trạng thái:

- môi trường demo ổn định;
- dữ liệu demo hợp lý;
- luồng demo rõ ràng;
- tài liệu đồng bộ;
- sẵn sàng bảo vệ đồ án.

### 15.7. Định nghĩa “xong sprint”

Sprint 14 được xem là hoàn thành khi đồng thời thỏa mãn:

- không còn bug nghiêm trọng trên 4 luồng demo chính;
- dữ liệu demo cuối đã seed và reset được;
- các nhóm API cốt lõi đã test lại;
- báo cáo và UML đã khớp với hệ thống thật;
- screenshot / slide / script / README đã chốt;
- có flow dự phòng nếu demo live gặp sự cố.

---

## Kết luận

Sprint 14 là giai đoạn chốt toàn bộ giá trị của đồ án. Nếu các sprint trước tập trung xây dựng hệ thống, thì sprint này tập trung **biến hệ thống thành một sản phẩm có thể trình bày thuyết phục trước hội đồng**.

Điểm quan trọng nhất của Sprint 14 không nằm ở việc thêm tính năng, mà nằm ở việc:

- giữ phạm vi ổn định;
- làm sạch dữ liệu;
- test lại toàn hệ thống;
- hoàn thiện tài liệu;
- chuẩn bị một buổi demo mạch lạc, tự tin và có phương án dự phòng.

Đây là sprint quyết định việc đồ án được nhìn nhận như một sản phẩm **đã hoàn thiện trong phạm vi sinh viên**, chứ không chỉ là một tập hợp chức năng đã code xong rời rạc.
