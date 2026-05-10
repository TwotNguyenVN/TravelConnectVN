# README_AGENT_WORKFLOW.md

## 1. Mục tiêu của bộ Agent Starter Pack

Bộ **TravelConnectVN Agent Starter Pack** là tập hợp các file điều phối cốt lõi giúp AI agent làm việc đúng quy trình trong dự án **TravelConnectVN**.

Mục tiêu của bộ này là để agent:

- hiểu đúng dự án
- biết hệ thống đang ở sprint nào
- biết hôm nay phải làm gì
- biết điều gì chưa được làm
- biết cách mở phiên mới, tiếp quản phiên cũ và cập nhật trạng thái sau mỗi phiên
- không nhảy sprint, không làm lệch spec, không viết lan man ngoài phạm vi

---

## 2. Bộ file trong starter pack

Bộ starter pack chuẩn gồm **8 file**:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_TASK.md`
4. `AGENT_BOOTSTRAP_PROMPT.md`
5. `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
6. `PROMPT_LIBRARY_BY_SPRINT.md`
7. `SESSION_LOG.md`
8. `README_AGENT_WORKFLOW.md`

### Vai trò từng file

#### 1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
Đây là **source of truth** của toàn dự án.

Nó mô tả:
- phạm vi đề tài
- 2 trục giá trị cốt lõi
- area, role, màn hình, chức năng
- schema 38 bảng
- API khung
- roadmap 14 sprint
- Definition of Done theo giai đoạn
- quy tắc làm việc của AI agent

#### 2. `PROJECT_STATUS.md`
Đây là **bảng trạng thái sống**.

Nó cho agent biết:
- phase hiện tại
- sprint hiện tại
- phần đã xong
- phần đang làm dở
- bước nhỏ tiếp theo nên làm

#### 3. `PROJECT_TASK.md`
Đây là **task breakdown chính thức** theo kiểu sprint-centric.

Nó cho agent biết:
- task nào `[ ]`
- task nào `[~]`
- task nào `[x]`
- lane nào đang ưu tiên
- sprint hiện tại còn thiếu gì

#### 4. `AGENT_BOOTSTRAP_PROMPT.md`
Đây là **prompt khởi động chuẩn**.

Nó buộc agent:
- đọc đúng bộ file lõi
- xác định đúng sprint hiện tại
- chọn đúng 1 subtask nhỏ nhất
- báo lại allowed scope / forbidden scope / next step trước khi làm

#### 5. `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
Đây là **file bàn giao khi mở chat mới**.

Nó giúp agent tiếp quản đúng bối cảnh:
- không mất ngữ cảnh
- không nhảy sprint
- không làm sai phạm vi
- không bỏ qua bootstrap

#### 6. `PROMPT_LIBRARY_BY_SPRINT.md`
Đây là **thư viện prompt chuẩn**.

Nó chứa:
- prompt khởi động
- prompt phân tích sprint
- prompt DB / Backend / Frontend / Test / UML
- prompt audit
- prompt chuyên biệt theo từng Sprint 01–14

#### 7. `SESSION_LOG.md`
Đây là **nhật ký phiên làm việc**.

Nó ghi lại:
- phiên này làm gì
- file nào đã sửa
- đã test gì
- còn blocker gì
- bước nhỏ tiếp theo là gì

#### 8. `README_AGENT_WORKFLOW.md`
Đây là file bạn đang đọc.

Nó hướng dẫn cách dùng 7 file còn lại trong thực tế.

---

## 3. Thứ tự đọc chuẩn khi mở một phiên mới

Khi mở chat mới hoặc khi agent tiếp quản công việc, phải đọc đúng thứ tự sau:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_TASK.md`
4. `SPRINT_MASTER.md` *(nếu có trong repo tổng)*
5. `SPRINT_CHECKLIST_MASTER.md` *(nếu có trong repo tổng)*
6. `SPRINT_XX.md` tương ứng với sprint hiện tại
7. `AGENT_BOOTSTRAP_PROMPT.md`

Đọc thêm khi cần:
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `SESSION_LOG.md`
- `.agents/ui_style_guide_for_ai_agent.md`
- các file schema / mapping / UML / wireframe liên quan

---

## 4. Quy trình chuẩn khi dùng bộ file này

## Bước 1 — Mở phiên mới
Khi bắt đầu phiên mới, làm như sau:

1. đưa `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
2. đưa `AGENT_BOOTSTRAP_PROMPT.md`
3. yêu cầu agent bootstrap
4. kiểm tra agent đã xác định đúng:
   - phase hiện tại
   - sprint hiện tại
   - allowed scope
   - forbidden scope
   - best next single subtask

