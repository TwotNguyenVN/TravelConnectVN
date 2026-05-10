# PROMPT_LIBRARY_BY_SPRINT.md

> Thư viện prompt chuẩn cho AI agent của dự án **TravelConnectVN**.  
> Mục tiêu: giúp agent và người dùng **không phải viết lại prompt từ đầu mỗi lần**, đồng thời luôn bám đúng:
> - `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
> - `PROJECT_STATUS.md`
> - `PROJECT_TASK.md`
> - `SPRINT_MASTER.md`
> - `SPRINT_CHECKLIST_MASTER.md`
> - `SPRINT_XX.md` tương ứng với sprint hiện tại

---

## 1. Mục tiêu của file này

File này dùng để:

1. cung cấp **prompt mẫu chuẩn** cho từng loại việc
2. bảo đảm agent luôn làm việc theo **spec v3**
3. giảm nguy cơ:
   - nhảy sprint
   - chọn task quá lớn
   - viết lan man ngoài phạm vi
   - làm lệch DB / API / UI / UML
4. tăng tính nhất quán giữa:
   - code
   - tài liệu
   - UML
   - checklist
   - trạng thái sprint

---

## 2. Cách dùng chung

### 2.1. Luôn đọc file nền trước
Trước khi dùng bất kỳ prompt nào trong file này, agent phải đọc:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_TASK.md`
4. `SPRINT_MASTER.md`
5. `SPRINT_CHECKLIST_MASTER.md`
6. `SPRINT_XX.md` của sprint hiện tại

### 2.2. Cách chọn prompt
- Nếu đang mở phiên mới: dùng **Prompt Nhóm A**
- Nếu đang cần xác định việc phải làm: dùng **Prompt Nhóm B**
- Nếu đang triển khai kỹ thuật: dùng **Prompt Nhóm C**
- Nếu đang kiểm tra / test / audit: dùng **Prompt Nhóm D**
- Nếu đang viết báo cáo / UML / handoff: dùng **Prompt Nhóm E**
- Nếu đang làm theo sprint cụ thể: dùng **Prompt Nhóm F**

### 2.3. Quy tắc bắt buộc
- Mỗi phiên chỉ nên dùng **1 prompt chính**
- Nếu cần nối tiếp, chỉ chuyển sang prompt tiếp theo sau khi đầu ra prompt trước đã rõ
- Không dùng prompt sprint sau khi sprint hiện tại chưa đạt mức chấp nhận được
- Không dùng prompt mở rộng để làm vượt spec v3

---

# NHÓM A — PROMPT KHỞI ĐỘNG / ĐIỀU PHỐI

## A1. Bootstrap phiên mới
```text
Bạn đang bắt đầu một phiên làm việc mới cho dự án TravelConnectVN.

Hãy đọc và đối chiếu đúng các file sau:
1. TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
2. PROJECT_STATUS.md
3. PROJECT_TASK.md
4. SPRINT_MASTER.md
5. SPRINT_CHECKLIST_MASTER.md
6. SPRINT_XX.md tương ứng với sprint hiện tại

Sau đó trả lời theo đúng 10 mục:
1. Current project
2. Current phase
3. Current sprint
4. Current sprint goal
5. Current allowed scope
6. Current forbidden scope
7. Definition of Done status
8. Best next single subtask
9. Files that must be read additionally
10. Why this subtask is the correct next step

Chỉ chọn đúng 1 subtask nhỏ nhất. Không nhảy sprint.
```

## A2. Đồng bộ trạng thái trước khi làm
```text
Dựa trên:
- PROJECT_STATUS.md
- PROJECT_TASK.md
- SPRINT_XX.md

Hãy kiểm tra xem 3 file này có đang khớp nhau không theo 5 điểm:
1. Sprint hiện tại
2. Task đang làm
3. Allowed scope
4. Next step
5. DoD status

Nếu có lệch, hãy chỉ ra rõ:
- lệch ở đâu
- file nào cần ưu tiên sửa trước
- sửa thế nào để khớp spec v3
```

