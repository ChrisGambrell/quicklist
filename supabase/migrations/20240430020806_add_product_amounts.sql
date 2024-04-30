create table public.product_amounts (
  id text references public.products not null primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  listing_amount integer not null,
  rule_amount integer not null
);

create trigger on_product_amount_updated
    before update on public.product_amounts
    for each row execute procedure public.set_updated_at();

alter table public.product_amounts enable row level security;
    create policy "Allow public read-only access." on public.product_amounts for select using (true);
