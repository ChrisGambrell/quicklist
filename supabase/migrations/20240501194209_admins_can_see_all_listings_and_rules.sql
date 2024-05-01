drop policy "Can select own" on public.listings;
create policy "Can select own; Admin all" on public.listings for select using (auth.uid() = user_id or is_admin(auth.uid()));

drop policy "Can select own" on public.rules;
create policy "Can select own; Admin all" on public.rules for select using (auth.uid() = user_id or is_admin(auth.uid()));