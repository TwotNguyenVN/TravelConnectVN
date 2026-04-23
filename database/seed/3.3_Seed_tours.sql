-- SEED DATA FOR TOURS, REVIEWS & COMPANIONS (SPRINT 03)
-- This file provides complete sample data for the Public Area.

-- 1. Create Guide Profile for the demo guide user
INSERT INTO public.guide_profiles (id, user_id, bio, years_of_experience, working_area, avatar_url, verification_status, visibility_status)
VALUES (
    'e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 
    '27b7f209-5783-4cbc-87e0-204a99c248ba', 
    'Chào bạn! Mình là Tùng, một hướng dẫn viên địa phương đam mê khám phá văn hóa và ẩm thực Sài Gòn.', 
    5, 
    'Thành phố Hồ Chí Minh', 
    'https://i.pravatar.cc/150?u=guide',
    'approved',
    'visible'
)
ON CONFLICT (user_id) DO UPDATE SET 
    verification_status = 'approved', 
    avatar_url = 'https://i.pravatar.cc/150?u=guide';

-- 2. Create Sample Tours
-- Tour 1: Past Tour (for reviews) - USE DO UPDATE to fix previous attempts
INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at)
VALUES (
    'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    'e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c',
    1, 
    'Khám phá Sài Gòn xưa và nay',
    'Thành phố Hồ Chí Minh',
    'Quận 1',
    '2024-01-01',
    '2024-01-02',
    500000,
    10,
    'published',
    'visible',
    '2024-01-01'
) ON CONFLICT (id) DO UPDATE SET 
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    business_status = EXCLUDED.business_status;

-- Tour 2: Future Tour
INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at)
VALUES (
    'b2c3d4e5-f6a7-4b6c-9d8e-7f6a5b4c3d2e',
    'e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c',
    2, 
    'Thiên đường ẩm thực đường phố Sài Gòn',
    'Thành phố Hồ Chí Minh',
    'Quận 4',
    '2026-05-01',
    '2026-05-01',
    350000,
    6,
    'published',
    'visible',
    NOW()
) ON CONFLICT (id) DO UPDATE SET 
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date;

-- 3. Add Tour Images
INSERT INTO public.tour_images (tour_id, image_url, caption, is_cover, sort_order)
VALUES 
('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482', 'Nhà thờ Đức Bà', true, 0),
('b2c3d4e5-f6a7-4b6c-9d8e-7f6a5b4c3d2e', 'https://images.unsplash.com/photo-1567129937968-cdad8f0d52f8', 'Bánh mì Sài Gòn', true, 0)
ON CONFLICT DO NOTHING;

-- 4. Create Tour Requests (to satisfy review constraint)
INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at)
VALUES 
('f1e2d3c4-b5a6-4987-8765-43210fedcba9', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 2, 'paid', '2024-01-01')
ON CONFLICT (id) DO UPDATE SET status = 'paid';

-- 5. Add Tour Reviews
INSERT INTO public.tour_reviews (id, tour_id, user_id, tour_request_id, rating, comment, visibility_status)
VALUES 
(gen_random_uuid(), 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 'f1e2d3c4-b5a6-4987-8765-43210fedcba9', 5, 'Chuyến đi rất tuyệt vời!', 'visible')
ON CONFLICT DO NOTHING;

-- 6. Add Companion Posts
INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status)
VALUES 
(gen_random_uuid(), '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 'Tìm bạn đi Hà Giang', 'Hà Giang', '2026-06-01', '2026-06-05', 5000000, 4, 'open', 'visible')
ON CONFLICT DO NOTHING;
