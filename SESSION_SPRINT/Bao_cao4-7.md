**3. Mô tả chi tiết các chức năng của hệ thống**

**3.1. Chức năng quản lý tài khoản**
Hệ thống cung cấp cơ chế bảo mật và quản lý định danh người dùng một cách chặt chẽ thông qua chức năng đăng ký, đăng nhập và quản lý tài khoản. Người dùng mới có thể tạo tài khoản bằng cách cung cấp các thông tin cơ bản bao gồm họ tên, địa chỉ email, mật khẩu bảo mật và lựa chọn loại tài khoản mong muốn. Ngoài ra, hệ thống cũng hỗ trợ đăng nhập nhanh thông qua các nhà cung cấp dịch vụ thứ ba (như Google) để tăng tính tiện lợi.

Sau khi xác thực thành công, người dùng được cấp quyền truy cập vào trang quản lý hồ sơ cá nhân. Tại đây, họ có thể dễ dàng cập nhật các thông tin liên hệ, thay đổi ảnh đại diện (avatar), đổi mật khẩu định kỳ để đảm bảo an toàn thông tin. Chức năng này đóng vai trò là nền tảng cốt lõi của toàn bộ hệ thống, bởi mọi thao tác mang tính tương tác như đăng tải tour, tạo bài viết tìm bạn đồng hành, gửi yêu cầu tham gia hay các tác vụ quản trị đều yêu cầu hệ thống phải xác định rõ danh tính và quyền hạn của người dùng thao tác.

[Chèn hình 1: Giao diện Đăng nhập / Đăng ký của hệ thống. Gợi ý ảnh: Ảnh chụp màn hình form đăng nhập với các trường email, mật khẩu và nút đăng nhập bằng Google.]

[Chèn hình 2: Giao diện Quản lý hồ sơ cá nhân. Gợi ý ảnh: Ảnh chụp trang thông tin cá nhân (Profile) hiển thị ảnh đại diện, họ tên, email, số điện thoại và form đổi mật khẩu.]

**3.2. Chức năng quản lý hồ sơ hướng dẫn viên**
Nhằm đảm bảo chất lượng và độ tin cậy cho các chuyến đi, hệ thống cung cấp phân hệ quản lý hồ sơ chuyên biệt dành cho Hướng dẫn viên. Người dùng sau khi đăng ký có thể cập nhật vai trò và gửi yêu cầu xác thực để trở thành hướng dẫn viên chính thức.

Một hồ sơ hướng dẫn viên hoàn chỉnh sẽ bao gồm: ảnh đại diện chuyên nghiệp, họ tên, khu vực hoạt động chính, số năm kinh nghiệm thực tế, đoạn văn tự giới thiệu (bio) chi tiết về bản thân, danh sách các kỹ năng đặc thù (ngôn ngữ, sơ cứu, nhiếp ảnh,...) và lịch sử các tour đã từng dẫn dắt. Hồ sơ này không chỉ là công cụ để hướng dẫn viên xây dựng thương hiệu cá nhân mà còn là cơ sở dữ liệu quan trọng giúp khách du lịch có cái nhìn tổng quan, từ đó đánh giá mức độ phù hợp và an tâm trước khi quyết định đặt tour.

[Chèn hình 3: Giao diện hiển thị Hồ sơ hướng dẫn viên (Góc nhìn của khách). Gợi ý ảnh: Ảnh chụp trang chi tiết hướng dẫn viên hiển thị ảnh đại diện, số năm kinh nghiệm, bio, các kỹ năng và danh sách tour của người đó.]

[Chèn hình 4: Giao diện cập nhật thông tin Hướng dẫn viên (Góc nhìn của HDV). Gợi ý ảnh: Ảnh chụp trang Dashboard của HDV, phần chỉnh sửa thông tin kỹ năng, kinh nghiệm và khu vực hoạt động.]

**3.3. Chức năng đăng tải và quản lý tour**
Đây là chức năng trọng tâm dành cho đối tượng Hướng dẫn viên, cho phép họ chủ động thiết kế và thương mại hóa các sản phẩm du lịch của mình. Thông qua một giao diện tạo tour trực quan (multi-step form), hướng dẫn viên có thể thiết lập đầy đủ các thông tin quan trọng bao gồm: tên tour, mô tả tổng quan, địa điểm tham quan cụ thể, lịch trình chi tiết từng ngày, thời gian khởi hành và kết thúc, giới hạn số lượng thành viên, mức chi phí dự kiến, cũng như tải lên thư viện hình ảnh minh họa sinh động.

