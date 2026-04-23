-- SPRINT 09 EXPANDED MASTER SEED
-- Adds more variety to the demo data for 4 main flows
DO $$
DECLARE
  -- Existing Account IDs
  v_admin_id UUID := '325fe3be-3964-4917-b26b-658c37175b90';
  v_guide_id UUID := '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd';
  v_user_id UUID := '10710936-d8a8-4ec4-af77-07bed9398d1d';
  v_member_id UUID := '706dccbd-b9ee-414f-a211-88d7a8bdafc4';
  
  -- Category IDs
  v_cat_city BIGINT;
  v_cat_food BIGINT;
  v_cat_nature BIGINT;
  v_cat_culture BIGINT;
  
  -- Guide Profiles
  v_guide_profile_id UUID;
BEGIN
  -- 1. Get/Create categories
  INSERT INTO public.tour_categories (name, description) VALUES 
  ('Thiên nhiên', 'Khám phá vẻ đẹp tự nhiên'),
  ('Văn hóa', 'Trải nghiệm văn hóa địa phương')
  ON CONFLICT (name) DO NOTHING;
  
  SELECT id INTO v_cat_city FROM public.tour_categories WHERE name = 'City Tour';
  SELECT id INTO v_cat_food FROM public.tour_categories WHERE name = 'Food Tour';
  SELECT id INTO v_cat_nature FROM public.tour_categories WHERE name = 'Thiên nhiên';
  SELECT id INTO v_cat_culture FROM public.tour_categories WHERE name = 'Văn hóa';

  -- 2. Ensure Guide Profile exists
  SELECT id INTO v_guide_profile_id FROM public.guide_profiles WHERE user_id = v_guide_id;
  IF v_guide_profile_id IS NULL THEN
    v_guide_profile_id := gen_random_uuid();
    INSERT INTO public.guide_profiles (id, user_id, bio, years_of_experience, working_area, verification_status, visibility_status)
    VALUES (v_guide_profile_id, v_guide_id, 'Chuyên gia du lịch địa phương', 5, 'Toàn quốc', 'approved', 'visible');
  END IF;

  -- 3. ADD MORE TOURS (Province: Lâm Đồng, Quảng Ninh, Kiên Giang)
  -- Tour 3: Đà Lạt mộng mơ
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (gen_random_uuid(), v_guide_profile_id, v_cat_nature, 
    'Săn mây Đà Lạt và check-in đồi chè Cầu Đất', 'Lâm Đồng', 'Đà Lạt', 
    '2026-05-20', '2026-05-20', 350000, 10, 'published', 'visible', now(), 
    'Chợ Đà Lạt', 'Hành trình săn mây lúc bình minh tại Cầu Đất, tham quan vườn hồng và cafe view thung lũng.'
  );

  -- Tour 4: Vịnh Hạ Long
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (gen_random_uuid(), v_guide_profile_id, v_cat_nature, 
    'Du ngoạn Vịnh Hạ Long - Hang Sửng Sốt', 'Quảng Ninh', 'Hạ Long', 
    '2026-06-10', '2026-06-10', 850000, 20, 'published', 'visible', now(), 
    'Cảng tàu quốc tế Hạ Long', 'Trải nghiệm du thuyền tham quan các hang động đẹp nhất và chèo kayak trên vịnh.'
  );

  -- Tour 5: Phú Quốc Sunset
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (gen_random_uuid(), v_guide_profile_id, v_cat_nature, 
    'Ngắm hoàng hôn và câu mực đêm Phú Quốc', 'Kiên Giang', 'Phú Quốc', 
    '2026-07-05', '2026-07-05', 500000, 12, 'published', 'visible', now(), 
    'Dinh Cậu', 'Thưởng thức hoàng hôn tuyệt đẹp trên biển và trải nghiệm câu mực đêm cùng ngư dân.'
  );

  -- 4. ADD MORE COMPANION POSTS
  INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status, description)
  VALUES 
  (gen_random_uuid(), v_user_id, 'Phượt Hà Giang - Đồng Văn - Mèo Vạc', 'Hà Giang', '2026-10-15', '2026-10-18', 4000000, 6, 'open', 'visible', 'Tìm team đi xe máy khám phá cung đường hạnh phúc. Mình đã có lịch trình chi tiết.'),
  (gen_random_uuid(), v_member_id, 'Nghỉ dưỡng tại Amanoi Ninh Thuận', 'Ninh Thuận', '2026-08-01', '2026-08-03', 15000000, 2, 'open', 'visible', 'Muốn tìm một bạn nữ cùng đi nghỉ dưỡng, chia sẻ chi phí phòng.'),
  (gen_random_uuid(), v_user_id, 'Food tour Hải Phòng - Ăn sập thành phố hoa phượng đỏ', 'Hải Phòng', '2026-05-01', '2026-05-02', 1500000, 4, 'open', 'visible', 'Cần 3 bạn tâm hồn ăn uống đi cùng để ăn được nhiều món nhất có thể.');

  -- 5. ADD MORE REQUESTS for variety
  -- Add some approved requests to show approved members in details
  DECLARE
    v_comp_id_hagiang UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status, description)
    VALUES (v_comp_id_hagiang, v_admin_id, 'Đi tìm mùa vàng Mù Cang Chải', 'Yên Bái', '2026-09-20', '2026-09-22', 2500000, 4, 'open', 'visible', 'Lập team chụp ảnh lúa chín Mù Cang Chải.');
    
    INSERT INTO public.companion_requests (id, post_id, user_id, status, requested_at, message) VALUES
    (gen_random_uuid(), v_comp_id_hagiang, v_user_id, 'approved', now(), 'Mình tham gia với nhé!'),
    (gen_random_uuid(), v_comp_id_hagiang, v_member_id, 'pending', now(), 'Cho mình hỏi còn chỗ không ạ?');
  END;

END $$;
