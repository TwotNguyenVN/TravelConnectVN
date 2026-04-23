-- Seed data for Sprint 06 - Tour Requests
-- State Machine: pending, approved, rejected, cancelled_by_user, cancelled_by_guide, payment_pending, paid

-- 1. Pending Request
-- User: Nguyễn Ngọc Tình (706dccbd-b9ee-414f-a211-88d7a8bdafc4)
-- Tour: Trekking Langbiang (c3d4e5f6-a7b8-4c7d-9e8f-7a6b5c4d3e2f)
INSERT INTO public.tour_requests (
    id, tour_id, user_id, participant_count, note, status, requested_at
) VALUES (
    'a1111111-2222-3333-4444-555555555555',
    'c3d4e5f6-a7b8-4c7d-9e8f-7a6b5c4d3e2f',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    2,
    'Chúng tôi muốn tham gia vào sáng sớm.',
    'pending',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- 2. Approved Request
-- User: Regular User (9077ec65-3c3d-4495-ac8e-19b8d7f3d445)
-- Tour: Khám phá ẩm thực đường phố Sài Gòn (4cf30ace-99fd-4381-b22f-3b4795c3db63)
INSERT INTO public.tour_requests (
    id, tour_id, user_id, participant_count, note, response_note, status, requested_at, processed_at, processed_by_user_id
) VALUES (
    'b2222222-3333-4444-5555-666666666666',
    '4cf30ace-99fd-4381-b22f-3b4795c3db63',
    '9077ec65-3c3d-4495-ac8e-19b8d7f3d445',
    1,
    'Tôi đi một mình, hy vọng được ghép đoàn.',
    'Đã duyệt, hẹn gặp bạn.',
    'approved',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    '27b7f209-5783-4cbc-87e0-204a99c248ba'
) ON CONFLICT (id) DO NOTHING;

-- 3. Rejected Request
-- User: Nguyễn Ngọc Tình (706dccbd-b9ee-414f-a211-88d7a8bdafc4)
-- Tour: Thiên đường ẩm thực (b2c3d4e5-f6a7-4b6c-9d8e-7f6a5b4c3d2e)
INSERT INTO public.tour_requests (
    id, tour_id, user_id, participant_count, note, response_note, status, requested_at, processed_at, processed_by_user_id
) VALUES (
    'c3333333-4444-5555-6666-777777777777',
    'b2c3d4e5-f6a7-4b6c-9d8e-7f6a5b4c3d2e',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    4,
    'Nhóm mình đi đông, có giảm giá không?',
    'Rất tiếc tour này đã đủ chỗ cho nhóm 4 người.',
    'rejected',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days',
    '27b7f209-5783-4cbc-87e0-204a99c248ba'
) ON CONFLICT (id) DO NOTHING;

-- 4. Cancelled by User
-- User: Regular User (9077ec65-3c3d-4495-ac8e-19b8d7f3d445)
-- Tour: City Tour Sài Gòn (efb2409d-e603-4beb-b379-bb579f3e5bbb)
INSERT INTO public.tour_requests (
    id, tour_id, user_id, participant_count, note, status, requested_at, cancelled_at
) VALUES (
    'd4444444-5555-6666-7777-888888888888',
    'efb2409d-e603-4beb-b379-bb579f3e5bbb',
    '9077ec65-3c3d-4495-ac8e-19b8d7f3d445',
    2,
    'Đặt chỗ trước.',
    'cancelled_by_user',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;
