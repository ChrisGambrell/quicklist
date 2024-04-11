create table rules (
    id uuid primary key default gen_random_uuid(),
    rule text not null
);

-- alter table rules enable row level security;
--     create policy "Anyone can select own rules" on rules for select using (auth.uid() = user_id);
--     create policy "Anyone can insert own rules" on rules for insert with check (auth.uid() = user_id);
--     create policy "Anyone can update own rules" on rules for update using (auth.uid() = user_id);
--     create policy "Anyone can delete own rules" on rules for delete using (auth.uid() = user_id);
