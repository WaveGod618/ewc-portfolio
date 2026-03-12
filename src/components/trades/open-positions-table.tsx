import Link from "next/link";

import { TradeNotesPreview } from "@/components/trades/trade-notes-preview";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { TradeRow } from "@/lib/types";

function DirectionBadge({ direction }: { direction: TradeRow["direction"] }) {
  return <Badge variant={direction === "long" ? "positive" : "negative"}>{direction}</Badge>;
}

function StatusBadge({ status }: { status: TradeRow["status"] }) {
  const variant =
    status === "open"
      ? "info"
      : status === "partial"
        ? "warning"
        : status === "cancelled"
          ? "default"
          : "negative";

  return <Badge variant={variant}>{status}</Badge>;
}

export function OpenPositionsTable({
  trades,
  compact = false,
  editHrefBase,
  closeHrefBase,
}: {
  trades: TradeRow[];
  compact?: boolean;
  editHrefBase?: string;
  closeHrefBase?: string;
}) {
  if (trades.length === 0) {
    return (
      <EmptyState
        title="No open positions"
        description="Open trade ideas will appear here once they are logged by the admin."
      />
    );
  }

  const visibleTrades = compact ? trades.slice(0, 4) : trades;

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {visibleTrades.map((trade) => (
          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4" key={trade.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold tracking-[0.08em] text-foreground">
                  {trade.ticker}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {trade.source_label}
                </p>
              </div>
              <DirectionBadge direction={trade.direction} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Entry</p>
                <p className="mt-0.5 text-foreground">{formatCurrency(trade.entry_price)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Stop</p>
                <p className="mt-0.5 text-foreground">{formatCurrency(trade.stop_price)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Target 1
                </p>
                <p className="mt-0.5 text-foreground">{formatCurrency(trade.target_1)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Opened
                </p>
                <p className="mt-0.5 text-foreground">{formatDate(trade.opened_at)}</p>
              </div>
            </div>
            <TradeNotesPreview
              className="mt-3 block text-sm leading-5 text-muted-foreground"
              compact
              notes={trade.notes}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={trade.status} />
              {editHrefBase ? (
                <>
                  <Link
                    className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300 transition hover:text-sky-200"
                    href={`${editHrefBase}${trade.id}`}
                  >
                    Edit
                  </Link>
                </>
              ) : null}
              {closeHrefBase ? (
                <>
                  <Link
                    className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300 transition hover:text-sky-200"
                    href={`${closeHrefBase}${trade.id}`}
                  >
                    Close
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-[1.4rem] border border-white/10 md:block">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <th className="px-3 py-3">Ticker</th>
              <th className="px-3 py-3">Direction</th>
              <th className="px-3 py-3 text-right">Entry</th>
              <th className="px-3 py-3 text-right">Stop</th>
              <th className="px-3 py-3 text-right">Targets</th>
              <th className="px-3 py-3">Opened</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Source</th>
              <th className="px-3 py-3">Chart</th>
              <th className="px-3 py-3">Notes</th>
              {editHrefBase || closeHrefBase ? <th className="px-3 py-3">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.03] text-sm">
            {visibleTrades.map((trade) => (
              <tr className="align-top" key={trade.id}>
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
                  {formatCurrency(trade.stop_price)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  <div>{formatCurrency(trade.target_1)}</div>
                  <div>{formatCurrency(trade.target_2)}</div>
                  <div>{formatCurrency(trade.target_3)}</div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{formatDate(trade.opened_at)}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={trade.status} />
                </td>
                <td className="px-3 py-3 text-muted-foreground">{trade.source_label ?? "N/A"}</td>
                <td className="px-3 py-3">
                  {trade.chart_image_url ? (
                    <img
                      alt={`${trade.ticker} chart`}
                      className="h-11 w-16 rounded-xl border border-white/10 object-cover"
                      src={trade.chart_image_url}
                    />
                  ) : (
                    <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-dashed border-white/10 text-[10px] text-muted-foreground">
                      No chart
                    </div>
                  )}
                </td>
                <td className="max-w-[15rem] px-3 py-3 text-muted-foreground">
                  <TradeNotesPreview
                    className="text-sm leading-5 text-muted-foreground"
                    compact={compact}
                    notes={trade.notes}
                  />
                </td>
                {editHrefBase || closeHrefBase ? (
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      {editHrefBase ? (
                        <Link
                          className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300 transition hover:text-sky-200"
                          href={`${editHrefBase}${trade.id}`}
                        >
                          Edit
                        </Link>
                      ) : null}
                      {closeHrefBase ? (
                        <Link
                          className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300 transition hover:text-sky-200"
                          href={`${closeHrefBase}${trade.id}`}
                        >
                          Close
                        </Link>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
