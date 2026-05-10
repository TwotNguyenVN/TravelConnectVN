# SPRINT 13 – Mở rộng giá trị trình bày: AI, gợi ý tour, lưu trú và thanh toán

## 1. Mục tiêu sprint

Sprint 13 là sprint mở rộng cuối cùng trước giai đoạn đóng gói bản cuối. Sau khi:

- Sprint 09 đã ổn định MVP lõi;
- Sprint 10 đã bổ sung favorite, review và verification;
- Sprint 11 đã làm hệ thống “đầy” hơn bằng map, activity log, notification và statistics;
- Sprint 12 đã thêm lớp giao tiếp cơ bản với chat trực tiếp và chat nhóm bài đồng hành;

thì Sprint 13 tập trung vào **nhóm chức năng mở rộng còn lại** để tạo điểm nhấn cho phần trình bày và bảo vệ đồ án.

Theo kế hoạch triển khai đã chốt, Sprint 13 không nhằm biến hệ thống thành một nền tảng thương mại điện tử hay AI đầy đủ, mà chỉ bổ sung những lớp chức năng có giá trị minh họa cao:

- **F21 – Gợi ý tour thông minh**
- **F22 – Chatbot AI tư vấn du lịch**
- **F23 – Liên kết dịch vụ lưu trú**
- **F24 – Thanh toán trực tuyến**

Các màn hình trọng tâm tương ứng là:

- **M12 – Gợi ý tour thông minh**
- **M13 – Chatbot AI tư vấn du lịch**
- **M14 – Liên kết dịch vụ lưu trú**
- **M22 – Thanh toán trực tuyến**

### Mục tiêu chính

- Bổ sung cơ chế **gợi ý tour ở mức rule-based** dựa trên dữ liệu sở thích và một phần lịch sử hành vi của người dùng.
- Hoàn thiện **chatbot AI tư vấn du lịch** ở mức có phiên hội thoại, có lịch sử message, có thể gọi function nội bộ để lấy dữ liệu phù hợp và trả lời theo phạm vi an toàn của hệ thống.
- Hiển thị **nơi lưu trú liên quan đến tour** dưới dạng danh sách tham khảo, tạo chiều sâu cho trải nghiệm nhưng không mở rộng sang nghiệp vụ đặt phòng thật.
- Hoàn thiện **thanh toán trực tuyến ở mức sandbox / mock**, đủ để minh họa được flow thanh toán và trạng thái giao dịch, nhưng không kéo hệ thống sang bài toán payment production.
- Đồng bộ giữa **database – backend – frontend – tài liệu/UML** để nhóm chức năng mở rộng này khép kín và phục vụ tốt cho phần bảo vệ.
- Giữ đúng nguyên tắc của đồ án:
  - làm **đủ để trình bày**;
  - có **logic hợp lý**;
  - có **màn hình, API, dữ liệu demo**;
  - nhưng **không làm nặng phần lõi** đã hoàn thành ở các sprint trước.

### Ý nghĩa của sprint này

Sprint 13 có giá trị lớn ở khía cạnh **trình bày định hướng phát triển**. Nếu Sprint 03–08 là phần “phải có để chứng minh hệ thống chạy được”, thì Sprint 13 là phần “làm sản phẩm trông có tầm nhìn hơn”.

Giá trị của sprint này nằm ở 4 điểm:

1. **Tăng cảm giác thông minh của hệ thống**  
   Sự xuất hiện của recommendation và chatbot AI giúp sản phẩm không còn chỉ là tập hợp các màn hình CRUD, mà giống một nền tảng có khả năng hỗ trợ người dùng ra quyết định.

2. **Tăng tính hoàn chỉnh của hệ sinh thái du lịch**  
   Khi có thêm accommodation và payment, hệ thống thể hiện được bức tranh rộng hơn của hành trình du lịch: tìm tour, tìm thông tin hỗ trợ, và mô phỏng bước thanh toán.

3. **Tăng điểm nhấn khi demo**  
   AI chat, gợi ý tour và thanh toán sandbox là những phần rất dễ tạo ấn tượng nếu triển khai gọn, đúng mức và có dữ liệu minh họa tốt.

4. **Giữ được tính khả thi của đồ án sinh viên**  
   Tài liệu đã chốt rõ đây là sprint mở rộng, nên mọi quyết định triển khai đều phải theo hướng **mô phỏng hợp lý**, tránh biến sprint này thành cụm tích hợp quá lớn.

---

## 2. Lưu ý trước khi triển khai

## 2.1. Đây là sprint mở rộng, không được kéo chậm phần lõi

Sprint 13 nằm ở nhóm ưu tiên 3. Vì vậy, nguyên tắc bắt buộc là:

- phần lõi ở các sprint trước phải được giữ ổn định;
- nếu thiếu thời gian, phải ưu tiên mức **mô phỏng tốt** thay vì cố triển khai quá sâu;
- tuyệt đối không để AI, payment hoặc accommodation làm phát sinh quá nhiều refactor vào các module auth, tour request, admin hoặc companion đã ổn định.

## 2.2. AI chỉ đóng vai trò trợ lý tư vấn, không thay thế logic nghiệp vụ hệ thống

AI trong sprint này không được xem là một “AI agent” toàn quyền. Nó chỉ nên:

- tư vấn du lịch ở mức nội dung;
- giải thích thông tin tour;
- gợi ý điểm đến, loại tour, phong cách du lịch;
- kết hợp dữ liệu nội bộ khi cần thông qua function/API có kiểm soát.

AI **không được**:

- truy cập tự do database;
- tự thay đổi dữ liệu hệ thống;
- tự tạo yêu cầu tham gia tour;
- tự thanh toán;
- tự sinh hành động nghiệp vụ thay người dùng.

## 2.3. Recommendation chỉ nên ở mức rule-based

Tài liệu chốt đã xác định rõ: recommendation trong sprint này chỉ nên là **rule-based recommendation**, không triển khai machine learning phức tạp.

Điều đó có nghĩa:

