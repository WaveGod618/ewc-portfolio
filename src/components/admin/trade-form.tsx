import { saveTradeAction } from "@/lib/actions";
import {
  ASSET_TYPES,
  EDITABLE_TRADE_STATUSES,
  SOURCE_LABELS,
  TRADE_DIRECTIONS,
} from "@/lib/constants";
import { formatDateTimeInput } from "@/lib/formatters";
import type { TradeRow } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { ChartUploadField } from "@/components/admin/chart-upload-field";

export function TradeForm({
  trade,
  disabled,
}: {
  trade: TradeRow | null;
  disabled?: boolean;
}) {
  const labelClassName =
    "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle>{trade ? `Edit ${trade.ticker}` : "New Signal Setup"}</CardTitle>
          <CardDescription>
            Record the posted signal, directional bias, risk, targets, and optional chart context.
          </CardDescription>
        </div>
      </CardHeader>
      <form action={saveTradeAction} className="space-y-4">
        <fieldset className="space-y-4" disabled={disabled}>
          <input name="id" type="hidden" value={trade?.id ?? ""} />
          <input
            name="redirect_section"
            type="hidden"
            value={trade ? "manage" : "new-trade"}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className={labelClassName}>Ticker</label>
              <Input defaultValue={trade?.ticker ?? ""} name="ticker" placeholder="TSLA" required />
            </div>
            <div>
              <label className={labelClassName}>Direction</label>
              <Select defaultValue={trade?.direction ?? "short"} name="direction">
                {TRADE_DIRECTIONS.map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className={labelClassName}>Asset type</label>
              <Select defaultValue={trade?.asset_type ?? "stock"} name="asset_type">
                {ASSET_TYPES.map((assetType) => (
                  <option key={assetType} value={assetType}>
                    {assetType}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className={labelClassName}>Status</label>
              <Select defaultValue={trade?.status ?? "open"} name="status">
                {EDITABLE_TRADE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label className={labelClassName}>Entry price</label>
              <Input
                defaultValue={trade?.entry_price ?? ""}
                min="0"
                name="entry_price"
                required
                step="0.0001"
                type="number"
              />
            </div>
            <div>
              <label className={labelClassName}>Stop price</label>
              <Input
                defaultValue={trade?.stop_price ?? ""}
                min="0"
                name="stop_price"
                required
                step="0.0001"
                type="number"
              />
            </div>
            <div>
              <label className={labelClassName}>Target 1</label>
              <Input defaultValue={trade?.target_1 ?? ""} min="0" name="target_1" step="0.0001" type="number" />
            </div>
            <div>
              <label className={labelClassName}>Target 2</label>
              <Input defaultValue={trade?.target_2 ?? ""} min="0" name="target_2" step="0.0001" type="number" />
            </div>
            <div>
              <label className={labelClassName}>Target 3</label>
              <Input defaultValue={trade?.target_3 ?? ""} min="0" name="target_3" step="0.0001" type="number" />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className={labelClassName}>Opened at</label>
              <Input
                defaultValue={formatDateTimeInput(trade?.opened_at)}
                name="opened_at"
                required
                type="datetime-local"
              />
            </div>
            <div>
              <label className={labelClassName}>Position size %</label>
              <Input
                defaultValue={trade?.position_size_pct ?? ""}
                max="100"
                min="0"
                name="position_size_pct"
                placeholder="Optional"
                step="0.01"
                type="number"
              />
            </div>
            <div>
              <label className={labelClassName}>Source label</label>
              <Select defaultValue={trade?.source_label ?? "Discord"} name="source_label">
                {SOURCE_LABELS.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Source link</label>
              <Input defaultValue={trade?.source_link ?? ""} name="source_link" placeholder="https://..." />
            </div>
            <ChartUploadField defaultValue={trade?.chart_image_url} disabled={disabled} />
          </div>
          <div>
            <label className={labelClassName}>Notes</label>
            <Textarea
              defaultValue={trade?.notes ?? ""}
              name="notes"
              placeholder="Signal context, structure, or execution notes."
            />
          </div>
        </fieldset>
        <SubmitButton
          disabled={disabled}
          pendingLabel={trade ? "Saving trade..." : "Creating trade..."}
        >
          {trade ? "Save trade" : "Create trade"}
        </SubmitButton>
      </form>
    </Card>
  );
}
