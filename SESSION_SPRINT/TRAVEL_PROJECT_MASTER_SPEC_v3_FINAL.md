# TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md

> Tài liệu gốc dùng chung cho:
> 1. đồ án **website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành**  
> 2. AI agent **Antigravity**  
> 3. checklist kiểm soát phạm vi, màn hình, dữ liệu, API, UML, sprint và tiến độ triển khai

---

# 1. Mục đích của tài liệu

Tài liệu này là **source of truth** cho toàn bộ dự án **TravelConnectVN**.

Nó có 8 vai trò cùng lúc:

1. Mô tả đầy đủ bài toán, mục tiêu, phạm vi, chức năng, nghiệp vụ và màn hình của đồ án.
2. Chỉ rõ kiến trúc kỹ thuật, Area, Role, quyền truy cập, mô hình dữ liệu, API và nguyên tắc triển khai.
3. Làm bảng điều hướng để AI agent biết hệ thống đang là gì, làm đến đâu và nên làm tiếp gì.
4. Làm checklist nghiệm thu theo giai đoạn để tránh làm lan man, sai thứ tự hoặc bỏ sót.
5. Làm nền chuẩn để viết báo cáo phân tích, thiết kế, cơ sở dữ liệu, UML và kế hoạch triển khai.
6. Ràng buộc AI agent phải đọc đúng **skill nội bộ** và **style guide giao diện** trước khi làm UI.
7. Làm mốc chuẩn để thống nhất giữa code, báo cáo, UML, màn hình, `SPRINT_MASTER.md`, `SPRINT_CHECKLIST_MASTER.md` và kế hoạch 14 sprint.
8. Làm tài liệu bàn giao xuyên suốt giữa nhiều phiên làm việc với AI agent.

---

# 2. Tuyên bố phạm vi dự án

## 2.1. Tên đề tài
**Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành — TravelConnectVN**

## 2.2. Mục tiêu chính

Xây dựng một website du lịch có khả năng:

- kết nối **khách du lịch** với **hướng dẫn viên địa phương** thông qua tour
- kết nối **người dùng với nhau** thông qua bài đăng tìm bạn đồng hành
- hỗ trợ tìm kiếm, lọc và xem chi tiết tour
- hỗ trợ quản lý hồ sơ hướng dẫn viên, tour và yêu cầu tham gia
- hỗ trợ quản trị người dùng, nội dung, báo cáo vi phạm và thống kê cơ bản
- cho phép mở rộng về sau sang chat, AI tư vấn, lưu trú, thanh toán và các tiện ích thông minh

## 2.3. Hai trục giá trị trung tâm

Hệ thống phải luôn thể hiện rõ **2 trục giá trị cốt lõi**:

### Trục 1 — Khách du lịch kết nối với hướng dẫn viên thông qua tour
Người dùng xem tour công khai, xem chi tiết tour, xem hồ sơ hướng dẫn viên, gửi yêu cầu tham gia tour, và hướng dẫn viên xử lý các yêu cầu này.

### Trục 2 — Người dùng kết nối với nhau thông qua bài tìm bạn đồng hành
Người dùng tạo bài đồng hành, người khác gửi yêu cầu tham gia, chủ bài duyệt thành viên, và sau đó có thể trao đổi thêm trong nhóm.

## 2.4. Phạm vi chính thức của đồ án

### Nhóm bắt buộc làm thật
- tài khoản và phân quyền
- hồ sơ cá nhân
- hồ sơ hướng dẫn viên
- quản lý tour
- yêu cầu tham gia tour
- bài tìm bạn đồng hành
- yêu cầu tham gia bài đồng hành
- báo cáo vi phạm
- quản trị cơ bản

### Nhóm nên có nếu còn thời gian
- đánh giá tour
- đánh giá hướng dẫn viên
- danh sách yêu thích
- lịch sử hoạt động
- thông báo
- bản đồ lộ trình tour
- thống kê cơ bản
- xác minh hồ sơ hướng dẫn viên

### Nhóm mở rộng / mô phỏng / làm sau
- chat trực tiếp
- chat nhóm bài đồng hành
- gợi ý tour thông minh
- chatbot AI tư vấn du lịch
- liên kết dịch vụ lưu trú
- thanh toán trực tuyến sandbox
- thông báo thời gian thực nâng cao
- lịch rảnh hướng dẫn viên

## 2.5. Nguyên tắc phạm vi

- **Lõi trước, mở rộng sau**
- **Giữ 38 bảng là schema chuẩn cuối**
- **Không tạo một schema rút gọn khác**
- **Các chức năng mở rộng có thể xuất hiện trong schema và màn hình nhưng chưa cần code sâu ngay**
- **Phạm vi code thật và phạm vi trình bày phải được phân biệt rõ**

---

# 3. Area, Role và quy tắc phân quyền

## 3.1. Area chính của hệ thống

Hệ thống được chia thành **4 Area**:

1. **Public Area**
2. **User Area**
3. **Guide Area**
4. **Admin Area**

Admin Area là một khu vực quản trị thống nhất nhưng được phân tách theo 3 role nội bộ để bảo đảm rõ trách nhiệm và phạm vi xử lý.

## 3.2. Vai trò người dùng

### Vai trò truy cập công khai
- **Guest / Khách truy cập**

### Vai trò nghiệp vụ chính
- **User / Khách du lịch**
- **Guide / Hướng dẫn viên**

### Vai trò quản trị nội bộ
- **SYSTEM_ADMIN**
- **CONTENT_MODERATOR**
- **SUPPORT_STAFF**

## 3.3. Ma trận truy cập theo Area

| Area | Guest | User | Guide | SYSTEM_ADMIN | CONTENT_MODERATOR | SUPPORT_STAFF |
|---|---:|---:|---:|---:|---:|---:|
| Public Area | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Area | ❌ | ✅ | ✅ (đối với hồ sơ/tài khoản của chính mình) | ✅ (nếu cần với hồ sơ chính mình) | ✅ (nếu cần với hồ sơ chính mình) | ✅ (nếu cần với hồ sơ chính mình) |
| Guide Area | ❌ | ❌ | ✅ | ✅ (giám sát / quản trị) | giới hạn | giới hạn |
| Admin Area | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

## 3.4. Quy tắc đặc biệt

- Guest có thể xem nội dung công khai nhưng không được thực hiện thao tác nghiệp vụ cá nhân.
- User tự đăng ký tài khoản sẽ có role mặc định là **USER**.
- Một người dùng muốn trở thành Guide phải được gán role **GUIDE** rồi mới tạo hồ sơ nghề nghiệp.
- Admin Area không phải 1 vai trò duy nhất mà là 1 khu vực dùng chung cho 3 vai trò nội bộ.
- SYSTEM_ADMIN là role có phạm vi rộng nhất.
- CONTENT_MODERATOR thiên về kiểm duyệt nội dung công khai và trạng thái hiển thị.
- SUPPORT_STAFF thiên về tiếp nhận và xử lý báo cáo / khiếu nại / phản ánh.
- Không hard-code role string rời rạc nếu đã có constants hoặc enum.

---

# 4. Nguồn điều phối bắt buộc cho AI agent

Khi làm việc trong repo, AI agent **bắt buộc** phải đọc đủ:

## 4.1. File điều phối dự án
- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `PROJECT_STATUS.md`
- `SPRINT_PHASE_TASK_BREAKDOWN.md`
- `SPRINT_MASTER.md`
- `SPRINT_CHECKLIST_MASTER.md`
- `AGENT_BOOTSTRAP_PROMPT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `SPRINT_01.md` … `SPRINT_14.md` theo sprint hiện tại
- `SESSION_LOG.md`

## 4.2. Skill nội bộ
Agent phải rà thư mục:

```text
.agents/skills/
```

và đọc các skill liên quan trước khi thực hiện task, đặc biệt các nhóm:

- architecture / blueprint / decision
- coding standards
- api design
- backend patterns
- frontend patterns
- frontend design
- design system
- database migrations
- postgres / schema
- e2e testing
- browser QA
- security review
- verification loop
- documentation lookup

## 4.3. Style guide giao diện bắt buộc
Nếu task có UI, agent phải đọc:

```text
.agents/ui_style_guide_for_ai_agent.md
```

trước khi làm bất kỳ màn hình, component, layout, card, form, table, tab, dashboard, filter bar hay empty state nào.

## 4.4. Nguyên tắc bắt buộc khi áp dụng skill và style guide

- Không được làm UI khi chưa đọc style guide.
- Không được làm migration khi chưa đọc schema / model / seed / state machine liên quan.
- Không được làm lan man ngoài sprint hiện tại.
- Không được dùng nhầm context PowerTech / ecommerce / retail-tech.
- Không được thay đổi tone giao diện trái với style guide hiện hành của TravelConnectVN.

## 4.5. Quy tắc làm việc với Supabase qua MCP
Antigravity đã được kết nối với MCP Supabase của dự án.
Khi triển khai hoặc phân tích nghiệp vụ, agent phải ưu tiên dựa trên dữ liệu thật đang có trong Supabase.
Agent phải đọc và đối chiếu schema, bảng, record, trạng thái dữ liệu hiện có trước khi đề xuất triển khai.
Nếu phát hiện:
thiếu dữ liệu mẫu,
thiếu seed,
thiếu quan hệ dữ liệu,
thiếu bảng/phần tử hỗ trợ demo,
dữ liệu sai hoặc chưa đủ để chạy luồng,
thì agent không được tự ý thêm, sửa, xóa dữ liệu.
Trong các trường hợp đó, agent phải:
mô tả rõ vấn đề phát hiện được,
nêu dữ liệu nào đang thiếu hoặc đang sai,
đề xuất phương án xử lý,
chờ người dùng xác nhận trước khi thực hiện bất kỳ thay đổi dữ liệu nào.
Agent chỉ được phép thao tác dữ liệu khi có chỉ đạo rõ ràng từ người dùng.
Mặc định:
không tự tạo data
không tự update data
không tự delete data
không tự seed data
Nếu cần dữ liệu mới để demo hoặc test, agent phải coi đó là đề xuất chờ duyệt, không phải hành động mặc định.

---

# 5. Công nghệ chốt và kiến trúc triển khai

## 5.1. Stack công nghệ chính thức

- **Frontend:** ReactJS
- **Backend:** NestJS + TypeScript
- **Database:** Supabase / PostgreSQL
- **Authentication:** Supabase Auth
- **Authorization:** role-based + guard ở backend + kiểm soát dữ liệu ở database
- **ORM / DB access:** tùy lựa chọn triển khai, nhưng phải nhất quán với schema 38 bảng
- **UI direction:** website du lịch hiện đại, rõ ràng, đáng tin, thiên trải nghiệm
- **Triển khai:** theo mô hình 14 sprint

## 5.2. Kiến trúc logic

Hệ thống theo mô hình:

- frontend React tách theo route/feature/module
- backend NestJS tách theo module nghiệp vụ
- database dùng schema chuẩn 38 bảng
- lớp auth và role độc lập với nghiệp vụ
- nghiệp vụ đi qua service/use-case rõ ràng
- dữ liệu hiển thị nên qua DTO/ViewModel/response model
- audit và moderation có bảng ghi lịch sử riêng

## 5.3. Module backend khuyến nghị

Backend nên chia tối thiểu thành **11 module**:

1. `auth-me`
2. `guides`
3. `guide-verification`
4. `tours`
5. `tour-requests`
6. `reviews`
7. `companions`
8. `favorites`
9. `reports-notifications`
10. `chat-ai`
11. `admin`

## 5.4. Cấu trúc thư mục gợi ý

```text
TravelConnectVN/
  .agents/
    skills/
    ui_style_guide_for_ai_agent.md
  apps/
    web/
    api/
  packages/ (nếu tách mono-repo)
  docs/
  database/
    migrations/
    seed/
    schema/
  src/ (nếu single repo structure)
```

Nếu tách project đơn giản hơn:

```text
TravelConnectVN/
  .agents/
    skills/
    ui_style_guide_for_ai_agent.md
  frontend/
  backend/
  database/
  docs/
  TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
  PROJECT_STATUS.md
  SPRINT_PHASE_TASK_BREAKDOWN.md
  SPRINT_MASTER.md
  SPRINT_CHECKLIST_MASTER.md
  SESSION_LOG.md
  SPRINT_01.md ... SPRINT_14.md