Chỉ sau đó mới cho agent làm tiếp.

---

## Bước 2 — Xác định đúng sprint
Agent phải luôn trả lời được:

- đang ở **giai đoạn nào**
- đang ở **sprint nào**
- sprint đó đang **được phép làm gì**
- sprint đó **chưa được phép làm gì**

Nếu agent không trả lời rõ 4 điểm này, coi như chưa bootstrap đạt.

---

## Bước 3 — Chọn đúng 1 subtask nhỏ nhất
Trong mỗi phiên, agent chỉ được làm:

- **1 subtask nhỏ nhất**, hoặc
- **1 cụm subtask rất gần nhau** trong cùng lane

Ví dụ hợp lệ:
- tạo `PROJECT_TASK.md`
- tạo `SESSION_LOG.md`
- viết `GET /health`
- tạo skeleton `frontend/`
- tạo route guard basic

Ví dụ không hợp lệ:
- “làm luôn cả Sprint 02”
- “dựng toàn bộ auth + profile + admin”
- “viết toàn bộ backend cho tour, request và companion”

---

## Bước 4 — Thực hiện task
Khi làm task, agent phải tuân theo loại việc:

### Nếu là UI
- đọc `.agents/ui_style_guide_for_ai_agent.md`
- đọc skill UI liên quan
- bám area đúng
- dùng component tái sử dụng tối đa

### Nếu là backend
- kiểm tra role
- kiểm tra ownership
- kiểm tra state machine
- không viết logic sai phạm vi sprint

### Nếu là database
- đọc schema trước
- migration additive
- seed idempotent
- không drop/truncate/xóa dữ liệu thật

### Nếu là docs/UML
- bám spec thật
- không viết như thể đã xong các phần chưa làm

---

## Bước 5 — Ghi log cuối phiên
Sau khi làm xong, agent phải:

1. cập nhật `SESSION_LOG.md`
2. đề xuất cập nhật `PROJECT_STATUS.md`
3. đề xuất cập nhật `PROJECT_TASK.md`

Một phiên chỉ được xem là “đóng” khi đã có:
- Done
- Files changed
- Tested / Verified
- Result status
- Blockers / Risks
- Suggested next single step

---

## 5. Quy trình thực tế khuyến nghị cho TravelConnectVN

### Giai đoạn hiện tại
Theo bộ file hiện tại, dự án đang ở:

- **Giai đoạn A — Nền tảng và kiến trúc lõi**
- **Sprint 01 — Nền tảng kỹ thuật tổng thể**

### Chiến lược dùng agent đúng
Ở thời điểm hiện tại, agent nên làm theo thứ tự:

1. Khóa đủ bộ file điều phối
2. Xác nhận `PROJECT_STATUS.md` và `PROJECT_TASK.md` đã khớp
3. Tạo hoặc xác nhận `SESSION_LOG.md`
4. Sau đó mới:
   - khởi tạo repo structure thật
   - frontend baseline
   - backend baseline
   - database baseline

### Không nên làm lúc này
- chưa nhảy sang Sprint 02 auth/profile
- chưa nhảy sang public tour
- chưa nhảy sang guide profile
- chưa nhảy sang admin
- chưa đụng AI/chat/payment mở rộng

---

## 6. Cách dùng bộ prompt library

`PROMPT_LIBRARY_BY_SPRINT.md` nên được dùng như sau:

### Khi mở phiên mới
Dùng:
- Prompt A1
- Prompt A2
- Prompt A3

### Khi bắt đầu 1 sprint
Dùng:
- Prompt B1
- Prompt B2
- Prompt B3

### Khi chuẩn bị code
Dùng:
- Prompt C1
- Prompt C2 / C3 / C4
- Prompt C5 nếu cần seed demo

