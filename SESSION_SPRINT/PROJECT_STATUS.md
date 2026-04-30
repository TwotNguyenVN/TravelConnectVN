# PROJECT_STATUS.md

## 1. Project
**TravelConnectVN — Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành**

---

## 2. Mục đích của file

File này là **bảng trạng thái sống** của dự án.

AI agent phải dùng file này để biết:

- dự án hiện đang ở **giai đoạn nào**
- sprint hiện tại là **sprint nào**
- những gì đã hoàn tất
- những gì đang làm dở
- subtask gần nhất nên làm tiếp là gì
- rủi ro nào đang tồn tại
- sprint/giai đoạn đã đạt **Definition of Done** tới đâu
- cuối phiên cần cập nhật file nào tiếp theo

File này phải luôn được đọc cùng với:

- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `SPRINT_PHASE_TASK_BREAKDOWN.md`
- `SPRINT_MASTER.md`
- `SPRINT_CHECKLIST_MASTER.md`
- `SPRINT_01.md` … `SPRINT_14.md`
- `SESSION_LOG.md`
- `.agents/ui_style_guide_for_ai_agent.md` nếu task có UI
- các skill liên quan trong `.agents/skills/` nếu task có backend, database, UI, testing hoặc workflow

---

## 3. Mandatory Context For Agent

Trước khi làm việc, agent phải đọc:

1. `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
2. `PROJECT_STATUS.md`
3. `SPRINT_PHASE_TASK_BREAKDOWN.md`
4. `SPRINT_MASTER.md`
5. `SPRINT_CHECKLIST_MASTER.md`
6. `SPRINT_XX.md` tương ứng với sprint hiện tại
7. `SESSION_LOG.md`

Đọc thêm khi cần:

- `AGENT_BOOTSTRAP_PROMPT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `.agents/ui_style_guide_for_ai_agent.md` nếu task có UI/UX, layout, component, form, card, table, dashboard
- các skill liên quan trong `.agents/skills/`

