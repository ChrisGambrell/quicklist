alter table users enable row level security;
    create policy "Can select own" on users for select using (auth.uid() = id);
    create policy "Can update own" on users for update using (auth.uid() = id);

alter table listings add column user_id uuid default null references users on delete cascade;
alter table listings enable row level security;
    create policy "Can select own" on listings for select using (auth.uid() = user_id);
    create policy "Can insert own" on listings for insert with check (auth.uid() = user_id);
    create policy "Can update own" on listings for update using (auth.uid() = user_id);
    create policy "Can delete own" on listings for delete using (auth.uid() = user_id);

alter table rules add column user_id uuid default null references users on delete cascade;
alter table rules enable row level security;
    create policy "Can select own" on rules for select using (auth.uid() = user_id);
    create policy "Can insert own" on rules for insert with check (auth.uid() = user_id);
    create policy "Can update own" on rules for update using (auth.uid() = user_id);
    create policy "Can delete own" on rules for delete using (auth.uid() = user_id);
