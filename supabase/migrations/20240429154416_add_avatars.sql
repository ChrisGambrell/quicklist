insert into storage.buckets (id, name)
    values ('avatars', 'avatars');

create policy "Anyone can access avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Anyone can insert an avatar" on storage.objects for insert with check (bucket_id = 'avatars');
