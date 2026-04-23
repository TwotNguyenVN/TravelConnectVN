-- Seed data for Sprint 08 - Admin Core

-- 1. Create some sample reports
INSERT INTO public.reports (
    reporter_user_id,
    target_type,
    tour_id,
    companion_post_id,
    reported_user_id,
    reason,
    description,
    status
) VALUES 
-- Report a tour
(
    '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 
    'tour', 
    (SELECT id FROM public.tours LIMIT 1), 
    NULL, 
    NULL, 
    'Nội dung không phù hợp', 
    'Tour này có hình ảnh nhạy cảm và mô tả không đúng sự thật.', 
    'open'
),
-- Report a companion post
(
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4', 
    'companion_post', 
    NULL, 
    (SELECT id FROM public.companion_posts LIMIT 1), 
    NULL, 
    'Spam/Quảng cáo', 
    'Bài đăng này thực chất là quảng cáo dịch vụ cho thuê xe, không phải tìm bạn đồng hành.', 
    'open'
),
-- Report a user (Guide)
(
    '9077ec65-3c3d-4495-ac8e-19b8d7f3d445', 
    'user', 
    NULL, 
    NULL, 
    '27b7f209-5783-4cbc-87e0-204a99c248ba', 
    'Lừa đảo', 
    'Người này yêu cầu chuyển khoản cọc trước rồi không liên lạc được.', 
    'open'
);

-- 2. Create a Guide Verification Request
INSERT INTO public.guide_verification_requests (
    guide_profile_id,
    status,
    submission_note
) VALUES (
    (SELECT id FROM public.guide_profiles WHERE user_id = '27b7f209-5783-4cbc-87e0-204a99c248ba' LIMIT 1),
    'pending',
    'Tôi đã tải lên đầy đủ chứng chỉ ngoại ngữ và thẻ hướng dẫn viên.'
);

-- 3. Create sample Verification Documents
INSERT INTO public.guide_verification_documents (
    verification_request_id,
    document_type,
    file_url,
    status
) VALUES 
(
    (SELECT id FROM public.guide_verification_requests ORDER BY submitted_at DESC LIMIT 1),
    'national_id',
    'https://example.com/docs/id_card.jpg',
    'submitted'
),
(
    (SELECT id FROM public.guide_verification_requests ORDER BY submitted_at DESC LIMIT 1),
    'tour_guide_card',
    'https://example.com/docs/license.pdf',
    'submitted'
);
