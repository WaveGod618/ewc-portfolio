import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPublicModelData } from "@/lib/queries";

export const dynamic = "force-dynamic";

const rules = [
  "This is a hypothetical model portfolio built from posted EWC trade signals.",
  "Results do not represent actual brokerage accounts, client accounts, or verified third-party statements.",
  "Slippage, commissions, liquidity, spreads, and order execution may differ materially from any model result shown here.",
  "Long and short trade outcomes are tracked manually according to the direction and posted signal structure.",
  "Entries, stops, targets, exits, and equity snapshots are maintained for transparency and educational review.",
  "Position sizing may be simplified and some trades may only report percentage or R-based performance when dollar sizing is not available.",
];

export default async function RulesPage() {
  const data = await getPublicModelData();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-card/90 px-6 py-8 shadow-panel sm:px-8">
        <Badge variant="info">Rules & Disclaimer</Badge>
        <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Transparency rules
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          The EWC Model Portfolio is designed to communicate hypothetical signal performance clearly,
          without implying broker verification or actual account replication.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card>
          <h2 className="text-xl font-semibold text-foreground">How this model is tracked</h2>
          <div className="mt-6 grid gap-4">
            {rules.map((rule) => (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5" key={rule}>
                <p className="text-sm leading-7 text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-foreground">Current disclaimer</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {data.settings.disclaimer_text}
          </p>
        </Card>
      </div>
    </div>
  );
}
