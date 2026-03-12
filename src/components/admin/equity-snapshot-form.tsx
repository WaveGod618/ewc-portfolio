import { createSnapshotAction } from "@/lib/actions";
import { formatDateTimeInput } from "@/lib/formatters";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function EquitySnapshotForm({ disabled }: { disabled?: boolean }) {
  const labelClassName =
    "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle>Manual Equity Snapshot</CardTitle>
          <CardDescription>
            Add a one-off equity value when you want the public curve to reflect a manual adjustment.
          </CardDescription>
        </div>
      </CardHeader>
      <form action={createSnapshotAction} className="space-y-3.5">
        <fieldset className="space-y-3.5" disabled={disabled}>
          <input name="redirect_section" type="hidden" value="snapshots" />
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Snapshot date</label>
              <Input
                defaultValue={formatDateTimeInput(new Date().toISOString())}
                name="snapshot_date"
                required
                type="datetime-local"
              />
            </div>
            <div>
              <label className={labelClassName}>Equity value</label>
              <Input min="0" name="equity_value" required step="0.01" type="number" />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Note</label>
            <Input name="note" placeholder="Optional note for the equity event" />
          </div>
        </fieldset>
        <SubmitButton disabled={disabled} pendingLabel="Adding snapshot...">
          Add snapshot
        </SubmitButton>
      </form>
    </Card>
  );
}
