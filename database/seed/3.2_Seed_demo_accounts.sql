-- =========================================================
-- SEED DEMO ACCOUNTS FOR TRAVELCONNECT VN
-- Password for all: Tcvn@123
-- Roles: SYSTEM_ADMIN, CONTENT_MODERATOR, SUPPORT_STAFF, USER, GUIDE
-- =========================================================

DO $$
DECLARE
  v_admin_id UUID := gen_random_uuid();
  v_content_id UUID := gen_random_uuid();
  v_support_id UUID := gen_random_uuid();
  v_user_id UUID := gen_random_uuid();
  v_guide_id UUID := gen_random_uuid();
  v_password_hash TEXT := crypt('Tcvn@123', gen_salt('bf'));
BEGIN
  -- 1. Create Users in auth.users if they don't exist
  -- Note: We use individual blocks to check existence because auth.users has partial unique indexes
  
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
    VALUES (v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Admin"}', false, 'authenticated', 'authenticated');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_admin_id, v_admin_id, jsonb_build_object('sub', v_admin_id, 'email', 'admin.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Content Moderator
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'content.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
    VALUES (v_content_id, '00000000-0000-0000-0000-000000000000', 'content.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Content Mod"}', false, 'authenticated', 'authenticated');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_content_id, v_content_id, jsonb_build_object('sub', v_content_id, 'email', 'content.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Support Staff
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'support.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
    VALUES (v_support_id, '00000000-0000-0000-0000-000000000000', 'support.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Support"}', false, 'authenticated', 'authenticated');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_support_id, v_support_id, jsonb_build_object('sub', v_support_id, 'email', 'support.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Regular User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
    VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', 'user.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Regular User"}', false, 'authenticated', 'authenticated');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_user_id, v_user_id, jsonb_build_object('sub', v_user_id, 'email', 'user.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- Guide
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'guide.travelconnect@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud)
    VALUES (v_guide_id, '00000000-0000-0000-0000-000000000000', 'guide.travelconnect@gmail.com', v_password_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"TCVN Local Guide"}', false, 'authenticated', 'authenticated');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_guide_id, v_guide_id, jsonb_build_object('sub', v_guide_id, 'email', 'guide.travelconnect@gmail.com'), 'email', now(), now(), now());
  END IF;

  -- 2. Ensure records exist in public.users (in case trigger was off or delayed)
  INSERT INTO public.users (id, email, full_name, status)
  SELECT id, email, raw_user_meta_data->>'full_name', 'active'
  FROM auth.users
  WHERE email IN (
    'admin.travelconnect@gmail.com', 
    'content.travelconnect@gmail.com', 
    'support.travelconnect@gmail.com', 
    'user.travelconnect@gmail.com', 
    'guide.travelconnect@gmail.com'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 3. Assign correct roles in public.user_roles
  -- Note: We first clear existing roles for these specific demo users to ensure they only have the target role
  
  -- Admin
  DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin.travelconnect@gmail.com');
  INSERT INTO public.user_roles (user_id, role_code)
  SELECT id, 'SYSTEM_ADMIN' FROM auth.users WHERE email = 'admin.travelconnect@gmail.com';
  
  -- Content Moderator
  DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'content.travelconnect@gmail.com');
  INSERT INTO public.user_roles (user_id, role_code)
  SELECT id, 'CONTENT_MODERATOR' FROM auth.users WHERE email = 'content.travelconnect@gmail.com';
  
  -- Support Staff
  DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'support.travelconnect@gmail.com');
  INSERT INTO public.user_roles (user_id, role_code)
  SELECT id, 'SUPPORT_STAFF' FROM auth.users WHERE email = 'support.travelconnect@gmail.com';
  
  -- Guide
  DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'guide.travelconnect@gmail.com');
  INSERT INTO public.user_roles (user_id, role_code)
  SELECT id, 'GUIDE' FROM auth.users WHERE email = 'guide.travelconnect@gmail.com';
  
  -- User
  DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user.travelconnect@gmail.com');
  INSERT INTO public.user_roles (user_id, role_code)
  SELECT id, 'USER' FROM auth.users WHERE email = 'user.travelconnect@gmail.com';

END $$;
