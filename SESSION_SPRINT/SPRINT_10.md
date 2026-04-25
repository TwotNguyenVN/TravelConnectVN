# SPRINT 10 – Hoàn thiện nhóm ưu tiên 2: yêu thích, đánh giá và xác minh hồ sơ

## 1. Mục tiêu sprint

Sprint 10 là sprint bổ sung lớp chức năng **ưu tiên 2** sau khi phần MVP lõi đã được ổn định ở Sprint 09. Nếu Sprint 01–09 giúp hệ thống hình thành được các luồng bắt buộc để demo, thì Sprint 10 giúp sản phẩm **“dày hơn”, đáng tin hơn và có tính cá nhân hóa rõ hơn**.

Trọng tâm của sprint này không còn nằm ở việc mở thêm một trục nghiệp vụ hoàn toàn mới, mà là bổ sung ba nhóm chức năng có giá trị thực tế cao:

- **F05 – Quản lý danh sách yêu thích**
- **F09 – Xác minh hồ sơ hướng dẫn viên**
- **F18 – Đánh giá tour và hướng dẫn viên**

Ba nhóm này có vai trò khác nhau nhưng liên kết chặt với nhau:

- **favorite** giúp người dùng lưu lại đối tượng quan tâm để quay lại sau;
- **review** giúp tăng độ tin cậy xã hội của tour và guide;
- **verification** giúp tăng độ tin cậy nghề nghiệp của hồ sơ hướng dẫn viên.

### Mục tiêu chính
- Bổ sung chức năng **lưu / bỏ lưu tour và hướng dẫn viên** ở mức đủ dùng, dễ demo và dễ nối với các màn hình chi tiết.
- Cho phép người dùng **đánh giá tour** và **đánh giá hướng dẫn viên** theo điều kiện nghiệp vụ rõ ràng, tránh biến review thành dữ liệu “ảo”.
- Cho phép hướng dẫn viên **gửi yêu cầu xác minh hồ sơ** và tải lên giấy tờ/chứng chỉ theo một luồng đơn giản, nhất quán với schema cuối.
- Mở rộng các màn hình đang có:
  - **M06 – Chi tiết tour**
  - **M09 – Hồ sơ hướng dẫn viên công khai**
  để hiển thị tốt hơn thông tin review, điểm trung bình và trạng thái yêu thích.
- Hoàn thiện các màn hình riêng:
  - **M18 – Danh sách yêu thích**
  - **M27 – Đánh giá tour**
  - **M28 – Đánh giá hướng dẫn viên**
  - **M33 – Xác minh hồ sơ hướng dẫn viên**
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** cho toàn bộ nhóm ưu tiên 2 này.
- Giữ đúng nguyên tắc: **không làm phình sprint**, không kéo sâu sang chat, notification thời gian thực, moderation review phức tạp hay analytics nâng cao.

### Ý nghĩa của sprint này
Sprint 10 là bước chuyển từ một MVP lõi “đủ chạy luồng” sang một phiên bản có chiều sâu hơn về trải nghiệm và độ tin cậy. Đây là sprint rất phù hợp để:

- tăng chất lượng trình diễn đồ án;
- làm phần báo cáo phong phú hơn;
- cho thấy hệ thống không chỉ xử lý CRUD cơ bản mà còn có logic cộng đồng, tín nhiệm và xác minh.

Nếu làm tốt Sprint 10, khi bảo vệ đồ án bạn sẽ có thêm các điểm cộng sau:

- hệ thống có **tính cá nhân hóa** thông qua favorite;
- hệ thống có **tính phản hồi cộng đồng** thông qua review;
- hệ thống có **cơ chế tăng uy tín cho guide** thông qua verification;
- các màn hình chi tiết tour/guide nhìn “thật sản phẩm” hơn, không còn chỉ là trang đọc thông tin tĩnh.

---

## 2. Lưu ý trước khi triển khai

### 2.1. Đây là sprint ưu tiên 2, không được phá vỡ MVP lõi
Sprint 10 chỉ nên bắt đầu sau khi Sprint 09 đã làm ổn định các luồng chính.  
Không nên dùng sprint này để sửa nền quá nhiều, cũng không nên kéo thêm các nhóm mở rộng như:

- chat trực tiếp;
- chat nhóm;
- thông báo thời gian thực đầy đủ;
- gợi ý tour;
- AI chatbot;
- thanh toán;
- tích hợp lưu trú.

Nếu trong lúc triển khai xuất hiện lỗi nền của Sprint 01–09, chỉ sửa các lỗi ảnh hưởng trực tiếp tới favorite, review hoặc verification. Những lỗi nền nhỏ khác nên gom lại để xử lý có kiểm soát, tránh làm loãng mục tiêu sprint.

### 2.2. Review phải có điều kiện nghiệp vụ rõ ràng
Đây là lưu ý quan trọng nhất của Sprint 10.  
Không được cho phép mọi user đã đăng nhập đều đánh giá tùy ý, vì như vậy dữ liệu đánh giá sẽ mất giá trị nghiệp vụ và mất tính thuyết phục khi demo.

Cần chốt rõ:
- user chỉ được review khi có **tour_request hợp lệ**;
- request đó phải thuộc tour tương ứng;
- request phải ở trạng thái đủ điều kiện, tối thiểu là **approved** hoặc **paid** theo rule triển khai;
- một request chỉ được tạo review đúng số lần cho phép.

### 2.3. Verification không được biến thành hệ thống xử lý hồ sơ quá nặng
Trong phạm vi đồ án sinh viên, verification chỉ cần đi tới mức:

- guide tạo yêu cầu xác minh;
- guide tải tài liệu lên;
- admin/backoffice có thể xem và xử lý ở sprint quản trị liên quan;
- trạng thái xác minh phản ánh lại ở guide profile và dashboard.

Không nên làm quá sâu các nội dung như:
- OCR giấy tờ;
- chấm điểm hồ sơ tự động;
- đối soát danh tính nhiều bước;
- phê duyệt nhiều cấp;
- lưu trữ pháp lý phức tạp.