- ưu tiên dựa trên `user_preferences`, `user_preferred_categories`;
- có thể tham khảo `user_activity_logs` để tăng độ hợp lý;
- sắp xếp theo điểm phù hợp đơn giản;
- không cần huấn luyện mô hình riêng;
- không cần lưu “embedding”, “vector search” hay pipeline phân tích nặng.

## 2.4. Accommodation chỉ ở mức liên kết / tham khảo

Sprint 13 chỉ nên làm:

- danh sách nơi lưu trú liên quan;
- thẻ accommodation gắn với tour;
- màn hình xem thông tin lưu trú.

Không nên làm:

- đặt phòng thật;
- quản lý booking accommodation;
- đồng bộ tồn kho;
- flow thanh toán cho accommodation riêng;
- chính sách hoàn phòng, hủy phòng.

## 2.5. Payment chỉ ở mức sandbox hoặc mock flow

Tài liệu chốt cho phép:

- **PayPal Sandbox + Orders API v2**, hoặc
- **mock flow nội bộ**.

Vì đây là đồ án sinh viên, hướng đi an toàn là:

- có thể chuẩn bị kiến trúc để nối cổng sandbox;
- nhưng vẫn cho phép fallback sang mock flow nếu phát sinh rủi ro tích hợp;
- chỉ cần minh họa rõ:
  - tạo giao dịch;
  - cập nhật trạng thái;
  - xác nhận thanh toán;
  - hiển thị lịch sử thanh toán của người dùng.

## 2.6. AI phải đi qua function hoặc API nội bộ

Điểm này rất quan trọng. AI không nên lấy dữ liệu “tự do” từ toàn hệ thống. Thay vào đó:

- backend chuẩn bị các function/API nội bộ như:
  - lấy danh sách tour phù hợp;
  - lấy chi tiết tour công khai;
  - lấy accommodation của tour;
  - lấy danh mục tỉnh/thành hoặc category nếu cần;
- lớp AI chỉ gọi đúng các function đã whitelist;
- mọi dữ liệu trả về cho AI đều phải được kiểm soát phạm vi.

## 2.7. Không nên biến Sprint 13 thành tích hợp AI quá phức tạp

Sprint này không nên làm:

- multi-agent;
- memory dài hạn phức tạp;
- prompt routing nhiều tầng;
- tool orchestration nâng cao;
- voice AI;
- AI streaming bắt buộc;
- personalization quá sâu theo lịch sử dài hạn.

Cách làm đúng là:

- 1 chatbot cơ bản;
- 1 flow recommendation đơn giản;
- 1 module accommodation nhẹ;
- 1 payment sandbox/mock rõ ràng.

## 2.8. Dữ liệu demo quyết định chất lượng của sprint này

Sprint 13 là sprint “điểm nhấn”. Nếu dữ liệu demo nghèo nàn, các màn hình AI/recommendation/payment sẽ rất dễ bị rỗng hoặc thiếu thuyết phục.

Cần chuẩn bị sẵn:

- user có sở thích du lịch khác nhau;
- category đa dạng;
- tour public đủ phong cách, tỉnh/thành, giá và thời gian;
- accommodation gắn với một số tour cụ thể;
- payment transaction đủ trạng thái minh họa;
- 1–2 session AI có lịch sử chat mẫu.

---

## 3. Các vấn đề cần xác định trong sprint này

### 3.1. Vai trò chính thức của AI trong hệ thống là gì

Phải chốt rõ AI phục vụ mục đích nào:

- chatbot tư vấn du lịch;
- giải đáp câu hỏi về tour;
- hỗ trợ gợi ý tour cơ bản;
- giải thích lựa chọn phù hợp theo sở thích.

Không được để AI “phình vai trò” sang các nghiệp vụ cốt lõi như xử lý request, moderation hay payment authorization.

### 3.2. AI sử dụng công nghệ nào

Cần chốt rõ:

- API nào dùng để gọi mô hình;
- mô hình mặc định là gì;
- backend gọi AI trực tiếp hay qua service riêng;
- có dùng streaming không;
- có lưu toàn bộ lịch sử vào `ai_chat_messages` không.

### 3.3. AI được phép truy cập dữ liệu theo cơ chế nào

Cần chốt:

- AI chỉ được truy cập dữ liệu qua function nội bộ;
- function nào được mở cho AI;
- loại dữ liệu nào được phép đọc;
- loại dữ liệu nào bị cấm;
- có lọc theo public/private trước khi trả kết quả cho AI hay không.

### 3.4. Recommendation sẽ tính theo logic nào

Phải xác định rõ input của recommendation:

- `user_preferences`;
- `user_preferred_categories`;
- `user_activity_logs` ở mức tham khảo;
- thông tin public của `tours`.

Cần chốt cách cho điểm:

- match category;
- match price range;
- match địa điểm quan tâm;
- match thời gian hoặc loại tour;
- loại bỏ tour không public, không published, hoặc guide/profile không phù hợp.

### 3.5. Accommodation liên kết với tour theo mức nào

Cần quyết định:

- tour có thể gắn nhiều accommodation;
- accommodation chỉ hiển thị như gợi ý tham khảo;
- có màn hình list riêng và block hiển thị trong tour detail;
- có cho guide tự gắn accommodation vào tour hay chỉ seed sẵn để demo.

### 3.6. Payment gắn với thực thể nào

Phải chốt payment trong sprint này gắn với:

- `tour_requests`;
- người dùng đã có yêu cầu tham gia tour;
- transaction chỉ đại diện cho bước thanh toán liên quan đến yêu cầu đó.

Như vậy flow sẽ rõ hơn so với việc cho thanh toán “mơ hồ” từ nhiều nguồn khác nhau.

### 3.7. Trạng thái thanh toán được định nghĩa như thế nào

Phải chốt state machine tối thiểu cho `payment_transactions`, ví dụ:

- `pending`
- `authorized`
- `paid`
- `failed`
- `cancelled`
- `refunded` (nếu chỉ để dự phòng mở rộng, không bắt buộc dùng trong demo)

Nếu sprint chỉ làm sandbox/mock cơ bản, có thể dùng một tập trạng thái gọn hơn, miễn là nhất quán.

