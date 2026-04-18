insert into public.languages (name) values
('Tiếng Việt'),
('English'),
('한국어'),
('日本語'),
('中文')
on conflict (name) do nothing;

insert into public.skills (name) values
('Thuyết minh văn hóa'),
('Dẫn đoàn trekking'),
('Ẩm thực địa phương'),
('Chụp ảnh cơ bản'),
('Lập kế hoạch lịch trình'),
('Giao tiếp song ngữ')
on conflict (name) do nothing;

insert into public.tour_categories (name, description) values
('City Tour', 'Tham quan thành phố'),
('Food Tour', 'Khám phá ẩm thực địa phương'),
('Nature Tour', 'Thiên nhiên, sinh thái'),
('Adventure Tour', 'Mạo hiểm, trekking'),
('Cultural Tour', 'Văn hóa, lịch sử'),
('Beach Tour', 'Biển đảo, nghỉ dưỡng')
on conflict (name) do nothing;

insert into public.partner_accommodations (
    name, accommodation_type, address, province, contact_phone, website_url, image_url
) values
('Saigon Riverside Hotel', 'hotel', '123 Bến Bạch Đằng, Quận 1', 'Hồ Chí Minh', '0909000001', 'https://example.com/saigon-riverside', 'https://images.example.com/hotel1.jpg'),
('Da Lat Pine Homestay', 'homestay', '45 Đồi Thông, Đà Lạt', 'Lâm Đồng', '0909000002', 'https://example.com/dalat-pine', 'https://images.example.com/homestay1.jpg'),
('Nha Trang Blue Sea Resort', 'resort', '88 Trần Phú, Nha Trang', 'Khánh Hòa', '0909000003', 'https://example.com/blue-sea', 'https://images.example.com/resort1.jpg')
on conflict do nothing;