### Khi review giữa sprint
Dùng:
- Prompt D2

### Khi audit cuối sprint
Dùng:
- Prompt D1
- Prompt D3
- Prompt E3

### Khi cần prompt riêng theo sprint
Dùng:
- F01 đến F14 tương ứng

---

## 7. Mẫu workflow ngắn gọn cho mỗi phiên

Bạn có thể dùng chuỗi sau cho mọi phiên làm việc:

1. Mở chat mới
2. Dán `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
3. Dán `AGENT_BOOTSTRAP_PROMPT.md`
4. Kiểm tra agent bootstrap đúng
5. Cho agent làm **1 subtask nhỏ nhất**
6. Cuối phiên cập nhật:
   - `SESSION_LOG.md`
   - `PROJECT_STATUS.md`
   - `PROJECT_TASK.md`

---

## 8. Cách đặt các file trong repo

Gợi ý đặt trong repo:

```text
TravelConnectVN/
  .agents/
    skills/
    ui_style_guide_for_ai_agent.md

  docs/
    agent-starter-pack/
      TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
      PROJECT_STATUS.md
      PROJECT_TASK.md
      AGENT_BOOTSTRAP_PROMPT.md
      HANDOFF_INSTRUCTIONS_FOR_AGENT.md
      PROMPT_LIBRARY_BY_SPRINT.md
      SESSION_LOG.md
      README_AGENT_WORKFLOW.md

  SPRINT_MASTER.md
  SPRINT_CHECKLIST_MASTER.md
  SPRINT_01.md
  ...
  SPRINT_14.md
```

Nếu muốn đơn giản hơn, bạn có thể đặt 8 file starter pack ngay ở thư mục gốc repo.

---

## 9. Quy tắc đặt tên và dùng file trong bộ này

### Tên file chuẩn nên dùng trong repo
Nên chuẩn hóa về đúng tên sau:

- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `PROJECT_STATUS.md`
- `PROJECT_TASK.md`
- `AGENT_BOOTSTRAP_PROMPT.md`
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `SESSION_LOG.md`
- `README_AGENT_WORKFLOW.md`

### Ghi chú
Trong quá trình dựng file, có vài file bản trung gian dạng:
- `PROJECT_STATUS_v3_READY.md`
- `AGENT_BOOTSTRAP_PROMPT_v3_READY.md`

Khi đưa vào repo thật, nên đổi về tên chuẩn:
- `PROJECT_STATUS.md`
- `AGENT_BOOTSTRAP_PROMPT.md`

để agent không bị rối.

---

## 10. Dấu hiệu bộ starter pack đang hoạt động tốt

Bộ này được xem là chạy tốt khi:

- agent luôn biết sprint hiện tại là gì
- agent không nhảy sprint
- agent luôn chọn đúng 1 subtask nhỏ nhất
- `PROJECT_STATUS.md` và `PROJECT_TASK.md` luôn khớp
- mỗi phiên đều có `SESSION_LOG.md`
- không còn tình trạng mở chat mới rồi mất bối cảnh

---

## 11. Dấu hiệu cần sửa lại workflow

Cần kiểm tra lại nếu:

- agent dùng tên file cũ kiểu phase-centric
- agent bỏ qua bootstrap
- agent không đọc spec/status/task trước khi làm
- agent chọn task quá lớn
- agent nhảy từ Sprint 01 sang Sprint 03/04/05
- agent viết docs/UML như thể code đã có dù chưa có
- `SESSION_LOG.md` không được cập nhật sau nhiều phiên

---

## 12. Starter Pack Checklist

- [x] Có master spec
- [x] Có project status
- [x] Có project task
- [x] Có bootstrap prompt
- [x] Có handoff instructions
- [x] Có prompt library
- [x] Có session log
- [x] Có readme workflow

---

## 13. One-line purpose

**TravelConnectVN Agent Starter Pack tồn tại để AI agent luôn bắt đầu đúng, làm đúng, dừng đúng và tiếp tục đúng — theo đúng spec v3, đúng sprint hiện tại và đúng một subtask nhỏ nhất trong mỗi phiên.**
