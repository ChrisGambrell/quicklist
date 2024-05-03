delete from storage.buckets where id = 'listings';
drop policy "Anyone can access listings" on storage.objects;
drop policy "Anyone can insert a listing" on storage.objects;