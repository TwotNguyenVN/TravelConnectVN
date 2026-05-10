# SPRINT 03 – Triển khai khu vực công khai cho tour du lịch

## 1. Mục tiêu sprint

Sprint 03 là sprint mở đầu cho **luồng public có giá trị demo cao nhất** của hệ thống: khách truy cập và người dùng có thể vào trang chủ, xem danh sách tour công khai, lọc tour theo nhu cầu và mở chi tiết tour để xem đầy đủ thông tin trước khi quyết định tham gia.

Đây là sprint rất quan trọng vì nó thể hiện rõ trục giá trị cốt lõi của đề tài: **khách du lịch kết nối với hướng dẫn viên địa phương thông qua tour**. Sau khi Sprint 01 đã dựng nền tảng kỹ thuật và Sprint 02 đã hoàn thiện lớp xác thực – hồ sơ – phân quyền, Sprint 03 phải tạo được một luồng public hoàn chỉnh, dễ demo, dễ giải thích và đủ chắc để các sprint sau như Guide Profile, Guide Tour Management và Tour Request bám vào.

### Mục tiêu chính
- Hiện thực hoàn chỉnh nhóm chức năng:
  - **F12:** Xem danh sách tour
  - **F13:** Tìm kiếm, lọc và sắp xếp tour
  - **F14:** Xem chi tiết tour
- Dựng xong **luồng public đầu tiên hoàn chỉnh** cho dự án.
- Chốt rõ điều kiện để một tour được xem là **tour công khai**.
- Xây dựng trang chủ public ở mức vừa đủ để điều hướng:
  - tour nổi bật;
  - hướng dẫn viên nổi bật;
  - bài đồng hành mới.
- Tạo được danh sách tour có:
  - filter tối thiểu;
  - sort tối thiểu;
  - phân trang;
  - dữ liệu hiển thị rõ ràng, đồng nhất với backend.
- Tạo được màn hình chi tiết tour hiển thị:
  - ảnh;
  - mô tả;
  - lịch trình tóm tắt;
  - thông tin hướng dẫn viên;
  - đánh giá.
- Chuẩn hóa dữ liệu, chỉ hiển thị các bản ghi ở trạng thái phù hợp để frontend và backend không bị lệch logic.
- Chuẩn bị nền cho Sprint 04, Sprint 05 và Sprint 06:
  - hồ sơ guide công khai;
  - tạo/quản lý tour;
  - gửi yêu cầu tham gia tour.

### Ý nghĩa của sprint này
Sprint 03 là sprint đầu tiên giúp người xem đồ án **nhìn thấy giá trị của hệ thống ngay lập tức**. Nếu sprint này làm tốt:
- người dùng có thể hiểu hệ thống đang giải quyết vấn đề gì;
- demo trở nên trực quan hơn nhiều so với chỉ trình bày auth hoặc profile;
- backend bắt đầu có các truy vấn public thực tế;
- database bắt đầu phát huy đúng vai trò với dữ liệu tour, ảnh, guide và review;
- các sprint sau sẽ dễ nối tiếp hơn vì đã có luồng “xem tour trước – thao tác sau”.

---

## 2. Lưu ý trước khi triển khai

## 2.1. Phải chốt thật rõ “tour công khai” là gì
Nếu không định nghĩa rõ từ đầu, frontend và backend sẽ rất dễ hiển thị lệch nhau. Sprint này bắt buộc phải thống nhất:
- tour nào được phép lên danh sách public;
- tour nào chỉ tồn tại ở backend nhưng không được hiển thị;
- đánh giá nào được xem là đánh giá công khai;
- guide profile ở trạng thái nào thì được gắn lên tour công khai.

## 2.2. Mục tiêu là làm tốt luồng xem tour, không làm bộ lọc quá nặng
Sprint này chỉ nên tập trung vào **luồng xem tour**. Không nên mở rộng quá sớm thành:
- bộ lọc quá nhiều tiêu chí;
- search quá phức tạp;
- map nâng cao;
- gợi ý AI;
- thao tác yêu thích, gửi request, báo cáo ở mức nghiệp vụ sâu.

Các nút liên quan như “Yêu thích”, “Gửi yêu cầu tham gia”, “Báo cáo” có thể xuất hiện trên UI chi tiết tour để giữ bố cục chuẩn, nhưng **nghiệp vụ sâu của các nút này không phải trọng tâm Sprint 03**.

