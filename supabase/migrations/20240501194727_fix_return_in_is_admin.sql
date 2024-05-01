create or replace function public.is_admin(_user_id uuid)
    returns bool
    security definer set search_path = public as $$
    select exists (
        select 1
        from public.users
        where id = _user_id and is_admin = true
    );
    $$ language sql;