-- Safe to re-run: creates only missing objects from the wedding schema.

do $$ begin
  create type guest_gender as enum ('female', 'male', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type rsvp_status as enum ('pending', 'attending', 'declined');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type gift_order_status as enum ('pending', 'paid', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  gender guest_gender not null default 'other',
  rsvp_status rsvp_status not null default 'pending',
  dietary_notes text,
  updated_at timestamptz not null default now()
);

create index if not exists guests_phone_idx on public.guests (phone);
create index if not exists guests_family_id_idx on public.guests (family_id);

create table if not exists public.gift_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents > 0),
  stripe_price_id text not null,
  image_path text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.gift_orders (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete set null,
  guest_id uuid references public.guests (id) on delete set null,
  gift_item_id uuid not null references public.gift_items (id) on delete restrict,
  stripe_checkout_session_id text not null unique,
  amount_cents integer not null check (amount_cents > 0),
  status gift_order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create or replace function public.set_guest_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
before update on public.guests
for each row
execute function public.set_guest_updated_at();

alter table public.families enable row level security;
alter table public.guests enable row level security;
alter table public.gift_items enable row level security;
alter table public.gift_orders enable row level security;

drop policy if exists "Public can read active gift items" on public.gift_items;
create policy "Public can read active gift items"
on public.gift_items
for select
to anon, authenticated
using (active = true);

insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read wedding photos" on storage.objects;
create policy "Public read wedding photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'wedding-photos');
