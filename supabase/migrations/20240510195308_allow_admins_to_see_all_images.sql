drop policy "Can access own" on storage.objects;
create policy "Can select own listing_images; Admin all" on storage.objects for select using (bucket_id = 'listing_images' and auth.uid() = owner or is_admin(auth.uid()));

drop policy "Can view own" on public.listing_images;
create policy "Can select own; Admin all" on public.listing_images for select using (auth.uid() = (select listings.user_id from listings where listings.id = listing_id) or is_admin(auth.uid()));