### 2.4. Phải thống nhất state machine với schema final
Tài liệu lưu ý có nhắc tới hướng trạng thái như `draft`, `submitted`, `approved`, `rejected` cho verification. Tuy nhiên schema final hiện tại của dự án đã chốt:

- `guide_verification_requests.status`: `pending`, `approved`, `rejected`
- `guide_verification_documents.status`: `submitted`, `accepted`, `rejected`

Vì Sprint 10 là sprint hiện thực hóa, **phải ưu tiên bám schema final** để tránh lệch giữa CSDL, API và tài liệu triển khai.

### 2.5. Favorite là chức năng nhỏ nhưng cần làm gọn và chắc
Favorite dễ bị xem là “chức năng phụ”, nhưng lại là chức năng rất hiệu quả khi demo.  
Chỉ cần làm tốt các hành vi sau là đủ:
- lưu tour;
- bỏ lưu tour;
- lưu guide;
- bỏ lưu guide;
- xem danh sách đã lưu theo hai tab.

Không cần làm sâu:
- phân nhóm yêu thích;
- ghi chú cá nhân;
- đề xuất từ danh sách yêu thích;
- sync thông báo theo favorite.

### 2.6. Seed dữ liệu là yếu tố bắt buộc
Sprint 10 gần như không thể nhìn “ra sản phẩm” nếu không có dữ liệu mẫu đủ tốt.  
Cần seed sẵn:

- một số tour đã có review;
- một số guide đã có review;
- dữ liệu favorite cho ít nhất 2–3 user mẫu;
- ít nhất 1–2 guide đã gửi verification request với tài liệu mẫu;
- điểm trung bình hiển thị được ở danh sách/chi tiết.

---

## 3. Các vấn đề cần xác định trong sprint này

### 3.1. Phạm vi thật của chức năng yêu thích
Cần xác định Sprint 10 chỉ triển khai favorite cho:
- **tour**
- **guide**

Không mở thêm:
- favorite companion post;
- favorite accommodation;
- favorite chat/contact.

Việc giới hạn đúng phạm vi giúp module `favorites` gọn, dễ kiểm thử và dễ báo cáo.

### 3.2. Điều kiện tạo review
Cần chốt rõ rule tạo review:
- user phải là chủ của `tour_request`;
- `tour_request` phải thuộc đúng `tour_id`;
- `guide_review` phải gắn với đúng `guide_profile_id` của tour;
- trạng thái request phải đủ điều kiện;
- không được review hộ người khác;
- không được review khi request đã bị từ chối hoặc hủy.

Đây là rule quyết định chất lượng nghiệp vụ của cả Sprint 10.

### 3.3. Một request được tạo bao nhiêu review
Theo schema final:
- `tour_reviews.tour_request_id` là `unique`
- `guide_reviews.tour_request_id` cũng là `unique`

Điều đó ngụ ý:
- một `tour_request` có thể tạo **tối đa 1 tour review**
- và **tối đa 1 guide review**

Đây là mô hình hợp lý nhất cho phạm vi đồ án:
- đủ chặt để chống spam;
- vẫn phản ánh được việc user đánh giá cả tour lẫn guide.

### 3.4. Điều kiện hiển thị review công khai
Không phải mọi review sinh ra đều được hiển thị công khai ngay theo mọi ngữ cảnh.  
Cần xác định rõ:
- chỉ hiển thị review có `visibility_status = 'visible'`;
- review bị `hidden` hoặc `flagged` vẫn lưu trong hệ thống nhưng không xuất hiện ở UI public;
- dữ liệu điểm trung bình ở tour/guide nên chỉ tính từ review đang hiển thị.

### 3.5. Luồng verification của hướng dẫn viên
Cần quyết định:
- mỗi guide có được tạo nhiều request hay không;
- có cho phép tạo request mới khi đang có request `pending` không;
- document upload diễn ra trước hay sau khi tạo request;
- guide có được sửa request sau khi gửi không;
- admin xử lý request ở sprint này hay chỉ chuẩn bị dữ liệu cho sprint quản trị liên quan.

### 3.6. Mức độ tích hợp lên M06 và M09
M06 và M09 đã tồn tại từ sprint trước, nên Sprint 10 chỉ nên mở rộng đúng phần cần thiết:
- M06:
  - nút lưu/bỏ lưu tour;
  - khu vực điểm trung bình;
  - danh sách review tour;
  - nút mở form đánh giá nếu đủ điều kiện.
- M09:
  - nút lưu/bỏ lưu guide;
  - badge xác minh;
  - điểm trung bình của guide;
  - danh sách review guide.

Không nên làm lại toàn bộ layout hai màn hình này.

### 3.7. Dữ liệu tài liệu xác minh sẽ lưu theo hướng nào
Cần chốt rõ:
- file thực tế lưu ở storage;
- database chỉ lưu `file_url`, `document_type`, `status`, `note`;
- metadata tài liệu phải đủ để admin đọc và xử lý;
- không lưu binary trực tiếp vào database.

### 3.8. Có thay đổi schema hay không
Cần rà soát:
- nhiều ràng buộc của Sprint 10 đã có sẵn trong schema final;
- `favorite_tours` và `favorite_guides` đã có primary key dạng composite;
- `tour_reviews` và `guide_reviews` đã có unique theo `tour_request_id`.

Vì vậy Sprint 10 **không nên tạo schema rẽ nhánh mới**.  
Chỉ bổ sung:
- index nếu thực sự cần;
- seed data;
- policy/RLS hoặc service validation;
- migration nhỏ nếu phát hiện thiếu trường phụ thực sự bắt buộc.

---

## 4. Hạng mục cần chốt

### 4.1. Hạng mục yêu thích
- phạm vi favorite chỉ gồm tour và guide;
- hành vi gồm add / remove / list;
- danh sách yêu thích chia 2 tab;
- hiển thị tóm tắt và liên kết về màn hình chi tiết.

### 4.2. Hạng mục đánh giá
- điều kiện đủ để review;
- số lần review tối đa theo `tour_request`;
- kiểu dữ liệu rating;
- cách hiển thị comment;
- logic tính điểm trung bình;
- phạm vi hiển thị công khai và ẩn.

