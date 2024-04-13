-- TODO: Is there a way to make this more secure? Currently, anyone can delete any image from the bucket.
-- create policy "Anyone can delete own images" on storage.objects for delete using (bucket_id = 'listings' and auth.uid() = user_id);
create policy "Anyone can delete own images" on storage.objects for delete using (bucket_id = 'listings');
