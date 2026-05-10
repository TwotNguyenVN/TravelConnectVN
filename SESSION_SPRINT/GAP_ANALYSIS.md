# GAP ANALYSIS — PHÂN TÍCH KHOẢNG CÁCH GIỮA KẾ HOẠCH VÀ SOURCE CODE

> **Ngày phân tích:** 2026-05-02  
> **Dự án:** TravelConnectVN  
> **Phạm vi:** So sánh kế hoạch sprint (SPRINT_MASTER.md, PROJECT_TASK.md) với source code thực tế

---

## 1. Tổng quan trạng thái sprint

| Sprint | Mục tiêu | Trạng thái |
|--------|----------|------------|
| Sprint 01 | Nền tảng kỹ thuật tổng thể | ✅ Hoàn thành |
| Sprint 02 | Auth, hồ sơ cá nhân, phân quyền | ✅ Hoàn thành |
| Sprint 03 | Public tour | ✅ Hoàn thành |
| Sprint 04 | Guide profile | ✅ Hoàn thành |
| Sprint 05 | Guide quản lý tour | ✅ Hoàn thành |
| Sprint 06 | Tour request | ✅ Hoàn thành |
| Sprint 07 | Companion post + companion request | ✅ Hoàn thành |
| Sprint 08 | Admin core, report, kiểm duyệt | ✅ Hoàn thành |
| Sprint 09 | Ổn định MVP lõi | ✅ Hoàn thành |
| Sprint 10 | Favorite, review, verification | ✅ Hoàn thành |
| Sprint 11 | Map, activity log, notification, statistics | ✅ Hoàn thành |
| Sprint 12 | Chat trực tiếp + chat nhóm | ✅ Hoàn thành |
| Sprint 13 | AI, recommendation, accommodation, payment | ✅ Hoàn thành |
| Sprint 14 | QA tổng thể, Polish UI, Demo data, Báo cáo | 🔄 Đang thực hiện |

---

## 2. Các khoảng cách (GAP) phát hiện

### GAP-01: Module Accommodation chưa có frontend chuyên dụng

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 13 — Tích hợp thông tin lưu trú đối tác liên kết với tour |
| **Backend** | ✅ Có `accommodations.controller.ts`, service, module |
| **Database** | ✅ Có `partner_accommodations`, `tour_accommodations` |
| **Frontend** | ❌ Chưa thấy trang quản lý lưu trú riêng |
| **Mức độ** | Trung bình — Backend hoạt động, thiếu UI |
| **Khuyến nghị** | Có thể hiển thị thông tin lưu trú trên `TourDetailPage` nếu tour có liên kết accommodation. Không cần trang riêng. |

### GAP-02: Kiểm thử tự động (Unit test / E2E test)

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 14 — Kiểm thử tổng thể |
| **Backend** | ⚠️ Chỉ có `app.controller.spec.ts` mặc định của NestJS và `test/app.e2e-spec.ts` |
| **Frontend** | ❌ Không thấy test file |
| **Mức độ** | Thấp — Không ảnh hưởng demo, nhưng ảnh hưởng báo cáo chất lượng |
| **Khuyến nghị** | Viết 3-5 unit test cơ bản cho module lõi (auth, tours, tour-requests) để minh họa trong báo cáo. |

### GAP-03: Phân quyền chi tiết giữa các vai trò Admin

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | CONTENT_MODERATOR và SUPPORT_STAFF có quyền hạn khác nhau |
| **Backend** | ✅ Có `role.enum.ts` định nghĩa 5 vai trò, `role.guard.ts` kiểm tra |
| **Frontend** | ⚠️ `AdminLayout` cho phép cả 3 vai trò admin truy cập mọi trang admin |
| **Mức độ** | Thấp — Chức năng cốt lõi không bị ảnh hưởng |
| **Khuyến nghị** | Ghi nhận trong báo cáo là hướng phát triển. Trong demo, dùng tài khoản SYSTEM_ADMIN. |

### GAP-04: Thanh toán chỉ ở mức Sandbox

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 13 — VNPAY Sandbox |
| **Backend** | ✅ Có controller, service, IPN callback đầy đủ |
| **Frontend** | ✅ Có `VnpayReturnPage.tsx`, hỗ trợ full/deposit |
| **Thực tế** | Chỉ dùng thẻ test sandbox, không giao dịch tiền thật |
| **Mức độ** | Chấp nhận được — Đây là đồ án, sandbox là phù hợp |
| **Khuyến nghị** | Ghi rõ trong báo cáo: "Thanh toán VNPAY triển khai ở chế độ sandbox (môi trường thử nghiệm), sẵn sàng chuyển sang production khi có merchant account." |