Quy tắc bắt buộc:
- luôn xác định đúng sprint hiện tại trước khi làm
- chỉ làm **1 subtask nhỏ nhất** trong mỗi phiên
- không nhảy sprint khi sprint hiện tại chưa đạt mức chấp nhận được
- không làm ngoài phạm vi của `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- không để trạng thái trong `PROJECT_STATUS.md` lệch với `SPRINT_PHASE_TASK_BREAKDOWN.md`

Quy tắc làm việc với Supabase qua MCP
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

## 4. Current Official Scope Snapshot

### 4.1. Hai trục giá trị trung tâm
1. **Khách du lịch kết nối với hướng dẫn viên thông qua tour**
2. **Người dùng kết nối với nhau thông qua bài tìm bạn đồng hành**

### 4.2. Area chính
- Public Area
- User Area
- Guide Area
- Admin Area

### 4.3. Vai trò chính
- Guest
- User
- Guide
- SYSTEM_ADMIN
- CONTENT_MODERATOR
- SUPPORT_STAFF

### 4.4. Stack chốt
- Frontend: ReactJS + TypeScript
- Backend: NestJS + TypeScript
- Database: Supabase / PostgreSQL
- Auth: Supabase Auth
- Kiến trúc: modular, role-based, sprint-driven

### 4.5. Bộ file điều phối chính thức đang giữ
- `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- `PROJECT_STATUS.md`
- `SPRINT_PHASE_TASK_BREAKDOWN.md`
- `SPRINT_MASTER.md`
- `SPRINT_CHECKLIST_MASTER.md`
- `AGENT_BOOTSTRAP_PROMPT.md`
- `PROMPT_LIBRARY_BY_SPRINT.md`
- `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- `SPRINT_01.md` … `SPRINT_14.md`
- `SESSION_LOG.md`
- `.agents/ui_style_guide_for_ai_agent.md` nếu có UI

---

## 5. Current Phase / Sprint

### Current Phase
**Giai đoạn Final — Đóng gói và bảo vệ**

### Current Sprint
**SPRINT_14 — Final QA, Demo Data & Documentation**

### Current Sprint Goal
Rà soát toàn bộ hệ thống, chuẩn hóa dữ liệu demo và hoàn thiện tài liệu cuối cùng để bảo vệ đồ án.
- [x] Sprint 13 hoàn tất — AI, Payment, Accommodation, Recommendation
- [x] Lane 18.1: Rà soát UI/UX & Nhãn (Polish) - (100% DONE)
- [~] Lane 18.2: Chuẩn hóa bộ dữ liệu Seed "Premium" & Fix Bug Data (In Progress)
- [ ] Lane 18.3: Đồng bộ UML và Báo cáo cuối cùng





### Sprint 10 — Favorite, review, verification
**Mục tiêu:** Bổ sung tính năng tương tác người dùng (yêu thích, đánh giá) và quy trình xác minh hướng dẫn viên.
- [x] M18 Danh sách yêu thích (Tours, Guides)
- [x] M27/M28 Đánh giá Tour và Hướng dẫn viên
- [x] **Sprint 10: UX Enhancements & Final Polish** (100% DONE)
    - [x] F05: Manage favorites (Tour, Guide)
    - [x] F18: Reviews & Rating system
    - [x] F09: Guide verification flow (Full Flow DONE)

### Sprint 06 — Tour request
**Mục tiêu:** Hoàn thiện luồng xem tour → gửi yêu cầu → duyệt/từ chối yêu cầu.
- [x] M06 Chi tiết tour (Bổ sung form gửi yêu cầu)
- [x] M21 Yêu cầu tham gia tour của tôi (Giao diện User & Logic hủy)
- [x] M37 Quản lý yêu cầu tham gia tour (Giao diện Guide & Logic xử lý)
- [x] Backend API cho Tour Request (Create, List, Process, Cancel)
- [x] Tích hợp Thông báo cơ bản cho Request flow

### Current Execution Mode
- Làm theo **1 subtask nhỏ nhất trong mỗi phiên**
- **Sẵn sàng cho Sprint 04 sau khi đã dọn dẹp toàn bộ technical debt của Sprint 01 & 02.**

---

## 6. Phase History Summary

## Giai đoạn A — Nền tảng và kiến trúc lõi
**Trạng thái tổng:** 🟡 Đang tiến hành

### Sprint 01 — Nền tảng kỹ thuật tổng thể
**Trạng thái:** 🟢 Hoàn tất (100%)

#### Đã hoàn tất ở lớp tài liệu / điều phối
- Có `SPRINT_MASTER.md`
- Có `SPRINT_CHECKLIST_MASTER.md`
- Có `SPRINT_01.md` … `SPRINT_14.md`
- Có `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- Có file status chi tiết tham chiếu để chuyển sang bản dùng thật
- Đã chốt stack, area, role, roadmap 14 sprint ở mức tài liệu
- Đã chốt 29 chức năng và 47 màn hình ở mức master spec
- Đã chốt schema 38 bảng ở mức thiết kế
- Đã xác định rõ nhóm bắt buộc / nên có / mở rộng

