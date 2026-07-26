-- InfinityPay checkout: drop Stripe-only requirements, add provider fields

alter table public.gift_items
  alter column stripe_price_id drop not null;

alter table public.gift_orders
  rename column stripe_checkout_session_id to provider_reference;

alter table public.gift_orders
  alter column provider_reference drop not null;

alter table public.gift_orders
  alter column payment_method drop not null;

alter table public.gift_orders
  add column if not exists transaction_nsu text;

alter table public.gift_orders
  add column if not exists receipt_url text;
