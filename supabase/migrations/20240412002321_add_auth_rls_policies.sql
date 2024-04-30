alter table public.users enable row level security;
    create policy "Can select own" on public.users for select using (auth.uid() = id);
    create policy "Can update own" on public.users for update using (auth.uid() = id);

alter table public.listings add column user_id uuid default null references public.users on delete cascade;
alter table public.listings enable row level security;
    create policy "Can select own" on public.listings for select using (auth.uid() = user_id);
    create policy "Can insert own" on public.listings for insert with check (auth.uid() = user_id);
    create policy "Can update own" on public.listings for update using (auth.uid() = user_id);
    create policy "Can delete own" on public.listings for delete using (auth.uid() = user_id);

alter table public.rules add column user_id uuid default null references users on delete cascade;
alter table public.rules enable row level security;
    create policy "Can select own" on public.rules for select using (auth.uid() = user_id);
    create policy "Can insert own" on public.rules for insert with check (auth.uid() = user_id);
    create policy "Can update own" on public.rules for update using (auth.uid() = user_id);
    create policy "Can delete own" on public.rules for delete using (auth.uid() = user_id);
