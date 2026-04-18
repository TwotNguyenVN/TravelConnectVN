-- =========================================================
-- A) ADMIN ACTIVITY LOGS
-- =========================================================

create table if not exists public.admin_activity_logs (
    id uuid primary key default gen_random_uuid(),

    actor_user_id uuid references public.users(id) on delete set null,
    actor_role_code text references public.roles(role_code) on delete set null,

    module_name text not null check (
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

    entity_type text not null check (
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

    -- dùng text để linh hoạt cho uuid / composite key / external ref
    entity_pk text,

    action_type text not null check (
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

create index if not exists idx_admin_activity_logs_actor_created
    on public.admin_activity_logs (actor_user_id, created_at desc);

create index if not exists idx_admin_activity_logs_module_created
    on public.admin_activity_logs (module_name, created_at desc);

create index if not exists idx_admin_activity_logs_entity
    on public.admin_activity_logs (entity_type, entity_pk, created_at desc);


-- =========================================================
-- B) USER ROLE CHANGE LOGS
-- =========================================================

create table if not exists public.user_role_change_logs (
    id uuid primary key default gen_random_uuid(),

    target_user_id uuid not null references public.users(id) on delete cascade,
    changed_role_code text not null references public.roles(role_code) on delete restrict,

    action_type text not null check (
        action_type in ('assign', 'revoke')
    ),

    changed_by_user_id uuid references public.users(id) on delete set null,

    old_snapshot jsonb not null default '{}'::jsonb,
    new_snapshot jsonb not null default '{}'::jsonb,

    note text,
    created_at timestamptz not null default now()
);

create index if not exists idx_user_role_change_logs_target_created
    on public.user_role_change_logs (target_user_id, created_at desc);

create index if not exists idx_user_role_change_logs_actor_created
    on public.user_role_change_logs (changed_by_user_id, created_at desc);

create index if not exists idx_user_role_change_logs_role_created
    on public.user_role_change_logs (changed_role_code, created_at desc);


-- =========================================================
-- C) TRIGGER LOG ROLE CHANGES
-- =========================================================

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

drop trigger if exists trg_log_user_role_insert on public.user_roles;
create trigger trg_log_user_role_insert
after insert on public.user_roles
for each row execute function public.log_user_role_insert();

drop trigger if exists trg_log_user_role_delete on public.user_roles;
create trigger trg_log_user_role_delete
after delete on public.user_roles
for each row execute function public.log_user_role_delete();


-- =========================================================
-- D) OPTIONAL RPC TO WRITE ADMIN LOGS CLEANLY FROM BACKEND
-- =========================================================

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