DO $$
DECLARE
  v_user_ids uuid[];
BEGIN
  -- Get all test user IDs
  SELECT array_agg(id) INTO v_user_ids FROM auth.users WHERE email LIKE '%test%';

  IF v_user_ids IS NOT NULL THEN
    -- Disable foreign key checks for this transaction
    SET LOCAL session_replication_role = 'replica';

    -- Try to clean up core data to prevent obvious issues
    DELETE FROM public.guide_profiles WHERE user_id = ANY(v_user_ids);
    DELETE FROM public.user_roles WHERE user_id = ANY(v_user_ids);
    DELETE FROM public.user_role_change_logs WHERE target_user_id = ANY(v_user_ids) OR changed_by_user_id = ANY(v_user_ids);
    DELETE FROM public.users WHERE id = ANY(v_user_ids);
    DELETE FROM auth.users WHERE id = ANY(v_user_ids);

  END IF;
END $$;