### 3.8. Có cần tích hợp payment thật hay chỉ mock

Phải chốt ngay từ đầu:

- dùng PayPal Sandbox thật ở mức có thể demo được, hoặc
- fallback sang mock flow nội bộ.

Không nên để tới cuối sprint mới quyết định, vì phần UI, backend và trạng thái dữ liệu phụ thuộc trực tiếp vào lựa chọn này.

### 3.9. Dữ liệu demo của AI và payment nên được chuẩn bị ra sao

Cần chuẩn bị:

- người dùng có preferences rõ ràng;
- một số category tour tiêu biểu;
- tour gắn accommodation;
- ít nhất một giao dịch thành công và một giao dịch thất bại / pending;
- ít nhất một phiên chat AI với nhiều message để màn hình không bị trống.

### 3.10. UML nào cần cập nhật trong sprint này

Tài liệu đã định hướng cần hoàn thiện Activity Diagram cho:

- gợi ý tour;
- chatbot AI;
- xem lưu trú liên quan;
- thanh toán trực tuyến.

Ngoài ra, nếu còn thời gian có thể bổ sung:

- sequence cho AI chat;
- sequence cho payment sandbox;
- class diagram ở mức service boundary cho recommendation / payment.

---

## 4. Hạng mục cần chốt

### 4.1. Hạng mục chiến lược mở rộng

- Sprint 13 là sprint mở rộng, không được đụng sâu phần lõi.
- Mọi module ở sprint này phải có thể “cắt gọn” nếu thiếu thời gian.
- Mục tiêu ưu tiên là **trình bày tốt**, không phải “production hóa” toàn bộ.

### 4.2. Hạng mục AI

- Vai trò AI.
- API gọi AI.
- Model mặc định.
- Prompt nền của chatbot.
- Danh sách function nội bộ được phép gọi.
- Quy tắc chặn truy cập dữ liệu nhạy cảm.
- Chính sách log message.

### 4.3. Hạng mục recommendation

- Dữ liệu đầu vào.
- Công thức chấm điểm.
- Điều kiện loại trừ tour.
- Thứ tự ưu tiên giữa category, price, location và hành vi.
- Có lưu lịch sử recommendation hay không.

### 4.4. Hạng mục accommodation

- Accommodation list là public hay theo tour.
- Cách liên kết tour – accommodation.
- Dữ liệu tối thiểu của accommodation.
- Có hiển thị link ngoài hay chỉ hiển thị thông tin mô phỏng.
- Có cho quản trị chỉnh dữ liệu accommodation hay chỉ seed demo.

### 4.5. Hạng mục payment

- Payment provider.
- Kiểu giao dịch sandbox/mock.
- Mã giao dịch.
- State machine.
- Mối liên hệ với `tour_requests`.
- Màn hình lịch sử thanh toán.
- Cách xác nhận thanh toán thành công / thất bại.

### 4.6. Hạng mục frontend

- Bố cục M12, M13, M14, M22.
- Cách điều hướng từ tour detail sang accommodation/payment.
- Cách hiển thị AI chat session.
- Thành phần reuse cho payment status, recommendation card, accommodation card.

### 4.7. Hạng mục backend

- Chia module recommendation, ai-chat, accommodations, payments.
- Validation dữ liệu đầu vào.
- Rule truy cập dữ liệu public.
- Chuẩn response cho AI chat và payment.
- Logging cho transaction và AI request.

### 4.8. Hạng mục database

- Chuẩn hóa dữ liệu preferences.
- Seed category, preferences, accommodation, payment.
- Index cho session, message, transaction.
- Ràng buộc khóa ngoại cho payment và accommodation.
- Chuẩn hóa miền giá trị trạng thái.

### 4.9. Hạng mục tài liệu/UML

- Activity Diagram.
- Cập nhật mô tả màn hình M12, M13, M14, M22.
- Cập nhật phần định hướng mở rộng trong báo cáo.
- Cập nhật mapping function – screen – API – table.

---

## 5. Phương án được chọn

## 5.1. Chiến lược tổng thể được chọn

Sprint 13 được triển khai theo nguyên tắc:

- **làm đủ 4 điểm nhấn mở rộng**;
- mỗi điểm nhấn đều có:
  - dữ liệu,
  - API,
  - UI,
  - demo flow;
- nhưng tất cả chỉ ở **mức phù hợp với đồ án sinh viên**.

Nói cách khác, đây là sprint của **giá trị trình bày cao – độ phức tạp được kiểm soát**.

## 5.2. Vai trò AI được chọn

AI chỉ đóng vai trò:

- chatbot tư vấn du lịch;
- hỗ trợ hỏi đáp về thông tin tour, loại tour, vùng du lịch;
- hỗ trợ gợi ý tour cơ bản.

AI **không** giữ vai trò xử lý nghiệp vụ thay người dùng.

## 5.3. Công nghệ AI được chọn

Theo tài liệu chốt:

- dùng **OpenAI Responses API**;
- model mặc định là **gpt-5.4-mini**.

Trong phần hiện thực backend, nên bọc lớp gọi AI vào một `AiChatService` riêng để:

- dễ thay model;
- dễ thay provider;
- dễ kiểm soát prompt và tool;
- dễ log.

## 5.4. Cơ chế truy cập dữ liệu của AI được chọn

AI chỉ được truy cập dữ liệu thông qua:

- function nội bộ đã whitelist;
- dữ liệu public hoặc dữ liệu thuộc user hiện tại nếu hợp lệ;
- lớp service đã kiểm soát quyền truy cập.

Điều này giúp:

- tránh lộ dữ liệu;
- giữ cho AI không “đi vượt” nghiệp vụ của hệ thống;
- khiến phần báo cáo thiết kế an toàn và hợp lý hơn.

## 5.5. Cách làm recommendation được chọn

Recommendation được làm ở mức **rule-based**.

Đầu vào ưu tiên:

- `user_preferences`
- `user_preferred_categories`
- `user_activity_logs` ở mức tham khảo
- dữ liệu public của `tours`, `tour_categories`

