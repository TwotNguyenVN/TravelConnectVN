Tốt. Với kết quả **FINAL SMOKE TEST: PASS - freeze code**, mình chốt trạng thái cuối cùng như sau:

> **TravelConnectVN đã sẵn sàng demo chính thức theo happy path.**
> Từ thời điểm này nên **freeze code**, không refactor, không thêm tính năng, không sửa DB/backend trừ khi phát hiện lỗi cực kỳ nghiêm trọng.

Việc còn lại là: **chuẩn bị dữ liệu đẹp, luyện thao tác demo, viết script thuyết trình và chuẩn bị trả lời phản biện.**

---

# 1. Quyết định cuối cùng

| Hạng mục                          | Kết luận                           |
| --------------------------------- | ---------------------------------- |
| MVP lõi                           | Đạt                                |
| Demo chính thức                   | Được                               |
| Freeze code                       | Có                                 |
| Code thêm tính năng               | Không                              |
| Refactor React Query/Docker/Redis | Không                              |
| Demo VNPay/Chat/AI                | Không demo sâu                     |
| Ưu tiên cuối                      | Luyện demo + chuẩn bị thuyết trình |

Nếu còn thấy React Query Devtools vướng khi chiếu màn hình, chỉ xử lý nếu thật sự cần. Còn nếu không ảnh hưởng, **đừng đụng code nữa**.

---

# 2. Kịch bản demo chính thức 5–7 phút

## Mở đầu — 30 giây

Bạn nói:

> Em xin trình bày hệ thống TravelConnectVN, website du lịch kết nối khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành.
> Trong phần demo, em tập trung vào MVP lõi gồm: xem tour, gửi yêu cầu tham gia tour, hướng dẫn viên duyệt yêu cầu, bài tìm bạn đồng hành, báo cáo vi phạm và quản trị hệ thống.
> Các chức năng mở rộng như chat realtime, AI và thanh toán trực tuyến được định hướng cho giai đoạn sau, nên em không đi sâu trong phần demo chính.

---

## Bước 1 — Guest xem tour và bị chặn khi gửi yêu cầu

Thao tác:

1. Mở trang chủ.
2. Vào danh sách tour.
3. Tìm kiếm/lọc tour.
4. Mở chi tiết tour.
5. Bấm **Gửi yêu cầu** khi chưa đăng nhập.

Bạn nói:

> Với khách chưa đăng nhập, hệ thống cho phép xem thông tin công khai như danh sách tour, chi tiết tour và bài tìm bạn đồng hành.
> Tuy nhiên, khi thực hiện thao tác nghiệp vụ như gửi yêu cầu tham gia tour, hệ thống yêu cầu đăng nhập để đảm bảo xác định đúng người dùng và tránh dữ liệu rác.

Điểm nhấn:

> Đây là lớp kiểm soát ở frontend, còn backend vẫn có AuthGuard để chặn truy cập trái phép nếu gọi API trực tiếp.

---

## Bước 2 — User đăng ký/đăng nhập và gửi yêu cầu tour

Thao tác:

1. Đăng ký user mới hoặc đăng nhập user demo.
2. Vào lại tour.
3. Gửi yêu cầu tham gia tour.
4. Hiển thị toast thành công.

Bạn nói:

> Khi người dùng đăng ký, Supabase Auth tạo tài khoản xác thực. Sau đó database trigger tự động tạo hồ sơ nghiệp vụ trong bảng users và gán role USER vào user_roles.
> Sau khi đăng nhập, người dùng có thể gửi yêu cầu tham gia tour. Yêu cầu được lưu ở trạng thái chờ duyệt để hướng dẫn viên xem xét.

Điểm nhấn:

> Hệ thống không cho xác nhận tham gia ngay lập tức, mà tách thành luồng request để phù hợp với mô hình kết nối giữa khách du lịch và hướng dẫn viên.

---

## Bước 3 — Guide duyệt yêu cầu tham gia tour

