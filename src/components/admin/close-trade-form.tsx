import { closeTradeAction } from "@/lib/actions";
import { FINAL_TRADE_STATUSES, OUTCOME_LABELS } from "@/lib/constants";
import { formatCurrency, formatDateTimeInput } from "@/lib/formatters";
import type { TradeRow } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

export function CloseTradeForm({
  trade,
  disabled,
}: {
  trade: TradeRow | null;
  disabled?: boolean;
}) {
  const labelClassName =
    "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

  if (!trade) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>Close a trade</CardTitle>
            <CardDescription>
              Select an open position from the admin table to log the final exit, outcome, and trade metrics.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-muted-foreground">
          Choose a live signal from the close-trade ledger to load its finalization form and
          automatically calculate long or short PnL metrics.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle>Close {trade.ticker}</CardTitle>
          <CardDescription>
            Entry {formatCurrency(trade.entry_price)} with stop at {formatCurrency(trade.stop_price)}.
          </CardDescription>
        </div>
      </CardHeader>
      <form action={closeTradeAction} className="space-y-4">
        <fieldset className="space-y-4" disabled={disabled}>
          <input name="id" type="hidden" value={trade.id} />
          <input name="redirect_section" type="hidden" value="close" />
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className={labelClassName}>Exit price</label>
              <Input min="0" name="exit_price" required step="0.0001" type="number" />
            </div>
            <div>
              <label className={labelClassName}>Closed at</label>
              <Input
                defaultValue={formatDateTimeInput(new Date().toISOString())}
                name="closed_at"
                required
                type="datetime-local"
              />
            </div>
            <div>
              <label className={labelClassName}>Final status</label>
              <Select defaultValue="closed" name="status">
                {FINAL_TRADE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Outcome label</label>
              <Select defaultValue="manual close" name="outcome_label">
                {OUTCOME_LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3.5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Direction-aware trade math
              </p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                PnL %, dollar PnL, and R multiple are calculated automatically for both longs and shorts.
              </p>
            </div>
          </div>
          <div>
            <label className={labelClassName}>Closing notes</label>
            <Textarea
              name="closing_notes"
              placeholder="Why the trade was closed, partial details, execution context, or rule notes."
            />
          </div>
        </fieldset>
        <SubmitButton disabled={disabled} pendingLabel="Closing trade...">
          Close trade
        </SubmitButton>
      </form>
    </Card>
  );
}
