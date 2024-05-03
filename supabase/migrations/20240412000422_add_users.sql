create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  full_name text,
  email text not null,
  avatar_url text
);

create trigger on_user_updated
    before update on public.users for each row
    execute procedure public.set_updated_at();

create function public.handle_new_user() 
    returns trigger as $$
    begin
        insert into public.users (id, full_name, email, avatar_url)
        values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
        return new;
    end;
    $$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users for each row
    execute procedure public.handle_new_user();