## 2.3. Trang chủ chỉ dựng ở mức phục vụ điều hướng
Trang chủ public trong Sprint 03 không nên biến thành một màn hình quá nặng. Mục tiêu chính là:
- giới thiệu nền tảng;
- đưa người dùng đi vào danh sách tour;
- hiển thị vài khối nội dung nổi bật để demo.

Không cần làm quá nhiều widget phức tạp hoặc cá nhân hóa sớm.

## 2.4. Chỉ dùng dữ liệu “đủ để xem”
Ở giai đoạn này, dữ liệu dùng cho danh sách tour và chi tiết tour chỉ nên lấy những gì thật sự cần:
- tên tour;
- ảnh cover;
- địa điểm;
- thời gian;
- giá;
- guide cơ bản;
- rating trung bình;
- review công khai;
- lịch trình tóm tắt nếu có.

Không nên kéo quá sâu những phần sẽ thuộc sprint sau như:
- payment;
- request state machine;
- moderation phức tạp;
- recommendation;
- accommodation.

## 2.5. Sprint 03 vẫn phải có định nghĩa “xong sprint” rõ ràng
Sprint này chỉ được xem là hoàn thành khi có đủ:
- trang chủ public;
- danh sách tour chạy được;
- bộ lọc tối thiểu chạy được;
- chi tiết tour chạy được;
- API public tour hoạt động;
- dữ liệu seed đủ để test;
- tài liệu/UML cập nhật theo luồng public thật.

---

## 3. Các vấn đề cần xác định trong sprint này

## 3.1. Điều kiện hiển thị public của tour
Cần xác định rõ một tour được phép hiển thị khi nào. Tối thiểu phải xem xét:
- `business_status`;
- `visibility_status`;
- `is_deleted`;
- trạng thái của guide profile liên quan;
- điều kiện hiển thị review.

Ở mức sprint này, tư duy đúng là **chỉ cho lên public những dữ liệu đã ở trạng thái an toàn để hiển thị**.

## 3.2. Quan hệ giữa trạng thái tour và trạng thái guide
Không chỉ tour có trạng thái, hồ sơ hướng dẫn viên cũng có trạng thái hiển thị riêng. Vì vậy cần chốt:
- nếu tour đã `published` nhưng guide profile đang `hidden` hoặc `flagged` thì xử lý thế nào;
- có bắt buộc guide phải `approved` mới xuất hiện cùng tour public hay không;
- nếu guide chưa được xác minh sâu thì hiển thị thông tin ở mức nào.

## 3.3. Bộ lọc tối thiểu của danh sách tour
Cần khóa sớm bộ lọc tối thiểu để tránh sa đà. Theo các tài liệu chốt, bộ lọc nên giữ ở mức:
- địa điểm;
- thời gian;
- giá;
- loại tour.

Có thể bổ sung sort theo:
- mới nhất;
- giá tăng dần;
- giá giảm dần;
- rating cao;
- gần ngày đi.

Nhưng không nên mở rộng thêm nhiều tiêu chí phụ ngay ở sprint này.

## 3.4. Dữ liệu hiển thị ở danh sách tour
Danh sách tour phải rõ các trường nào là bắt buộc hiển thị. Nếu không chốt trước, frontend dễ làm thừa và backend dễ join quá nặng. Bộ dữ liệu phù hợp gồm:
- ảnh đại diện;
- tên tour;
- địa điểm;
- thời gian;
- giá;
- rating trung bình;
- trạng thái hiển thị phù hợp;
- thông tin guide ở mức ngắn gọn.

## 3.5. Dữ liệu hiển thị ở chi tiết tour
Chi tiết tour cần hiển thị đủ để người dùng đưa ra quyết định, nhưng chưa cần ôm cả nghiệp vụ gửi request. Những phần nên có:
- bộ ảnh tour;
- mô tả chi tiết;
- thời gian;
- điểm hẹn;
- số lượng người tối đa;
- điều kiện tham gia;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

## 3.6. Dữ liệu nào được lấy ra trang chủ
Trang chủ public cần chốt rõ:
- tiêu chí tour nổi bật;
- tiêu chí guide nổi bật;
- bài đồng hành mới hiển thị ở mức teaser hay đầy đủ;
- số lượng bản ghi mỗi block;
- có phân trang hay chỉ lấy một nhóm nhỏ.

---

## 4. Hạng mục cần chốt

Các hạng mục phải khóa trước khi code sâu trong Sprint 03 gồm:
- nguồn dữ liệu công khai;
- điều kiện hiển thị tour;
- bộ lọc tối thiểu;
- dữ liệu danh sách tour;
- dữ liệu chi tiết tour;
- rule hiển thị review công khai;
- tiêu chí chọn dữ liệu nổi bật ở trang chủ;
- phạm vi của chi tiết tour trong Sprint 03;
- mức độ sử dụng `tour_locations` ở giai đoạn này;
- chuẩn response của API list và detail.

