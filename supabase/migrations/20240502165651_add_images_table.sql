insert into storage.buckets (id, name, public) values ('listing_images', 'listing_images', true);
    create policy "Can access own" on storage.objects for select using (bucket_id = 'listing_images' and auth.uid() = owner);
    create policy "Can insert own" on storage.objects for insert with check (bucket_id = 'listing_images' and auth.uid() = owner);
    create policy "Can delete own" on storage.objects for delete using (bucket_id = 'listing_images' and auth.uid() = owner);

create table public.listing_images (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    -- //TODO: Make sure to cascade delete everything and format references like this
    listing_id uuid not null references public.listings on delete cascade,
    image_path text not null,
    is_primary boolean not null default false
);

create trigger on_listing_image_updated
    before update on public.listing_images
    for each row execute procedure public.set_updated_at();

alter table public.listing_images enable row level security;
    create policy "Can view own" on public.listing_images for select using (auth.uid() = (select listings.user_id from listings where listings.id = listing_id));
    create policy "Can update own" on public.listing_images for update using (auth.uid() = (select listings.user_id from listings where listings.id = listing_id));

-- //TODO: rename these to insert?
create function public.handle_new_listing_image() 
    returns trigger as $$
    begin
        insert into public.listing_images (listing_id, image_path)
        values (split_part(new.name, '/', 1)::uuid, new.name);
        return new;
    end;
    $$ language plpgsql security definer;

-- //TODO: Format triggers to look like this
create trigger on_storage_listing_image_created
    after insert on storage.objects for each row 
    when (new.bucket_id = 'listing_images')
    execute procedure public.handle_new_listing_image();

create function public.handle_delete_listing_image() 
    returns trigger as $$
    begin
        delete from public.listing_images where image_path = old.name;
        return old;
    end;
    $$ language plpgsql security definer;

create trigger on_storage_listing_image_deleted
    after delete on storage.objects for each row 
    when (old.bucket_id = 'listing_images')
    execute procedure public.handle_delete_listing_image();

create function public.handle_delete_listing_images() 
    returns trigger as $$
    begin
        delete from storage.objects where bucket_id = 'listing_images' and starts_with(name, old.id::text);
        return old;
    end;
    $$ language plpgsql security definer;

create trigger on_listing_deleted
    after delete on listings for each row 
    execute procedure public.handle_delete_listing_images();
