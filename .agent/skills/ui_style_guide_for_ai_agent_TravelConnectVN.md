# ui_style_guide_for_ai_agent_TravelConnectVN.md

> Mục tiêu: Tài liệu này dùng để buộc mọi màn hình của **TravelConnectVN** thống nhất về phong cách giao diện theo hướng **nền tảng du lịch hiện đại, đáng tin cậy, giàu khả năng tìm kiếm và ra quyết định nhanh**, lấy cảm hứng từ:
>
> - Vietravel / travel.com.vn
> - iVIVU
> - Booking.com
> - Agoda
> - Traveloka
> - Skyscanner
>
> Đây là **style guide định hướng thiết kế**, không phải tài liệu sao chép nguyên bản giao diện thương hiệu khác.  
> Agent phải **học ngôn ngữ thiết kế và pattern UX** từ các website tham chiếu, nhưng **không được bê nguyên branding, logo, màu nhận diện độc quyền hoặc layout giống hệt từng trang**.

---

# 1. Tinh thần thiết kế tổng thể

TravelConnectVN phải có cảm giác của một **travel platform hiện đại** chứ không phải website bán hàng thông thường hay dashboard khô cứng.

Giao diện phải kết hợp được 4 phẩm chất cùng lúc:

1. **Khả năng khám phá như website du lịch lớn**
2. **Khả năng tìm kiếm và so sánh nhanh như OTA**
3. **Độ tin cậy và rõ ràng như nền tảng đặt dịch vụ**
4. **Đủ nhẹ và đồng bộ để triển khai được trong phạm vi đồ án sinh viên**

Ngôn ngữ thiết kế cần nghiêng về:

- sáng
- sạch
- hiện đại
- thân thiện
- tối ưu cho quyết định nhanh
- thông tin rõ
- CTA rõ
- card và filter mạnh
- trust signal rõ

---

# 2. Các website tham chiếu và bài học phải rút ra

## 2.1. travel.com.vn / Vietravel

Từ travel.com.vn có thể thấy mô hình:

- có hotline/tổng đài nổi bật;
- có điều hướng theo điểm đến, du lịch trong nước, du lịch nước ngoài, dòng tour và tra cứu booking;
- có nhấn mạnh dịch vụ lẻ như vé máy bay, khách sạn, combo.

=> Bài học cho TravelConnectVN:

- Header phải có **khả năng điều hướng nhanh theo nhu cầu du lịch**
- Phải có **trust signal kiểu hotline / hỗ trợ / trợ giúp**
- Phải có cảm giác là nền tảng du lịch dành cho người Việt, không quá “quốc tế lạnh lùng”
- Các mục như **tour trong nước / tour nước ngoài / chủ đề tour / dịch vụ liên quan** nên được phản ánh bằng navigation, chips, tabs hoặc mega menu gọn.

## 2.2. iVIVU

Từ iVIVU có thể thấy:

- top nav chia sản phẩm rõ: khách sạn, tours, vé máy bay, vé vui chơi, vé tàu;
- hero section nhấn mạnh trải nghiệm kỳ nghỉ;
- có search ngay trên hero;
- có các section kiểu “combo tốt nhất hôm nay”, “phong cách du lịch”, “điểm đến yêu thích”.

=> Bài học cho TravelConnectVN:

- Homepage phải có **hero + search rõ**
- Phải tổ chức nội dung thành các section dễ quét như:
  - tour nổi bật
  - hướng dẫn viên nổi bật
  - bài đồng hành mới
  - điểm đến phổ biến
  - chủ đề du lịch
- Giao diện public phải có cảm giác “đi chơi / nghỉ dưỡng / lựa chọn” chứ không chỉ là danh sách CRUD.

## 2.3. Booking.com

Booking.com tự mô tả là nơi giúp người dùng tiết kiệm cho nhà, khách sạn, chuyến bay, xe thuê, taxi và điểm tham quan, đồng thời xây dựng chuyến đi phù hợp với mọi ngân sách.

=> Bài học cho TravelConnectVN:

- Thiết kế phải rất **rõ CTA**
- Search module phải là thành phần mạnh, nổi bật, dễ thao tác
- Thông tin giá, trạng thái, đánh giá, lợi ích đặt chỗ phải **ra quyết định nhanh**
- Card danh sách phải ưu tiên:
  - ảnh
  - tiêu đề
  - vị trí
  - rating
  - giá
  - CTA
- Tone màu nên có **xanh đậm đáng tin** làm màu trục

## 2.4. Agoda

Agoda nhấn mạnh:

- Hotels, Homes & Apts, Flight + Hotel, Flights, Activities, Airport transfer;
- free cancellation;
- best price guarantee;
- trusted reviews;
- safe & secure;
- giao diện có ô search rất trung tâm và nhiều khối destination / promotion.

=> Bài học cho TravelConnectVN:

- Phải có **trust badges / policy labels** rõ ở các điểm quan trọng
- Các thẻ tour/guide nên có **micro-copy hỗ trợ quyết định** như:
  - xác minh
  - đánh giá tốt
  - số lượt review
  - linh hoạt hủy / liên hệ guide / phản hồi nhanh
- Search/filter card nên có cảm giác **centerpiece** như OTA
- Public UI nên trắng, sáng, thoáng, card rõ, bo góc mềm, shadow nhẹ

## 2.5. Traveloka

Traveloka nhấn mạnh:

- deals, app, travel guides, bookings;
- danh mục dịch vụ lớn như hotels, flights, airport transfer, car rental, things to do;
- hero có product tabs;
- coupon/promotion block rõ;
- top flights, top hotel deals, top things to do;
- thông điệp “one place for all your needs”, flexible booking, secure & convenient payment.

=> Bài học cho TravelConnectVN:

- Public homepage nên có **product switch / tabs / chips rõ**
- Cấu trúc section nên kiểu:
  - tìm kiếm
  - ưu đãi / nổi bật
  - top destinations
  - top tours
  - top guides
  - bài đồng hành mới
- Cần có cảm giác “một nền tảng du lịch đủ đầy” nhưng vẫn giữ phạm vi đồ án
- Các block nên rất **modular** để dễ tái sử dụng cho từng area

## 2.6. Skyscanner

Skyscanner tự mô tả là công cụ tìm kiếm vé máy bay, xe cho thuê và khách sạn, quét nhiều hãng và nhà cung cấp để người dùng so sánh chi phí ở một nơi; đồng thời có price alert và luồng khám phá “Everywhere”.

=> Bài học cho TravelConnectVN:

- Giao diện phải hỗ trợ **so sánh nhanh**
- Search form phải rất rõ luồng nhập
- Bộ lọc và thông tin hỗ trợ ra quyết định phải mạnh
- Có thể dùng các pattern kiểu:
  - filter sticky
  - chips
  - sort bar
  - compare-like list density
- Với tour và guide list, phải ưu tiên “scanability” hơn là quá nghệ thuật

---

# 3. Kết luận phong cách tham chiếu

TravelConnectVN phải là sự kết hợp có kiểm soát của 6 dòng cảm hứng sau:

- **Vietravel:** bản sắc du lịch Việt Nam, hotline, điều hướng theo loại tour
- **iVIVU:** hero đẹp, section phong cách du lịch, destination-driven
- **Booking.com:** search mạnh, giá/rating/CTA rất rõ
- **Agoda:** card sáng, trust badges, khối ưu đãi và destination lớn
- **Traveloka:** product tabs, coupon/promo modules, modular homepage
- **Skyscanner:** filter, so sánh nhanh, search-first UX

Không được sao chép nguyên UI của bất kỳ bên nào.  
Phải tạo ra một design system **riêng cho TravelConnectVN**.

---

# 4. Nguyên tắc thiết kế bắt buộc

Agent phải luôn bám 8 nguyên tắc sau:

1. **Search-first**
   - Ở Public Area, khả năng tìm kiếm phải được ưu tiên như trung tâm của trải nghiệm.

