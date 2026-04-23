-- ============================================================
-- CHAT MODULE SEED — TravelConnectVN Sprint 12
-- Idempotent: dùng ON CONFLICT DO NOTHING với UUID cố định
-- Không xóa / không sửa bất kỳ record hiện có
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- USERS REFERENCE (từ DB thật):
-- TravelConnect Member  : 10710936-d8a8-4ec4-af77-07bed9398d1d (có guide_profile)
-- Twot Nguyễn           : 706dccbd-b9ee-414f-a211-88d7a8bdafc4 (có guide_profile)
-- Guider                : 89c7b387-d1b6-4d61-9ed8-0b3809cc47bd (guide approved)
-- Admin TCVN            : 325fe3be-3964-4917-b26b-658c37175b90
-- TravelConnect Content : 8db4cbd2-3327-43f2-97d5-2ee57ad61d0c
-- TravelConnect Support : f49b43ac-b3f3-488e-b7bd-2642b0b300a1
--
-- COMPANION POSTS:
-- Mù Cang Chải          : a150c3ef-50d9-4ab3-a946-10cc49aa571e  (owner: Admin TCVN)
-- Sa Pa mùa lúa         : c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11  (owner: TravelConnect Member)
--
-- APPROVED REQUESTS:
-- Mù Cang Chải ← TravelConnect Member approved
-- Sa Pa        ← Twot Nguyễn approved
-- ────────────────────────────────────────────────────────────

-- ============================================================
-- 1. CONVERSATIONS (4 conversations)
-- ============================================================

INSERT INTO public.conversations (id, conversation_type, title, created_by_user_id, related_tour_id, related_companion_post_id, created_at, updated_at)
VALUES
  -- Direct 1: TravelConnect Member ↔ Guider (hỏi về tour Hà Giang)
  (
    '11111111-1111-1111-1111-000000000001',
    'direct',
    NULL,
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 hour'
  ),
  -- Direct 2: Twot Nguyễn ↔ Guider (hỏi về tour Đà Lạt)
  (
    '11111111-1111-1111-1111-000000000002',
    'direct',
    NULL,
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    NULL,
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 hours'
  ),
  -- Group 1: Mù Cang Chải (owner: Admin TCVN, member: TravelConnect Member)
  (
    '11111111-1111-1111-1111-000000000003',
    'group_companion',
    'Nhóm chat: Đi tìm mùa vàng Mù Cang Chải',
    '325fe3be-3964-4917-b26b-658c37175b90',
    NULL,
    'a150c3ef-50d9-4ab3-a946-10cc49aa571e',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '30 minutes'
  ),
  -- Group 2: Sa Pa mùa lúa (owner: TravelConnect Member, member: Twot Nguyễn)
  (
    '11111111-1111-1111-1111-000000000004',
    'group_companion',
    'Nhóm chat: Tìm bạn đồng hành đi Sa Pa mùa lúa chín',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    NULL,
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '45 minutes'
  )
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. CONVERSATION PARTICIPANTS
-- ============================================================

INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at, left_at, is_muted, last_read_at)
VALUES
  -- Direct 1: TravelConnect Member + Guider
  ('11111111-1111-1111-1111-000000000001', '10710936-d8a8-4ec4-af77-07bed9398d1d', NOW() - INTERVAL '3 days', NULL, false, NOW() - INTERVAL '1 hour'),
  ('11111111-1111-1111-1111-000000000001', '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd', NOW() - INTERVAL '3 days', NULL, false, NOW() - INTERVAL '2 hours'),

  -- Direct 2: Twot Nguyễn + Guider
  ('11111111-1111-1111-1111-000000000002', '706dccbd-b9ee-414f-a211-88d7a8bdafc4', NOW() - INTERVAL '5 days', NULL, false, NOW() - INTERVAL '5 hours'),
  ('11111111-1111-1111-1111-000000000002', '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd', NOW() - INTERVAL '5 days', NULL, false, NOW() - INTERVAL '2 hours'),

  -- Group 1: Mù Cang Chải — Admin TCVN (owner) + TravelConnect Member (approved)
  ('11111111-1111-1111-1111-000000000003', '325fe3be-3964-4917-b26b-658c37175b90', NOW() - INTERVAL '7 days', NULL, false, NOW() - INTERVAL '30 minutes'),
  ('11111111-1111-1111-1111-000000000003', '10710936-d8a8-4ec4-af77-07bed9398d1d', NOW() - INTERVAL '6 days', NULL, false, NOW() - INTERVAL '1 day'),

  -- Group 2: Sa Pa — TravelConnect Member (owner) + Twot Nguyễn (approved)
  ('11111111-1111-1111-1111-000000000004', '10710936-d8a8-4ec4-af77-07bed9398d1d', NOW() - INTERVAL '4 days', NULL, false, NOW() - INTERVAL '45 minutes'),
  ('11111111-1111-1111-1111-000000000004', '706dccbd-b9ee-414f-a211-88d7a8bdafc4', NOW() - INTERVAL '4 days', NULL, false, NOW() - INTERVAL '3 hours')