---

## 5. Phương án được chọn

## 5.1. Nguồn dữ liệu công khai
Chỉ lấy dữ liệu đang ở trạng thái phù hợp để công khai. Tinh thần chung là:
- tour phải ở trạng thái **có thể hiển thị public**;
- guide profile đi kèm phải ở trạng thái hiển thị phù hợp;
- review phải là review công khai;
- dữ liệu bị ẩn, bị gắn cờ hoặc đã xóa mềm không được hiển thị.

## 5.2. Điều kiện hiển thị tour
Phương án an toàn cho Sprint 03 là:
- chỉ hiển thị tour có `business_status = 'published'`;
- chỉ hiển thị tour có `visibility_status = 'visible'`;
- không lấy tour đã `is_deleted = true`;
- không lấy dữ liệu đi kèm từ guide profile đang bị ẩn hoặc không phù hợp với hiển thị public.

## 5.3. Điều kiện hiển thị guide profile trên tour
Ở mức hiển thị public, thông tin guide đi kèm tour nên chỉ xuất hiện khi guide profile:
- không bị xóa mềm;
- có `visibility_status = 'visible'`;
- có trạng thái nghề nghiệp đủ an toàn để đưa ra public.

Trong phạm vi sprint này, có thể ưu tiên hiển thị các guide profile đã ở trạng thái `approved` hoặc tối thiểu là trạng thái public phù hợp, để tránh làm rối logic khi demo.

## 5.4. Bộ lọc tối thiểu
Bộ lọc chính thức của Sprint 03 gồm:
- địa điểm;
- thời gian;
- giá;
- loại tour.

Đây là bộ lọc đủ mạnh để demo nhu cầu tìm kiếm thực tế nhưng vẫn vừa sức trong phạm vi đồ án.

## 5.5. Dữ liệu danh sách tour
Mỗi card tour ở danh sách nên hiển thị:
- ảnh cover;
- tiêu đề;
- tỉnh/thành;
- thời gian khởi hành;
- khoảng giá;
- rating trung bình;
- tên hướng dẫn viên hoặc thông tin guide ngắn;
- nhãn loại tour nếu cần.

Không hiển thị quá nhiều trường phụ khiến card nặng và truy vấn khó tối ưu.

## 5.6. Dữ liệu chi tiết tour
Chi tiết tour hiển thị:
- tiêu đề;
- bộ ảnh;
- mô tả;
- địa điểm;
- thời gian bắt đầu – kết thúc;
- điểm hẹn;
- số lượng người tối đa;
- điều kiện tham gia;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

Các hành động phát sinh như gửi yêu cầu tham gia, yêu thích và báo cáo chỉ cần giữ chỗ UI hoặc tích hợp ở mức nhẹ nếu đã có sẵn nền, chưa phải trọng tâm của sprint này.

## 5.7. Rule hiển thị review công khai
Chỉ lấy các review có `visibility_status = 'visible'`. Điểm rating trung bình nếu tính ở danh sách và chi tiết tour cũng phải dựa trên tập review công khai để frontend và backend thống nhất.

## 5.8. Phương án cho trang chủ public
Trang chủ chỉ lấy:
- một nhóm tour nổi bật;
- một nhóm hướng dẫn viên nổi bật;
- một nhóm bài đồng hành mới.

Mục tiêu là tạo điểm vào hệ thống và điều hướng người dùng sang danh sách tour, không biến trang chủ thành màn hình xử lý nghiệp vụ nặng.

## 5.9. Phương án với `tour_locations`
Mặc dù chi tiết tour có thể cần lịch trình, Sprint 03 chỉ nên dùng `tour_locations` ở mức:
- đọc dữ liệu tóm tắt nếu có;
- hiển thị thứ tự điểm dừng;
- chưa làm sâu bản đồ tương tác.

Phần bản đồ lộ trình nên để trọng tâm cho sprint hoàn thiện sau.

---

## 6. Ghi chú triển khai

