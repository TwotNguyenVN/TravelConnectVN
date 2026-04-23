-- Seed data for Sprint 07: Companion Posts and Companion Requests

-- 1. Create Companion Posts
INSERT INTO companion_posts (
  id, user_id, title, destination, start_date, end_date, estimated_cost, currency_code, expected_members, description, requirements, business_status, visibility_status, created_at, updated_at
) VALUES 
(
  gen_random_uuid(), 
  '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 
  'Tìm bạn đồng hành đi Hà Giang ngắm hoa tam giác mạch', 
  'Hà Giang', 
  '2026-10-15', '2026-10-20', 
  3500000, 'VND', 4, 
  'Mình đang tìm 4 bạn cùng đi Hà Giang ngắm hoa tam giác mạch. Lịch trình 5 ngày 4 đêm, xuất phát từ Hà Nội bằng xe khách giường nằm sau đó thuê xe máy tại Hà Giang.', 
  'Biết lái xe máy vững, vui vẻ, hòa đồng, ưu tiên các bạn thích chụp ảnh.', 
  'open', 'visible', NOW(), NOW()
),
(
  gen_random_uuid(), 
  '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 
  'Leo Fansipan tháng 11 - Tìm nhóm 3 người', 
  'Sa Pa, Lào Cai', 
  '2026-11-05', '2026-11-08', 
  2000000, 'VND', 3, 
  'Cần tìm thêm 3 bạn đồng hành leo Fansipan theo cung Trạm Tôn. Đã đặt tour trekking trọn gói, chỉ cần tìm người đi cùng cho vui.', 
  'Sức khỏe tốt, không sợ độ cao, có tinh thần đồng đội.', 
  'open', 'visible', NOW(), NOW()
),
(
  gen_random_uuid(), 
  '27b7f209-5783-4cbc-87e0-204a99c248ba', 
  'Khám phá ẩm thực Huế - Tìm bạn đi cùng cuối tuần', 
  'Huế', 
  '2026-06-12', '2026-06-14', 
  1500000, 'VND', 2, 
  'Mình là người Huế nhưng muốn trải nghiệm cảm giác đi food tour như khách du lịch. Tìm 2 bạn đi cùng để share tiền ăn và trò chuyện.', 
  'Tâm hồn ăn uống, thích khám phá văn hóa địa phương.', 
  'open', 'visible', NOW(), NOW()
),
(
  gen_random_uuid(), 
  '27b7f209-5783-4cbc-87e0-204a99c248ba', 
  'Phú Quốc nghỉ dưỡng 4 ngày - Đã đủ người', 
  'Phú Quốc', 
  '2026-05-20', '2026-05-24', 
  5000000, 'VND', 2, 
  'Tìm bạn đi Phú Quốc nghỉ dưỡng, ở resort. Đã có đủ người tham gia.', 
  'Thích biển, không ngại chi tiêu cho dịch vụ tốt.', 
  'closed', 'visible', NOW(), NOW()
);

-- 2. Create Companion Requests for the first post (Hà Giang)
DO $$
DECLARE
    post_id_hagiang UUID;
    post_id_fansipan UUID;
    post_id_hue UUID;
    post_id_phuquoc UUID;
BEGIN
    SELECT id INTO post_id_hagiang FROM companion_posts WHERE title = 'Tìm bạn đồng hành đi Hà Giang ngắm hoa tam giác mạch';
    SELECT id INTO post_id_fansipan FROM companion_posts WHERE title = 'Leo Fansipan tháng 11 - Tìm nhóm 3 người';
    SELECT id INTO post_id_hue FROM companion_posts WHERE title = 'Khám phá ẩm thực Huế - Tìm bạn đi cùng cuối tuần';
    SELECT id INTO post_id_phuquoc FROM companion_posts WHERE title = 'Phú Quốc nghỉ dưỡng 4 ngày - Đã đủ người';

    -- Requests for Hà Giang
    INSERT INTO companion_requests (id, post_id, user_id, message, status, requested_at) VALUES
    (gen_random_uuid(), post_id_hagiang, '706dccbd-b9ee-414f-a211-88d7a8bdafc4', 'Mình muốn tham gia, mình có thể lái xe máy rất tốt.', 'pending', NOW()),
    (gen_random_uuid(), post_id_hagiang, '298303d0-de34-4e09-a7d1-7f9427d3dcaa', 'Mình cũng thích Hà Giang, cho mình một slot nhé.', 'approved', NOW() - INTERVAL '1 day');

    -- Requests for Fansipan
    INSERT INTO companion_requests (id, post_id, user_id, message, status, requested_at) VALUES
    (gen_random_uuid(), post_id_fansipan, '706dccbd-b9ee-414f-a211-88d7a8bdafc4', 'Mình đã leo Fansipan 1 lần rồi, muốn đi lại.', 'pending', NOW());

    -- Requests for Huế
    INSERT INTO companion_requests (id, post_id, user_id, message, status, requested_at) VALUES
    (gen_random_uuid(), post_id_hue, '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 'Rất thích đồ ăn Huế, mình tham gia với nhé.', 'pending', NOW());

    -- Requests for Phú Quốc (Already approved)
    INSERT INTO companion_requests (id, post_id, user_id, message, status, requested_at, processed_at, processed_by_user_id) VALUES
    (gen_random_uuid(), post_id_phuquoc, '706dccbd-b9ee-414f-a211-88d7a8bdafc4', 'Đi Phú Quốc nghỉ dưỡng thì tuyệt vời.', 'approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', '27b7f209-5783-4cbc-87e0-204a99c248ba'),
    (gen_random_uuid(), post_id_phuquoc, '298303d0-de34-4e09-a7d1-7f9427d3dcaa', 'Cho mình join với.', 'approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', '27b7f209-5783-4cbc-87e0-204a99c248ba');

END $$;
