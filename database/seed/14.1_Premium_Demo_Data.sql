-- SPRINT 14 PREMIUM DEMO SEED
-- This script adds rich, high-quality data for the final demo.

DO $$
DECLARE
  -- User IDs
  v_admin_id UUID := '325fe3be-3964-4917-b26b-658c37175b90';
  v_guide_id UUID := '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd';
  v_member_id UUID := '10710936-d8a8-4ec4-af77-07bed9398d1d';
  v_user_id UUID := '706dccbd-b9ee-414f-a211-88d7a8bdafc4';
  
  -- Guide Profile ID
  v_guide_profile_id UUID;
  
  -- Category IDs
  v_cat_nature BIGINT;
  v_cat_culture BIGINT;
  v_cat_food BIGINT;
  
  -- New Tour IDs
  v_tour_sapa_id UUID := gen_random_uuid();
  v_tour_hue_id UUID := gen_random_uuid();
  v_tour_danang_id UUID := gen_random_uuid();
  
  -- Request IDs
  v_req_sapa_member_id UUID := gen_random_uuid();
  
  -- AI Session ID
  v_ai_session_id UUID := gen_random_uuid();

BEGIN
  -- 1. Ensure Categories exist
  INSERT INTO public.tour_categories (name, description) VALUES 
  ('Thiên nhiên', 'Khám phá vẻ đẹp tự nhiên hùng vĩ'),
  ('Văn hóa', 'Tìm hiểu di sản và đời sống con người'),
  ('Ẩm thực', 'Hành trình khám phá hương vị địa phương')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;
  
  SELECT id INTO v_cat_nature FROM public.tour_categories WHERE name = 'Thiên nhiên';
  SELECT id INTO v_cat_culture FROM public.tour_categories WHERE name = 'Văn hóa';
  SELECT id INTO v_cat_food FROM public.tour_categories WHERE name = 'Ẩm thực';

  -- 2. Ensure Guide Profile
  SELECT id INTO v_guide_profile_id FROM public.guide_profiles WHERE user_id = v_guide_id;
  IF v_guide_profile_id IS NULL THEN
    v_guide_profile_id := gen_random_uuid();
    INSERT INTO public.guide_profiles (id, user_id, bio, years_of_experience, working_area, verification_status, visibility_status)
    VALUES (v_guide_profile_id, v_guide_id, 'Tôi là hướng dẫn viên chuyên nghiệp với 5 năm kinh nghiệm dẫn đoàn quốc tế và nội địa.', 5, 'Miền Bắc & Miền Trung', 'approved', 'visible');
  END IF;

  -- 3. PREMIUM TOURS
  -- Tour 1: Sapa (PAST TOUR to allow reviews)
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (v_tour_sapa_id, v_guide_profile_id, v_cat_nature, 
    'Khám phá vẻ đẹp mùa xuân Sapa (Đã kết thúc)', 'Lào Cai', 'Sa Pa', 
    '2026-03-10', '2026-03-12', 2850000, 15, 'published', 'visible', now() - interval '2 months', 
    'Ga cáp treo Fansipan Legend', 'Chuyến đi tuyệt vời ngắm hoa đỗ quyên và chinh phục đỉnh Fansipan trong làn sương mờ.');

  INSERT INTO public.tour_images (tour_id, image_url, is_cover, sort_order) VALUES
  (v_tour_sapa_id, 'https://images.unsplash.com/photo-1504457047772-27fad17af657', true, 1);

  -- Tour 2: Huế (FUTURE TOUR for booking demo)
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (v_tour_hue_id, v_guide_profile_id, v_cat_culture, 
    'Huế: Hành trình di sản Cố Đô', 'Thừa Thiên Huế', 'Huế', 
    '2026-06-01', '2026-06-02', 1500000, 20, 'published', 'visible', now(), 
    'Ngọ Môn - Kinh Thành Huế', 'Khám phá vẻ đẹp trầm mặc và cổ kính của cố đô Huế qua hệ thống lăng tẩm và cung điện.');

  INSERT INTO public.tour_images (tour_id, image_url, is_cover, sort_order) VALUES
  (v_tour_hue_id, 'https://images.unsplash.com/photo-1599708153386-62e240474519', true, 1);

  -- Tour 3: Đà Nẵng (FUTURE TOUR)
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (v_tour_danang_id, v_guide_profile_id, v_cat_food, 
    'Đà Nẵng - Hội An: Thiên đường ẩm thực', 'Đà Nẵng', 'Hải Châu', 
    '2026-05-25', '2026-05-26', 1200000, 12, 'published', 'visible', now(), 
    'Chợ Cồn', 'Trải nghiệm những món ăn đặc sản ngon nhất tại Đà Nẵng và phố cổ Hội An.');

  INSERT INTO public.tour_images (tour_id, image_url, is_cover, sort_order) VALUES
  (v_tour_danang_id, 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb', true, 1);

  -- 4. TOUR REQUESTS (For past tour to allow reviews)
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at) VALUES
  (v_req_sapa_member_id, v_tour_sapa_id, v_member_id, 2, 'paid', now() - interval '40 days');

  -- 5. TOUR REVIEWS (Referencing the past tour request)
  INSERT INTO public.tour_reviews (id, tour_id, user_id, tour_request_id, rating, comment, created_at) VALUES
  (gen_random_uuid(), v_tour_sapa_id, v_member_id, v_req_sapa_member_id, 5, 'Chuyến đi tuyệt vời! Hướng dẫn viên rất nhiệt tình và am hiểu kiến thức địa phương. Phong cảnh Sapa mùa này quá đẹp.', now() - interval '38 days');

  -- 6. GUIDE REVIEWS
  INSERT INTO public.guide_reviews (id, guide_profile_id, tour_id, tour_request_id, user_id, rating, comment, created_at) VALUES
  (gen_random_uuid(), v_guide_profile_id, v_tour_sapa_id, v_req_sapa_member_id, v_member_id, 5, 'Guider dẫn đoàn rất chuyên nghiệp, vui tính và chụp ảnh rất đẹp cho đoàn. Cảm ơn anh rất nhiều!', now() - interval '38 days');

  -- 7. AI CHAT SESSIONS & MESSAGES
  INSERT INTO public.ai_chat_sessions (id, user_id, status, started_at)
  VALUES (v_ai_session_id, v_user_id, 'active', now() - interval '10 minutes');

  INSERT INTO public.ai_chat_messages (session_id, sender_type, content, created_at) VALUES
  (v_ai_session_id, 'user', 'Tôi muốn đi du lịch Sapa vào tháng 5, bạn có gợi ý gì không?', now() - interval '9 minutes'),
  (v_ai_session_id, 'assistant', 'Chào bạn! Tháng 5 là thời điểm tuyệt vời để đến Sapa. Thời tiết lúc này khá mát mẻ, bạn có thể ngắm những cánh đồng ruộng bậc thang đang vào mùa nước đổ. Bạn có muốn xem một số tour Sapa hiện có trên hệ thống không?', now() - interval '8 minutes');

  -- 8. COMPANION POSTS VARIETY
  INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status, description)
  VALUES 
  (gen_random_uuid(), v_user_id, 'Lập team Food Tour Đà Lạt 2 ngày 1 đêm', 'Lâm Đồng', '2026-05-10', '2026-05-11', 1200000, 4, 'open', 'visible', 'Mình là nam, muốn tìm thêm 3 bạn nữa cùng đi ăn sập Đà Lạt.');

END $$;