Hướng tính điểm đề xuất:

- cộng điểm nếu category trùng sở thích;
- cộng điểm nếu địa điểm nằm trong nhóm user quan tâm;
- cộng điểm nếu mức giá phù hợp;
- cộng điểm nếu thời gian hoặc phong cách tour phù hợp;
- trừ hoặc loại nếu tour không còn public/published.

Kết quả trả về:

- danh sách tour đã xếp hạng;
- có thể kèm theo một trường `match_reasons` để giải thích tại sao tour được gợi ý.

## 5.6. Mức độ accommodation được chọn

Accommodation chỉ ở mức:

- hiển thị danh sách nơi lưu trú liên quan;
- gắn với tour qua `tour_accommodations`;
- cho người dùng xem thông tin tham khảo.

Không triển khai:

- đặt phòng;
- booking;
- thanh toán accommodation;
- quản lý tồn kho;
- đồng bộ đối tác thật.

## 5.7. Giải pháp payment được chọn

Giải pháp chốt là:

- **PayPal Sandbox + Orders API v2**, hoặc
- **mock flow nội bộ** nếu cần giảm rủi ro.

Trong tài liệu sprint nên mô tả theo hướng:

- kiến trúc ưu tiên hỗ trợ sandbox;
- triển khai thực tế có thể dùng mock flow nếu mục tiêu là bảo vệ đồ án ổn định hơn.

## 5.8. Phạm vi payment được chọn

Payment chỉ phục vụ minh họa cho:

- tạo giao dịch thanh toán của một `tour_request`;
- xem thông tin giao dịch;
- xác nhận thanh toán;
- xem lịch sử thanh toán của user.

Không triển khai:

- hoàn tiền thật;
- webhook production;
- đối soát;
- đa cổng thanh toán;
- hệ thống hóa đơn hoàn chỉnh.

## 5.9. Hướng tổ chức module backend được chọn

Nên chia thành 4 module mở rộng:

- `recommendations`
- `ai-chat`
- `accommodations`
- `payments`

Cách chia này giúp:

- mỗi phần có controller/service riêng;
- dễ cô lập lỗi;
- dễ mô tả trong báo cáo;
- dễ test và dễ bỏ bớt nếu cần.

## 5.10. Hướng dữ liệu demo được chọn

Chuẩn bị tối thiểu:

- 2–3 user có sở thích du lịch khác nhau;
- 5–10 tour có category, giá và tỉnh/thành khác nhau;
- 3–5 accommodation gắn với một số tour;
- 2–3 payment transaction với các trạng thái khác nhau;
- 1–2 session AI với lịch sử message.

---

## 6. Ghi chú triển khai

### 6.1. Thứ tự triển khai nên làm

Thứ tự hợp lý:

1. Chuẩn hóa database cho preferences, AI chat, accommodation, payment.
2. Seed dữ liệu demo.
3. Hoàn thiện recommendation API.
4. Hoàn thiện accommodation API.
5. Hoàn thiện payment mock/sandbox API.
6. Hoàn thiện AI chat API.
7. Làm frontend cho M12, M14, M22.
8. Làm frontend cho M13.
9. Kiểm thử end-to-end và cập nhật UML.

Lý do là:

- recommendation, accommodation, payment phụ thuộc mạnh vào dữ liệu demo;
- AI chat nên làm sau khi đã có dữ liệu và function nội bộ để gọi.

### 6.2. Không biến M12 thành hệ thống đề xuất quá phức tạp

M12 chỉ cần:

- hiển thị danh sách tour gợi ý;
- có lý do gợi ý ở mức ngắn;
- có filter hoặc chip giải thích;
- có CTA đi tới chi tiết tour.

Không cần:

- mô hình học máy;
- gợi ý thời gian thực;
- A/B test;
- ranking phức tạp nhiều tầng.

### 6.3. Không biến M13 thành “agent đa năng”

M13 nên là chatbot tư vấn du lịch gọn, rõ:

- khung chat;
- session list;
- message history;
- ô nhập câu hỏi;
- gợi ý prompt mẫu;
- một số tool nội bộ như tìm tour phù hợp hoặc lấy chi tiết tour public.

Không nên mở rộng:

- tạo task tự động;
- thay đổi dữ liệu hệ thống;
- ghi nhớ dài hạn quá sâu;
- truy cập dữ liệu quản trị.

### 6.4. Không biến M14 thành marketplace lưu trú

M14 chỉ là màn hình **liên kết dịch vụ lưu trú**. Vì vậy:

- chỉ cần list card accommodation;
- có ảnh, tên, địa chỉ/khu vực, mô tả ngắn, mức giá tham khảo, liên hệ hoặc link ngoài;
- có thể hiển thị theo ngữ cảnh tour hoặc dạng danh sách tổng.

Không cần:

- phân trang quá phức tạp;
- so sánh chi tiết;
- booking;
- checkout accommodation.

### 6.5. Không biến M22 thành hệ thống thanh toán production

M22 chỉ cần mô phỏng rõ flow:

- chọn thanh toán;
- tạo giao dịch;
- chờ xác nhận;
- thành công/thất bại;
- xem lịch sử thanh toán.

Không nên làm:

- nhiều provider thật;
- retry logic phức tạp;
- webhook nhiều trạng thái;
- hoàn tiền thật;
- bảo mật production-grade ở mức quá sâu so với đồ án.

### 6.6. AI prompt và tool phải được kiểm soát

Ở tầng backend cần có:

- system prompt giới hạn phạm vi trả lời;
- danh sách function được gọi rõ ràng;
- validation trước khi gọi function;
- log request/response ở mức phù hợp;
- chặn câu trả lời “bịa” liên quan đến dữ liệu không có trong hệ thống.

### 6.7. Quy tắc “xong sprint”

Sprint 13 chỉ được xem là hoàn thành khi đạt đủ:

- có dữ liệu preferences, AI chat, accommodation, payment;
- có API recommendation, AI chat, accommodation, payment chạy được;
- có màn hình M12, M13, M14, M22 nối API;
- có dữ liệu demo dùng được để trình bày;
- có Activity Diagram cho 4 luồng chính;
- có ít nhất 1 script demo ngắn cho từng nhóm chức năng.

