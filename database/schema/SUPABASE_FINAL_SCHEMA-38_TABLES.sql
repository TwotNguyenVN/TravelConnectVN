-- =========================================================
-- SUPABASE FINAL SCHEMA - 38 TABLES
-- Website du lịch kết nối hướng dẫn viên, khách du lịch
-- và người tìm bạn đồng hành
-- =========================================================

begin;

-- =========================================================
-- 0) EXTENSIONS
-- =========================================================
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- =========================================================
-- 1) CORE TABLES
-- =========================================================

-- 1. users
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    phone text,
    avatar_url text,
    date_of_birth date,
    gender text check (gender is null or gender in ('male', 'female', 'other')),
    status text not null default 'active'
        check (status in ('active', 'suspended', 'locked')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_seen_at timestamptz,
    check (date_of_birth is null or date_of_birth <= current_date)
);

-- 2. roles
create table if not exists public.roles (
    role_code text primary key,
    description text not null,
    created_at timestamptz not null default now(),
    check (role_code in ('USER', 'GUIDE', 'SYSTEM_ADMIN', 'CONTENT_MODERATOR', 'SUPPORT_STAFF'))
);

-- 3. user_roles
create table if not exists public.user_roles (
    user_id uuid not null references public.users(id) on delete cascade,
    role_code text not null references public.roles(role_code) on delete restrict,
    assigned_by uuid references public.users(id) on delete set null,
    assigned_at timestamptz not null default now(),
    primary key (user_id, role_code)
);

