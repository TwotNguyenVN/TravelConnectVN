-- SPRINT 09 REFINED MASTER SEED
-- USES EXISTING USERS IN THE DATABASE
DO $$
DECLARE
  -- Existing Account IDs
  v_admin_id UUID := '325fe3be-3964-4917-b26b-658c37175b90';
  v_content_id UUID := '8db4cbd2-3327-43f2-97d5-2ee57ad61d0c';
  v_user_id UUID := '10710936-d8a8-4ec4-af77-07bed9398d1d';
  v_guide_id UUID := '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd';
  v_member_id UUID := '706dccbd-b9ee-414f-a211-88d7a8bdafc4'; -- Twot Nguyễn
  
  -- Business IDs
  v_guide_profile_id UUID := gen_random_uuid();
  v_tour_published_id UUID := gen_random_uuid();
  v_tour_draft_id UUID := gen_random_uuid();
  v_companion_id UUID := gen_random_uuid();
  
  v_cat_city BIGINT;
  v_cat_food BIGINT;
BEGIN
  -- 1. CLEANUP existing business data to avoid duplicates if re-running
  DELETE FROM public.reports;
  DELETE FROM public.companion_requests;
  DELETE FROM public.companion_posts;
  DELETE FROM public.tour_requests;
  DELETE FROM public.tour_locations;
  DELETE FROM public.tour_images;
  DELETE FROM public.tours;
  DELETE FROM public.guide_languages;
  DELETE FROM public.guide_skills;
  DELETE FROM public.guide_profiles;

  -- 2. CREATE CATEGORIES
  INSERT INTO public.tour_categories (name, description) VALUES 
  ('City Tour', 'Khám phá thành phố'),
  ('Food Tour', 'Khám phá ẩm thực')
  ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
  RETURNING id INTO v_cat_city; -- This might be tricky if multiple, let's select instead
  
  SELECT id INTO v_cat_city FROM public.tour_categories WHERE name = 'City Tour';
  SELECT id INTO v_cat_food FROM public.tour_categories WHERE name = 'Food Tour';

  -- 3. CREATE GUIDE PROFILE
  INSERT INTO public.guide_profiles (id, user_id, bio, years_of_experience, working_area, avatar_url, verification_status, visibility_status)
  VALUES (
    v_guide_profile_id, v_guide_id, 
    'Chào bạn! Mình là Trần Thị Guide, am hiểu sâu sắc về văn hóa và ẩm thực Hà Nội.', 
    3, 'Hà Nội', 'https://i.pravatar.cc/150?u=guide', 'approved', 'visible'
  );

  -- 4. LANGUAGES & SKILLS
  INSERT INTO public.languages (name) VALUES ('Tiếng Việt'), ('English'), ('한국어') ON CONFLICT (name) DO NOTHING;
  INSERT INTO public.skills (name) VALUES ('Thuyết minh văn hóa'), ('Ẩm thực địa phương'), ('Chụp ảnh') ON CONFLICT (name) DO NOTHING;

  INSERT INTO public.guide_languages (guide_profile_id, language_id)
  SELECT v_guide_profile_id, id FROM public.languages WHERE name IN ('Tiếng Việt', 'English');

  INSERT INTO public.guide_skills (guide_profile_id, skill_id)
  SELECT v_guide_profile_id, id FROM public.skills WHERE name IN ('Thuyết minh văn hóa', 'Ẩm thực địa phương');

  -- 5. CREATE TOURS
  -- Published Tour
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (
    v_tour_published_id, v_guide_profile_id, v_cat_city, 
    'Khám phá phố cổ Hà Nội 36 phố phường', 'Hà Nội', 'Hoàn Kiếm', 
    '2026-05-15', '2026-05-15', 300000, 15, 'published', 'visible', now(), 
    'Tượng đài Lý Thái Tổ', 'Tour đi bộ khám phá các ngõ ngách, di tích và thưởng thức cafe trứng đặc sản.'
  );

  -- Draft Tour
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (
    v_tour_draft_id, v_guide_profile_id, v_cat_food, 
    'Tour ẩm thực đêm Hà Nội', 'Hà Nội', 'Hoàn Kiếm', 
    '2026-06-20', '2026-06-20', 450000, 8, 'draft', 'visible', null, 
    'Cổng chợ Đồng Xuân', 'Khám phá các món ăn đêm nổi tiếng tại khu vực phố cổ.'
  );

  -- Tour Images & Locations
  INSERT INTO public.tour_images (tour_id, image_url, caption, is_cover, sort_order) VALUES
  (v_tour_published_id, 'https://images.unsplash.com/photo-1555944804-84581408803d', 'Hồ Gươm sáng sớm', true, 0),
  (v_tour_draft_id, 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0', 'Phở gánh Hà Nội', true, 0);

  INSERT INTO public.tour_locations (tour_id, sequence_no, location_name, address, notes) VALUES
  (v_tour_published_id, 1, 'Hồ Hoàn Kiếm', 'Quận Hoàn Kiếm, Hà Nội', 'Điểm tập trung và nghe giới thiệu về lịch sử hồ.'),
  (v_tour_published_id, 2, 'Đền Ngọc Sơn', 'Đảo Ngọc, Hồ Hoàn Kiếm', 'Tham quan đền và cầu Thê Húc.');

  -- 6. CREATE COMPANION POST
  INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status, description)
  VALUES (
    v_companion_id, v_user_id, 
    'Tìm bạn đồng hành đi Sa Pa mùa lúa chín', 'Lào Cai', 
    '2026-09-10', '2026-09-13', 3500000, 4, 'open', 'visible', 
    'Mình muốn tìm 3 bạn cùng đi trekking Tả Van - Bản Hồ. Ưu tiên các bạn thích chụp ảnh và không ngại đi bộ.'
  );

  -- 7. CREATE REQUESTS (Tour & Companion)
  -- User requests Guide's tour (PENDING)
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at, message)
  VALUES (gen_random_uuid(), v_tour_published_id, v_user_id, 2, 'pending', now(), 'Cho mình đặt 2 chỗ nhé, mình đi cùng em gái.');

  -- Member requests User's companion post (PENDING)
  INSERT INTO public.companion_requests (id, post_id, user_id, status, requested_at, message)
  VALUES (gen_random_uuid(), v_companion_id, v_member_id, 'pending', now(), 'Chào bạn, mình cũng đang định đi Sa Pa dịp này. Rất vui nếu được đi cùng đoàn!');

  -- 8. CREATE REPORTS (Flow 4)
  -- User reports a fake post (simulated)
  INSERT INTO public.reports (id, reporter_user_id, target_type, tour_id, reason, description, status)
  VALUES (gen_random_uuid(), v_user_id, 'tour', v_tour_draft_id, 'spam', 'Tour này có vẻ không có thật, thông tin sơ sài.', 'open');

END $$;