### 6.8. Dữ liệu demo nên chuẩn bị

Nên có các mẫu sau:

- user thích tour văn hóa, ngân sách trung bình;
- user thích tour thiên nhiên, ngân sách thấp;
- một tour biển có accommodation gần điểm hẹn;
- một tour miền núi không có accommodation để minh họa trường hợp rỗng;
- một payment pending;
- một payment paid;
- một payment failed;
- một AI session hỏi “tour phù hợp với ngân sách 2 triệu ở Đà Lạt”;
- một AI session hỏi “tour nào phù hợp đi cuối tuần”.

---

## 7. Chức năng trọng tâm

### F21. Gợi ý tour thông minh

#### Mục tiêu
Giúp người dùng nhận được danh sách tour phù hợp hơn thay vì chỉ tự tìm kiếm thủ công.

#### Actor chính
- User đã đăng nhập

#### Dữ liệu chính
- `user_preferences`
- `user_preferred_categories`
- `user_activity_logs`
- `tours`
- `tour_categories`

#### Kết quả đầu ra
- danh sách tour gợi ý đã được xếp hạng;
- lý do gợi ý ngắn gọn;
- liên kết sang màn hình chi tiết tour.

#### Mức độ triển khai phù hợp
- rule-based;
- không dùng ML phức tạp;
- không cần cá nhân hóa sâu thời gian thực.

### F22. Chatbot AI tư vấn du lịch

#### Mục tiêu
Cho phép người dùng đặt câu hỏi tự nhiên về du lịch, tour hoặc tư vấn định hướng chuyến đi.

#### Actor chính
- User đã đăng nhập
- Có thể mở rộng cho guest ở giai đoạn sau, nhưng Sprint 13 nên ưu tiên user đã đăng nhập

#### Dữ liệu chính
- `ai_chat_sessions`
- `ai_chat_messages`
- dữ liệu tour/accommodation public thông qua function nội bộ

#### Kết quả đầu ra
- session chat;
- lịch sử trao đổi;
- câu trả lời AI có kiểm soát;
- khả năng gọi tool nội bộ ở mức cơ bản.

#### Mức độ triển khai phù hợp
- text chat;
- 1 session nhiều message;
- không cần voice, file, memory nâng cao.

### F23. Liên kết dịch vụ lưu trú

#### Mục tiêu
Hiển thị nơi lưu trú liên quan đến tour hoặc danh sách lưu trú đối tác để làm trải nghiệm phong phú hơn.

#### Actor chính
- Guest
- User
- Guide
- Admin có thể xem khi test/demo

#### Dữ liệu chính
- `partner_accommodations`
- `tour_accommodations`
- `tours`

#### Kết quả đầu ra
- danh sách accommodation liên quan;
- card thông tin accommodation;
- liên kết từ tour sang accommodation phù hợp.

#### Mức độ triển khai phù hợp
- hiển thị thông tin;
- không đặt phòng thật.

### F24. Thanh toán trực tuyến

#### Mục tiêu
Mô phỏng hoặc sandbox hóa bước thanh toán cho yêu cầu tham gia tour.

#### Actor chính
- User
- Có thể có admin xem lịch sử khi kiểm tra dữ liệu, nhưng không phải actor thao tác chính

#### Dữ liệu chính
- `payment_transactions`
- `tour_requests`
- `users`

#### Kết quả đầu ra
- giao dịch mới;
- cập nhật trạng thái;
- lịch sử giao dịch theo user;
- màn hình thanh toán và kết quả thanh toán.

#### Mức độ triển khai phù hợp
- sandbox/mock;
- không production.

### Kết luận cho nhóm chức năng

Bốn chức năng trong Sprint 13 không nằm ở lớp bắt buộc của MVP lõi, nhưng lại có giá trị rất cao khi:

- làm báo cáo;
- làm demo;
- trình bày định hướng phát triển;
- tạo cảm giác hệ thống có tầm nhìn sản phẩm rõ ràng.

---

## 8. Màn hình triển khai

## 8.1. Mục tiêu của phần màn hình

Các màn hình trong Sprint 13 cần đạt 3 tiêu chí:

- dễ hiểu với hội đồng;
- có dữ liệu demo minh họa;
- nối được với các màn hình đã có trước đó.

## 8.2. M12 – Gợi ý tour thông minh

### Thành phần chính nên có

- tiêu đề giới thiệu khu vực gợi ý;
- block mô tả “gợi ý dựa trên sở thích / hành vi”;
- chip hoặc tag thể hiện lý do gợi ý;
- danh sách card tour;
- bộ lọc nhẹ nếu cần;
- empty state khi chưa có preferences.

### Hành vi chính

- lấy preferences của user hiện tại;
- gọi `GET /recommendations/tours`;
- render danh sách gợi ý theo điểm phù hợp;
- click vào card để đi tới chi tiết tour.

### Điều cần tránh

- không biến M12 thành một trang tìm kiếm đầy đủ thay cho M05;
- không nhồi quá nhiều điều kiện lọc;
- không giải thích thuật toán quá phức tạp trên UI.

## 8.3. M13 – Chatbot AI tư vấn du lịch

### Thành phần chính nên có

- sidebar hoặc dropdown chọn session;
- vùng hiển thị message history;
- ô nhập prompt;
- nút gửi;
- prompt mẫu;
- trạng thái loading / đang trả lời;
- cảnh báo phạm vi sử dụng nếu cần.

### Hành vi chính

- tạo session mới;
- tải lịch sử của session;
- gửi message mới;
- nhận trả lời AI;
- lưu message vào lịch sử.

### Điều cần tránh

- không để AI trả lời kiểu “toàn tri” không kiểm soát;
- không cho AI truy cập dữ liệu riêng tư;
- không bắt buộc streaming nếu chưa ổn định.

## 8.4. M14 – Liên kết dịch vụ lưu trú

### Thành phần chính nên có