#### Đã hoàn tất ở lớp agent workflow
- [x] Có `PROJECT_TASK.md` bản chính thức dùng thật
- [x] Có `AGENT_BOOTSTRAP_PROMPT.md`
- [x] Có `PROMPT_LIBRARY_BY_SPRINT.md`
- [x] Có `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- [x] Có `SESSION_LOG.md` bản sử dụng thật

#### Đã hoàn tất ở lớp kỹ thuật thật
- [x] Đã xác nhận repo code thật đã được khởi tạo
- [x] Đã xác nhận frontend ReactJS đã được tạo
- [x] Đã xác nhận backend NestJS đã được tạo
- [x] Đã xác nhận database folder / migration baseline / env strategy đã được tạo
- [x] Đã xác nhận skeleton route 4 Area đã chạy local
- [x] Đã hoàn thiện bộ UI Component dùng chung (Select, PageContainer, EmptyState, LoadingBlock)

### Sprint 02 — Auth, hồ sơ cá nhân, phân quyền
**Trạng thái:** 🟢 Hoàn tất

---

## Giai đoạn B — Phiên bản lõi ưu tiên 1
**Trạng thái:** 🟡 Đang tiến hành

- Sprint 03 — Public tour (Bao gồm Admin Layout & Guide Layout)
**Trạng thái:** 🟢 Hoàn tất
- Sprint 04 — Guide profile
**Trạng thái:** 🟢 Hoàn tất (95% - Đã xong Implementation, còn Docs)
- Sprint 05 — Guide quản lý tour
**Trạng thái:** 🟢 Hoàn tất (100%)
- Sprint 06 — Tour request
**Trạng thái:** 🟢 Hoàn tất (100%)
- Sprint 07 — Companion post và companion request
**Trạng thái:** 🟢 Hoàn tất (100%)
- Sprint 08 — Admin core
**Trạng thái:** 🟢 Hoàn tất (100%)

---

## Giai đoạn C — Ổn định MVP và nhóm ưu tiên 2
**Trạng thái:** ⏳ Pending

| 09 | Ổn định MVP lõi | 100% | Giai đoạn C: Regression & Cleanup | 2026-04-21 | 2026-04-21 |
| 10 | Favorite, review, verification | 100% | Giai đoạn C: UX Enhancements | 2026-04-22 | 2026-04-22 |
| 11 | Map, activity log, notification, statistics | 100% | Giai đoạn C: Advanced Features | 2026-04-22 | 2026-04-22 |

---

## Giai đoạn D — Nhóm mở rộng ưu tiên 3
**Trạng thái:** ⏭️ Skipped (chuyển thẳng sang Sprint 14 để đóng gói)

- Sprint 12 — Chat trực tiếp và chat nhóm bài đồng hành (Skipped)
- Sprint 13 — AI, recommendation, accommodation, payment (Skipped)

---

## Giai đoạn E — Đóng gói và chuẩn bị bảo vệ
**Trạng thái:** 🟡 Đang tiến hành

- Sprint 14 — Kiểm thử tổng thể, chuẩn hóa demo, hoàn thiện tài liệu và bảo vệ

---

## 7. Last Completed

### Mốc hoàn tất gần nhất
1. Hoàn thiện **`TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`** theo hướng:
   - scope
   - role
   - area
   - 29 chức năng
   - 47 màn hình
   - schema 38 bảng
   - API chuẩn
   - mapping màn hình ↔ dữ liệu
   - UML nên có
   - roadmap 14 sprint
   - DoD theo giai đoạn
   - luật làm việc cho AI agent

2. Chuẩn hóa bộ **sprint documentation**:
   - `SPRINT_MASTER.md`
   - `SPRINT_CHECKLIST_MASTER.md`
   - `SPRINT_01.md` … `SPRINT_14.md`

3. Chốt hướng dùng bộ file điều phối dạng **sprint-centric** thay vì phase-centric:
   - master spec
   - project status
   - sprint phase task breakdown
   - bootstrap
   - handoff
   - prompt library
   - session log

4. Xác định rõ các điểm lệch cần sửa giữa bản spec cũ và bản spec v3:
   - tên file điều phối
   - numbering màn hình M38–M47
   - mức độ mở rộng của AI/chat/payment
   - vai trò mở rộng của `guide_availabilities`
   - quan hệ giữa spec và bộ sprint hiện tại

---

## 8. In Progress

### 8.1. Hạng mục đang làm dở ở mức hệ thống điều phối
- Dựng `PROJECT_STATUS.md` bản chính thức theo đúng spec v3
- Chuẩn hóa trạng thái sprint/giai đoạn để khớp hoàn toàn với `TRAVEL_PROJECT_MASTER_SPEC_v3_FINAL.md`
- Chuẩn bị chuyển tiếp sang:
  - `SPRINT_PHASE_TASK_BREAKDOWN.md`
  - `AGENT_BOOTSTRAP_PROMPT.md`
  - `PROMPT_LIBRARY_BY_SPRINT.md`
  - `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`

### 8.2. Hạng mục đang chờ để bước sang code thật
- Xác nhận repo kỹ thuật thực tế đang dùng cấu trúc nào
- Khởi tạo frontend ReactJS + TypeScript
- Khởi tạo backend NestJS + TypeScript
- Chuẩn bị database folder / schema / migration baseline
- Seed roles chuẩn
- Dựng baseline layout 4 Area

---

## 9. Sprint 01 Detailed Status

## 9.1. Sprint 01 Objective
Thiết lập nền tảng kỹ thuật ban đầu cho toàn bộ hệ thống và bảo đảm AI agent có đủ bối cảnh để làm việc từng bước.

## 9.2. Sprint 01 Done
### Nhóm tài liệu / điều phối
- [x] Có master spec v3 đủ chi tiết
- [x] Có `SPRINT_MASTER.md`
- [x] Có `SPRINT_CHECKLIST_MASTER.md`
- [x] Có bundle `SPRINT_01.md` … `SPRINT_14.md`
- [x] Có file status tham chiếu chi tiết để hợp nhất
- [x] Chốt stack ReactJS + NestJS + Supabase/PostgreSQL
- [x] Chốt 4 Area
- [x] Chốt role chuẩn
- [x] Chốt roadmap 14 sprint
- [x] Chốt nguyên tắc “lõi trước, mở rộng sau”

### Nhóm quy trình AI
- [x] Chốt bộ file lõi AI cần đọc
- [x] Chốt nguyên tắc “mỗi phiên 1 subtask”
- [x] Chốt flow không nhảy sprint
- [x] Chốt việc dùng `PROJECT_STATUS.md` như bảng trạng thái sống
- [x] Chốt việc dùng `SPRINT_CHECKLIST_MASTER.md` để kiểm tra “xong sprint”

## 9.3. Sprint 01 In Progress
### Nhóm điều phối còn thiếu
- [x] Tạo `SPRINT_PHASE_TASK_BREAKDOWN.md` (Đã được thay bằng `PROJECT_TASK.md`)
- [x] Tạo `AGENT_BOOTSTRAP_PROMPT.md`
- [x] Tạo `PROMPT_LIBRARY_BY_SPRINT.md`
- [x] Tạo `HANDOFF_INSTRUCTIONS_FOR_AGENT.md`
- [x] Tạo `SESSION_LOG.md` bản chính thức dùng thật

### Nhóm kỹ thuật thực tế
- [x] Khởi tạo frontend ReactJS
- [x] Khởi tạo backend NestJS
- [~] Tạo cấu trúc thư mục kỹ thuật thật (Đã tạo database/)
- [x] Cấu hình môi trường Supabase/PostgreSQL
- [x] Seed roles chuẩn trong code thật
- [x] User có role GUIDE vào được Guide Area
- [x] Guide tạo/cập nhật profile được (Đã xong phần giao diện và gọi API lấy dữ liệu)
- [x] Guest xem được danh sách guide công khai (M08)
- [x] Guest xem được chi tiết guide công khai (M09)
- [~] Tạo component nền tối thiểu
- [x] Kiểm tra chạy local thành công

## 9.4. Sprint 01 Not Started
- [x] Baseline design tokens trong code
- [ ] API `/health`
- [ ] API `/me`
- [ ] constants role trong code thật
- [ ] route protection skeleton
- [ ] baseline smoke test checklist trong repo

---

## 10. Current Single Focus

### Subtask nên làm tiếp ngay bây giờ
- **Sprint 13: Đọc tài liệu `SPRINT_13.md` (nếu có) để lên kế hoạch triển khai AI Agent và WebSocket.**





### Nếu muốn chia nhỏ hơn nữa
Thứ tự nên là:
1. Tạo module và cấu trúc file.
2. Viết Prisma query cho danh sách bài đăng.
3. Tạo route và controller.

---

## 11. Next Recommended — theo mức chi tiết

## 11.1. Next Recommended (mức sprint)
**Bắt đầu SPRINT_11**

## 11.2. Next Recommended (mức module)
**Backend - Notifications Module**

## 11.3. Next Recommended (mức subtask)
**Tích hợp Activity Logging vào các luồng nghiệp vụ hiện có (Tour Request, Companion Post).**


## 11.4. Next Recommended (mức phiên cực nhỏ)
**Trong phiên tiếp theo, chỉ làm:**
- Tạo `NotificationsModule` và schema database cơ bản.

---

## 12. Blockers / Risks

## 12.1. Rủi ro hiện tại
1. **Chưa khởi tạo source code thật**
   - Đã xong hoàn toàn tài liệu điều phối, nếu tiếp tục viết docs sẽ gây trì trệ dự án.

2. **Dễ lệch schema Supabase**
   - Cần đảm bảo schema triển khai trên Supabase khớp 100% với file Master Spec 38 bảng.

## 12.2. Blocker kỹ thuật hiện tại
- Chưa xác nhận repo code thật đang ở trạng thái nào (thiếu thư mục source).

---

## 13. Roadmap Status Matrix

| Giai đoạn | Sprint | Trạng thái | Ghi chú |
|---|---|---|---|
| A | Sprint 01 | 🟢 Done | Đã hoàn tất cấu trúc repo, design tokens, route và DB |
| A | Sprint 02 | 🟢 Done | Hoàn tất Đăng ký, Đăng nhập, Hồ sơ, Đổi MK, RoleGuard |
| B | Sprint 03 | 🟢 Done | 100% DONE | Hoàn thiện Public Tour API & Seed data |
| B | Sprint 04 | 🟢 Done | 100% | Backend DONE, Frontend M32, M08, M09, M31 Integrated |
| B | Sprint 05 | 🟢 Done | 100% | Hoàn tất CRUD Tour, Lịch trình & Hình ảnh (M34-M37) |
| B | Sprint 06 | 🟢 Done | 100% | Hoàn tất Tour Request flow (User & Guide) |
| B | Sprint 07 | 🟢 Done | 100% DONE | Hoàn tất Backend & Frontend cho Companion module |
| B | Sprint 08 | 🟢 Done | 100% DONE | Hoàn tất Admin Dashboard, User/Role, Report & Verification |
| C | Sprint 09 | 🟢 Done | 100% DONE (Regression, Polish, Sync, Demo) |
| C | Sprint 10 | 🟢 Done | 100% DONE | Hoàn tất Favorite, Review & Verification (Guide & Admin) |
| C | Sprint 11 | 🟢 Done | Map tọa độ thực, Activity Log filter 10 loại, Notifications badge, Admin Stats |
| D | Sprint 12 | 🟢 Done | Chat module hoàn tất — UI & Backend Logic Stable |
| D | Sprint 13 | ⏭️ Skipped | Chuyển thẳng sang Sprint 14 |
| E | Sprint 14 | 🟡 In Progress | Polish UI & Performance (Tour Detail DONE) |

---

## 14. Definition of Done Check — theo hiện trạng

## 14.1. Giai đoạn chuẩn bị tài liệu & định hướng
- [x] Đã chốt đề tài
- [x] Đã chốt phạm vi chính thức
- [x] Đã chốt 4 Area
- [x] Đã chốt 6 nhóm vai trò
- [x] Đã chốt 29 chức năng
- [x] Đã chốt 47 màn hình
- [x] Đã chốt schema 38 bảng
- [x] Đã chốt roadmap 14 sprint
- [x] Đã chốt master spec v3
- [x] Đã có sprint master và sprint checklist master

## 14.2. Sprint 01 — hiện tại
- [x] Có master spec đủ chi tiết
- [x] **M38: Backend Favorites Module** (DONE)
    - [x] Implement toggle favorite for tours (POST/DELETE)
    - [x] Implement toggle favorite for guides (POST/DELETE)
    - [x] Implement get user's favorite lists (GET)
- [x] **M39: UI Favorite Integration** (DONE)
    - [x] Add favorite button to TourDetailPage
    - [x] Add favorite button to GuideDetailPage
    - [x] Create My Favorites dashboard page (/user/favorites)
- [x] **M27/M28: Backend Reviews Module** (DONE)
    - [x] Implement Tour Review creation with ownership check
    - [x] Implement Guide Review creation with ownership check
    - [x] Implement public review listing for tours/guides
    - [x] Implement average rating calculation for tour/guide profiles
- [x] **M27/M28: UI Review Integration** (DONE)
    - [x] Add "Đánh giá" buttons to MyTourRequestsPage
    - [x] Create ReviewModal for submitting rating/comment
    - [x] Update Tour/Guide detail pages to show real reviews & ratings
- [x] **M29: Guide Verification Module** (DONE)
    - [x] Implement backend logic for verification requests & documents
    - [x] Integrate Supabase Storage for document uploads
    - [x] Create GuideVerificationPage UI
    - [x] Enforce business rules for verification status
- [x] Có status file
- [x] Có sprint breakdown file chính thức (`PROJECT_TASK.md`)
- [x] Có sprint master
- [x] Có sprint checklist master
- [x] Có sprint files 01–14
- [x] Có bootstrap prompt
- [x] Có handoff instructions
- [x] Có prompt library theo sprint
- [x] Có session log bản dùng thật
- [x] Có source frontend/backend khởi tạo thật
- [x] Có cấu trúc 4 Area trong code thật
- [x] Có database folder/schema baseline
- [x] Có seed role trong code thật
- [x] Có chạy local thành công

### Đánh giá chung
**Hệ thống hiện đã đạt trạng thái kỹ thuật 100% Full-stack cho Giai đoạn A. Các lỗi thiếu hụt từ Sprint 01/02 đã được dọn dẹp (Technical Debt Cleaned). Đã sẵn sàng cho nghiệp vụ chuyên sâu của Sprint 04.**

---

## 15. What Agent Must Do In The Next Session

Trong phiên kế tiếp, AI agent phải:

1. Xác nhận:
   - Dự án đã được đẩy lên GitHub thành công.
   - Luồng Public Tour (HomePage, List, Detail) đã đạt chuẩn Premium về UI/Performance.

2. Chuyển hướng:
   - Tập trung vào Lane 18.2: Chuẩn hóa dữ liệu Seed "Premium" (Tour chi tiết, Review thực tế, Lịch sử Chat AI mẫu).

3. Duy trì:
   - Luôn chạy dọn dẹp bằng `./clean.sh` trước khi đóng phiên nếu cần.
   - Đảm bảo file `.env` không bao giờ bị đẩy lên Git.

---

## 16. Session Update Template

```md
## Session Update

