import { Card } from "@/components/ui/card";
import { formatPercent, formatSignedNumber } from "@/lib/formatters";
import type { PerformanceStats } from "@/lib/types";
import { cn } from "@/lib/utils";

function getTradeResultColor(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "text-foreground";
  }

  if (value > 0) {
    return "text-emerald-300";
  }

  if (value < 0) {
    return "text-red-300";
  }

  return "text-foreground";
}

export function PerformanceSummary({ stats }: { stats: PerformanceStats }) {
  return (
    <Card className="h-full">
      <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] xl:items-start">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Closed Trade Performance
          </p>
          <h2 className="font-heading mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.2rem]">
            Closed trade results
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Based on posted EWC trade alerts and their tracked closed-trade outcomes.
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="min-w-0 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Win rate
              </p>
              <p className="mt-2 min-w-0 whitespace-nowrap text-[clamp(2rem,3.2vw,2.9rem)] font-semibold leading-[0.92] tracking-[-0.055em] tabular-nums text-foreground">
                {formatPercent(stats.winRate)}
              </p>
            </div>
            <div className="min-w-0 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Total closed trades
              </p>
              <p className="mt-2 text-[clamp(1.9rem,3vw,2.55rem)] font-semibold leading-[0.92] tracking-[-0.045em] tabular-nums text-foreground">
                {stats.closedTrades}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="flex min-w-0 items-center justify-between gap-4 rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Best trade
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {stats.bestTrade?.ticker ?? "N/A"}
                </p>
              </div>
              <p className={cn("shrink-0 text-sm font-medium tabular-nums", getTradeResultColor(stats.bestTrade?.pnl_percent))}>
                {formatPercent(stats.bestTrade?.pnl_percent)}
              </p>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-4 rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Worst trade
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {stats.worstTrade?.ticker ?? "N/A"}
                </p>
              </div>
              <p className={cn("shrink-0 text-sm font-medium tabular-nums", getTradeResultColor(stats.worstTrade?.pnl_percent))}>
                {formatPercent(stats.worstTrade?.pnl_percent)}
              </p>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-4 rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 md:col-span-2 xl:col-span-1">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Avg R
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Average realized risk multiple
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                {formatSignedNumber(stats.averageR)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