2. **Decision-first**
   - Mọi card tour, guide, companion post phải giúp người dùng ra quyết định nhanh.

3. **Trust-first**
   - Hotline, trạng thái xác minh, rating, số review, trạng thái xử lý, policy, hỗ trợ phải rõ.

4. **Section-based homepage**
   - Trang chủ phải chia thành section rõ như các OTA, không làm thành một trang cuộn thiếu cấu trúc.

5. **High information clarity**
   - Không làm đẹp theo kiểu hy sinh tính đọc.

6. **Travel mood but controlled**
   - Có cảm giác du lịch, khám phá, dịch chuyển; nhưng không biến thành landing page quảng cáo quá đà.

7. **System consistency**
   - Card, button, input, filter, table, status badge, empty state phải đi theo 1 hệ thống.

8. **Desktop-first, mobile-safe**
   - Ưu tiên desktop như các nền tảng du lịch lớn, nhưng vẫn responsive nghiêm túc.

---

# 5. Tone thương hiệu phải đạt

## 5.1. Cảm xúc cần có

- đáng tin
- hiện đại
- chuyên nghiệp
- sáng
- thân thiện
- khám phá
- ra quyết định nhanh
- có cảm giác dịch vụ thật

## 5.2. Điều tuyệt đối tránh

- retail-tech
- ecommerce bán linh kiện
- fintech dark dashboard
- glassmorphism nặng
- neon/cyber
- quá nhiều gradient
- animation vô nghĩa
- quá nhiều minh họa hoạt hình
- travel poster style quá sến

---

# 6. Hệ màu chuẩn mới

## 6.1. Mục tiêu màu sắc

Phải gần hơn với ngôn ngữ:

- xanh tin cậy như Booking / Traveloka / Skyscanner
- trắng sáng thoáng như Agoda
- có xanh ngọc nhẹ cho cảm giác dịch vụ, hỗ trợ và du lịch
- có cam ấm cho điểm nhấn giá / deal / CTA phụ

## 6.2. Token màu chính thức

```css
--color-primary: #0a6ada;
--color-primary-hover: #0858b8;
--color-primary-soft: #eaf3ff;

--color-secondary: #11b5ae;
--color-secondary-hover: #0d9791;
--color-secondary-soft: #e8fbfa;

--color-accent: #ff8c42;
--color-accent-hover: #f2741f;
--color-accent-soft: #fff1e7;

--color-trust: #0f766e;
--color-trust-soft: #ecfdf5;

--color-text: #10233e;
--color-text-secondary: #475569;
--color-text-muted: #64748b;

--color-bg: #ffffff;
--color-bg-soft: #f7fafc;
--color-surface: #ffffff;
--color-surface-alt: #f1f5f9;

--color-border: #e2e8f0;
--color-border-strong: #cbd5e1;

--color-success: #16a34a;
--color-warning: #d97706;
--color-danger: #dc2626;
--color-info: #2563eb;
```

## 6.3. Quy tắc dùng màu

- **Primary xanh dương** là trục chính cho:
  - CTA chính
  - active nav
  - tab active
  - focus
  - search button
  - link chính
- **Secondary xanh ngọc** dùng cho:
  - trust
  - support
  - verified
  - info mềm
  - chips phụ
- **Accent cam** dùng cho:
  - giá tour
  - ưu đãi
  - CTA phụ
  - cảnh báo nhẹ
- Nền chủ đạo phải **trắng hoặc xanh xám rất nhạt**
- Không dùng quá 2 màu nhấn trong cùng 1 block
- Admin Area được phép giảm độ “du lịch”, nhưng vẫn phải cùng hệ màu

---

# 7. Typography

## 7.1. Font

```css
font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
```

## 7.2. Hệ chữ

- Hero headline: `36px - 44px`, `700`
- Page title: `28px - 32px`, `700`
- Section title: `22px - 24px`, `700`
- Card title: `17px - 18px`, `600`
- Body: `14px - 16px`, `400 - 500`
- Meta text: `12px - 13px`, `500`
- Price / score / stat: `20px - 24px`, `700`
- Tiny helper: `12px`

