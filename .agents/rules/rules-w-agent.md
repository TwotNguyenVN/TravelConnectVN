---
trigger: always_on
---

# Rules
## Structure

Rules are organized into a **common** layer plus **language-specific** directories:

```
rules/
├── common/          # Language-agnostic principles (always install)
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── performance.md
│   ├── patterns.md
│   ├── hooks.md
│   ├── agents.md
│   └── security.md
├── typescript/      # TypeScript/JavaScript specific
├── python/          # Python specific
├── golang/          # Go specific
├── web/             # Web and frontend specific
├── swift/           # Swift specific
└── php/             # PHP specific
```

- **common/** contains universal principles — no language-specific code examples.
- **Language directories** extend the common rules with framework-specific patterns, tools, and code examples. Each file references its common counterpart.

## Installation

### Option 1: Install Script (Recommended)

```bash
# Install common + one or more language-specific rule sets
./install.sh typescript
./install.sh python
./install.sh golang
./install.sh web
./install.sh swift
./install.sh php

# Install multiple languages at once
./install.sh typescript python
```

### Option 2: Manual Installation

> **Important:** Copy entire directories — do NOT flatten with `/*`.
> Common and language-specific directories contain files with the same names.
> Flattening them into one directory causes language-specific files to overwrite
> common rules, and breaks the relative `../common/` references used by
> language-specific files.

```bash
# Install common rules (required for all projects)
cp -r rules/common ~/.claude/rules/common

# Install language-specific rules based on your project's tech stack
cp -r rules/typescript ~/.claude/rules/typescript
cp -r rules/python ~/.claude/rules/python
cp -r rules/golang ~/.claude/rules/golang
cp -r rules/web ~/.claude/rules/web
cp -r rules/swift ~/.claude/rules/swift
cp -r rules/php ~/.claude/rules/php

# Attention ! ! ! Configure according to your actual project requirements; the configuration here is for reference only.
```

## Rules vs Skills

- **Rules** define standards, conventions, and checklists that apply broadly (e.g., "80% test coverage", "no hardcoded secrets").
- **Skills** (`skills/` directory) provide deep, actionable reference material for specific tasks (e.g., `python-patterns`, `golang-testing`).

Language-specific rule files reference relevant skills where appropriate. Rules tell you *what* to do; skills tell you *how* to do it.

## Adding a New Language

To add support for a new language (e.g., `rust/`):

1. Create a `rules/rust/` directory
2. Add files that extend the common rules:
   - `coding-style.md` — formatting tools, idioms, error handling patterns
   - `testing.md` — test framework, coverage tools, test organization
   - `patterns.md` — language-specific design patterns
   - `hooks.md` — PostToolUse hooks for formatters, linters, type checkers
   - `security.md` — secret management, security scanning tools
3. Each file should start with:
   ```
   > This file extends [common/xxx.md](../common/xxx.md) with <Language> specific content.
   ```
4. Reference existing skills if available, or create new ones under `skills/`.

For non-language domains like `web/`, follow the same layered pattern when there is enough reusable domain-specific guidance to justify a standalone ruleset.

## Rule Priority

When language-specific rules and common rules conflict, **language-specific rules take precedence** (specific overrides general). This follows the standard layered configuration pattern (similar to CSS specificity or `.gitignore` precedence).

- `rules/common/` defines universal defaults applicable to all projects.
- `rules/golang/`, `rules/python/`, `rules/swift/`, `rules/php/`, `rules/typescript/`, etc. override those defaults where language idioms differ.

### Example

`common/coding-style.md` recommends immutability as a default principle. A language-specific `golang/coding-style.md` can override this:

> Idiomatic Go uses pointer receivers for struct mutation — see [common/coding-style.md](../common/coding-style.md) for the general principle, but Go-idiomatic mutation is preferred here.

### Common rules with override notes

> **Language note**: This rule may be overridden by language-specific rules for languages where this pattern is not idiomatic.

## Agent Autonomy

To improve efficiency and reduce interruptions, the following rules apply to the AI Agent:

- **Safe Read-Only Commands**: Always set `SafeToAutoRun: true` for commands that only read or search data (e.g., `ls`, `grep`, `cat`, `find`, `git status`, `git log`, `pwd`).
- **Standard Checks**: Always set `SafeToAutoRun: true` for standard linter or type checks that do not modify files (e.g., `npm run lint` or `tsc --noEmit`).
- **Autonomous Error Correction**: If a safe command fails, the agent is encouraged to autonomously investigate and run follow-up safe commands to identify the cause.
- **Explicit Approval Required**: The agent MUST still request explicit user approval for bất kỳ lệnh nào làm thay đổi trạng thái dự án (ví dụ: `git push`, `npm install`, `rm`, `mv`, hoặc thực thi các script tùy chỉnh có thay đổi file), trừ khi được đánh dấu cụ thể với `// turbo` trong một workflow.

## New Session Rules / Quy Tắc Khởi Đầu Phiên Làm Việc Mới

- **MANDATORY**: At the beginning of every new session/conversation, the AI Agent **MUST** read and understand [git-workflows.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/git-workflows.md) before executing any Git commands or modifying the code. This ensures strict adherence to the team's branching model, checkout procedures, and Conventional Commits.
- **BẮT BUỘC**: Khi bắt đầu bất kỳ phiên làm việc mới nào, AI Agent **BẮT BUỘC** phải đọc và hiểu tài liệu [git-workflows.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/git-workflows.md) trước khi chạy bất kỳ lệnh Git nào hoặc thay đổi code. Quy tắc này đảm bảo tuân thủ nghiêm ngặt mô hình chia nhánh, quy trình checkout và Conventional Commits của nhóm.

## Git Push Automation / Tự động hóa Push Git

- **AUTOMATION**: When the user requests "push git", the AI Agent **MUST** follow the High-Efficiency Git Workflow defined in [git-workflows.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/git-workflows.md) (Section 7, Rule 6). This includes creating a feature/bugfix branch from `develop` if there are uncommitted local changes, committing them, pushing to remote, and creating a PR via the GitHub CLI (`gh`).
- **TỰ ĐỘNG HÓA**: Khi người dùng yêu cầu "push git", AI Agent **BẮT BUỘC** phải tuân theo Quy trình Tự động hóa Git Hiệu suất cao được mô tả trong [git-workflows.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/git-workflows.md) (Mục 7, Điều 6). Quy trình này bao gồm việc tự động tạo nhánh feature/bugfix từ `develop` nếu có thay đổi chưa commit ở local, thực hiện commit, push lên remote, và tạo PR bằng GitHub CLI (`gh`).

## Git Push on Task Completion / Tự động Commit & Push sau khi hoàn thành yêu cầu

- **COMMIT & PUSH**: Upon completing any task or request requested by the user, the AI Agent **MUST** automatically commit the changes (following Conventional Commits formatting) and push the branch to the remote repository.
- **COMMIT & PUSH**: Sau khi hoàn thành bất kỳ yêu cầu hoặc tác vụ nào từ người dùng, AI Agent **BẮT BUỘC** phải tự động commit các thay đổi (tuân thủ định dạng Conventional Commits) và push nhánh lên remote repository.

## No Browser Testing / Cấm dùng Browser để kiểm thử

- **STRICTLY FORBIDDEN**: The AI Agent **MUST NOT** use the browser subagent (`browser_subagent` tool) for any form of testing, verification, or QA. Browser automation is unreliable in this environment and wastes quota.
- **CẤMTUYỆT ĐỐI**: AI Agent **KHÔNG ĐƯỢC** sử dụng browser subagent (`browser_subagent` tool) cho bất kỳ mục đích kiểm thử, xác minh, hoặc QA nào. Thay vào đó, phải sử dụng:
  - `npm run test` — chạy unit/integration tests
  - `npx tsc --noEmit` — kiểm tra TypeScript
  - `npm run build` — kiểm tra build production
  - `npm run lint` — kiểm tra code style
  - Đọc trực tiếp source code và log terminal để xác minh kết quả

## Update Working Context on Task Completion / Cập nhật Working Context sau khi hoàn thành tác vụ

- **UPDATE CONTEXT**: Upon completing a feature, bugfix, or significant task, the AI Agent **MUST** update the [Working-context.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/Working-context.md) file. This includes updating the `Active Queues` (checking off completed items) and adding a new entry to `Latest Execution Notes` with a summary of the work done.
- **CẬP NHẬT CONTEXT**: Sau khi hoàn thành một tính năng, sửa lỗi, hoặc tác vụ quan trọng, AI Agent **BẮT BUỘC** phải cập nhật file [Working-context.md](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/Working-context.md). Việc này bao gồm cập nhật `Active Queues` (đánh dấu `[x]` các mục đã xong) và thêm một mục mới vào `Latest Execution Notes` tóm tắt công việc vừa thực hiện.