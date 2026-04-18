-- =========================================================
-- ENABLE RLS
-- =========================================================
alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.languages enable row level security;
alter table public.skills enable row level security;
alter table public.tour_categories enable row level security;
alter table public.guide_profiles enable row level security;
alter table public.guide_languages enable row level security;
alter table public.guide_skills enable row level security;
alter table public.tours enable row level security;
alter table public.tour_images enable row level security;
alter table public.tour_locations enable row level security;
alter table public.tour_requests enable row level security;
alter table public.tour_reviews enable row level security;
alter table public.guide_reviews enable row level security;
alter table public.companion_posts enable row level security;
alter table public.companion_requests enable row level security;
alter table public.favorite_tours enable row level security;
alter table public.favorite_guides enable row level security;
alter table public.reports enable row level security;
alter table public.report_processing_history enable row level security;
alter table public.user_activity_logs enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_preferred_categories enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.guide_verification_requests enable row level security;
alter table public.guide_verification_documents enable row level security;
alter table public.guide_availabilities enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.partner_accommodations enable row level security;
alter table public.tour_accommodations enable row level security;
alter table public.payment_transactions enable row level security;

-- =========================================================
-- USERS / ROLES
-- =========================================================
create policy users_select_self_or_backoffice
on public.users for select
to authenticated
using (auth.uid() = id or public.is_backoffice(auth.uid()));

create policy users_update_self_or_system_admin
on public.users for update
to authenticated
using (auth.uid() = id or public.is_system_admin(auth.uid()))
with check (auth.uid() = id or public.is_system_admin(auth.uid()));

create policy roles_select_authenticated
on public.roles for select
to authenticated
using (true);

create policy roles_manage_system_admin
on public.roles for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

create policy user_roles_select_own_or_system_admin
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.is_system_admin(auth.uid()));

create policy user_roles_manage_system_admin
on public.user_roles for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

-- =========================================================
-- LOOKUP TABLES
-- =========================================================
create policy languages_public_read
on public.languages for select
to public
using (is_active = true);

create policy languages_admin_manage
on public.languages for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

create policy skills_public_read
on public.skills for select
to public
using (is_active = true);

create policy skills_admin_manage
on public.skills for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

create policy tour_categories_public_read
on public.tour_categories for select
to public
using (is_active = true);

create policy tour_categories_admin_manage
on public.tour_categories for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

-- =========================================================
-- GUIDE PROFILES
-- =========================================================
create policy guide_profiles_public_read
on public.guide_profiles for select
to public
using (deleted_at is null and visibility_status = 'visible');

create policy guide_profiles_owner_or_backoffice_read
on public.guide_profiles for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy guide_profiles_owner_insert
on public.guide_profiles for insert
to authenticated
with check (user_id = auth.uid());

create policy guide_profiles_owner_or_moderator_update
on public.guide_profiles for update
to authenticated
using (user_id = auth.uid() or public.is_moderator(auth.uid()))
with check (user_id = auth.uid() or public.is_moderator(auth.uid()));

create policy guide_languages_public_read
on public.guide_languages for select
to public
using (
    exists (
        select 1
        from public.guide_profiles gp
        where gp.id = guide_profile_id
          and gp.deleted_at is null
          and gp.visibility_status = 'visible'
    )
);

create policy guide_languages_owner_manage
on public.guide_languages for all
to authenticated
using (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_moderator(auth.uid()))
    )
)
with check (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_moderator(auth.uid()))
    )
);

create policy guide_skills_public_read
on public.guide_skills for select
to public
using (
    exists (
        select 1
        from public.guide_profiles gp
        where gp.id = guide_profile_id
          and gp.deleted_at is null
          and gp.visibility_status = 'visible'
    )
);

create policy guide_skills_owner_manage
on public.guide_skills for all
to authenticated
using (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_moderator(auth.uid()))
    )
)
with check (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_moderator(auth.uid()))
    )
);

-- =========================================================
-- TOURS
-- =========================================================
create policy tours_public_read
on public.tours for select
to public
using (
    deleted_at is null
    and business_status = 'published'
    and visibility_status = 'visible'
);

create policy tours_owner_or_backoffice_read
on public.tours for select
to authenticated
using (public.owns_tour(id, auth.uid()) or public.is_backoffice(auth.uid()));