## 7.3. Quy tắc

- Tên tour, tên guide, tiêu đề bài đồng hành phải nổi bật hơn mô tả
- Giá, rating, trạng thái và CTA phải có độ nổi rõ
- Không dùng quá nhiều cấp chữ
- Chữ phải ưu tiên scan nhanh như Booking/Agoda/Traveloka

---

# 8. Spacing, radius, shadow

## 8.1. Spacing scale

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

## 8.2. Border radius

- Search panel / hero search card: `20px`
- Card lớn: `16px`
- Card nhỏ: `12px`
- Input / Select / Button: `12px`
- Badge pill: `999px`

## 8.3. Shadow

```css
box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
```

Quy tắc:

- Public cards: shadow rất nhẹ
- Search module: nổi hơn một chút
- Admin table/card: shadow ít hơn
- Không glow, không shadow nặng nhiều lớp

---

# 9. Layout chuẩn toàn hệ thống

## 9.1. Container

- Desktop container: `1200px - 1280px`
- Hero có thể full-width nhưng nội dung phải nằm trong container
- Filter/list pages nên dùng bố cục:
  - sidebar filter + list
  - hoặc top filter bar + list

## 9.2. Lưới

- Homepage tour grid: 4 cột desktop
- Guide grid: 3 hoặc 4 cột desktop
- Companion grid: 3 cột desktop
- Dashboard admin: 3 hoặc 4 stat cards
- Detail pages: 2 cột chính nếu cần

## 9.3. Cấu trúc trang chuẩn

1. Top utility bar (nếu phù hợp)
2. Header / main nav
3. Hero hoặc page heading
4. Search / filter / toolbar
5. Main content
6. Section modules
7. Footer với Public/User/Guide
8. Footer optional với Admin

---

# 10. Header, top bar và footer

## 10.1. Header Public

Phải học pattern OTA:

- logo trái
- menu sản phẩm / điều hướng chính
- support / hotline / account ở góc phải
- có CTA đăng nhập / đăng ký hoặc avatar user
- header nền trắng hoặc xanh rất nhạt
- sticky nhẹ khi scroll nếu phù hợp

## 10.2. Top utility bar

Lấy cảm hứng từ travel.com.vn và iVIVU:

- hotline / hỗ trợ
- ngôn ngữ / tiền tệ nếu cần mô phỏng
- link trợ giúp / tra cứu booking / hỗ trợ

Không làm quá cao, chỉ là lớp thông tin tin cậy.

## 10.3. Footer Public

Phải có:

- giới thiệu nền tảng
- link tour / guide / companion / hỗ trợ
- liên hệ
- chính sách / điều khoản / riêng tư
- trust/payment logos nếu có trong bản demo

---

# 11. Hero section và search module

Đây là phần bắt buộc phải mạnh, vì gần như tất cả website tham chiếu đều nhấn search như trung tâm trải nghiệm.

## 11.1. Hero chuẩn cho Public homepage

Hero nên có:

- headline rõ
- subheadline ngắn
- 1 search panel nổi bật
- nền sáng, có ảnh travel nhẹ hoặc gradient rất tiết chế
- có quick chips/tabs như:
  - Tour
  - Guide
  - Bạn đồng hành

## 11.2. Search module

Search module phải:

- nằm nổi trên hero hoặc ngay dưới hero
- là card lớn, bo 20px
- chia field rất rõ
- có CTA search primary mạnh
- hỗ trợ state focus rõ
- desktop-first, mobile stack xuống gọn

## 11.3. Search fields gợi ý

Tùy màn hình:

- điểm đến
- thời gian
- loại tour
- ngân sách
- hình thức du lịch
- guide language
- số người
- keyword

---

# 12. Homepage architecture chuẩn

Homepage TravelConnectVN phải có cấu trúc gần với OTA hiện đại:

