create function public.set_updated_at()
    returns trigger as $$
    begin
        new.updated_at = timezone('utc'::text, now());
        return new;
    end;
    $$ language plpgsql;

-- Listings
alter table listings add column created_at timestamptz not null default timezone('utc'::text, now());
alter table listings add column updated_at timestamptz not null default timezone('utc'::text, now());

create trigger on_listing_updated
    before update on listings
    for each row execute procedure public.set_updated_at();

-- Rules
alter table rules add column created_at timestamptz not null default timezone('utc'::text, now());
alter table rules add column updated_at timestamptz not null default timezone('utc'::text, now());

create trigger on_rule_updated
    before update on rules
    for each row execute procedure public.set_updated_at();
