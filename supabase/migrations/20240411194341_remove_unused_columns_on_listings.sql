alter table public.listings drop column file_path;
alter table public.listings drop column status;

drop type listing_status_type;