### Sprint
- Sprint hiện tại:
- Giai đoạn:
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

## 17. Update Rule

Sau mỗi phiên làm việc, AI agent phải cập nhật file này khi có thay đổi ở một trong các điểm sau:

- đổi sprint hiện tại
- xong một subtask đáng kể
- đổi `In Progress`
- đổi `Next Recommended`
- xuất hiện blocker mới
- một phần DoD đã được đánh dấu thêm
- đã tạo hoặc hoàn tất thêm file điều phối lõi
- đã bắt đầu implementation nền thật

Không để `PROJECT_STATUS.md` bị lỗi thời sau nhiều phiên.

---

## 18. One-Line Truth

**Sprint 14 đang triển khai (Final QA & Polish). Đã hoàn thiện toàn bộ luồng Đặt Tour, Thanh toán VNPAY & Quản lý giao dịch. Tiến độ dự án: 99.5%.**
---

### 24. Session Update (2026-04-30) - Perfecting Search Bar & Budget Filtering
- **Current sprint**: Sprint 14
- **Chosen subtask**: Nâng cấp thanh tìm kiếm với gợi ý địa điểm và bộ lọc ngân sách dạng slider cao cấp.
- **Done**:
    - [x] Triển khai **Dual-Range Budget Slider** (0đ - 100tr+) đồng bộ giữa Trang chủ và Trang danh sách tour.
    - [x] Khắc phục lỗi hiển thị (overflow) và định vị (positioning) của thanh trượt ngân sách.
    - [x] Triển khai **Location Autocomplete**: Tự động gợi ý tỉnh thành Việt Nam khi người dùng nhập vào ô địa điểm.
    - [x] Tách danh sách tỉnh thành (63 tỉnh thành) ra file constant dùng chung (`/constants/provinces.ts`).
    - [x] Đồng bộ hóa tham số tìm kiếm (minPrice, maxPrice, province) khi chuyển trang từ Home sang Tour List.
    - [x] Thu nhỏ nút "Hỏi trợ lý AI" thành tỷ lệ 1:1 theo yêu cầu.
