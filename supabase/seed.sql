insert into public.settings (
  id,
  starting_capital,
  portfolio_name,
  disclaimer_text,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000001',
  100000,
  'EWC Model Portfolio',
  'Hypothetical performance based on EWC posted trade signals. This model portfolio is for educational and transparency purposes only and does not represent actual brokerage or client account results. Real-world execution, slippage, commissions, and liquidity may materially impact performance.',
  '2026-03-09T10:00:00.000Z',
  '2026-03-09T10:00:00.000Z'
)
on conflict (id) do update
set
  starting_capital = excluded.starting_capital,
  portfolio_name = excluded.portfolio_name,
  disclaimer_text = excluded.disclaimer_text,
  updated_at = excluded.updated_at;

insert into public.trades (
  id,
  ticker,
  direction,
  asset_type,
  entry_price,
  stop_price,
  target_1,
  target_2,
  target_3,
  position_size_pct,
  status,
  opened_at,
  closed_at,
  exit_price,
  notes,
  chart_image_url,
  source_label,
  source_link,
  pnl_dollars,
  pnl_percent,
  r_multiple,
  outcome_label,
  created_at,
  updated_at
)
values
  ('00000000-0000-0000-0000-000000000101', 'TSLA', 'short', 'stock', 438.5, 460, 400, 382, 360, 12, 'open', '2026-03-07T14:30:00.000Z', null, null, 'TSLA swept the prior level and remains structurally weak.', null, 'Discord', null, null, null, null, null, '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000102', 'AAPL', 'short', 'stock', 260.81, 280, 236, 226, null, 10, 'open', '2026-03-06T15:15:00.000Z', null, null, 'Failed reclaim at resistance with broad market weakness.', null, 'Discord', null, null, null, null, null, '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000103', 'AMD', 'short', 'stock', 207.08, 226, 181.5, 173, null, 10, 'open', '2026-03-05T18:00:00.000Z', null, null, 'Relative weakness remains intact after the supply retest.', null, 'Discord', null, null, null, null, null, '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000104', 'NVDA', 'short', 'stock', 180.9, 197, 161, 157, null, 10, 'open', '2026-03-04T16:20:00.000Z', null, null, 'Momentum failed at the retest and the setup still favors downside continuation.', null, 'Discord', null, null, null, null, null, '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000201', 'MSFT', 'long', 'stock', 418, 401, 432, 441, 448, 12, 'closed', '2026-01-12T15:00:00.000Z', '2026-01-17T19:00:00.000Z', 444, 'Trend continuation breakout with strong breadth confirmation.', null, 'Swing Signal', null, 746.41, 6.2201, 1.5294, 'target hit', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000202', 'QQQ', 'short', 'stock', 523, 534, 514, 507, 501, 15, 'closed', '2026-01-21T14:45:00.000Z', '2026-01-24T18:30:00.000Z', 507, 'Index rejected the weekly high and offered a clean downside unwind.', null, 'Weekly Projections', null, 458.89, 3.0593, 1.4545, 'target hit', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000203', 'NFLX', 'long', 'stock', 892, 860, 920, 940, null, 10, 'stopped', '2026-01-28T16:05:00.000Z', '2026-01-30T17:20:00.000Z', 858, 'Setup failed after earnings gap follow-through faded.', null, 'Discord', null, -381.28, -3.8128, -1.0625, 'stopped out', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000204', 'ETH', 'long', 'crypto', 3380, 3210, 3520, 3650, 3780, 8, 'closed', '2026-02-03T13:10:00.000Z', '2026-02-08T11:30:00.000Z', 3655, 'Strong reclaim through the breakdown pivot produced the follow-through leg.', null, 'Discord', null, 650.89, 8.1361, 1.6176, 'target hit', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000205', 'META', 'short', 'stock', 694, 720, 671, 660, null, 8, 'stopped', '2026-02-11T15:25:00.000Z', '2026-02-13T14:10:00.000Z', 709, 'The rejection failed once buyers reclaimed the impulse shelf.', null, 'Discord', null, -172.91, -2.1614, -0.5769, 'manual close', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000206', 'CL', 'short', 'futures', 74.8, 77.2, 72.2, 69.5, 68.8, 10, 'closed', '2026-02-18T13:45:00.000Z', '2026-02-20T16:30:00.000Z', 69.3, 'Commodities weakness accelerated after the lower high confirmed.', null, 'Weekly Projections', null, 735.29, 7.3529, 2.2917, 'target hit', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000207', 'AMZN', 'long', 'stock', 227, 219, 233, 236, 240, 12, 'closed', '2026-02-22T18:10:00.000Z', '2026-02-25T19:45:00.000Z', 236, 'Trend continuation long that paid cleanly into target two.', null, 'Swing Signal', null, 475.77, 3.9648, 1.1250, 'partial win', '2026-03-09T10:00:00.000Z', '2026-03-09T10:00:00.000Z')
on conflict (id) do update
set
  ticker = excluded.ticker,
  direction = excluded.direction,
  asset_type = excluded.asset_type,
  entry_price = excluded.entry_price,
  stop_price = excluded.stop_price,
  target_1 = excluded.target_1,
  target_2 = excluded.target_2,
  target_3 = excluded.target_3,
  position_size_pct = excluded.position_size_pct,
  status = excluded.status,
  opened_at = excluded.opened_at,
  closed_at = excluded.closed_at,
  exit_price = excluded.exit_price,
  notes = excluded.notes,
  chart_image_url = excluded.chart_image_url,
  source_label = excluded.source_label,
  source_link = excluded.source_link,
  pnl_dollars = excluded.pnl_dollars,
  pnl_percent = excluded.pnl_percent,
  r_multiple = excluded.r_multiple,
  outcome_label = excluded.outcome_label,
  updated_at = excluded.updated_at;

insert into public.equity_snapshots (
  id,
  snapshot_date,
  equity_value,
  note,
  created_at
)
values
  ('00000000-0000-0000-0000-000000000301', '2026-01-01T00:00:00.000Z', 100000, 'Starting model capital', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000302', '2026-01-17T00:00:00.000Z', 100897, 'MSFT target hit', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000303', '2026-01-24T00:00:00.000Z', 101586, 'QQQ downside follow-through', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000304', '2026-01-30T00:00:00.000Z', 101205, 'NFLX stop', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000305', '2026-02-08T00:00:00.000Z', 101856, 'ETH strength captured', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000306', '2026-02-20T00:00:00.000Z', 102484, 'CL target cluster', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000307', '2026-02-25T00:00:00.000Z', 102960, 'AMZN close', '2026-03-09T10:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000308', '2026-03-07T00:00:00.000Z', 108240, 'Manual equity normalization snapshot', '2026-03-09T10:00:00.000Z')
on conflict (id) do update
set
  snapshot_date = excluded.snapshot_date,
  equity_value = excluded.equity_value,
  note = excluded.note;