```

## 5.5. Nguyên tắc tổ chức code

- Không nhồi nghiệp vụ lớn vào controller.
- Không để frontend gọi dữ liệu theo cách phá quyền role.
- Không render thẳng entity phức tạp nếu dễ lộ dữ liệu nhạy cảm.
- Không để state machine nằm rải rác nhiều nơi.
- Validation đầu vào phải rõ và nhất quán.
- Migration phải ưu tiên additive, an toàn.
- Seeder phải idempotent.
- UI mới phải ưu tiên tái sử dụng component sẵn có.

---

# 6. Tóm tắt nghiệp vụ cốt lõi

## 6.1. Luồng công khai / khám phá hệ thống

- xem trang chủ
- xem tour công khai
- lọc và tìm kiếm tour
- xem chi tiết tour
- xem bản đồ lộ trình tour
- xem danh sách hướng dẫn viên công khai
- xem hồ sơ hướng dẫn viên công khai
- xem danh sách bài tìm bạn đồng hành
- xem chi tiết bài đồng hành
- đăng ký / đăng nhập

## 6.2. Luồng tài khoản và người dùng

- đăng ký
- đăng nhập
- đăng xuất
- cập nhật hồ sơ cá nhân
- đổi mật khẩu
- xem vai trò hiện tại
- quản lý danh sách yêu thích
- xem lịch sử hoạt động
- xem thông báo
- gửi báo cáo vi phạm

## 6.3. Luồng hướng dẫn viên

- tạo/cập nhật hồ sơ hướng dẫn viên
- quản lý ngôn ngữ và kỹ năng
- gửi yêu cầu xác minh hồ sơ
- tạo tour
- cập nhật tour
- xuất bản tour
- quản lý lịch trình / địa điểm tour
- xem và xử lý yêu cầu tham gia tour

## 6.4. Luồng tour

- người dùng xem tour
- người dùng gửi yêu cầu tham gia tour
- hướng dẫn viên duyệt hoặc từ chối
- người dùng theo dõi trạng thái yêu cầu
- review tour và hướng dẫn viên sau chuyến đi nếu đủ điều kiện

## 6.5. Luồng bài đồng hành

- người dùng tạo bài tìm bạn đồng hành
- người khác gửi yêu cầu tham gia
- chủ bài duyệt hoặc từ chối
- nhóm thành viên có thể trao đổi thêm ở mức mở rộng

## 6.6. Luồng quản trị

- dashboard tổng quan
- quản lý người dùng và phân quyền
- quản lý hồ sơ hướng dẫn viên và xác minh
- quản trị tour toàn hệ thống
- quản trị bài đồng hành toàn hệ thống
- tiếp nhận và xử lý báo cáo vi phạm
- theo dõi thống kê và nhật ký quản trị

---

# 7. Danh mục chức năng chính của hệ thống

Hệ thống có **29 chức năng nghiệp vụ** được chia như sau.

## 7.1. Nhóm tài khoản và người dùng

**F01. Đăng ký, đăng nhập, đăng xuất**  
Cho phép khách truy cập tạo tài khoản, đăng nhập để sử dụng hệ thống và đăng xuất khi kết thúc phiên làm việc.

**F02. Quản lý hồ sơ cá nhân**  
Cho phép người dùng cập nhật thông tin cá nhân và thay đổi mật khẩu.

**F03. Phân quyền người dùng trong hệ thống**  
Hệ thống hỗ trợ phân quyền theo vai trò: USER, GUIDE, SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF.

**F04. Quản lý lịch sử hoạt động cá nhân**  
Cho phép người dùng theo dõi các thao tác đã thực hiện.

**F05. Quản lý danh sách yêu thích**  
Cho phép lưu tour và hướng dẫn viên quan tâm.

**F06. Gửi báo cáo vi phạm**  
Cho phép phản ánh tour, bài đồng hành hoặc tài khoản có dấu hiệu vi phạm.

**F07. Nhận thông báo**  
Cho phép nhận thông báo liên quan đến request, cập nhật trạng thái hoặc tác vụ hệ thống ở mức phù hợp đồ án; không bắt buộc realtime đầy đủ trong giai đoạn đầu.

## 7.2. Nhóm hướng dẫn viên

**F08. Quản lý hồ sơ hướng dẫn viên**  
Guide tạo và cập nhật hồ sơ nghề nghiệp, kinh nghiệm, kỹ năng, ngôn ngữ, khu vực hoạt động.

**F09. Xác minh hồ sơ hướng dẫn viên**  
Guide gửi giấy tờ/chứng chỉ để hệ thống hoặc admin xác minh.

**F10. Quản lý tour**  
Guide đăng tour, chỉnh sửa, xuất bản, đóng hoặc ngừng hiển thị tour.

**F11. Quản lý yêu cầu tham gia tour**  
Guide xem danh sách yêu cầu tham gia tour và thực hiện approve/reject.

## 7.3. Nhóm khách du lịch / người dùng

**F12. Xem danh sách tour**  
Người dùng duyệt toàn bộ tour công khai.

**F13. Tìm kiếm, lọc và sắp xếp tour**  
Tìm tour theo địa điểm, thời gian, giá, đánh giá hoặc mức độ phù hợp.

**F14. Xem chi tiết tour**  
Xem thông tin đầy đủ về tour, lịch trình, hình ảnh, điều kiện tham gia và thông tin hướng dẫn viên.

**F15. Xem lộ trình tour trên bản đồ**  
Hiển thị các điểm đến theo hành trình.

**F16. Quản lý bài tìm bạn đồng hành**  
Tạo, cập nhật, đóng, xóa mềm hoặc xem bài đồng hành của mình.

**F17. Quản lý yêu cầu tham gia bài đồng hành**  
Người dùng gửi request; chủ bài duyệt hoặc từ chối.

**F18. Đánh giá tour và hướng dẫn viên**  
Cho phép đánh giá sau khi tham gia đủ điều kiện nghiệp vụ.

## 7.4. Nhóm giao tiếp và hỗ trợ trải nghiệm

**F19. Chat trực tiếp giữa người dùng và hướng dẫn viên**  
Trao đổi thông tin tour và yêu cầu cụ thể.

**F20. Chat nhóm bài đồng hành**  
Không gian trao đổi của các thành viên cùng một bài đồng hành.

**F21. Gợi ý tour thông minh**  
Đề xuất tour dựa trên hành vi hoặc sở thích.

**F22. Chatbot AI tư vấn du lịch**  
Hỗ trợ hỏi đáp và tư vấn du lịch.

## 7.5. Nhóm dịch vụ mở rộng

**F23. Liên kết dịch vụ lưu trú**  
Hiển thị nơi lưu trú liên quan đến tour.

**F24. Thanh toán trực tuyến**  
Thanh toán hoặc đặt cọc tour ở mức sandbox/mock.

## 7.6. Nhóm quản trị hệ thống

**F25. Quản trị dữ liệu tổng thể**  
Quản lý người dùng, guide, tour, bài đồng hành và các dữ liệu liên quan.

**F26. Phê duyệt hồ sơ chuyên môn của hướng dẫn viên**  
Xử lý yêu cầu xác minh hồ sơ.

**F27. Quản lý nội dung vi phạm**  
Ẩn/hiện/gắn cờ nội dung, đánh giá hoặc đối tượng vi phạm.

**F28. Thống kê và báo cáo hệ thống**  
Theo dõi chỉ số cơ bản: số user, guide, tour, bài đồng hành, report, giao dịch, xác minh.

**F29. Giao diện quản trị trực quan**  
Admin dashboard, bảng dữ liệu, filter, điều hướng quản trị và lịch sử hoạt động.

---

# 8. Mức ưu tiên triển khai

## 8.1. Ưu tiên 1 — Bắt buộc giai đoạn đầu
- F01, F02, F03
- F08, F10, F11
- F12, F13, F14
- F16, F17
- F25, F26, F27
- Public home, auth, tour core, companion core, guide core, admin core

## 8.2. Ưu tiên 2 — Nên có nếu còn thời gian
- F04, F05, F07
- F09
- F15, F18
- F28, một phần F29

## 8.3. Ưu tiên 3 — Mở rộng / mô phỏng
- F19, F20, F21, F22, F23, F24
- guide availability nâng cao
- realtime notification/chat nâng cao

**Nguyên tắc bắt buộc:** Nhóm ưu tiên 3 chỉ triển khai ở mức **cơ bản, mô phỏng hợp lý hoặc sandbox/mock flow**; không được kéo ngược làm chậm hoặc phá vỡ MVP lõi đã ổn định ở Sprint 09.

---

# 9. Nghiệp vụ chi tiết theo từng nhóm người dùng

## 9.1. Guest

### Được phép
- xem trang chủ
- xem danh sách tour
- lọc và tìm kiếm tour
- xem chi tiết tour
- xem bản đồ lộ trình tour
- xem danh sách và hồ sơ hướng dẫn viên công khai
- xem danh sách và chi tiết bài đồng hành
- đăng ký
- đăng nhập
- xem gợi ý công khai hoặc bán cá nhân hóa ở mức giới hạn nếu hệ thống cho phép

### Không được
- gửi yêu cầu tham gia tour
- tạo bài đồng hành
- gửi request tham gia bài đồng hành
- đánh giá
- yêu thích
- gửi report dưới tài khoản chưa xác thực
- truy cập khu vực cá nhân / guide / admin

## 9.2. User / Khách du lịch

### Được phép
- toàn bộ quyền công khai
- quản lý hồ sơ cá nhân
- đổi mật khẩu
- gửi yêu cầu tham gia tour
- theo dõi yêu cầu tham gia tour của mình
- tạo/cập nhật bài tìm bạn đồng hành
- gửi yêu cầu tham gia bài đồng hành
- duyệt request nếu là chủ bài
- đánh giá tour/hướng dẫn viên khi đủ điều kiện
- lưu yêu thích
- nhận thông báo
- gửi report

### Không được
- quản lý tour của người khác
- truy cập Admin Area
- xử lý moderation cấp hệ thống

## 9.3. Guide / Hướng dẫn viên

### Được phép
- toàn bộ quyền User đối với tài khoản chính mình
- tạo/cập nhật hồ sơ nghề nghiệp
- quản lý kỹ năng, ngôn ngữ, lịch rảnh (nếu triển khai)
- gửi yêu cầu xác minh
- tạo/cập nhật/xuất bản tour
- quản lý lịch trình và địa điểm tour
- xem và xử lý yêu cầu tham gia tour của tour mình
- trao đổi với user ở mức chat mở rộng

### Không được
- quản trị dữ liệu toàn hệ thống
- duyệt nội dung ngoài phạm vi tour của mình

## 9.4. SYSTEM_ADMIN

### Được phép
- quản lý user
- khóa/mở khóa tài khoản
- gán/gỡ role
- quản trị guide/tour/companion
- xem dashboard, statistics, audit logs
- truy cập sâu nhất trong Admin Area

## 9.5. CONTENT_MODERATOR

### Được phép
- kiểm duyệt nội dung công khai
- ẩn/hiện/gắn cờ hồ sơ guide, tour, bài đồng hành, đánh giá
- xử lý trạng thái hiển thị và nội dung vi phạm
- phối hợp với SYSTEM_ADMIN hoặc SUPPORT_STAFF khi cần

## 9.6. SUPPORT_STAFF

### Được phép
- tiếp nhận report
- phân loại và giao xử lý báo cáo
- cập nhật trạng thái và kết quả xử lý
- xem lịch sử xử lý khiếu nại
- xem thống kê hỗ trợ

---

# 10. Danh mục màn hình chuẩn triển khai

Hệ thống chuẩn hóa **47 màn hình**. Không phải mọi chức năng đều là 1 page riêng; có thể là page, tab, drawer, modal hoặc khu vực thao tác. Tuy nhiên, để thuận tiện cho code, báo cáo và điều phối AI, tất cả được chuẩn hóa thành danh sách màn hình sau.

## 10.1. Public Area (14 màn hình)

### M01 — Trang chủ
- **Mục đích:** giới thiệu nền tảng và điều hướng nhanh
- **Nội dung chính:** banner, CTA, tour nổi bật, guide nổi bật, bài đồng hành mới, khối giới thiệu tính năng, footer
- **Actor:** Guest, User, Guide, Admin

### M02 — Đăng ký tài khoản
- **Mục đích:** tạo tài khoản mới
- **Nội dung chính:** email, mật khẩu, xác nhận mật khẩu, họ tên, điều khoản
- **Actor:** Guest

### M03 — Đăng nhập
- **Mục đích:** xác thực tài khoản và điều hướng theo role
- **Nội dung chính:** email, mật khẩu, lỗi xác thực, liên kết đăng ký/quên mật khẩu
- **Actor:** Guest

### M04 — Danh sách tour
- **Mục đích:** duyệt tour công khai
- **Nội dung chính:** card tour, ảnh, địa điểm, thời gian, giá, đánh giá, phân trang
- **Actor:** Tất cả người truy cập

### M05 — Tìm kiếm / lọc / sắp xếp tour
- **Mục đích:** thu hẹp danh sách tour theo tiêu chí
- **Nội dung chính:** ô tìm kiếm, bộ lọc địa điểm, thời gian, giá, đánh giá, sort
- **Actor:** Tất cả người truy cập

### M06 — Chi tiết tour
- **Mục đích:** xem thông tin đầy đủ và phát sinh thao tác nghiệp vụ
- **Nội dung chính:** tên tour, ảnh, mô tả, lịch trình, điểm hẹn, giá, số chỗ, điều kiện tham gia, thông tin hướng dẫn viên, đánh giá, nút yêu thích, gửi yêu cầu, báo cáo
- **Actor:** Guest xem; User thao tác nâng cao

### M07 — Bản đồ lộ trình tour
- **Mục đích:** hiển thị trực quan các điểm đến trên bản đồ
- **Nội dung chính:** map, marker, thứ tự hành trình, thời gian ghé, tóm tắt lộ trình
- **Actor:** Tất cả người truy cập

### M08 — Danh sách hướng dẫn viên công khai
- **Mục đích:** duyệt danh sách guide
- **Nội dung chính:** avatar, tên, khu vực hoạt động, kinh nghiệm, ngôn ngữ, rating, trạng thái xác minh
- **Actor:** Tất cả người truy cập

### M09 — Hồ sơ hướng dẫn viên công khai
- **Mục đích:** xem chi tiết hồ sơ nghề nghiệp
- **Nội dung chính:** avatar, bio, kinh nghiệm, khu vực hoạt động, kỹ năng, ngôn ngữ, trạng thái xác minh, rating, danh sách tour
- **Actor:** Tất cả người truy cập

### M10 — Danh sách bài tìm bạn đồng hành
- **Mục đích:** xem các bài đồng hành công khai
- **Nội dung chính:** tiêu đề, điểm đến, thời gian, chi phí dự kiến, số thành viên, trạng thái
- **Actor:** Tất cả người truy cập

### M11 — Chi tiết bài tìm bạn đồng hành
- **Mục đích:** xem đầy đủ nội dung bài và gửi request tham gia
- **Nội dung chính:** tiêu đề, điểm đến, thời gian, chi phí, mô tả, yêu cầu, thông tin chủ bài, trạng thái, nút gửi request, báo cáo
- **Actor:** Guest xem; User thao tác nâng cao

### M12 — Gợi ý tour thông minh
- **Mục đích:** hiển thị tour gợi ý
- **Nội dung chính:** danh sách tour đề xuất, lý do gợi ý, khối sở thích cơ bản
- **Actor:** User, có thể mở rộng cho Guest

### M13 — Chatbot AI tư vấn du lịch
- **Mục đích:** hỗ trợ hỏi đáp và tư vấn
- **Nội dung chính:** khung chat, lịch sử phiên, ô nhập, phản hồi AI
- **Actor:** User, có thể mở rộng cho Guest

### M14 — Liên kết dịch vụ lưu trú
- **Mục đích:** gợi ý nơi lưu trú liên quan tour
- **Nội dung chính:** danh sách khách sạn/homestay/resort, ảnh, địa chỉ, liên hệ, link ngoài hệ thống
- **Actor:** Guest, User

## 10.2. User Area (16 màn hình)

### M15 — Hồ sơ cá nhân
### M16 — Đổi mật khẩu
### M17 — Lịch sử hoạt động cá nhân
### M18 — Danh sách yêu thích
### M19 — Trung tâm thông báo
### M20 — Gửi báo cáo vi phạm
### M21 — Yêu cầu tham gia tour của tôi
### M22 — Thanh toán trực tuyến sandbox
### M23 — Danh sách bài đồng hành của tôi
### M24 — Tạo / cập nhật bài tìm bạn đồng hành
### M25 — Yêu cầu tham gia bài đồng hành đã gửi
### M26 — Quản lý yêu cầu tham gia bài đồng hành
### M27 — Đánh giá tour
### M28 — Đánh giá hướng dẫn viên
### M29 — Chat trực tiếp User – Guide
### M30 — Chat nhóm bài đồng hành

**Mô tả ngắn:**
- M15–M16: quản lý tài khoản
- M17–M19: lịch sử, yêu thích, thông báo
- M20–M22: report, tour request, payment
- M23–M26: companion post và companion request
- M27–M28: reviews
- M29–M30: chat mở rộng


## 10.3. Guide Area (7 màn hình)

### M31 — Dashboard hướng dẫn viên
- số tour đã tạo
- số yêu cầu chờ duyệt
- điểm đánh giá trung bình
- trạng thái xác minh
- lối tắt đến tour và profile

### M32 — Quản lý hồ sơ hướng dẫn viên của tôi
- cập nhật bio, kinh nghiệm, khu vực hoạt động, ngôn ngữ, kỹ năng, avatar

### M33 — Xác minh hồ sơ hướng dẫn viên
- tải giấy tờ/chứng chỉ, xem trạng thái xác minh, lịch sử xử lý

### M34 — Danh sách tour của tôi
- danh sách tour do guide sở hữu
- trạng thái, số request, thao tác edit/publish/close

### M35 — Tạo / cập nhật tour
- form tour đầy đủ
- category, địa điểm, ngày, giá, ảnh, điều kiện, accommodation liên quan nếu có

### M36 — Quản lý lịch trình / địa điểm tour
- danh sách điểm dừng
- thứ tự hành trình
- thời gian ghé
- bản đồ / preview cơ bản

### M37 — Quản lý yêu cầu tham gia tour
- xem danh sách request
- approve/reject
- xem trạng thái xử lý

**Ghi chú mở rộng có kiểm soát:**  
`guide_availabilities` có thể tồn tại trong schema như một bảng dự trù mở rộng cho lịch rảnh hướng dẫn viên, nhưng **không được tính là một màn hình lõi riêng trong bộ 47 màn hình hiện tại** và **không phải trọng tâm của roadmap 14 sprint**.


## 10.4. Admin Area (10 màn hình)

### M38 — Dashboard quản trị
- tổng số user
- tổng số guide
- tổng số tour
- tổng số bài đồng hành
- tổng số report
- điều hướng nhanh

### M39 — Quản lý người dùng
- danh sách user
- trạng thái tài khoản
- khóa/mở khóa tài khoản
- xem chi tiết user

### M40 — Phân quyền người dùng / quản lý role
- role hiện có
- gán/gỡ role
- lịch sử đổi quyền
- cấu hình quyền cơ bản ở mức phù hợp đồ án

### M41 — Quản lý hồ sơ hướng dẫn viên và xác minh
- xem hồ sơ guide
- moderation hồ sơ
- duyệt/từ chối verification

### M42 — Quản trị tour toàn hệ thống
- xem danh sách tour
- moderation tour
- ẩn/hiện/gắn cờ
- theo dõi trạng thái

### M43 — Quản trị bài đồng hành toàn hệ thống
- xem danh sách bài đồng hành
- moderation bài
- ẩn/hiện/gắn cờ
- theo dõi trạng thái

### M44 — Quản lý đánh giá / nội dung phản hồi
- duyệt tour reviews
- duyệt guide reviews
- ẩn/hiện/gắn cờ review

### M45 — Tiếp nhận / xử lý báo cáo vi phạm
- danh sách report
- chi tiết report
- phân loại
- cập nhật trạng thái xử lý
- ghi chú xử lý

### M46 — Thống kê và báo cáo hệ thống
- số user, guide, tour, companion post, report, payment, verification
- chỉ số cơ bản phục vụ demo

### M47 — Nhật ký hoạt động quản trị / lịch sử thay đổi quyền
- admin_activity_logs
- user_role_change_logs
- truy vết thao tác quản trị

# 11. Mô hình dữ liệu chuẩn

Schema chính thức dùng thật của đồ án là **38 bảng** trên Supabase/PostgreSQL. Không tạo một schema rút gọn khác.

## 11.1. Nhóm tài khoản, phân quyền và audit quản trị
1. `users`
2. `roles`
3. `user_roles`
4. `user_role_change_logs`
5. `admin_activity_logs`

## 11.2. Nhóm guide profile
6. `languages`
7. `skills`
8. `guide_profiles`
9. `guide_languages`
10. `guide_skills`
11. `guide_verification_requests`
12. `guide_verification_documents`
13. `guide_availabilities`

## 11.3. Nhóm tour
14. `tour_categories`
15. `tours`
16. `tour_images`
17. `tour_locations`
18. `tour_requests`
19. `tour_reviews`
20. `guide_reviews`

## 11.4. Nhóm companion
21. `companion_posts`
22. `companion_requests`

## 11.5. Nhóm tương tác và quản trị nội dung
23. `favorite_tours`
24. `favorite_guides`
25. `reports`
26. `report_processing_history`
27. `user_activity_logs`
28. `user_preferences`
29. `user_preferred_categories`

## 11.6. Nhóm chat và thông báo
30. `conversations`
31. `conversation_participants`
32. `messages`
33. `notifications`

## 11.7. Nhóm AI, lưu trú, thanh toán
34. `ai_chat_sessions`
35. `ai_chat_messages`
36. `partner_accommodations`
37. `tour_accommodations`
38. `payment_transactions`

---

# 12. Mô tả vai trò dữ liệu theo nhóm bảng

## 12.1. Tài khoản và phân quyền
- `users`: hồ sơ nghiệp vụ người dùng
- `roles`: danh mục vai trò
- `user_roles`: liên kết user–role
- `user_role_change_logs`: lịch sử thay đổi quyền
- `admin_activity_logs`: nhật ký thao tác quản trị

## 12.2. Guide profile
- `guide_profiles`: hồ sơ nghề nghiệp
- `languages`, `skills`: danh mục chuẩn
- `guide_languages`, `guide_skills`: liên kết nhiều-nhiều
- `guide_verification_requests`, `guide_verification_documents`: xác minh hồ sơ
- `guide_availabilities`: lịch rảnh mở rộng (nếu schema hiện hành còn giữ bảng này thì xem như phần dự trù mở rộng, **không bắt buộc triển khai sâu trong 14 sprint lõi**)

## 12.3. Tour
- `tour_categories`: loại tour
- `tours`: thông tin tour chính
- `tour_images`: bộ ảnh tour
- `tour_locations`: lịch trình / địa điểm
- `tour_requests`: yêu cầu tham gia tour
- `tour_reviews`, `guide_reviews`: đánh giá sau chuyến đi

## 12.4. Companion
- `companion_posts`: bài đăng đồng hành
- `companion_requests`: yêu cầu tham gia bài

## 12.5. Quản trị nội dung và cá nhân hóa
- `favorite_tours`, `favorite_guides`
- `reports`, `report_processing_history`
- `user_activity_logs`
- `user_preferences`, `user_preferred_categories`

## 12.6. Chat, AI, lưu trú, thanh toán
- `conversations`, `conversation_participants`, `messages`
- `notifications`
- `ai_chat_sessions`, `ai_chat_messages`
- `partner_accommodations`, `tour_accommodations`
- `payment_transactions`

---

# 13. Quan hệ dữ liệu quan trọng

## 13.1. Quan hệ người dùng và role
- `users` 1–n `user_roles`
- `roles` 1–n `user_roles`

## 13.2. Quan hệ guide
- `users` 1–0..1 `guide_profiles`
- `guide_profiles` n–n `languages`
- `guide_profiles` n–n `skills`

## 13.3. Quan hệ tour
- `tour_categories` 1–n `tours`
- `guide_profiles` 1–n `tours`
- `tours` 1–n `tour_images`
- `tours` 1–n `tour_locations`
- `tours` 1–n `tour_requests`

## 13.4. Quan hệ review
- `tours` 1–n `tour_reviews`
- `guide_profiles` 1–n `guide_reviews`
- review phải gắn với thực thể tour/tour_request đủ điều kiện nếu siết rule chặt

## 13.5. Quan hệ companion
- `users` 1–n `companion_posts`
- `companion_posts` 1–n `companion_requests`
- `users` 1–n `companion_requests`

## 13.6. Quan hệ report
- `users` 1–n `reports`
- target report có thể là tour, companion post hoặc user
- `reports` 1–n `report_processing_history`

## 13.7. Quan hệ chat
- `conversations` 1–n `messages`
- `conversations` n–n `users` qua `conversation_participants`

## 13.8. Quan hệ lưu trú và thanh toán
- `tours` n–n `partner_accommodations` qua `tour_accommodations`
- `tour_requests` 1–n `payment_transactions`

---

# 14. Ràng buộc dữ liệu và business rule chính

## 14.1. Ràng buộc dữ liệu chung
- giá / chi phí / amount >= 0
- số lượng thành viên > 0
- ngày kết thúc >= ngày bắt đầu
- years_of_experience >= 0
- rating nằm trong tập hợp hợp lệ
- latitude / longitude hợp lệ nếu có
- payload notification / AI context là JSON hợp lệ nếu áp dụng

## 14.2. Ràng buộc duy nhất
- slug danh mục / mã khóa logic nếu có
- role theo bộ chuẩn đã chốt
- 1 user không được có duplicate role
- 1 cặp favorite không được lặp
- 1 combination spec không được lặp
- lịch rảnh guide không được trùng exact slot nếu dùng bảng availability

## 14.3. Quy tắc hiển thị public của tour
Tour public chỉ nên hiển thị khi:
- `business_status` phù hợp (`published`)
- `visibility_status` phù hợp (`visible`)
- không bị xóa mềm
- guide/hồ sơ đủ điều kiện hiển thị nếu hệ thống yêu cầu

## 14.4. Quy tắc luồng guide
- user phải có role GUIDE trước khi tạo hồ sơ guide
- hồ sơ guide công khai phải có tối thiểu: `bio`, `years_of_experience`, `working_area`, `languages`, `skills`, `avatar`, `verification_status`
- verification là nhóm ưu tiên 2, không làm quá nặng về xử lý file ở giai đoạn đầu

## 14.5. Quy tắc tour request
State machine khuyến nghị:
- `pending`
- `approved`
- `rejected`
- `cancelled_by_user`
- `cancelled_by_guide`
- `payment_pending`
- `paid`

Rule:
- chỉ user gửi request của chính mình
- chỉ guide sở hữu tour mới được duyệt/từ chối
- chỉ request ở trạng thái phù hợp mới đổi trạng thái
- không cho duplicate request trái rule
- không cho tour overbook nếu đã đủ chỗ

## 14.6. Quy tắc companion request
State machine khuyến nghị:
- `pending`
- `approved`
- `rejected`
- `cancelled_by_requester`

Rule:
- chỉ chủ bài mới được approve/reject
- chỉ bài ở trạng thái `open` mới nhận request
- khi đủ thành viên có thể đóng bài theo rule cấu hình

## 14.7. Quy tắc review
- chỉ review khi người dùng đủ điều kiện nghiệp vụ
- review có thể bị moderation
- review không được hiển thị nếu trạng thái hiển thị không hợp lệ

## 14.8. Quy tắc report
- report phải xác định được target type và target id hợp lệ
- xử lý report phải ghi nhận người xử lý, thời điểm xử lý, ghi chú và lịch sử

---

# 15. Danh mục API backend chính

Dưới đây là nhóm endpoint chuẩn ở mức thực chiến để dev backend/frontend bám theo.

## 15.1. Nhóm nền tảng
- `GET /health`
- `GET /me`
- `GET /me/roles`
- `GET /admin/roles`
- `GET /admin/activity-logs`

## 15.2. Auth và hồ sơ cá nhân
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `PATCH /me`
- `PATCH /me/password`
- `GET /me/roles`

## 15.3. Guide profile
- `GET /guides`
- `GET /guides/:id`
- `POST /guide-profile`
- `PATCH /guide-profile/:id`
- `PUT /guide-profile/:id/languages`
- `PUT /guide-profile/:id/skills`
- `GET /languages`
- `GET /skills`

## 15.4. Guide verification
- `GET /guide-verification/requests`
- `POST /guide-verification/requests`
- `POST /guide-verification/requests/:id/documents`
- `GET /admin/guide-verification/:id/documents`
- `PATCH /admin/guide-verification/:id`

## 15.5. Tour public và guide tour
- `GET /tour-categories`
- `GET /tours`
- `GET /tours/:id`
- `POST /tours`
- `PATCH /tours/:id`
- `POST /tours/:id/images`
- `DELETE /tours/:id/images/:imageId`
- `GET /tours/:id/locations`
- `PUT /tours/:id/locations`
- `GET /tours/:id/accommodations`
- `PUT /tours/:id/accommodations`

## 15.6. Tour requests
- `POST /tour-requests`
- `GET /me/tour-requests`
- `GET /guide/tour-requests`
- `PATCH /tour-requests/:id/cancel`
- `PATCH /guide/tour-requests/:id/approve`
- `PATCH /guide/tour-requests/:id/reject`

## 15.7. Reviews
- `GET /tours/:id/reviews`
- `POST /tour-reviews`
- `PATCH /admin/tour-reviews/:id/moderation`
- `GET /guides/:id/reviews`
- `POST /guide-reviews`
- `PATCH /admin/guide-reviews/:id/moderation`

## 15.8. Favorites
- `GET /me/favorite-tours`
- `POST /favorite-tours`
- `DELETE /favorite-tours/:tourId`
- `GET /me/favorite-guides`
- `POST /favorite-guides`
- `DELETE /favorite-guides/:guideId`

## 15.9. Companion posts và requests
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

## 15.10. Reports, notifications, logs
- `POST /reports`
- `GET /me/reports`
- `GET /me/notifications`
- `PATCH /me/notifications/:id/read`
- `GET /me/activity-logs`

## 15.11. Chat và AI chat
- `GET /conversations`
- `POST /conversations/direct`
- `POST /conversations/group-companion`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `GET /ai-chat/sessions`
- `POST /ai-chat/sessions`
- `GET /ai-chat/sessions/:id/messages`
- `POST /ai-chat/sessions/:id/messages`

> Lưu ý: AI chat chỉ ở mức tư vấn du lịch, truy vấn dữ liệu thông qua function/API nội bộ có kiểm soát; không được tự thực hiện hành động nghiệp vụ thay người dùng.

## 15.12. Lưu trú và thanh toán
- `GET /accommodations`
- `GET /accommodations/:id`
- `POST /admin/accommodations`
- `POST /payments`
- `GET /me/payments`
- `GET /payments/:id`
- `POST /payments/:id/confirm`
- `PATCH /admin/payments/:id`

> Lưu ý: payment chỉ triển khai ở mức **sandbox hoặc mock flow**, đủ để minh họa vòng đời giao dịch, không nhằm xử lý thanh toán production.

## 15.13. Admin / moderation / audit
- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/roles`
- `POST /admin/users/:id/roles`
- `DELETE /admin/users/:id/roles/:role`
- `GET /admin/role-change-logs`
- `GET /admin/guides`
- `PATCH /admin/guides/:id/moderation`
- `GET /admin/guide-verification`
- `PATCH /admin/guide-verification/:id`
- `GET /admin/tours`
- `PATCH /admin/tours/:id/moderation`
- `GET /admin/companion-posts`
- `PATCH /admin/companion-posts/:id/moderation`
- `GET /admin/reports`
- `PATCH /admin/reports/:id`
- `GET /admin/reports/:id/history`
- `GET /admin/activity-logs`
- `GET /admin/statistics`

