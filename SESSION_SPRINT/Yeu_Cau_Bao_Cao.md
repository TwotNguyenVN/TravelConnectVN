Hãy thực hiện yêu cầu dưới đây như một nhiệm vụ audit toàn bộ dự án. Không hỏi lại nếu không cần thiết. Hãy đọc source và tài liệu trước, sau đó tự tạo các file báo cáo theo đúng cấu trúc yêu cầu.
Bạn là AI agent hỗ trợ phân tích mã nguồn và tài liệu đồ án website TravelConnectVN.

Mục tiêu của bạn là đọc, rà soát và tổng hợp toàn bộ nội dung thực tế của dự án để viết bản nháp báo cáo đồ án theo 3 chương và phần kết luận. Báo cáo phải tập trung vào những tính năng đã làm được trong source code, không viết lan man và không bịa chức năng nếu không tìm thấy bằng chứng trong mã nguồn hoặc tài liệu sprint.

# 1. Phạm vi bắt buộc phải đọc

Hãy bắt đầu từ thư mục gốc dự án `TravelConnectVN`.

Bạn cần đọc và phân tích các nhóm file/thư mục sau:

## A. Tài liệu tổng quan ở root
- `README.md`
- `BAO_CAO_TONG.md`
- `Bao_cao4-7.md`
- `Note.md`
- `WORK.md`
- `WORK_w_AGENT.md`
- `CLAUDE.md`

## B. Tài liệu sprint trong `SESSION_SPRINT`
Bắt buộc đọc kỹ các file:
- `SESSION_SPRINT/SESSION_LOG.md`
- `SESSION_SPRINT/PROJECT_STATUS.md`
- `SESSION_SPRINT/PROJECT_TASK.md`
- `SESSION_SPRINT/SPRINT_MASTER.md`
- `SESSION_SPRINT/SPRINT_CHECKLIST_MASTER.md`
- `SESSION_SPRINT/TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `SESSION_SPRINT/README_AGENT_WORKFLOW.md`
- `SESSION_SPRINT/HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `SESSION_SPRINT/SPRINT_01.md` đến `SESSION_SPRINT/SPRINT_14.md`
- `SESSION_SPRINT/SPRINT_13_VNPAY.md`
- `SESSION_SPRINT/plan_tour_calendar.md`

Mục tiêu khi đọc nhóm file này là xác định:
- tính năng nào đã hoàn thành;
- tính năng nào đang làm dở;
- tính năng nào chỉ ở mức mô phỏng/sandbox;
- tính năng nào mới nằm trong kế hoạch nhưng chưa có code;
- luồng demo chính của dự án;
- các quyết định kỹ thuật đã được chốt.

## C. Backend
Đọc toàn bộ source backend, ưu tiên:
- `backend/package.json`
- `backend/README.md`
- `backend/prisma/schema.prisma`
- `backend/prisma/*.ts`
- `backend/src/**/*.ts`
- các module trong `backend/src`: `auth`, `users`, `roles`, `tours`, `guides`, `guide-verification`, `tour-requests`, `companion-posts`, `chat`, `ai-chat`, `payments`, `reports`, `reviews`, `recommendations`, `notifications`, `admin`, `favorites`, `accommodations`, `user-activity-logs`, `socket`, `supabase`, `prisma`, `common`.

Không lấy `backend/dist` làm nguồn chính vì đây có thể là file build sinh ra. Chỉ dùng `dist` để đối chiếu khi source gốc thiếu hoặc có dấu hiệu khác biệt.

