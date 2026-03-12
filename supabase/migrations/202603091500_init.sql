create extension if not exists "pgcrypto";

create type public.trade_direction as enum ('long', 'short');
create type public.asset_type as enum ('stock', 'futures', 'crypto', 'other');
create type public.trade_status as enum ('open', 'closed', 'stopped', 'partial', 'cancelled');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  starting_capital numeric(14, 2) not null check (starting_capital >= 0),
  portfolio_name text not null,
  disclaimer_text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  direction public.trade_direction not null,
  asset_type public.asset_type not null default 'stock',
  entry_price numeric(14, 6) not null check (entry_price > 0),
  stop_price numeric(14, 6) not null check (stop_price > 0),
  target_1 numeric(14, 6),
  target_2 numeric(14, 6),
  target_3 numeric(14, 6),
  position_size_pct numeric(6, 2) check (position_size_pct > 0 and position_size_pct <= 100),
  status public.trade_status not null default 'open',
  opened_at timestamptz not null default timezone('utc', now()),
  closed_at timestamptz,
  exit_price numeric(14, 6),
  notes text,
  chart_image_url text,
  source_label text,
  source_link text,
  pnl_dollars numeric(14, 2),
  pnl_percent numeric(10, 4),
  r_multiple numeric(10, 4),
  outcome_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.equity_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date timestamptz not null,
  equity_value numeric(14, 2) not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists trades_status_idx on public.trades (status);
create index if not exists trades_opened_at_idx on public.trades (opened_at desc);
create index if not exists trades_closed_at_idx on public.trades (closed_at desc nulls last);
create index if not exists trades_ticker_idx on public.trades (ticker);
create index if not exists equity_snapshots_snapshot_date_idx on public.equity_snapshots (snapshot_date desc);

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row
execute procedure public.set_updated_at();

drop trigger if exists trades_set_updated_at on public.trades;
create trigger trades_set_updated_at
before update on public.trades
for each row
execute procedure public.set_updated_at();

alter table public.settings enable row level security;
alter table public.trades enable row level security;
alter table public.equity_snapshots enable row level security;

drop policy if exists "Public can view settings" on public.settings;
create policy "Public can view settings"
on public.settings
for select
to public
using (true);

drop policy if exists "Authenticated can manage settings" on public.settings;
create policy "Authenticated can manage settings"
on public.settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can view trades" on public.trades;
create policy "Public can view trades"
on public.trades
for select
to public
using (true);

drop policy if exists "Authenticated can manage trades" on public.trades;
create policy "Authenticated can manage trades"
on public.trades
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can view equity snapshots" on public.equity_snapshots;
create policy "Public can view equity snapshots"
on public.equity_snapshots
for select
to public
using (true);

drop policy if exists "Authenticated can manage equity snapshots" on public.equity_snapshots;
create policy "Authenticated can manage equity snapshots"
on public.equity_snapshots
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('trade-charts', 'trade-charts', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Trade charts are public" on storage.objects;
create policy "Trade charts are public"
on storage.objects
for select
to public
using (bucket_id = 'trade-charts');

drop policy if exists "Authenticated users can upload trade charts" on storage.objects;
create policy "Authenticated users can upload trade charts"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'trade-charts');

drop policy if exists "Authenticated users can update trade charts" on storage.objects;
create policy "Authenticated users can update trade charts"
on storage.objects
for update
to authenticated
using (bucket_id = 'trade-charts')
with check (bucket_id = 'trade-charts');

drop policy if exists "Authenticated users can delete trade charts" on storage.objects;
create policy "Authenticated users can delete trade charts"
on storage.objects
for delete
to authenticated
using (bucket_id = 'trade-charts');