## A3. Chọn đúng 1 subtask nhỏ nhất
```text
Dựa trên:
- PROJECT_STATUS.md
- PROJECT_TASK.md
- SPRINT_XX.md

Hãy chọn đúng 1 subtask nhỏ nhất để làm trong phiên này.

Yêu cầu:
- thuộc sprint hiện tại
- gần nhất với trạng thái [~] hoặc [ ] trong PROJECT_TASK.md
- không kéo theo refactor lan man
- có đầu ra rõ ràng
- có thể test hoặc xác nhận được ngay

Trả lời theo mẫu:
1. Subtask được chọn
2. Vì sao nó là bước đúng tiếp theo
3. File cần đọc thêm
4. Kết quả mong đợi sau khi xong
5. Điều gì tuyệt đối không được làm trong phiên này
```

---

# NHÓM B — PROMPT PHÂN TÍCH SPRINT

## B1. Phân tích sprint hiện tại
```text
Dựa trên:
- SPRINT_XX.md
- SPRINT_CHECKLIST_MASTER.md
- PROJECT_STATUS.md
- PROJECT_TASK.md

Hãy phân tích sprint hiện tại theo 6 mục:
1. Mục tiêu chính
2. Phạm vi bắt buộc phải làm
3. Phạm vi chưa làm trong sprint này
4. Phụ thuộc từ sprint trước
5. Lane ưu tiên trong sprint hiện tại
6. Điều kiện để xem là hoàn thành sprint

Chỉ bám spec v3 và file sprint hiện tại.
```

## B2. Rút scope kỹ thuật của sprint
```text
Dựa trên SPRINT_XX.md, hãy rút sprint này thành scope kỹ thuật theo 6 nhóm:
1. Chức năng trọng tâm
2. Màn hình triển khai
3. Bảng CSDL chính
4. API cần thiết
5. Test flow cần có
6. UML/tài liệu cần cập nhật

Ưu tiên cách trình bày để dev có thể bắt tay làm ngay.
```

## B3. Tách sprint thành backlog thực thi
```text
Dựa trên:
- SPRINT_XX.md
- PROJECT_TASK.md
- SPRINT_CHECKLIST_MASTER.md

Hãy chuyển sprint này thành backlog thực thi theo 5 lane:
1. Database
2. Backend
3. Frontend
4. Test & Validation
5. UML / Docs

Mỗi lane chia thành:
- Bắt buộc
- Nên có
- Có thể để sau nếu thiếu thời gian

Chỉ ra lane nào là blocker của sprint.
```

---

# NHÓM C — PROMPT TRIỂN KHAI KỸ THUẬT

## C1. Prompt thiết kế business rules trước khi code
```text
Dựa trên:
- SPRINT_XX.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
- PROJECT_TASK.md

Hãy thiết kế chi tiết trước khi code:
1. Business rules chính
2. State machine nếu có
3. Validation input
4. Quyền thao tác theo role
5. Điều kiện hiển thị dữ liệu ra UI
6. Các ngoại lệ quan trọng

Trình bày theo hướng dễ hiện thực bằng code và bám đúng spec v3.
```

## C2. Prompt database
```text
Dựa trên:
- SPRINT_XX.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
- PROJECT_TASK.md
- file schema/mapping liên quan nếu có

Hãy tách phần database của sprint này thành:
1. Bảng cần dùng
2. Trường dữ liệu quan trọng
3. Khóa chính / khóa ngoại / ràng buộc
4. State / enum cần chú ý
5. Seed data tối thiểu
6. Thứ tự triển khai database hợp lý

Yêu cầu:
- migration additive
- seed idempotent
- không tạo schema lệch spec
```

## C3. Prompt backend/API
```text
Dựa trên:
- SPRINT_XX.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
- PROJECT_TASK.md
- file schema/mapping/UML liên quan nếu có

Hãy tách phần backend thành:
1. Module cần tạo hoặc chỉnh sửa
2. Endpoint cần có
3. DTO request/response
4. Business rule của từng API
5. Guard / role / ownership / moderation rule
6. Error cases quan trọng
7. Logging/audit nếu cần

Trình bày theo kiểu dev backend có thể code ngay.
```