## D. Frontend
Đọc toàn bộ source frontend, ưu tiên:
- `frontend/package.json`
- `frontend/README.md`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/routes`
- `frontend/src/pages`
- `frontend/src/components`
- `frontend/src/api`
- `frontend/src/services`
- `frontend/src/contexts`
- `frontend/src/types`
- `frontend/src/layouts`
- `frontend/src/constants`
- `frontend/src/utils`

Mục tiêu là xác định các màn hình đã có thật, các luồng người dùng đã nối API, các màn hình chỉ mock/demo, và các màn hình còn thiếu.

## E. Database
Đọc kỹ:
- `database/README.md`
- `database/ERD.txt`
- `database/schema/*.sql`
- `database/seed/*.sql`
- `database/thiet_ke_du_lieu_du_lich_v2.md`

Mục tiêu là xác định:
- số lượng bảng thật đang dùng;
- nhóm bảng lõi;
- nhóm bảng mở rộng;
- các ràng buộc dữ liệu;
- trạng thái nghiệp vụ;
- dữ liệu seed phục vụ demo.

## F. Docs
Đọc:
- `docs/*.md`

Mục tiêu là đối chiếu tài liệu sprint, màn hình, API, nghiệp vụ và trạng thái hoàn thiện.

# 2. Cách làm việc bắt buộc

Bạn phải làm theo thứ tự sau:

## Bước 1: Khảo sát cấu trúc dự án
Tạo bản tóm tắt cấu trúc dự án gồm:
- frontend dùng công nghệ gì;
- backend dùng công nghệ gì;
- database dùng công nghệ gì;
- các module nghiệp vụ chính;
- các tài liệu sprint quan trọng.

## Bước 2: Lập bảng đối chiếu tính năng đã làm được
Tạo bảng với các cột:

| Nhóm chức năng | Tính năng | Mức độ hoàn thiện | Bằng chứng backend | Bằng chứng frontend | Bằng chứng database | Ghi chú |

Mức độ hoàn thiện chỉ dùng một trong các nhãn:
- `Đã làm được`
- `Đã làm một phần`
- `Mô phỏng/Sandbox`
- `Có tài liệu nhưng chưa thấy code`
- `Chưa đủ bằng chứng`

Không được ghi “đã hoàn thành” nếu không tìm thấy bằng chứng trong source code hoặc tài liệu sprint.

## Bước 3: Xác định các luồng nghiệp vụ đã có thể demo
Tập trung vào các luồng sau nếu có bằng chứng:
- khách truy cập xem trang chủ, danh sách tour, chi tiết tour;
- đăng ký, đăng nhập, phân quyền;
- người dùng cập nhật hồ sơ cá nhân;
- người dùng gửi yêu cầu tham gia tour;
- hướng dẫn viên quản lý tour;
- hướng dẫn viên duyệt/từ chối yêu cầu tham gia tour;
- người dùng tạo bài tìm bạn đồng hành;
- người dùng gửi yêu cầu tham gia bài đồng hành;
- chủ bài duyệt/từ chối yêu cầu đồng hành;
- quản trị viên quản lý người dùng/nội dung/báo cáo;
- đánh giá, yêu thích, thông báo, chat, AI chat, gợi ý tour, lưu trú, thanh toán nếu có code thực tế hoặc mô phỏng rõ ràng.

Với mỗi luồng, hãy nêu:
- actor tham gia;
- màn hình frontend liên quan;
- API/backend module liên quan;
- bảng dữ liệu liên quan;
- trạng thái hiện tại của luồng;
- hạn chế còn tồn tại.

## Bước 4: Viết báo cáo theo cấu trúc yêu cầu

Hãy tạo file Markdown mới tên:

`BAO_CAO_TONG_HOP_DUA_TREN_SOURCE.md`

Nội dung báo cáo gồm các phần sau.

---

# CHƯƠNG 1. TỔNG QUAN

## 1.1. Giới thiệu đề tài
Viết ngắn gọn về đề tài website du lịch kết nối:
- khách du lịch;
- hướng dẫn viên địa phương;
- người tìm bạn đồng hành.

Nội dung cần bám vào sản phẩm thực tế trong source code, không mô tả quá rộng như một startup hoàn chỉnh.

## 1.2. Tính cấp thiết và lý do hình thành đề tài
Trình bày lý do chọn đề tài:
- nhu cầu du lịch tự túc;
- nhu cầu tìm hướng dẫn viên địa phương;
- nhu cầu tìm bạn đồng hành;
- nhu cầu quản lý tour, yêu cầu tham gia, đánh giá, báo cáo vi phạm;
- ý nghĩa của nền tảng trong bối cảnh đồ án sinh viên.

## 1.3. Ý nghĩa khoa học và thực tiễn
Tách thành 2 ý:
- Ý nghĩa khoa học: vận dụng phân tích thiết kế hệ thống, UML, REST API, cơ sở dữ liệu quan hệ, phân quyền, thiết kế giao diện, kiểm thử phần mềm.
- Ý nghĩa thực tiễn: hỗ trợ tìm kiếm tour, kết nối guide, tạo bài đồng hành, quản lý yêu cầu, quản trị nội dung.

## 1.4. Mục tiêu nghiên cứu
Nêu rõ mục tiêu:
- phân tích yêu cầu hệ thống;
- thiết kế cơ sở dữ liệu;
- xây dựng frontend;
- xây dựng backend API;
- xây dựng các module đã có trong source;
- kiểm thử các luồng nghiệp vụ chính;
- tạo sản phẩm demo phục vụ bảo vệ đồ án.

## 1.5. Đối tượng và phạm vi nghiên cứu
Phải tách rõ:

### Đối tượng sử dụng
- khách truy cập;
- người dùng/khách du lịch;
- hướng dẫn viên;
- quản trị viên.

### Phạm vi chức năng đã làm được
Chỉ liệt kê các chức năng có bằng chứng trong source code hoặc tài liệu sprint.

### Phạm vi giới hạn
Nêu rõ phần nào chỉ mô phỏng/sandbox hoặc chưa hoàn thiện, ví dụ:
- thanh toán sandbox/mock nếu chưa tích hợp thật;
- AI/chatbot nếu chỉ ở mức demo;
- realtime nếu chưa hoàn chỉnh;
- khuyến nghị tour nếu chỉ rule-based;
- mobile app nếu chưa có.

## 1.6. Tóm tắt lý thuyết và nghiên cứu liên quan
Trình bày các lý thuyết liên quan ở mức phù hợp đồ án:
- hệ thống thông tin du lịch;
- nền tảng kết nối hai hoặc nhiều nhóm người dùng;
- mô hình client-server;
- RESTful API;
- RBAC/phân quyền theo vai trò;
- cơ sở dữ liệu quan hệ;
- UML trong phân tích thiết kế;
- thiết kế giao diện web;
- bảo mật xác thực người dùng;
- kiểm thử phần mềm.

Không bịa tên công trình nghiên cứu cụ thể nếu trong repository không có tài liệu tham khảo.

## 1.7. Cấu trúc đồ án
Trình bày cấu trúc báo cáo:
- Chương 1: Tổng quan;
- Chương 2: Cơ sở lý thuyết;
- Chương 3: Kết quả thực nghiệm;
- Kết luận.

Mỗi chương cần có mô tả ngắn 3–5 câu.

---

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

Chương này cần viết dựa trên công nghệ và kiến trúc thật trong source code.

## 2.1. Mô hình kiến trúc hệ thống
Mô tả kiến trúc tổng thể:
- frontend;
- backend;
- database;
- authentication;
- API;
- phân quyền.

Nếu source cho thấy dùng ReactJS, NestJS, TypeScript, Supabase/PostgreSQL, Prisma thì mô tả đúng theo source. Nếu có công nghệ khác, phải ghi theo thực tế.

## 2.2. Công nghệ frontend
Phân tích các công nghệ frontend thực tế từ `frontend/package.json` và source:
- React;
- TypeScript;
- Vite nếu có;
- React Router nếu có;
- thư viện UI nếu có;
- cách tổ chức pages/components/layouts/services.

## 2.3. Công nghệ backend
Phân tích backend thực tế từ `backend/package.json` và source:
- NestJS;
- TypeScript;
- module/controller/service;
- guard;
- DTO;
- exception filter;
- service layer;
- API REST.

## 2.4. Cơ sở dữ liệu và quản lý dữ liệu
Trình bày:
- Supabase/PostgreSQL hoặc DB thực tế;
- Prisma nếu có dùng;
- schema chính;
- nhóm bảng tài khoản/phân quyền;
- nhóm bảng guide;
- nhóm bảng tour;
- nhóm bảng companion;
- nhóm bảng report/admin;
- nhóm bảng mở rộng như chat, AI, payment, accommodation nếu có.

## 2.5. Xác thực và phân quyền
Mô tả:
- cơ chế đăng nhập;
- JWT/session nếu có;
- auth guard;
- role guard;
- roles/user_roles;
- các vai trò: USER, GUIDE, SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF nếu đúng với source.

## 2.6. Phân tích thiết kế bằng UML
Trình bày vai trò của:
- Use Case Diagram;
- Activity Diagram;
- Sequence Diagram;
- ERD/Class Diagram nếu có.

Chỉ nêu các sơ đồ có tài liệu hoặc có thể suy ra từ source/tài liệu sprint.

## 2.7. Các phương pháp giải quyết vấn đề trong hệ thống
Trình bày theo từng nhóm:
- tìm kiếm/lọc tour;
- quản lý trạng thái yêu cầu tham gia tour;
- quản lý trạng thái bài đồng hành;
- quản lý báo cáo vi phạm;
- đánh giá/yêu thích;
- thông báo;
- chat;
- AI/recommendation/payment nếu có.

Với mỗi nhóm, ghi rõ phần nào đã làm thật, phần nào mô phỏng.

## 2.8. Các ràng buộc nghiệp vụ
Tổng hợp từ source/database:
- user chỉ sửa hồ sơ của chính mình;
- guide chỉ quản lý tour của mình;
- user gửi yêu cầu tham gia tour;
- guide duyệt/từ chối request thuộc tour mình quản lý;
- chủ bài đồng hành duyệt/từ chối request;
- admin xử lý nội dung/báo cáo;
- trạng thái tour, request, report, payment nếu có.

---

# CHƯƠNG 3. KẾT QUẢ THỰC NGHIỆM

Chương này là trọng tâm. Phải tập trung vào sản phẩm phần mềm đã triển khai.

## 3.1. Môi trường thực nghiệm
Nêu:
- môi trường frontend;
- môi trường backend;
- database;
- cách chạy dự án nếu tìm thấy trong README/package scripts;
- các lệnh npm chính;
- seed/migration nếu có.

## 3.2. Kết quả xây dựng kiến trúc source code
Mô tả cấu trúc:
- frontend;
- backend;
- database;
- docs;
- SESSION_SPRINT.

## 3.3. Kết quả xây dựng cơ sở dữ liệu
Trình bày:
- số bảng thực tế;
- các nhóm bảng;
- bảng lõi;
- bảng mở rộng;
- dữ liệu seed;
- ràng buộc quan trọng.

## 3.4. Kết quả xây dựng backend API
Liệt kê các module backend đã có thật.

Với mỗi module quan trọng, trình bày:
- mục đích;
- controller/API chính nếu có;
- service xử lý chính;
- bảng dữ liệu liên quan;
- trạng thái hoàn thiện.

Ưu tiên các module:
- auth;
- users;
- roles;
- tours;
- guides;
- guide-verification;
- tour-requests;
- companion-posts;
- reports;
- reviews;
- favorites;
- notifications;
- admin;
- chat;
- ai-chat;
- recommendations;
- accommodations;
- payments.

## 3.5. Kết quả xây dựng frontend
Liệt kê các khu vực giao diện đã có:
- Public Area;
- User Area;
- Guide Area;
- Admin Area.

Với mỗi khu vực, nêu:
- màn hình đã có;
- chức năng chính;
- API/service liên quan;
- trạng thái nối backend hay mock.

## 3.6. Hồ sơ thiết kế phần mềm
Trình bày các hồ sơ thiết kế đã có:
- danh sách chức năng;
- danh sách màn hình;
- ERD/schema;
- UML;
- sequence/activity nếu có;
- mapping frontend/backend/database nếu có.

## 3.7. Các luồng thực nghiệm chính đã kiểm tra
Tạo bảng:

| Luồng demo | Actor | Frontend | Backend | Database | Kết quả | Hạn chế |

Tập trung vào những luồng có thể demo thật.

## 3.8. Kết quả đạt được theo nhóm chức năng
Tạo bảng:

| Nhóm chức năng | Kết quả đạt được | Bằng chứng source/tài liệu | Đánh giá |

Nhóm chức năng nên gồm:
- tài khoản và phân quyền;
- tour;
- hướng dẫn viên;
- yêu cầu tham gia tour;
- bài đồng hành;
- yêu cầu tham gia bài đồng hành;
- quản trị hệ thống;
- báo cáo vi phạm;
- đánh giá/yêu thích;
- chat/AI/payment/lưu trú nếu có.

## 3.9. Hạn chế còn tồn tại
Nêu trung thực:
- chức năng nào chưa hoàn chỉnh;
- phần nào còn mock;
- phần nào chưa nối API;
- phần nào thiếu test;
- phần nào cần tối ưu UI/UX;
- phần nào cần bổ sung bảo mật.

## 3.10. Định hướng phát triển tiếp theo
Nêu:
- hoàn thiện realtime chat;
- hoàn thiện payment thật;
- nâng cấp recommendation;
- nâng cấp chatbot AI;
- cải thiện quản trị;
- bổ sung kiểm thử tự động;
- triển khai production.

---

# KẾT LUẬN

Viết ngắn gọn khoảng 1–2 trang.

Phần kết luận cần có:

## 1. Kết quả đạt được
Khẳng định các kết quả chính:
- đã xây dựng được website theo mô hình frontend/backend/database;
- đã triển khai các phân hệ lõi;
- đã có CSDL và seed demo;
- đã có tài liệu thiết kế;
- đã có các luồng demo chính.

## 2. Đóng góp của đề tài
Nêu đóng góp:
- xây dựng nền tảng kết nối khách du lịch, hướng dẫn viên và người tìm bạn đồng hành;
- tổ chức nghiệp vụ theo vai trò;
- quản lý tour và yêu cầu tham gia;
- hỗ trợ quản trị và xử lý nội dung;
- tạo nền tảng mở rộng AI/chat/payment/lưu trú.

## 3. Hạn chế
Nêu đúng thực tế, không che giấu:
- một số chức năng nâng cao còn mô phỏng;
- một số module có thể chưa hoàn thiện;
- hiệu năng/bảo mật/test còn cần cải thiện;
- chưa triển khai production nếu đúng.

## 4. Kiến nghị và hướng phát triển
Nêu ngắn gọn:
- hoàn thiện kiểm thử;
- tăng bảo mật;
- nâng cấp trải nghiệm người dùng;
- tích hợp dịch vụ thật;
- triển khai thực tế.

# 3. Quy tắc viết bắt buộc

- Viết bằng tiếng Việt.
- Văn phong học thuật, phù hợp báo cáo đồ án sinh viên.
- Tập trung vào những gì source code và tài liệu cho thấy đã làm được.
- Không phóng đại hệ thống thành sản phẩm thương mại hoàn chỉnh.
- Không bịa tính năng, API, bảng dữ liệu, màn hình.
- Mỗi nhận định quan trọng nên kèm đường dẫn file hoặc thư mục làm bằng chứng.
- Khi không chắc, ghi rõ: “chưa đủ bằng chứng trong source code”.
- Phân biệt rõ:
  - đã làm thật;
  - đã làm một phần;
  - mô phỏng/sandbox;
  - chỉ có trong kế hoạch/tài liệu;
  - chưa thấy code.
- Ưu tiên tính nhất quán giữa source code, tài liệu sprint, database, frontend và backend.
- Báo cáo cuối cùng phải dùng được để chỉnh sửa thành báo cáo tốt nghiệp.

# 4. Đầu ra cần tạo

Sau khi phân tích, hãy tạo các file sau:

1. `SOURCE_AUDIT_FEATURES.md`
   - Bảng tổng hợp tính năng đã làm được.
   - Bằng chứng source code/tài liệu.
   - Mức độ hoàn thiện.

2. `BAO_CAO_TONG_HOP_DUA_TREN_SOURCE.md`
   - Báo cáo đầy đủ gồm Chương 1, Chương 2, Chương 3 và Kết luận.

3. `DEMO_FLOWS_FROM_SOURCE.md`
   - Danh sách các luồng demo có thể trình bày khi bảo vệ.
   - Mỗi luồng có actor, màn hình, API, bảng dữ liệu, dữ liệu demo và hạn chế.

4. `GAP_ANALYSIS.md`
   - Những điểm còn thiếu giữa kế hoạch sprint và source code hiện tại.
   - Tính năng nào nên ưu tiên hoàn thiện tiếp.