Sau khi tour được tạo, hướng dẫn viên có toàn quyền quản lý vòng đời của tour thông qua các trạng thái: Bản nháp (Draft), Đang mở (Published), Đã đóng (Closed), và Đã hoàn tất (Completed). Tại bảng điều khiển, hướng dẫn viên có thể dễ dàng theo dõi số lượng khách đã tham gia, chỉnh sửa nội dung hoặc xóa các tour không còn hoạt động.

[Chèn hình 5: Giao diện Quản lý danh sách tour của Hướng dẫn viên. Gợi ý ảnh: Ảnh chụp trang "Tour của tôi" với các thẻ tour, hiển thị trạng thái (Đang mở, Bản nháp, Đã hoàn tất) và số lượng khách đăng ký.]

[Chèn hình 6: Giao diện Form thiết lập và tạo Tour mới. Gợi ý ảnh: Ảnh chụp màn hình giao diện tạo tour với bố cục 3 cột, hiển thị các bước nhập liệu (thông tin cơ bản, địa điểm, lịch trình) và bảng điều khiển trạng thái (Thiết lập bài đăng).]

**3.4. Chức năng tìm kiếm và xem chi tiết tour**
Để hỗ trợ khách du lịch tiếp cận với các sản phẩm du lịch một cách nhanh chóng, hệ thống cung cấp công cụ tìm kiếm và lọc tour linh hoạt. Người dùng có thể tra cứu các chuyến đi dựa trên nhiều tiêu chí như: địa điểm đến, khoảng thời gian khởi hành, mức chi phí cho phép, và phân loại hình thức tour (nghỉ dưỡng, khám phá, mạo hiểm,...).

Khi nhấp vào một tour cụ thể, hệ thống sẽ điều hướng đến trang Chi tiết tour. Tại đây, toàn bộ thông tin được trình bày một cách khoa học: từ hình ảnh banner, chi phí, mô tả tổng quan, lịch trình theo từng ngày, bản đồ lộ trình, cho đến thông tin chi tiết về hướng dẫn viên tổ chức và các đánh giá từ những người dùng trước. Trải nghiệm xem chi tiết tour được thiết kế nhằm cung cấp đầy đủ dữ kiện nhất, giúp người dùng tự tin đưa ra quyết định gửi yêu cầu tham gia.

[Chèn hình 7: Giao diện Trang chủ / Tìm kiếm tour. Gợi ý ảnh: Ảnh chụp trang chủ hoặc trang danh sách tour với thanh công cụ tìm kiếm, bộ lọc (giá, địa điểm) và lưới hiển thị các tour nổi bật.]

[Chèn hình 8: Giao diện Chi tiết một tour cụ thể. Gợi ý ảnh: Ảnh chụp trang chi tiết tour hiển thị ảnh cover lớn, thông tin lịch trình (itinerary), khung thông tin của HDV và nút "Gửi yêu cầu tham gia".]

**3.5. Chức năng đăng bài tìm bạn đồng hành**
Khác biệt với các hệ thống OTA truyền thống, TravelConnectVN tích hợp tính năng mạng xã hội thông qua chức năng tìm bạn đồng hành. Người dùng (không cần là hướng dẫn viên) có thể tự do khởi tạo các bài đăng tìm kiếm những người có chung sở thích xê dịch.

Một bài đăng tìm bạn đồng hành sẽ bao gồm: điểm đến mong muốn, khoảng thời gian dự kiến, số lượng thành viên cần tìm, chi phí dự trù chia sẻ, mô tả chi tiết về phong cách chuyến đi và các yêu cầu/lưu ý đặc biệt đối với người tham gia (ví dụ: yêu cầu biết lái xe máy, không hút thuốc,...). Chức năng này góp phần xây dựng một cộng đồng du lịch gắn kết, hỗ trợ những du khách độc hành tìm được những người bạn đồng hành đáng tin cậy.

[Chèn hình 9: Giao diện Danh sách bài tìm bạn đồng hành. Gợi ý ảnh: Ảnh chụp trang cộng đồng hiển thị các bài đăng tìm bạn đồng hành dưới dạng các thẻ (cards) thông tin tóm tắt.]

[Chèn hình 10: Giao diện Đăng bài và Chi tiết bài tìm bạn đồng hành. Gợi ý ảnh: Ảnh chụp form điền thông tin chuyến đi (điểm đến, chi phí, yêu cầu) và màn hình hiển thị chi tiết của bài đăng đó.]

**3.6. Chức năng gửi yêu cầu tham gia**
Khi người dùng tìm thấy một tour hoặc một chuyến đi đồng hành ưng ý, họ có thể thao tác gửi yêu cầu tham gia trực tiếp trên hệ thống. Yêu cầu này sẽ đi kèm với số lượng người tham gia dự kiến và ghi chú (nếu có), sau đó được chuyển trực tiếp đến hệ thống quản lý của người tổ chức (Hướng dẫn viên hoặc Người đăng bài).

