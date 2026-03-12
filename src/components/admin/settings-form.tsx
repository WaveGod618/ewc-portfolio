import { updateSettingsAction } from "@/lib/actions";
import { DEFAULT_DISCLAIMER } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { SettingsRow } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({
  settings,
  disabled,
}: {
  settings: SettingsRow;
  disabled?: boolean;
}) {
  const labelClassName =
    "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle>Portfolio Settings</CardTitle>
          <CardDescription>
            Manage the public portfolio title, starting model capital, and disclaimer copy.
          </CardDescription>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-3.5 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Current capital
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {formatCurrency(settings.starting_capital)}
          </p>
        </div>
      </CardHeader>
      <form action={updateSettingsAction} className="space-y-3.5">
        <fieldset className="space-y-3.5" disabled={disabled}>
          <input name="id" type="hidden" value={settings.id} />
          <input name="redirect_section" type="hidden" value="settings" />
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Portfolio name</label>
              <Input defaultValue={settings.portfolio_name} name="portfolio_name" required />
            </div>
            <div>
              <label className={labelClassName}>Starting capital</label>
              <Input
                defaultValue={settings.starting_capital}
                min="0"
                name="starting_capital"
                required
                step="0.01"
                type="number"
              />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Disclaimer text</label>
            <Textarea
              defaultValue={settings.disclaimer_text || DEFAULT_DISCLAIMER}
              name="disclaimer_text"
              required
            />
          </div>
        </fieldset>
        <SubmitButton disabled={disabled} pendingLabel="Saving settings...">
          Save settings
        </SubmitButton>
      </form>
    </Card>
  );
}
