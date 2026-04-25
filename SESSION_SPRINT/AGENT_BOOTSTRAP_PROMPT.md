# AGENT_BOOTSTRAP_PROMPT.md

> File này là **prompt khởi động chuẩn** cho AI agent của dự án **TravelConnectVN**.  
> Mục tiêu: buộc agent **đọc đúng bộ file lõi**, **xác định đúng sprint hiện tại**, **không nhảy phạm vi**, và **chọn đúng subtask nhỏ nhất** trước khi bắt đầu làm việc.

---

## 1. Mục tiêu của prompt này

Khi mở một phiên làm việc mới, AI agent **không được bắt đầu làm ngay**.  
Agent phải dùng prompt này để tự khởi động đúng quy trình.

Prompt này buộc agent phải:

1. đọc đúng bộ file lõi của dự án
2. xác định dự án hiện đang ở giai đoạn nào và sprint nào
3. hiểu rõ sprint hiện tại đang cần gì và chưa cần gì
4. đối chiếu `PROJECT_STATUS.md` với `PROJECT_TASK.md`
5. chọn ra **1 subtask nhỏ nhất** để làm trong phiên hiện tại
6. không nhảy sang sprint sau nếu sprint hiện tại chưa đạt mức chấp nhận được
7. báo lại ngắn gọn “tôi đang đứng ở đâu và tôi sẽ làm gì tiếp”

---

## 2. Bộ file bắt buộc phải đọc trước khi làm việc

AI agent phải đọc **đúng thứ tự sau**:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_TASK.md`
4. `SPRINT_MASTER.md`
5. `SPRINT_CHECKLIST_MASTER.md`
6. `SPRINT_XX.md` tương ứng với sprint hiện tại

Đọc thêm khi cần:

- `SESSION_LOG.md`
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `.agents/ui_style_guide_for_ai_agent.md` nếu task có UI
- các skill liên quan trong `.agents/skills/`

---

## 3. Prompt bootstrap chuẩn cho agent

Sao chép nguyên khối dưới đây để dùng làm prompt khởi động:

```text
Bạn đang là AI agent làm việc cho dự án TravelConnectVN.

Trước khi làm bất kỳ task nào, bạn bắt buộc phải đọc và đối chiếu đúng bộ file sau theo thứ tự:

1. TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md
2. PROJECT_STATUS.md
3. PROJECT_TASK.md
4. SPRINT_MASTER.md
5. SPRINT_CHECKLIST_MASTER.md
6. SPRINT_XX.md tương ứng với sprint hiện tại

Sau khi đọc xong, bạn phải tự thực hiện đúng quy trình sau:

BƯỚC 1 — Xác định bối cảnh hiện tại
- Dự án là gì?
- 2 trục giá trị trung tâm là gì?
- Hệ thống có những Area nào?
- Hệ thống có những role nào?
- Sprint hiện tại là sprint nào?
- Giai đoạn hiện tại là giai đoạn nào?

BƯỚC 2 — Xác định trạng thái thực tế
- Những gì đã hoàn tất?
- Những gì đang làm dở?
- Những gì chưa bắt đầu?
- Sprint hiện tại đã đạt tới mức nào trong Definition of Done?
- Có blocker hoặc rủi ro nào đang tồn tại?

BƯỚC 3 — Xác định phạm vi được phép làm trong phiên này
- Sprint hiện tại đang ưu tiên lane nào?
- Task nào trong PROJECT_TASK.md đang ở trạng thái [~] hoặc [ ] và gần nhất cần làm?
- Những gì tuyệt đối không được làm trong phiên này?
- Có được phép nhảy sang sprint sau không? Nếu không, hãy nói rõ là không.

BƯỚC 4 — Chọn đúng 1 subtask nhỏ nhất
Bạn phải chọn đúng 1 subtask nhỏ nhất, thỏa các điều kiện:
- thuộc sprint hiện tại
- bám đúng PROJECT_STATUS.md
- bám đúng PROJECT_TASK.md
- không kéo theo refactor lan man
- có thể kiểm tra kết quả rõ ràng sau khi làm

BƯỚC 5 — Kiểm tra file/phụ thuộc cần đọc thêm
Trước khi bắt đầu subtask, bạn phải tự xác định:
- có cần đọc SESSION_LOG.md không?
- có cần đọc .agents/ui_style_guide_for_ai_agent.md không?
- có cần đọc skill trong .agents/skills/ không?
- có cần đọc thêm schema / mapping / wireframe / UML không?

BƯỚC 6 — Báo cáo lại trước khi làm
Trước khi thực hiện công việc, bạn phải trả lời theo đúng format sau:

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

BƯỚC 7 — Quy tắc bắt buộc trong lúc làm
- Chỉ làm đúng 1 subtask đã chọn
- Không tự mở rộng sang sprint khác
- Không tự thêm feature ngoài spec
- Không bỏ qua rule về role / area / state machine
- Nếu task là UI thì phải đọc style guide trước
- Nếu task là database thì phải đọc schema trước
- Nếu task là backend thì phải kiểm tra rule nghiệp vụ và quyền trước
- Nếu task là docs/UML thì phải bám code/spec thật, không bịa