1. Hero + search
2. Trust strip / quick benefits
3. Tour nổi bật
4. Hướng dẫn viên nổi bật
5. Bài đồng hành mới
6. Điểm đến phổ biến
7. Chủ đề du lịch / phong cách du lịch
8. Review / trust / hỗ trợ
9. CTA tải app / liên hệ / đăng ký (nếu có)
10. Footer

Không được để homepage thành:

- một danh sách card vô tổ chức
- hoặc một landing page quá thiên marketing

---

# 13. Card system bắt buộc

## 13.1. Tour card

Phải có:

- ảnh rõ
- badge loại tour hoặc trạng thái nếu cần
- tên tour
- địa điểm
- thời gian
- guide ngắn
- rating + số review nếu có
- giá hoặc chi phí
- CTA “Xem chi tiết”

Tour card phải tạo cảm giác:

- dễ tin
- dễ so sánh
- muốn bấm tiếp

## 13.2. Guide card

Phải có:

- avatar
- tên
- khu vực hoạt động
- ngôn ngữ
- số năm kinh nghiệm hoặc chuyên môn
- verification badge nếu có
- rating / số review
- CTA “Xem hồ sơ”

## 13.3. Companion card

Phải có:

- tiêu đề bài
- điểm đến
- thời gian
- chi phí dự kiến
- số thành viên mong muốn
- trạng thái
- CTA “Xem chi tiết”

## 13.4. Destination card

Lấy cảm hứng iVIVU/Agoda/Traveloka:

- ảnh điểm đến
- tên điểm đến
- mô tả ngắn hoặc số tour / số guide
- click để mở danh sách liên quan

## 13.5. Deal / promotion card

Chỉ dùng ở Public:

- nhỏ gọn
- nổi bật nhẹ
- accent hoặc primary-soft
- không quá sale-off
- vẫn phải sang trọng, sạch

---

# 14. Chi tiết tour và chi tiết guide

## 14.1. Chi tiết tour

Phải mang cảm giác:

- giống sản phẩm có thể ra quyết định
- không phải bài blog dài

Bố cục gợi ý:

- gallery / ảnh cover
- title + meta + badges
- rating + review summary
- sidebar hoặc sticky panel:
  - giá
  - CTA gửi yêu cầu
  - guide short card
- tabs:
  - tổng quan
  - lịch trình
  - review
  - policy / thông tin thêm

## 14.2. Chi tiết guide

Phải giống profile dịch vụ:

- avatar
- tên
- verification
- khu vực hoạt động
- ngôn ngữ / kỹ năng
- bio rõ
- review summary
- danh sách tour liên quan
- CTA chat / xem tour / lưu yêu thích

---

# 15. Filter bar, sort bar và list pages

Đây là phần phải học từ Skyscanner/Booking/Agoda:

- tối ưu scan nhanh
- nhiều filter nhưng không rối
- sticky vừa đủ
- sort rõ.

## 15.1. Filter page pattern

Có 2 pattern được phép:

- sidebar filter trái + results phải
- top filter bar + list/grid dưới

## 15.2. Filter controls

- input
- select
- chips
- checkbox
- date picker
- range nếu thực sự cần

## 15.3. Sort bar

Phải có:

- số lượng kết quả
- sort select
- view toggle nếu cần
- filter summary chips

---

# 16. Trust signals và social proof

Phải học từ OTA lớn: người dùng ra quyết định tốt hơn khi có trust rõ ràng.

## 16.1. TravelConnectVN phải có trust UI cho:

- verified guide
- review count
- rating score
- response/approval status
- support/contact
- booking/request status
- admin moderation status nếu cần

## 16.2. Không dùng trust giả

- không bịa logo đối tác
- không thêm “100% guarantee” nếu hệ thống không có logic tương ứng
- trust badge phải hợp lý với đồ án

---

# 17. Rating, review và score UI

Lấy cảm hứng từ Booking/Agoda/Traveloka:

- điểm số phải rất dễ nhìn
- số review đặt gần điểm số
- summary text ngắn
- review list dễ đọc
- sort review nếu cần

Pattern gợi ý:

- score box / score pill
- stars + count
- review summary bar

---

