create function public.is_admin(_user_id uuid)
    returns bool as $$
    begin
        select exists (
            select 1
            from public.users
            where id = _user_id and is_admin = true
        );
    end;
    $$ language plpgsql security definer;

drop policy "Can view own or admins all" on public.subscriptions;
create policy "Can view own or admins all" on public.subscriptions for select using (auth.uid() = user_id or is_admin(auth.uid()));
