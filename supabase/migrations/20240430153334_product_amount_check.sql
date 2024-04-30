create or replace function public.handle_new_listing()
    returns trigger as $$
    declare
        subscription public.subscriptions%ROWTYPE;
        number_of_listings int;
        listings_allowed int;
    begin
        -- active subscription
        select * into subscription
        from public.subscriptions
        where user_id = auth.uid() and status = 'active';

        if(subscription is null) then
            -- raise exception 'No active subscription found';

            -- count existing listings
            select count(*) into number_of_listings
            from public.listings
            where user_id = auth.uid();

            -- check if user has reached the limit
            if(number_of_listings >= 10) then
                raise exception 'Number of listings exceeds free tier.';
            end if;

            return new;
        end if;

        -- count existing listings
        select count(*) into number_of_listings
        from public.listings
        where user_id = auth.uid() and created_at between subscription.current_period_start and subscription.current_period_end;

        -- check if user has reached the limit
        select listing_amount into listings_allowed
        from public.product_amounts
        where product_amounts.id = (
            select prices.product_id
            from public.prices
            where prices.id = subscription.price_id
        );

        if(number_of_listings >= listings_allowed) then
            raise exception 'Number of listings exceeds subscription tier for this month.';
        end if;

        return new;
    end;
    $$ language plpgsql security definer;

create trigger on_insert_listing
    before insert on public.listings
    for each row execute procedure public.handle_new_listing();

create or replace function public.handle_new_rule()
    returns trigger as $$
    declare
        subscription public.subscriptions%ROWTYPE;
        number_of_rules int;
        rules_allowed int;
    begin
        -- active subscription
        select * into subscription
        from public.subscriptions
        where user_id = auth.uid() and status = 'active';

        if(subscription is null) then
            -- raise exception 'No active subscription found';

            -- count existing rules
            select count(*) into number_of_rules
            from public.rules
            where user_id = auth.uid();

            -- check if user has reached the limit
            if(number_of_rules >= 3) then
                raise exception 'Number of rules exceeds free tier.';
            end if;

            return new;
        end if;

        -- count existing rules
        select count(*) into number_of_rules
        from public.rules
        where user_id = auth.uid();

        -- check if user has reached the limit
        select rule_amount into rules_allowed
        from public.product_amounts
        where product_amounts.id = (
            select prices.product_id
            from public.prices
            where prices.id = subscription.price_id
        );

        if(number_of_rules >= rules_allowed) then
            raise exception 'Number of rules exceeds subscription tier.';
        end if;

        return new;
    end;
    $$ language plpgsql security definer;

create trigger on_insert_rule
    before insert on public.rules
    for each row execute procedure public.handle_new_rule();