# 18. Button system

## 18.1. Primary button

- nền primary
- chữ trắng
- hover đậm hơn
- cao `44px - 48px`
- font `600`
- bo `12px`

Dùng cho:

- tìm kiếm
- xem chi tiết
- gửi yêu cầu
- lưu thay đổi
- tạo tour
- duyệt yêu cầu

## 18.2. Secondary button

- nền trắng
- border nhẹ
- chữ dark
- hover nền soft

## 18.3. Accent button

- dùng cam hoặc xanh ngọc
- chỉ cho CTA phụ cần nhấn
- không cạnh tranh primary

## 18.4. Ghost / text button

- cho thao tác phụ
- không dùng cho action quan trọng

---

# 19. Form, input, select, date input

Các website tham chiếu đều đặt form search làm trung tâm, nên form của TravelConnectVN phải cực kỳ gọn và rõ.

## 19.1. Quy tắc chung

- form field cao đều nhau
- nhãn rõ
- placeholder không dài dòng
- focus ring màu primary
- trạng thái lỗi rõ nhưng không chói
- icon nếu có chỉ hỗ trợ, không lạm dụng

## 19.2. Search form khác admin form

- Public/User/Guide form: mềm hơn, thoáng hơn
- Admin form: gọn, dày thông tin hơn

---

# 20. Status badge

Dùng badge cho:

- Draft
- Published
- Pending
- Approved
- Rejected
- Cancelled
- Closed
- Hidden
- Flagged
- Verified
- Unverified
- Active
- Suspended

Màu:

- success: xanh lá
- warning: cam
- danger: đỏ
- info: xanh dương
- neutral: xám

Badge phải:

- nhỏ gọn
- dễ quét
- không quá bão hòa

---

# 21. Admin Area

Admin không được giống Public, nhưng cũng không được tách hẳn sang một hệ thiết kế khác.

## 21.1. Tone

- sáng
- chuyên nghiệp
- dữ liệu rõ
- table mạnh
- filter rõ
- stat cards gọn

## 21.2. Phải có

- sidebar trái
- page title + breadcrumb
- search/filter/action bar
- table/card list
- stat cards
- drawer/modal khi cần

## 21.3. Không được

- dark mode kiểu fintech
- quá nhiều gradient
- dashboard fantasy
- ảnh minh họa không liên quan

---

# 22. Guide Area

Guide Area phải mang cảm giác “người cung cấp dịch vụ chuyên nghiệp”.

## 22.1. Phải có

- dashboard guide gọn
- trạng thái tour / request rõ
- profile chuyên môn đáng tin
- form tạo tour rõ ràng
- section quản lý theo card/table chuẩn

## 22.2. Visual tone

- gần với Public/User nhưng bớt marketing hơn
- tăng tính quản lý
- giảm block trang trí

---

# 23. User Area

User Area là giao giữa trải nghiệm du lịch và self-service.

## 23.1. Phải có

- hồ sơ cá nhân rõ
- danh sách yêu cầu dễ hiểu
- bài đồng hành của tôi rõ trạng thái
- favorite/review/notification nếu có phải gọn

## 23.2. Pattern ưu tiên

- cards
- tabs
- timeline/activity list
- status-focused lists

---

# 24. Public Area

Đây là area quan trọng nhất về cảm nhận thương hiệu.

## 24.1. Phải giống travel platform

- hero đẹp vừa đủ
- search mạnh
- section modular
- destination/tour/guide cards đẹp
- CTA rõ

## 24.2. Không được giống

- blog du lịch
- landing page tour quá cũ
- website sale-off nhấp nháy
- app dashboard

---

# 25. Map, notification, chat, AI — quy tắc riêng

## 25.1. Map

- map chỉ hỗ trợ, không nuốt trang
- bên cạnh map phải có panel địa điểm / itinerary rõ
- marker và danh sách liên kết được với nhau

## 25.2. Notification

- list sạch
- unread/read dễ phân biệt
- icon nhẹ
- timestamp rõ

## 25.3. Chat