---

# 16. Mapping màn hình ↔ bảng dữ liệu chính

## 16.1. Public Area
- M01: `tours`, `tour_images`, `guide_profiles`, `companion_posts`
- M02: `auth.users`, `users`
- M03: `auth.users`, `user_roles`
- M04: `tours`, `tour_images`, `tour_reviews`
- M05: `tours`, `tour_categories`, `tour_reviews`
- M06: `tours`, `tour_images`, `tour_locations`, `guide_profiles`, `tour_reviews`, `favorite_tours`, `reports`
- M07: `tour_locations`
- M08: `guide_profiles`, `guide_languages`, `guide_skills`, `guide_reviews`
- M09: `guide_profiles`, `guide_languages`, `guide_skills`, `guide_reviews`, `tours`, `favorite_guides`, `reports`
- M10: `companion_posts`
- M11: `companion_posts`, `companion_requests`, `reports`
- M12: `user_preferences`, `user_preferred_categories`, `user_activity_logs`, `favorite_tours`, `tours`
- M13: `ai_chat_sessions`, `ai_chat_messages`
- M14: `partner_accommodations`, `tour_accommodations`, `tours`

## 16.2. User Area
- M15: `users`
- M16: `auth.users`
- M17: `user_activity_logs`
- M18: `favorite_tours`, `favorite_guides`, `tours`, `guide_profiles`
- M19: `notifications`
- M20: `reports`
- M21: `tour_requests`, `tours`
- M22: `payment_transactions`, `tour_requests`, `tours`
- M23: `companion_posts`, `companion_requests`
- M24: `companion_posts`
- M25: `companion_requests`, `companion_posts`
- M26: `companion_requests`, `companion_posts`, `conversations`
- M27: `tour_reviews`, `tour_requests`, `tours`
- M28: `guide_reviews`, `guide_profiles`, `tour_requests`, `tours`
- M29: `conversations`, `conversation_participants`, `messages`
- M30: `conversations`, `conversation_participants`, `messages`, `companion_posts`


