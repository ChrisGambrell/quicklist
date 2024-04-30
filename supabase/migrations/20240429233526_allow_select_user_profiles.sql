drop policy "Can select own" on public.users;
create policy "Can select any" on public.users for select using (true);

alter table public.users add column is_admin boolean not null default false;
