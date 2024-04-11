-- create policy "Anyone can delete own images" on storage.objects for delete using (bucket_id = 'listings' and auth.uid() = user_id);
create policy "Anyone can delete own images" on storage.objects for delete using (bucket_id = 'listings');
