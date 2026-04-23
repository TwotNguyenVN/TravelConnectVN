-- SEED DATA FOR GUIDE DETAILS (SPRINT 04)
-- Link languages and skills to the demo guide profile.

-- Demo Guide ID: e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c

-- 1. Link Languages (Tiếng Việt, English)
INSERT INTO public.guide_languages (guide_profile_id, language_id)
VALUES 
('e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 1),
('e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 2)
ON CONFLICT DO NOTHING;

-- 2. Link Skills (Thuyết minh văn hóa, Ẩm thực địa phương, Giao tiếp song ngữ)
INSERT INTO public.guide_skills (guide_profile_id, skill_id)
VALUES 
('e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 1),
('e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 3),
('e9b0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b5c', 6)
ON CONFLICT DO NOTHING;