-- 4. languages
create table if not exists public.languages (
    id bigint generated always as identity primary key,
    name text not null unique,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- 5. skills
create table if not exists public.skills (
    id bigint generated always as identity primary key,
    name text not null unique,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- 6. tour_categories
create table if not exists public.tour_categories (
    id bigint generated always as identity primary key,
    name text not null unique,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- 7. guide_profiles
create table if not exists public.guide_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references public.users(id) on delete cascade,
    bio text,
    years_of_experience integer not null default 0
        check (years_of_experience >= 0),
    working_area text,
    avatar_url text,
    verification_status text not null default 'not_submitted'
        check (verification_status in ('not_submitted', 'pending', 'approved', 'rejected')),
    visibility_status text not null default 'visible'
        check (visibility_status in ('visible', 'hidden', 'flagged')),
    is_accepting_tours boolean not null default true,
    is_deleted boolean not null default false,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 8. guide_languages
create table if not exists public.guide_languages (
    guide_profile_id uuid not null references public.guide_profiles(id) on delete cascade,
    language_id bigint not null references public.languages(id) on delete restrict,
    primary key (guide_profile_id, language_id)
);

-- 9. guide_skills
create table if not exists public.guide_skills (
    guide_profile_id uuid not null references public.guide_profiles(id) on delete cascade,
    skill_id bigint not null references public.skills(id) on delete restrict,
    primary key (guide_profile_id, skill_id)
);

-- 10. tours
create table if not exists public.tours (
    id uuid primary key default gen_random_uuid(),
    guide_profile_id uuid not null references public.guide_profiles(id) on delete restrict,
    category_id bigint references public.tour_categories(id) on delete set null,
    title text not null,
    province text not null,
    district text,
    start_date date not null,
    end_date date not null,
    price numeric(12,2) not null check (price >= 0),
    currency_code char(3) not null default 'VND',
    max_participants integer not null check (max_participants > 0),
    meet_point text,
    meet_latitude numeric(9,6)
        check (meet_latitude is null or (meet_latitude between -90 and 90)),
    meet_longitude numeric(9,6)
        check (meet_longitude is null or (meet_longitude between -180 and 180)),
    description text,
    participant_requirements text,
    business_status text not null default 'draft'
        check (business_status in ('draft', 'published', 'closed', 'cancelled')),
    visibility_status text not null default 'visible'
        check (visibility_status in ('visible', 'hidden', 'flagged')),
    published_at timestamptz,
    is_deleted boolean not null default false,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_date >= start_date)
);

-- 11. tour_images
create table if not exists public.tour_images (
    id uuid primary key default gen_random_uuid(),
    tour_id uuid not null references public.tours(id) on delete cascade,
    image_url text not null,
    caption text,
    sort_order integer not null default 0,
    is_cover boolean not null default false,
    created_at timestamptz not null default now()
);

-- 12. tour_locations
create table if not exists public.tour_locations (
    id uuid primary key default gen_random_uuid(),
    tour_id uuid not null references public.tours(id) on delete cascade,
    sequence_no integer not null check (sequence_no > 0),
    location_name text not null,
    address text,
    latitude numeric(9,6)
        check (latitude is null or (latitude between -90 and 90)),
    longitude numeric(9,6)
        check (longitude is null or (longitude between -180 and 180)),
    visit_time timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    unique (tour_id, sequence_no)
);

-- 13. tour_requests
create table if not exists public.tour_requests (
    id uuid primary key default gen_random_uuid(),
    tour_id uuid not null references public.tours(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    participant_count integer not null default 1 check (participant_count > 0),
    note text,
    response_note text,
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected', 'cancelled_by_user', 'cancelled_by_guide', 'payment_pending', 'paid')),
    requested_at timestamptz not null default now(),
    processed_at timestamptz,
    processed_by_user_id uuid references public.users(id) on delete set null,
    cancelled_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 14. tour_reviews
create table if not exists public.tour_reviews (
    id uuid primary key default gen_random_uuid(),
    tour_id uuid not null references public.tours(id) on delete restrict,
    tour_request_id uuid not null unique references public.tour_requests(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    rating integer not null check (rating between 1 and 5),
    comment text,
    visibility_status text not null default 'visible'
        check (visibility_status in ('visible', 'hidden', 'flagged')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 15. guide_reviews
create table if not exists public.guide_reviews (
    id uuid primary key default gen_random_uuid(),
    guide_profile_id uuid not null references public.guide_profiles(id) on delete restrict,
    tour_id uuid not null references public.tours(id) on delete restrict,
    tour_request_id uuid not null unique references public.tour_requests(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    rating integer not null check (rating between 1 and 5),
    comment text,
    visibility_status text not null default 'visible'
        check (visibility_status in ('visible', 'hidden', 'flagged')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 16. companion_posts
create table if not exists public.companion_posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    title text not null,
    destination text not null,
    start_date date not null,
    end_date date not null,
    estimated_cost numeric(12,2) check (estimated_cost is null or estimated_cost >= 0),
    currency_code char(3) not null default 'VND',
    expected_members integer not null check (expected_members > 0),
    description text,
    requirements text,
    business_status text not null default 'open'
        check (business_status in ('open', 'closed', 'cancelled')),
    visibility_status text not null default 'visible'
        check (visibility_status in ('visible', 'hidden', 'flagged')),
    is_deleted boolean not null default false,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_date >= start_date)
);

-- 17. companion_requests
create table if not exists public.companion_requests (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references public.companion_posts(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    message text,
    response_note text,
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected', 'cancelled_by_requester')),
    requested_at timestamptz not null default now(),
    processed_at timestamptz,
    processed_by_user_id uuid references public.users(id) on delete set null,
    cancelled_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 18. favorite_tours
create table if not exists public.favorite_tours (
    user_id uuid not null references public.users(id) on delete cascade,
    tour_id uuid not null references public.tours(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, tour_id)
);

-- 19. favorite_guides
create table if not exists public.favorite_guides (
    user_id uuid not null references public.users(id) on delete cascade,
    guide_profile_id uuid not null references public.guide_profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, guide_profile_id)
);

-- 20. reports
create table if not exists public.reports (
    id uuid primary key default gen_random_uuid(),
    reporter_user_id uuid not null references public.users(id) on delete restrict,
    target_type text not null
        check (target_type in ('tour', 'companion_post', 'user', 'guide_profile', 'tour_review', 'guide_review')),
    tour_id uuid references public.tours(id) on delete set null,
    companion_post_id uuid references public.companion_posts(id) on delete set null,
    reported_user_id uuid references public.users(id) on delete set null,
    guide_profile_id uuid references public.guide_profiles(id) on delete set null,
    tour_review_id uuid references public.tour_reviews(id) on delete set null,
    guide_review_id uuid references public.guide_reviews(id) on delete set null,
    reason text not null,
    description text,
    status text not null default 'open'
        check (status in ('open', 'assigned', 'in_review', 'resolved', 'rejected')),
    assigned_to_user_id uuid references public.users(id) on delete set null,
    processed_by_user_id uuid references public.users(id) on delete set null,
    processed_at timestamptz,
    resolution_note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
        (
            target_type = 'tour'
            and tour_id is not null
            and companion_post_id is null
            and reported_user_id is null
            and guide_profile_id is null
            and tour_review_id is null
            and guide_review_id is null
        ) or (
            target_type = 'companion_post'
            and tour_id is null
            and companion_post_id is not null
            and reported_user_id is null
            and guide_profile_id is null
            and tour_review_id is null
            and guide_review_id is null
        ) or (
            target_type = 'user'
            and tour_id is null
            and companion_post_id is null
            and reported_user_id is not null
            and guide_profile_id is null
            and tour_review_id is null
            and guide_review_id is null
        ) or (
            target_type = 'guide_profile'
            and tour_id is null
            and companion_post_id is null
            and reported_user_id is null
            and guide_profile_id is not null
            and tour_review_id is null
            and guide_review_id is null
        ) or (
            target_type = 'tour_review'
            and tour_id is null
            and companion_post_id is null
            and reported_user_id is null
            and guide_profile_id is null
            and tour_review_id is not null
            and guide_review_id is null
        ) or (
            target_type = 'guide_review'
            and tour_id is null
            and companion_post_id is null
            and reported_user_id is null
            and guide_profile_id is null
            and tour_review_id is null
            and guide_review_id is not null
        )
    )
);

-- 21. report_processing_history
create table if not exists public.report_processing_history (
    id uuid primary key default gen_random_uuid(),
    report_id uuid not null references public.reports(id) on delete cascade,
    action_by_user_id uuid references public.users(id) on delete set null,
    action_type text not null
        check (action_type in ('created', 'assigned', 'status_changed', 'note_added', 'resolved', 'rejected', 'hidden_target', 'restored_target')),
    old_status text,
    new_status text,
    note text,
    created_at timestamptz not null default now()
);

-- 22. user_activity_logs
create table if not exists public.user_activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    activity_type text not null,
    entity_type text,
    entity_id uuid,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- 23. user_preferences
create table if not exists public.user_preferences (
    user_id uuid primary key references public.users(id) on delete cascade,
    budget_min numeric(12,2) check (budget_min is null or budget_min >= 0),
    budget_max numeric(12,2) check (budget_max is null or budget_max >= 0),
    preferred_trip_style text,
    preferred_language_id bigint references public.languages(id) on delete set null,
    extra_preferences jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now(),
    check (budget_min is null or budget_max is null or budget_max >= budget_min)
);

-- 24. user_preferred_categories
create table if not exists public.user_preferred_categories (
    user_id uuid not null references public.users(id) on delete cascade,
    category_id bigint not null references public.tour_categories(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, category_id)
);

-- 25. conversations
create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    conversation_type text not null
        check (conversation_type in ('direct', 'group_companion')),
    title text,
    created_by_user_id uuid references public.users(id) on delete set null,
    related_tour_id uuid references public.tours(id) on delete set null,
    related_companion_post_id uuid references public.companion_posts(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
        (conversation_type = 'direct')
        or
        (conversation_type = 'group_companion' and related_companion_post_id is not null)
    )
);

-- 26. conversation_participants
create table if not exists public.conversation_participants (
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    joined_at timestamptz not null default now(),
    left_at timestamptz,
    is_muted boolean not null default false,
    last_read_at timestamptz,
    primary key (conversation_id, user_id)
);

-- 27. messages
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender_user_id uuid not null references public.users(id) on delete restrict,
    content text not null,
    message_type text not null default 'text'
        check (message_type in ('text', 'image', 'file', 'system')),
    attachment_url text,
    sent_at timestamptz not null default now(),
    edited_at timestamptz,
    is_deleted boolean not null default false,
    deleted_at timestamptz
);

-- 28. guide_verification_requests
create table if not exists public.guide_verification_requests (
    id uuid primary key default gen_random_uuid(),
    guide_profile_id uuid not null references public.guide_profiles(id) on delete cascade,
    submitted_at timestamptz not null default now(),
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected')),
    submission_note text,
    processed_by_user_id uuid references public.users(id) on delete set null,
    processed_at timestamptz,
    result_note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 29. guide_verification_documents
create table if not exists public.guide_verification_documents (
    id uuid primary key default gen_random_uuid(),
    verification_request_id uuid not null references public.guide_verification_requests(id) on delete cascade,
    document_type text not null
        check (document_type in ('national_id', 'tour_guide_card', 'certificate', 'license', 'other')),
    file_url text not null,
    uploaded_at timestamptz not null default now(),
    status text not null default 'submitted'
        check (status in ('submitted', 'accepted', 'rejected')),
    note text
);

-- 30. guide_availabilities
create table if not exists public.guide_availabilities (
    id uuid primary key default gen_random_uuid(),
    guide_profile_id uuid not null references public.guide_profiles(id) on delete cascade,
    available_date date not null,
    start_time time not null,
    end_time time not null,
    status text not null default 'available'
        check (status in ('available', 'unavailable', 'blocked')),
    note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_time > start_time),
    unique (guide_profile_id, available_date, start_time, end_time)
);

-- 31. notifications
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    notification_type text not null
        check (notification_type in ('system', 'tour_request', 'companion_request', 'message', 'report', 'verification', 'payment')),
    title text not null,
    content text not null,
    entity_type text,
    entity_id uuid,
    payload jsonb not null default '{}'::jsonb,
    is_read boolean not null default false,
    created_at timestamptz not null default now(),
    read_at timestamptz
);

-- 32. ai_chat_sessions
create table if not exists public.ai_chat_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    status text not null default 'active'
        check (status in ('active', 'closed')),
    context jsonb not null default '{}'::jsonb,
    started_at timestamptz not null default now(),
    last_interaction_at timestamptz not null default now()
);

-- 33. ai_chat_messages
create table if not exists public.ai_chat_messages (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
    sender_type text not null
        check (sender_type in ('user', 'assistant', 'system')),
    content text not null,
    model_name text,
    token_usage integer,
    created_at timestamptz not null default now()
);

-- 34. partner_accommodations
create table if not exists public.partner_accommodations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    accommodation_type text not null
        check (accommodation_type in ('hotel', 'homestay', 'resort', 'hostel', 'apartment', 'other')),
    address text not null,
    province text not null,
    contact_phone text,
    website_url text,
    image_url text,
    status text not null default 'active'
        check (status in ('active', 'inactive')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 35. tour_accommodations
create table if not exists public.tour_accommodations (
    tour_id uuid not null references public.tours(id) on delete cascade,
    accommodation_id uuid not null references public.partner_accommodations(id) on delete cascade,
    check_in_date date,
    check_out_date date,
    notes text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    primary key (tour_id, accommodation_id),
    check (check_in_date is null or check_out_date is null or check_out_date >= check_in_date)
);

-- 36. payment_transactions
create table if not exists public.payment_transactions (
    id uuid primary key default gen_random_uuid(),
    tour_request_id uuid not null references public.tour_requests(id) on delete restrict,
    user_id uuid not null references public.users(id) on delete restrict,
    amount numeric(12,2) not null check (amount >= 0),
    currency_code char(3) not null default 'VND',
    payment_method text not null
        check (payment_method in ('sandbox', 'vnpay', 'momo', 'bank_transfer', 'cash')),
    status text not null default 'pending'
        check (status in ('pending', 'processing', 'paid', 'failed', 'expired', 'refunded', 'cancelled')),
    transaction_code text not null unique,
    provider_transaction_code text,
    gateway_response jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    paid_at timestamptz,
    expires_at timestamptz
);

-- 37. admin_activity_logs
create table if not exists public.admin_activity_logs (
    id uuid primary key default gen_random_uuid(),
    actor_user_id uuid references public.users(id) on delete set null,
    actor_role_code text references public.roles(role_code) on delete set null,
    module_name text not null
        check (
            module_name in (
                'user_management',
                'role_management',
                'guide_verification',
                'guide_profile_moderation',
                'tour_moderation',
                'companion_moderation',
                'review_moderation',
                'report_handling',
                'payment_management',
                'system_dashboard',
                'system_other'
            )
        ),
    entity_type text not null
        check (
            entity_type in (
                'users',
                'user_roles',
                'guide_profiles',
                'guide_verification_requests',
                'tours',
                'companion_posts',
                'tour_reviews',
                'guide_reviews',
                'reports',
                'payment_transactions',
                'notifications',
                'other'
            )
        ),
    entity_pk text,
    action_type text not null
        check (
            action_type in (
                'create',
                'update',
                'soft_delete',
                'restore',
                'hide',
                'unhide',
                'flag',
                'lock_account',
                'unlock_account',
                'assign_role',
                'revoke_role',
                'approve',
                'reject',
                'assign_report',
                'resolve_report',
                'change_status',
                'export_report',
                'other'
            )
        ),
    reason text,
    old_data jsonb not null default '{}'::jsonb,
    new_data jsonb not null default '{}'::jsonb,
    metadata jsonb not null default '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz not null default now()
);

-- 38. user_role_change_logs
create table if not exists public.user_role_change_logs (
    id uuid primary key default gen_random_uuid(),
    target_user_id uuid not null references public.users(id) on delete cascade,
    changed_role_code text not null references public.roles(role_code) on delete restrict,
    action_type text not null
        check (action_type in ('assign', 'revoke')),
    changed_by_user_id uuid references public.users(id) on delete set null,
    old_snapshot jsonb not null default '{}'::jsonb,
    new_snapshot jsonb not null default '{}'::jsonb,
    note text,
    created_at timestamptz not null default now()
);

-- =========================================================
-- 2) REQUIRED SEED FOR ROLES
-- =========================================================
insert into public.roles (role_code, description)
values
    ('USER', 'End user / tourist'),
    ('GUIDE', 'Local guide'),
    ('SYSTEM_ADMIN', 'Full system administrator'),
    ('CONTENT_MODERATOR', 'Moderates content and visibility'),
    ('SUPPORT_STAFF', 'Handles reports and complaints')
on conflict (role_code) do update
set description = excluded.description;

-- =========================================================
-- 3) INDEXES
-- =========================================================

create unique index if not exists uq_users_email_lower on public.users (lower(email));
create unique index if not exists uq_users_phone_not_null on public.users (phone) where phone is not null;

create index if not exists idx_user_roles_role_code on public.user_roles (role_code);

create index if not exists idx_guide_profiles_user_id on public.guide_profiles (user_id);
create index if not exists idx_guide_profiles_visibility on public.guide_profiles (visibility_status, verification_status, is_deleted);

create index if not exists idx_tours_guide on public.tours (guide_profile_id);
create index if not exists idx_tours_category on public.tours (category_id);
create index if not exists idx_tours_public_search on public.tours (province, start_date, price, business_status, visibility_status);
create index if not exists idx_tours_created_at on public.tours (created_at desc);
create index if not exists idx_tours_title_trgm on public.tours using gin (title gin_trgm_ops);
create index if not exists idx_tours_province_trgm on public.tours using gin (province gin_trgm_ops);

create unique index if not exists uq_tour_cover_image on public.tour_images (tour_id) where is_cover = true;
create index if not exists idx_tour_images_tour_id on public.tour_images (tour_id, sort_order);

create index if not exists idx_tour_locations_tour_id on public.tour_locations (tour_id, sequence_no);

create index if not exists idx_tour_requests_user_status on public.tour_requests (user_id, status, requested_at desc);
create index if not exists idx_tour_requests_tour_status on public.tour_requests (tour_id, status, requested_at desc);
create unique index if not exists uq_active_tour_request_per_user
    on public.tour_requests (tour_id, user_id)
    where status in ('pending', 'approved', 'payment_pending', 'paid');

create index if not exists idx_tour_reviews_tour on public.tour_reviews (tour_id, created_at desc);
create index if not exists idx_guide_reviews_guide on public.guide_reviews (guide_profile_id, created_at desc);

create index if not exists idx_companion_posts_public_search
    on public.companion_posts (destination, start_date, estimated_cost, business_status, visibility_status);
create index if not exists idx_companion_posts_title_trgm on public.companion_posts using gin (title gin_trgm_ops);
create index if not exists idx_companion_posts_destination_trgm on public.companion_posts using gin (destination gin_trgm_ops);

create index if not exists idx_companion_requests_user_status on public.companion_requests (user_id, status, requested_at desc);
create index if not exists idx_companion_requests_post_status on public.companion_requests (post_id, status, requested_at desc);
create unique index if not exists uq_active_companion_request_per_user
    on public.companion_requests (post_id, user_id)
    where status in ('pending', 'approved');

create index if not exists idx_reports_status_created on public.reports (status, created_at desc);
create index if not exists idx_reports_assigned_to on public.reports (assigned_to_user_id, status);
create index if not exists idx_report_history_report on public.report_processing_history (report_id, created_at desc);

create index if not exists idx_user_activity_logs_user_created on public.user_activity_logs (user_id, created_at desc);
create index if not exists idx_notifications_user_read on public.notifications (user_id, is_read, created_at desc);

create unique index if not exists uq_group_conversation_per_post
    on public.conversations (related_companion_post_id)
    where conversation_type = 'group_companion';

create index if not exists idx_conversation_participants_user on public.conversation_participants (user_id, joined_at desc);
create index if not exists idx_messages_conversation_sent on public.messages (conversation_id, sent_at desc);

create index if not exists idx_guide_verification_requests_guide on public.guide_verification_requests (guide_profile_id, submitted_at desc);
create index if not exists idx_guide_verification_documents_request on public.guide_verification_documents (verification_request_id);

create index if not exists idx_guide_availabilities_guide_date on public.guide_availabilities (guide_profile_id, available_date);

create index if not exists idx_ai_chat_sessions_user on public.ai_chat_sessions (user_id, last_interaction_at desc);
create index if not exists idx_ai_chat_messages_session on public.ai_chat_messages (session_id, created_at);

create index if not exists idx_partner_accommodations_status on public.partner_accommodations (status, province);
create index if not exists idx_tour_accommodations_tour on public.tour_accommodations (tour_id, sort_order);

create index if not exists idx_payment_transactions_user_status on public.payment_transactions (user_id, status, created_at desc);
create index if not exists idx_payment_transactions_request_status on public.payment_transactions (tour_request_id, status, created_at desc);

create index if not exists idx_admin_activity_logs_actor_created
    on public.admin_activity_logs (actor_user_id, created_at desc);

create index if not exists idx_admin_activity_logs_module_created
    on public.admin_activity_logs (module_name, created_at desc);

create index if not exists idx_admin_activity_logs_entity
    on public.admin_activity_logs (entity_type, entity_pk, created_at desc);

create index if not exists idx_user_role_change_logs_target_created
    on public.user_role_change_logs (target_user_id, created_at desc);

create index if not exists idx_user_role_change_logs_actor_created
    on public.user_role_change_logs (changed_by_user_id, created_at desc);

create index if not exists idx_user_role_change_logs_role_created
    on public.user_role_change_logs (changed_role_code, created_at desc);

-- =========================================================
-- 4) HELPER FUNCTIONS
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.has_role(_user_id uuid, _roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select case
        when _user_id is null then false
        else exists (
            select 1
            from public.user_roles ur
            where ur.user_id = _user_id
              and ur.role_code = any(_roles)
        )
    end;
$$;

create or replace function public.is_system_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.has_role(_user_id, array['SYSTEM_ADMIN']);
$$;

create or replace function public.is_moderator(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.has_role(_user_id, array['SYSTEM_ADMIN', 'CONTENT_MODERATOR']);
$$;

create or replace function public.is_backoffice(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.has_role(_user_id, array['SYSTEM_ADMIN', 'CONTENT_MODERATOR', 'SUPPORT_STAFF']);
$$;

create or replace function public.owns_guide_profile(_guide_profile_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.guide_profiles gp
        where gp.id = _guide_profile_id
          and gp.user_id = _user_id
    );
$$;

create or replace function public.owns_tour(_tour_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.tours t
        join public.guide_profiles gp on gp.id = t.guide_profile_id
        where t.id = _tour_id
          and gp.user_id = _user_id
    );
$$;

create or replace function public.owns_companion_post(_post_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.companion_posts cp
        where cp.id = _post_id
          and cp.user_id = _user_id
    );
$$;

create or replace function public.owns_tour_request(_tour_request_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.tour_requests tr
        where tr.id = _tour_request_id
          and tr.user_id = _user_id
    );
$$;

create or replace function public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.conversation_participants cp
        where cp.conversation_id = _conversation_id
          and cp.user_id = _user_id
          and cp.left_at is null
    );
$$;

-- =========================================================
-- 5) AUTH SYNC FUNCTIONS
-- =========================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.users (
        id,
        email,
        full_name,
        avatar_url
    )
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
        new.raw_user_meta_data ->> 'avatar_url'
    )
    on conflict (id) do nothing;

    insert into public.user_roles (user_id, role_code)
    values (new.id, 'USER')
    on conflict do nothing;

    return new;
end;
$$;

create or replace function public.handle_updated_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.users
    set
        email = new.email,
        full_name = coalesce(new.raw_user_meta_data ->> 'full_name', public.users.full_name),
        avatar_url = coalesce(new.raw_user_meta_data ->> 'avatar_url', public.users.avatar_url),
        updated_at = now()
    where id = new.id;

    return new;
end;
$$;

-- =========================================================
-- 6) BUSINESS FUNCTIONS
-- =========================================================

create or replace function public.ensure_guide_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.user_roles (user_id, role_code)
    values (new.user_id, 'GUIDE')
    on conflict do nothing;

    return new;
end;
$$;

create or replace function public.sync_guide_verification_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.guide_profiles
    set
        verification_status = case
            when new.status = 'pending' then 'pending'
            when new.status = 'approved' then 'approved'
            when new.status = 'rejected' then 'rejected'
            else verification_status
        end,
        updated_at = now()
    where id = new.guide_profile_id;

    return new;
end;
$$;

create or replace function public.validate_tour_request()
returns trigger
language plpgsql
set search_path = public
as $$
declare
    v_guide_user_id uuid;
    v_max_participants integer;
    v_reserved integer;
begin
    select gp.user_id, t.max_participants
    into v_guide_user_id, v_max_participants
    from public.tours t
    join public.guide_profiles gp on gp.id = t.guide_profile_id
    where t.id = new.tour_id
    for update;

    if v_guide_user_id is null then
        raise exception 'Tour not found';
    end if;

    if new.user_id = v_guide_user_id then
        raise exception 'Guide cannot request own tour';
    end if;

    if new.status in ('approved', 'payment_pending', 'paid') then
        select coalesce(sum(tr.participant_count), 0)
        into v_reserved
        from public.tour_requests tr
        where tr.tour_id = new.tour_id
          and tr.status in ('approved', 'payment_pending', 'paid')
          and (TG_OP = 'INSERT' or tr.id <> new.id);

        if v_reserved + new.participant_count > v_max_participants then
            raise exception 'Tour capacity exceeded';
        end if;
    end if;

    if new.status in ('approved', 'rejected', 'payment_pending', 'cancelled_by_guide')
       and new.processed_by_user_id is not null
       and new.processed_at is null then
        new.processed_at = now();
    end if;

    if new.status = 'cancelled_by_user' and new.cancelled_at is null then
        new.cancelled_at = now();
    end if;

    return new;
end;
$$;

create or replace function public.validate_companion_request()
returns trigger
language plpgsql
set search_path = public
as $$
declare
    v_owner_user_id uuid;
    v_expected_members integer;
    v_approved_count integer;
begin
    select cp.user_id, cp.expected_members
    into v_owner_user_id, v_expected_members
    from public.companion_posts cp
    where cp.id = new.post_id
    for update;

    if v_owner_user_id is null then
        raise exception 'Companion post not found';
    end if;

    if new.user_id = v_owner_user_id then
        raise exception 'Post owner cannot request own companion post';
    end if;

    if new.status = 'approved' then
        select count(*)
        into v_approved_count
        from public.companion_requests cr
        where cr.post_id = new.post_id
          and cr.status = 'approved'
          and (TG_OP = 'INSERT' or cr.id <> new.id);

        if v_approved_count + 1 > v_expected_members then
            raise exception 'Companion post capacity exceeded';
        end if;
    end if;

    if new.status in ('approved', 'rejected')
       and new.processed_by_user_id is not null
       and new.processed_at is null then
        new.processed_at = now();
    end if;

    if new.status = 'cancelled_by_requester' and new.cancelled_at is null then
        new.cancelled_at = now();
    end if;

    return new;
end;
$$;

create or replace function public.validate_tour_review()
returns trigger
language plpgsql
set search_path = public
as $$
declare
    v_user_id uuid;
    v_tour_id uuid;
    v_status text;
    v_tour_end date;
begin
    select tr.user_id, tr.tour_id, tr.status, t.end_date
    into v_user_id, v_tour_id, v_status, v_tour_end
    from public.tour_requests tr
    join public.tours t on t.id = tr.tour_id
    where tr.id = new.tour_request_id;

    if v_user_id is null then
        raise exception 'Invalid tour_request_id';
    end if;

    if v_user_id <> new.user_id then
        raise exception 'User is not owner of the tour request';
    end if;

    if v_tour_id <> new.tour_id then
        raise exception 'tour_id does not match tour_request';
    end if;

    if v_status not in ('approved', 'payment_pending', 'paid') then
        raise exception 'Tour request is not eligible for review';
    end if;

    if current_date < v_tour_end then
        raise exception 'Tour has not ended yet';
    end if;

    return new;
end;
$$;

create or replace function public.validate_guide_review()
returns trigger
language plpgsql
set search_path = public
as $$
declare
    v_user_id uuid;
    v_tour_id uuid;
    v_status text;
    v_tour_end date;
    v_guide_profile_id uuid;
begin
    select tr.user_id, tr.tour_id, tr.status, t.end_date, t.guide_profile_id
    into v_user_id, v_tour_id, v_status, v_tour_end, v_guide_profile_id
    from public.tour_requests tr
    join public.tours t on t.id = tr.tour_id
    where tr.id = new.tour_request_id;

    if v_user_id is null then
        raise exception 'Invalid tour_request_id';
    end if;

    if v_user_id <> new.user_id then
        raise exception 'User is not owner of the tour request';
    end if;

    if v_tour_id <> new.tour_id then
        raise exception 'tour_id does not match tour_request';
    end if;

    if v_guide_profile_id <> new.guide_profile_id then
        raise exception 'guide_profile_id does not match the tour guide';
    end if;

    if v_status not in ('approved', 'payment_pending', 'paid') then
        raise exception 'Tour request is not eligible for review';
    end if;

    if current_date < v_tour_end then
        raise exception 'Tour has not ended yet';
    end if;

    return new;
end;
$$;

create or replace function public.sync_notification_read_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    if new.is_read = true and coalesce(old.is_read, false) = false and new.read_at is null then
        new.read_at = now();
    elsif new.is_read = false then
        new.read_at = null;
    end if;

    return new;
end;
$$;

create or replace function public.log_report_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.report_processing_history (
        report_id,
        action_by_user_id,
        action_type,
        old_status,
        new_status,
        note
    )
    values (
        new.id,
        new.reporter_user_id,
        'created',
        null,
        new.status,
        coalesce(new.description, 'Report created')
    );

    return new;
end;
$$;

create or replace function public.log_report_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if old.status is distinct from new.status then
        insert into public.report_processing_history (
            report_id,
            action_by_user_id,
            action_type,
            old_status,
            new_status,
            note
        )
        values (
            new.id,
            coalesce(new.processed_by_user_id, auth.uid()),
            case
                when new.status = 'resolved' then 'resolved'
                when new.status = 'rejected' then 'rejected'
                else 'status_changed'
            end,
            old.status,
            new.status,
            coalesce(new.resolution_note, 'Report status updated')
        );
    elsif old.assigned_to_user_id is distinct from new.assigned_to_user_id then
        insert into public.report_processing_history (
            report_id,
            action_by_user_id,
            action_type,
            old_status,
            new_status,
            note
        )
        values (
            new.id,
            coalesce(auth.uid(), new.assigned_to_user_id),
            'assigned',
            old.status,
            new.status,
            'Report assigned to staff'
        );
    elsif old.resolution_note is distinct from new.resolution_note then
        insert into public.report_processing_history (
            report_id,
            action_by_user_id,
            action_type,
            old_status,
            new_status,
            note
        )
        values (
            new.id,
            coalesce(new.processed_by_user_id, auth.uid()),
            'note_added',
            old.status,
            new.status,
            new.resolution_note
        );
    end if;

    return new;
end;
$$;

create or replace function public.log_user_role_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.user_role_change_logs (
        target_user_id,
        changed_role_code,
        action_type,
        changed_by_user_id,
        old_snapshot,
        new_snapshot,
        note
    )
    values (
        new.user_id,
        new.role_code,
        'assign',
        coalesce(new.assigned_by, auth.uid()),
        '{}'::jsonb,
        jsonb_build_object(
            'user_id', new.user_id,
            'role_code', new.role_code,
            'assigned_at', new.assigned_at
        ),
        'Role assigned'
    );

    return new;
end;
$$;

create or replace function public.log_user_role_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.user_role_change_logs (
        target_user_id,
        changed_role_code,
        action_type,
        changed_by_user_id,
        old_snapshot,
        new_snapshot,
        note
    )
    values (
        old.user_id,
        old.role_code,
        'revoke',
        auth.uid(),
        jsonb_build_object(
            'user_id', old.user_id,
            'role_code', old.role_code,
            'assigned_at', old.assigned_at
        ),
        '{}'::jsonb,
        'Role revoked'
    );

    return old;
end;
$$;

create or replace function public.write_admin_activity_log(
    p_actor_role_code text,
    p_module_name text,
    p_entity_type text,
    p_entity_pk text,
    p_action_type text,
    p_reason text default null,
    p_old_data jsonb default '{}'::jsonb,
    p_new_data jsonb default '{}'::jsonb,
    p_metadata jsonb default '{}'::jsonb,
    p_ip_address inet default null,
    p_user_agent text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_id uuid;
begin
    if not public.is_backoffice(auth.uid()) then
        raise exception 'Only backoffice users can write admin activity logs';
    end if;

    insert into public.admin_activity_logs (
        actor_user_id,
        actor_role_code,
        module_name,
        entity_type,
        entity_pk,
        action_type,
        reason,
        old_data,
        new_data,
        metadata,
        ip_address,
        user_agent
    )
    values (
        auth.uid(),
        p_actor_role_code,
        p_module_name,
        p_entity_type,
        p_entity_pk,
        p_action_type,
        p_reason,
        coalesce(p_old_data, '{}'::jsonb),
        coalesce(p_new_data, '{}'::jsonb),
        coalesce(p_metadata, '{}'::jsonb),
        p_ip_address,
        p_user_agent
    )
    returning id into v_id;

    return v_id;
end;
$$;

-- =========================================================
-- 7) TRIGGERS
-- =========================================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_updated_auth_user();

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_guide_profiles_updated_at on public.guide_profiles;
create trigger trg_guide_profiles_updated_at
before update on public.guide_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_tours_updated_at on public.tours;
create trigger trg_tours_updated_at
before update on public.tours
for each row execute function public.set_updated_at();

drop trigger if exists trg_tour_requests_updated_at on public.tour_requests;
create trigger trg_tour_requests_updated_at
before update on public.tour_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_tour_reviews_updated_at on public.tour_reviews;
create trigger trg_tour_reviews_updated_at
before update on public.tour_reviews
for each row execute function public.set_updated_at();

drop trigger if exists trg_guide_reviews_updated_at on public.guide_reviews;
create trigger trg_guide_reviews_updated_at
before update on public.guide_reviews
for each row execute function public.set_updated_at();

drop trigger if exists trg_companion_posts_updated_at on public.companion_posts;
create trigger trg_companion_posts_updated_at
before update on public.companion_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_companion_requests_updated_at on public.companion_requests;
create trigger trg_companion_requests_updated_at
before update on public.companion_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_reports_updated_at on public.reports;
create trigger trg_reports_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_preferences_updated_at on public.user_preferences;
create trigger trg_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists trg_guide_verification_requests_updated_at on public.guide_verification_requests;
create trigger trg_guide_verification_requests_updated_at
before update on public.guide_verification_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_guide_availabilities_updated_at on public.guide_availabilities;
create trigger trg_guide_availabilities_updated_at
before update on public.guide_availabilities
for each row execute function public.set_updated_at();

drop trigger if exists trg_partner_accommodations_updated_at on public.partner_accommodations;
create trigger trg_partner_accommodations_updated_at
before update on public.partner_accommodations
for each row execute function public.set_updated_at();

drop trigger if exists trg_ensure_guide_role on public.guide_profiles;
create trigger trg_ensure_guide_role
after insert on public.guide_profiles
for each row execute function public.ensure_guide_role();

drop trigger if exists trg_sync_guide_verification_status on public.guide_verification_requests;
create trigger trg_sync_guide_verification_status
after insert or update of status on public.guide_verification_requests
for each row execute function public.sync_guide_verification_status();

drop trigger if exists trg_validate_tour_request on public.tour_requests;
create trigger trg_validate_tour_request
before insert or update on public.tour_requests
for each row execute function public.validate_tour_request();

drop trigger if exists trg_validate_companion_request on public.companion_requests;
create trigger trg_validate_companion_request
before insert or update on public.companion_requests
for each row execute function public.validate_companion_request();

drop trigger if exists trg_validate_tour_review on public.tour_reviews;
create trigger trg_validate_tour_review
before insert or update on public.tour_reviews
for each row execute function public.validate_tour_review();

drop trigger if exists trg_validate_guide_review on public.guide_reviews;
create trigger trg_validate_guide_review
before insert or update on public.guide_reviews
for each row execute function public.validate_guide_review();

drop trigger if exists trg_sync_notification_read_at on public.notifications;
create trigger trg_sync_notification_read_at
before update on public.notifications
for each row execute function public.sync_notification_read_at();

drop trigger if exists trg_log_report_created on public.reports;
create trigger trg_log_report_created
after insert on public.reports
for each row execute function public.log_report_created();

drop trigger if exists trg_log_report_updates on public.reports;
create trigger trg_log_report_updates
after update on public.reports
for each row execute function public.log_report_updates();

drop trigger if exists trg_log_user_role_insert on public.user_roles;
create trigger trg_log_user_role_insert
after insert on public.user_roles
for each row execute function public.log_user_role_insert();

drop trigger if exists trg_log_user_role_delete on public.user_roles;
create trigger trg_log_user_role_delete
after delete on public.user_roles
for each row execute function public.log_user_role_delete();

-- =========================================================
-- 8) ENABLE RLS
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
alter table public.admin_activity_logs enable row level security;
alter table public.user_role_change_logs enable row level security;

