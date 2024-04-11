insert into storage.buckets (id, name)
    values ('listings', 'listings');

create policy "Anyone can access listring" on storage.objects for select using (bucket_id = 'listings');
create policy "Anyone can insert a listing" on storage.objects for insert with check (bucket_id = 'listings');

create type listing_status_type as enum ('draft', 'published');
create table listings (
    id uuid primary key default gen_random_uuid(),
    file_path text,
    title text,
    description text,
    price float,
    status listing_status_type not null default 'draft'
);

-- alter table listings enable row level security;
--     create policy "Anyone can select listings" on listings for select using (true);
--     create policy "Anyone can update listings" on listings for update using (auth.uid() = user_id);
--     create policy "Anyone can delete listings" on listings for delete using (auth.uid() = user_id);