- Ưu tiên triển khai lần lượt theo thứ tự: **M04 → M05 → M06 → M01** hoặc **M01 → M04 → M05 → M06** tùy cách chia việc, nhưng luồng public cuối cùng phải liền mạch.
- Danh sách tour và chi tiết tour phải dùng chung một rule public, không được mỗi API tự định nghĩa một kiểu.
- Bộ lọc ở Sprint 03 chỉ cần đúng và ổn định, chưa cần quá đẹp hoặc quá tối ưu UX.
- Chi tiết tour nên có khả năng mở từ card tour ở cả trang chủ và danh sách tour.
- Dữ liệu review nên có seed đủ để nhìn ra chênh lệch rating giữa các tour.
- Không nên đưa nghiệp vụ tour request vào quá sâu trong sprint này, vì Sprint 06 mới là nơi xử lý state machine của yêu cầu tham gia tour.
- Nên chuẩn bị ít nhất 8–12 tour mẫu thuộc nhiều tỉnh/thành và 3–5 danh mục tour để việc filter có ý nghĩa khi demo.

---

## 7. Chức năng trọng tâm

Các chức năng trọng tâm của Sprint 03 gồm:

- **F12 – Xem danh sách tour**
  - Cho phép khách truy cập và người dùng xem toàn bộ tour công khai trên hệ thống.
  - Đây là điểm vào quan trọng nhất của phần public.

- **F13 – Tìm kiếm, lọc và sắp xếp tour**
  - Cho phép người dùng tìm tour theo nhu cầu thực tế.
  - Là chức năng thể hiện giá trị sử dụng rõ nhất ở phía khách du lịch.

- **F14 – Xem chi tiết tour**
  - Cho phép xem đầy đủ thông tin của một tour.
  - Là nơi chuẩn bị điều kiện cho các nghiệp vụ phát sinh ở các sprint sau như gửi yêu cầu tham gia, yêu thích, báo cáo và đánh giá.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình
Nhóm màn hình của Sprint 03 phải tạo thành **một hành trình public hoàn chỉnh**:
- vào trang chủ;
- đi sang danh sách tour;
- lọc tour theo nhu cầu;
- mở chi tiết tour để xem sâu hơn.

## 8.2. Các màn hình cần triển khai trong Sprint 03

### M01 – Trang chủ
**Vai trò trong sprint**
- Là màn hình public đầu vào của hệ thống.
- Dùng để giới thiệu nhanh giá trị nền tảng và điều hướng tới danh sách tour.

**Nội dung chính nên có**
- banner giới thiệu hệ thống;
- menu điều hướng;
- block tour nổi bật;
- block hướng dẫn viên nổi bật;
- block bài đồng hành mới;
- nút đi tới danh sách tour;
- chân trang thông tin cơ bản.

**Điểm cần lưu ý**
- Không làm quá nhiều block phụ.
- Nội dung nổi bật nên lấy từ API riêng của trang chủ.
- Tập trung vào khả năng điều hướng rõ ràng.

### M04 – Danh sách tour
**Vai trò trong sprint**
- Là màn hình public quan trọng nhất để người dùng duyệt tour.

**Nội dung chính nên có**
- danh sách card tour;
- ảnh đại diện;
- tên tour;
- địa điểm;
- thời gian;
- giá;
- rating trung bình;
- phân trang.

**Điểm cần lưu ý**
- Card phải dễ đọc, không nhồi quá nhiều thông tin.
- Khi click card phải đi được tới chi tiết tour.
- Dữ liệu phải bám đúng rule public.

### M05 – Tìm kiếm / lọc / sắp xếp tour
**Vai trò trong sprint**
- Là màn hình hoặc khu vực thao tác giúp người dùng thu hẹp danh sách tour theo nhu cầu.

**Nội dung chính nên có**
- ô tìm kiếm;
- bộ lọc địa điểm;
- bộ lọc thời gian;
- bộ lọc giá;
- bộ lọc loại tour;
- tùy chọn sắp xếp;
- danh sách kết quả.

**Điểm cần lưu ý**
- Có thể triển khai dưới dạng một trang riêng hoặc tích hợp với danh sách tour, nhưng trong tài liệu vẫn giữ như một màn hình riêng để thuận tiện mô tả.
- Chỉ giữ bộ lọc tối thiểu đã chốt.

### M06 – Chi tiết tour
**Vai trò trong sprint**
- Là màn hình thể hiện đầy đủ giá trị của dữ liệu tour.
- Là nơi tạo niềm tin cho người dùng trước khi phát sinh các nghiệp vụ khác ở sprint sau.

**Nội dung chính nên có**
- tên tour;
- bộ ảnh;
- mô tả chi tiết;
- lịch trình tóm tắt;
- thời gian bắt đầu – kết thúc;
- điểm hẹn;
- giá;
- số lượng người tối đa;
- điều kiện tham gia;
- thông tin hướng dẫn viên;
- khu vực đánh giá.

