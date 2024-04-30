create function public.set_updated_at()
    returns trigger as $$
    begin
        new.updated_at = timezone('utc'::text, now());
        return new;
    end;
    $$ language plpgsql;

-- Listings
alter table public.listings add column created_at timestamptz not null default timezone('utc'::text, now());
alter table public.listings add column updated_at timestamptz not null default timezone('utc'::text, now());

create trigger on_listing_updated
    before update on public.listings
    for each row execute procedure public.set_updated_at();

-- Rules
alter table public.rules add column created_at timestamptz not null default timezone('utc'::text, now());
alter table public.rules add column updated_at timestamptz not null default timezone('utc'::text, now());

create trigger on_rule_updated
    before update on public.rules
    for each row execute procedure public.set_updated_at();