### 4.3. Hạng mục xác minh hồ sơ guide
- trạng thái request;
- trạng thái tài liệu;
- rule một guide có request `pending` hay không;
- loại tài liệu được chấp nhận;
- cách phản hồi kết quả;
- nơi hiển thị trạng thái xác minh.

### 4.4. Hạng mục hiển thị UI
- M18;
- M27;
- M28;
- M33;
- phần mở rộng tại M06 và M09.

### 4.5. Hạng mục kỹ thuật backend
- chia module `favorites`, `reviews`, `guide-verification`;
- chuẩn hóa DTO/validation;
- ownership check;
- public query cho review;
- private query cho verification;
- rule tích hợp với admin ở mức vừa đủ.

### 4.6. Hạng mục dữ liệu
- seed review mẫu;
- seed favorite mẫu;
- seed verification request và document mẫu;
- chuẩn bị dữ liệu tính rating trung bình;
- dữ liệu hiển thị được trên cả public area và guide area.

### 4.7. Hạng mục tài liệu/UML
- Activity Diagram cho favorite;
- Activity Diagram cho review tour;
- Activity Diagram cho review guide;
- Activity Diagram cho gửi xác minh hồ sơ;
- cập nhật mô tả màn hình M18, M27, M28, M33;
- rà soát mapping chức năng – API – bảng.

---

## 5. Phương án được chọn

## 5.1. Phạm vi triển khai favorite
Phương án được chọn là:
- triển khai favorite cho **tour** và **guide**;
- favorite hoạt động theo cơ chế **toggle đơn giản**:
  - đã lưu thì bỏ lưu;
  - chưa lưu thì thêm vào;
- danh sách yêu thích tách thành 2 nhóm:
  - tour yêu thích;
  - hướng dẫn viên yêu thích.

Đây là phương án phù hợp nhất vì:
- ít rủi ro;
- dễ nối với M06 và M09;
- dễ tạo cảm giác sản phẩm “thật” khi demo.

## 5.2. Điều kiện đánh giá được chọn
Phương án được chọn là:
- user chỉ được review nếu có `tour_request` của chính mình;
- `tour_request.status` phải ở mức đã tham gia/được chấp nhận đủ điều kiện, tối thiểu là:
  - `approved`
  - hoặc `paid`
- review phải gắn với đúng `tour_id`, `guide_profile_id`, `tour_request_id`, `user_id`;
- không cho phép tạo review nếu request:
  - `rejected`
  - `cancelled_by_user`
  - `cancelled_by_guide`

Đây là hướng hợp lý nhất vì vừa bám nghiệp vụ tour request, vừa bám được ràng buộc của schema final.

## 5.3. Quy tắc số lần review
Phương án được chọn là:
- một `tour_request` được tạo tối đa:
  - **1 review cho tour**
  - **1 review cho guide**
- không cho sửa/xóa review quá sâu trong Sprint 10;
- nếu cần cập nhật, chỉ mở mức chỉnh sửa nhẹ trong nội bộ owner hoặc để Sprint sau.

Hướng này giúp:
- giảm độ phức tạp;
- tránh spam review;
- bám sát unique constraint hiện có.

## 5.4. Mô hình trạng thái verification được chọn
Mặc dù tài liệu lưu ý từng gợi ý hướng `draft/submitted/approved/rejected`, Sprint 10 chốt theo **schema final**:

- `guide_verification_requests.status`
  - `pending`
  - `approved`
  - `rejected`

- `guide_verification_documents.status`
  - `submitted`
  - `accepted`
  - `rejected`

Đây là lựa chọn bắt buộc để:
- không lệch giữa database và backend;
- không phải sửa nhiều tài liệu kỹ thuật về sau;
- giữ đồng bộ với phần admin verification.

## 5.5. Quy tắc active verification request
Schema hiện tại chưa thể hiện bằng unique partial index cho rule “mỗi guide chỉ có 1 request pending”.  
Phương án được chọn là:

- **enforce tại service layer** trong Sprint 10;
- một guide **không được tạo request mới nếu đang có request `pending`**;
- guide có thể tạo request mới khi request cũ đã:
  - `approved`
  - hoặc `rejected`

Đây là cách an toàn vì không phải thay đổi mạnh schema final, nhưng vẫn giữ logic nghiệp vụ chặt.

## 5.6. Phạm vi upload tài liệu xác minh
Phương án được chọn là:
- guide tạo request trước;
- sau đó upload 1 hoặc nhiều tài liệu vào request đó;
- file lưu ở storage;
- DB chỉ lưu metadata:
  - `verification_request_id`
  - `document_type`
  - `file_url`
  - `status`
  - `note`

Hướng này phù hợp với phạm vi đồ án và dễ nối với Supabase Storage.

## 5.7. Phạm vi hiển thị review công khai
Phương án được chọn là:
- ở public area chỉ hiển thị review có `visibility_status = 'visible'`;
- `hidden` và `flagged` là dữ liệu nội bộ hoặc moderation;
- điểm trung bình của tour/guide chỉ tính trên review visible;
- nếu chưa có review thì hiển thị rõ trạng thái “chưa có đánh giá”.

## 5.8. Phạm vi tích hợp M06 và M09
M06 và M09 chỉ mở rộng ở mức:
- nút favorite;
- badge xác minh;
- danh sách review public;
- summary rating;
- CTA đánh giá khi đủ điều kiện.

Không làm:
- trang moderation review riêng cho user;
- analytics review;
- so sánh guide nâng cao;
- đề xuất từ favorite.

## 5.9. Chia module backend
Phương án được chọn:
- module `favorites`
- module `reviews`
- module `guide-verification`

Ba module này tách khỏi:
- `tours`
- `guides`
- `admin`

nhưng vẫn dùng chung:
- auth guard;
- role guard;
- ownership helper;
- response format chuẩn.

---

## 6. Ghi chú triển khai

### 6.1. Thứ tự triển khai nên làm
Nên triển khai theo thứ tự:
1. **favorite**
2. **review**
3. **verification**

