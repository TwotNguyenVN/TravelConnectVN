-- Seed data for Sprint 13: Accommodations and Recommendations

-- 1. Insert Partner Accommodations
INSERT INTO "public"."partner_accommodations" ("id", "name", "accommodation_type", "address", "province", "contact_phone", "website_url", "image_url", "status")
VALUES
(gen_random_uuid(), 'Mường Thanh Luxury Đà Nẵng', 'hotel', '270 Võ Nguyên Giáp, Bắc Mỹ Phú, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', '02363956789', 'http://luxurydaNang.muongthanh.com', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'active'),
(gen_random_uuid(), 'Sapa Jade Hill Resort & Spa', 'resort', 'Thôn Lý, Phường Cầu Mây, Sa Pa, Lào Cai', 'Lào Cai', '02143818888', 'https://sapajadehill.com', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'active'),
(gen_random_uuid(), 'Melia Vinpearl Phú Quốc', 'resort', 'Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang', 'Kiên Giang', '02973628888', 'https://melia.com', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'active'),
(gen_random_uuid(), 'Hội An Ancient House Resort', 'homestay', '377 Hai Bà Trưng, Phường Cẩm Sơn, Hội An', 'Quảng Nam', '02353923377', 'http://ancienthouseresort.com', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'active')
ON CONFLICT DO NOTHING;

-- 2. Link some accommodations to tours
-- Assuming we have tours in Đà Nẵng, Sa Pa, Phú Quốc. We will link dynamically using random active tours.
DO $$
DECLARE
    v_tour_id UUID;
    v_acc_id UUID;
BEGIN
    -- Link Đà Nẵng Accommodation
    SELECT id INTO v_acc_id FROM partner_accommodations WHERE province = 'Đà Nẵng' LIMIT 1;
    SELECT id INTO v_tour_id FROM tours WHERE province = 'Đà Nẵng' LIMIT 1;
    IF v_acc_id IS NOT NULL AND v_tour_id IS NOT NULL THEN
        INSERT INTO tour_accommodations (tour_id, accommodation_id, notes, sort_order)
        VALUES (v_tour_id, v_acc_id, 'Khách sạn view biển, bao gồm bữa sáng buffett.', 1)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Link Lào Cai Accommodation
    SELECT id INTO v_acc_id FROM partner_accommodations WHERE province = 'Lào Cai' LIMIT 1;
    SELECT id INTO v_tour_id FROM tours WHERE province = 'Lào Cai' LIMIT 1;
    IF v_acc_id IS NOT NULL AND v_tour_id IS NOT NULL THEN
        INSERT INTO tour_accommodations (tour_id, accommodation_id, notes, sort_order)
        VALUES (v_tour_id, v_acc_id, 'Resort nghỉ dưỡng cao cấp.', 1)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
