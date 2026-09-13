-- ==========================================================
-- UNNPC — schema: produkty, zakupy, biblioteka
-- Uruchom w Supabase → SQL Editor (raz).
-- ==========================================================

-- Produkty (to, co widać w bibliotece). notion_url = link do duplikacji szablonu.
create table if not exists public.products (
  id            text primary key,                 -- np. 'life-rpg', 'investor-tracker'
  name          text not null,
  description   text,
  price_pln     integer not null default 0,        -- w groszach; 0 = darmowy
  ls_variant_id text unique,                       -- ID wariantu w Lemon Squeezy
  notion_url    text not null,                     -- link do duplikacji (tajny, widoczny tylko dla kupujących)
  cover_url     text,
  sort          integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Zakupy przypisane do e-maila (LS zna tylko e-mail; użytkownik loguje się tym samym e-mailem).
create table if not exists public.purchases (
  id            bigint generated always as identity primary key,
  email         text not null,
  product_id    text not null references public.products(id),
  ls_order_id   text unique,                       -- order id z Lemon Squeezy (idempotencja webhooka)
  ls_customer_id text,
  status        text not null default 'paid',      -- paid | refunded
  amount_pln    integer,
  created_at    timestamptz not null default now()
);
create index if not exists purchases_email_idx on public.purchases (lower(email));

-- ---------- RLS ----------
alter table public.products  enable row level security;
alter table public.purchases enable row level security;

-- Każdy zalogowany widzi listę produktów (ale NIE notion_url — patrz widok niżej).
create policy "products readable" on public.products
  for select to anon, authenticated using (active);

-- Użytkownik widzi tylko swoje zakupy (po e-mailu z tokena).
create policy "own purchases" on public.purchases
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Publiczny widok produktów bez tajnego linku (do katalogu / cennika).
create or replace view public.products_public as
  select id, name, description, price_pln, ls_variant_id, cover_url, sort
  from public.products where active;
grant select on public.products_public to anon, authenticated;
revoke select on public.products from anon, authenticated;  -- notion_url tylko przez funkcję niżej

-- Biblioteka: produkty, które użytkownik kupił, razem z linkiem do Notion.
create or replace function public.my_library()
returns table (
  product_id text, name text, description text, cover_url text,
  notion_url text, purchased_at timestamptz, status text
)
language sql security definer set search_path = public as $$
  select p.id, p.name, p.description, p.cover_url, p.notion_url, pu.created_at, pu.status
  from public.purchases pu
  join public.products p on p.id = pu.product_id
  where lower(pu.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and pu.status = 'paid'
  order by pu.created_at desc;
$$;
revoke all on function public.my_library() from public;
grant execute on function public.my_library() to authenticated;

-- ---------- dane startowe ----------
insert into public.products (id, name, description, price_pln, notion_url, sort) values
  ('life-rpg', 'Life RPG', 'Pełny system: karta postaci, Daily Loop, sezony, skarbiec, skill tree, boss log. 4 motywy, dożywotnie aktualizacje.', 19900, 'https://www.notion.so/[LINK_DO_DUPLIKACJI_LIFE_RPG]', 1),
  ('investor-tracker', 'Investor Tracker', 'Portfel inwestycyjny w Notion: akcje, ETF, obligacje, krypto z podziałem na konta.', 0, 'https://www.notion.so/[LINK_DO_DUPLIKACJI_TRACKER]', 2)
on conflict (id) do nothing;