Lý do:
- favorite dễ làm, ít rủi ro, tạo hiệu ứng UI nhanh;
- review có nhiều rule nghiệp vụ hơn, nên làm sau khi M06/M09 đã ổn;
- verification có upload/document/status nên phức tạp hơn, làm cuối sprint để không chặn các phần khác.

### 6.2. Không làm sâu CRUD review
Trong Sprint 10 chỉ cần:
- tạo review;
- lấy review public;
- hiển thị review.

Không bắt buộc làm:
- edit review;
- delete review;
- moderation review đầy đủ ở user side;
- phản hồi review;
- like/dislike review.

### 6.3. Verification chỉ cần đủ cho guide gửi hồ sơ
Phần xử lý phê duyệt sâu có thể nối với admin, nhưng bản thân Sprint 10 không nên biến thành sprint quản trị mới.  
Mục tiêu là:
- guide gửi được hồ sơ;
- trạng thái được lưu;
- dữ liệu đủ để admin xem/duyệt ở sprint quản trị liên quan.

### 6.4. Luôn kiểm tra ownership
Các luồng của Sprint 10 đều phải kiểm tra ownership:
- chỉ user của mình mới xem danh sách favorite cá nhân;
- chỉ chủ request mới được tạo review từ request đó;
- chỉ chủ guide profile mới được gửi verification cho profile của mình;
- chỉ owner/backoffice mới xem được hồ sơ xác minh tương ứng.

### 6.5. Quy tắc “xong sprint”
Sprint 10 chỉ được coi là hoàn thành khi:
- có API chạy được;
- có màn hình nối API;
- có dữ liệu demo;
- có test luồng tối thiểu;
- có cập nhật UML/tài liệu;
- M06 và M09 hiển thị được favorite/review/verification state theo dữ liệu thật.

### 6.6. Dữ liệu demo nên chuẩn bị
Cần chuẩn bị ít nhất:
- 3–5 tour có review;
- 3–5 guide có review;
- 2–3 user có favorite tour;
- 2–3 user có favorite guide;
- 1 guide đã approved verification;
- 1 guide đang pending verification;
- 1 guide từng bị rejected verification;
- dữ liệu comment review đủ đa dạng để màn hình nhìn tự nhiên.

---

## 7. Chức năng trọng tâm

### F05. Quản lý danh sách yêu thích
Mục tiêu của F05 là cho phép người dùng lưu lại các tour và hướng dẫn viên mà mình quan tâm để tiện quay lại sau.  
Trong Sprint 10, F05 được triển khai ở mức vừa đủ để:
- lưu tour;
- bỏ lưu tour;
- lưu guide;
- bỏ lưu guide;
- xem danh sách yêu thích theo hai nhóm.

Giá trị chính của chức năng này là:
- tăng tính cá nhân hóa;
- tăng cảm giác gắn bó của user với hệ thống;
- tạo dữ liệu nền cho gợi ý tour ở các sprint sau.

### F09. Xác minh hồ sơ hướng dẫn viên
Mục tiêu của F09 là tăng độ tin cậy cho hồ sơ hướng dẫn viên thông qua cơ chế gửi giấy tờ/chứng chỉ để xác minh.  
Trong Sprint 10, F09 được triển khai ở mức:
- guide tạo verification request;
- guide upload document;
- guide theo dõi trạng thái request và tài liệu;
- hệ thống hiển thị lại trạng thái xác minh ở các nơi liên quan.

Giá trị chính:
- làm rõ sự khác biệt giữa guide chưa xác minh và đã xác minh;
- tăng độ thuyết phục cho hồ sơ công khai;
- tạo cơ sở cho admin verification flow.

### F18. Đánh giá tour và hướng dẫn viên
Mục tiêu của F18 là bổ sung kênh phản hồi chất lượng từ người dùng sau khi tham gia tour.  
Trong Sprint 10, F18 tập trung vào:
- tạo review tour;
- tạo review guide;
- lấy review công khai;
- hiển thị rating trung bình và danh sách review ở trang chi tiết.

Giá trị chính:
- tăng uy tín cộng đồng;
- làm dữ liệu tour/guide trở nên sống động hơn;
- hỗ trợ người dùng khác ra quyết định.

### Kết luận cho nhóm chức năng
Ba nhóm F05, F09, F18 là lớp hoàn thiện tự nhiên sau MVP lõi.  
Chúng không thay đổi cấu trúc nền của hệ thống, nhưng giúp sản phẩm:
- có chiều sâu hơn;
- có giá trị demo cao hơn;
- thuyết phục hơn khi bảo vệ.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình
Phần màn hình của Sprint 10 phải đạt được hai mục tiêu:
- có các màn hình riêng cho nhóm nghiệp vụ mới;
- mở rộng đúng mức các màn hình chi tiết đang có để dữ liệu được nhìn thấy ở đúng nơi người dùng cần.

## 8.2. M18 – Danh sách yêu thích
Màn hình này thuộc **User Area**.

### Mục tiêu
- cho người dùng xem lại các đối tượng đã lưu;
- điều hướng nhanh về chi tiết tour hoặc hồ sơ guide;
- bỏ lưu trực tiếp ngay trên danh sách nếu cần.

### Nội dung chính
- hai tab:
  - **Tour yêu thích**
  - **Hướng dẫn viên yêu thích**
- card hoặc table hiển thị:
  - ảnh đại diện;
  - tiêu đề/tên;
  - thông tin tóm tắt;
  - thời gian lưu;
  - nút bỏ lưu;
  - liên kết xem chi tiết.

### Trạng thái UI cần có
- loading;
- empty state cho từng tab;
- error state;
- confirm hoặc feedback nhẹ khi bỏ lưu.

## 8.3. M27 – Đánh giá tour
Màn hình này là form để user chấm điểm và nhận xét cho tour.

### Mục tiêu
- tạo review cho tour sau khi user đủ điều kiện;
- bám đúng tour và đúng request liên quan.

### Nội dung chính
- thông tin tour ngắn gọn;
- rating 1–5 sao;
- ô nhận xét;
- thông tin request liên quan;
- nút gửi đánh giá;
- cảnh báo nếu user không đủ điều kiện.

