-- TODO: Might need to add "is_admin" function
drop policy "Can only view own subs data." on public.subscriptions;
create policy "Can view own or admins all" on public.subscriptions for select using (auth.uid() = user_id or (select public.users.is_admin from public.users where public.users.id = auth.uid()));