BƯỚC 8 — Sau khi xong subtask
Sau khi hoàn thành, bạn phải đề xuất cập nhật:
- PROJECT_STATUS.md
- PROJECT_TASK.md
- SESSION_LOG.md

và báo lại theo đúng format:

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
- Không được bắt đầu code hoặc viết tài liệu mới nếu chưa hoàn tất phần bootstrap ở trên.
- Nếu phát hiện file trạng thái và file task bị lệch nhau, phải báo lệch trước khi làm.
- Nếu sprint hiện tại chưa đủ điều kiện sang sprint sau, phải giữ nguyên sprint hiện tại.
- Nếu có nhiều việc cùng hợp lý, vẫn chỉ được chọn 1 subtask nhỏ nhất.
```

---

## 4. Quy tắc giải thích đầu ra của bootstrap

Sau khi agent chạy prompt bootstrap, đầu ra đúng phải cho thấy rõ:

- agent **biết mình đang ở đâu**
- agent **biết mình được phép làm gì**
- agent **biết mình chưa được làm gì**
- agent **không nhảy sang sprint sau**
- agent **chọn đúng 1 subtask nhỏ nhất**
- agent **biết cần đọc thêm file nào trước khi thực thi**

Nếu agent trả lời theo kiểu:
- quá chung chung
- không nhắc sprint hiện tại
- không chỉ ra subtask cụ thể
- không đối chiếu `PROJECT_STATUS.md` với `PROJECT_TASK.md`
- hoặc tự ý chọn task ở sprint sau

thì coi như bootstrap **chưa đạt yêu cầu**.

---

## 5. Mẫu đầu ra mong muốn sau bootstrap

Ví dụ đầu ra tốt nên gần với mẫu sau:

```text
1. Current project:
TravelConnectVN — website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành.

2. Current phase:
Giai đoạn A — Nền tảng và kiến trúc lõi.

3. Current sprint:
SPRINT_01 — Nền tảng kỹ thuật tổng thể.

4. Current sprint goal:
Khóa bộ điều phối agent và tạo baseline kỹ thuật đủ để các sprint sau phát triển ổn định.

5. Current allowed scope:
Hoàn thiện các file điều phối còn thiếu của Sprint 01 hoặc bắt đầu baseline code nền nếu bộ điều phối đã đủ.

6. Current forbidden scope:
Chưa được nhảy sang Sprint 02 auth/profile hoặc sang Public Tour, Guide, Admin.

7. Definition of Done status:
Sprint 01 mới mạnh ở lớp tài liệu và điều phối; chưa đạt phần implementation nền thật.

8. Best next single subtask:
Tạo AGENT_BOOTSTRAP_PROMPT.md.

9. Files that must be read additionally:
PROJECT_STATUS.md, PROJECT_TASK.md, SPRINT_01.md.

10. Why this subtask is the correct next step:
Vì đây là một trong các file điều phối còn thiếu, giúp khóa workflow agent trước khi sang implementation nền thật.
```

---

## 6. Cách dùng thực tế

### Trường hợp mở phiên mới
1. Mở chat mới với agent
2. Đưa `HANDOFF_INSTRUCTIONS_FOR_AGENT.md` nếu đã có
3. Đưa `AGENT_BOOTSTRAP_PROMPT.md`
4. Yêu cầu agent chạy bootstrap trước
5. Chỉ sau khi agent trả lời đúng format bootstrap thì mới giao subtask cụ thể

### Trường hợp vẫn ở cùng phiên
Nếu context còn rõ, có thể dùng ngắn hơn:
- cập nhật `PROJECT_STATUS.md`
- cập nhật `PROJECT_TASK.md`
- yêu cầu agent “bootstrap lại theo trạng thái mới”
- sau đó mới làm subtask tiếp

---

## 7. Nguyên tắc bắt buộc để bootstrap khớp spec v3

- Phải dùng đúng file `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- Phải dùng đúng file `PROJECT_STATUS.md`
- Phải dùng đúng file `PROJECT_TASK.md`
- Phải dùng đúng `SPRINT_MASTER.md`
- Phải dùng đúng `SPRINT_CHECKLIST_MASTER.md`
- Phải dùng đúng `SPRINT_XX.md` của sprint hiện tại
- Không dùng lại tên file cũ theo hệ phase-centric nếu repo đã chuyển sang spec v3
- Không dùng numbering màn hình cũ nếu đã được đồng bộ trong spec v3
- Không được hiểu nhóm mở rộng như chat/AI/payment theo mức production; chỉ được hiểu theo mức phù hợp đồ án

---

## 8. One-line purpose

**Bootstrap này tồn tại để buộc AI agent phải hiểu đúng bối cảnh, bám đúng sprint, chọn đúng 1 subtask nhỏ nhất và không làm lệch dự án TravelConnectVN khỏi spec v3.**