create policy tours_owner_insert
on public.tours for insert
to authenticated
with check (public.owns_guide_profile(guide_profile_id, auth.uid()));

create policy tours_owner_or_moderator_update
on public.tours for update
to authenticated
using (public.owns_tour(id, auth.uid()) or public.is_moderator(auth.uid()))
with check (public.owns_tour(id, auth.uid()) or public.is_moderator(auth.uid()));

create policy tour_images_public_read
on public.tour_images for select
to public
using (
    exists (
        select 1 from public.tours t
        where t.id = tour_id
          and t.deleted_at is null
          and t.business_status = 'published'
          and t.visibility_status = 'visible'
    )
);

create policy tour_images_owner_or_moderator_manage
on public.tour_images for all
to authenticated
using (public.owns_tour(tour_id, auth.uid()) or public.is_moderator(auth.uid()))
with check (public.owns_tour(tour_id, auth.uid()) or public.is_moderator(auth.uid()));

create policy tour_locations_public_read
on public.tour_locations for select
to public
using (
    exists (
        select 1 from public.tours t
        where t.id = tour_id
          and t.deleted_at is null
          and t.business_status = 'published'
          and t.visibility_status = 'visible'
    )
);

create policy tour_locations_owner_or_moderator_manage
on public.tour_locations for all
to authenticated
using (public.owns_tour(tour_id, auth.uid()) or public.is_moderator(auth.uid()))
with check (public.owns_tour(tour_id, auth.uid()) or public.is_moderator(auth.uid()));

create policy tour_requests_requester_read
on public.tour_requests for select
to authenticated
using (
    user_id = auth.uid()
    or public.owns_tour(tour_id, auth.uid())
    or public.is_backoffice(auth.uid())
);

create policy tour_requests_requester_insert
on public.tour_requests for insert
to authenticated
with check (user_id = auth.uid());

create policy tour_requests_requester_cancel
on public.tour_requests for update
to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'cancelled_by_user');

create policy tour_requests_guide_manage
on public.tour_requests for update
to authenticated
using (public.owns_tour(tour_id, auth.uid()))
with check (
    public.owns_tour(tour_id, auth.uid())
    and processed_by_user_id = auth.uid()
    and status in ('approved', 'rejected', 'cancelled_by_guide', 'payment_pending')
);

create policy tour_requests_backoffice_read
on public.tour_requests for select
to authenticated
using (public.is_backoffice(auth.uid()));

create policy tour_reviews_public_read
on public.tour_reviews for select
to public
using (visibility_status = 'visible');

create policy tour_reviews_owner_read
on public.tour_reviews for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy tour_reviews_owner_insert
on public.tour_reviews for insert
to authenticated
with check (user_id = auth.uid());

create policy tour_reviews_owner_or_moderator_update
on public.tour_reviews for update
to authenticated
using (user_id = auth.uid() or public.is_moderator(auth.uid()))
with check (user_id = auth.uid() or public.is_moderator(auth.uid()));

create policy guide_reviews_public_read
on public.guide_reviews for select
to public
using (visibility_status = 'visible');

create policy guide_reviews_owner_read
on public.guide_reviews for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy guide_reviews_owner_insert
on public.guide_reviews for insert
to authenticated
with check (user_id = auth.uid());

create policy guide_reviews_owner_or_moderator_update
on public.guide_reviews for update
to authenticated
using (user_id = auth.uid() or public.is_moderator(auth.uid()))
with check (user_id = auth.uid() or public.is_moderator(auth.uid()));

-- =========================================================
-- COMPANION
-- =========================================================
create policy companion_posts_public_read
on public.companion_posts for select
to public
using (deleted_at is null and visibility_status = 'visible');

create policy companion_posts_owner_or_backoffice_read
on public.companion_posts for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy companion_posts_owner_insert
on public.companion_posts for insert
to authenticated
with check (user_id = auth.uid());

create policy companion_posts_owner_or_moderator_update
on public.companion_posts for update
to authenticated
using (user_id = auth.uid() or public.is_moderator(auth.uid()))
with check (user_id = auth.uid() or public.is_moderator(auth.uid()));