**Điểm cần lưu ý**
- Có thể để sẵn nút “Yêu thích”, “Gửi yêu cầu tham gia”, “Báo cáo”, nhưng không cần làm sâu toàn bộ nghiệp vụ trong sprint này.
- Nếu có lịch trình, hiển thị dạng danh sách tóm tắt; chưa cần làm bản đồ nâng cao.

## 8.3. Thành phần UI dùng chung cần tận dụng
Sprint 03 nên tận dụng lại các component đã dựng ở Sprint 01 và Sprint 02 như:
- app/public layout;
- header;
- page container;
- card;
- badge trạng thái;
- filter form;
- pagination;
- empty state;
- loading state;
- error state;
- review list block.

## 8.4. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 03, người dùng có thể:
- vào trang chủ và thấy nội dung chính của nền tảng;
- xem danh sách tour công khai;
- lọc tour theo tiêu chí cơ bản;
- mở chi tiết tour để xem thông tin đầy đủ.

---

## 9. Bảng CSDL chính

## 9.1. `tour_categories`

### Vai trò
Lưu danh mục loại tour để hỗ trợ hiển thị và lọc.

### Trường quan trọng
- `id`
- `name`
- `description`
- `is_active`

### Vai trò trong Sprint 03
- cung cấp dữ liệu cho bộ lọc loại tour;
- hiển thị nhãn loại tour nếu cần;
- hỗ trợ chuẩn hóa dữ liệu đầu ra của danh sách tour.

## 9.2. `tours`

### Vai trò
Là bảng dữ liệu trung tâm của Sprint 03, lưu thông tin cốt lõi của từng tour.

### Trường quan trọng
- `id`
- `guide_profile_id`
- `category_id`
- `title`
- `province`
- `district`
- `start_date`
- `end_date`
- `price`
- `max_participants`
- `meet_point`
- `description`
- `participant_requirements`
- `business_status`
- `visibility_status`
- `published_at`
- `is_deleted`

### Vai trò trong Sprint 03
- cấp dữ liệu cho trang chủ, danh sách tour và chi tiết tour;
- là nguồn chính để filter, sort và phân trang;
- là nơi áp dụng rule public chính thức.

## 9.3. `tour_images`

### Vai trò
Lưu ảnh đại diện và bộ ảnh của tour.

### Trường quan trọng
- `id`
- `tour_id`
- `image_url`
- `caption`
- `sort_order`
- `is_cover`

### Vai trò trong Sprint 03
- lấy ảnh cover cho card tour;
- lấy gallery cho chi tiết tour;
- phục vụ trực quan hóa dữ liệu public.

## 9.4. `guide_profiles`

### Vai trò
Lưu hồ sơ nghề nghiệp của hướng dẫn viên gắn với tour.

### Trường quan trọng
- `id`
- `user_id`
- `bio`
- `years_of_experience`
- `working_area`
- `avatar_url`
- `verification_status`
- `visibility_status`
- `is_accepting_tours`
- `is_deleted`

### Vai trò trong Sprint 03
- cung cấp thông tin hướng dẫn viên đi kèm tour;
- là một phần của rule kiểm soát dữ liệu public;
- chuẩn bị nền cho Sprint 04.

## 9.5. `tour_reviews`

### Vai trò
Lưu đánh giá của người dùng cho tour.

