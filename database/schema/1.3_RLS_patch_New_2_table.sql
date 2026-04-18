alter table public.admin_activity_logs enable row level security;
alter table public.user_role_change_logs enable row level security;

create policy admin_activity_logs_backoffice_read
on public.admin_activity_logs for select
to authenticated
using (public.is_backoffice(auth.uid()));

create policy admin_activity_logs_backoffice_insert
on public.admin_activity_logs for insert
to authenticated
with check (public.is_backoffice(auth.uid()));

create policy user_role_change_logs_system_admin_read
on public.user_role_change_logs for select
to authenticated
using (public.is_system_admin(auth.uid()));

create policy user_role_change_logs_system_admin_insert
on public.user_role_change_logs for insert
to authenticated
with check (public.is_system_admin(auth.uid()) or public.is_backoffice(auth.uid()));