Thao tác:

1. Chuyển sang trình duyệt Guide.
2. Vào `/guide/requests`.
3. Xem request vừa được gửi.
4. Bấm duyệt.
5. Nếu có thời gian, demo từ chối một request khác.

Bạn nói:

> Hướng dẫn viên chỉ nhìn thấy và xử lý yêu cầu thuộc các tour do mình quản lý.
> Khi duyệt yêu cầu, backend kiểm tra quyền sở hữu tour, trạng thái request và điều kiện tour trước khi cập nhật dữ liệu.

Điểm nhấn:

> Quyền không chỉ được ẩn ở giao diện, mà còn được kiểm tra ở backend bằng AuthGuard, RoleGuard và ownership check.

---

## Bước 4 — User tạo bài tìm bạn đồng hành

Thao tác:

1. User tạo bài tìm bạn đồng hành.
2. Mở danh sách bài.
3. User khác gửi yêu cầu tham gia.
4. Chủ bài duyệt request.

Bạn nói:

> Ngoài kết nối khách du lịch với hướng dẫn viên thông qua tour, hệ thống còn hỗ trợ người dùng kết nối với nhau qua bài tìm bạn đồng hành.
> Chủ bài có quyền duyệt hoặc từ chối yêu cầu tham gia, còn người không phải chủ bài sẽ không được thao tác.

Điểm nhấn:

> Luồng này thể hiện trục giá trị thứ hai của hệ thống: kết nối cộng đồng du lịch.

---

## Bước 5 — User gửi report và Admin xử lý

Thao tác:

1. User gửi báo cáo vi phạm cho tour hoặc bài đồng hành.
2. Chuyển sang trình duyệt Admin.
3. Vào `/admin/reports`.
4. Xử lý report, nhập lý do.
5. Hiển thị toast/trạng thái đã xử lý.

Bạn nói:

> Để đảm bảo hệ thống vận hành an toàn, người dùng có thể gửi báo cáo vi phạm.
> Quản trị viên tiếp nhận, xem xét và cập nhật trạng thái xử lý. Hệ thống cũng lưu lại lịch sử xử lý để hỗ trợ truy vết.

Điểm nhấn:

> Đây là phần giúp hệ thống không chỉ có chức năng đăng/xem dữ liệu, mà còn có cơ chế kiểm duyệt và quản trị vận hành.

---

## Kết thúc — 30 giây

Bạn nói:

> Như vậy, MVP lõi đã hoàn thành các nghiệp vụ chính: khách xem tour, người dùng gửi yêu cầu, hướng dẫn viên xử lý yêu cầu, người dùng tìm bạn đồng hành và quản trị viên xử lý báo cáo vi phạm.
> Các chức năng mở rộng như chat realtime, AI, thanh toán trực tuyến có thể tiếp tục phát triển ở giai đoạn sau, sau khi phần lõi đã ổn định.

---

# 3. Checklist trước khi vào phòng demo

Làm đúng thứ tự này:

1. Mở sẵn 3 trình duyệt hoặc 3 Chrome profile: User, Guide, Admin.
2. Đăng nhập sẵn Guide và Admin.
3. Kiểm tra tour public có ảnh đẹp.
4. Kiểm tra request demo chưa bị dùng mất.
5. Kiểm tra companion post demo có nội dung rõ ràng.
6. Kiểm tra report admin có thể xử lý.
7. Tắt các tab không cần thiết.
8. Mở sẵn backup video demo.
9. Không chạy migration, không npm install, không refactor.
10. Không bấm quá nhanh khi demo.

---

# 4. Những câu phản biện dễ gặp và câu trả lời mẫu

## Câu 1: Vì sao hệ thống không cho người dùng tham gia tour ngay mà phải chờ guide duyệt?

Trả lời:

> Vì mô hình của hệ thống là kết nối khách du lịch với hướng dẫn viên địa phương. Hướng dẫn viên cần kiểm tra số lượng người, lịch trình, điều kiện tham gia và khả năng tổ chức trước khi xác nhận. Do đó em thiết kế trạng thái request là pending trước, sau đó guide duyệt hoặc từ chối.

---

## Câu 2: Nếu user gọi API trực tiếp thì có vượt quyền được không?

Trả lời:

> Không. Frontend chỉ là lớp hỗ trợ trải nghiệm. Backend vẫn có AuthGuard để kiểm tra token, RoleGuard để kiểm tra vai trò và ownership check để kiểm tra dữ liệu có thuộc quyền của người dùng hay không. Ví dụ user thường không thể gọi API admin, guide không thể sửa tour của guide khác.

---

## Câu 3: Khi user đăng ký mới, hệ thống gán quyền như thế nào?

Trả lời:

> Hệ thống dùng Supabase Auth để tạo tài khoản xác thực. Sau khi có record trong auth.users, database trigger sẽ tự động tạo hồ sơ nghiệp vụ trong bảng users và thêm role USER vào bảng user_roles. Nhờ vậy user mới có thể đăng nhập và sử dụng các chức năng của người dùng thường.

---

## Câu 4: Vì sao không demo thanh toán VNPay?

Trả lời:

> Thanh toán trực tuyến được xếp vào nhóm mở rộng. Trong demo chính, em tập trung vào MVP lõi là gửi yêu cầu tham gia tour và guide duyệt yêu cầu. Với VNPay hoặc webhook thanh toán, môi trường demo local có thể phụ thuộc ngrok/SSL nên em không đưa vào luồng chính để tránh rủi ro kỹ thuật không liên quan đến nghiệp vụ lõi.

---

## Câu 5: Chat, AI có trong hệ thống không?

Trả lời:

> Dạ có định hướng và một số phần đã được xây dựng, nhưng trong phạm vi demo MVP em không đi sâu. Em ưu tiên chứng minh các nghiệp vụ cốt lõi trước: tour, request, guide, companion, report và admin. Chat và AI phù hợp để phát triển tiếp ở giai đoạn mở rộng.

---

## Câu 6: Điểm khác biệt của hệ thống là gì?

Trả lời:

> Hệ thống không chỉ là website xem tour. Điểm chính là kết nối ba nhóm: khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Vì vậy hệ thống có hai trục nghiệp vụ: tham gia tour với guide và tìm bạn đồng hành với người dùng khác.

---

## Câu 7: Admin xử lý vi phạm để làm gì?

Trả lời:

> Vì hệ thống có nội dung do người dùng và hướng dẫn viên tạo ra, nên cần cơ chế báo cáo và kiểm duyệt. Admin có thể xem report, xử lý trạng thái và lưu lịch sử xử lý để tăng tính an toàn và khả năng quản trị.

---

# 5. Nếu demo bị lỗi thì xử lý thế nào?

| Lỗi                  | Cách xử lý                                    |
| -------------------- | --------------------------------------------- |
| Mạng chậm            | Nói “em xin tải lại trang”, thao tác chậm lại |
| Request bị trùng     | Chọn tour khác hoặc user khác                 |
| Đã duyệt mất request | Tạo request mới                               |
| Report đã xử lý mất  | Gửi report mới                                |
| Login lỗi do gõ sai  | Dùng tài khoản demo đã chuẩn bị               |
| UI bị lag            | Không bấm liên tục, chờ toast/loading         |
| VNPay/chat/AI bị hỏi | Nói đây là nhóm mở rộng, không demo sâu       |

---

# 6. Chốt cuối

Từ giờ nên làm 3 việc duy nhất:

1. **Freeze code.**
2. **Luyện demo đúng kịch bản 5 lần.**
3. **Chuẩn bị trả lời phản biện.**

Bạn đang ở trạng thái rất tốt để bảo vệ:

> **MVP lõi đã pass regression test, final smoke test đã pass, UX hardening đã hoàn tất, không còn blocker nghiêm trọng.**