## C4. Prompt frontend
```text
Dựa trên:
- SPRINT_XX.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
- PROJECT_TASK.md
- .agents/ui_style_guide_for_ai_agent.md
- wireframe/mapping nếu có

Hãy tách phần frontend thành:
1. Route / màn hình cần làm
2. Component chính
3. Form field và validation
4. API nào màn hình nào gọi
5. Loading / empty / error / unauthorized states
6. Điều hướng và chặn quyền nếu có

Yêu cầu:
- bám style guide TravelConnectVN
- tái sử dụng component tối đa
- không làm UI vượt phạm vi sprint
```

## C5. Prompt seed/demo data
```text
Dựa trên:
- SPRINT_XX.md
- PROJECT_TASK.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md

Hãy đề xuất bộ dữ liệu demo tối thiểu để test và demo sprint này.

Liệt kê rõ:
1. Actor mẫu
2. Bản ghi mẫu cần có
3. Trạng thái dữ liệu cần có
4. Flow nào dùng dữ liệu nào
5. Dữ liệu nào bắt buộc đẹp để demo
```

---

# NHÓM D — PROMPT TEST / REVIEW / AUDIT

## D1. Prompt test flow tối thiểu
```text
Dựa trên:
- SPRINT_XX.md
- PROJECT_TASK.md
- SPRINT_CHECKLIST_MASTER.md

Hãy viết test flow tối thiểu cho sprint này gồm:
1. Happy path
2. Validation error
3. Sai quyền truy cập
4. Sai trạng thái nghiệp vụ
5. Dữ liệu demo cần dùng cho từng test

Mỗi test ghi rõ:
- actor
- bước thực hiện
- dữ liệu dùng
- kết quả mong đợi
```

## D2. Prompt review giữa sprint
```text
Dựa trên:
- PROJECT_STATUS.md
- PROJECT_TASK.md
- SPRINT_XX.md

Đây là phần tôi đã làm:
[PHAN_DA_LAM]

Hãy review theo 5 mục:
1. Phần nào đã đạt
2. Phần nào còn thiếu
3. Phần nào là blocker
4. Phần nào có thể để sau nếu thiếu thời gian
5. Tôi có đang lệch trọng tâm sprint không
```

## D3. Prompt audit cuối sprint
```text
Dựa trên:
- SPRINT_XX.md
- SPRINT_CHECKLIST_MASTER.md
- PROJECT_STATUS.md
- PROJECT_TASK.md

Đây là phần đã hoàn thành thực tế:
[PHAN_DA_LAM]

Hãy audit cuối sprint theo 6 mục:
1. Sprint đã hoàn thành bao nhiêu phần trăm
2. Các mục bắt buộc đã xong
3. Các mục còn thiếu
4. Technical debt còn tồn
5. Có đủ điều kiện sang sprint tiếp theo chưa
6. File nào cần cập nhật ngay sau phiên này
```

---

# NHÓM E — PROMPT TÀI LIỆU / UML / BÁO CÁO / HANDOFF

## E1. Prompt viết lại sprint theo văn phong báo cáo
```text
Dựa trên:
- SPRINT_XX.md
- PROJECT_STATUS.md
- phần đã triển khai thực tế

Hãy viết lại nội dung sprint này theo văn phong báo cáo tốt nghiệp, gồm:
1. Mục tiêu sprint
2. Chức năng triển khai
3. Màn hình triển khai
4. CSDL và API
5. Kết quả đạt được
6. Hạn chế còn tồn và hướng tiếp theo

Không viết như thể đã làm xong những phần chưa xong.
```

