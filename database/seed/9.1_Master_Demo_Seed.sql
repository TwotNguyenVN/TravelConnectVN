-- =========================================================
-- MASTER DEMO SEED SCRIPT (Sprint 09 - MVP Stabilization)
-- Purpose: Create a consistent, storytelling dataset for all 4 demo flows.
-- Password for all accounts: Tcvn@123
-- =========================================================

DO $$
DECLARE
  -- Account IDs
  v_admin_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  v_content_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
  v_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
  v_guide_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';
  v_member_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15';
  
  -- Business IDs
  v_tour_published_id UUID := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11';
  v_tour_draft_id UUID := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12';
  v_companion_id UUID := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11';
  
  v_password_hash TEXT := crypt('Tcvn@123', gen_salt('bf'));
  v_cat_city BIGINT;
  v_cat_food BIGINT;
BEGIN
  -- 1. CLEANUP (Optional - use with caution in production, but good for demo reset)
  -- DELETE FROM public.reports;
  -- DELETE FROM public.companion_requests;
  -- DELETE FROM public.companion_posts;
  -- DELETE FROM public.tour_requests;
  -- DELETE FROM public.tour_locations;
  -- DELETE FROM public.tour_images;
  -- DELETE FROM public.tours;
  -- DELETE FROM public.guide_profiles;

  -- 2. CREATE MASTER DATA (Languages, Skills, Categories)
  INSERT INTO public.languages (name) VALUES ('Tiếng Việt'), ('English'), ('한국어') ON CONFLICT DO NOTHING;
  INSERT INTO public.skills (name) VALUES ('Thuyết minh văn hóa'), ('Ẩm thực địa phương'), ('Chụp ảnh') ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_cat_city FROM public.tour_categories WHERE name = 'City Tour';
  IF v_cat_city IS NULL THEN
    INSERT INTO public.tour_categories (name, description) VALUES ('City Tour', 'Khám phá thành phố') RETURNING id INTO v_cat_city;
  END IF;

  SELECT id INTO v_cat_food FROM public.tour_categories WHERE name = 'Food Tour';
  IF v_cat_food IS NULL THEN
    INSERT INTO public.tour_categories (name, description) VALUES ('Food Tour', 'Khám phá ẩm thực') RETURNING id INTO v_cat_food;
  END IF;

  -- 3. CREATE AUTH USERS
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_admin_id, 'admin.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Admin"}', 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_admin_id, v_admin_id, jsonb_build_object('sub', v_admin_id, 'email', 'admin.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Content Moderator
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'content.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_content_id, 'content.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Moderator"}', 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_content_id, v_content_id, jsonb_build_object('sub', v_content_id, 'email', 'content.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Regular User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_user_id, 'user.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn User"}', 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_user_id, v_user_id, jsonb_build_object('sub', v_user_id, 'email', 'user.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Guide
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'guide.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_guide_id, 'guide.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Guide"}', 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_guide_id, v_guide_id, jsonb_build_object('sub', v_guide_id, 'email', 'guide.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Extra Member (for companion)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'member.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (v_member_id, 'member.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Văn Member"}', 'authenticated', 'authenticated');
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_member_id, v_member_id, jsonb_build_object('sub', v_member_id, 'email', 'member.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- 4. ENSURE PUBLIC.USERS RECORDS
  INSERT INTO public.users (id, email, full_name, status)
  SELECT id, email, raw_user_meta_data->>'full_name', 'active' FROM auth.users WHERE id IN (v_admin_id, v_content_id, v_user_id, v_guide_id, v_member_id)
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

  -- 5. ASSIGN ROLES
  DELETE FROM public.user_roles WHERE user_id IN (v_admin_id, v_content_id, v_user_id, v_guide_id, v_member_id);
  INSERT INTO public.user_roles (user_id, role_code) VALUES 
  (v_admin_id, 'SYSTEM_ADMIN'),
  (v_content_id, 'CONTENT_MODERATOR'),
  (v_user_id, 'USER'),
  (v_guide_id, 'GUIDE'),
  (v_member_id, 'USER')
  ON CONFLICT DO NOTHING;

  -- 6. CREATE GUIDE PROFILE
  INSERT INTO public.guide_profiles (id, user_id, bio, years_of_experience, working_area, avatar_url, verification_status, visibility_status)
  VALUES (
    v_guide_id, v_guide_id, 
    'Chào bạn! Mình là Trần Thị Guide, am hiểu sâu sắc về văn hóa và ẩm thực Hà Nội.', 
    3, 'Hà Nội', 'https://i.pravatar.cc/150?u=guide', 'approved', 'visible'
  ) ON CONFLICT (user_id) DO UPDATE SET verification_status = 'approved', visibility_status = 'visible';

  -- 7. CREATE TOURS
  -- Published Tour
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (
    v_tour_published_id, v_guide_id, v_cat_city, 
    'Khám phá phố cổ Hà Nội 36 phố phường', 'Hà Nội', 'Hoàn Kiếm', 
    '2026-05-15', '2026-05-15', 300000, 15, 'published', 'visible', now(), 
    'Tượng đài Lý Thái Tổ', 'Tour đi bộ khám phá các ngõ ngách, di tích và thưởng thức cafe trứng đặc sản.'
  ) ON CONFLICT (id) DO UPDATE SET business_status = 'published', visibility_status = 'visible';

  -- Draft Tour
  INSERT INTO public.tours (id, guide_profile_id, category_id, title, province, district, start_date, end_date, price, max_participants, business_status, visibility_status, published_at, meet_point, description)
  VALUES (
    v_tour_draft_id, v_guide_id, v_cat_food, 
    'Tour ẩm thực đêm Hà Nội', 'Hà Nội', 'Hoàn Kiếm', 
    '2026-06-20', '2026-06-20', 450000, 8, 'draft', 'visible', null, 
    'Cổng chợ Đồng Xuân', 'Khám phá các món ăn đêm nổi tiếng tại khu vực phố cổ.'
  ) ON CONFLICT (id) DO NOTHING;

  -- Tour Images & Locations
  INSERT INTO public.tour_images (tour_id, image_url, caption, is_cover, sort_order) VALUES
  (v_tour_published_id, 'https://images.unsplash.com/photo-1555944804-84581408803d', 'Hồ Gươm sáng sớm', true, 0),
  (v_tour_draft_id, 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0', 'Phở gánh Hà Nội', true, 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.tour_locations (tour_id, sequence_no, location_name, address, notes) VALUES
  (v_tour_published_id, 1, 'Hồ Hoàn Kiếm', 'Quận Hoàn Kiếm, Hà Nội', 'Điểm tập trung và nghe giới thiệu về lịch sử hồ.'),
  (v_tour_published_id, 2, 'Đền Ngọc Sơn', 'Đảo Ngọc, Hồ Hoàn Kiếm', 'Tham quan đền và cầu Thê Húc.')
  ON CONFLICT DO NOTHING;

  -- 8. CREATE COMPANION POST
  INSERT INTO public.companion_posts (id, user_id, title, destination, start_date, end_date, estimated_cost, expected_members, business_status, visibility_status, description)
  VALUES (
    v_companion_id, v_user_id, 
    'Tìm bạn đồng hành đi Sa Pa mùa lúa chín', 'Lào Cai', 
    '2026-09-10', '2026-09-13', 3500000, 4, 'open', 'visible', 
    'Mình muốn tìm 3 bạn cùng đi trekking Tả Van - Bản Hồ. Ưu tiên các bạn thích chụp ảnh và không ngại đi bộ.'
  ) ON CONFLICT (id) DO UPDATE SET business_status = 'open', visibility_status = 'visible';

  -- 9. CREATE REQUESTS (Tour & Companion)
  -- User requests Guide's tour (PENDING)
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at, message)
  VALUES (gen_random_uuid(), v_tour_published_id, v_user_id, 2, 'pending', now(), 'Cho mình đặt 2 chỗ nhé, mình đi cùng em gái.')
  ON CONFLICT DO NOTHING;

  -- Member requests User's companion post (PENDING)
  INSERT INTO public.companion_requests (id, post_id, user_id, status, requested_at, message)
  VALUES (gen_random_uuid(), v_companion_id, v_member_id, 'pending', now(), 'Chào bạn, mình cũng đang định đi Sa Pa dịp này. Rất vui nếu được đi cùng đoàn!')
  ON CONFLICT DO NOTHING;

  -- 10. CREATE REPORTS (Flow 4)
  -- User reports a fake post (simulated)
  INSERT INTO public.reports (id, reporter_id, target_type, target_id, reason, details, status)
  VALUES (gen_random_uuid(), v_user_id, 'tour', v_tour_draft_id, 'spam', 'Tour này có vẻ không có thật, thông tin sơ sài.', 'pending')
  ON CONFLICT DO NOTHING;

END $$;
