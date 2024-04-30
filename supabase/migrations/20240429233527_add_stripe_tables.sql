alter table public.users add column billing_address jsonb;
alter table public.users add column payment_method jsonb;

create table public.customers (
  id uuid references public.users not null primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  stripe_customer_id text
);

create trigger on_customer_updated
    before update on public.customers
    for each row execute procedure public.set_updated_at();

alter table public.customers enable row level security;

create table public.products (
  id text primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

create trigger on_product_updated
    before update on public.products
    for each row execute procedure public.set_updated_at();

alter table public.products enable row level security;
    create policy "Allow public read-only access." on public.products for select using (true);

create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table public.prices (
  id text primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  product_id text references public.products, 
  active boolean,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type pricing_type,
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer
);

create trigger on_price_updated
    before update on public.prices
    for each row execute procedure public.set_updated_at();

alter table public.prices enable row level security;
    create policy "Allow public read-only access." on public.prices for select using (true);

create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table public.subscriptions (
  id text primary key,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  user_id uuid references public.users not null,
  status subscription_status,
  metadata jsonb,
  price_id text references public.prices,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  trial_end timestamp with time zone default timezone('utc'::text, now())
);

create trigger on_subscription_updated
    before update on public.subscriptions
    for each row execute procedure public.set_updated_at();

alter table public.subscriptions enable row level security;
    create policy "Can only view own subs data." on public.subscriptions for select using (auth.uid() = user_id);

drop publication if exists supabase_realtime;
create publication supabase_realtime for table public.products, public.prices;