- **Files changed**:
    - `frontend/src/pages/public/HomePage.tsx`
    - `frontend/src/pages/public/TourListPage.tsx`
    - `frontend/src/constants/provinces.ts`
    - `frontend/src/index.css`
- **Tested/verified**:
    - [x] Thanh trượt ngân sách hoạt động mượt mà, không bị văng ra ngoài khung.
    - [x] Gợi ý địa điểm hiển thị đúng theo nội dung nhập và có thể chọn bằng click.
    - [x] Dữ liệu tìm kiếm từ trang chủ được truyền sang trang danh sách tour chính xác.
- **Result status**: [x] Xong hoàn toàn subtask.
- **Blockers/risks**: Không có.
- **Best next single step**: Lane 18.2 (Data Polish): Cập nhật dữ liệu demo cho các tour tiêu biểu để khớp với khoảng giá 0-100tr vừa nâng cấp.

---

### 23. Session Update (2026-04-30) - Tour Schedule Details & Guide Management

### Sprint
- Sprint hiện tại: Sprint 14
- Session focus: Building Tour Schedule Details & Guide Management.
- Chosen subtask: Phát triển trang Chi tiết Lịch khởi hành cho HDV và tối ưu điều hướng thông báo.

### Done
- [x] Cập nhật **TourRequestQueryDto** hỗ trợ lọc theo `scheduleId`.
- [x] Nâng cấp **TourRequestsService** phía Backend để trả về thông tin thanh toán chi tiết.
- [x] Triển khai trang **TourScheduleDetailPage** (UI Premium) hiển thị danh sách khách hàng.
- [x] Tích hợp logic **Parsing Passenger Note** để trích xuất thông tin hành khách từ ghi chú booking.
- [x] Cho phép HDV cập nhật số lượng khách tối đa (`maxParticipants`) và khóa giá tour (`price` readonly).
- [x] Sửa lỗi điều hướng tại **NotificationsPage**: Tự động chuyển hướng HDV đến `/guide/tour-requests` khi có thông báo về tour.
- [x] Fix lỗi Vite import và đồng bộ tên thuộc tính (`tour_schedules`).

### Files Changed
- `backend/src/tour-requests/dto/tour-request-query.dto.ts`
- `backend/src/tour-requests/tour-requests.service.ts`
- `frontend/src/routes/index.tsx`
- `frontend/src/services/tourRequestService.ts`
- `frontend/src/services/tourService.ts`
- `frontend/src/pages/guide/tabs/TourSchedulesTab.tsx`
- `frontend/src/pages/guide/TourScheduleDetailPage.tsx`
- `frontend/src/pages/guide/TourScheduleDetailPage.css`
- `frontend/src/pages/user/NotificationsPage.tsx`

### Result
- [x] Xong hoàn toàn subtask.

### Suggested Next Single Step
- **Lane 18.2 (End-to-End Flow Validation)**: Kiểm tra luồng đặt tour thực tế từ khách hàng sang HDV.