- danh sách accommodation;
- card ảnh / tên / khu vực / mô tả ngắn;
- mức giá tham khảo;
- chỉ dẫn liên quan đến tour;
- empty state khi tour chưa có accommodation liên kết.

### Hành vi chính

- lấy accommodation theo tour hoặc list tổng;
- hiển thị thông tin tham khảo;
- điều hướng từ chi tiết tour sang khu vực accommodation.

### Điều cần tránh

- không biến thành trang booking;
- không làm quy trình đặt phòng;
- không cần form thanh toán lưu trú.

## 8.5. M22 – Thanh toán trực tuyến

### Thành phần chính nên có

- thông tin tour request liên quan;
- tổng tiền / số lượng / mô tả giao dịch;
- trạng thái thanh toán;
- nút tạo thanh toán;
- nút xác nhận mô phỏng hoặc quay lại provider sandbox;
- khu vực hiển thị kết quả thành công / thất bại;
- lịch sử thanh toán của user.

### Hành vi chính

- tạo payment transaction;
- điều hướng / mô phỏng bước thanh toán;
- cập nhật trạng thái;
- hiển thị lịch sử giao dịch theo user.

### Điều cần tránh

- không mô phỏng nhiều provider;
- không làm flow checkout quá dài;
- không làm luồng refund thật.

### Kết luận cho phần màn hình

Bốn màn hình của Sprint 13 nên được dựng theo hướng:

- rõ chức năng;
- ngắn gọn;
- có dữ liệu đẹp để demo;
- gắn chặt với các luồng tour / user / recommendation đã có.

---

## 9. Bảng CSDL chính

## 9.1. Mục tiêu của phần dữ liệu

Phần dữ liệu trong Sprint 13 cần phục vụ đủ cho:

- recommendation;
- AI chat;
- accommodation;
- payment.

Không cần mở thêm quá nhiều bảng mới ngoài những bảng đã có trong schema final.

## 9.2. `user_preferences`

### Vai trò
Lưu hồ sơ sở thích du lịch của user.

### Dùng cho
- recommendation;
- giải thích vì sao tour được gợi ý;
- đầu vào cho AI nếu cần cá nhân hóa ở mức nhẹ.

### Dữ liệu nên có
- khoảng ngân sách ưa thích;
- khu vực / tỉnh thành quan tâm;
- loại hình du lịch;
- thời lượng ưa thích;
- style du lịch (nghỉ dưỡng, khám phá, văn hóa, thiên nhiên...).

## 9.3. `user_preferred_categories`

### Vai trò
Lưu quan hệ nhiều – nhiều giữa user và các category tour ưa thích.

### Dùng cho
- chấm điểm recommendation;
- lọc tour theo nhóm yêu thích;
- thống nhất với `tour_categories`.

## 9.4. `ai_chat_sessions`

### Vai trò
Lưu phiên hội thoại AI của user.

### Dùng cho
- danh sách session;
- mở lại lịch sử chat;
- đóng / tiếp tục session.

### Gợi ý vận hành
- mỗi session thuộc về một user;
- có `started_at`, `closed_at`, `status` nếu schema hỗ trợ;
- có thể lưu `title` ngắn do hệ thống sinh ra.

## 9.5. `ai_chat_messages`

### Vai trò
Lưu message trong từng AI session.

### Dùng cho
- render lịch sử hội thoại;
- kiểm tra prompt / response đã trao đổi;
- phân tích flow demo.

### Gợi ý vận hành
- cần phân biệt message của user và assistant;
- nên có thời gian tạo;
- có thể có trường metadata/tool_call nếu muốn mở rộng về sau, nhưng Sprint 13 không bắt buộc.

## 9.6. `partner_accommodations`

### Vai trò
Lưu danh sách nơi lưu trú đối tác / tham khảo.

### Dùng cho
- M14;
- hiển thị thông tin accommodation theo tour;
- làm dữ liệu minh họa hệ sinh thái du lịch.

### Dữ liệu nên có
- tên accommodation;
- mô tả;
- địa chỉ / khu vực;
- giá tham khảo;
- ảnh;
- liên hệ hoặc link ngoài;
- trạng thái active.

## 9.7. `tour_accommodations`

### Vai trò
Liên kết nhiều – nhiều giữa tour và accommodation.

### Dùng cho
- lấy danh sách accommodation liên quan của tour;
- block accommodation trong chi tiết tour hoặc trang accommodation.

## 9.8. `payment_transactions`

### Vai trò
Lưu giao dịch thanh toán liên quan đến `tour_requests`.

### Dùng cho
- tạo giao dịch;
- xác nhận thanh toán;
- xem lịch sử payment của user;
- hiển thị payment status.

### Dữ liệu nên chuẩn hóa
- transaction code;
- amount;
- currency;
- status;
- payment provider;
- created_at / updated_at;
- reference tới `tour_request_id` và `user_id`.

### Kết luận cho phần dữ liệu

Nhóm bảng của Sprint 13 không nhiều, nhưng là nhóm bảng “rất dễ lỏng logic” nếu không chốt phạm vi từ đầu. Vì vậy cần ưu tiên:

- đơn giản hóa;
- dữ liệu demo đẹp;
- relation rõ ràng;
- trạng thái nhất quán.

---

## 10. API cần thiết

## 10.1. Nhóm preferences / recommendation

### `GET /me/preferences`
Mục đích:

- lấy hồ sơ sở thích hiện tại của user;
- phục vụ M12 và các form chỉnh sở thích.

### `PUT /me/preferences`
Mục đích:

- cập nhật sở thích tổng quát của user.

### `PUT /me/preferred-categories`
Mục đích:

- cập nhật danh sách category ưa thích.

### `GET /recommendations/tours`
Mục đích:

- trả về danh sách tour gợi ý cho user;
- có thể kèm điểm và lý do gợi ý.

## 10.2. Nhóm AI chat

### `GET /ai-chat/sessions`
Mục đích:

- lấy danh sách session của user.

### `POST /ai-chat/sessions`
Mục đích:

- tạo phiên chat mới.

### `GET /ai-chat/sessions/:id/messages`
Mục đích:

- lấy lịch sử message của một session.

### `POST /ai-chat/sessions/:id/messages`
Mục đích:

- gửi câu hỏi mới;
- lưu message của user;
- gọi AI;
- lưu câu trả lời của assistant;
- trả kết quả cho frontend.

### `PATCH /ai-chat/sessions/:id/close` *(nếu dùng theo mapping mở rộng)*
Mục đích:

- đóng session;
- giúp UI quản lý hội thoại rõ hơn.

## 10.3. Nhóm accommodation

### `GET /tours/:id/accommodations`
Mục đích:

- lấy accommodation liên quan của một tour.

### `GET /accommodations`
Mục đích:

- lấy danh sách accommodation tổng;
- phục vụ M14 nếu dựng theo dạng list riêng.

### `PUT /tours/:id/accommodations` *(nếu bật cho guide/admin ở mức seed quản lý)*
Mục đích:

- gắn accommodation cho tour;
- không bắt buộc mở trên UI public trong sprint này.

## 10.4. Nhóm payment

### `POST /payments`
Mục đích:

- tạo giao dịch thanh toán mới cho một `tour_request`.

### `GET /payments/:id`
Mục đích:

- lấy chi tiết giao dịch.

### `POST /payments/:id/confirm`
Mục đích:

- xác nhận kết quả thanh toán sandbox/mock.

### `GET /me/payments`
Mục đích:

- lấy lịch sử thanh toán của user hiện tại.

### Kết luận cho phần API

API của Sprint 13 nên rõ, ít nhưng đủ dùng. Quan trọng nhất là:

- dễ nối màn hình;
- dễ test;
- dễ giải thích trong báo cáo;
- không phát sinh quá nhiều nhánh phụ.

---

## 11. Công việc frontend

## 11.1. Mục tiêu tổng thể của frontend sprint này

Frontend cần thể hiện được rằng hệ thống không chỉ có các luồng lõi, mà còn có:

- lớp cá nhân hóa;
- lớp hỗ trợ AI;
- lớp dịch vụ liên kết;
- lớp mô phỏng thanh toán.

## 11.2. Công việc cho M12 – Gợi ý tour

- dựng giao diện khu vực gợi ý tour;
- gọi API `GET /me/preferences` và `GET /recommendations/tours`;
- hiển thị tour card, match reason, badge category, giá, địa điểm;
- xử lý empty state khi user chưa khai báo sở thích;
- thêm CTA sang chi tiết tour hoặc trang cập nhật sở thích.

## 11.3. Công việc cho M13 – Chatbot AI

- dựng layout chat gồm session list + message panel;
- tạo session mới;
- load message history;
- gửi prompt mới;
- hiển thị assistant message;
- xử lý loading, error, retry;
- thêm prompt suggestion để demo nhanh.

## 11.4. Công việc cho M14 – Accommodation

- dựng danh sách accommodation card;
- hỗ trợ hiển thị theo tour hoặc list riêng;
- hiển thị thông tin tham khảo rõ ràng;
- xử lý empty state;
- thêm liên kết từ tour detail nếu muốn giữ flow liền mạch.

## 11.5. Công việc cho M22 – Payment

- dựng giao diện tóm tắt giao dịch;
- form / nút tạo payment;
- trạng thái pending / paid / failed;
- màn hình hoặc dialog kết quả;
- lịch sử thanh toán của user;
- xử lý sandbox/mock redirect hoặc confirm result.

## 11.6. Component dùng chung nên bổ sung

- `RecommendationCard`
- `MatchReasonChip`
- `AiMessageBubble`
- `AiSessionList`
- `AccommodationCard`
- `PaymentStatusBadge`
- `PaymentSummaryPanel`
- `EmptyState`
- `LoadingPanel`

## 11.7. Kiểm thử frontend nên có

- user có preferences và không có preferences;
- AI chat session mới / session cũ;
- tour có accommodation / không có accommodation;
- payment pending / success / fail;
- responsive cơ bản cho 4 màn hình.

---

## 12. Công việc backend

## 12.1. Mục tiêu tổng thể của backend sprint này

Backend cần bảo đảm 4 điều:

- recommendation hợp lý;
- AI chat có kiểm soát;
- accommodation query rõ ràng;
- payment sandbox/mock nhất quán.

## 12.2. Module recommendation

- xây service đọc `user_preferences`, `user_preferred_categories`, `user_activity_logs`;
- lấy danh sách `tours` public/published hợp lệ;
- chấm điểm rule-based;
- sắp xếp kết quả;
- trả thêm lý do gợi ý;
- log request nhẹ nếu cần.

## 12.3. Module AI chat

- tạo session;
- lấy lịch sử session;
- lưu message user;
- gọi OpenAI Responses API qua service riêng;
- cho AI gọi function nội bộ đã whitelist;
- lưu assistant response;
- kiểm soát lỗi, timeout, fallback.

## 12.4. Module accommodations

- truy vấn accommodation theo tour;
- truy vấn list accommodation tổng;
- filter accommodation active;
- join với `tour_accommodations`;
- chuẩn hóa response card-friendly cho frontend.

## 12.5. Module payments

- tạo payment transaction;
- sinh transaction code;
- gắn transaction với `tour_request_id` và `user_id`;
- cập nhật trạng thái payment;
- trả về response để frontend mô phỏng thanh toán;
- hỗ trợ confirm flow;
- lấy lịch sử thanh toán theo user.

## 12.6. Validation và permission

- recommendation chỉ cho user hợp lệ;
- AI chat chỉ cho chủ session truy cập;
- payment chỉ cho user là chủ của `tour_request`;
- accommodation public chỉ trả về dữ liệu được phép hiển thị;
- không để AI gọi dữ liệu private hoặc admin-only.

## 12.7. Logging và error handling

- log payment transaction ở mức đủ tra cứu;
- log AI call theo session/message;
- bắt lỗi provider hoặc mock flow;
- chuẩn hóa mã lỗi cho frontend hiển thị.

---

## 13. Công việc database

## 13.1. Mục tiêu tổng thể của database sprint này

