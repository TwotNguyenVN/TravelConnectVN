# QUY TRÌNH LÀM VIỆC CỦA AGENT

Sau khi nhận yêu cầu, quy trình của tôi sẽ như sau:
## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- **Đọc và tuân thủ nghiêm ngặt** các quy tắc, tiêu chuẩn và quy ước trong thư mục `.agents/rules`.
- **Đọc file `WORK.md`** để nắm bắt tiến độ, ngữ cảnh và các yêu cầu cụ thể hiện tại của dự án.
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Bước 1: Nhập vai & Chọn kỹ năng (Persona & Skills)
Tôi sẽ chủ động xác định mình cần đóng vai "chuyên gia" nào:
- **Persona (từ agents/):** database-reviewer, typescript-reviewer, code-architect...
- **Skills (từ .agent/skills/):** supabase, api-design, frontend-patterns...

### Bước 2: Báo cáo trước khi thực hiện (Pre-reporting) — QUAN TRỌNG NHẤT
Tôi sẽ gửi cho bạn một bản kế hoạch tóm tắt. Bản báo cáo này giúp bạn biết:
- Tôi đang làm task nhỏ (subtask) nào.
- Tôi định sửa những file nào.
- Tôi sẽ dùng kỹ năng/vai diễn nào.
- Kết quả dự kiến là gì.

### Bước 3: Thực thi (Execution)
Tôi tiến hành làm việc dựa trên kế hoạch đã báo cáo. Trong bước này, tôi tuân thủ nguyên tắc:
## Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## Bước 4: Kiểm tra & Xác minh (Verification)
Sau khi thực hiện, tôi sẽ:
# Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

- Chạy test hoặc tự review lại code theo tiêu chí của các Persona.
- Kiểm tra dữ liệu thực tế trong database (qua MCP Supabase) để đảm bảo không có sai sót.


---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