## E2. Prompt cập nhật UML
```text
Dựa trên:
- SPRINT_XX.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
- trạng thái thực tế trong PROJECT_STATUS.md
- task thực tế trong PROJECT_TASK.md

Hãy xác định UML nào cần cập nhật trong sprint này:
1. Use case
2. Activity diagram
3. Sequence diagram
4. Class diagram

Với từng loại, hãy nêu:
- cần cập nhật cái gì
- vì sao cần cập nhật
- nên mô tả theo logic nào
```

## E3. Prompt cập nhật handoff/status/task
```text
Dựa trên kết quả vừa hoàn thành, hãy đề xuất cập nhật cho:
1. PROJECT_STATUS.md
2. PROJECT_TASK.md
3. SESSION_LOG.md

Trả lời theo dạng:
- mục nào đổi
- đổi từ gì sang gì
- vì sao phải đổi
- next single step sau khi cập nhật
```

---

# NHÓM F — PROMPT CHUYÊN BIỆT THEO TỪNG SPRINT

## F01. Sprint 01 — Nền tảng kỹ thuật tổng thể
```text
Dựa trên:
- SPRINT_01.md
- PROJECT_STATUS.md
- PROJECT_TASK.md
- TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md

Hãy xác định đúng 1 subtask nhỏ nhất tiếp theo trong Sprint 01 theo thứ tự ưu tiên:
1. file điều phối agent còn thiếu
2. bootstrap/handoff/prompt library
3. repo structure thật
4. frontend/backend/database baseline

Không nhảy sang Sprint 02.
```

## F02. Sprint 02 — Auth, hồ sơ cá nhân, phân quyền
```text
Dựa trên SPRINT_02.md, hãy tách sprint này thành:
1. rule auth/profile/role
2. API auth/profile
3. route guard và redirect theo role
4. test cases auth
5. dữ liệu demo user/guide/admin
```

## F03. Sprint 03 — Public tour
```text
Dựa trên SPRINT_03.md, hãy tách sprint này thành:
1. rule tour public
2. query/filter/sort/pagination
3. dữ liệu cần cho M03/M04/M05/M06
4. test flow public discovery
5. các lỗi thường gặp giữa DB/API/UI
```

## F04. Sprint 04 — Guide profile
```text
Dựa trên SPRINT_04.md, hãy tách sprint này thành:
1. rule trở thành guide
2. rule guide public visibility
3. API guide profile/languages/skills
4. màn hình M08/M09/M31/M32
5. test flow guide profile công khai và guide profile của tôi
```

## F05. Sprint 05 — Guide quản lý tour
```text
Dựa trên SPRINT_05.md, hãy tách sprint này thành:
1. state của tour
2. ownership rule
3. CRUD tour + images + locations
4. UI quản lý tour của guide
5. seed demo tour đủ để sang Sprint 06
```

## F06. Sprint 06 — Tour request
```text
Dựa trên SPRINT_06.md, hãy tách sprint này thành:
1. state machine tour_requests
2. rule gửi request
3. rule approve/reject/cancel
4. màn hình M06/M21/M37
5. test flow đầu-cuối user gửi request → guide xử lý
```

## F07. Sprint 07 — Companion post / request
```text
Dựa trên SPRINT_07.md, hãy tách sprint này thành:
1. state của companion_posts
2. state của companion_requests
3. rule chủ bài duyệt thành viên
4. UI M10/M11/M23/M24/M25/M26
5. test flow bài đồng hành hoàn chỉnh
```

## F08. Sprint 08 — Admin core
```text
Dựa trên SPRINT_08.md, hãy tách sprint này thành:
1. 3 role quản trị nội bộ
2. report flow
3. moderation flow
4. user/role management
5. màn hình M38–M47
6. audit log và test cases admin
```

## F09. Sprint 09 — Ổn định MVP lõi
```text
Dựa trên SPRINT_09.md, hãy xác định:
1. 4 luồng demo chính
2. nhóm bug blocker / major / minor
3. regression checklist
4. dữ liệu demo cần làm sạch
5. phần nào không được mở rộng thêm trong sprint này
```