Database trong Sprint 13 phải bảo đảm:

- đủ dữ liệu để demo recommendation;
- đủ lịch sử để demo AI chat;
- đủ liên kết để demo accommodation;
- đủ transaction để demo payment.

## 13.2. Chuẩn hóa dữ liệu preferences

- kiểm tra cấu trúc `user_preferences`;
- chuẩn hóa miền giá trị phù hợp với logic recommendation;
- seed dữ liệu cho nhiều kiểu user khác nhau;
- gắn `user_preferred_categories` hợp lý.

## 13.3. Chuẩn bị dữ liệu AI chat

- seed 1–2 `ai_chat_sessions`;
- seed `ai_chat_messages` mẫu;
- thêm index cho session/message nếu cần;
- kiểm tra quan hệ `session -> messages`.

## 13.4. Chuẩn bị dữ liệu accommodation

- seed `partner_accommodations`;
- seed `tour_accommodations`;
- bảo đảm tour demo có ít nhất một số liên kết accommodation;
- chuẩn hóa giá tham khảo, khu vực và mô tả.

## 13.5. Chuẩn bị dữ liệu payment

- seed `payment_transactions`;
- chuẩn hóa `transaction_code`;
- chuẩn hóa `status`;
- bảo đảm liên kết với `tour_requests` hợp lệ;
- có dữ liệu cho success / fail / pending.

## 13.6. Index và tối ưu cơ bản

Nên cân nhắc index cho:

- `ai_chat_sessions.user_id`
- `ai_chat_messages.session_id`
- `payment_transactions.user_id`
- `payment_transactions.tour_request_id`
- `tour_accommodations.tour_id`

## 13.7. Kiểm tra toàn vẹn dữ liệu

- foreign key của payment phải đúng với `tour_requests` và `users`;
- foreign key của AI session/message phải đúng;
- foreign key của accommodation relation phải đúng;
- dữ liệu seed không được tạo bản ghi mồ côi;
- transaction code không được trùng.

---

## 14. Tài liệu/UML

## 14.1. Activity Diagram cần hoàn thiện

Cần hoàn thiện Activity Diagram cho 4 luồng:

- gợi ý tour;
- chatbot AI;
- xem lưu trú liên quan;
- thanh toán trực tuyến.

## 14.2. Mô tả báo cáo cần cập nhật

- mô tả chức năng F21–F24;
- mô tả các màn hình M12, M13, M14, M22;
- cập nhật mapping giữa bảng – màn hình – API;
- cập nhật phần định hướng phát triển mở rộng.

## 14.3. Sequence Diagram có thể bổ sung nếu còn thời gian

Ưu tiên bổ sung:

- sequence “User hỏi chatbot AI”;
- sequence “User tạo payment transaction và xác nhận thanh toán”;
- sequence “User lấy recommendation”.

## 14.4. Nội dung cần nhấn mạnh khi viết báo cáo

Khi đưa Sprint 13 vào báo cáo, nên nhấn mạnh:

- đây là nhóm chức năng mở rộng;
- hệ thống triển khai ở mức phù hợp với đồ án;
- recommendation là rule-based;
- AI có kiểm soát truy cập dữ liệu;
- accommodation chỉ là liên kết tham khảo;
- payment ở mức sandbox/mock.

---

## 15. Đầu ra

Kết thúc Sprint 13, hệ thống cần đạt được các đầu ra sau:

### 15.1. Về chức năng

- có recommendation tour cơ bản;
- có chatbot AI tư vấn du lịch;
- có accommodation list liên quan đến tour;
- có payment flow ở mức sandbox/mock.

### 15.2. Về màn hình

- M12 chạy được với dữ liệu demo;
- M13 chat được với session/message;
- M14 hiển thị accommodation hợp lý;
- M22 mô phỏng được luồng thanh toán.

### 15.3. Về API

- API preferences / recommendation chạy được;
- API AI session/message chạy được;
- API accommodations chạy được;
- API payments chạy được.

### 15.4. Về dữ liệu

- có seed preferences;
- có seed AI chat;
- có seed accommodation;
- có seed payment transaction.

### 15.5. Về tài liệu

- Activity Diagram cho 4 luồng đã cập nhật;
- mô tả màn hình và chức năng đã cập nhật;
- phần định hướng mở rộng trong báo cáo đã hoàn thiện hơn.

### 15.6. Về giá trị bảo vệ đồ án

Sau Sprint 13, hệ thống có đầy đủ các nhóm chức năng mở rộng quan trọng để:

- tăng chất lượng trình bày;
- tạo điểm nhấn công nghệ;
- chứng minh tầm nhìn phát triển sản phẩm;
- nhưng vẫn giữ được tính khả thi và tính hợp lý của đồ án sinh viên.

### 15.7. Định nghĩa “xong sprint”

Sprint 13 chỉ nên được xem là hoàn tất khi:

- có đủ 4 nhóm chức năng mở rộng hoạt động ở mức demo được;
- có dữ liệu demo thuyết phục;
- có UI nối API;
- có trạng thái payment rõ;
- có AI session/message rõ;
- có recommendation logic giải thích được;
- có cập nhật UML/tài liệu đi kèm.

---

## Kết luận

Sprint 13 là sprint “điểm nhấn” của giai đoạn mở rộng. Nó không nhằm thay đổi cấu trúc hệ thống lõi, mà nhằm làm cho đồ án:

- hiện đại hơn;
- có chiều sâu hơn;
- dễ trình bày hơn;
- và có câu chuyện phát triển sản phẩm rõ hơn.

Nếu triển khai đúng tinh thần tài liệu đã chốt, Sprint 13 sẽ mang lại hiệu quả rất tốt cho phần bảo vệ:

- có AI nhưng không quá phức tạp;
- có recommendation nhưng không mơ hồ;
- có accommodation nhưng không biến thành hệ thống booking;
- có payment nhưng không kéo sang bài toán production.

Đó cũng chính là mức triển khai phù hợp nhất với một đồ án sinh viên theo hướng **khả thi, dễ demo và dễ bảo vệ**.
