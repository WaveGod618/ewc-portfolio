import Link from "next/link";

import { DisclaimerCard } from "@/components/dashboard/disclaimer-card";
import { EquityCurve } from "@/components/dashboard/equity-curve";
import { PerformanceSummary } from "@/components/dashboard/performance-summary";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClosedTradesTable } from "@/components/trades/closed-trades-table";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getPublicModelData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicModelData();
  const currentYear = new Date().getUTCFullYear();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] px-6 py-12 shadow-[0_24px_90px_rgba(2,6,16,0.5)] sm:px-8 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,170,255,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_16%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/78">
              EWC Performance Dashboard
            </p>
            <h1 className="font-heading mt-4 text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-foreground sm:text-[4.25rem] lg:text-[5.1rem]">
              EWC Model Portfolio
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Based on posted EWC trade alerts, this page shows the public trade record through
              closed-trade outcomes, portfolio equity, and benchmark context.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={buttonStyles({ size: "lg" })} href="/history">
                View closed trades
              </Link>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-muted-foreground">
                Closed trades only. No live entries, stops, or targets.
              </div>
            </div>
          </div>
          <Card className="bg-white/[0.03]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Public trade record
            </p>
            <p className="mt-4 text-base leading-7 text-foreground/92">
              The public view is intentionally focused. It shows closed-trade outcomes, model equity,
              and benchmark context while keeping live signal detail reserved for future protected products.
            </p>
          </Card>
        </div>
        {data.previewMode ? (
          <div className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground">
            Preview mode active. Public pages are rendering local sample data.
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent="info"
          label="Starting Model Capital"
          note="Public model baseline"
          value={formatCurrency(data.settings.starting_capital)}
        />
        <StatCard
          accent="neutral"
          label="Current Model Equity"
          note="Latest recorded equity"
          value={formatCurrency(data.stats.currentEquity)}
        />
        <StatCard
          accent={data.stats.ytdReturnPct >= 0 ? "positive" : "negative"}
          label="YTD Return"
          note={`${currentYear} model return`}
          value={formatPercent(data.stats.ytdReturnPct)}
        />
        <StatCard
          accent={data.stats.spxComparison.relativePerformancePct >= 0 ? "positive" : "negative"}
          label={`Outperformance vs ${data.stats.spxComparison.label}`}
          note={`${data.stats.spxComparison.label} YTD Return ${formatPercent(data.stats.spxComparison.benchmarkReturnPct)}`}
          value={formatPercent(data.stats.spxComparison.relativePerformancePct)}
        />
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="space-y-1.5">
              <CardTitle>Equity curve</CardTitle>
              <CardDescription>
                Model equity based on closed trade outcomes and recorded portfolio snapshots.
              </CardDescription>
            </div>
          </CardHeader>
          <EquityCurve data={data.equityCurve} />
        </Card>
      </section>

      <section>
        <PerformanceSummary stats={data.stats} />
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="space-y-1.5">
              <CardTitle>Recent closed trades</CardTitle>
              <CardDescription>
                The latest realized signals in the public model record.
              </CardDescription>
            </div>
            <Link className={buttonStyles({ variant: "secondary", size: "sm" })} href="/history">
              View full history
            </Link>
          </CardHeader>
          <ClosedTradesTable compact trades={data.latestClosedTrades} />
        </Card>
      </section>

      <DisclaimerCard text={data.settings.disclaimer_text} />
    </div>
  );
}