-- =========================================================
-- 9) RLS POLICIES
-- =========================================================

-- users / roles
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

-- lookup tables
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

-- guide profiles
create policy guide_profiles_public_read
on public.guide_profiles for select
to public
using (is_deleted = false and deleted_at is null and visibility_status = 'visible');

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
          and gp.is_deleted = false
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
          and gp.is_deleted = false
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

-- tours
create policy tours_public_read
on public.tours for select
to public
using (
    is_deleted = false
    and deleted_at is null
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
          and t.is_deleted = false
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
          and t.is_deleted = false
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

-- companion
create policy companion_posts_public_read
on public.companion_posts for select
to public
using (is_deleted = false and deleted_at is null and visibility_status = 'visible');

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

-- favorites
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

-- reports
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

-- preferences / activity
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

-- conversations / messages
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

-- guide verification / availability
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
          and gp.is_deleted = false
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

-- notifications
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

-- ai chat
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

-- accommodations
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
          and t.is_deleted = false
          and t.deleted_at is null
          and t.business_status = 'published'
          and t.visibility_status = 'visible'
    )
);

create policy tour_accommodations_owner_or_admin_manage
on public.tour_accommodations for all
to authenticated
using (public.owns_tour(tour_id, auth.uid()) or public.is_system_admin(auth.uid()))
with check (public.owns_tour(tour_id, auth.uid()) or public.is_system_admin(auth.uid()));

-- payments
create policy payment_transactions_owner_or_backoffice_read
on public.payment_transactions for select
to authenticated
using (user_id = auth.uid() or public.is_backoffice(auth.uid()));

create policy payment_transactions_owner_insert
on public.payment_transactions for insert
to authenticated
with check (user_id = auth.uid() and public.owns_tour_request(tour_request_id, auth.uid()));

create policy payment_transactions_backoffice_update
on public.payment_transactions for update
to authenticated
using (public.is_backoffice(auth.uid()))
with check (public.is_backoffice(auth.uid()));

-- admin activity logs
create policy admin_activity_logs_backoffice_read
on public.admin_activity_logs for select
to authenticated
using (public.is_backoffice(auth.uid()));

create policy admin_activity_logs_backoffice_insert
on public.admin_activity_logs for insert
to authenticated
with check (public.is_backoffice(auth.uid()));

-- role change logs
create policy user_role_change_logs_system_admin_read
on public.user_role_change_logs for select
to authenticated
using (public.is_system_admin(auth.uid()));

create policy user_role_change_logs_system_admin_insert
on public.user_role_change_logs for insert
to authenticated
with check (public.is_system_admin(auth.uid()) or public.is_backoffice(auth.uid()));

commit;