ON CONFLICT (conversation_id, user_id) DO NOTHING;


-- ============================================================
-- 3. MESSAGES
-- ============================================================

INSERT INTO public.messages (id, conversation_id, sender_user_id, content, message_type, attachment_url, sent_at, edited_at, deleted_at)
VALUES

  -- ── Direct 1: TravelConnect Member ↔ Guider (về tour Hà Giang) ──
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-000000000001',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Chào anh/chị! Tôi muốn hỏi thêm về chuyến Hà Giang – Đồng Văn sắp tới. Anh/chị có thể tư vấn cho tôi không?',
    'text', NULL,
    NOW() - INTERVAL '3 days', NULL, NULL
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-000000000001',
    '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd',
    'Chào bạn! Rất vui được tư vấn. Bạn dự định đi bao nhiêu ngày và xuất phát từ đâu ạ?',
    'text', NULL,
    NOW() - INTERVAL '3 days' + INTERVAL '10 minutes', NULL, NULL
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-000000000001',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Tôi muốn đi khoảng 5 ngày 4 đêm, xuất phát từ Hà Nội. Nhóm có 3 người.',
    'text', NULL,
    NOW() - INTERVAL '3 days' + INTERVAL '25 minutes', NULL, NULL
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-000000000001',
    '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd',
    'Với 5N4Đ từ Hà Nội, tôi gợi ý lộ trình: HN → Hà Giang → Quản Bạ → Yên Minh → Đồng Văn → Mèo Vạc → Mã Pì Lèng → về HN. Chi phí khoảng 3.5–4 triệu/người bao gồm xe, nhà nghỉ và ăn uống.',
    'text', NULL,
    NOW() - INTERVAL '2 days' + INTERVAL '8 hours', NULL, NULL
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-000000000001',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Nghe hay quá! Vậy mình có thể đặt lịch trước không ạ? Dự kiến đi cuối tháng 10.',
    'text', NULL,
    NOW() - INTERVAL '1 day' + INTERVAL '2 hours', NULL, NULL
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-000000000001',
    '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd',
    'Cuối tháng 10 là mùa tam giác mạch nở rộ — rất đẹp! Bạn có thể gửi yêu cầu tham gia tour trên hệ thống, tôi sẽ xét duyệt ngay. Nếu cần thêm thông tin hãy nhắn tôi nhé!',
    'text', NULL,
    NOW() - INTERVAL '1 hour', NULL, NULL
  ),

  -- ── Direct 2: Twot Nguyễn ↔ Guider (về Đà Lạt) ──
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-000000000002',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Xin chào! Tôi đang tìm hướng dẫn viên cho chuyến Đà Lạt 3 ngày. Anh có nhận không?',
    'text', NULL,
    NOW() - INTERVAL '5 days', NULL, NULL
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-000000000002',
    '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd',
    'Chào bạn! Tôi có thể hướng dẫn tour Đà Lạt. Bạn quan tâm đến loại hình nào: thiên nhiên, ẩm thực hay cà phê – check-in?',
    'text', NULL,
    NOW() - INTERVAL '5 days' + INTERVAL '15 minutes', NULL, NULL
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-000000000002',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Thiên nhiên và ẩm thực là chính. Chúng tôi có 2 người, muốn đi nhẹ nhàng, không quá vội.',
    'text', NULL,
    NOW() - INTERVAL '4 days' + INTERVAL '9 hours', NULL, NULL
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-000000000002',
    '89c7b387-d1b6-4d61-9ed8-0b3809cc47bd',
    'Tuyệt! Tôi sẽ thiết kế lộ trình 3N2Đ thư thái: rừng thông Đà Lạt, hồ Than Thở, chợ đêm, thác Datanla và bữa ăn tại nhà vườn địa phương. Bạn có dị ứng thức ăn gì không?',
    'text', NULL,
    NOW() - INTERVAL '4 days' + INTERVAL '10 hours', NULL, NULL
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-000000000002',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Không có dị ứng gì cả. Nghe hấp dẫn lắm! Để tôi check lịch và báo lại nhé.',
    'text', NULL,
    NOW() - INTERVAL '2 hours', NULL, NULL
  ),

  -- ── Group 1: Mù Cang Chải — Admin TCVN + TravelConnect Member ──
  (
    'cccccccc-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-000000000003',
    '325fe3be-3964-4917-b26b-658c37175b90',
    'Chào mọi người! Nhóm chúng ta đã được tập hợp để cùng đi Mù Cang Chải ngắm mùa vàng. Rất vui được đồng hành! 🌾',
    'text', NULL,
    NOW() - INTERVAL '7 days', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-000000000003',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Chào anh! Mình đã xem lịch trình rồi, nghe hay lắm. Mình cần mang theo đồ gì đặc biệt không ạ?',
    'text', NULL,
    NOW() - INTERVAL '6 days' + INTERVAL '2 hours', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-000000000003',
    '325fe3be-3964-4917-b26b-658c37175b90',
    'Bạn nhớ mang: áo ấm (sáng sớm lạnh), giày đi bộ, máy ảnh (hoặc điện thoại chụp đẹp), kem chống nắng. Mùa này trời rất đẹp nhưng buổi tối khá lạnh nhé!',
    'text', NULL,
    NOW() - INTERVAL '6 days' + INTERVAL '3 hours', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-000000000003',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Cảm ơn anh! Nhân tiện, điểm tập hợp mình ở đâu và mấy giờ xuất phát ạ?',
    'text', NULL,
    NOW() - INTERVAL '5 days' + INTERVAL '8 hours', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-000000000003',
    '325fe3be-3964-4917-b26b-658c37175b90',
    'Tập hợp lúc 5:30 sáng tại bến xe Mỹ Đình, Hà Nội. Chúng ta đi xe khách giường nằm lên Nghĩa Lộ rồi thuê xe máy vào Mù Cang Chải. Mình sẽ gửi chi tiết hành trình qua file sau nhé.',
    'text', NULL,
    NOW() - INTERVAL '4 days' + INTERVAL '20 hours', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-000000000003',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Ok anh! Mình chờ file chi tiết. Chuyến này chắc sẽ tuyệt lắm 🏔️',
    'text', NULL,
    NOW() - INTERVAL '3 days' + INTERVAL '7 hours', NULL, NULL
  ),
  (
    'cccccccc-0000-0000-0000-000000000007',
    '11111111-1111-1111-1111-000000000003',
    '325fe3be-3964-4917-b26b-658c37175b90',
    'Nhắc nhở: còn 5 ngày nữa là xuất phát! Mọi người check lại giấy tờ tùy thân và chuẩn bị hành lý nhé. Chuyến này hứa hẹn nhiều ảnh đẹp lắm! 📸',
    'text', NULL,
    NOW() - INTERVAL '30 minutes', NULL, NULL
  ),

  -- ── Group 2: Sa Pa mùa lúa — TravelConnect Member (owner) + Twot Nguyễn ──
  (
    'dddddddd-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-000000000004',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Xin chào nhóm Sa Pa! Vui mừng vì chúng ta đã có đủ thành viên. Đây là kênh để mình trao đổi mọi thứ về chuyến đi nhé 🌾',
    'text', NULL,
    NOW() - INTERVAL '4 days', NULL, NULL
  ),
  (
    'dddddddd-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-000000000004',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Chào bạn! Mình rất háo hức cho chuyến này. Mùa lúa chín ở Sa Pa là trải nghiệm mình mơ ước lâu lắm rồi.',
    'text', NULL,
    NOW() - INTERVAL '4 days' + INTERVAL '30 minutes', NULL, NULL
  ),
  (
    'dddddddd-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-000000000004',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Mình đã book phòng homestay tại Lao Chải rồi nhé. View ruộng bậc thang đẹp lắm! Bạn cần mình book thêm phòng không?',
    'text', NULL,
    NOW() - INTERVAL '3 days' + INTERVAL '9 hours', NULL, NULL
  ),
  (
    'dddddddd-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-000000000004',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Cảm ơn bạn nhiều! Mình cần 1 phòng cho 1 người thôi. Homestay đó có wifi không? Mình cần làm việc buổi tối một chút.',
    'text', NULL,
    NOW() - INTERVAL '2 days' + INTERVAL '14 hours', NULL, NULL
  ),
  (
    'dddddddd-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-000000000004',
    '10710936-d8a8-4ec4-af77-07bed9398d1d',
    'Có wifi 4G nhưng tốc độ tùy lúc. Nên tải về trước những gì cần thiết nhé. Mình sẽ book thêm 1 phòng cho bạn!',
    'text', NULL,
    NOW() - INTERVAL '1 day' + INTERVAL '10 hours', NULL, NULL
  ),
  (
    'dddddddd-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-000000000004',
    '706dccbd-b9ee-414f-a211-88d7a8bdafc4',
    'Bạn chu đáo quá! Mình sẽ chuyển tiền phòng cho bạn trước nhé. Sắp tới rồi, nóng lòng quá 😄',
    'text', NULL,
    NOW() - INTERVAL '45 minutes', NULL, NULL
  )

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- VERIFY
-- ============================================================
SELECT 
  (SELECT COUNT(*) FROM public.conversations) as total_conversations,
  (SELECT COUNT(*) FROM public.conversation_participants) as total_participants,
  (SELECT COUNT(*) FROM public.messages) as total_messages;