### GAP-05: Recommendation engine đơn giản

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 13 — Gợi ý tour cho người dùng |
| **Backend** | ✅ Có `recommendations.controller.ts`, `recommendations.service.ts` |
| **Database** | ✅ Có `user_preferences`, `user_preferred_categories` |
| **Thực tế** | Rule-based (dựa trên sở thích + categories), không dùng ML |
| **Mức độ** | Chấp nhận được — Phù hợp đồ án cơ sở |
| **Khuyến nghị** | Ghi nhận trong báo cáo. Nêu trong hướng phát triển: "Nâng cấp lên collaborative filtering hoặc content-based filtering." |

### GAP-06: AI Chatbot chưa tích hợp sâu dữ liệu nội bộ

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 13 — AI Chat hỗ trợ du lịch |
| **Backend** | ✅ Có `ai-chat.service.ts` dùng Google Generative AI |
| **Thực tế** | AI trả lời dựa trên kiến thức chung, chưa query dữ liệu tour/guide trong hệ thống |
| **Mức độ** | Trung bình — Chức năng hoạt động nhưng chưa tối ưu |
| **Khuyến nghị** | Ghi nhận trong báo cáo: "AI chatbot sử dụng Google Gemini để trả lời các câu hỏi du lịch chung. Hướng phát triển: tích hợp RAG (Retrieval-Augmented Generation) với dữ liệu tour thực tế." |

### GAP-07: Chưa có trang Báo cáo vi phạm riêng cho User

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | User gửi báo cáo vi phạm |
| **Backend** | ✅ Có `reports.controller.ts` |
| **Frontend** | ⚠️ Nút "Báo cáo" có trên `CompanionDetailPage.tsx`, nhưng chưa thấy trang riêng để xem lịch sử báo cáo đã gửi |
| **Admin** | ✅ `AdminReportManagementPage.tsx` xử lý đầy đủ |
| **Mức độ** | Thấp — User có thể gửi báo cáo, admin xử lý được |
| **Khuyến nghị** | Không cần trang riêng. Luồng hiện tại đủ dùng. |

### GAP-08: Chưa triển khai Production/CI-CD

| Mục | Chi tiết |
|-----|---------|
| **Thực tế** | Dự án chạy ở localhost (dev mode) |
| **Mức độ** | Chấp nhận được — Đây là đồ án |
| **Khuyến nghị** | Ghi trong hướng phát triển: "Triển khai production trên Vercel (frontend) + Railway/Render (backend) + Supabase (database)." |

### GAP-09: Modal đánh giá tour/HDV sau chuyến đi

| Mục | Chi tiết |
|-----|---------|
| **Kế hoạch** | Sprint 14 — Lane 18.2 Review Modals |
| **Thực tế** | `BookingManagementPage.tsx` có nút "Đánh giá Tour" và "Đánh giá HDV", nhưng modal chi tiết đang hoàn thiện |
| **Backend** | ✅ Có `reviews.controller.ts` API đầy đủ |
| **Mức độ** | Thấp — API sẵn sàng, chỉ cần polish UI |
| **Khuyến nghị** | Ưu tiên hoàn thiện trước khi bảo vệ. |

---

## 3. Bảng ưu tiên hoàn thiện

| STT | GAP | Mức ưu tiên | Lý do | Ước lượng effort |
|-----|-----|-------------|-------|------------------|
| 1 | GAP-09 | 🔴 Cao | Cần cho demo luồng đánh giá | 2-3 giờ |
| 2 | GAP-02 | 🟡 Trung bình | Cần cho phần kiểm thử trong báo cáo | 3-4 giờ |
| 3 | GAP-01 | 🟡 Trung bình | Hiển thị lưu trú trên trang tour | 1-2 giờ |
| 4 | GAP-06 | 🟢 Thấp | Nâng cấp AI — không bắt buộc cho đồ án | 4-8 giờ |
| 5 | GAP-03 | 🟢 Thấp | Phân quyền chi tiết admin — hướng phát triển | 2-3 giờ |
| 6 | GAP-04 | ⚪ Không cần | Sandbox phù hợp đồ án | — |
| 7 | GAP-05 | ⚪ Không cần | Rule-based phù hợp đồ án | — |
| 8 | GAP-07 | ⚪ Không cần | Luồng hiện tại đủ | — |
| 9 | GAP-08 | ⚪ Không cần | Deploy không bắt buộc | — |

---

## 4. Kết luận

Dự án TravelConnectVN đã triển khai **phần lớn** các tính năng theo kế hoạch 14 sprint. Các khoảng cách phát hiện được chủ yếu thuộc nhóm:
- **Polish/Hoàn thiện UI** (GAP-01, GAP-09): cần ít effort.
- **Nâng cao chất lượng** (GAP-02, GAP-06): viết test, tích hợp AI sâu hơn.
- **Giới hạn phù hợp đồ án** (GAP-04, GAP-05, GAP-08): sandbox/rule-based/localhost là chấp nhận được.

**Khuyến nghị:** Ưu tiên hoàn thiện GAP-09 (Review Modals) trước khi bảo vệ, sau đó viết 3-5 unit test cơ bản cho báo cáo.