### Rule hiển thị
- chỉ mở cho user đã đăng nhập;
- chỉ hiển thị CTA khi có request hợp lệ;
- nếu đã review rồi thì hiển thị trạng thái đã đánh giá.

## 8.4. M28 – Đánh giá hướng dẫn viên
Màn hình này tương tự M27 nhưng áp dụng cho guide.

### Mục tiêu
- cho phép user đánh giá chất lượng hướng dẫn viên;
- tạo dữ liệu điểm trung bình và nhận xét công khai cho guide profile.

### Nội dung chính
- thông tin guide;
- tour liên quan;
- rating 1–5 sao;
- ô nhận xét;
- trạng thái review hiện tại;
- nút gửi.

### Ghi chú
M27 và M28 có thể tái sử dụng chung component form review để giảm công phát triển frontend.

## 8.5. M33 – Xác minh hồ sơ hướng dẫn viên
Màn hình này thuộc **Guide Area**.

### Mục tiêu
- cho guide gửi hồ sơ xác minh;
- theo dõi các lần gửi và kết quả xử lý.

### Nội dung chính
- danh sách request đã gửi;
- trạng thái từng request;
- biểu mẫu tạo request mới;
- phần upload tài liệu;
- loại tài liệu;
- ghi chú gửi;
- phản hồi kết quả nếu đã xử lý.

### Trạng thái cần có
- chưa từng gửi;
- đang chờ xử lý;
- đã được duyệt;
- bị từ chối.

## 8.6. M06 – Chi tiết tour (mở rộng trong Sprint 10)
M06 đã có từ sprint trước, Sprint 10 chỉ bổ sung:

- nút **lưu / bỏ lưu tour**;
- summary rating:
  - điểm trung bình;
  - số lượng review;
- danh sách review công khai;
- CTA mở form đánh giá nếu user đủ điều kiện.

### Không làm sâu
- không nhúng editor review quá nặng vào chính M06;
- không làm moderation review tại đây;
- không làm phân tích review nâng cao.

## 8.7. M09 – Hồ sơ hướng dẫn viên công khai (mở rộng trong Sprint 10)
M09 được bổ sung:

- nút **lưu / bỏ lưu guide**;
- badge xác minh;
- điểm đánh giá trung bình của guide;
- danh sách review guide công khai;
- CTA đánh giá khi đủ điều kiện.

### Mục tiêu
M09 phải giúp người xem trả lời nhanh ba câu hỏi:
- guide này có được xác minh chưa;
- guide này được đánh giá ra sao;
- tôi có muốn lưu hồ sơ này lại hay không.

## 8.8. Kết quả mong đợi của phần màn hình
Kết thúc Sprint 10:
- user nhìn thấy được toàn bộ luồng favorite của mình ở M18;
- user đánh giá được tour/guide từ M27/M28;
- guide gửi xác minh được ở M33;
- M06 và M09 nhìn “đủ sản phẩm” hơn nhờ favorite + review + verification badge.

---

## 9. Bảng CSDL chính

## 9.1. `favorite_tours`

### Vai trò
Lưu quan hệ yêu thích giữa người dùng và tour.

### Thuộc tính quan trọng
- `user_id`
- `tour_id`
- `created_at`

### Ràng buộc đáng chú ý
- khóa chính composite: `(user_id, tour_id)`

### Ý nghĩa trong Sprint 10
Bảng này đủ để triển khai trọn vẹn:
- lưu tour;
- bỏ lưu tour;
- truy vấn danh sách tour yêu thích của user.

## 9.2. `favorite_guides`

### Vai trò
Lưu quan hệ yêu thích giữa người dùng và hồ sơ hướng dẫn viên.

### Thuộc tính quan trọng
- `user_id`
- `guide_profile_id`
- `created_at`

### Ràng buộc đáng chú ý
- khóa chính composite: `(user_id, guide_profile_id)`

### Ý nghĩa trong Sprint 10
Bảng này phục vụ:
- lưu guide;
- bỏ lưu guide;
- hiển thị danh sách guide yêu thích.

## 9.3. `tour_reviews`

### Vai trò
Lưu đánh giá của người dùng đối với tour.

