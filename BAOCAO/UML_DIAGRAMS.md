# SƠ ĐỒ UML — TRAVELCONNECTVN

> Tài liệu này chứa các sơ đồ UML (Activity Diagram, Sequence Diagram) cho các luồng nghiệp vụ chính của hệ thống, được trích xuất từ source code thực tế.

---

## 1. Activity Diagram — Luồng Đặt Tour & Thanh Toán

```mermaid
flowchart TD
    A([Khách truy cập]) --> B[Xem danh sách Tour]
    B --> C[Chọn Tour xem chi tiết]
    C --> D{Đã đăng nhập?}
    D -- Chưa --> E[Chuyển đến trang Đăng nhập]
    E --> F[Đăng nhập / Đăng ký]
    F --> D
    D -- Rồi --> G[Chọn ngày khởi hành trên TourCalendar]
    G --> H[Nhập số lượng khách]
    H --> I[Nhấn Đặt ngay]
    I --> J[TourBookingPage - Xác nhận thông tin]
    J --> K[Chọn hình thức thanh toán]
    K --> L{Thanh toán Full hay Đặt cọc?}
    L -- Full --> M[Gọi API create-vnpay-url type=full]
    L -- Đặt cọc --> N[Gọi API create-vnpay-url type=deposit]
    M --> O[Redirect sang VNPAY Sandbox]
    N --> O
    O --> P{Thanh toán thành công?}
    P -- Thành công --> Q[VNPAY IPN Callback → Backend cập nhật status=paid]
    P -- Thất bại --> R[VnpayReturnPage hiển thị lỗi]
    Q --> S[VnpayReturnPage hiển thị thành công]
    S --> T[Thông báo gửi đến Guide qua Socket.io]
    T --> U([Hiển thị trong BookingManagementPage])
    R --> V[User có thể thử lại thanh toán]
    V --> K
```

---

## 2. Activity Diagram — Đăng ký & Phân quyền RBAC

```mermaid
flowchart TD
    A([Người dùng mới]) --> B[Truy cập RegisterPage]
    B --> C{Phương thức đăng ký}
    C -- Email/Password --> D[Nhập thông tin + Supabase Auth signUp]
    C -- Google OAuth --> E[Supabase Auth signInWithOAuth]
    D --> F[Supabase tạo auth.users record]
    E --> F
    F --> G[Backend trigger: tạo public.users record]
    G --> H[Gán role mặc định USER vào user_roles]
    H --> I[Chuyển đến RoleSelectionPage]
    I --> J{Chọn vai trò}
    J -- Khách du lịch --> K[Giữ role USER]
    J -- Hướng dẫn viên --> L[Gán thêm role GUIDE + tạo guide_profiles]
    K --> M[Redirect về trang chủ HomePage]
    L --> N[Redirect về GuideProfilePage]
    N --> O{Muốn xác minh?}
    O -- Có --> P[Gửi hồ sơ xác minh GuideVerificationPage]
    P --> Q[Admin duyệt trên AdminVerificationPage]
    Q --> R{Kết quả}
    R -- Duyệt --> S[verification_status = verified]
    R -- Từ chối --> T[verification_status = rejected]
    O -- Chưa --> U[Vẫn dùng được nhưng chưa verified badge]
```

---

## 3. Sequence Diagram — Luồng Chat Realtime

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend ChatPage
    participant WS as Socket.io Gateway
    participant BE as NestJS Backend
    participant DB as PostgreSQL

    U->>FE: Mở ChatPage
    FE->>BE: GET /conversations (lấy danh sách)
    BE->>DB: SELECT conversations WHERE participant = user
    DB-->>BE: Danh sách conversations
    BE-->>FE: JSON response

    U->>FE: Chọn conversation
    FE->>BE: GET /messages/:conversationId
    BE->>DB: SELECT messages ORDER BY sent_at
    DB-->>BE: Danh sách messages
    BE-->>FE: JSON response

    FE->>WS: emit joinRoom(conversationId)
    WS-->>FE: Joined room OK

    U->>FE: Gõ tin nhắn + Enter
    FE->>WS: emit sendMessage(content, conversationId)
    WS->>BE: Validate + Save message
    BE->>DB: INSERT INTO messages
    DB-->>BE: Message saved
    WS-->>FE: emit newMessage (broadcast to room)
    
    Note over FE: Tin nhắn hiển thị realtime cho cả 2 phía
