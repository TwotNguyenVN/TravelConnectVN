|  |  |
| --- | --- |
| ![logo (CMYK)-01](data:image/jpeg;base64...) | BỘ GIÁO DỤC VÀ ĐÀO TẠO  **TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP. HCM** |

**ĐỒ ÁN CƠ SỞ**

**WEBSITE DU LỊCH KẾT NỐI HƯỚNG DẪN VIÊN ĐỊA PHƯƠNG, KHÁCH DU LỊCH VÀ NGƯỜI TÌM BẠN ĐỒNG HÀNH – TRAVELCONNECTVN**

Ngành: **Công Nghệ Thông Tin**

Chuyên ngành: **Công Nghệ Phần Mềm**

Giảng viên hướng dẫn : **ThS. Trương Thị Minh Châu**

Sinh viên thực hiện : Nguyễn Ngọc Tình – 2380614851

Nguyễn Hoàng Tùng – 2380602485

Võ Thành Đông – 2380600518

Lớp: 23DTHD6

TP. Hồ Chí Minh, ngày 03, tháng 05, năm 2026

# LỜI CAM KẾT

Chúng em xin cam kết rằng toàn bộ nội dung trong báo cáo đồ án **“Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành – TravelConnectVN”** là kết quả nghiên cứu, phân tích, thiết kế và triển khai của nhóm dưới sự hướng dẫn của giảng viên phụ trách.

Các nội dung trình bày trong báo cáo, bao gồm cơ sở lý thuyết, phân tích yêu cầu, thiết kế cơ sở dữ liệu, mô tả chức năng, giao diện hệ thống, luồng xử lý nghiệp vụ và kết quả kiểm thử, được xây dựng dựa trên quá trình thực hiện thực tế của nhóm. Những tài liệu, hình ảnh, đoạn mã nguồn, thư viện hoặc công nghệ có tham khảo từ bên ngoài đều được nhóm tìm hiểu, chọn lọc và sử dụng với mục đích học tập, nghiên cứu, đồng thời sẽ được ghi rõ trong phần tài liệu tham khảo nếu có.

Nhóm cam kết không sao chép nguyên văn báo cáo, mã nguồn hoặc sản phẩm của cá nhân, nhóm sinh viên hay tổ chức khác để sử dụng làm kết quả của đồ án. Mọi số liệu, mô hình, giao diện và kết quả trình bày trong báo cáo đều phản ánh đúng quá trình thực hiện của nhóm.

Nếu có bất kỳ sai phạm nào liên quan đến tính trung thực, bản quyền hoặc quy định học thuật của nhà trường, nhóm chúng tôi xin hoàn toàn chịu trách nhiệm trước giảng viên hướng dẫn, khoa và nhà trường.

Nhóm sinh viên thực hiện

Nguyễn Ngọc Tình

Nguyễn Hoàng Tùng

Võ Thành Đông

# LỜI CẢM ƠN

Trong quá trình thực hiện đồ án “Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành – TravelConnectVN”, nhóm chúng tôi đã nhận được nhiều sự quan tâm, hỗ trợ và hướng dẫn tận tình từ quý thầy cô, gia đình và bạn bè.

Trước hết, nhóm chúng tôi xin gửi lời cảm ơn chân thành đến Ban Giám hiệu Nhà trường cùng quý thầy cô Khoa Công nghệ thông tin đã tạo điều kiện học tập, truyền đạt kiến thức chuyên môn và trang bị nền tảng cần thiết để chúng tôi có thể thực hiện đồ án này.

Đặc biệt, nhóm chúng tôi xin bày tỏ lòng biết ơn sâu sắc đến ThS. Trương Thị Minh Châu, giảng viên hướng dẫn đồ án. Cô đã tận tình định hướng, góp ý, hỗ trợ và chỉ dẫn nhóm trong suốt quá trình thực hiện đề tài. Những nhận xét và hướng dẫn của cô là cơ sở quan trọng giúp nhóm hoàn thiện ý tưởng, phân tích hệ thống, thiết kế cơ sở dữ liệu, xây dựng chức năng và trình bày báo cáo một cách rõ ràng hơn.

Nhóm chúng tôi cũng xin cảm ơn gia đình, bạn bè và các anh chị đã động viên, hỗ trợ và đóng góp ý kiến trong quá trình học tập cũng như thực hiện đồ án.

Do thời gian thực hiện và kinh nghiệm của nhóm còn hạn chế, báo cáo và sản phẩm không tránh khỏi những thiếu sót. Nhóm chúng tôi rất mong nhận được sự góp ý của quý thầy cô để có thể tiếp tục hoàn thiện đề tài tốt hơn.

**MỤC LỤC**