- layout sạch như app nhắn tin hiện đại
- bubble đơn giản
- sidebar conversation rõ
- không cố trang trí nặng

## 25.4. AI chat

- khác chat thường ở chỗ có intro card, suggestion chips, assistant tone
- nhưng vẫn cùng design system

---

# 26. Motion và interaction

## 26.1. Được phép

- hover nhẹ
- shadow tăng nhẹ
- fade/slide ngắn
- accordion/tabs mở gọn
- sticky header/search/filter nếu hợp lý

## 26.2. Không được

- parallax nặng
- animation kéo dài
- bounce vô nghĩa
- transition quá nhiều
- carousel tự chạy gây khó dùng

---

# 27. Responsive rules

## 27.1. Desktop

- ưu tiên chính
- hero rộng
- grid rõ
- filter sidebar hoặc top bar mạnh

## 27.2. Tablet

- giảm cột
- filter thu gọn
- table có thể cuộn ngang

## 27.3. Mobile

- hero ngắn lại
- search stack theo cột
- cards 1 cột hoặc 2 cột tùy ngữ cảnh
- CTA luôn dễ bấm
- tabs không quá nhỏ

---

# 28. Accessibility và readability

Phải bảo đảm:

- contrast đủ
- label rõ
- button dễ bấm
- không chỉ dùng màu để thể hiện trạng thái
- icon quan trọng phải có text
- các khu vực quan trọng có hierarchy rõ

---

# 29. Những gì tuyệt đối không được làm

Agent **không được**:

- copy nguyên Booking/Agoda/Traveloka
- dùng màu y hệt thương hiệu khác làm màu brand chính
- tạo layout giống hệt từng website tham chiếu
- dùng quá nhiều quảng cáo giả / deal giả
- làm Public Area như marketplace bán hàng
- làm Guide Area như seller center
- làm Admin như SaaS tài chính tối đen
- tạo mỗi màn hình một hệ button/card khác nhau
- quên search-first UX ở Public Area
- quên trust-first UI ở Tour / Guide / Request / Review

---

# 30. Checklist bắt buộc trước khi chốt một màn hình

Trước khi hoàn thành UI, agent phải tự kiểm:

- Màn hình này có cảm giác là travel platform hiện đại không?
- Search/filter/CTA có rõ không?
- Card có đủ hỗ trợ ra quyết định nhanh không?
- Rating, review, giá, trạng thái có nổi bật đúng mức không?
- Tone có đủ sáng, đáng tin và sạch không?
- Có bị giống retail-tech / ecommerce / dashboard lạ không?
- Có tái sử dụng component đúng design system chưa?
- Có đúng tính chất area không?
- Có responsive ổn không?
- Có quá nhiều hiệu ứng hoặc màu nhấn không?

Nếu câu trả lời “chưa”, phải chỉnh lại trước khi chốt.

---

# 31. Output expectation cho AI agent

Khi agent sinh UI cho TravelConnectVN, output phải:

- trông như một sản phẩm du lịch hiện đại
- ưu tiên search và decision-making
- card mạnh, CTA rõ, trust rõ
- đồng bộ toàn hệ thống
- đủ đẹp để demo
- đủ thực dụng để phát triển tiếp
- không bị rối vì cố “sáng tạo nghệ thuật”

Nếu có xung đột giữa:

1. đẹp
2. rõ
3. đồng bộ

thì ưu tiên:

1. **đồng bộ**
2. **rõ**
3. **đẹp**

---

# 32. Kết luận ngắn cho agent

Hãy thiết kế TravelConnectVN như một **travel platform hiện đại kiểu OTA**, kết hợp:

- khả năng khám phá của iVIVU/Vietravel
- độ rõ và trust của Booking/Agoda
- sự modular và product-first của Traveloka
- tinh thần so sánh nhanh của Skyscanner

Nhưng vẫn phải là **một sản phẩm riêng của TravelConnectVN**, phù hợp đồ án sinh viên, dễ code, dễ demo, dễ mở rộng và không sao chép nguyên bản thương hiệu khác.