### Trường quan trọng
- `id`
- `tour_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

### Vai trò trong Sprint 03
- hiển thị khu vực đánh giá công khai;
- tính điểm rating trung bình;
- tạo độ tin cậy cho danh sách và chi tiết tour.

## 9.6. Bảng hỗ trợ cần lưu ý thêm: `tour_locations`
Mặc dù không phải bảng trọng tâm chính thức của sprint theo khung kế hoạch, `tour_locations` vẫn có ý nghĩa hỗ trợ cho màn hình chi tiết tour vì:
- chi tiết tour có phần lịch trình tóm tắt;
- một số tour cần hiển thị thứ tự điểm đến;
- sprint sau có thể mở rộng sang bản đồ lộ trình.

Trong Sprint 03, bảng này chỉ nên dùng ở mức hỗ trợ đọc dữ liệu, chưa cần làm sâu UI bản đồ.

## 9.7. Ghi chú triển khai dữ liệu
- Dữ liệu public phải thống nhất ở mọi API.
- Cần tránh để list tour hiển thị một tập dữ liệu khác với detail tour.
- Rating trung bình nên tính dựa trên review công khai.
- Nên có đủ dữ liệu demo để mỗi filter đều cho ra kết quả có ý nghĩa.

---

## 10. API cần thiết

## 10.1. `GET /home/featured-tours`

### Mục đích
Lấy danh sách tour nổi bật cho trang chủ.

### Query gợi ý
- `limit`
- `sort`

### Kết quả mong đợi
Trả về một danh sách tour ngắn gọn gồm:
- id;
- title;
- cover image;
- province;
- start date;
- price;
- rating trung bình.

## 10.2. `GET /home/featured-guides`

### Mục đích
Lấy nhóm hướng dẫn viên nổi bật để hiển thị ở trang chủ.

### Kết quả mong đợi
Trả về danh sách guide ở mức teaser:
- id;
- tên;
- avatar;
- khu vực hoạt động;
- kinh nghiệm;
- trạng thái xác minh phù hợp.

## 10.3. `GET /home/latest-companion-posts`

### Mục đích
Lấy vài bài đồng hành mới để làm block điều hướng trên trang chủ.

### Kết quả mong đợi
Trả về teaser ngắn:
- id;
- title;
- destination;
- start_date;
- estimated_cost.

## 10.4. `GET /tour-categories`

### Mục đích
Lấy danh mục loại tour để đổ vào bộ lọc.

### Kết quả mong đợi
Trả về danh sách category đang hoạt động.

## 10.5. `GET /tours`

### Mục đích
Lấy danh sách tour công khai.

### Query gợi ý
- `keyword`
- `province`
- `categoryId`
- `startDateFrom`
- `startDateTo`
- `minPrice`
- `maxPrice`
- `sortBy`
- `page`
- `limit`

### Kết quả mong đợi
Trả về:
- danh sách tour theo rule public;
- tổng số bản ghi;
- thông tin phân trang;
- dữ liệu đủ dùng cho card danh sách.

## 10.6. `GET /tours/:id`

### Mục đích
Lấy chi tiết một tour công khai.

### Kết quả mong đợi
Trả về đầy đủ:
- thông tin chính của tour;
- ảnh tour;
- guide profile;
- lịch trình tóm tắt nếu có;
- rating trung bình;
- thông tin mô tả cần thiết.

## 10.7. `GET /tours/:id/reviews`

### Mục đích
Lấy danh sách review công khai của tour.

### Query gợi ý
- `page`
- `limit`

### Kết quả mong đợi
Trả về:
- danh sách review công khai;
- rating;
- comment;
- thời gian tạo;
- thông tin người đánh giá ở mức phù hợp nếu có.

## 10.8. Yêu cầu kỹ thuật chung cho API
- Tất cả API public phải dùng chung một rule kiểm tra dữ liệu hiển thị.
- Response phải nhất quán giữa list và detail.
- API list phải hỗ trợ phân trang ngay từ đầu.
- API filter phải xử lý được giá trị rỗng và trường hợp không có kết quả.
- API detail phải trả lỗi rõ ràng nếu tour không tồn tại hoặc không thuộc phạm vi public.

---

## 11. Công việc frontend

## 11.1. Dựng trang chủ public
- Thiết kế bố cục banner;
- dựng block tour nổi bật;
- dựng block guide nổi bật;
- dựng block bài đồng hành mới;
- thêm điều hướng rõ sang danh sách tour.

## 11.2. Dựng danh sách tour
- Thiết kế card tour;
- hiển thị cover image;
- hiển thị địa điểm, thời gian, giá, rating;
- hỗ trợ phân trang;
- thêm empty state và loading state.

## 11.3. Dựng bộ lọc và sắp xếp
- Tạo form filter tối thiểu:
  - địa điểm;
  - thời gian;
  - giá;
  - loại tour.
- Tạo sort option cơ bản.
- Đồng bộ query string với UI để dễ demo và dễ test.

## 11.4. Dựng chi tiết tour
- Hiển thị gallery ảnh;
- khối thông tin tour;
- mô tả chi tiết;
- lịch trình tóm tắt;
- thông tin hướng dẫn viên;
- khu vực review.

## 11.5. Xử lý điều hướng giữa các màn hình
- Từ trang chủ vào danh sách tour;
- từ card tour vào chi tiết tour;
- từ bộ lọc về lại danh sách kết quả;
- giữ trải nghiệm mượt khi reload hoặc đổi query.

## 11.6. Chuẩn hóa trạng thái giao diện
- loading cho trang chủ;
- loading cho danh sách tour;
- loading cho chi tiết tour;
- thông báo không có dữ liệu;
- xử lý lỗi API ở mức thân thiện.

## 11.7. Chuẩn hóa component tái sử dụng
- tour card;
- filter panel;
- review list;
- rating display;
- hero/banner block;
- section heading.

## 11.8. Test flow phía frontend
Cần test tối thiểu:
- vào trang chủ;
- click sang danh sách tour;
- filter theo tỉnh/thành;
- sort lại kết quả;
- mở chi tiết tour;
- xem review;
- trường hợp không có kết quả;
- trường hợp API lỗi.

## 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 03, frontend phải có được một luồng public trông đủ hoàn chỉnh để demo:
- đẹp vừa phải;
- dễ hiểu;
- không lệch dữ liệu với backend;
- có thể dùng làm hình ảnh trong báo cáo.

---

## 12. Công việc backend

## 12.1. Hoàn thiện module `tours`
- Tạo controller/service cho public tour;
- tách rõ logic list, detail, review, category;
- chuẩn hóa DTO cho query filter và response.

## 12.2. Xử lý truy vấn danh sách tour công khai
- Lọc theo rule public;
- hỗ trợ keyword;
- hỗ trợ province;
- hỗ trợ thời gian;
- hỗ trợ khoảng giá;
- hỗ trợ category;
- hỗ trợ sort;
- hỗ trợ pagination.

## 12.3. Xử lý truy vấn chi tiết tour
- Lấy thông tin tour;
- join ảnh;
- join guide profile;
- đọc lịch trình tóm tắt nếu có;
- lấy rating trung bình;
- kiểm tra tour có thuộc phạm vi public hay không.

## 12.4. Xử lý review công khai
- Chỉ lấy review có `visibility_status = 'visible'`;
- hỗ trợ phân trang review nếu cần;
- chuẩn hóa output cho frontend.

## 12.5. Xử lý dữ liệu trang chủ
- Tạo API tour nổi bật;
- tạo API guide nổi bật;
- tạo API bài đồng hành mới;
- tránh join quá nặng trong một endpoint duy nhất.

## 12.6. Tính toán rating trung bình
- Có thể tính trực tiếp trong query hoặc dùng aggregate query riêng;
- phải dùng cùng một cách tính cho list và detail;
- tránh để mỗi endpoint tính khác nhau.

## 12.7. Chuẩn hóa rule public dùng chung
Nên tạo một lớp rule hoặc helper dùng chung cho:
- list tours;
- detail tour;
- featured tours;
- featured guides;
- reviews public.

## 12.8. Logging và kiểm lỗi
- log query filter phổ biến để tiện debug;
- log lỗi detail tour không tồn tại;
- chuẩn hóa mã lỗi khi tour không public hoặc không tìm thấy.

## 12.9. Tối ưu hiệu năng truy vấn
- hạn chế join dư thừa;
- chỉ select trường thật sự cần;
- tận dụng index đã có hoặc chuẩn bị thêm index cần thiết;
- tránh N+1 query ở phần ảnh và review.

## 12.10. Kết quả mong đợi phía backend
Kết thúc Sprint 03, backend phải cấp dữ liệu ổn định cho:
- trang chủ public;
- danh sách tour;
- lọc tour;
- chi tiết tour;
- review công khai.

---

## 13. Công việc database

## 13.1. Seed danh mục tour
- Tạo dữ liệu `tour_categories`;
- bảo đảm có đủ loại tour để filter có tác dụng;
- giữ dữ liệu đơn giản, dễ hiểu, dễ demo.

## 13.2. Seed tour mẫu
- Tạo nhiều tour thuộc nhiều địa điểm;
- đa dạng về giá;
- đa dạng về thời gian;
- có đủ trạng thái để test rule public và rule không public.

## 13.3. Seed ảnh tour
- Mỗi tour nên có ít nhất một cover image;
- một số tour có thêm nhiều ảnh để demo gallery;
- kiểm tra tính đúng đắn của `is_cover`.

## 13.4. Seed guide profile liên quan
- Mỗi tour public cần gắn với một guide profile hợp lệ;
- nên có vài guide ở trạng thái khác nhau để test logic hiển thị;
- avatar và working area nên có dữ liệu mẫu dễ nhìn.

## 13.5. Seed review mẫu
- Tạo review công khai cho một số tour;
- có chênh lệch rating để dễ thấy hiệu quả filter/sort;
- chuẩn bị cả trường hợp tour chưa có review.

## 13.6. Kiểm tra dữ liệu public
- tour public phải đúng `published` + `visible`;
- guide profile phải ở trạng thái phù hợp;
- review hiển thị phải đúng `visible`;
- dữ liệu detail không được lệch với dữ liệu list.

## 13.7. Tối ưu index
Cần chú ý các index phục vụ sprint này:
- `title`
- `province`
- `business_status`
- `visibility_status`
- `category_id`
- `start_date`
- `price`

Ngoài ra, cần bảo đảm:
- `tour_images` truy xuất nhanh theo `tour_id`;
- `tour_locations` truy xuất nhanh theo `tour_id, sequence_no`;
- `tour_reviews` truy xuất nhanh theo `tour_id`.

## 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 03, database phải:
- có dữ liệu đủ đẹp để demo;
- có trạng thái đủ để test logic public;
- có cấu trúc hỗ trợ tốt cho list, detail, filter và review.

---

## 14. Tài liệu/UML

## 14.1. Tài liệu cần hoàn thiện
- Mô tả chức năng F12, F13, F14;
- cập nhật phần màn hình M01, M04, M05, M06;
- cập nhật mapping bảng – màn hình – API liên quan đến public tour.

## 14.2. Activity Diagram cần cập nhật
Cần hoàn thiện các luồng:
- xem danh sách tour;
- tìm kiếm/lọc/sắp xếp tour;
- xem chi tiết tour.

## 14.3. Nội dung nên mô tả rõ trong UML
- actor là khách truy cập và người dùng;
- đầu vào filter;
- bước truy vấn dữ liệu public;
- bước kiểm tra trạng thái hiển thị;
- bước hiển thị danh sách kết quả;
- bước mở chi tiết tour;
- trường hợp không tìm thấy tour hoặc không có dữ liệu phù hợp.

## 14.4. Mục tiêu của phần tài liệu/UML
Phần tài liệu/UML của Sprint 03 phải giúp người đọc nhìn ra:
- vì sao đây là luồng public đầu tiên hoàn chỉnh;
- hệ thống lấy dữ liệu từ đâu;
- điều kiện hiển thị public được kiểm soát như thế nào;
- chi tiết tour liên kết với guide và review ra sao.

---

## 15. Đầu ra

## 15.1. Đầu ra chức năng
- Khách truy cập xem được danh sách tour công khai.
- Người dùng tìm và lọc được tour theo tiêu chí cơ bản.
- Người dùng mở được chi tiết tour để xem đầy đủ thông tin.

## 15.2. Đầu ra giao diện
- Có trang chủ public ở mức dùng được.
- Có danh sách tour dạng card/list rõ ràng.
- Có bộ lọc tối thiểu.
- Có màn hình chi tiết tour với ảnh, mô tả, lịch trình tóm tắt, guide và review.

## 15.3. Đầu ra API
- `GET /home/featured-tours`
- `GET /home/featured-guides`
- `GET /home/latest-companion-posts`
- `GET /tour-categories`
- `GET /tours`
- `GET /tours/:id`
- `GET /tours/:id/reviews`

## 15.4. Đầu ra dữ liệu
- Có danh mục tour;
- có tour mẫu;
- có ảnh tour;
- có guide profile liên quan;
- có review mẫu;
- có dữ liệu đủ để test filter và chi tiết tour.

## 15.5. Đầu ra tài liệu
- Activity Diagram cho F12, F13, F14;
- mô tả màn hình M01, M04, M05, M06;
- mô tả rõ rule hiển thị public của tour.

## 15.6. Tiêu chí sẵn sàng sang Sprint 04
Sprint 03 được xem là đủ tốt để sang Sprint 04 khi:
- luồng public xem tour đã ổn định;
- dữ liệu guide đã bắt đầu xuất hiện cùng tour;
- API detail đã có nền để mở rộng sâu sang hồ sơ guide;
- frontend đã có pattern hiển thị public nhất quán;
- database đã có đủ dữ liệu mẫu và index phục vụ truy vấn public.

---

## 16. Kết luận sprint

Sprint 03 là sprint chuyển dự án từ giai đoạn “có nền kỹ thuật và auth” sang giai đoạn “thấy được giá trị thật của hệ thống”. Nếu Sprint 01 là móng, Sprint 02 là lớp xác thực và phân quyền, thì Sprint 03 chính là **luồng public đầu tiên có thể demo thuyết phục**.

Kết thúc sprint này, hệ thống cần cho phép khách truy cập:
- xem danh sách tour;
- tìm tour phù hợp;
- mở chi tiết tour để xem đầy đủ thông tin.

Đây là tiền đề trực tiếp để bước sang Sprint 04 – hồ sơ hướng dẫn viên công khai, nơi người dùng không chỉ xem tour mà còn bắt đầu nhìn rõ “người tổ chức tour” trong hệ thống.