### Thuộc tính quan trọng
- `id`
- `tour_id`
- `tour_request_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

### Ràng buộc đáng chú ý
- `rating` từ 1 đến 5;
- `tour_request_id` là `unique`;
- có `visibility_status` để phục vụ moderation.

### Ý nghĩa trong Sprint 10
Bảng này là lõi của:
- form đánh giá tour;
- hiển thị điểm trung bình;
- hiển thị danh sách review public ở M06.

## 9.4. `guide_reviews`

### Vai trò
Lưu đánh giá của người dùng đối với hướng dẫn viên.

### Thuộc tính quan trọng
- `id`
- `guide_profile_id`
- `tour_id`
- `tour_request_id`
- `user_id`
- `rating`
- `comment`
- `visibility_status`
- `created_at`

### Ràng buộc đáng chú ý
- `rating` từ 1 đến 5;
- `tour_request_id` là `unique`;
- review gắn với đúng guide đã tổ chức tour.

### Ý nghĩa trong Sprint 10
Bảng này giúp:
- hiển thị uy tín của guide;
- tính điểm trung bình của guide;
- hiển thị review tại M09.

## 9.5. `guide_verification_requests`

### Vai trò
Lưu yêu cầu xác minh hồ sơ hướng dẫn viên.

### Thuộc tính quan trọng
- `id`
- `guide_profile_id`
- `submitted_at`
- `status`
- `submission_note`
- `processed_by_user_id`
- `processed_at`
- `result_note`

### Trạng thái được chốt
- `pending`
- `approved`
- `rejected`

### Ý nghĩa trong Sprint 10
Đây là bảng đại diện cho “hồ sơ gửi xác minh” ở cấp request.

## 9.6. `guide_verification_documents`

### Vai trò
Lưu metadata các tài liệu gắn với một verification request.

### Thuộc tính quan trọng
- `id`
- `verification_request_id`
- `document_type`
- `file_url`
- `uploaded_at`
- `status`
- `note`

### Trạng thái được chốt
- `submitted`
- `accepted`
- `rejected`

### Loại tài liệu được chốt
- `national_id`
- `tour_guide_card`
- `certificate`
- `license`
- `other`

### Ý nghĩa trong Sprint 10
Bảng này giúp guide upload nhiều loại tài liệu vào cùng một request và giúp admin/backoffice xử lý theo từng tài liệu nếu cần.

## 9.7. Bảng phụ thuộc cần dùng kèm
Mặc dù không phải “bảng chính” của Sprint 10, nhưng các bảng sau là phụ thuộc bắt buộc:

- `tours`
- `guide_profiles`
- `tour_requests`
- `users`

Lý do:
- favorite phải join về tour/guide để hiển thị;
- review phải dựa trên `tour_requests`;
- verification phải gắn với `guide_profiles`;
- toàn bộ ownership và hiển thị công khai đều phải nối với `users`.

## 9.8. Ghi chú quan trọng về schema
Sprint 10 nên giữ nguyên tinh thần **schema 38 bảng là chuẩn cuối**.  
Không nên tách thêm bảng favorite hay review mới ngoài mô hình đã chốt.  
Các rule còn thiếu ở mức constraint cứng có thể xử lý tại service layer nếu việc thay đổi schema làm tăng rủi ro.

---

## 10. API cần thiết

## 10.1. `POST /favorites/tours/:tourId`

### Mục đích
Thêm tour vào danh sách yêu thích của user hiện tại.

### Yêu cầu
- đã đăng nhập;
- `tourId` hợp lệ;
- tour còn cho phép hiển thị theo rule nghiệp vụ.

### Kết quả mong đợi
- tạo bản ghi tại `favorite_tours`;
- trả về trạng thái đã lưu.

## 10.2. `DELETE /favorites/tours/:tourId`

### Mục đích
Bỏ tour khỏi danh sách yêu thích.

### Yêu cầu
- đã đăng nhập;
- chỉ thao tác trên favorite của chính mình.

### Kết quả mong đợi
- xóa quan hệ favorite tương ứng;
- UI cập nhật tức thời.

## 10.3. `GET /me/favorites/tours`

### Mục đích
Lấy danh sách tour yêu thích của user.

### Kết quả mong đợi
- trả danh sách có join thông tin tour;
- hỗ trợ phân trang nếu muốn;
- có empty state rõ ràng.

## 10.4. `POST /favorites/guides/:guideId`

### Mục đích
Thêm guide vào danh sách yêu thích.

### Yêu cầu
- đã đăng nhập;
- `guideId` hợp lệ;
- guide profile tồn tại.

### Kết quả mong đợi
- tạo bản ghi tại `favorite_guides`.

## 10.5. `DELETE /favorites/guides/:guideId`

### Mục đích
Bỏ lưu guide.

### Kết quả mong đợi
- xóa favorite tương ứng;
- cập nhật lại trạng thái UI.

## 10.6. `GET /me/favorites/guides`

### Mục đích
Lấy danh sách guide yêu thích.

### Kết quả mong đợi
- có thông tin cơ bản của guide;
- có trạng thái xác minh và điểm đánh giá nếu cần.

## 10.7. `POST /tour-reviews`

### Mục đích
Tạo đánh giá cho tour.

### Body gợi ý
- `tourId`
- `tourRequestId`
- `rating`
- `comment`

### Yêu cầu
- đã đăng nhập;
- owner của `tourRequestId`;
- request đủ điều kiện review;
- chưa có `tour_review` cho request đó.

### Kết quả mong đợi
- tạo 1 bản ghi trong `tour_reviews`;
- cập nhật được dữ liệu hiển thị ở M06.

## 10.8. `POST /guide-reviews`

### Mục đích
Tạo đánh giá cho hướng dẫn viên.

### Body gợi ý
- `guideProfileId`
- `tourId`
- `tourRequestId`
- `rating`
- `comment`

### Yêu cầu
- user phải là chủ request;
- request thuộc đúng tour;
- guide phải là guide của tour tương ứng;
- chưa có `guide_review` cho request đó.

### Kết quả mong đợi
- tạo bản ghi trong `guide_reviews`;
- M09 hiển thị được review mới sau refresh hoặc cập nhật cục bộ.

## 10.9. `GET /tours/:id/reviews`

### Mục đích
Lấy danh sách review công khai của một tour.

### Kết quả mong đợi
- chỉ trả review `visible`;
- có rating trung bình;
- có tổng số review;
- có thể hỗ trợ phân trang.

## 10.10. `GET /guides/:id/reviews`

### Mục đích
Lấy danh sách review công khai của guide.

### Kết quả mong đợi
- danh sách review visible;
- điểm trung bình;
- số lượt đánh giá.

## 10.11. `POST /guide-verification/requests`

### Mục đích
Tạo yêu cầu xác minh hồ sơ guide.

### Body gợi ý
- `guideProfileId`
- `submissionNote`

### Yêu cầu
- user có role `GUIDE`;
- sở hữu `guideProfileId`;
- không có request `pending` khác.

### Kết quả mong đợi
- tạo bản ghi trong `guide_verification_requests`;
- trạng thái hồ sơ chuyển sang chờ xử lý tương ứng.

## 10.12. `GET /guide-verification/requests`

### Mục đích
Lấy danh sách verification request của guide hiện tại.

### Kết quả mong đợi
- lịch sử các lần gửi;
- trạng thái từng request;
- dữ liệu phản hồi;
- danh sách document đính kèm.

## 10.13. `POST /guide-verification/requests/:id/documents`

### Mục đích
Upload metadata tài liệu cho verification request.

### Body gợi ý
- `documentType`
- `fileUrl`
- `note`

### Yêu cầu
- request thuộc guide của chính user hiện tại;
- request còn ở trạng thái cho phép thêm tài liệu.

### Kết quả mong đợi
- tạo bản ghi trong `guide_verification_documents`;
- request hiển thị được danh sách document.

## 10.14. Yêu cầu kỹ thuật chung cho API
- response format phải thống nhất với các sprint trước;
- lỗi validation phải rõ ràng;
- ưu tiên tách:
  - public query;
  - query cá nhân;
  - query nghiệp vụ guide;
- review và verification phải có ownership check chặt;
- favorite nên idempotent ở mức hợp lý để tránh lỗi thao tác lặp.

---

## 11. Công việc frontend

## 11.1. Xây dựng màn hình M18
- tạo màn hình danh sách yêu thích;
- chia 2 tab tour / guide;
- hiển thị card/tóm tắt;
- cho phép bỏ lưu nhanh;
- có empty state riêng cho từng tab.

## 11.2. Tích hợp nút favorite vào M06 và M09
- bổ sung icon/button favorite;
- lấy trạng thái đã lưu hay chưa;
- toggle ngay trên UI;
- đồng bộ lại dữ liệu khi user thao tác.

## 11.3. Xây dựng form đánh giá dùng lại được
Nên tạo component review form dùng chung cho:
- M27 – review tour;
- M28 – review guide.

Component nên hỗ trợ:
- chọn rating sao;
- nhập comment;
- validate ký tự tối thiểu/tối đa;
- hiển thị lỗi dễ hiểu;
- trạng thái submit success/fail.

## 11.4. Hiển thị review tại màn hình chi tiết
- M06 hiển thị review tour;
- M09 hiển thị review guide;
- có summary rating;
- có danh sách review;
- có phân trang hoặc “xem thêm” nếu cần.

## 11.5. Xây dựng M33
- danh sách request đã gửi;
- form tạo request;
- khu vực tải tài liệu;
- trạng thái từng request/document;
- phản hồi từ hệ thống/backoffice.

## 11.6. Validation phía frontend
Cần có validation cho:
- rating bắt buộc 1–5;
- comment không quá dài;
- loại tài liệu hợp lệ;
- file upload có định dạng phù hợp;
- không cho submit khi đang có request pending nếu API đã báo lỗi tương ứng.

## 11.7. Trạng thái hiển thị cần chuẩn hóa
- loading;
- submitting;
- success;
- empty;
- error;
- disabled state khi user không đủ điều kiện đánh giá hoặc gửi hồ sơ.

## 11.8. Tối ưu trải nghiệm sử dụng
- M18 phải dễ quét mắt;
- M27/M28 nên đơn giản, ít trường;
- M33 nên rõ “đang chờ / đã duyệt / bị từ chối”;
- M06/M09 phải hiển thị badge/trạng thái nổi bật, không chôn thông tin quan trọng.

## 11.9. Kết quả mong đợi phía frontend
Kết thúc Sprint 10, frontend phải đạt được:
- user nhìn thấy và thao tác được favorite;
- user tạo được review khi đủ điều kiện;
- guide gửi được hồ sơ xác minh;
- M06 và M09 thể hiện rõ độ tin cậy và phản hồi cộng đồng.

---

## 12. Công việc backend

## 12.1. Tổ chức module
Cần triển khai tối thiểu:
- `favorites`
- `reviews`
- `guide-verification`

Ngoài ra cần tái sử dụng:
- auth guard;
- role guard;
- ownership helper;
- query helper;
- audit/logging nếu có.

## 12.2. Xử lý logic favorite
- add favorite tour;
- remove favorite tour;
- list favorite tours;
- add favorite guide;
- remove favorite guide;
- list favorite guides.

Cần lưu ý:
- tránh insert trùng;
- xử lý idempotent tốt;
- query đủ dữ liệu để UI hiển thị đẹp.

## 12.3. Xử lý logic review
- validate `tourRequestId`;
- kiểm tra ownership;
- kiểm tra trạng thái request;
- kiểm tra relation giữa request – tour – guide;
- chống tạo review trùng;
- tạo review;
- lấy review public.

## 12.4. Tính rating summary
Backend nên hỗ trợ query tổng hợp:
- average rating;
- count reviews.

Có thể:
- query trực tiếp;
- hoặc trả kèm summary trong endpoint detail/list review;
- nhưng phải thống nhất logic chỉ tính review `visible`.

## 12.5. Xử lý logic verification
- tạo verification request;
- chặn tạo request mới khi đang có request `pending`;
- upload document metadata;
- lấy danh sách request của owner;
- lấy chi tiết request kèm document.

## 12.6. Kết nối storage cho tài liệu xác minh
Trong phạm vi sprint này:
- backend chỉ cần nhận file URL hoặc xử lý upload tối giản;
- lưu metadata vào DB;
- không cần triển khai pipeline xử lý tài liệu phức tạp.

## 12.7. Ownership và phân quyền
Cần đảm bảo:
- user chỉ xem được favorite của mình;
- guide chỉ xem verification của hồ sơ mình;
- review public endpoint không lộ dữ liệu riêng tư;
- endpoint admin verification xử lý ở phần quản trị tương ứng, không gộp sai vào luồng user/guide.

## 12.8. Logging và audit ở mức cần thiết
Nếu có tích hợp audit:
- log tạo verification request;
- log upload document;
- log tạo review nếu cần;
- log thao tác xử lý verification ở admin side khi nối sang sprint quản trị.

## 12.9. Kết quả mong đợi phía backend
Backend phải bảo đảm:
- logic review chặt;
- favorite nhẹ, ổn định;
- verification nhất quán với schema final;
- API public/private tách rõ;
- dữ liệu trả về đủ cho frontend dựng màn hình gọn.

---

## 13. Công việc database

## 13.1. Giữ nguyên schema 38 bảng làm chuẩn
Không tạo schema rút gọn mới.  
Sprint 10 dùng trực tiếp các bảng đã có trong schema final:
- `favorite_tours`
- `favorite_guides`
- `tour_reviews`
- `guide_reviews`
- `guide_verification_requests`
- `guide_verification_documents`

## 13.2. Rà soát ràng buộc hiện có
Cần xác nhận:
- `favorite_tours` có PK composite;
- `favorite_guides` có PK composite;
- `tour_reviews.tour_request_id` là unique;
- `guide_reviews.tour_request_id` là unique;
- rating có range 1–5;
- verification request/document có state hợp lệ.

## 13.3. Bổ sung index nếu thực sự cần
Các index đáng cân nhắc:
- index cho favorite theo `user_id`;
- index cho review theo `tour_id` / `guide_profile_id` nếu chưa đủ;
- index cho verification request theo `guide_profile_id, status, submitted_at`.

Tuy nhiên chỉ thêm khi:
- query thực sự chậm;
- hoặc phục vụ rõ cho dashboard/màn hình list.

## 13.4. Chính sách dữ liệu và RLS
Nên rà soát:
- owner được đọc favorite/review riêng của mình ở mức cần thiết;
- review public chỉ đọc review visible;
- verification request/document chỉ owner hoặc backoffice đọc được;
- insert document chỉ cho owner của request.

## 13.5. Seed dữ liệu mẫu
Bắt buộc seed:
- favorite tour;
- favorite guide;
- tour review;
- guide review;
- verification request;
- verification documents.

Seed phải đủ để:
- M18 không rỗng;
- M06 có điểm đánh giá;
- M09 có review và badge verification;
- M33 có lịch sử gửi hồ sơ.

## 13.6. Chuẩn hóa dữ liệu rating và comment
- rating nên phân bố tự nhiên, không seed toàn 5 sao;
- comment phải ngắn gọn, hợp ngữ cảnh;
- có cả trường hợp chưa có review để test empty state.

## 13.7. Chuẩn bị storage cho tài liệu xác minh
Dù không hoàn toàn là “database work”, nhưng cần chốt cùng Sprint 10:
- bucket hoặc vùng lưu file;
- naming rule cho file;
- cách map `file_url` về database;
- quy ước loại tài liệu.

## 13.8. Kết quả mong đợi phía database
Kết thúc Sprint 10:
- bảng và ràng buộc hỗ trợ đủ favorite/review/verification;
- dữ liệu seed nhìn “thật”;
- rule public/private rõ;
- không làm phát sinh schema lệch so với bộ tài liệu chính.

---

## 14. Tài liệu/UML

## 14.1. Tài liệu cần hoàn thiện
- mô tả chức năng favorite;
- mô tả chức năng review tour;
- mô tả chức năng review guide;
- mô tả chức năng verification guide;
- cập nhật phần màn hình M18, M27, M28, M33;
- cập nhật mapping chức năng – API – bảng.

## 14.2. UML cần chốt trong Sprint 10

### Bắt buộc
- Activity Diagram: lưu/bỏ lưu tour
- Activity Diagram: lưu/bỏ lưu guide
- Activity Diagram: đánh giá tour
- Activity Diagram: đánh giá hướng dẫn viên
- Activity Diagram: gửi xác minh hồ sơ hướng dẫn viên

### Nên bổ sung nếu còn thời gian
- Sequence Diagram: user tạo review tour
- Sequence Diagram: guide gửi verification request
- cập nhật Class Diagram ở các thực thể review/favorite/verification nếu bộ UML tổng đang mở rộng.

## 14.3. Mục tiêu của phần tài liệu/UML
Tài liệu của Sprint 10 phải giúp người đọc thấy rõ:
- đây là lớp chức năng hoàn thiện sau MVP;
- review được ràng buộc bằng dữ liệu tham gia thật;
- verification là luồng có trạng thái rõ ràng;
- favorite là chức năng nhỏ nhưng có giá trị trải nghiệm.

---

## 15. Đầu ra

### 15.1. Đầu ra kỹ thuật
- module `favorites` hoạt động;
- module `reviews` hoạt động;
- module `guide-verification` hoạt động;
- API public/private phục vụ favorite, review, verification chạy ổn định.

### 15.2. Đầu ra giao diện
- M18 hoàn chỉnh;
- M27 và M28 dùng được;
- M33 dùng được;
- M06 và M09 hiển thị được:
  - favorite state;
  - review summary;
  - review list;
  - verification badge.

### 15.3. Đầu ra dữ liệu và nghiệp vụ
- favorite lưu đúng và không trùng;
- review tạo đúng điều kiện;
- rating summary đúng;
- verification request và document lưu đúng;
- trạng thái request/document hiển thị đúng.

### 15.4. Đầu ra tài liệu
- Activity Diagram cho favorite, review, verification;
- cập nhật mô tả màn hình;
- cập nhật mapping bảng – API – chức năng;
- cập nhật ghi chú trạng thái theo schema final.

### 15.5. Tiêu chí sẵn sàng sang Sprint 11
Hệ thống được coi là sẵn sàng sang Sprint 11 khi:
- MVP lõi vẫn ổn định sau khi gắn thêm Sprint 10;
- favorite/review/verification không phá luồng demo cũ;
- M06/M09 có chất lượng hiển thị tốt hơn rõ rệt;
- dữ liệu demo đủ để kể câu chuyện về độ tin cậy và cá nhân hóa;
- tài liệu không bị lệch với CSDL thực tế.

---

## 16. Kết luận sprint

Sprint 10 là sprint hoàn thiện rất quan trọng vì nó bổ sung **lớp niềm tin và tương tác cộng đồng** cho hệ thống. Nếu Sprint 01–09 giúp đồ án có một lõi nghiệp vụ chắc chắn, thì Sprint 10 giúp sản phẩm trông gần với một nền tảng du lịch thật hơn.

Điểm cốt lõi của sprint này là phải làm **đúng mức**:

- favorite phải gọn;
- review phải có điều kiện nghiệp vụ;
- verification phải nhất quán với schema final;
- UI phải bổ sung đúng chỗ, không làm nặng lại toàn bộ màn hình cũ.

Kết thúc Sprint 10, hệ thống cần đạt được trạng thái:
- có thêm dữ liệu tín nhiệm và phản hồi;
- có thêm tính cá nhân hóa rõ ràng;
- có hồ sơ guide đáng tin cậy hơn;
- đủ nền để bước sang Sprint 11 với nhóm hoàn thiện tiếp theo mà không làm rối cấu trúc đã chốt.
