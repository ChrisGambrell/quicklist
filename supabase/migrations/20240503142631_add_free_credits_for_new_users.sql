create or replace function public.get_total_credits()
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
        -- All users get a free 10 credits
        return total_credits + 10;
    end;
    $$ language plpgsql security definer;