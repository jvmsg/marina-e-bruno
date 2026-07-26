-- Seed gift items for honeymoon fund
-- Run after migrations 001–004 (stripe_price_id is nullable).
-- Generated 2026-07-26

begin;

-- Hide previous catalog (keeps rows referenced by past orders)
update public.gift_items
set active = false
where active = true;

-- Remove inactive items that are not tied to any order
delete from public.gift_items
where active = false
  and id not in (
    select distinct gift_item_id from public.gift_order_items
  );

insert into public.gift_items (
  name,
  description,
  price_cents,
  stripe_price_id,
  image_path,
  active,
  sort_order
)
values
  ('Teste', '', 1000, null, null, true, 10),
  ('Drinks da Lua de Mel', '', 7500, null, null, true, 20),
  ('Café da Manhã no Hotel', '', 10000, null, null, true, 30),
  ('Almoço para Dois', '', 15000, null, null, true, 40),
  ('Jantar Romântico', '', 20000, null, null, true, 50),
  ('Ingresso para um Passeio', '', 25000, null, null, true, 60),
  ('Passeio de Barco', '', 30000, null, null, true, 70),
  ('Aluguel de Carro', '', 35000, null, null, true, 80),
  ('Parte das Passagens', '', 40000, null, null, true, 90),
  ('Diária de Hotel', '', 45000, null, null, true, 100),
  ('Upgrade de Quarto', '', 50000, null, null, true, 110),
  ('Experiência Gastronômica', '', 55000, null, null, true, 120),
  ('Dia de Spa para o Casal', '', 60000, null, null, true, 130),
  ('Passeio Exclusivo', '', 65000, null, null, true, 140),
  ('Passeio Completo de Dia Inteiro', '', 70000, null, null, true, 150),
  ('Dois Dias de Hospedagem', '', 75000, null, null, true, 160),
  ('Cota Especial da Lua de Mel', '', 80000, null, null, true, 170);

commit;

-- Quick checks
-- select name, price_cents, sort_order, active from public.gift_items order by sort_order;