## 16.3. Guide Area
- M31: `guide_profiles`, `tours`, `tour_requests`, `guide_reviews`, `guide_verification_requests`
- M32: `guide_profiles`, `guide_languages`, `guide_skills`
- M33: `guide_verification_requests`, `guide_verification_documents`
- M34: `tours`, `tour_requests`
- M35: `tours`, `tour_images`, `tour_categories`, `tour_accommodations`
- M36: `tour_locations`
- M37: `tour_requests`, `tours`

**Ghi chú mở rộng:** `guide_availabilities` chỉ nên được map vào màn hình riêng khi có quyết định mở rộng roadmap; không đưa vào bộ 47 màn hình lõi hiện tại.


## 16.4. Admin Area
- M38: `users`, `guide_profiles`, `tours`, `companion_posts`, `reports`, `payment_transactions`
- M39: `users`
- M40: `roles`, `user_roles`, `user_role_change_logs`, `users`
- M41: `guide_profiles`, `guide_verification_requests`, `guide_verification_documents`, `admin_activity_logs`
- M42: `tours`, `tour_images`, `tour_requests`, `admin_activity_logs`
- M43: `companion_posts`, `companion_requests`, `admin_activity_logs`
- M44: `tour_reviews`, `guide_reviews`, `admin_activity_logs`
- M45: `reports`, `report_processing_history`, `admin_activity_logs`
- M46: dữ liệu tổng hợp từ nhiều bảng
- M47: `admin_activity_logs`, `user_role_change_logs`