create policy companion_requests_requester_or_owner_read
on public.companion_requests for select
to authenticated
using (
    user_id = auth.uid()
    or public.owns_companion_post(post_id, auth.uid())
    or public.is_backoffice(auth.uid())
);

create policy companion_requests_requester_insert
on public.companion_requests for insert
to authenticated
with check (user_id = auth.uid());

create policy companion_requests_requester_cancel
on public.companion_requests for update
to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'cancelled_by_requester');

create policy companion_requests_post_owner_manage
on public.companion_requests for update
to authenticated
using (public.owns_companion_post(post_id, auth.uid()))
with check (
    public.owns_companion_post(post_id, auth.uid())
    and processed_by_user_id = auth.uid()
    and status in ('approved', 'rejected')
);

-- =========================================================
-- FAVORITES
-- =========================================================
create policy favorite_tours_owner_all
on public.favorite_tours for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy favorite_guides_owner_all
on public.favorite_guides for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- =========================================================
-- REPORTS
-- =========================================================
create policy reports_reporter_read
on public.reports for select
to authenticated
using (reporter_user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy reports_reporter_insert
on public.reports for insert
to authenticated
with check (reporter_user_id = auth.uid());

create policy reports_backoffice_update
on public.reports for update
to authenticated
using (public.is_backoffice(auth.uid()))
with check (public.is_backoffice(auth.uid()));

create policy report_history_reporter_or_backoffice_read
on public.report_processing_history for select
to authenticated
using (
    public.is_backoffice(auth.uid())
    or exists (
        select 1 from public.reports r
        where r.id = report_id
          and r.reporter_user_id = auth.uid()
    )
);

create policy report_history_backoffice_insert
on public.report_processing_history for insert
to authenticated
with check (public.is_backoffice(auth.uid()));

-- =========================================================
-- USER PREFERENCES / ACTIVITY
-- =========================================================
create policy user_activity_logs_owner_or_admin_read
on public.user_activity_logs for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy user_activity_logs_owner_insert
on public.user_activity_logs for insert
to authenticated
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy user_preferences_owner_all
on public.user_preferences for all
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy user_preferred_categories_owner_all
on public.user_preferred_categories for all
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

-- =========================================================
-- CONVERSATIONS / MESSAGES
-- =========================================================
create policy conversations_participant_read
on public.conversations for select
to authenticated
using (
    public.is_conversation_participant(id, auth.uid())
    or public.is_backoffice(auth.uid())
);

create policy conversations_creator_insert
on public.conversations for insert
to authenticated
with check (created_by_user_id = auth.uid());

create policy conversations_creator_or_admin_update
on public.conversations for update
to authenticated
using (created_by_user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (created_by_user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy conversation_participants_participant_read
on public.conversation_participants for select
to authenticated
using (
    public.is_conversation_participant(conversation_id, auth.uid())
    or public.is_backoffice(auth.uid())
);

create policy conversation_participants_creator_insert
on public.conversation_participants for insert
to authenticated
with check (
    user_id = auth.uid()
    or exists (
        select 1 from public.conversations c
        where c.id = conversation_id
          and (c.created_by_user_id = auth.uid() or public.is_backoffice(auth.uid()))
    )
);

create policy conversation_participants_self_update
on public.conversation_participants for update
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy messages_participant_read
on public.messages for select
to authenticated
using (
    public.is_conversation_participant(conversation_id, auth.uid())
    or public.is_backoffice(auth.uid())
);

create policy messages_participant_insert
on public.messages for insert
to authenticated
with check (
    sender_user_id = auth.uid()
    and public.is_conversation_participant(conversation_id, auth.uid())
);

create policy messages_sender_update
on public.messages for update
to authenticated
using (sender_user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (sender_user_id = auth.uid() or public.is_backoffice(auth.uid()));

-- =========================================================
-- GUIDE VERIFICATION / AVAILABILITY
-- =========================================================
create policy guide_verification_requests_owner_or_backoffice_read
on public.guide_verification_requests for select
to authenticated
using (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and gp.user_id = auth.uid()
    )
    or public.is_backoffice(auth.uid())
);

create policy guide_verification_requests_owner_insert
on public.guide_verification_requests for insert
to authenticated
with check (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and gp.user_id = auth.uid()
    )
);

create policy guide_verification_requests_backoffice_update
on public.guide_verification_requests for update
to authenticated
using (public.is_backoffice(auth.uid()))
with check (public.is_backoffice(auth.uid()));

create policy guide_verification_documents_owner_or_backoffice_read
on public.guide_verification_documents for select
to authenticated
using (
    public.is_backoffice(auth.uid())
    or exists (
        select 1
        from public.guide_verification_requests gvr
        join public.guide_profiles gp on gp.id = gvr.guide_profile_id
        where gvr.id = verification_request_id
          and gp.user_id = auth.uid()
    )
);

create policy guide_verification_documents_owner_insert
on public.guide_verification_documents for insert
to authenticated
with check (
    exists (
        select 1
        from public.guide_verification_requests gvr
        join public.guide_profiles gp on gp.id = gvr.guide_profile_id
        where gvr.id = verification_request_id
          and gp.user_id = auth.uid()
    )
);

create policy guide_verification_documents_backoffice_update
on public.guide_verification_documents for update
to authenticated
using (public.is_backoffice(auth.uid()))
with check (public.is_backoffice(auth.uid()));

create policy guide_availabilities_public_read
on public.guide_availabilities for select
to public
using (
    status = 'available'
    and exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and gp.deleted_at is null
          and gp.visibility_status = 'visible'
    )
);

create policy guide_availabilities_owner_or_backoffice_manage
on public.guide_availabilities for all
to authenticated
using (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_backoffice(auth.uid()))
    )
)
with check (
    exists (
        select 1 from public.guide_profiles gp
        where gp.id = guide_profile_id
          and (gp.user_id = auth.uid() or public.is_backoffice(auth.uid()))
    )
);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
create policy notifications_owner_read
on public.notifications for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy notifications_owner_update
on public.notifications for update
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy notifications_backoffice_insert
on public.notifications for insert
to authenticated
with check (public.is_backoffice(auth.uid()));

