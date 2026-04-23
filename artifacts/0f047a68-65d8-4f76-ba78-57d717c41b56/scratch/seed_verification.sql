-- Seed script for Admin Verification UI
-- 1. Add GUIDE role to users
INSERT INTO user_roles (user_id, role_code) 
VALUES 
('10710936-d8a8-4ec4-af77-07bed9398d1d', 'GUIDE'),
('706dccbd-b9ee-414f-a211-88d7a8bdafc4', 'GUIDE')
ON CONFLICT DO NOTHING;

-- 2. Create guide profiles
INSERT INTO guide_profiles (user_id, bio, years_of_experience, working_area, verification_status, visibility_status)
VALUES
('10710936-d8a8-4ec4-af77-07bed9398d1d', 'Tôi là một người đam mê du lịch và muốn chia sẻ kiến thức về TP.HCM.', 2, 'TP. Hồ Chí Minh', 'pending', 'hidden'),
('706dccbd-b9ee-414f-a211-88d7a8bdafc4', 'Chuyên gia du lịch leo núi và trekking tại Sapa.', 5, 'Lào Cai', 'pending', 'hidden')
ON CONFLICT (user_id) DO UPDATE SET verification_status = 'pending', visibility_status = 'hidden';

-- 3. Create verification requests
INSERT INTO guide_verification_requests (id, guide_profile_id, status, submission_note)
VALUES
('req-1', (SELECT id FROM guide_profiles WHERE user_id = '10710936-d8a8-4ec4-af77-07bed9398d1d'), 'pending', 'Tôi gửi hồ sơ xác minh, mong admin duyệt sớm. Tôi đã đính kèm CCCD và thẻ HDV.'),
('req-2', (SELECT id FROM guide_profiles WHERE user_id = '706dccbd-b9ee-414f-a211-88d7a8bdafc4'), 'pending', 'Hồ sơ đầy đủ các chứng chỉ leo núi quốc tế.')
ON CONFLICT DO NOTHING;

-- 4. Create verification documents
INSERT INTO guide_verification_documents (verification_request_id, document_type, file_url, status)
VALUES
('req-1', 'national_id', 'https://placeholder.com/cccd_front.jpg', 'submitted'),
('req-1', 'tour_guide_card', 'https://placeholder.com/guide_card.jpg', 'submitted'),
('req-2', 'national_id', 'https://placeholder.com/cccd_front_2.jpg', 'submitted'),
('req-2', 'tour_guide_card', 'https://placeholder.com/guide_card_2.jpg', 'submitted'),
('req-2', 'certificate', 'https://placeholder.com/mountain_cert.jpg', 'submitted');
