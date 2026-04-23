-- SPRINT 14 PREMIUM REVIEWS EXPANSION
-- This script adds more variety of reviews for tours and guides.

DO $$
DECLARE
  -- User IDs
  v_member_id UUID := '10710936-d8a8-4ec4-af77-07bed9398d1d';
  v_user_id UUID := '706dccbd-b9ee-414f-a211-88d7a8bdafc4';
  
  -- Existing Tour IDs (from previous seed or existing)
  v_tour_sapa_id UUID;
  v_tour_hue_id UUID;
  v_tour_danang_id UUID;
  
  -- Guide Profile ID
  v_guide_profile_id UUID;

  -- Temporary Request IDs
  v_req_id UUID;

BEGIN
  -- Get IDs
  SELECT id INTO v_tour_sapa_id FROM public.tours WHERE title LIKE '%Sapa%' LIMIT 1;
  SELECT id INTO v_tour_hue_id FROM public.tours WHERE title LIKE '%Huế%' LIMIT 1;
  SELECT id INTO v_tour_danang_id FROM public.tours WHERE title LIKE '%Đà Nẵng%' LIMIT 1;
  
  SELECT guide_profile_id INTO v_guide_profile_id FROM public.tours WHERE id = v_tour_sapa_id;

  -- 1. ADD MORE REVIEWS FOR SAPA TOUR
  -- Review 2
  v_req_id := gen_random_uuid();
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at) 
  VALUES (v_req_id, v_tour_sapa_id, v_user_id, 1, 'paid', now() - interval '45 days');
  
  INSERT INTO public.tour_reviews (id, tour_id, user_id, tour_request_id, rating, comment, created_at) VALUES
  (gen_random_uuid(), v_tour_sapa_id, v_user_id, v_req_id, 4, 'Chuyến đi rất tốt, cảnh đẹp nhưng leo núi hơi mệt. Cần chuẩn bị thể lực tốt nhé mọi người.', now() - interval '42 days');

  -- 2. ADD REVIEWS FOR GUIDE
  -- Review 2 for guide
  INSERT INTO public.guide_reviews (id, guide_profile_id, tour_id, tour_request_id, user_id, rating, comment, created_at) VALUES
  (gen_random_uuid(), v_guide_profile_id, v_tour_sapa_id, v_req_id, v_user_id, 4, 'Anh hướng dẫn viên rất am hiểu về các loài cây và văn hóa người Mông. Rất hài lòng.', now() - interval '42 days');

  -- 3. ADD FUTURE REQUESTS (To show in "My Bookings" or Admin panel)
  -- Request for Hue tour (Pending)
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at, note) 
  VALUES (gen_random_uuid(), v_tour_hue_id, v_user_id, 2, 'pending', now() - interval '1 hour', 'Chúng tôi có trẻ em đi cùng, hy vọng tour không quá vất vả.');

  -- Request for Danang tour (Approved but not paid)
  INSERT INTO public.tour_requests (id, tour_id, user_id, participant_count, status, requested_at, response_note) 
  VALUES (gen_random_uuid(), v_tour_danang_id, v_member_id, 4, 'approved', now() - interval '2 hours', 'Chào bạn, chúng tôi đã sẵn sàng đón đoàn của bạn!');

  -- 4. ADD MORE COMPANION REQUESTS
  -- (Assuming there are companion posts from previous seed)
  DECLARE
    v_post_id UUID;
  BEGIN
    SELECT id INTO v_post_id FROM public.companion_posts WHERE title LIKE '%Food Tour Đà Lạt%' LIMIT 1;
    IF v_post_id IS NOT NULL THEN
      INSERT INTO public.companion_requests (id, post_id, user_id, status, requested_at, message) VALUES
      (gen_random_uuid(), v_post_id, v_member_id, 'pending', now() - interval '30 minutes', 'Mình cũng rất thích ăn uống, cho mình join team với nhé!');
    END IF;
  END;

END $$;
