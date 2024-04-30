create table public.rules (
    id uuid primary key default gen_random_uuid(),
    rule text not null
);