# 17. UML chuẩn dùng cho báo cáo và triển khai

Hệ thống không cần UML cho mọi bảng, nhưng cần một bộ UML đủ mạnh để:
- bám đúng nghiệp vụ thực tế
- trình bày tốt trong báo cáo
- hỗ trợ backend/frontend hiểu luồng xử lý

## 17.1. Use Case Diagram tổng quát
Nên có 1 sơ đồ tổng quát mô tả đầy đủ:
- Guest
- User
- Guide
- Admin

với các nhóm use case:
- tài khoản và người dùng
- hướng dẫn viên
- khách du lịch
- giao tiếp và hỗ trợ trải nghiệm
- dịch vụ mở rộng
- quản trị hệ thống

## 17.2. Activity Diagram khuyến nghị

Nên có Activity Diagram cho các chức năng lõi sau:

1. Đăng ký tài khoản  
2. Đăng nhập  
3. Đăng xuất  
4. Cập nhật hồ sơ cá nhân  
5. Tạo/cập nhật hồ sơ hướng dẫn viên  
6. Gửi yêu cầu xác minh hồ sơ hướng dẫn viên  
7. Tạo tour mới  
8. Cập nhật và xuất bản tour  
9. Gửi yêu cầu tham gia tour  
10. Hướng dẫn viên duyệt yêu cầu tham gia tour  
11. Tạo bài tìm bạn đồng hành  
12. Gửi yêu cầu tham gia bài đồng hành  
13. Chủ bài đồng hành duyệt thành viên  
14. Gửi báo cáo vi phạm  
15. Nhân sự quản trị xử lý báo cáo vi phạm  

