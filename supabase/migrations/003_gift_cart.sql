-- Gift cart: parent order + line items, payment method support

do $$ begin
  create type gift_payment_method as enum ('card', 'pix');
exception when duplicate_object then null;
end $$;

create table if not exists public.gift_order_items (
  id uuid primary key default gen_random_uuid(),
  gift_order_id uuid not null references public.gift_orders (id) on delete cascade,
  gift_item_id uuid not null references public.gift_items (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents > 0),
  created_at timestamptz not null default now()
);

create index if not exists gift_order_items_order_id_idx
  on public.gift_order_items (gift_order_id);

alter table public.gift_orders
  add column if not exists payment_method gift_payment_method;

-- Migrate existing single-item orders into gift_order_items
insert into public.gift_order_items (gift_order_id, gift_item_id, quantity, unit_price_cents)
select
  go.id,
  go.gift_item_id,
  1,
  go.amount_cents
from public.gift_orders go
where go.gift_item_id is not null
  and not exists (
    select 1
    from public.gift_order_items oi
    where oi.gift_order_id = go.id
  );

update public.gift_orders
set payment_method = 'card'
where payment_method is null;

alter table public.gift_orders
  drop constraint if exists gift_orders_gift_item_id_fkey;

alter table public.gift_orders
  drop column if exists gift_item_id;

alter table public.gift_orders
  alter column payment_method set not null;

alter table public.gift_order_items enable row level security;
