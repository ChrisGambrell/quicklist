drop policy "Can select own" on users;
create policy "Can select any" on users for select using (true);

alter users add column is_admin boolean default false;
