# HANDOFF_INSTRUCTIONS_FOR_AGENT.md

> File này dùng để **bàn giao ca làm việc** cho AI agent khi mở một chat mới hoặc bắt đầu một phiên mới trong dự án **TravelConnectVN**.  
> Mục tiêu: để agent **không bị mất bối cảnh**, **không nhảy sprint**, **không làm sai phạm vi**, và **khởi động đúng quy trình từ đầu**.

---

## 1. Mục đích của file này

Khi mở chat mới, agent thường dễ mắc 5 lỗi:

1. không đọc đủ bối cảnh
2. đọc sai file gốc
3. nhảy sang sprint khác
4. chọn task quá lớn
5. làm xong nhưng không cập nhật trạng thái

File này tồn tại để ngăn các lỗi đó.

Agent phải xem file này như **hướng dẫn bàn giao bắt buộc** trước khi bắt đầu bất kỳ công việc nào trong repo TravelConnectVN.

---

## 2. Bộ file phải đọc đầu phiên

Khi nhận bàn giao, agent **bắt buộc** phải đọc đúng thứ tự sau:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_TASK.md`
4. `SPRINT_MASTER.md`
5. `SPRINT_CHECKLIST_MASTER.md`
6. `SPRINT_XX.md` tương ứng với sprint hiện tại
7. `AGENT_BOOTSTRAP_PROMPT.md` hoặc `AGENT_BOOTSTRAP_PROMPT_v3_READY.md`

Đọc thêm khi cần:
- `SESSION_LOG.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `.agents/ui_style_guide_for_ai_agent.md` nếu task có UI
- các skill liên quan trong `.agents/skills/`
- file schema / mapping / UML / wireframe liên quan đến subtask sắp làm

---

## 3. Quy trình bắt buộc khi mở chat mới

Agent phải thực hiện lần lượt đúng quy trình sau:

### Bước 1 — Đọc và đối chiếu bối cảnh
Sau khi đọc bộ file ở Mục 2, agent phải tự xác định:

- dự án là gì
- 2 trục giá trị trung tâm là gì
- phase hiện tại là gì
- sprint hiện tại là gì
- sprint goal là gì
- phần nào đã xong
- phần nào đang làm dở
- phần nào chưa được phép làm

### Bước 2 — Chạy bootstrap
Agent phải chạy logic theo `AGENT_BOOTSTRAP_PROMPT.md` trước khi bắt đầu bất kỳ task nào.

### Bước 3 — Chọn đúng 1 subtask nhỏ nhất
Subtask được chọn phải thỏa cả 6 điều kiện:
- thuộc sprint hiện tại
- có trong `PROJECT_TASK.md`
- không mâu thuẫn với `PROJECT_STATUS.md`
- không kéo theo refactor lan man
- có đầu ra rõ ràng
- có cách test hoặc xác nhận sau khi làm

### Bước 4 — Kiểm tra file phụ thuộc
Trước khi thực thi, agent phải tự kiểm:
- có cần style guide không
- có cần schema không
- có cần mapping backend/frontend không
- có cần wireframe/UML không
- có cần đọc thêm session log gần nhất không

### Bước 5 — Báo lại trước khi làm
Trước khi bắt đầu thực thi, agent phải báo lại:
- current phase
- current sprint
- current sprint goal
- allowed scope
- forbidden scope
- best next single subtask
- lý do vì sao đó là bước đúng tiếp theo

### Bước 6 — Thực hiện đúng 1 subtask
Trong suốt phiên:
- không nhảy sprint
- không tự thêm feature ngoài spec
- không tách sang làm việc khác khi subtask hiện tại chưa được đóng
- không đổi state machine / role / màn hình / API trái spec nếu chưa có lý do rõ ràng

### Bước 7 — Cập nhật cuối phiên
Sau khi xong subtask, agent phải đề xuất cập nhật:
- `PROJECT_STATUS.md`
- `PROJECT_TASK.md`
- `SESSION_LOG.md`

---

## 4. Prompt handoff chuẩn để dùng khi mở chat mới

Sao chép nguyên khối sau để dán vào chat mới:

```text
Bạn đang tiếp quản một phiên làm việc mới của dự án TravelConnectVN.

Trước khi làm bất kỳ việc gì, bạn bắt buộc phải đọc và đối chiếu theo đúng thứ tự:

1. TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
2. PROJECT_STATUS.md
3. PROJECT_TASK.md
4. SPRINT_MASTER.md
5. SPRINT_CHECKLIST_MASTER.md
6. SPRINT_XX.md tương ứng với sprint hiện tại
7. AGENT_BOOTSTRAP_PROMPT.md hoặc AGENT_BOOTSTRAP_PROMPT_v3_READY.md

Sau đó bạn phải:

BƯỚC A — Xác nhận bối cảnh
- dự án là gì
- phase hiện tại
- sprint hiện tại
- sprint goal
- phần đã xong
- phần đang làm dở
- phần chưa được làm

BƯỚC B — Bootstrap
Chạy đúng logic bootstrap trước khi thực thi bất kỳ task nào.

BƯỚC C — Chọn 1 subtask nhỏ nhất
Chỉ chọn đúng 1 subtask nhỏ nhất, bám `PROJECT_STATUS.md` và `PROJECT_TASK.md`.

BƯỚC D — Kiểm tra file cần đọc thêm
Tự xác định xem có cần:
- SESSION_LOG.md
- .agents/ui_style_guide_for_ai_agent.md
- .agents/skills/
- schema/mapping/UML/wireframe
hay không.

BƯỚC E — Báo lại trước khi làm
Trả lời theo đúng format:

1. Current project:
2. Current phase:
3. Current sprint:
4. Current sprint goal:
5. Current allowed scope:
6. Current forbidden scope:
7. Definition of Done status:
8. Best next single subtask:
9. Files that must be read additionally:
10. Why this subtask is the correct next step:

BƯỚC F — Thực hiện
- Chỉ làm đúng 1 subtask đã chọn
- Không nhảy sprint
- Không tự thêm feature ngoài spec
- Nếu là UI thì đọc style guide trước
- Nếu là database thì đọc schema trước
- Nếu là backend thì kiểm tra role/state machine trước
- Nếu là docs/UML thì phải bám spec và code thật

BƯỚC G — Báo cáo cuối phiên
Sau khi xong, trả lời theo format:

1. Done:
2. Files changed:
3. What was verified/tested:
4. Result status: [ ] / [~] / [x]
5. Remaining blockers:
6. Suggested next single step:
7. PROJECT_STATUS.md update needed:
8. PROJECT_TASK.md update needed:
9. SESSION_LOG.md update needed:

Lưu ý bắt buộc:
- Không bắt đầu làm nếu chưa hoàn tất bước xác nhận bối cảnh + bootstrap.
- Nếu PROJECT_STATUS.md và PROJECT_TASK.md bị lệch nhau, phải báo lệch trước khi làm.
- Nếu sprint hiện tại chưa đủ điều kiện sang sprint sau, phải giữ nguyên sprint hiện tại.
- Nếu có nhiều việc hợp lý, vẫn chỉ được chọn 1 subtask nhỏ nhất.
```

---

## 5. Mẫu “handoff note” ngắn gọn giữa hai phiên

Khi kết thúc một phiên và muốn bàn giao sang phiên sau, có thể ghi ngắn theo mẫu sau:

```md
## Handoff Note

### Current phase
- ...

### Current sprint
- ...

### Last completed
- ...

### In progress
- ...

### Best next single subtask
- ...

### Files to read first next session
- ...
- ...
- ...

### Risks / blockers
- ...

### Must not do next session
- ...
```

---

## 6. Quy tắc chọn subtask khi tiếp quản

Khi agent tiếp quản, phải ưu tiên theo thứ tự:

1. subtask đang `[~]` trong `PROJECT_TASK.md`
2. nếu không có `[~]`, chọn subtask `[ ]` gần nhất trong lane ưu tiên của sprint hiện tại
3. nếu nhiều subtask cùng hợp lý, chọn subtask:
   - nhỏ nhất
   - ít phụ thuộc nhất
   - dễ kiểm tra kết quả nhất
4. không chọn subtask ở sprint sau chỉ vì “có vẻ thú vị hơn”

---

## 7. Quy tắc đặc biệt theo loại task

### 7.1. Nếu task là UI
Phải đọc:
- `.agents/ui_style_guide_for_ai_agent.md`
- các skill UI liên quan

Phải kiểm:
- Area nào đang làm
- màn hình nào đang làm
- component nào có thể tái sử dụng
- đúng tone TravelConnectVN, không lẫn PowerTech / ecommerce

### 7.2. Nếu task là backend
Phải kiểm:
- module nào đang phụ trách
- role nào được phép gọi API
- state machine liên quan
- validation input
- response format chuẩn
- ownership / moderation / visibility rule

### 7.3. Nếu task là database
Phải đọc:
- schema final
- mapping liên quan
- sprint file liên quan

Phải tuân thủ:
- migration additive
- seed idempotent
- không drop / truncate / xóa dữ liệu thật

### 7.4. Nếu task là tài liệu / UML
Phải bám:
- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `SPRINT_XX.md`
- trạng thái thật trong `PROJECT_STATUS.md`
- task thật trong `PROJECT_TASK.md`

Không được viết như thể đã làm xong những phần chưa làm.

---

## 8. Dấu hiệu một handoff thành công

Một handoff được xem là tốt khi:
- agent biết đúng sprint hiện tại
- agent biết đúng allowed scope
- agent chỉ chọn 1 subtask
- agent không hỏi lại những gì đã có trong file lõi
- agent không nhảy sang sprint sau
- agent đề xuất cập nhật status/task/log sau khi làm xong

---

## 9. Dấu hiệu phải dừng và kiểm tra lại

Phải dừng lại và kiểm tra nếu agent:
- dùng tên file cũ kiểu `PHASE_TASK_BREAKDOWN.md`
- bỏ qua `SPRINT_MASTER.md` hoặc `SPRINT_CHECKLIST_MASTER.md`
- nhảy từ Sprint 01 sang Sprint 03/04/05
- mở rộng AI/chat/payment như production
- dùng numbering màn hình cũ không khớp spec v3
- tự sửa phạm vi chức năng không có trong spec

---

## 10. One-line purpose

**Handoff này tồn tại để mỗi khi mở chat mới, AI agent có thể tiếp quản đúng bối cảnh của TravelConnectVN, bootstrap đúng quy trình, chọn đúng 1 subtask nhỏ nhất và tiếp tục công việc mà không làm lệch spec v3.**