## F10. Sprint 10 — Favorite, review, verification
```text
Dựa trên SPRINT_10.md, hãy tách sprint này thành:
1. favorite flow
2. review condition
3. verification state và rule
4. UI favorite/review/verification
5. test cases tránh favorite trùng, review sai điều kiện, verification sai trạng thái
```

## F11. Sprint 11 — Map, activity log, notification, statistics
```text
Dựa trên SPRINT_11.md, hãy tách sprint này thành:
1. notification ở mức phù hợp đồ án
2. activity log convention
3. map tour ở mức vừa đủ
4. statistics/dashboard cơ bản
5. test flow và seed data cho notification/log/map/statistics
```

## F12. Sprint 12 — Chat trực tiếp và chat nhóm
```text
Dựa trên SPRINT_12.md, hãy tách sprint này thành:
1. conversation types
2. participant rules
3. message flow
4. direct chat vs group companion chat
5. test flow chat cơ bản không cần realtime production
```

## F13. Sprint 13 — AI, recommendation, accommodation, payment
```text
Dựa trên SPRINT_13.md, hãy tách sprint này thành:
1. AI chat ở mức an toàn
2. recommendation rule-based
3. accommodation chỉ ở mức tham khảo
4. payment sandbox/mock
5. các giới hạn bắt buộc để không biến sprint này thành production integration
```

## F14. Sprint 14 — Final QA, demo, bảo vệ
```text
Dựa trên SPRINT_14.md, hãy tách sprint này thành:
1. checklist QA cuối
2. checklist demo data
3. checklist screenshot/tài liệu/UML
4. flow trình bày khi bảo vệ
5. risk và fallback plan nếu demo lỗi
```

---

# NHÓM G — PROMPT TỔNG HỢP DÙNG NHANH

## G1. Prompt full workflow cho 1 sprint
```text
Tôi đang làm SPRINT_XX của dự án TravelConnectVN.

Hãy làm việc theo đúng thứ tự:
1. đọc spec/status/task/checklist/sprint hiện tại
2. phân tích mục tiêu sprint
3. xác định allowed scope và forbidden scope
4. chọn đúng 1 subtask nhỏ nhất
5. liệt kê file cần đọc thêm
6. đề xuất cách triển khai
7. đề xuất cách test
8. đề xuất cập nhật status/task/log sau khi xong

Không nhảy sang sprint khác.
```

## G2. Prompt “chỉ làm đúng bước tiếp theo”
```text
Dựa trên:
- PROJECT_STATUS.md
- PROJECT_TASK.md
- SPRINT_XX.md

Hãy bỏ qua mọi thứ khác và chỉ cho tôi:
1. đúng 1 subtask nhỏ nhất phải làm tiếp
2. vì sao đó là bước đúng tiếp theo
3. file nào cần đọc thêm
4. kết quả mong đợi khi xong bước đó
```

## G3. Prompt “chốt lại sau phiên”
```text
Dựa trên những gì vừa hoàn thành, hãy giúp tôi:
1. cập nhật PROJECT_STATUS.md
2. cập nhật PROJECT_TASK.md
3. viết SESSION_LOG.md
4. đề xuất đúng 1 next single step cho phiên tiếp theo
```

---

## 3. Gợi ý dùng theo tình huống thực tế

### Khi mở chat mới
Dùng:
- A1
- A2
- A3

### Khi bắt đầu một sprint
Dùng:
- B1
- B2
- B3

### Khi bắt tay code
Dùng:
- C1
- C2 hoặc C3 hoặc C4
- C5 nếu cần seed demo

### Khi đang giữa sprint
Dùng:
- D2

### Khi chốt sprint
Dùng:
- D1
- D3
- E1
- E3

### Khi làm nhanh theo sprint cụ thể
Dùng:
- F01 đến F14 tương ứng

---

## 4. One-line purpose

**File này tồn tại để biến quy trình làm việc với AI của TravelConnectVN thành một workflow có thể lặp lại, có kiểm soát, bám đúng spec v3 và bám đúng từng sprint thay vì viết prompt lại từ đầu mỗi lần.**