```

---

## 4. Sequence Diagram — Luồng Tìm Bạn Đồng Hành

```mermaid
sequenceDiagram
    actor A as User A (Chủ bài)
    actor B as User B (Người tham gia)
    participant FE as Frontend
    participant BE as NestJS Backend
    participant DB as PostgreSQL
    participant NT as NotificationsService

    A->>FE: Tạo bài tìm bạn đồng hành (CompanionFormPage)
    FE->>BE: POST /companion-posts
    BE->>DB: INSERT INTO companion_posts
    DB-->>BE: Bài đăng created
    BE-->>FE: Success

    B->>FE: Xem bài đồng hành (CompanionDetailPage)
    FE->>BE: GET /companion-posts/:id
    BE-->>FE: Chi tiết bài đăng

    B->>FE: Gửi yêu cầu tham gia
    FE->>BE: POST /companion-posts/:id/requests
    BE->>DB: INSERT INTO companion_requests (status=pending)
    BE->>NT: Gửi thông báo cho User A
    NT->>DB: INSERT INTO notifications
    DB-->>BE: OK
    BE-->>FE: Request created

    A->>FE: Xem yêu cầu (CompanionRequestManagementPage)
    FE->>BE: GET /companion-posts/:id/requests
    BE-->>FE: Danh sách requests

    A->>FE: Duyệt yêu cầu
    FE->>BE: PATCH /companion-posts/requests/:id (status=approved)
    BE->>DB: UPDATE companion_requests SET status=approved
    BE->>NT: Gửi thông báo cho User B
    BE-->>FE: Success

    Note over A,B: Cả hai có thể chat qua group conversation
```

---

## 5. Activity Diagram — Admin Quản lý Báo cáo Vi phạm

```mermaid
flowchart TD
    A([User bất kỳ]) --> B[Nhấn nút Báo cáo vi phạm]
    B --> C[ReportModal: Chọn lý do + mô tả]
    C --> D[POST /reports → tạo report status=open]
    D --> E([Admin/Moderator])
    E --> F[Xem danh sách báo cáo AdminReportManagementPage]
    F --> G[Chọn báo cáo để xử lý]
    G --> H{Hành động}
    H -- Xem xét --> I[Đổi status = reviewing]
    H -- Giải quyết --> J[Đổi status = resolved + ghi chú]
    H -- Từ chối --> K[Đổi status = dismissed + ghi chú]
    I --> L[Ghi lịch sử vào report_processing_history]
    J --> L
    K --> L
    L --> M[Gửi thông báo cho reporter]
    M --> N([Kết thúc])
```

---

## 6. Component Diagram — Kiến trúc tổng thể

```mermaid
flowchart LR
    subgraph Client["Frontend (React 19 + Vite)"]
        direction TB
        PUB[Public Pages]
        USR[User Pages]
        GD[Guide Pages]
        ADM[Admin Pages]
        SVC[17 Service Files]
        CTX[AuthContext + ToastContext + SocketContext]
    end

    subgraph Server["Backend (NestJS 11)"]
        direction TB
        CTRL[21 Controllers]
        SRV[20 Service Modules]
        GRD[AuthGuard + RoleGuard]
        WSG[Socket.io Gateway]
        PRS[Prisma ORM v7]
    end

    subgraph Database["Supabase PostgreSQL"]
        direction TB
        AUTH[auth.users - Supabase Auth]
        PUB_DB[42 Public Tables]
        RLS[RLS Policies]
    end

    subgraph External["Tích hợp bên ngoài"]
        direction TB
        VNPAY[VNPAY Sandbox]
        GEMINI[Google Gemini AI]
        GMAP[Google Maps / Leaflet]
    end

    Client <-->|REST API + JWT| Server
    Client <-->|WebSocket| WSG
    Server <-->|Prisma Adapter| Database
    Server <-->|IPN Callback| VNPAY
    Server <-->|API Key| GEMINI
    Client <-->|Map Tiles| GMAP
```

---

*Các sơ đồ UML trên được tạo tự động dựa trên phân tích source code thực tế của dự án TravelConnectVN. Render bằng Mermaid.*