## 17.3. Sequence Diagram khuyến nghị

Nên có các Sequence Diagram sau:

1. **Người dùng gửi yêu cầu tham gia tour**
2. **Hướng dẫn viên duyệt yêu cầu tham gia tour**
3. **Người dùng gửi yêu cầu tham gia bài đồng hành**
4. **Chủ bài duyệt yêu cầu tham gia bài đồng hành**
5. **Người dùng gửi báo cáo và admin xử lý báo cáo**

## 17.4. Class Diagram lõi

Class Diagram lõi nên mô tả tối thiểu:

- `User`
- `Role`
- `UserRole`
- `GuideProfile`
- `TourCategory`
- `Tour`
- `TourLocation`
- `TourRequest`
- `CompanionPost`
- `CompanionRequest`
- `Report`
- `Notification`

và các quan hệ:
- User — GuideProfile
- User — UserRole — Role
- GuideProfile — Tour
- TourCategory — Tour
- Tour — TourLocation
- User — TourRequest — Tour
- User — CompanionPost
- CompanionPost — CompanionRequest
- User — Report
- User — Notification

## 17.5. Gợi ý sử dụng UML trong báo cáo

- Use Case tổng quát đặt ở đầu chương UML
- Activity Diagram dùng cho mô tả luồng xử lý chính
- Sequence Diagram dùng cho luồng có nhiều lớp tương tác và đổi trạng thái
- Class Diagram đặt cuối chương UML để liên kết nghiệp vụ, dữ liệu và backend

---

# 18. Giai đoạn triển khai chuẩn theo 14 sprint

## Giai đoạn A — Nền tảng và kiến trúc lõi
### Sprint 1
- khởi tạo frontend/backend/database
- import schema 38 bảng
- seed roles
- dựng layout 4 Area
- chốt 29 chức năng và 47 màn hình

### Sprint 2
- auth
- profile
- đổi mật khẩu
- role-based redirect
- route guard

## Giai đoạn B — Phiên bản lõi ưu tiên 1
### Sprint 3
- public tour core

### Sprint 4
- guide profile core

### Sprint 5
- guide quản lý tour

### Sprint 6
- tour requests

### Sprint 7
- companion core

### Sprint 8
- admin core

## Giai đoạn C — Hoàn thiện ưu tiên 2
### Sprint 9
- ổn định MVP

### Sprint 10
- favorite, review, verification

### Sprint 11
- map, notifications, statistics, activity logs

## Giai đoạn D — Mở rộng ưu tiên 3
### Sprint 12
- chat cơ bản

### Sprint 13
- AI, recommendation, accommodation, payment sandbox

## Giai đoạn E — Đóng gói và bảo vệ
### Sprint 14
- final QA
- demo data
- screenshots
- tài liệu
- handoff

---

# 19. Definition of Done theo giai đoạn

## 19.1. DoD — Giai đoạn 1–2 (Phân tích và thiết kế)
- chốt đề tài
- chốt phạm vi chính thức
- chốt 4 Area và 6 nhóm người dùng
- chốt 29 chức năng
- chốt 47 màn hình
- chốt schema 38 bảng
- chốt roadmap 14 sprint
- chốt style guide và bộ skill sẽ dùng

## 19.2. DoD — Sprint 1
- source frontend/backend khởi tạo được
- database dựng xong 38 bảng
- layout 4 khu vực hoạt động
- dữ liệu role cơ bản đã seed
- cấu trúc module backend/frontend/database đã chốt
- Use Case tổng quát, danh mục 29 chức năng và 47 màn hình được cố định

## 19.3. DoD — Sprint 2
- đăng ký/đăng nhập/đăng xuất hoạt động
- hồ sơ cá nhân và đổi mật khẩu hoạt động
- `/me` và `/me/roles` hoạt động
- route guard hoạt động
- redirect theo role hoạt động

## 19.4. DoD — Sprint 3
- xem được tour list
- filter hoạt động
- tour detail hoạt động
- public home đủ trình bày
- tour public hiển thị đúng rule

## 19.5. DoD — Sprint 4
- guide profile của tôi hoạt động
- guide public profile hoạt động
- ngôn ngữ/kỹ năng hoạt động
- role GUIDE và hiển thị profile không bị mơ hồ