-- =========================================================
-- AI CHAT
-- =========================================================
create policy ai_chat_sessions_owner_all
on public.ai_chat_sessions for all
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()))
with check (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy ai_chat_messages_owner_all
on public.ai_chat_messages for all
to authenticated
using (
    public.is_backoffice(auth.uid())
    or exists (
        select 1 from public.ai_chat_sessions s
        where s.id = session_id
          and s.user_id = auth.uid()
    )
)
with check (
    public.is_backoffice(auth.uid())
    or exists (
        select 1 from public.ai_chat_sessions s
        where s.id = session_id
          and s.user_id = auth.uid()
    )
);

-- =========================================================
-- ACCOMMODATIONS
-- =========================================================
create policy partner_accommodations_public_read
on public.partner_accommodations for select
to public
using (status = 'active');

create policy partner_accommodations_admin_manage
on public.partner_accommodations for all
to authenticated
using (public.is_system_admin(auth.uid()))
with check (public.is_system_admin(auth.uid()));

create policy tour_accommodations_public_read
on public.tour_accommodations for select
to public
using (
    exists (
        select 1 from public.tours t
        where t.id = tour_id
          and t.deleted_at is null
          and t.business_status = 'published'
          and t.visibility_status = 'visible'
    )
);

create policy tour_accommodations_owner_or_admin_manage
on public.tour_accommodations for all
to authenticated
using (
    public.owns_tour(tour_id, auth.uid())
    or public.is_system_admin(auth.uid())
)
with check (
    public.owns_tour(tour_id, auth.uid())
    or public.is_system_admin(auth.uid())
);

-- =========================================================
-- PAYMENTS
-- =========================================================
create policy payment_transactions_owner_or_backoffice_read
on public.payment_transactions for select
to authenticated
using (
    user_id = auth.uid()
    or public.is_backoffice(auth.uid())
);

create policy payment_transactions_owner_insert
on public.payment_transactions for insert
to authenticated
with check (
    user_id = auth.uid()
    and public.owns_tour_request(tour_request_id, auth.uid())
);

create policy payment_transactions_backoffice_update
on public.payment_transactions for update
to authenticated
using (public.is_backoffice(auth.uid()))
with check (public.is_backoffice(auth.uid()));