Người tổ chức sẽ nhận được thông báo, có thể xem xét hồ sơ của người gửi yêu cầu để tiến hành phê duyệt (Approve) hoặc từ chối (Reject). Trong phạm vi của đồ án cơ sở, nhóm tập trung hoàn thiện luồng gửi và phê duyệt yêu cầu ở mức quản lý trạng thái cơ bản (Chờ duyệt, Đã duyệt, Đã thanh toán) để hỗ trợ quá trình kết nối thực tế mà chưa đi sâu vào tích hợp các cổng thanh toán điện tử phức tạp.

[Chèn hình 11: Giao diện Modal Gửi yêu cầu tham gia tour. Gợi ý ảnh: Ảnh chụp cửa sổ popup khi người dùng bấm "Tham gia", yêu cầu nhập số lượng người và lời nhắn cho HDV.]

[Chèn hình 12: Giao diện Quản lý yêu cầu (dành cho người tổ chức). Gợi ý ảnh: Ảnh chụp bảng danh sách các yêu cầu tham gia đang chờ duyệt, hiển thị tên người gửi, trạng thái và các nút Duyệt/Từ chối.]

**3.7. Chức năng đánh giá và bình luận**
Sau khi trải nghiệm hoàn tất một tour du lịch, hệ thống cho phép người dùng để lại phản hồi thông qua chức năng đánh giá và bình luận. Người dùng có thể chấm điểm theo thang sao (rating từ 1 đến 5) và viết bình luận chi tiết về chất lượng dịch vụ của tour cũng như thái độ, chuyên môn của hướng dẫn viên.

Những đánh giá này sẽ được hiển thị công khai trên trang chi tiết tour và hồ sơ của hướng dẫn viên. Điều này không chỉ giúp gia tăng tính minh bạch, uy tín cho nền tảng mà còn là nguồn tham khảo đắt giá cho những du khách khác trong việc đưa ra quyết định.

[Chèn hình 13: Giao diện Khu vực Đánh giá và Bình luận. Gợi ý ảnh: Ảnh chụp phần cuối của trang chi tiết tour, hiển thị điểm số trung bình (sao) và danh sách các bình luận của những khách hàng đã đi tour.]

**3.8. Chức năng hiển thị lộ trình trên bản đồ**
Nhằm tăng cường trải nghiệm trực quan, hệ thống được tích hợp API bản đồ (Mapbox/OpenStreetMap) để hiển thị bản đồ tương tác ngay trên nền tảng. Chức năng này được áp dụng chủ yếu ở trang chi tiết tour. Dựa trên dữ liệu tọa độ (latitude, longitude) của các điểm đến mà hướng dẫn viên đã thiết lập trong lịch trình, hệ thống sẽ vẽ các điểm đánh dấu (markers) và nối tuyến lộ trình.

Nhờ đó, người dùng có thể dễ dàng hình dung được quãng đường di chuyển, vị trí địa lý của các danh lam thắng cảnh trong tour, giúp họ lập kế hoạch cá nhân một cách tốt hơn.

[Chèn hình 14: Giao diện Hiển thị Lộ trình Bản đồ. Gợi ý ảnh: Ảnh chụp phân đoạn bản đồ tương tác trên trang chi tiết tour, hiển thị các ghim vị trí điểm hẹn và các điểm tham quan.]

**3.9. Chức năng quản trị hệ thống**
Để hệ thống vận hành một cách trơn tru và an toàn, phân hệ Quản trị hệ thống (Admin Dashboard) được xây dựng dành riêng cho Quản trị viên (Admin). Tại đây, Admin được cung cấp các công cụ thống kê và quản lý toàn diện đối với dữ liệu của nền tảng.

Các chức năng quản trị bao gồm: quản lý tài khoản người dùng (khóa/mở khóa tài khoản), duyệt yêu cầu xác minh hồ sơ của hướng dẫn viên (kiểm tra giấy tờ, thẻ HDV), theo dõi và quản lý danh sách tour, cũng như kiểm duyệt các bài đăng tìm bạn đồng hành và bình luận. Nếu phát hiện các nội dung vi phạm tiêu chuẩn cộng đồng hoặc có dấu hiệu lừa đảo, Admin có quyền gỡ bỏ hoặc ẩn bài đăng, đảm bảo một môi trường kết nối du lịch lành mạnh.

[Chèn hình 15: Giao diện Bảng điều khiển Quản trị viên (Admin Dashboard). Gợi ý ảnh: Ảnh chụp trang tổng quan của Admin hiển thị các biểu đồ thống kê, số lượng người dùng, tour, doanh thu...]

