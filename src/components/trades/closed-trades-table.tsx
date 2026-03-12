import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatCurrency,
  formatDate,
  formatOutcomeLabel,
  formatPercent,
  formatSignedNumber,
} from "@/lib/formatters";
import type { TradeRow } from "@/lib/types";
import { cn } from "@/lib/utils";

function DirectionBadge({ direction }: { direction: TradeRow["direction"] }) {
  return <Badge variant={direction === "long" ? "positive" : "negative"}>{direction}</Badge>;
}

function ResultValue({ value }: { value: number | null }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end text-sm font-medium",
        typeof value === "number" && value >= 0 ? "text-emerald-300" : "text-red-300",
      )}
    >
      {formatPercent(value)}
    </span>
  );
}

export function ClosedTradesTable({
  trades,
  compact = false,
}: {
  trades: TradeRow[];
  compact?: boolean;
}) {
  if (trades.length === 0) {
    return (
      <EmptyState
        title="No closed trades"
        description="Closed trades will populate here once results are logged from posted EWC signals."
      />
    );
  }

  const visibleTrades = compact ? trades.slice(0, 5) : trades;

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {visibleTrades.map((trade) => (
          <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.04] p-4" key={trade.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold tracking-[0.08em] text-foreground">
                  {trade.ticker}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {trade.source_label ?? "Closed signal"}
                </p>
              </div>
              <ResultValue value={trade.pnl_percent} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Entry</p>
                <p className="mt-0.5 text-foreground">{formatCurrency(trade.entry_price)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Exit</p>
                <p className="mt-0.5 text-foreground">{formatCurrency(trade.exit_price)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  R multiple
                </p>
                <p className="mt-0.5 text-foreground">{formatSignedNumber(trade.r_multiple)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Closed</p>
                <p className="mt-0.5 text-foreground">{formatDate(trade.closed_at)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <DirectionBadge direction={trade.direction} />
              <p className="text-xs font-medium tracking-[0.04em] text-muted-foreground">
                {formatOutcomeLabel(trade.outcome_label)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-[1.6rem] border border-white/10 md:block">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.04]">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <th className="px-3 py-3">Ticker</th>
              <th className="px-3 py-3">Direction</th>
              <th className="px-3 py-3 text-right">Entry</th>
              <th className="px-3 py-3 text-right">Exit</th>
              <th className="px-3 py-3 text-right">Result %</th>
              <th className="px-3 py-3 text-right">R Multiple</th>
              <th className="px-3 py-3">Outcome</th>
              <th className="px-3 py-3">Opened</th>
              <th className="px-3 py-3">Closed</th>
              <th className="px-3 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-transparent text-sm">
            {visibleTrades.map((trade) => (
              <tr className="align-top transition-colors hover:bg-white/[0.025]" key={trade.id}>
                <td className="px-3 py-3 font-semibold tracking-[0.08em] text-foreground">
                  {trade.ticker}
                </td>
                <td className="px-3 py-3">
                  <DirectionBadge direction={trade.direction} />
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {formatCurrency(trade.entry_price)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {formatCurrency(trade.exit_price)}
                </td>
                <td className="px-3 py-3 text-right">
                  <ResultValue value={trade.pnl_percent} />
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {formatSignedNumber(trade.r_multiple)}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {formatOutcomeLabel(trade.outcome_label)}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{formatDate(trade.opened_at)}</td>
                <td className="px-3 py-3 text-muted-foreground">{formatDate(trade.closed_at)}</td>
                <td className="px-3 py-3 text-muted-foreground">{trade.source_label ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