## 19.6. DoD — Sprint 5
- guide tạo/sửa tour được
- guide quản lý lịch trình được
- draft/published hoạt động
- dữ liệu tour nhất quán

## 19.7. DoD — Sprint 6
- user gửi request tour được
- guide xử lý request được
- state machine request đúng
- không lỗi quyền sở hữu tour

## 19.8. DoD — Sprint 7
- companion post hoạt động
- companion request hoạt động
- chủ bài duyệt thành viên được
- không nhầm lẫn tour và companion

## 19.9. DoD — Sprint 8
- admin dashboard hoạt động
- user/role management hoạt động
- moderation guide/tour/companion/report hoạt động
- 3 vai trò admin nội bộ có ranh giới rõ

## 19.10. DoD — Sprint 9
- 4 luồng demo chính ổn định
- bug chặn bảo vệ đã giảm về mức chấp nhận được
- không thêm feature mới

## 19.11. DoD — Sprint 10–13
- các nhóm ưu tiên 2 và 3 đạt mức trình bày được
- không phá lõi
- mở rộng chỉ ở mức vừa đủ

## 19.12. DoD — Sprint 14
- môi trường demo ổn định
- dữ liệu demo đủ đẹp
- screenshot đủ
- UML/ERD/report đủ
- kịch bản bảo vệ rõ
- sẵn sàng bàn giao

---

# 20. Quy tắc giao diện bắt buộc

Mọi UI của TravelConnectVN phải bám file:

```text
.agents/ui_style_guide_for_ai_agent.md
```

## 20.1. Nguyên tắc tổng quát
- hiện đại
- sáng
- đáng tin
- thân thiện
- thiên trải nghiệm du lịch
- không retail-tech
- không ecommerce linh kiện
- không quá neon / glass / cyber / gradient nặng

## 20.2. Theo từng Area
- **Public Area:** truyền cảm hứng khám phá, sáng, rõ, thân thiện
- **User Area:** self-service, quản lý cá nhân, dễ dùng
- **Guide Area:** bán chuyên nghiệp, rõ nghiệp vụ, đáng tin
- **Admin Area:** tối giản, thiên dashboard / table / form / moderation

## 20.3. Bắt buộc trước khi chốt UI
Agent phải tự kiểm:
- đúng hệ màu
- đúng typography
- đúng spacing
- đúng button/card/table/input system
- đúng đặc tính của Area
- đã tái sử dụng component cũ tối đa chưa
- responsive có ổn không

---

# 21. Quy tắc làm việc dành cho AI agent

## 21.1. Nguyên tắc chung
AI agent phải luôn:
- đọc file này trước khi làm việc
- đọc `PROJECT_STATUS.md`
- đọc `SPRINT_PHASE_TASK_BREAKDOWN.md`
- đọc `SPRINT_MASTER.md`
- đọc `SPRINT_CHECKLIST_MASTER.md`
- đọc `SPRINT_XX.md` tương ứng
- đọc `SESSION_LOG.md`
- đọc skill liên quan trong `.agents/skills`
- đọc `.agents/ui_style_guide_for_ai_agent.md` nếu task có UI
- xác định sprint hiện tại
- chỉ làm đúng 1 subtask nhỏ nhất
- không nhảy sprint
- không thêm tính năng ngoài phạm vi nếu chưa được phê duyệt

## 21.2. Với database
- read schema first
- không giả định database trống
- không drop database
- không truncate bảng
- không xóa dữ liệu thật
- migration phải additive và an toàn
- seeder phải idempotent

## 21.3. Với code
- không viết logic lớn trong controller
- ưu tiên service / module / DTO / validation
- không hard-code role string rời rạc
- không làm lẫn business rule tour với companion
- không làm lẫn quyền User, Guide, SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF

## 21.4. Với UI/UX
- phải đọc style guide trước
- phải tái sử dụng component tối đa
- phải giữ hệ màu/tone/radius/spacing/typography nhất quán
- ưu tiên tính nhất quán hơn hiệu ứng đẹp
- ưu tiên tính dễ dùng hơn trình diễn

## 21.5. Với tiến độ
- cuối mỗi phiên phải ghi `SESSION_LOG.md`
- phải đề xuất cập nhật `PROJECT_STATUS.md`
- phải xác định task nào trong `SPRINT_PHASE_TASK_BREAKDOWN.md` đổi từ `[ ]` sang `[~]` hoặc `[x]`
- phải bảo đảm trạng thái sprint khớp giữa `PROJECT_STATUS.md`, `SPRINT_PHASE_TASK_BREAKDOWN.md` và `SPRINT_CHECKLIST_MASTER.md`

---

# 22. Mẫu cập nhật tiến độ chuẩn

Agent phải dùng hoặc đề xuất cập nhật theo mẫu:

```md
## Session Update

### Sprint
- Sprint hiện tại:
- Phase:
- Session focus:
- Chosen subtask:

### Done
- ...

### Files Changed
- ...

### Skills Used
- ...

### UI Style Rules Applied
- ...

### Schema / Migration / Seed Notes
- ...

### Tested
- ...

### Result
- [ ] Chưa xong subtask
- [ ] Xong một phần
- [ ] Xong hoàn toàn

### Blockers / Risks
- ...

### Suggested Next Single Step
- ...

### PROJECT_STATUS.md update needed
- ...

### SPRINT_PHASE_TASK_BREAKDOWN.md update needed
- ...
```

---

# 23. Gợi ý thứ tự code tối ưu

1. Auth + role + route guard  
2. Profile cá nhân  
3. Public tour core  
4. Guide profile  
5. Guide tour CRUD  
6. Tour requests  
7. Companion posts + requests  
8. Admin core  
9. Favorite / review / verification  
10. Map / notification / statistics  
11. Chat  
12. AI / accommodation / payment sandbox  
13. Final QA + report + demo

---

# 24. Luồng demo khuyến nghị khi bảo vệ

## Luồng 1 — Khách du lịch kết nối hướng dẫn viên qua tour
- vào trang chủ
- xem danh sách tour
- lọc tour
- xem chi tiết tour
- xem hồ sơ hướng dẫn viên
- gửi yêu cầu tham gia tour

## Luồng 2 — Người dùng kết nối nhau qua bài đồng hành
- tạo bài đồng hành
- người khác gửi yêu cầu tham gia
- chủ bài duyệt thành viên
- vào không gian trao đổi nhóm (nếu triển khai)

## Luồng 3 — Hướng dẫn viên quản lý dịch vụ của mình
- cập nhật hồ sơ guide
- tạo tour
- xuất bản tour
- xem và xử lý yêu cầu tham gia

## Luồng 4 — Quản trị hệ thống
- vào admin dashboard
- xem report
- xử lý moderation
- theo dõi thống kê và nhật ký hoạt động

---

# 25. Kết luận định hướng

TravelConnectVN không chỉ là một website hiển thị tour, mà là một **nền tảng kết nối du lịch** có:

- lớp khám phá công khai
- lớp tác vụ cá nhân của người dùng
- lớp nghiệp vụ chuyên biệt cho hướng dẫn viên
- lớp quản trị và kiểm duyệt hệ thống
- schema dữ liệu đủ lớn để hỗ trợ lõi và mở rộng
- 14 sprint để triển khai từ nền tảng đến bảo vệ

Muốn làm đúng và nhanh, phải luôn bám:

- **đúng phạm vi**
- **đúng role**
- **đúng area**
- **đúng màn hình**
- **đúng API**
- **đúng schema**
- **đúng UML**
- **đúng sprint**
- **đúng Definition of Done**
- **đúng style guide**
- **đúng skill cần đọc trước khi làm**

Tài liệu này là mốc chuẩn duy nhất để cả **code**, **báo cáo**, **UML**, **màn hình**, **API**, **database**, **kế hoạch** và **AI agent** cùng nhìn về một hướng.
