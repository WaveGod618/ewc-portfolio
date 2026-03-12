# EWC Model Portfolio

Premium dark-mode MVP for a public-facing hypothetical signal scoreboard. The app tracks long and short trade alerts, closed-trade performance, open positions, a model equity curve, and a clear hypothetical-performance disclaimer without implying broker verification.

## Stack

- Next.js 16.1 App Router
- TypeScript
- Tailwind CSS
- Supabase database, storage, and auth
- Recharts for the equity curve
- Vercel-ready project structure

## What’s included

- Public dashboard at `/`
- Open positions page at `/positions`
- Closed trades page at `/history`
- Rules/disclaimer page at `/rules`
- Protected admin page at `/admin`
- Supabase SQL migration in `supabase/migrations/202603091500_init.sql`
- SQL seed file in `supabase/seed.sql`
- Scripted seed command in `scripts/seed.ts`
- `.env.local.example` with the required environment variables

## Architecture choices

- App Router with server-rendered public pages keeps the public scoreboard fast and simple.
- A small typed data layer in `src/lib/queries.ts` centralizes reads from Supabase and the local preview fallback.
- Server actions in `src/lib/actions.ts` handle admin mutations, trade close logic, and path revalidation.
- Long/short math lives in `src/lib/trade-math.ts` so percent PnL, dollar PnL, and R multiple are calculated consistently in one place.
- Reusable UI, dashboard, trade-table, and admin-form components keep the MVP easy to extend without introducing unnecessary abstractions.
- When Supabase env vars are missing, public pages render seeded preview data so the UI can be reviewed immediately. Admin mutations still require Supabase.

## Database schema

The core schema includes:

- `settings`
- `trades`
- `equity_snapshots`

The migration also adds:

- row-level security policies
- update timestamp triggers
- a public `trade-charts` storage bucket for optional chart uploads
- indexes for trade status/date and equity snapshot lookups

## Trade logic

- Supports both `long` and `short` directions.
- `pnl_percent` is calculated directionally:
  - long: `(exit - entry) / entry`
  - short: `(entry - exit) / entry`
- `r_multiple` is calculated as:
  - directional reward or loss divided by `abs(entry - stop)`
- `pnl_dollars` is calculated when `position_size_pct` is present:
  - `starting_capital * (position_size_pct / 100) * directional_return`
- Closing a trade can auto-create an equity snapshot when dollar sizing is available.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your Supabase values:

```bash
cp .env.local.example .env.local
```

3. Create a Supabase project.

4. Run the migration SQL from `supabase/migrations/202603091500_init.sql` in the Supabase SQL editor or through the Supabase CLI.

5. Create an admin user in Supabase Auth with email/password.

6. Seed the sample data with either option:

```bash
npm run seed
```

or run `supabase/seed.sql` directly in the SQL editor.

7. Start the app:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Required for the app:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Required for the seed script:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

## Admin workflow

- Visit `/login`
- Sign in with the Supabase admin account you created
- Open `/admin`
- Update settings
- Create or edit trades
- Close trades to calculate final metrics
- Add manual equity snapshots when needed

## Deployment

The project is ready for Vercel:

1. Push the repo.
2. Import it into Vercel.
3. Add the same environment variables from `.env.local`.
4. Deploy.

## Notes

- This is intentionally not a broker-linked portfolio.
- The public UI always describes the data as hypothetical signal performance.
- Live pricing is skipped for V1 to keep the MVP simple and reliable.
