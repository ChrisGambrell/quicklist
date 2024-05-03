alter table product_amounts add column credits integer not null default 0;
alter table product_amounts alter column listing_amount set default 0;
alter table product_amounts alter column rule_amount set default 0;

create table purchases (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    price_id text references prices not null,
    user_id uuid references users not null
);

create trigger on_purchase_updated
    before update on public.purchases for each row
    execute procedure public.set_updated_at();

alter table purchases enable row level security;
    create policy "Can view own; Admin all" on purchases for select using (auth.uid() = user_id or is_admin(auth.uid()));

create table generations (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    listing_id uuid not null references listings on delete cascade,
    user_id uuid not null references users on delete cascade,
    credits integer not null,
    data jsonb
);

create trigger on_generation_updated
    before update on public.generations for each row
    execute procedure public.set_updated_at();

alter table generations enable row level security;
    create policy "Can view own; Admin all" on generations for select using (auth.uid() = user_id or is_admin(auth.uid()));
    create policy "Can insert own" on generations for insert with check (auth.uid() = user_id);

create function public.get_total_credits()
    returns integer as $$
    declare
        total_credits integer;
    begin
        select sum(product_amounts.credits) into total_credits
        from purchases
        left join prices on prices.id = price_id
        left join product_amounts on product_amounts.id = prices.product_id
        where user_id = auth.uid();

        select case when total_credits is null then 0 else total_credits end into total_credits;
        return total_credits;
    end;
    $$ language plpgsql security definer;

create function public.get_used_credits()
    returns integer as $$
    declare
        used_credits integer;
    begin
        select sum(credits) into used_credits
        from generations
        where user_id = auth.uid();

        select case when used_credits is null then 0 else used_credits end into used_credits;
        return used_credits;
    end;
    $$ language plpgsql security definer;

create function public.can_generate(credits_to_use int)
    returns boolean as $$
    declare
        total_credits int;
        used_credits int;
    begin
        select get_total_credits() into total_credits;
        select get_used_credits() into used_credits;

        if(total_credits - used_credits < credits_to_use) then
            raise exception 'Not enough credits to generate data';
        end if;

        return true;
    end;
    $$ language plpgsql security definer;
