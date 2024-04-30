create table product_amounts (
  id text references products not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  listing_amount integer not null,
  rule_amount integer not null
);

create trigger on_product_amount_updated
    before update on product_amounts
    for each row execute procedure public.set_updated_at();

alter table product_amounts enable row level security;
    create policy "Allow public read-only access." on product_amounts for select using (true);