[Chèn hình 16: Giao diện Quản lý và Duyệt hồ sơ Hướng dẫn viên. Gợi ý ảnh: Ảnh chụp bảng danh sách các yêu cầu xác minh HDV đang chờ duyệt, hiển thị nút xem chi tiết giấy tờ chứng minh.]

---

**4. Mô tả chi tiết chức năng của từng người dùng trong hệ thống**

Hệ thống được thiết kế với cơ chế phân quyền rõ ràng, định nghĩa 3 vai trò (role) chính, mỗi vai trò sẽ có các giới hạn và phạm vi sử dụng chức năng khác nhau:

**4.1. Người dùng / Khách du lịch (User / Traveler)**
Đây là đối tượng người dùng phổ thông, truy cập vào hệ thống với mục đích tìm kiếm chuyến đi, kết nối với hướng dẫn viên hoặc những người du lịch khác. Khách du lịch có quyền truy cập vào các chức năng:
- Đăng ký tài khoản và đăng nhập vào hệ thống.
- Xem, chỉnh sửa và cập nhật thông tin hồ sơ cá nhân.
- Tìm kiếm tour theo các bộ lọc và xem chi tiết thông tin tour, lộ trình trên bản đồ.
- Tra cứu và xem hồ sơ năng lực của các hướng dẫn viên địa phương.
- Gửi yêu cầu tham gia tour (Booking) đến hướng dẫn viên.
- Chủ động tạo bài đăng tìm bạn đồng hành và gửi yêu cầu tham gia vào các bài đăng của người khác.
- Để lại đánh giá (rating) và bình luận sau khi kết thúc chuyến đi.

[Chèn hình 17: Giao diện Trang chủ ở góc nhìn Khách du lịch. Gợi ý ảnh: Trang chủ hiển thị các gợi ý tour nổi bật, các HDV tiêu biểu, tập trung vào trải nghiệm khám phá và đặt tour.]

**4.2. Hướng dẫn viên (Guide)**
Hướng dẫn viên là những người cung cấp dịch vụ du lịch (Service Provider). Họ đóng vai trò là nguồn cung cấp nội dung chính yếu (tour) cho nền tảng. Ngoài việc sở hữu tất cả các quyền hạn của một Khách du lịch thông thường, Hướng dẫn viên được cấp thêm các quyền đặc thù:
- Nộp hồ sơ và yêu cầu xác thực định danh nghề nghiệp.
- Khởi tạo và thiết kế các tour du lịch mới (nhập lịch trình, giá cả, hình ảnh).
- Quản lý danh sách các tour do mình tổ chức (Chỉnh sửa thông tin, thay đổi trạng thái đóng/mở/lưu nháp).
- Quản lý danh sách khách hàng: Xem, phê duyệt hoặc từ chối các yêu cầu tham gia tour từ người dùng.
- Tương tác với hệ thống đánh giá: Theo dõi phản hồi từ khách hàng để cải thiện chất lượng dịch vụ.

[Chèn hình 18: Giao diện Bảng điều khiển Hướng dẫn viên (Guide Dashboard). Gợi ý ảnh: Màn hình tổng quan của HDV, hiển thị các nút tắt tạo tour, số lượng yêu cầu mới và thống kê tour đang chạy.]

**4.3. Quản trị viên (Admin)**
Quản trị viên là nhân sự vận hành hệ thống, chịu trách nhiệm cao nhất về mặt dữ liệu, tính minh bạch và an toàn của nền tảng. Quản trị viên sử dụng một giao diện Admin riêng biệt với các chức năng:
- **Quản lý người dùng**: Xem danh sách toàn bộ thành viên, phân quyền hoặc thực hiện các biện pháp kỷ luật (cảnh cáo, khóa tài khoản) đối với người dùng vi phạm.
- **Quản lý hướng dẫn viên**: Xét duyệt các hồ sơ đăng ký trở thành hướng dẫn viên dựa trên tài liệu chứng minh được cung cấp.
- **Kiểm duyệt nội dung**: Giám sát hệ thống các tour du lịch, bài viết tìm bạn đồng hành, bình luận và đánh giá. Có quyền ẩn hoặc xóa các nội dung rác, sai sự thật.
- **Thống kê và báo cáo**: Xem các báo cáo tổng quan về lưu lượng truy cập, số lượng tour được đặt, tỷ lệ chuyển đổi, nhằm đưa ra các định hướng phát triển cho hệ thống.

[Chèn hình 19: Giao diện Quản lý người dùng của Admin. Gợi ý ảnh: Ảnh chụp bảng dữ liệu danh sách người dùng trong hệ thống với các công cụ phân quyền, bộ lọc và khóa tài khoản.]