[LỜI CAM KẾT i](#_Toc228701312)

[LỜI CẢM ƠN ii](#_Toc228701313)

[KÍ HIỆU, CÁC CHỮ VIẾT TẮT v](#_Toc228701314)

[DANH MỤC HÌNH ẢNH vi](#_Toc228701315)

[CHƯƠNG 1. TỔNG QUAN 1](#_Toc228701316)

[1.1. Tổng quan đề tài 1](#_Toc228701317)

[1.2. Lý do hình thành đề tài và tính cấp thiết 1](#_Toc228701318)

[1.3. Mục tiêu và phương pháp nghiên cứu 2](#_Toc228701319)

[1.4. Đối tượng, phạm vi và cấu trúc đồ án 3](#_Toc228701320)

[CHƯƠNG 2. CƠ SỞ LÝ THUYẾT 5](#_Toc228701321)

[2.1. Tổng quan về hệ thống website du lịch 5](#_Toc228701322)

[2.2. Công nghệ phía Frontend 5](#_Toc228701323)

[2.3. Công nghệ phía Backend 6](#_Toc228701324)

[2.4. Cơ sở dữ liệu 6](#_Toc228701325)

[2.5. Các thư viện và dịch vụ hỗ trợ 7](#_Toc228701326)

[2.6. Kiến trúc và mô hình thiết kế 8](#_Toc228701327)

[2.7. Kết luận chương 9](#_Toc228701328)

[CHƯƠNG 3: PHÂN TÍCH THIẾT KẾ CƠ SỞ DỮ LIỆU, CHI TIẾT CHỨC NĂNG VÀ GIAO DIỆN HỆ THỐNG 10](#_Toc228701329)

[3.1. Phân tích yêu cầu hệ thống 10](#_Toc228701330)

[3.2. Các tác nhân và phân quyền trong hệ thống 11](#_Toc228701331)

[3.3. Phân tích thiết kế cơ sở dữ liệu 18](#_Toc228701332)

[**3.3.1. Nhóm người dùng và phân quyền** 19](#_Toc228701333)

[**3.3.2. Nhóm hồ sơ hướng dẫn viên** 19](#_Toc228701334)

[**3.3.3. Nhóm tour du lịch** 20](#_Toc228701335)

[**3.3.4. Nhóm booking và thanh toán** 21](#_Toc228701336)

[**3.3.5. Nhóm bài tìm bạn đồng hành** 22](#_Toc228701337)

[**3.3.6. Nhóm đánh giá, yêu thích, báo cáo, thông báo và chat** 23](#_Toc228701338)

[3.4. Phân hệ Public/User 24](#_Toc228701339)

[3.5. Phân hệ Hướng dẫn viên 32](#_Toc228701340)

[3.6. Phân hệ Quản trị 38](#_Toc228701341)

[3.7. Phân hệ tương tác và tiện ích mở rộng 44](#_Toc228701342)

[3.8. Luồng xử lý các nghiệp vụ chính 50](#_Toc228701343)

[3.8.1. Luồng đăng ký, đăng nhập và phân quyền 50](#_Toc228701344)

[3.8.2. Luồng tìm kiếm và xem chi tiết tour 52](#_Toc228701345)

[3.8.3. Luồng đặt tour và thanh toán 53](#_Toc228701346)

[3.8.4. Luồng hướng dẫn viên quản lý tour 54](#_Toc228701347)

[3.8.5. Luồng tạo bài và duyệt yêu cầu tham gia bài đồng hành 55](#_Toc228701348)

[3.8.6. Luồng gửi và xử lý báo cáo vi phạm 56](#_Toc228701349)

[3.9. Kiểm thử và đánh giá kết quả thực hiện 57](#_Toc228701350)

[3.10. Kết luận chương 59](#_Toc228701351)

[CHƯƠNG 4: KẾT LUẬN VÀ KIẾN NGHỊ 60](#_Toc228701352)

[4.1. Kết luận 60](#_Toc228701353)

[4.2. Kiến nghị 60](#_Toc228701354)

[4.3. Hướng phát triển 61](#_Toc228701355)

[TÀI LIỆU THAM KHẢO 62](#_Toc228701356)

# KÍ HIỆU, CÁC CHỮ VIẾT TẮT

|  |  |
| --- | --- |
| **Ký hiệu** | **Ý nghĩa đầy đủ** |
| AI | Artificial Intelligence – Trí tuệ nhân tạo |
| API | Application Programming Interface – Giao diện lập trình ứng dụng |
| Auth | Authentication – Xác thực người dùng |
| CRUD | Create, Read, Update, Delete – Thêm, xem, sửa, xóa dữ liệu |
| CSDL | Cơ sở dữ liệu |
| DB | Database – Cơ sở dữ liệu |
| ERD | Entity Relationship Diagram – Sơ đồ quan hệ thực thể |
| Guide | Hướng dẫn viên |
| Guest | Khách truy cập chưa đăng nhập |
| HTTP | HyperText Transfer Protocol – Giao thức truyền tải siêu văn bản |
| JSON | JavaScript Object Notation – Định dạng trao đổi dữ liệu |
| JWT | JSON Web Token – Chuỗi mã hóa dùng trong xác thực |
| Modal | Hộp thoại hiển thị nổi trên giao diện |
| OAuth | Open Authorization – Cơ chế ủy quyền đăng nhập |
| OTP | One-Time Password – Mã xác thực một lần |
| RBAC | Role-Based Access Control – Phân quyền dựa trên vai trò |
| REST API | Representational State Transfer API – API theo kiến trúc REST |
| SEO | Search Engine Optimization – Tối ưu hóa công cụ tìm kiếm |
| SQL | Structured Query Language – Ngôn ngữ truy vấn có cấu trúc |
| Supabase | Nền tảng Backend-as-a-Service sử dụng PostgreSQL |
| UI | User Interface – Giao diện người dùng |
| UML | Unified Modeling Language – Ngôn ngữ mô hình hóa thống nhất |
| UX | User Experience – Trải nghiệm người dùng |
| VNPAY | Cổng thanh toán điện tử VNPAY |
| WebSocket | Giao thức hỗ trợ giao tiếp hai chiều thời gian thực |

# DANH MỤC HÌNH ẢNH

[Hình 3.1: Sơ đồ Use Case tổng quát của hệ thống TravelConnectVN 13](#_Toc228701358)

[Hình 3.2: Sơ đồ Use Case phân hệ Public/User 14](#_Toc228701359)

[Hình 3.3: Sơ đồ Use Case phân hệ Hướng dẫn viên 15](#_Toc228701360)

[Hình 3.4: Sơ đồ Use Case phân hệ Quản trị 16](#_Toc228701361)

[Hình 3.5: Sơ đồ Use Case phân hệ Tương tác và tiện ích mở rộng 17](#_Toc228701362)

[Hình 3.2: Sơ đồ tổng quan cơ sở dữ liệu hệ thống TravelConnectVN 18](#_Toc228701363)

[Hình 3.3: Sơ đồ quan hệ nhóm bảng người dùng và phân quyền 19](#_Toc228701364)

[Hình 3.4: Sơ đồ quan hệ nhóm bảng hồ sơ hướng dẫn viên 20](#_Toc228701365)

[Hình 3.5: Sơ đồ quan hệ nhóm bảng tour du lịch 21](#_Toc228701366)

[Hình 3.6: Sơ đồ quan hệ nhóm bảng booking và thanh toán 22](#_Toc228701367)

[Hình 3.7: Sơ đồ quan hệ nhóm bảng bài tìm bạn đồng hành 23](#_Toc228701368)

[Hình 3.8: Sơ đồ quan hệ nhóm bảng tương tác và quản trị nội dung 24](#_Toc228701369)

[Hình 3.9: Giao diện Trang chủ của hệ thống 25](#_Toc228701370)

[Hình 3.10: Giao diện danh sách tour công khai 26](#_Toc228701371)

[Hình 3.11: Giao diện chi tiết tour 27](#_Toc228701372)

[Hình 3.12: Giao diện hồ sơ hướng dẫn viên công khai 28](#_Toc228701373)

[Hình 3.13: Giao diện danh sách bài tìm bạn đồng hành 29](#_Toc228701374)

[Hình 3.14: Giao diện chi tiết bài tìm bạn đồng hành 30](#_Toc228701375)

[Hình 3.15: Giao diện hồ sơ cá nhân của người dùng 31](#_Toc228701376)

[Hình 3.16: Giao diện dashboard hướng dẫn viên 32](#_Toc228701377)

[Hình 3.17: Giao diện tạo/cập nhật hồ sơ hướng dẫn viên 33](#_Toc228701378)

[Hình 3.18: Giao diện gửi hồ sơ xác minh hướng dẫn viên 34](#_Toc228701379)

[Hình 3.19: Giao diện hướng dẫn viên tạo tour mới 35](#_Toc228701380)

[Hình 3.20: Giao diện danh sách tour của hướng dẫn viên 36](#_Toc228701381)

[Hình 3.21: Giao diện quản lý lịch trình tour 37](#_Toc228701382)

[Hình 3.22: Giao diện quản lý hình ảnh tour 37](#_Toc228701383)

[Hình 3.23: Giao diện danh sách tham gia tour 38](#_Toc228701384)

[Hình 3.24: Giao diện dashboard quản trị hệ thống 39](#_Toc228701385)

[Hình 3.25: Giao diện quản lý tài khoản người dùng 40](#_Toc228701386)

[Hình 3.26: Giao diện quản trị tour 41](#_Toc228701387)

[Hình 3.27: Giao diện quản trị bài tìm bạn đồng hành 41](#_Toc228701388)

[Hình 3.28: Giao diện phê duyệt hồ sơ hướng dẫn viên 42](#_Toc228701389)

[Hình 3.30: Giao diện quản lý đánh giá 43](#_Toc228701390)

[Hình 3.31: Giao diện nhật ký hệ thống 43](#_Toc228701391)

[Hình 3.32: Giao diện chat realtime 44](#_Toc228701392)

[Hình 3.33: Giao diện trợ lý AI 45](#_Toc228701393)

[Hình 3.34: Giao diện đánh giá tour và hướng dẫn viên 46](#_Toc228701394)

[Hình 3.35: Giao diện gửi báo cáo vi phạm 47](#_Toc228701395)

[Hình 3.36: Giao diện kết quả thanh toán VNPAY Sandbox 50](#_Toc228701396)

[Hình 3.37: Luồng xử lý đăng ký, đăng nhập và phân quyền 51](#_Toc228701397)

[Hình 3.38: Luồng xử lý tìm kiếm và xem chi tiết tour 53](#_Toc228701398)

[Hình 3.39: Luồng xử lý đặt tour và thanh toán 54](#_Toc228701399)

[Hình 3.40: Luồng xử lý hướng dẫn viên quản lý tour 55](#_Toc228701400)

[Hình 3.41: Luồng xử lý bài tìm bạn đồng hành 56](#_Toc228701401)

[Hình 3.42: Luồng xử lý báo cáo vi phạm 57](#_Toc228701402)

# CHƯƠNG 1. TỔNG QUAN

## **1.1. Tổng quan đề tài**

Đề tài “Website du lịch kết nối hướng dẫn viên địa phương, khách du lịch và người tìm bạn đồng hành – TravelConnectVN” được xây dựng nhằm tạo ra một nền tảng trực tuyến hỗ trợ người dùng trong việc tìm kiếm tour du lịch, kết nối với hướng dẫn viên địa phương và tìm kiếm bạn đồng hành cho các chuyến đi.

Hệ thống tập trung vào hai hướng kết nối chính. Thứ nhất, khách du lịch có thể tìm kiếm tour, xem chi tiết lịch trình, xem thông tin hướng dẫn viên, đặt tour và đánh giá sau khi tham gia. Thứ hai, người dùng có thể đăng bài tìm bạn đồng hành, gửi yêu cầu tham gia và kết nối với những người có cùng nhu cầu du lịch.

Bên cạnh các chức năng cốt lõi, hệ thống còn hỗ trợ một số tiện ích mở rộng như chat realtime, bản đồ lộ trình tour, thanh toán thử nghiệm, trợ lý AI, thông báo, báo cáo vi phạm và khu vực quản trị hệ thống. Theo tài liệu chức năng đã chốt, TravelConnectVN gồm 29 chức năng nghiệp vụ chính và 50 màn hình thực tế, được tổ chức theo các phân hệ như Public/User, Hướng dẫn viên, Quản trị và nhóm tương tác/modal.

Về mặt kỹ thuật, hệ thống được xây dựng theo mô hình website fullstack, sử dụng ReactJS cho giao diện người dùng, NestJS cho phía backend và PostgreSQL/Supabase cho cơ sở dữ liệu, xác thực và phân quyền.

## **1.2. Lý do hình thành đề tài và tính cấp thiết**

Trong những năm gần đây, nhu cầu du lịch tự túc, du lịch trải nghiệm và du lịch theo nhóm nhỏ ngày càng phát triển. Người dùng không chỉ quan tâm đến việc tìm kiếm tour phù hợp, mà còn mong muốn được kết nối với hướng dẫn viên địa phương am hiểu văn hóa, lịch sử, ẩm thực và đặc trưng của từng vùng miền.

Bên cạnh đó, nhiều người có nhu cầu tìm bạn đồng hành để cùng tham gia chuyến đi, chia sẻ chi phí, tăng tính an toàn và mở rộng trải nghiệm. Tuy nhiên, việc tìm kiếm hướng dẫn viên địa phương hoặc người đi cùng hiện nay thường diễn ra rời rạc trên mạng xã hội, hội nhóm hoặc nhiều nền tảng khác nhau. Điều này gây khó khăn trong việc kiểm chứng thông tin, theo dõi yêu cầu tham gia, quản lý lịch trình và đánh giá chất lượng dịch vụ.

Đối với hướng dẫn viên địa phương, đặc biệt là những cá nhân hoạt động độc lập, việc quảng bá hồ sơ năng lực, đăng tour, quản lý lịch trình và tiếp nhận yêu cầu từ khách du lịch cũng cần một nền tảng hỗ trợ tập trung. Nếu không có hệ thống quản lý phù hợp, quá trình kết nối giữa hướng dẫn viên và khách du lịch sẽ thiếu tính chuyên nghiệp và khó mở rộng.

Xuất phát từ thực tế đó, đề tài **TravelConnectVN** được hình thành nhằm xây dựng một website hỗ trợ kết nối khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành trên cùng một nền tảng. Hệ thống góp phần nâng cao trải nghiệm du lịch, hỗ trợ quản lý thông tin rõ ràng hơn và tạo môi trường tương tác thuận tiện giữa các nhóm người dùng.

## **1.3. Mục tiêu và phương pháp nghiên cứu**

Mục tiêu chính của đề tài là xây dựng một website du lịch có khả năng kết nối ba nhóm đối tượng chính gồm khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Hệ thống cần hỗ trợ người dùng tìm kiếm tour, xem chi tiết tour, đặt tour, tạo bài tìm bạn đồng hành, tương tác trực tuyến và quản lý các hoạt động cá nhân.

Về mặt chức năng, đề tài hướng đến các mục tiêu cụ thể sau:

* Xây dựng chức năng đăng ký, đăng nhập, quản lý tài khoản và phân quyền người dùng.
* Hỗ trợ khách du lịch tìm kiếm tour, xem chi tiết tour, đặt tour, thanh toán thử nghiệm và đánh giá dịch vụ.
* Hỗ trợ hướng dẫn viên quản lý hồ sơ năng lực, tạo tour, quản lý lịch trình, hình ảnh, lịch khởi hành và yêu cầu đặt tour.
* Hỗ trợ người dùng tạo bài tìm bạn đồng hành, gửi yêu cầu tham gia và quản lý thành viên.
* Xây dựng khu vực quản trị để quản lý người dùng, tour, bài đồng hành, báo cáo vi phạm, đánh giá và xác minh hướng dẫn viên.
* Bổ sung một số tiện ích mở rộng như chat realtime, thông báo, bản đồ lộ trình, trợ lý AI và thanh toán VNPAY Sandbox.

Về mặt kỹ thuật, hệ thống được xây dựng theo mô hình **client-server**, tách biệt giữa giao diện người dùng, xử lý nghiệp vụ và cơ sở dữ liệu. Frontend sử dụng ReactJS để xây dựng giao diện, backend sử dụng NestJS để xử lý nghiệp vụ và cung cấp API, cơ sở dữ liệu sử dụng PostgreSQL/Supabase để lưu trữ dữ liệu, xác thực và phân quyền.

Phương pháp nghiên cứu và thực hiện đề tài gồm các bước chính: khảo sát nhu cầu thực tế, phân tích yêu cầu hệ thống, xác định actor và chức năng, thiết kế cơ sở dữ liệu, xây dựng sơ đồ UML, thiết kế giao diện, triển khai frontend/backend, kiểm thử các luồng nghiệp vụ chính và chuẩn bị dữ liệu demo phục vụ bảo vệ đồ án.

## **1.4. Đối tượng, phạm vi và cấu trúc đồ án**

Đối tượng nghiên cứu của đề tài là quy trình xây dựng một website du lịch kết nối nhiều nhóm người dùng, trong đó tập trung vào các nghiệp vụ như tìm kiếm tour, đặt tour, quản lý hướng dẫn viên, tạo bài tìm bạn đồng hành, đánh giá, báo cáo vi phạm và quản trị hệ thống.

Đối tượng sử dụng chính của hệ thống gồm:

* **Khách truy cập:** có thể xem trang chủ, danh sách tour, chi tiết tour, danh sách hướng dẫn viên, bài tìm bạn đồng hành và thực hiện đăng ký hoặc đăng nhập.
* **Người dùng/khách du lịch:** có thể quản lý hồ sơ cá nhân, đặt tour, thanh toán, lưu yêu thích, đánh giá, tạo bài tìm bạn đồng hành, gửi yêu cầu tham gia và báo cáo vi phạm.
* **Hướng dẫn viên:** có thể quản lý hồ sơ năng lực, gửi yêu cầu xác minh, tạo và quản lý tour, lịch trình, hình ảnh, lịch khởi hành và xử lý yêu cầu đặt tour.
* **Quản trị viên:** có thể quản lý người dùng, kiểm duyệt tour, kiểm duyệt bài đồng hành, xử lý báo cáo vi phạm, quản lý đánh giá, xác minh hồ sơ hướng dẫn viên và theo dõi nhật ký hệ thống.

Phạm vi đề tài tập trung vào các chức năng phù hợp với đồ án sinh viên. Các chức năng cốt lõi như tài khoản, phân quyền, quản lý tour, đặt tour, bài tìm bạn đồng hành, đánh giá, báo cáo vi phạm và quản trị hệ thống được ưu tiên triển khai. Các chức năng mở rộng như chat realtime, trợ lý AI, bản đồ, gợi ý cá nhân hóa và thanh toán trực tuyến được triển khai ở mức hỗ trợ hoặc mô phỏng phù hợp với phạm vi đồ án.

Báo cáo đồ án được cấu trúc thành bốn chương chính:

**Chương 1. Tổng quan:** Trình bày tổng quan đề tài, lý do hình thành, mục tiêu, phương pháp nghiên cứu, đối tượng, phạm vi và cấu trúc đồ án.

**Chương 2. Cơ sở lý thuyết và công nghệ sử dụng:** Trình bày tổng quan hệ thống website du lịch, các công nghệ frontend, backend, cơ sở dữ liệu, thư viện hỗ trợ và kiến trúc triển khai.

**Chương 3. Phân tích thiết kế cơ sở dữ liệu, chi tiết chức năng và giao diện hệ thống:** Trình bày phân tích yêu cầu, tác nhân, phân quyền, thiết kế cơ sở dữ liệu, mô tả các phân hệ giao diện, luồng xử lý nghiệp vụ và kết quả kiểm thử.

**Chương 4. Kết luận và kiến nghị:** Tổng kết kết quả đạt được, nêu các hạn chế còn tồn tại, kiến nghị và hướng phát triển trong tương lai.

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT

## **2.1. Tổng quan về hệ thống website du lịch**

TravelConnectVN là hệ thống website du lịch được xây dựng nhằm hỗ trợ kết nối giữa khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Hệ thống không chỉ cung cấp các chức năng cơ bản của một website du lịch như xem danh sách tour, tìm kiếm tour, xem chi tiết lịch trình và đặt tour, mà còn mở rộng thêm các chức năng cộng đồng như đăng bài tìm bạn đồng hành, gửi yêu cầu tham gia, đánh giá, báo cáo vi phạm và trao đổi trực tuyến.

Về mặt nghiệp vụ, hệ thống được chia thành nhiều phân hệ chính gồm: phân hệ công khai dành cho khách truy cập, phân hệ người dùng/khách du lịch, phân hệ hướng dẫn viên và phân hệ quản trị. Mỗi phân hệ có phạm vi chức năng riêng, phù hợp với vai trò của từng nhóm người dùng trong hệ thống.

Về mặt kỹ thuật, TravelConnectVN được xây dựng theo hướng website fullstack, tách biệt giữa giao diện người dùng, xử lý nghiệp vụ và cơ sở dữ liệu. Cách tổ chức này giúp hệ thống dễ phát triển, dễ bảo trì và có khả năng mở rộng thêm các chức năng như chat realtime, trợ lý AI, bản đồ lộ trình và thanh toán trực tuyến.

## **2.2. Công nghệ phía Frontend**

Phía frontend của hệ thống được xây dựng bằng **ReactJS kết hợp TypeScript**. Đây là công nghệ chính dùng để xây dựng giao diện người dùng, tổ chức các màn hình và xử lý thao tác của người dùng trên trình duyệt.

Trong TravelConnectVN, frontend đảm nhiệm việc hiển thị các dữ liệu như tour du lịch, hồ sơ hướng dẫn viên, bài tìm bạn đồng hành, booking, thông báo, đánh giá, chat và các màn hình quản trị. Giao diện được tổ chức theo các khu vực chính gồm **Public Area**, **User Area**, **Guide Area** và **Admin Area**, giúp người dùng dễ dàng truy cập đúng nhóm chức năng theo vai trò.

Các màn hình frontend được xây dựng theo hướng tái sử dụng component để giảm trùng lặp mã nguồn và thuận tiện khi mở rộng. Một số nhóm giao diện quan trọng gồm trang chủ, danh sách tour, chi tiết tour, hồ sơ người dùng, quản lý tour của hướng dẫn viên, quản lý bài đồng hành, dashboard quản trị, chat realtime và trợ lý AI.

Việc sử dụng ReactJS và TypeScript phù hợp với hệ thống vì giúp giao diện linh hoạt, dễ quản lý trạng thái, dễ chia nhỏ thành các thành phần độc lập và phù hợp với website có nhiều màn hình, nhiều vai trò người dùng.

## **2.3. Công nghệ phía Backend**

Phía backend của hệ thống được xây dựng bằng **NestJS kết hợp TypeScript.** Backend giữ vai trò xử lý nghiệp vụ, kiểm tra dữ liệu đầu vào, xác thực người dùng, phân quyền truy cập, kết nối cơ sở dữ liệu và cung cấp API cho frontend.

Các chức năng backend được tổ chức theo từng module nghiệp vụ như tài khoản, người dùng, hướng dẫn viên, tour, booking, bài đồng hành, đánh giá, báo cáo vi phạm, thanh toán, chat, AI và quản trị hệ thống. Cách tổ chức theo module giúp mã nguồn rõ ràng, dễ kiểm soát và thuận tiện khi phát triển thêm chức năng mới.

Backend của hệ thống cung cấp các API chính như đăng ký, đăng nhập, lấy danh sách tour, xem chi tiết tour, tạo tour, đặt tour, thanh toán, tạo bài tìm bạn đồng hành, duyệt yêu cầu, xử lý báo cáo và quản lý dữ liệu trong khu vực quản trị.

Việc sử dụng NestJS phù hợp với đề tài vì framework này hỗ trợ tốt kiến trúc module, dễ xây dựng RESTful API, dễ tích hợp với cơ sở dữ liệu và phù hợp với hệ thống có nhiều phân hệ nghiệp vụ.

## **2.4. Cơ sở dữ liệu**

Cơ sở dữ liệu của hệ thống sử dụng **PostgreSQL trên nền tảng Supabase**. Đây là nơi lưu trữ toàn bộ dữ liệu nghiệp vụ của hệ thống như thông tin người dùng, vai trò, hồ sơ hướng dẫn viên, tour, lịch trình, hình ảnh, booking, thanh toán, bài tìm bạn đồng hành, đánh giá, báo cáo vi phạm, thông báo, chat và nhật ký hoạt động.

Supabase được sử dụng để hỗ trợ quản lý cơ sở dữ liệu, xác thực người dùng và lưu trữ các thông tin liên quan đến phiên đăng nhập. Trong hệ thống, phần xác thực tài khoản được quản lý thông qua **Supabase Auth**, còn dữ liệu nghiệp vụ được lưu trong các bảng thuộc schema public.

Cơ sở dữ liệu được thiết kế theo mô hình quan hệ, trong đó các bảng được liên kết với nhau bằng khóa chính và khóa ngoại. Ví dụ, người dùng liên kết với vai trò thông qua bảng phân quyền, hướng dẫn viên liên kết với tour, tour liên kết với lịch trình và hình ảnh, booking liên kết với người dùng và tour, còn báo cáo vi phạm liên kết với nội dung bị báo cáo và người gửi báo cáo.

Việc sử dụng PostgreSQL/Supabase giúp hệ thống đảm bảo khả năng lưu trữ dữ liệu có cấu trúc, hỗ trợ truy vấn quan hệ, bảo đảm tính toàn vẹn dữ liệu và phù hợp với quy mô của đồ án.

## **2.5. Các thư viện và dịch vụ hỗ trợ**

Ngoài các công nghệ chính, hệ thống còn sử dụng một số thư viện và dịch vụ hỗ trợ để hoàn thiện trải nghiệm người dùng và phục vụ các chức năng mở rộng.

* **Socket.io** được sử dụng cho chức năng chat realtime và thông báo thời gian thực. Nhờ đó, người dùng có thể trao đổi trực tiếp với hướng dẫn viên hoặc các thành viên trong nhóm đồng hành.
* **Leaflet Map** được sử dụng để hiển thị bản đồ lộ trình tour. Chức năng này giúp người dùng xem trực quan các điểm đến, điểm hẹn và thứ tự di chuyển trong chuyến đi.
* **VNPAY Sandbox** được sử dụng để mô phỏng chức năng thanh toán trực tuyến. Trong phạm vi đồ án, môi trường sandbox giúp hệ thống trình diễn được đầy đủ luồng đặt tour và thanh toán mà không phát sinh giao dịch thật.
* **AI Assistant** được tích hợp để hỗ trợ tư vấn du lịch, gợi ý lịch trình và giải đáp một số thắc mắc cơ bản của người dùng. Chức năng này giúp hệ thống tăng tính tương tác và tạo điểm nhấn trong quá trình demo.

Ngoài ra, hệ thống còn sử dụng các thư viện hỗ trợ giao diện, biểu đồ, xử lý form, quản lý trạng thái và gọi API nhằm giúp quá trình phát triển frontend thuận tiện hơn.

## **2.6. Kiến trúc và mô hình thiết kế**

Hệ thống TravelConnectVN được xây dựng theo mô hình **client-server**, trong đó frontend và backend được tách biệt rõ ràng. Frontend chịu trách nhiệm hiển thị giao diện và gửi yêu cầu đến backend. Backend xử lý nghiệp vụ, truy vấn cơ sở dữ liệu và trả kết quả về cho frontend thông qua API.

Ở phía backend, hệ thống được tổ chức theo hướng **module hóa**. Mỗi nhóm nghiệp vụ được tách thành một module riêng như Auth, Users, Guides, Tours, Bookings, Companions, Reports, Payments, Chat, AI và Admin. Cách tổ chức này giúp mã nguồn dễ quản lý, dễ kiểm thử và dễ mở rộng.

Ở phía frontend, hệ thống được chia theo **area-based routing**, gồm Public Area, User Area, Guide Area và Admin Area. Mỗi khu vực có layout, menu và phạm vi chức năng riêng. Cách chia này giúp giao diện rõ ràng, đồng thời hỗ trợ tốt cho việc phân quyền theo vai trò.

Hệ thống cũng áp dụng cơ chế **RBAC** để kiểm soát quyền truy cập. Người dùng được gán vai trò tương ứng như User, Guide, System Admin, Content Moderator hoặc Support Staff. Dựa trên vai trò này, hệ thống quyết định người dùng được phép truy cập màn hình nào và thực hiện thao tác nào.

Nhìn chung, kiến trúc của TravelConnectVN được lựa chọn theo hướng rõ ràng, dễ triển khai trong phạm vi đồ án sinh viên nhưng vẫn đủ khả năng mở rộng cho các chức năng nâng cao trong tương lai.

## **2.7. Kết luận chương**

Chương 2 đã trình bày tổng quan các công nghệ và mô hình được sử dụng để xây dựng hệ thống TravelConnectVN. Hệ thống sử dụng ReactJS cho frontend, NestJS cho backend, PostgreSQL/Supabase cho cơ sở dữ liệu và xác thực, đồng thời tích hợp thêm các công nghệ hỗ trợ như Socket.io, Leaflet Map, VNPAY Sandbox và AI Assistant.

Các công nghệ và mô hình trên tạo nền tảng cho việc triển khai hệ thống theo hướng rõ ràng, dễ bảo trì, phù hợp với phạm vi đồ án và đáp ứng được các chức năng chính của website du lịch kết nối nhiều nhóm người dùng.

# CHƯƠNG 3: PHÂN TÍCH THIẾT KẾ CƠ SỞ DỮ LIỆU, CHI TIẾT CHỨC NĂNG VÀ GIAO DIỆN HỆ THỐNG

## **3.1. Phân tích yêu cầu hệ thống**

Hệ thống **TravelConnectVN** được xây dựng nhằm giải quyết bài toán kết nối giữa khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Đây là một nền tảng du lịch trực tuyến, trong đó người dùng có thể tìm kiếm tour, xem thông tin hướng dẫn viên, đặt tour, đăng bài tìm bạn đồng hành và tương tác với các thành viên khác trong hệ thống.

Về mặt nghiệp vụ, hệ thống tập trung vào hai hướng chính. Hướng thứ nhất là kết nối khách du lịch với hướng dẫn viên địa phương thông qua các tour du lịch. Người dùng có thể xem danh sách tour, tìm kiếm theo nhu cầu, xem chi tiết lịch trình, chọn ngày khởi hành, đặt tour và thanh toán thử nghiệm. Hướng thứ hai là kết nối người dùng với nhau thông qua bài tìm bạn đồng hành. Người dùng có thể tạo bài đăng, mô tả kế hoạch chuyến đi, nhận yêu cầu tham gia và duyệt thành viên phù hợp.

Bên cạnh hai luồng chính trên, hệ thống còn có các chức năng hỗ trợ như quản lý tài khoản, phân quyền người dùng, đánh giá tour và hướng dẫn viên, lưu yêu thích, gửi báo cáo vi phạm, nhận thông báo, chat realtime, trợ lý AI và quản trị hệ thống. Theo tài liệu chức năng đã chốt, hệ thống gồm **29 chức năng nghiệp vụ chính** và **50 màn hình thực tế**, được chia thành các nhóm Public/User, Hướng dẫn viên, Quản trị và nhóm tương tác/modal.

Các yêu cầu chính của hệ thống có thể tóm tắt như sau:

* Hỗ trợ khách truy cập xem các thông tin công khai như tour, hướng dẫn viên và bài tìm bạn đồng hành.
* Hỗ trợ người dùng đăng ký, đăng nhập, quản lý hồ sơ, đặt tour, tạo bài đồng hành, đánh giá và báo cáo vi phạm.
* Hỗ trợ hướng dẫn viên quản lý hồ sơ năng lực, tạo tour, cập nhật lịch trình, hình ảnh, lịch khởi hành và duyệt yêu cầu đặt tour.
* Hỗ trợ quản trị viên quản lý người dùng, kiểm duyệt nội dung, xử lý báo cáo, xác minh hướng dẫn viên và theo dõi hoạt động hệ thống.
* Đảm bảo dữ liệu được tổ chức rõ ràng, có phân quyền và có thể mở rộng thêm các chức năng nâng cao trong tương lai.

## **3.2. Các tác nhân và phân quyền trong hệ thống**

Dựa trên phạm vi chức năng, hệ thống TravelConnectVN gồm các tác nhân chính: khách truy cập, người dùng/khách du lịch, hướng dẫn viên, quản trị viên và các vai trò quản trị mở rộng như nhân sự kiểm duyệt hoặc hỗ trợ.

Khách truy cập là người chưa đăng nhập vào hệ thống. Nhóm này có thể xem trang chủ, danh sách tour, chi tiết tour, danh sách hướng dẫn viên, bài tìm bạn đồng hành và thực hiện đăng ký hoặc đăng nhập tài khoản.

Người dùng/khách du lịch là người đã có tài khoản trong hệ thống. Sau khi đăng nhập, người dùng có thể cập nhật hồ sơ cá nhân, đặt tour, thanh toán, lưu yêu thích, đánh giá, tạo bài tìm bạn đồng hành, gửi yêu cầu tham gia và báo cáo vi phạm.

Hướng dẫn viên là người dùng có vai trò hướng dẫn viên. Nhóm này có thể tạo hồ sơ năng lực, gửi yêu cầu xác minh, đăng tour, quản lý lịch trình, hình ảnh, lịch khởi hành và xử lý yêu cầu đặt tour từ khách du lịch.

Quản trị viên là người có quyền quản lý hệ thống. Quản trị viên có thể xem dashboard thống kê, quản lý người dùng, kiểm duyệt tour, kiểm duyệt bài đồng hành, xử lý báo cáo vi phạm, quản lý đánh giá, xác minh hồ sơ hướng dẫn viên và theo dõi nhật ký hệ thống.

Bảng sau mô tả khái quát quyền sử dụng của từng nhóm tác nhân:

|  |  |
| --- | --- |
| **Tác nhân** | **Quyền sử dụng chính** |
| Khách truy cập | Xem thông tin công khai, tìm kiếm tour, xem bài đồng hành, đăng ký, đăng nhập. |
| Người dùng / Khách du lịch | Quản lý hồ sơ, đặt tour, thanh toán, tạo bài đồng hành, gửi yêu cầu tham gia, đánh giá, yêu thích, báo cáo vi phạm. |
| Hướng dẫn viên | Quản lý hồ sơ hướng dẫn viên, tạo và quản lý tour, lịch trình, hình ảnh, lịch khởi hành, duyệt yêu cầu đặt tour. |
| Quản trị viên | Quản lý người dùng, kiểm duyệt tour, kiểm duyệt bài đồng hành, xử lý báo cáo, quản lý đánh giá, xác minh hướng dẫn viên, xem nhật ký hệ thống. |
| Nhân sự kiểm duyệt / hỗ trợ | Hỗ trợ xử lý nội dung, báo cáo vi phạm và các yêu cầu hỗ trợ theo quyền được cấp. |

Cơ chế phân quyền của hệ thống được xây dựng theo mô hình RBAC. Mỗi tài khoản người dùng được gán một hoặc nhiều vai trò. Dựa trên vai trò đó, hệ thống xác định người dùng được phép truy cập khu vực nào, được xem dữ liệu nào và được thực hiện những thao tác nào. Việc phân quyền giúp hạn chế truy cập sai chức năng, bảo vệ dữ liệu cá nhân và bảo đảm tính an toàn trong quá trình vận hành hệ thống.

Để mô tả chức năng của hệ thống một cách rõ ràng, sơ đồ Use Case được chia thành hai mức. Mức thứ nhất là **sơ đồ Use Case tổng quát**, thể hiện các nhóm chức năng chính và mối liên hệ tổng thể giữa tác nhân với hệ thống. Mức thứ hai là **các sơ đồ Use Case chi tiết theo phân hệ**, giúp làm rõ chức năng cụ thể của từng nhóm người dùng mà không làm sơ đồ tổng quát trở nên quá dài hoặc khó đọc.

Sơ đồ Use Case tổng quát mô tả các tác nhân chính tham gia vào hệ thống và những nhóm chức năng lớn như tài khoản, tour du lịch, bài tìm bạn đồng hành, hướng dẫn viên, tương tác tiện ích và quản trị hệ thống. Sơ đồ này giúp người đọc có cái nhìn tổng quan về phạm vi chức năng của TravelConnectVN trước khi đi vào các sơ đồ chi tiết.

![](data:image/png;base64...)

**Hình 3.1: Sơ đồ Use Case tổng quát của hệ thống TravelConnectVN**

Sơ đồ Use Case phân hệ Public/User mô tả các chức năng dành cho khách truy cập và người dùng/khách du lịch. Các chức năng chính bao gồm đăng ký, đăng nhập, xem danh sách tour, tìm kiếm tour, xem chi tiết tour, đặt tour, thanh toán, quản lý hồ sơ cá nhân, tạo bài tìm bạn đồng hành, gửi yêu cầu tham gia, đánh giá và báo cáo vi phạm.

![](data:image/png;base64...)

**Hình 3.2: Sơ đồ Use Case phân hệ Public/User**

Sơ đồ Use Case phân hệ Hướng dẫn viên mô tả các chức năng dành cho người dùng có vai trò hướng dẫn viên. Các chức năng chính bao gồm quản lý hồ sơ hướng dẫn viên, gửi hồ sơ xác minh, tạo và quản lý tour, cập nhật lịch trình, quản lý hình ảnh, quản lý lịch khởi hành và xử lý yêu cầu đặt tour.

![](data:image/png;base64...)

**Hình 3.3: Sơ đồ Use Case phân hệ Hướng dẫn viên**

Sơ đồ Use Case phân hệ Quản trị mô tả các chức năng dành cho quản trị viên và các vai trò quản trị mở rộng. Các chức năng chính bao gồm quản lý người dùng, phân quyền, kiểm duyệt tour, kiểm duyệt bài tìm bạn đồng hành, xử lý báo cáo vi phạm, quản lý đánh giá, xác minh hồ sơ hướng dẫn viên và xem nhật ký hệ thống.

![](data:image/png;base64...)

**Hình 3.4: Sơ đồ Use Case phân hệ Quản trị**

Sơ đồ Use Case phân hệ Tương tác và tiện ích mở rộng mô tả các chức năng hỗ trợ trải nghiệm người dùng như chat realtime, thông báo, trợ lý AI, gợi ý cá nhân hóa, đánh giá, báo cáo vi phạm và thanh toán thử nghiệm. Đây là các chức năng giúp hệ thống hoàn thiện hơn nhưng có thể được trình bày ở mức hỗ trợ hoặc mở rộng trong phạm vi đồ án.

![](data:image/png;base64...)

**Hình 3.5: Sơ đồ Use Case phân hệ Tương tác và tiện ích mở rộng**

## **3.3. Phân tích thiết kế cơ sở dữ liệu**

Cơ sở dữ liệu của hệ thống TravelConnectVN được thiết kế theo mô hình quan hệ trên nền PostgreSQL/Supabase. Dữ liệu được chia thành nhiều nhóm bảng tương ứng với các phân hệ nghiệp vụ như tài khoản, phân quyền, hướng dẫn viên, tour, booking, bài đồng hành, đánh giá, báo cáo, thông báo, chat, AI và nhật ký hoạt động.

Việc tổ chức dữ liệu theo từng nhóm giúp hệ thống dễ quản lý, dễ mở rộng và đảm bảo tính toàn vẹn giữa các phân hệ. Trong đó, các quan hệ quan trọng như người dùng – vai trò, hướng dẫn viên – tour, tour – lịch trình, tour – booking, bài đồng hành – yêu cầu tham gia, người dùng – đánh giá và báo cáo – lịch sử xử lý được thiết kế thông qua khóa chính và khóa ngoại.

![](data:image/png;base64...)

**Hình 3.2: Sơ đồ tổng quan cơ sở dữ liệu hệ thống TravelConnectVN**

### **3.3.1. Nhóm người dùng và phân quyền**

Nhóm bảng người dùng và phân quyền gồm các bảng chính như users, roles và user\_roles. Bảng users lưu thông tin hồ sơ nghiệp vụ của người dùng như email, họ tên, số điện thoại, ảnh đại diện và trạng thái tài khoản. Bảng roles lưu danh sách vai trò trong hệ thống. Bảng user\_roles liên kết người dùng với vai trò, cho phép hệ thống xác định quyền truy cập của từng tài khoản.

Nhóm bảng này là nền tảng cho toàn bộ hệ thống vì mọi chức năng như đặt tour, tạo bài đồng hành, quản lý tour hoặc quản trị hệ thống đều cần xác định người dùng đang đăng nhập và vai trò của người dùng đó.

![](data:image/png;base64...)

**Hình 3.3: Sơ đồ quan hệ nhóm bảng người dùng và phân quyền**

### **3.3.2. Nhóm hồ sơ hướng dẫn viên**

Nhóm hồ sơ hướng dẫn viên bao gồm các bảng như guide\_profiles, guide\_languages, guide\_skills, languages, skills và các bảng liên quan đến xác minh hướng dẫn viên. Bảng guide\_profiles lưu thông tin nghề nghiệp của hướng dẫn viên như mô tả bản thân, số năm kinh nghiệm, khu vực hoạt động, ảnh đại diện, trạng thái xác minh và trạng thái hiển thị.

Các bảng kỹ năng và ngôn ngữ giúp hồ sơ hướng dẫn viên thể hiện rõ năng lực hơn, từ đó hỗ trợ khách du lịch có thêm thông tin tham khảo trước khi lựa chọn tour hoặc hướng dẫn viên.

![](data:image/png;base64...)

**Hình 3.4: Sơ đồ quan hệ nhóm bảng hồ sơ hướng dẫn viên**

### **3.3.3. Nhóm tour du lịch**

Nhóm tour du lịch là nhóm dữ liệu trọng tâm của hệ thống, bao gồm các bảng như tours, tour\_categories, tour\_images, tour\_locations, tour\_schedules và các bảng liên quan đến lịch trình. Bảng tours lưu thông tin chính của tour như tên tour, địa điểm, thời gian, giá, số lượng người tối đa, điểm hẹn, mô tả và trạng thái tour.

Các bảng phụ như hình ảnh, địa điểm, lịch trình và lịch khởi hành giúp tour có đầy đủ dữ liệu để hiển thị chi tiết cho khách du lịch. Đây là nhóm bảng thể hiện rõ trục kết nối giữa hướng dẫn viên và khách du lịch.

![](data:image/png;base64...)

**Hình 3.5: Sơ đồ quan hệ nhóm bảng tour du lịch**

### **3.3.4. Nhóm booking và thanh toán**

Nhóm booking và thanh toán gồm các bảng lưu thông tin đặt tour và giao dịch thanh toán. Bảng booking lưu dữ liệu người đặt, tour được đặt, ngày khởi hành, số lượng khách, ghi chú và trạng thái booking. Bảng thanh toán lưu thông tin số tiền, phương thức thanh toán, trạng thái giao dịch và mã giao dịch từ cổng thanh toán.

Nhóm bảng này giúp hệ thống quản lý quá trình từ khi người dùng gửi yêu cầu đặt tour đến khi hoàn tất thanh toán. Trong phạm vi đồ án, thanh toán được triển khai ở môi trường VNPAY Sandbox để phục vụ demo và kiểm thử.

![](data:image/png;base64...)

**Hình 3.6: Sơ đồ quan hệ nhóm bảng booking và thanh toán**

### **3.3.5. Nhóm bài tìm bạn đồng hành**

Nhóm bài tìm bạn đồng hành gồm các bảng như companion\_posts và companion\_requests. Bảng companion\_posts lưu thông tin bài đăng như tiêu đề, điểm đến, thời gian dự kiến, số lượng thành viên, chi phí dự kiến và mô tả chuyến đi. Bảng companion\_requests lưu yêu cầu tham gia bài đồng hành, bao gồm người gửi yêu cầu, bài đăng liên quan và trạng thái xử lý.

Nhóm bảng này giúp hệ thống thể hiện chức năng kết nối cộng đồng, cho phép người dùng không chỉ tham gia tour mà còn có thể tìm kiếm người đi cùng chuyến đi.

![](data:image/png;base64...)

**Hình 3.7: Sơ đồ quan hệ nhóm bảng bài tìm bạn đồng hành**

### **3.3.6. Nhóm đánh giá, yêu thích, báo cáo, thông báo và chat**

Nhóm dữ liệu tương tác bao gồm các bảng lưu đánh giá tour, đánh giá hướng dẫn viên, danh sách yêu thích, báo cáo vi phạm, lịch sử xử lý báo cáo, thông báo, cuộc trò chuyện và tin nhắn. Các bảng này giúp tăng tính tương tác giữa người dùng và hỗ trợ quản trị viên kiểm soát nội dung trên hệ thống.

Đánh giá và yêu thích giúp người dùng có thêm cơ sở tham khảo khi lựa chọn tour hoặc hướng dẫn viên. Báo cáo vi phạm giúp phát hiện nội dung không phù hợp. Thông báo và chat giúp tăng khả năng trao đổi trực tiếp giữa các bên trong hệ thống.

![](data:image/png;base64...)

**Hình 3.8: Sơ đồ quan hệ nhóm bảng tương tác và quản trị nội dung**

## **3.4. Phân hệ Public/User**

Phân hệ Public/User là khu vực dành cho khách truy cập và người dùng đã đăng nhập. Đây là phân hệ có vai trò quan trọng vì là nơi người dùng tiếp cận đầu tiên với hệ thống, đồng thời thực hiện các thao tác chính như tìm kiếm tour, xem chi tiết tour, đặt tour, tạo bài tìm bạn đồng hành và quản lý thông tin cá nhân.

Trước tiên, hệ thống xây dựng màn hình **Trang chủ**. Trang chủ đóng vai trò giới thiệu tổng quan về nền tảng du lịch kết nối khách du lịch, hướng dẫn viên địa phương và người tìm bạn đồng hành. Giao diện trang chủ được thiết kế theo hướng trực quan, thân thiện với chủ đề du lịch. Các thành phần chính gồm banner giới thiệu, thanh tìm kiếm nhanh, tour nổi bật, hướng dẫn viên tiêu biểu, bài tìm bạn đồng hành mới và các nút điều hướng đến những chức năng quan trọng.

![](data:image/png;base64...)

**Hình 3.9: Giao diện Trang chủ của hệ thống**

Tiếp theo, màn hình **Danh sách tour** cho phép người dùng xem các tour đang được công khai trên hệ thống. Mỗi tour được hiển thị dưới dạng thẻ thông tin gồm hình ảnh, tên tour, địa điểm, thời gian, mức giá và nút xem chi tiết. Người dùng có thể sử dụng bộ lọc để tìm kiếm tour theo địa điểm, thời gian, chi phí hoặc loại tour. Chức năng này giúp người dùng nhanh chóng thu hẹp danh sách tour theo nhu cầu thực tế.

![](data:image/png;base64...)

**Hình 3.10: Giao diện danh sách tour công khai**

Khi người dùng chọn một tour cụ thể, hệ thống hiển thị màn hình **Chi tiết tour**. Trang này bao gồm đầy đủ thông tin về tour như hình ảnh, mô tả, lịch trình, điểm hẹn, ngày khởi hành, giá, số lượng người tối đa, thông tin hướng dẫn viên, đánh giá và bản đồ lộ trình. Người dùng đã đăng nhập có thể lưu yêu thích, gửi báo cáo vi phạm, chọn lịch khởi hành và thực hiện đặt tour.

![](data:image/png;base64...)

**Hình 3.11: Giao diện chi tiết tour**

Ngoài tour, hệ thống còn cung cấp màn hình **Danh sách hướng dẫn viên** và **Chi tiết hướng dẫn viên**. Tại đây, người dùng có thể xem thông tin hồ sơ, kinh nghiệm, khu vực hoạt động, kỹ năng, ngôn ngữ, đánh giá và danh sách tour liên quan của hướng dẫn viên. Đây là cơ sở để khách du lịch đánh giá mức độ phù hợp của hướng dẫn viên trước khi quyết định tham gia tour.

![](data:image/png;base64...)

**Hình 3.12: Giao diện hồ sơ hướng dẫn viên công khai**

Phân hệ Public/User cũng bao gồm chức năng **bài tìm bạn đồng hành**. Người dùng có thể xem danh sách bài đồng hành, xem chi tiết bài đăng, gửi yêu cầu tham gia hoặc tự tạo bài đăng mới. Bài đăng thường gồm thông tin về điểm đến, thời gian dự kiến, số lượng thành viên, chi phí dự trù và mô tả chuyến đi.

![](data:image/png;base64...)

**Hình 3.13: Giao diện danh sách bài tìm bạn đồng hành**

![](data:image/png;base64...)

**Hình 3.14: Giao diện chi tiết bài tìm bạn đồng hành**

Sau khi đăng nhập, người dùng có thể truy cập **hồ sơ cá nhân** để cập nhật thông tin như họ tên, số điện thoại, ảnh đại diện và các thông tin liên hệ. Ngoài ra, người dùng có thể quản lý booking, xem danh sách tour/hướng dẫn viên yêu thích, nhận thông báo và theo dõi nhật ký hoạt động cá nhân.

![](data:image/png;base64...)

**Hình 3.15: Giao diện hồ sơ cá nhân của người dùng**

Nhìn chung, phân hệ Public/User giúp người dùng thực hiện hầu hết các thao tác quan trọng của hệ thống, từ tìm kiếm thông tin, đặt tour, tạo bài đồng hành đến quản lý hoạt động cá nhân.

## **3.5. Phân hệ Hướng dẫn viên**

Phân hệ Hướng dẫn viên là khu vực dành cho người dùng có vai trò hướng dẫn viên. Đây là phân hệ hỗ trợ hướng dẫn viên xây dựng hồ sơ năng lực, đăng tải tour, quản lý thông tin tour và xử lý yêu cầu từ khách du lịch.

Màn hình **Dashboard hướng dẫn viên** cung cấp cái nhìn tổng quan về hoạt động của hướng dẫn viên trên hệ thống. Tại đây, hướng dẫn viên có thể theo dõi số lượng tour đã tạo, số booking, yêu cầu đang chờ xử lý, lịch khởi hành và trạng thái xác minh hồ sơ.

![](data:image/png;base64...)

**Hình 3.16: Giao diện dashboard hướng dẫn viên**

Màn hình **Hồ sơ hướng dẫn viên** cho phép hướng dẫn viên tạo và cập nhật thông tin nghề nghiệp như khu vực hoạt động, số năm kinh nghiệm, mô tả bản thân, kỹ năng nổi bật, ngôn ngữ hỗ trợ và ảnh đại diện. Hồ sơ này được sử dụng để hiển thị công khai cho khách du lịch tham khảo.

![](data:image/png;base64...)

**Hình 3.17: Giao diện tạo/cập nhật hồ sơ hướng dẫn viên**

Bên cạnh đó, hệ thống có chức năng **xác minh hồ sơ hướng dẫn viên**. Hướng dẫn viên có thể gửi thông tin hoặc tài liệu xác minh để quản trị viên kiểm duyệt. Chức năng này giúp tăng độ tin cậy cho hồ sơ hướng dẫn viên và hỗ trợ khách du lịch lựa chọn dịch vụ an toàn hơn.

![](data:image/png;base64...)

**Hình 3.18: Giao diện gửi hồ sơ xác minh hướng dẫn viên**

Chức năng quan trọng nhất của phân hệ này là **quản lý tour**. Hướng dẫn viên có thể tạo tour mới bằng cách nhập các thông tin như tên tour, mô tả, địa điểm tham quan, thời gian, số lượng người tối đa, chi phí, hình ảnh minh họa và trạng thái tour. Khi lưu dữ liệu, hệ thống kiểm tra các điều kiện cơ bản như ngày kết thúc không nhỏ hơn ngày bắt đầu, chi phí không âm và số lượng người tối đa phải lớn hơn 0.

![](data:image/png;base64...)

**Hình 3.19: Giao diện hướng dẫn viên tạo tour mới**

Sau khi tạo tour, hướng dẫn viên có thể xem danh sách các tour do mình quản lý. Mỗi tour hiển thị thông tin tóm tắt như tên tour, địa điểm, thời gian, chi phí, trạng thái và các nút thao tác như xem chi tiết, chỉnh sửa hoặc xóa. Chức năng này giúp hướng dẫn viên chủ động quản lý các tour đã đăng.

![](data:image/png;base64...)

**Hình 3.20: Giao diện danh sách tour của hướng dẫn viên**

Ngoài thông tin chung, hệ thống còn hỗ trợ quản lý lịch trình, địa điểm, hình ảnh và lịch khởi hành của tour. Hướng dẫn viên có thể nhập các điểm đến theo thứ tự, thêm ghi chú cho từng điểm, upload hình ảnh minh họa và tạo nhiều ngày khởi hành khác nhau cho cùng một tour.

![](data:image/png;base64...)

**Hình 3.21: Giao diện quản lý lịch trình tour**

![](data:image/png;base64...)

**Hình 3.22: Giao diện quản lý hình ảnh tour**

Khi có khách du lịch đặt tour, hướng dẫn viên có thể xem danh sách trong màn hình quản lý. Mỗi yêu cầu hiển thị thông tin người gửi, số lượng người đăng ký, ghi chú và trạng thái xử lý. Sau khi xử lý, hệ thống cập nhật trạng thái để người dùng theo dõi.

![](data:image/png;base64...)

**Hình 3.23: Giao diện danh sách tham gia tour**

Phân hệ Hướng dẫn viên giúp hoàn thiện luồng kết nối giữa khách du lịch và người tổ chức tour. Đây là một trong những phân hệ quan trọng nhất của hệ thống vì trực tiếp phục vụ mục tiêu kết nối khách du lịch với hướng dẫn viên địa phương.

## **3.6. Phân hệ Quản trị**

Phân hệ Quản trị là khu vực dành cho quản trị viên và nhân sự quản trị hệ thống. Phân hệ này có nhiệm vụ kiểm soát dữ liệu, quản lý người dùng, kiểm duyệt nội dung và đảm bảo hệ thống vận hành ổn định.

Màn hình **Dashboard quản trị** cung cấp thông tin tổng quan về hoạt động của hệ thống như số lượng người dùng, số lượng hướng dẫn viên, số lượng tour, số booking, số bài tìm bạn đồng hành, đánh giá và báo cáo vi phạm. Các thông tin này giúp quản trị viên nhanh chóng nắm bắt tình hình vận hành của hệ thống.

![](data:image/png;base64...)

**Hình 3.24: Giao diện dashboard quản trị hệ thống**

Màn hình **Quản lý người dùng** cho phép quản trị viên xem danh sách tài khoản trong hệ thống, kiểm tra thông tin cá nhân, vai trò và trạng thái hoạt động. Trong trường hợp cần thiết, quản trị viên có thể khóa hoặc mở tài khoản để đảm bảo an toàn cho hệ thống.

![](data:image/png;base64...)

**Hình 3.25: Giao diện quản lý tài khoản người dùng**

Đối với dữ liệu tour, quản trị viên có thể xem danh sách toàn bộ tour trong hệ thống, kiểm tra trạng thái hiển thị và xử lý các tour có nội dung không phù hợp. Chức năng này giúp kiểm soát chất lượng nội dung công khai, hạn chế thông tin sai lệch hoặc vi phạm quy định.

![](data:image/png;base64...)

**Hình 3.26: Giao diện quản trị tour**

Tương tự, quản trị viên có thể quản lý các bài tìm bạn đồng hành do người dùng đăng. Nếu bài đăng có nội dung không phù hợp, quản trị viên có thể ẩn hoặc xử lý theo quy định của hệ thống. Điều này giúp duy trì môi trường kết nối lành mạnh và an toàn cho người dùng.

![](data:image/png;base64...)

**Hình 3.27: Giao diện quản trị bài tìm bạn đồng hành**

Phân hệ quản trị cũng hỗ trợ **phê duyệt hồ sơ hướng dẫn viên**. Quản trị viên xem thông tin hồ sơ, tài liệu xác minh và quyết định phê duyệt hoặc từ chối. Kết quả xử lý được cập nhật vào trạng thái xác minh của hướng dẫn viên.

![](data:image/png;base64...)

**Hình 3.28: Giao diện phê duyệt hồ sơ hướng dẫn viên**

Đối với **báo cáo vi phạm**, quản trị viên có thể xem danh sách báo cáo, kiểm tra nội dung bị báo cáo, đưa ra kết quả xử lý và lưu lại lịch sử xử lý. Đây là chức năng quan trọng giúp hệ thống kiểm soát các nội dung không phù hợp.

![](data:image/png;base64...)

**Hình 3.29: Giao diện xử lý báo cáo vi phạm**

Ngoài ra, quản trị viên có thể quản lý đánh giá và theo dõi nhật ký hoạt động hệ thống. Nhật ký hoạt động giúp ghi nhận các thao tác quan trọng, hỗ trợ quá trình kiểm tra và quản trị dữ liệu.

![](data:image/png;base64...)

**Hình 3.30: Giao diện quản lý đánh giá**

![](data:image/png;base64...)

**Hình 3.31: Giao diện nhật ký hệ thống**

Nhìn chung, phân hệ Quản trị giúp hệ thống có khả năng kiểm soát dữ liệu, xử lý nội dung và theo dõi hoạt động một cách tập trung.

## **3.7. Phân hệ tương tác và tiện ích mở rộng**

Bên cạnh các phân hệ chính, TravelConnectVN còn tích hợp một số chức năng tương tác và tiện ích mở rộng nhằm nâng cao trải nghiệm người dùng.

Chức năng **chat realtime** cho phép người dùng trao đổi trực tiếp với hướng dẫn viên hoặc các thành viên trong nhóm đồng hành. Chức năng này giúp việc trao đổi thông tin trước chuyến đi trở nên thuận tiện hơn.

![](data:image/png;base64...)

**Hình 3.32: Giao diện chat realtime**

Chức năng **trợ lý AI** hỗ trợ người dùng đặt câu hỏi liên quan đến du lịch, gợi ý lịch trình, tư vấn điểm đến và giải đáp một số thắc mắc cơ bản. Trong phạm vi đồ án, chức năng AI được triển khai ở mức hỗ trợ trải nghiệm và tạo điểm nhấn khi demo.

![](data:image/png;base64...)

**Hình 3.33: Giao diện trợ lý AI**

Chức năng **đánh giá** cho phép người dùng chấm điểm và nhận xét về tour hoặc hướng dẫn viên. Các đánh giá này giúp tăng tính minh bạch và hỗ trợ người dùng khác có thêm thông tin tham khảo trước khi lựa chọn tour.

![](data:image/png;base64...)

**Hình 3.34: Giao diện đánh giá tour và hướng dẫn viên**

Chức năng **báo cáo vi phạm** cho phép người dùng phản ánh các nội dung không phù hợp như tour sai thông tin, bài đồng hành vi phạm hoặc đánh giá không đúng quy định. Báo cáo sau khi gửi sẽ được chuyển đến khu vực quản trị để xử lý.

![](data:image/png;base64...)

**Hình 3.35: Giao diện gửi báo cáo vi phạm**

Chức năng **thanh toán VNPAY Sandbox** hỗ trợ mô phỏng quá trình thanh toán trực tuyến cho booking. Người dùng có thể chọn hình thức thanh toán, hệ thống tạo liên kết thanh toán và cập nhật kết quả sau khi giao dịch hoàn tất trong môi trường thử nghiệm.

![](data:image/png;base64...)

**Hình 3.36: Giao diện kết quả thanh toán VNPAY Sandbox**

Ngoài ra, hệ thống còn hỗ trợ lọc tour, chọn lịch khởi hành bằng lịch trực quan, thông báo realtime và cơ chế AuthGuard/RoleGuard để bảo vệ các màn hình theo quyền truy cập. Những chức năng này giúp hệ thống hoàn chỉnh hơn và nâng cao chất lượng trải nghiệm người dùng.

## **3.8. Luồng xử lý các nghiệp vụ chính**

Để đảm bảo hệ thống vận hành ổn định và có thể trình diễn rõ ràng trong quá trình bảo vệ, các nghiệp vụ chính được mô tả thành những luồng xử lý cụ thể. Các luồng này thể hiện sự tương tác giữa người dùng, giao diện, backend và cơ sở dữ liệu.

### 3.8.1. Luồng đăng ký, đăng nhập và phân quyền

Luồng này bắt đầu khi khách truy cập thực hiện đăng ký tài khoản. Người dùng nhập thông tin cần thiết như họ tên, email và mật khẩu. Hệ thống kiểm tra dữ liệu đầu vào, tạo tài khoản xác thực và hồ sơ người dùng tương ứng.

Sau khi có tài khoản, người dùng đăng nhập vào hệ thống. Backend xác thực thông tin, lấy danh sách vai trò của người dùng và trả về dữ liệu phiên đăng nhập cho frontend. Dựa vào vai trò, hệ thống điều hướng người dùng đến khu vực phù hợp. Người dùng thường được chuyển đến User Area, hướng dẫn viên được chuyển đến Guide Area, còn quản trị viên được chuyển đến Admin Area.

Cơ chế này giúp hệ thống kiểm soát quyền truy cập ngay từ bước đầu và bảo đảm mỗi người dùng chỉ nhìn thấy các chức năng phù hợp với vai trò của mình.

![](data:image/png;base64...)

**Hình 3.37: Luồng xử lý đăng ký, đăng nhập và phân quyền**

### 3.8.2. Luồng tìm kiếm và xem chi tiết tour

Người dùng truy cập màn hình danh sách tour công khai. Tại đây, người dùng có thể nhập từ khóa hoặc chọn các bộ lọc như địa điểm, thời gian, mức giá và loại tour. Hệ thống gửi yêu cầu tìm kiếm đến backend, backend truy vấn dữ liệu và trả về danh sách tour phù hợp.

Khi người dùng chọn một tour cụ thể, hệ thống hiển thị trang chi tiết tour. Trang này lấy dữ liệu từ nhiều nhóm bảng khác nhau như thông tin tour, hình ảnh, lịch trình, lịch khởi hành, hướng dẫn viên, đánh giá và bản đồ lộ trình. Nhờ đó, người dùng có đầy đủ thông tin trước khi quyết định đặt tour.

![](data:image/png;base64...)

**Hình 3.38: Luồng xử lý tìm kiếm và xem chi tiết tour**

### 3.8.3. Luồng đặt tour và thanh toán

Sau khi xem chi tiết tour, người dùng chọn ngày khởi hành và nhập số lượng khách tham gia. Hệ thống kiểm tra trạng thái tour, lịch khởi hành và số lượng chỗ còn lại. Nếu thông tin hợp lệ, backend tạo booking và lưu trạng thái ban đầu.

Sau khi booking được tạo, người dùng có thể lựa chọn thanh toán qua VNPAY Sandbox. Hệ thống tạo liên kết thanh toán và chuyển người dùng sang cổng thanh toán thử nghiệm. Khi giao dịch hoàn tất, VNPAY trả kết quả về hệ thống, backend cập nhật trạng thái giao dịch và trạng thái booking.

Luồng này giúp hệ thống mô phỏng đầy đủ quá trình từ chọn tour, đặt tour đến thanh toán, phù hợp để trình diễn trong phạm vi đồ án.

![](data:image/png;base64...)

**Hình 3.39: Luồng xử lý đặt tour và thanh toán**

### 3.8.4. Luồng hướng dẫn viên quản lý tour

Hướng dẫn viên đăng nhập vào Guide Area và truy cập màn hình quản lý tour. Tại đây, hướng dẫn viên có thể tạo tour mới, nhập thông tin cơ bản, thêm hình ảnh, xây dựng lịch trình và tạo lịch khởi hành.

Sau khi tour được tạo, hướng dẫn viên có thể chỉnh sửa, cập nhật trạng thái hoặc tạm ngừng hiển thị tour. Khi có người dùng gửi yêu cầu đặt tour, hướng dẫn viên truy cập danh sách yêu cầu, xem thông tin người đăng ký và thực hiện thao tác duyệt hoặc từ chối.

Luồng này thể hiện vai trò chủ động của hướng dẫn viên trong hệ thống, đồng thời tạo sự kết nối trực tiếp giữa hướng dẫn viên và khách du lịch.

![](data:image/png;base64...)

**Hình 3.40: Luồng xử lý hướng dẫn viên quản lý tour**

### 3.8.5. Luồng tạo bài và duyệt yêu cầu tham gia bài đồng hành

Người dùng đăng nhập vào hệ thống và tạo bài tìm bạn đồng hành. Người dùng nhập các thông tin như tiêu đề, điểm đến, thời gian dự kiến, số lượng thành viên, chi phí dự kiến và mô tả chuyến đi. Sau khi gửi biểu mẫu, hệ thống kiểm tra dữ liệu và lưu bài đăng.

Bài đăng sau khi tạo được hiển thị công khai trong danh sách bài tìm bạn đồng hành. Người dùng khác có thể xem chi tiết bài viết và gửi yêu cầu tham gia. Chủ bài đăng có thể xem danh sách yêu cầu, sau đó duyệt hoặc từ chối từng yêu cầu.

Luồng này giúp hệ thống thể hiện rõ giá trị cộng đồng, tạo điều kiện để người dùng kết nối với nhau thông qua nhu cầu du lịch chung.

![](data:image/png;base64...)

**Hình 3.41: Luồng xử lý bài tìm bạn đồng hành**

### 3.8.6. Luồng gửi và xử lý báo cáo vi phạm

Khi phát hiện nội dung không phù hợp, người dùng có thể gửi báo cáo vi phạm đối với tour, bài tìm bạn đồng hành, đánh giá hoặc tài khoản. Báo cáo được lưu vào hệ thống ở trạng thái chờ xử lý.

Quản trị viên đăng nhập vào Admin Area, truy cập danh sách báo cáo và xem chi tiết từng báo cáo. Sau khi kiểm tra nội dung, quản trị viên cập nhật kết quả xử lý như giữ nguyên, ẩn nội dung, cảnh báo người dùng hoặc khóa tài khoản tùy theo mức độ vi phạm. Lịch sử xử lý được lưu lại để phục vụ việc theo dõi sau này.

Luồng này giúp hệ thống đảm bảo tính an toàn, minh bạch và kiểm soát nội dung công khai trên nền tảng.

![](data:image/png;base64...)

**Hình 3.42: Luồng xử lý báo cáo vi phạm**

## **3.9. Kiểm thử và đánh giá kết quả thực hiện**

Sau khi triển khai các chức năng chính, hệ thống được kiểm thử theo các luồng nghiệp vụ quan trọng. Mục tiêu của kiểm thử là đảm bảo các chức năng hoạt động đúng, dữ liệu được lưu trữ chính xác, trạng thái được cập nhật hợp lệ và phân quyền được áp dụng đúng theo vai trò.

Bảng sau trình bày kết quả kiểm thử một số chức năng chính:

| **STT** | **Chức năng kiểm thử** | **Kết quả** |
| --- | --- | --- |
| 1 | Đăng ký/đăng nhập | Đạt |
| 2 | Phân quyền theo vai trò | Đạt |
| 3 | Tìm kiếm và lọc tour | Đạt |
| 4 | Xem chi tiết tour | Đạt |
| 5 | Đặt tour | Đạt |
| 6 | Thanh toán VNPAY Sandbox | Đạt ở mức thử nghiệm |
| 7 | Hướng dẫn viên tạo và quản lý tour | Đạt |
| 8 | Tạo bài tìm bạn đồng hành | Đạt |
| 9 | Duyệt yêu cầu tham gia | Đạt |
| 10 | Đánh giá tour/hướng dẫn viên | Đạt |
| 11 | Gửi và xử lý báo cáo vi phạm | Đạt |
| 12 | Chat realtime | Đạt ở mức cơ bản |
| 13 | Trợ lý AI | Đạt ở mức hỗ trợ tư vấn cơ bản |
| 14 | Quản trị người dùng và nội dung | Đạt |

Qua kiểm thử, hệ thống cơ bản đáp ứng được các yêu cầu chức năng đã đặt ra. Các luồng nghiệp vụ chính như đăng nhập, tìm kiếm tour, đặt tour, thanh toán thử nghiệm, tạo bài tìm bạn đồng hành, duyệt yêu cầu và xử lý báo cáo đều có thể thao tác và demo được.

Tuy nhiên, một số chức năng mở rộng như chat realtime, trợ lý AI và thanh toán trực tuyến mới được triển khai ở mức phù hợp với phạm vi đồ án. Các chức năng này có thể tiếp tục được hoàn thiện nếu hệ thống được phát triển ở quy mô thực tế.

## **3.10. Kết luận chương**

Chương 3 đã trình bày toàn bộ nội dung phân tích và thiết kế chính của hệ thống TravelConnectVN, bao gồm phân tích yêu cầu, tác nhân và phân quyền, thiết kế cơ sở dữ liệu, mô tả các phân hệ giao diện, luồng xử lý nghiệp vụ và kết quả kiểm thử.

Thông qua việc phân tích các phân hệ Public/User, Hướng dẫn viên, Quản trị và nhóm tương tác mở rộng, chương này đã làm rõ cách hệ thống vận hành theo từng nhóm người dùng. Các luồng xử lý nghiệp vụ như đăng nhập, tìm kiếm tour, đặt tour, quản lý tour, tạo bài đồng hành và xử lý báo cáo cho thấy hệ thống đã đáp ứng được hai mục tiêu cốt lõi: kết nối khách du lịch với hướng dẫn viên địa phương và kết nối người dùng với nhau thông qua bài tìm bạn đồng hành.

Nhìn chung, các nội dung trong chương này là cơ sở quan trọng để đánh giá kết quả thực hiện đồ án, đồng thời làm nền tảng cho phần kết luận, kiến nghị và hướng phát triển ở chương tiếp theo.

# CHƯƠNG 4: KẾT LUẬN VÀ KIẾN NGHỊ

## **4.1. Kết luận**

Sau quá trình nghiên cứu, phân tích và triển khai thực tế, đồ án "Xây dựng Website cửa hàng máy tính và linh kiện công nghệ - PowerTech" đã hoàn thành các mục tiêu đề ra ban đầu. Những kết quả chính đạt được bao gồm:

* **Về mặt kỹ thuật:** Xây dựng thành công hệ thống trên nền tảng ASP.NET Core MVC kết hợp với Entity Framework Core và SQL Server. Hệ thống đảm bảo tính tách biệt giữa các lớp dữ liệu, logic xử lý và giao diện người dùng.
* **Giải pháp dữ liệu đặc thù:** Hiện thực hóa thành công mô hình Entity-Attribute-Value (EAV) giúp quản lý hàng ngàn thông số kỹ thuật động của linh kiện máy tính mà không cần thay đổi cấu trúc cơ sở dữ liệu vật lý.
* **Quản trị và bảo mật:** Triển khai cơ chế phân quyền dựa trên vai trò (RBAC) thông qua ASP.NET Core Identity, hỗ trợ 7 vai trò tương tác trong 6 phân khu chức năng riêng biệt.
* **Nghiệp vụ thực tiễn:** Hoàn thiện luồng nghiệp vụ khép kín từ đặt hàng trực tuyến, thanh toán, quản lý kho khoa học đến hệ thống hỗ trợ khách hàng (Ticket) và đánh giá sản phẩm.

Mặc dù đạt được những kết quả khả quan, hệ thống vẫn còn một số hạn chế nhất định như tốc độ truy vấn đối với dữ liệu EAV cực lớn cần được tối ưu hóa sâu hơn và giao diện cần tiếp tục tinh chỉnh để tăng tính thẩm mỹ cho người dùng cuối.

## **4.2. Kiến nghị**

Để hệ thống PowerTech có thể vận hành ổn định và hiệu quả hơn trong môi trường thực tế, nhóm thực hiện xin đưa ra các kiến nghị sau:

* Cần trang bị hạ tầng máy chủ mạnh mẽ để đáp ứng khả năng xử lý hàng ngàn yêu cầu đồng thời trong các giai đoạn cao điểm của thương mại điện tử.
* Tăng cường các lớp bảo mật nâng cao và chứng chỉ SSL để đảm bảo an toàn tuyệt đối cho các giao dịch tài chính trực tuyến của khách hàng.

## **4.3. Hướng phát triển**

Trong tương lai, hệ thống có thể được mở rộng theo các hướng sau:

* **Tích hợp Trí tuệ nhân tạo (AI):** Áp dụng các thuật toán phân lớp như One-Rule (OneR) hay Multiple Rule (RIPPER) để phân tích hành vi mua sắm, từ đó tự động hóa việc gợi ý sản phẩm phù hợp cho từng phân khúc khách hàng.
* **Ứng dụng di động:** Phát triển thêm phiên bản Mobile App (Android/iOS) đồng bộ dữ liệu với Website để nâng cao trải nghiệm mua sắm linh hoạt.
* **Mở rộng thanh toán:** Tích hợp thêm các cổng thanh toán điện tử phổ biến tại Việt Nam như Momo, VNPay và Zalopay để đa dạng hóa lựa chọn cho người dùng.

# TÀI LIỆU THAM KHẢO

[1] Leaflet. Leaflet API Reference. [https://leafletjs.com/reference.html](https://leafletjs.com/reference.html?utm_source=chatgpt.com)

[2] Meta Open Source. React Documentation. [https://react.dev/](https://react.dev/?utm_source=chatgpt.com)

[3] Microsoft. TypeScript Documentation. [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/?utm_source=chatgpt.com)

[4] NestJS. NestJS Documentation. [https://docs.nestjs.com/](https://docs.nestjs.com/?utm_source=chatgpt.com)

[5] Object Management Group. Unified Modeling Language Specification Version 2.5.1. [https://www.omg.org/spec/UML/2.5.1/About-UML/](https://www.omg.org/spec/UML/2.5.1/About-UML/?utm_source=chatgpt.com)

[6] PlantUML. PlantUML Web Server and Documentation. [https://www.plantuml.com/](https://www.plantuml.com/?utm_source=chatgpt.com)

[7] PostgreSQL Global Development Group. PostgreSQL Documentation. [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/?utm_source=chatgpt.com)

[8] Socket.IO. Socket.IO Documentation. [https://socket.io/docs/v4](https://socket.io/docs/v4?utm_source=chatgpt.com)

[9] Supabase. Supabase Documentation. [https://supabase.com/docs](https://supabase.com/docs?utm_source=chatgpt.com)

[10] Tailwind Labs. Tailwind CSS Documentation. [https://tailwindcss.com/docs](https://tailwindcss.com/docs?utm_source=chatgpt.com)

[11] Vite. Vite Documentation. [https://vite.dev/guide/](https://vite.dev/guide/?utm_source=chatgpt.com)

[12] VNPAY. Tài liệu kết nối Cổng thanh toán VNPAY Sandbox. [https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html?utm_source=chatgpt.com)

[13] MDN Web Docs. HTTP request methods. <https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods>

[14] MDN Web Docs. Cross-Origin Resource Sharing. <https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS>

[15] OWASP Foundation. Role Based Access Control. <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>